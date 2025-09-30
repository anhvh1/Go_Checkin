import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Input, Switch, Button } from "antd";
import Select, { Option } from "../../../components/uielements/select";
import api from "./config";
import Constants, {
  MODAL_NORMAL,
  ITEM_LAYOUT3,
  REQUIRED,
} from "../../../settings/constants";
import { _debounce } from "../../../helpers/utility";

const ModalAdd = ({
  visible,
  onCancel,
  dataModalAdd,
  user_id,
  onCreate,
  confirmLoading,
}) => {
  const [form] = Form.useForm();

  const [DanhSachTinh, setDanhSachTinh] = useState([]);
  const [DanhSachHuyen, setDanhSachHuyen] = useState([]);
  const [DanhSachXa, setDanhSachXa] = useState([]);
  const [CoQuanChaID, setCoQuanChaID] = useState("");
  const [TenCoQuanCha, setTenCoQuanCha] = useState("");
  const [allRight, setAllRight] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [TinhChaID, setTinhChaID] = useState(undefined);
  const [HuyenChaID, setHuyenChaID] = useState(undefined);
  const [listCap, setListCap] = useState([]);
  const [codeExist, setCodeExist] = useState(false);

  // Debounce check code
  const checkCode = useCallback(
    _debounce(() => checkCodeApi(), 500),
    []
  );

  useEffect(() => {
    if (!dataModalAdd) return;
    const {
      DanhSachTinh: dsTinh,
      CoQuanChaID: coQuanID,
      TenCoQuanCha: tenCQ,
    } = dataModalAdd;
    setDanhSachTinh(dsTinh);
    setCoQuanChaID(coQuanID || "");
    setTenCoQuanCha(tenCQ || "");

    let initListCap = [{ value: "1", label: "Cấp UBND tỉnh" }];
    if (coQuanID) {
      api.chiTietCoQuan({ CoQuanID: coQuanID }).then((res) => {
        if (res.data.Status > 0) {
          const { TinhID, HuyenID, CapID } = res.data.Data;
          setTinhChaID(TinhID);
          setHuyenChaID(HuyenID);

          if (CapID === 1)
            initListCap = [
              { value: "2", label: "Cấp sở, ban ngành" },
              { value: "3", label: "Cấp UBND huyện" },
            ];
          else if (CapID > 1)
            initListCap = [
              { value: "4", label: "Cấp phòng ban" },
              { value: "5", label: "Cấp UBND xã" },
            ];
          setListCap(initListCap);

          api
            .danhSachDiaGioi({ ID: TinhID, Cap: Constants.HUYEN })
            .then((res2) => {
              if (res2.data.Status > 0) {
                setDanhSachHuyen(res2.data.Data);
                api
                  .danhSachDiaGioi({ ID: HuyenID, Cap: Constants.XA })
                  .then((res3) => {
                    if (res3.data.Status > 0) {
                      setDanhSachXa(res3.data.Data);
                      setAllRight(true);
                    }
                  });
              }
            });
        }
      });
    } else {
      setListCap(initListCap);
      setAllRight(true);
    }
  }, [dataModalAdd]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      onCreate({ ...values });
    } catch (err) {
      // validation failed
    }
  };

  const onChangeTinh = (TinhID) => {
    if (!TinhID) {
      setDanhSachHuyen([]);
      setDanhSachXa([]);
      form.setFieldsValue({ HuyenID: undefined, XaID: undefined });
      return;
    }

    api
      .danhSachDiaGioi({ ID: TinhID, Cap: Constants.HUYEN })
      .then((res) => {
        if (res.data.Status > 0) {
          setDanhSachHuyen(res.data.Data);
          setDanhSachXa([]);
          form.setFieldsValue({ HuyenID: undefined, XaID: undefined });
        } else {
          Modal.error({ title: "Lỗi", content: res.data.Message });
        }
      })
      .catch(() => Modal.error(Constants.API_ERROR));
  };

  const onChangeHuyen = (HuyenID) => {
    if (!HuyenID) {
      setDanhSachXa([]);
      form.setFieldsValue({ XaID: undefined });
      return;
    }
    api
      .danhSachDiaGioi({ ID: HuyenID, Cap: Constants.XA })
      .then((res) => {
        if (res.data.Status > 0) {
          setDanhSachXa(res.data.Data);
          form.setFieldsValue({ XaID: undefined });
        } else {
          Modal.error({ title: "Lỗi", content: res.data.Message });
        }
      })
      .catch(() => Modal.error(Constants.API_ERROR));
  };

  const checkCodeApi = () => {
    const MaCQ = form.getFieldValue("MaCQ");
    if (!MaCQ) return setCodeExist(false);

    api.CheckMaCQ({ MaCQ, CoQuanID: 0 }).then((res) => {
      const exist = res.data.Status < 1;
      setCodeExist(exist);
      form.setFields({
        MaCQ: {
          value: MaCQ,
          errors: exist ? [new Error("Mã cơ quan đã được sử dụng!")] : [],
        },
      });
    });
  };

  const checkCodeValidator = (_, value) => {
    if (value && codeExist)
      return Promise.reject("Mã cơ quan đã được sử dụng!");
    return Promise.resolve();
  };

  const renderSuDungPM = () => {
    let flagSuDungPM = false;
    if (user_id === 1) flagSuDungPM = !CoQuanChaID;
    const SuDungPM = (
      <Form.Item
        label="Sử dụng phần mềm"
        {...ITEM_LAYOUT3}
        name="SuDungPM"
        initialValue={flagSuDungPM}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    );
    const CQCoHieuLuc = (
      <Form.Item
        label="Cơ quan có hiệu lực"
        {...ITEM_LAYOUT3}
        name="CQCoHieuLuc"
        initialValue={true}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    );

    if (user_id === 1) return CoQuanChaID ? CQCoHieuLuc : SuDungPM;
    return CQCoHieuLuc;
  };

  if (!allRight) return null;

  return (
    <Modal
      title="Thêm thông tin cơ quan, đơn vị"
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
          onClick={onOk}
          loading={confirmLoading}
        >
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} layout="horizontal" {...ITEM_LAYOUT3}>
        <Form.Item label="Tên cơ quan" name="TenCoQuan" rules={[REQUIRED]}>
          <Input autoFocus />
        </Form.Item>

        {CoQuanChaID && (
          <Form.Item label="Cơ quan cha" name="CoQuanChaID" rules={[REQUIRED]}>
            <Select disabled={disabled}>
              <Option value={CoQuanChaID}>{TenCoQuanCha}</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item label="Tỉnh" name="TinhID" rules={[REQUIRED]}>
          <Select
            showSearch
            onChange={onChangeTinh}
            placeholder="Chọn địa chỉ tỉnh"
          >
            {DanhSachTinh.map((t) => (
              <Option key={t.ID} value={t.ID}>
                {t.Ten}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Huyện" name="HuyenID" rules={[REQUIRED]}>
          <Select
            showSearch
            onChange={onChangeHuyen}
            placeholder="Chọn địa chỉ huyện"
          >
            {DanhSachHuyen.map((h) => (
              <Option key={h.ID} value={h.ID}>
                {h.Ten}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Xã" name="XaID">
          <Select showSearch placeholder="Chọn địa chỉ xã">
            {DanhSachXa.map((x) => (
              <Option key={x.ID} value={x.ID}>
                {x.Ten}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {renderSuDungPM()}
      </Form>
    </Modal>
  );
};

export { ModalAdd };
