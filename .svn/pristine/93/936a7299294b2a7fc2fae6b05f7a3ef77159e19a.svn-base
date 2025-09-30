import React, {Component} from "react";
import {connect} from "react-redux";
import actions from "../../redux/BaoCao/actions";
import api from "./config";
import Constants from '../../../settings/constants';
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import PageHeader from "../../../components/utility/pageHeader";
import Box from "../../../components/utility/box";
import appActions from "../../../redux/app/actions";
import {DatePicker, Select, Option, Button, TreeSelect} from "../../../components/uielements/exportComponent";
import {message, Row, Col, Form} from "antd";
import './style.css'
import moment from "moment";

const {changeCurrent} = appActions;

const {Item} = Form;
const {
  ITEM_LAYOUT_HALF,
  COL_ITEM_LAYOUT_HALF,
  COL_COL_ITEM_LAYOUT_RIGHT
} = Constants;

class BaoCao extends Component {
  constructor(props) {
    super(props);
    document.title = "Báo cáo";
    this.boxExcel = React.createRef();
    this.state = {
      filterData: {
        TuNgay: moment(),
        DenNgay: moment(),
        LeTanID: undefined,
        CanBoGapID: undefined
      },
      showBaoCao: false,
      ListBaoCao: [],
      TongSoKhach: 0
    };
  }

  //Get initData---------------------------------------------
  componentDidMount = () => {
    this.props.getInitData();
    this.TaoBaoCao();
  };

  onFilter = (value, properties) => {
    const {filterData} = this.state;
    if (properties === "CanBoGapID" && value) {
      const arr = value.split("_");
      filterData.CanBoGapID = arr[0];
      filterData.DonViCaNhan = arr[1];
    } else {
      filterData[properties] = value;
    }
    this.setState({filterData});
  };

  TaoBaoCao = () => {
    const filterData = Object.assign({}, this.state.filterData);
    if (filterData.TuNgay === "" || filterData.DenNgay === "" || filterData.TuNgay === null || filterData.DenNgay === null) {
      message.destroy();
      message.warning('Chưa nhập kỳ báo cáo');
      return;
    }
    filterData.TuNgay = moment(filterData.TuNgay).format('YYYY-MM-DD');
    filterData.DenNgay = moment(filterData.DenNgay).format('YYYY-MM-DD');
    api.TaoBaoCao(filterData)
      .then(response => {
        if (response.data.Status > 0) {
          if (!response.data.Data) {
            message.destroy();
            message.warning('Kỳ báo cáo hiện tại không có dữ liệu');
            this.setState({ListBaoCao: [], showBaoCao: false});
            return;
          }
          this.setState({showBaoCao: true, ListBaoCao: response.data.Data, TongSoKhach: response.data.TotalRow});
        } else {
          message.destroy();
          message.error(response.data.Message);
        }
      }).catch(error => {
      message.destroy();
      message.error(error.toString());
    });
  };

  exportExcel = () => {
    const {showBaoCao} = this.state;
    if (!showBaoCao) {
      message.destroy();
      message.warning('Chưa tạo báo cáo');
    } else {
      let html, link, blob, url;
      let preHtml = `<html><head><meta charset='utf-8'></head><body>`;
      let postHtml = "</body></html>";
      html = preHtml + this.boxExcel.current.innerHTML + postHtml;
      blob = new Blob(['\ufeff', html], {
        type: 'application/vnd.ms-excel'
      });
      url = URL.createObjectURL(blob);
      link = document.createElement('A');
      link.href = url;
      link.download = 'Báo cáo ra vào.xls';  // default name without extension
      document.body.appendChild(link);
      if (navigator.msSaveOrOpenBlob) navigator.msSaveOrOpenBlob(blob, 'Báo cáo ra vào.xls'); // IE10-11
      else link.click();  // other browsers
      document.body.removeChild(link);
    }
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
    const {filterData, showBaoCao, ListBaoCao, TongSoKhach} = this.state;
    const {DoiTuongGap} = this.props;
    const DanhSachCanBo = this.props.DanhSachCanBo ? this.props.DanhSachCanBo : [];
    const DanhSachLeTan = this.props.DanhSachLeTan ? this.props.DanhSachLeTan : [];
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
    return (
      <LayoutWrapper style={{overflowY: 'inherit'}}>
        <PageHeader>Báo cáo</PageHeader>
        <Box title={'Lọc báo cáo'} style={{marginBottom: 5, paddingBottom: 5, border: '1px solid #ccc'}}>
          <Form>
            <Row>
              <Col {...COL_ITEM_LAYOUT_HALF}>
                <Item label={"Thời gian"} {...ITEM_LAYOUT_HALF} className={'datepicker'}>
                  <DatePicker format={'DD/MM/YYYY'} placeholder={""} style={{width: '40%'}} value={filterData.TuNgay}
                              onChange={value => this.onFilter(value, 'TuNgay')}/>
                  <span style={{margin: '0 20px'}}>--</span>
                  <DatePicker format={'DD/MM/YYYY'} placeholder={""} style={{width: '40%'}}
                              value={filterData.DenNgay} onChange={value => this.onFilter(value, 'DenNgay')}
                              allowClear/>
                </Item>
              </Col>
              <Col {...COL_ITEM_LAYOUT_HALF}>
                <Row>
                  <Col>
                    <Item label={"Lễ tân"} {...ITEM_LAYOUT_HALF}>
                      <Select style={{width: 'calc(80% + 48px)'}} placeholder={'Chọn lễ tân tiếp đón'}
                              optionFilterProp={'label'}
                              showSearch notFoundContent={"Không có dữ liệu"}
                              onChange={value => this.onFilter(value, 'LeTanID')} allowClear>
                        {DanhSachLeTan.map(item => {
                          return (
                            <Option value={item.CanBoID}
                                    label={`${item.TenCanBo} ${item.TenCoQuan}`}>{item.TenCanBo} - <i>{item.TenCoQuan}</i></Option>
                          )
                        })}
                      </Select>
                    </Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col {...COL_ITEM_LAYOUT_HALF}>
                <Item label={"Đơn vị / Cá nhân"} {...ITEM_LAYOUT_HALF}>
                  <TreeSelect
                    dropdownStyle={{maxHeight: 300}}
                    showSearch
                    treeData={DoiTuongGap}
                    placeholder="Chọn đối tượng cần gặp"
                    allowClear
                    treeDefaultExpandAll
                    onChange={value => this.onFilter(value, 'CanBoGapID')}
                  />
                </Item>
              </Col>
              <Col {...COL_ITEM_LAYOUT_HALF}>
                <Row>
                  <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>
                    <Item label={""} {...ITEM_LAYOUT_HALF}>
                      <Button type={'primary'} onClick={this.TaoBaoCao}>Thống kê</Button>
                      <Button style={{marginLeft: 20}} onClick={this.exportExcel}>Xuất excel</Button>
                    </Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Box>
        <Box style={{
          display: showBaoCao ? '' : 'none',
          marginTop: 0,
          paddingTop: 5,
          border: '1px solid #ccc',
          minWidth: 1400
        }}>
          {/*<div style={{minWidth: 1200}}>*/}
          <table className={'table table-header'} style={{marginBottom: 0}}>
            <tr style={{fontSize: 15}}>
              <td colSpan={10} style={{border: 'none', textAlign: 'center'}}>
                <b>DANH SÁCH KHÁCH VÀO - RA CỦA CƠ QUAN</b>
              </td>
            </tr>
            <tr>
              <td colSpan={10} style={{border: 'none', textAlign: 'center'}}>
                Từ ngày: {moment(filterData.startDate).format('DD/MM/YYYY')} - Đến
                ngày: {moment(filterData.endDate).format('DD/MM/YYYY')}
              </td>
            </tr>
            <tr style={{height: 30}}/>
            <tr>
              <th style={{width: '5%'}}>STT</th>
              <th style={{width: '15%'}}>Họ tên khách</th>
              <th style={{width: '8%'}}>Cơ quan</th>
              <th style={{width: '8%'}}>Số điện thoại</th>
              <th style={{width: '13%'}}>Số CMND</th>
              <th style={{width: '15%'}}>Địa chỉ</th>
              <th style={{width: '8%'}}>Ngày giờ vào</th>
              <th style={{width: '8%'}}>Ngày giờ ra</th>
              <th style={{width: '5%'}}>Thân nhiệt</th>
              <th style={{width: '15%'}}>Lý do gặp</th>
              {/*<th style={{width: '10%'}}>Cán bộ gặp</th>*/}
              {/*<th style={{width: '10%'}}>Bộ phận</th>*/}
            </tr>
          </table>
          <div className={'div-scroll'}>
            <table className={'table'}>
              {ListBaoCao.map((item, index) => {
                return (
                  <tr>
                    <td style={{width: '5%', textAlign: "center"}}>{index + 1}</td>
                    <td style={{width: '15%'}}>{item.HoVaTen}</td>
                    <td style={{width: '8%', textAlign: "center"}}>{item.TenCoQuan}</td>
                    <td style={{width: '8%', textAlign: "center"}}>{item.DienThoai}</td>
                    <td style={{width: '13%', textAlign: "center"}}>{item.SoCMND}</td>
                    <td style={{width: '15%'}}>{item.HoKhau}</td>
                    <td style={{width: '8%', textAlign: "center"}}>
                      {moment(item.GioVao).format('DD/MM/YYYY')}
                      <br/>
                      {moment(item.GioVao).format('HH:mm')}
                    </td>
                    <td style={{width: '8%', textAlign: "center"}}>
                      {item.GioRa ?
                        <span>
                          {moment(item.GioRa).format('DD/MM/YYYY')}
                          <br/>
                          {moment(item.GioRa).format('HH:mm')}
                        </span> : ""}
                    </td>
                    <td style={{width: '5%', textAlign: "center"}}>{item.ThanNhiet ? `${item.ThanNhiet} °C` : ""}</td>
                    <td style={{width: '15%', textAlign: "center"}}>{this.renderLyDoGap(item)}</td>
                    {/*<td style={{width: '10%', textAlign: "center"}}>{item.TenCanBoGap}</td>*/}
                    {/*<td style={{width: '10%', textAlign: "center"}}>{item.TenBoPhanGap}</td>*/}
                  </tr>
                )
              })}
            </table>
          </div>
          <div style={{marginTop: 20}}>
            <span style={{color: 'black', fontWeight: 'bold'}}>Tổng số khách tới:</span>
            <span style={{color: 'blue', marginLeft: 10, fontWeight: 'bold'}}>{TongSoKhach}</span>
          </div>
          {/*</div>*/}
        </Box>
        <div style={{display: 'none'}} ref={this.boxExcel}>
          <table style={table.table}>
            <tr>
              <td colSpan={10} style={{...table.td, border: 'none', textAlign: 'center'}}>
                <b>DANH SÁCH KHÁCH VÀO - RA CỦA CƠ QUAN</b>
              </td>
            </tr>
            <tr>
              <td colSpan={10} style={{...table.td, border: 'none', textAlign: 'center'}}>
                Từ ngày: {moment(filterData.startDate).format('DD/MM/YYYY')} - Đến
                ngày: {moment(filterData.endDate).format('DD/MM/YYYY')}
              </td>
            </tr>
            <tr/>
            <tr>
              <th style={{...table.th, width: 50}}>STT</th>
              <th style={{...table.th, width: 200}}>Họ tên khách</th>
              <th style={{...table.th, width: 100}}>Cơ quan</th>
              <th style={{...table.th, width: 100}}>Số điện thoại</th>
              <th style={{...table.th, width: 120}}>Số CMND</th>
              <th style={{...table.th, width: 200}}>Địa chỉ</th>
              <th style={{...table.th, width: 150}}>Ngày giờ vào</th>
              <th style={{...table.th, width: 150}}>Ngày giờ ra</th>
              <th style={{...table.th, width: 200}}>Cán bộ gặp</th>
              <th style={{...table.th, width: 200}}>Bộ phận</th>
            </tr>
            {ListBaoCao.map((item, index) => {
              return (
                <tr>
                  <td style={{...table.td, textAlign: "center"}} onClick={this.dbclick}>{index + 1}</td>
                  <td style={{...table.td, textAlign: "left"}}>{item.HoVaTen}</td>
                  <td style={{...table.td, textAlign: "center"}}>{item.TenCoQuan}</td>
                  <td style={{...table.td, textAlign: "center"}}>{item.DienThoai}</td>
                  <td style={{...table.td, textAlign: "center"}}>'{item.SoCMND}</td>
                  <td style={{...table.td, textAlign: "left"}}>{item.HoKhau}</td>
                  <td style={{...table.td, textAlign: "center"}}>{moment(item.GioVao).format('DD/MM/YYYY HH:ss')}</td>
                  <td style={{
                    ...table.td,
                    textAlign: "center"
                  }}>{item.GioRa ? moment(item.GioRa).format('DD/MM/YYYY HH:ss') : ""}</td>
                  <td style={{...table.td, textAlign: "center"}}>{item.TenCanBoGap}</td>
                  <td style={{...table.td, textAlign: "center"}}>{item.TenBoPhanGap}</td>
                </tr>
              )
            })}
            <tr/>
            <tr>
              <td/>
              <td colSpan={9} style={{fontWeight: 'bold'}}>Tổng số khách gặp: <span
                style={{color: 'blue'}}>{TongSoKhach}</span></td>
            </tr>
          </table>
        </div>
      </LayoutWrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.BaoCao
  };
}

export default connect(
  mapStateToProps,
  {...actions, changeCurrent}
)(BaoCao);
