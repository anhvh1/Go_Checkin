import { all, takeEvery, put, call } from "redux-saga/effects";
import api from "../../containers/CheckinNoLogin/config";
import actions from "./actions";
import {formatDataCoQuanCanBo} from "../../../helpers/utility";

function* getInitData({payload}) {
  try {
    const responseDoiTuongGap = yield call(api.DoiTuongGap, {DonViSuDungID: payload.filterData.q});
    const DoiTuongGap = formatDataCoQuanCanBo([responseDoiTuongGap.data.Data]);
    yield put({
      type: actions.GUEST_GET_DATA_REQUEST_SUCCESS,
      payload: {
        DoiTuongGap
      }
    });
  } catch (e) {
    yield put({
      type: actions.GUEST_GET_DATA_REQUEST_ERROR
    });
  }
}

export default function* rootSaga() {
  yield all([yield takeEvery(actions.GUEST_GET_DATA_REQUEST, getInitData)]);
}
