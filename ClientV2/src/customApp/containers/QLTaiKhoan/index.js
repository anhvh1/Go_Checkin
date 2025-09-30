import React, {Component} from "react";
import {connect} from "react-redux";
import {Icon, Input, Modal, message, TreeSelect} from "antd";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import Box from "../../../components/utility/box";
import BoxFilter from "../../../components/utility/boxFilter";
import BoxTable from '../../../components/utility/boxTable';
import PageAction from "../../../components/utility/pageAction";
import Button from "../../../components/uielements/button";
import actions from "../../redux/QLTaiKhoan/actions";
import {ModalAddEdit} from "./modalAddEditTaiKhoan";
import moment from 'moment';
import defaultAvatar from "../../../image/defaultAvatar.jpeg"
import {changeUrlFilter, getFilterData, getDefaultPageSize} from "../../../helpers/utility";
import queryString from 'query-string';
import api from "./config";
import apiPhanQuyen from "../QLPhanQuyen/config";

const {Search} = Input;

class QLTaiKhoan extends Component {
  constructor(props) {
    document.title = 'Quản lý tài khoản';
    super(props);
    const filterData = queryString.parse(this.props.location.search);
    this.state = {
      selectedRowKeys: [],
      modalKey: 0,
      visibleModal: false,
      dataEdit: {},
      actions: "",
      loading: false,
      success: false,
      filterData: filterData,
      NguoiDungID: undefined,
      DanhSachNhomNguoiDung: []
    }
  }

  componentDidMount() {
    this.props.getInitData(this.state.filterData);
  }

  onSearch = (value, property) => {
    let oldFilterData = this.state.filterData;
    let onFilter = {value, property};
    let filterData = getFilterData(oldFilterData, onFilter, null);
    //get filter data
    this.setState(
      {
        filterData,
        selectedRowKeys: []
      },
      () => {
        changeUrlFilter(this.state.filterData); //change url
        this.props.getList(this.state.filterData); //get list
      }
    );
  };

  onTableChange = (pagination, filters, sorter) => {
    let oldFilterData = this.state.filterData;
    let onOrder = {pagination, filters, sorter};
    let filterData = getFilterData(oldFilterData, null, onOrder);
    //get filter data
    this.setState(
      {
        filterData,
        selectedRowKeys: []
      },
      () => {
        changeUrlFilter(this.state.filterData); //change url
        this.props.getList(this.state.filterData); //get list
      }
    );
  };

  deleteTaiKhoan = () => {
    const user_id = JSON.parse(localStorage.getItem('user')).CanBoID;
    const {selectedRowKeys} = this.state;
    this.setState({loading: false});
    if (selectedRowKeys.includes(user_id)) {
      message.destroy();
      message.warning('Không thể xóa thông tin của bản thân');
      return;
    }
    Modal.confirm({
      title: 'Thông báo',
      content: 'Bạn chắc chắn muốn xóa tài khoản này không ?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        api.XoaTaiKhoan({ListID: selectedRowKeys})
          .then(response => {
            if (response.data.Status > 0) {
              message.destroy();
              message.success('Xóa tài khoản thành công');
              this.setState({loading: false, selectedRowKeys: []});
              this.props.getList(this.state.filterData);
            } else {
              message.destroy();
              message.error(response.data.Data.map(item => {
                return <div>{item}</div>
              }));
              this.setState({loading: false, selectedRowKeys: []});
              this.props.getList(this.state.filterData);
            }
          }).catch(error => {
          this.setState({loading: false, selectedRowKeys: []});
          message.destroy();
          message.error(error.toString());
        })
      }
    });
  };

  editTaiKhoan = () => {
    const {selectedRowKeys} = this.state;
    const CanBoID = selectedRowKeys[0];
    this.setState({loading: true});
    api.ChiTietTaiKhoan({CanBoID: CanBoID})
      .then(response => {
        if (response.data.Status === 1) {
          const dataEdit = response.data.Data;
          dataEdit.NgaySinh = moment(dataEdit.NgaySinh);
          apiPhanQuyen.DanhSachNhomByCoQuanID({CoQuanID: dataEdit.CoQuanID})
            .then(responseNhomNguoiDung => {
              this.setState({
                dataEdit,
                loading: false,
                visibleModal: true,
                modalKey: ++this.state.modalKey,
                actions: 'edit',
                DanhSachNhomNguoiDung: responseNhomNguoiDung.data.Data
              });
            });

        } else {
          this.setState({loading: false});
          message.destroy();
          message.error(response.data.Message);
        }
      }).catch(error => {
      this.setState({loading: false});
      message.destroy();
      message.error(error.toString());
    })
  };

  addTaiKhoan = () => {
    this.setState({visibleModal: true, modalKey: ++this.state.modalKey, actions: 'add', dataEdit: {}, loading: false});
  };

  closeModalAddEdit = () => {
    this.setState({visibleModal: false, selectedRowKeys: []});
  };

  submitModalAddEdit = (data) => {
    data.NgaySinh = moment(data.NgaySinh).format('YYYY-MM-DD');
    data.XemTaiLieuMat = data.XemTaiLieuMat === true ? 1 : 0;
    const {actions} = this.state;
    this.setState({loading: true}, () => {
      if (actions === 'add') {
        delete data.CanBoID;
        api.ThemTaiKhoan(data)
          .then(response => {
            if (response.data.Status === 1) {
              message.destroy();
              message.success('Thêm thông tin thành công');
              this.props.getList(this.state.filterData);
              this.setState({visibleModal: false, selectedRowKeys: [], success: true})
            } else {
              message.destroy();
              message.error(response.data.Message);
              this.setState({loading: false});
            }
          }).catch(error => {
          this.setState({loading: false});
          message.destroy();
          message.error(error.toString())
        })
      } else if (actions === 'edit') {
        const AnhHoSo = this.state.dataEdit.AnhHoSo;
        if (data.AnhHoSo === "") {
          data.AnhHoSo = AnhHoSo;
        }
        api.SuaTaiKhoan(data)
          .then(response => {
            if (response.data.Status === 1) {
              message.destroy();
              message.success('Sửa thông tin thành công');
              this.props.getList(this.state.filterData);
              this.setState({visibleModal: false, selectedRowKeys: [], success: true})
            } else {
              message.destroy();
              message.error(response.data.Message);
              this.setState({loading: false});
            }
          }).catch(error => {
          this.setState({loading: false});
          message.destroy();
          message.error(error.toString())
        })
      }
    });

  };

  renderChucVu = (dsChucVu) => {
    const DanhSachChucVu = this.props.DanhSachChucVu ? this.props.DanhSachChucVu : [];
    const DanhSachTenChucVu = [];
    if (dsChucVu) {
      for (let i = 0; i < dsChucVu.length; i++) {
        const ChucVu = DanhSachChucVu.filter(item => item.ChucVuID === dsChucVu[i]);
        if (ChucVu.length > 0) {
          DanhSachTenChucVu.push(ChucVu[0].TenChucVu);
        }
      }
    }
    return <span>{DanhSachTenChucVu.join(", ")}</span>
  };

  renderCoQuan = (coquanid) => {
    const {DanhSachCoQuanAll} = this.props;
    let TenCoQuan = "";
    if (coquanid) {
      const CoQuan = DanhSachCoQuanAll.filter(item => item.ID === coquanid);
      if (CoQuan.length > 0) {
        TenCoQuan = CoQuan[0].Ten;
      }
    }
    return TenCoQuan;
  };

  resetPassword = () => {
    const {selectedRowKeys} = this.state;
    const {DanhSachTaiKhoan} = this.props;
    let NguoiDungID;
    if (selectedRowKeys.length !== 1) {
      NguoiDungID = undefined;
    } else {
      const dataFilter = DanhSachTaiKhoan.filter(item => item.CanBoID === selectedRowKeys[0]);
      if (dataFilter.length < 1) {
        NguoiDungID = undefined;
      } else {
        NguoiDungID = dataFilter[0].NguoiDungID;
      }
    }
    if (!NguoiDungID) {
      return;
    }
    const {MatKhauMacDinh} = this.props;
    Modal.confirm({
      title: 'Thông báo',
      content: 'Bạn có muốn đặt lại mật khẩu không ?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        api.ResetMatKhau({NguoiDungID: NguoiDungID})
          .then(response => {
            if (response.data.Status > 0) {
              Modal.success({
                title: 'Thông báo',
                content: `Mật khẩu đã được chuyển về mặc định là: ${MatKhauMacDinh}`,
                okText: 'Đóng',
                onOk: () => {
                  this.setState({selectedRowKeys: []});
                }
              });
              // message.destroy();
              // message.success('Reset mật khẩu thành công');
            } else {
              message.destroy();
              message.error(response.data.Message);
            }
          }).catch(error => {
          message.destroy();
          message.error(error.toString());
        })
      }
    });
  };

  render() {
    const {modalKey, visibleModal, dataEdit, selectedRowKeys, loading, filterData, success, actions} = this.state;
    const {DanhSachTaiKhoan, DanhSachChucVu, DanhSachCoQuan, TotalRow, TableLoading, DanhSachTaiKhoanAll, role, DanhSachNhomNguoiDung} = this.props;
    const PageNumber = filterData.PageNumber ? parseInt(filterData.PageNumber) : 1;
    const PageSize = filterData.PageSize ? parseInt(filterData.PageSize) : getDefaultPageSize();
    const column = [
      {
        title: 'STT',
        key: 'stt',
        dataIndex: 'stt',
        align: 'center',
        width: '5%',
        render: (text, record, index) => (
          <span>{(PageNumber - 1) * PageSize + (index + 1)}</span>
        )
      },
      // {
      //   title: 'Ảnh đại diện',
      //   align: 'center',
      //   width: '10%',
      //   render: (text, record, index) => (
      //     <img alt="ava" src={record.AnhHoSo && record.AnhHoSo !== "" ? record.AnhHoSo : defaultAvatar}
      //          style={{width: 50, height: 50, borderRadius: "50%"}}/>
      //   )
      // },
      {
        title: 'Tên đăng nhập',
        key: 'dangNhap',
        dataIndex: 'TenNguoiDung',
        width: '25%'
      },
      {
        title: 'Tên cán bộ',
        key: 'tenCanBo',
        dataIndex: 'TenCanBo',
        width: '35%'
      },
      {
        title: 'Cơ quan',
        key: 'coQuan',
        dataIndex: 'TenCoQuan',
        width: '30%',
        render: (text, record) => (
          <span>{this.renderCoQuan(record.CoQuanID)}</span>
        ),
      },
      // {
      //   title: 'Chức vụ',
      //   key: 'chucVu',
      //   dataIndex: 'ChucVu',
      //   width: '15%',
      //   render: (text, record) => (
      //     this.renderChucVu(record.DanhSachChucVuID)
      //   )
      // }
    ];
    return (
      <LayoutWrapper>
        {/*<div className={'LayoutContentScroll'} style={{width: '100%'}}>*/}
        <PageHeader>Quản lý tài khoản</PageHeader>
        <PageAction>
          {role.edit ?
            <Button style={{
              marginRight: 5,
              background: selectedRowKeys.length !== 1 ? '' : '#00a65a',
              color: selectedRowKeys.length !== 1 ? '' : 'white'
            }}
                    onClick={this.resetPassword}
                    disabled={selectedRowKeys.length !== 1}>Reset mật khẩu</Button> : ""}
          {role.delete ? <Button type={'primary'} style={{marginRight: 5}} onClick={this.deleteTaiKhoan}
                                 disabled={selectedRowKeys.length < 1}>Xóa</Button> : ""}
          {role.edit ? <Button type={'primary'} style={{marginRight: 5}} onClick={this.editTaiKhoan}
                               disabled={selectedRowKeys.length !== 1}>Sửa</Button> : ""}
          {role.add ? <Button type={'primary'} onClick={this.addTaiKhoan}>Thêm mới</Button> : ""}
        </PageAction>
        <Box>
          <BoxFilter>
            <TreeSelect
              showSearch
              treeData={DanhSachCoQuan}
              defaultValue={filterData.CoQuanID}
              style={{width: 200}}
              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
              placeholder="Chọn cơ quan"
              allowClear
              treeDefaultExpandAll
              onChange={value => this.onSearch(value, "CoQuanID")}
              notFoundContent={"Không có dữ liệu"}
              treeNodeFilterProp={'title'}
            />
            <Search placeholder={'Nhập tên cán bộ hoặc tài khoản cần tìm kiếm'} style={{width: 300, marginLeft: 10}}
                    allowClear
                    onSearch={value => this.onSearch(value, 'Keyword')} defaultValue={filterData.Keyword}/>
          </BoxFilter>
          <BoxTable
            rowSelection={{
              onChange: (selectedRowKeys) => {
                this.setState({selectedRowKeys});
              },
              selectedRowKeys: this.state.selectedRowKeys
            }}
            columns={column}
            rowKey={'CanBoID'}
            dataSource={DanhSachTaiKhoan}
            pagination={{
              showSizeChanger: true, //show text: pageSize/page
              showTotal: (total, range) => `Từ ${range[0]} đến ${range[1]} trên ${total}`,
              total: TotalRow, //test 100
              current: PageNumber, //current page
              pageSize: PageSize,
            }}
            loading={TableLoading}
            onChange={this.onTableChange}
            scroll={{y: '60vh'}}
          />
        </Box>
        {/*</div>*/}
        <ModalAddEdit visible={visibleModal} DanhSachChucVu={DanhSachChucVu} DanhSachCoQuan={DanhSachCoQuan}
                      DanhSachNhomNguoiDung={actions === 'add' ? DanhSachNhomNguoiDung : this.state.DanhSachNhomNguoiDung}
                      dataEdit={dataEdit} onCancel={this.closeModalAddEdit} key={modalKey}
                      onCreate={this.submitModalAddEdit} loading={loading} DanhSachTaiKhoanAll={DanhSachTaiKhoanAll}
                      success={success} actions={actions}/>
      </LayoutWrapper>
    )
  }
}

function mapStateToProps(state) {
  return {
    ...state.QLTaiKhoan
  };
}

export default connect(
  mapStateToProps,
  actions
)(QLTaiKhoan);