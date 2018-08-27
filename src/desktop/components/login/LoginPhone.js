/**
 * created by zhuyan.luo at 2017/06/23 20:27
 */

import React from 'react';
import { Modal,Button, Form,Input,Row,Col,Select} from 'antd';
import * as styles from './modal.css';
import * as service from '../../services/login';

const FormItem = Form.Item;
const Option = Select.Option;

class LoginPhone extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      count: 60,
      liked: true,
      error: null,
      sessionId: null
    };
  }


  //发送验证码
  handleClick() {
    if (this.state.liked) {
      if (this.props.form.getFieldValue('phone')) {
        service.sendVerifiCode({
          phoneCode:this.props.form.getFieldValue('phoneCode'),
          phone: this.props.form.getFieldValue('phone')
        }).then((data)=>{
          if(!data.success){
            this.setState({error:data.msg});
          }else{
            this.setState({sessionId:data.sessionId});
            this.timer = setInterval(function () {
              let count = this.state.count;
              this.state.liked = false;
              count -= 1;
              if (count < 1) {
                this.setState({liked: true,count: 60});
                clearInterval(this.timer);
              } else {
                this.setState({count: count});
              }
            }.bind(this), 1000);
          }
        });
      }
    }
  }


  //提交
  submit() {
    this.props.form.validateFields((err, values) => {
      const user = JSON.parse(localStorage.user);
      if (!err) {
        service.checkVerifyCode({
          verifiCode: this.props.form.getFieldValue('code'),
          phone: this.props.form.getFieldValue('phone'),
          userId: JSON.parse(localStorage.user).userId,
          sessionId: this.state.sessionId,
        }).then((data) => {
          if (data.success) {
            this.props.close();
            this.props.loginPhone();
            // Modals.loginProtocol(this.props.afterPassword);
          } else {
            this.setState({error:data.message});
          }
        });
      } else {
        this.setState({error:'验证码错误'});
      }
    });
  }

  //操作不当时清除定时器
  componentWillUnmount() {
    clearTimeout(this.timer);
  }



  render() {
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: JSON.parse(localStorage.user).phoneCode,
    })(
      <Select style={{width:'100px'}} disabled>
        <Option value="86">+86(大陆)</Option>
        <Option value="00852">+852(香港)</Option>
        <Option value="00853">+853(澳门)</Option>
        <Option value="00886">+886(台湾)</Option>
      </Select>
    );

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 16 },
      },
    };

    //发送验证码按钮上显示的内容
    let text = this.state.liked ? '发送验证码' : this.state.count + '秒后重发';

    return (
      <div >
        <Modal
        visible={true}
        maskClosable={false}
        closable={true}
        onCancel={()=>this.props.close()}
        footer={null}
        >
          <div >
            <div className={styles.protocol_title}>
              <p>手机验证</p>
            </div>
            <Form onSubmit={this.handleSubmit} style={{marginTop:'30px'}}>

                <FormItem {...formItemLayout} label="您的手机号" >
                  {getFieldDecorator('phone',{
                    initialValue:JSON.parse(localStorage.user).phone,
                  })(
                    <Input addonBefore={prefixSelector} disabled={true} style={{width:'100%'}}/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="短信验证码" style={{marginBottom:'1px'}}>
                    <Row gutter={24}>
                      <Col span={16}>
                        {getFieldDecorator('code', {
                          rules: [{required: true, message: '请输入验证码'},
                          {validator: this.checkPhone,}],
                        })(
                          <Input size="large" style={{marginRight: 0}} placeholder="请输入验证码" />
                        )}
                      </Col>
                      <Col span={7} style={{paddingLeft: 0}}>
                        <Button disabled={!this.state.liked} type='primary' style={{ paddingLeft:'11px',paddingRight: '10px',height:'40px'}} onClick={this.handleClick.bind(this)}>{text}</Button>
                      </Col>
                    </Row>
                </FormItem>

                {
                  this.state.error &&
                  <FormItem >
                    <Row>
                      <Col span={6}></Col>
                      <Col>
                        <div style={{color:'red'}}>{this.state.error}</div>
                      </Col>
                    </Row>
                  </FormItem>
                }


              <div style={{textAlign:'center',marginBottom:'20px',marginTop:'30px'}}>
                <Button onClick={this.submit.bind(this)} type='primary' style={{ width:'120px',height:'40px'}} >提交</Button>
              </div>

            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}


export default Form.create()(LoginPhone);
