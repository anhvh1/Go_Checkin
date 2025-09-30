import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, message, Switch, Tooltip } from "antd";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import Box from "../../../components/utility/box";
import BoxFilter from "../../../components/utility/boxFilter";
import BoxTable from "../../../components/utility/boxTable";
import PageAction from "../../../components/utility/pageAction";
import {
  Button,
  InputSearch as Search,
} from "../../../components/uielements/exportComponent";
import actions from "../../redux/QuanTriHeThong/actions";
import ModalAddEditDonVi from "./modalAddEditDonVi";
import {
  changeUrlFilter,
  getFilterData,
  getDefaultPageSize,
  getRoleByKey,
  MessageError,
  printComponent,
  getConfigLocal,
  OnBuilding,
} from "../../../helpers/utility";
import queryString from "query-string";
import api from "./config";
import apiPhanQuyen from "../QLPhanQuyen/config";
import Styled from "./styled";
import {
  DeleteOutlined,
  DownloadOutlined,
  FormOutlined,
  PrinterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

class QuanTriSuperAdmin extends Component {
  constructor(props) {
    super(props);
    const filterData = queryString.parse(this.props.location.search);
    this.state = {
      modalKey: 0,
      visibleModalDonVi: false,
      dataEditDonVi: {},
      action: "",
      loading: false,
      filterData: filterData,
      CoQuanQRPrint: {},
    };
    this.printRef = React.createRef();
  }

  componentDidMount() {
    this.props.getInitDataSP(this.state.filterData);
  }

  onSearch = (value, property) => {
    let oldFilterData = this.state.filterData;
    let onFilter = { value, property };
    let filterData = getFilterData(oldFilterData, onFilter, null);
    //get filter data
    this.setState({ filterData }, () => {
      changeUrlFilter(this.state.filterData); //change url
      this.props.getListSP(this.state.filterData); //get list
    });
  };

  onTableChange = (pagination, filters, sorter) => {
    let oldFilterData = this.state.filterData;
    let onOrder = { pagination, filters, sorter };
    let filterData = getFilterData(oldFilterData, null, onOrder);
    //get filter data
    this.setState({ filterData }, () => {
      changeUrlFilter(this.state.filterData); //change url
      this.props.getListSP(this.state.filterData); //get list
    });
  };

  resetPassword = (NguoiDungID) => {
    const { defaultPassword } = this.props;
    Modal.confirm({
      title: "Thông báo",
      content: "Bạn có muốn đặt lại mật khẩu không ?",
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        api
          .ResetMatKhau({ NguoiDungID })
          .then((response) => {
            if (response.data.Status > 0) {
              Modal.success({
                title: "Thông báo",
                content: `Mật khẩu đã được chuyển về mặc định là: ${defaultPassword}`,
                okText: "Đóng",
              });
            } else {
              MessageError(response.data.Message);
            }
          })
          .catch((error) => {
            MessageError(error.toString());
          });
      },
    });
  };

  ThemDonVi = () => {
    let { modalKey } = this.state;
    modalKey++;
    this.setState({
      dataEditDonVi: {},
      action: "add",
      visibleModalDonVi: true,
      modalKey,
    });
  };

  closeModalDonVi = () => {
    this.setState({ visibleModalDonVi: false });
  };

  submitModalDonVi = (value) => {
    const { action } = this.state;
    if (action === "add") {
      delete value.CoQuanID;
      delete value.CanBoID;
      delete value.NguoiDungID;
      delete value.TrangThai;
      this.setState({ loading: true });
      api
        .ThemDonVi(value)
        .then((response) => {
          this.setState({ loading: false });
          if (response.data.Status > 0) {
            message.success("Thêm đơn vị sử dụng thành công");
            this.closeModalDonVi();
            this.props.getListSP(this.state.filterData);
          } else {
            MessageError(response.data.Message);
          }
        })
        .catch((error) => {
          this.setState({ loading: false });
          MessageError(error.toString());
        });
    } else if (action === "edit") {
      this.setState({ loading: true });
      api
        .SuaDonVi(value)
        .then((response) => {
          this.setState({ loading: false });
          if (response.data.Status > 0) {
            message.success("Cập nhật thông tin đơn vị thành công");
            this.closeModalDonVi();
            this.props.getListSP(this.state.filterData);
          } else {
            MessageError(response.data.Message);
          }
        })
        .catch((error) => {
          this.setState({ loading: false });
          MessageError(error.toString());
        });
    }
  };

  XoaDonVi = (CoQuanID) => {
    Modal.confirm({
      title: "Thông báo",
      content: "Bạn có muốn xóa thông tin đơn vị này không ?",
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        api
          .XoaCoQuan({ CoQuanID })
          .then((response) => {
            if (response.data.Status > 0) {
              message.success("Xóa thông tin đơn vị thành công");
              this.props.getListSP(this.state.filterData);
            } else {
              MessageError(response.data.Message);
            }
          })
          .catch((error) => {
            MessageError(error.toString());
          });
      },
    });
  };

  printQR = (record) => {
    this.setState({ CoQuanQRPrint: record }, () => {
      setTimeout(() => {
        printComponent(this.printRef.current.innerHTML);
      }, 500);
    });
  };

  downloadQR = (record) => {
    const a = document.createElement("a"); //Create <a>
    a.href = record.QRCode; //Image Base64 Goes here
    a.target = "_blank";
    a.download = `QRCheckin-${record.TenCoQuan}.png`; //File name Here
    a.click(); //Downloaded file
  };

  changeTrangThaiSuDung = (record, value) => {
    const param = {
      CoQuanID: record.CoQuanID,
      TrangThai: value,
      TenCoQuan: "a",
    };
    api
      .CapNhatTrangThai(param)
      .then((response) => {
        if (response.data.Status > 0) {
          message.destroy();
          message.success("Cập nhật trạng thái sử dụng thành công");
          this.props.getListSP(this.state.filterData);
        } else {
          MessageError(response.data.Message);
        }
      })
      .catch((error) => {
        MessageError(error.toString());
      });
  };

  EditCoQuan = (record) => {
    api
      .ChiTietCoQuanSuDungPM({ CoQuanID: record.CoQuanID })
      .then((response) => {
        if (response.data.Status > 0) {
          let { modalKey } = this.state;
          modalKey++;
          this.setState({
            dataEditDonVi: response.data.Data,
            modalKey,
            action: "edit",
            visibleModalDonVi: true,
          });
        } else {
          MessageError(response.data.Message);
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        MessageError(error.toString());
      });
  };

  renderTenCoQuan = (record) => {
    const DiaChi = `${record.DiaChi ? record.DiaChi + ", " : ""}${
      record.TenXa
    }, ${record.TenHuyen}, ${record.TenTinh}`;
    return (
      <div>
        {record.TenCoQuan}
        <div style={{ fontSize: 12 }}>{DiaChi}</div>
      </div>
    );
  };

  renderQRCode = (record) => {
    return (
      <div className={"qr-container"}>
        <img className={"qr-img"} src={record.QRCode} />
        <div className={"qr-action"}>
          <DownloadOutlined
            className={"qr-download"}
            onClick={() => this.downloadQR(record)}
          />
          <PrinterOutlined
            className={"qr-printer"}
            onClick={() => this.printQR(record)}
          />
        </div>
      </div>
    );
  };

  renderTaiKhoan = (record) => {
    return (
      <div className={"tk-container"}>
        <div>
          {record.TenCanBo}
          <br />
          {record.TenNguoiDung}
        </div>
        <div className={"tk-action"}>
          <Tooltip title={"Reset mật khẩu"}>
            <ReloadOutlined
              onClick={() => this.resetPassword(record.NguoiDungID)}
            />
          </Tooltip>
        </div>
      </div>
    );
  };

  renderThaoTac = (record) => {
    return (
      <div className={"action-btn"}>
        <FormOutlined onClick={() => this.EditCoQuan(record)} />
        <DeleteOutlined onClick={() => this.XoaDonVi(record.CoQuanID)} />
        <Switch
          checked={record.TrangThai}
          onChange={(value) => this.changeTrangThaiSuDung(record, value)}
        />
      </div>
    );
  };

  render() {
    const {
      modalKey,
      visibleModalDonVi,
      dataEditDonVi,
      loading,
      filterData,
      action,
      CoQuanQRPrint,
    } = this.state;
    const { DanhSachQuanTri, DanhSachTinh, TotalRow, TableLoading, role } =
      this.props;
    const PageNumber = filterData.PageNumber
      ? parseInt(filterData.PageNumber)
      : 1;
    const PageSize = filterData.PageSize
      ? parseInt(filterData.PageSize)
      : getDefaultPageSize();
    const column = [
      {
        title: "STT",
        align: "center",
        width: "5%",
        render: (text, record, index) => (
          <span>{(PageNumber - 1) * PageSize + (index + 1)}</span>
        ),
      },
      {
        title: "Tên cơ quan đơn vị",
        width: "35%",
        render: (text, record) => this.renderTenCoQuan(record),
      },
      {
        title: "QR Code",
        width: "20%",
        render: (text, record) => this.renderQRCode(record),
      },
      {
        title: "Tài khoản đơn vị",
        width: "25%",
        render: (text, record) => this.renderTaiKhoan(record),
      },
      {
        title: "Thao tác",
        width: "15%",
        align: "center",
        render: (text, record) => this.renderThaoTac(record),
      },
    ];

    return (
      <LayoutWrapper>
        <PageHeader>Quản trị hệ thống</PageHeader>
        <PageAction>
          {role.add ? (
            <Button type={"primary"} onClick={this.ThemDonVi}>
              Thêm mới
            </Button>
          ) : (
            ""
          )}
        </PageAction>
        <Styled className={"index"}>
          <Box>
            <BoxFilter>
              <Search
                placeholder={"Tìm kiếm đơn vị"}
                style={{ width: 300 }}
                allowClear
                onSearch={(value) => this.onSearch(value, "Keyword")}
                defaultValue={filterData.Keyword}
              />
            </BoxFilter>
            <BoxTable
              columns={column}
              rowKey={"CoQuanID"}
              dataSource={DanhSachQuanTri}
              pagination={{
                showSizeChanger: true, //show text: pageSize/page
                showTotal: (total, range) =>
                  `Từ ${range[0]} đến ${range[1]} trên ${total}`,
                total: TotalRow, //test 100
                current: PageNumber, //current page
                pageSize: PageSize,
              }}
              loading={TableLoading}
              onChange={this.onTableChange}
            />
          </Box>
          <ModalAddEditDonVi
            key={modalKey}
            visible={visibleModalDonVi}
            dataEdit={dataEditDonVi}
            DanhSachTinh={DanhSachTinh}
            onCreate={this.submitModalDonVi}
            onCancel={this.closeModalDonVi}
            loading={loading}
          />
          <div ref={this.printRef} style={{ display: "none" }}>
            <div style={{ width: "100%", textAlign: "center" }}>
              <img
                style={{ marginTop: 20, width: 400, height: 400 }}
                src={CoQuanQRPrint.QRCode}
              />
              <div style={{ marginTop: 20, fontWeight: "bold", fontSize: 30 }}>
                {CoQuanQRPrint.TenCoQuan}
              </div>
            </div>
          </div>
        </Styled>
      </LayoutWrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.QuanTriHeThong,
    role: getRoleByKey(state.Auth.role, "quan-tri-he-thong"),
    defaultPassword: getConfigLocal("defaultPassword", 10),
  };
}

export default connect(mapStateToProps, actions)(QuanTriSuperAdmin);
