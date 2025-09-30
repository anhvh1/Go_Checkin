import React from "react";
import {TimePicker} from "antd";

function onOpenTimePickerChange(open, dropdownClassName) {
  setTimeout(() => {
    if (open) {
      const dropdownClassNameObj = document.getElementsByClassName(dropdownClassName)[0];
      if (dropdownClassNameObj) {
        dropdownClassNameObj.getElementsByTagName("input")[0].addEventListener("keydown", (e) => onTextBoxTimePickerKeyUp(e, dropdownClassName));
        dropdownClassNameObj.getElementsByTagName("input")[0].maxLength = 5;
      }
    }
  }, 200);
}

function onTextBoxTimePickerKeyUp(e, dropdownClassName) {
  const inputObj = document.getElementsByClassName(dropdownClassName)[0].getElementsByTagName("input")[0];
  let value = inputObj.value;
  if (value.match(/^\d{2}$/) !== null) {
    if (e.code !== "Backspace") {
      inputObj.value = value + ":";
    }
  }
}

class TimePickerFormat extends React.PureComponent {
  render() {
    return <TimePicker {...this.props} className={"dropdownTimePickerDiv"}
                       placeholder={this.props.placeholder ? this.props.placeholder : ''}
                       onOpenChange={(open) => onOpenTimePickerChange(open, "ant-picker-focused")}
                       format={this.props.format ? this.props.format : "HH:mm"}/>;
  }
}

export default TimePickerFormat;
