import React, {Component} from "react";
import {connect} from "react-redux";
import actions from "../../redux/Dashboard/actions";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import Button from "../../../components/uielements/button";
import './style.css';
import {Link} from "react-router-dom";
import {Empty} from 'antd'
import appActions from "../../../redux/app/actions";
import Redirect from "react-router/Redirect";

const {changeCurrent} = appActions;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    document.title = "Checkin-out";
    this.state = {
      base64: "",
      showimage: false
    };
  }

  componentDidMount() {
    this.props.getInitData();
  }

  //Render ----------------------------------------------------
  render() {
    // const {roleCheckin, roleBaoCao} = this.props;
    const roleHeThong = JSON.parse(localStorage.getItem('role'));
    const roleCheckin = roleHeThong['checkin-out'];
    const roleBaoCao = roleHeThong['bao-cao'];
    const user_id = parseInt(localStorage.getItem('user_id'));
    if (user_id === 1) {
      return <Redirect to={"/dashboard/co-quan-don-vi"}/>
    } else {
      if (!roleCheckin || !roleCheckin.view) {
        if (roleBaoCao && roleBaoCao.view) {
          this.props.changeCurrent(['bao-cao']);
          return <Redirect to={"/dashboard/bao-cao"}/>
        } else {
          if (roleHeThong['co-quan-don-vi'] && roleHeThong['co-quan-don-vi'].view) {
            return <Redirect to={"/dashboard/co-quan-don-vi"}/>
          } else if (roleHeThong['quan-ly-tai-khoan'] && roleHeThong['quan-ly-tai-khoan'].view) {
            return <Redirect to={"/dashboard/quan-ly-tai-khoan"}/>
          } else if (roleHeThong['phan-quyen'] && roleHeThong['phan-quyen'].view) {
            return <Redirect to={"/dashboard/phan-quyen"}/>
          } else if (roleHeThong['chuc-vu'] && roleHeThong['chuc-vu'].view) {
            return <Redirect to={"/dashboard/chuc-vu"}/>
          } else {
            return (
              <Empty description={'Tài khoản chưa được phân quyền sử dụng chức năng. Vui lòng kiểm tra và thử lại'}/>
            )
          }
        }
      } else {
        if (roleHeThong['co-quan-don-vi'] && roleHeThong['co-quan-don-vi'].view) {
          return <Redirect to={"/dashboard/co-quan-don-vi"}/>
        } else if (roleHeThong['quan-ly-tai-khoan'] && roleHeThong['quan-ly-tai-khoan'].view) {
          return <Redirect to={"/dashboard/quan-ly-tai-khoan"}/>
        } else if (roleHeThong['phan-quyen'] && roleHeThong['phan-quyen'].view) {
          return <Redirect to={"/dashboard/phan-quyen"}/>
        } else if (roleHeThong['chuc-vu'] && roleHeThong['chuc-vu'].view) {
          return <Redirect to={"/dashboard/chuc-vu"}/>
        } else {
          this.props.changeCurrent(['checkin-out']);
          return <Redirect to={"/dashboard/checkin-out"}/>
        }
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    ...state.Dashboard
  };
}

export default connect(
  mapStateToProps,
  {...actions, changeCurrent}
)(Dashboard);
