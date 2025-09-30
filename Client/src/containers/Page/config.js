import {
  apiGet,
  apiGetAuth,
  apiGetUser,
  apiPost
} from "../../api";
import server from '../../settings';

const apiUrl = {
  dangnhap: server.apiInOut + 'Nguoidung/DangNhap',
  chitiet: server.apiInOut + 'HeThongNguoiDung/GetByIDForPhanQuyen',
  getdataconfig: server.apiInOut + 'SystemConfig/GetByKey'
};
const api = {
  dangNhap: (param) => {
    return apiPost(apiUrl.dangnhap, {
      ...param
    });
  },
  chiTiet: (param) => {
    return apiGetUser(apiUrl.chitiet, {
      ...param
    });
  },
  getDataConfig : (param) => {
    return apiGet(apiUrl.getdataconfig, {...param});
  }
};

export default api;