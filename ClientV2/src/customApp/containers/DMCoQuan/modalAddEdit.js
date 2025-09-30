import React, { useState, useEffect } from "react";
import Constants, { ITEM_LAYOUT3, REQUIRED } from "../../../settings/constants";
import { Modal, Form, Input, Button, message } from "antd";
import Select, { Option } from "../../../components/uielements/select";
import api from "./config";
import Styled from "./styled";

const ModalAddEdit = ({ visible, onCancel, dataModal, onCreate, loading }) => {
  const [form] = Form.useForm();

  const [DanhSachTinh, setDanhSachTinh] = useState([]);
  const [DanhSachHuyen, setDanhSachHuyen] = useState([]);
  const [DanhSachXa, setDanhSachXa] = useState([]);
  const [CoQuanChaID, setCoQuanChaID] = useState("");
  const [TenCoQuanCha, setTenCoQuanCha] = useState("");
  const [allRight, setAllRight] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [TinhID, setTinhID] = useState(undefined);
  const [HuyenID, setHuyenID] = useState(undefined);
  const [XaID, setXaID] = useState(undefined);
  const [CoQuanID, setCoQuanID] = useState(null);
  const [listCap, setListCap] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (!dataModal) return;
      const { DanhSachTinh, Data } = dataModal;
      const { CoQuanChaID, TenCoQuanCha, CoQuanID } = Data || {};
      setDanhSachTinh(DanhSachTinh || []);

      let initListCap = [{ value: "1", label: "Cấp UBND tỉnh" }];

      if (CoQuanID) {
        const { TinhID, HuyenID, XaID, TenCoQuan } = Data;
        await onChangeTinh(TinhID, false);
        await onChangeHuyen(HuyenID, false);
        setTinhID(TinhID);
        setHuyenID(HuyenID);
        setXaID(XaID);
        setCoQuanID(CoQuanID);
        setAllRight(true);
        form.setFieldsValue({ TenCoQuan, TinhID, HuyenID, XaID });

        if (CoQuanChaID) {
          setCoQuanChaID(CoQuanChaID);
          setTenCoQuanCha(TenCoQuanCha);
        }
      } else if (CoQuanChaID) {
        const response = await api.chiTietCoQuan({ CoQuanID: CoQuanChaID });
        if (response.data.Status > 0) {
          const { TinhID, HuyenID, CapID } = response.data.Data;
          if (TinhID && HuyenID) {
            if (CapID === 1) {
              initListCap = [
                { value: "2", label: "Cấp sở, ban ngành" },
                { value: "3", label: "Cấp UBND huyện" },
              ];
            } else if (CapID > 1) {
              initListCap = [
                { value: "4", label: "Cấp phòng ban" },
                { value: "5", label: "Cấp UBND xã" },
              ];
            }

            const diagioihuyen = await api.danhSachDiaGioi({
              ID: TinhID,
              Cap: Constants.HUYEN,
            });
            if (diagioihuyen.data.Status > 0) {
              const diagioixa = await api.danhSachDiaGioi({
                ID: HuyenID,
                Cap: Constants.XA,
              });
              if (diagioixa.data.Status > 0) {
                setTinhID(TinhID);
                setHuyenID(HuyenID);
                setDanhSachHuyen(diagioihuyen.data.Data);
                setDanhSachXa(diagioixa.data.Data);
                setListCap(initListCap);
                setCoQuanChaID(CoQuanChaID);
                setTenCoQuanCha(TenCoQuanCha);
                setAllRight(true);
              }
            }
          }
        }
      } else {
        setListCap(initListCap);
        setCoQuanChaID(CoQuanChaID);
        setTenCoQuanCha(TenCoQuanCha);
        setAllRight(true);
      }
    };

    init();
  }, [dataModal, form]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      if (CoQuanID) values.CoQuanID = CoQuanID;
      onCreate({ ...values });
    } catch (err) {
      // validation failed
    }
  };

  const onChangeTinh = async (value, reset = true) => {
    if (!value) {
      setDanhSachHuyen([]);
      setDanhSachXa([]);
      if (reset) form.setFieldsValue({ HuyenID: undefined, XaID: undefined });
      return;
    }

    try {
      const response = await api.danhSachDiaGioi({
        ID: value,
        Cap: Constants.HUYEN,
      });
      if (response.data.Status > 0) {
        setDanhSachHuyen(response.data.Data);
        if (reset) form.setFieldsValue({ HuyenID: undefined, XaID: undefined });
      } else {
        message.destroy();
        message.error(response.data.Message);
      }
    } catch (error) {
      message.destroy();
      message.error(error.toString());
    }
  };

  const onChangeHuyen = async (value, reset = true) => {
    if (!value) {
      setDanhSachXa([]);
      if (reset) form.setFieldsValue({ XaID: undefined });
      return;
    }

    try {
      const response = await api.danhSachDiaGioi({
        ID: value,
        Cap: Constants.XA,
      });
      if (response.data.Status > 0) {
        setDanhSachXa(response.data.Data);
        if (reset) form.setFieldsValue({ XaID: undefined });
      } else {
        message.destroy();
        message.error(response.data.Message);
      }
    } catch (error) {
      message.destroy();
      message.error(error.toString());
    }
  };

  if (!allRight) return null;

  return (
    <Modal
      title={`${CoQuanID ? "Sửa" : "Thêm"} thông tin cơ quan`}
      width={550}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={onOk}>
          Lưu
        </Button>,
      ]}
    >
      <Styled>
        <Form form={form} layout="horizontal">
          <Form.Item label="Tên cơ quan" name="TenCoQuan" rules={[REQUIRED]}>
            <Input autoFocus />
          </Form.Item>

          {CoQuanChaID && (
            <Form.Item
              label="Cơ quan cha"
              name="CoQuanChaID"
              rules={[REQUIRED]}
            >
              <Select disabled={disabled}>
                <Option value={CoQuanChaID}>{TenCoQuanCha}</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item
            label="Tỉnh"
            name="TinhID"
            rules={[REQUIRED]}
            initialValue={TinhID}
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
            name="HuyenID"
            rules={[REQUIRED]}
            initialValue={HuyenID}
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

          <Form.Item label="Xã" name="XaID" initialValue={XaID}>
            <Select showSearch placeholder="Chọn địa chỉ xã">
              {DanhSachXa.map((xa) => (
                <Option key={xa.ID} value={xa.ID}>
                  {xa.Ten}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Địa chỉ" name="DiaChi">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Styled>
    </Modal>
  );
};

export default ModalAddEdit;
