import React from 'react';
import {DatePicker} from 'antd';

function onOpenDatePickerChange(open, dropdownClassName) {
  setTimeout(() => {
    if (open) {
      const dropdownClassNameObj = document.getElementsByClassName(dropdownClassName)[0];
      if (dropdownClassNameObj) {
        dropdownClassNameObj.getElementsByTagName("input")[0].addEventListener("keydown", (e) => onTextBoxDatePickerKeyUp(e, dropdownClassName));
        dropdownClassNameObj.getElementsByTagName("input")[0].maxLength = 10;
      }
    }
  }, 200);
}

function onTextBoxDatePickerKeyUp(e, dropdownClassName) {
  const inputObj = document.getElementsByClassName(dropdownClassName)[0].getElementsByTagName("input")[0];
  let value = inputObj.value;
  if (value.match(/^\d{2}$/) !== null) {
    if (e.code !== "Backspace") {
      inputObj.value = value + "/";
    }
  } else if (value.match(/^\d{2}\/\d{2}$/) !== null) {
    if (e.code !== "Backspace") {
      const thisYear = new Date().getFullYear();
      inputObj.value = value + "/" + thisYear;
    }
  }
}

class DatePickerFormat extends React.PureComponent {
  render() {
    // const {format, placeholder} = this.props;
    return <DatePicker format={'DD/MM/YYYY'} placeholder={''}
                       onOpenChange={(open) => onOpenDatePickerChange(open, "ant-picker-focused")} {...this.props}/>
  }
}

export default DatePickerFormat;