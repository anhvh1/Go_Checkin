import {
  apiGetAuth,
  apiPostAuth,
  apiGet
} from "../../../api";
import server from '../../../settings';

const apiUrl = {
  danhsachcoquan: server.apiInOut + 'DanhMucCoQuanDonVi/GetListByUser_FoPhanQuyen',
  getallcoquan: server.apiInOut + 'DanhMucCoQuanDonVi/GetAll',
  danhsachdiagioi: server.apiInOut + 'danhmucdiagioihanhchinh/getallbycap',
  chitietcoquan: server.apiInOutv2 + 'danhmuccoquandonvi/GetByIDAndCap',
  themcoquan: server.apiInOut + 'danhmuccoquandonvi/Insert',
  suacoquan: server.apiInOut + 'danhmuccoquandonvi/Update',
  xoacoquan: server.apiInOut + 'danhmuccoquandonvi/Delete',
  listbyuser: server.apiInOut + 'DanhMucCoQuanDonVi/GetListByUser',
  checkmacq: server.apiInOut + 'DanhMucCoQuanDonVi/CheckMaCQ',
  danhsachcoquanloc: server.apiInOut + 'HeThongCanBo/GetDSCoQuanForFilterAndSearch',
  maqr: 'https://api.qrserver.com/v1/create-qr-code/'
};
const api = {
  danhSachCoQuan: (param) => {
    return apiGetAuth(apiUrl.danhsachcoquan, {
      ...param,
    });
  },
  danhSachDiaGioi: (param) => {
    return apiGetAuth(apiUrl.danhsachdiagioi, {
      ...param,
      ID: param.ID ? param.ID : 0
    });
  },
  chiTietCoQuan: (param) => {
    return apiGetAuth(apiUrl.chitietcoquan, {
      ...param
    });
  },
  themCoQuan: (param) => {
    return apiPostAuth(apiUrl.themcoquan, {
      ...param
    });
  },
  suaCoQuan: (param) => {
    return apiPostAuth(apiUrl.suacoquan, {
      ...param
    });
  },
  xoaCoQuan: (param) => {
    return apiPostAuth(apiUrl.xoacoquan, {
      ...param
    });
  },
  AllCoQuan: () => {
    return apiGetAuth(apiUrl.getallcoquan);
  },
  ListByUser: () => {
    return apiGetAuth(apiUrl.listbyuser)
  },
  CheckMaCQ: (param) => {
    return apiGetAuth(apiUrl.checkmacq, {
      ...param
    })
  },
  danhSachCoQuanLoc: (param) => {
    return apiGetAuth(apiUrl.danhsachcoquanloc, {
      ...param,
    });
  },
  TaoMaQR: (param) => {
    return apiGet(apiUrl.maqr, {...param})
  }
};

export default api;