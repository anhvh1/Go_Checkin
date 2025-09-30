import React, { useState, useRef, useEffect } from "react";
import Constants, { MODAL_NORMAL, REQUIRED } from "../../../settings/constants";
import { Form, Row, Col, message, Modal, Input, Button, Select } from "antd";
import api from "./config";
import { ModalWrapper } from "./landingLogin.styled";
import { printComponent } from "../../../helpers/utility";
import { ReloadOutlined } from "@ant-design/icons";

const { Option } = Select;

// Step 1: Form nhập thông tin
const Step1Form = ({
  form,
  DanhSachTinh,
  DanhSachHuyen,
  onChangeTinh,
  onChangeHuyen,
}) => {
  const { getFieldValue } = form;

  return (
    <Form layout="vertical" form={form}>
      <Form.Item name="TenCoQuan" label="Tên cơ quan *" rules={[REQUIRED]}>
        <Input placeholder="Tên cơ quan *" />
      </Form.Item>

      <Row gutter={10}>
        <Col span={8}>
          <Form.Item name="TinhID" label="Tỉnh *" rules={[REQUIRED]}>
            <Select placeholder="Tỉnh *" onChange={onChangeTinh} showSearch>
              {DanhSachTinh.map((item) => (
                <Option key={item.ID} value={item.ID}>
                  {item.Ten}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="HuyenID" label="Huyện *" rules={[REQUIRED]}>
            <Select placeholder="Huyện *" onChange={onChangeHuyen} showSearch>
              {DanhSachHuyen.map((item) => (
                <Option key={item.ID} value={item.ID}>
                  {item.Ten}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="XaID" label="Xã *" rules={[REQUIRED]}>
            <Select placeholder="Xã *" showSearch />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="DiaChi" label="Địa chỉ cơ quan">
        <Input placeholder="Địa chỉ cơ quan" />
      </Form.Item>
      <Form.Item
        name="TenCanBo"
        label="Họ và tên người đăng ký *"
        rules={[REQUIRED]}
      >
        <Input
          placeholder="Họ và tên người đăng ký *"
          style={{ textTransform: "capitalize" }}
        />
      </Form.Item>
      <Form.Item
        name="Email"
        label="Email liên hệ người đăng ký *"
        rules={[
          REQUIRED,
          { type: "email", message: "Email không đúng định dạng" },
        ]}
      >
        <Input placeholder="Email liên hệ người đăng ký *" />
      </Form.Item>
      <Form.Item
        name="DienThoai"
        label="Số điện thoại người đăng ký *"
        rules={[REQUIRED]}
      >
        <Input placeholder="Số điện thoại người đăng ký *" maxLength={11} />
      </Form.Item>
    </Form>
  );
};

// Step 2: Xác nhận thông tin + capcha
const Step2Confirm = ({
  ThongTinDangKy,
  DanhSachTinh,
  DanhSachHuyen,
  DanhSachXa,
  capchaInput,
  srcCapcha,
  changeCapchaInput,
  RegCapCha,
}) => {
  const renderDiaChiFull = () => {
    const tinh = DanhSachTinh.find((item) => item.ID === ThongTinDangKy.TinhID);
    const huyen = DanhSachHuyen.find(
      (item) => item.ID === ThongTinDangKy.HuyenID
    );
    const xa = DanhSachXa.find((item) => item.ID === ThongTinDangKy.XaID);
    if (tinh && huyen && xa) {
      return `${ThongTinDangKy.DiaChi ? ThongTinDangKy.DiaChi + ", " : ""}${
        xa.Ten
      }, ${huyen.Ten}, ${tinh.Ten}`;
    }
  };

  return (
    <div className="confirm-info">
      <div className="big-row">Thông tin đăng ký sử dụng phần mềm</div>
      <div className="row">
        <span className="label">Cơ quan đăng ký</span>:{" "}
        {ThongTinDangKy.TenCoQuan}
      </div>
      <div className="row">
        <span className="label">Địa chỉ đăng ký</span>: {renderDiaChiFull()}
      </div>
      <div className="row">
        <span className="label">Họ và tên người đăng ký</span>:{" "}
        {ThongTinDangKy.TenCanBo}
      </div>
      <div className="row">
        <span className="label">Email đăng ký</span>: {ThongTinDangKy.Email}
      </div>
      <div className="row">
        <span className="label">Số điện thoại đăng ký</span>:{" "}
        {ThongTinDangKy.DienThoai}
      </div>
      <div className="row">
        <img src={srcCapcha} className="capcha-img" />
        <ReloadOutlined
          onClick={RegCapCha}
          style={{ fontSize: 18, marginLeft: 10 }}
        />
      </div>
      <div className="row">
        Mã xác thực:{" "}
        <Input
          style={{ width: 100, marginLeft: 10 }}
          value={capchaInput}
          onChange={changeCapchaInput}
        />
      </div>
    </div>
  );
};

// Step 3: Hiển thị thành công
const Step3Success = ({
  ThongTinDangKy,
  ThongTinDangKyThanhCong,
  MatKhau_MacDinh,
}) => (
  <div className="reg-success">
    <div className="message-success">Đăng ký sử dụng thành công</div>
    <div className="big-row">Thông tin đăng nhập hệ thống</div>
    <div className="row">
      <span className="label">Tài khoản đăng nhập</span>: {ThongTinDangKy.Email}
    </div>
    <div className="row">
      <span className="label">Mật khẩu</span>: {MatKhau_MacDinh}
    </div>
    <div className="row center">
      <img src={ThongTinDangKyThanhCong.QRCode} />
    </div>
  </div>
);

// Main Modal component
const ModalReg = ({
  visible,
  onCancel,
  DanhSachTinh,
  MatKhau_MacDinh,
  DangNhap,
}) => {
  const [form] = Form.useForm();
  const printRef = useRef(null);
  const canvasRef = useRef(null);

  const [DanhSachHuyen, setDanhSachHuyen] = useState([]);
  const [DanhSachXa, setDanhSachXa] = useState([]);
  const [step, setStep] = useState(1);
  const [ThongTinDangKy, setThongTinDangKy] = useState({});
  const [ThongTinDangKyThanhCong, setThongTinDangKyThanhCong] = useState({});
  const [capcha, setCapcha] = useState("");
  const [srcCapcha, setSrcCapcha] = useState("");
  const [capchaInput, setCapchaInput] = useState("");

  const upperFirstLetter = (word) =>
    word
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      values.TenCanBo = upperFirstLetter(values.TenCanBo);
      setThongTinDangKy(values);

      if (step === 1) {
        RegCapCha();
        setStep(2);
      } else if (step === 2) {
        if (capcha !== capchaInput) {
          message.destroy();
          message.warn("Mã xác thực nhập không chính xác, vui lòng thử lại");
          RegCapCha();
          return;
        }
        const response = await api.DangKyTaiKhoan(values);
        if (response.data.Status > 0) {
          setThongTinDangKyThanhCong(response.data.Data);
          setStep(3);
        } else {
          message.destroy();
          message.error(response.data.Message);
        }
      } else if (step === 3) {
        printComponent(printRef.current.innerHTML);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const RegCapCha = () => {
    let tmpCapcha = "";
    for (let i = 0; i < 6; i++) {
      let charType = Math.floor(Math.random() * 3);
      let letter =
        charType === 0
          ? 48 + Math.floor(Math.random() * 10)
          : 65 + Math.floor(Math.random() * 26);
      letter = String.fromCharCode(letter);
      if (Math.random() < 0.5) letter = letter.toLowerCase();
      tmpCapcha += letter;
    }
    const tCtx = canvasRef.current.getContext("2d");
    tCtx.canvas.width = tCtx.measureText(tmpCapcha).width + 5;
    tCtx.canvas.height = 10;
    tCtx.fillText(tmpCapcha, 0, 7);
    setCapcha(tmpCapcha);
    setSrcCapcha(tCtx.canvas.toDataURL());
    setCapchaInput("");
  };

  const changeCapchaInput = (e) => setCapchaInput(e.target.value);

  const onChangeTinh = (TinhID) => {
    if (!TinhID) {
      setDanhSachHuyen([]);
      setDanhSachXa([]);
      form.setFieldsValue({ HuyenID: undefined, XaID: undefined });
      return;
    }
    api
      .danhSachDiaGioi({ ID: TinhID, Cap: Constants.HUYEN })
      .then((res) => {
        if (res.data.Status > 0) {
          setDanhSachHuyen(res.data.Data);
          setDanhSachXa([]);
          form.setFieldsValue({ HuyenID: undefined, XaID: undefined });
        } else {
          message.error(res.data.Message);
        }
      })
      .catch((err) => message.error(err.toString()));
  };

  const onChangeHuyen = (HuyenID) => {
    if (!HuyenID) {
      setDanhSachXa([]);
      form.setFieldsValue({ XaID: undefined });
      return;
    }
    api
      .danhSachDiaGioi({ ID: HuyenID, Cap: Constants.XA })
      .then((res) => {
        if (res.data.Status > 0) {
          setDanhSachXa(res.data.Data);
          form.setFieldsValue({ XaID: undefined });
        } else {
          message.error(res.data.Message);
        }
      })
      .catch((err) => message.error(err.toString()));
  };

  return (
    <Modal
      title="Đăng ký quản lý thông tin vào ra cơ quan sử dụng QR Code"
      width={MODAL_NORMAL}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button onClick={() => (step === 2 ? setStep(1) : onCancel())}>
          {step === 2 ? "Quay lại" : "Đóng"}
        </Button>,
        <Button type="primary" onClick={onOk}>
          {step === 1 ? "Tiếp" : step === 2 ? "Xác nhận & Đăng ký" : "In"}
        </Button>,
        step === 3 && (
          <Button
            type="primary"
            onClick={() => DangNhap(ThongTinDangKyThanhCong.Email)}
          >
            Đăng nhập
          </Button>
        ),
      ]}
    >
      <ModalWrapper>
        {step === 1 && (
          <Step1Form
            form={form}
            DanhSachTinh={DanhSachTinh}
            DanhSachHuyen={DanhSachHuyen}
            onChangeTinh={onChangeTinh}
            onChangeHuyen={onChangeHuyen}
          />
        )}
        {step === 2 && (
          <Step2Confirm
            ThongTinDangKy={ThongTinDangKy}
            DanhSachTinh={DanhSachTinh}
            DanhSachHuyen={DanhSachHuyen}
            DanhSachXa={DanhSachXa}
            capchaInput={capchaInput}
            srcCapcha={srcCapcha}
            changeCapchaInput={changeCapchaInput}
            RegCapCha={RegCapCha}
          />
        )}
        {step === 3 && (
          <Step3Success
            ThongTinDangKy={ThongTinDangKy}
            ThongTinDangKyThanhCong={ThongTinDangKyThanhCong}
            MatKhau_MacDinh={MatKhau_MacDinh}
          />
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div ref={printRef} style={{ display: "none" }}>
          <div style={{ textAlign: "center" }}>
            <img
              src={ThongTinDangKyThanhCong.QRCode}
              style={{ margin: "20px 0", width: 400, height: 400 }}
            />
            <div style={{ fontWeight: "bold", fontSize: 30 }}>
              {ThongTinDangKy.TenCoQuan}
            </div>
          </div>
        </div>
      </ModalWrapper>
    </Modal>
  );
};

export default ModalReg;
