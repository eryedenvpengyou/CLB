import React from 'react';
import { Modal,Button, Form,Input,Row,Col} from 'antd';
import * as service from '../../services/register';
import CodeOption from '../common/CodeOption';
import Modals from '../common/modal/Modal';
import * as styles from '../../styles/qa.css';

const FormItem = Form.Item;

class PsPhoneNowMd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 60,
      liked: true,
      sessionId:'',
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }


  //发送验证码
  sendCode(){
    if(this.state.liked){
      if(this.props.form.getFieldValue('phone')){
        service.sendVerifiCode({
          phoneCode:this.props.form.getFieldValue('phoneCode'),
          phone:this.props.form.getFieldValue('phone'),
        }).then((data)=>{
          if(data.success){
            this.setState({sessionId:data.sessionId});
          }else{
            Modals.error({content: data.msg});
            return;
          }
        });
        this.timer = setInterval(function () {
          let count = this.state.count;
          this.state.liked = false;
          count -= 1;
          if (count < 1) {
            this.setState({liked: true,count: 60,});
            clearInterval(this.timer);
          }else{
            this.setState({count: count});
          }
        }.bind(this), 1000);
      }
    }
  }

  //提交
  submit(){
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {};
        params.userId = this.props.userId || JSON.parse(localStorage.user).userId;
        params.phone = values.phone;
        params.phoneCode = values.phoneCode;
        params.verifiCode = values.code;
        params.sessionId = this.state.sessionId;
        service.checkVerifyCode(params).then((data)=>{
          if(data.success){
            this.props.handVisble(true);
            this.props.form.resetFields(['code']);
            return;
          }else{
            Modals.error({content: data.message,});
            this.props.form.resetFields(['code']);
            return;
          }
        });
      }else{
        Modals.error({content: '请检查验证码是否正确'});
        return;
      }
    });
  }

  oncCancel(){
    this.props.handVisble(false);
    this.props.form.resetFields(['code']) ;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };

    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: this.props.phoneCode,
    })(
      <CodeOption disabled codeList={this.props.codeList} width={120}/>
    );

    //发送验证码按钮上显示的内容
    let text = this.state.liked ? '发送验证码' : this.state.count + '秒后重发';
    return (
      <div >
        <Modal
          width={600}
          style={{height:320}}
          visible={this.props.visible}
          maskClosable={false}
          closable={true}
          onCancel={this.oncCancel.bind(this)}
          footer={null}
        >
          <div >
            <div className={styles.protocol_title}>
              <p>手机号变更</p>
            </div>
            <div style={{textAlign:'center'}}>为了保证您的账号安全，更换手机号前请进行安全验证</div>
            <Form className={styles.form_sty}>
              <div className={styles.phonecheck_content}>
                <FormItem {...formItemLayout} label="手机号" >
                  {getFieldDecorator('phone',{
                    // initialValue: JSON.parse(localStorage.user||'{}').phone,
                    initialValue: this.props.contactPhone,
                  })(
                    <Input addonBefore={prefixSelector} disabled style={{width:'300px'}}/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="短信验证码" >
                  <Row style={{width:'300px'}}>
                    <Col style={{float:'left',width:'150px'}}>
                      {getFieldDecorator('code', {
                        rules: [{required: true, message: '请输入验证码'}],
                      })(
                        <Input size="large" style={{width:'150px'}} placeholder="请输入验证码" />
                      )}
                    </Col>
                    <Col style={{float:'left',width:'150px'}}>
                      <Button disabled={!this.state.liked} type='primary' style={{height:'40px',width:'120px',marginLeft:'30px'}} onClick={this.sendCode.bind(this)}>{text}</Button>
                    </Col>
                  </Row>
                </FormItem>

                <FormItem {...formItemLayout} label="  " colon={false} style={{marginTop:'30px'}}>
                  <Row style={{width:'300px'}}>
                    <Col style={{float:'left',width:'150px'}}>
                      <Button type='default' style={{ width:'120px',height:'40px'}} onClick={()=>this.props.handVisble(false)} >取消</Button>
                    </Col>
                    <Col style={{float:'left',width:'150px'}}>
                      <Button onClick={this.submit.bind(this)} type='primary' style={{ width:'120px',height:'40px',float:'right'}} >提交</Button>
                    </Col>
                  </Row>
                </FormItem>
              </div>


            </Form>

          </div>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(PsPhoneNowMd);
