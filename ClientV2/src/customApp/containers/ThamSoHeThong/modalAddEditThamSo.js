import React, { useEffect } from "react";
import Constants from "../../../settings/constants";
import { Modal, Form, Input, Button } from "antd";
import Select, { Option } from "../../../components/uielements/select";

const { MODAL_NORMAL, ITEM_LAYOUT3, REQUIRED } = Constants;

const ModalAddEdit = ({
  visible,
  onCancel,
  onCreate,
  loading,
  dataEdit = {},
  actions,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    // Set initial values khi mở modal hoặc dataEdit thay đổi
    form.setFieldsValue({
      SystemConfigID: dataEdit.SystemConfigID || null,
      ConfigKey: dataEdit.ConfigKey || "",
      ConfigValue:
        dataEdit.ConfigValue ||
        (dataEdit.ConfigKey === "Page_Size" ? undefined : ""),
      Description: dataEdit.Description || "",
    });
  }, [dataEdit]);

  const onOk = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values);
      })
      .catch((err) => console.log("Validate Failed:", err));
  };

  return (
    <Modal
      title={
        dataEdit.ThamSoID ? "Sửa tham số hệ thống" : "Thêm mới tham số hệ thống"
      }
      okText="Lưu"
      cancelText="Hủy"
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
          loading={loading}
          disabled={loading}
        >
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} layout="horizontal">
        <Form.Item name="SystemConfigID" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="Tham số"
          name="ConfigKey"
          {...ITEM_LAYOUT3}
          rules={[REQUIRED]}
        >
          <Input
            placeholder="Nhập tên tham số"
            autoFocus
            disabled={actions === "edit"}
          />
        </Form.Item>

        <Form.Item
          label="Giá trị"
          name="ConfigValue"
          {...ITEM_LAYOUT3}
          rules={[REQUIRED]}
        >
          {dataEdit.ConfigKey === "Page_Size" ? (
            <Select>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={30}>30</Option>
              <Option value={40}>40</Option>
            </Select>
          ) : (
            <Input placeholder="Nhập giá trị" />
          )}
        </Form.Item>

        <Form.Item label="Ghi chú" name="Description" {...ITEM_LAYOUT3}>
          <Input placeholder="Nhập ghi chú" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { ModalAddEdit };
