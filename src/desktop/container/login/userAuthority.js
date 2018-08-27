
import { connect } from 'dva';
import {Button} from 'antd';
import * as styles from '../../styles/login.css';
import {domanManagement} from "../../services/home";
import MainLayout from "../../components/layout/MainLayout";
import * as service from '../../services/userAuthority';
import Modals from '../../components/common/modal/Modal';

class userAuthority extends React.Component {
  constructor(props) {
    super(props);
  }
  /**
   * 手机
   *
   * @param {any} flag
   * @memberof Login
   */
  loginPhone(flag){
    Modals.loginProtocol(this.loginProtocol.bind(this));
  }

  /**
   * 协议
   *
   * @param {any} flag
   * @memberof Login
   */
  loginProtocol(flag){
    Modals.loginPassword(this.loginPassword.bind(this));
  }

  /**
   * 修改密码成功
   *
   * @memberof Login
   */
  loginPassword(flag){
    //1、先跳到 主页
    location.hash = '/portal/home';

    Modals.loginEnquire(this.loginEnquire.bind(this));
  }

  //询问框
  loginEnquire(flag){
    if(flag){
      //2、再弹出修改信息
      this.props.dispatch({
        type:'register/visibleSave',
        payload:{modalVisible:true},
      });
    }
  }
  componentWillMount() {
    //判断是否切换主题样式以及登录页背景
    localStorage.theme = JSON.stringify({});
    var themeCss = document.getElementById("themeCss");
    if (themeCss) {
      if (!localStorage.theme || localStorage.theme == '{}') {
        //获取域名管理数据 主题
        domanManagement({domainUrl:location.origin.split('://')[1]}).then(data=>{
          if (data.success) {
            localStorage.theme = JSON.stringify(data.rows[0] || {});
            //主题样式
            if (JSON.parse(localStorage.theme).colorCode) {
              var themeLink = document.getElementsByTagName('link')[0];
              document.getElementsByTagName('HEAD')[0].removeChild(themeLink);
              themeLink = document.createElement('link');
              themeLink.href = './theme/'+JSON.parse(localStorage.theme).colorCode+'.css';
              themeLink.rel = 'stylesheet';
              themeLink.type = 'text/css';
              document.getElementsByTagName('HEAD')[0].appendChild(themeLink);
              document.getElementsByClassName('ant-spin-container')[0].removeChild(themeCss);
              document.title = JSON.parse(localStorage.theme).titleName
              document.getElementsByTagName('link')[1].href = PICTURE_ADDRESS + JSON.parse(localStorage.theme).titleImagePath
            }
            this.setState({
              theme: data.rows[0] || {}
            });
            //登录页背景以及logo
            /*if (JSON.parse(localStorage.theme).loginBgImagePath) {
             document.getElementsByClassName("login_bg")[0].style.backgroundImage = "url("+PICTURE_ADDRESS+JSON.parse(localStorage.theme).loginBgImagePath+")";
             document.getElementsByClassName("imgLogo")[0].src = PICTURE_ADDRESS+JSON.parse(localStorage.theme).companyLogoPath;
             }*/
          }
        });
      } else {
        //主题样式
        if (JSON.parse(localStorage.theme).colorCode) {
          var themeLink = document.getElementsByTagName('link')[0];
          document.getElementsByTagName('HEAD')[0].removeChild(themeLink);
          themeLink = document.createElement('link');
          themeLink.href = './theme/'+JSON.parse(localStorage.theme).colorCode+'.css';
          themeLink.rel = 'stylesheet';
          themeLink.type = 'text/css';
          document.getElementsByTagName('HEAD')[0].appendChild(themeLink);
          document.getElementsByClassName('ant-spin-container')[0].removeChild(themeCss);
          document.title = JSON.parse(localStorage.theme).titleName
          document.getElementsByTagName('link')[1].href = PICTURE_ADDRESS + JSON.parse(localStorage.theme).titleImagePath 
        }
        //登录页背景以及logo
        /*if (JSON.parse(localStorage.theme).loginBgImagePath) {
         document.getElementsByClassName("login_bg")[0].style.backgroundImage = "url("+PICTURE_ADDRESS+JSON.parse(localStorage.theme).loginBgImagePath+")";
         document.getElementsByClassName("imgLogo")[0].src = PICTURE_ADDRESS+JSON.parse(localStorage.theme).companyLogoPath;
         }*/
      }
    }
    let body ={data:this.props.params.data,partnerName:location.host.split('.')[0]}
    service.userAuthority(body).then((data)=>{
      if(data.success){
        var theme = localStorage.theme || JSON.stringify({});
        localStorage.clear();     //先清除先前的缓存
        localStorage.theme = theme;
        localStorage.sessionId = data.sessionId;
        localStorage.message = data.message;
        localStorage.user = JSON.stringify(data.user);
        localStorage.flag = true;

        //用户类型=渠道/行政代办/供应商，登录前端；否则登录后端
        if (data.user.userType === 'CHANNEL' || data.user.userType === 'ADMINISTRATION' || data.user.userType === 'SUPPLIER') {
            if (data && data.access_token) {
              const user = JSON.parse(localStorage.user||'{}');
              localStorage.userName = user.userName;

              if (data.user.status === 'INACTIVE') {
                localStorage.temp_token = data.access_token;
                Modals.loginPhone(this.loginPhone.bind(this));
              } else {
                localStorage.currentTime = new Date().getTime();
                localStorage.access_token = data.access_token;

                //工作台-首页初始化
                var styleMenu = {};
                styleMenu.styleMenuWorkbench = styles.menuChoosed;
                styleMenu.styleMenuDivWorkbench = styles.menuChunked;
                styleMenu.styleMenuProductionLibrary = styles.menuChoose;
                styleMenu.styleMenuFinancial = styles.menuChoose;
                styleMenu.styleMenuDataLibrary = styles.menuChoose;
                styleMenu.styleMenuQaBasic = styles.menuChoose;
                styleMenu.styleMenuDivProductionLibrary = styles.menuChunk;
                styleMenu.styleMenuDivFinancial = styles.menuChunk;
                styleMenu.styleMenuDivDataLibrary = styles.menuChunk;
                styleMenu.styleMenuDivQaBasic = styles.menuChunk;
                localStorage.styleMenu = JSON.stringify(styleMenu);
                location.hash = '/production/list/BX';
              }
            } else {
              var theme = localStorage.theme || JSON.stringify({});
              localStorage.clear();//清除先前的缓存
              localStorage.theme = theme;
              location.hash = '/login';
            }
        } else {
            if (data && data.access_token) {
              const user = JSON.parse(localStorage.user||'{}');
              localStorage.userName = user.userName;

              if (data.user.status === 'INACTIVE') {
                localStorage.temp_token = data.access_token;
                // Modals.loginPhone(this.loginPhone.bind(this));
              } else {
                localStorage.currentTime = new Date().getTime();
                localStorage.access_token = data.access_token;

                //工作台-首页初始化
                var styleMenu = {};
                styleMenu.styleMenuWorkbench = styles.menuChoosed;
                styleMenu.styleMenuDivWorkbench = styles.menuChunked;
                styleMenu.styleMenuProductionLibrary = styles.menuChoose;
                styleMenu.styleMenuFinancial = styles.menuChoose;
                styleMenu.styleMenuDataLibrary = styles.menuChoose;
                styleMenu.styleMenuQaBasic = styles.menuChoose;
                styleMenu.styleMenuDivProductionLibrary = styles.menuChunk;
                styleMenu.styleMenuDivFinancial = styles.menuChunk;
                styleMenu.styleMenuDivDataLibrary = styles.menuChunk;
                styleMenu.styleMenuDivQaBasic = styles.menuChunk;
                localStorage.styleMenu = JSON.stringify(styleMenu);
              }
            } else {
              var theme = localStorage.theme || JSON.stringify({});
              localStorage.clear();     //先清除先前的缓存
              localStorage.theme = theme;
            }
          $("#backpage").html('backpage').html(data.message);
        }
      }else{
        Modals.error({
          content: `${data.message}`,
        });
      }
    })
  }
    render() {
      return (
        <MainLayout>
          <div style={{textAlign:'center'}}>
            {/* <Button size='large'>用户授权</Button> */}
          </div>
        </MainLayout>
      );
    }
}

export default connect()(userAuthority);
