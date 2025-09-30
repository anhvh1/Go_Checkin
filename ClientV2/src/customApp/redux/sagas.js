import {all} from "redux-saga/effects";
import NhacViec from "./NhacViec/saga";
import CheckinOut from "./CheckinOut/saga";
import BaoCao from "./BaoCao/saga";
import QLTaiKhoan from "./QLTaiKhoan/saga";
import DMCoQuan from "./DMCoQuan/saga";
import DMChucVu from "./DMChucVu/saga";
import ThamSoHeThong from "./ThamSoHeThong/saga";
import QLPhanQuyen from "./QLPhanQuyen/saga";
import Guest from "./CheckinOutGuest/saga";
import TruyVetToanTinh from "./TruyVetToanTinh/saga";
import TruyVetDonVi from "./TruyVetDonVi/saga";
import QuanTriHeThong from "./QuanTriHeThong/saga";

export default function* devSaga() {
  yield all([
    NhacViec(),
    CheckinOut(),
    BaoCao(),
    QLTaiKhoan(),
    DMCoQuan(),
    DMChucVu(),
    ThamSoHeThong(),
    QLPhanQuyen(),
    Guest(),
    TruyVetToanTinh(),
    TruyVetDonVi(),
    QuanTriHeThong(),
  ]);
}
