import React, {Component} from 'react';
import {Modal, Form, Input, Button, message} from 'antd';
import Styled from './styled';
import Select, {Option} from "../../../components/uielements/select";
import TreeSelect from "../../../components/uielements/treeSelect";
import moment from 'moment';
import api from './config';
import download from 'downloadjs';

export default class extends Component {
  constructor(props) {
    super(props);
    this.printRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {

  }

  onCancel = () => {
    Modal.confirm({
      title: 'Thông báo',
      content: 'Quý khách có muốn đóng cửa sổ này không ?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        this.props.onCancel();
      }
    });
  };

  onOk = (e) => {
    e.preventDefault();
    this.props.CheckOut();
  };

  downloadQR = () => {
    const {dataCheckin} = this.props;
    const a = document.createElement("a"); //Create <a>
    a.href = dataCheckin.QRCode; //Image Base64 Goes here
    a.target = '_blank';
    a.download = `Checkout-${dataCheckin.HoVaTen}.png`; //File name Here
    a.click(); //Downloaded file
  };

  render() {
    const {visible, dataCheckin} = this.props;
    const {loading} = this.state;
    return (
      <Modal
        title=""
        width={450}
        visible={visible}
        onCancel={this.onCancel}
        footer={[
          <Button key="submit" htmlType="submit" type="primary" form="myForm"
                  onClick={this.downloadQR} loading={loading}>Tải xuống</Button>,
          <Button key="submit" htmlType="submit" type="primary" form="myForm"
                  onClick={this.onOk} loading={loading}>Check Out</Button>,
        ]}
      >
        <Styled className={'checkin-success'}>
          <div className={'title row center'}>Checkin thành công</div>
          <div className={'row'}>
            Chào mừng quý khách {dataCheckin.HoVaTen} đến {dataCheckin.TenDonViSuDung} !
          </div>
          <div className={'row'}>
            Quý khách vào lúc {moment(dataCheckin.GioVao).format('HH:mm')}
          </div>
          <div>
            <div className={'row'}>
              Mã checkin của quý khách:
            </div>
            <div className={'row center'}>
              <img src={dataCheckin.QRCode}/>
            </div>
          </div>
          <div className={'row center'}>
            Quý khách vui lòng lưu trữ lại mã QR này để sử dụng cho mục đích kiểm tra nội bộ. Xin cảm ơn !
          </div>
        </Styled>
      </Modal>
    );
  }
}