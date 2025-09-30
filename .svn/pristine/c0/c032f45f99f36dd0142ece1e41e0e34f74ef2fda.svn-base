import {apiGetAuth, apiPostAuth} from "../../api";
import server from '../../settings';
import {getDefaultPageSize} from "../../helpers/utility";

const apiUrl = {
  getnotifications: server.apiInOut + 'NhacViec/GetViecLam',
  danhsachhuongdan: server.apiInOut + 'HuongDanSuDung/GetAll',
  changepassword: server.apiInOut + 'Hethongnguoidung/ChangePassword',
  updatenotifications: server.apiInOut + 'NhacViec/Update',
};
const api = {
  getNotifications: (param) => {
    return apiGetAuth(apiUrl.getnotifications, {...param});
  },
  updateNotifications: (param) => {
    return apiPostAuth(apiUrl.updatenotifications, {...param});
  },
  danhSachHuongDan: (param) => {
    return apiGetAuth(apiUrl.danhsachhuongdan, {
      ...param,
      PageNumber: 1,
      PageSize: 1000
    });
  },
  changePassword: (param) => {
    return apiPostAuth(apiUrl.changepassword, {...param});
  },
};

export default api;