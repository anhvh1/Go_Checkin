import React, { Component } from 'react';
import Constants, { MODAL_NORMAL, ITEM_LAYOUT3, REQUIRED} from '../../../settings/constants';
import { Modal, Form, Input, Button } from 'antd';
import Select, {Option} from "../../../components/uielements/select";
const { Item } = Form;

const ModalAddUser = Form.create({ name: 'modal_add_adTemplate' })(
  // eslint-disable-next-line
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        allRight: false,
        NhomNguoiDungID: 0,
        DanhSachNguoiDung: []
      };
    }
    componentDidMount() {
      const {NhomNguoiDungID, DanhSachNguoiDung} = this.props.dataModalAddUser;
      this.setState({
        allRight: NhomNguoiDungID,
        NhomNguoiDungID,
        DanhSachNguoiDung
      });
    }
    onOk = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, value) => {
        if (!err) {
          const { onCreate } = this.props;
          onCreate(value);
        }
      });
    };
    render() {
      if(!this.state.allRight) return null;
      const { confirmLoading, visible, onCancel, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          title="Thêm người dùng vào nhóm"
          width={MODAL_NORMAL}
          visible={visible}
          onCancel={onCancel}
          footer={[
            <Button key="back" onClick={onCancel}>Hủy</Button>,
            <Button key="submit" htmlType="submit" type="primary" form="myForm"
                    loading={confirmLoading} onClick={this.onOk}>Lưu</Button>,
          ]}
        >
          <Form id="myForm" layout="horizontal">
            <Item style={{display: "none"}}>
              {getFieldDecorator('NhomNguoiDungID', {
                initialValue: this.state.NhomNguoiDungID
              })(<Input />)}
            </Item>
            <Item label="Chọn người dùng" {...ITEM_LAYOUT3}>
              {getFieldDecorator('NguoiDungID', {
                rules: [{ ...REQUIRED }]
              })(
                <Select showSearch placeholder="Chọn người dùng">
                  {this.state.DanhSachNguoiDung.map((value) => (
                    <Option key={value.NguoiDungID} value={value.NguoiDungID}>
                      {`${value.TenNguoiDung} (${value.TenCanBo} - ${value.TenCoQuan})`}
                    </Option>
                  ))}
                </Select>,
              )}
            </Item>
          </Form>
        </Modal>
      );
    }
  },
);
export { ModalAddUser }