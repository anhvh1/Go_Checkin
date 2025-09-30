import {getRoleByKey} from "../../../helpers/utility";

const actions = {
  DASHBOARD_GET_INIT_DATA_REQUEST: 'DASHBOARD_GET_INIT_DATA_REQUEST',
  DASHBOARD_GET_INIT_DATA_REQUEST_SUCCESS: 'DASHBOARD_GET_INIT_DATA_REQUEST_SUCCESS',
  DASHBOARD_GET_INIT_DATA_REQUEST_ERROR: 'DASHBOARD_GET_INIT_DATA_REQUEST_ERROR',
  getInitData: (filterData) => {
    return (disPatch, getState) => {
      //get role
      let listRole = getState().Auth.role;
      let roleCheckin = getRoleByKey(listRole, "checkin-out");
      let roleBaoCao = getRoleByKey(listRole, "bao-cao");
      //-------
      disPatch({
        type: actions.DASHBOARD_GET_INIT_DATA_REQUEST,
        payload: {filterData, roleCheckin, roleBaoCao}
      });
    }
  },

  DASHBOARD_GET_DATA_REQUEST: 'DASHBOARD_GET_DATA_REQUEST',
  DASHBOARD_GET_DATA_REQUEST_SUCCESS: 'DASHBOARD_GET_DATA_REQUEST_SUCCESS',
  DASHBOARD_GET_DATA_REQUEST_ERROR: 'DASHBOARD_GET_DATA_REQUEST_ERROR',
  getData: (filterData) => ({
    type: actions.DASHBOARD_GET_DATA_REQUEST,
    payload: {filterData}
  }),
};
export default actions;