import React, { useState, useEffect } from "react";
import { Form, Input, Select, Row, Col, Modal, Button, message } from "antd";
import Constants from "../../../settings/constants";
import { upperFirstLetter } from "../../../helpers/utility";
import api from "../QuanTriHeThong/config";

const { REQUIRED } = Constants;
const { Option } = Select;

const ModalAddEditDonVi = ({
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

  const fetchDiaGioi = (ID, Cap, callback, reset = true) => {
    if (!ID) {
      callback([]);
      if (reset) {
        if (Cap === Constants.HUYEN)
          form.setFieldsValue({ HuyenID: undefined, XaID: undefined });
        if (Cap === Constants.XA) form.setFieldsValue({ XaID: undefined });
      }
      return;
    }
    api
      .DanhSachDiaGioi({ ID, Cap })
      .then((res) => {
        if (res.data.Status > 0) callback(res.data.Data);
        else message.error(res.data.Message);
      })
      .catch((err) => message.error(err.toString()));
  };

  const onChangeTinh = (TinhID, reset = true) => {
    fetchDiaGioi(
      TinhID,
      Constants.HUYEN,
      (data) => {
        setDanhSachHuyen(data);
        setDanhSachXa([]);
        if (reset) form.setFieldsValue({ HuyenID: undefined, XaID: undefined });
      },
      reset
    );
  };

  const onChangeHuyen = (HuyenID, reset = true) => {
    fetchDiaGioi(
      HuyenID,
      Constants.XA,
      (data) => {
        setDanhSachXa(data);
        if (reset) form.setFieldsValue({ XaID: undefined });
      },
      reset
    );
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
            <Form.Item label="Tỉnh/Thành phố" name="TinhID" rules={[REQUIRED]}>
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
    </Modal>
  );
};

export default ModalAddEditDonVi;
