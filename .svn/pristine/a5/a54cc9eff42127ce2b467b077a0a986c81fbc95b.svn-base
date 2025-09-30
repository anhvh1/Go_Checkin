import { all, takeEvery, put, call } from "redux-saga/effects";
import api from "../../containers/TruyVetToanTinh/config";
import actions from "./actions";

function* getData({payload}) {
  try {
    const truyvet = yield call(api.TruyVetToanTinh, payload.filterData);
    yield put({
      type: actions.TRUYVETTINH_GET_DATA_REQUEST_SUCCESS,
      payload: {
        DanhSachTruyVet: truyvet.data.Data,
        TotalRow: truyvet.data.TotalRow
      }
    });
  } catch (e) {
    yield put({
      type: actions.TRUYVETTINH_GET_DATA_REQUEST_ERROR
    });
  }
}

export default function* rootSaga() {
  yield all([yield takeEvery(actions.TRUYVETTINH_GET_DATA_REQUEST, getData)]);
}
