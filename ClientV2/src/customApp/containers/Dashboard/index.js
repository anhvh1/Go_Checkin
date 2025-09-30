import React, {Component} from "react";
import {connect} from "react-redux";
import './style.css';
import {Empty} from 'antd'
import Redirect from "react-router/Redirect";
import appActions from "../../../redux/app/actions";
import Constant from '../../../settings/constants';

const {ROLEID} = Constant;

const {changeCurrent} = appActions;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    document.title = "Checkin-out";
  }

  render() {
    const roleHeThong = JSON.parse(localStorage.getItem('role'));
    const roleCheckin = roleHeThong['checkin-out'];
    const roleBaoCao = roleHeThong['bao-cao'];
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.RoleID == ROLEID.ADMIN || user.RoleID == ROLEID.SUBADMIN) {
    // if (user.RoleID == ROLEID.ADMIN) {
      this.props.changeCurrent(['quan-tri-he-thong']);
      return <Redirect to={"/dashboard/quan-tri-he-thong"}/>
    } else {
      if (!roleCheckin || !roleCheckin.view) {
        if (roleBaoCao && roleBaoCao.view) {
          this.props.changeCurrent(['bao-cao']);
          return <Redirect to={"/dashboard/bao-cao"}/>
        } else if (roleHeThong["truy-vet-toan-tinh"] && roleHeThong["truy-vet-toan-tinh"].view) {
          this.props.changeCurrent(['truy-vet-toan-tinh']);
          return <Redirect to={"/dashboard/truy-vet-toan-tinh"}/>
        } else if (roleHeThong["truy-vet-trong-don-vi"] && roleHeThong["truy-vet-trong-don-vi"].view) {
          this.props.changeCurrent(['truy-vet-trong-don-vi']);
          return <Redirect to={"/dashboard/truy-vet-trong-don-vi"}/>
        } else {
          return <Empty description={'Tài khoản chưa được phân quyền sử dụng chức năng. Vui lòng kiểm tra và thử lại'}/>
        }
        // else {
        //   if (roleHeThong['co-quan-don-vi'] && roleHeThong['co-quan-don-vi'].view) {
        //     return <Redirect to={"/dashboard/co-quan-don-vi"}/>
        //   } else if (roleHeThong['quan-ly-tai-khoan'] && roleHeThong['quan-ly-tai-khoan'].view) {
        //     return <Redirect to={"/dashboard/quan-ly-tai-khoan"}/>
        //   } else if (roleHeThong['phan-quyen'] && roleHeThong['phan-quyen'].view) {
        //     return <Redirect to={"/dashboard/phan-quyen"}/>
        //   } else if (roleHeThong['chuc-vu'] && roleHeThong['chuc-vu'].view) {
        //     return <Redirect to={"/dashboard/chuc-vu"}/>
        //   } else {
        //     return (
        //       <Empty description={'Tài khoản chưa được phân quyền sử dụng chức năng. Vui lòng kiểm tra và thử lại'}/>
        //     )
        //   }
        // }
      } else {
        // if (roleHeThong['co-quan-don-vi'] && roleHeThong['co-quan-don-vi'].view) {
        //   return <Redirect to={"/dashboard/co-quan-don-vi"}/>
        // } else if (roleHeThong['quan-ly-tai-khoan'] && roleHeThong['quan-ly-tai-khoan'].view) {
        //   return <Redirect to={"/dashboard/quan-ly-tai-khoan"}/>
        // } else if (roleHeThong['phan-quyen'] && roleHeThong['phan-quyen'].view) {
        //   return <Redirect to={"/dashboard/phan-quyen"}/>
        // } else if (roleHeThong['chuc-vu'] && roleHeThong['chuc-vu'].view) {
        //   return <Redirect to={"/dashboard/chuc-vu"}/>
        // } else {
        //   this.props.changeCurrent(['checkin-out']);
        //   return <Redirect to={"/dashboard/checkin-out"}/>
        // }
        this.props.changeCurrent(['checkin-out']);
        return <Redirect to={"/dashboard/checkin-out"}/>
      }
    }
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  {changeCurrent}
)(Dashboard);
