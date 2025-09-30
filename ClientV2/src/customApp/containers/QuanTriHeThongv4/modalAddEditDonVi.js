import React, { useState, useEffect } from "react";
import { Form, Input, Select, Row, Col, Modal, Button, message } from "antd";
import Constants from "../../../settings/constants";
import { upperFirstLetter } from "../../../helpers/utility";
import api from "../QuanTriHeThong/config";
import Styled from "./styled";

const { REQUIRED } = Constants;
const { Option } = Select;

const ModalAddEditTaiKhoan = ({
  visible,
  onCancel,
  onCreate,
  dataEdit = {},
  loading,
  DanhSachTinh = [],
}) => {
  const [form] = Form.useForm();
  const [DanhSachHuyen, setDanhSachHuyen] = useState([]);
  const [DanhSachXa, setDanhSachXa] = useState([]);

  useEffect(() => {
    if (dataEdit && dataEdit.CoQuanID) {
      form.setFieldsValue({ ...dataEdit });
      onChangeTinh(dataEdit.TinhID, false);
      onChangeHuyen(dataEdit.HuyenID, false);
    }
  }, [dataEdit]);

  const fetchDiaGioi = async (ID, Cap) => {
    if (!ID) return [];
    try {
      const response = await api.DanhSachDiaGioi({ ID, Cap });
      if (response.data.Status > 0) return response.data.Data;
      else {
        message.error(response.data.Message);
        return [];
      }
    } catch (error) {
      message.error(error.toString());
      return [];
    }
  };

  const onChangeTinh = async (TinhID, reset = true) => {
    const huyenData = await fetchDiaGioi(TinhID, Constants.HUYEN);
    setDanhSachHuyen(huyenData);
    setDanhSachXa([]);
    if (reset) form.setFieldsValue({ HuyenID: undefined, XaID: undefined });
  };

  const onChangeHuyen = async (HuyenID, reset = true) => {
    const xaData = await fetchDiaGioi(HuyenID, Constants.XA);
    setDanhSachXa(xaData);
    if (reset) form.setFieldsValue({ XaID: undefined });
  };

  const onOk = () => {
    form
      .validateFields()
      .then((values) => {
        values.TenCanBo = upperFirstLetter(values.TenCanBo);
        onCreate(values);
      })
      .catch((info) => console.log("Validate Failed:", info));
  };

  const inputNum = (e) => {
    const key = e.charCode;
    if (key < 48 || key > 57) e.preventDefault();
  };

  return (
    <Modal
      title={`${dataEdit.CoQuanID ? "Sửa" : "Thêm"} thông tin đơn vị`}
      visible={visible}
      onCancel={onCancel}
      width={650}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={onOk} loading={loading}>
          Lưu
        </Button>,
      ]}
    >
      <Styled className="modal">
        <Form form={form} layout="vertical">
          <Form.Item name="CoQuanID" initialValue={null} hidden />
          <Form.Item name="CanBoID" initialValue={null} hidden />
          <Form.Item name="NguoiDungID" initialValue={null} hidden />
          <Form.Item name="TrangThai" initialValue={true} hidden />

          <Form.Item label="Tên đơn vị" name="TenCoQuan" rules={[REQUIRED]}>
            <Input autoFocus />
          </Form.Item>

          <Row gutter={10}>
            <Col span={8}>
              <Form.Item
                label="Tỉnh/Thành phố"
                name="TinhID"
                rules={[REQUIRED]}
              >
                <Select showSearch onChange={onChangeTinh}>
                  {DanhSachTinh.map((item) => (
                    <Option key={item.ID} value={item.ID}>
                      {item.Ten}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Quận/Huyện" name="HuyenID" rules={[REQUIRED]}>
                <Select showSearch onChange={onChangeHuyen}>
                  {DanhSachHuyen.map((item) => (
                    <Option key={item.ID} value={item.ID}>
                      {item.Ten}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Xã/Phường" name="XaID" rules={[REQUIRED]}>
                <Select showSearch>
                  {DanhSachXa.map((item) => (
                    <Option key={item.ID} value={item.ID}>
                      {item.Ten}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Địa chỉ đơn vị" name="DiaChi">
            <Input />
          </Form.Item>

          <Form.Item
            label="Họ và tên quản trị"
            name="TenCanBo"
            rules={[REQUIRED]}
          >
            <Input style={{ textTransform: "capitalize" }} />
          </Form.Item>

          <Form.Item
            label="Email liên hệ"
            name="Email"
            rules={[
              REQUIRED,
              { type: "email", message: "Email không đúng định dạng" },
            ]}
          >
            <Input />
          </Form.Item>

          {dataEdit.CoQuanID && (
            <Form.Item
              label="Tên người dùng"
              name="TenNguoiDung"
              rules={[REQUIRED]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item label="Số điện thoại" name="DienThoai" rules={[REQUIRED]}>
            <Input maxLength={11} onKeyPress={inputNum} />
          </Form.Item>
        </Form>
      </Styled>
    </Modal>
  );
};

export default ModalAddEditTaiKhoan;
