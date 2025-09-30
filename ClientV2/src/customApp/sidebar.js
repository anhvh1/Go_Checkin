const options = [
  {
    key: 'checkin-out',
    label: 'Checkin - Out',
    leftIcon: 'profile',
    hideAdmin: true
  },
  {
    key: 'bao-cao',
    label: 'Báo cáo',
    leftIcon: 'bar-chart',
  },
  {
    key: 'truy-vet',
    label: 'Truy vết',
    leftIcon: 'search',
    children: [
      {
        key: 'truy-vet-toan-tinh',
        label: 'Truy vết toàn hệ thống',
        // hideAdmin: true
      },
      {
        key: 'truy-vet-trong-don-vi',
        label: 'Truy vết trong đơn vị',
        hideAdmin: true
      }
    ]
  },
  {
    key: 'quan-tri-he-thong',
    label: 'Quản trị hệ thống',
    leftIcon: 'setting',
    // children: [
    //   {
    //     key: 'quan-ly-tai-khoan',
    //     label: 'Quản lý tài khoản',
    //   },
    //   // {
    //   //   key: 'tham-so',
    //   //   label: 'Tham số hệ thống',
    //   // },
    //   {
    //     key: 'co-quan-don-vi',
    //     label: 'Danh mục cơ quan',
    //   },
    //   // {
    //   //   key: 'chuc-vu',
    //   //   label: 'Danh mục chức vụ',
    //   // },
    //   {
    //     key: 'phan-quyen',
    //     label: 'Quản lý phân quyền',
    //   },
    // ]
  }
];
export default options;
