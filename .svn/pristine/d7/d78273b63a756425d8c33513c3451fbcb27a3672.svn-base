import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '../../settings/withDirection';

const WDComponentTitleWrapper = styled.h1`
  font-size: 19px;
  font-weight: 500;
  color: ${palette('secondary', 2)};
  margin-bottom: 15px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  text-transform: uppercase;

  &:before {
    content: '';
    width: 5px;
    height: 40px;
    background-color: ${palette('secondary', 3)};
    display: flex;
    margin: 0 15px 0 0;
  }
`;

const ComponentTitleWrapper = WithDirection(WDComponentTitleWrapper);
export { ComponentTitleWrapper };
