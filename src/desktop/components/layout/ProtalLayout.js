import React from 'react';
import styles from './MainLayout.css';
import Header from './ProtalHeaders';
import Footers from './ProtalFooters';
import {domanManagement} from "../../services/home";
import {PICTURE_ADDRESS} from "../../constants";

class ProtalLayout extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    document.getElementsByClassName('substance')[0].style.minHeight = document.body.offsetHeight-346+'px';
    //判断是否切换主题样式、主题Logo以及页脚图片
    var themeCss = document.getElementById("themeCss");
    if (themeCss) {
      if (!localStorage.theme || localStorage.theme.length == 0) {
        //获取域名管理数据 主题
        domanManagement({domainUrl: location.origin.split('://')[1]}).then(data => {
          if (data.success) {
            localStorage.theme = JSON.stringify(data.rows[0] || {});
            //主题样式
            if (JSON.parse(localStorage.theme).colorCode) {
              var themeLink = document.getElementsByTagName('link')[0];
              document.getElementsByTagName('HEAD')[0].removeChild(themeLink);
              themeLink = document.createElement('link');
              themeLink.href = './theme/' + JSON.parse(localStorage.theme).colorCode + '.css';
              themeLink.rel = 'stylesheet';
              themeLink.type = 'text/css';
              document.getElementsByTagName('HEAD')[0].appendChild(themeLink);
              document.getElementsByClassName('ant-spin-container')[0].removeChild(themeCss); 
              document.title = JSON.parse(localStorage.theme).titleName
              document.getElementsByTagName('link')[1].href = PICTURE_ADDRESS + JSON.parse(localStorage.theme).titleImagePath
            }
            //登录页背景以及logo
            /*if (JSON.parse(localStorage.theme).loginBgImagePath) {
             document.getElementsByClassName("imgLogo")[0].src = PICTURE_ADDRESS+JSON.parse(localStorage.theme).companyLogoPath;
             }*/
            //首页Logo
            /*if (JSON.parse(localStorage.theme).companyLogoPath) {
             document.getElementsByClassName("imgLogo")[0].src = PICTURE_ADDRESS+JSON.parse(localStorage.theme).companyLogoPath;
             }*/
            //页脚图片
            /*if (JSON.parse(localStorage.theme).footerImagePath) {
             document.getElementsByClassName("imgLogo")[0].style.backgroundImage = "url("+PICTURE_ADDRESS+JSON.parse(localStorage.theme).companyLogoPath+")";
             }*/
            this.setState({
              theme: data.rows[0] || {}
            });
          }
        });
      } else {
        //主题样式
        if (JSON.parse(localStorage.theme).colorCode) {
          var themeLink = document.getElementsByTagName('link')[0];
          document.getElementsByTagName('HEAD')[0].removeChild(themeLink);
          themeLink = document.createElement('link');
          themeLink.href = './theme/' + JSON.parse(localStorage.theme).colorCode + '.css';
          themeLink.rel = 'stylesheet';
          themeLink.type = 'text/css';
          document.getElementsByTagName('HEAD')[0].appendChild(themeLink);
          document.getElementsByClassName('ant-spin-container')[0].removeChild(themeCss);
          document.title = JSON.parse(localStorage.theme).titleName
          document.getElementsByTagName('link')[1].href = PICTURE_ADDRESS + JSON.parse(localStorage.theme).titleImagePath 
        }
        //登录页背景以及logo
        /*if (JSON.parse(localStorage.theme).loginBgImagePath) {
         document.getElementsByClassName("imgLogo")[0].src = PICTURE_ADDRESS+JSON.parse(localStorage.theme).companyLogoPath;
         }*/
        //首页Logo
        /*if (JSON.parse(localStorage.theme).companyLogoPath) {
         document.getElementsByClassName("imgLogo")[0].src = PICTURE_ADDRESS+JSON.parse(localStorage.theme).companyLogoPath;
         }*/
        //页脚图片
        /*if (JSON.parse(localStorage.theme).footerImagePath) {
         document.getElementsByClassName("imgLogo")[0].style.backgroundImage = "url("+PICTURE_ADDRESS+JSON.parse(localStorage.theme).companyLogoPath+")";
         }*/
      }
    }
  }

  render() {
    return (
      <div className={styles.normal}>
        <Header location={this.props.location} />
        <div className='substance' style={{height:'auto'}}>
          {this.props.children}
        </div>
        <Footers />
      </div>
    );
  }
}
export default (ProtalLayout);
