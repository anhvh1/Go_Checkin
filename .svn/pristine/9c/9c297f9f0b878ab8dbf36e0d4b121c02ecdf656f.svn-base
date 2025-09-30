import {all, takeEvery, put, fork, call} from 'redux-saga/effects';
import api from "../../containers/Topbar/config";

export function* getNotification() {
  yield takeEvery("GET_NOTIFICATION_REQUEST_TO_APP_SAGA", function* () {
    // const response = yield call(api.getNotifications);
    // const responseHuongDan = yield call(api.danhSachHuongDan);
    // if (response.data.Status && response.data.Status > 0) {
      yield put({
        type: "GET_NOTIFICATION_SUCCESS",
        notifications: [],
        // DanhSachHuongDan: responseHuongDan.data.Data
      });
    // }
  });
}

export default function* rootSaga() {
  yield all([
    fork(getNotification)
  ]);
}
