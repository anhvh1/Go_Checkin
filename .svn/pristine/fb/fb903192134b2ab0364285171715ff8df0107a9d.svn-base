import actions from './actions';

const initState = {
  DanhSachCanBo: [],
  DanhSachLeTan: [],
};

export default function Reducer(state = initState, action) {
  const {type, payload} = action;
  switch (type) {
    //get initData
    case actions.BAOCAO_GET_DATA_REQUEST:
      return {
        ...state,
      };
    case actions.BAOCAO_GET_DATA_REQUEST_SUCCESS:
      return {
        ...state,
        // DanhSachCanBo: payload.DanhSachCanBo,
        DanhSachLeTan: payload.DanhSachLeTan,
        DoiTuongGap: payload.DoiTuongGap,
      };
    case actions.BAOCAO_GET_DATA_REQUEST_ERROR:
      return {
        ...state
      };
    default:
      return state;
  }
}