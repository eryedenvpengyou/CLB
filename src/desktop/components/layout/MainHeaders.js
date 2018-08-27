import React from 'react';
import {Col} from 'antd';
import logo from '../../styles/images/homePage/logo.png';
import {PICTURE_ADDRESS} from "../../constants";

function MainHeaders({ location , title}){
  var imgLogo = localStorage.theme&&JSON.parse(localStorage.theme).companyLogoPath?PICTURE_ADDRESS+JSON.parse(localStorage.theme).companyLogoPath:logo;
  var search = localStorage.theme&&JSON.parse(localStorage.theme).companyWebsite ? 'http://'+JSON.parse(localStorage.theme).companyWebsite : '/#/';
  return (
    <div>
      <div style={{paddingTop:'1%',paddingBottom:'1%',width:'1200px',margin:'0 auto',height:'90px'}}>
        <Col >
          <img className="imgLogo" src={imgLogo} alt="财联邦" style={{cursor:'pointer',width:'256px',height:'53px'}} onClick={()=>window.location.href = search}/>
          {/* <span className="logoText" style={{color:' #d1b97f', fontSize: '26px',verticalAlign: 'middle',marginLeft: '10px'}}>财联邦</span> */}
          <span className="loginText" style={{cursor:'pointer',fontSize:'23px',color:'#d1b97f',float:'right',marginTop:'2%',}} rel="noopener noreferrer">
           {title}
          </span>
        </Col>
      </div>
    </div>
  );
}

export default MainHeaders;
