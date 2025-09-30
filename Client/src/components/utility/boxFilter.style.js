import styled from 'styled-components';

import WithDirection from '../../settings/withDirection';

const WDComponentDivFilter = styled.div`
  padding-bottom: 20px;
  .ant-select-search, .ant-select {
    margin-right: 10px;
  }
`;

const ComponentDivFilter = WithDirection(WDComponentDivFilter);
export { ComponentDivFilter };