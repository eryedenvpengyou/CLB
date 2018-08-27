import React from 'react';
import { Form, Input,Select, Row, Col, Button ,DatePicker, Table, Icon } from 'antd';
import * as common from '../../utils/common';
import Uploads from '../../components/common/Upload';
import Modals from '../common/modal/Modal';
import * as service from '../../services/qa';
import * as codeService from '../../services/code';
import * as styles from '../../styles/qa.css';
import {routerRedux} from "dva/router";

const formItemLayout ={
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

class QaFeedback extends React.Component{
  state = {
    code: {},
  }
  
  componentWillMount() {
    this.props.dispatch({
      type: 'qa/breadItemSave',
      payload: {breadItem: [{name:'意见反馈',url:'/#/qaBasic'}]},
    });
    this.props.dispatch({ type: 'qa/subMenuKeySave', payload: {subMenuKey: 'qaFeedback'}, });
    codeService.getCode({
      feedbackType:'QA.FEEDBACK_TYPE',                     //反馈类型
    }).then((data)=>{
      this.setState({code: data,});
    });
  }
  
  openMenu (subMenuKey) {
    this.props.dispatch({ type: 'qa/subMenuKeySave', payload: {subMenuKey}, });
    this.props.dispatch({
      type: 'qa/breadItemSave',
      payload: {breadItem: []},
    });
    if (subMenuKey === 'qaConsult') {
      this.props.dispatch(routerRedux.push('/qaBasic/qaConsult'));
    } else {
      this.props.dispatch(routerRedux.push('/qaBasic/qaNull'));
    }
  }
  
  submit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = this.props.form.getFieldsValue() || {};
        params.channelId = JSON.parse(localStorage.user).relatedPartyId;
        params.submitDate = common.formatSecond(new Date())
        params.status = 'TO_SOLVED'
        params.__status = 'ADD'
        //文件
        params.fileId = common.formatFile(this.props.form.getFieldValue('file'), true);
        
        // console.log(params)
        service.feedbackSubmit(params).then((data)=>{
          if(data.success){
            this.props.form.resetFields();
            Modals.success({content: '感谢您的反馈,将尽快为您处理',});
          }else{
            Modals.error({content: data.message,});
          }
        });
      }else{
        Modals.error({content: '请正确填写完信息',});
      }
    });
  }
  
  render(){
    const { getFieldDecorator } = this.props.form;
    const {feedbackType} = this.state.code;
    return (
      <div style={{padding:'10px'}}>
        <div style={{margin:'20px 0',fontSize:'16px', textAlign: 'center'}}>
          如有系统操作问题，可查看<span onClick={this.openMenu.bind(this, 'guide')} style={{cursor: 'pointer', color: JSON.parse(localStorage.theme).themeColor}}>操作指引</span>及<span onClick={this.openMenu.bind(this, 'question')} style={{cursor: 'pointer', color: JSON.parse(localStorage.theme).themeColor}}>问题查询</span>，或进行<span onClick={this.openMenu.bind(this, 'qaConsult')} style={{color: JSON.parse(localStorage.theme).themeColor,cursor: 'pointer'}}>问题咨询</span>。
        </div>
        <Form className={styles.form_sty}>
          <Form.Item {...formItemLayout} label="反馈类型" >
            {getFieldDecorator('feedbackType', {
              rules: [{
                required: true, message: '反馈类型必输',
              }],
            })(
              <Select optionFilterProp="children" placeholder="产品建议" >
                {
                  feedbackType &&
                  feedbackType.map((item)=>
                    <Select.Option key={item.value} value={item.value}>{item.meaning}</Select.Option>
                  )
                }
              </Select>
            )}
          </Form.Item>
  
          <Form.Item {...formItemLayout} label="意见反馈" >
            {getFieldDecorator('feedbackContent', {
              rules: [{
                required: true, message: '意见反馈必输',
              }],
            })(
              <Input type='textarea' autosize={{ minRows: 6}} placeholder='若是系统错误，请附上截图及操作的浏览器类型，方便我们尽快处理~'/>
            )}
          </Form.Item>
  
          <Form.Item {...formItemLayout} label="上传附件" >
            {getFieldDecorator('file', {
              rules: [],
            })(
              <Uploads fileNum={1} modularName='QA'/>
            )}
          </Form.Item>
  
          <Form.Item {...formItemLayout} label="联系方式" extra='便于我们与您联系'>
            {getFieldDecorator('phone', {
            })(
              <Input placeholder="邮箱/手机号码/微信号" />
            )}
          </Form.Item>
  
          <Row style={{display: 'flex', justifyContent: 'center'}}>
            <Button type="primary" style={{ width:120,height:'40px'}} onClick={this.submit.bind(this)}>提交</Button>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(QaFeedback);
