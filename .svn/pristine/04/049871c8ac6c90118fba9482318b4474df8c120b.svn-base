import React, {Component} from 'react';
import {message, Modal} from 'antd';
import Button from "../../../components/uielements/button";
import Wrapper from "./modal.styled";
import BoxTable from '../../../components/utility/boxTable';
import moment from 'moment';

class ModalBaoCao extends Component {
  constructor(props) {
    super(props);
    this.refPrint = React.createRef();
    this.state = {};
  }

  renderDivPrint = () => {
    const {dataBaoCao, filterData} = this.props;
    const table = {
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: "Times New Roman"
      },
      th: {
        textAlign: 'center',
        fontWeight: 'bold',
        border: 'solid 0.5pt #999',
        padding: 5
      },
      td: {
        border: 'solid 0.5pt #999',
        padding: 5
      }
    };
    return <table style={table.table}>
      <tr>
        <td colSpan={10} style={{...table.td, border: 'none', textAlign: 'center'}}>
          <b>DANH SÁCH KHÁCH VÀO - RA CỦA CƠ QUAN</b>
        </td>
      </tr>
      <tr>
        <td colSpan={10} style={{...table.td, border: 'none', textAlign: 'center'}}>
          Từ ngày: {moment(filterData.TuNgay).format('DD/MM/YYYY')} - Đến
          ngày: {moment(filterData.DenNgay).format('DD/MM/YYYY')}
        </td>
      </tr>
      <tr/>
      <tr>
        <th style={{...table.th, width: 50}}>STT</th>
        <th style={{...table.th, width: 200}}>Họ tên khách</th>
        <th style={{...table.th, width: 200}}>Cơ quan</th>
        <th style={{...table.th, width: 100}}>Số điện thoại</th>
        <th style={{...table.th, width: 150}}>Số CMND</th>
        <th style={{...table.th, width: 200}}>Địa chỉ</th>
        <th style={{...table.th, width: 150}}>Ngày giờ vào</th>
        <th style={{...table.th, width: 150}}>Ngày giờ ra</th>
        <th style={{...table.th, width: 100}}>Thân nhiệt</th>
        <th style={{...table.th, width: 200}}>Cán bộ gặp</th>
        <th style={{...table.th, width: 200}}>Bộ phận</th>
      </tr>
      {dataBaoCao.map((item, index) => {
        return (
          <tr>
            <td style={{...table.td, textAlign: "center"}}>{index + 1}</td>
            <td style={{...table.td, textAlign: "left"}}>{item.HoVaTen}</td>
            <td style={{...table.td, textAlign: "left"}}>{item.TenCoQuan}</td>
            <td style={{...table.td, textAlign: "center"}}>{item.DienThoai}</td>
            <td style={{...table.td, textAlign: "center"}}>{`'${item.SoCMND}`}</td>
            <td style={{...table.td, textAlign: "left"}}>{item.HoKhau}</td>
            <td style={{...table.td, textAlign: "center"}}>{moment(item.GioVao).format('DD/MM/YYYY HH:ss')}</td>
            <td style={{
              ...table.td,
              textAlign: "center"
            }}>{item.GioRa ? moment(item.GioRa).format('DD/MM/YYYY HH:ss') : ""}</td>
            <td style={{...table.td, textAlign: "center"}}>{item.ThanNhiet ? `${item.ThanNhiet} °C` : ""}</td>
            <td style={{...table.td, textAlign: "left"}}>{item.TenCanBoGap}</td>
            <td style={{...table.td, textAlign: "center"}}>{item.TenBoPhanGap}</td>
          </tr>
        )
      })}
    </table>
  };

  exportExcel = () => {
    let html, link, blob, url;
    let preHtml = `<html><head><meta charset='utf-8'></head><body>`;
    let postHtml = "</body></html>";
    html = preHtml + this.refPrint.current.innerHTML + postHtml;
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
  };

  printComponent = () => {
    //xoa iframe cu ------
    let oldIframe = document.querySelectorAll('iframe');
    if (oldIframe && oldIframe.length) {
      oldIframe.forEach(element => {
        element.parentNode.removeChild(element);
      });
    }
    //tao iframe moi -----
    const node = this.refPrint.current.innerHTML;
    let iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe); //make document #html in iframe
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(node);
    iframe.contentWindow.document.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };

  render() {
    const {visible, onCancel, dataBaoCao, filterData} = this.props;

    const column = [
      {
        title: 'STT',
        align: 'center',
        width: '5%',
        render: (text, record, index) => index + 1
      },
      {
        title: 'Họ tên khách',
        dataIndex: 'HoVaTen',
        width: '10%'
      },
      {
        title: 'Cơ quan',
        dataIndex: 'TenCoQuan',
        width: '10%'
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'DienThoai',
        align: 'center',
        width: '10%'
      },
      {
        title: 'Số CMND',
        dataIndex: 'SoCMND',
        align: 'center',
        width: '10%'
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'HoKhau',
        width: '10%'
      },
      {
        title: 'Ngày giờ vào',
        width: '10%',
        align: 'center',
        dataIndex: 'GioVao',
        render: text => moment(text).format('DD/MM/YYYY HH:mm')
      },
      {
        title: 'Ngày giờ ra',
        width: '10%',
        align: 'center',
        dataIndex: 'GioRa',
        render: (text, record) => record.GioRa ? moment(text).format('DD/MM/YYYY HH:mm') : ""
      },
      {
        title: 'Thân nhiệt',
        dataIndex: 'ThanNhiet',
        width: '5%',
        align: 'center',
        render: (text, record) => record.ThanNhiet ? `${record.ThanNhiet} °C` : ""
      },
      {
        title: 'Cán bộ gặp',
        dataIndex: 'TenCanBoGap',
        width: '10%'
      },
      {
        title: 'Bộ phận',
        dataIndex: 'TenBoPhanGap',
        width: '10%'
      }
    ];

    return (
      <Modal
        title={''}
        width={1200}
        onCancel={onCancel}
        visible={visible}
        style={{top: 20}}
        footer={
          <div style={{textAlign: "center"}}>
            <Button type={"primary"} onClick={this.printComponent}>In danh sách</Button>
            <Button type={"primary"} style={{marginLeft: 20}} onClick={this.exportExcel}>Xuất excel</Button>
          </div>
        }
      >
        <Wrapper>
          <div className={'title weight'}>
            DANH SÁCH KHÁCH VÀO - RA CỦA CƠ QUAN
          </div>
          <div className={'title'}>
            Từ ngày: {moment(filterData.TuNgay).format("DD/MM/YYYY")} đến
            ngày: {moment(filterData.DenNgay).format("DD/MM/YYYY")}
          </div>
          <BoxTable columns={column}
                    rowKey={'ThongTinVaoRaID'}
                    dataSource={dataBaoCao}
                    pagination={false}
                    scroll={{y: 600}}/>
          <div style={{display: "none"}}>
            <div ref={this.refPrint}>
              {this.renderDivPrint()}
            </div>
          </div>
        </Wrapper>
      </Modal>
    );
  }
}

export {ModalBaoCao}