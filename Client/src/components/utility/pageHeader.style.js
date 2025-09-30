import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '../../settings/withDirection';

const WDComponentTitleWrapper = styled.h1`
  font-size: 19px;
  font-weight: 500;
  color: ${palette('secondary', 2)};
  
  //width: 100%;
  height: 40px;
  padding-left: 20px;
  //background: lightgrey;
  // margin-bottom: 15px;
  display: inline-flex;
  
  align-items: center;
  white-space: nowrap;

  @media only screen and (max-width: 767px) {
    //margin: 0 10px;
    //margin-bottom: 15px;
  }
  i {
    margin-right: 10px;
    color: darkslategrey;
  }
  
  img {
    margin-right: 10px;
    color: darkslategrey;
  }
 
`;

const ComponentTitleWrapper = WithDirection(WDComponentTitleWrapper);
export { ComponentTitleWrapper };
