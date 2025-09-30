import React, { Component } from "react";
import { Button, Modal } from "../../../components/uielements/exportComponent";
import Wrapper from "./modal.styled";
import { CloseOutlined } from "@ant-design/icons";

export default class extends Component {
  constructor(props) {
    super(props);
    this.refPrint = React.createRef();
    this.state = {};
  }

  deleteLine = (e, index) => {
    e.stopPropagation();
    this.props.deleteLine(index);
  };

  render() {
    const { visible, onCancel, listCheckin, chooseLine } = this.props;

    return (
      <Modal
        title={"Danh sách hàng đợi checkin"}
        width={450}
        onCancel={onCancel}
        visible={visible}
        footer={null}
      >
        <Wrapper>
          <div className={"queue-container"}>
            {listCheckin.map((item, index) => (
              <div className={"queue-item"} onClick={() => chooseLine(index)}>
                <div className={"item"}>
                  {item.HoVaTen} - Số giấy tờ: {item.SoCMND}
                </div>
                <div className={"action"}>
                  <CloseOutlined onClick={(e) => this.deleteLine(e, index)} />
                </div>
              </div>
            ))}
          </div>
        </Wrapper>
      </Modal>
    );
  }
}
