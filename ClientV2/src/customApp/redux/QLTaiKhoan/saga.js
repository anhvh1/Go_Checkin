import {all, takeEvery, put, call} from "redux-saga/effects";
import api from "../../containers/QLTaiKhoan/config";
import apiCoQuan from "../../containers/DMCoQuan/config";
import apiChucVu from "../../containers/DMChucVu/config";
import apiNhomNguoiDung from "../../containers/QLPhanQuyen/config";
import apiConfig from "../../containers/ThamSoHeThong/config"
import actions from "./actions";
import {formatDMCoQuanCoHieuLuc} from "../../../helpers/utility";

const paramAll = {PageSize: 99999, PageNumber: 1};

function* getInitData({payload}) {
  try {
    const response = yield call(api.DanhSachTaiKhoan, payload.filterData);
    const responseAllNguoiDung = yield call(api.DanhSachNguoiDung, paramAll);
    const responseCoQuan = yield call(apiCoQuan.danhSachCoQuan);
    const responseAllCoQuan = yield call(apiCoQuan.AllCoQuan);
    const responseChucVu = yield call(apiChucVu.DanhSachChucVu, paramAll);
    const responsePhanQuyen = yield call(apiNhomNguoiDung.danhSachNhom, paramAll);
    const responseConfig = yield call(apiConfig.GetByKey, {ConfigKey:'MatKhau_MacDinh'});
    yield put({
      type: actions.TAIKHOAN_GET_INIT_DATA_REQUEST_SUCCESS,
      payload: {
        DanhSachTaiKhoan: response.data.Data,
        TotalRow: response.data.TotalRow,
        DanhSachTaiKhoanAll: responseAllNguoiDung.data.Data,
        DanhSachChucVu: responseChucVu.data.Data,
        DanhSachCoQuan: formatDMCoQuanCoHieuLuc(responseCoQuan.data.Data),
        DanhSachCoQuanAll: responseAllCoQuan.data.Data,
        DanhSachNhomNguoiDung: responsePhanQuyen.data.Data,
        MatKhauMacDinh:responseConfig.data.Data.ConfigValue
      }
    });
  } catch (e) {
    yield put({
      type: actions.TAIKHOAN_GET_INIT_DATA_REQUEST_ERROR
    });
  }
}

function* getList({payload}) {
  try {
    const response = yield call(api.DanhSachTaiKhoan, payload.filterData);
    yield put({
      type: actions.TAIKHOAN_GET_LIST_REQUEST_SUCCESS,
      payload: {
        DanhSachTaiKhoan: response.data.Data,
        TotalRow: response.data.TotalRow,
      }
    });
  } catch (e) {
    yield put({
      type: actions.TAIKHOAN_GET_LIST_REQUEST_ERROR
    });
  }
}

export default function* rootSaga() {
  yield all([yield takeEvery(actions.TAIKHOAN_GET_INIT_DATA_REQUEST, getInitData)]);
  yield all([yield takeEvery(actions.TAIKHOAN_GET_LIST_REQUEST, getList)]);
}
