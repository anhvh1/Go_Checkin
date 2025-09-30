import actions from './actions';

const initState = {
  DoiTuongGap: []
};

export default function Reducer(state = initState, action) {
  const {type, payload} = action;
  switch (type) {
    //get initData
    case actions.GUEST_GET_DATA_REQUEST:
      return {
        ...state
      };
    case actions.GUEST_GET_DATA_REQUEST_SUCCESS:
      return {
        ...state,
        DoiTuongGap: payload.DoiTuongGap
      };
    case actions.GUEST_GET_DATA_REQUEST_ERROR:
      return {
        ...state,
        DoiTuongGap: []
      };
    default:
      return state;
  }
}