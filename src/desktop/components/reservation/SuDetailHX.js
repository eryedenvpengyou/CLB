import React  , { Component } from 'react';
import { Button,Form,DatePicker,Input,Cascader,InputNumber,Row,Col,Modal,Select} from 'antd';
import Lov from "../common/Lov";
import CodeOption from "../common/CodeOption";
import SuFooter from "./SuFooter";
import SuHeader from "./SuHeader";
import Modals from '../common/modal/Modal';
import * as styles from '../../styles/sys.css';
import * as codeService from '../../services/code';
import pcCascade from '../../utils/common';
import moment from 'moment';

const RangePicker = DatePicker.RangePicker;
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


class SuDetailHX extends Component {
  constructor(props){
    super(props);
    this.state = {
      detail:{},
      statusFlag: '',
      code: {},
      options:[],
      phoneVisible: false,
      phoneVisibleNow: false,
    }
  }

  componentWillMount(){
    let params ={
      nationalList: 'PUB.NATION',                           //国籍
      provinceList: 'PUB.PROVICE',                          //省份
      cityList: 'PUB.CITY',                                 //城市
      phoneCodes: 'PUB.PHONE_CODE',                         //手机号前缀
    };
    codeService.getCode(params).then((data)=>{
      const options = pcCascade(data);
      this.setState({
        options: options,
        code: data,
      });
    });
  }
  //第一个按钮对应的函数
  callback1(){
    const record = this.props.form.getFieldsValue();
    if(JSON.parse(localStorage.user).userType == "ADMINISTRATION"){
      record.channelId = this.props.form.getFieldValue('channelId').value;
    }else {
      const user = JSON.parse(localStorage.user);
      record.channelId = user.relatedPartyId;
    }
    record.costStartDate = record.costSDDate[0].format('YYYY-MM-DD HH:mm:ss');
    record.costEndDate = record.costSDDate[1].format('YYYY-MM-DD HH:mm:ss');
    let status = this.props.suDetailList.status;
    if(status == 'CANCEL'||status == 'FAIL'||status == 'CANCEL'){
      if(new Date(record.costStartDate).getTime()<new Date().getTime()||new Date(record.costEndDate).getTime()<new Date().getTime()){
        Modals.error({content:'会销开始时间不能为过去时间'})
      }else {
        this.props.callback1(record, status);
      }
    }else {
      this.props.callback1(record, status);
    }
  }

  //第二个按钮对应的 函数
  callback2(){
    Modals.warning(this.ensurePay.bind(this),'订单成功后，如需撤销退款，需在工作日内提前24小时提交撤销申请。确认后支付。');
  }
  //待支付
  ensurePay(flag){
    if(flag){
      window.open('/#/portal/payOnline/SUPPORT/'+this.props.supportId);
      //location.hash = '/portal/payOnline/SUPPORT/'+this.props.supportId;
    }
  }

  disabledStartDate = (startValue) => {
    const endValue = this.props.form.getFieldValue('costEndDate');
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf()&&startValue.valueOf() < Date.now();
  }
  disabledEndDate = (endValue) => {
    const startValue = this.props.form.getFieldValue('costStartDate');
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  //验证手机号
  checkPhone = (rule, value, callback) => {
    let preCode = this.props.form.getFieldValue('phoneCode')
    let regex = /^\d{11}$/, msg='手机号位数不正确(大陆地区为11位)';

    if( preCode ==='00852' || preCode ==='00853' ){
      regex = /^\d{8}$/;
      msg='手机号位数不正确(港澳地区为8位)';
    }else if(preCode ==='00886'){
      regex = /^\d{9}$/;
      msg='手机号位数不正确(台湾地区为9位)';
    }else {

    }

    if ( value && !regex.test(value)  ) {
      this.setState({
        sendFlag: false,
      });
      callback(msg);
    } else {
      this.setState({
        sendFlag: true,
      });
      callback();
    }
  }
  handleWebsiteChange = (value) => {
    if(value){
      //this.props.form.resetFields(['contactPhone']) ;
      this.props.form.setFieldsValue({contactPhone:' '}) ;
    }
  }

  checkNum = (rule, value, callback) => {
    let reg = new RegExp("^[0-9]*$");
    if(!reg.test(value)||!/^[0-9]*$/.test(value)){
      callback('请输入非零正整数');
    }
    else {
      callback();
    }
  }

  disabledDate = current => current && current.valueOf() < moment(moment(new Date()).format('YYYY-MM-DD 00:00:00')).toDate();


  render() {

    const fields = this.props.suDetailList?this.props.suDetailList:[];
    //const fieldsTech = this.props.suDetailList.teacherList[0]?this.props.suDetailList.teacherList[0]:[];

    let ssFlag=false;
    if(fields.status=='SUCCESS'){
      ssFlag=true
    }
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: fields.phoneCode,
    })(
      <CodeOption onChange={this.handleWebsiteChange}  disabled={this.props.disableFlag}  codeList={this.state.code.phoneCodes} width={100}/>
    );
    //省市级联
    fields.part = [];
    if(fields.province){
      fields.part.push(fields.province);
      fields.part.push(fields.city);
    };

    const fieldsTech1 = this.props.suDetailList.teacherList;
    const fieldsTechFrom = fieldsTech1.map((item, index) => {
      return (
        <div>
          <div className={styles.detail_title}>
            <b className={styles.b_sty} >|</b>
            <font className={styles.title_font2}>讲师{++index}安排信息</font>
          </div>
          <div>
            <Form.Item label={`安排讲师${index+1}`} {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: item.name || '',
              })(
                <Input disabled={this.props.disableFlag} width="100%" />
              )}
            </Form.Item>
            <Form.Item label="讲师性别" {...formItemLayout}>
              {getFieldDecorator('gender', {
                initialValue: item.gender ||'',
              })(
                <Input disabled={this.props.disableFlag} width="100%" />
              )}
            </Form.Item>
            <Form.Item label="联系方式" {...formItemLayout}>
              {getFieldDecorator('phone', {
                initialValue: item.phone||'',
              })(
                <Input disabled={this.props.disableFlag}  width="100%" />
              )}
            </Form.Item>
            <Form.Item label="到达时间" {...formItemLayout}>
              {getFieldDecorator('arriveTime', {
                initialValue: item.arriveTime||'',
              })(
                <Input disabled={this.props.disableFlag} width="100%" />
              )}
            </Form.Item>
            <Form.Item label="交通方式" {...formItemLayout}>
              {getFieldDecorator('transprotType', {
                initialValue: item.transprotType||'',
              })(
                <Input disabled={this.props.disableFlag} width="100%" />
              )}
            </Form.Item>
            <Form.Item label="到达地点" {...formItemLayout}>
              {getFieldDecorator('arrivePlace', {
                initialValue: item.arrivePlace||'',
              })(
                <Input disabled={this.props.disableFlag} width="100%" />
              )}
            </Form.Item>
            <Form.Item label="离开时间" {...formItemLayout}>
              {getFieldDecorator('leaveTime', {
                initialValue: item.leaveTime||'',
              })(
                <Input disabled={this.props.disableFlag} width="100%" />
              )}
            </Form.Item>
            <Form.Item label="收费标准" {...formItemLayout}>
              {getFieldDecorator('tollStandard', {
                initialValue: item.tollStandard||'',
              })(
                <Input disabled={this.props.disableFlag} width="100%" />
              )}
            </Form.Item>
            <Form.Item label="备注" {...formItemLayout}>
              {getFieldDecorator('remarks', {
                initialValue: item.remarks||'',
              })(
                <Input disabled={this.props.disableFlag} width="100%" />
              )}
            </Form.Item>
          </div>
        </div>
      );
    });
    return (
    <div>
      <div className={styles.detail_title}>
        <b className={styles.b_sty} >|</b>
        <font className={styles.title_font2}>会销支援申请信息</font>
      </div>
      <Form className='disableds'>
        <SuHeader  fields={fields}/>
        {
          JSON.parse(localStorage.user).userType == "ADMINISTRATION" &&
          <div>
            <Form.Item style={{height:'45px'}} label="渠道" {...formItemLayout}>
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
                initialValue: {value: fields.channelId || JSON.parse(localStorage.user).relatedPartyId, meaning: fields.channelName || ''},
              })(
                <Lov disabled={this.props.disableFlag} title="选择渠道" lovCode='CNL_AGENCY_NAME' params ={{userId:JSON.parse(localStorage.user).userId}}/>
              )}
            </Form.Item>
          </div>
        }
        <FormItem style={{height:'45px'}}  {...formItemLayout} label="申请人" >
          {getFieldDecorator('createrName', {
            rules: [
              {required:true, message:'请输入申请人'},
            ],
            initialValue: fields.createrName?fields.createrName:'',
          })(
            <Input size="large" disabled={this.props.disableFlag}/>
          )}
        </FormItem>
        <FormItem style={{height:'45px'}}   {...formItemLayout} label="申请人手机">
          {getFieldDecorator('contactPhone', {
            rules: [
              {required:true, message:'请输入手机号'},
              {validator: this.checkPhone.bind(this)}
            ],
            initialValue: fields.contactPhone?fields.contactPhone:'',
          })(
            <Input disabled={this.props.disableFlag}  addonBefore={prefixSelector}  style={{width:'100%'}} size="large" />
          )}
        </FormItem>
        <FormItem style={{height:'45px'}}  {...formItemLayout} label="联系人邮箱" >
          {getFieldDecorator('contactEmail', {
            rules: [
              {type:'email', message:'请输入合法的电子邮箱'},
              {required:true, message:'请输入电子邮箱'},
            ],
            initialValue: fields.contactEmail?fields.contactEmail:'',
          })(
            <Input disabled={this.props.disableFlag} size="large"/>
          )}
        </FormItem>
        <Form.Item style={{height:'45px'}}  label="会销主题" {...formItemLayout}>
          {getFieldDecorator('costTopic', {
            rules: [
              {required:true, message:'请输入会销主题'},
            ],
            initialValue:fields.costTopic?fields.costTopic:'',
          })(
            <Input disabled={this.props.disableFlag} />
          )}
        </Form.Item>

        <Form.Item style={{height:'45px'}}  label="参与人群主要类型" {...formItemLayout}>
          {getFieldDecorator('costParType', {
            rules: [
              {required:true, message:'请输入参与人群主要类型'},
            ],
            initialValue:fields.costParType?fields.costParType:'',
          })(
            <Input disabled={this.props.disableFlag}/>
          )}
        </Form.Item>
        <Form.Item style={{height:'45px'}}  label="参与人数" {...formItemLayout}>
          {getFieldDecorator('costParTotal', {
            rules: [
              {required:true, message:'请输入参与人数'},
              {validator: this.checkNum.bind(this)}
            ],
            initialValue:fields.costParTotal?fields.costParTotal:'',
          })(
            <Input disabled={this.props.disableFlag} />
          )}
        </Form.Item>
        <FormItem style={{height:'45px'}}  {...formItemLayout} label="会销时间" >
          {getFieldDecorator('costSDDate', {
            rules: [{required: true, message: '请选会销择时间' }],
            initialValue: fields.costSDDate?fields.costSDDate:[],
          })(
            <RangePicker
              disabled={this.props.disableFlag}
              disabledDate={this.disabledDate}
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm"
              showTime={{ defaultValue: moment('00:00', 'HH:mm'), format: 'HH:mm' }}
            />,
          )}
        </FormItem>
        <FormItem style={{height:'45px'}}  {...formItemLayout} label="会销所在地区" >
          {getFieldDecorator('part', {
            rules: [
              {required:true, message:'请输入所在地区'},
            ],
            initialValue: fields.part?fields.part:'',
          })(
            <Cascader disabled={this.props.disableFlag} style={{color:'#595959',fontSize:'14px'}} options={this.state.options} placeholder="请选择"/>
          )}
        </FormItem>
        <FormItem style={{height:'45px'}}  {...formItemLayout} label="详细地址" >
          {getFieldDecorator('costAddress', {
            rules: [
              {required:true, message:'请输入详细地址'},
            ],
            initialValue: fields.costAddress?fields.costAddress:'',
          })(
            <Input disabled={this.props.disableFlag}  size="large"/>
          )}
        </FormItem>

        <Form.Item style={{height:'45px'}}  label="指定培训讲师" {...formItemLayout}>
          {getFieldDecorator('costTeacher', {
            initialValue:fields.costTeacher?fields.costTeacher:'',
          })(
            <Input disabled={this.props.disableFlag} style={{width:"100%"}} />
          )}
        </Form.Item>
        <Form.Item  label="会销目标" {...formItemLayout}>
          {getFieldDecorator('costTarget', {
            rules: [{required: true,message: '请输入会销目标',}],
            initialValue:fields.costTarget?fields.costTarget:'',
          })(
            <textarea  rows={4} maxLength={100} disabled={this.props.disableFlag} style={{width:"100%",fontSize:'15px',color:'#595959'}} />
          )}
        </Form.Item>
        <Form.Item  label="其他要求" {...formItemLayout}>
          {getFieldDecorator('other', {
            initialValue:fields.other?fields.other:'',
          })(
            <textarea  rows={4} maxLength={100} disabled={this.props.disableFlag} style={{width:"100%",fontSize:'15px',color:'#595959'}}/>
          )}
        </Form.Item>
        {ssFlag&&
        <div>
          {fieldsTechFrom}
        </div>
        }
        <FormItem  wrapperCol={ {sm: {span: 8,offset: 9}} }>
          <SuFooter
            fields={fields}
            callback1={this.callback1.bind(this)}
            callback2={this.callback2.bind(this)}
            form={this.props.form}/>
        </FormItem>
      </Form>
    </div>
    );
  }

}

export default Form.create()(SuDetailHX);
