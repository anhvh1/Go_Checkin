import React, {Component} from "react";
import {connect} from "react-redux";
import actions from "../../redux/CheckinOut/actions";
import appActions from "../../../redux/app/actions";
import api from "./config";
import apiBaoCao from "../BaoCao/config";
import Constants from '../../../settings/constants';
import Select, {Option} from "../../../components/uielements/select";
import DatePicker from "../../../components/uielements/datePickerFormat";
import {Upload, Icon, message, Row, Col, Input, Form, Modal, Button, Spin, Tooltip} from "antd";
import TreeSelect from "../../../components/uielements/treeSelect";
import moment from "moment";
import Webcam from "react-webcam";
import Wrapper from "./styled";
import PopoverCustom from "../CheckinOut/PopoverCustom";
import 'bootstrap/dist/css/bootstrap.min.css';
import iconGo from "../../../image/logoGo.png";
import CardCheckin from './card.checkin';
import Constants2 from "./constants";
import queryString from "query-string";
import imgCheckin from '../../../image/checkin.png';
import imgCheckout from '../../../image/checkout.png';
import imgMetting from '../../../image/meetting.png';
import DatePickerFormat from "../../../components/uielements/datePickerFormat";
import {ModalBaoCao} from "./modalBaoCao";
import {store} from "../../../redux/store";
import Redirect from "react-router/Redirect";
import lodash from 'lodash';

const {changeCurrent} = appActions;
const currentYear = new Date().getFullYear();

const {Dragger} = Upload;
const {Item} = Form;
const {
  COL_COL_ITEM_LAYOUT_RIGHT,
  fileUploadLimit
} = Constants;

const {
  ITEM_LAYOUT_HALF,
  COL_ITEM_LAYOUT_HALF
} = Constants2;

let today = new Date();

class CheckinOut extends Component {
  constructor(props) {
    super(props);
    document.title = "Checkin";
    this.interval = null;
    this.webcamRefChanDung = React.createRef();
    this.webcamRefTruoc = React.createRef();
    this.webcamRefSau = React.createRef();
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
        LoaiGiayTo: ""
      },
      loading: false,
      isCheckOut: false,//Kiểm tra trạng thái hiện tại có phải là checkout hay không
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
        CanBoGapID: undefined
      },
      ListBaoCao: [],
      showBaoCao: false,
      modalKey: 0,
      loadingBaoCao: false
    };
  }

  //Get initData---------------------------------------------
  componentDidMount = () => {
    this.props.getInitData(this.state.filterData);
    this.interval = setInterval(() => {
      today = new Date();
      this.setState({today});
    }, 1000);
    this.getCamera();
    //GetListCheckIn
    this.GetListCheckin();
    //EventListener
    const container = document.getElementsByClassName('card-container');
    container[0] && container[0].addEventListener('scroll', this.ScrollContainer);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  ScrollContainer = (e) => {
    const container = e.target;
    const isBottom = container.scrollTop === container.scrollHeight - container.clientHeight;
    if (isBottom) {
      let filterData = this.state.filterData;
      const {ListCheckinLoaded, TotalRow} = this.state;
      if (ListCheckinLoaded.length < TotalRow) {
        filterData.PageNumber += 1;
        // changeUrlFilter(filterData); //change url
        this.setState({filterData}, () => this.GetListCheckin())
      }
    }
  };

  GetListCheckin = () => {
    let {filterData, ListCheckinLoaded, TotalRow} = this.state;
    api.GetList({...filterData}).then(response => {
      if (response.data.Status > 0) {
        if (filterData.PageNumber === 1) {//Case mới load page
          ListCheckinLoaded = response.data.Data;
        } else {//Case load thêm
          response.data.Data.forEach(item => ListCheckinLoaded.push(item));
        }
        TotalRow = response.data.TotalRow;
        this.setState({ListCheckinLoaded, TotalRow})
      }
    })
  };

  onSearch = (value, property) => {
    let {filterData} = this.state;
    filterData[property] = value;
    filterData.PageNumber = 1;
    this.setState({filterData, ListCheckinLoaded: []}, () => this.GetListCheckin())
  };

  getBase64 = (img, type, callback) => {
    if (!img) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(type, reader.result));
    reader.readAsDataURL(img);
  };

  beforeUpload = (file, type, callback) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < fileUploadLimit;
    if (!isJpgOrPng) {
      message.error('Chỉ được sử dụng định dạng ảnh .jpg hoặc .png');
    } else if (!isLt2M) {
      message.error(`File ảnh phải nhỏ hơn ${fileUploadLimit}MB`);
    } else {
      this.getBase64(file, type, callback);
    }
    return false;
  };

  fillData = (data, type) => {
    const {dataCMT} = this.state;
    dataCMT.HoVaTen = data.name !== "N/A" ? data.name : type === 2 ? dataCMT.HoVaTen : "";
    dataCMT.NgaySinh = data.birthday !== "N/A" ? moment(data.birthday, 'DD-MM-YYYY') : type === 2 ? dataCMT.NgaySinh : "";
    dataCMT.HoKhau = data.address !== "N/A" ? data.address : type === 2 ? dataCMT.HoKhau : "";
    dataCMT.SoCMND = data.id !== "N/A" ? data.id : type === 2 ? dataCMT.SoCMND : "";
    dataCMT.NoiCapCMND = data.issue_by !== "N/A" ? data.issue_by : type === 1 ? dataCMT.NoiCapCMND : "";
    dataCMT.NgayCapCMND = data.issue_date !== "N/A" ? moment(data.issue_date, 'DD-MM-YYYY') : type === 1 ? dataCMT.NgayCapCMND : "";
    dataCMT.GioiTinh = data.sex !== "N/A" ? data.sex : type === 2 ? dataCMT.GioiTinh : undefined;
    dataCMT.LoaiGiayTo = data.document !== "N/A" ? data.document : type === 2 ? dataCMT.LoaiGiayTo : "";
    //type: 1 - Mặt trước 2 - Mặt sau
    if (type === 1) {
      if (data.name === "N/A" || data.id === "N/A") {
        message.destroy();
        message.warning('Ảnh CMND mặt trước không hợp lệ');
      }
    } else if (type === 2) {
      if (data.name !== "N/A" || data.id !== "N/A") {
        message.destroy();
        message.warning('Ảnh CMND mặt sau không hợp lệ');
      }
    }
    this.setState({dataCMT});
  };

  b64toBlob = (dataURI) => {
    let fileType = dataURI.split(";")[0].replace("data:", "");
    let byteString = atob(dataURI.split(',')[1]);
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: fileType}); //eg: image/jpg
  };

  inputNumber = (e) => {
    const key = e.charCode;
    if (key < 48 || key > 57) {
      e.preventDefault();
    }
  };

  CheckIn = () => {
    const param = Object.assign({}, this.state.dataCMT);
    param.NgaySinh = param.NgaySinh !== "" ? moment(param.NgaySinh, 'DD/MM/YYYY').format('YYYY-MM-DD') : "";
    param.NgayCapCMND = param.NgayCapCMND !== "" ? moment(param.NgayCapCMND, 'DD/MM/YYYY').format('YYYY-MM-DD') : "";
    param.AnhChanDungBase64 = this.state.imageChanDung;
    param.AnhCMND_MTBase64 = this.state.imageCMTTruoc;
    param.AnhCMND_MSBase64 = this.state.imageCMTSau;
    delete param.GioVao;
    if (param.GapCanBo === undefined) {
      message.destroy();
      message.warning('Chưa chọn cán bộ cần gặp');
      return;
    } else {
      const arr = param.GapCanBo.split("_");
      param.GapCanBo = arr[0];
      param.DonViCaNhan = arr[1];
    }
    // if (param.MaThe === "") {
    //   message.destroy();
    //   message.warning('Chưa nhập mã thẻ');
    //   return;
    // }
    this.setState({loading: true});
    api.Checkin(param)
      .then(response => {
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
            MaThe: ""
          };
          Modal.success({
            title: 'Thông báo',
            content: `Checkin thành công`,
            okText: 'Đóng',
            onOk: () => {
              let {filterData} = this.state;
              filterData.PageNumber = 1;
              this.setState({
                dataCMT,
                loading: false,
                imageCMTTruoc: "",
                imageCMTSau: "",
                imageChanDung: "",
                isCheckIn: false,
                showCamera: true,
                ListCheckinLoaded: [],
                filterData
              }, () => {
                this.props.getList();
                this.GetListCheckin()
              });
            }
          });
        } else {
          this.setState({loading: false});
          message.destroy();
          message.error(response.data.Message);
        }
      }).catch(error => {
      this.setState({loading: false});
      message.destroy();
      message.error(error.toString());
    })
  };

  CheckOut = () => {
    const param = {ThongTinVaoRaID: this.state.dataCMT.ThongTinVaoRaID};
    this.setState({loading: true});
    api.Checkout(param)
      .then(response => {
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
            MaThe: ""
          };
          Modal.success({
            title: 'Thông báo',
            content: 'Checkout thành công',
            okText: 'Đóng',
            onOk: () => {
              let {filterData} = this.state;
              filterData.PageNumber = 1;
              this.setState({
                dataCMT,
                loading: false,
                imageCMTTruoc: "",
                imageCMTSau: "",
                imageChanDung: "",
                isCheckOut: false,
                showCamera: true,
                ListCheckinLoaded: [],
                filterData
              }, () => {
                this.props.getList();
                this.GetListCheckin()
              });
            }
          });
        } else {
          this.setState({loading: false});
          message.destroy();
          message.error(response.data.Message);
        }
      }).catch(error => {
      this.setState({loading: false});
      message.destroy();
      message.error(error.toString());
    })
  };

  callCheckOut = (e, ThongTinVaoRaID) => {
    e.stopPropagation();
    Modal.confirm({
      title: 'Checkout',
      content: 'Bạn có muốn checkout khách này không ?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        const {dataCMT} = this.state;
        dataCMT.ThongTinVaoRaID = ThongTinVaoRaID;
        this.setState({dataCMT}, () => {
          this.CheckOut();
        })
      }
    });
  };

  changeCanBo = (value) => {
    const {dataCMT} = this.state;
    dataCMT.GapCanBo = value;
    this.setState({dataCMT});
  };

  scanFile = (type) => {
    const {videoInput} = this.state;
    // if (type !== 3 && !videoInput.length) {
    //   message.destroy();
    //   message.warn('Không có camera kết nối với hệ thống');
    //   return;
    // }
    if (type === 3) {
      const showCamera = !this.state.showCamera;
      if (!videoInput.length) {
        this.getCamera();
      }
      this.setState({showCamera, imageChanDung: ""})
    } else if (type === 1) {
      const base64 = this.webcamRefTruoc.current.getScreenshot({width: 1200, height: 1000});
      this.setState({imageCMTTruoc: base64, loadingTruoc: false, recognitionTruoc: true});
      api.UploadImage({image: base64})
        .then(response => {
          if (response.data.result_code === 200) {
            this.fillData(response.data, type);
            this.setState({
              recognitionTruoc: false,
            })
          } else if (response.data.result_code === 500) {
            this.setState({recognitionTruoc: false});
            message.destroy();
            message.error('Ảnh CMND mặt trước không hợp lệ');
          } else {
            this.setState({recognitionTruoc: false});
            message.destroy();
            message.error(response.data.result_message);
          }
        }).catch(error => {
        this.setState({recognitionTruoc: false});
        message.destroy();
        message.error(error.toString());
      });
    } else if (type === 2) {
      const base64 = this.webcamRefSau.current.getScreenshot({width: 1200, height: 1000});
      this.setState({imageCMTSau: base64, loadingSau: false, recognitionSau: true});
      api.UploadImage({image: base64})
        .then(response => {
          if (response.data.result_code === 200) {
            this.fillData(response.data, type);
            this.setState({
              recognitionSau: false,
            })
          } else if (response.data.result_code === 500) {
            this.setState({recognitionSau: false});
            message.destroy();
            message.error('Ảnh CMND mặt trước không hợp lệ');
          } else {
            this.setState({recognitionSau: false});
            message.destroy();
            message.error(response.data.result_message);
          }
        }).catch(error => {
        this.setState({recognitionSau: false});
        message.destroy();
        message.error(error.toString());
      });
    } else {
      this.Scan(type)
    }
  };

  triggerUpload = (type) => {
    let elementID = "";
    switch (type) {
      case 1:
        elementID = "uploadTruoc";
        break;
      case 2:
        elementID = "uploadSau";
        break;
      case 3:
        elementID = "uploadChanDung";
        break;
    }
    //Nếu type = 3 (Chân dung) và đang hiển thị camera thì gọi api lấy ảnh để checkin - checkout
    if (type === 3) {
      this.setState({loadingChanDung: true});
      let imageChanDung = this.webcamRefChanDung.current.getScreenshot({width: 1200, height: 1000});
      this.setState({imageChanDung, showCamera: false, loadingChanDung: false});
      const {imageCMTTruoc, imageCMTSau} = this.state;
      if (imageCMTTruoc === "" && imageCMTSau === "") {
        this.setState({recognitionChanDung: true});
        api.GetByChanDung({Base64File: imageChanDung})
          .then(response => {
            if (response.data.Status > 0) {
              const dataCMT = response.data.Data;
              dataCMT.NgayCapCMND = moment(dataCMT.NgayCapCMND);
              dataCMT.NgaySinh = moment(dataCMT.NgaySinh);
              this.setState({
                dataCMT, isCheckOut: true, imageCMTTruoc: dataCMT.AnhCMND_MTBase64,
                imageCMTSau: dataCMT.AnhCMND_MSBase64, recognitionChanDung: false
              });
            } else {
              this.setState({recognitionChanDung: false});
              message.destroy();
              message.error(response.data.Message);
            }
          }).catch(error => {
          this.setState({recognitionChanDung: false});
          message.destroy();
          message.error(error.toString());
        });
      } else {
        const param = {
          image_cmt: imageCMTTruoc,
          image_cmt2: imageCMTSau,
          image_live: imageChanDung
        };
        this.setState({recognitionChanDung: true});
        api.Verification(param)
          .then(response => {
            if (response.data.verify_result === 2) {
              this.setState({isCheckIn: true, recognitionChanDung: false});
            } else {
              message.destroy();
              message.warning('Ảnh chân dung không khớp với ảnh chứng minh thư');
              this.setState({isCheckIn: false, recognitionChanDung: false});
              this.scanFile(3);
            }
          }).catch(error => {
          this.setState({imageChanDung: "", recognitionChanDung: false});
          message.destroy();
          message.error('Có lỗi xảy ra khi nhận diện khuôn mặt. Vui lòng thử lại');
        });
      }
    }
  };

  reload = () => {
    Modal.confirm({
      title: 'Thông báo',
      content: 'Bạn có muốn hủy tác vụ hiện tại không ?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        let {keyCamera} = this.state;
        keyCamera++;
        this.setState({
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
            LoaiGiayTo: ""
          },
          loading: false,
          isCheckOut: false,//Kiểm tra trạng thái hiện tại có phải là checkout hay không
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
          loadingBaoCao: false
        }, () => {
          this.getCamera();
          this.props.getList();
        })
      }
    })
  };

  changeValueCMT = (properties, value) => {
    const {dataCMT} = this.state;
    if (properties === "HoVaTen") {
      value = value.toUpperCase();
    }
    dataCMT[properties] = value;
    this.setState({dataCMT});
  };

  contentPopover = (data, type) => {
    const {selectIndex} = this.state;
    let element = "";
    let widthPopover = 400;
    if (type === 1) {
      element = document.getElementById("txtMaThe");
      widthPopover = element ? element.clientWidth : widthPopover;
    } else if (type === 2) {
      element = document.getElementById("txtCMND");
      widthPopover = element ? element.clientWidth : widthPopover;
    } else if (type === 3) {
      element = document.getElementById("txtHoTen");
      widthPopover = element ? element.clientWidth : widthPopover;
    }
    if (data) {
      return <div>
        {data.map((item, index) => {
          const style = index % 2 !== 0 ? {background: index === selectIndex ? "#40A9FF" : "#cee5fd"}
            : {background: index === selectIndex ? "#40A9FF" : ""};
          return (
            <div className={'hover-content'} style={{
              ...style,
              width: widthPopover,
              cursor: 'pointer',
              userSelect: 'none',
              padding: index === 0 ? "5px 12px" : "10px 12px",
              color: 'black',
            }}
                 onClick={() => this.loadDataCheckOut(item)}>
              <b>{item.HoVaTen}</b>
              <br/>
              <i style={{paddingLeft: 15}}>{item.SoCMND}</i>
              <br/>
              {item.TenCoQuan !== "" ? <i style={{paddingLeft: 15}}>{item.TenCoQuan}</i> : ""}
            </div>
          )
        })}
      </div>
    }
  };

  loadDataCheckOut = (data) => {
    const dataCMT = lodash.cloneDeep(data);
    dataCMT.NgaySinh = dataCMT.NgaySinh ? moment(dataCMT.NgaySinh) : "";
    dataCMT.NgayCapCMND = dataCMT.NgayCapCMND ? moment(dataCMT.NgayCapCMND) : "";
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
      imageChanDung: dataCMT.AnhChanDungBase64 ? dataCMT.AnhChanDungBase64 : ""
    });
  };

  getCamera = () => {
    if (navigator.getUserMedia) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoInput = devices.filter(device => device.kind === "videoinput" && (device.label.includes('S520') || device.label.includes('USB CAM2')));
        if (videoInput.length) {
          this.setState({videoInput});
        }
      }).catch(error => {
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
    const {isCheckOut, checkCheckOut} = this.state;
    const param = {MaThe: value, LoaiCheckOut: type};
    if (type === 1) {
      this.setState({loadingSearchMaThe: true});
    } else if (type === 2) {
      this.setState({loadingSearchCMND: true});
    } else if (type === 3) {
      this.setState({loadingSearchHoTen: true});
    }
    api.GetByMaThe(param)
      .then(response => {
        if (type === 1) {
          this.setState({loadingSearchMaThe: false});
        } else if (type === 2) {
          this.setState({loadingSearchCMND: false});
        } else if (type === 3) {
          this.setState({loadingSearchHoTen: false});
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
            this.setState({dataPopover});
            if (type === 1) {
              this.setState({visiblePopoverMaThe: true});
            } else if (type === 2) {
              this.setState({visiblePopoverCMND: true});
            } else if (type === 3) {
              this.setState({visiblePopoverHoTen: true});
            }
          }
          //}
        } else {
          // message.destroy();
          // message.info('Không có dữ liệu')
        }
      }).catch(error => {
      message.destroy();
      message.error(error.toString());
    })
  };

  changeFilterBaoCao = (value, property) => {
    const {filterBaoCao} = this.state;
    if (property === "CanBoGapID" && value) {
      const arr = value.split("_");
      filterBaoCao.CanBoGapID = arr[0];
      filterBaoCao.DonViCaNhan = arr[1];
    } else {
      filterBaoCao[property] = value;
    }
    this.setState({filterBaoCao});
  };

  TaoBaoCao = () => {
    const filterData = Object.assign({}, this.state.filterBaoCao);
    if (filterData.TuNgay === "" || filterData.DenNgay === "" || filterData.TuNgay === null || filterData.DenNgay === null) {
      message.destroy();
      message.warning('Chưa nhập kỳ báo cáo');
      return;
    }
    filterData.TuNgay = moment(filterData.TuNgay).format('YYYY-MM-DD');
    filterData.DenNgay = moment(filterData.DenNgay).format('YYYY-MM-DD');
    this.setState({loadingBaoCao: true});
    apiBaoCao.TaoBaoCao(filterData)
      .then(response => {
        this.setState({loadingBaoCao: false});
        if (response.data.Status > 0) {
          if (!response.data.Data) {
            message.destroy();
            message.warning('Kỳ báo cáo hiện tại không có dữ liệu');
            this.setState({ListBaoCao: [], showBaoCao: false});
            return;
          }
          let {modalKey} = this.state;
          modalKey++;
          this.setState({showBaoCao: true, ListBaoCao: response.data.Data, modalKey});
        } else {
          message.destroy();
          message.error(response.data.Message);
        }
      }).catch(error => {
      this.setState({loadingBaoCao: false});
      message.destroy();
      message.error(error.toString());
    });
  };

  closeBaoCao = () => {
    this.setState({showBaoCao: false})
  };

  clearImage = (type) => {
    let {imageCMTTruoc, imageCMTSau, imageChanDung} = this.state;
    if (type === 1) {
      imageCMTTruoc = "";
    } else if (type === 2) {
      imageCMTSau = "";
    } else if (type === 3) {
      imageChanDung = ""
    }
    this.setState({imageCMTTruoc, imageCMTSau, imageChanDung})
  };

  selectIndex = (e) => {
    const {visiblePopoverMaThe, visiblePopoverCMND, visiblePopoverHoTen, dataPopover} = this.state;
    let {selectIndex} = this.state;
    const keyCode = e.keyCode;
    if (visiblePopoverMaThe || visiblePopoverCMND || visiblePopoverHoTen) {
      if (keyCode === 40 && selectIndex < dataPopover.length - 1) {//Down
        selectIndex++
      } else if (keyCode === 38) {//Up
        if (selectIndex > -1) {
          selectIndex--;
        }
      }
      if (keyCode === 27) {
        this.setState({visiblePopoverMaThe: false, visiblePopoverCMND: false, visiblePopoverHoTen: false})
      }
      this.setState({selectIndex})
    }
    if (selectIndex >= 0 && keyCode === 13) {
      this.loadDataCheckOut(dataPopover[selectIndex])
    }
  };

  render() {
    const user_id = parseInt(localStorage.getItem('user_id'));
    const user = store.getState().Auth.user;
    if (user && user.NguoiDungID === 1) {//Là admin
      return <Redirect to={'co-quan-don-vi'}/>
    }
    //Props, state
    const {IPCamera, role, roleBaoCao, DanhSachLeTan, TongHopNgay, DoiTuongGap} = this.props;
    const {ListCheckinLoaded, ListBaoCao, filterBaoCao, showBaoCao, loadingBaoCao} = this.state;
    const DanhSachCanBo = this.props.DanhSachCanBo ? this.props.DanhSachCanBo : [];
    const listRole = JSON.parse(localStorage.getItem('role'));
    const roleCheckin = listRole['checkin-out'];
    if (!roleCheckin || !roleCheckin.view === 0) {
      this.props.history.push('/dashboard')
    }
    const {imageCMTTruoc, imageCMTSau, imageChanDung, loadingTruoc, loadingSau, loadingChanDung, dataCMT, isCheckOut, loading, checkCheckOut, isCheckIn, recognitionTruoc, recognitionSau, recognitionChanDung, showCamera, visiblePopoverMaThe, dataPopover, visiblePopoverHoTen, visiblePopoverCMND, loadingSearchMaThe, loadingSearchCMND, loadingSearchHoTen, videoInput, isScanFile, keyCamera} = this.state;

    //Props dragger

    const valueGioVaoHS = moment(isCheckOut ? dataCMT.GioVao : today).format('HH:mm');
    const valueGioVaoDMY = moment(isCheckOut ? dataCMT.GioVao : today).format('DD/MM/YYYY');

    const valueGioRaHS = checkCheckOut || isCheckOut ? moment(dataCMT.GioRa).format('HH:mm') : "";
    const valueGioRaDMY = checkCheckOut || isCheckOut ? moment(dataCMT.GioRa).format('DD/MM/YYYY') : "";

    const videoConstraints = {
      width: 1200,
      height: 1000,
    };

    const deviceIDChanDung = videoInput.find(item => item.label.includes('USB CAM2'));
    const deviceIDScan = videoInput.find(item => item.label.includes('S520'));
    const cameraContentChanDung = (
      <Webcam audio={false}
              ref={this.webcamRefChanDung}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                ...videoConstraints,
                deviceId: deviceIDChanDung && deviceIDChanDung.deviceId ? deviceIDChanDung.deviceId : ""
              }}
              key={deviceIDChanDung && deviceIDChanDung.deviceId ? deviceIDChanDung.deviceId : ""}
              style={{zoom: 0.15}}
      />
    );

    const cameraContentScan = (
      <Webcam audio={false}
              ref={this.webcamRefTruoc}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                ...videoConstraints,
                deviceId: deviceIDScan && deviceIDScan.deviceId ? deviceIDScan.deviceId : ""
              }}
              style={{zoom: 0.15}}
      />
    );

    const cameraContentScan2 = (
      <Webcam audio={false}
              ref={this.webcamRefSau}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                ...videoConstraints,
                deviceId: deviceIDScan && deviceIDScan.deviceId ? deviceIDScan.deviceId : ""
              }}
              style={{zoom: 0.15}}/>
    );

    const contentCameraEmpty = isCheckOut ? <Icon type={"audit"} style={{fontSize: 50, color: "#ccc"}}/> : "";

    return (
      <Wrapper>
        <Row className="col-container">
          <Col xl={14} lg={12} md={12} sm={24} xs={24} className="col col-first">
            <div className="box-container">
              <div className="box box-camera">
                <Row gutter={24}>
                  <Col xl={8} lg={24}>
                    <div className={"camera-content"}>
                      <div className="content">
                        {loadingTruoc ? <Icon type={'loading'}/> : imageCMTTruoc !== "" ?
                          <div className={"box-image"}>
                            {imageCMTTruoc !== "" && !isCheckOut ?
                              <Icon className={'close-ico'} type={'close'} onClick={() => this.clearImage(1)}/> : ""}
                            <img src={imageCMTTruoc} alt="avatar" style={{maxHeight: 130}}
                                 id={"imgTruoc"}/>
                          </div>
                          : contentCameraEmpty}
                        <div style={{display: imageCMTTruoc === "" && !isCheckOut ? "block" : "none"}}>
                          {cameraContentScan}
                        </div>
                      </div>
                      <div className="action">
                        <Button icon={'camera'} disabled={videoInput.length === 0} onClick={() => this.scanFile(1)}>Quét
                          tài liệu</Button>
                      </div>
                    </div>
                  </Col>
                  <Col xl={8} lg={24}>
                    <div className={"camera-content"}>
                      <div className="content">
                        {loadingSau ? <Icon type={'loading'}/> : imageCMTSau !== "" ?
                          <div className={"box-image"}>
                            <Icon className={'close-ico'} type={'close'} onClick={() => this.clearImage(2)}/>
                            <img src={imageCMTSau} alt="avatar"
                                 style={{maxHeight: 130}}/></div> : contentCameraEmpty}
                        <div
                          style={{display: imageCMTSau === "" && !isCheckOut ? "block" : "none"}}>{cameraContentScan2}</div>
                      </div>
                      <div className="action">
                        <Button icon={'camera'} disabled={videoInput.length === 0} onClick={() => this.scanFile(2)}>Quét
                          tài liệu</Button>
                      </div>
                    </div>
                  </Col>
                  <Col xl={8} lg={24}>
                    <div className={"camera-content"}>
                      <div className="content">
                        {loadingChanDung ? <Icon type={'loading'}/> : imageChanDung !== "" ?
                          <div className={"box-image"}>
                            <Icon className={'close-ico'} type={'close'} onClick={() => this.clearImage(3)}/>
                            <img src={imageChanDung} alt="avatar"
                                 style={{maxHeight: 130}}/></div> : contentCameraEmpty}
                        <div
                          style={{display: imageChanDung === "" && !isCheckOut ? "block" : "none"}}>{cameraContentChanDung}</div>
                      </div>
                      <div className="action">
                        <Button icon={'camera'} disabled={videoInput.length === 0}
                                onClick={() => this.triggerUpload(3)}>Chụp ảnh</Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className={'box box-info'}>
                <div className='title'>THÔNG TIN VÀO - RA</div>
                <Form>
                  <Row>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Item label={"Giờ vào"} {...ITEM_LAYOUT_HALF} className={'datepicker'}>
                        <Input placeholder={""} style={{width: '30%', maxWidth: 100}}
                               value={isCheckIn || isCheckOut || checkCheckOut || (dataCMT.HoVaTen !== "" && dataCMT.SoCMND !== "") ? valueGioVaoHS : ""}
                               disabled
                          // suffix={<Icon type={'clock-circle'}/>}
                        />
                        <Input placeholder={""} style={{width: 'calc(70% - 20px)', marginLeft: 20, maxWidth: 180}}
                               value={isCheckIn || isCheckOut || checkCheckOut || (dataCMT.HoVaTen !== "" && dataCMT.SoCMND !== "") ? valueGioVaoDMY : ""}
                               disabled
                               suffix={<Icon type={'calendar'}/>}/>
                      </Item>
                    </Col>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Row>
                        <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>
                          <Item label={<span>Đơn vị / Cá nhân <span
                            style={{color: 'red'}}>*</span></span>} {...ITEM_LAYOUT_HALF}>
                            {/*<Select style={{width: '100%'}} placeholder={'Chọn cán bộ cần gặp'}*/}
                            {/*        optionFilterProp={'label'}*/}
                            {/*        showSearch notFoundContent={"Không có dữ liệu"} value={dataCMT.GapCanBo}*/}
                            {/*        onChange={value => this.changeCanBo(value)} disabled={isCheckOut}>*/}
                            {/*  {DanhSachCanBo.map(item => {*/}
                            {/*    return (*/}
                            {/*      <Option value={item.CanBoID}*/}
                            {/*              label={`${item.TenCanBo} ${item.TenCoQuan}`}>{item.TenCanBo} - <i>{item.TenCoQuan}</i></Option>*/}
                            {/*    )*/}
                            {/*  })}*/}
                            {/*</Select>*/}
                            <TreeSelect
                              dropdownStyle={{maxHeight: 300}}
                              value={dataCMT.GapCanBo}
                              showSearch
                              treeData={DoiTuongGap}
                              placeholder="Chọn đối tượng cần gặp"
                              allowClear
                              treeDefaultExpandAll
                              onChange={value => this.changeCanBo(value)}
                            />
                          </Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Item label={"Giờ ra"} {...ITEM_LAYOUT_HALF} className={'datepicker'}>
                        <Input placeholder={""} style={{width: '30%', maxWidth: 100}}
                               value={isCheckOut ? moment(today).format('HH:mm') : valueGioRaHS}
                               disabled
                          // suffix={<Icon type={'clock-circle'}/>}
                        />
                        <Input placeholder={""} style={{width: 'calc(70% - 20px)', marginLeft: 20, maxWidth: 180}}
                               value={isCheckOut ? moment(today).format('DD/MM/YYYY') : valueGioRaDMY} disabled
                               suffix={<Icon type={'calendar'}/>}/>
                      </Item>
                    </Col>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Row>
                        <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>
                          <Item label={"Mã thẻ"} {...ITEM_LAYOUT_HALF}>
                            <PopoverCustom content={this.contentPopover(dataPopover, 1)} visible={visiblePopoverMaThe}
                                           trigger={"click"}
                                           onVisibleChange={this.changeVisiblePopoverMaThe} placement={"bottomLeft"}>
                              <Input.Search style={{width: '100%'}} onSearch={value => this.blurMaThe(value, 1)}
                                            maxLength={20} value={dataCMT.MaThe} placeholder={'Nhập mã thẻ'}
                                            onChange={value => this.changeValueCMT("MaThe", value.target.value)}
                                            id={'txtMaThe'} loading={loadingSearchMaThe} onKeyDown={this.selectIndex}
                              />
                            </PopoverCustom>
                          </Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div className={'box box-info box-relative'}>
                <div className='title'>THÔNG TIN KHÁCH</div>
                {recognitionTruoc || recognitionSau || recognitionChanDung ? <div className={'div-loading'}>
                  <div className={'spin'}><Spin/></div>
                </div> : ""}
                <Form>
                  <Row>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Item label={<span>Họ tên <span style={{color: 'red'}}>*</span></span>} {...ITEM_LAYOUT_HALF}>
                        <PopoverCustom content={this.contentPopover(dataPopover, 3)} visible={visiblePopoverHoTen}
                                       trigger={"click"}
                                       onVisibleChange={this.changeVisiblePopoverHoTen} placement={"bottomLeft"}>
                          <Input.Search style={{width: '100%'}} value={dataCMT.HoVaTen}
                                        onChange={value => this.changeValueCMT("HoVaTen", value.target.value)}
                                        onSearch={value => this.blurMaThe(value, 3)} id={'txtHoTen'}
                                        loading={loadingSearchHoTen} onKeyDown={this.selectIndex}
                          />
                        </PopoverCustom>
                      </Item>
                    </Col>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Row>
                        <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>
                          <Item label={"Giới tính"} {...ITEM_LAYOUT_HALF}>
                            <Select value={dataCMT.GioiTinh} onChange={value => this.changeValueCMT("GioiTinh", value)}>
                              <Option value={'Nam'}>Nam</Option>
                              <Option value={'Nữ'}>Nữ</Option>
                            </Select>
                          </Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Item label={"Địa chỉ"} {...ITEM_LAYOUT_HALF}>
                        <Input style={{width: '100%'}} value={dataCMT.HoKhau}
                               onChange={value => this.changeValueCMT("HoKhau", value.target.value)}/>
                      </Item>
                    </Col>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Row>
                        <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>
                          <Item label={"Số điện thoại"} {...ITEM_LAYOUT_HALF}>
                            <Input style={{width: '100%'}} value={dataCMT.DienThoai}
                                   onChange={value => this.changeValueCMT("DienThoai", value.target.value)}
                                   onKeyPress={this.inputNumber}/>
                          </Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Item label={"Loại giấy tờ"} {...ITEM_LAYOUT_HALF}>
                        <Input style={{width: '100%'}} value={dataCMT.LoaiGiayTo}
                               onChange={value => this.changeValueCMT("LoaiGiayTo", value.target.value)}/>
                      </Item>
                    </Col>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Row>
                        <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>
                          <Item label={"Nơi công tác"} {...ITEM_LAYOUT_HALF}>
                            <Input style={{width: '100%'}} value={dataCMT.TenCoQuan}
                                   onChange={value => this.changeValueCMT("TenCoQuan", value.target.value)}/>
                          </Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Item label={<span>Số giấy tờ <span style={{color: 'red'}}>*</span></span>} {...ITEM_LAYOUT_HALF}>
                        <PopoverCustom content={this.contentPopover(dataPopover, 2)} visible={visiblePopoverCMND}
                                       trigger={"click"}
                                       onVisibleChange={this.changeVisiblePopoverCMND} placement={"bottomLeft"}>
                          <Input.Search style={{width: '100%'}} value={dataCMT.SoCMND}
                                        onChange={value => this.changeValueCMT("SoCMND", value.target.value)}
                                        maxLength={12} onSearch={value => this.blurMaThe(value, 2)}
                                        loading={loadingSearchCMND} id={"txtCMND"} onKeyDown={this.selectIndex}/>
                        </PopoverCustom>
                      </Item>
                    </Col>
                    <Col {...COL_ITEM_LAYOUT_HALF}>
                      <Row>
                        <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>
                          <Item label={"Thân nhiệt"} {...ITEM_LAYOUT_HALF}>
                            <Input style={{width: '100%'}} value={dataCMT.ThanNhiet}
                                   onChange={value => this.changeValueCMT("ThanNhiet", value.target.value)}/>
                          </Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
                {checkCheckOut ? <div className={'notice-checkout'}>Khách đã checkout</div> : ""}
              </div>
            </div>
          </Col>
          <Col xl={5} lg={6} md={6} sm={0} xs={0} className="col-second">
            <div className='title center'>KHÁCH ĐANG CHECKIN</div>
            <div className='boxSearch'>
              <Input.Search allowClear onSearch={value => this.onSearch(value, "Keyword")}
                            placeholder={'Tìm thông tin khách'}/>
            </div>
            <div className='card-container'>
              {ListCheckinLoaded.map(item => <CardCheckin AnhCMT={item.AnhCMND_MTBase64} TenCanBo={item.HoVaTen}
                                                          onCheckOut={(e) => this.callCheckOut(e, item.ThongTinVaoRaID)}
                                                          SoCMT={item.SoCMND} MaThe={item.MaThe} GioVao={item.GioVao}
                                                          isPicked={this.state.dataCMT.ThongTinVaoRaID === item.ThongTinVaoRaID}
                                                          onClick={() => this.loadDataCheckOut(item)}/>)}
            </div>
          </Col>
          <Col xl={5} lg={6} md={6} sm={0} xs={0} className="col-third">
            <div className='title center'>LƯỢNG KHÁCH TRONG NGÀY</div>
            <div className="box-container">
              <div className="box-info" style={{backgroundImage: `url(${imgCheckin})`}}>
                <div className="text-number">
                  Tổng số khách tới: {TongHopNgay.Tong}
                </div>
              </div>
              <div className="box-info" style={{backgroundImage: `url(${imgMetting})`}}>
                <div className="text-number">
                  Khách đang checkin: {TongHopNgay.DangGap}
                </div>
              </div>
              <div className="box-info" style={{backgroundImage: `url(${imgCheckout})`}}>
                <div className="text-number">
                  Khách đã checkout: {TongHopNgay.DaVe}
                </div>
              </div>
              <div className='div-report'>
                <div className='title center'>LỌC BÁO CÁO</div>
                <div className='main-report flex'>
                  <div className='report-label' style={{width: '100%'}}>Thời gian</div>
                </div>
                <div className='main-report flex'>
                  <div className='report-wrapper' style={{width: '70%'}}>
                    Từ <DatePickerFormat style={{width: 120}} value={filterBaoCao.TuNgay}
                                         onChange={value => this.changeFilterBaoCao(value, "TuNgay")}/>
                  </div>
                  <div className='report-wrapper' style={{width: '70%'}}>
                    Đến <DatePickerFormat style={{width: 120}} value={filterBaoCao.DenNgay}
                                          onChange={value => this.changeFilterBaoCao(value, "DenNgay")}/>
                  </div>
                </div>
                <div className='main-report'>
                  <div className='report-label'>Đơn vị / Cá nhân</div>
                  <div className='report-wrapper'>
                    {/*<Select style={{width: '100%'}} showSearch allowClear*/}
                    {/*        onChange={value => this.changeFilterBaoCao(value, "CanBoGapID")}*/}
                    {/*        placeholder={'Chọn cán bộ gặp'}>*/}
                    {/*  {DanhSachCanBo.map(item => {*/}
                    {/*    return (*/}
                    {/*      <Option value={item.CanBoID}*/}
                    {/*              label={`${item.TenCanBo} ${item.TenCoQuan}`}>*/}
                    {/*        <Tooltip title={`${item.TenCanBo} - ${item.TenCoQuan}`}>*/}
                    {/*          {item.TenCanBo} - <i>{item.TenCoQuan}</i>*/}
                    {/*        </Tooltip>*/}

                    {/*      </Option>*/}
                    {/*    )*/}
                    {/*  })}*/}
                    {/*</Select>*/}
                    <TreeSelect
                      style={{width: '100%'}}
                      dropdownStyle={{maxHeight: 300}}
                      showSearch
                      treeData={DoiTuongGap}
                      placeholder="Chọn đối tượng cần gặp"
                      allowClear
                      treeDefaultExpandAll
                      onChange={value => this.changeFilterBaoCao(value, "CanBoGapID")}
                    />
                  </div>
                </div>
                <div className='main-report'>
                  <div className='report-label'>Lễ tân</div>
                  <div className='report-wrapper'>
                    <Select style={{width: '100%'}} showSearch allowClear placeholder={'Chọn lễ tân tiếp đón'}
                            onChange={value => this.changeFilterBaoCao(value, "LeTanID")}>
                      {DanhSachLeTan.map(item => {
                        return (
                          <Option value={item.CanBoID}
                                  label={`${item.TenCanBo} ${item.TenCoQuan}`}>
                            <Tooltip title={`${item.TenCanBo} - ${item.TenCoQuan}`}>
                              {item.TenCanBo} - <i>{item.TenCoQuan}</i>
                            </Tooltip>
                          </Option>
                        )
                      })}
                    </Select>
                  </div>
                </div>
                <div className='action-report'>
                  <Button type={'primary'} onClick={this.TaoBaoCao} loading={loadingBaoCao}>Thống kê</Button>
                </div>
                <ModalBaoCao dataBaoCao={ListBaoCao} onCancel={this.closeBaoCao} visible={showBaoCao}
                             filterData={filterBaoCao}/>
              </div>
            </div>

          </Col>
        </Row>
        <div className={'div-footer'}>
          <div className={'div-action'}>
            <Button type={'primary'} onClick={this.CheckIn}
                    disabled={isCheckOut || loading || (dataCMT.HoVaTen === "" || dataCMT.SoCMND === "") || role.add === 0 || user_id === 1}
            >Checkin</Button>
            <Button type={'primary'} onClick={this.CheckOut}
                    disabled={!isCheckOut || loading || role.add === 0 || user_id === 1}
            >Checkout</Button>
            <Button icon={'redo'} onClick={this.reload}>Tải lại</Button>
          </div>
          <div className={'div-action'} style={{color: "#096DD9", marginTop: 10, fontWeight: 'bold'}}>
            <ins>Lưu ý</ins>
            : Có thể nhập tên, số CMND hoặc Mã thẻ để thực hiện checkout
          </div>
        </div>
        <div className="footer-main">
          <img src={iconGo} alt="" width={30} style={{marginRight: 10}}/>
          <i>Copyright © 2010-{currentYear} <b>GO SOLUTIONS</b>. All rights</i>
        </div>
      </Wrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.CheckinOut
  };
}

export default connect(
  mapStateToProps,
  {...actions, changeCurrent}
)(CheckinOut);
