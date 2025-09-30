import React, {Component} from 'react';
import {Modal, Button} from 'antd';
import styled from 'styled-components';
import {printComponent} from "../../../helpers/utility";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  .img-qr {
    margin: 20px 0;
    
    img {
      width: 250px;
      max-width: 250px;
      height: 250px;
      max-height: 250px;
    }
  }
`;

export default class extends Component {
  constructor(props) {
    super(props);
    this.refPrint = React.createRef();
    this.state = {};
  }

  onOk = (e) => {
    e.preventDefault();
    printComponent(this.refPrint.current.innerHTML);
  };

  render() {
    const {confirmLoading, visible, onCancel, CoQuanQR} = this.props;
    if (!CoQuanQR) {
      return null;
    }
    return (
      <Modal
        title="Mã Checkin"
        width={400}
        visible={visible}
        onCancel={onCancel}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button key="back" onClick={onCancel}>Đóng</Button>
            <Button key="submit" htmlType="submit" type="primary" form="myForm"
                    loading={confirmLoading} onClick={this.onOk}>In</Button>
          </div>
        }
      >
        <Wrapper>
          <div ref={this.refPrint}>
            <div className={'img-qr'}>
              <img src={CoQuanQR.QRCode} alt=""/>
            </div>
            <div style={{marginTop: 20, textAlign: "center", fontWeight: "bold"}}>{CoQuanQR.TenCoQuan}</div>
          </div>
        </Wrapper>
      </Modal>
    );
  }
}