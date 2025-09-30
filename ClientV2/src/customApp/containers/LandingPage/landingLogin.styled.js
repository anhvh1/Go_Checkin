import styled from 'styled-components';

const mainColor = "#2364C3";

export default styled.div`
  width: 100vw;
  overflow: auto;
  position: relative;
  background: rgba(230, 238, 255, 0.7);
  
  .header-landing {
    background: ${mainColor};
    color: #FFF;
    padding: 10px 15px;
    height: max-content;
    font-weight: bold;
    font-size: 20px;
    text-transform: uppercase;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 999;
  }
  
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .col-login {
    height: 100vh;
    min-height: 600px;
    
    .main-login {
      width: 100%;
      height: inherit;
      flex-direction: column;
      
      .go-title {
        color: ${mainColor};
        font-weight: bold;
        font-size: 40px;
        margin-bottom: 30px;
      }
      
      .login-input {
        width: 70%;
        
        .row {
          margin-bottom: 25px;
          
          .ant-input {
            height: 50px;
            border-radius: 16px;
            font-size: 18px;
          }
          
          button {
            width: 100%;
            height: 50px;
            border-radius: 16px;
            font-size: 18px;
          }
        }
        
        .row-message {
          color: red;
        }
      }
      
      .login-help {
        width: 100%;
        margin-bottom: 10px;
        color: ${mainColor};
        
        .ant-col {
          text-align: center;
        }
        
        .clickable {
          margin-bottom: 5px;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
  
  .col-landing {
    height: 100vh;
    
    .main-landing {
      flex-direction: column;
      height: inherit;
      
      .landing-title {
        color: ${mainColor};
        font-size: 24px;
        text-align: center;
        font-weight: bold;
        margin-bottom: 30px;
        width: 90%;
        
        @media only screen and (max-height: 550px) {
          margin-bottom: 10px;
        }
        
        @media only screen and (max-height: 400px) {
          font-size: 20px;
        }
      }
      
      .qr-example {
        text-align: center;
        position: relative;
        
        .img-qr {
          width: 80%;
          border-radius: 24px;
          
          @media only screen and (max-height: 640px) {
            width: 65%;
          }
          
          @media only screen and (max-height: 550px) {
            width: 50%;
          }
          
          @media only screen and (max-height: 460px) {
            width: 40%;
          }
          
          @media only screen and (max-height: 400px) {
            width: 30%;
          }
        }
        
        .on-img {
          position: absolute;
          top: 40px;
          left: 28%;
          height: 45px;
          font-size: 18px;
          font-weight: bold;
          border-radius: 10px;
          
          @media only screen and (max-height: 650px) {
            font-size: 14px;
          }
        }
      }
    }
  }
  
  .footer-login {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    font-size: 12px;
  }
`;

export const ModalWrapper = styled.div`
  .confirm-info {
    .row {
      margin-bottom: 12px;
      .label {
        font-weight: bold;
      }
      
      .capcha-img {
        width: 60px;
        height: 40px;
      }
    }
    
    .big-row {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 14px;
    }
  }
  
  .reg-success {
    .message-success {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 12px;
    }
    
    .row {
      margin-bottom: 12px;
      .label {
        font-weight: bold;
      }
      
      img {
        width: 150px;
        height: 150px;
        min-width: 150px;
        min-height: 150px;
      }
    }
    
    .center {
      text-align: center;
    }
    
    .big-row {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 12px;
    }
  }
`;