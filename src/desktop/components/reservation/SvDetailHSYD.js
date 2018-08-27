import React  , { Component } from 'react';
import {Form,DatePicker,Input,InputNumber,Row,Col,Select } from 'antd';
import moment from 'moment';
import Lov from "../common/Lov";
import CodeOption from "../common/CodeOption";
import SvFooter from "./SvFooter";
import SvHeader from "./SvHeader";
import Modals from '../common/modal/Modal';
import * as service from '../../services/reservation';
import * as codeService from '../../services/code';
import * as styles from '../../styles/qa.css';
import CustomerLov from "../common/CustomerLov";

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {xs: { span: 9 }, sm: { span: 9 }, },
  wrapperCol: {xs: { span: 8 }, sm: { span: 8 }, },
};
const tailFormItemLayout = {
  wrapperCol: {xs: {span: 8,offset: 9,}, sm: {span: 8,offset: 9,}, },
};


class SvDetailHSYD extends Component {
  constructor(props){
    super(props);
    this.state = {
      detail: this.props.detail || {},
      productDetail: {},
      code: {},
    }
  }

  componentWillMount(){
    service.productionDetail({itemId: this.props.itemId}).then((data) => {
      if (data.success) {
        this.setState({productDetail: data.rows[0] || {} });
      } else {
        Modals.error({content:data.message});
      }
    });

    codeService.getCode({phoneCodes: 'PUB.PHONE_CODE'}).then((data)=>{
      this.setState({code: data});
    });

    const detail = this.props.detail;
    if(detail.price){
      if(!isNaN(detail.price)){
        detail.price = detail.price ;
      }else{
        this.setState({priceFlag: false})
      }
    }
  }

  //验证对接人手机号
  checkContactPhone(rule, value, callback){
    let phoneCode = this.props.form.getFieldValue('reserveContactPhoneCode')
    let regex = /^\d{11}$/, msg='手机号位数不正确(大陆地区为11位)';

    if( phoneCode ==='00852' || phoneCode ==='00853' ){
      regex = /^\d{8}$/;
      msg='手机号位数不正确(港澳地区为8位)';
    }else if(phoneCode ==='00886' ){
      regex = /^\d{9}$/;
      msg='手机号位数不正确(台湾地区为9位)';
    }

    if ( value && !regex.test(value)  ) {
      if(typeof callback === 'function') {
        callback(msg);
      }
    } else {
      if(typeof callback === 'function') {
        callback();
      }
    }
  }
  resetContactPhone (value){
    if(value){
      this.props.form.setFieldsValue({reserveContactPhone:''}) ;
    }
  }

  //第一个按钮对应的函数
  callback1(){
    this.props.callback1(this.state.detail);
  }

  //第二个按钮对应的 函数
  callback2(){
    const status = this.state.detail.status || '';
    this.props.callback2(status);
  }

  //不可选日期
  disabledStartDate(current) {
    if(!current){
      return false;
    }
    var date = new Date();
    current = new Date(current);
    date = moment(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()),"YYYY-MM-DD");
    current = moment(current.getFullYear()+"-"+(current.getMonth()+1)+"-"+(current.getDate()),"YYYY-MM-DD")
    return date.valueOf() > current.valueOf();
  }

  //使用时长
  handleChangeUserHour(e) {
    //使用时长--改变价格
    if (this.props.form.getFieldValue("sublineId")) {
      this.state.productDetail.prdItemSublineList.map((data) => {
        if (data.sublineId == this.props.form.getFieldValue("sublineId")) {
          this.props.form.setFieldsValue({price:data.price*Number(e)});
        }
      });
    } else {
      this.props.form.setFieldsValue({price:"0.00"});
    }
  }

  //子产品改变
  onChange(e) {
    //会所位置--改变价格
    this.state.productDetail.prdItemSublineList.map((data) => {
      if (data.sublineId == e) {
        this.props.form.setFieldsValue({price:data.price*Number(this.props.form.getFieldValue("userHour"))});
      }
    });
  }

  customerLovChange(value){
    //客户（投保人）
    if (value && value.value && value.meaning && value.record) {

      //当所选的客户是新增的 就清空保单订单编号字段
      if(value.record.addStatus === "add"){
        this.props.form.setFieldsValue({relatedOrderId: {value:'',meaning:''}});
      }

    }
  }




  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const detail = this.props.detail, disableFlag = this.props.detail.disableFlag;
    const reserveContactPhoneCode = (
      getFieldDecorator('reserveContactPhoneCode', {
        initialValue: detail.reserveContactPhoneCode || "86",
      })(
        <CodeOption className={styles.pre} disabled={detail.disableFlag} codeList={this.state.code.phoneCodes} onChange={this.resetContactPhone.bind(this)} width='120px'/>
      )
    );

    return (
      <div className={styles.disableds}>
        <Form>
          <SvHeader detail={detail} reload={this.props.reload}/>
          {
            JSON.parse(localStorage.user).userType == "ADMINISTRATION" &&
            <div>
              <Form.Item label="渠道" {...formItemLayout}>
                {getFieldDecorator('channelId', {
                  rules: [{
                    required: true,
                    validator: (rule,value,callback) => {
                      if (value && (!value.value || !value.meaning)) {
                        callback('请选择渠道');
                      } else {
                        callback();
                      }
                    }
                  }],
                  initialValue: {value: detail.channelId || JSON.parse(localStorage.user).relatedPartyId, meaning: detail.channelName || ''},
                })(
                  <Lov title="选择渠道" disabled={detail.disableFlag} lovCode='CNL_AGENCY_NAME' params ={{userId:JSON.parse(localStorage.user).userId}} />
                )}
              </Form.Item>
            </div>
          }
          <Form.Item label="客户" {...formItemLayout}>
            {getFieldDecorator('applicantCustomerId', {
              rules: [{
                required: true,
                validator: (rule,value,callback) => {
                  if (value && (!value.value || !value.meaning)) {
                    callback('请选择客户');
                  } else {
                    callback();
                  }
                }
              }],
              initialValue: {value: detail.applicantCustomerId || '', meaning: detail.applicant || ''},
            })(
              <CustomerLov
                disabled={detail.disableFlag}
                suffix={true}
                lovCode='ORD_CUSTOMER'
                params ={{
                  channelId:getFieldValue('channelId') ? getFieldValue('channelId').value:JSON.parse(localStorage.user).relatedPartyId,
                  orderId:getFieldValue('relatedOrderId') ? getFieldValue('relatedOrderId').value :'',
                }}
                title="选择客户"
                placeholder=" "
                itemChange={this.customerLovChange.bind(this)}
              />
            )}
          </Form.Item>
          <Form.Item label="保单订单编号" {...formItemLayout}>
            {getFieldDecorator('relatedOrderId', {
              initialValue: {value: detail.relatedOrderId || '', meaning: detail.relatedOrderNumber || ''},
            })(
              <Lov
                disabled={detail.disableFlag}
                suffix={true}
                lovCode='ORD_ORDERDETAIL'
                params ={{
                  channelId: getFieldValue('channelId') ? getFieldValue('channelId').value:JSON.parse(localStorage.user).relatedPartyId,
                  orderType: 'INSURANCE',
                  customerId: getFieldValue('applicantCustomerId') ? getFieldValue('applicantCustomerId').value :'',
                }}
                title="选择保单订单编号"
                placeholder=" "
              />
            )}
          </Form.Item>
          <Col sm={8} md={8} offset={9} style={{fontSize:"12px",color:"#9c9c9c",top:"-16px"}}>
            如果客户当天同时预约了赴港签单，请输入保单订单编号，方便工作人员合理安排行程。
          </Col>
          <Form.Item label="会所位置" {...formItemLayout}>
            {getFieldDecorator('sublineId', {
              rules: [
                {required: true,message: '请选择会所位置',whitespace: true,type:'number'}
              ],
              initialValue: detail.sublineId || '',
            })(
              <Select
                disabled={detail.disableFlag}
                onChange={this.onChange.bind(this)}
                placeholder=" "
                className={styles['select-disableds']}>
                {
                  this.state.productDetail.prdItemSublineList &&
                  this.state.productDetail.prdItemSublineList.map((item) =>
                    <Select.Option value={item.sublineId} key={item.sublineId}>{item.sublineItemName}</Select.Option>
                  )
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item label="使用时长" {...formItemLayout}>
            {getFieldDecorator('userHour', {
              rules: [
                {required: true,message: '请选择使用时长',whitespace: true,}
              ],
              initialValue: detail.userHour || '2',
            })(
              <Select
                disabled={detail.disableFlag}
                onChange={this.handleChangeUserHour.bind(this)}
                placeholder=" "
                className={styles['select-disableds']}>

                <Select.Option key="2" value="2">2h</Select.Option>
                <Select.Option key="3" value="3">3h</Select.Option>
                <Select.Option key="4" value="4">4h</Select.Option>
                <Select.Option key="5" value="5">5h</Select.Option>
                <Select.Option key="6" value="6">6h</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="价格" {...formItemLayout}>
            {getFieldDecorator('price', {
              initialValue: detail.price || '0.00',
            })(
              <Input disabled addonBefore={<span style={{fontSize:'15px'}}>￥</span>} style={{width:'100%'}}/>
            )}
          </Form.Item>
          <Form.Item label="预约时间" {...formItemLayout}>
            {getFieldDecorator('reserveDate', {
              rules: [
                {required: true,message: '请选择预约时间',whitespace: true,type:'object'}
              ],
              initialValue:detail.reserveDate? moment(detail.reserveDate, 'YYYY-MM-DD HH:mm') : '',
            })(
              <DatePicker
                disabled={detail.disableFlag}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                disabledDate={this.disabledStartDate.bind(this)}
                style={{width:"100%"}}
                placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="人数" {...formItemLayout}>
            {getFieldDecorator('peopleCount', {
              rules: [
                {required: true,message: '请输入人数',whitespace: true,type:'number'},
                {pattern:/^[1-9]\d*$/, message:'请输入正整数'},
              ],
              initialValue: detail.peopleCount || '',
            })(
              <InputNumber min={0} disabled={detail.disableFlag} style={{width:'100%'}} placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="预约对接人" {...formItemLayout}>
            {getFieldDecorator('reserveContactPerson', {
              rules: [
                {required: true,message: '请输入预约对接人',whitespace: true,}
              ],
              initialValue: detail.reserveContactPerson || JSON.parse(localStorage.user).userName,
            })(
              <Input disabled={detail.disableFlag} placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="对接人电话" {...formItemLayout}>
            {getFieldDecorator('reserveContactPhone', {
              rules: [
                {required: true,message: '请输入对接人电话',whitespace: true,},
                {validator: this.checkContactPhone.bind(this),}
              ],
              initialValue: detail.reserveContactPhone || JSON.parse(localStorage.user).phone,
            })(
              <Input disabled={detail.disableFlag} addonBefore={reserveContactPhoneCode} style={{width:'100%'}} placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="备注" {...formItemLayout}>
            {getFieldDecorator('reserveComment', {
              initialValue: detail.reserveComment || '',
            })(
              <Input type="textarea" className={styles['textarea-disableds']} disabled={detail.disableFlag}  placeholder=" "/>
            )}
          </Form.Item>

          <FormItem  {...tailFormItemLayout} label=''>
            <SvFooter
              detail={detail}
              callback1={this.callback1.bind(this)}
              callback2={this.callback2.bind(this)}/>
          </FormItem>
        </Form>

        <Row>
          <Col xs={22} sm={22} md={22} lg={22} xl={22} offset={1} className={styles.productSubscribeReminder} style={{paddingTop:"28px",marginBottom:'30px'}}>
            温馨提示：
            <Row>1、会所的预订时长2h起订，使用时长低于2h，按2h的收费标准计算。</Row>
            <Row>2、会所的收费标准：会议室 ￥300/h   VIP室 ￥150/h</Row>
          </Col>
        </Row>
      </div>
    );
  }

  }

export default SvDetailHSYD;
