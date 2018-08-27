import React from 'react';
import { Modal,Button, Form,Input,} from 'antd';
import * as service from '../../services/register';
import Modals from '../common/modal/Modal';
import * as styles from '../../styles/qa.css';
const FormItem = Form.Item;

class PsPasswdMd extends React.Component {
  constructor(props) {
    super(props);
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
   * 点击确认按钮执行的函数
   */
  submit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(values.prePassword != values.password){
          let params = {
            prePassword: this.props.form.getFieldValue('prePassword'),
            password: this.props.form.getFieldValue('password'),
            repPassword: this.props.form.getFieldValue('repPassword'),
            userId: this.props.userId || JSON.parse(localStorage.user).userId,
          };
          service.changePassword(params).then((data)=>{
            if(data.success){
              this.props.handVisble(data);
              this.props.form.resetFields();
              Modals.success({content:'密码修改成功'});
              return;
            }else{
              Modals.error({content:data.message});
              return;
            }
          });
        }else{
          Modals.error({content:'新密码不能和原始密码相同'});
          return;
        }
      }else{
        Modals.error({content:'请保证两次输入的密码一致'});
        return;
      }
    });
  }

  cancel(){
    this.props.handVisble(null);
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };


    return (
      <div >
        <Modal
          visible={this.props.visible}
          maskClosable={false}
          closable={true}
          onCancel={this.cancel.bind(this)}
          footer={null}
        >
          <div >
            <div className={styles.protocol_title}>
              <p>修改密码</p>
            </div>
            <Form className={styles.form_sty}>
              <div className={styles.phonecheck_content}>
                <FormItem {...formItemLayout} label="输入原始密码" >
                  {getFieldDecorator('prePassword', {
                    rules: [{required: true, message: '输入原始密码'}],
                  })(
                    <Input type="password"/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="输入新密码" >
                  {getFieldDecorator('password', {
                    rules: [{required: true, message: '请输入新密码'}],
                  })(
                    <Input type="password"/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="再输入一遍" >
                  {getFieldDecorator('repPassword',{
                    rules: [{required: true, message: '请再次输入密码'},{validator: this.checkPassword.bind(this)} ],
                  })(
                    <Input type="password"   />
                  )}
                </FormItem>
              </div>

              <div style={{textAlign:'center',marginBottom:'20px',marginTop:'30px'}}>
                <Button onClick={this.submit.bind(this)} type='primary' style={{ width: 160,height:40}}>确认</Button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(PsPasswdMd);
