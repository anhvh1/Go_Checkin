import { all, takeEvery, put, call } from "redux-saga/effects";
import api from "../../containers/Dashboard/config";
import actions from "./actions";
import moment from "moment";
import {Icon} from "antd";
import React from "react";

function* getInitData({payload}) {
  try {
    const dataTest = JSON.parse(localStorage.getItem("data_test"));
    const data = yield formatDateData(dataTest);
    //danh sach co quan
    const responseCoQuan = yield call(api.danhSachCoQuan);
    const DanhSachCoQuan = yield formatData(responseCoQuan.data.Data);
    //danh sach  can bo
    const responseCanBo = yield call(api.danhSachCanBo, {});
    const DanhSachCanBo = responseCanBo.data.Data ? responseCanBo.data.Data : [];
    yield put({
      type: actions.DASHBOARD_GET_INIT_DATA_REQUEST_SUCCESS,
      payload: {
        data,
        DanhSachCoQuan,
        DanhSachCanBo,
      }
    });
  } catch (e) {
    yield put({
      type: actions.DASHBOARD_GET_INIT_DATA_REQUEST_ERROR
    });
  }
}

function formatDateData(dataTest) {
  let statisticData = {
    total: 0,
    status1: 0,
    status2: 0,
    status3: 0,
    status4: 0
  };
  let taskData = {};
  if(dataTest){
    Object.entries(dataTest).forEach(([missionType, missionData], index) => {
      if(missionType !== "0"){
        missionData.items.forEach(card => {
          statisticData.total++;
          let status = getStatus(card);
          let background = "#cccccc";
          if(status === 1){
            statisticData.status1++;
          }else if(status === 2){
            statisticData.status2++;
            background = "#049be5";
          }else if(status === 3){
            statisticData.status3++;
            background = "#d50600";
          }else if(status === 4){
            statisticData.status4++;
            background = "#33b678";
          }
          let date = moment(card.date, "DD/MM/YYYY").format("DD");
          if(taskData[date] !== undefined){
            taskData[date].push({...card, backgroundColor: background});
          }else{
            taskData[date] = [{...card, missionType, backgroundColor: background}];
          }
        });
      }
    });
  }

  return {statisticData, taskData};
}
function getStatus(card) {
  const today = moment().format("YYYY-MM-DD");
  const due_date = moment(card.date, "DD/MM/YYYY").format("YYYY-MM-DD");
  let status = 1;
  if(card.work_progress){
    const arrayProgress = card.work_progress.split("/");
    if(arrayProgress[0] === arrayProgress[1]) status = 4;
    else {
      if(due_date < today) status = 3;
      else status = 2;
    }
  }else if(due_date < today) status = 3;
  return status;
}

function formatData(DanhSachCoQuan){
  const DanhSach = DanhSachCoQuan.map((value1, index1) => {
    //-------1
    let title1 = value1.Ten;
    let key1 = `${index1}`;
    let valueSelect1 = `${value1.ID}`;
    let children1 = null;
    if(value1.Children){
      children1 = value1.Children.map((value2, index2) => {
        //------2
        let title2 = value2.Ten;
        let key2 = `${index1}-${index2}`;
        let valueSelect2 = `${value2.ID}`;
        let children2 = null;
        if(value2.Children){
          children2 = value2.Children.map((value3, index3) => {
            //------3
            let title3 = value3.Ten;
            let key3 = `${index1}-${index2}-${index3}`;
            let valueSelect3 = `${value3.ID}`;
            let children3 = null;
            return {
              ...value3,
              title: title3,
              key: key3,
              value: valueSelect3,
              children: children3
            };
          });
        }
        return {
          ...value2,
          title: title2,
          key: key2,
          value: valueSelect2,
          children: children2
        };
      });
    }
    return {
      ...value1,
      title: title1,
      key: key1,
      value: valueSelect1,
      children: children1
    };
  });
  return DanhSach;
}

function* getData({payload}) {
  // try {
  //   const response = yield call(api.danhSachChucVu, payload.filterData);
  //   yield put({
  //     type: actions.DASHBOARD_GET_DATA_REQUEST_SUCCESS,
  //     payload: {
  //       DanhSachChucVu: response.data.Data,
  //       TotalRow: response.data.TotalRow
  //     }
  //   });
  // } catch (e) {
  //   yield put({
  //     type: actions.DASHBOARD_GET_DATA_REQUEST_ERROR
  //   });
  // }
}

export default function* rootSaga() {
  yield all([yield takeEvery(actions.DASHBOARD_GET_INIT_DATA_REQUEST, getInitData)]);
  yield all([yield takeEvery(actions.DASHBOARD_GET_DATA_REQUEST, getData)]);
}
