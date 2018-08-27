/**
 * created by luozhuyan at 2017/8/1
 *
 * 理财师登录
 */

import React  from 'react';
import { Form, Icon, Input,Row,Col, Button, Tooltip } from 'antd';
import * as service from '../../services/login';
import * as styles from '../../styles/login.css';
import Modals from '../common/modal/Modal';
import isFunction from 'lodash/isFunction';
import publicStyles from '../../styles/public/publicColor.less';
import $ from 'jquery';

const FormItem = Form.Item;

class AFPLogin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      code:'',
      error:'',
    };
  }

  componentDidMount() {
    this.changeCode();
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


  /**
   * 点击登录按钮执行的函数
   */
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params ={
          client_id: 'client2',
          client_secret: 'secret',
          grant_type: 'password',
          username: this.props.form.getFieldValue('username'),
          password: this.props.form.getFieldValue('password'),
        };
        const body ={
          userName: this.props.form.getFieldValue('username'),
          password: this.props.form.getFieldValue('password'),
          attribute1: "back",
        };

        service.loginFirst(body).then((data1) => {
          if (data1.success) {
            var theme = localStorage.theme || JSON.stringify({});
            localStorage.clear();     //先清除先前的缓存
            localStorage.theme = theme;
            localStorage.sessionId = data1.sessionId;
            localStorage.message = data1.message;
            localStorage.user = JSON.stringify(data1.user);
            localStorage.channelName = data1.channelName;

            //用户类型=渠道/行政代办/供应商，登录前端；否则登录后端
            if (data1.user.userType === 'CHANNEL' || data1.user.userType === 'ADMINISTRATION' || data1.user.userType === 'SUPPLIER') {
              service.login(params).then((data) => {
                if (data && data.access_token) {
                  const user = JSON.parse(localStorage.user||'{}');
                  localStorage.userName = user.userName;

                  if (user.status === 'INACTIVE') {
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
                    location.hash = '/portal/home';
                  }
                } else {
                  localStorage.clear();//清除先前的缓存
                  location.hash = '/login';
                }
              });
            } else {
              service.login(params).then((data) => {
                if (data && data.access_token) {
                  const user = JSON.parse(localStorage.user||'{}');
                  localStorage.userName = user.userName;

                  if (user.status === 'INACTIVE') {
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
                  localStorage.clear();//清除先前的缓存
                }
              });
              $("#backpage").html('backpage').html(data1.message);
            }
          } else {
            this.setState({error:data1.message});
            return;
          }
        }).catch(error => {
          this.changeCode();
          Modals.error({content: '服务器或网络异常，请稍后尝试',});
          return;
        });
      } else {
        this.changeCode();
        this.setState({error: ''});
        return;
        // Modals.error({content: '请填写正确的登录信息',});
      }
    });
  }

  //生成验证码
  changeCode(){
    // 验证码组成库
    let arrays=new Array(
      '2','3','4','5','6','7','8',
      'a','b','c','d','e','f','h','i','j',
      'k','m','n','p','q','r','s','t',
      'u','v','w','x','y','z',
      'A','B','C','D','E','F','G','H','J',
      'K','L','M','N','P','Q','R','S','T',
      'U','V','W','X','Y','Z'
    );
    // 重新初始化验证码
    let code ='';
    // 随机从数组中获取四个元素组成验证码
    for(var i = 0; i<4; i++){
      // 随机获取一个数组的下标
      let r = parseInt(Math.random()*arrays.length);
      code += arrays[r];
    }
    this.setState({code:code});
  }

  //获取焦点的时候清除错误信息
  clear(){
    this.setState({error:''});
  }

  //验证输入的验证码和生成的是否一致
  codeConfirm = (rule, value, callback) => {
    let code = this.state.code;
    if (value && (value+'').toLowerCase() !== code.toLowerCase()) {
      if(isFunction(callback)){
        callback('验证码不正确');
        this.changeCode();
      }
    } else if(isFunction(callback)){
        callback();
      }
  }




  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className={styles.form_sty}>
        <FormItem style={{height:'80px',width:'280px',marginTop:'20px'}} >
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: '18px' }} />} size="large" placeholder="用户名" className={publicStyles['ant-input']}/>
          )}
        </FormItem>
        <FormItem style={{height:'80px',width:'280px'}} >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 18 }} />} size="large" type="password" placeholder="密码" />
          )}
        </FormItem>

        <FormItem style={{height:'80px',width:'280px'}} >
          <Row gutter={24}>
            <Col span={14}>
              {getFieldDecorator('verificationCode', {
                validateTrigger: 'onBlur',
                rules: [{
                  required: true, message: '请输入图片码' },{
                  validator: this.codeConfirm,
                }],
              })(
                <Input prefix={<Icon type="safety" style={{ fontSize: 18 }} />} size="large" style={{height:'40px',marginRight: 0}} onFocus={this.clear.bind(this)} placeholder="图片码"/>
              )}
            </Col>
            <Col span={6} style={{paddingLeft: 0,paddingTop: '1%'}}>
              <span style={{height:'40px',marginTop:'1%'}} id="code" className={styles.code}>{this.state.code}</span>
            </Col>
            <Col span={1} style={{paddingLeft: 0,paddingTop: '1%'}}>
            </Col>
            <Col span={3} style={{paddingLeft: '10px',paddingTop: '1%'}}>
              <Tooltip title="看不清，点击换一张">
                <Icon style={{cursor:'pointer',color: '#DEDEDE',fontSize:'16px'}} type="sync" onClick={this.changeCode.bind(this)}/>
              </Tooltip>
            </Col>
          </Row>
          {
            this.state.error !== '' &&
            <Row>
              <Col span={24}>
                <div style={{color:'#f04134',height:18,marginBottom:5}}>{this.state.error}</div>
              </Col>
            </Row>
          }
        </FormItem>


        <FormItem style={{width:'280px'}}>
          <Button htmlType="submit" type='default' style={{height:'40px',width:'100%',paddingLeft:11,paddingRight: 10}} className={publicStyles['ant-btn-primary']}>立即登录</Button>
          <Button type='primary' style={{height:'40px',width:'100%',paddingLeft:11,paddingRight: 10,marginTop:20}} className={publicStyles['ant-btn-primary']} onClick={()=>window.open('https://terminal.meixinglobal.com/#/loginRegister/login?race=1&way=login')}>金融产品预约系统</Button>
        </FormItem>


        <FormItem style={{marginTop:'10px',width:'280px'}} >
          <a style={{ fontFamily:'Microsoft YaHei',fontSize:'12px',color:'#333333',float:'left'}} onClick={()=>location.hash= '/passwdback/reset'}>忘记密码</a>
          <a style={{ fontFamily:'Microsoft YaHei',fontSize:'12px',color:'#333333',marginLeft:'60%',float:'right'}} onClick={()=>location.hash= '/register'} >免费注册</a>
        </FormItem>

      </Form>
    );
  }
}


AFPLogin = Form.create()(AFPLogin)

export default AFPLogin;
