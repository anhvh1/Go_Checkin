import React, {Component} from "react";
import {connect} from "react-redux";
import queryString from "query-string";
import actions from "../../redux/DMCoQuan/actions";
import api from "./config";
import apiCanBo from "../QLTaiKhoan/config";
import Constants from '../../../settings/constants';

import LayoutWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import PageAction from "../../../components/utility/pageAction";
import Box from "../../../components/utility/box";
import BoxFilter from "../../../components/utility/boxFilter";
import {EmptyTable} from "../../../components/utility/boxTable";

import {ModalAdd} from "./modalAdd";
import {ModalEdit} from "./modalEdit";
import {Modal, message, Input, Tree, Menu, Dropdown, Icon} from "antd";
import Button from "../../../components/uielements/button";
import {changeUrlFilter, getFilterData} from "../../../helpers/utility";

const {TreeNode} = Tree;

class DMCoQuan extends Component {
  constructor(props) {
    super(props);
    document.title = "Danh mục cơ quan đơn vị";
    const filterData = queryString.parse(this.props.location.search);
    this.state = {
      expandedKeys: [],
      filterData: {...filterData},
      treeKey: 0,
      modalKey: 0,
      DanhSachCoQuan: [],
      confirmLoading: false,
      visibleModalAdd: false,
      dataModalAdd: null,
      visibleModalEdit: false,
      dataModalEdit: {
        DanhSachTinh: [],
        Data: null
      },
    };
  }

  //Get initData---------------------------------------------
  componentDidMount = () => {
    this.props.getInitData(this.state.filterData);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.DanhSachCoQuan !== this.props.DanhSachCoQuan) {
      let treeKey = this.state.treeKey + 1;
      this.setState({
        DanhSachCoQuan: this.props.DanhSachCoQuan,
        expandedKeys: this.props.expandedKeys,
        treeKey
      });
    }
  }

  //filter --------------------------------------------------
  onFilter = (value, property) => {
    //get filter data
    let oldFilterData = {...this.state.filterData};
    let onFilter = {value, property};
    let filterData = getFilterData(oldFilterData, onFilter, null);
    //get filter data
    this.setState({
        filterData
      },
      () => {
        let Keyword = this.state.filterData.Keyword ? this.state.filterData.Keyword : "";
        changeUrlFilter({Keyword}); //change url
        this.props.getList(this.state.filterData); //get list
      }
    );
  };

  //Delete-----------------------------------------------------
  deleteData = (ID) => {
    if (!this.props.role.delete) {
      message.destroy();
      message.warning('Bạn không có quyền thực hiện chức năng này');
    } else {
      Modal.confirm({
        title: "Xóa dữ liệu",
        content: "Bạn có muốn xóa cơ quan đơn vị này không?",
        cancelText: "Không",
        okText: "Có",
        onOk: () => {
          api.xoaCoQuan({ListID: [ID]}).then(response => {
            if (response.data.Status > 0) {
              //reset tree
              this.props.getList(this.state.filterData); //get list
              //message success
              message.destroy();
              message.success("Xóa thành công");
            } else {
              Modal.error({
                title: "Lỗi",
                content: response.data.Message
              });
            }
          }).catch(error => {
            Modal.error(Constants.API_ERROR)
          });
        }
      });
    }
  };

  //Modal add -----------------------------------------------------
  showModalAdd = (CoQuanChaID, TenCoQuanCha, CapCha) => {
    if (!this.props.role.add) {
      message.destroy();
      message.warning('Bạn không có quyền thực hiện chức năng này');
    } else {
      let modalKey = this.state.modalKey + 1;
      this.setState({
        visibleModalAdd: true,
        dataModalAdd: {
          DanhSachTinh: [...this.props.DanhSachDiaGioi],
          CoQuanChaID,
          TenCoQuanCha,
        },
        confirmLoading: false,
        modalKey
      });
    }
  };
  hideModalAdd = () => {
    this.setState({
      visibleModalAdd: false,
      dataModalAdd: null
    });
  };
  submitModalAdd = data => {
    const {ListPhanQuyenAdmin} = this.props;
    const user_id = parseInt(localStorage.getItem('user_id'));
    this.setState({confirmLoading: true}, () => {
      api.themCoQuan(data)
        .then(response => {
          if (response.data.Status > 0) {
            //message success
            message.destroy();
            message.success("Thêm thành công");
            //hide modal
            this.hideModalAdd();
            this.props.getList(this.state.filterData); //get list
            //Tạo tài khoản admin
            if (user_id === 1 && data.SuDungPM === true) {
              const paramTaiKhoan = {
                AnhHoSo: "",
                TenNguoiDung: `admin_${data.MaCQ}`,
                TenCanBo: `Admin ${data.TenCoQuan}`,
                NgaySinh: null,
                GioiTinh: 1,
                CoQuanID: response.data.Data,
                ListNhomNguoiDungID: ListPhanQuyenAdmin
              };
              apiCanBo.ThemTaiKhoan(paramTaiKhoan);
            }
          } else {
            this.setState({confirmLoading: false});
            Modal.error({
              title: "Lỗi",
              content: response.data.Message
            });
          }
        }).catch(error => {
        Modal.error(Constants.API_ERROR)
      });
    });
  };

  //Modal edit -----------------------------------------------------
  showModalEdit = (CoQuanID) => {
    if (!this.props.role.edit) {
      message.destroy();
      message.warning('Bạn không có quyền thực hiện chức năng này');
    } else {
      api.chiTietCoQuan({CoQuanID})
        .then(response => {
          if (response.data.Status > 0) {
            let modalKey = this.state.modalKey + 1;
            let Data = response.data.Data;
            this.setState({
              visibleModalEdit: true,
              dataModalEdit: {
                DanhSachTinh: [...this.props.DanhSachDiaGioi],
                Data
              },
              confirmLoading: false,
              modalKey
            });
          } else {
            Modal.error({
              title: "Lỗi",
              content: response.data.Message
            });
          }
        }).catch(error => {
        Modal.error(Constants.API_ERROR)
      });
    }
  };
  hideModalEdit = () => {
    this.setState({visibleModalEdit: false});
  };
  submitModalEdit = data => {
    this.setState({confirmLoading: true}, () => {
      api.suaCoQuan(data)
        .then(response => {
          if (response.data.Status > 0) {
            //message success
            message.destroy();
            message.success("Cập nhật thành công");
            //hide modal
            this.hideModalEdit();
            this.props.getList(this.state.filterData); //get list
          } else {
            this.setState({confirmLoading: false});
            Modal.error({
              title: "Lỗi",
              content: response.data.Message
            });
          }
        }).catch(error => {
        Modal.error(Constants.API_ERROR)
      });
    });
  };

  //Tree -------------------------------------------------------------
  onExpandNode = (selectedKeys, info) => {
    let className = info.nativeEvent.target.outerHTML.toString();
    let parentClassName = info.nativeEvent.target.parentElement.className.toString();
    let checkMenu = className.includes("ant-dropdown-menu");
    let checkNearMenu = parentClassName.includes("ant-dropdown-menu");
    if (!checkMenu && !checkNearMenu) {
      //neu dang k click menu drop
      let key = info.node.props.eventKey.toString();
      if (key) {
        if (!info.node.props.isLeaf) {
          let expandedKeys = [...this.state.expandedKeys];
          let index = expandedKeys.indexOf(key);
          if (index > -1) {
            expandedKeys.splice(index, 1);
          } else {
            expandedKeys = this.state.expandedKeys.concat([key]);
          }
          this.setState({expandedKeys});
        }
      }
    }
  };
  renderTreeNodes = data =>
    data.map(item => {
      const user_id = parseInt(localStorage.getItem('user_id'));
      let menu = (
        <Menu>
          {
            item.key.split("-").length < 3 //if Cap = 1 or 2
              ?
              <Menu.Item onClick={() => this.showModalAdd(item.ID, item.Ten, item.Cap)}>
                <span>Thêm đơn vị</span>
              </Menu.Item>
              : null
          }
          <Menu.Item onClick={() => this.showModalEdit(item.ID)}>
            <span>Sửa</span>
          </Menu.Item>
          <Menu.Item onClick={() => this.deleteData(item.ID)} disabled={item.Cap === 1 && user_id !== 1}>
            <span>Xóa</span>
          </Menu.Item>
        </Menu>
      );
      let title = 1 === 1 ?
        <div>
          <Dropdown overlay={menu} placement="bottomLeft" trigger={['contextMenu']}>
            <span>{item.title}</span>
          </Dropdown>
        </div> :
        <div>
          <Dropdown overlay={menu} placement="bottomLeft" trigger={['contextMenu']}>
            <b>{item.title}</b>
          </Dropdown>
        </div>;
      if (item.children) {
        return (
          <TreeNode
            title={title}
            key={item.key}
            isLeaf={item.isLeaf}
            children={item.children}
            dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode
        title={title}
        key={item.key}
        isLeaf={item.isLeaf}
        children={item.children}
        dataRef={item}
      />;
    });
  renderContent = () => {
    if (this.state.DanhSachCoQuan.length) {
      return (
        <Tree
          showLine
          switcherIcon={<Icon type="down"/>}
          filterTreeNode={treeNode => treeNode.props.dataRef.Highlight === 1}
          expandedKeys={this.state.expandedKeys}
          onSelect={this.onExpandNode}
          onExpand={this.onExpandNode}
        >
          {this.renderTreeNodes(this.state.DanhSachCoQuan)}
        </Tree>
      );
    } else {
      return (
        <EmptyTable
          style={{position: "absolute", top: "45%", left: "48%", border: "none"}}
          loading={this.props.TableLoading}
        />
      );
    }
  };

  //Render action ---------------------------------------------
  renderActionAdd = (user_id) => {
    return (
      <span>
        {user_id === 1 ? <Button type="primary" icon="file-add" onClick={() => this.showModalAdd("", "", "")}>
          Thêm
        </Button> : ""}
        <ModalAdd
          confirmLoading={this.state.confirmLoading}
          visible={this.state.visibleModalAdd}
          onCancel={this.hideModalAdd}
          onCreate={this.submitModalAdd}
          dataModalAdd={this.state.dataModalAdd}
          key={this.state.modalKey}
          user_id={user_id}
        />
      </span>
    );
  };
  renderActionEdit = (user_id) => {
    return (
      <span>
        <ModalEdit
          confirmLoading={this.state.confirmLoading}
          visible={this.state.visibleModalEdit}
          onCancel={this.hideModalEdit}
          onCreate={this.submitModalEdit}
          dataModalEdit={this.state.dataModalEdit}
          key={this.state.modalKey}
          user_id={user_id}
        />
      </span>
    );
  };

  //Render ----------------------------------------------------
  render() {
    const {role, user_id} = this.props;
    return (
      <LayoutWrapper>
        <PageHeader>Danh mục cơ quan, đơn vị</PageHeader>
        <PageAction>
          {role.add ? this.renderActionAdd(user_id) : ""}
          {role.edit ? this.renderActionEdit(user_id) : ""}
        </PageAction>
        <Box style={{minHeight: "calc(100vh - 265px)"}}>
          <BoxFilter>
            <Input.Search
              allowClear={true}
              defaultValue={this.state.filterData.Keyword}
              placeholder="Tìm kiếm theo tên cơ quan, đơn vị"
              onSearch={value => this.onFilter(value, "Keyword")}
              style={{width: 300}}
            />
          </BoxFilter>
          <div key={this.state.treeKey} style={{userSelect: "none"}}>
            {this.renderContent()}
          </div>
        </Box>
      </LayoutWrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.DMCoQuan
  };
}

export default connect(
  mapStateToProps,
  actions
)(DMCoQuan);
