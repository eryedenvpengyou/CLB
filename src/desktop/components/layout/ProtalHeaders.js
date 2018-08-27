/*
 * show 工作台-模板头
 * @author:Rex.Hua
 * @version:20170616
 */
import React from 'react';
import { connect } from 'dva';
import styles from './ProtalLayout.css';
import { Menu, Row, Col, Icon ,Switch } from 'antd';
import logo from '../../styles/images/homePage/logo.png';
import {zh_tran} from '../common/transferLanguage';
import { Link } from 'dva/router';
import {PICTURE_ADDRESS} from "../../constants";

const menuWorkbench = "workbench";
const menuProductionLibrary = "productionLibrary";
const menuFinancial = "financial";
const menuDataLibrary = "dataLibrary";
const menuQaBasic = "qaBasic";


class ProtalHeaders extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      styleMenu:{
        "styleMenuWorkbench":styles.menuChoose,
        "styleMenuProductionLibrary":styles.menuChoose,
        "styleMenuFinancial":styles.menuChoose,
        "styleMenuDataLibrary":styles.menuChoose,
        "styleMenuQaBasic":styles.menuChoose,
        "styleMenuDivWorkbench":styles.menuChunk,
        "styleMenuDivProductionLibrary":styles.menuChunk,
        "styleMenuDivFinancial":styles.menuChunk,
        "styleMenuDivDataLibrary":styles.menuChunk,
        "styleMenuDivQaBasic":styles.menuChunk
      },
      currentLang:"N",
      channelName:213
    }
  }
  // 页面加载前执行
  componentWillMount() {
    if(localStorage.flag){
      if(JSON.parse(localStorage.flag) == true){
        this.handleMenuChange(menuProductionLibrary);
        localStorage.flag = false;
      }
    }else{
      this.handleMenuChange();
    }
  }
  // 页面加载后执行
  componentDidMount(){
    this.handleLangChange();
    var t=setTimeout(()=>this.handleLangChange(),1);
    var t=setTimeout(()=>this.handleLangChange(),100);
    var t=setTimeout(()=>this.handleLangChange(),500);
    var t=setTimeout(()=>this.handleLangChange(),1000);
    var t=setTimeout(()=>this.handleLangChange(),3000);
    var t=setTimeout(()=>this.handleLangChange(),5000);
  }

  // 切换语言（简体/繁体）
  handleLangChange(e) {
    var check = "N";
    if (e == true) {
      check = "Y";
    } else if(e==null&&localStorage.currentLang!=null) {
      check = localStorage.currentLang;
    }

    this.state.currentLang = check;
    localStorage.currentLang = check;
    if (this.state.currentLang=="Y") {
      zh_tran('t');
    } else{
      zh_tran('s');
    }
  }
  // 切换目录
  handleMenuChange(e) {
    if(e==null & localStorage.styleMenu != null){
      this.state.styleMenu =  JSON.parse(localStorage.styleMenu);
    }else{
      this.state.styleMenu.styleMenuWorkbench = styles.menuChoose;
      this.state.styleMenu.styleMenuProductionLibrary = styles.menuChoose;
      this.state.styleMenu.styleMenuFinancial = styles.menuChoose;
      this.state.styleMenu.styleMenuDataLibrary = styles.menuChoose;
      this.state.styleMenu.styleMenuQaBasic = styles.menuChoose;
      this.state.styleMenu.styleMenuDivWorkbench = styles.menuChunk;
      this.state.styleMenu.styleMenuDivProductionLibrary = styles.menuChunk;
      this.state.styleMenu.styleMenuDivFinancial = styles.menuChunk;
      this.state.styleMenu.styleMenuDivDataLibrary = styles.menuChunk;
      this.state.styleMenu.styleMenuDivQaBasic = styles.menuChunk;
    }
    if(e==menuWorkbench){
      location.hash = "/portal/home";
      this.state.styleMenu.styleMenuWorkbench = styles.menuChoosed;
      this.state.styleMenu.styleMenuDivWorkbench = styles.menuChunked;
    }else if (e==menuProductionLibrary) {
      location.hash = "/production/list/BX";
      this.state.styleMenu.styleMenuProductionLibrary = styles.menuChoosed;
      this.state.styleMenu.styleMenuDivProductionLibrary = styles.menuChunked;
    }else if (e==menuFinancial) {
      location.hash = "/classroom/course";
      this.state.styleMenu.styleMenuFinancial = styles.menuChoosed;
      this.state.styleMenu.styleMenuDivFinancial = styles.menuChunked;
    }else if (e==menuDataLibrary) {
      location.hash = "/database";
      this.state.styleMenu.styleMenuDataLibrary = styles.menuChoosed;
      this.state.styleMenu.styleMenuDivDataLibrary = styles.menuChunked;
    }else if (e==menuQaBasic) {
      location.hash = "/qaBasic";
      this.state.styleMenu.styleMenuQaBasic = styles.menuChoosed;
      this.state.styleMenu.styleMenuDivQaBasic = styles.menuChunked;
    }

    localStorage.styleMenu = JSON.stringify(this.state.styleMenu);
  }

  logout(){
    location.hash = '/login';
    var theme = localStorage.theme || JSON.stringify({});
    localStorage.clear();//先清除先前的缓存
    localStorage.theme = theme;
  }
  query(){
    var search = JSON.parse(localStorage.theme).companyWebsite?'http://'+JSON.parse(localStorage.theme).companyWebsite:'/#/';
    window.location.href=search;
  }
  toPersonal () {
    location.hash = '/channel/personal';
    if (~location.hash.indexOf('/channel/personal')) {
      location.reload()
    }
  }
  render() {
    //类型转换
    var lang = false;
    if(localStorage.currentLang=="Y"){
      lang = true;
    }
    var imgLogo = localStorage.theme&&JSON.parse(localStorage.theme).companyLogoPath?PICTURE_ADDRESS+JSON.parse(localStorage.theme).companyLogoPath:logo;
    var companyName = localStorage.theme&&JSON.parse(localStorage.theme).companyName?JSON.parse(localStorage.theme).companyName:'财联邦-全球金融服务平台';
    return (
      <div>
        {/* 顶头条 */}
        <Row className={styles.headerTop}>
          <div className={styles.headerTopContent}>
            <Col >
              <span className={styles.headerTopLeft}>
                &nbsp;&nbsp;&nbsp;&nbsp;{companyName}
              </span>
            </Col>
            <Col>
              <Switch key="lang" className={styles.headerTopSwitch} defaultChecked={lang} onChange={this.handleLangChange.bind(this)} checkedChildren={'简'} unCheckedChildren={'繁'} />
              <a className={styles.headerTop20} href="javascript:;" onClick={this.logout.bind(this)}>
                <span style={{color: 'white'}}>
                  登出
                </span>
              </a>
              <span className={styles.headerTop20}  style={{marginLeft:'10px',cursor:'pointer'}} onClick={this.toPersonal.bind(this)}>
                {localStorage.userName}
              </span>
              {/* <span className={styles.headerTop15}>
                <Icon type="phone" /> 客服热线：400-000-0000（工作日9:00-22:00）
              </span>*/}
            </Col>
          </div>
        </Row>
        {/* 菜单栏 */}
        <Row className={styles.heightMenu}>
          <div className={styles.heightMenuContent}>
            <Col>
              <img className={"imgLogo "+styles.heightMenuImg} style={{cursor:'pointer',width:'256px',height:'53px'}} src={imgLogo} alt="财联邦" onClick={this.handleMenuChange.bind(this,menuWorkbench)}/>
              {/* <span className="logoText" style={{color:'#d1b97f', fontSize: '26px',verticalAlign: 'text-top',marginLeft: '10px'}}>财联邦</span> */}
              <Menu
                style={{float:'right',borderBottom:'1px solid #E0E0E0',lineHeight: '22px',height: '90px'}}
                selectedKeys={[location.pathname]}
                mode="horizontal"
              >
                <Menu.Item key="workbench" className={this.state.styleMenu.styleMenuWorkbench}>
                  <a href="javascript:;" rel="noopener noreferrer" onClick={this.handleMenuChange.bind(this,menuWorkbench)}>
                    <div className={this.state.styleMenu.styleMenuDivWorkbench}>
                      <Row className={styles.heightMenuUpSide}>
                        工作台
                      </Row>
                      <Row className={styles.heightMenuDownSide}>
                        Workbench
                      </Row>
                    </div>
                  </a>
                </Menu.Item>
                <Menu.Item key={menuProductionLibrary} className={this.state.styleMenu.styleMenuProductionLibrary}>
                  <a href="javascript:;" rel="noopener noreferrer" onClick={this.handleMenuChange.bind(this,menuProductionLibrary)}>
                    <div className={this.state.styleMenu.styleMenuDivProductionLibrary}>
                      <Row className={styles.heightMenuUpSide}>
                        产品库
                      </Row>
                      <Row className={styles.heightMenuDownSide}>
                        Product library
                      </Row>
                    </div>
                  </a>
                </Menu.Item>
                {
                  JSON.parse(localStorage.user).userType == "ADMINISTRATION" ? ""
                  :
                  <Menu.Item key={menuFinancial} className={this.state.styleMenu.styleMenuFinancial}>
                    <a href="javascript:;" rel="noopener noreferrer" onClick={this.handleMenuChange.bind(this,menuFinancial)}>
                      <div className={this.state.styleMenu.styleMenuDivFinancial} >
                        <Row className={styles.heightMenuUpSide}>
                          财课堂
                        </Row>
                        <Row className={styles.heightMenuDownSide}>
                          Classroom
                        </Row>
                      </div>
                    </a>
                  </Menu.Item>
                }
                <Menu.Item key={menuDataLibrary} className={this.state.styleMenu.styleMenuDataLibrary}>
                  <a href="javascript:;" rel="noopener noreferrer" onClick={this.handleMenuChange.bind(this,menuDataLibrary)}>
                    <div className={this.state.styleMenu.styleMenuDivDataLibrary}>
                      <Row className={styles.heightMenuUpSide}>
                        资料库
                      </Row>
                      <Row className={styles.heightMenuDownSide}>
                        Database
                      </Row>
                    </div>
                  </a>
                </Menu.Item>
                <Menu.Item key={menuQaBasic} className={this.state.styleMenu.styleMenuQaBasic}>
                  <a href="javascript:;" rel="noopener noreferrer" onClick={this.handleMenuChange.bind(this,menuQaBasic)}>
                    <div className={this.state.styleMenu.styleMenuDivQaBasic}>
                      <Row className={styles.heightMenuUpSide}>
                        常见问题
                      </Row>
                      <Row className={styles.heightMenuDownSide}>
                        Questions
                      </Row>
                    </div>
                  </a>
                </Menu.Item>
              </Menu>
            </Col>
          </div>
        </Row>
      </div>
    );
  }
}
export default connect()(ProtalHeaders);
