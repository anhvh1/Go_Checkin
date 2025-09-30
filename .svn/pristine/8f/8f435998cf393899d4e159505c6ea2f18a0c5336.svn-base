import asyncComponent from '../helpers/AsyncFunc';

const routes = [
  //Dash board
  {
    path: '',
    component: asyncComponent(() => import('./containers/Dashboard'))
  },
  //Checkin-Put
  {
    path: 'checkin-out',
    component: asyncComponent(() => import('./containers/CheckinOutv2'))
  },
  //Báo cáo
  {
    path: 'bao-cao',
    component: asyncComponent(() => import('./containers/BaoCao'))
  },
  //Quản trị hệ thống
  {
    path: 'quan-ly-tai-khoan',
    component: asyncComponent(() => import('./containers/QLTaiKhoan'))
  },
  {
    path: 'tham-so',
    component: asyncComponent(() => import('./containers/ThamSoHeThong'))
  },
  {
    path: 'co-quan-don-vi',
    component: asyncComponent(() => import('./containers/DMCoQuan'))
  },
  {
    path: 'chuc-vu',
    component: asyncComponent(() => import('./containers/DMChucVu'))
  },
  {
    path: 'phan-quyen',
    component: asyncComponent(() => import('./containers/QLPhanQuyen'))
  },
];
export default routes;
