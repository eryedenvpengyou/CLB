import React from 'react';
import { Form, Input,Select, Row, Col, Button ,DatePicker, Table, Icon } from 'antd';
import * as common from '../../utils/common';
import Uploads from '../../components/common/Upload';
import CodeOption from '../common/CodeOption';
import Modals from '../common/modal/Modal';
import Lov from "../common/Lov";
import QaConsultModal from './QaConsultModal';
import * as service from '../../services/qa';
import * as codeService from '../../services/code';
import * as styles from '../../styles/qa.css';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout ={
    labelCol: { span: 9 },
    wrapperCol: { span: 8 },
};

function formatDay(oldDate) {
	var time = new Date(oldDate);
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y + '/' + add0(m) + '/' + add0(d);
}
function add0(m) {
	return m < 10 ? '0' + m : m
}

class QaConsult extends React.Component{
  state = {
    current: 1,
    orderCodes: [],
    consults: {},
    visible: false,
    consultId: '',
    conLines: [],
    code: {},
    personal: {},
  };

  componentWillMount() {
    //个人信息
    this.props.dispatch({
      type: 'qa/breadItemSave',
      payload: {breadItem: [{name:'问题咨询',url:'/#/qaBasic'}]},
    });
    this.props.dispatch({ type: 'qa/subMenuKeySave', payload: {subMenuKey: 'qaConsult'}, });
    service.fetchPersonal({channelId: JSON.parse(localStorage.user).relatedPartyId,}).then((data)=>{
      if(data.success){
        const personal = data.rows[0] || {};
        this.setState({personal});
      }
    });

    //获取问题类型块码
    codeService.getCode({
      questionTypes:'QA.QUESTION_TYPE',                     //问题类型
      phoneCodes: 'PUB.PHONE_CODE',                         //手机号前缀
    }).then((data)=>{
      this.setState({code: data,});
    });

    service.fetchConsult({userId: JSON.parse(localStorage.user).userId}).then((data)=>{
      if(data.success){
        this.setState({consults:data});
      }
    });
  }

  //信息提交
  submit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = this.props.form.getFieldsValue() || {};
        params.orderId = params.orderId? params.orderId.value : '';
        params.userId = JSON.parse(localStorage.user).userId;
        params.channelId = JSON.parse(localStorage.user).relatedPartyId;
        params.questionDate = new Date();
        params.answerStatus = 'N';
        params.solveFlag = 'N';

        //文件
        params.fileId = common.formatFile(this.props.form.getFieldValue('file'), true);

        service.consultSubmit(params).then((data)=>{
          if(data.success){
            service.fetchConsult({userId: JSON.parse(localStorage.user).userId}).then((data)=>{
              if(data.success){
                this.setState({consults:data});
              }
            });
            this.props.form.resetFields();
            Modals.success({content: '客服会尽快为您解决',});
          }else{
            Modals.error({content: data.message,});
          }
        });
      }else{
        Modals.error({content: '请正确填写完注册信息',});
      }
    });
  }

  handleReset =()=>{
    this.props.form.resetFields();
  }

  //打开弹出框
  openModal(record){
    const params = {consultId: record.consultId};
    this.props.dispatch({
      type: 'qa/fetchConLine',
      payload: {params},
    });
    this.setState({
      visible: true,
      consultId: record.consultId,
    });
  }


  //弹出框回调
  close(){
    service.fetchConsult({userId: JSON.parse(localStorage.user).userId}).then((data)=>{
      if(data.success){
        this.setState({consults:data});
      }
    });
    this.setState({visible: false,})
  }

  //分页
  tableChange(value){
    let params = {};
    params.userId = JSON.parse(localStorage.user).userId;
    params.page = value.current;
    params.pageSize = value.pageSize;
    service.fetchConsult(params).then((data)=>{
      if(data.success){
        this.setState({consults:data, current: value.current});
      }
    });
  }

  resetContactPhone (value){
    if(value){
      this.props.form.setFieldsValue({contactNumber:''}) ;
    }
  }


  render(){
    const { getFieldDecorator } = this.props.form;
    const orderCodes = this.state.orderCodes;
    const personal = this.state.personal || {};
    const questionTypes = this.state.code.questionTypes || [];

    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue:JSON.parse(localStorage.user).phoneCode,
    })(
      <CodeOption codeList={this.state.code.phoneCodes} width={130} onChange={this.resetContactPhone.bind(this)}/>
    );

    const dataSource = this.state.consults.rows || [];
    const columns = [{
        title: '提问时间',
        dataIndex: 'questionDate',
        key: 'questionDate',
        className:styles.text_center,
      },{
        title: '问题类型',
        dataIndex: 'questionType',
        key: 'questionType',
        className:styles.text_center,
        width:'12%',
        render: (text, record) => {
          if(text && this.state.code.questionTypes){
            for(let i in this.state.code.questionTypes){
              if(text == this.state.code.questionTypes[i].value){
                return this.state.code.questionTypes[i].meaning;
              }
            }
          }
        }
      }, {
        title: '问题描述',
        dataIndex: 'questionDescription',
        key: 'questionDescription',
        className:styles.text_center,
        width:'25%',
      }, {
          title: '答复状态',
          dataIndex: 'answerStatus',
          key: 'answerStatus',
          className:styles.text_center,
          width: 100,
          render: (text, record) =>{
            if(record.answerStatus == 'Y'){
              return <label>已答复</label>;
            }else{
              return <label>未答复</label>;
            }
          },
        }, {
          title: '操作',
          dataIndex: 'number',
          key: 'number',
          className:styles.text_center,
          width: 100,
          render: (text, record) =>{
            return <Button type="default" style={{fontSize:'14px',height:'32px'}} onClick={this.openModal.bind(this,record)}>点击查看</Button>;
          },
        }, {
        title: '是否解决',
        dataIndex: 'solveFlag',
        key: 'solveFlag',
        className:styles.text_center,
        render: (text, record) => {
          return(
            <div>{record.solveFlag == 'Y' ? '是' : '否'}</div>
          )
        }
      },{
        title: '最后答复时间',
        dataIndex: 'answerDate',
        key: 'answerDate',
        className:styles.text_center,
      }];
    return (
      <div style={{padding:'10px'}}>
        <Form className={styles.form_sty}>
          <FormItem {...formItemLayout} label="订单编号" >
            {getFieldDecorator('orderId', {
              initialValue:{value:'',meaning:''},
            })(
              <Lov title="订单编号" placeholder=" "
                lovCode='ORD_ORDERDETAIL'
                params ={{channelId:JSON.parse(localStorage.user).relatedPartyId}} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="签单日期" >
            {getFieldDecorator('orderDate', {
              rules: [],
            })(
              <DatePicker style={{width:'100%'}} placeholder=" "/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="问题类型" >
            {getFieldDecorator('questionType', {
              rules: [{
                required: true, message: '问题类型必输',
              }],
            })(
              <Select showSearch optionFilterProp="children" placeholder=" " >
                {
                  questionTypes &&
                  questionTypes.map((item)=>
                    <Option key={item.value} value={item.value}>{item.meaning}</Option>
                  )
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="联系人" >
            {getFieldDecorator('contactPersonName', {
              rules: [{ required: true, message: '请输入联系人', whitespace: true }],
              initialValue: personal.contactPerson || '',
            })(
              <Input placeholder=" " />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="电子邮箱">
            {getFieldDecorator('emailAddress', {
              rules: [{ required: true, message: '请输入电子邮箱', whitespace: true, type:'email'}],
              initialValue:personal.email || '',
            })(
              <Input placeholder=" " />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="电话号码" >
            {getFieldDecorator('contactNumber', {
              rules: [
                { required: true, message: '请输入电话号码', whitespace: true },
                { validator: common.checkPhone.bind(this) },
              ],
              initialValue:JSON.parse(localStorage.user).phone,
            })(
              <Input addonBefore={prefixSelector} placeholder=" " />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="问题描述" >
            {getFieldDecorator('questionDescription', {
              rules: [{ required: true, message: '请输入问题描述', whitespace: true }],
              initialValue:'',
            })(
              <Input
                type="textarea"
                className={styles['textarea']}
                rows={3}
                maxLength={75}
                placeholder=" " />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="上传附件" >
            {getFieldDecorator('file', {
              rules: [],
            })(
              <Uploads fileNum={1} modularName='QA'/>
            )}
          </FormItem>

          <FormItem>
            <Row span={24}>
              <Col span={9}></Col>
              <Col span={4}>
                <Button type="default" onClick={this.handleReset.bind(this)} style={{ width:120,height:'40px',float:'left'}}>重置</Button>
              </Col>
              <Col span={4}>
                <Button type="primary" onClick={this.submit.bind(this)} style={{ width:120,height:'40px',float:'right'}} >提交</Button>
              </Col>
            </Row>
          </FormItem>
        </Form>

        <hr style={{marginBottom:'2%'}}/>
        <div style={{paddingTop:'10px',fontWeigth:'border',fontSize:'20px'}}>您的问题清单：</div>
        <div style={{margin:'30px 0 30px 35%',fontSize:'16px'}}><Icon type="smile-o" /> 客服需要一段时间才能答复您，请耐心等待</div>

        <div style={{margin:'0 auto',width:'812px'}}>
          <QaConsultModal
            dispatch={this.props.dispatch}
            qa={this.props.qa}
            visible={this.state.visible}
            consultId={this.state.consultId}
            callback={this.close.bind(this)}/>
          <Table
            rowKey="consultId"
            columns={columns}
            dataSource={dataSource}
            bordered
            onChange={this.tableChange.bind(this)}
            pagination={{
              pageSize: 10,
              current: this.state.current || 1,
              total:this.state.consults.total || 0,
            }}/>
          </div>
      </div>
    );
  }
}

export default Form.create()(QaConsult);
