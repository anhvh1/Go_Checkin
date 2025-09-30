import {all, takeEvery, put, call} from "redux-saga/effects";
import api from "../../containers/DMCoQuan/config";
import apiThamSo from "../../containers/ThamSoHeThong/config";
import actions from "./actions";

function* getInitData({payload}) {
  try {
    //data co quan
    const response = yield call(api.danhSachCoQuan, payload.filterData);
    const thamso = yield call(apiThamSo.GetByKey, {ConfigKey: "NhomPhanQuyen_Admin"});
    let resultData = {
      DanhSachCoQuan: [],
      expandedKeys: []
    };
    if (response.data.Data) {
      resultData = yield formatData(response.data.Data);
    }

    //data dia gioi
    const responseDiaGioi = yield call(api.danhSachDiaGioi, {ID: 0, Cap: 1});
    const DanhSachDiaGioi = yield responseDiaGioi.data.Data.map(value => {
      return {
        ...value,
        id: `${value.ID}_${value.Cap}`,
        pId: "0",
        value: `${value.ID}_${value.Ten}`,
        title: value.Ten,
        isLeaf: value.TotalChildren < 1,
        disabled: true
      };
    });
    //return action
    yield put({
      type: actions.COQUAN_GET_INIT_DATA_REQUEST_SUCCESS,
      payload: {
        DanhSachCoQuan: resultData.DanhSachCoQuan,
        DanhSachDiaGioi,
        expandedKeys: resultData.expandedKeys,
        ListPhanQuyenAdmin: thamso.data.Data.ConfigValue.split(",")
      }
    });
  } catch (e) {
    yield put({
      type: actions.COQUAN_GET_INIT_DATA_REQUEST_ERROR
    });
  }
}

function* getList({payload}) {
  try {
    const response = yield call(api.danhSachCoQuan, payload.filterData);
    const resultData = yield formatData(response.data.Data);
    yield put({
      type: actions.COQUAN_GET_LIST_REQUEST_SUCCESS,
      payload: {
        DanhSachCoQuan: resultData.DanhSachCoQuan,
        expandedKeys: resultData.expandedKeys
      }
    });
  } catch (e) {
    yield put({
      type: actions.COQUAN_GET_LIST_REQUEST_ERROR
    });
  }
}

function formatData(DanhSachCoQuan) {
  let expandedKeys = [];
  const DanhSach = DanhSachCoQuan.map((value1, index1) => {
    //-------1
    let title1 = value1.Ten;
    let key1 = `${index1}`;
    let isLeaf1 = true;
    let children1 = null;
    if (value1.Children) {
      isLeaf1 = false;
      expandedKeys.push(key1);
      children1 = value1.Children.map((value2, index2) => {
        //------2
        let title2 = value2.Ten;
        let key2 = `${index1}-${index2}`;
        let isLeaf2 = true;
        let children2 = null;
        if (value2.Children) {
          isLeaf2 = false;
          expandedKeys.push(key2);
          children2 = value2.Children.map((value3, index3) => {
            //------3
            let title3 = value3.Ten;
            let key3 = `${index1}-${index2}-${index3}`;
            let isLeaf3 = true;
            let children3 = null;
            return {
              ...value3,
              title: title3,
              key: key3,
              isLeaf: isLeaf3,
              children: children3
            };
          });
        }
        return {
          ...value2,
          title: title2,
          key: key2,
          isLeaf: isLeaf2,
          children: children2
        };
      });
    }
    return {
      ...value1,
      title: title1,
      key: key1,
      isLeaf: isLeaf1,
      children: children1
    };
  });
  return {
    DanhSachCoQuan: DanhSach,
    expandedKeys
  };
}

export default function* rootSaga() {
  yield all([yield takeEvery(actions.COQUAN_GET_INIT_DATA_REQUEST, getInitData)]);
  yield all([yield takeEvery(actions.COQUAN_GET_LIST_REQUEST, getList)]);
}
