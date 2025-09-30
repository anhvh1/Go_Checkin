import React from 'react';
import {Select} from 'antd';
import {getScrollParent} from '../../helpers/utility';
import {AntSelect, AntSelectOption} from './styles/select.style';

const Selects = AntSelect(Select);

class CustomerSelect extends React.PureComponent {
  render() {
    const props = this.props.noGetPopupContainer ? {...this.props} : {
      getPopupContainer: (e) => this.props.getPopupContainer ? this.props.getPopupContainer : getScrollParent(e),
      ...this.props
    };
    return <Selects
      {...props}
      notFoundContent={props.notFoundContent ? props.notFoundContent : "Không có dữ liệu"}
      showSearch={props.showSearch !== undefined ? props.showSearch : true}
      optionFilterProp={props.optionFilterProp !== undefined ? props.optionFilterProp : "children"}
      dropdownStyle={{
        maxHeight: 400,
        width: 'auto',
        overflow: 'auto',
        ...this.props.dropdownStyle
      }}
    />
  }
}

const OptionSelect = AntSelectOption(Select.Option);
const Option = AntSelectOption(Select.Option);
const OptGroup = Select.OptGroup;

export default CustomerSelect;
export {Option, OptionSelect, OptGroup};