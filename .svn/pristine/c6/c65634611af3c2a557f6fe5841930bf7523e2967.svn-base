import {
  apiGetAuth, apiPostAuth
} from "../../../api";
import server from '../../../settings';

const apiUrl = {
  truyvettoantinh: server.apiInOutv4 + 'VaoRa/TruyVetYTe_ToanTinh',
};
const api = {
  TruyVetToanTinh: (param) => {
    return apiGetAuth(apiUrl.truyvettoantinh, {...param});
  },
};

export default api;