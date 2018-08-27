import React  , { Component } from 'react';
import { Form,DatePicker,Input,InputNumber,Row,Col,Select,Cascader,Button} from 'antd';
import moment from 'moment';
import {indexOf} from 'lodash';
import Lov from "../common/Lov";
import CodeOption from "../common/CodeOption";
import Uploads from '../../components/common/Upload';
import SvFooter from "./SvFooter";
import SvHeader from "./SvHeader";
import Modals from '../common/modal/Modal';
import * as  common from '../../utils/common';
import * as service from '../../services/reservation';
import * as codeService from '../../services/code';
import * as styles from '../../styles/qa.css';
import * as commonStyle from '../../styles/common.css';
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
      option:[],
      detail: this.props.detail || {},
      productDetail: {},
      code: {},
      priceFlag: true,
      birthDate:'',
      fileArr:[],
      ordCustomerDetail:{}
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
    let params = {
      nationalList: 'PUB.NATION',                             //国籍
      provinceList: 'PUB.PROVICE',                            //省份
      cityList: 'PUB.CITY',                                   //城市
      marryList: 'CTM.MARITAL_STATUS',                        //婚姻状况
      diplomaList: 'PUB.EDUCATION',                          //教育程度 CTM.DIPLOMA_TYPE
      phoneCodeList:'PUB.PHONE_CODE',                         //电话代码
      houseList:'PRD.HOUSE_CONDITION',                         //房产情况
      openAccountCauseList:'ORD.OPEN_ACCOUNT_CAUSE'              //开户目的                                          //开户目的
    };
    codeService.getCode(params).then((data)=>{
      const options = common.npcCascade(data);
      this.setState({options: options, code: data});
    });
    const detail = this.props.detail;
    if(detail.price){
      if(!isNaN(detail.price)){
        detail.price = detail.price ;
      }else{
        this.setState({priceFlag: false})
      }
    }
    service.fetchServiceCustomerDetail({orderId:this.props.detail.orderId}).then((data)=>{
      if (data.success) {
        this.setState({
          ordCustomerDetail: data.rows[0]
        })

        const ordCustomerDetail = this.state.ordCustomerDetail
        if (ordCustomerDetail.sysFiles.length>0) {
          ordCustomerDetail.sysFiles.map((row, i) => {
            this.state.fileArr[i] = {
              uid: i,
              name: row.fileName || 'test',
              status: 'query',
              type: row.fileName.substring(row.fileName.lastIndexOf('.') + 1),
              removeFlag: false,
              response: {
                file: {
                  fileId: row.fileId,
                  fileName: row.fileName || 'test',
                  filePath: row.filePath,
                  fileType: row.fileName.substring(row.fileName.lastIndexOf('.') + 1),
                }
              }
            }
          })
          this.props.form.setFieldsValue({
            identityFileId:[this.state.fileArr[0]],
            addressFileId:[this.state.fileArr[1]],
            cardFileId:[this.state.fileArr[2]]
          });
        }
      }
    })
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
  disabledStartDate(flag,current) {
    if(!current){
      return false;
    }
    var date = new Date();
    current = new Date(current);
    date = moment(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()),"YYYY-MM-DD");
    current = moment(current.getFullYear()+"-"+(current.getMonth()+1)+"-"+(current.getDate()),"YYYY-MM-DD")
    return flag == 0?date.valueOf() > current.valueOf():date.valueOf() < current.valueOf();
  }

  customerLovChange(value){
    //客户（投保人）
    if (value && value.value && value.meaning && value.record) {
      value.record.age = null;
      if (value.record.birthDate) {
        value.record.age = parseInt(new Date().getFullYear()-new Date( Date.parse(value.record.birthDate.replace(/-/g,"/")) ).getFullYear()+1);
      }
      const mailingArea = [];
      mailingArea.push(value.record.postNation);
      mailingArea.push(value.record.postProvince);
      mailingArea.push(value.record.postCity);
      this.props.form.setFieldsValue({
        lodgerPinyin: value.record.englishName,
        vaccineCustomerSex: value.record.sex,
        marriageStatus:value.record.marriageStatus,
        idCard:value.record.identityNumber,
        education:value.record.education,
        mailingArea:mailingArea,
        customerAddr:value.record.identityAddress,
        customerEmail:value.record.email,
        commonName:value.record.companyName,
        industry:value.record.industry,
        customerJob:value.record.position,
        currentAssets:value.record.currentAssets,
        fixedAssets:value.record.fixedAssets,
        liabilities:value.record.liabilities
      });
      this.state.birthDate = value.record.birthDate? moment(value.record.birthDate).format('YYYY-MM-DD') : null;
      //当所选的客户是新增的 就清空保单订单编号字段
      if(value.record.addStatus === "add"){
        this.props.form.setFieldsValue({relatedOrderId: {value:'',meaning:''}});
      }

    }
  }
  //验证手机号-不同电话代码使用不同正则
  checkPhone(rule, value, callback) {
    const phone = rule.field;
    let phoneCode = phone.replace('Phone', 'Code');

    phoneCode = phoneCode.replace('phone', 'code');

    phoneCode = this.props.form.getFieldValue(phoneCode);
    let regex = /^\d{11}$/, msg = '手机号位数不正确(大陆地区为11位)';

    if (phoneCode === '00852' || phoneCode === '00853') {
      regex = /^\d{8}$/;
      msg = '手机号位数不正确(港澳地区为8位)';
    } else if (phoneCode === '00886') {
      regex = /^\d{9}$/;
      msg = '手机号位数不正确(台湾地区为9位)';
    }

    if (value && !regex.test(value)) {
      callback(msg);
    } else {
      callback();
    }
  }

  //出生日期改变，身份证号改变
  birthdayCahnge(value){
    if(value){
      const setNumber=(identifyNumber,newDate)=>{
        let arr=[];
        for(var i=0;i<identifyNumber.length;i++){
          arr.push(identifyNumber[i]);
        }
        arr.splice(6,8,newDate);
        arr=arr.join("");
        return arr;
      }
      var newD=moment(value).format('YYYY-MM-DD');
      newD=newD.replace(/-/g,"");
      var cardId=this.props.form.getFieldValue("idCard");
      //获取身份证号码，并在更改出生日期的时候更改身份证号码
      if(!(cardId.length<18)){
        this.props.form.setFieldsValue({idCard:setNumber(cardId,newD)});
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
    const mailingArea = [];
    mailingArea.push(detail.customerNation);
    mailingArea.push(detail.customerProvince);
    mailingArea.push(detail.customerCity);
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
          <Form.Item label="中文姓名" {...formItemLayout}>
            {getFieldDecorator('applicantCustomerId', {
              rules: [{
                required: true,
                validator: (rule,value,callback) => {
                  if (value && (!value.value || !value.meaning)) {
                    callback('请选择中文姓名');
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
                title="选择中文姓名"
                placeholder=" "
                itemChange={this.customerLovChange.bind(this)}
              />
            )}
          </Form.Item>
          <Form.Item label="英文拼音姓名" {...formItemLayout}>
            {getFieldDecorator('lodgerPinyin', {
              rules: [
                {required:true, message:'请输入英文拼音姓名'},
                {message:'请输入英文字母，姓名之间用空格隔开', pattern: /^([A-Za-z])+\ ([A-Za-z ])+$/ }
              ],
              initialValue:detail.lodgerPinyin || '',
            })(
              <Input
                style={{textTransform:'uppercase'}}
                placeholder='姓和名之间留空，例如ZHANG SANFENG'
                disabled={detail.disableFlag}
              />
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
                disabledDate={this.disabledStartDate.bind(this,0)}
                style={{width:"100%"}}
                placeholder=" "/>
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
          <Form.Item label="婚姻状况" {...formItemLayout}>
            {getFieldDecorator('marriageStatus', {
              rules: [{ required: true, message: '请选择婚姻状况', whitespace: true }],
              initialValue: detail.marriageStatus || '',
            })(
              <Select
                className={styles['select-disableds']}
                disabled={detail.disableFlag}
                placeholder=" "
                showSearch
                optionFilterProp="children" >
                {
                  this.state.code.marryList &&
                  this.state.code.marryList.map((item) =>
                    <Option key={item.value} value={item.value}>{item.meaning}</Option>
                  )
                }
              </Select>
              )}
          </Form.Item>
          <Form.Item label="子女数" {...formItemLayout}>
            {getFieldDecorator('childrenNum', {
              rules: [
                {required: true,message: '请输入子女数',whitespace: true,type: 'number',},
                {pattern:/^[0-9]\d*$/, message:'请输入正整数'},
              ],
              initialValue: detail.childrenNum === 0 ? 0: detail.childrenNum || ''
            })(
              <InputNumber className={styles['input-disableds']} disabled={detail.disableFlag} style={{width:"100%"}} placeholder=" "/>
            )}
          </Form.Item>
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
                disabledDate={this.disabledStartDate.bind(this,1)}
                onChange={this.birthdayCahnge.bind(this)}
              />
              )}
          </Form.Item>
          <Form.Item label="身份证号" {...formItemLayout} >
            {getFieldDecorator('idCard', {
              rules: [
                { required: true, message: '请输入身份证号' },
                {pattern:/^[A-Za-z0-9\(\)]+$/, message:'请输入数字或字母或英文括号'},
              ],
              initialValue: detail.idCard || '',
            })(
              <Input disabled={detail.disableFlag}/>
              )}
          </Form.Item>
          <Form.Item label="教育程度" {...formItemLayout}>
            {getFieldDecorator('education', {
              rules: [{ required: true, message: '请选择教育程度', whitespace: true }],
              initialValue: detail.education || '',
            })(
              <Select
                className={styles['select-disableds']}
                disabled={detail.disableFlag}
                placeholder=" "
                showSearch
                optionFilterProp="children" >
                {
                  this.state.code.diplomaList &&
                  this.state.code.diplomaList.map((item) =>
                    <Option key={item.value} value={item.value}>{item.meaning}</Option>
                  )
                }
              </Select>
              )}
          </Form.Item>
          <Form.Item label="通讯地址" {...formItemLayout}>
            {getFieldDecorator('mailingArea', {
              rules: [{ type: 'array', required: true, message: '请选择通讯地址', whitespace: true }],
              initialValue: mailingArea || [],
            })(
              <Cascader className={styles['cascader-disableds']} disabled={detail.disableFlag} showSearch options={this.state.options} placeholder=" " />
              )}
          </Form.Item>
          <Form.Item label="详细地址" {...formItemLayout}>
            {getFieldDecorator('customerAddr', {
              rules: [{ required: true, message: '请输入详细地址', whitespace: true }],
              initialValue: detail.customerAddr || '',
            })(
              <Input disabled={detail.disableFlag}/>
              )}
          </Form.Item>
          <Form.Item label="房产情况" {...formItemLayout}>
            {getFieldDecorator('estate', {
              rules: [
                {required: true,message: '请选择房产情况',whitespace: true,}
              ],
              initialValue: detail.estate || '',
            })(
              <Select
                className={styles['select-disableds']}
                disabled={detail.disableFlag}
                placeholder=" "
                showSearch
                optionFilterProp="children" >
                {
                  this.state.code.houseList &&
                  this.state.code.houseList.map((item) =>
                    <Option key={item.value} value={item.value}>{item.meaning}</Option>
                  )
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item label="居住年数" {...formItemLayout}>
            {getFieldDecorator('liveTimes', {
              rules: [
                {required: true,message: '请输入居住年数',whitespace: true,type: 'number',},
                {pattern:/^[0-9]\d*$/, message:'请输入正整数'},
              ],
              initialValue: detail.liveTimes === 0 ? 0 : detail.liveTimes || '',
            })(
              <InputNumber className={styles['input-disableds']} disabled={detail.disableFlag} style={{width:"100%"}} placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="家庭成员在职人士数目" {...formItemLayout}>
            {getFieldDecorator('familyWorkNum', {
              rules: [
                {required: true,message: '请输入家庭成员在职人士数目',whitespace: true,type: 'number',},
                {pattern:/^[0-9]\d*$/, message:'请输入正整数'},
              ],
              initialValue: detail.familyWorkNum === 0 ? 0 : detail.familyWorkNum || '',
            })(
              <InputNumber className={styles['input-disableds']} disabled={detail.disableFlag} style={{width:"100%"}} placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="手提电话" {...formItemLayout}>
            {getFieldDecorator('customerPhone', {
              rules: [
                { required: true, message: '请输入手提电话', },
                { validator: this.checkPhone.bind(this), }
              ],
              initialValue: detail.customerPhone,
            })(
              <Input
                disabled={detail.disableFlag}
                addonBefore={getFieldDecorator('customerPhoneCode', {
                  initialValue:  detail.customerPhoneCode || "86",
                })(
                  <CodeOption disabled={detail.disableFlag} addonBefore={reserveContactPhoneCode} codeList={this.state.code.phoneCodeList} width={125} placeholder=" "/>
                  )}
                size="large"
                style={{ width: '100%', marginRight: 0 }} />
              )}
          </Form.Item>
          <Form.Item label="住宅电话" {...formItemLayout}>
            {getFieldDecorator('customerHomePhone', {
              rules: [
                { required: true, message: '请输入区号和电话号码，格式如  0755-12345678', }
              ],
              initialValue: detail.customerHomePhone,
            })(
              <Input placeholder="请输入区号和电话号码，格式如  0755-12345678" disabled={detail.disableFlag}/>
              )}
          </Form.Item>
          <Form.Item label="电子邮箱" {...formItemLayout}>
            {getFieldDecorator('customerEmail', {
              rules: [
                { message: '邮箱格式不正确', pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/ },
                { required: true, message: '请输入电子邮箱', }
              ],
              initialValue: detail.customerEmail || '',
            })(
              <Input disabled={detail.disableFlag}/>
              )}
          </Form.Item>
          <Form.Item label="公司名称" {...formItemLayout}>
            {getFieldDecorator('commonName', {
              rules: [
                { required: this.state.checkboxP, message: '请输入公司名称', }
              ],
              initialValue: detail.commonName || '',
            })(
              <Input disabled={detail.disableFlag} placeholder="如少于一年，请说明先前的工作" />
              )}
          </Form.Item>
          <Form.Item label="公司业务性质" {...formItemLayout}>
            {getFieldDecorator('industry', {
              rules: [
                { required: this.state.checkboxP, message: '请输入公司业务性质', }
              ],
              initialValue: detail.industry || '',
            })(
              <Input disabled={detail.disableFlag}/>
              )}
          </Form.Item>
          <Form.Item label="职位" {...formItemLayout}>
            {getFieldDecorator('customerJob', {
              rules: [
                { required: this.state.checkboxP, message: '请输入职位', },
              ],
              initialValue: detail.customerJob || '',
            })(
              <Input disabled={detail.disableFlag}/>
              )}
          </Form.Item>
          <Form.Item label="任职年期" {...formItemLayout}>
            {getFieldDecorator('servingTimes', {
              rules: [
                {required: true,message: '请输入任职年期',whitespace: true,type: 'number',},
                {pattern:/^[0-9]\d*$/, message:'请输入正整数'},
              ],
              initialValue: detail.servingTimes === 0 ? 0 : detail.servingTimes || '',
            })(
              <InputNumber className={styles['input-disableds']} disabled={detail.disableFlag} style={{width:"100%"}} placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="年薪(HKD)" {...formItemLayout}>
            {getFieldDecorator('customerIncome', {
              rules: [
                { required: this.state.checkboxP, message: '请输入年薪(HKD)', pattern: /^-?\d+(\.)?$/ },
              ],
             initialValue: detail.customerIncome === 0 ? 0 : detail.customerIncome || '',
            })(
              <InputNumber
                className={styles['input-disableds']}
                disabled={detail.disableFlag}
                formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value && value.toString().replace(/\$\s?|(,*)/g, '')}
                style={{ width: '100%' }}
              />
              )}
          </Form.Item>
          <Form.Item label="办公室电话" {...formItemLayout}>
            {getFieldDecorator('commonPhone', {
              rules: [
                { required: true, message: '请输入区号和电话号码，格式如  0755-12345678', }
              ],
              initialValue: detail.commonPhone,
            })(
              <Input placeholder="请输入区号和电话号码，格式如  0755-12345678" disabled={detail.disableFlag}/>
              )}
          </Form.Item>
          <Form.Item label="公司详细地址" {...formItemLayout}>
            {getFieldDecorator('commonAddr', {
              rules: [{ required: true, message: '请输入详细地址', whitespace: true }],
              initialValue: detail.commonAddr || '',
            })(
              <Input disabled={detail.disableFlag}/>
              )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="您持有多少流动资产（港币）">
            {getFieldDecorator('currentAssets', {
              rules: [
                { required: true, message: '您持有多少流动资产（整数）', pattern: /^-?\d+(\.)?$/ },
              ],
              initialValue:  this.state.ordCustomerDetail.currentAssets === 0 ? 0 :  this.state.ordCustomerDetail.currentAssets || '',
            })(
              <InputNumber
                className={styles['input-disableds']}
                disabled={detail.disableFlag}
                formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value && value.toString().replace(/\$\s?|(,*)/g, '')}
                style={{ width: '100%' }}
              />
              )}
          </Form.Item>
          <Form.Item label="您持有的不动产的总值约为多少（港币）" {...formItemLayout}>
            {getFieldDecorator('fixedAssets', {
              rules: [
                { required: true, message: '您持有的不动产的总值约为多少（港币）', pattern: /^-?\d+(\.)?$/  }
              ],
              initialValue:  this.state.ordCustomerDetail.fixedAssets === 0 ? 0 :  this.state.ordCustomerDetail.fixedAssets || ''
            })(
              <InputNumber
                className={styles['input-disableds']}
                formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value && value.toString().replace(/\$\s?|(,*)/g, '')}
                disabled={detail.disableFlag}
                style={{ width: "100%" }}
                />
              )}
          </Form.Item>
          <Form.Item label="您现时负债大约为多少（港币）" {...formItemLayout}>
            {getFieldDecorator('liabilities', {
              rules: [
                { required: true, message: '请输入您现时负债大约多少', pattern: /^-?\d+(\.)?$/ }
              ],
              initialValue:  this.state.ordCustomerDetail.liabilities === 0 ? 0 :  this.state.ordCustomerDetail.liabilities || ''
            })(
              <InputNumber
                className={styles['input-disableds']}
                formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value && value.toString().replace(/\$\s?|(,*)/g, '')}
                disabled={detail.disableFlag}
                style={{ width: "100%" }}
               />
              )}
          </Form.Item>
          <Form.Item label="开户目的" {...formItemLayout}>
            {getFieldDecorator('openAccountCause', {
              rules: [{ required: true, message: '请选择开户目的', whitespace: true }],
              initialValue: detail.openAccountCause || '',
            })(
              <Select
                className={styles['select-disableds']}
                disabled={detail.disableFlag}
                placeholder=" "
                showSearch
                optionFilterProp="children" >
                {
                  this.state.code.openAccountCauseList &&
                  this.state.code.openAccountCauseList.map((item) =>
                    <Option key={item.value} value={item.value}>{item.meaning}</Option>
                  )
                }
              </Select>
              )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="身份证副本：" >
            {getFieldDecorator('identityFileId', {
              rules: [
                { message: '请上传身份证副本', type: 'array' },
               // { validator: identifyFileFlag ? common.validateFile.bind(this) : common.vdFile.bind(this), }
              ],
              //initialValue: this.state.fileArr[0]?[this.state.fileArr[0]]:[]
            })(
              <Uploads disabled={detail.disableFlag} fileNum={1}/>
              )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="地址证明副本" >
            {getFieldDecorator('addressFileId', {
              rules: [
                { message: '请上传地址证明副本', type: 'array' },
                //{ validator: identifyFileFlag ? common.validateFile.bind(this) : common.vdFile.bind(this), }
              ],
              //initialValue: this.state.fileArr[1]?[this.state.fileArr[1]]:[]
            })(
              <Uploads disabled={detail.disableFlag} fileNum={1}/>
              )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="银行卡副本" >
            {getFieldDecorator('cardFileId', {
              rules: [
                {
                   message: '请上传银行卡副本', type: 'array' },
                //{ validator: identifyFileFlag ? common.validateFile.bind(this) : common.vdFile.bind(this), }
              ],
              //initialValue: this.state.fileArr[2]?[this.state.fileArr[2]]:[]
            })(
              <Uploads disabled={detail.disableFlag} fileNum={1}/>
              )}
          </Form.Item>

          <Form.Item label="备注" {...formItemLayout}>
            {getFieldDecorator('reserveComment', {
              initialValue: detail.reserveComment || '',
            })(
              <Input type="textarea" className={styles['textarea-disableds']} disabled={detail.disableFlag}  placeholder=" "/>
            )}
          </Form.Item>
          {
            (this.props.detail.status == 'RESERVE_SUCCESS'
            || this.props.detail.status == 'ACCOUNT_SUCCESS'
            || this.props.detail.status == 'RECORDED_SUCCESS'
          ) &&
            <div>
              <div className={styles.confirm}>
                预约确认信息
              </div>
              <Form.Item label="预约时间" {...formItemLayout}>
                {getFieldDecorator('orderTime', {
                  rules: [{ whitespace: true }],
                  initialValue: detail.reserveDate || '',
                })(
                  <Input disabled={true} />
                  )}
              </Form.Item>
              <Form.Item label="产品经理" {...formItemLayout}>
                {getFieldDecorator('productManager', {
                  rules: [{ whitespace: true }],
                  initialValue: detail.productManager || '',
                })(
                  <Input disabled={true} />
                  )}
              </Form.Item>
              <Form.Item label="联系电话" {...formItemLayout}>
                {getFieldDecorator('productManagerPhone', {
                  rules: [{ whitespace: true }],
                  initialValue: detail.productManagerPhone || '',
                })(
                  <Input
                    disabled={true}
                    addonBefore={getFieldDecorator('productManagerPhoneCode', {
                      initialValue:  detail.productManagerPhoneCode || "86",
                    })(
                      <CodeOption disabled={detail.disableFlag} addonBefore={reserveContactPhoneCode} codeList={this.state.code.phoneCodeList} width={125} placeholder=" " />
                      )
                    }
                    size="large"
                    style={{ width: '100%', marginRight: 0 }} />
                  )}
              </Form.Item>
              <Form.Item label="见面地址" {...formItemLayout}>
                {getFieldDecorator('meetAddress', {
                  rules: [{ whitespace: true }],
                  initialValue: detail.meetAddress || '',
                })(
                  <Input disabled={true} />
                  )}
              </Form.Item>
              <Form.Item label="联系电话" {...formItemLayout}>
                {getFieldDecorator('meetPhone', {
                  rules: [{ whitespace: true }],
                  initialValue: detail.meetPhone || '',
                })(
                  <Input
                    disabled={true}
                    addonBefore={getFieldDecorator('meetPhoneCode', {
                      initialValue:  detail.meetPhoneCode || "86",
                    })(
                      <CodeOption disabled={detail.disableFlag} addonBefore={reserveContactPhoneCode} codeList={this.state.code.phoneCodeList} width={125} placeholder=" " />
                      )
                    }
                    size="large"
                    style={{ width: '100%', marginRight: 0 }} />
                  )}
              </Form.Item>
            </div>
          }
          <Form.Item  {...tailFormItemLayout} label=''>
            <SvFooter
              detail={detail}
              callback1={this.callback1.bind(this)}
              callback2={this.callback2.bind(this)}/>
          </Form.Item>
        </Form>
      </div>
    );
  }

  }

export default SvDetailHSYD;
