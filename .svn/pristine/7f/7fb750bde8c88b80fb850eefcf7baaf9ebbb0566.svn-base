import React, {Component} from 'react';
import {Col, message, Row, Radio, Tooltip} from 'antd';
import {Select, Option, Input, Modal, Button, TreeSelect} from "../../../components/uielements/exportComponent";
import Constants from '../../../settings/constants';
import {MessageError, upperFirstLetter} from '../../../helpers/utility';
import Styled from './styled';
import apiPhanQuyen from "../QLPhanQuyen/config";
import {Form} from 'antd4';

const {REQUIRED,} = Constants;
const {Item} = Form;
const {Group} = Radio;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DanhSachNhomNguoiDung: [],
      DanhSachCanBo: [],
      LoaiThemCoQuan: 1
    };
    this.formRef = React.createRef();
  }

  onOk = async (e) => {
    e.preventDefault();
    const form = this.formRef.current;
    const value = await form.validateFields();
    if (!value.CoQuanID && !value.TenCoQuan) {
      message.destroy();
      message.warn('Chưa chọn cơ quan');
      return;
    }
    if (!value.DanhSachCanBo || !value.DanhSachCanBo.length) {
      message.destroy();
      message.warn('Danh sách cán bộ rỗng');
      return;
    } else {
      value.DanhSachCanBo.forEach(item => {
        item.TenCanBo = upperFirstLetter(item.TenCanBo);
        item.DanhSachNhomNguoiDung = item.ListNhomNguoiDungID.map(nhomid => ({NhomNguoiDungID: nhomid}));
        delete item.ListNhomNguoiDungID;
      });
    }
    const isDuplicate = this.checkDuplicateEmail(value.DanhSachCanBo);
    if (isDuplicate) {
      return;
    }
    this.props.onCreate(value);
  };

  checkDuplicateEmail = (ListCanBo) => {
    const ListEmail = ListCanBo.map(item => item.Email);
    const findDuplicates = ListEmail.filter((item, index) => ListEmail.indexOf(item) !== index);
    if (findDuplicates.length) {
      MessageError('Email nhập mới bị trùng, vui lòng kiểm tra lại');
      return true;
    }
    return false;
  };

  componentDidMount() {
    const {dataEdit} = this.props;
    if (dataEdit.CanBoID) {
      setTimeout(() => {
        const form = this.formRef.current;
        const {DanhSachCanBo} = this.state;
        DanhSachCanBo.push({});
        this.setState({DanhSachCanBo}, () => {
          const CoQuanID = dataEdit.CoQuanID.toString();
          const CanBoID = dataEdit.CanBoID;
          const DanhSachCanBo = [{
            TenCanBo: dataEdit.TenCanBo,
            Email: dataEdit.Email,
            ListNhomNguoiDungID: dataEdit.ListNhomNguoiDungID
          }];
          this.changeCoQuan(CoQuanID, false);
          form && form.setFieldsValue({
            CoQuanID,
            CanBoID,
            DanhSachCanBo
          });
        });
      }, 200);
    } else {
      this.ThemCanBo();
      setTimeout(() => {
        this.setInitialCoQuan();
      }, 200);
    }
  }

  setInitialCoQuan = () => {
    const {DanhSachCoQuan} = this.props;
    if (DanhSachCoQuan.length) {
      const CoQuanID = DanhSachCoQuan[0].CoQuanID;
      const form = this.formRef.current;
      form && form.setFieldsValue({CoQuanID});
      this.changeCoQuan(CoQuanID, true);
    }
  };

  setInitialTenCoQuan = () => {
    const form = this.formRef.current;
    form && form.setFieldsValue({TenCoQuan: ""});
    this.changeCoQuan(null, true);
    //get nhóm tổng
    const {DanhSachCoQuan} = this.props;
    if (DanhSachCoQuan.length) {
      const CoQuanID = DanhSachCoQuan[0].CoQuanID;
      apiPhanQuyen.DanhSachNhomByCoQuanID({CoQuanID}).then(response => {
        if (response.data.Status > 0) {
          const DanhSachNhomNguoiDung = response.data.Data;
          DanhSachNhomNguoiDung.forEach(item => {
            item.NhomNguoiDungID = item.NhomTongID;
          });
          const TruyVetToanTinh = DanhSachNhomNguoiDung.find(item => item.TenNhom === 'Truy vết Y tế trên toàn tỉnh');
          if (TruyVetToanTinh) {
            const indexOf = DanhSachNhomNguoiDung.indexOf(TruyVetToanTinh);
            DanhSachNhomNguoiDung.splice(indexOf, 1);
          }
          this.setState({DanhSachNhomNguoiDung});
        }
      })
    }
  };

  onCancel = () => {
    const {onCancel} = this.props;
    onCancel();
  };

  changeCoQuan = (value, reset = true) => {
    //Clear data nhóm người dùng
    const form = this.formRef.current;
    if (form) {
      const {DanhSachCanBo} = this.state;
      let dataOld = form.getFieldValue('DanhSachCanBo');
      dataOld = Object.values(dataOld);
      reset && DanhSachCanBo.forEach((item, index) => {
        form.setFieldsValue({
          DanhSachCanBo: {
            [index]: {
              ListNhomNguoiDungID: [],
              TenCanBo: dataOld[index].TenCanBo,
              Email: dataOld[index].Email
            }
          }
        });
      });
    }
    //Lấy danh sách nhóm người dùng theo cơ quan
    if (value) {
      apiPhanQuyen.DanhSachNhomByCoQuanID({CoQuanID: value}).then(response => {
        if (response.data.Status > 0) {
          const DanhSachNhomNguoiDung = response.data.Data;
          const TruyVetToanTinh = DanhSachNhomNguoiDung.find(item => item.TenNhom === 'Truy vết Y tế trên toàn tỉnh');
          if (TruyVetToanTinh) {
            const indexOf = DanhSachNhomNguoiDung.indexOf(TruyVetToanTinh);
            DanhSachNhomNguoiDung.splice(indexOf, 1);
          }
          this.setState({DanhSachNhomNguoiDung});
        }
      })
    } else {
      this.setState({DanhSachNhomNguoiDung: []});
    }
  };

  ThemCanBo = () => {
    const {DanhSachCanBo} = this.state;
    DanhSachCanBo.unshift({});
    let DSForm = {};
    const form = this.formRef.current;
    if (form) {
      const {getFieldValue} = form;
      DSForm = getFieldValue('DanhSachCanBo');
    }
    this.setState({DanhSachCanBo}, () => {
      DSForm = Object.values(DSForm);
      DSForm.unshift({
        TenCanBo: "",
        Email: "",
        ListNhomNguoiDungID: []
      });
      if (form) {
        const {setFieldsValue} = form;
        setFieldsValue({
          DanhSachCanBo: DSForm
        });
      }
    });
  };

  XoaCanBo = (index) => {
    const {DanhSachCanBo} = this.state;
    const form = this.formRef.current;
    const {setFieldsValue, getFieldValue} = form;
    let DSForm = getFieldValue('DanhSachCanBo');
    DSForm = Object.values(DSForm);
    DSForm.splice(index, 1);
    setFieldsValue({
      DanhSachCanBo: DSForm
    });
    DanhSachCanBo.splice(index, 1);
    this.setState({DanhSachCanBo});
  };

  changeLoaiThemCoQuan = (e) => {
    const LoaiThemCoQuan = e.target.value;
    LoaiThemCoQuan === 1 && this.setInitialCoQuan();
    LoaiThemCoQuan === 2 && this.setInitialTenCoQuan();
    this.setState({LoaiThemCoQuan})
  };

  render() {
    const {visible, onCancel, dataEdit, loading, DanhSachCoQuan} = this.props;
    const {DanhSachNhomNguoiDung, DanhSachCanBo, LoaiThemCoQuan} = this.state;
    // console.log(DanhSachNhomNguoiDung);
    const FORMLAYOUT3COL = {
      labelCol: {xs: 24, md: 24, lg: 24, xl: 24},
      wrapperCol: {xs: 24, md: 24, lg: 24, xl: 24},
      labelAlign: 'left'
    };
    const FORMLAYOUTROW = {
      wrapperCol: 24,
      labelAlign: 'left'
    };
    return (
      <Modal
        title={`${dataEdit.CanBoID ? 'Sửa' : 'Thêm'} thông tin cán bộ`}
        width={950}
        onCancel={this.onCancel}
        visible={visible}
        footer={[
          <Button key="back" onClick={onCancel}>Hủy</Button>,
          <Button key="submit" htmlType="submit" type="primary" form="formsp"
                  onClick={this.onOk} loading={loading}>Lưu</Button>,
        ]}
      >
        <Styled className={'modal'}>
          <Form ref={this.formRef} {...FORMLAYOUTROW}>
            <Item name={'CanBoID'} hidden initialValue={null}/>
            <Group value={LoaiThemCoQuan} onChange={this.changeLoaiThemCoQuan} style={{marginBottom: 15}}>
              <Radio value={1}>Chọn phòng ban</Radio>
              <Radio value={2} disabled={dataEdit.CanBoID}>Thêm phòng ban</Radio>
            </Group>
            <Row style={{borderBottom: 'solid 1px #e6e6e6', marginBottom: 15}}>
              {LoaiThemCoQuan === 1 ?
                <Item name={'CoQuanID'} initialValue={undefined}>
                  <TreeSelect
                    style={{width: 400}}
                    placeholder={"Chọn phòng ban"}
                    noGetPopupContainer
                    showSearch
                    treeData={DanhSachCoQuan}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    allowClear
                    treeDefaultExpandAll
                    notFoundContent={"Không có dữ liệu"}
                    treeNodeFilterProp={'title'}
                    onChange={value => this.changeCoQuan(value)}
                  />
                </Item> : <Item name={'TenCoQuan'} initialValue={""}>
                  <Input style={{width: 400}} placeholder={'Tên phòng ban'}/>
                </Item>}
              {/*<Col span={7}>*/}
              {/*  <Item label={"Nơi công tác"} name={'CoQuanID'} initialValue={undefined} {...FORMLAYOUT3COL}>*/}
              {/*    <TreeSelect*/}
              {/*      noGetPopupContainer*/}
              {/*      showSearch*/}
              {/*      treeData={DanhSachCoQuan}*/}
              {/*      dropdownStyle={{maxHeight: 400, overflow: 'auto'}}*/}
              {/*      allowClear*/}
              {/*      treeDefaultExpandAll*/}
              {/*      notFoundContent={"Không có dữ liệu"}*/}
              {/*      treeNodeFilterProp={'title'}*/}
              {/*      onChange={value => this.changeCoQuan(value)}*/}
              {/*    />*/}
              {/*  </Item>*/}
              {/*</Col>*/}
              {/*{!dataEdit.CanBoID ? <Col span={4} push={1}>*/}
              {/*  <Item label={'Hoặc'}/>*/}
              {/*</Col> : ""}*/}
              {/*{!dataEdit.CanBoID ? <Col span={8} push={4}>*/}
              {/*  <Item label={"Thêm phòng ban"} name={'TenCoQuan'} initialValue={""} {...FORMLAYOUT3COL}>*/}
              {/*    <Input/>*/}
              {/*  </Item>*/}
              {/*</Col> : ""}*/}
            </Row>
            <Row style={{marginBottom: 20}}>
              <Col span={7}>Tên cán bộ <span style={{color: "red"}}>*</span></Col>
              <Col span={6} push={1}>Email <span style={{color: "red"}}>*</span></Col>
              <Col span={6} push={2}>Vai trò</Col>
              <Col span={1} push={4}>
                {!dataEdit.CanBoID ? <div style={{textAlign: 'right'}}>
                  <Tooltip title={'Thêm cán bộ'}>
                    <Button type={'primary'} icon={'plus'} onClick={this.ThemCanBo}
                            style={{borderRadius: '50%', width: 40, height: 40}}/>
                  </Tooltip>
                </div> : ""}
              </Col>
            </Row>
            {DanhSachCanBo.map((item, index) => (
              <Row>
                <Col span={7}>
                  <Item name={['DanhSachCanBo', index, 'TenCanBo']} initialValue={""}
                        rules={[{...REQUIRED}]}>
                    <Input style={{textTransform: "capitalize"}}/>
                  </Item>
                </Col>
                <Col span={6} push={1}>
                  <Item name={['DanhSachCanBo', index, 'Email']} initialValue={""}
                        rules={[{...REQUIRED}, {type: 'email', message: 'Email không hợp lệ'}]}>
                    <Input/>
                  </Item>
                </Col>
                <Col span={8} push={2}>
                  <Item initialValue={[]} name={['DanhSachCanBo', index, 'ListNhomNguoiDungID']}>
                    <Select allowClear={true} notFoundContent={"Không có dữ liệu"} showSearch
                            mode={'multiple'} noGetPopupContainer>
                      {DanhSachNhomNguoiDung.map((item) => <Option
                        value={item.NhomNguoiDungID}>{item.TenNhom}</Option>)}
                    </Select>
                  </Item>
                </Col>
                {!dataEdit.CanBoID ? <Col span={1} push={2}>
                  <Item style={{textAlign: 'right'}}>
                    <Button icon={'minus'} type={'danger'} onClick={() => this.XoaCanBo(index)}/>
                  </Item>
                </Col> : ""}
              </Row>
            ))}
          </Form>
        </Styled>
      </Modal>
    );
  }
}