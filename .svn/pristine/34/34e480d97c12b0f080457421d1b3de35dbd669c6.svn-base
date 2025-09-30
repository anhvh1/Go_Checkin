import {
  apiGet,
  apiGetAuth,
  apiGetUser,
  apiPost
} from "../../../api";
import server from '../../../settings';

const apiUrl = {
  dangnhap: server.apiInOut + 'Nguoidung/DangNhap',
  chitiet: server.apiInOut + 'HeThongNguoiDung/GetByIDForPhanQuyen',
  getdataconfig: server.apiInOut + 'SystemConfig/GetByKey',
  danhsachdiagioi: server.apiInOut + 'danhmucdiagioihanhchinh/getallbycap',
  dangkytaikhoan: server.apiInOutv2 + 'DanhMucCoQuanDonVi/KhoiTaoDonViSuDungPhanMem'
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

  getDataConfig: (param) => {
    return apiGet(apiUrl.getdataconfig, {...param});
  },

  danhSachDiaGioi: (param) => {
    return apiGet(apiUrl.danhsachdiagioi, {
      ...param,
      ID: param.ID ? param.ID : 0
    });
  },
  DangKyTaiKhoan: (param) => {
    return apiPost(apiUrl.dangkytaikhoan, {...param});
  }

};

export default api;