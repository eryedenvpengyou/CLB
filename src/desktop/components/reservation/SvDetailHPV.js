import React  , { Component } from 'react';
import {Form,DatePicker,Input,InputNumber,Col,Select,Row} from 'antd';
import moment from 'moment';
import {indexOf} from 'lodash';
import Lov from "../common/Lov";
import CodeOption from "../common/CodeOption";
import SvFooter from "./SvFooter";
import SvHeader from "./SvHeader";
import Modals from '../common/modal/Modal';
import * as service from '../../services/reservation';
import * as codeService from '../../services/code';
import CustomerLov from "../common/CustomerLov";
import * as styles from '../../styles/qa.css';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 9 },
    sm: { span: 9 },
  },
  wrapperCol: {
    xs: { span: 8 },
    sm: { span: 8 },
  },
};


class SvDetailHSYD extends Component {
  constructor(props){
    super(props);
    this.state = {
      detail: this.props.detail || {},
      timesFlag: true,
      customerFlag: false,
      productDetail: {},
      code: {},
      priceFlag: true,
      startValue: null,
      endValue: null,
      birthDate:''
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
      if(isNaN(detail.price)){
        this.setState({priceFlag: false});
      }else{
        this.setState({priceFlag: false})
      }
    }
  }

  //验证客户手机号
  checkCustomerPhone(rule, value, callback){
    let phoneCode = this.props.form.getFieldValue('customerPhoneCode')
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
  resetCustomerPhone (value){
    if(value){
      this.props.form.setFieldsValue({customerPhone:''}) ;
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



  //第几次改变
  timesChange(value) {
    if(value == '1') {
      this.setState({timesFlag: true});
      const sublineId = this.props.form.getFieldValue('sublineId');
      if(sublineId){
        this.state.productDetail.prdItemSublineList.map((data) => {
          if (sublineId == data.sublineId) {
            if (isNaN(data.price)) {
              this.setState({priceFlag: false});
            } else {
              this.setState({priceFlag: true},()=>{
                 this.props.form.setFieldsValue({price: data.price+''});
              });
            }
          }
        });
      }
    } else {
      this.setState({timesFlag: false});
    }
  }

  //子产品改变
  onChange(value){
    this.state.productDetail.prdItemSublineList.map((data) => {
      if (value == data.sublineId) {
        if (isNaN(data.price)) {
          this.setState({priceFlag: false});
        } else {
          this.setState({priceFlag: true});
        }
        this.props.form.setFieldsValue({price: data.price+''});
      }
    });
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
  range1(start, end) {
    const used = [10,11,12,13,14,15,16,17,18], result = [];
    for (let i = start; i < end; i++) {
      if(indexOf(used, i) < 0){
        result.push(i);
      }
    }
    return result;
  }
  disabledDateTime() {
    return {
      disabledHours: () => this.range1(0,24),
      disabledMinutes: () => this.range(0, 60),
    };
  }

  //不可选日期
  disabledStartDate(startValue) {
    var endValue = this.state.endValue;
    var date = new Date();
    var date1 = new Date(startValue);
    date = moment(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate()), "YYYY-MM-DD");
    if(!startValue){
      return false;
    } else{
      if ( date.valueOf() > startValue.valueOf() ||  date1.getDay() == 0 ||  date1.getDay() == 6 ) {
        return startValue.valueOf()
      }
    }
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue || this.props.form.getFieldValue('reserveDate');
  
    var date1 = new Date(endValue);
    if (!endValue || !startValue) {
      return false;
    }else{
      if (  startValue.valueOf()>endValue.valueOf() ||  date1.getDay() == 0 ||  date1.getDay() == 6 ) {
        return endValue.valueOf() 
      }
    }
  }
  onChange = (field, value) => {
    this.setState({ [field]: value })
  }
  onStartChange = (value) => {
    this.props.form.setFieldsValue({reserveEndDate: '' });
    this.onChange('startValue', value);
  }
  onEndChange = (value) => {
    this.onChange('endValue', value);
  }
  //生日不可选日期
  disabledBirthDate(current){
    if(!current){
      return false;
    }
    var date = new Date();
    current = new Date(current);
    date = moment(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()),"YYYY-MM-DD");
    current = moment(current.getFullYear()+"-"+(current.getMonth()+1)+"-"+(current.getDate()),"YYYY-MM-DD")
    return date.valueOf() < current.valueOf();
  }
  channelLovChange(value){
    //渠道
    if (value && value.value && value.meaning && value.record) {

      if(value.record.channelName){
        this.props.form.setFieldsValue({reserveContactPerson: value.record.channelName });
      }else{
        this.props.form.setFieldsValue({reserveContactPerson: '' });
      }

      if(value.record.phoneCode){
        this.props.form.setFieldsValue({reserveContactPhoneCode: value.record.phoneCode });
        this.props.form.setFieldsValue({reserveContactPhone: value.record.phone });
      }else{
        this.props.form.setFieldsValue({reserveContactPhoneCode: '' });
        this.props.form.setFieldsValue({reserveContactPhone: '' });
      }

    }
  }



  customerLovChange(value){
    //客户（投保人）
    if (value && value.value && value.meaning && value.record) {
      value.record.age = null;
      if(value.record.certificateType === 'PERMIT'){
        this.props.form.setFieldsValue({vaccineCustomerPass: value.record.certificateNumber });
      }else{
        this.props.form.setFieldsValue({vaccineCustomerPass: '' });
      }
      this.props.form.setFieldsValue({
        vaccineCustomerName: value.record.chineseName,
        //vaccineCustomerAge: value.record.age,
        vaccineCustomerSex: value.record.sex,
        customerPhoneCode: value.record.phoneCode,
        customerPhone: value.record.phone,
      });
      this.state.birthDate = value.record.birthDate? moment(value.record.birthDate).format('YYYY-MM-DD') : null;
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
    const customerPhoneCode = (
      getFieldDecorator('customerPhoneCode', {
        initialValue:  detail.customerPhoneCode || "86",
      })(
        <CodeOption className={styles.pre} disabled={detail.disableFlag} codeList={this.state.code.phoneCodes} onChange={this.resetCustomerPhone.bind(this)} width='120px'/>
      )
    );
    const commonPhoneCode = (
      getFieldDecorator('commonPhoneCode', {
        initialValue:  detail.commonPhoneCode || '',
      })(
        <CodeOption className={styles.pre} disabled={detail.disableFlag} codeList={this.state.code.phoneCodes} placeholder=" " width='120px'/>
      )
    );
    const { startValue, endValue } = this.state;
    return (
      <div className={styles.disableds}>
        <Form>
          <SvHeader detail={detail} reload={this.props.reload}/>
          {
            JSON.parse(localStorage.user).userType === "ADMINISTRATION" &&
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
                  <Lov
                    title="选择渠道"
                    disabled={detail.disableFlag}
                    lovCode='CNL_AGENCY_NAME'
                    params ={{userId:JSON.parse(localStorage.user).userId}}
                    itemChange={this.channelLovChange.bind(this)}
                  />
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
                  customerId: getFieldValue('applicantCustomerId')? getFieldValue('applicantCustomerId').value : null,
                }}
                title="选择保单订单编号"
                placeholder=" "
              />
            )}
          </Form.Item>
          <Col sm={8} md={8} offset={9} style={{fontSize:"12px",color:"#9c9c9c",top:"-16px"}}>
            如果客户当天同时预约了赴港签单，请输入保单订单编号，方便工作人员合理安排行程。
          </Col>
          <Form.Item label="出生日期" {...formItemLayout}>
            {getFieldDecorator('birthDate', {
              rules: [{ type: 'object', required: true, message: '请选择出生日期' }],
              initialValue:
              this.state.birthDate? moment(this.state.birthDate, 'YYYY-MM-DD') :
              detail.birthDate ? moment(detail.birthDate, 'YYYY-MM-DD') : '',
            })(
              <DatePicker
               disabled={detail.disableFlag}
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
                placeholder="请选择或输入出生日期，例如1990-01-01"
                disabledDate={this.disabledBirthDate.bind(this)}
              />
              )}
          </Form.Item>
          <Form.Item label="性别" {...formItemLayout}>
            {getFieldDecorator('vaccineCustomerSex', {
              rules: [
                {required: true,message: '请选择性别',whitespace: true,}
              ],
              initialValue: detail.vaccineCustomerSex || '',
            })(
              <Select disabled={detail.disableFlag} placeholder=" " className={styles['select-disableds']}>
                <Select.Option value="M">男</Select.Option>
                <Select.Option value="F">女</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="联系电话" {...formItemLayout}>
            {getFieldDecorator('customerPhone', {
              rules: [
                {required: true,message: '请输入联系电话',whitespace: true,},
                {validator: this.checkCustomerPhone.bind(this),}
              ],
              initialValue: detail.customerPhone || '',
            })(
              <Input disabled={detail.disableFlag} addonBefore={customerPhoneCode} style={{width:'100%'}}/>
            )}
          </Form.Item>
          <Form.Item label="证件号/通行证号" {...formItemLayout}>
            {getFieldDecorator('vaccineCustomerPass', {
              rules: [
                {required: true,message: '请输入证件号/通行证号',whitespace: true,},
                {pattern:/^[A-Za-z0-9]+$/, message:'请输入英文字母或数字'},
              ],
              initialValue: detail.vaccineCustomerPass || '',
            })(
              <Input disabled={detail.disableFlag}/>
            )}
          </Form.Item>
          <Form.Item label="第几次注射疫苗" {...formItemLayout}>
            {getFieldDecorator('vaccineCustomerTimes', {
              rules: [
                {message: '请选择第几次注射疫苗',whitespace: true}
              ],
              initialValue: detail.vaccineCustomerTimes || '',
            })(
              <Input disabled={detail.disableFlag}/>
            )}
          </Form.Item>
          <Form.Item label="疫苗种类" {...formItemLayout}>
            {getFieldDecorator('sublineId', {
              rules: [
                {required: true,message: '请选择疫苗种类',whitespace: true,type:'number'}
              ],
              initialValue: detail.sublineId || '',
            })(
              <Select
                disabled={detail.disableFlag}
                placeholder=" "
                onChange={this.onChange.bind(this)}
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
          <Form.Item label="价格" {...formItemLayout}>
            {getFieldDecorator('price', {
              initialValue: detail.price || '0.00',
            })(
              this.state.priceFlag ?
              <Input disabled addonBefore={<span style={{fontSize:'15px'}}>￥</span>} style={{width:'100%'}} />
              :
              <Input disabled />
            )}
          </Form.Item>
          <div style={{ position: 'relative' }}>
            <Form.Item label="预约疫苗注射时间段" {...formItemLayout}>
              {getFieldDecorator('reserveDate', {
                rules: [
                  { required: true, message: '请选择预约疫苗注射时间', whitespace: true, type: 'object', },
                ],
                initialValue: detail.reserveDate ? moment(detail.reserveDate, 'YYYY-MM-DD HH:mm') : '',
              })(
                <DatePicker
                  disabled={detail.disableFlag}
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: moment('10:00', 'HH:mm'),
                    format: 'HH:mm'
                  }}
                  disabledTime={this.disabledDateTime.bind(this)}
                  format="YYYY-MM-DD HH:mm"
                  disabledDate={this.disabledStartDate.bind(this)}
                  setFieldsValue={startValue}
                  onChange={this.onStartChange}
                  style={{width: '48%', marginRight: '4%'}}
                  />
                )}
            </Form.Item>
            <span style={{ position: 'absolute', top: '7px', left: '621px' }}>-</span>
            <Form.Item {...formItemLayout} style={{ position: 'absolute', width: '100%', top: '0', left: '634px' }}>
              {getFieldDecorator('reserveEndDate', {
                rules: [{
                  required: true,
                  message: '请选择预约疫苗注射时间', whitespace: true, type: 'object'
                }],
                initialValue: detail.reserveEndDate ? moment(detail.reserveEndDate, 'YYYY-MM-DD HH:mm') : ''
              })(
                <DatePicker
                  disabledDate={this.disabledEndDate.bind(this)}
                  disabled={detail.disableFlag}
                  disabledTime={this.disabledDateTime.bind(this)}
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: moment('10:00', 'HH:mm'),
                    format: 'HH:mm'
                  }}
                  format="YYYY-MM-DD HH:mm"
                  setFieldsValue={endValue}
                  onChange={this.onEndChange}
                  style={{ width: '48%' }}
                />
                )}
            </Form.Item>
          </div>
          <Form.Item label="预约对接人" {...formItemLayout}>
            {getFieldDecorator('reserveContactPerson', {
              rules: [
                {required: true,message: '请输入预约对接人',whitespace: true,}
              ],
              initialValue: detail.reserveContactPerson || JSON.parse(localStorage.user).userName,
            })(
              <Input disabled={detail.disableFlag} />
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
              <Input disabled={detail.disableFlag} addonBefore={reserveContactPhoneCode} style={{width:'100%'}}/>
            )}
          </Form.Item>
          <Form.Item label="备注" {...formItemLayout}>
            {getFieldDecorator('reserveComment', {
              initialValue: detail.reserveComment || '',
            })(
              <Input type="textarea" className={styles['textarea-disableds']} disabled={detail.disableFlag} placeholder='如有过敏史或严重病史，也请说明'/>
            )}
          </Form.Item>

          {/*预约确认信息*/}
          {
            detail.disableFlag && (detail.status === 'WAIT_PAY' || detail.status === 'RESERVE_SUCCESS') &&
            (detail.commonName || detail.commonPhone ||  detail.commonAddr || detail.commonRemark )&&
            <div style={{borderTop:'1px solid #E9E9E9',marginTop:'30px'}}>
              <div style={{fontFamily: 'Microsoft YaHei',fontSize:'20px',textAlign:'center',margin:'20px'}}>预约确认信息</div>
              <Form.Item label="诊所名称" {...formItemLayout}>
                {getFieldDecorator('commonName', {
                  initialValue: detail.commonName || '',
                })(
                  <Input disabled={detail.disableFlag} />
                )}
              </Form.Item>
              <Form.Item label="诊所电话" {...formItemLayout}>
                {getFieldDecorator('commonPhone', {
                  initialValue: detail.commonPhone || '',
                })(
                  <Input disabled={detail.disableFlag} addonBefore={commonPhoneCode} style={{width:'100%'}}/>
                )}
              </Form.Item>
              <Form.Item label="诊所地址" {...formItemLayout}>
                {getFieldDecorator('commonAddr', {
                  initialValue: detail.commonAddr || '',
                })(
                  <Input disabled={detail.disableFlag} />
                )}
              </Form.Item>
              <Form.Item label="备注" {...formItemLayout}>
                {getFieldDecorator('commonRemark', {
                  initialValue: detail.commonRemark || '',
                })(
                  <Input type="textarea" className={styles['textarea-disableds']} disabled={detail.disableFlag} />
                )}
              </Form.Item>
            </div>
          }


          <FormItem  wrapperCol={ {sm: {span: 8,offset: 9}} }>
            <SvFooter
              detail={detail}
              callback1={this.callback1.bind(this)}
              callback2={this.callback2.bind(this)}/>
          </FormItem>
        </Form>
        <Row>
          <Col xs={22} sm={22} md={22} lg={22} xl={22} offset={1} className={styles.productSubscribeReminder} style={{ paddingTop: "28px", marginBottom: '30px' }}>
            温馨提示：
            <Row>1、接种工作时间如下，非工作时间不接受预约<br/>
                周一至周五：上午10:00-13:00，下午14:00-18:00<br/>
                周六、日及法定节假日休息。</Row>
            
            <Row>2、免责说明<br/>具体预约时间视预约诊所而定，建议提前抵达诊所做准备，如遇诊所接客高峰时期可能导致客户等待，敬请谅解！</Row>
          </Col>
        </Row>

      </div>
    );
  }

  }

export default SvDetailHSYD;
