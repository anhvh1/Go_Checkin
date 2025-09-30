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
      ThongTinVaoRaID: null
    };
  }

  componentDidMount() {
    const {dataModal, CoQuanID, fromQRCode} = this.props;
    this.setState({dataModal, CoQuanID}, () => {
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
              dataModal.GapCanBo = `${dataCheckout.GapCanBo}_${dataCheckout.DonViCaNhan}`;
              dataModal.HoVaTen = dataCheckout.HoVaTen;
              dataModal.GioiTinh = dataCheckout.GioiTinh;
              dataModal.HoKhauHoKhau = dataCheckout.HoKhau;
              dataModal.DienThoai = dataCheckout.DienThoai;
              dataModal.TenCoQuan = dataCheckout.TenCoQuan;
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
    }
  };

  checkIn = () => {
    const {dataModal} = this.state;
    const {imageCMTTruoc, CoQuanID} = this.props;
    dataModal.NgaySinh = dataModal.NgaySinh ? moment(dataModal.NgaySinh).format('YYYY-MM-DD') : null;
    dataModal.NgayCapCMND = dataModal.NgayCapCMND ? moment(dataModal.NgayCapCMND).format('YYYY-MM-DD') : null;
    dataModal.AnhCMND_MTBase64 = imageCMTTruoc;
    if (!dataModal.GapCanBo) {
      message.destroy();
      message.warning('Chưa chọn đối tượng cần gặp');
      return;
    } else {
      const arr = dataModal.GapCanBo.split("_");
      dataModal.GapCanBo = arr[0];
      dataModal.DonViCaNhan = arr[1];
    }
    dataModal.DonViSuDungID = CoQuanID;
    this.setState({loading: true});
    api.Checkin(dataModal).then(response => {
      this.setState({loading: false});
      if (response.data.Status > 0) {
        this.props.CheckInSuccess(response.data.Data);
      } else {
        message.destroy();
        message.error(response.data.Message);
      }
    }).catch(error => {
      message.destroy();
      message.error(error.toString());
    })
  };

  renderContentCheckinSuccess = (dataCheckin) => {
    return <div>
      <div>Chào mừng quý khách {dataCheckin.HoVaTen} đến {dataCheckin.TenCoQuan}.</div>
      <div>Quý khách vào lúc {moment(dataCheckin.GioVao).format('HH:mm')}</div>
    </div>
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
    const {dataModal, loading, isCheckOut, GioVao} = this.state;
    return (
      <Modal
        title={`Thông tin khách ${isCheckOut ? 'check out' : 'check in'}`}
        width={400}
        visible={visible}
        onCancel={this.onCancel}
        footer={[
          <Button key="back" onClick={this.onCancel} loading={loading}>Đóng</Button>,
          <Button key="submit" htmlType="submit" type="primary" form="myForm"
                 onClick={this.onOk} loading={loading}>{isCheckOut ? 'Check Out' : 'Check In'}</Button>,
        ]}
      >
        <Styled className={'modal'}>
          <div className={'row'}>
            <div className={'label required'}>Cán bộ gặp</div>
            <div className={'input'}>
              <TreeSelect
                disabled={isCheckOut}
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
          </div>
          {isCheckOut ? <div className={'row'}>
            <div className={'label'}>Giờ vào</div>
            <div className={'input'}>
              <Input value={GioVao} readOnly/>
            </div>
          </div> : ""}
          <div className={'row'}>
            <div className={'label'}>Nơi công tác</div>
            <div className={'input'}>
              <Input readOnly={isCheckOut} onChange={e => this.changeData(e.target.value, 'TenCoQuan')}
                     value={dataModal.TenCoQuan}/>
            </div>
          </div>
          <div className={'row'}>
            <div className={'label'}>Số điện thoại</div>
            <div className={'input'}>
              <Input readOnly={isCheckOut} onChange={e => this.changeData(e.target.value, 'DienThoai')}
                     value={dataModal.DienThoai} maxLength={11}/>
            </div>
          </div>
          <div className={'row'}>
            <div className={'label'}>Họ và tên</div>
            <div className={'input'}>
              <Input onChange={e => this.changeData(e.target.value, 'HoVaTen')}
                     value={dataModal.HoVaTen} readOnly={isCheckOut}/>
            </div>
          </div>
          <div className={'row'}>
            <div className={'label'}>Giới tính</div>
            <div className={'input'}>
              <Select disabled={isCheckOut} value={dataModal.GioiTinh}
                      onChange={value => this.changeData(value, "GioiTinh")}>
                <Option value={'Nam'}>Nam</Option>
                <Option value={'Nữ'}>Nữ</Option>
              </Select>
            </div>
          </div>
          <div className={'row'}>
            <div className={'label'}>Số giấy tờ</div>
            <div className={'input'}>
              <Input readOnly={isCheckOut} onChange={e => this.changeData(e.target.value, 'SoCMND')}
                     value={dataModal.SoCMND} maxLength={12}/>
            </div>
          </div>
          <div className={'row'}>
            <div className={'label'}>Địa chỉ</div>
            <div className={'input'}>
              <TextArea readOnly={isCheckOut} rows={3} onChange={e => this.changeData(e.target.value, 'HoKhau')}
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