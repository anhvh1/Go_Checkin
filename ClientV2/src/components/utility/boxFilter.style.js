import styled from "styled-components";

import WithDirection from "../../settings/withDirection";

const WDComponentDivFilter = styled.div`
  padding-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  /* .ant-select-search, .ant-select, .ant-calendar-picker {
    margin-right: 10px;
    
    &.ant-calendar-picker {
      margin-left: 5px;
    }
    
    &:last-child {
      margin-right: 0;
    }
  } */
`;

const ComponentDivFilter = WithDirection(WDComponentDivFilter);
export { ComponentDivFilter };
