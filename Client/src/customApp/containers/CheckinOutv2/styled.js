import styled from 'styled-components';

const Wrapper = styled.div`
  .title {
    font-weight: bold;
    font-size: 18px;
  }
  
  .center {
    text-align: center;
  }
  
  .ant-form .ant-form-item {
    margin-bottom: 5px !important;
  }

  .col-container {
    width: 100%;
    display: flex;
    padding: 5px 10px;
    
    .col {
      margin-right: 10px;
    
      &:last-child {
        margin-right: 0;
      }
    }
    
    .col-first {
      // width: 50%;
      
      .box-container {
        overflow: auto;
        max-height: calc(100vh - 180px);
      }
      
      .box {
        box-shadow: rgba(0, 0, 0, 0.35) 0px 2px 2px;
        border-radius: 4px;
        margin-bottom: 10px;
        overflow-y: auto;
        overflow-x: hidden;
      }
      
      .box-relative {
        position: relative;
      }
      
      .div-loading {
        background-color: rgba(255, 255, 255, 0.6);
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 1000;
        
        .spin {
          top: 50%;
          left: 50%;
          position: absolute;
        }
      }
      
      .box-camera {
        box-shadow: none;
        
        .camera-content {
          width: 100%;
          height: 190px;
          border: dotted 4px #ccc;
          border-radius: 8px;
          
          .content {
            height: 140px;
            width: 100%;
            text-align: center;
            padding-top: 5px;
            
            .box-image {
              position: relative;
              
              .close-ico {
                color: #000;
                position: absolute;
                top: 0;
                right: 5px;
              }
            }
          }
          
          .action {
            text-align: center;
            
            button {
              background: #ccc;
              
              &:hover {
                &:not(.ant-btn[disabled]) {
                  border-color: #ccc;
                  color: #000;
                }
              }
            }
          }
        }
      }
      
      .box-info {
        padding: 20px;
      
        .ant-col {
          margin-bottom: 0;
        }
        
        .ant-input[disabled] {
          color: rgba(0, 0, 0, 0.7);
        }
        
        .ant-select-disabled {
          color: rgba(0, 0, 0, 0.7);
        }
      }
    }
    
    .col-second {
      .boxSearch {
        padding: 5px 25px;
        
        input {
          border-radius: 14px;
        }
      }
      
      .card-container {
        padding: 0 15px;
        max-height: calc(100vh - 250px);
        overflow: auto;
      }
    } 
    
    .col-third {
      .box-container {
        padding: 0 15px;
        overflow: auto;
        min-height: 430px;
        max-height: calc(100vh - 230px);
        
        .box-info {
          width: 100%;
          height: 120px;
          box-shadow: rgba(0, 0, 0, 0.35) 0px 2px 2px;
          border-radius: 8px;
          margin-top: 15px;
          position: relative;
          background-size: cover;
          background-position: center;
          
          &:last-child {
            margin-bottom: 15px;
          }
          
          .text-number {
            color: #fff;
            text-align: center;
            font-size: 18px;
            line-height: 50px;
            background: rgba(84, 73, 241, 0.8);
            position: absolute;
            bottom: 0;
            height: 50px;
            width: 100%;
            border-bottom-right-radius: 8px;
            border-bottom-left-radius: 8px;
          }
        }
      }
      
      .div-report {
        margin-top: 20px;
        border-top: solid 1px #ccc;
        
        .flex {
          display: flex;
        }
        
        .main-report {
          // display: flex;
          margin-top: 10px;
          
          .report-label {
            font-weight: bold;
            // width: 30%;
          }
          
          .report-wrapper {
            // width: 70%;
          }
        }
        
        .action-report {
          width: 100%;
          text-align: center;
          margin-top: 15px;
          
          button {
            border-radius: 8px;
          }          
        }
      }
    }   
  }
  
  .div-footer {
    width: 100%;
    position: fixed;
    bottom: 25px;   
    background-color: #e8e8e8;
    padding: 10px 0 20px 0;
    z-index: 999;
    border-top: solid 1px #ccc;
    height: 75px;
      
    .div-action {
      width: 100%;
      text-align: center;
    }
  }
  
  .footer-main {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: black;
    font-size: 12px;
    font-family: generic-family, serif;
    background-color: #fff;
    z-index: 999;
    height: 25px;
    padding-bottom: 5px;
  }
`;

export default Wrapper;