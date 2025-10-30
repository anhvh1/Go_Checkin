import {
  apiGetAuth, apiPostAuth, apiPostAuth2
} from "../../../api";
import server from '../../../settings';

const apiUrl = {
  // uploadimage: server.apiImage + 'ocr/recognition',
  // verification: server.apiImage + 'face/verification',

  uploadimage: server.apiImage + 'recognition',
  verification: server.apiImage + 'verification',

  checkin: server.apiInOut + 'VaoRa/Vao',
  checkinv4: server.apiInOutv4 + 'VaoRa/Vao',
  updatecheckinv4: server.apiInOutv4 + 'VaoRa/UpdateThongTinVaoRa',
  checkout: server.apiInOut + 'VaoRa/Ra',
  checkoutv4: server.apiInOutv4 + 'VaoRa/Ra',
  danhsachcanbo: server.apiInOut + 'HeThongCanBo/DanhSachCanBo_TrongCoQuanSuDungPhanMem',
  danhsachletan: server.apiInOut + 'HeThongCanBo/GetDanhSachLeTan',
  getbymathe: server.apiInOutv4 + 'VaoRa/GetByMaThe',
  getbychandung: server.apiInOut + 'VaoRa/Get_By_AnhChanDung',
  getimagecamera: server.apiInOut + 'VaoRa/Get_AnhChanDung_FromCamera',
  getipcamera: server.apiInOut + 'SystemConfig/GetByKey',

  getlistpaging: server.apiInOutv4 + 'VaoRa/GetListPageBySearch',
  nhandien: server.apiInOutv4 + 'VaoRa/NhanDienKhuonMat',

};
const api = {
  UploadImage: (param) => {
    return apiPostAuth2(apiUrl.uploadimage, {...param});
  },
  Checkin: (param) => {
    return apiPostAuth(apiUrl.checkin, {...param});
  },
  Checkinv4: (param) => {
    return apiPostAuth(apiUrl.checkinv4, {...param});
  },
  UpdateCheckinv4: (param) => {
    return apiPostAuth(apiUrl.updatecheckinv4, {...param});
  },
  Checkout: (param) => {
    return apiPostAuth(apiUrl.checkout, {...param});
  },
  Checkoutv4: (param) => {
    return apiPostAuth(apiUrl.checkoutv4, {...param});
  },
  DanhSachCanBo: () => {
    return apiGetAuth(apiUrl.danhsachcanbo);
  },
  DanhSachLeTan: () => {
    return apiGetAuth(apiUrl.danhsachletan);
  },
  GetByMaThe: (param) => {
    return apiGetAuth(apiUrl.getbymathe, {...param});
  },
  Verification: (param) => {
    return apiPostAuth2(apiUrl.verification, {...param});
  },
  GetByChanDung: (param) => {
    return apiPostAuth(apiUrl.getbychandung, {...param});
  },
  GetImageCamera: (param) => {
    return apiGetAuth(apiUrl.getimagecamera, {...param});
  },
  GetIPCamera: (param) => {
    return apiGetAuth(apiUrl.getipcamera, {...param});
  },
  GetList: (param) => {
    return apiGetAuth(apiUrl.getlistpaging, {...param})
  },
  NhanDien: (param) => {
    return apiPostAuth(apiUrl.nhandien, {...param})
  }
};

export default api;