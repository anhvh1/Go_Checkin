import { all, takeEvery, put, call } from "redux-saga/effects";
import api from "../../containers/BaoCao/config";
import apiCheckin from "../../containers/CheckinOut/config";
import actions from "./actions";
import {formatDataCoQuanCanBo} from "../../../helpers/utility";

function* getInitData() {
  try {
    // const responseCanBo = yield call(apiCheckin.DanhSachCanBo);
    const responseLeTan = yield call(apiCheckin.DanhSachLeTan);
    const responseDoiTuongGap = yield call(apiCheckin.DoiTuongGap);
    const DoiTuongGap = formatDataCoQuanCanBo([responseDoiTuongGap.data.Data]);
    yield put({
      type: actions.BAOCAO_GET_DATA_REQUEST_SUCCESS,
      payload: {
        // DanhSachCanBo: responseCanBo.data.Data,
        DanhSachLeTan: responseLeTan.data.Data,
        DoiTuongGap
      }
    });
  } catch (e) {
    yield put({
      type: actions.BAOCAO_GET_DATA_REQUEST_ERROR
    });
  }
}

export default function* rootSaga() {
  yield all([yield takeEvery(actions.BAOCAO_GET_DATA_REQUEST, getInitData)]);
}
