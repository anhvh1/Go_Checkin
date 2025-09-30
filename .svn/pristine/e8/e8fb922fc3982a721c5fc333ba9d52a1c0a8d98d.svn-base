import React, {Component, Fragment} from 'react';
import {message} from "antd";
import Webcam from "react-webcam";
import Styled from './styled';
import {Modal, Button} from "../../../components/uielements/exportComponent";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraChanDung: null,
      disableChup: true
    };
    this.cameraRef = React.createRef();
  }

  componentDidMount() {
    if (navigator.getUserMedia) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoInput = devices.filter(device => device.kind === "videoinput");
        if (videoInput.length) {
          const cameraChanDung = videoInput.find(item => item.label.includes('USB CAM2'));
          this.setState({cameraChanDung});
        }
      }).catch(error => {
        message.error(error.toString());
      });
    }
  }

  handlePlayChanDung = () => {
    this.setState({disableChup: false})
  };

  ChupAnh = () => {
    const {CanBoID} = this.props;
    let imageChanDung = this.cameraRef.current.getScreenshot({width: 600, height: 400});
    fetch(imageChanDung).then(res => res.blob()).then(blob => {
      const file = new File([blob], `anh_chan_dung_${CanBoID}.jpeg`);
      this.props.onOk(file, imageChanDung);
    })
  };

  render() {
    const {onCancel, visible} = this.props;
    const {cameraChanDung, disableChup} = this.state;
    const videoConstraints = {
      width: 600,
      height: 400,
    };
    return (
      <Modal
        title={'Chụp ảnh nhận diện'}
        width={700}
        onCancel={onCancel}
        visible={visible}
        footer={<div style={{textAlign: 'center'}}>
          <Button type={'primary'} disabled={disableChup} onClick={this.ChupAnh}>Chụp ảnh</Button>
          <Button onClick={onCancel}>Đóng</Button>
        </div>}
      >
        <Styled className={'modal-camera'}>
          <Webcam audio={false}
                  ref={this.cameraRef}
                  screenshotFormat="image/jpeg"
                  onUserMedia={this.handlePlayChanDung}
                  videoConstraints={{
                    ...videoConstraints,
                    deviceId: cameraChanDung && cameraChanDung.deviceId ? cameraChanDung.deviceId : ""
                  }}
                  key={cameraChanDung && cameraChanDung.deviceId ? cameraChanDung.deviceId : ""}
          />
        </Styled>
      </Modal>
    )
  }
}