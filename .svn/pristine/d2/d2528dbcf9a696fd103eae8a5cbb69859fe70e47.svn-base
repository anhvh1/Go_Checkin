import {
  apiGetAuth, apiGetUser,
  apiPostAuth
} from "../../../api";
import server from '../../../settings';
import {getDefaultPageSize} from "../../../helpers/utility";

const apiUrl = {
  danhsachnhom: server.apiInOut + 'PhanQuyen/GetListPaging',
  danhsachcoquan: server.apiInOut + 'DanhMucCoQuanDonVi/GetListByUser_FoPhanQuyen',
  danhsachcanbo: server.apiInOut + 'hethongcanbo/getlistpaging',

  themnhom: server.apiInOut + 'PhanQuyen/NhomNguoiDung_Insert',
  suanhom: server.apiInOut + 'PhanQuyen/NhomNguoiDung_Update',
  chitietnhom: server.apiInOut + 'PhanQuyen/NhomNguoiDung_GetFoUpdate',
  sieuchitietnhom: server.apiInOut + 'PhanQuyen/NhomNguoiDung_GetChiTietByNhomNguoiDungID',
  xoanhom: server.apiInOut + 'PhanQuyen/NhomNguioDung_Delete',
  //chitietnguoidung: server.apiInOut + 'HeThongNguoiDung/GetByIDForPhanQuyen',
  danhsachchucnangduocthaotac: server.apiInOut + 'PhanQuyen/PhanQuyen_GetQuyenDuocThaoTacTrongNhom',

  danhsachnguoidung: server.apiInOut + 'HeThongNguoiDung/HeThong_NguoiDung_GetListBy_NhomNguoiDungID',
  themnguoidung: server.apiInOut + 'PhanQuyen/NguoiDung_NhomNguoiDung_Insert',
  xoanguoidung: server.apiInOut + 'PhanQuyen/NguoiDung_NhomNguoiDung_Delete',

  themchucnang: server.apiInOut + 'PhanQuyen/PhanQuyen_InsertMult',
  suachucnang: server.apiInOut + 'PhanQuyen/PhanQuyen_Update',
  xoachucnang: server.apiInOut + 'PhanQuyen/PhanQuyen_Delete',

  danhsachnhomnguoidungbycoquanid: server.apiInOut + 'PhanQuyen/GetListNNDByCoQuanID'
};
const api = {
  danhSachNhom: (param) => {
    return apiGetAuth(apiUrl.danhsachnhom,{
      ...param,
      PageNumber: param.PageNumber ? param.PageNumber : 1,
      PageSize: param.PageSize ? param.PageSize : getDefaultPageSize()
    });
  },
  danhSachCoQuan: (param) => {
    return apiGetAuth(apiUrl.danhsachcoquan,{
      ...param
    });
  },
  danhSachCanBo: (param) => {
    return apiGetAuth(apiUrl.danhsachcanbo,{
      ...param,
      PageNumber: 1,
      PageSize: 999999
    });
  },
  themNhom: (param) => {
    return apiPostAuth(apiUrl.themnhom,{
      ...param
    });
  },
  suaNhom: (param) => {
    return apiPostAuth(apiUrl.suanhom,{
      ...param
    });
  },
  chiTietNhom: (param) => {
    return apiGetAuth(apiUrl.chitietnhom,{
      ...param
    });
  },
  sieuChiTietNhom: (param) => {
    return apiGetAuth(apiUrl.sieuchitietnhom,{
      ...param
    });
  },
  xoaNhom: (param) => {
    return apiPostAuth(apiUrl.xoanhom,{
      ...param
    });
  },
  // chiTietNguoiDung: (param) => {
  //   return apiGetUser(apiUrl.chitietnguoidung, {
  //     ...param
  //   });
  // },
  danhSachChucNangDuocThaoTac: (param) => {
    return apiGetAuth(apiUrl.danhsachchucnangduocthaotac, {
      ...param
    });
  },
  danhSachNguoiDung: (param) => {
    return apiGetAuth(apiUrl.danhsachnguoidung,{
      ...param
    });
  },
  themNguoiDung: (param) => {
    return apiPostAuth(apiUrl.themnguoidung,{
      ...param
    });
  },
  xoaNguoiDung: (param) => {
    return apiPostAuth(apiUrl.xoanguoidung,{
      ...param
    });
  },
  themChucNang: (paramArray) => {
    return apiPostAuth(apiUrl.themchucnang,paramArray);
  },
  suaChucNang: (paramArray) => {
    return apiPostAuth(apiUrl.suachucnang, paramArray);
  },
  xoaChucNang: (param) => {
    return apiPostAuth(apiUrl.xoachucnang,{
      ...param
    });
  },
  DanhSachNhomByCoQuanID: (param)=>{
    return apiGetAuth(apiUrl.danhsachnhomnguoidungbycoquanid,{
      ...param
    });
  }
};

export default api;