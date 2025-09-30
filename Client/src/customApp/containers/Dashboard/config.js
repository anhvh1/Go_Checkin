import {
  apiGetAuth,
  apiPostAuth,
} from "../../../api";
import server from '../../../settings';
import {getDefaultPageSize} from "../../../helpers/utility";

const apiUrl = {
  danhsachcoquan: server.apiInOut + 'DanhMucCoQuanDonVi/GetListByUser',
  danhsachcanbo: server.apiInOut + 'hethongcanbo/getlistpaging',
};
const api = {
  danhSachCoQuan: (param) => {
    return apiGetAuth(apiUrl.danhsachcoquan, {
      ...param
    });
  },
  danhSachCanBo: (param) => {
    return apiGetAuth(apiUrl.danhsachcanbo, {
      ...param,
      PageNumber: 1,
      PageSize: 999999
    });
  },
};

export default api;