import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import api from "./config";
import Constants, { ITEM_LAYOUT3, REQUIRED } from "../../settings/constants";

const ModalChangePassword = ({ visible, onCancel, logout }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visibleLocal, setVisibleLocal] = useState(true);

  const onOk = async () => {
    try {
      const value = await form.validateFields();

      if (value.OldPassword === value.NewPassword) {
        Modal.error({
          title: "Thông báo",
          content: "Mật khẩu mới không được giống mật khẩu cũ",
        });
        return;
      }

      if (value.NewPassword.includes(" ")) {
        Modal.error({
          title: "Thông báo",
          content: "Mật khẩu không được chứa khoảng trắng",
        });
        return;
      }

      if (value.NewPassword !== value.ConfirmPassword) {
        Modal.error({
          title: "Thông báo",
          content: "Mật khẩu mới không trùng với nhập lại mật khẩu",
        });
        return;
      }

      setLoading(true);
      try {
        const response = await api.changePassword(value);
        setLoading(false);

        if (response.data.Status > 0) {
          message.success("Cập nhật mật khẩu thành công");
          onCancelLocal();
          setTimeout(() => {
            logout();
          }, 1000);
        } else {
          Modal.error({
            title: "Lỗi",
            content: response.data.Message,
          });
        }
      } catch (error) {
        setLoading(false);
        Modal.error(Constants.API_ERROR);
      }
    } catch (err) {
      // Validation lỗi, không làm gì
    }
  };

  const onCancelLocal = () => {
    setVisibleLocal(false);
    onCancel();
  };

  return (
    <Modal
      title="Thay đổi mật khẩu"
      width={650}
      visible={visible && visibleLocal}
      onCancel={onCancelLocal}
      footer={[
        <Button key="back" onClick={onCancelLocal}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={onOk}>
          Cập nhật
        </Button>,
      ]}
    >
      <Form form={form} layout="horizontal" {...ITEM_LAYOUT3}>
        <Form.Item
          name="OldPassword"
          label="Mật khẩu hiện tại"
          rules={[REQUIRED]}
        >
          <Input.Password autoFocus />
        </Form.Item>

        <Form.Item
          name="NewPassword"
          label="Mật khẩu mới"
          rules={[
            REQUIRED,
            { min: 6, message: "Mật khẩu của bạn quá ngắn" },
            { max: 30, message: "Mật khẩu của bạn quá dài" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="ConfirmPassword"
          label="Nhập lại mật khẩu mới"
          rules={[REQUIRED]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { ModalChangePassword };
