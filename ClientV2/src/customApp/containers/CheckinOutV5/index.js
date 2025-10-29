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
import { UserOutlined } from "@ant-design/icons";
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
  const [totalCheckin, setTotalCheckin] = useState(0);
  const [totalCheckout, setTotalCheckout] = useState(0);
  const [videoInput, setVideoInput] = useState([]);
  const [indexCamera, setIndexCamera] = useState(0);
  const [isLiveView, setIsLiveView] = useState(false);
  const [delayCC, setdelayCC] = useState(0);
  const listCheckinRef = useRef(listCheckin);
  const filterDataRef = useRef(filterData);
  const webcamRef = useRef();
  const canvasRef = useRef();
  let videoCapture = null;
  let delayChamCong = null;

  useEffect(() => {
    listCheckinRef.current = listCheckin;
  }, [listCheckin]);

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
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);

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
        setCurrentCheckin(dataReaded);
        // CheckIn(dataReaded);
      }
      if (data.Status === "FAILURE") {
        // changeLoadingDataScan(false);
        setLoadingDataScan(false);
        message.destroy();
        message.warning("Xảy ra lỗi trong quá trình đọc thông tin CCCD");
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
          console.log(
            filterData.PageNumber,
            "filterData.PageNumber when get list checkin",
            newListCheckin,
            "newListCheckin",
            listCheckinRef.current,
            "listCheckinRef.current"
          );
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

  const CheckIn = (currentCheckin) => {
    console.log("handle checkin");
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
    console.log("post checkin data");
    api
      .Checkinv4(param)
      .then((response) => {
        if (response.data.Status > 0) {
          setLoadingDataScan(false);
          Modal.success({
            title: "Thông báo",
            content: `Checkin thành công`,
            okText: "Đóng",
            onOk: () => {
              setFilterData((prevFilter) => ({ ...prevFilter, PageNumber: 1 }));
              GetListCheckin({
                ...filterData,
                PageNumber: 1,
              });
            },
          });
        } else {
          setLoadingDataScan(false);
          message.destroy();
          message.error(response.data.Message);
        }
      })
      .catch((error) => {
        console.log("error checkin");
        setLoadingDataScan(false);
        message.destroy();
        message.error(error.toString());
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

  const handleCompareFace = async (img) => {
    setCurrentCheckin({ ...currentCheckin, FaceImg: img });
    const response = await axios.post("http://localhost:8010/api/v4/compare", {
      AnhCCCD: currentCheckin.imageChanDung,
      AnhChanDung: img,
    });

    console.log("Response:", response.data);

    // api
    //   .CompareFace({
    //     AnhCCCD: currentCheckin.imageChanDung,
    //     AnhChanDung: img,
    //   })
    //   .then((res) => {
    //     if (res.data.Status > 0) {
    //       CheckIn(currentCheckin);
    //     } else {
    //       setLoadingCheckIn(false);
    //       message.destroy();
    //       message.warning(res.data.Message);
    //     }
    //   });
  };
  console.log(currentCheckin, "currentCheckin");
  const checkBeforeSend = async () => {
    if (!webcamRef.current) {
      console.warn("Webcam chưa sẵn sàng");
      return;
    }
    const base64Img = webcamRef.current.getScreenshot();
    console.log(base64Img, "base64Img");

    if (base64Img) {
      setLoadingCheckIn(true);
      handleCompareFace(base64Img);
    }
  };

  // const handlePlay = () => {
  //   const video = webcamRef.current?.video;

  //   console.log(video, "video");
  //   if (!video) return; // video chưa sẵn sàng
  // };

  const handlePlay = () => {
    console.log("handle play camera");
    clearInterval(videoCapture);

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
        canvasRef.current.innerHTML =
          faceapi.createCanvasFromMedia(videoSource);
        const displaySize = {
          width: videoSource.offsetWidth,
          height: videoSource.offsetHeight,
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        const detection = await faceapi.detectAllFaces(
          videoSource,
          new faceapi.TinyFaceDetectorOptions()
        );

        const resizedDetection = faceapi.resizeResults(detection, displaySize);

        canvasRef &&
          canvasRef.current &&
          canvasRef.current
            .getContext("2d")
            .clearRect(0, 0, videoSource.width, videoSource.height);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetection);
        console.log(detection, "detection checkin", delayCC, "delayCC");
        if (detection.length) {
          // if (delayCC === 0) {
          //   checkBeforeSend();
          // }
        }
      }
    }, 1000);
  };

  let deviceCamera = videoInput.length ? videoInput[indexCamera] : null;
  const cameraCapabilities =
    (deviceCamera && deviceCamera.getCapabilities()) || null;
  const resolution = {
    width:
      cameraCapabilities && cameraCapabilities.width
        ? cameraCapabilities.width.max
        : 800,
    height:
      cameraCapabilities && cameraCapabilities.height
        ? cameraCapabilities.height.max
        : 600,
  };
  const resolutionOfDiv = {
    width: 300,
    height: 300,
  };
  const cameraContentScan = (
    <div className={"camera-container"} style={{ ...resolutionOfDiv }}>
      <Webcam
        audio={false}
        id={"capture-camera"}
        ref={webcamRef}
        screenshotQuality={0.5}
        onUserMedia={handlePlay}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          deviceId: deviceCamera ? deviceCamera.deviceId : "",
          ...resolutionOfDiv,
        }}
      />
      <canvas id={"detect-canvas"} ref={canvasRef} />
    </div>
  );

  const shortenNumberString = (str) => {
    if (!str) return "";
    if (str.length <= 6) return str; // nếu chuỗi ngắn, không cần rút gọn
    return str.slice(0, 3) + "........." + str.slice(-3);
  };

  return (
    <div>
      {/* CSS nhỏ gọn + hiệu ứng */}
      {/* <div className="screen-wrapper">{cameraContentScan}</div> */}
      <MainWrapper>
        <div className="left-panel">
          {loadingDataScan ? (
            <div className="spin-container">
              <Spin size="large" />
            </div>
          ) : null}

          <div className="greeting-title">Xin chào quý khách</div>
          {currentCheckin.SoCMND ? (
            <>
              {!isLiveView ? (
                <div className="screen-wrapper">{cameraContentScan}</div>
              ) : (
                <Avatar
                  size={160}
                  src={currentCheckin.imageChanDung}
                  className="greeting-avatar"
                />
              )}
              <Button onClick={() => setIsLiveView(!isLiveView)}>
                ChangeLiveView
              </Button>
              <div className="greeting-name">{currentCheckin.HoVaTen}</div>
              <div className="greeting-cccd">
                CCCD: {shortenNumberString(currentCheckin.SoCMND)}
              </div>
              <div className="greeting-checkin">
                Giờ checkin: {moment(currentCheckin.checkinAt).format("HH:mm")}
              </div>
            </>
          ) : (
            <>
              <p className="greeting-prompt">
                Quý khách vui lòng quét CCCD để thực hiện checkin
              </p>
            </>
          )}

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label">Tổng số đã checkin</span>
              {totalCheckin}
            </div>
            <div className="stat-card">
              <span className="stat-label">Đã checkout</span>
              {totalCheckout}
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="list-title">Danh sách khách đã checkin</div>
          <div className="customer-list">
            {listCheckin.length === 0 ? (
              <div className="empty-list">Chưa có khách nào checkin</div>
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
                    <div className="customer-name">{item.HoVaTen}</div>
                    <div className="customer-cccd">
                      CCCD: {shortenNumberString(item.SoCMND)}
                    </div>
                    <div className="customer-checkin">
                      Giờ checkin: {moment(item.checkinAt).format("HH:mm ")}
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
