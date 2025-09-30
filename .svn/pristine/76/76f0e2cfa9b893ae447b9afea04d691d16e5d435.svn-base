import styled from 'styled-components';

export default styled.div`
  &.index {
    background: #000;
    position: relative;
    display: flex;
    justify-content: center;
    
    .huong-dan {
      background: #e9e9e9;
      border-radius: 4px;
      text-align: center;
      position: absolute;
      top: 10px;
      z-index: 999;
      padding: 5px;
      font-weight: bold;
      max-width: 90%;
    }
    
    .action {
      position: absolute;
      bottom: 10px;
      text-align: center;
      width: 100%;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
      
      .anticon {
        color: #fff;
        font-size: 50px;
        margin-right: 20px;
        
        &:last-child {
          margin-right: 0;
        }
      }
      
      .ant-btn {
        height: 40px;
      }
    }
    
    .btn-checkin {
      position: absolute;
      bottom: 10px;
      right: 10px;
      z-index: 999;
    }
    
    .camera-container {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
    
      .frame-camera {
        position: absolute;
        border: dotted 6px #fff;
        border-radius: 10px;
        z-index: 999;
        max-width: 90%;
      }
    
      .loading {
        position: absolute;
        z-index: 999;
        background: #ccc;
        color: #fff;
        width: 90%;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 22px;
        font-weight: bold;
        text-transform: uppercase;
        border-radius: 8px;
        text-align: center;
      }
    }
  }

  &.modal {
    .row {
      display: flex;
      align-items: center;
      margin-bottom: 14px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        width: 30%;
        font-weight: bold;
        margin-right: 10px;
      }
      
      .required {
        &:after {
          content: ' *';
          color: red;
        }
      }
      
      .input {
        width: 70%;
        
        .ant-select {
          width: 100%;
        }
        
        .ant-select-disabled {
          color: rgba(0, 0, 0, 0.8);
        }
      }
    }
  }
  
  &.checkin-success {
    .title {
      text-transform: uppercase;
      color: #096dd9;
      font-size: 18px;
      font-weight: bold;
    }
    
    .row {
      margin-bottom: 12px;
      
      img {
        width: 250px;
        height: 250px;
        min-width: 250px;
        min-height: 250px;
      }
    }
    
    .center {
      text-align: center;
    }
  }
  
  &.footer-modal {
    .ant-btn-primary[disabled] {
      color: rgba(0, 0, 0, 0.8);
    }
  }
`;