import {all} from "redux-saga/effects";
import Dashboard from "./Dashboard/saga";
import NhacViec from "./NhacViec/saga";
import CheckinOut from "./CheckinOut/saga";
import BaoCao from "./BaoCao/saga";
import QLTaiKhoan from "./QLTaiKhoan/saga";
import DMCoQuan from "./DMCoQuan/saga";
import DMChucVu from "./DMChucVu/saga";
import ThamSoHeThong from "./ThamSoHeThong/saga";
import QLPhanQuyen from "./QLPhanQuyen/saga";

export default function* devSaga() {
  yield all([
    Dashboard(),
    NhacViec(),
    CheckinOut(),
    BaoCao(),
    QLTaiKhoan(),
    DMCoQuan(),
    DMChucVu(),
    ThamSoHeThong(),
    QLPhanQuyen(),
  ]);
}
