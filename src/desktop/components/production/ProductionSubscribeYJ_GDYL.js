import React from 'react';
import { Row, Col, Button, Select, Form, DatePicker, Input,InputNumber } from 'antd';
import { YLquery ,ordOrderSubmit,productionHeaderList} from '../../services/production';
import * as service from '../../services/order';
import { getCode } from '../../services/code';
import * as styles from '../../styles/qa.css';
import commonStyles from '../../styles/common.css';
import Lov from "../common/Lov";
import CustomerLov from "../common/CustomerLov";
import {indexOf} from 'lodash';
import TipModal from "../common/modal/Modal";
import Modals from '../common/modal/Modal';
import moment from "moment";

class ProductionSubscribeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //服务
      itemList:[],
      //医疗服务项目
      YLlist: [],
      //快码值
      codeList: {
        genderList: [],
        phoneCodeList: [],
        currencyList:[]
      },
      orderDetail:[],
      disableFlag:false,
    };
  }
  componentWillMount() {
    //获取快码值
    var body = {
      genderList: 'HR.EMPLOYEE_GENDER',
      phoneCodeList: "PUB.PHONE_CODE",
      currencyList: 'PUB.CURRENCY',
    };
    getCode(body).then((data)=>{
      this.setState({
        codeList: data
      });
    });
    //获取页面详情
    if(this.props.params.orderId){
      service.getOrdService({orderId: this.props.params.orderId}).then(data => {
          this.setState({
            orderDetail:data.rows[0]
          })
      })
    }
    //服务
    const param = {
     bigClass : "YJ", 
     enabledFlag : "Y", 
     page : 1, 
     pagesize : 999999999, 
     midClass : "GDYL" 
    }
    productionHeaderList(param).then((data)=>{
      if (data.success) {
        this.setState({
          itemList: data.rows
        });
        data.rows.map((item)=>{
          if(item.prdItemPaymode[0].itemId == this.props.itemId){
            this.props.form.setFieldsValue({
              itemId:item.prdItemPaymode[0].itemId,
              currency:item.prdItemPaymode[0].currencyCode
            })
          }
        })
      } else {
        TipModal.error({content:data.message});
        return;
      }
    })
    //医疗项目查询
    YLquery({ itemId: this.props.itemId }).then((data) => {
      if (data.success) {
        this.setState({
          YLlist: data.rows
        });
      }
    });
    if(this.props.params){
      if(this.props.params.status){//需复查
        if( this.props.params.status== 'NEED_REVIEW'){
          this.setState({disableFlag:false})
        }else{
          this.setState({ disableFlag: true })
        }
      } else if(JSON.stringify(this.props.params) == '{}'){
        this.setState({ disableFlag: false })
      }
    }
  }
  //页面返回
  goBack() {
    window.history.back();
  }
  //确认预约
  handleSubmit(e) {
    this.props.form.validateFields((err, value) => {
      if (!err) {
        //预约信息提交
        value.payMethod = 'WP';
        value.orderType = "MEDICALEDU";
        value.channelId = JSON.parse(localStorage.user).relatedPartyId;
        value.applicantCustomerId = value.applicantCustomerId.value;
        //提交日期
        value.submitDate = new Date().getFullYear() + '-'+ (new Date().getMonth()+1)+'-'+new Date().getDate()+ " " +
                            new Date().getHours() + ":" + new Date().getMinutes() + ":" + "00";
        //预约时间
        value.reserveDate = new Date(value.reserveDate).getFullYear() + '-'+ (new Date(value.reserveDate).getMonth()+1)+'-'+new Date(value.reserveDate).getDate()+ " " +
        new Date(value.reserveDate).getHours() + ":" + new Date(value.reserveDate).getMinutes() + ":" + "00";
        if(this.props.params && this.props.params.status == 'NEED_REVIEW'){
          value.status = 'NEED_REVIEW';
          value.hisStatus = 'NEED_REVIEW';
          value.orderId = this.props.params.orderId;
          value.orderNumber = this.props.params.orderNumber
        }else{
          value.status = 'APPROVING';
          value.hisStatus = 'APPROVING';
        }
        //value.vaccineCustomerAge = parseInt(value.vaccineCustomerAge)
        value.description = value.description == undefined?null:value.description

        ordOrderSubmit([value]).then((data) => {
          if (data.success) {
            TipModal.success({content:'预约资料已提交，请耐心等待审核！'});
            setTimeout(() => {
              location.hash = '/order/orderYJ';
            }, 3000);
          } else {
            TipModal.error({content:data.message});
            return;
          }
        });
      }
    })
  }
  //时间选择半小时化
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
    if (current) {
      var date = new Date();
      current = new Date(current);
      date = moment(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()),"YYYY-MM-DD");
      current = moment(current.getFullYear()+"-"+(current.getMonth()+1)+"-"+(current.getDate()),"YYYY-MM-DD")
      return date.valueOf() > current.valueOf();
    } else {
      return false;
    }
  }  
  codeChange (value){
    if(value == 1){
      this.props.form.setFieldsValue({customerPhone:''}) ;
    }else if(value == 2){
      this.props.form.setFieldsValue({reserveContactPhone:''}) ;
    }
  }

  //验证手机号
  checkPhone(rule, value, callback){
    let phoneCode = ''
    if(rule.field == 'customerPhone') {
      phoneCode = this.props.form.getFieldValue('customerPhoneCode')
    }else if(rule.field == 'reserveContactPhone'){
      phoneCode = this.props.form.getFieldValue('reserveContactPhoneCode')
    }
    let regex = /^\d{11}$/, msg='手机号位数不正确(大陆地区为11位)';

    if( phoneCode ==='00852' || phoneCode ==='00853' ){
      regex = /^\d{8}$/;
      msg='手机号位数不正确(港澳地区为8位)';
    }else if(phoneCode ==='00886' ){
      regex = /^\d{9}$/;
      msg='手机号位数不正确(台湾地区为9位)';
    }else if(phoneCode === '080'){
      regex = /^[0-9]*$/  //验证数字
      msg='请输入数字'
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
  itemChangeApplicantCustomer(value) {
    //客户（投保人）
    if (value && value.value && value.meaning && value.record) {
      value.record.age = null;
      if (value.record.birthDate) {
        value.record.age = new Date().getFullYear() - new Date(value.record.birthDate).getFullYear() + 1;
      }
      this.props.form.setFieldsValue({
        vaccineCustomerAge:value.record.age,
        vaccineCustomerSex: value.record.sex,
        customerPhone: value.record.phone,
      });
    }
  }
  //医疗服务项目
  handleChange(type,value) {
    switch(type){
      case 'FW':
        //医疗项目查询
        YLquery({ itemId: value }).then((data) => {
          if (data.success) {
            this.setState({
              YLlist: data.rows
            });
          }
        });
        this.state.itemList.map((data)=>{
          if( data.prdItemPaymode[0].itemId == value){
            this.props.form.setFieldsValue({
              currency:data.prdItemPaymode[0].currencyCode,
              sublineId:'',
              policyAmount:''
            })
          }
        })
      break;
      case 'YL':
        this.state.YLlist.map((data) => {
          if (value == data.sublineId) {
            this.props.form.setFieldsValue({ policyAmount: parseInt(data.price) });
          }
        });
    }
  }
  //取消订单
  cancelOrder(){
    Modals.warning(this.orderCancel.bind(this),"您确定取消订单吗？");
  }
  orderCancel(flag){
    if(flag){
      service.fetchCancelOrder({orderId:this.props.params.orderId}).then((data) => {
        if (data.success) {
          Modals.success({
            title: '取消成功！'
          });
          setTimeout(() => {
            location.hash = '/order/orderYJ';
          }, 3000);
        } else {
          Modals.error({
            title: '提交失败！',
            content: `请联系系统管理员,${data.message}`,
          });
        }
      });
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    //根据快码值生成下拉列表
    const genderOptions = this.state.codeList.genderList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    //服务
    const FWOptions = this.state.itemList.map((data) => {
      return <Select.Option key={data.itemId} value={data.itemId}>{data.itemName}</Select.Option>;
    });
    //服务医疗项目
    const YLOptions = this.state.YLlist.map((data) => {
      return <Select.Option key={data.sublineId} value={data.sublineId}>{data.sublineItemName}</Select.Option>;
    }); 
    //币种
    const CNOptions = this.state.codeList.currencyList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>;
    });
    const phoneCodeOptions = this.state.codeList.phoneCodeList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>;
    });
    const customerPhoneCode = (
      getFieldDecorator('customerPhoneCode', {
        initialValue:  this.state.orderDetail.customerPhoneCode?
        this.state.orderDetail.customerPhoneCode:
        JSON.parse(localStorage.user).phoneCode||"86",
      })(
        <Select className={styles.pre} disabled={this.state.disableFlag} onChange={this.codeChange.bind(this,1)} >
          {phoneCodeOptions}
        </Select>
      )
    );
    const reserveContactPhoneCode = (
      getFieldDecorator('reserveContactPhoneCode', {
        initialValue:  this.state.orderDetail.reserveContactPhoneCode?
        this.state.orderDetail.reserveContactPhoneCode:
        JSON.parse(localStorage.user).phoneCode||"86",
      })(
        <Select className={styles.pre} disabled={this.state.disableFlag} onChange={this.codeChange.bind(this,2)} >
          {phoneCodeOptions}
        </Select>
      )
    );
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 7 },
    };
    return (
      <div className={styles.disableds}>
        <Row style={{ paddingTop: '28px' }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item label="服务" {...formItemLayout}>
              {getFieldDecorator('itemId', {
                rules: [{
                  required: true,
                  message: '请选择服务项目',
                  whitespace: true,
                  type: 'number'
                }],
                 initialValue:this.state.orderDetail.itemId || ''
              })(
                <Select disabled={this.state.disableFlag} onChange={this.handleChange.bind(this, 'FW')} className={styles['select-disableds']}>
                  {FWOptions}
                </Select>
                )}
            </Form.Item>
            <Form.Item label="服务医疗项目" {...formItemLayout}>
              {getFieldDecorator('sublineId', {
                rules: [{
                  required: true,
                  message: '请选择服务医疗项目',
                  whitespace: true,
                  type: 'number'
                }],
                initialValue: this.state.orderDetail.sublineId || ''
              })(
                <Select disabled={this.state.disableFlag} onChange={this.handleChange.bind(this, 'YL')} className={styles['select-disableds']}>
                  {YLOptions}
                </Select>
                )}
            </Form.Item>
            <Form.Item label="预计价格" {...formItemLayout}>
              {getFieldDecorator('policyAmount', {
                rules: [{
                  whitespace: true,
                  type:'number'
                }],
                initialValue: this.state.orderDetail.policyAmount || ''
              })(
                <InputNumber disabled style={{ width: '100%', color: 'rgba(0, 0, 0, 0.65)' }} />
                )}
            </Form.Item>
            <Form.Item label="币种" {...formItemLayout}>
              {getFieldDecorator('currency', {
                rules: [{
                  whitespace: true,
                }],
                initialValue: this.state.orderDetail.currency || ''
              })(
                <Select disabled showArrow={false}
                  style={{ color: 'rgba(0, 0, 0, 0.65)' }}
                >
                  {CNOptions}
                </Select>
                )}
            </Form.Item>
            <Form.Item label="预约时间" {...formItemLayout}>
              {getFieldDecorator('reserveDate', {
                rules: [{
                  required: true,
                  message: '请选择预约时间',
                  whitespace: true,
                  type: 'object',
                }],
                initialValue: this.state.orderDetail.reserveDate ? moment(this.state.orderDetail.reserveDate, 'YYYY-MM-DD') : ''
              })(
                <DatePicker
                  showTime={
                    {
                      hideDisabledOptions: true,
                      defaultValue: moment('09:00', 'HH:mm'),
                      format: 'HH:mm'
                    }}
                  disabledDate={this.disabledStartDate.bind(this)}
                  disabledTime={this.disabledDateTime.bind(this)}
                  format="YYYY-MM-DD HH:mm"
                  disabled={this.state.disableFlag}
                  style={{ width: "100%" }} />
                )}
            </Form.Item>
            <Form.Item label="客户" {...formItemLayout}>
              {getFieldDecorator('applicantCustomerId', {
                rules: [{
                  required: true,
                  validator: (rule, value, callback) => {
                    if (value && (!value.value || !value.meaning)) {
                      callback('请选择客户');
                    } else {
                      callback();
                    }
                  }
                }],
                initialValue: { value: this.state.orderDetail.applicantCustomerId || '', meaning: this.state.orderDetail.applicant || '' },
              })(
                <CustomerLov disabled={this.state.disableFlag} placeholder="请选择客户" itemChange={this.itemChangeApplicantCustomer.bind(this)} lovCode='ORD_CUSTOMER' width="100%" />
                )}
            </Form.Item>
            <Form.Item label="年龄" {...formItemLayout}>
              {getFieldDecorator('vaccineCustomerAge', {
                rules: [{
                  required: true,
                  message: '请输入年龄',
                  whitespace: true,
                  type:'number'},
                  {pattern:/^[1-9]\d*$/, message:'请输入正整数'
                }],
                initialValue: this.state.orderDetail.vaccineCustomerAge || ''
              })(
                <InputNumber disabled={this.state.disableFlag} style={{ width: '100%' }} min={1} step={1} precision ={0} addonAfter={"岁"} />
                )}
            </Form.Item>
            <Form.Item label="性别" {...formItemLayout}>
              {getFieldDecorator('vaccineCustomerSex', {
                rules: [{
                  required: true,
                  message: '请选择性别',
                  whitespace: true,
                }],
                initialValue: this.state.orderDetail.vaccineCustomerSex || ''
              })(
                <Select disabled={this.state.disableFlag} className={styles['select-disableds']}>
                  {genderOptions}
                </Select>
                )}
            </Form.Item>
            <Form.Item label="联系电话" {...formItemLayout}>
              {getFieldDecorator('customerPhone', {
                rules: [{
                  required: true,
                  message: '请输入联系电话',
                  whitespace: true,
                },{validator: this.checkPhone.bind(this)}],
                initialValue: this.state.orderDetail.customerPhone || ''
              })(
                <Input disabled={this.state.disableFlag} addonBefore={customerPhoneCode} style={{ width: '100%' }} />
                )}
            </Form.Item>
            <Form.Item label="通行证号码" {...formItemLayout}>
              {getFieldDecorator('vaccineCustomerPass', {
                rules: [{
                  required: true,
                  message: '请输入通行证号码',
                  whitespace: true,
                }],
                initialValue: this.state.orderDetail.vaccineCustomerPass || ''
              })(
                <Input disabled={this.state.disableFlag}/>
                )}
            </Form.Item>
            <Form.Item label="对接联系人" {...formItemLayout}>
              {getFieldDecorator('reserveContactPerson', {
                rules: [{
                  required: true,
                  message: '请输入对接联系人',
                  whitespace: true,
                }],
                initialValue: JSON.parse(localStorage.user).userName || ''
              })(
                <Input disabled={this.state.disableFlag}/>
                )}
            </Form.Item>
            <Form.Item label="对接人联系人电话" {...formItemLayout}>
              {getFieldDecorator('reserveContactPhone', {
                rules: [{
                  required: true,
                  message: '请输入对接人联系人电话',
                  whitespace: true
                },{validator: this.checkPhone.bind(this)}],
                initialValue: JSON.parse(localStorage.user).phone || ''
              })(
                <Input disabled={this.state.disableFlag} addonBefore={reserveContactPhoneCode} style={{ width: '100%' }} />
                )}
            </Form.Item>
            <Form.Item label="对接联系人微信号" {...formItemLayout}>
              {getFieldDecorator('reserveContactWecharNumber', {
                rules: [{
                  required: true,
                  message: '请输入对接联系人微信号',
                  whitespace: true,
                }],
                initialValue: this.state.orderDetail.reserveContactWecharNumber || ''
              })(
                <Input disabled={this.state.disableFlag}/>
                )}
            </Form.Item>
            <Form.Item label="备注" {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: this.state.orderDetail.description || ''
              })(
                <textarea className={styles['textarea-disableds']} disabled={this.state.disableFlag} placeholder="可为空" style={{ width: "100%", padding: "0 5px",fontSize:'16px' }} />
                )}
            </Form.Item>
            <Form.Item
              wrapperCol={{
                xs: { span: 7, offset: 9 },
                sm: { span: 7, offset: 9 },
              }}
            >
              <Row style={{ textAlign: 'center' }}>
                {
                  JSON.stringify(this.props.params) == '{}'?
                  <Button type="default" disabled={this.state.disabled} style={{ width: '120px', height: '40px', marginRight: '80px' }} onClick={this.goBack.bind(this)}>取消</Button>:

                  this.props.params.prePage == 'personal'&&
                  this.props.params.status != 'FINISH' && this.props.params.status != 'RESERVE_CANCELLED'
                  ?
                  <Button type="default" disabled={this.state.disabled} style={{ width: '120px', height: '40px', marginRight: '80px' }} onClick={this.cancelOrder.bind(this)}>取消</Button>:''
                }
                {
                  JSON.stringify(this.props.params) == '{}'?

                  <Button type="primary" id="submitBtn" disabled={this.state.disabled} style={{ width: '120px', height: '40px' }} onClick={this.handleSubmit.bind(this)}>提交</Button>:
                  
                  this.props.params.prePage == 'personal'&& !this.state.disableFlag &&
                  <Button type="primary" id="submitBtn" disabled={this.state.disabled} style={{ width: '120px', height: '40px' }} onClick={this.handleSubmit.bind(this)}>提交</Button>
                }
              </Row>
            </Form.Item>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Form.create()(ProductionSubscribeComponent);
