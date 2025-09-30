import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import {
  MODAL_NORMAL,
  ITEM_LAYOUT3,
  REQUIRED,
} from "../../../settings/constants";

const ModalAddEdit = ({
  visible,
  onCancel,
  dataEdit = {},
  onCreate,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    // Nếu có dataEdit, set giá trị mặc định
    form.setFieldsValue({
      ChucVuID: dataEdit.ChucVuID || null,
      TenChucVu: dataEdit.TenChucVu || "",
      GhiChu: dataEdit.GhiChu || "",
    });
  }, [dataEdit, form]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      onCreate(values);
    } catch (err) {
      // Validation lỗi, không làm gì
    }
  };

  return (
    <Modal
      title={
        dataEdit.ChucVuID ? "Sửa thông tin chức vụ" : "Thêm thông tin chức vụ"
      }
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
          onClick={onOk}
          disabled={loading}
          loading={loading}
        >
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} layout="horizontal" {...ITEM_LAYOUT3}>
        <Form.Item name="ChucVuID" style={{ display: "none" }}>
          <Input />
        </Form.Item>

        <Form.Item
          name="TenChucVu"
          label="Tên chức vụ"
          rules={[
            REQUIRED,
            { max: 50, message: "Tên chức vụ không được quá 50 ký tự" },
          ]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item name="GhiChu" label="Ghi chú">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { ModalAddEdit };
