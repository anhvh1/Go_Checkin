import React, { Component } from "react";
import { connect } from "react-redux";
import actions from "../../redux/CheckinOut/actions";
import appActions from "../../../redux/app/actions";
import api from "./config";
import apiBaoCao from "../BaoCao/config";
import Constants from "../../../settings/constants";
import {
  Select,
  Option,
  DatePicker as DatePickerFormat,
  Button,
} from "../../../components/uielements/exportComponent";
import { Upload, message, Row, Col, Input, Modal, Spin, Tooltip } from "antd";
import { Form } from "antd";
import TreeSelect from "../../../components/uielements/treeSelect";
import moment from "moment";
import Webcam from "react-webcam";
import Wrapper from "./styled";
import PopoverCustom from "../CheckinOut/PopoverCustom";
import iconGo from "../../../image/logoGo.png";
import CardCheckin from "./card.checkin";
import Constants2 from "./constants";
import queryString from "query-string";
import imgCheckin from "../../../image/checkin.png";
import imgCheckout from "../../../image/checkout.png";
import imgMetting from "../../../image/meetting.png";
import { ModalBaoCao } from "./modalBaoCao";
import ModalHangDoi from "./ModalHangDoiCheckin";
import { store } from "../../../redux/store";
import Redirect from "react-router/Redirect";
import lodash from "lodash";
import { getConfigLocal, socketConnect } from "../../../helpers/utility";
import {
  AuditOutlined,
  CalendarOutlined,
  CameraOutlined,
  CloseOutlined,
  LoadingOutlined,
  RedoOutlined,
} from "@ant-design/icons";
// import * as faceapi from "face-api.js";

const { changeCurrent, setListTemperWait, getListTemperFromSite } = appActions;
const currentYear = new Date().getFullYear();

const { Item } = Form;
const { COL_COL_ITEM_LAYOUT_RIGHT } = Constants;
const { ITEM_LAYOUT_HALF, COL_ITEM_LAYOUT_HALF } = Constants2;

let today = new Date();

class CheckinOut extends Component {
  constructor(props) {
    super(props);
    document.title = "Checkin";
    this.interval = null;
    this.webcamRefChanDung = React.createRef();
    this.webcamRefTruoc = React.createRef();
    this.webcamRefSau = React.createRef();
    this.socket = null;
    this.socketIO = null;
    this.canvasRef = React.createRef();
    this.videoCapture = null;
    let filterData = queryString.parse(this.props.location.search);
    filterData.PageNumber = filterData.PageNumber ? filterData.PageNumber : 1;
    filterData.PageSize = 10;
    filterData.Keyword = filterData.Keyword ? filterData.Keyword : "";
    filterData.Type = 2;
    this.state = {
      imageCMTTruoc: "",
      imageCMTSau: "",
      imageChanDung: "",
      loadingTruoc: false,
      loadingSau: false,
      loadingChanDung: false,
      recognitionTruoc: false,
      recognitionSau: false,
      recognitionChanDung: false,
      today: today,
      dataCMT: {
        HoVaTen: "",
        NgaySinh: "",
        HoKhau: "",
        DienThoai: "",
        SoCMND: "",
        NoiCapCMND: "",
        NgayCapCMND: "",
        GapCanBo: undefined,
        MaThe: "",
        GioVao: "",
        TenCoQuan: "",
        GioiTinh: undefined,
        ThanNhiet: "",
        LoaiGiayTo: "",
        LyDoGap: undefined,
        LyDoKhac: "",
      },
      loading: false,
      isCheckOut: false, //Kiểm tra trạng thái hiện tại có phải là checkout hay không
      ThongTinVaoRaID: 0,
      checkCheckOut: false, //Kiểm tra đã checkout hay chưa
      isCheckIn: false,
      showCamera: true,
      visiblePopoverMaThe: false,
      visiblePopoverHoTen: false,
      visiblePopoverCMND: false,
      dataPopover: null,
      loadingSearchMaThe: false,
      loadingSearchHoTen: false,
      loadingSearchCMND: false,
      selectIndex: -1,
      //Camera
      videoInput: [],
      isScanFile: false,
      keyCamera: 0,
      //
      filterData: filterData,
      TotalRow: 0,
      ListCheckinLoaded: [],
      //
      filterBaoCao: {
        TuNgay: moment(),
        DenNgay: moment(),
        LeTanID: undefined,
        CanBoGapID: undefined,
      },
      ListBaoCao: [],
      showBaoCao: false,
      modalKey: 0,
      loadingBaoCao: false,
      //
      listTemper: [],
      temperUsing: {},
      visibleBadge: false,
      //
      listCheckin: [],
      visibleModalHangDoi: false,
      sessionCode: "",
      loadingDataScan: false,
      dataScan: {},
    };
  }

  changeLoadingDataScan = (loading) => {
    this.setState({ ...this.state, loadingDataScan: loading });
  };

  handleConnectSocketScan = () => {
    const socket = new WebSocket("ws://localhost:5431?key=123");
    console.log("start connect websocket");
    // Khi mở kết nối
    socket.onopen = () => {
      console.log("✅ Đã kết nối tới ws://localhost:5431");
      // Gửi thử 1 message lên server (nếu cần)
      // socket.send("Hello Server");
    };

    // Khi nhận dữ liệu từ server
    socket.onmessage = (event) => {
      this.changeLoadingDataScan(true);
      const data = JSON.parse(event.data);
      console.log(data.status === "ALL_STEP_DONE", data.status);
      if (data.status === "ALL_STEP_DONE") {
        console.log("📩 Data nhận được done: " + JSON.parse(event.data));
        console.log("link photo", data.cardObj.facePhoto);
        // this.changeLoadingDataScan(false);
        this.setState({
          loadingDataScan: false,
          dataCMT: {
            ...this.state.dataCMT,
            HoVaTen: data.cardObj.fullName,
            GioiTinh: data.cardObj.sex,
            SoCMND: data.cardObj.identityNumber,
            LoaiGiayTo: "CCCD",
            HoKhau: data.cardObj.placeOfResidence,
            SoCMND: data.cardObj.identityNumber,
          },
          // imageCMTTruoc: "data:image/jpeg;base64," + data.cardObj.sod,
          imageChanDung: "data:image/jpeg;base64," + data.faceObj.faceImage,
        });
      }
      //  else if (data.status === "FACE_CAPTURE_FAILURE") {
      //   this.changeLoadingDataScan(false);
      //   message.destroy();
      //   message.warning("Xảy ra lỗi trong quá trình quét thông tin từ CCCD");
      // }
      console.log("📩 Data nhận được: " + JSON.parse(event.data));
    };

    // Khi có lỗi
    socket.onerror = (error) => {
      this.changeLoadingDataScan(false);
      console.log("❌ Lỗi: " + error);
    };

    // Khi kết nối đóng
    socket.onclose = () => {
      this.changeLoadingDataScan(false);
      console.log("🔌 Kết nối đã đóng");
    };
  };

  //Get initData---------------------------------------------
  componentDidMount = async () => {
    this.handleConnectSocketScan();
    this.props.getInitData(this.state.filterData);
    this.interval = setInterval(() => {
      today = new Date();
      this.setState({ today });
    }, 1000);
    this.getCamera();
    //GetListCheckIn
    this.GetListCheckin();
    //EventListener
    const container = document.getElementsByClassName("card-container");
    container[0] &&
      container[0].addEventListener("scroll", this.ScrollContainer);
    //
    this.socket && this.socket.close();
    this.connect();
    //
    this.socketIO && this.socketIO.stop();
    this.socketIO = socketConnect();
    await this.socketIO.start();
    this.socketIO.on("scan", (data) => {
      this.setDataOnSocket(data);
    });
    // get list temper wait from app
    this.getListTemperFromTopBar();
    //
    const MODEL_URL = process.env.PUBLIC_URL + "/model";
    // await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    // await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    // await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.videoCapture);
    this.socket && this.socket.close();
    //
    this.socketIO && this.socketIO.stop();
    //
    const { listTemper } = this.state;
    if (listTemper.length) {
      this.props.getListTemperFromSite(listTemper);
    }
  }

  connect = () => {
    this.socket = new WebSocket("ws://localhost:8000");

    // websocket onopen event listener
    this.socket.onopen = () => {
      console.log("Socket temperate connected");
    };

    // websocket onclose event listener
    this.socket.onclose = (e) => {
      console.log("Socket temperate disconnected", e);
    };

    // websocket onerror event listener
    this.socket.onerror = (err) => {
      // message.destroy();
      // message.error(err.message);
      console.error(
        "Socket temperate encountered error: ",
        err,
        "Closing socket temperate"
      );

      this.socket.close();
    };

    this.socket.onmessage = (data) => {
      this.handleOnTemper(data);
    };
  };

  handleOnTemper = (data) => {
    try {
      const temper = JSON.parse(data.data);
      if (temper.status) {
        temper.timeDate = moment(temper.time, "YYYYMMDDHHmmss");
        temper.timeString = moment(temper.time, "YYYYMMDDHHmmss").format(
          "DD/MM/YYYY HH:mm:ss"
        );
        console.log(temper.timeString, temper);
        const { listTemper, temperUsing } = this.state;
        if (temperUsing.time) {
          listTemper.push(temper);
          this.setState({ listTemper });
        } else {
          this.selectTemper(temper);
        }
      } else {
        //Thông báo lỗi nếu socket trả về lỗi
        // message.destroy();
        // message.error(temper.detail);
      }
    } catch (e) {
      console.log(e);
    }
  };

  setDataOnSocket = (data) => {
    // console.log(data, 'from guest');
    const { dataCMT, listCheckin } = this.state;
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    const CoQuanSuDungPhanMem = user.CoQuanSuDungPhanMem;
    if (CoQuanSuDungPhanMem == data.coQuanSuDungPhanMem) {
      const dataScan = {
        ...dataCMT,
        HoVaTen: data.hoVaTen,
        SoCMND: data.soCMND,
        HoKhau: data.hoKhau,
        LoaiGiayTo: data.loaiGiayTo,
        GioiTinh: data.gioiTinh,
        sessionCode: data.sessionCode,
        CoQuanSuDungPhanMem: data.coQuanSuDungPhanMem,
        LyDoGap: data.lyDoGap,
        GapCanBo: `${data.gapCanBo}_${data.donViCaNhan}`,
        DienThoai: data.dienThoai,
        TenCoQuan: data.tenCoQuan,
      };
      if (dataCMT.HoVaTen !== "" || dataCMT.SoCMND !== "") {
        //cho vào hàng đợi
        listCheckin.push({
          ...dataScan,
          imageCMTTruoc: data.anhCMND_MTBase64,
          ThanNhiet: "",
        });
      } else {
        //điền form
        this.setState({
          dataCMT: dataScan,
          imageCMTTruoc: data.anhCMND_MTBase64,
        });
      }
    }
  };

  getListTemperFromTopBar = () => {
    const { app } = this.props;
    const { temperWait } = app;
    if (temperWait.length) {
      const temperUsing = temperWait[0];
      this.selectTemper(temperUsing);
      if (temperWait.length > 1) {
        const listTemper = temperWait.slice(1, temperWait.length);
        this.setState({ listTemper });
      }
      this.props.setListTemperWait(false);
    }
  };

  ScrollContainer = (e) => {
    const container = e.target;
    const isBottom =
      container.scrollTop === container.scrollHeight - container.clientHeight;
    if (isBottom) {
      let filterData = this.state.filterData;
      const { ListCheckinLoaded, TotalRow } = this.state;
      if (ListCheckinLoaded.length < TotalRow) {
        filterData.PageNumber += 1;
        // changeUrlFilter(filterData); //change url
        this.setState({ filterData }, () => this.GetListCheckin());
      }
    }
  };

  GetListCheckin = () => {
    let { filterData, ListCheckinLoaded, TotalRow } = this.state;
    api.GetList({ ...filterData }).then((response) => {
      if (response.data.Status > 0) {
        if (filterData.PageNumber === 1) {
          //Case mới load page
          ListCheckinLoaded = response.data.Data;
        } else {
          //Case load thêm
          response.data.Data.forEach((item) => ListCheckinLoaded.push(item));
        }
        TotalRow = response.data.TotalRow;
        this.setState({ ListCheckinLoaded, TotalRow });
      }
    });
  };

  onSearch = (value, property) => {
    let { filterData } = this.state;
    filterData[property] = value;
    filterData.PageNumber = 1;
    this.setState({ filterData, ListCheckinLoaded: [] }, () =>
      this.GetListCheckin()
    );
  };

  fillData = (data, type) => {
    const { dataCMT } = this.state;
    dataCMT.HoVaTen =
      data.name !== "N/A" ? data.name : type === 2 ? dataCMT.HoVaTen : "";
    dataCMT.NgaySinh =
      data.birthday !== "N/A"
        ? moment(data.birthday, "DD-MM-YYYY")
        : type === 2
        ? dataCMT.NgaySinh
        : "";
    dataCMT.HoKhau =
      data.address !== "N/A" ? data.address : type === 2 ? dataCMT.HoKhau : "";
    dataCMT.SoCMND =
      data.id !== "N/A" ? data.id : type === 2 ? dataCMT.SoCMND : "";
    dataCMT.NoiCapCMND =
      data.issue_by !== "N/A"
        ? data.issue_by
        : type === 1
        ? dataCMT.NoiCapCMND
        : "";
    dataCMT.NgayCapCMND =
      data.issue_date !== "N/A"
        ? moment(data.issue_date, "DD-MM-YYYY")
        : type === 1
        ? dataCMT.NgayCapCMND
        : "";
    dataCMT.GioiTinh =
      data.sex !== "N/A" ? data.sex : type === 2 ? dataCMT.GioiTinh : undefined;
    dataCMT.LoaiGiayTo =
      data.document !== "N/A"
        ? data.document
        : type === 2
        ? dataCMT.LoaiGiayTo
        : "";
    //type: 1 - Mặt trước 2 - Mặt sau
    if (type === 1) {
      if (data.name === "N/A" || data.id === "N/A") {
        message.destroy();
        message.warning("Ảnh CMND mặt trước không hợp lệ");
      }
    } else if (type === 2) {
      if (data.name !== "N/A" || data.id !== "N/A") {
        message.destroy();
        message.warning("Ảnh CMND mặt sau không hợp lệ");
      }
    }
    this.setState({ dataCMT });
  };

  inputNumber = (e) => {
    const key = e.charCode;
    if (key < 48 || key > 57) {
      e.preventDefault();
    }
  };

  CheckIn = () => {
    const param = { ...this.state.dataCMT };
    param.NgaySinh =
      param.NgaySinh !== ""
        ? moment(param.NgaySinh, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
    param.NgayCapCMND =
      param.NgayCapCMND !== ""
        ? moment(param.NgayCapCMND, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
    param.AnhChanDungBase64 = this.state.imageChanDung;
    param.AnhCMND_MTBase64 = this.state.imageCMTTruoc;
    param.AnhCMND_MSBase64 = this.state.imageCMTSau;
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
    // if (param.MaThe === "") {
    //   message.destroy();
    //   message.warning('Chưa nhập mã thẻ');
    //   return;
    // }
    this.setState({ loading: true });
    api
      .Checkinv4(param)
      .then((response) => {
        if (response.data.Status > 0) {
          const dataCMT = {
            HoVaTen: "",
            NgaySinh: "",
            HoKhau: "",
            DienThoai: "",
            SoCMND: "",
            NoiCapCMND: "",
            NgayCapCMND: "",
            GapCanBo: undefined,
            MaThe: "",
            LyDoGap: undefined,
          };
          Modal.success({
            title: "Thông báo",
            content: `Checkin thành công`,
            okText: "Đóng",
            onOk: () => {
              let { filterData } = this.state;
              filterData.PageNumber = 1;
              this.setState(
                {
                  dataCMT,
                  loading: false,
                  imageCMTTruoc: "",
                  imageCMTSau: "",
                  imageChanDung: "",
                  isCheckIn: false,
                  showCamera: true,
                  ListCheckinLoaded: [],
                  filterData,
                  temperUsing: {},
                },
                () => {
                  this.props.getList();
                  this.GetListCheckin();
                  // this.handlePlayChanDung();
                }
              );
            },
          });
          //
          const dataSocket = response.data.Data;
          if (this.socketIO.connectionState === "Connected") {
            this.socketIO.invoke("scan", {
              ...dataSocket,
              sessionCode: param.sessionCode,
            });
          }
        } else {
          this.setState({ loading: false });
          message.destroy();
          message.error(response.data.Message);
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        message.destroy();
        message.error(error.toString());
      });
  };

  CheckInv4 = () => {
    const param = { ...this.state.dataCMT };
    param.NgaySinh =
      param.NgaySinh !== ""
        ? moment(param.NgaySinh, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
    param.NgayCapCMND =
      param.NgayCapCMND !== ""
        ? moment(param.NgayCapCMND, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
    param.AnhChanDungBase64 = this.state.imageChanDung;
    param.AnhCMND_MTBase64 = this.state.imageCMTTruoc;
    param.AnhCMND_MSBase64 = this.state.imageCMTSau;
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
    this.setState({ loading: true });
    api
      .Checkinv4(param)
      .then((response) => {
        if (response.data.Status > 0) {
          message.destroy();
          message.success("Cán bộ checkin thành công");
          const dataCMT = {
            HoVaTen: "",
            NgaySinh: "",
            HoKhau: "",
            DienThoai: "",
            SoCMND: "",
            NoiCapCMND: "",
            NgayCapCMND: "",
            GapCanBo: undefined,
            MaThe: "",
            LyDoGap: undefined,
          };
          let { filterData } = this.state;
          filterData.PageNumber = 1;
          this.setState(
            {
              dataCMT,
              loading: false,
              imageCMTTruoc: "",
              imageCMTSau: "",
              imageChanDung: "",
              isCheckIn: false,
              showCamera: true,
              ListCheckinLoaded: [],
              filterData,
              temperUsing: {},
            },
            () => {
              this.props.getList();
              this.GetListCheckin();
              // this.handlePlayChanDung();
            }
          );
          //
          const dataSocket = response.data.Data;
          if (this.socketIO.connectionState === "Connected") {
            this.socketIO.invoke("scan", {
              ...dataSocket,
              sessionCode: param.sessionCode,
            });
          }
        } else {
          this.setState({ loading: false });
          message.destroy();
          message.error(response.data.Message);
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        message.destroy();
        message.error(error.toString());
      });
  };

  CheckOut = () => {
    const param = { ThongTinVaoRaID: this.state.dataCMT.ThongTinVaoRaID };
    this.setState({ loading: true });
    api
      .Checkoutv4(param)
      .then((response) => {
        if (response.data.Status > 0) {
          const dataCMT = {
            HoVaTen: "",
            NgaySinh: "",
            HoKhau: "",
            DienThoai: "",
            SoCMND: "",
            NoiCapCMND: "",
            NgayCapCMND: "",
            GapCanBo: undefined,
            MaThe: "",
            LyDoGap: undefined,
            ThongTinVaoRaID: 0,
          };
          Modal.success({
            title: "Thông báo",
            content: "Checkout thành công",
            okText: "Đóng",
            onOk: () => {
              let { filterData } = this.state;
              filterData.PageNumber = 1;
              this.setState(
                {
                  dataCMT,
                  loading: false,
                  imageCMTTruoc: "",
                  imageCMTSau: "",
                  imageChanDung: "",
                  isCheckOut: false,
                  showCamera: true,
                  ListCheckinLoaded: [],
                  filterData,
                },
                () => {
                  this.props.getList();
                  this.GetListCheckin();
                  // this.handlePlayChanDung();
                }
              );
            },
          });
        } else {
          this.setState({ loading: false });
          message.destroy();
          message.error(response.data.Message);
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        message.destroy();
        message.error(error.toString());
      });
  };

  CheckOutv4 = () => {
    const param = { ThongTinVaoRaID: this.state.dataCMT.ThongTinVaoRaID };
    this.setState({ loading: true });
    api
      .Checkoutv4(param)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.Status > 0) {
          if (response.data.Status !== 3) {
            message.destroy();
            message.success("Cán bộ checkout thành công");
          }
          const dataCMT = {
            HoVaTen: "",
            NgaySinh: "",
            HoKhau: "",
            DienThoai: "",
            SoCMND: "",
            NoiCapCMND: "",
            NgayCapCMND: "",
            GapCanBo: undefined,
            MaThe: "",
            LyDoGap: undefined,
            ThongTinVaoRaID: 0,
          };
          let { filterData } = this.state;
          filterData.PageNumber = 1;
          this.setState(
            {
              dataCMT,
              imageCMTTruoc: "",
              imageCMTSau: "",
              imageChanDung: "",
              isCheckOut: false,
              showCamera: true,
              ListCheckinLoaded: [],
              filterData,
            },
            () => {
              this.props.getList();
              this.GetListCheckin();
              // this.handlePlayChanDung();
            }
          );
        } else {
          this.setState({ loading: false });
          message.destroy();
          message.error(response.data.Message);
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        message.destroy();
        message.error(error.toString());
      });
  };

  callCheckOut = (e, ThongTinVaoRaID) => {
    e.stopPropagation();
    Modal.confirm({
      title: "Checkout",
      content: "Bạn có muốn checkout khách này không ?",
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        const param = { ThongTinVaoRaID };
        api
          .Checkout(param)
          .then((response) => {
            if (response.data.Status > 0) {
              const dataCMT = {
                HoVaTen: "",
                NgaySinh: "",
                HoKhau: "",
                DienThoai: "",
                SoCMND: "",
                NoiCapCMND: "",
                NgayCapCMND: "",
                GapCanBo: undefined,
                MaThe: "",
                LyDoGap: undefined,
              };
              Modal.success({
                title: "Thông báo",
                content: "Checkout thành công",
                okText: "Đóng",
                onOk: () => {
                  let { filterData } = this.state;
                  filterData.PageNumber = 1;
                  this.setState(
                    {
                      loading: false,
                      isCheckOut: false,
                      showCamera: true,
                      ListCheckinLoaded: [],
                      filterData,
                    },
                    () => {
                      this.props.getList();
                      this.GetListCheckin();
                    }
                  );
                },
              });
            } else {
              this.setState({ loading: false });
              message.destroy();
              message.error(response.data.Message);
            }
          })
          .catch((error) => {
            this.setState({ loading: false });
            message.destroy();
            message.error(error.toString());
          });
      },
    });
  };

  changeCanBo = (value) => {
    const { dataCMT } = this.state;
    dataCMT.GapCanBo = value;
    this.setState({ dataCMT });
  };

  scanFile = (type) => {
    const { videoInput } = this.state;
    if (type === 3) {
      const showCamera = !this.state.showCamera;
      if (!videoInput.length) {
        this.getCamera();
      }
      this.setState({ showCamera, imageChanDung: "" });
    } else if (type === 1) {
      const base64 = this.webcamRefTruoc.current.getScreenshot({
        width: 1200,
        height: 1000,
      });
      this.setState({
        imageCMTTruoc: base64,
        loadingTruoc: false,
        recognitionTruoc: true,
      });
      api
        .UploadImage({ image: base64 })
        .then((response) => {
          if (response.data.result_code === 200) {
            this.fillData(response.data, type);
            this.setState({
              recognitionTruoc: false,
            });
          } else if (response.data.result_code === 500) {
            this.setState({ recognitionTruoc: false });
            message.destroy();
            message.error("Ảnh CMND mặt trước không hợp lệ");
          } else {
            this.setState({ recognitionTruoc: false });
            message.destroy();
            message.error(response.data.result_message);
          }
        })
        .catch((error) => {
          this.setState({ recognitionTruoc: false });
          message.destroy();
          message.error(error.toString());
        });
    } else if (type === 2) {
      const base64 = this.webcamRefSau.current.getScreenshot({
        width: 1200,
        height: 1000,
      });
      this.setState({
        imageCMTSau: base64,
        loadingSau: false,
        recognitionSau: true,
      });
      api
        .UploadImage({ image: base64 })
        .then((response) => {
          if (response.data.result_code === 200) {
            this.fillData(response.data, type);
            this.setState({
              recognitionSau: false,
            });
          } else if (response.data.result_code === 500) {
            this.setState({ recognitionSau: false });
            message.destroy();
            message.error("Ảnh CMND mặt trước không hợp lệ");
          } else {
            this.setState({ recognitionSau: false });
            message.destroy();
            message.error(response.data.result_message);
          }
        })
        .catch((error) => {
          this.setState({ recognitionSau: false });
          message.destroy();
          message.error(error.toString());
        });
    } else {
      this.Scan(type);
    }
  };

  triggerUpload = () => {
    clearInterval(this.videoCapture);
    this.setState({ loadingChanDung: true });
    let imageChanDung = this.webcamRefChanDung.current.getScreenshot({
      width: 600,
      height: 500,
    });
    this.setState({ imageChanDung, showCamera: false, loadingChanDung: false });
    const { imageCMTTruoc, imageCMTSau } = this.state;
    if (imageCMTTruoc === "" && imageCMTSau === "") {
      //do nothing
    } else {
      const param = {
        image_cmt: imageCMTTruoc,
        image_cmt2: imageCMTSau,
        image_live: imageChanDung,
      };
      this.setState({ recognitionChanDung: true });
      api
        .Verification(param)
        .then((response) => {
          if (response.data.verify_result === 2) {
            this.setState({ isCheckIn: true, recognitionChanDung: false });
          } else {
            message.destroy();
            message.warning("Ảnh chân dung không khớp với ảnh chứng minh thư");
            this.setState({ isCheckIn: false, recognitionChanDung: false });
            this.scanFile(3);
          }
        })
        .catch((error) => {
          this.setState({ imageChanDung: "", recognitionChanDung: false });
          message.destroy();
          message.error(
            "Có lỗi xảy ra khi nhận diện khuôn mặt. Vui lòng thử lại"
          );
        });
    }
  };

  reload = () => {
    Modal.confirm({
      title: "Thông báo",
      content: "Bạn có muốn hủy tác vụ hiện tại không ?",
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        let { keyCamera } = this.state;
        keyCamera++;
        this.setState(
          {
            imageCMTTruoc: "",
            imageCMTSau: "",
            imageChanDung: "",
            loadingTruoc: false,
            loadingSau: false,
            loadingChanDung: false,
            recognitionTruoc: false,
            recognitionSau: false,
            recognitionChanDung: false,
            today: today,
            dataCMT: {
              HoVaTen: "",
              NgaySinh: "",
              HoKhau: "",
              DienThoai: "",
              SoCMND: "",
              NoiCapCMND: "",
              NgayCapCMND: "",
              GapCanBo: undefined,
              MaThe: "",
              GioVao: "",
              TenCoQuan: "",
              GioiTinh: undefined,
              ThanNhiet: "",
              LoaiGiayTo: "",
              LyDoGap: undefined,
              LyDoKhac: "",
            },
            loading: false,
            isCheckOut: false, //Kiểm tra trạng thái hiện tại có phải là checkout hay không
            ThongTinVaoRaID: "",
            checkCheckOut: false, //Kiểm tra đã checkout hay chưa
            isCheckIn: false,
            showCamera: true,
            visiblePopoverMaThe: false,
            visiblePopoverHoTen: false,
            visiblePopoverCMND: false,
            dataPopover: null,
            loadingSearchMaThe: false,
            loadingSearchHoTen: false,
            loadingSearchCMND: false,
            selectIndex: -1,
            //Camera
            videoInput: [],
            isScanFile: false,
            keyCamera,
            loadingBaoCao: false,
            //
            listTemper: [],
            temperUsing: {},
            visibleBadge: false,
            //
            listCheckin: [],
            visibleModalHangDoi: false,
            sessionCode: "",
          },
          () => {
            this.getCamera();
            this.props.getList();
            // this.handlePlayChanDung();
          }
        );
      },
    });
  };

  changeValueCMT = (properties, value) => {
    const { dataCMT } = this.state;
    if (properties === "HoVaTen") {
      value = value.toUpperCase();
    }
    dataCMT[properties] = value;
    this.setState({ dataCMT });
  };

  contentPopover = (data, type) => {
    const { selectIndex } = this.state;
    let element = "";
    let widthPopover = 400;
    if (type === 1) {
      element = document.getElementById("txtMaThe");
    } else if (type === 2) {
      element = document.getElementById("txtCMND");
    } else if (type === 3) {
      element = document.getElementById("txtHoTen");
    }
    widthPopover = element ? element.clientWidth : widthPopover;
    if (data) {
      return (
        <div>
          {data.map((item, index) => {
            const className =
              index % 2 !== 0
                ? index === selectIndex
                  ? "even-row"
                  : "odd-row"
                : index === selectIndex
                ? "even-row"
                : "";
            return (
              <div
                className={`hover-content ${className}`}
                style={{
                  width: widthPopover,
                  padding: index === 0 ? "5px 12px" : "10px 12px",
                }}
                onClick={() => this.loadDataCheckOut(item)}
              >
                <b>{item.HoVaTen}</b>
                <br />
                <i style={{ paddingLeft: 15 }}>{item.SoCMND}</i>
                <br />
                {item.TenCoQuan !== "" ? (
                  <i style={{ paddingLeft: 15 }}>{item.TenCoQuan}</i>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      );
    }
  };

  loadDataCheckOut = (data) => {
    clearInterval(this.videoCapture);
    const dataCMT = lodash.cloneDeep(data);
    dataCMT.NgaySinh = dataCMT.NgaySinh ? moment(dataCMT.NgaySinh) : "";
    dataCMT.NgayCapCMND = dataCMT.NgayCapCMND
      ? moment(dataCMT.NgayCapCMND)
      : "";
    dataCMT.GapCanBo = `${data.GapCanBo}_${data.DonViCaNhan}`;
    this.setState({
      selectIndex: -1,
      visiblePopoverMaThe: false,
      visiblePopoverCMND: false,
      visiblePopoverHoTen: false,
      isCheckOut: dataCMT.GioRa === null,
      dataCMT,
      checkCheckOut: dataCMT.GioRa !== null,
      imageCMTTruoc: dataCMT.AnhCMND_MTBase64 ? dataCMT.AnhCMND_MTBase64 : "",
      imageCMTSau: dataCMT.AnhCMND_MSBase64 ? dataCMT.AnhCMND_MSBase64 : "",
      imageChanDung: dataCMT.AnhChanDungBase64 ? dataCMT.AnhChanDungBase64 : "",
    });
  };

  getCamera = () => {
    if (navigator.getUserMedia) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoInput = devices.filter(
            (device) => device.kind === "videoinput"
          );
          if (videoInput.length) {
            this.setState({ videoInput });
          }
        })
        .catch((error) => {
          message.error(error.toString());
        });
    }
  };

  blurMaThe = (value, type) => {
    if (value === "") {
      return;
    }
    if (this.state.selectIndex >= 0) {
      return;
    }
    const { isCheckOut, checkCheckOut } = this.state;
    const param = { MaThe: value, LoaiCheckOut: type };
    if (type === 1) {
      this.setState({ loadingSearchMaThe: true });
    } else if (type === 2) {
      this.setState({ loadingSearchCMND: true });
    } else if (type === 3) {
      this.setState({ loadingSearchHoTen: true });
    }
    api
      .GetByMaThe(param)
      .then((response) => {
        if (type === 1) {
          this.setState({ loadingSearchMaThe: false });
        } else if (type === 2) {
          this.setState({ loadingSearchCMND: false });
        } else if (type === 3) {
          this.setState({ loadingSearchHoTen: false });
        }
        if (response.data.Status > 0) {
          // const {imageCMTTruoc, imageCMTSau} = this.state;
          // const dataCMT = response.data.Data;
          // if ((imageCMTTruoc !== "" || imageCMTSau !== "") && type === 1) {
          //   if (!isCheckOut && !checkCheckOut) {
          //     if (dataCMT.length > 0) {
          //       message.destroy();
          //       message.warning('Mã thẻ đã được sử dụng. Xin mời nhập lại mã thẻ khác');
          //       const dataCMTInput = this.state.dataCMT;
          //       dataCMTInput.MaThe = "";
          //       this.setState({dataCMT: dataCMTInput});
          //     }
          //   }
          // } else {
          const dataPopover = response.data.Data;
          if (dataPopover.length > 0) {
            this.setState({ dataPopover });
            if (type === 1) {
              this.setState({ visiblePopoverMaThe: true });
            } else if (type === 2) {
              this.setState({ visiblePopoverCMND: true });
            } else if (type === 3) {
              this.setState({ visiblePopoverHoTen: true });
            }
          }
          //}
        } else {
          // message.destroy();
          // message.info('Không có dữ liệu')
        }
      })
      .catch((error) => {
        message.destroy();
        message.error(error.toString());
      });
  };

  changeFilterBaoCao = (value, property) => {
    const { filterBaoCao } = this.state;
    if (property === "CanBoGapID" && value) {
      const arr = value.split("_");
      filterBaoCao.CanBoGapID = arr[0];
      filterBaoCao.DonViCaNhan = arr[1];
    } else {
      filterBaoCao[property] = value;
    }
    this.setState({ filterBaoCao });
  };

  TaoBaoCao = () => {
    const filterData = Object.assign({}, this.state.filterBaoCao);
    if (
      filterData.TuNgay === "" ||
      filterData.DenNgay === "" ||
      filterData.TuNgay === null ||
      filterData.DenNgay === null
    ) {
      message.destroy();
      message.warning("Chưa nhập kỳ báo cáo");
      return;
    }
    filterData.TuNgay = moment(filterData.TuNgay).format("YYYY-MM-DD");
    filterData.DenNgay = moment(filterData.DenNgay).format("YYYY-MM-DD");
    this.setState({ loadingBaoCao: true });
    apiBaoCao
      .TaoBaoCao(filterData)
      .then((response) => {
        this.setState({ loadingBaoCao: false });
        if (response.data.Status > 0) {
          if (!response.data.Data) {
            message.destroy();
            message.warning("Kỳ báo cáo hiện tại không có dữ liệu");
            this.setState({ ListBaoCao: [], showBaoCao: false });
            return;
          }
          let { modalKey } = this.state;
          modalKey++;
          this.setState({
            showBaoCao: true,
            ListBaoCao: response.data.Data,
            modalKey,
          });
        } else {
          message.destroy();
          message.error(response.data.Message);
        }
      })
      .catch((error) => {
        this.setState({ loadingBaoCao: false });
        message.destroy();
        message.error(error.toString());
      });
  };

  closeBaoCao = () => {
    this.setState({ showBaoCao: false });
  };

  clearImage = (type) => {
    let { imageCMTTruoc, imageCMTSau, imageChanDung, isCheckOut } = this.state;
    if (type === 1) {
      imageCMTTruoc = "";
    } else if (type === 2) {
      imageCMTSau = "";
    } else if (type === 3) {
      imageChanDung = "";
      // !isCheckOut && this.handlePlayChanDung();
    }
    this.setState({ imageCMTTruoc, imageCMTSau, imageChanDung });
  };

  selectIndex = (e) => {
    const {
      visiblePopoverMaThe,
      visiblePopoverCMND,
      visiblePopoverHoTen,
      dataPopover,
    } = this.state;
    let { selectIndex } = this.state;
    const keyCode = e.keyCode;
    if (visiblePopoverMaThe || visiblePopoverCMND || visiblePopoverHoTen) {
      if (keyCode === 40 && selectIndex < dataPopover.length - 1) {
        //Down
        selectIndex++;
      } else if (keyCode === 38) {
        //Up
        if (selectIndex > -1) {
          selectIndex--;
        }
      }
      if (keyCode === 27) {
        this.setState({
          visiblePopoverMaThe: false,
          visiblePopoverCMND: false,
          visiblePopoverHoTen: false,
        });
      }
      this.setState({ selectIndex });
    }
    if (selectIndex >= 0 && keyCode === 13) {
      this.loadDataCheckOut(dataPopover[selectIndex]);
    }
  };

  handleVisibleBadge = (visibleBadge) => {
    this.setState({ visibleBadge });
  };

  getContentBadge = () => {
    const { listTemper } = this.state;
    const element = document.getElementById("txtTemper");
    const widthPopover = element ? element.clientWidth + 30 : 300;
    return (
      <div className={"badge-container"}>
        {listTemper.map((item) => (
          <div
            className={"badge-item"}
            style={{ width: widthPopover }}
            onClick={() => this.selectTemper(item)}
          >
            Thời gian đo:{" "}
            {moment(item.time, "YYYYMMDDHHmmss").format("HH:mm:ss")} - Kết quả:{" "}
            {item.temperature} °C
          </div>
        ))}
      </div>
    );
  };

  selectTemper = (temper) => {
    const { listTemper } = this.state;
    const { thanNhiet } = this.props;
    const index = listTemper.findIndex((item) => item.time === temper.time);
    if (index >= 0) {
      listTemper.splice(index, 1);
      this.setState({ listTemper, visibleBadge: false });
    }
    this.setState({ temperUsing: temper });
    this.changeValueCMT("ThanNhiet", temper.temperature);
    if (parseFloat(temper.temperature) > parseFloat(thanNhiet)) {
      Modal.warn({
        title: "Cảnh báo",
        content: "Cảnh báo thân nhiệt cao !!!",
        okText: "Đóng",
      });
    }
  };

  changeVisiblePopoverMaThe = (visible) => {
    if (!visible) {
      this.setState({ visiblePopoverMaThe: visible, selectIndex: -1 });
    }
  };

  changeVisiblePopoverHoTen = (visible) => {
    if (!visible) {
      this.setState({ visiblePopoverHoTen: visible, selectIndex: -1 });
    }
  };

  changeVisiblePopoverCMND = (visible) => {
    if (!visible) {
      this.setState({ visiblePopoverCMND: visible, selectIndex: -1 });
    }
  };

  clearUsing = () => {
    this.setState({ temperUsing: {} });
    this.changeValueCMT("ThanNhiet", "");
  };

  openModalHangDoi = () => {
    let { modalKey } = this.state;
    modalKey++;
    this.setState({ visibleModalHangDoi: true, modalKey });
  };

  closeModalHangDoi = () => {
    this.setState({ visibleModalHangDoi: false });
  };

  chonHangDoiCheckin = (index) => {
    const { listCheckin, dataCMT } = this.state;
    const dataFromList = listCheckin[index];
    listCheckin.splice(index, 1);
    dataFromList.ThanNhiet = dataCMT.ThanNhiet ? dataCMT.ThanNhiet : "";
    this.setState({
      dataCMT: { ...dataCMT, ...dataFromList },
      imageCMTTruoc: dataFromList.imageCMTTruoc,
      listCheckin,
    });
    this.closeModalHangDoi();
  };

  xoaHangDoiCheckin = (index) => {
    const { listCheckin } = this.state;
    listCheckin.splice(index, 1);
    if (!listCheckin.length) {
      this.closeModalHangDoi();
    }
    this.setState({ listCheckin });
  };

  handlePlayChanDung = () => {
    clearInterval(this.videoCapture);
    this.videoCapture = setInterval(async () => {
      const videoSource = document.getElementById("camera-chan-dung");
      if (this.canvasRef.current && videoSource.readyState >= 1) {
        this.canvasRef.current.innerHTML =
          faceapi.createCanvasFromMedia(videoSource);
        const displaySize = {
          width: videoSource.offsetWidth,
          height: videoSource.offsetHeight,
        };
        faceapi.matchDimensions(this.canvasRef.current, displaySize);
        const detection = await faceapi.detectAllFaces(
          videoSource,
          new faceapi.TinyFaceDetectorOptions()
        );
        const resizedDetection = faceapi.resizeResults(detection, displaySize);

        this.canvasRef.current
          .getContext("2d")
          .clearRect(0, 0, videoSource.width, videoSource.height);
        faceapi.draw.drawDetections(this.canvasRef.current, resizedDetection);
        if (detection.length) {
          const AnhChanDungBase64 =
            this.webcamRefChanDung.current.getScreenshot({
              width: 600,
              height: 500,
            });
          api.NhanDien({ AnhChanDungBase64 }).then((response) => {
            const data = response && response.data;
            if (data.Status > 0) {
              if (data.Status == 3) {
                return;
              }
              if (data.Data && data.Data.CanBoID) {
                clearInterval(this.videoCapture);
                //Nhận diện thành công trong hệ thống
                const { Data } = data;
                this.loadDataFromNhanDien(Data);
              } else {
                //Không nhận diện được
              }
            } else {
              message.destroy();
              message.error(data.Message);
            }
          });
        }
      }
    }, 3000);
  };

  loadDataFromNhanDien = (data) => {
    const { dataCMT } = this.state;
    const { thanNhiet } = this.props;
    const dataNhanDien = { ...data };
    let isCheckOut = false;
    dataCMT.NgaySinh = dataNhanDien.NgaySinh
      ? moment(dataNhanDien.NgaySinh)
      : dataCMT.NgaySinh;
    dataCMT.NgayCapCMND = dataNhanDien.NgayCapCMND
      ? moment(dataNhanDien.NgayCapCMND)
      : dataCMT.NgayCapCMND;
    dataCMT.HoVaTen = dataNhanDien.HoVaTen
      ? dataNhanDien.HoVaTen
      : dataCMT.HoVaTen;
    dataCMT.GioiTinh = dataNhanDien.GioiTinh
      ? dataNhanDien.GioiTinh
      : dataCMT.GioiTinh;
    dataCMT.HoKhau = dataNhanDien.HoKhau ? dataNhanDien.HoKhau : dataCMT.HoKhau;
    dataCMT.DienThoai = dataNhanDien.DienThoai
      ? dataNhanDien.DienThoai
      : dataCMT.DienThoai;
    dataCMT.LoaiGiayTo = dataNhanDien.LoaiGiayTo
      ? dataNhanDien.LoaiGiayTo
      : dataCMT.LoaiGiayTo;
    dataCMT.TenCoQuan = dataNhanDien.TenCoQuan
      ? dataNhanDien.TenCoQuan
      : dataCMT.TenCoQuan;
    dataCMT.SoCMND = dataNhanDien.SoCMND ? dataNhanDien.SoCMND : dataCMT.SoCMND;
    dataCMT.LaCanBo = dataNhanDien.LaCanBo;
    dataCMT.CanBoID = dataNhanDien.CanBoID;
    if (dataNhanDien.LaCanBo) {
      dataCMT.LyDoGap = 1;
    }
    isCheckOut = !!dataNhanDien.ThongTinVaoRaID;
    this.setState(
      {
        isCheckOut,
        dataCMT,
        imageCMTTruoc: dataNhanDien.AnhCMND_MTBase64
          ? dataNhanDien.AnhCMND_MTBase64
          : "",
        imageCMTSau: dataNhanDien.AnhCMND_MSBase64
          ? dataNhanDien.AnhCMND_MSBase64
          : "",
        imageChanDung: dataNhanDien.AnhChanDungBase64
          ? dataNhanDien.AnhChanDungBase64
          : "",
      },
      () => {
        if (dataNhanDien.ThongTinVaoRaID) {
          dataCMT.GapCanBo = `${dataNhanDien.GapCanBo}_${dataNhanDien.DonViCaNhan}`;
          dataCMT.LyDoGap = dataNhanDien.LyDoGap;
          dataCMT.GioVao = dataNhanDien.GioVao;
          dataCMT.ThongTinVaoRaID = dataNhanDien.ThongTinVaoRaID;
          if (dataNhanDien.LaCanBo) {
            this.setState({ dataCMT }, () => {
              this.CheckOutv4();
            });
          }
        } else {
          //pending checkin ???
          if (dataNhanDien.LaCanBo) {
            if (
              dataCMT.ThanNhiet &&
              parseFloat(dataCMT.ThanNhiet) < parseFloat(thanNhiet)
            ) {
              //Checkin tự động
              this.CheckInv4();
            } else {
              this.CheckInv4();
            }
          }
        }
      }
    );
  };

  render() {
    const user_id = parseInt(localStorage.getItem("user_id"));
    const user = store.getState().Auth.user;
    if (user && user.NguoiDungID === 1) {
      //Là admin
      return <Redirect to={"co-quan-don-vi"} />;
    }
    //Props, state
    const { role, roleBaoCao, DanhSachLeTan, TongHopNgay, DoiTuongGap } =
      this.props;
    const {
      ListCheckinLoaded,
      ListBaoCao,
      filterBaoCao,
      showBaoCao,
      loadingBaoCao,
    } = this.state;
    const listRole = JSON.parse(localStorage.getItem("role"));
    const roleCheckin = listRole ? listRole["checkin-out"] : null;
    if (!roleCheckin || !roleCheckin.view === 0) {
      this.props.history.push("/dashboard");
    }
    const {
      imageCMTTruoc,
      imageCMTSau,
      imageChanDung,
      loadingTruoc,
      loadingSau,
      loadingChanDung,
      dataCMT,
      isCheckOut,
      loading,
      checkCheckOut,
      isCheckIn,
      recognitionTruoc,
      recognitionSau,
      recognitionChanDung,
      visiblePopoverMaThe,
      dataPopover,
      visiblePopoverHoTen,
      visiblePopoverCMND,
      loadingSearchMaThe,
      loadingSearchCMND,
      loadingSearchHoTen,
      loadingDataScan,
      videoInput,
      isScanFile,
      keyCamera,
    } = this.state;
    const {
      listTemper,
      temperUsing,
      visibleBadge,
      listCheckin,
      visibleModalHangDoi,
      modalKey,
    } = this.state;
    //Props dragger

    const valueGioVaoHS = moment(isCheckOut ? dataCMT.GioVao : today).format(
      "HH:mm"
    );
    const valueGioVaoDMY = moment(isCheckOut ? dataCMT.GioVao : today).format(
      "DD/MM/YYYY"
    );

    const valueGioRaHS =
      checkCheckOut || isCheckOut ? moment(dataCMT.GioRa).format("HH:mm") : "";
    const valueGioRaDMY =
      checkCheckOut || isCheckOut
        ? moment(dataCMT.GioRa).format("DD/MM/YYYY")
        : "";

    const videoConstraints = {
      width: 1200,
      height: 1000,
    };
    const deviceIDChanDung = videoInput.find((item) =>
      item.label.includes("USB CAM2")
    );
    const deviceIDScan = videoInput.find((item) => item.label.includes("S520"));
    const cameraContentChanDung = (
      <Webcam
        audio={false}
        id={"camera-chan-dung"}
        ref={this.webcamRefChanDung}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          ...videoConstraints,
          deviceId:
            deviceIDChanDung && deviceIDChanDung.deviceId
              ? deviceIDChanDung.deviceId
              : "",
        }}
        key={
          deviceIDChanDung && deviceIDChanDung.deviceId
            ? deviceIDChanDung.deviceId
            : ""
        }
        style={{ zoom: 0.15 }}
        // onUserMedia={this.handlePlayChanDung}
      />
    );

    const cameraContentScan = (
      <Webcam
        audio={false}
        ref={this.webcamRefTruoc}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          ...videoConstraints,
          deviceId:
            deviceIDScan && deviceIDScan.deviceId ? deviceIDScan.deviceId : "",
          // facingMode: {exact: 'environment'},
        }}
        style={{ zoom: 0.15 }}
        key={deviceIDScan && deviceIDScan.deviceId ? deviceIDScan.deviceId : ""}
      />
    );

    const contentCameraEmpty = isCheckOut ? (
      <AuditOutlined style={{ fontSize: 50, color: "#ccc" }} />
    ) : (
      ""
    );
    return (
      <Wrapper>
        <Row className="col-container">
          <Col
            xl={14}
            lg={12}
            md={12}
            sm={24}
            xs={24}
            className="col col-first"
          >
            <div className="box-container">
              <div className="box box-camera">
                <Row gutter={24}>
                  <Col xl={4} lg={0} />
                  <Col xl={8} lg={24}>
                    <div className={"camera-content"}>
                      <div className="content">
                        {loadingTruoc ? (
                          <LoadingOutlined />
                        ) : imageCMTTruoc !== "" ? (
                          <div className={"box-image"}>
                            {imageCMTTruoc !== "" && !isCheckOut ? (
                              <CloseOutlined
                                className={"close-ico"}
                                type={"close"}
                                onClick={() => this.clearImage(1)}
                              />
                            ) : (
                              ""
                            )}
                            <img
                              src={imageCMTTruoc}
                              alt="avatar"
                              style={{ maxHeight: 130 }}
                              id={"imgTruoc"}
                            />
                          </div>
                        ) : (
                          contentCameraEmpty
                        )}
                        <div
                          style={{
                            display:
                              imageCMTTruoc === "" && !isCheckOut
                                ? "block"
                                : "none",
                          }}
                        >
                          {cameraContentScan}
                        </div>
                      </div>
                      <div className="action">
                        <Button

                        // disabled = {true}
                        // disabled={videoInput.length === 0}
                        // onClick={() => this.scanFile(1)}
                        >
                          <CameraOutlined />
                          Ảnh giấy tờ
                        </Button>
                      </div>
                    </div>
                  </Col>
                  <Col xl={8} lg={24}>
                    <div className={"camera-content"}>
                      <div className="content">
                        {loadingChanDung ? (
                          <LoadingOutlined />
                        ) : imageChanDung !== "" ? (
                          <div className={"box-image"}>
                            <CloseOutlined
                              className={"close-ico"}
                              type={"close"}
                              onClick={() => this.clearImage(3)}
                            />
                            <img
                              src={imageChanDung}
                              alt="avatar"
                              style={{ maxHeight: 130 }}
                            />
                          </div>
                        ) : (
                          contentCameraEmpty
                        )}
                        {/* <div
                          className={"camera-canvas"}
                          style={{
                            display:
                              imageChanDung === "" && !isCheckOut
                                ? "flex"
                                : "none",
                          }}
                        >
                          {cameraContentChanDung}
                          <canvas
                            id={"detect-canvas"}
                            ref={this.canvasRef}
                            style={{ zoom: 0.15 }}
                          />
                        </div> */}
                      </div>
                      <div className="action">
                        <Button

                        // disabled={true}
                        // onClick={() => this.triggerUpload()}
                        >
                          <CameraOutlined />
                          Ảnh chân dung
                        </Button>
                      </div>
                    </div>
                  </Col>
                  <Col xl={4} lg={0} />
                </Row>
              </div>
              <div className={"box box-info"}>
                <div className="title">THÔNG TIN VÀO - RA</div>
                <Form>
                  <Row>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Item
                        label={"Giờ vào"}
                        {...ITEM_LAYOUT_HALF}
                        className={"datepicker"}
                      >
                        <Input
                          placeholder={""}
                          style={{ width: "30%", maxWidth: 100 }}
                          value={
                            isCheckIn ||
                            isCheckOut ||
                            checkCheckOut ||
                            (dataCMT.HoVaTen !== "" && dataCMT.SoCMND !== "")
                              ? valueGioVaoHS
                              : ""
                          }
                          disabled
                        />
                        <Input
                          placeholder={""}
                          style={{
                            width: "calc(70% - 20px)",
                            marginLeft: 20,
                            maxWidth: 180,
                          }}
                          value={
                            isCheckIn ||
                            isCheckOut ||
                            checkCheckOut ||
                            (dataCMT.HoVaTen !== "" && dataCMT.SoCMND !== "")
                              ? valueGioVaoDMY
                              : ""
                          }
                          disabled
                          suffix={<CalendarOutlined />}
                        />
                      </Item>
                    </Col>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Row>
                        <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>
                          <Item label={"Lý do gặp"} {...ITEM_LAYOUT_HALF}>
                            <Select
                              placeholder={"Chọn lý do gặp"}
                              noGetPopupContainer
                              value={dataCMT.LyDoGap}
                              onChange={(value) =>
                                this.changeValueCMT("LyDoGap", value)
                              }
                            >
                              <Option value={1}>Họp</Option>
                              <Option value={2}>Gặp cán bộ</Option>
                              <Option value={3}>Khác</Option>
                            </Select>
                          </Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Item
                        label={"Giờ ra"}
                        {...ITEM_LAYOUT_HALF}
                        className={"datepicker"}
                      >
                        <Input
                          placeholder={""}
                          style={{ width: "30%", maxWidth: 100 }}
                          value={
                            isCheckOut
                              ? moment(today).format("HH:mm")
                              : valueGioRaHS
                          }
                          disabled
                        />
                        <Input
                          placeholder={""}
                          style={{
                            width: "calc(70% - 20px)",
                            marginLeft: 20,
                            maxWidth: 180,
                          }}
                          value={
                            isCheckOut
                              ? moment(today).format("DD/MM/YYYY")
                              : valueGioRaDMY
                          }
                          disabled
                          suffix={<CalendarOutlined />}
                        />
                      </Item>
                    </Col>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Row>
                        <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>
                          <Item label={"Mã thẻ"} {...ITEM_LAYOUT_HALF}>
                            <PopoverCustom
                              content={this.contentPopover(dataPopover, 1)}
                              visible={visiblePopoverMaThe}
                              trigger={"click"}
                              onVisibleChange={this.changeVisiblePopoverMaThe}
                              placement={"bottomLeft"}
                            >
                              <Input.Search
                                style={{ width: "100%" }}
                                onSearch={(value) => this.blurMaThe(value, 1)}
                                maxLength={20}
                                value={dataCMT.MaThe}
                                placeholder={"Nhập mã thẻ"}
                                onChange={(value) =>
                                  this.changeValueCMT(
                                    "MaThe",
                                    value.target.value
                                  )
                                }
                                id={"txtMaThe"}
                                loading={loadingSearchMaThe}
                                onKeyDown={this.selectIndex}
                              />
                            </PopoverCustom>
                          </Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col {...COL_ITEM_LAYOUT_HALF} />
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Row>
                        <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>
                          {dataCMT.LyDoGap === 2 ? (
                            <Item label={"Đối tượng gặp"} {...ITEM_LAYOUT_HALF}>
                              <TreeSelect
                                noGetPopupContainer
                                dropdownStyle={{ maxHeight: 300 }}
                                value={dataCMT.GapCanBo}
                                showSearch
                                treeData={DoiTuongGap}
                                placeholder="Chọn đối tượng cần gặp"
                                allowClear
                                treeDefaultExpandAll
                                onChange={(value) => this.changeCanBo(value)}
                              />
                            </Item>
                          ) : (
                            ""
                          )}
                          {dataCMT.LyDoGap === 3 ? (
                            <Item label={"Nội dung"} {...ITEM_LAYOUT_HALF}>
                              <Input
                                value={dataCMT.LyDoKhac}
                                style={{ width: "100%" }}
                                onChange={(value) =>
                                  this.changeValueCMT(
                                    "LyDoKhac",
                                    value.target.value
                                  )
                                }
                              />
                            </Item>
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div className={"box box-info box-relative"}>
                <div className="title flex">
                  THÔNG TIN KHÁCH
                  {listCheckin.length ? (
                    <div
                      style={{ marginLeft: 10 }}
                      className={"sub-title queue-title"}
                      onClick={this.openModalHangDoi}
                    >
                      (Có {listCheckin.length} khách trong hàng đợi)
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {recognitionTruoc ||
                recognitionSau ||
                recognitionChanDung ||
                loadingDataScan ? (
                  <div className={"div-loading"}>
                    <div className={"spin"}>
                      <Spin />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <Form>
                  <Row>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Item
                        label={
                          <span>
                            Họ tên <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        {...ITEM_LAYOUT_HALF}
                      >
                        <PopoverCustom
                          content={this.contentPopover(dataPopover, 3)}
                          visible={visiblePopoverHoTen}
                          trigger={"click"}
                          onVisibleChange={this.changeVisiblePopoverHoTen}
                          placement={"bottomLeft"}
                        >
                          <Input.Search
                            style={{ width: "100%" }}
                            value={dataCMT.HoVaTen}
                            onChange={(value) =>
                              this.changeValueCMT("HoVaTen", value.target.value)
                            }
                            onSearch={(value) => this.blurMaThe(value, 3)}
                            id={"txtHoTen"}
                            loading={loadingSearchHoTen}
                            onKeyDown={this.selectIndex}
                          />
                        </PopoverCustom>
                      </Item>
                    </Col>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Row>
                        <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>
                          <Item label={"Giới tính"} {...ITEM_LAYOUT_HALF}>
                            <Select
                              value={dataCMT.GioiTinh}
                              onChange={(value) =>
                                this.changeValueCMT("GioiTinh", value)
                              }
                            >
                              <Option value={"Nam"}>Nam</Option>
                              <Option value={"Nữ"}>Nữ</Option>
                            </Select>
                          </Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Item
                        label={
                          <span>
                            Số giấy tờ <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        {...ITEM_LAYOUT_HALF}
                      >
                        <PopoverCustom
                          content={this.contentPopover(dataPopover, 2)}
                          visible={visiblePopoverCMND}
                          trigger={"click"}
                          onVisibleChange={this.changeVisiblePopoverCMND}
                          placement={"bottomLeft"}
                        >
                          <Input.Search
                            style={{ width: "100%" }}
                            value={dataCMT.SoCMND}
                            onChange={(value) =>
                              this.changeValueCMT("SoCMND", value.target.value)
                            }
                            maxLength={12}
                            onSearch={(value) => this.blurMaThe(value, 2)}
                            loading={loadingSearchCMND}
                            id={"txtCMND"}
                            onKeyDown={this.selectIndex}
                          />
                        </PopoverCustom>
                      </Item>
                    </Col>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Row>
                        <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>
                          <Item label={"Số điện thoại"} {...ITEM_LAYOUT_HALF}>
                            <Input
                              style={{ width: "100%" }}
                              value={dataCMT.DienThoai}
                              onChange={(value) =>
                                this.changeValueCMT(
                                  "DienThoai",
                                  value.target.value
                                )
                              }
                              onKeyPress={this.inputNumber}
                            />
                          </Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Item label={"Loại giấy tờ"} {...ITEM_LAYOUT_HALF}>
                        <Input
                          style={{ width: "100%" }}
                          value={dataCMT.LoaiGiayTo}
                          onChange={(value) =>
                            this.changeValueCMT(
                              "LoaiGiayTo",
                              value.target.value
                            )
                          }
                        />
                      </Item>
                    </Col>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Row>
                        <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>
                          <Item label={"Nơi công tác"} {...ITEM_LAYOUT_HALF}>
                            <Input
                              style={{ width: "100%" }}
                              value={dataCMT.TenCoQuan}
                              onChange={(value) =>
                                this.changeValueCMT(
                                  "TenCoQuan",
                                  value.target.value
                                )
                              }
                            />
                          </Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Item label={"Địa chỉ"} {...ITEM_LAYOUT_HALF}>
                        <Input
                          style={{ width: "100%" }}
                          value={dataCMT.HoKhau}
                          onChange={(value) =>
                            this.changeValueCMT("HoKhau", value.target.value)
                          }
                        />
                      </Item>
                    </Col>
                    {/* <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Row>
                        <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>
                          <Item label={"Thân nhiệt (°C)"} {...ITEM_LAYOUT_HALF}>
                            <PopoverCustom
                              content={this.getContentBadge(listTemper)}
                              visible={listTemper.length && visibleBadge}
                              trigger={"click"}
                              onVisibleChange={this.handleVisibleBadge}
                              placement={"bottomLeft"}
                            >
                              <Input
                                style={{ width: "100%" }}
                                value={dataCMT.ThanNhiet}
                                readOnly
                                id={"txtTemper"}
                                addonAfter={
                                  listTemper.length ? (
                                    listTemper.length
                                  ) : temperUsing.time ? (
                                    <div
                                      className={"x-red"}
                                      onClick={this.clearUsing}
                                    >
                                      X
                                    </div>
                                  ) : (
                                    ""
                                  )
                                }
                                onChange={(value) =>
                                  this.changeValueCMT(
                                    "ThanNhiet",
                                    value.target.value
                                  )
                                }
                              />
                            </PopoverCustom>
                          </Item>
                        </Col>
                      </Row>
                    </Col> */}
                  </Row>
                </Form>
                {checkCheckOut ? (
                  <div className={"notice-checkout"}>Khách đã checkout</div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Col>
          <Col xl={5} lg={6} md={6} sm={0} xs={0} className="col-second">
            <div className="title center">KHÁCH ĐANG CHECKIN</div>
            <div className="boxSearch">
              <Input.Search
                allowClear
                onSearch={(value) => this.onSearch(value, "Keyword")}
                placeholder={"Tìm thông tin khách"}
              />
            </div>
            <div className="card-container">
              {ListCheckinLoaded.map((item) => (
                <CardCheckin
                  AnhCMT={item.AnhCMND_MTBase64}
                  AnhChanDung={item.AnhChanDungBase64}
                  TenCanBo={item.HoVaTen}
                  onCheckOut={(e) => this.callCheckOut(e, item.ThongTinVaoRaID)}
                  SoCMT={item.SoCMND}
                  MaThe={item.MaThe}
                  GioVao={item.GioVao}
                  isPicked={
                    this.state.dataCMT.ThongTinVaoRaID === item.ThongTinVaoRaID
                  }
                  onClick={() => this.loadDataCheckOut(item)}
                />
              ))}
            </div>
          </Col>
          <Col xl={5} lg={6} md={6} sm={0} xs={0} className="col-third">
            <div className="title center">LƯỢT KHÁCH TRONG NGÀY</div>
            <div className="box-container">
              <div
                className="box-info"
                style={{ backgroundImage: `url(${imgCheckin})` }}
              >
                <div className="text-number">
                  Tổng số khách tới: {TongHopNgay.Tong}
                </div>
              </div>
              <div
                className="box-info"
                style={{ backgroundImage: `url(${imgMetting})` }}
              >
                <div className="text-number">
                  Khách đang checkin: {TongHopNgay.DangGap}
                </div>
              </div>
              <div
                className="box-info"
                style={{ backgroundImage: `url(${imgCheckout})` }}
              >
                <div className="text-number">
                  Khách đã checkout: {TongHopNgay.DaVe}
                </div>
              </div>
              <div className="div-report">
                <div className="title center">LỌC BÁO CÁO</div>
                <div className="main-report flex">
                  <div className="report-label" style={{ width: "100%" }}>
                    Thời gian
                  </div>
                </div>
                <div className="main-report flex">
                  <div className="report-wrapper" style={{ width: "70%" }}>
                    Từ{" "}
                    <DatePickerFormat
                      style={{ width: 120 }}
                      value={filterBaoCao.TuNgay}
                      onChange={(value) =>
                        this.changeFilterBaoCao(value, "TuNgay")
                      }
                    />
                  </div>
                  <div className="report-wrapper" style={{ width: "70%" }}>
                    Đến{" "}
                    <DatePickerFormat
                      style={{ width: 120 }}
                      value={filterBaoCao.DenNgay}
                      onChange={(value) =>
                        this.changeFilterBaoCao(value, "DenNgay")
                      }
                    />
                  </div>
                </div>
                <div className="main-report">
                  <div className="report-label">Đơn vị / Cá nhân</div>
                  <div className="report-wrapper">
                    <TreeSelect
                      style={{ width: "100%" }}
                      dropdownStyle={{ maxHeight: 300 }}
                      showSearch
                      treeData={DoiTuongGap}
                      placeholder="Chọn đối tượng cần gặp"
                      allowClear
                      treeDefaultExpandAll
                      onChange={(value) =>
                        this.changeFilterBaoCao(value, "CanBoGapID")
                      }
                    />
                  </div>
                </div>
                <div className="main-report">
                  <div className="report-label">Lễ tân</div>
                  <div className="report-wrapper">
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      allowClear
                      placeholder={"Chọn lễ tân tiếp đón"}
                      onChange={(value) =>
                        this.changeFilterBaoCao(value, "LeTanID")
                      }
                    >
                      {DanhSachLeTan.map((item) => {
                        return (
                          <Option
                            value={item.CanBoID}
                            label={`${item.TenCanBo} ${item.TenCoQuan}`}
                          >
                            <Tooltip
                              title={`${item.TenCanBo} - ${item.TenCoQuan}`}
                            >
                              {item.TenCanBo} - <i>{item.TenCoQuan}</i>
                            </Tooltip>
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                </div>
                <div className="action-report">
                  <Button
                    type={"primary"}
                    onClick={this.TaoBaoCao}
                    loading={loadingBaoCao}
                  >
                    Thống kê
                  </Button>
                </div>
                <ModalBaoCao
                  dataBaoCao={ListBaoCao}
                  onCancel={this.closeBaoCao}
                  visible={showBaoCao}
                  filterData={filterBaoCao}
                  key={modalKey}
                />
                <ModalHangDoi
                  listCheckin={listCheckin}
                  visible={visibleModalHangDoi}
                  key={modalKey}
                  onCancel={this.closeModalHangDoi}
                  chooseLine={this.chonHangDoiCheckin}
                  deleteLine={this.xoaHangDoiCheckin}
                />
              </div>
            </div>
          </Col>
        </Row>
        <div className={"div-footer"}>
          <div className={"div-action"}>
            <Button
              type={"primary"}
              onClick={this.CheckIn}
              disabled={
                isCheckOut ||
                loading ||
                dataCMT.HoVaTen === "" ||
                dataCMT.SoCMND === "" ||
                role.add === 0 ||
                user_id === 1
              }
            >
              Checkin
            </Button>
            <Button
              type={"primary"}
              onClick={this.CheckOut}
              disabled={
                !isCheckOut || loading || role.add === 0 || user_id === 1
              }
            >
              Checkout
            </Button>
            <Button onClick={this.reload}>
              <RedoOutlined />
              Tải lại
            </Button>
          </div>
          <div
            className={"div-action"}
            style={{ color: "#096DD9", marginTop: 10, fontWeight: "bold" }}
          >
            <ins>Lưu ý</ins>: Có thể nhập tên, số CMND hoặc Mã thẻ để thực hiện
            checkout
          </div>
        </div>
        <div className="footer-main">
          <img src={iconGo} alt="" width={30} style={{ marginRight: 10 }} />
          <i>
            Copyright © 2010-{currentYear} <b>GO SOLUTIONS</b>. All rights
          </i>
        </div>
      </Wrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.CheckinOut,
    app: state.App,
    thanNhiet: getConfigLocal("thanNhiet", 37.5),
  };
}

export default connect(mapStateToProps, {
  ...actions,
  changeCurrent,
  setListTemperWait,
  getListTemperFromSite,
})(CheckinOut);
