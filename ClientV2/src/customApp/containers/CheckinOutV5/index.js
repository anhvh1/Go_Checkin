import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { MainWrapper } from "./style";
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Statistic,
  Button,
  List,
  Space,
  Spin,
  message,
  Modal,
} from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, CreditCardOutlined, UserAddOutlined, UserDeleteOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import Webcam from "react-webcam";
// Ảnh mẫu (đã có sẵn trong repo)
import * as faceapi from "face-api.js";
import user1 from "../../../image/user1.png";
import user2 from "../../../image/user2.png";
import user3 from "../../../image/user3.png";
import defaultAvatar from "../../../image/defaultAvatar.jpeg";
import User from "../../../image/user.jpg";
import setting from "../../../settings/index";
import api from "./config";
import axios from "axios";
const { Title, Text } = Typography;
const TYPE = {
  ERROR: 1,
  SUCCESS: 2,
};
const STATE_SCAN = {
  ERROR: 1,
  SUCCESS: 2,
};
export default function CheckinOutV5() {
  const [animateId, setAnimateId] = useState(null);
  const socketRef = useRef();
  const [listCheckin, setListCheckin] = useState([]);
  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [loadingDataScan, setLoadingDataScan] = useState(false);
  const [currentCheckin, setCurrentCheckin] = useState({});
  const [filterData, setFilterData] = useState({
    PageNumber: 1,
    PageSize: 10,
    TotalRow: null,
  });
  const [isLoadedModel, setIsLoadedModel] = useState(false);
  const [videoInput, setVideoInput] = useState([]);
  const [indexCamera, setIndexCamera] = useState(0);
  const [StateScan, setStateScan] = useState(0);
  const [isCallingApi, setIsCallingApi] = useState(false)
  const [delayCC, setdelayCC] = useState(0);
  const [totalCheckInOut, setTotalCheckinOut] = useState({
    checkIn: 0,
    checkOut: 0,
  });
  const [statusRes, setStatusRes] = useState({
    message: "Quý khách vui lòng quét thẻ căn cước để thực hiện checkin",
    type: TYPE.ERROR, //1 = error, 2 = success
    Score : null,
  });
  const listCheckinRef = useRef(listCheckin);
  const currentRefCheckin = useRef(null)
  const filterDataRef = useRef(filterData);
  const webcamRef = useRef();
  const canvasRef = useRef();
  const refCallingApi = useRef(isCallingApi)
  const delayDetectFace = useRef(delayCC)
  const scoreCompareFace = 60
  let videoCapture = null;
  let delayChamCong = null;

  useEffect(() => {
    listCheckinRef.current = listCheckin;
  }, [listCheckin]);
  
   useEffect(() => {
    delayDetectFace.current = delayCC;
  }, [delayCC]);

   useEffect(() => {
    refCallingApi.current = isCallingApi;
  }, [isCallingApi]);

  useEffect(() => {
    filterDataRef.current = filterData;
  }, [filterData]);

  useEffect(async () => {
    const container = document.getElementsByClassName("customer-list");
    container[0] && container[0].addEventListener("scroll", ScrollContainer);
    GetListCheckin(filterData);
    handleConnectSocketScan();

    delayChamCong = setInterval(() => {
      if (delayCC > 0) {
        delayCC--;
      }
      setdelayCC(delayCC);
    }, 1000);

    const MODEL_URL = process.env.PUBLIC_URL + "/model";
    console.log('start load model')
    await Promise.all([
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      // await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      // await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    ]).then(() => {
      setIsLoadedModel(true);
      console.log("done loaded models");
    }).catch(err => {
      console.log(err,'err')
    })

    // loadModels()

    // const MODEL_URL = process.env.PUBLIC_URL + "/model";
    // await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    // await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    // await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    getTotalCheckInOut();
    return () => {
      clearInterval(videoCapture);
      clearInterval(delayChamCong);
    };
  }, []);

  // Xóa cờ hiệu ứng sau khi chạy xong
  useEffect(() => {
    if (!animateId) return;
    const timer = setTimeout(() => setAnimateId(null), 800);
    return () => clearTimeout(timer);
  }, [animateId]);

  const getTotalCheckInOut = () => {
    api
      .TongHopNgay()
      .then((res) => {
        if (res.data.Status > 0) {
          const data = res.data.Data;
          setTotalCheckinOut({
            checkIn: data.Tong,
            checkOut: data.DaVe,
          });
        } else {
          message.destroy();
          message.warning(res.data.Message);
        }
      })
      .catch((err) => {
        message.destroy();
        message.warning(err.toString());
      });
  };

  const isJsonString = (str) => {
    try {
      const parsed = JSON.parse(str);
      // JSON.parse chỉ parse thành công nếu là JSON thật sự (object, array, number, etc.)
      return typeof parsed === "object" && parsed !== null;
    } catch (e) {
      return false;
    }
  };

 

  const handleConnectSocketScan = () => {
    const socket = new WebSocket(`ws://localhost:${setting.socketPort}`);
    socketRef.current = socket;
    console.log("start connect websocket");
    // Khi mở kết nối
    socket.onopen = () => {
      console.log("socket connected port ");
      // console.log(`✅ Đã kết nối tới ws://localhost:${setting.socketPort}`);
      // Gửi thử 1 message lên server (nếu cần)
      // socket.send("Hello Server");
    };

    // Khi nhận dữ liệu từ server
    socketRef.current.onmessage = (event) => {
      const data = isJsonString(event.data) ? JSON.parse(event.data) : {};
      if (data.EventName === "READ") {
        setLoadingDataScan(true);
      }

      if (data.NewState === "EMPTY") {
        console.log('set empty')
        setCurrentCheckin({});
        currentRefCheckin.current = null
        setStatusRes({
          message: "Quý khách vui lòng quét thẻ căn cước để thực hiện checkin",
          type: TYPE.ERROR, //1 = error, 2 = success
          Score : null,
        });
        setStateScan(null)
      }

      if (data.EventName === "CARD_RESULT") {
        setLoadingDataScan(false);
        const checkinAt = Date.now();
        const dataReaded = {
          HoVaTen: data.PersonalInfo.personName,
          GioiTinh: data.PersonalInfo.gender,
          SoCMND: data.PersonalInfo.idCode,
          LoaiGiayTo: "CCCD",
          HoKhau: data.PersonalInfo.residencePlace,
          imageChanDung: data.ChipFace,
          NgayCapCMND: data.PersonalInfo.issueDate,
          NgaySinh: data.PersonalInfo.dateOfBirth,
          checkinAt,
          LyDoGap: 1,
        };
        setStatusRes({
          message: "",
          type: null, //1 = error, 2 = success
          Score: null,
        });
        setStateScan(null)
        console.log('set success')
        setCurrentCheckin(dataReaded);
        currentRefCheckin.current = dataReaded
        // CheckIn(dataReaded);
      }
      if (data.Status === "FAILURE") {
        // changeLoadingDataScan(false);
        setLoadingDataScan(false);
        // message.destroy();
        setStatusRes({
          message:
            "Xảy ra lỗi trong quá trình đọc thông tin thẻ căn cước, vui lòng thử lại!",
          type: TYPE.ERROR,
          Score: null,
        });
        setStateScan(null)
        // message.warning("Xảy ra lỗi trong quá trình đọc thông tin CCCD");
      }
    };

    // Khi có lỗi
    socketRef.current.onerror = (error) => {
      setLoadingDataScan(false);
      console.log("❌ Lỗi: " + error);
    };

    // Khi kết nối đóng
    socketRef.current.onclose = (event) => {
      setLoadingDataScan(false);
      logEventErrorSocket(event);
      console.log("🔌 Kết nối đã đóng");
    };
  };

  const ScrollContainer = (e) => {
    const container = e.target;
    const isBottom =
      container.scrollTop === container.scrollHeight - container.clientHeight;

    if (isBottom) {
      let newFilterData = { ...filterDataRef.current };

      if (listCheckinRef.current.length < filterDataRef.current.TotalRow) {
        newFilterData.PageNumber = filterDataRef.current.PageNumber + 1;
        setFilterData(newFilterData);
        GetListCheckin({
          ...newFilterData,
          PageNumber: newFilterData.PageNumber,
        });
      }
    }
  };

  const GetListCheckin = (filterData) => {
    setLoadingCheckIn(true);
    api
      .GetList({
        PageSize: filterData.PageSize,
        PageNumber: filterData.PageNumber,
      })
      .then((response) => {
        setLoadingCheckIn(false);
        if (response.data.Status > 0) {
          let newListCheckin = [...listCheckinRef.current];
         
          if (filterData.PageNumber === 1) {
            //Case mới load page
            newListCheckin = response.data.Data;
          } else {
            //Case load thêm
            response.data.Data.forEach((item) => newListCheckin.push(item));
          }
          const TotalRow = response.data.TotalRow;
          setListCheckin(newListCheckin);
          setFilterData((prevFilter) => ({ ...prevFilter, TotalRow }));
        }
      })
      .catch((err) => {
        setLoadingCheckIn(false);
        message.destroy();
        console.log("error notification");
        message.warning(err.toString());
      });
  };

  const CheckIn = (currentCheckin,score) => {
    const param = { ...currentCheckin };
    param.NgaySinh =
      param.NgaySinh !== ""
        ? moment(param.NgaySinh, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
    param.NgayCapCMND =
      param.NgayCapCMND !== "" && param.NgayCapCMND
        ? moment(param.NgayCapCMND, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
    param.AnhChanDungBase64 = param.imageChanDung;
    console.log(param.LyDoGap, "param.LyDoGap", currentCheckin);
    delete param.GioVao;
    if (param.LyDoGap === undefined) {
      message.destroy();
      message.warning("Chưa chọn lý do vào cơ quan");
      return;
    } else {
      if (param.LyDoGap === 2) {
        if (param.GapCanBo === undefined) {
          message.destroy();
          message.warning("Chưa chọn đối tượng gặp");
          return;
        } else {
          const arr = param.GapCanBo.split("_");
          param.GapCanBo = arr[0];
          param.DonViCaNhan = arr[1];
        }
      } else {
        param.GapCanBo = 0;
        param.DonViCaNhan = 0;
      }
    }
   
    api
      .Checkinv4(param)
      .then((response) => {
        if (response.data.Status > 0) {
          setLoadingDataScan(false);
          // message.destroy();
          // message.success("Checkin thành công");
          setStatusRes({
            message: "Checkin thành công!",
            type: TYPE.SUCCESS,
            Score: score,
          });
         refCallingApi.current = false;
          setIsCallingApi(false)
          getTotalCheckInOut();
          setFilterData((prevFilter) => ({ ...prevFilter, PageNumber: 1 }));
          GetListCheckin({
            ...filterData,
            PageNumber: 1,
          });
        } else {
         refCallingApi.current = false;
         setIsCallingApi(false)
          setLoadingDataScan(false);
          // message.destroy();
          // message.error(response.data.Message);
          setStatusRes({
            message: response.data.Message,
            type: TYPE.ERROR,
            Score: score,
          });
        }
      })
      .catch((error) => {
        console.log("error checkin");
        setLoadingDataScan(false);
        message.destroy();
        message.error(error.toString());
       refCallingApi.current = false;
        setIsCallingApi(false)
      });
  };

  const logEventErrorSocket = (event) => {
    let reason = "";
    if (event.code == 1000)
      reason =
        "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
    else if (event.code == 1001)
      reason =
        'An endpoint is "going away", such as a server going down or a browser having navigated away from a page.';
    else if (event.code == 1002)
      reason =
        "An endpoint is terminating the connection due to a protocol error";
    else if (event.code == 1003)
      reason =
        "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
    else if (event.code == 1004)
      reason = "Reserved. The specific meaning might be defined in the future.";
    else if (event.code == 1005)
      reason = "No status code was actually present.";
    else if (event.code == 1006)
      reason =
        "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
    else if (event.code == 1007)
      reason =
        "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).";
    else if (event.code == 1008)
      reason =
        'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.';
    else if (event.code == 1009)
      reason =
        "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
    else if (event.code == 1010)
      // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
      reason =
        "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " +
        event.reason;
    else if (event.code == 1011)
      reason =
        "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
    else if (event.code == 1015)
      reason =
        "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
    else reason = "Unknown reason";
    console.log(reason);
    return reason;
  };

  const handleRetryDelay = () => {
    setdelayCC(1); // chỉ dùng như flag
    console.log('delay detech face')
    setTimeout(() => {
      setdelayCC(0);
    }, 5000); // 2s mới cho phép gọi lại
  };

  const handleCompareFace = async (img,currentCheckin) => {
    setLoadingDataScan(true);
    setCurrentCheckin({ ...currentRefCheckin.current, FaceImg: img });
    refCallingApi.current = true;
    setIsCallingApi(true)
    api
      .CompareFace({
        AnhCCCD: currentCheckin.imageChanDung,
        AnhChanDung: img,
      })
      .then((res) => {
        if (res.data.Score > scoreCompareFace) {
          setStateScan(STATE_SCAN.SUCCESS)
          CheckIn(currentCheckin,res.data.Score);
        } else {
          console.log('set compare face fail')
          handleRetryDelay()
          setCurrentCheckin({ ...currentRefCheckin.current, FaceImg: "" });
          setStateScan(STATE_SCAN.ERROR)
          setLoadingDataScan(false);
         refCallingApi.current = false;
          setIsCallingApi(false)
          setStatusRes({
            message: res.data.Status,
            type: TYPE.ERROR,
            Score: res.data.Score
          });
          setLoadingCheckIn(false);
        }
      })
      .catch((err) => {
        handleRetryDelay()
        refCallingApi.current = false;
        setIsCallingApi(false)
        setLoadingDataScan(false);
      });
  };

  const checkBeforeSend = async (currentCheckin) => {
    if (!webcamRef.current) {
      console.warn("Webcam chưa sẵn sàng");
      return;
    }
    const base64Img = webcamRef.current.getScreenshot();
    console.log(base64Img, "base64Img");

    if (base64Img && !refCallingApi.current) {
      setLoadingCheckIn(true);
      handleCompareFace(base64Img,currentCheckin);
    }
  };

  // const handlePlay = () => {
  //   const video = webcamRef.current?.video;

  //   console.log(video, "video");
  //   if (!video) return; // video chưa sẵn sàng
  // };

  const handlePlay = () => {
    console.log("handle play camera", currentCheckin);
    clearInterval(videoCapture);

    if (!isLoadedModel) {
      console.log("models chưa load được");
      return "";
    }

    if (!canvasRef.current) {
      return "";
    }

    videoCapture = setInterval(async () => {
      // console.log(DanhSachPhamViSelected, "DanhSachPhamViSelected");
      // if (DanhSachPhamViSelected.length === 0) {
      //   return;
      // }
      const videoSource = document.getElementById("capture-camera");
    
      if (videoSource && faceapi?.createCanvasFromMedia && canvasRef.current) {
        // canvasRef.current.innerHTML =
        //   faceapi.createCanvasFromMedia(videoSource);
        const displaySize = {
          width: 240,
          height: 240,
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        const detection = await faceapi.detectAllFaces(
          videoSource,
          new faceapi.TinyFaceDetectorOptions()
        );

        // const resizedDetection = faceapi.resizeResults(detection, displaySize);

        // canvasRef &&
        //   canvasRef.current &&
        //   canvasRef.current
        //     .getContext("2d")
        //     .clearRect(0, 0, videoSource.width, videoSource.height);
        // faceapi.draw.drawDetections(canvasRef.current, resizedDetection);
        // console.log(detection, "detection checkin", delayCC, "delayCC");
        if (detection.length  && !refCallingApi.current) {
          if (delayDetectFace.current === 0) {
            console.log('try calling api ',delayDetectFace.current)
            checkBeforeSend(currentCheckin);
          }
        }
      }
    }, 1000);
  };

  let deviceCamera = videoInput.length ? videoInput[indexCamera] : null;
  const resolutionOfDiv = {
    width: 240,
    height: 240,
  };
  const cameraContentScan = (
    <div className={"camera-container"} style={{ ...resolutionOfDiv }}>
      <Webcam
        audio={false}
        id={"capture-camera"}
        ref={!currentCheckin.FaceImg ? webcamRef : null}
        screenshotQuality={0.7}
        onUserMedia={handlePlay}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          deviceId: deviceCamera ? deviceCamera.deviceId : "",
          ...resolutionOfDiv,
        }}
        style={{
          width: "240px",
          height: "240px",
          objectFit: "cover", // tránh méo hình
        }}
      />
      <canvas id={"detect-canvas"} ref={canvasRef} />
      {/* <div className={`border-overlay ${StateScan === STATE_SCAN.ERROR ? "error-border" :
                     StateScan === STATE_SCAN.SUCCESS ? "success-border" : ""}`}></div> */}
    </div>
  );

  const shortenNumberString = (str) => {
    if (!str) return "";
    if (str.length <= 6) return str; // nếu chuỗi ngắn, không cần rút gọn
    return str.slice(0, 3) + "........." + str.slice(-3);
  };

  const COLOR_SUCCESS = "#fff";
  const COLOR_ERROR = "#fff";
  const checkResultScore = statusRes.Score >= 0 && typeof statusRes.Score === "number"
  return (
    <div>
      <MainWrapper>
        <div className="left-panel">
          <div className="left-panel__top">
            {loadingDataScan ? (
              <div className="spin-container">
                <Spin size="large" />
              </div>
            ) : null}

            <div className="greeting-title" style={{ color: COLOR_SUCCESS }}>
              Xin chào quý khách
            </div>
            <div className="greeting-body">
              {/* {currentCheckin.SoCMND ? ( */}
                <>
                  <div className="face-wrapper">
                    <div className="card">
                      <Avatar
                        size={240}
                        src={currentCheckin.imageChanDung}
                        className="greeting-avatar"
                      />
                      <p>Ảnh thẻ CCCD</p>
                    </div>
                    
                   <div className={`score ${statusRes.type === TYPE.ERROR ? "score-fail" 
                      : statusRes.type === TYPE.SUCCESS ? "score-success" : ""}`}>
                        <div className={checkResultScore  ? "score-circle" : ""}>
                          {checkResultScore ? statusRes.Score >= scoreCompareFace ? <CheckCircleOutlined /> : <CloseCircleOutlined/> : null}
                        </div>
                        <p style = {{color : statusRes.Score >= scoreCompareFace ? 'green' : 'black' }}>{checkResultScore ? statusRes.Score >= scoreCompareFace ? "Khớp" : "Không khớp" : ""}</p>
                      </div>
                    <div className="card-liveview">
                      {!currentCheckin.FaceImg && currentCheckin.SoCMND ? (
                      //    <Avatar
                      //   size={240}
                      //   src={currentCheckin.imageChanDung}
                      //   className="greeting-avatar"
                      // />
                        <div className={`screen-wrapper`}>{cameraContentScan}</div>
                      ) : (
                        <Avatar
                          size={240}
                          src={currentCheckin.FaceImg}
                          className="greeting-avatar"
                        />
                      )}
                      <p>Ảnh chụp</p>
                    </div>
                  </div>

                  <div className="face-info">
                    <div className="greeting-name">{currentCheckin.HoVaTen}</div>
                    <div className="greeting-cccd">
                    <CreditCardOutlined/> Thẻ căn cước: {currentCheckin.SoCMND ? shortenNumberString(currentCheckin.SoCMND) : "........."}
                    </div>
                    <div className="greeting-checkin">
                    <ClockCircleOutlined/> Giờ checkin: <span className="checkin-time">{currentCheckin.checkinAt ? moment(currentCheckin.checkinAt).format("HH:mm") : "........."}</span>
                    </div>
                    {statusRes.message ? (
                      <h1
                        className={`${statusRes.type === TYPE.ERROR
                              ? "error"
                              : ""} status-checkin`}
                        style={{
                          color:
                            statusRes.type === TYPE.ERROR
                              ? COLOR_ERROR
                              : COLOR_SUCCESS,
                        }}
                      >
                       {statusRes.type === TYPE.ERROR
                              ? <CloseCircleOutlined/>
                              : <CheckCircleOutlined/>}  
                        {statusRes.message}
                      </h1>
                    ) : null}
                  </div>
                </>
              {/* ) : ( */}
                {/* <>
                  {statusRes.message ? (
                    <h1
                    
                      className={`${statusRes.type === TYPE.ERROR
                              ? "error"
                              : ""} status-checkin`}
                      style={{
                        color:
                          statusRes.type === TYPE.ERROR
                            ? COLOR_ERROR
                            : COLOR_SUCCESS,
                        width : '60%'
                      }}
                    >
                      {statusRes.message}
                    </h1>
                  ) : null}
                </> */}
              {/* )} */}
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label"><UserAddOutlined className ="stat-label__icon"/> Tổng số đã checkin</span>
              <p className="stat-count">{totalCheckInOut.checkIn}</p>
              <UserAddOutlined className = "blur-icon"/>
            </div>
            <div className="stat-card">
              <span className="stat-label"><UserDeleteOutlined className ="stat-label__icon"/> Đã checkout</span>
             <p className="stat-count">{totalCheckInOut.checkOut}</p>
             <UserDeleteOutlined className = "blur-icon"/>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="list-title">Danh sách khách đã checkin</div>
          <div className={`customer-list ${listCheckin.length === 0 ? "customer-list__empty" : ""}`}>
            {listCheckin.length === 0 ? (
              <></>
              // <div className="empty-list">Chưa có khách nào checkin</div>
            ) : (
              listCheckin.map((item) => (
                <div className="customer-card" key={item.id}>
                  <img
                    src={
                      item.AnhChanDungBase64 !== ""
                        ? item.AnhChanDungBase64
                        : User
                    }
                    alt=""
                    className="customer-avatar"
                  />
                  <div className="customer-info">
                   <div className="info">
                      <div className="customer-name">{item.HoVaTen}</div>
                      <div className="customer-cccd">
                        {shortenNumberString(item.SoCMND)}
                      </div>
                      <div className="customer-checkin">
                        <ClockCircleOutlined/> {moment(item.GioVao).format("HH:mm ")}
                      </div>
                    </div>
                    <div className="status">
                      <p className="status-customer__checkin">Đã vào</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </MainWrapper>
    </div>
  );
}
