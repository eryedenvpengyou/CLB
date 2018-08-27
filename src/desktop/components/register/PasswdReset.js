import React from 'react';
import { Form, Input,Select, Row, Col, Button } from 'antd';
import isFunction from 'lodash/isFunction';
import * as service from '../../services/register';
import * as styles from '../../styles/register.css';
import Modals from "../common/modal/Modal";


const FormItem = Form.Item;

class PasswdReset extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      count: 60,         //多少秒后重新发验证码
      liked: true,      //控制发送验证码显示内容
      sendFlag: false,  //控制发送验证码按钮 是否可用的一部分，结合liked 一起控制是否可用
      sessionId: '',
      error:'',         //校验错误信息
    };
  }

    //验证手机号
  checkPhone = (rule, value, callback) => {
    if(!value){
      this.setState({ sendFlag: false, });
      callback();
    }else {
      let preCode = this.props.form.getFieldValue('phoneCode')
      let regex = /^\d{11}$/, msg='手机号位数不正确(大陆地区为11位)';

      if (preCode === '00852' || preCode === '00853') {
        regex = /^\d{8}$/;
        msg='手机号位数不正确(港澳地区为8位)';
      } else if (preCode === '00886') {
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


  submit(){
    this.props.form.validateFields((err, value) => {
      if(!err){

        let values = this.props.form.getFieldsValue();
        values.sessionId = this.state.sessionId;
        service.passwdback(values).then((data)=>{
          if(data.success){
            location.hash = '/passwdback/success';
          }else{
            this.setState({error:data.message});
          }
        });
      }
    });
  }


  //发送验证码
  sendCode(){
    if(this.state.liked){
      if(this.props.form.getFieldValue('phone')){
        service.sendVerifiCode({
          phone:this.props.form.getFieldValue('phone'),
          phoneCode:this.props.form.getFieldValue('phoneCode'),
        }).then((data)=>{
          if(data.success) {
            this.setState({sessionId: data.sessionId});
          }else{
            Modals.error({content: data.msg,});
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
          }else{
            this.setState({
              count: count
            });
          }
        }.bind(this), 1000);
      }
    }
  }

  handleWebsiteChange = (value) => {
    if(value){
      this.props.form.resetFields(['phone']) ;
      this.setState({
        sendFlag: false,
      });
    }
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

  //操作不当时清除定时器
  componentWillUnmount() {
    clearTimeout(this.timer);
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 9 },
      },
      wrapperCol: {
        sm: { span: 7 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        sm: {
          offset: 9,
          span: 7,
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
      <div className={styles.password_back}>
        <div style={{textAlign:'center',marginTop:'15px',marginBottom:'55px',fontSize:'30px',fontFamily:'MicrosoftYaHei'}}>
          找回密码
        </div>
        <Form className={styles.form_sty}>
          <FormItem {...formItemLayout} label="用户名" >
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入渠道名称', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="输入新密码" >
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码', whitespace: true }],
            })(
              <Input type="password"/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="再输入一遍" >
            {getFieldDecorator('repPassword', {
              rules: [{ required: true, message: '两次密码不一致，请重新输入', whitespace: true },{
                validator: this.checkPassword.bind(this),
              }],
            })(
              <Input type="password"/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="手机号" >
            {getFieldDecorator('phone', {
              rules: [{
                required: true, message: '请输入手机号'
              },{
                validator: this.checkPhone.bind(this),
              }],
            })(
              <Input addonBefore={prefixSelector} style={{width:'100%'}}/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="验证码">
            <Row gutter={24}>
              <Col span={16}>
                {getFieldDecorator('verifiCode', {
                  rules: [{ required: true, message: '请输入验证码', whitespace: true}],
                })(
                  <Input size="large" />
                )}
              </Col>
              <Col span={8} style={{paddingLeft: 0}}>
                <Button size="large" type='primary' disabled={!(this.state.liked && this.state.sendFlag) } style={{height:'40px'}} onClick={this.sendCode.bind(this)}>{text}</Button>
              </Col>
            </Row>
            {
              this.state.error != '' &&
                <Row>
                  <Col>
                    <div style={{color:'red'}}>{this.state.error}</div>
                  </Col>
                </Row>
            }
          </FormItem>

          <FormItem  {...tailFormItemLayout}>
            <Button onClick={this.submit.bind(this)} type='primary' style={{width:'100%',height:'40px'}} >确认</Button>
          </FormItem>

          <FormItem  {...tailFormItemLayout} style={{marginBottom:'60px'}}>
            <div style={{ textAlign:'center',fontSize:'16px',fontFamily:'Microsoft YaHei'}}>
              不用了？<a style={{ color:'#000',}}onClick={()=>location.hash= '/login'} ><span style={{ color:JSON.parse(localStorage.theme).themeColor}}> 立即登录</span></a>
            </div>
          </FormItem>
        </Form>
      </div>
    );
  }
}


export default Form.create()(PasswdReset);
