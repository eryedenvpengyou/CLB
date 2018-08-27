import styles from './MainLayout.css';
import { Layout, Spin } from 'antd';
import MainHeaders from "./MainHeaders";
import {domanManagement} from "../../services/home";
import {PICTURE_ADDRESS} from "../../constants";
import loginBg from "../../styles/images/loginbg.png";

const {  Footer } = Layout;
class MainLayout extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      theme: {}
    };
  }
  componentWillMount() {
    //判断是否切换主题样式以及登录页背景
    //localStorage.theme = JSON.stringify({});
    var themeCss = document.getElementById("themeCss");
    if (themeCss) {
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
            document.getElementsByTagName('link')[1].href = PICTURE_ADDRESS+JSON.parse(localStorage.theme).titleImagePath
          }
          this.setState({
            theme: data.rows[0] || {}
          });
          if(localStorage.theme&&JSON.parse(localStorage.theme).copyright){
            var text = JSON.parse(localStorage.theme).copyright;
            text = text.replace(/\n/g, '<br>');
            document.getElementById('text').innerHTML = text;
          }
        }
      });
    }else{
      document.title = JSON.parse(localStorage.theme).titleName
      document.getElementsByTagName('link')[1].href = PICTURE_ADDRESS+JSON.parse(localStorage.theme).titleImagePath
    }
  }
  componentDidMount(){
    if(localStorage.theme&&JSON.parse(localStorage.theme).copyright){
      var text = JSON.parse(localStorage.theme).copyright;
      text = text.replace(/\n/g, '<br>');
      document.getElementById('text').innerHTML = text;
    }
  }
  render(){
    return (
      <div className={styles.normal}>
        <MainHeaders location={location} title={this.props.title || ''}/>
        <Spin spinning={false}>
          <div className={styles.content}>
            <div className={styles.main}>
              {this.props.children}
            </div>
          </div>
        </Spin>

        <Footer style={{ marginTop:'15px',textAlign: 'center' ,clear:'both'}}>
          <div style={{fontSize:'14px',fontFamily:'Microsoft YaHei',textAlign: 'center'}} id="text">
            {/* <a className={styles.footer} href="#" rel="nofollow" >联系我们</a>|<a  className={styles.footer} href="#" rel="nofollow"  >加入我们</a>|<a  className={styles.footer} href="#" rel="nofollow"  >免责申明</a>|<a  className={styles.footer} href="#" rel="nofollow"  >意见反馈</a>|<a  className={styles.footer} href="#" rel="nofollow"  >友情链接</a><br />
            <div style={{margin:'15px' }} ><font>Copyright &copy; </font><span>{new Date().getFullYear()}</span> <font>FORTUNE FEDERATION . All Rights Reserved </font></div> */}
           {localStorage.theme&&JSON.parse(localStorage.theme).copyright?JSON.parse(localStorage.theme).copyright:''}
          </div>
        </Footer>
      </div>
    );
  }
}

export default MainLayout;
