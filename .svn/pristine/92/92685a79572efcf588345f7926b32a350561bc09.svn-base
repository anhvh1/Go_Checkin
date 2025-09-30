import React, {Component} from "react";
import {connect} from "react-redux";
import actions from "../../redux/QuanTriHeThong/actions";
import Constant from "../../../settings/constants";
import QuanTriSuperAdmin from "./QuanTriSuperAdmin";
import QuanTriAdminDonVi from "./QuanTriAdminDonVi";
import {getRoleByKey} from "../../../helpers/utility";
import {Redirect} from "react-router";
import {Empty} from "antd";

const {ROLEID} = Constant;

class QuanTriHeThong extends Component {
  constructor(props) {
    document.title = 'Quản trị hệ thống';
    super(props);
  }

  render() {
    const {user, role} = this.props;
    if (!role.view) {
      return <Redirect to={'/dashboard'}/>
    }
    const RoleID = user && user.RoleID || 0;
    const isSuperAdmin = RoleID === ROLEID.ADMIN;
    return isSuperAdmin ? (
      <QuanTriSuperAdmin {...this.props}/>
    ) : (
      <QuanTriAdminDonVi {...this.props}/>
      // <Empty/>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.Auth.user,
    role: getRoleByKey(state.Auth.role, 'quan-tri-he-thong')
  };
}

export default connect(
  mapStateToProps,
  actions
)(QuanTriHeThong);