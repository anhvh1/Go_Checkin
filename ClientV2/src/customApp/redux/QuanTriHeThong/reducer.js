import actions from './actions';

const initState = {
  DanhSachQuanTri: [],
  TotalRow: 0,
  TableLoading: false,
  DanhSachTinh: [],
  DanhSachCoQuan: [],
  QRCode: "",
  TenCoQuan: ""
};

export default function Reducer(state = initState, action) {
  const {type, payload} = action;
  switch (type) {
    //get initData SP
    case actions.HETHONGSP_GET_INIT_DATA_REQUEST:
      return {
        ...state,
        TableLoading: true
      };
    case actions.HETHONGSP_GET_INIT_DATA_REQUEST_SUCCESS:
      return {
        ...state,
        TotalRow: payload.TotalRow,
        TableLoading: false,
        DanhSachQuanTri: payload.DanhSachQuanTri,
        DanhSachTinh: payload.DanhSachTinh
      };
    case actions.HETHONGSP_GET_INIT_DATA_REQUEST_ERROR:
      return {
        ...state,
        TotalRow: 0,
        TableLoading: false,
        DanhSachQuanTri: [],
        DanhSachTinh: []
      };
    //get list SP
    case actions.HETHONGSP_GET_LIST_REQUEST:
      return {
        ...state,
        TableLoading: true
      };
    case actions.HETHONGSP_GET_LIST_REQUEST_SUCCESS:
      return {
        ...state,
        TotalRow: payload.TotalRow,
        DanhSachQuanTri: payload.DanhSachQuanTri,
        TableLoading: false
      };
    case actions.HETHONGSP_GET_LIST_REQUEST_ERROR:
      return {
        ...state,
        DanhSachQuanTri: [],
        TotalRow: 0,
        TableLoading: false
      };
    //get initData
    case actions.HETHONG_GET_INIT_DATA_REQUEST:
      return {
        ...state,
        TableLoading: true
      };
    case actions.HETHONG_GET_INIT_DATA_REQUEST_SUCCESS:
      return {
        ...state,
        TotalRow: payload.TotalRow,
        DanhSachCanBo: payload.DanhSachCanBo,
        DanhSachCoQuan: payload.DanhSachCoQuan,
        QRCode: payload.QRCode,
        TenCoQuan: payload.TenCoQuan,
        TableLoading: false
      };
    case actions.HETHONG_GET_INIT_DATA_REQUEST_ERROR:
      return {
        ...state,
        TotalRow: 0,
        TableLoading: false,
        DanhSachCanBo: [],
        QRCode: "",
        DanhSachCoQuan: []
      };
    //get list
    case actions.HETHONG_GET_LIST_REQUEST:
      return {
        ...state,
        TableLoading: true
      };
    case actions.HETHONG_GET_LIST_REQUEST_SUCCESS:
      return {
        ...state,
        TotalRow: payload.TotalRow,
        DanhSachCanBo: payload.DanhSachCanBo,
        TableLoading: false
      };
    case actions.HETHONG_GET_LIST_REQUEST_ERROR:
      return {
        ...state,
        DanhSachCanBo: [],
        TotalRow: 0,
        TableLoading: false
      };
    //get CQ
    case actions.HETHONG_GET_CQ_REQUEST:
      return {
        ...state
      };
    case actions.HETHONG_GET_CQ_REQUEST_SUCCESS:
      return {
        ...state,
        DanhSachCoQuan: payload.DanhSachCoQuan
      };
    case actions.HETHONG_GET_CQ_REQUEST_ERROR:
      return {
        ...state,
        DanhSachCoQuan: []
      };
    default:
      return state;
  }
}