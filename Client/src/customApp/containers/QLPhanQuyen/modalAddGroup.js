import React, { Component } from 'react';
import Constants, { MODAL_NORMAL, ITEM_LAYOUT3, REQUIRED} from '../../../settings/constants';
import { Modal, Form, Input, Radio, Button } from 'antd';
import TreeSelect from '../../../components/uielements/treeSelect'
const { Item } = Form;

const ModalAddGroup = Form.create({ name: 'modal_add_adTemplate' })(
  // eslint-disable-next-line
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        allRight: false,
        DanhSachCoQuan: [],
        applyType: "1"
      };
    }
    componentDidMount() {
      const {DanhSachCoQuan, DanhSachCoQuanID} = this.props.dataModalAddGroup;
      this.setState({
        allRight: true,
        DanhSachCoQuan,
      });
    }
    onOk = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, value) => {
        if (!err) {
          let DanhSachCoQuanID = [];
          if(this.state.applyType !== "1"){
            DanhSachCoQuanID = value.DanhSachCoQuanID;
          }
          value = {...value, DanhSachCoQuanID};
          const { onCreate } = this.props;
          onCreate(value);
        }
      });
    };
    onChangeApplyType = (e) => {
      this.setState({
        applyType: e.target.value.toString(),
      });
    };

    render() {
      if(!this.state.allRight) return null;
      const { confirmLoading, visible, onCancel, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          title="Thêm thông tin nhóm người dùng"
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
            <Item label="Tên nhóm người dùng" {...ITEM_LAYOUT3}>
              {getFieldDecorator('TenNhom', {
                rules: [{ ...REQUIRED }],
              })(<Input autoFocus />)}
            </Item>
            <Item label="Cơ quan áp dụng" {...ITEM_LAYOUT3}>
              {getFieldDecorator('field2', {
                rules: [{...REQUIRED}],
                initialValue: this.state.applyType,
              })(
                <Radio.Group onChange={this.onChangeApplyType}>
                  <Radio value="1">Tất cả cơ quan</Radio>
                  <Radio value="2">Một số cơ quan</Radio>
                </Radio.Group>,
              )}
            </Item>
            {
              this.state.applyType !== "1"
                ?
                <Item label="Chọn cơ quan" {...ITEM_LAYOUT3}>
                  {getFieldDecorator('DanhSachCoQuanID', {
                    rules: [{...REQUIRED}]
                  })(
                    <TreeSelect
                      showSearch
                      treeData={this.state.DanhSachCoQuan}
                      style={{ width: '100%' }}
                      placeholder="Vui lòng chọn một hoặc nhiều cơ quan áp dụng"
                      allowClear
                      multiple
                      treeDefaultExpandAll
                    />
                  )}
                </Item>
                : ""
            }
            <Item label="Ghi chú" {...ITEM_LAYOUT3}>
              {getFieldDecorator('GhiChu')(<Input.TextArea />)}
            </Item>
          </Form>
        </Modal>
      );
    }
  },
);
export { ModalAddGroup }