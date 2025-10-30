import asyncComponent from "../helpers/AsyncFunc";

const routes = [
  //Dash board
  {
    path: "",
    component: asyncComponent(() => import("./containers/Dashboard")),
  },
  //Checkin-out
  {
    path: "checkin-out",
    component: asyncComponent(() => import("./containers/CheckinOutv4")),
  },
  {
    path: "checkin-outv5",
    component: asyncComponent(() => import("./containers/CheckinOutV5")),
  },
  //Báo cáo
  {
    path: "bao-cao",
    component: asyncComponent(() => import("./containers/BaoCao")),
  },
  //truy vết
  {
    path: "truy-vet-toan-tinh",
    component: asyncComponent(() => import("./containers/TruyVetToanTinh")),
  },
  {
    path: "truy-vet-trong-don-vi",
    component: asyncComponent(() => import("./containers/TruyVetDonVi")),
  },
  //Quản trị hệ thống
  {
    path: "quan-tri-he-thong",
    component: asyncComponent(() => import("./containers/QuanTriHeThongv4")),
  },
  {
    path: "quan-ly-tai-khoan",
    component: asyncComponent(() => import("./containers/QLTaiKhoan")),
  },
  {
    path: "tham-so",
    component: asyncComponent(() => import("./containers/ThamSoHeThong")),
  },
  {
    path: "co-quan-don-vi",
    component: asyncComponent(() => import("./containers/DMCoQuan")),
  },
  {
    path: "chuc-vu",
    component: asyncComponent(() => import("./containers/DMChucVu")),
  },
  {
    path: "phan-quyen",
    component: asyncComponent(() => import("./containers/QLPhanQuyen")),
  },
];
export default routes;
