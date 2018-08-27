/**
 * created by zhuyan.luo at 2017/06/23 20:27
 */


import React from 'react';
import { Modal, Button, Form,Input,Row,Col} from 'antd';
import * as styles from './modal.css';
import * as service from '../../services/login';

const FormItem = Form.Item;

class LoginPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    };
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

  /**
   * 提交
   */
  submit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let user = JSON.parse(localStorage.user);
        let params = {
          password: this.props.form.getFieldValue('password'),
          repPassword: this.props.form.getFieldValue('repPassword'),
          userId:user.userId,
        };
        service.changePassword(params).then((data)=>{
          if(data.success){
            service.updateUserStatus({userId:user.userId}).then((data)=>{
              if(data.success){
                user.status = 'ACTV';
                localStorage.currentTime = new Date().getTime();
                localStorage.access_token = localStorage.temp_token;
                localStorage.temp_token = '';
              }
              this.props.close();
              this.props.loginPassword();
            })
          }else{
            this.setState({error:data.message});
          }
        });
      }else{
        this.setState({error:'请保证两次输入的密码一致'});
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 15 },
      },
    };


    return (
      <div>
        <Modal
          visible={true}
          maskClosable={false}
          closable={false}
          onCancel={()=>this.props.close()}
          footer={null}
        >
          <div >
            <div className={styles.protocol_title}>
              <p>修改密码</p>
            </div>
            <Form style={{marginTop:'30px'}}>
                <FormItem {...formItemLayout} label="输入新密码"  >
                  {getFieldDecorator('password', {
                    rules: [{required: true, message: '请输入新密码'}],
                  })(
                    <Input type="password"/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="再输入一遍"  style={{marginBottom:'1px'}}>
                  {getFieldDecorator('repPassword',{
                    rules: [{required: true, message: '请再次输入密码',},
                    {validator: this.checkPassword.bind(this),}],
                  })(
                    <Input type="password" />
                  )}
                </FormItem>

                {
                  this.state.error &&
                  <FormItem >
                    <Row>
                      <Col span={5}></Col>
                      <Col>
                        <div style={{color:'red'}}>{this.state.error}</div>
                      </Col>
                    </Row>
                  </FormItem>
                }
              <div style={{textAlign:'center',marginBottom:'20px',marginTop:'30px'}}>
                <Button onClick={this.submit.bind(this)} type='primary' style={{width:'120px',height:'40px'}} >确认</Button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(LoginPassword);

