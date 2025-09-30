import {
  apiGetAuth, apiPostAuth, apiPostAuth2
} from "../../../api";
import server from '../../../settings';

const apiUrl = {
  // uploadimage: server.apiImage + 'ocr/recognition',
  // verification: server.apiImage + 'face/verification',

  uploadimage: server.apiImage + 'ekyc/recognition',
  verification: server.apiImage + 'ekyc/verification',

  checkin: server.apiInOut + 'VaoRa/Vao',
  checkout: server.apiInOut + 'VaoRa/Ra',
  danhsachcanbo: server.apiInOut + 'HeThongCanBo/DanhSachCanBo_TrongCoQuanSuDungPhanMem',
  danhsachletan: server.apiInOut + 'HeThongCanBo/GetDanhSachLeTan',
  getbymathe: server.apiInOut + 'VaoRa/GetByMaThe',
  getbychandung: server.apiInOut + 'VaoRa/Get_By_AnhChanDung',
  getimagecamera: server.apiInOut + 'VaoRa/Get_AnhChanDung_FromCamera',
  getipcamera: server.apiInOut + 'SystemConfig/GetByKey',

  getlistpaging: server.apiInOut + 'VaoRa/GetListPageBySearch'
};
const api = {
  UploadImage: (param) => {
    return apiPostAuth2(apiUrl.uploadimage, {...param});
  },
  Checkin: (param) => {
    return apiPostAuth(apiUrl.checkin, {...param});
  },
  Checkout: (param) => {
    return apiPostAuth(apiUrl.checkout, {...param});
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
  }
};

export default api;