import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, ConfigProvider } from "antd";
import { IntlProvider } from "react-intl";
import { Debounce } from "react-throttle";
import WindowResizeListener from "react-window-size-listener";
import { ThemeProvider } from "styled-components";
import authAction from "../../redux/auth/actions";
import appActions from "../../redux/app/actions";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import ThemeSwitcher from "../../containers/ThemeSwitcher";
import AppRouter from "./AppRouter";
import { siteConfig } from "../../settings";
import { AppLocale } from "../../dashApp";
import themes from "../../settings/themes";
import AppHolder from "./commonStyle";
import "./global.css";
import "./topbarmenu.css";
import GlobalStyled from "./global.styled";

const { Content, Footer } = Layout;
const { logout } = authAction;
const { toggleAll } = appActions;
export class App extends Component {
  render() {
    const { url } = this.props.match;
    const { locale, selectedTheme, height } = this.props;
    const currentAppLocale = AppLocale[locale];
    const appHeight = window.innerHeight;
    const lastPart = this.props.location?.pathname?.split("/")?.pop();
    console.log(this.props.location, "this.props.location");
    const screenCheckout = lastPart === "checkin-out";
    return (
      <ConfigProvider locale={currentAppLocale.antd}>
        <GlobalStyled />
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <ThemeProvider theme={themes[selectedTheme]}>
            <AppHolder>
              <Layout style={{ height: appHeight }} className={"outerLayout"}>
                <Debounce time="10000" handler="onResize">
                  <WindowResizeListener
                    onResize={(windowSize) =>
                      this.props.toggleAll(
                        windowSize.windowWidth,
                        windowSize.windowHeight
                      )
                    }
                  />
                </Debounce>
                {!screenCheckout ? <Topbar url={url} /> : null}
                <Layout
                  style={{ flexDirection: "row", overflow: "hidden" }}
                  className={"middleLayout"}
                >
                  {/*<Sidebar url={url} />*/}
                  <Layout
                    className="isoContentMainLayout"
                    style={{
                      height: height,
                    }}
                  >
                    <Content
                      className="isomorphicContent"
                      style={{
                        padding: !screenCheckout ? "45px 0 0" : "",
                        flexShrink: "0",
                        background: "#F9F9F9",
                        position: "relative",
                      }}
                    >
                      <AppRouter url={url} />
                    </Content>
                    {/*<Footer*/}
                    {/*  style={{*/}
                    {/*    background: '#ffffff',*/}
                    {/*    textAlign: 'center',*/}
                    {/*    borderTop: '1px solid #ededed'*/}
                    {/*  }}*/}
                    {/*>*/}
                    {/*  {siteConfig.footerText}*/}
                    {/*</Footer>*/}
                  </Layout>
                </Layout>
                {/*<ThemeSwitcher />*/}
              </Layout>
            </AppHolder>
          </ThemeProvider>
        </IntlProvider>
      </ConfigProvider>
    );
  }
}

export default connect(
  (state) => ({
    auth: state.Auth,
    locale: state.LanguageSwitcher.language.locale,
    selectedTheme: state.ThemeSwitcher.changeThemes.themeName,
    height: state.App.height,
  }),
  { logout, toggleAll }
)(App);
