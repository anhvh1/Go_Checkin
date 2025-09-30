import React, { useState, useEffect } from "react";
import Constants, {
  MODAL_NORMAL,
  ITEM_LAYOUT3,
  REQUIRED,
} from "../../../settings/constants";
import { Modal, Form, Input, Button } from "antd";
import Select, { Option } from "../../../components/uielements/select";

const ModalAddUser = ({
  visible,
  onCancel,
  confirmLoading,
  dataModalAddUser,
  onCreate,
}) => {
  const [form] = Form.useForm();
  const [ready, setReady] = useState(false);
  const [NhomNguoiDungID, setNhomNguoiDungID] = useState(0);
  const [DanhSachNguoiDung, setDanhSachNguoiDung] = useState([]);

  useEffect(() => {
    const { NhomNguoiDungID, DanhSachNguoiDung } = dataModalAddUser;
    setNhomNguoiDungID(NhomNguoiDungID);
    setDanhSachNguoiDung(DanhSachNguoiDung);
    setReady(NhomNguoiDungID);
    form.setFieldsValue({ NhomNguoiDungID });
  }, [dataModalAddUser, form]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      onCreate(values);
    } catch (err) {
      // validation failed
    }
  };

  if (!ready) return null;

  return (
    <Modal
      title="Thêm người dùng vào nhóm"
      width={MODAL_NORMAL}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          form="myForm"
          htmlType="submit"
          loading={confirmLoading}
          onClick={onOk}
        >
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} id="myForm" layout="horizontal">
        <Form.Item
          style={{ display: "none" }}
          name="NhomNguoiDungID"
          initialValue={NhomNguoiDungID}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Chọn người dùng"
          {...ITEM_LAYOUT3}
          name="NguoiDungID"
          rules={[{ ...REQUIRED }]}
        >
          <Select showSearch placeholder="Chọn người dùng">
            {DanhSachNguoiDung.map((user) => (
              <Option key={user.NguoiDungID} value={user.NguoiDungID}>
                {`${user.TenNguoiDung} (${user.TenCanBo} - ${user.TenCoQuan})`}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { ModalAddUser };
