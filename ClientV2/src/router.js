import React from "react";
import { Route, Redirect } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
// import { ConnectedRouter } from "connected-react-router";
import { connect } from "react-redux";
import App from "./containers/App/App";
import asyncComponent from "./helpers/AsyncFunc";
import Auth0 from "./helpers/auth0";
import { isFullLocalStorage } from "./helpers/utility";

const localStorageNotNull = isFullLocalStorage();

const RestrictedRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

const PublicRoutes = ({ history, isLoggedIn }) => {
  return (
    <ConnectedRouter history={history}>
      <div>
        <Route
          exact
          path={"/checkin"}
          component={asyncComponent(() =>
            import("./customApp/containers/CheckinOutV5")
          )}
        />
        <Route
          exact
          path={"/"}
          component={asyncComponent(() =>
            import("./customApp/containers/LandingPage/landingLogin")
          )}
        />
        <Route
          exact
          path={"/signin"}
          component={asyncComponent(() =>
            import("./customApp/containers/LandingPage/landingLogin")
          )}
        />
        {/* <Route
          exact
          path={"/signin"}
          component={asyncComponent(() =>
            import("./customApp/containers/CheckinOutV5")
          )}
        /> */}
        {/* <Route
          exact
          path={"/"}
          component={asyncComponent(() =>
            import("./customApp/containers/LandingPage/landingLogin")
          )}
        />
        <Route
          exact
          path={"/signin"}
          component={asyncComponent(() =>
            import("./customApp/containers/LandingPage/landingLogin")
          )}
        /> */}
        <Route
          exact
          path={"/404"}
          component={asyncComponent(() => import("./containers/Page/404"))}
        />
        <Route
          exact
          path={"/guest"}
          component={asyncComponent(() =>
            import("./customApp/containers/CheckinNoLoginV3")
          )}
        />
        <RestrictedRoute
          path="/dashboard"
          component={App}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </ConnectedRouter>
  );
};

export default connect((state) => ({
  isLoggedIn: state.Auth.idToken !== null || localStorageNotNull,
  //da dang nhap khi co reduce idToken hoac co localStore
}))(PublicRoutes);
