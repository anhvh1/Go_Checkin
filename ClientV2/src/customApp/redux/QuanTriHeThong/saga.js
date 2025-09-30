import {all, takeEvery, put, call} from "redux-saga/effects";
import api from "../../containers/QuanTriHeThong/config";
import apiCoQuan from "../../containers/DMCoQuan/config";
import actions from "./actions";
import {formatDataTreeSelect} from "../../../helpers/utility";

function* getInitDataSP({payload}) {
  try {
    const response = yield call(api.DanhSachCoQuanSuDungPM, payload.filterData);
    const tinh = yield call(api.DanhSachDiaGioi, {ID: 0, Cap: 1});
    yield put({
      type: actions.HETHONGSP_GET_INIT_DATA_REQUEST_SUCCESS,
      payload: {
        DanhSachQuanTri: response.data.Data,
        TotalRow: response.data.TotalRow,
        DanhSachTinh: tinh.data.Data
      }
    });
  } catch (e) {
    yield put({
      type: actions.HETHONGSP_GET_INIT_DATA_REQUEST_ERROR
    });
  }
}

function* getListSP({payload}) {
  try {
    const response = yield call(api.DanhSachCoQuanSuDungPM, payload.filterData);
    yield put({
      type: actions.HETHONGSP_GET_LIST_REQUEST_SUCCESS,
      payload: {
        DanhSachQuanTri: response.data.Data,
        TotalRow: response.data.TotalRow,
      }
    });
  } catch (e) {
    yield put({
      type: actions.HETHONGSP_GET_LIST_REQUEST_ERROR
    });
  }
}

function* getInitData({payload}) {
  try {
    const response = yield call(api.DanhSachCanBoDonVi, payload.filterData);
    const coquan = yield call(apiCoQuan.danhSachCoQuan);
    const DanhSachCoQuan = formatDataTreeSelect(coquan.data.Data);
    yield put({
      type: actions.HETHONG_GET_INIT_DATA_REQUEST_SUCCESS,
      payload: {
        DanhSachCanBo: response.data.Data.DanhSachCanBo,
        DanhSachCoQuan,
        TotalRow: response.data.TotalRow,
        QRCode: response.data.Data.QRCode,
        TenCoQuan: response.data.Data.TenCoQuanSuDungPhanMen,
      }
    });
  } catch (e) {
    yield put({
      type: actions.HETHONG_GET_INIT_DATA_REQUEST_ERROR
    });
  }
}

function* getList({payload}) {
  try {
    const response = yield call(api.DanhSachCanBoDonVi, payload.filterData);
    yield put({
      type: actions.HETHONG_GET_LIST_REQUEST_SUCCESS,
      payload: {
        DanhSachCanBo: response.data.Data.DanhSachCanBo,
        TotalRow: response.data.TotalRow
      }
    });
  } catch (e) {
    yield put({
      type: actions.HETHONG_GET_LIST_REQUEST_ERROR
    });
  }
}

function* getCQ() {
  try {
    const coquan = yield call(apiCoQuan.danhSachCoQuan);
    const DanhSachCoQuan = formatDataTreeSelect(coquan.data.Data);
    yield put({
      type: actions.HETHONG_GET_CQ_REQUEST_SUCCESS,
      payload: {
        DanhSachCoQuan
      }
    });
  } catch (e) {
    yield put({
      type: actions.HETHONG_GET_CQ_REQUEST_ERROR
    });
  }
}

export default function* rootSaga() {
  yield all([yield takeEvery(actions.HETHONGSP_GET_INIT_DATA_REQUEST, getInitDataSP)]);
  yield all([yield takeEvery(actions.HETHONG_GET_INIT_DATA_REQUEST, getInitData)]);
  yield all([yield takeEvery(actions.HETHONGSP_GET_LIST_REQUEST, getListSP)]);
  yield all([yield takeEvery(actions.HETHONG_GET_LIST_REQUEST, getList)]);
  yield all([yield takeEvery(actions.HETHONG_GET_CQ_REQUEST, getCQ)]);
}
