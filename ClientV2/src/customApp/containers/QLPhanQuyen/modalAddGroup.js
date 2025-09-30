import React, { useState, useEffect } from "react";
import Constants, {
  MODAL_NORMAL,
  ITEM_LAYOUT3,
  REQUIRED,
} from "../../../settings/constants";
import { Modal, Form, Input, Radio, Button } from "antd";
import TreeSelect from "../../../components/uielements/treeSelect";

const ModalAddGroup = ({
  visible,
  onCancel,
  confirmLoading,
  dataModalAddGroup,
  onCreate,
}) => {
  const [form] = Form.useForm();
  const [applyType, setApplyType] = useState("1");
  const [DanhSachCoQuan, setDanhSachCoQuan] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { DanhSachCoQuan } = dataModalAddGroup;
    setDanhSachCoQuan(DanhSachCoQuan || []);
    setReady(true);
  }, [dataModalAddGroup]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      let DanhSachCoQuanID = [];
      if (applyType !== "1") {
        DanhSachCoQuanID = values.DanhSachCoQuanID || [];
      }
      onCreate({ ...values, DanhSachCoQuanID });
    } catch (err) {
      // validation error
    }
  };

  if (!ready) return null;

  return (
    <Modal
      title="Thêm thông tin nhóm người dùng"
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
      <Form id="myForm" layout="horizontal" form={form}>
        <Form.Item
          label="Tên nhóm người dùng"
          name="TenNhom"
          {...ITEM_LAYOUT3}
          rules={[REQUIRED]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item
          label="Cơ quan áp dụng"
          name="field2"
          {...ITEM_LAYOUT3}
          initialValue={applyType}
          rules={[REQUIRED]}
        >
          <Radio.Group
            onChange={(e) => setApplyType(e.target.value.toString())}
          >
            <Radio value="1">Tất cả cơ quan</Radio>
            <Radio value="2">Một số cơ quan</Radio>
          </Radio.Group>
        </Form.Item>

        {applyType !== "1" && (
          <Form.Item
            label="Chọn cơ quan"
            name="DanhSachCoQuanID"
            {...ITEM_LAYOUT3}
            rules={[REQUIRED]}
          >
            <TreeSelect
              showSearch
              treeData={DanhSachCoQuan}
              style={{ width: "100%" }}
              placeholder="Vui lòng chọn một hoặc nhiều cơ quan áp dụng"
              allowClear
              multiple
              treeDefaultExpandAll
            />
          </Form.Item>
        )}

        <Form.Item label="Ghi chú" name="GhiChu" {...ITEM_LAYOUT3}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { ModalAddGroup };
