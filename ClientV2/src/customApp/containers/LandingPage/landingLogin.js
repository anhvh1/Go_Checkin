import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Button from "../../../components/uielements/button";
import authAction from "../../../redux/auth/actions";
import appAction from "../../../redux/app/actions";
import { Row, Col, Tooltip, Modal, Input, message } from "antd";
import iconGo from "../../../image/logoGo.png";
import lock from "../../../image/lock.png";
import api from "./config";
import { isFullLocalStorage } from "../../../helpers/utility";
import LandingWrapper from "./landingLogin.styled";
import QRCode_example from "../../../image/QR code.png";
import ModalDangKy from "./modalDangKy";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { login } = authAction;
const { clearMenu } = appAction;
const date = new Date();
const currentYear = date.getFullYear();

class LandingLogin extends Component {
  constructor(props) {
    document.title = "Go checkin";
    super(props);
    this.state = {
      loading: false,
      username: "",
      password: "",
      messageError: "",
      address: {},
      DanhSachTinh: [],
      modalKey: 0,
      visibleModalDangKy: false,
      MatKhau_MacDinh: "",
    };
  }

  componentDidMount = async () => {
    const ThongTinHoTro = await api.getDataConfig({
      ConfigKey: "Thong_Tin_Ho_Tro",
    });
    if (
      ThongTinHoTro &&
      ThongTinHoTro.data &&
      ThongTinHoTro.data.Status > 0 &&
      ThongTinHoTro.data.Data.ConfigValue
    ) {
      const addressArray = ThongTinHoTro.data.Data.ConfigValue.split(";");
      this.setState({
        address: {
          phoneNumber: addressArray[0] ? addressArray[0] : "----.----.---",
          email: addressArray[1] ? addressArray[1] : "----@gosol.com.vn",
        },
      });
    }
    //
    const tinh = await api.danhSachDiaGioi({ ID: 0, Cap: 1 });
    if (tinh.data.Status > 0) {
      this.setState({ DanhSachTinh: tinh.data.Data });
    }
    //
    const matkhau = await api.getDataConfig({ ConfigKey: "MatKhau_MacDinh" });
    if (matkhau.data.Status > 0) {
      this.setState({ MatKhau_MacDinh: matkhau.data.Data.ConfigValue });
    }
  };

  handleLogin = () => {
    this.setState({ loading: true }, () => {
      setTimeout(() => {
        const username = this.state.username;
        const password = this.state.password;
        //check api
        if (username && password) {
          const data = {
            UserName: username,
            Password: password,
          };
          api
            .dangNhap(data)
            .then((response) => {
              if (response.data.Status > 0) {
                const dataLogin = response.data;
                this.setState(
                  {
                    loading: false,
                    username: "",
                    password: "",
                    messageError: "",
                  },
                  () => {
                    const { login, clearMenu } = this.props;
                    login(dataLogin);
                    clearMenu();
                  }
                );
              } else {
                this.setState({
                  loading: false,
                  messageError: response.data.Message,
                });
              }
            })
            .catch((error) => {
              this.systemError();
            });
        } else {
          this.setState({
            loading: false,
            messageError: "Vui lòng nhập đầy đủ thông tin!",
          });
        }
      }, 500);
    });
  };

  setUsername = (value) => {
    this.setState({ username: value });
  };

  setPassword = (value) => {
    this.setState({ password: value });
  };

  _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.handleLogin();
    }
  };

  systemError = () => {
    this.setState({
      loading: false,
    });
    Modal.error({
      title: "Không thể đăng nhập",
      content: "Đã có lỗi xảy ra ...",
    });
  };

  onProcess = () => {
    message.destroy();
    message.info("Chức năng đang xây dựng");
  };

  openFormDangKy = () => {
    let { modalKey } = this.state;
    modalKey++;
    this.setState({ visibleModalDangKy: true, modalKey });
  };

  closeModalDangKy = () => {
    this.setState({ visibleModalDangKy: false });
  };

  submitDangKy = (value) => {
    const { MatKhau_MacDinh } = this.state;
    this.setState({ loading: true });
    api
      .DangKyTaiKhoan(value)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.Status > 0) {
          this.closeModalDangKy();
          Modal.success({
            title: "Thông báo",
            content: (
              <div>
                Đăng ký sử dụng hệ thống thành công. Vui lòng sử dụng{" "}
                <b>Email đăng ký</b> và mặt khẩu
                <b>{MatKhau_MacDinh}</b> để đăng nhập
              </div>
            ),
            okText: "Đóng",
          });
        } else {
          message.destroy();
          message.error(response.data.Message);
        }
      })
      .catch((error) => {
        message.destroy();
        message.error(error.toString());
      });
  };

  DangNhap = (user) => {
    const { MatKhau_MacDinh } = this.state;
    this.setState(
      { visibleModalDangKy: false, username: user, password: MatKhau_MacDinh },
      () => {
        this.handleLogin();
      }
    );
  };

  render() {
    const { messageError, username, password, loading, address } = this.state;
    const { DanhSachTinh, visibleModalDangKy, modalKey, MatKhau_MacDinh } =
      this.state;

    const from = { pathname: "/dashboard" };
    //reduxStorage data -> this.props.reducerToken
    const reduxStorageNotNull = this.props.reducerToken !== null;
    const localStorageNotNull = isFullLocalStorage();
    const isLoggedIn = reduxStorageNotNull || localStorageNotNull;
    if (isLoggedIn) {
      return <Redirect to={from} />;
    } else {
      localStorage.clear();
    }
    return (
      <LandingWrapper>
        <div className={"header-landing"}>
          Phần mềm lễ tân số - Quản lý khách vào ra cơ quan Go Checkin
        </div>
        <Row>
          <Col
            xs={24}
            sm={24}
            md={10}
            lg={10}
            xl={8}
            className={"col-login flex-center"}
          >
            <div className={"main-login flex-center"}>
              <div className={"go-title"}>Go - Checkin</div>
              <div className={"login-input"}>
                <div className={"row"}>
                  <Input
                    prefix={<UserOutlined />}
                    placeholder={"Tên tài khoản"}
                    value={username}
                    onChange={(e) => this.setUsername(e.target.value)}
                    onKeyDown={this._handleKeyDown}
                  />
                </div>
                <div className={"row"}>
                  <Input
                    prefix={<LockOutlined />}
                    placeholder={"Mật khẩu"}
                    value={password}
                    type={"password"}
                    onChange={(e) => this.setPassword(e.target.value)}
                    onKeyDown={this._handleKeyDown}
                  />
                </div>
                <div className={"row row-message"}>{messageError}</div>
                <div className={"row"}>
                  <Button
                    type={"primary"}
                    onClick={this.handleLogin}
                    loading={loading}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </div>
              <Row className={"login-help"}>
                <Col span={12}>
                  <a
                    className={"clickable"}
                    target={"_blank"}
                    href={
                      "https://download.teamviewer.com/download/TeamViewer_Setup_x64.exe"
                    }
                  >
                    Tải phần mềm Teamview
                  </a>
                  <br />
                  <a
                    className={"clickable"}
                    target={"_blank"}
                    href={
                      "https://ultraviewer.net/vi/UltraViewer_setup_6.4_vi.exe"
                    }
                  >
                    Tải phần mềm Ultraview
                  </a>
                </Col>
                <Col span={12}>
                  <div className={"clickable"} onClick={this.onProcess}>
                    Quên mật khẩu
                  </div>
                </Col>
              </Row>
              <Row className={"login-help"}>
                <Col span={12}>
                  <div>
                    <PhoneOutlined />{" "}
                    {address.phoneNumber
                      ? address.phoneNumber
                      : "____.____.______"}
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <MailOutlined />{" "}
                    {address.email ? address.email : "____@gosol.com.vn"}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={14}
            lg={14}
            xl={16}
            className={"col-landing"}
          >
            <div className={"main-landing flex-center"}>
              <div className={"landing-title"}>
                Đăng ký thông tin khách vào ra cơ quan không tiếp xúc sử dụng QR
                Code
              </div>
              <div className={"qr-example"}>
                <img className={"img-qr"} src={QRCode_example} alt="qr" />
                <Button
                  type={"primary"}
                  className={"on-img"}
                  onClick={this.openFormDangKy}
                >
                  Đăng ký ngay
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        <div className="footer-login">
          <img src={iconGo} alt="" width={40} style={{ marginRight: 10 }} />
          <i>Copyright © 2010-{currentYear} GO SOLUTIONS. All rights</i>
        </div>
        <ModalDangKy
          DanhSachTinh={DanhSachTinh}
          key={modalKey}
          visible={visibleModalDangKy}
          MatKhau_MacDinh={MatKhau_MacDinh}
          DangNhap={this.DangNhap}
          onCancel={this.closeModalDangKy}
          onCreate={this.submitDangKy}
          loading={loading}
        />
      </LandingWrapper>
    );
  }
}

export default connect(
  (state) => ({
    reducerToken: state.Auth.idToken,
  }),
  { login, clearMenu }
)(LandingLogin);
