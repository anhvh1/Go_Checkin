import actions from './actions';

const initState = {
  DanhSachTruyVet: [],
  TotalRow: 0,
  TableLoading: false
};

export default function Reducer(state = initState, action) {
  const {type, payload} = action;
  switch (type) {
    //get initData
    case actions.TRUYVETDONVI_GET_DATA_REQUEST:
      return {
        ...state,
        TableLoading: true
      };
    case actions.TRUYVETDONVI_GET_DATA_REQUEST_SUCCESS:
      return {
        ...state,
        DanhSachTruyVet: payload.DanhSachTruyVet,
        TotalRow: payload.TotalRow,
        TableLoading: false
      };
    case actions.TRUYVETDONVI_GET_DATA_REQUEST_ERROR:
      return {
        ...state,
        DanhSachTruyVet: [],
        TotalRow: 0,
        TableLoading: false
      };
    default:
      return state;
  }
}