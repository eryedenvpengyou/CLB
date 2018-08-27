import React, { Component } from 'react';
import { Row, Col } from 'antd';
import styles from './ProtalFooters.css'
import img8 from '../../styles/images/homePage/img8.png';
import img9 from '../../styles/images/homePage/img9.png';
import icon11 from '../../styles/images/homePage/icon11.png';
import icon12 from '../../styles/images/homePage/icon12.png';
import icon13 from '../../styles/images/homePage/icon13.png';
import icon14 from '../../styles/images/homePage/icon14.png';
import logo from '../../styles/images/homePage/logo.png';
import {PICTURE_ADDRESS} from "../../constants";

function ProtalFooters({ location }){
  var imgLogo = localStorage.theme&&JSON.parse(localStorage.theme).footerImagePath?PICTURE_ADDRESS+JSON.parse(localStorage.theme).footerImagePath:logo;
  return (
    <div className={styles.footer_bg} style={{backgroundImage:'url('+imgLogo+')'}}>
      {/*  className={styles.footerInfo} */}
        {/* <ul>
          <li><img src={icon12} /><span>客服热线：0755 - 22933374     00852-38959800</span></li>
          <li><img src={icon13} /><span>公司地址：  香港尖沙咀海港城永明金融大厦703-4</span></li>
          <li><img src={icon14} /><span>加盟合作：BD@ff-ftc.hk</span></li>
          <li><img src={icon11} /><span>招聘邮箱：HR@ff-ftc.hk</span></li>
          <li style={{color:'#9f9f9f'}}>财联邦科技有限公司2017版权所有  粤ICP备14099949号</li>
          <li  style={{ right: '0px',position:'absolute',top:'0' }}>
            <img src={img9} />
            <p>客户微信服务号</p>
          </li>
          <li  style={{ right: '230px', position:'absolute',top:'0' }}>
            <img src={img8} />  
            <p>理财师微信服务号</p>
          </li>
        </ul> */}
    </div>
  );
}

export default ProtalFooters;
