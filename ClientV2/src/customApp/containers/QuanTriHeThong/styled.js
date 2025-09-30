import styled from 'styled-components';

export default styled.div`
  &.modal {
    input {
      &::placeholder {
        color: rgba(0, 0, 0, 0.5);
      }
    }
    
    .ant-select-selection__placeholder {
      color: rgba(0, 0, 0, 0.5);
    }  
  }
  
  &.index {
    width: 100%;
    
    .action-btn {
      color: #096dd9;
    }
    
    .qr-container {
      display: flex;
      justify-content: space-around;
      
      .qr-img {
        width: 80px;
        height: 80px;
      }
      
      .qr-action {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        
        .qr-download {
          color: #096dd9;
        }
        
        .qr-printer {
          color: #ea3146;
        }
        
        .anticon {
          font-size: 26px;
        }
      }
    }
    
    .tk-container {
      display: flex;
      justify-content: space-between;
      
      .tk-action {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        
        .anticon {
          font-size: 26px;
          color: #096dd9;
          margin-bottom: 15px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    
    .row-content {
      width: calc(100vw - 135px);
      
      .col-qr {
        padding: 10px;
      
        .qr-container {
          width: 100%;
          display: block;
          text-align: center;
        
          .img-qr {
            width: 200px;
            height: 200px;
          }
          
          .action-qr {
            margin-top: 10px;
            display: flex;
            justify-content: space-around;
            align-items: center;
          }
        }
      }
      
      .col-table {
        margin-bottom: 10px;
      }
    }
  }
`;