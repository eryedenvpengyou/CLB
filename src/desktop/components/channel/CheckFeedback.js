import React from 'react';
import {Icon,Button,Input,Form,Row,Col} from 'antd';
import FeedbackL from './FeedbackL';
import FeedbackR from './FeedbackR';
import {pushFile,validateFile} from '../../utils/common';
import Uploads from '../../components/common/Upload';
import * as service from '../../services/channel';
import * as codeService from '../../services/code';
import * as styles from '../../styles/qa.css';

const FormItem = Form.Item;

const formItemLayout ={
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};


class CheckFeedback extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      defaultFileList: [],
      code: {},
      feedback: {},
      questionNumber:'',  //问题编号
    };
  }

  componentWillMount(){
    //获取状态快码
    codeService.getCode({checkStatus:'FET.QUESTION_STATUS'}).then((data)=>{
      this.setState({code: data},()=>{
        this.query();
      });
    });
  }
  //查询
  query() {
    const params = {
      // userId: JSON.parse(localStorage.user).userId,
      paymentCompanyId: this.props.paymentCompanyId,
      receiveCompanyId: this.props.receiveCompanyId,
      channelId: this.props.receiveCompanyId,
      checkPeriod: this.props.checkPeriod,
      settlementSummaryId:this.props.settlementSummaryId
    }
    service.fetchFeedback(params).then((feedbackData)=>{
      if(feedbackData.success && feedbackData.rows.length > 0){
        for(let i in this.state.code.checkStatus){
          if(feedbackData.rows[0] && this.state.code.checkStatus[i].value == feedbackData.rows[0].status){
            feedbackData.rows[0].statusMeaning = this.state.code.checkStatus[i].meaning;
            break;
          }
        }
        this.setState({
          feedback: feedbackData.rows[0],
          defaultFileList: this.state.defaultFileList,
        });
      }
    });
  }
  //问题提交
  submit(){
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
        //附件数据
        var fileContent = '';
        for (var i in values.file) {
          if (values.file[i].response) {
            if (values.file[i].response.success) {
              fileContent += '<div class="file" style="font-size:12px" onclick="downloadFile('+values.file[i].response.file.fileId+',\''+values.file[i].response.file.filePath+'\')"><img src="{root}/resources/images/forecast/download.png" height="40" width="40"/><br>'+values.file[i].response.file.fileName+'</div>';
            } else {
              TipModal.error({content: "第 "+(i+1)+" 个附件上传失败："+values.file[i].response.message});
              return;
            }
          }
        }
        let params = {
          // userId: JSON.parse(localStorage.user).userId,
          paymentCompanyId: this.props.paymentCompanyId,
          paymentCompanyType: this.props.paymentCompanyType,
          status: this.state.feedback.status||'WJJ',
          receiveCompanyId: this.props.receiveCompanyId,
          channelId: this.props.receiveCompanyId,
          checkPeriod: this.props.checkPeriod,
          deleteFiles:[],
          questionId: this.state.feedback.questionId || null,
          questionNumber: this.state.feedback.questionNumber || null,
          __status: this.state.feedback.questionId? 'update':'add',
          lines:[{
            isRight: false,       //用于判断是不是管理员
            submitDate: new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds(),
            content: this.props.form.getFieldValue('content')+'<br>'+fileContent,
            questionId: this.state.feedback.questionId || null,
            userName: JSON.parse(localStorage.user).userName,
          }],
          settlementSummaryId:this.props.settlementSummaryId
        };
        service.submitFeedback(params).then((data)=>{
          if(data.success){
            //提交成功之后，更新界面数据
            this.query();
            this.props.form.resetFields();
          }
        });
      }
    });
  }

  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const feedback = this.state.feedback || {};
    return(
      <div className={styles.content}>
        <div style={{width:'98%',margin:'10px 0 0 1%',padding:'10px 40px',border:'1px #E9E9E9 solid',borderRadius:'2px'}}>
          <div style={{fontSize:'16px',marginTop:'2%'}}>问题编号：{feedback.questionNumber || ''}</div>
          <hr style={{marginBottom:'2%'}}/>

          <div style={{height:500,overflowY:'scroll',overflowX:'hidden'}}>
          {
            feedback.lines &&
            feedback.lines.map((item)=>{
              if(item.isRight){
                return (<FeedbackR key={item.questionLineId} props={item}/>);
              }else{
                return (<FeedbackL key={item.questionLineId} props={item}/>);
              }
            })
          }
          </div>
          {
            this.props.status == 'CONFIRMING' || this.props.status == 'ASKING' ?
              <div style={{ marginTop: '4%' }}>
                <Form layout="horizontal" >
                  <FormItem>
                    {getFieldDecorator('content', {
                      rules: [{ required: true, message: '输入内容不能为空' }],
                    })(
                      <Input type="textarea" rows={3} placeholder="请在此输入您的问题" />
                      )}
                  </FormItem>
                  <Row>
                    <Col span={6}></Col>
                    <Col span={8}>
                      <FormItem {...formItemLayout}>
                        {getFieldDecorator('file', {})(
                          <Uploads fileNum={5} modularName='CNL' />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={10}>
                      <FormItem>
                        <Button type='primary' onClick={this.submit.bind(this)} style={{ width: 140, height: 40 }}>提交</Button>
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </div> : ''
          }
          
        </div>
      </div>
    );
  }

}

export default Form.create()(CheckFeedback);
