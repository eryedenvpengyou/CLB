/**
 * created by luozhuyan at 2017/8/1
 *
 * 行政登录
 */

import React from 'react';
import { Form, Icon, Input,Row,Col, Button, Tooltip,Select } from 'antd';
import * as service from '../../services/login';
import * as styles from '../../styles/login.css';
import isFunction from 'lodash/isFunction';
import Modals from '../common/modal/Modal';
import $ from 'jquery';


const FormItem = Form.Item;

class AdministrationLogin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      count: 60,         //多少秒后重新发验证码
      code:'',
      error:'',
      liked: true,      //控制发送验证码显示内容
      sendFlag: false,  //控制发送验证码按钮 是否可用的一部分，结合liked 一起控制是否可用
      pCode:[],
    };
  }
  componentWillMount(){
    service.phoneCode().then((data) => {
      this.setState({pCode: data.rows});
    })
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
        const body ={
          phoneNumber: this.props.form.getFieldValue('phone'),
          phoneArea: this.props.form.getFieldValue('phoneCode'),
          smsCode: this.props.form.getFieldValue('password'),
        };
        service.mexinLogin(body).then((data1) => {
          if(data1.code === 1){
            var theme = localStorage.theme || JSON.stringify({});
            localStorage.clear();     //先清除先前的缓存
            localStorage.theme = theme;
            localStorage.sessionId = data1.data.userinfo.sessionId;
            localStorage.message = data1.msg;
            localStorage.user = JSON.stringify(data1.data.userinfo);
            localStorage.channelName = data1.data.userinfo.channelName;
            localStorage.userName =  data1.data.userinfo.userName;

            if (data1.data.token.access_token) {
              const user = JSON.parse(localStorage.user||'{}');
              if (data1.data.userinfo.status === 'INACTIVE') {
                localStorage.temp_token = data1.data.token.access_token;
                // Modals.loginPhone(this.loginPhone.bind(this));
              } else {
                localStorage.currentTime = new Date().getTime();  
                localStorage.access_token = data1.data.token.access_token;

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
              localStorage.clear();     //清除先前的缓存
              location.hash = '/login';
            }
          }else{
            this.changeCode();
            this.setState({error:data1.msg});
            Modals.error({content: data1.msg,});
            return;
          }
        })

      }else{
        this.changeCode();
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
        callback('验证码不正确!');
        this.changeCode();
      }
    } else if(isFunction(callback)){
      callback();
    }
  }

  //验证手机号
  checkPhone = (rule, value, callback) => {
    if(!value){
      this.setState({ sendFlag: false, });
      callback();
    }else {
      let preCode = this.props.form.getFieldValue('phoneCode')
      let regex = /^\d{11}$/, msg='手机号位数不正确(大陆地区为11位)';

      if (preCode === '+00852' || preCode === '+00853') {
        regex = /^\d{8}$/;
        msg='手机号位数不正确(港澳地区为8位)';
      } else if (preCode === '+00886') {
        regex = /^\d{9}$/;
        msg='手机号位数不正确(台湾地区为9位)';
      }

      if (value && !regex.test(value)) {
        if (isFunction(callback)) {
          this.setState({
            sendFlag: false,
          });
          callback(msg);
        }
      } else if (isFunction(callback)) {
        this.setState({
          sendFlag: true,
        });
        callback();
      }
    }
  }
  //发送验证码
  sendCode() {
    if (this.state.liked) {
      if (this.props.form.getFieldValue('phone')) {
        const body ={
          phoneNumber: this.props.form.getFieldValue('phone'),
          phoneArea: this.props.form.getFieldValue('phoneCode')
        };
        service.smscode(body).then((data) => {
          if (data.code !== 1) {
            Modals.error({ content: data.msg, });
            return;
          }
        });

        this.timer = setInterval(function () {
          let count = this.state.count;
          this.state.liked = false;
          count -= 1;
          if (count < 1) {
            this.setState({
              liked: true,
              count: 60,
            });
            clearInterval(this.timer);  
          } else {
            this.setState({
              count: count
            });
          }
        }.bind(this), 1000);
      }
    }
  }
  resetPhone (value){
    if(value){
      this.props.form.setFieldsValue({phone:''}) ;
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const phoneCode = (
      getFieldDecorator('phoneCode', {
        initialValue:  "+86",
      })(
        <Select style={{ width: 120 }} onChange={this.resetPhone.bind(this)}>
          {
            this.state.pCode.map(code => {
              return <Select.Option key={'+'+code.value}>{code.meaning}</Select.Option>;
            })
          }
        </Select>
      )
    );
    //发送验证码按钮上显示的内容
    let text = this.state.liked ? '获取验证码' : this.state.count + '秒后重发';
    return (
      <Form onSubmit={this.handleSubmit} className={styles.form_sty}>

        <div id='backpage'/>
        <FormItem style={{height:'80px',width:'290px',marginTop:'20px'}} colon={false}>
          {getFieldDecorator('phone', {
            rules: [
              { required: true, message: '请输入手机号' },
              {validator: this.checkPhone.bind(this)}
              ],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: '18px' }} />} size="large" placeholder="手机号" addonBefore={phoneCode}/>
          )}
        </FormItem>
         
         <FormItem style={{height:'80px',width:'280px'}} colon={false}>
         <Row gutter={24}>
             <Col span={15}>
               {getFieldDecorator('password', {
                 rules: [{ required: true, message: '请输入验证码' }],
               })(
                 <Input prefix={<Icon type="lock" style={{ fontSize: 18 }} />} size="large" placeholder="验证码" />
                 )}
             </Col>
             <Col span={7} style={{paddingLeft: 0}}>
               <Button type='default' disabled={!(this.state.liked && this.state.sendFlag) } style={{ height: '40px'}} onClick={this.sendCode.bind(this)}>{text}</Button>
             </Col>
           </Row>
         </FormItem> 

        <FormItem style={{height:'80px',width:'280px'}} colon={false}>
          <Row gutter={24}>
            <Col span={15}>
              {getFieldDecorator('verificationCode1', {
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
            <Col span={2} style={{paddingLeft: '5px',paddingTop: '1%'}}>
              <Tooltip title="看不清，点击换一张">
                <Icon style={{cursor:'pointer',color: '#DEDEDE',fontSize:'16px'}} type="sync" onClick={this.changeCode.bind(this)}/>
              </Tooltip>
            </Col>
          </Row>
        </FormItem>

        <FormItem style={{ width: '280px' }}>
          <Button htmlType="submit" type='default' style={{ height: '40px', width: '100%', paddingLeft: 11, paddingRight: 10 }}>立即登录</Button>
          <Button type='primary' style={{ height: '40px', width: '100%', paddingLeft: 11, paddingRight: 10, marginTop: 20 }} onClick={() => window.open('https://terminal.meixinglobal.com/#/loginRegister/login?race=1&way=login')}>金融产品预约系统</Button>
        </FormItem>

         <FormItem style={{marginTop:'10px',width:'280px'}} >
          <a style={{ fontFamily:'Microsoft YaHei',fontSize:'12px',color:'#333333',float:'left'}} onClick={()=>location.hash= '/passwdback/reset'}>忘记密码</a>
          <a style={{ fontFamily:'Microsoft YaHei',fontSize:'12px',color:'#333333',marginLeft:'60%',float:'right'}} onClick={()=>location.hash= '/register'} >免费注册</a>
        </FormItem>
     
      </Form>
    );
  }
}


AdministrationLogin = Form.create()(AdministrationLogin)

export default AdministrationLogin;
