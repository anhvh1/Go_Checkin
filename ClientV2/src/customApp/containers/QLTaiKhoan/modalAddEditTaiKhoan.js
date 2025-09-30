import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Radio,
  Modal,
  TreeSelect,
  message,
  Select,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import Constants, { VaiTro } from "../../../settings/constants";
import { upperFirstLetter } from "../../../helpers/utility";
import apiPhanQuyen from "../QLPhanQuyen/config";

const { Item } = Form;
const { Group } = Radio;
const { Option } = Select;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) message.error("Sai định dạng ảnh (JPG hoặc PNG)");
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) message.error("File ảnh phải nhỏ hơn 1MB");
  return isJpgOrPng && isLt2M;
}

const ModalAddEdit = ({
  visible,
  onCancel,
  onCreate,
  dataEdit = {},
  DanhSachCoQuan = [],
  DanhSachNhomNguoiDungAll = [],
  loading,
  actions,
}) => {
  const [form] = Form.useForm();
  const [AnhHoSo, setAnhHoSo] = useState(dataEdit.AnhHoSo || "");
  const [error, setError] = useState(false);
  const [DanhSachNhomNguoiDung, setDanhSachNhomNguoiDung] = useState(
    actions === "edit" ? dataEdit.DanhSachNhomNguoiDung || [] : []
  );

  useEffect(() => {
    form.setFieldsValue({
      CanBoID: dataEdit.CanBoID || null,
      TenNguoiDung: dataEdit.TenNguoiDung || "",
      TenCanBo: dataEdit.TenCanBo || "",
      GioiTinh: dataEdit.GioiTinh != undefined ? dataEdit.GioiTinh : 1,
      CoQuanID: dataEdit.CoQuanID || undefined,
      ListNhomNguoiDungID: dataEdit.ListNhomNguoiDungID || [],
    });
  }, [dataEdit, form]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      values.TenCanBo = upperFirstLetter(values.TenCanBo);
      values.AnhHoSo = AnhHoSo;
      values.LaLeTan = true; // hoặc xử lý tuỳ logic
      values.XemTaiLieuMat = true;
      values.VaiTro = 2;
      onCreate(values);
      setAnhHoSo("");
    } catch (err) {
      console.log("Validation failed", err);
    }
  };

  const checkDuplicate = (e) => {
    const value = e.target.value.toLowerCase();
    const data = DanhSachNhomNguoiDungAll.filter(
      (item) => item.TenNguoiDung === value
    );
    if (data.length > 0) {
      if (actions === "edit" && data[0].TenNguoiDung === dataEdit.TenNguoiDung)
        return;
      form.setFields([
        { name: "TenNguoiDung", errors: ["Tài khoản đã tồn tại"] },
      ]);
      setError(true);
    } else {
      const myRg = /[^0-9a-zA-Z_@.\s]/g;
      if (myRg.test(value)) {
        form.setFields([
          { name: "TenNguoiDung", errors: ["Tên đăng nhập không hợp lệ"] },
        ]);
        setError(true);
      } else {
        form.setFields([{ name: "TenNguoiDung", errors: [] }]);
        setError(false);
      }
    }
  };

  const changeCoQuan = async (value) => {
    form.setFieldsValue({ ListNhomNguoiDungID: [] });
    if (value) {
      const response = await apiPhanQuyen.DanhSachNhomByCoQuanID({
        CoQuanID: value,
      });
      if (response.data.Status > 0)
        setDanhSachNhomNguoiDung(response.data.Data);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Tải ảnh lên</div>
    </div>
  );

  return (
    <Modal
      title={
        actions === "edit"
          ? "Sửa thông tin tài khoản"
          : "Thêm thông tin tài khoản"
      }
      width={500}
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
          disabled={loading || error}
        >
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} layout="horizontal">
        <Item label="Tên tài khoản" required>
          <Form.Item
            name="TenNguoiDung"
            noStyle
            rules={[{ required: true, message: "Thông tin bắt buộc" }]}
          >
            <Input autoFocus onChange={checkDuplicate} />
          </Form.Item>
        </Item>

        <Item label="Tên cán bộ" required>
          <Form.Item
            name="TenCanBo"
            noStyle
            rules={[{ required: true, message: "Thông tin bắt buộc" }]}
          >
            <Input style={{ textTransform: "capitalize" }} />
          </Form.Item>
        </Item>

        <Item label="Giới tính">
          <Form.Item name="GioiTinh" noStyle>
            <Group>
              <Radio value={1}>Nam</Radio>
              <Radio value={0}>Nữ</Radio>
            </Group>
          </Form.Item>
        </Item>

        <Item label="Nơi công tác" required>
          <Form.Item
            name="CoQuanID"
            noStyle
            rules={[{ required: true, message: "Thông tin bắt buộc" }]}
          >
            <TreeSelect
              showSearch
              treeData={DanhSachCoQuan}
              placeholder="Chọn cơ quan"
              allowClear
              treeDefaultExpandAll
              onChange={changeCoQuan}
            />
          </Form.Item>
        </Item>

        <Item label="Phân quyền">
          <Form.Item name="ListNhomNguoiDungID" noStyle>
            <Select placeholder="Chọn nhóm người dùng" mode="multiple">
              {DanhSachNhomNguoiDung.map((e) => (
                <Option value={e.NhomNguoiDungID} key={e.NhomNguoiDungID}>
                  {e.TenNhom}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Item>
      </Form>
    </Modal>
  );
};

export { ModalAddEdit };
