import styled from 'styled-components';

const Wrapper = styled.div`
  .title {
    text-align: center;
    width: 100%;
    margin-bottom: 10px;
  }
  
  .weight {
    font-weight: bold;
  }
  
  .queue-container {
    .queue-item {
      display: flex;
      justify-items: center;
      padding: 10px;
      border-bottom: solid 1px #ccc;
      
      &:hover {
        cursor: pointer;
        color: #fff;
        background: #8cc8ff;
      }
      
      .action {
        margin-left: auto;
        
        .anticon {
          &:hover {
            color: red;
          }
        }
      }
    }
  }
`;

export default Wrapper;