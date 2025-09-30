import {
  apiGetAuth, apiPostAuth, apiPostAuth2, apiGet, apiPost
} from "../../../api";
import server from '../../../settings';

export const apiUrl = {
  scanimage: server.apiImage + 'recognition',
  verification: server.apiImage + 'verification',
  checkin: server.apiInOutv2 + 'VaoRa/Vao',
  checkout: server.apiInOutv2 + 'VaoRa/Ra',
  getbymathe: server.apiInOutv2 + 'VaoRa/GetByMaThe',
  coquancanbo: server.apiInOutv2 + 'VaoRa/DanhSachDoiTuongGap',
  getbyid: server.apiInOutv2 + 'VaoRa/GetByID'
};
const api = {
  ScanImage: (param) => {
    return apiPostAuth2(apiUrl.scanimage, {...param});
  },
  Verification: (param) => {
    return apiPostAuth2(apiUrl.verification, {...param});
  },
  Checkin: (param) => {
    return apiPost(apiUrl.checkin, {...param});
  },
  Checkout: (param) => {
    return apiPost(apiUrl.checkout, {...param});
  },
  GetByMaThe: (param) => {
    return apiGet(apiUrl.getbymathe, {...param});
  },
  DoiTuongGap: (param) => {
    return apiGet(apiUrl.coquancanbo, {...param});
  },
  GetByID: (param) => {
    return apiGet(apiUrl.getbyid, {...param});
  }
};

export default api;