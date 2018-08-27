import React from 'react';
import { Form, Input,Modal, Select, Row, Col, Checkbox, Button } from 'antd';
import isFunction from 'lodash/isFunction';
import Modals from '../common/modal/Modal';
import * as styles from '../../styles/register.css';
import * as service from '../../services/register';
import * as loginService from '../../services/login';

const FormItem = Form.Item;
const Option = Select.Option;

class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      checked: true,     //勾选框
      count: 60,         //多少秒后重新发验证码
      liked: true,      //控制发送验证码显示内容
      sendFlag: false,  //控制发送验证码按钮 是否可用的一部分，结合liked 一起控制是否可用
      visible: false,
      registLoading: false,  //点击注册按钮后 让按钮处于加载状态
      protocol:[]
    };
  }
  componentWillMount() {
    service.queryDomainProtocol({domainUrl:location.origin.split('://')[1]}).then(data=>{
      if(data.success){
        this.setState({protocol:data.rows[0]});
      }
    })
  }
  //改变Checkbox
  changeBox(){
    this.setState({
      checked:!this.state.checked,
    })
  }



  /**
   * 点击提交按钮执行的函数
   */
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form = this.props.form;
        let params = {};
        params.host = location.origin.split('://')[1];
        params.channelName = form.getFieldValue('channelName');
        params.chineseName = form.getFieldValue('channelName');
        params.statusCode = 'REGISTED';
        params.channelSource = 'ONLINE';
        params.contactPerson = form.getFieldValue('channelName');
        params.contactPhone = form.getFieldValue('contactPhone');
        params.phoneCode = form.getFieldValue('phoneCode');

        params.user = {};
        params.user.userName = form.getFieldValue('userName');
        params.user.password = form.getFieldValue('password');
        params.user.repPassword = form.getFieldValue('repPassword');
        params.user.phone = form.getFieldValue('contactPhone');
        params.user.phoneCode = form.getFieldValue('phoneCode');
        params.user.verifiCode = form.getFieldValue('verifiCode');
        params.user.userType = 'CHANNEL';
        params.sessionId = this.state.sessionId;   //验证码 sessionId
        this.setState({ registLoading: true });

        //提交注册信息
        service.submit(params).then((data) => {
          const body ={
            userName: form.getFieldValue('userName'),
            password: form.getFieldValue('password'),
          };
          const params ={
            client_id: 'client2',
            client_secret: 'secret',
            grant_type: 'password',
            username: this.props.form.getFieldValue('userName'),
            password: this.props.form.getFieldValue('password'),
          };
          if(data.success){
            this.setState({ registLoading: false });
            loginService.loginFirst(body).then((data) => {
              if(data && data.success){
                var theme = localStorage.theme || JSON.stringify({});
                localStorage.clear();//先清除先前的缓存
                localStorage.theme = theme;
                localStorage.sessionId = data.sessionId;
                localStorage.user = JSON.stringify(data.user);
                localStorage.userName = data.user.userName;
                localStorage.channelName = data.channelName;

                loginService.login(params).then((data) => {
                  if(data !==  null && data.access_token){
                    clearInterval(this.timer);
                    localStorage.access_token = data.access_token;
                    localStorage.currentTime = new Date().getTime();
                    location.hash = '/register/success';
                  }else{
                    var theme = localStorage.theme || JSON.stringify({});
                    localStorage.clear();//先清除先前的缓存
                    localStorage.theme = theme;
                    location.hash = '/login';
                  }
                });
              }else{
                Modals.error({content: '自动登录失败！'+ data.message,});
                this.setState({ registLoading: false });
                return;
              }
            });
          }else{
            Modals.error({content: '注册失败！'+ data.message,});
            this.setState({ registLoading: false });
            return;
          }

        }).catch(error => {
          Modals.error({content: '服务器或网络异常，请稍后尝试',});
          this.setState({ registLoading: false });
          return;
        });

      }else{
        // Modals.error({content: '请填写正确注册信息',});
        return;
      }
    });
  }

  //操作不当时清除定时器
  componentWillUnmount() {
    clearTimeout(this.timer);
  }



  //校验密码是否一致
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
  }

  //验证手机号
  checkPhone = (rule, value, callback) => {
    if(!value){
      this.setState({ sendFlag: false, });
      callback();
    }else{
      let preCode = this.props.form.getFieldValue('phoneCode');
      let regex = /^\d{11}$/,msg='手机号位数不正确(大陆地区为11位)';

      if( preCode ==='00852' || preCode ==='00853'){
        regex = /^\d{8}$/;
        msg='手机号位数不正确(港澳地区为8位)';
      }else if(preCode ==='00886' ){
        regex = /^\d{9}$/;
        msg='手机号位数不正确(台湾地区为9位)';
      }

      if ( value && !regex.test(value)  ) {
        if(isFunction(callback)) {
          this.setState({ sendFlag: false, });
          callback(msg);
        }
      }else if(isFunction(callback)) {
        this.setState({ sendFlag: true, });
        callback();
      }
    }
  }

  //平台协议
  showModal(){
    this.setState({
      visible: true,
    });
  }
  //关闭协议模态框
  handleCancel (e) {
    this.setState({
      visible: false,
    });
  }

  //发送验证码
  handleClick(e){
    if(this.state.liked){
      if(this.props.form.getFieldValue('contactPhone')){
        service.sendVerifiCode({
            phone:this.props.form.getFieldValue('contactPhone'),
            phoneCode:this.props.form.getFieldValue('phoneCode'),
        }).then((data)=>{
          if(data.success){
            this.setState({sessionId:data.sessionId});
          }else{
            Modals.error({content: data.msg,});
            return;
          }
        });

        //开始倒计时
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
          }else{
            this.setState({count: count });
          }
        }.bind(this), 1000);

      }
    }
  }

  //当更改了phoneCode就清空手机号
  handleWebsiteChange = (value) => {
    if(value){
      this.props.form.resetFields(['contactPhone']) ;
      this.setState({
        sendFlag: false,
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 10 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 20,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 6,
        },
      },
    };

    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: "86",
    })(
      <Select style={{width:'120px'}} onChange={this.handleWebsiteChange}>
        <Option value="86">+86(大陆)</Option>
        <Option value="00852">+852(香港)</Option>
        <Option value="00853">+853(澳门)</Option>
        <Option value="00886">+886(台湾)</Option>
      </Select>
    );

    //发送验证码按钮上显示的内容
    let text = this.state.liked ? '发送验证码' : this.state.count + '秒后重发';

    return (
      <div className={styles.fieldset_sty}>
        <Form  className={styles.form_sty} style={{marginLeft:'10%' }} onSubmit={this.handleSubmit.bind(this)}>
          <FormItem {...formItemLayout} label="渠道名称">
            {getFieldDecorator('channelName', {
              rules: [{ required: true, message: '请输入渠道名称', whitespace: true }],
            })(
              <Input  />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="用户名">
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入密码',
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="确认密码">
            {getFieldDecorator('repPassword', {
              rules: [{
                required: true, message: '请再次输入密码',
              }, {
                validator: this.checkPassword.bind(this),
              }],
            })(
              <Input type="password"  />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="联系电话">
            {getFieldDecorator('contactPhone', {
              rules: [{
                required: true, message: '请输入联系电话'
              },{
                validator: this.checkPhone.bind(this),
              }],
            })(
              <Input addonBefore={prefixSelector} size="large" style={{width:'100%',marginRight: 0}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="验证码" >
            <Row gutter={24}>
              <Col span={18}>
                {getFieldDecorator('verifiCode', {
                  rules: [{ required: true, message: '请输入验证码', whitespace: true
                  }],
                })(
                  <Input size="large" />
                )}
              </Col>
              <Col span={6} style={{paddingLeft: 0}}>
                <Button disabled={!(this.state.liked && this.state.sendFlag) } size="large" type='primary' style={{float:'right', height:'40px'}} onClick={this.handleClick.bind(this)}>{text}</Button>
              </Col>
            </Row>
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            {getFieldDecorator('agreement')(
              <div>
                <Checkbox checked={this.state.checked} onChange={this.changeBox.bind(this)}>我已认真阅读并同意</Checkbox> <a style={{marginLeft:'-12px',color:JSON.parse(localStorage.theme).themeColor,fontSize:'16px',fontFamily:'Microsoft YaHei' }} onClick={this.showModal.bind(this)}><b>《{this.state.protocol.protocolName}》</b></a>
              </div>
            )}
          </FormItem>
          <FormItem  {...tailFormItemLayout}>
            <Button disabled={!this.state.checked} type='primary' loading={this.state.registLoading} style={{float:'right', width:'100%',height:'40px'}} htmlType="submit" size="large" >注册</Button>
          </FormItem>
          <FormItem  {...tailFormItemLayout}>
            <div style={{ textAlign:'center',fontSize:'16px',fontFamily:'Microsoft YaHei'}}>
              已注册{this.state.protocol.companyName}账户？<a style={{ color:'#000',}}onClick={()=>location.hash= '/login'} ><span style={{ color:JSON.parse(localStorage.theme).themeColor}}> 立即登录</span></a>
            </div>
          </FormItem>
        </Form>
        <Modal
          visible={this.state.visible}
          width={600}
          style={{top:25}}
          maskClosable={false}
          onCancel={this.handleCancel.bind(this)}
          footer={null}
        >
          <div >
            <div className={styles.protocol_title}>
              <p style={{margin:'0px 0px'}}>平台协议</p>
            </div>
            <Form>
              <div className={styles.protocol_content} dangerouslySetInnerHTML={{__html: (this.state.protocol.protocolContent||"").replace(/\n/g, '<br>')}}>
              </div>
              <FormItem className={styles.button_sty}
                        {...formItemLayout}
              >
                {getFieldDecorator('complete', {
                })(
                  <Button type='default' style={{ width:'205px',height:'40px'}} onClick={this.handleCancel.bind(this)}>同意并继续
                  </Button>
                )}
              </FormItem>

            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}


Register = Form.create()(Register)

export default Register;
