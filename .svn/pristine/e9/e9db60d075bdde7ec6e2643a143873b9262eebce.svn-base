import {
  apiGetAuth, apiPostAuth
} from "../../../api";
import server from '../../../settings';

const apiUrl = {
  taobaocao: server.apiInOut + 'VaoRa/ThongKe_KhachVaoRa',
};
const api = {
  TaoBaoCao: (param) => {
    return apiGetAuth(apiUrl.taobaocao, {...param});
  },
};

export default api;