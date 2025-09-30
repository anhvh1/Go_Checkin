import React, {Component} from "react";
import {connect} from "react-redux";
import actions from "../../redux/TruyVetDonVi/actions";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import Box from "../../../components/utility/box";
import {DatePicker, InputSearch as Search} from "../../../components/uielements/exportComponent";
import {message} from "antd";
import moment from "moment";
import BoxFilter from "../../../components/utility/boxFilter";
import {changeUrlFilter, exportExcel, getDefaultPageSize, getFilterData, getRoleByKey} from "../../../helpers/utility";
import BoxTable from "../../../components/utility/boxTable";
// import ModalPreview from '../ViewImage';

class TruyVetDonVi extends Component {
  constructor(props) {
    super(props);
    document.title = "Truy vết đơn vị";
    this.boxExcel = React.createRef();
    this.state = {
      filterData: {
        TuNgay: moment().add('days', -14).format('YYYY-MM-DD'),
        DenNgay: moment().format('YYYY-MM-DD'),
      },
      srcViewImage: null,
      visibleViewImage: false,
      keyView: 0
    };
  }

  //Get initData---------------------------------------------
  componentDidMount = () => {
    this.props.getData(this.state.filterData);
  };

  onFilter = (value, property) => {
    let oldFilterData = this.state.filterData;
    let onFilter = {value, property};
    let filterData = getFilterData(oldFilterData, onFilter, null);
    //get filter data
    this.setState({filterData,}, () => {
      changeUrlFilter(this.state.filterData); //change url
      this.props.getData(this.state.filterData); //get list
    });
  };

  onTableChange = (pagination, filters, sorter) => {
    let oldFilterData = this.state.filterData;
    let onOrder = {pagination, filters, sorter};
    let filterData = getFilterData(oldFilterData, null, onOrder);
    //get filter data
    this.setState({filterData}, () => {
      changeUrlFilter(this.state.filterData); //change url
      this.props.getData(this.state.filterData); //get list
    });
  };

  exportExcel = () => {
    const {showBaoCao} = this.state;
    if (!showBaoCao) {
      message.destroy();
      message.warning('Chưa tạo báo cáo');
    } else {
      const html = this.boxExcel.current.innerHTML;
      exportExcel(html, 'Báo cáo ra vào');
    }
  };

  openViewImage = (record) => {
    if (record.AnhChanDungBase64 || record.AnhCMND_MTBase64) {
      const srcViewImage = record.AnhChanDungBase64 ? record.AnhChanDungBase64 : record.AnhCMND_MTBase64;
      let {keyView} = this.state;
      keyView++;
      this.setState({keyView, srcViewImage, visibleViewImage: true});
    }
  };

  closeViewImage = () => {
    this.setState({visibleViewImage: false})
  };

  renderLyDoGap = (item) => {
    switch (item.LyDoGap) {
      case 1:
        return "Họp";
      case 2:
        return `Gặp ${item.TenCanBoGap ? `cán bộ ${item.TenCanBoGap}` : item.TenBoPhanGap}`;
      case 3:
        return `Lý do khác${item.LyDoKhac ? `: ${item.LyDoKhac}` : ''}`
    }
  };

  render() {
    //Props, state
    const {filterData} = this.state;
    const {DanhSachTruyVet, TableLoading, TotalRow} = this.props;
    //Style table excel
    const table = {
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: "Times New Roman"
      },
      th: {
        textAlign: 'center',
        fontWeight: 'bold',
        border: 'solid 0.5pt #999'
      },
      td: {
        border: 'solid 0.5pt #999'
      }
    };

    const column = [
      {
        title: 'STT',
        align: 'center',
        width: '3%',
        render: (text, record, index) => (
          <span>{(PageNumber - 1) * PageSize + (index + 1)}</span>
        )
      },
      {
        title: 'Họ tên khách',
        dataIndex: 'HoVaTen',
        width: '10%',
      },
      {
        title: 'Cơ quan',
        dataIndex: 'TenCoQuan',
        width: '11%',
      },
      {
        title: 'Điện thoại',
        dataIndex: 'DienThoai',
        width: '8%',
        align: "center"
      },
      {
        title: 'CMND / CCCD',
        dataIndex: 'SoCMND',
        width: '5%',
        align: "center"
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'HoKhau',
        width: '14%',
      },
      {
        title: 'Ngày giờ vào',
        width: '8%',
        align: 'center',
        render: (text, record) => <div>
          {moment(record.GioVao).format('DD/MM/YYYY')}
          <br/>
          {moment(record.GioVao).format('HH:mm')}
        </div>
      },
      {
        title: 'Ngày giờ ra',
        width: '8%',
        align: 'center',
        render: (text, record) => record.GioRa ? <div>
          {moment(record.GioRa).format('DD/MM/YYYY')}
          <br/>
          {moment(record.GioRa).format('HH:mm')}
        </div> : ""
      },
      {
        title: 'Thân nhiệt',
        width: '3%',
        align: 'center',
        render: (text, record) => record.ThanNhiet ? `${record.ThanNhiet} °C` : ""
      },
      {
        title: 'Ảnh chụp',
        width: '10%',
        align: 'center',
        render: (text, record) => record.AnhChanDungBase64 || record.AnhCMND_MTBase64 ?
          <img width={'100%'} height={80} onClick={() => this.openViewImage(record)}
               src={record.AnhChanDungBase64 ? record.AnhChanDungBase64 : record.AnhCMND_MTBase64}/> : ""
      },
      {
        title: 'Lý do gặp',
        width: '10%',
        render: (text, record) => this.renderLyDoGap(record)
      }
    ];

    const PageNumber = filterData.PageNumber ? parseInt(filterData.PageNumber) : 1;
    const PageSize = filterData.PageSize ? parseInt(filterData.PageSize) : getDefaultPageSize();

    const valueTuNgay = filterData.TuNgay ? moment(filterData.TuNgay, 'YYYY-MM-DD') : moment().add('days', -14);
    const valueDenNgay = filterData.DenNgay ? moment(filterData.DenNgay, 'YYYY-MM-DD') : moment();
    //
    const {srcViewImage, visibleViewImage, keyView} = this.state;
    return (
      <LayoutWrapper>
        <PageHeader>Truy vết trong đơn vị</PageHeader>
        <Box>
          <BoxFilter>
            Từ
            <DatePicker value={valueTuNgay} allowClear={false} style={{width: 150}}
                        onChange={value => this.onFilter(moment(value).format('YYYY-MM-DD'), 'TuNgay')}/>
            Đến <DatePicker value={valueDenNgay} allowClear={false} style={{width: 150}}
                            onChange={value => this.onFilter(moment(value).format('YYYY-MM-DD'), 'DenNgay')}/>
            <Search placeholder={'Số CMND, Số điện thoại hoặc tên người truy vết'} style={{width: 350}} allowClear
                    onSearch={value => this.onFilter(value, 'Keyword')} defaultValue={filterData.Keyword}/>
          </BoxFilter>
          <BoxTable
            columns={column}
            dataSource={DanhSachTruyVet}
            rowKey={'ThongTinVaoRaID'}
            pagination={{
              showSizeChanger: true, //show text: pageSize/page
              showTotal: (total, range) => `Từ ${range[0]} đến ${range[1]} trên ${total}`,
              total: TotalRow, //test 100
              current: PageNumber, //current page
              pageSize: PageSize,
            }}
            loading={TableLoading}
            onChange={this.onTableChange}
          />
        </Box>
        {/* <ModalPreview visible={visibleViewImage} src={srcViewImage} key={keyView} onCancel={this.closeViewImage}/> */}
        {/*<div style={{display: 'none'}} ref={this.boxExcel}>*/}
        {/*  <table style={table.table}>*/}
        {/*    <tr>*/}
        {/*      <td colSpan={10} style={{...table.td, border: 'none', textAlign: 'center'}}>*/}
        {/*        <b>DANH SÁCH KHÁCH VÀO - RA CỦA CƠ QUAN</b>*/}
        {/*      </td>*/}
        {/*    </tr>*/}
        {/*    <tr>*/}
        {/*      <td colSpan={10} style={{...table.td, border: 'none', textAlign: 'center'}}>*/}
        {/*        Từ ngày: {moment(filterData.startDate).format('DD/MM/YYYY')} - Đến*/}
        {/*        ngày: {moment(filterData.endDate).format('DD/MM/YYYY')}*/}
        {/*      </td>*/}
        {/*    </tr>*/}
        {/*    <tr/>*/}
        {/*    <tr>*/}
        {/*      <th style={{...table.th, width: 50}}>STT</th>*/}
        {/*      <th style={{...table.th, width: 200}}>Họ tên khách</th>*/}
        {/*      <th style={{...table.th, width: 100}}>Cơ quan</th>*/}
        {/*      <th style={{...table.th, width: 100}}>Số điện thoại</th>*/}
        {/*      <th style={{...table.th, width: 120}}>Số CMND</th>*/}
        {/*      <th style={{...table.th, width: 200}}>Địa chỉ</th>*/}
        {/*      <th style={{...table.th, width: 150}}>Ngày giờ vào</th>*/}
        {/*      <th style={{...table.th, width: 150}}>Ngày giờ ra</th>*/}
        {/*      <th style={{...table.th, width: 200}}>Cán bộ gặp</th>*/}
        {/*      <th style={{...table.th, width: 200}}>Bộ phận</th>*/}
        {/*    </tr>*/}
        {/*    {ListBaoCao.map((item, index) => {*/}
        {/*      return (*/}
        {/*        <tr>*/}
        {/*          <td style={{...table.td, textAlign: "center"}} onClick={this.dbclick}>{index + 1}</td>*/}
        {/*          <td style={{...table.td, textAlign: "left"}}>{item.HoVaTen}</td>*/}
        {/*          <td style={{...table.td, textAlign: "center"}}>{item.TenCoQuan}</td>*/}
        {/*          <td style={{...table.td, textAlign: "center"}}>{item.DienThoai}</td>*/}
        {/*          <td style={{...table.td, textAlign: "center"}}>'{item.SoCMND}</td>*/}
        {/*          <td style={{...table.td, textAlign: "left"}}>{item.HoKhau}</td>*/}
        {/*          <td style={{...table.td, textAlign: "center"}}>{moment(item.GioVao).format('DD/MM/YYYY HH:ss')}</td>*/}
        {/*          <td style={{*/}
        {/*            ...table.td,*/}
        {/*            textAlign: "center"*/}
        {/*          }}>{item.GioRa ? moment(item.GioRa).format('DD/MM/YYYY HH:ss') : ""}</td>*/}
        {/*          <td style={{...table.td, textAlign: "center"}}>{item.TenCanBoGap}</td>*/}
        {/*          <td style={{...table.td, textAlign: "center"}}>{item.TenBoPhanGap}</td>*/}
        {/*        </tr>*/}
        {/*      )*/}
        {/*    })}*/}
        {/*    <tr/>*/}
        {/*    <tr>*/}
        {/*      <td/>*/}
        {/*      <td colSpan={9} style={{fontWeight: 'bold'}}>Tổng số khách gặp: <span*/}
        {/*        style={{color: 'blue'}}>{TongSoKhach}</span></td>*/}
        {/*    </tr>*/}
        {/*  </table>*/}
        {/*</div>*/}
      </LayoutWrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.TruyVetDonVi,
    role: getRoleByKey(state.Auth.role, 'truy-vet-trong-don-vi')
  };
}

export default connect(
  mapStateToProps,
  actions
)(TruyVetDonVi);
