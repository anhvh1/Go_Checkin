import React, {Component} from 'react';
import Constants, {
  MODAL_NORMAL,
  ITEM_LAYOUT3,
  REQUIRED,
  COL_ITEM_LAYOUT_HALF,
  COL_COL_ITEM_LAYOUT_RIGHT, ITEM_LAYOUT_HALF3
} from '../../../settings/constants';
import {Modal, Form, Input, Switch, Button, Row, Col} from 'antd';
import TreeSelect from '../../../components/uielements/treeSelect';
import Select, {Option} from '../../../components/uielements/select';
import api from "./config";
import {_debounce} from '../../../helpers/utility';

const {Item} = Form;

const ModalEdit = Form.create({name: 'modal_edit'})(
  // eslint-disable-next-line
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        DanhSachTinh: [],
        Data: null,
        allRight: false,
        disabled: true,
        listCap: [],
        codeExist: false
      };
      this.checkCode = _debounce(this.checkCodeApi, 500);
    }

    componentDidMount() {
      const {dataModalEdit} = this.props;
      const {DanhSachTinh, Data} = dataModalEdit;
      let listCap = [
        {value: "1", label: "Cấp UBND tỉnh"}
      ];
      //lay danh sach huyen, xa
      if (Data) {
        //goi api lay danh sach huyen ===
        api.danhSachDiaGioi({ID: Data.TinhID, Cap: Constants.HUYEN})
          .then(responseHuyen => {
            if (responseHuyen.data.Status > 0) {
              if (!responseHuyen.data.Data.length) {
                Data.HuyenID = "";
              }
              //goi api lay ds xa >>>>>>>>>>>
              api.danhSachDiaGioi({ID: Data.HuyenID, Cap: Constants.XA})
                .then(responseXa => {
                  if (responseXa.data.Status > 0) {
                    if (!responseXa.data.Data.length) {
                      Data.XaID = "";
                    }
                    if (Data.CapID === 2 || Data.CapID === 3) {
                      listCap = [
                        {value: "2", label: "Cấp sở, ban ngành"},
                        {value: "3", label: "Cấp UBND huyện"},
                      ];
                    } else if (Data.CapID === 4 || Data.CapID === 5) {
                      listCap = [
                        {value: "4", label: "Cấp phòng ban"},
                        {value: "5", label: "Cấp UBND xã"}
                      ];
                    }
                    this.setState({
                      DanhSachTinh,
                      DanhSachHuyen: responseHuyen.data.Data,
                      DanhSachXa: responseXa.data.Data,
                      Data,
                      listCap,
                      allRight: true
                    });
                  } else {
                    Modal.error({title: "Lỗi", content: responseXa.data.Message});
                  }
                }).catch(error => {
                Modal.error(Constants.API_ERROR)
              });
              //<<<<<<<<<<<<
            } else {
              Modal.error({title: "Lỗi", content: responseHuyen.data.Message});
            }
          }).catch(error => {
          Modal.error(Constants.API_ERROR)
        });
        //===
      }
    }

    onOk = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, value) => {
        if (!err) {
          const {onCreate} = this.props;
          onCreate({...value});
        }
      });
    };

    onChangeTinh = (value) => {
      let TinhID = value ? value : "";
      if (TinhID) {
        api.danhSachDiaGioi({
          ID: TinhID,
          Cap: Constants.HUYEN,
        })
          .then(response => {
            if (response.data.Status > 0) {
              this.setState({
                DanhSachHuyen: response.data.Data,
                DanhSachXa: [],
              }, () => {
                this.props.form.setFieldsValue({HuyenID: undefined, XaID: undefined});
              });
            } else {
              Modal.error({
                title: "Lỗi",
                content: response.data.Message
              });
            }
          }).catch(error => {
          Modal.error(Constants.API_ERROR)
        });
      } else {
        this.setState({DanhSachHuyen: [], DanhSachXa: []}, () => {
          this.props.form.setFieldsValue({HuyenID: undefined, XaID: undefined});
        });
      }
    };
    onChangeHuyen = (value) => {
      let HuyenID = value ? value : "";
      if (HuyenID) {
        api.danhSachDiaGioi({
          ID: HuyenID,
          Cap: Constants.XA,
        })
          .then(response => {
            if (response.data.Status > 0) {
              this.setState({DanhSachXa: response.data.Data}, () => {
                this.props.form.setFieldsValue({XaID: undefined});
              });
            } else {
              Modal.error({
                title: "Lỗi",
                content: response.data.Message
              });
            }
          }).catch(error => {
          Modal.error(Constants.API_ERROR)
        });
      } else {
        this.setState({DanhSachXa: []}, () => {
          this.props.form.setFieldsValue({XaID: undefined});
        });
      }
    };

    checkCodeApi = () => {
      const MaCQ = this.props.form.getFieldValue("MaCQ");
      const CoQuanID = this.state.Data.CoQuanID;
      let codeExist = false;
      let field = {value: MaCQ};
      if (MaCQ) {
        api.CheckMaCQ({MaCQ, CoQuanID})
          .then(response => {
            if (response.data.Status < 1) { //ma co quan da ton tai
              codeExist = true;
              field = {
                ...field,
                errors: [new Error('Mã cơ quan đã được sử dụng!')]
              };
            }
            this.setState({codeExist: codeExist}, () => {
              this.props.form.setFields({MaCQ: field});
            });
          });
      } else {
        this.setState({codeExist});
      }
    };

    checkCodeValidator = (rule, value, callback) => {
      if (value && this.state.codeExist) {
        callback("Mã cơ quan đã được sử dụng!");
      }
      callback();
    };

    renderSuDungPM = () => {
      const {user_id} = this.props;
      const {CoQuanChaID} = this.state.Data;
      const {getFieldDecorator} = this.props.form;
      const SuDungPM = <Item label="Sử dụng phần mềm" {...ITEM_LAYOUT3}>
        {getFieldDecorator('SuDungPM', {
          initialValue: this.state.Data.SuDungPM
        })(<Switch defaultChecked={this.state.Data.SuDungPM} disabled={this.state.CoQuanChaID}/>)}
      </Item>;
      const CQCoHieuLuc = <Item label="Cơ quan có hiệu lực" {...ITEM_LAYOUT3}>
        {getFieldDecorator('CQCoHieuLuc', {
          initialValue: true
        })(<Switch defaultChecked={this.state.Data.CQCoHieuLuc}/>)}
      </Item>;
      if (user_id === 1) {
        if (CoQuanChaID) {
          return CQCoHieuLuc;
        } else {
          return SuDungPM;
        }
      }
      else {
        return CQCoHieuLuc;
      }
    };

    render() {
      const {confirmLoading, visible, onCancel, form} = this.props;
      const {getFieldDecorator} = form;
      if (!this.state.allRight) return null;
      return (
        <Modal
          title="Sửa thông tin cơ quan, đơn vị"
          width={550}
          visible={visible}
          onCancel={onCancel}
          footer={[
            <Button key="back" onClick={onCancel}>Hủy</Button>,
            <Button key="submit" htmlType="submit" type="primary" form="myForm"
                    loading={confirmLoading} onClick={this.onOk}>Lưu</Button>,
          ]}
        >
          <Form id="myForm" layout="horizontal">
            <Item style={{display: "none"}}>
              {getFieldDecorator('CoQuanID', {
                initialValue: this.state.Data.CoQuanID
              })(<Input/>)}
            </Item>
            <Item label="Tên cơ quan" {...ITEM_LAYOUT3}>
              {getFieldDecorator('TenCoQuan', {
                initialValue: this.state.Data.TenCoQuan,
                rules: [{...REQUIRED}],
              })(<Input autoFocus/>)}
            </Item>
            <Item label="Mã cơ quan" {...ITEM_LAYOUT3}>
              {getFieldDecorator('MaCQ', {
                initialValue: this.state.Data.MaCQ,
                rules: [
                  {...REQUIRED},
                  {validator: this.checkCodeValidator}
                ],
              })(<Input onChange={this.checkCode}/>)}
            </Item>
            {
              this.state.Data.CoQuanChaID
                ? (
                  <Item label="Cơ quan cha" {...ITEM_LAYOUT3}>
                    {getFieldDecorator('CoQuanChaID', {
                      rules: [{...REQUIRED}],
                      initialValue: this.state.Data.CoQuanChaID
                    })(
                      <Select disabled={this.state.disabled}>
                        <Option value={this.state.Data.CoQuanChaID}>
                          {this.state.Data.TenCoQuanCha}
                        </Option>
                      </Select>
                    )}
                  </Item>
                )
                : ""
            }
            {/*<Item label="Cấp" {...ITEM_LAYOUT3}>*/}
            {/*  {getFieldDecorator('CapID', {*/}
            {/*    initialValue: this.state.Data.CapID ? this.state.Data.CapID.toString() : ""*/}
            {/*  })(*/}
            {/*    <Select>*/}
            {/*      {this.state.listCap.map((item) => (*/}
            {/*        <Option key={item.value} value={item.value}>{item.label}</Option>*/}
            {/*      ))}*/}
            {/*    </Select>*/}
            {/*  )}*/}
            {/*</Item>*/}
            <Item label="Tỉnh" {...ITEM_LAYOUT3}>
              {getFieldDecorator('TinhID', {
                rules: [{...REQUIRED}],
                initialValue: this.state.Data.TinhID ? this.state.Data.TinhID : undefined
              })(
                <Select showSearch onChange={this.onChangeTinh} placeholder="Chọn địa chỉ tỉnh">
                  {this.state.DanhSachTinh.map((value) => (
                    <Option key={value.ID} value={value.ID}>
                      {value.Ten}
                    </Option>
                  ))}
                </Select>,
              )}
            </Item>
            <Item label="Huyện" {...ITEM_LAYOUT3}>
              {getFieldDecorator('HuyenID', {
                rules: [{...REQUIRED}],
                initialValue: this.state.Data.HuyenID ? this.state.Data.HuyenID : undefined
              })(
                <Select showSearch onChange={this.onChangeHuyen} placeholder={"Chọn địa chỉ huyện"}>
                  {this.state.DanhSachHuyen.map((value) => (
                    <Option key={value.ID} value={value.ID}>
                      {value.Ten}
                    </Option>
                  ))}
                </Select>,
              )}
            </Item>
            <Item label="Xã" {...ITEM_LAYOUT3}>
              {getFieldDecorator('XaID', {
                //rules: [{ ...REQUIRED }],
                initialValue: this.state.Data.XaID ? this.state.Data.XaID : undefined
              })(
                <Select showSearch placeholder={"Chọn địa chỉ xã"}>
                  {this.state.DanhSachXa.map((value) => (
                    <Option key={value.ID} value={value.ID}>
                      {value.Ten}
                    </Option>
                  ))}
                </Select>,
              )}
            </Item>
            {/*<Row>*/}
            {/*  <Col {...COL_ITEM_LAYOUT_HALF}>*/}
                {this.renderSuDungPM()}
              {/*</Col>*/}
              {/*{this.state.Data.CoQuanChaID ? "" : <Col {...COL_ITEM_LAYOUT_HALF}>*/}
              {/*  <Row>*/}
              {/*    <Col {...COL_COL_ITEM_LAYOUT_RIGHT}>*/}
              {/*      {this.props.user_id === 1 ? <Item label="Sử dụng phần mềm" {...ITEM_LAYOUT_HALF3}>*/}
              {/*        {getFieldDecorator('SuDungPM', {*/}
              {/*          initialValue: this.state.Data.SuDungPM*/}
              {/*        })(<Switch defaultChecked={this.state.Data.SuDungPM} disabled={this.state.CoQuanChaID}/>)}*/}
              {/*      </Item> : ""}*/}
              {/*    </Col>*/}
              {/*  </Row>*/}
              {/*</Col>}*/}
            {/*</Row>*/}
          </Form>
        </Modal>
      );
    }
  },
);
export {ModalEdit}