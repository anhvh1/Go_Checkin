import {
  apiGetAuth, apiPostAuth
} from "../../../api";
import server from '../../../settings';

const apiUrl = {
  truyvetdonvi: server.apiInOutv4 + 'VaoRa/TruyVetYTe_TrongDonVi',
};
const api = {
  TruyVetDonVi: (param) => {
    return apiGetAuth(apiUrl.truyvetdonvi, {...param});
  },
};

export default api;