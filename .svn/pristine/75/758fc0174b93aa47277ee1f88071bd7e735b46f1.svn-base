import {apiGetAuth, apiPostAuth, apiGet, apiPost} from "../../../api";
import server from '../../../settings';
import {getDefaultPageSize} from "../../../helpers/utility";

const apiUrl = {
  danhsachtaikhoan: server.apiInOut + 'HeThongCanBo/GetListPaging',
  themtaikhoan: server.apiInOut + 'hethongcanbo/insert',
  suataikhoan: server.apiInOut + 'hethongcanbo/update',
  xoataikhoan: server.apiInOut + 'hethongcanbo/delete',
  chitiettaikhoan: server.apiInOut + 'hethongcanbo/getbyid',
  danhsachnguoidung: server.apiInOut + 'HeThongNguoiDung/GetListPaging',
  resetmatkhau: server.apiInOut + 'HeThongNguoiDung/ResetPassword'
};
const api = {
  DanhSachTaiKhoan: (param = {}) => {
    return apiGetAuth(apiUrl.danhsachtaikhoan, {
      ...param,
      PageNumber: param.PageNumber ? param.PageNumber : 1,
      PageSize: param.PageSize ? param.PageSize : getDefaultPageSize()
    })
  },
  DanhSachNguoiDung: (param) => {
    return apiGetAuth(apiUrl.danhsachnguoidung, {
      ...param,
      PageNumber: param.PageNumber ? param.PageNumber : 1,
      PageSize: param.PageSize ? param.PageSize : getDefaultPageSize()
    })
  },
  ChiTietTaiKhoan: (param) => {
    return apiGetAuth(apiUrl.chitiettaikhoan, {
      ...param
    });
  },
  ThemTaiKhoan: (param) => {
    return apiPostAuth(apiUrl.themtaikhoan, {...param});
  },
  SuaTaiKhoan: (param) => {
    return apiPostAuth(apiUrl.suataikhoan, {
      ...param
    });
  },
  XoaTaiKhoan: (param) => {
    return apiPostAuth(apiUrl.xoataikhoan, {
      ...param
    });
  },
  ResetMatKhau: (param) => {
    return apiGetAuth(apiUrl.resetmatkhau, {
      ...param
    });
  }
};

export default api;