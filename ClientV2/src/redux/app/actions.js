import {getRoleByKey} from "../../helpers/utility";

export function getView(width) {
  let newView = "MobileView";
  if (width > 1220) {
    newView = "DesktopView";
  } else if (width > 767) {
    newView = "TabView";
  }
  return newView;
}

const actions = {
  COLLPSE_CHANGE: "COLLPSE_CHANGE",
  COLLPSE_OPEN_DRAWER: "COLLPSE_OPEN_DRAWER",
  CHANGE_OPEN_KEYS: "CHANGE_OPEN_KEYS",
  TOGGLE_ALL: "TOGGLE_ALL",
  CHANGE_CURRENT: "CHANGE_CURRENT",
  CLEAR_MENU: "CLEAR_MENU",
  toggleCollapsed: () => ({
    type: actions.COLLPSE_CHANGE
  }),
  toggleAll: (width, height) => {
    const view = getView(width);
    const collapsed = view !== "DesktopView";
    return {
      type: actions.TOGGLE_ALL,
      collapsed,
      view,
      height
    };
  },
  toggleOpenDrawer: () => ({
    type: actions.COLLPSE_OPEN_DRAWER
  }),
  changeOpenKeys: openKeys => ({
    type: actions.CHANGE_OPEN_KEYS,
    openKeys
  }),
  changeCurrent: current => ({
    type: actions.CHANGE_CURRENT,
    current
  }),
  clearMenu: () => ({type: actions.CLEAR_MENU}),
  // getNotifications: (filterData) => ({type: "GET_NOTIFICATION_REQUEST_TO_APP_SAGA"}),
  getNotifications: (filterData) => {
    return (disPatch, getState) => {
      disPatch({
        type: "GET_NOTIFICATION_REQUEST_TO_APP_SAGA",
        payload: {filterData}
      });
    }
  },
  SET_LIST_TEMPER_WAIT: "SET_LIST_TEMPER_WAIT",
  setListTemperWait: temper => {
    return (disPatch) => {
      disPatch({
        type: actions.SET_LIST_TEMPER_WAIT,
        payload: {temper}
      });
    }
  },
  GET_LIST_TEMPER_FROM_SITE: "GET_LIST_TEMPER_FROM_SITE",
  getListTemperFromSite: listTemper => {
    return (disPatch) => {
      disPatch({
        type: actions.GET_LIST_TEMPER_FROM_SITE,
        payload: {listTemper}
      });
    }
  },
};
export default actions;
