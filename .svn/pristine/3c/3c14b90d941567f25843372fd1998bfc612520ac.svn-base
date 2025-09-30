import {Map} from 'immutable';
import {store} from '../redux/store';
import moment from 'moment';
import {debounce} from "lodash";
import {fileUploadLimit} from "../settings/constants";
import {message} from "antd";
import optionsSidebarRaw from "../customApp/sidebar";
import {HttpTransportType, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import api from '../settings/index';

export function _debounce(callback, time = 300) {
  return debounce(callback, time);
}

export function clearToken() {
  //localStorage.removeItem('id_token');
  localStorage.clear();
}

export function getToken() {
  try {
    const userId = localStorage.getItem('user_id');
    const accessToken = localStorage.getItem('access_token');
    return new Map({userId, accessToken});
  } catch (err) {
    clearToken();
    return new Map();
  }
}

export function isFullLocalStorage() {
  const user_id = localStorage.getItem('user_id');
  const access_token = localStorage.getItem('access_token');
  return !(!user_id || !access_token);
}

export function timeDifference(givenTime) {
  givenTime = new Date(givenTime);
  const milliseconds = new Date().getTime() - givenTime.getTime();
  const numberEnding = number => {
    return number > 1 ? 's' : '';
  };
  const number = num => (num > 9 ? '' + num : '0' + num);
  const getTime = () => {
    let temp = Math.floor(milliseconds / 1000);
    const years = Math.floor(temp / 31536000);
    if (years) {
      const month = number(givenTime.getUTCMonth() + 1);
      const day = number(givenTime.getUTCDate());
      const year = givenTime.getUTCFullYear() % 100;
      return `${day}-${month}-${year}`;
    }
    const days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
      if (days < 28) {
        return days + ' day' + numberEnding(days);
      } else {
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ];
        const month = months[givenTime.getUTCMonth()];
        const day = number(givenTime.getUTCDate());
        return `${day} ${month}`;
      }
    }
    const hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
      return `${hours} hour${numberEnding(hours)} ago`;
    }
    const minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
      return `${minutes} minute${numberEnding(minutes)} ago`;
    }
    return 'a few seconds ago';
  };
  return getTime();
}

export function stringToInt(value, defValue = 0) {
  if (!value) {
    return 0;
  } else if (!isNaN(value)) {
    return parseInt(value, 10);
  }
  return defValue;
}

export function stringToPosetiveInt(value, defValue = 0) {
  const val = stringToInt(value, defValue);
  return val > -1 ? val : defValue;
}

export function changeUrlFilter(filter) {
  let url = window.location.origin + window.location.pathname;
  let query_arr = [];
  let _arr = [];

  if (filter !== undefined && filter !== null) {
    let property;
    for (property in filter) {
      if (filter[property] !== undefined && filter[property] !== null && filter[property].toString().trim() !== '') {
        _arr.push({
          key: property,
          value: filter[property].toString().trim()
        });
      }
    }
  }

  if (_arr.length > 0) {
    _arr.forEach(item => {
      query_arr.push(item.key + '=' + item.value);
    })
  }

  query_arr.sort();
  if (query_arr.length) {
    url = url + '?' + query_arr.join('&');
  }
  window.history.replaceState(null, null, url);
}

export function getFilterData(oldFilterData, onFilter, onOrder) {
  const DefaultPageSize = getDefaultPageSize();
  let filterData = oldFilterData;
  if (onFilter) {
    let {value, property} = onFilter;
    filterData[property] = value;
    //reset paging
    filterData.PageNumber = '';
    if (filterData.PageSize) {
      filterData.PageNumber = 1;
    }
  } else {
    let {pagination, sorter} = onOrder;
    //paging --
    if (pagination !== {}) {
      let PageNumber = pagination.current;
      let PageSize = pagination.pageSize;
      let CurrentPageSize = DefaultPageSize;
      //get currentPageSize
      if (filterData.PageSize) {
        CurrentPageSize = filterData.PageSize;
      }
      //neu changePageSize -> reset PageNumber = 1
      if (PageSize !== CurrentPageSize) {
        PageNumber = 1;
      }
      filterData = {
        ...filterData,
        PageNumber,
        PageSize
      };
    }
    //order --
    if (sorter !== {}) {
      let OrderByName = '';
      let OrderByOption = '';
      if (sorter.field && (sorter.order === "ascend" || sorter.order === "descend")) {
        OrderByName = sorter.field;
        OrderByOption = sorter.order === "ascend" ? "asc" : "desc";
      }
      if (OrderByOption !== "asc" && OrderByOption !== "desc") {
        delete filterData.OrderByName;
        delete filterData.OrderByOption;
      } else {
        filterData = {
          ...filterData,
          OrderByName,
          OrderByOption,
        };
      }
    }
  }
  //xoa page info neu la default info: 1, DefaultPageSize
  filterData = {
    ...filterData,
    PageNumber: filterData.PageNumber ? parseInt(filterData.PageNumber) : 1,
    PageSize: filterData.PageSize ? parseInt(filterData.PageSize) : DefaultPageSize
  };
  if ((filterData.PageNumber === 1 && filterData.PageSize === DefaultPageSize) || !filterData.PageNumber) {
    delete filterData.PageNumber;
    delete filterData.PageSize;
  }
  return filterData;
}

export function getScrollParent(node) {
  if (node.parentElement === null) {
    return node;
  }

  return node.parentElement.scrollHeight > node.clientHeight
  || node.parentElement.scrollWidth > node.clientWidth
    ? node.parentElement
    : getScrollParent(node.parentElement);
}

//Get Role ----------------------------------------------------------------------------------------------------------
export function getRoleByKey(listRole, key) {
  let role = {view: 0, add: 0, edit: 0, delete: 0};
  if (!listRole) {
    let roleStore = localStorage.getItem('role');
    listRole = JSON.parse(roleStore);
  }
  if (listRole[key]) {
    role = {...listRole[key]};
  }
  return role;
}

export function getDefaultPageSize() {
  //get dataConfig tu redux storage
  let dataConfig = store.getState().Auth.dataConfig ? store.getState().Auth.dataConfig : null;
  //get dataConfig tu local storage
  if (!dataConfig) {
    const dataConfigJson = localStorage.getItem('data_config');
    dataConfig = JSON.parse(dataConfigJson);
  }
  let defaultPageSize = 10;
  if (dataConfig && dataConfig.pageSize && [10, 20, 30, 40].indexOf(parseInt(dataConfig.pageSize)) >= 0) {
    defaultPageSize = parseInt(dataConfig.pageSize);
  }
  return defaultPageSize;
}

export function formatAmount(amount) {
  if (isNaN(amount)) {
    return amount;
  }
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

//format mission Data in Saga ----------------------------------------------------------------------------------
export function formatMissionData(DataApi) {
  const DanhSachTrangThai = DataApi.DanhSachTrangThai ? DataApi.DanhSachTrangThai : [];
  const DanhSachNhiemVu = DataApi.ListNhiemVu ? DataApi.ListNhiemVu : [];
  const data = {};
  DanhSachTrangThai.forEach(TrangThai => {
    const items = [];
    DanhSachNhiemVu.forEach(NhiemVu => {
      if (NhiemVu.TrangThaiID === TrangThai.ID) {
        items.push({
          id: NhiemVu.NhiemVuID,
          title: NhiemVu.TenNhiemVu,
          date: NhiemVu.NgayHetHan ? moment(NhiemVu.NgayHetHan).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY"),
          total_comment: NhiemVu.SoBinhLuan,
          total_file: NhiemVu.SoFileDinhKem,
          work_progress: NhiemVu.SoCongViec ? `${NhiemVu.SoCongViecDaXuLy}/${NhiemVu.SoCongViec}` : "",
          member_list: NhiemVu.DanhSachCanBo.length
            ? NhiemVu.DanhSachCanBo.map(item => ({ID: item.ID, Ten: item.Ten}))
            : NhiemVu.DanhSachCoQuan.map(item => ({ID: item.ID, Ten: item.Ten})),
        });
      }
    });
    data[TrangThai.ID] = {
      name: TrangThai.Ten,
      items
    }
  });
  return data;
}

//format dataCoQuan in Saga ------------------------------------------------------------------------------------
export function formatDMCoQuan(DanhSachCoQuan) {
  return DanhSachCoQuan.map((value1, index1) => {
    //-------1
    let title1 = value1.Ten;
    let key1 = `${index1}`;
    let valueSelect1 = `${value1.ID}`;
    let children1 = null;
    if (value1.Children) {
      children1 = value1.Children.map((value2, index2) => {
        //------2
        let title2 = value2.Ten;
        let key2 = `${index1}-${index2}`;
        let valueSelect2 = `${value2.ID}`;
        let children2 = null;
        if (value2.Children) {
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
}

//format dataCoQuan có hiệu lực
export function formatDMCoQuanCoHieuLuc(DanhSachCoQuan) {
  let ds = DanhSachCoQuan.map((value1, index1) => {
    //-------1
    let title1 = value1.Ten;
    let key1 = `${index1}`;
    let valueSelect1 = `${value1.ID}`;
    let children1 = null;
    if (value1.Children) {
      children1 = value1.Children.map((value2, index2) => {
        //------2
        let title2 = value2.Ten;
        let key2 = `${index1}-${index2}`;
        let valueSelect2 = `${value2.ID}`;
        let children2 = null;
        if (value2.Children) {
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
  ds = ds.filter(item => item.CQCoHieuLuc);
  for (let i = 0; i < ds.length; i++) {
    if (ds[i].children) {
      ds[i].children = ds[i].children.filter(item => item.CQCoHieuLuc);
      for (let j = 0; j < ds[i].children.length; j++) {
        if (ds[i].children[j].children) {
          ds[i].children[j].children = ds[i].children[j].children.filter(item => item.CQCoHieuLuc);
        }
      }
    }
  }
  return ds;
}

export function formatDataCoQuanCanBo(Data) {
  return Data.map((value, index) => {
    //-------1
    let title = value.Name;
    let label = `${value.Name}`;
    let key = `${index}-${value.ID}`;
    let valueSelect = `${value.ID}_${value.Type}`;
    let children = value.Children && value.Children.length > 0 ? renderChildrenCoQuanCanBo(value.Children, index, key) : null;
    return {
      ...value,
      title: title,
      label: label,
      key: key,
      value: valueSelect,
      children: children,
    };
  });
}

function renderChildrenCoQuanCanBo(children, indexRoot, parentKey) {
  return children.map((value, index) => {
    let title = value.Name;
    let label = `${value.Name}`;
    let key = `${parentKey}-${index}-${value.ID}`;
    let valueSelect = `${value.ID}_${value.Type}`;
    let children = value.Children && value.Children.length > 0 ? renderChildrenCoQuanCanBo(value.Children, index, key) : null;
    return {
      ...value,
      title: title,
      label: label,
      key: key,
      value: valueSelect,
      children: children,
    };
  });
}

//format danh mục treeselect
export function formatDataTreeSelect(Data) {
  const renderChildrenTreeSelect = (children, indexRoot, parentKey) => {
    return children.map((value, index) => {
      let title = value.Ten;
      let label = `${value.Ten}`;
      let key = `${parentKey}-${index}-${value.ID}`;
      let valueSelect = `${value.ID}`;
      let children = value.Children && value.Children.length > 0 ? renderChildrenTreeSelect(value.Children, index, key) : null;
      return {
        ...value,
        title: title,
        label: label,
        key: key,
        value: valueSelect,
        children: children,
      };
    });
  };
  return Data.map((value, index) => {
    //-------1
    let title = value.Ten;
    let label = `${value.Ten}`;
    let key = `${index}-${value.ID}`;
    let valueSelect = `${value.ID}`;
    let children = value.Children && value.Children.length > 0 ? renderChildrenTreeSelect(value.Children, index, key) : null;
    return {
      ...value,
      title: title,
      label: label,
      key: key,
      value: valueSelect,
      children: children,
    };
  });
}

//Add File -----------------------------------------------------------------------------------------------------
export function getBase64(file, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(file, reader.result));
  reader.readAsDataURL(file);
}

export function beforeUpload(file) {
  const isLimit = file.size / 1024 / 1024 < fileUploadLimit;
  if (!isLimit) {
    message.error('Dung lượng file ' + file.name + ' đính kèm quá lớn, không thể tải lên');
  }
  return isLimit;
}

export function indexOfObjectInArray(object, array, properties) {
  let indexOf = -1;
  array.forEach((item, index) => {
    if (item[properties] === object[properties]) indexOf = index;
  });
  return indexOf;
}

export function getVaiTro() {
  let user = localStorage.getItem('user');
  user = JSON.parse(user);
  return user.VaiTro;
}

export function getOptionSidebar() {
  let optionsSidebar = [{key: 'QLNhiemVu', label: 'Checkin-out', leftIcon: 'setting', children: []}];
  optionsSidebarRaw.forEach(item => {
    if (item.children && item.children.length) optionsSidebar.push(item);
    else optionsSidebar[0].children.push({key: item.key, label: item.label});
  });
  if (optionsSidebar[0].children.length && optionsSidebar[0].children[1].key === 'nhiem-vu') {
    optionsSidebar[0].children.splice(2, 0, {key: 'nhiem-vu/cong-viec', label: 'Công việc'});
  }
  return optionsSidebar;
}

export function checkIsMobile() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}

export const printComponent = (html) => {
  //xoa iframe cu ------
  let oldIframe = document.querySelectorAll('iframe');
  if (oldIframe && oldIframe.length) {
    oldIframe.forEach(element => {
      element.parentNode.removeChild(element);
    });
  }
  //tao iframe moi -----
  let node = html;
  let iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe); //make document #html in iframe
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(node);
  iframe.contentWindow.document.close();
  iframe.contentWindow.focus();
  iframe.contentWindow.print();
};

export function exportExcel(rawHtml, exportName) {
  let html, link, blob, url;
  let preHtml = `<html><head><meta charset='utf-8'></head><body>`;
  let postHtml = "</body></html>";
  html = preHtml + rawHtml + postHtml;
  blob = new Blob(['\ufeff', html], {
    type: 'application/vnd.ms-excel'
  });
  url = URL.createObjectURL(blob);
  link = document.createElement('A');
  link.href = url;
  link.download = `${exportName}.xls`;  // default name without extension
  document.body.appendChild(link);
  if (navigator.msSaveOrOpenBlob) navigator.msSaveOrOpenBlob(blob, `${exportName}.xls`); // IE10-11
  else link.click();  // other browsers
  document.body.removeChild(link);
}

export const upperFirstLetter = (word) => {
  word = word.trim();
  let text = word.split(' ');
  let res = [];
  for (let i = 0; i < text.length; i++) {
    let text2 = text[i].split('');
    text2[0] = text2[0].toUpperCase();
    text2 = text2.join('');
    res[res.length] = text2;
  }
  return res.join(' ');
};

export const MessageError = (mes) => {
  message.destroy();
  message.error(mes);
};

export const OnBuilding = () => {
  message.destroy();
  message.info('Chức năng đang được hoàn thiện');
};

export const getConfigValueByKey = (listConfig, key, defaultValue) => {
  if (listConfig && listConfig.length) {
    const config = listConfig.find(item => item.ConfigKey === key);
    if (config && config.ConfigValue) {
      return config.ConfigValue;
    }
    return defaultValue;
  }
  return defaultValue;
};

export const getConfigLocal = (properties, defaultValue) => {
  const dataConfig = JSON.parse(localStorage.getItem('data_config'));
  if (dataConfig && dataConfig[properties]) {
    return dataConfig[properties];
  }
  return defaultValue;
};

export const socketConnect = () => {
  return new HubConnectionBuilder()
  // .configureLogging(LogLevel.Debug)
    .withUrl(api.apiSocket, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    })
    .build();
};