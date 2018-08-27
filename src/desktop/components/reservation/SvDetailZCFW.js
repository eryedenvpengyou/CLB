import React  , { Component } from 'react';
import { Form,DatePicker,Input,InputNumber,Row,Col,Select} from 'antd';
import moment from 'moment';
import {indexOf} from 'lodash';
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
      priceFlag: true,
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

  range(start, end) {
    const used = [0, 30], result = [];
    for (let i = start; i < end; i++) {
      if(indexOf(used, i) < 0){
        result.push(i);
      }
    }
    return result;
  }

  disabledDateTime() {
    return {
      disabledMinutes: () => this.range(0, 60),
    };
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

  //子产品种类改变
  onChange(value){
    this.state.productDetail.prdItemSublineList.map((data) => {
      if (value == data.sublineId) {
        if (isNaN(data.price)) {
          this.setState({priceFlag: false});
        } else {
          this.setState({priceFlag: true});
        }
        this.props.form.setFieldsValue({price: data.price});
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
    const detail = this.props.detail;
    const reserveContactPhoneCode = (
      getFieldDecorator('reserveContactPhoneCode', {
        initialValue:  detail.reserveContactPhoneCode || "86",
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
          <Form.Item label="预约路线" {...formItemLayout}>
            {getFieldDecorator('sublineId', {
              rules: [
                {required: true,message: '请选择预约路线',whitespace: true,type:'number'}
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
          <Form.Item label="预计价格" {...formItemLayout}>
            {getFieldDecorator('price', {
              initialValue: detail.price || '0.00',
            })(
              this.state.priceFlag ?
              <Input disabled addonBefore={<span style={{fontSize:'15px'}}>￥</span>} style={{width:'100%'}} />
              :
              <Input disabled />
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
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: moment('09:00', 'HH:mm'),
                  format: 'HH:mm'
                }}
                disabledTime={this.disabledDateTime.bind(this)}
                format="YYYY-MM-DD HH:mm"
                disabledDate={this.disabledStartDate.bind(this)}
                style={{width:"100%"}}
                placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="出发地" {...formItemLayout}>
            {getFieldDecorator('departure', {
              rules: [
                {required: true,message: '请输入出发地',whitespace: true,}
              ],
              initialValue: detail.departure || '',
            })(
              <Input disabled={detail.disableFlag} placeholder="请输入详细地址"/>
            )}
          </Form.Item>
          <Form.Item label="目的地" {...formItemLayout}>
            {getFieldDecorator('destination', {
              rules: [
                {required: true,message: '请输入目的地',whitespace: true,}
              ],
              initialValue: detail.destination || '',
            })(
              <Input disabled={detail.disableFlag} placeholder="请输入详细地址"/>
            )}
          </Form.Item>
          <Form.Item label="乘车总人数" {...formItemLayout}>
            {getFieldDecorator('peopleCount', {
              rules: [
                {required: true,message: '请输入乘车总人数',whitespace: true,type: 'number',},
                {pattern:/^[1-9]\d*$/, message:'请输入正整数'},
              ],
              initialValue: detail.peopleCount || '',
            })(
              <InputNumber disabled={detail.disableFlag} style={{width:"100%"}} placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="乘车联系人" {...formItemLayout}>
            {getFieldDecorator('reserveContactPerson', {
              rules: [
                {required: true,message: '请输入乘车联系人',whitespace: true,}
              ],
              initialValue: detail.reserveContactPerson || '',
            })(
              <Input disabled={detail.disableFlag} placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="乘车联系人电话" {...formItemLayout}>
            {getFieldDecorator('reserveContactPhone', {
              rules: [
                {required: true,message: '请输入乘车联系人电话',whitespace: true,},
                {validator: this.checkContactPhone.bind(this),}
              ],
              initialValue: detail.reserveContactPhone || '',
            })(
              <Input disabled={detail.disableFlag} addonBefore={reserveContactPhoneCode} style={{width:'100%'}} placeholder=' '/>
            )}
          </Form.Item>
          <Form.Item label="备注" {...formItemLayout}>
            {getFieldDecorator('reserveComment', {
              initialValue: detail.reserveComment || '',
            })(
              <Input type="textarea" className={styles['textarea-disableds']} disabled={detail.disableFlag}  placeholder="出发地选择香港机场，请备注  航班号 ，方便安排"/>
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
            <Row>1、本服务为收费服务，若客户购买任何保险产品，单张保单年缴保费≥10万美金或趸交保费≥50万美金，我司免费提供以上两次专车服务，超出两次专车接送另行收费。同一投保人两张及以上保单累计达以上金额不享受该免费服务。申请免费服务请务必在备注栏填写投保信息。</Row>
            <Row>2、如已享受以上专车服务的客户因各种原因未能投保成功及退保，我司将会补收该费用。</Row>
            <Row>3、所有增值服务以预约时信息为准，由于无预约、信息错误等产生的费用由客户承担，且过后不可以补办和报销。</Row>
            <Row>4、接送机自机场公布的航班到达时间接计，免费等60分钟，关口/酒店/码头等地点免费等30分钟，超出时间收费200-300/小时。</Row>
            <Row>5、节假日价格会有涨幅。</Row>
          </Col>
        </Row>
      </div>
    );
  }

  }

export default SvDetailHSYD;
