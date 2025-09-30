import React, { Component } from "react";
import { connect } from "react-redux";
import clone from "clone";
import { Link } from "react-router-dom";
import { Layout } from "antd";
import options from "./options";
import Scrollbars from "../../components/utility/customScrollBar.js";
import Menu from "../../components/uielements/menu";
import SidebarWrapper from "./sidebar.style";
import appActions from "../../redux/app/actions";
import Logo from "../../components/utility/logo";
import { store } from "../../redux/store";
import CONSTANT from "../../settings/constants";
import { LeftOutlined } from "@ant-design/icons";

const SubMenu = Menu.SubMenu;
const { Sider } = Layout;

const { toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed } =
  appActions;
const stripTrailingSlash = (str) => {
  if (str.substr(-1) === "/") {
    return str.substr(0, str.length - 1);
  }
  return str;
};

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
  }
  handleClick(e) {
    if (e.key !== "btn-hd") {
      this.props.changeCurrent([e.key]);
      if (window.innerWidth <= CONSTANT.COMPUTER_SIZE) {
        setTimeout(() => {
          this.props.toggleCollapsed();
        }, 100);
      }
    }
  }
  onOpenChange(newOpenKeys) {
    const { app, changeOpenKeys } = this.props;
    const latestOpenKey = newOpenKeys.find(
      (key) => !(app.openKeys.indexOf(key) > -1)
    );
    const latestCloseKey = app.openKeys.find(
      (key) => !(newOpenKeys.indexOf(key) > -1)
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
  getAncestorKeys = (key) => {
    const map = {
      sub3: ["sub2"],
    };
    return map[key] || [];
  };
  getMenuItem = ({ singleOption, submenuStyle, submenuColor }) => {
    const { key, label, leftIcon, children } = singleOption;
    const url = stripTrailingSlash(this.props.url);
    if (children) {
      return (
        <SubMenu
          key={key}
          title={
            <span className="isoMenuHolder" style={submenuColor}>
              <LeftOutlined />
              <span className="nav-text">{label}</span>
            </span>
          }
        >
          {children.map((child) => {
            const linkTo = child.withoutDashboard
              ? `/${child.key}`
              : `${url}/${child.key}`;
            return (
              <Menu.Item style={submenuStyle} key={child.key}>
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
            <LeftOutlined />
            <span className="nav-text">{label}</span>
          </span>
        </Link>
      </Menu.Item>
    );
  };
  render() {
    const { app, customizedTheme, height } = this.props;
    const collapsed = clone(app.collapsed);
    const mode = collapsed === true ? "vertical" : "inline";
    const styling = {
      backgroundColor: customizedTheme.backgroundColor,
    };
    const submenuStyle = {
      backgroundColor: "rgba(0,0,0,0.3)",
      color: customizedTheme.textColor,
    };
    const submenuColor = {
      color: customizedTheme.textColor,
    };
    //get list option ------- #################
    let role = store.getState().Auth.role;
    if (!role) {
      let roleStore = localStorage.getItem("role");
      role = JSON.parse(roleStore);
    }
    let listOptions = [];
    options.forEach((menu) => {
      //if(role && role[menu.key] && role[menu.key].view){ ############Phan Quyen Menu
      listOptions.push(menu);
      //}
    });
    return (
      <SidebarWrapper style={{ userSelect: "none" }}>
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={collapsed}
          width={240}
          className="isomorphicSidebar"
          style={styling}
        >
          {/*<Logo collapsed={collapsed} />*/}
          <Scrollbars style={{ height: height - 0 }}>
            <Menu
              onClick={this.handleClick}
              theme="dark"
              className="isoDashboardMenu"
              mode={mode}
              openKeys={collapsed ? [] : app.openKeys}
              selectedKeys={app.current}
              onOpenChange={this.onOpenChange}
            >
              {listOptions.map((singleOption) =>
                this.getMenuItem({ submenuStyle, submenuColor, singleOption })
              )}
            </Menu>
          </Scrollbars>
        </Sider>
      </SidebarWrapper>
    );
  }
}

export default connect(
  (state) => ({
    app: state.App,
    customizedTheme: state.ThemeSwitcher.sidebarTheme,
    height: state.App.height,
  }),
  { toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed }
)(Sidebar);
