import styled from "styled-components";

const LayoutContentWrapper = styled.div`
  padding: 15px 20px 5px 20px;
  display: flex;
  flex-flow: row wrap;
  overflow-y: hidden;
  
  @media only screen and (max-width: 767px) {
    padding: 15px 20px;
  }
  
  .action-btn {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    
    .anticon {
      margin-right: 10px;
      font-size: 26px;
      
      &:last-child {
        margin-right: 0;
      }
    }
    
    .ant-switch {
      border-radius: 10px;
    }
    
    a {
      color: inherit !important;
      margin-right: 10px;
    }
  }
`;

export {LayoutContentWrapper};
