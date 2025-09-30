import actions from './actions';

const initState = {
  DanhSachCanBo: [],
  DanhSachLeTan: [],
  IPCamera: "",
  role: {view: 0, add: 0, edit: 0, delete: 0},
  roleBaoCao: {view: 0, add: 0, edit: 0, delete: 0},
  TongHopNgay: {},
  DoiTuongGap: []
};

export default function Reducer(state = initState, action) {
  const {type, payload} = action;
  switch (type) {
    //get initData
    case actions.CHECKIN_GET_DATA_REQUEST:
      return {
        ...state,
        role: payload.role,
        roleBaoCao: payload.roleBaoCao,
      };
    case actions.CHECKIN_GET_DATA_REQUEST_SUCCESS:
      return {
        ...state,
        // DanhSachCanBo: payload.DanhSachCanBo,
        DoiTuongGap: payload.DoiTuongGap,
        DanhSachLeTan: payload.DanhSachLeTan,
        TongHopNgay: payload.TongHopNgay,
        // IPCamera: payload.IPCamera,
      };
    case actions.CHECKIN_GET_DATA_REQUEST_ERROR:
      return {
        ...state
      };
    //get list
    case actions.CHECKIN_GET_LIST_REQUEST:
      return {
        ...state
      };
    case actions.CHECKIN_GET_LIST_REQUEST_SUCCESS:
      return {
        ...state,
        TongHopNgay: payload.TongHopNgay
      };
    case actions.CHECKIN_GET_LIST_REQUEST_ERROR:
      return {
        ...state
      };
    default:
      return state;
  }
}