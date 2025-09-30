import React, {Component} from 'react';
import {Modal, Form, Input, Button, message} from 'antd';
import Styled from './styled';
import Select, {Option} from "../../../components/uielements/select";
import TreeSelect from "../../../components/uielements/treeSelect";
import moment from 'moment';
import api from './config';

const {TextArea} = Input;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataModal: {},
      loading: false,
      isCheckOut: false,
      CoQuanID: null,
      GioVao: "",
      ThongTinVaoRaID: null,
      sendSocket: false
    };
  }

  componentDidMount() {
    const {dataModal, CoQuanID, fromQRCode} = this.props;
    this.setState({dataModal, CoQuanID, sendSocket: false}, () => {
      const {dataModal} = this.state;
      if (dataModal.SoCMND) {
        const param = {
          MaThe: dataModal.SoCMND,
          LoaiCheckOut: 2,
          DonViSuDungID: fromQRCode ? dataModal.DonViSuDungID : CoQuanID
        };
        api.GetByMaThe(param).then(response => {
          if (response.data.Status > 0) {
            if (response.data.Data.length) {
              const dataCheckout = response.data.Data[0];
              // console.log(dataCheckout);
              const GioVao = moment(dataCheckout.GioVao).format("DD/MM/YYYY HH:mm");
              const ThongTinVaoRaID = dataCheckout.ThongTinVaoRaID;
              const {dataModal} = this.state;
              dataModal.HoVaTen = dataCheckout.HoVaTen;
              dataModal.GioiTinh = dataCheckout.GioiTinh;
              dataModal.HoKhauHoKhau = dataCheckout.HoKhau;
              dataModal.DienThoai = dataCheckout.DienThoai;
              dataModal.TenCoQuan = dataCheckout.TenCoQuan;
              dataModal.LyDoGap = dataCheckout.LyDoGap;
              if (dataModal.LyDoGap === 2) {
                dataModal.GapCanBo = `${dataCheckout.GapCanBo}_${dataCheckout.DonViCaNhan}`;
              }
              this.setState({isCheckOut: true, GioVao, dataModal, ThongTinVaoRaID});
            }
          }
        })
      }
    });
  }

  onCancel = () => {
    this.props.onCancel(this.state.isCheckOut, false);
  };

  onOk = (e) => {
    e.preventDefault();
    const {isCheckOut} = this.state;
    if (isCheckOut) {
      this.checkOut();
    } else {
      this.checkIn();
      // this.onCancel()
    }
  };

  checkIn = () => {
    const {dataModal} = this.state;
    const {imageCMTTruoc, CoQuanID, sessionCode, socketIO} = this.props;
    dataModal.NgaySinh = dataModal.NgaySinh ? moment(dataModal.NgaySinh).format('YYYY-MM-DD') : null;
    dataModal.NgayCapCMND = dataModal.NgayCapCMND ? moment(dataModal.NgayCapCMND).format('YYYY-MM-DD') : null;
    dataModal.AnhCMND_MTBase64 = imageCMTTruoc;

    if (!dataModal.LyDoGap) {
      message.destroy();
      message.warning('Chưa chọn lý do');
      return;
    } else {
      if (dataModal.LyDoGap === 2) {
        if (!dataModal.GapCanBo) {
          message.destroy();
          message.warning('Chưa chọn cán bộ gặp');
          return;
        }
      }
    }
    dataModal.DonViSuDungID = CoQuanID;
    const dataSocket = {
      ...dataModal,
      NgayCapCMND: dataModal.NgayCapCMND ? moment(dataModal.NgayCapCMND).format('YYYY-MM-DD') : null,
      NgaySinh: dataModal.NgaySinh ? moment(dataModal.NgaySinh).format('YYYY-MM-DD') : null,
      sessionCode,
      CoQuanSuDungPhanMem: parseInt(CoQuanID),
      AnhCMND_MTBase64: imageCMTTruoc
    };
    if (dataSocket.GapCanBo) {
      const arr = dataSocket.GapCanBo.split("_");
      dataSocket.GapCanBo = parseInt(arr[0]);
      dataSocket.DonViCaNhan = parseInt(arr[1]);
    }
    delete dataSocket.DonViSuDungID;
    if (socketIO.connectionState === 'Connected') {
      socketIO.invoke('scan', dataSocket);
      this.setState({sendSocket: true});
    }
    // this.setState({loading: true});
    // api.Checkin(dataModal).then(response => {
    //   this.setState({loading: false});
    //   if (response.data.Status > 0) {
    //     this.props.CheckInSuccess(response.data.Data);
    //   } else {
    //     message.destroy();
    //     message.error(response.data.Message);
    //   }
    // }).catch(error => {
    //   message.destroy();
    //   message.error(error.toString());
    // })
  };

  checkOut = () => {
    const {ThongTinVaoRaID} = this.state;
    if (ThongTinVaoRaID) {
      api.Checkout({ThongTinVaoRaID}).then(response => {
        if (response.data.Status > 0) {
          Modal.success({
            title: 'Thông báo',
            content: 'Checkout thành công',
            okText: 'Đóng',
            onOk: () => {
              this.props.onCancel(false, true);
            }
          });
        } else {
          message.destroy();
          message.error(response.data.Message);
        }
      }).catch(error => {
        message.destroy();
        message.error(error.toString());
      })
    }
  };

  changeData = (value, field) => {
    const {dataModal} = this.state;
    dataModal[field] = value;
    this.setState({dataModal});
  };

  render() {
    const {visible, DoiTuongGap} = this.props;
    const {dataModal, loading, isCheckOut, GioVao, sendSocket} = this.state;
    const title = isCheckOut ? 'Thông tin khách checkout' : 'Vui lòng kiểm tra lại thông tin và chọn lý do';
    return (
      <Modal
        title={title}
        width={450}
        visible={visible}
        onCancel={this.onCancel}
        footer={<Styled className={'footer-modal'}>
          {/*<Button key="back" onClick={this.onCancel} loading={loading}>Gửi thông tin</Button>*/}
          <Button key="submit" htmlType="submit" type="primary" form="myForm"
                  onClick={this.onOk} disabled={sendSocket && !isCheckOut}
                  loading={loading}>{isCheckOut ? 'Check Out' : sendSocket ? 'Lễ tân đang kiểm tra thông tin, vui lòng đợi' : 'Gửi thông tin'}</Button>,
        </Styled>}
      >
        <Styled className={'modal'}>
          <div className={'row'}>
            <div className={'label required'}>Lý do gặp</div>
            <div className={'input'}>
              <Select placeholder={'Chọn lý do gặp'} noGetPopupContainer value={dataModal.LyDoGap}
                      onChange={value => this.changeData(value, "LyDoGap")} disabled={isCheckOut || sendSocket}>
                <Option value={1}>Họp</Option>
                <Option value={2}>Gặp cán bộ</Option>
                <Option value={3}>Khác</Option>
              </Select>
            </div>
          </div>
          {dataModal.LyDoGap === 2 ? <div className={'row'}>
            <div className={'label required'}>Cán bộ gặp</div>
            <div className={'input'}>
              <TreeSelect
                disabled={isCheckOut || sendSocket}
                dropdownStyle={{maxHeight: 300, maxWidth: 200}}
                value={dataModal.GapCanBo}
                showSearch
                treeData={DoiTuongGap}
                placeholder="Chọn cán bộ cần gặp"
                allowClear
                treeDefaultExpandAll
                onChange={value => this.changeData(value, 'GapCanBo')}
              />
            </div>
          </div> : ""}
          {isCheckOut ? <div className={'row'}>
            <div className={'label'}>Giờ vào</div>
            <div className={'input'}>
              <Input value={GioVao} readOnly/>
            </div>
          </div> : ""}
          <div className={'row'}>
            <div className={'label'}>Nơi công tác</div>
            <div className={'input'}>
              <Input readOnly={isCheckOut || sendSocket} onChange={e => this.changeData(e.target.value, 'TenCoQuan')}
                     value={dataModal.TenCoQuan}/>
            </div>
          </div>
          <div className={'row'}>
            <div className={'label'}>Số điện thoại</div>
            <div className={'input'}>
              <Input readOnly={isCheckOut || sendSocket} onChange={e => this.changeData(e.target.value, 'DienThoai')}
                     value={dataModal.DienThoai} maxLength={11}/>
            </div>
          </div>
          <div className={'row'}>
            <div className={'label'}>Họ và tên</div>
            <div className={'input'}>
              <Input onChange={e => this.changeData(e.target.value, 'HoVaTen')}
                     value={dataModal.HoVaTen} readOnly={isCheckOut || sendSocket}/>
            </div>
          </div>
          <div className={'row'}>
            <div className={'label'}>Giới tính</div>
            <div className={'input'}>
              <Select disabled={isCheckOut || sendSocket} value={dataModal.GioiTinh}
                      onChange={value => this.changeData(value, "GioiTinh")}>
                <Option value={'Nam'}>Nam</Option>
                <Option value={'Nữ'}>Nữ</Option>
              </Select>
            </div>
          </div>
          <div className={'row'}>
            <div className={'label'}>Số giấy tờ</div>
            <div className={'input'}>
              <Input readOnly={isCheckOut || sendSocket} onChange={e => this.changeData(e.target.value, 'SoCMND')}
                     value={dataModal.SoCMND} maxLength={12}/>
            </div>
          </div>
          <div className={'row'}>
            <div className={'label'}>Địa chỉ</div>
            <div className={'input'}>
              <TextArea readOnly={isCheckOut || sendSocket} rows={3}
                        onChange={e => this.changeData(e.target.value, 'HoKhau')}
                        value={dataModal.HoKhau}/>
            </div>
          </div>
          {/*<div className={'row'}>*/}
          {/*  <div className={'label'}>Loại giấy tờ</div>*/}
          {/*  <div className={'input'}>*/}
          {/*    <Input readOnly={isCheckOut} onChange={e => this.changeData(e.target.value, 'LoaiGiayTo')}*/}
          {/*           value={dataModal.LoaiGiayTo}/>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </Styled>
      </Modal>
    );
  }
}