import {apiGetAuth, apiPostAuth, apiGet, apiPost} from "../../../api";
import server from '../../../settings';
import {getDefaultPageSize} from "../../../helpers/utility";

export const apiUrl = {
  suacanbo: server.apiInOutv2 + 'HeThongCanBo/CapNhatThongTinCanBo',
  suacanbov4: server.apiInOutv2 + 'HeThongCanBo/CapNhatThongTinCanBo_v4',
  chitiettaikhoan: server.apiInOut + 'HeThongCanBo/getbyid',
  resetmatkhau: server.apiInOut + 'HeThongNguoiDung/ResetPassword',
  diagioi: server.apiInOut + 'danhmucdiagioihanhchinh/getallbycap',
  coquansudungpm: server.apiInOutv2 + 'DanhMucCoQuanDonVi/DanhSachDonViSuDungPhanMem',
  xoacoquan: server.apiInOutv2 + 'DanhMucCoQuanDonVi/XoaPhongBan',
  capnhattrangthai: server.apiInOutv2 + 'DanhMucCoQuanDonVi/CapNhatTrangThaiSuDungPhanMem',
  suacoquan: server.apiInOut + 'DanhMucCoQuanDonVi/Update',
  themdonvi: server.apiInOutv2 + 'DanhMucCoQuanDonVi/KhoiTaoDonViSuDungPhanMem',
  chitietdonvi: server.apiInOutv2 + 'DanhMucCoQuanDonVi/ChiTietDonViSuDungPhanMem',
  suadonvi: server.apiInOutv2 + 'DanhMucCoQuanDonVi/CapNhatThongTinDonViSuDungPhanMem',
  danhsachcanbodonvi: server.apiInOutv2 + 'DanhMucCoQuanDonVi/DanhSachCanBoThuocDonViSuDungPhanMen',
  themcanbo: server.apiInOutv4 + 'DanhMucCoQuanDonVi/ThemCanBoVaoDonViSuDungPhanMen',
  xoacanbo: server.apiInOut + 'HeThongCanBo/delete',
  chitietcanbo: server.apiInOut + 'HeThongCanBo/GetByID',
  suatencoquan: server.apiInOutv2 + 'DanhMucCoQuanDonVi/SuaPhongBan',
};
const api = {
  ChiTietTaiKhoan: (param) => {
    return apiGetAuth(apiUrl.chitiettaikhoan, {
      ...param
    });
  },
  SuaCanBo: (param) => {
    return apiPostAuth(apiUrl.suacanbo, {
      ...param
    });
  },
  ResetMatKhau: (param) => {
    return apiGetAuth(apiUrl.resetmatkhau, {
      ...param
    });
  },
  DanhSachDiaGioi: (param) => {
    return apiGetAuth(apiUrl.diagioi, {...param});
  },
  DanhSachCoQuanSuDungPM: (param) => {
    return apiGetAuth(apiUrl.coquansudungpm, {
      ...param,
      PageNumber: param.PageNumber ? param.PageNumber : 1,
      PageSize: param.PageSize ? param.PageSize : getDefaultPageSize()
    })
  },
  XoaCoQuan: (param) => {
    return apiPostAuth(apiUrl.xoacoquan, {
      ...param,
      TenCoQuan: "empty"
    });
  },
  CapNhatTrangThai: (param) => {
    return apiPostAuth(apiUrl.capnhattrangthai, {...param});
  },
  SuaCoQuan: (param) => {
    return apiPostAuth(apiUrl.suacoquan, {...param});
  },
  ThemDonVi: (param) => {
    return apiPostAuth(apiUrl.themdonvi, {...param});
  },
  SuaDonVi: (param) => {
    return apiPostAuth(apiUrl.suadonvi, {...param});
  },
  ChiTietCoQuanSuDungPM: (param) => {
    return apiGetAuth(apiUrl.chitietdonvi, {...param});
  },
  DanhSachCanBoDonVi: (param) => {
    return apiGetAuth(apiUrl.danhsachcanbodonvi, {
      ...param,
      PageNumber: param.PageNumber ? param.PageNumber : 1,
      PageSize: param.PageSize ? param.PageSize : getDefaultPageSize()
    });
  },
  XoaTaiKhoan: (param) => {
    return apiPostAuth(apiUrl.xoacanbo, {
      ...param
    });
  },
  ThemCanBo: (param) => {
    return apiPostAuth(apiUrl.themcanbo, {...param});
  },
  ChiTietCanBo: (param) => {
    return apiGetAuth(apiUrl.chitietcanbo, {...param});
  },
  SuaTenCoQuan: (param => {
    return apiPostAuth(apiUrl.suatencoquan, {...param});
  })
};

export default api;