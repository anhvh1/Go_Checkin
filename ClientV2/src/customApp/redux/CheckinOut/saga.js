import { all, takeEvery, put, call } from "redux-saga/effects";
import api from "../../containers/CheckinOut/config";
import api2 from "../../containers/CheckinOutv2/config";
import actions from "./actions";
import {formatDataCoQuanCanBo} from "../../../helpers/utility";

function* getInitData({payload}) {
  try {
    // const responseCanBo = yield call(api.DanhSachCanBo);
    const responseLeTan = yield call(api.DanhSachLeTan);
    const responseTongHop = yield call(api.TongHopNgay);
    const responseDoiTuongGap = yield call(api.DoiTuongGap);
    const DoiTuongGap = formatDataCoQuanCanBo([responseDoiTuongGap.data.Data]);
    // const responseCameraIP = yield call(api.GetIPCamera, {ConfigKey: "Camera_Path"});
    //return action
    yield put({
      type: actions.CHECKIN_GET_DATA_REQUEST_SUCCESS,
      payload: {
        // DanhSachCanBo: responseCanBo.data.Data,
        DanhSachLeTan: responseLeTan.data.Data,
        TongHopNgay: responseTongHop.data.Data,
        DoiTuongGap
        // IPCamera: responseCameraIP.data.Data.ConfigValue
      }
    });
  } catch (e) {
    yield put({
      type: actions.CHECKIN_GET_DATA_REQUEST_ERROR
    });
  }
}

function* getList({payload}) {
  try {
    // const responseCheckin = yield call(api2.GetList, {...payload.filterData, Type: 2});
    const responseTongHop = yield call(api.TongHopNgay);
    yield put({
      type: actions.CHECKIN_GET_LIST_REQUEST_SUCCESS,
      payload: {
        TongHopNgay: responseTongHop.data.Data
        // DanhSachCheckin: responseCheckin.data.Data,
        // TotalRow: responseCheckin.data.TotalRow,
      }
    });
  } catch (e) {
    yield put({
      type: actions.CHECKIN_GET_LIST_REQUEST_ERROR
    });
  }
}

export default function* rootSaga() {
  yield all([yield takeEvery(actions.CHECKIN_GET_DATA_REQUEST, getInitData)]);
  yield all([yield takeEvery(actions.CHECKIN_GET_LIST_REQUEST, getList)]);
}
