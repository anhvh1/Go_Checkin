import React from "react";
import styled from "styled-components";
import {Icon, Button} from 'antd';
import moment from "moment";

const CardWrapper = styled.div`
  width: 100%;
  border: solid 1px #5449F1;
  display: flex;
  min-height: 75px;
  margin: 10px 0;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  
  &:hover {
    border: solid 2px #5449F1;
  }
  
  .image-div {
    display: flex;
    width: calc(100% / 3); 
    justify-content: center;
    align-items: center;
    
    img {
      width: 100%;
      height: 75%;
      max-height: 60px;
    }
    
    .icon-empty {
      font-size: 36px;
      color: #ccc;
    }
  }
  
  .info-div {
    width: calc(100% * 2 / 3);
    padding: 5px 10px;
    font-size: 14px;
    position: relative;
    
    .info-mathe {
      border: solid 1px #ccc;
      border-radius: 4px;
      width: 50px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      font-weight: normal;
      margin-left: auto;
      order: 2;
    }
    
    .info-giovao {
      
    }
    
    .info-name {
      font-weight: bold;
      display: flex;
    }
  }
  
  .btn-checkout {
    background-color: rgba(96, 80, 244, 0.5);
    color: #fff;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    padding: 0;
    position: absolute;
    right: 5px;
    bottom: 5px;
    text-align: center;
    
    &:hover {
      background-color: #513ff3;
    }
  }
`;

export default props => <CardWrapper onClick={props.onClick}
                                     style={{border: `${props.isPicked ? 'solid 2px #5449F1' : 'solid 1px #5449F1'}`}}>
  <div className='image-div'>
    {props.AnhCMT !== "" ? <img src={props.AnhCMT}/> : <Icon className='icon-empty' type="audit"/>}
  </div>
  <div className='info-div'>
    <div className='info-name'>
      {props.TenCanBo}
      {props.MaThe && props.MaThe !== "" ? <div className='info-mathe'>{props.MaThe}</div> : ""}
    </div>
    <div>Số giấy tờ: {props.SoCMT}</div>
    <div className='info-giovao'>Giờ vào: {moment(props.GioVao).format("DD/MM/YYYY - HH:mm")}</div>
  </div>
  <div className='btn-checkout' onClick={props.onCheckOut}>
    <Icon type={'logout'}/>
  </div>
</CardWrapper>