import { apiGetAuth, apiPost, apiPostAuth, apiPostAuth2 } from "../../../api";
import server from "../../../settings";
import settings from "../../../settings";
const apiUrl = {
  checkinv4: server.apiInOutv4 + "VaoRa/Vao",
  getlistpaging: server.apiInOutv4 + "VaoRa/GetListPageBySearch",
  compareface: `http://localhost:${settings.socketAPIPort}/api/v4/compare`,
  // http://localhost:8010/compare
};
const api = {
  Checkinv4: (param) => {
    return apiPostAuth(apiUrl.checkinv4, { ...param });
  },
  GetList: (param) => {
    return apiGetAuth(apiUrl.getlistpaging, { ...param });
  },
  CompareFace: (param) => {
    return apiPost(apiUrl.compareface, { ...param });
  },
};

export default api;
