import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Layout, Drawer, Icon} from "antd";
import appActions from "../../redux/app/actions";
import TopbarNotification from "./topbarNotification";
import TopbarUser from "./topbarUser";
import TopbarWrapper from "./topbar.style";
import dashboardGuide from '../../image/guide/dashboard.pdf';
import logoGo from '../../image/logoGo.png';
import queryString from "query-string";
import server from '../../settings';
import Menu from "../../components/uielements/menu";
import options from "../Sidebar/options";
import CONSTANT from "../../settings/constants";
import './topbar_style.css';
import {store} from '../../redux/store';

const SubMenu = Menu.SubMenu;
const stripTrailingSlash = str => {
  if (str.substr(-1) === "/") {
    return str.substr(0, str.length - 1);
  }
  return str;
};
const {
  changeOpenKeys,
  changeCurrent,
} = appActions;

const {Header} = Layout;
const {toggleCollapsed, clearMenu} = appActions;

class Topbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleDrawer: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
  }

  showDrawer = () => {
    this.setState({
      visibleDrawer: true,
    });
  };
  closeDrawer = () => {
    this.setState({
      visibleDrawer: false,
    });
  };
  renderGuidePhoto = () => {
    const arrayKey = this.props.current;
    // const DanhSachHuongDan = this.props.DanhSachHuongDan;
    let link = "dashboard";
    if (arrayKey && arrayKey.length) {
      //link = arrayKey[0].replace(/-/g, "_");
      link = arrayKey[0];
    }
    let htmlResult = <div key={link}>Chưa có hướng dẫn cho chức năng này</div>;
    let file = null;
    let keyFile = "keyFile";
    // if(DanhSachHuongDan && DanhSachHuongDan.length){
    //   DanhSachHuongDan.forEach(item => {
    //     if(link === item.MaChucNang && item.UrlFile){
    //       file = server.apiInOut + item.UrlFile;
    //       keyFile = item.TenFileHeThong;
    //     }
    //   });
    // }
    // if(file){
    //   htmlResult = (
    //     <div key={link}>
    //       <embed key={keyFile} src={file} width="100%" style={{height: "calc(100vh - 110px)"}} />
    //     </div>
    //   );
    // }
    return htmlResult;
  };

  getAncestorKeys = key => {
    const map = {
      sub3: ["sub2"]
    };
    return map[key] || [];
  };

  handleClick(e) {
    if (e.key !== "btn-hd") {
      this.props.changeCurrent([e.key]);
      if (this.props.app.view === "MobileView") {
        setTimeout(() => {
          this.props.toggleCollapsed();
          this.props.toggleOpenDrawer();
        }, 100);
      }
    }
  }

  onOpenChange(newOpenKeys) {
    const {app, changeOpenKeys} = this.props;
    const latestOpenKey = newOpenKeys.find(
      key => !(app.openKeys.indexOf(key) > -1)
    );
    const latestCloseKey = app.openKeys.find(
      key => !(newOpenKeys.indexOf(key) > -1)
    );
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    changeOpenKeys(nextOpenKeys);
  }

  getMenuItem = ({singleOption, submenuStyle, submenuColor}) => {
    const {key, label, leftIcon, children} = singleOption;
    const url = stripTrailingSlash(this.props.url);
    if (children) {
      return (
        <SubMenu
          key={key}
          title={
            <span className="isoMenuHolder" style={submenuColor}>
              <Icon type={leftIcon}/>
              <span className="nav-text">
                {label}
              </span>
            </span>
          }
          popupClassName={"popupSubMenuInline"}
        >
          {children.map(child => {
            const linkTo = child.withoutDashboard
              ? `/${child.key}`
              : `${url}/${child.key}`;
            return (
              <Menu.Item key={child.key}>
                <Link style={submenuColor} to={linkTo}>
                  {child.label}
                </Link>
              </Menu.Item>
            );
          })}
        </SubMenu>
      );
    }
    return (
      <Menu.Item key={key}>
        <Link to={`${url}/${key}`}>
          <span className="isoMenuHolder" style={submenuColor}>
            <Icon type={leftIcon}/>
            <span className="nav-text">
              {label}
            </span>
          </span>
        </Link>
      </Menu.Item>
    );
  };

  render() {
    const {app, customizedTheme, locale} = this.props;
    const collapsed = this.props.collapsed && !this.props.openDrawer;
    const styling = {
      backgroundColor: customizedTheme.backgroundColor,
      position: "fixed",
      width: "100%",
      height: 45,
      border: "none",
      overflow: "hidden"
    };

    const mode = "horizontal";//collapsed === true ? "vertical" : "inline";
    const roleStore = localStorage.getItem('role');
    const role = JSON.parse(roleStore);

    let listOptions = [];
    options.forEach(menu => {
      if (menu.children && menu.children.length) {
        let children = [];
        menu.children.forEach(menuChild => {
          //if menuChild has permission
          if (role && role[menuChild.key] && role[menuChild.key].view) {
            children.push(menuChild);
          }
        });
        if (children.length)
          listOptions.push({...menu, children});
      } else {
        if (role && role[menu.key] && role[menu.key].view) {
          listOptions.push(menu);
        }
      }
    });

    const user = store.getState().Auth.user;
    if (user && user.NguoiDungID === 1) {//Là admin
      const indexMenu = listOptions.findIndex(item => item.key === "checkin-out");
      if (indexMenu !== -1) {
        listOptions.splice(indexMenu, 1);
      }
    }

    const submenuStyle = {
      backgroundColor: "rgba(0,0,0,0.3)",
      color: customizedTheme.textColor
    };
    const submenuColor = {
      color: customizedTheme.textColor
    };
    return (
      <TopbarWrapper style={{userSelect: "none"}}>
        <Header
          style={styling}
          className={
            collapsed ? "isomorphicTopbar collapsed" : "isomorphicTopbar"
          }
        >
          <div className="isoLeft">
            <Link to={'/dashboard'} style={{display: "block", fontSize: 18, marginLeft: 7}}
                  onClick={() => this.props.clearMenu()}>
              <img src={logoGo} alt={""} className={'logoSol'}/>
              <h4 className={"triggerHeader"}>
                GO CHECKIN
              </h4>
            </Link>
            <Menu
              onClick={this.handleClick}
              theme="dark"
              className="triggerIsoDashboardMenu"
              mode={mode}
              //openKeys={collapsed ? [] : app.openKeys}
              selectedKeys={(app.current && app.current.length && app.current[0] !== 'dashboard') ? app.current : ["item_0"]} //###########dashboard
              onOpenChange={newOpenKeys => this.onOpenChange(newOpenKeys, app)}
            >
              {listOptions.map(singleOption =>
                this.getMenuItem({submenuStyle, submenuColor, singleOption})
              )}
            </Menu>
          </div>
          <ul className="isoRight">
            {/*{*/}
            {/*  link !== "dashboard"*/}
            {/*    ?*/}
            {/*    <li className="isoGuide">*/}
            {/*      <Icon type="question-circle"*/}
            {/*            theme="filled"*/}
            {/*            style={{paddingTop: 2, color: "white", fontSize: 18}}*/}
            {/*            onClick={this.showDrawer}*/}
            {/*      />*/}
            {/*    </li>*/}
            {/*    : null*/}
            {/*}*/}
            {/*<li*/}
            {/*  onClick={() => this.setState({selectedItem: "notification"})}*/}
            {/*  className="isoNotify" style={{marginRight: 26}}*/}
            {/*>*/}
            {/*  <TopbarNotification locale={locale}/>*/}
            {/*</li>*/}
            <li
              onClick={() => this.setState({selectedItem: "user"})}
              className="isoUser"
            >
              <TopbarUser locale={locale}/>
            </li>
          </ul>
          <Drawer
            className="guideDrawer"
            width="50%"
            title="Hướng dẫn"
            placement="right"
            closable={true}
            onClose={this.closeDrawer}
            visible={this.state.visibleDrawer}
          >
            {this.renderGuidePhoto()}
          </Drawer>
        </Header>
      </TopbarWrapper>
    );
  }
}

export default connect(
  state => ({
    ...state.App,
    app: state.App,
    locale: state.LanguageSwitcher.language.locale,
    customizedTheme: state.ThemeSwitcher.topbarTheme
  }),
  {toggleCollapsed, clearMenu, changeOpenKeys, changeCurrent}
)(Topbar);
