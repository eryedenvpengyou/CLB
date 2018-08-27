import React from 'react';
import { Modal,Button, Form,Input,Row,Col} from 'antd';
import * as service from '../../services/register';
import CodeOption from '../common/CodeOption';
import Modals from '../common/modal/Modal';
import * as styles from '../../styles/qa.css';

const FormItem = Form.Item;

class PsPhoneNewMd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 60,
      liked: true,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  //验证手机号
  checkPhone(rule, value, callback){
    let preCode = this.props.form.getFieldValue('phoneCode');
    let regex = /^\d{11}$/, msg='手机号位数不正确(大陆地区为11位)';

    if( preCode =='00852' || preCode =='00853'){
      regex = /^\d{8}$/;
      msg='手机号位数不正确(港澳地区为8位)';
    }else if(preCode =='00886' ){
      regex = /^\d{9}$/;
      msg='手机号位数不正确(台湾地区为9位)';
    }

    if ( value && !regex.test(value)  ) {
      this.setState({ sendFlag: false, });
      callback(msg);
    } else {
      this.setState({ sendFlag: true, });
      callback();
    }
  }

  //当改变电话代码就清空手机号
  clearPhone(value){
    if(value){
      this.props.form.resetFields(['phone']) ;
    }
  }


  //发送验证码
  sendCode(){
    if(this.state.liked){
      this.props.form.validateFields(['phone'], (err, values) => {
        if(!err){
          service.sendVerifiCode({phoneCode:this.props.form.getFieldValue('phoneCode'),phone:this.props.form.getFieldValue('phone')}).then((data)=>{
            if(data.success){
              this.setState({sessionId:data.sessionId});
            }else{
              Modals.error({content: data.msg});
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
      });
    }
  }

  //提交
  submit(){
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form = this.props.form;
        let params = {};
        params.userId = this.props.userId || JSON.parse(localStorage.user).userId,
        params.phone = form.getFieldValue('phone'),
        params.phoneCode = form.getFieldValue('phoneCode');
        params.verifiCode = form.getFieldValue('code');
        params.sessionId = this.state.sessionId;
        service.changePhoneSecond(params).then((data)=>{
          if(data.success){
            this.props.handVisble(data);
            this.props.form.resetFields(['code']) ;
            Modals.success({content: '变更手机号成功',});

            //更新缓存
            let user = JSON.parse(localStorage.user||'{}');
            user.phone = params.phone;
            user.phoneCode = params.phoneCode;
            localStorage.user = JSON.stringify(user);
            location.reload();
            return;
          }else{
            Modals.error({content: data.message,});
            this.props.form.resetFields(['code']) ;
            return;
          }
        });
      }else{
        Modals.error({content: '请检查输入的验证码是否正确'});
        return;
      }
    });
  }


  oncCancel(){
    this.props.handVisble();
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

    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: '86',
    })(
      <CodeOption codeList={this.props.codeList} onChange={this.clearPhone.bind(this)} width={120} />
    );

    //发送验证码按钮上显示的内容
    let text = this.state.liked ? '发送验证码' : this.state.count + '秒后重发';
    return (
      <div>
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
            <Form className={styles.form_sty}>
              <div className={styles.phonecheck_content}>
                <FormItem {...formItemLayout} label="请输入新手机号" >
                  {getFieldDecorator('phone',{
                    rules: [{
                      required: true, message: '请输入新手机号'
                    },{
                      validator: this.checkPhone.bind(this),
                    }],
                  })(
                    <Input addonBefore={prefixSelector} style={{width:'300px'}}/>
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
                      <Button type='default' style={{ width:'120px',height:'40px'}} onClick={()=>this.props.handVisble(null)} >取消</Button>
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

export default Form.create()(PsPhoneNewMd);
