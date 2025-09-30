import styled from 'styled-components';
import { palette } from 'styled-theme';

const BoxWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px 20px 5px 20px;
  background-color: #ffffff;
  border: 1px solid ${palette('border', 0)};
  margin: 0 0 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);

  &:last-child {
    margin-bottom: 0;
  }

  @media only screen and (max-width: 767px) {
    padding: 20px;
    ${'' /* margin: 0 10px 30px; */};
  }

  &.half {
    width: calc(50% - 34px);
    @media (max-width: 767px) {
      width: 100%;
    }
  }
`;

export { BoxWrapper };
