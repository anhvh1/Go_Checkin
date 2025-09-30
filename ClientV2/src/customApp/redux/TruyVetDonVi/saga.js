import { all, takeEvery, put, call } from "redux-saga/effects";
import api from "../../containers/TruyVetDonVi/config";
import actions from "./actions";

function* getData({payload}) {
  try {
    const truyvet = yield call(api.TruyVetDonVi, payload.filterData);
    yield put({
      type: actions.TRUYVETDONVI_GET_DATA_REQUEST_SUCCESS,
      payload: {
        DanhSachTruyVet: truyvet.data.Data,
        TotalRow: truyvet.data.TotalRow
      }
    });
  } catch (e) {
    yield put({
      type: actions.TRUYVETDONVI_GET_DATA_REQUEST_ERROR
    });
  }
}

export default function* rootSaga() {
  yield all([yield takeEvery(actions.TRUYVETDONVI_GET_DATA_REQUEST, getData)]);
}
