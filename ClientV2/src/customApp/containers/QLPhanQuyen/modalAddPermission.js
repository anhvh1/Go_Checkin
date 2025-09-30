import React, { useState, useEffect } from "react";
import Constants, {
  MODAL_NORMAL,
  ITEM_LAYOUT3,
  REQUIRED,
} from "../../../settings/constants";
import { Modal, Form, Button, Checkbox } from "antd";
import Select, { Option } from "../../../components/uielements/select";
import { getOptionSidebar } from "../../../helpers/utility";

const optionsSidebar = getOptionSidebar();

const ModalAddPermission = ({
  visible,
  onCancel,
  confirmLoading,
  dataModalAddPermission,
  onCreate,
}) => {
  const [form] = Form.useForm();
  const [ready, setReady] = useState(false);
  const [NhomNguoiDungID, setNhomNguoiDungID] = useState(0);
  const [DanhSachChucNang, setDanhSachChucNang] = useState([]);
  const [DS, setDS] = useState([]);
  const [DanhSachChucNangThem, setDanhSachChucNangThem] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const { NhomNguoiDungID, DanhSachChucNang } = dataModalAddPermission;
    setNhomNguoiDungID(NhomNguoiDungID);
    setDanhSachChucNang(DanhSachChucNang);

    // Build DanhSachNhomChucNang
    let DanhSachNhomChucNang = [];
    optionsSidebar.forEach((group) => {
      const childrenKeys = group.children.map((c) => c.key);
      if (
        DanhSachChucNang.some((option) =>
          childrenKeys.includes(option.MaChucNang)
        )
      ) {
        DanhSachNhomChucNang.push({
          key: group.key,
          label: group.label,
          childrenKeys,
        });
      }
    });

    // Build DS structure
    let tempDS = [];
    DanhSachNhomChucNang.forEach((groupValue) => {
      let parent = {
        id: groupValue.key,
        key: groupValue.key,
        label: groupValue.label,
        disabled: true,
        children: [],
      };
      let children = [];
      DanhSachChucNang.forEach((value) => {
        if (groupValue.childrenKeys.includes(value.MaChucNang)) {
          children.push({
            id: value.ChucNangID,
            key: value.MaChucNang,
            label: value.TenChucNang,
            disabled: value.disabled,
            children: [],
          });
          if (!value.disabled) parent.disabled = false;
        }
      });
      parent.children = children;
      tempDS.push(parent, ...children);
    });

    setDS(tempDS);
    setReady(NhomNguoiDungID);
  }, [dataModalAddPermission]);

  const onOk = async () => {
    try {
      await form.validateFields();
      onCreate(permissions);
    } catch (err) {
      // validation failed
    }
  };

  const onChangePermission = (checkedValues, ChucNangID) => {
    let newPermissions = [...permissions];
    if (checkedValues.length) {
      const index = newPermissions.findIndex(
        (p) => p.ChucNangID === ChucNangID
      );
      const permObj = {
        NhomNguoiDungID,
        ChucNangID,
        Xem: checkedValues.includes("Xem") ? 1 : 0,
        Them: checkedValues.includes("Them") ? 1 : 0,
        Sua: checkedValues.includes("Sua") ? 1 : 0,
        Xoa: checkedValues.includes("Xoa") ? 1 : 0,
      };
      if (index >= 0) newPermissions[index] = permObj;
      else newPermissions.push(permObj);
      setPermissions(newPermissions);
    } else {
      deleteOption(ChucNangID);
    }
  };

  const deleteOption = (ChucNangID) => {
    setDanhSachChucNangThem((prev) =>
      prev.filter((item) => item.ChucNangID !== ChucNangID)
    );
    setPermissions((prev) =>
      prev.filter((item) => item.ChucNangID !== ChucNangID)
    );
    form.setFieldsValue({
      DanhSachChucNangThemID: form
        .getFieldValue("DanhSachChucNangThemID")
        ?.filter((id) => id !== ChucNangID),
    });
  };

  const renderOptions = (DanhSachChucNangRender) => {
    return DanhSachChucNangRender.map((item) => {
      const parentItem = DanhSachChucNang.find(
        (p) => p.ChucNangID === item.ChucNangID
      );
      if (!parentItem) return null;

      const options = [
        { label: "Xem", value: "Xem", disabled: parentItem.Xem === 0 },
        { label: "Thêm", value: "Them", disabled: parentItem.Them === 0 },
        { label: "Sửa", value: "Sua", disabled: parentItem.Sua === 0 },
        { label: "Xóa", value: "Xoa", disabled: parentItem.Xoa === 0 },
      ];
      const defaultValue = [];
      if (item.Xem) defaultValue.push("Xem");
      if (item.Them) defaultValue.push("Them");
      if (item.Sua) defaultValue.push("Sua");
      if (item.Xoa) defaultValue.push("Xoa");

      return (
        <div key={item.ChucNangID} className="content_row">
          <div
            className="tenchucnang"
            style={{ display: "inline-block", width: 184 }}
          >
            <b>{item.TenChucNang}</b>
          </div>
          <div className="chonxoaquyen" style={{ display: "inline-block" }}>
            <Checkbox.Group
              options={options}
              defaultValue={defaultValue}
              onChange={(checkedValue) =>
                onChangePermission(checkedValue, item.ChucNangID)
              }
            />
            <button
              style={{ border: "none", background: "none", cursor: "pointer" }}
              onClick={() => deleteOption(item.ChucNangID)}
            >
              ✖
            </button>
          </div>
        </div>
      );
    });
  };

  const onChangeSelect = (selectedIds) => {
    let selected = [];
    selectedIds.forEach((id) => {
      if (isNaN(id)) {
        DS.forEach((dsItem) => {
          if (dsItem.id === id)
            dsItem.children.forEach((c) => {
              if (!c.disabled) selected.push(c.id);
            });
        });
      } else selected.push(id);
    });
    addOption(selected);
  };

  const addOption = (MangChucNangID) => {
    let newDanhSach = [];
    let newPermissions = [...permissions];
    DanhSachChucNang.forEach((parent) => {
      if (MangChucNangID.includes(parent.ChucNangID)) {
        newDanhSach.push(parent);
        if (!newPermissions.some((p) => p.ChucNangID === parent.ChucNangID)) {
          newPermissions.push({
            NhomNguoiDungID,
            ChucNangID: parent.ChucNangID,
            Xem: parent.Xem ? 1 : 0,
            Them: parent.Them ? 1 : 0,
            Sua: parent.Sua ? 1 : 0,
            Xoa: parent.Xoa ? 1 : 0,
          });
        }
      }
    });
    setDanhSachChucNangThem(newDanhSach);
    setPermissions(newPermissions);
    form.setFieldsValue({ DanhSachChucNangThemID: MangChucNangID });
  };

  if (!ready) return null;

  return (
    <Modal
      title="Thêm chức năng cho nhóm"
      width={MODAL_NORMAL}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          form="myForm"
          htmlType="submit"
          loading={confirmLoading}
          onClick={onOk}
        >
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} id="myForm" layout="horizontal">
        <Form.Item
          label="Chọn chức năng"
          name="DanhSachChucNangThemID"
          {...ITEM_LAYOUT3}
          rules={[REQUIRED]}
        >
          <Select
            showSearch
            placeholder="Chọn chức năng"
            onChange={onChangeSelect}
            defaultActiveFirstOption={false}
            allowClear
            mode="multiple"
            style={{ marginTop: 4 }}
            className="scroll-select-selection--multiple"
          >
            {DS.map((item) =>
              isNaN(item.id) ? (
                <Option
                  key={item.key}
                  value={item.id}
                  disabled={item.disabled}
                  style={{ fontWeight: "bold" }}
                >
                  {item.label}
                </Option>
              ) : (
                <Option
                  key={item.key}
                  value={item.id}
                  disabled={item.disabled}
                  style={{ paddingLeft: 20 }}
                >
                  {item.label}
                </Option>
              )
            )}
          </Select>
        </Form.Item>
        {DanhSachChucNangThem.length
          ? renderOptions(DanhSachChucNangThem)
          : null}
      </Form>
    </Modal>
  );
};

export { ModalAddPermission };
