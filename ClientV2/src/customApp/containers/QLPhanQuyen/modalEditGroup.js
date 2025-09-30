import React, { useState, useEffect } from "react";
import Constants, {
  MODAL_NORMAL,
  ITEM_LAYOUT3,
  REQUIRED,
} from "../../../settings/constants";
import { Modal, Form, Input, Radio, Button } from "antd";
import TreeSelect from "../../../components/uielements/treeSelect";

const ModalEditGroup = ({
  visible,
  onCancel,
  confirmLoading,
  dataModalEditGroup,
  onCreate,
}) => {
  const [form] = Form.useForm();
  const [ready, setReady] = useState(false);
  const [DanhSachCoQuan, setDanhSachCoQuan] = useState([]);
  const [applyType, setApplyType] = useState("1");

  useEffect(() => {
    const { Data, DanhSachCoQuan } = dataModalEditGroup;
    if (!Data) return;

    let initialApplyType = "1";
    let DanhSachCoQuanID = [];
    if (Data.DanhSachCoQuan && Data.DanhSachCoQuan.length) {
      initialApplyType = "2";
      DanhSachCoQuanID = Data.DanhSachCoQuan.map((item) => `${item.CoQuanID}`);
    }

    setDanhSachCoQuan(DanhSachCoQuan);
    setApplyType(initialApplyType);
    setReady(true);

    form.setFieldsValue({
      NhomNguoiDungID: Data.NhomNguoiDungID,
      TenNhom: Data.TenNhom,
      field2: initialApplyType,
      DanhSachCoQuanID,
      GhiChu: Data.GhiChu || "",
    });
  }, [dataModalEditGroup, form]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      const DanhSachCoQuanID = applyType !== "1" ? values.DanhSachCoQuanID : [];
      onCreate({ ...values, DanhSachCoQuanID });
    } catch (err) {
      // validation failed
    }
  };

  if (!ready) return null;

  return (
    <Modal
      title="Sửa thông tin nhóm người dùng"
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
        <Form.Item style={{ display: "none" }} name="NhomNguoiDungID">
          <Input />
        </Form.Item>
        <Form.Item
          label="Tên nhóm người dùng"
          {...ITEM_LAYOUT3}
          name="TenNhom"
          rules={[{ ...REQUIRED }]}
        >
          <Input autoFocus />
        </Form.Item>
        <Form.Item
          label="Cơ quan áp dụng"
          {...ITEM_LAYOUT3}
          name="field2"
          rules={[{ ...REQUIRED }]}
        >
          <Radio.Group onChange={(e) => setApplyType(e.target.value)}>
            <Radio value="1">Tất cả cơ quan</Radio>
            <Radio value="2">Một số cơ quan</Radio>
          </Radio.Group>
        </Form.Item>
        {applyType !== "1" && (
          <Form.Item
            label="Chọn cơ quan"
            {...ITEM_LAYOUT3}
            name="DanhSachCoQuanID"
            rules={[{ ...REQUIRED }]}
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
        <Form.Item label="Ghi chú" {...ITEM_LAYOUT3} name="GhiChu">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { ModalEditGroup };
