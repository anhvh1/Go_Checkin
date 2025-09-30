import {
  apiGetAuth, apiPostAuth
} from "../../../api";
import server from '../../../settings';

const apiUrl = {
  taobaocao: server.apiInOutv4 + 'VaoRa/ThongKe_KhachVaoRa',
};
const api = {
  TaoBaoCao: (param) => {
    return apiGetAuth(apiUrl.taobaocao, {...param});
  },
};

export default api;