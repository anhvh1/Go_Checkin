import { apiGetAuth, apiPost, apiPostAuth, apiPostAuth2 } from "../../../api";
import server from "../../../settings";
import settings from "../../../settings";
const apiUrl = {
  checkinv4: server.apiInOutv4 + "VaoRa/Vao",
  getlistpaging: server.apiInOutv4 + "VaoRa/GetListPageBySearch",
  compareface: `http://localhost:${settings.socketAPIPort}/api/v4/compare`,
  tonghopngay: server.apiInOut + 'VaoRa/TongHopTheoNgay'

};
const api = {
  Checkinv4: (param) => {
    return apiPostAuth(apiUrl.checkinv4, { ...param });
  },
  GetList: (param) => {
    return apiGetAuth(apiUrl.getlistpaging, { ...param, Type : 2 });
  },
  CompareFace: (param) => {
    return apiPost(apiUrl.compareface, { ...param });
  },
  TongHopNgay: (param) => {
      return apiGetAuth(apiUrl.tonghopngay, {...param});
  },
};

export default api;
