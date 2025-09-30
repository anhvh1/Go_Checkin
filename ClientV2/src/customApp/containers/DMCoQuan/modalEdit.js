import React, { useState, useEffect, useCallback } from "react";
import Constants, { ITEM_LAYOUT3, REQUIRED } from "../../../settings/constants";
import { Modal, Form, Input, Switch, Button } from "antd";
import Select, { Option } from "../../../components/uielements/select";
import api from "./config";
import { _debounce } from "../../../helpers/utility";

const ModalEdit = ({
  visible,
  onCancel,
  dataModalEdit,
  onCreate,
  confirmLoading,
  user_id,
}) => {
  const [form] = Form.useForm();

  const [DanhSachTinh, setDanhSachTinh] = useState([]);
  const [DanhSachHuyen, setDanhSachHuyen] = useState([]);
  const [DanhSachXa, setDanhSachXa] = useState([]);
  const [Data, setData] = useState(null);
  const [allRight, setAllRight] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [listCap, setListCap] = useState([]);
  const [codeExist, setCodeExist] = useState(false);

  // debounce check mã cơ quan
  const checkCodeApi = useCallback(
    _debounce(() => {
      const MaCQ = form.getFieldValue("MaCQ");
      const CoQuanID = Data?.CoQuanID;
      if (!MaCQ) {
        setCodeExist(false);
        return;
      }
      api.CheckMaCQ({ MaCQ, CoQuanID }).then((response) => {
        let field = { value: MaCQ };
        if (response.data.Status < 1) {
          setCodeExist(true);
          field.errors = [new Error("Mã cơ quan đã được sử dụng!")];
        } else {
          setCodeExist(false);
        }
        form.setFields([{ name: "MaCQ", ...field }]);
      });
    }, 500),
    [Data, form]
  );

  const checkCodeValidator = (rule, value) => {
    if (value && codeExist)
      return Promise.reject("Mã cơ quan đã được sử dụng!");
    return Promise.resolve();
  };

  useEffect(() => {
    if (!dataModalEdit) return;
    const { DanhSachTinh, Data } = dataModalEdit;
    setDanhSachTinh(DanhSachTinh || []);
    if (!Data) return;

    let initListCap = [{ value: "1", label: "Cấp UBND tỉnh" }];

    // Lấy danh sách Huyện
    api
      .danhSachDiaGioi({ ID: Data.TinhID, Cap: Constants.HUYEN })
      .then((responseHuyen) => {
        if (responseHuyen.data.Status > 0) {
          if (!responseHuyen.data.Data.length) Data.HuyenID = "";
          // Lấy danh sách Xã
          api
            .danhSachDiaGioi({ ID: Data.HuyenID, Cap: Constants.XA })
            .then((responseXa) => {
              if (responseXa.data.Status > 0) {
                if (!responseXa.data.Data.length) Data.XaID = "";
                if (Data.CapID === 2 || Data.CapID === 3) {
                  initListCap = [
                    { value: "2", label: "Cấp sở, ban ngành" },
                    { value: "3", label: "Cấp UBND huyện" },
                  ];
                } else if (Data.CapID === 4 || Data.CapID === 5) {
                  initListCap = [
                    { value: "4", label: "Cấp phòng ban" },
                    { value: "5", label: "Cấp UBND xã" },
                  ];
                }
                setDanhSachHuyen(responseHuyen.data.Data);
                setDanhSachXa(responseXa.data.Data);
                setListCap(initListCap);
                setData(Data);
                setAllRight(true);
                form.setFieldsValue({
                  ...Data,
                });
              } else {
                Modal.error({ title: "Lỗi", content: responseXa.data.Message });
              }
            })
            .catch(() => Modal.error(Constants.API_ERROR));
        } else {
          Modal.error({ title: "Lỗi", content: responseHuyen.data.Message });
        }
      })
      .catch(() => Modal.error(Constants.API_ERROR));
  }, [dataModalEdit, form]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      onCreate({ ...values });
    } catch (err) {
      // validation failed
    }
  };

  const onChangeTinh = async (value) => {
    const TinhID = value || "";
    if (!TinhID) {
      setDanhSachHuyen([]);
      setDanhSachXa([]);
      form.setFieldsValue({ HuyenID: undefined, XaID: undefined });
      return;
    }
    try {
      const response = await api.danhSachDiaGioi({
        ID: TinhID,
        Cap: Constants.HUYEN,
      });
      if (response.data.Status > 0) {
        setDanhSachHuyen(response.data.Data);
        setDanhSachXa([]);
        form.setFieldsValue({ HuyenID: undefined, XaID: undefined });
      } else {
        Modal.error({ title: "Lỗi", content: response.data.Message });
      }
    } catch (err) {
      Modal.error(Constants.API_ERROR);
    }
  };

  const onChangeHuyen = async (value) => {
    const HuyenID = value || "";
    if (!HuyenID) {
      setDanhSachXa([]);
      form.setFieldsValue({ XaID: undefined });
      return;
    }
    try {
      const response = await api.danhSachDiaGioi({
        ID: HuyenID,
        Cap: Constants.XA,
      });
      if (response.data.Status > 0) {
        setDanhSachXa(response.data.Data);
        form.setFieldsValue({ XaID: undefined });
      } else {
        Modal.error({ title: "Lỗi", content: response.data.Message });
      }
    } catch (err) {
      Modal.error(Constants.API_ERROR);
    }
  };

  const renderSuDungPM = () => {
    if (!Data) return null;
    const CoQuanChaID = Data.CoQuanChaID;
    if (user_id === 1) {
      if (CoQuanChaID) {
        return (
          <Form.Item
            label="Cơ quan có hiệu lực"
            {...ITEM_LAYOUT3}
            name="CQCoHieuLuc"
            valuePropName="checked"
          >
            <Switch defaultChecked={Data.CQCoHieuLuc} />
          </Form.Item>
        );
      } else {
        return (
          <Form.Item
            label="Sử dụng phần mềm"
            {...ITEM_LAYOUT3}
            name="SuDungPM"
            valuePropName="checked"
          >
            <Switch defaultChecked={Data.SuDungPM} disabled={CoQuanChaID} />
          </Form.Item>
        );
      }
    } else {
      return (
        <Form.Item
          label="Cơ quan có hiệu lực"
          {...ITEM_LAYOUT3}
          name="CQCoHieuLuc"
          valuePropName="checked"
        >
          <Switch defaultChecked={Data.CQCoHieuLuc} />
        </Form.Item>
      );
    }
  };

  if (!allRight) return null;

  return (
    <Modal
      title="Sửa thông tin cơ quan, đơn vị"
      width={550}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={confirmLoading}
          onClick={onOk}
        >
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} layout="horizontal">
        <Form.Item name="CoQuanID" style={{ display: "none" }}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Tên cơ quan"
          {...ITEM_LAYOUT3}
          name="TenCoQuan"
          rules={[REQUIRED]}
        >
          <Input autoFocus />
        </Form.Item>

        {Data?.CoQuanChaID && (
          <Form.Item
            label="Cơ quan cha"
            {...ITEM_LAYOUT3}
            name="CoQuanChaID"
            rules={[REQUIRED]}
          >
            <Select disabled={disabled}>
              <Option value={Data.CoQuanChaID}>{Data.TenCoQuanCha}</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label="Tỉnh"
          {...ITEM_LAYOUT3}
          name="TinhID"
          rules={[REQUIRED]}
        >
          <Select
            showSearch
            onChange={onChangeTinh}
            placeholder="Chọn địa chỉ tỉnh"
          >
            {DanhSachTinh.map((tinh) => (
              <Option key={tinh.ID} value={tinh.ID}>
                {tinh.Ten}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Huyện"
          {...ITEM_LAYOUT3}
          name="HuyenID"
          rules={[REQUIRED]}
        >
          <Select
            showSearch
            onChange={onChangeHuyen}
            placeholder="Chọn địa chỉ huyện"
          >
            {DanhSachHuyen.map((huyen) => (
              <Option key={huyen.ID} value={huyen.ID}>
                {huyen.Ten}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Xã" {...ITEM_LAYOUT3} name="XaID">
          <Select showSearch placeholder="Chọn địa chỉ xã">
            {DanhSachXa.map((xa) => (
              <Option key={xa.ID} value={xa.ID}>
                {xa.Ten}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {renderSuDungPM()}
      </Form>
    </Modal>
  );
};

export { ModalEdit };
