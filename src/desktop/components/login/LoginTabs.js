import React from 'react';
import {Tabs, Col} from 'antd';
import * as styles from '../../styles/login.css';
import AFPLogin from "./AFPLogin";
import AdministrationLogin from "./AdministrationLogin";
import {domanManagement} from "../../services/home";
import {PICTURE_ADDRESS} from "../../constants";
import loginBg from "../../styles/images/loginbg.png";

const TabPane = Tabs.TabPane;

class LoginTabs extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userType:"CHANNEL",
    };
  }

  componentDidMount() {
    //判断是否切换主题样式以及登录页背景
    var themeCss = document.getElementById("themeCss");
    if (themeCss) {
      if (localStorage.length == 0 || !localStorage.theme || localStorage.theme.length == 0) { 
        //获取域名管理数据 主题
        domanManagement({domainUrl:location.origin.split('://')[1]}).then(data=>{
          if (data.success) {
            localStorage.theme = JSON.stringify(data.rows[0] || {});

            //登录页背景以及logo
            if (JSON.parse(localStorage.theme).loginBgImagePath) {
             document.getElementsByClassName("login_bg")[0].style.backgroundImage = "url("+PICTURE_ADDRESS+JSON.parse(localStorage.theme).loginBgImagePath+")";
             //document.getElementsByClassName("imgLogo")[0].src = PICTURE_ADDRESS+JSON.parse(localStorage.theme).companyLogoPath;
             }
          }
        });
      }else {
        //登录页背景以及logo
        if (JSON.parse(localStorage.theme).loginBgImagePath) {
         document.getElementsByClassName("login_bg")[0].style.backgroundImage = "url("+PICTURE_ADDRESS+JSON.parse(localStorage.theme).loginBgImagePath+")";
        // document.getElementsByClassName("imgLogo")[0].src = PICTURE_ADDRESS+JSON.parse(localStorage.theme).companyLogoPath;
         }
      }
    }
  }
  render() {
    var imgLogin = localStorage.theme&&JSON.parse(localStorage.theme).loginBgImagePath?PICTURE_ADDRESS+JSON.parse(localStorage.theme).loginBgImagePath:loginBg;
    return (
      <div className={"login_bg "+styles.bg} style={{backgroundImage:'url('+imgLogin+')'}}>
        <div className={styles.login_sty}>
          <div className={styles.login_modal_sty} >
            {/*<div><h2 style={{fontSize:'20px',textAlign:'center',marginTop:'0px',marginBottom:'13px'}}>登录</h2></div>*/}
            {/* <AFPLogin dispatch={this.props.dispatch} userType={this.state.userType} /> */}
            <Tabs defaultActiveKey="1" 
            style={{width:'300px'}} className={styles.logintabs}>
              <TabPane tab="密码登录" key="1" >
                <AFPLogin dispatch={this.props.dispatch} userType={this.state.userType} />
              </TabPane>
              <TabPane tab="手机登录" key="2" >
                <AdministrationLogin dispatch={this.props.dispatch} userType={this.state.userType}/>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginTabs;
