/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { Row, Col, Button, Icon, Table, Select, Form, Checkbox, Cascader, DatePicker, Input, InputNumber } from 'antd';
import TableCellEditor from '../common/TableCellEditor';
import { getCode } from '../../services/code';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import Lov from "../common/Lov";
import TipModal from "../common/modal/Modal";
import CustomerLov from "../common/CustomerLov";
import { NumbericeInput, NumberInput } from "../common/Input";
import { ordOrderQuery, ordCustomerQuery, ordSkillQuery, ordWorkQuery, ordEducationQuery, ordBeneficiaryQuery, ordOrderSubmit, ordCustomerSubmit } from '../../services/production';
import moment from "moment";
import {indexOf} from 'lodash';

class ProductionSubscribeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      channelParam : JSON.parse(localStorage.user).relatedPartyId,
      channelFlag : false,
      orderDetail: {},
      //家庭状况
      ordBeneficiary: [{key:1},{key:2},{key:3},{key:4},{key:5}],
      //教育程度
      ordCstEducation: [{key:1},{key:2},{key:3},{key:4},{key:5}],
      //工作经历
      ordCstWork: [{key:1},{key:2},{key:3},{key:4},{key:5}],
      //特长技能
      ordCstSkill: [{key:1},{key:2},{key:3},{key:4},{key:5}],
      //快码值
      codeList: {
        yesOrNo: [],
        genderList: [],
        proviceList: [],
        livingCityList: [],
        maritalStatusList: [],
        nationList: [],
        englishAbilityList: [],
        otherLanguageList: [],
        educationList: [],
        phoneCodeList: [],
      }
    };
  }
  componentWillMount() {

    if(JSON.parse(localStorage.user).userType == "ADMINISTRATION"){
      this.setState({
        channelFlag:true,
      })
    }

    //获取快码值
    var body = {
      yesOrNo: 'SYS.YES_NO',
      genderList: 'HR.EMPLOYEE_GENDER',
      proviceList: 'PUB.PROVICE',
      livingCityList: 'PUB.CITY',
      maritalStatusList: 'CTM.MARITAL_STATUS',
      nationList: 'PUB.NATION',
      englishAbilityList: 'PUB.ENGLISH_ABILITY',
      otherLanguageList: 'PUB.OTHER_LANGUAGE',
      educationList: 'PUB.EDUCATION',
      phoneCodeList: "PUB.PHONE_CODE",
    };
    getCode(body).then((data)=>{
      this.setState({
        codeList: data
      });
    });
    //预约订单查询
    if (!isNaN(this.props.orderId)) {
      this.state.disabled = true;
      this.state.ordBeneficiary = [];
      this.state.ordCstEducation = [];
      this.state.ordCstSkill = [];
      this.state.ordCstWork = [];
      body = {
        orderId: this.props.orderId,
      };
      //查询预约单-订单信息
      ordOrderQuery(body).then((data)=>{
        if (data.success) {
          for (let i in data.rows[0]) {
            this.state.orderDetail[i] = data.rows[0][i]
          }
          //地址
          this.state.orderDetail.address = [];
          this.state.orderDetail.address.push(this.state.orderDetail.identityNation);
          this.state.orderDetail.address.push(this.state.orderDetail.identityProvince);
          this.state.orderDetail.address.push(this.state.orderDetail.identityCity);

          this.setState({
            orderDetail: this.state.orderDetail,
          });
        } else {
          TipModal.error({content:data.message});
          return;
        }
      });
      //查询预约单-客户信息
      body = {
        orderId: this.props.orderId,
      }
      ordCustomerQuery(body).then((data)=>{
        if (data.success) {
          for (let i in data.rows[0]) {
            this.state.orderDetail[i] = data.rows[0][i]
          }
          this.setState({
            orderDetail: this.state.orderDetail,
          });
        } else {
          TipModal.error({content:data.message});
          return;
        }
      });
      //查询预约单-家庭状况
      ordBeneficiaryQuery(body).then((data)=>{
        if (data.success) {
          for(let i=0;i<data.rows.length;i++){
            this.state.ordBeneficiary[i] = {};
            this.state.ordBeneficiary[i].key = i;
            this.state.ordBeneficiary[i].chineseName = data.rows[i].chineseName;
            this.state.ordBeneficiary[i].relationship = data.rows[i].relationship;
            this.state.ordBeneficiary[i].birthDate = data.rows[i].birthDate;
            this.state.ordBeneficiary[i].highestEducation = data.rows[i].highestEducation;
            this.state.ordBeneficiary[i].career = data.rows[i].career;
            this.state.ordBeneficiary[i].__status = 'update';
          }
          this.setState({
            ordBeneficiary: this.state.ordBeneficiary,
          });
        } else {
          TipModal.error({content:data.message});
          return;
        }
      });
      //查询预约单-教育经历
      body = {
        orderId: this.props.orderId,
      }
      ordEducationQuery(body).then((data)=>{
        if (data.success) {
          for(let i=0;i<data.rows.length;i++){
            this.state.ordCstEducation[i] = {};
            this.state.ordCstEducation[i] = data.rows[i];
            this.state.ordCstEducation[i].key = i;
            this.state.ordCstEducation[i].__status = 'update';
          }
          this.setState({
            ordCstEducation: this.state.ordCstEducation,
          });
        } else {
          TipModal.error({content:data.message});
          return;
        }
      });
      // 查询预约单-技能特長
      ordSkillQuery(body).then((data)=>{
        if (data.success) {
          for(let i=0;i<data.rows.length;i++){
            this.state.ordCstSkill[i] = {};
            this.state.ordCstSkill[i] = data.rows[i];
            this.state.ordCstSkill[i].key = i;
            this.state.ordCstSkill[i].certificate2 = data.rows[i].certificate;
            this.state.ordCstSkill[i].description2 = data.rows[i].description;
            this.state.ordCstSkill[i].__status = 'update';
          }
          this.setState({
            ordCstSkill: this.state.ordCstSkill,
          });
        } else {
          TipModal.error({content:data.message});
          return;
        }
      });
      // 查询预约单-工作經歷
      ordWorkQuery(body).then((data)=>{
        if (data.success) {
          for(let i=0;i<data.rows.length;i++){
            this.state.ordCstWork[i] = {};
            this.state.ordCstWork[i] = data.rows[i];
            this.state.ordCstWork[i].key = i;
            this.state.ordCstWork[i].__status = 'update';
          }
          this.setState({
            ordCstWork: this.state.ordCstWork,
          });
        } else {
          TipModal.error({content:data.message});
          return;
        }
      });
    }
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
  disabledStartDate2(index, current) {
    if (current) {
      var date = new Date(this.state.ordCstWork[index].startDate);
      current = new Date(current);
      date = moment(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()),"YYYY-MM-DD");
      current = moment(current.getFullYear()+"-"+(current.getMonth()+1)+"-"+(current.getDate()),"YYYY-MM-DD")
      return date.valueOf() > current.valueOf();
    } else {
      return false;
    }
  }
  //展开关闭操作
  display(id) {
    const display = document.getElementById(id).style.display;
    if (display == "none") {
      document.getElementById(id).style.display = "block";
    } else {
      document.getElementById(id).style.display = "none";
    }
  }
  //页面返回
  goBack() {
    window.history.back();
  }
  //选择渠道事件
  channelChange(value) {
    this.setState({
      channelParam:value.value,
      channelFlag:false
    });
    if (value.value && value.meaning) {
      this.props.form.resetFields(['applicantCustomer','sex','email','phone','birthDate','address','identityAddress']);
    }
  }
  //选择客户信息事件
  customerChange(value) {
    if (value.record.sex) {
      this.props.form.setFieldsValue({sex:value.record.sex});
    }
    if (value.record.email) {
      this.props.form.setFieldsValue({email:value.record.email});
    }
    if (value.record.phone) {
      this.props.form.setFieldsValue({phone:value.record.phone});
    }
    if (value.record.birthDate) {
      this.props.form.setFieldsValue({birthDate:moment(value.record.birthDate,'YYYY-MM-DD')});
    }
    if (value.record.identityNation) {
      this.props.form.setFieldsValue({address:[value.record.identityNation,value.record.identityProvince,value.record.identityCity]});
    }
    if (value.record.identityAddress) {
      this.props.form.setFieldsValue({identityAddress:value.record.identityAddress});
    }
  }
  //选择产品事件
  itemChange(value) {
    if (!value.record.theFirstYear && !value.record.channelCommissionLineId) {
      this.props.form.setFieldsValue({item:{value:'',meaning:'',record:{}}});
      TipModal.error({content:"您选择的产品无转介费率，暂时无法预约，请联系您的上级！"});
      return;
    }
  }
  //选择电话号码区域事件
  phoneCodeChange(value) {
    if (value != this.props.form.getFieldValue('phoneCode')) {
      this.props.form.setFieldsValue({phone:''});
    }
  }
  //验证手机号-不同电话代码使用不同正则
  checkPhone(rule, value, callback) {
    const phoneCode = this.props.form.getFieldValue('phoneCode');
    let regex = /^\d{11}$/;
    if (phoneCode =='00852' || phoneCode =='00853') {
      regex = /^\d{8}$/;
    } else if (phoneCode =='00886') {
      regex = /^\d{9}$/;
    } else if (phoneCode == '86') {
      regex = /^\d{11}$/;
    } else {
      callback('请选择正确的电话代码！');
    }
    if ( value && !regex.test(value)  ) {
      callback('手机号格式不正确！');
    } else {
      callback();
    }
  }
  //确认预约
  handleSubmit(e) {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //预约信息提交
        for (var i in values) {
          this.state.orderDetail[i] = values[i];
        }
        let orderBody = this.state.orderDetail;
        orderBody.status = "RESERVING";
        orderBody.__status = "add";
        if (this.props.orderType == 'orderUpdate') {
          orderBody.__status = "update";
          orderBody.orderId = this.props.orderId;
        }
        orderBody.orderType = "IMMIGRANT";
        orderBody.channelId = this.props.form.getFieldValue('channel') ? this.props.form.getFieldValue('channel').value :JSON.parse(localStorage.user).relatedPartyId;
        orderBody.customerType = 'APPLICANT';
        //申请人信息
        if (orderBody.applicantCustomer.value) {
          orderBody.applicantCustomerId = orderBody.applicantCustomer.record.customerId;
          orderBody.chineseName = orderBody.applicantCustomer.record.chineseName;
        }
        //提交日期
        orderBody.submitDate = new Date().getFullYear() + '-'+ (new Date().getMonth()+1)+'-'+new Date().getDate()+ " " +
                            new Date().getHours() + ":" + new Date().getMinutes() + ":" + "00";
        //预约签单时间
        orderBody.reserveDate = new Date(orderBody.reserveDate);
        orderBody.signDate = orderBody.reserveDate = orderBody.reserveDate.getFullYear() + '-'+ (orderBody.reserveDate.getMonth()+1)+'-'+orderBody.reserveDate.getDate()+ " " +
                              orderBody.reserveDate.getHours() + ":" + orderBody.reserveDate.getMinutes() + ":" + "00";
        //基本预算
        orderBody.budget = parseFloat((""+orderBody.budget).replace(/,/g,""));
        //项目信息
        if (orderBody.item.value) {
          orderBody.itemId = orderBody.item.record.itemId;
          orderBody.sublineId = orderBody.item.record.sublineId;
          orderBody.productSupplierId = orderBody.item.record.productSupplierId;
          orderBody.currency = orderBody.item.record.currencyCode;
          orderBody.channelId = orderBody.item.record.channelId;
          orderBody.channelCommissionLineId = orderBody.item.record.channelCommissionLineId;
        }
        orderBody.item = null;
        let errorFlag = false, errorIndex = 0;
        //家庭状况
        orderBody.ordBeneficiary = [];
        this.state.ordBeneficiary.map((row, index) => {
          if (row.__status == "add") {
            if (!row.birthDate || !row.career || !row.chineseName || !row.highestEducation || !row.relationship) {
              errorIndex = index + 1;
              errorFlag = true;
              return;
            } else {
              row.birthDate = new Date(row.birthDate);
              row.birthDate = row.birthDate.getFullYear() + '-'+ (row.birthDate.getMonth()+1)+'-'+row.birthDate.getDate()+ " 00:00:00";
              orderBody.ordBeneficiary.push(row);
            }
          }
        });
        if (errorFlag) {
          TipModal.error({content:"家庭状况，第 "+errorIndex+" 行数据未填写完整"});
          return;
        }
        //教育程度
        orderBody.ordCstEducation = [];
        this.state.ordCstEducation.map((row, index) => {
          if (row.__status == "add") {
            if (!row.school || !row.educationTime || !row.fullTimeFlag || !row.profession) {
              errorIndex = index + 1;
              errorFlag = true;
              return;
            } else {
              row.educationTime = new Date(row.educationTime);
              row.educationTime = row.educationTime.getFullYear() + '-'+ (row.educationTime.getMonth()+1)+'-'+row.educationTime.getDate()+ " 00:00:00";
              orderBody.ordCstEducation.push(row);
            }
          }
        });
        if (errorFlag) {
          TipModal.error({content:"教育程度，第 "+errorIndex+" 行数据未填写完整"});
          return;
        }
        //特长技能
        orderBody.ordCstSkill = [];
        this.state.ordCstSkill.map((row, index) => {
          if (row.__status == "add") {
            if (!row.skillName) {
              errorIndex = index + 1;
              errorFlag = true;
              return;
            } else {
              row.description = row.description2;
              row.certificate = row.certificate2;
              orderBody.ordCstSkill.push(row);
            }
          }
        });
        if (errorFlag) {
          TipModal.error({content:"特长技能，第 "+errorIndex+" 行数据未填写完整"});
          return;
        }
        //工作经历
        orderBody.ordCstWork = [];
        this.state.ordCstWork.map((row, index) => {
          if (row.__status == "add") {
            if (!row.companyName || !row.description || !row.endDate || !row.startDate) {
              errorIndex = index + 1;
              errorFlag = true;
              return;
            } else {
              row.startDate = new Date(row.startDate);
              row.startDate = row.startDate.getFullYear() + '-'+ (row.startDate.getMonth()+1)+"-00 00:00:00";
              row.endDate = new Date(row.endDate);
              row.endDate = row.endDate.getFullYear() + '-'+ (row.endDate.getMonth()+1)+"-00 00:00:00";
              orderBody.ordCstWork.push(row);
            }
          }
        });
        if (errorFlag) {
          TipModal.error({content:"工作经历，第 "+errorIndex+" 行数据未填写完整"});
          return;
        }
        //提交按钮disabled
        document.getElementById("submitBtn").disabled = true;
        //预约信息提交
        ordOrderSubmit([orderBody]).then((orderData) => {
          if (orderData.success) {
            //客户信息提交
            let customerBody = orderBody;
            if (customerBody.abroadEducationDate && customerBody.abroadEducationDate.length > 0) {
              customerBody.abroadEducationStartDate = new Date(customerBody.abroadEducationDate[0]);
              customerBody.abroadEducationStartDate = customerBody.abroadEducationStartDate.getFullYear() + '-'+ (customerBody.abroadEducationStartDate.getMonth()+1)+'-'+customerBody.abroadEducationStartDate.getDate()+ " 00:00:00";
              customerBody.abroadEducationEndDate = new Date(customerBody.abroadEducationDate[1]);
              customerBody.abroadEducationEndDate = customerBody.abroadEducationEndDate.getFullYear() + '-'+ (customerBody.abroadEducationEndDate.getMonth()+1)+'-'+customerBody.abroadEducationEndDate.getDate()+ " 00:00:00";
            }
            //地址
            if (customerBody.address && customerBody.address.length > 0) {
              customerBody.identityNation = customerBody.address[0];
              customerBody.identityProvince = customerBody.address[1];
              customerBody.identityCity = customerBody.address[2];
            }
            //出生日期
            customerBody.birthDate = new Date(customerBody.birthDate);
            customerBody.birthDate = customerBody.birthDate.getFullYear() + '-'+ (customerBody.birthDate.getMonth()+1)+'-'+customerBody.birthDate.getDate()+ " 00:00:00";
            //其他语言
            customerBody.otherLang = customerBody.otherLang&&customerBody.otherLang.length>0?customerBody.otherLang.toString():null;
            //订单ID
            customerBody.orderIds = [];
            orderData.rows.map((row) => {
              customerBody.orderIds.push(row.orderId);
            });
            ordCustomerSubmit([customerBody]).then((customerData) => {
              if (customerData.success) {
                TipModal.success({content:"预约资料已提交，请耐心等待审核！"});
                window.setTimeout(()=>{
                  location.hash = '/order/orderImmigrantInvest/list';
                },3000);
              } else {
                TipModal.error({content:'提交失败'});
                return;
              }
            });
          } else {
            TipModal.error({content:orderData.message});
            return;
          }
        });
      }
    });
  }
  render() {
    const columns = [{
      key: 'chineseName',
      dataIndex: 'chineseName',
      title: '姓名',
      width: '20%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} isRequired={true} rowData={this.state.ordBeneficiary[index]} type="Input" inputValue={text} index={index} name="chineseName" />
      ),
    }, {
      key: 'relationship',
      dataIndex: 'relationship',
      title: '关系',
      width: '20%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} isRequired={true} rowData={this.state.ordBeneficiary[index]} type="Input" inputValue={text} index={index} name="relationship" />
      ),
    }, {
      key: 'birthDate',
      dataIndex: 'birthDate',
      title: '出生日期',
      width: '20%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} placeholder="请选择或填写出生日期，例如1990-01-01" isRequired={true} rowData={this.state.ordBeneficiary[index]} type="DatePicker" inputValue={text} index={index} name="birthDate" />
      ),
    }, {
      key: 'highestEducation',
      dataIndex: 'highestEducation',
      title: '最高学历',
      width: '20%',
      render: (text,record,index) => (
        <TableCellEditor disabled={this.state.disabled} isRequired={true} rowData={this.state.ordBeneficiary[index]} type="Select" inputValue={text} valueList={this.state.codeList.educationList} index={index} name="highestEducation" />
      )
    }, {
      key: 'career',
      dataIndex: 'career',
      title: '职业',
      width: '20%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} isRequired={true} rowData={this.state.ordBeneficiary[index]} type="Input" inputValue={text} index={index} name="career" />
      ),
    }];
    const columns2 = [{
      key: 'educationTime',
      dataIndex: 'educationTime',
      title: '入学时间',
      width: '20%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} isRequired={true} rowData={this.state.ordCstEducation[index]} type="DatePicker" inputValue={text} index={index} name="educationTime" />
      ),
    }, {
      key: 'school',
      dataIndex: 'school',
      title: '学校名称',
      width: '20%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} isRequired={true} rowData={this.state.ordCstEducation[index]} type="Input" inputValue={text} index={index} name="school" />
      ),
    }, {
      key: 'certificate',
      dataIndex: 'certificate',
      title: '所获证书',
      width: '20%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} rowData={this.state.ordCstEducation[index]} type="Input" index={index} inputValue={text} name="certificate" />
      ),
    }, {
      key: 'profession',
      dataIndex: 'profession',
      title: '专业',
      width: '20%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} isRequired={true} rowData={this.state.ordCstEducation[index]} type="Input" index={index} inputValue={text} name="profession" />
      ),
    }, {
      key: 'fullTimeFlag',
      dataIndex: 'fullTimeFlag',
      title: '是否全日制',
      width: '20%',
      render: (text,record,index) => (
        <TableCellEditor disabled={this.state.disabled} isRequired={true} rowData={this.state.ordCstEducation[index]} type="Select" inputValue={text} valueList={this.state.codeList.yesOrNo} index={index} name="fullTimeFlag" />
      )
    }];
    const columns3 = [{
      key: 'skillName',
      dataIndex: 'skillName',
      title: '技能特长',
      width: '30%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} isRequired={true} rowData={this.state.ordCstSkill[index]} type="Input" inputValue={text} index={index} name="skillName" />
      ),
    }, {
      key: 'certificate2',
      dataIndex: 'certificate2',
      title: '所获证书',
      width: '30%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} rowData={this.state.ordCstSkill[index]} type="Input" index={index} inputValue={text} name="certificate2" />
      ),
    }, {
      key: 'description2',
      dataIndex: 'description2',
      title: '备注',
      width: '40%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} rowData={this.state.ordCstSkill[index]} type="Input" index={index} inputValue={text} name="description2" />
      ),
    }];
    const columns4 = [{
      key: 'startDate',
      dataIndex: 'startDate',
      title: '年/月',
      width: '20%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} isRequired={true} rowData={this.state.ordCstWork[index]} type="MonthPicker" inputValue={text} index={index} name="startDate" />
      ),
    }, {
      key: 'endDate',
      dataIndex: 'endDate',
      title: '年/月',
      width: '20%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} isRequired={true} disabledDate={this.disabledStartDate2.bind(this, index)} inputValue={text} rowData={this.state.ordCstWork[index]} type="MonthPicker" index={index} name="endDate" />
      ),
    }, {
      key: 'companyName',
      dataIndex: 'companyName',
      title: '公司名称',
      width: '20%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} isRequired={true} rowData={this.state.ordCstWork[index]} type="Input" inputValue={text} index={index} name="companyName" />
      ),
    }, {
      key: 'description',
      dataIndex: 'description',
      title: '职位及详细工作职责',
      width: '20%',
      render: (text, record, index) => (
        <TableCellEditor disabled={this.state.disabled} isRequired={true} rowData={this.state.ordCstWork[index]} type="Input" inputValue={text} index={index} name="description" />
      ),
    }];
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
    //根据快码值生成下拉列表
    const genderOptions = this.state.codeList.genderList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const yesOrNoOptions = this.state.codeList.yesOrNo.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const otherLanguageOptions = this.state.codeList.otherLanguageList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const livingCityOptions = this.state.codeList.nationList.map((code) => {
      var result = {
        value: code.value,
        label: code.meaning,
        children: [],
      };
      var index = 0;
      this.state.codeList.proviceList.map((code2) => {
        if (code2.parentValue == code.value) {
          result.children.push({
            value: code2.value,
            label: code2.meaning,
            children: [],
          });
          this.state.codeList.livingCityList.map((code3) => {
            if (code3.parentValue == code2.value) {
              result.children[index].children.push({
                value: code3.value,
                label: code3.meaning
              });
            }
          });
          index = index + 1;
        }
      });
      return result;
    });
    const maritalStatusOptions = this.state.codeList.maritalStatusList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const nationOptions = this.state.codeList.nationList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const englishAbilityOptions = this.state.codeList.englishAbilityList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const phoneCodeOptions = this.state.codeList.phoneCodeList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>;
    });
    const phoneCode = (
      getFieldDecorator('phoneCode', {
        initialValue: JSON.parse(localStorage.user).phoneCode||"86",
      })(
        <Select onChange={this.phoneCodeChange.bind(this)} style={{ width: 110 }} disabled={this.state.disabled}>
          {phoneCodeOptions}
        </Select>
      )
    );
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    const formTableLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 18, offset: 3 },
    };
    return (
      <Form className={styles.productSubscribe}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Row style={{marginBottom: "28px", paddingLeft: "18px", paddingRight: "13px", fontSize: '1.3em', backgroundColor: "#e2dccc"}}>
              产品信息
              <span onClick={this.display.bind(this, "display_itemInfo")} className="pull-right">
                <Icon type="down" />
              </span>
            </Row>
            <Row id="display_itemInfo">
              {
                JSON.parse(localStorage.user).userType == "ADMINISTRATION" &&
                <div>
                  <Form.Item label="渠道" {...formItemLayout}>
                    {getFieldDecorator('channel', {
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
                      initialValue: {
                        value: this.state.orderDetail.channelId || JSON.parse(localStorage.user).relatedPartyId,
                        meaning: this.state.orderDetail.channelName || ''
                      },
                    })(
                      <Lov title="选择渠道" disabled={this.state.disabled} itemChange={this.channelChange.bind(this)} lovCode='CNL_AGENCY_NAME' params ={{userId:JSON.parse(localStorage.user).userId}} />
                    )}
                  </Form.Item>
                </div>
              }
              <Form.Item label="意向移民国家" {...formItemLayout}>
                {getFieldDecorator('migrateCountry', {
                  rules: [{required: true,message: '请输入意向移民国家',whitespace: true}],
                  initialValue: this.state.orderDetail.migrateCountry,
                })(
                  <Input disabled={this.state.disabled} />
                )}
              </Form.Item>
              <Form.Item label="基本预算（人民币）" {...formItemLayout}>
                {getFieldDecorator('budget', {
                  rules: [
                    {required:true,message:'请输入基本预算（人民币）',whitespace:true},
                    {
                      validator: (rule,value,callback) => {
                        value =  (""+value).replace(/,/g,"").replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                        setFieldsValue({budget:value});
                        callback();
                      }
                    }
                  ],
                  initialValue: this.state.orderDetail.budget,
                })(
                  <NumbericeInput disabled={this.state.disabled} />
                )}
              </Form.Item>
              <Form.Item label="选择项目" {...formItemLayout}>
                {getFieldDecorator('item', {
                  initialValue: {
                    value: this.state.orderDetail.itemId,
                    meaning: this.state.orderDetail.itemName,
                    record: {
                      itemId: this.state.orderDetail.itemId,
                      itemCode: this.state.orderDetail.itemCode,
                      itemName: this.state.orderDetail.itemName,
                      sublineId: this.state.orderDetail.sublineId,
                      productSupplierId: this.state.orderDetail.productSupplierId,
                      currency: this.state.orderDetail.currency,
                      channelId: this.state.orderDetail.channelId,
                    }
                  },
                  rules: [{
                    required: true,
                    validator: (rule,value,callback) => {
                      if (value && (!value.value || !value.meaning)) {
                        callback('请选择项目');
                      } else {
                        callback();
                      }
                    }
                  }],
                })(
                  <Lov disabled={this.state.disabled||this.state.channelFlag} params={{channelId:this.state.channelParam}} itemChange={this.itemChange.bind(this)} config={true} title="添加产品" lovCode='IMMIGRATION_PRD_ITEMS' placeholder="请选择项目" />
                )}
              </Form.Item>
              <Form.Item label="预约洽谈时间" {...formItemLayout}>
                {getFieldDecorator('reserveDate', {
                  rules: [{required:true,message:'请选择预约洽谈时间',whitespace:true,type:'object'}],
                  initialValue: isNaN(moment(this.state.orderDetail.reserveDate,"YYYY-MM-DD HH:mm"))?
                                  null
                                  :
                                  moment(this.state.orderDetail.reserveDate,"YYYY-MM-DD HH:mm")
                })(
                  <DatePicker
                    disabled={this.state.disabled}
                    placeholder=""
                    disabledDate={this.disabledStartDate.bind(this)}
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: moment('09:00', 'HH:mm'),
                      format: 'HH:mm'
                    }}
                    disabledTime={this.disabledDateTime.bind(this)}
                    format="YYYY-MM-DD HH:mm"
                    style={{width: '100%'}}
                  />
                )}
              </Form.Item>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Row style={{marginBottom: "28px", paddingLeft: "18px", paddingRight: "13px", fontSize: '1.3em', backgroundColor: "#e2dccc"}}>
              基本资料
              <span onClick={this.display.bind(this, "display_baseInfo")} className="pull-right">
                <Icon type="down" />
              </span>
            </Row>
            <Row id="display_baseInfo">
              <Form.Item label="申请人姓名" {...formItemLayout}>
                {getFieldDecorator('applicantCustomer', {
                  initialValue: {
                    value: this.state.orderDetail.applicantCustomerId,
                    meaning: this.state.orderDetail.chineseName,
                    record: {
                      customerId: this.state.orderDetail.applicantCustomerId,
                      chineseName: this.state.orderDetail.chineseName,
                      birthDate: this.state.orderDetail.birthDate,
                      email:this.state.orderDetail.email,
                      phone: this.state.orderDetail.phone,
                      phoneCode: this.state.orderDetail.phoneCode,
                      sex: this.state.orderDetail.sex,
                      address: this.state.orderDetail.address,
                      identityAddress: this.state.orderDetail.identityAddress,
                    }
                  },
                  rules: [{
                    required: true,
                    validator: (rule,value,callback) => {
                      if (value && (!value.value || !value.meaning)) {
                        callback('请选择申请人姓名');
                      } else {
                        callback();
                      }
                    }
                  }],
                })(
                  <CustomerLov disabled={this.state.disabled} lovCode='ORD_CUSTOMER'
                               placeholder="请选择申请人姓名" width="100%"
                               params ={{channelId:this.props.form.getFieldValue('channel') ? this.props.form.getFieldValue('channel').value:JSON.parse(localStorage.user).relatedPartyId}}
                               itemChange={this.customerChange.bind(this)} />
                )}
              </Form.Item>
              <Form.Item label="性别" {...formItemLayout}>
                {getFieldDecorator('sex', {
                  rules: [{required:true,message:'请输入性别',whitespace:true}],
                  initialValue:  this.state.orderDetail.sex,
                })(
                  <Select disabled={this.state.disabled}>
                    {genderOptions}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="电子邮箱" {...formItemLayout}>
                {getFieldDecorator('email', {
                  rules: [
                    {type: 'email', message: '请输入合法的邮箱地址',},
                    {required:true,message:'请输入电子邮箱',whitespace:true}
                  ],
                  initialValue:  this.state.orderDetail.email,
                })(
                  <Input disabled={this.state.disabled} />
                )}
              </Form.Item>
              <Form.Item label="电话号码" {...formItemLayout}>
                {getFieldDecorator('phone', {
                  rules: [{
                    required:true,message:'请输入电话号码',whitespace:true
                  },{
                    validator: this.checkPhone.bind(this),
                  }],
                  initialValue:  this.state.orderDetail.phone,
                })(
                  <NumberInput disabled={this.state.disabled}  addonBefore={phoneCode} style={{width:'100%'}} />
                )}
              </Form.Item>
              <Form.Item label="出生日期" {...formItemLayout}>
                {getFieldDecorator('birthDate', {
                  initialValue: isNaN(moment(this.state.orderDetail.birthDate,"YYYY-MM-DD"))?
                                  null
                                  :
                                  moment(this.state.orderDetail.birthDate,"YYYY-MM-DD"),
                  rules: [{required:true,message:'请输入出生日期',whitespace:true,type:'object'}],
                })(
                  <DatePicker disabled={this.state.disabled} placeholder="请选择或填写出生日期，例如1990-01-01" style={{width: '100%'}} />
                )}
              </Form.Item>
              <Form.Item label="现在住址" {...formItemLayout}>
                {getFieldDecorator('address', {
                  initialValue:  [this.state.orderDetail.identityNation,this.state.orderDetail.identityProvince,this.state.orderDetail.identityCity],
                  rules: [{required:true,message:'请输入现在住址',whitespace:true,type:'array'}],
                })(
                  <Cascader disabled={this.state.disabled} placeholder="" options={livingCityOptions} />
                )}
              </Form.Item>
              <Form.Item label="详细地址" {...formItemLayout}>
                {getFieldDecorator('identityAddress', {
                  initialValue:  this.state.orderDetail.identityAddress,
                  rules: [{required:true,message:'请输入详细地址',whitespace:true}],
                })(
                  <Input disabled={this.state.disabled} />
                )}
              </Form.Item>
              <Form.Item label="婚姻状况" {...formItemLayout}>
                {getFieldDecorator('marriageStatus', {
                  initialValue: this.state.orderDetail.marriageStatus,
                })(
                  <Select disabled={this.state.disabled}>
                    {maritalStatusOptions}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="家庭状况" {...formTableLayout}>
                <Table columns={columns} bordered pagination={false}
                       dataSource={this.state.ordBeneficiary} />
              </Form.Item>
              <Form.Item label="是否可以做国外长期居住" {...formItemLayout}>
                {getFieldDecorator('abroadLiveFlag', {
                  initialValue:  this.state.orderDetail.abroadLiveFlag,
                })(
                  <Select disabled={this.state.disabled}>
                    {yesOrNoOptions}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="是否曾经申请任何国家签证拒绝" {...formItemLayout}>
                {getFieldDecorator('visaRefuseFlag', {
                  initialValue:  this.state.orderDetail.visaRefuseFlag,
                })(
                  <Select disabled={this.state.disabled}>
                    {yesOrNoOptions}
                  </Select>
                )}
              </Form.Item>
              {
                getFieldValue("visaRefuseFlag")=="Y"?
                  <div>
                    <Form.Item label="哪个国家" {...formItemLayout}>
                      {getFieldDecorator('visaRefuseCountry', {
                        initialValue:  this.state.orderDetail.visaRefuseCountry,
                      })(
                        <Input disabled={this.state.disabled} />
                      )}
                    </Form.Item>
                    <Form.Item label="原因" {...formItemLayout}>
                      {getFieldDecorator('visaRefuseReason', {
                        initialValue:  this.state.orderDetail.visaRefuseReason,
                      })(
                        <textarea style={{width:"100%",padding:"0 5px",resize:this.state.disabled?'none':'both'}} disabled={this.state.disabled} />
                      )}
                    </Form.Item>
                  </div>
                  :
                  ""
              }
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Row style={{marginBottom: "28px", paddingLeft: "18px", paddingRight: "13px", fontSize: '1.3em', backgroundColor: "#e2dccc"}}>
              教育程度
              <span onClick={this.display.bind(this, "display_education")} className="pull-right">
                <Icon type="down" />
              </span>
            </Row>
            <Row id="display_education">
              <Form.Item {...formTableLayout} label="申请人的教育情况（从初中开始填写）">
                <Table columns={columns2} bordered pagination={false}
                       dataSource={this.state.ordCstEducation} />
              </Form.Item>
              <Form.Item label="是否有国外教育经历" {...formItemLayout}>
                {getFieldDecorator('abroadEducationFlag', {
                  initialValue:  this.state.orderDetail.abroadEducationFlag,
                })(
                  <Select disabled={this.state.disabled}>
                    {yesOrNoOptions}
                  </Select>
                )}
              </Form.Item>
              {
                getFieldValue("abroadEducationFlag")=="Y"?
                  <div>
                    <Form.Item label="国家" {...formItemLayout}>
                      {getFieldDecorator('abroadEducationCountry', {
                        initialValue: this.state.orderDetail.abroadEducationCountry,
                      })(
                        <Input disabled={this.state.disabled} />
                      )}
                    </Form.Item>
                    <Form.Item label="学校" {...formItemLayout}>
                      {getFieldDecorator('abroadEducationSchool', {
                        initialValue: this.state.orderDetail.abroadEducationSchool,
                      })(
                        <Input disabled={this.state.disabled} />
                      )}
                    </Form.Item>
                    <Form.Item label="专业" {...formItemLayout}>
                      {getFieldDecorator('abroadEducationProfession', {
                        initialValue: this.state.orderDetail.abroadEducationProfession,
                      })(
                        <Input disabled={this.state.disabled} />
                      )}
                    </Form.Item>
                    <Form.Item label="起始时间" {...formItemLayout}>
                      {getFieldDecorator('abroadEducationDate', {
                        initialValue: [
                          isNaN(moment(this.state.orderDetail.abroadEducationStartDate,"YYYY-MM-DD HH:mm"))?
                                        null
                                        :
                                        moment(this.state.orderDetail.abroadEducationStartDate,"YYYY-MM-DD HH:mm"),
                          isNaN(moment(this.state.orderDetail.abroadEducationEndDate,"YYYY-MM-DD HH:mm"))?
                                        null
                                        :
                                        moment(this.state.orderDetail.abroadEducationEndDate,"YYYY-MM-DD HH:mm")
                        ]
                      })(
                        <DatePicker.RangePicker disabled={this.state.disabled} placeholder="" style={{width:'100%'}}/>
                      )}
                    </Form.Item>
                  </div>
                  :
                  ""
              }
              <Form.Item label="英语能力" {...formItemLayout}>
                {getFieldDecorator('englishAbility', {
                  initialValue: this.state.orderDetail.englishAbility
                })(
                  <Select disabled={this.state.disabled}>
                    {englishAbilityOptions}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="估计雅思考试成绩 " {...formItemLayout}>
                {getFieldDecorator('ieltsScore', {
                  initialValue: this.state.orderDetail.ieltsScore,
                  rules: [{
                    validator: (rule, value, callback) => {
                      if (value) {
                        setFieldsValue({ieltsScore:value.toString().replace('-','')});
                      }
                      callback();
                    }
                  }]
                })(
                  <InputNumber disabled={this.state.disabled} style={{width:"100%"}} />
                )}
              </Form.Item>
              <Form.Item label="其他语言能力" {...formItemLayout}>
                {getFieldDecorator('otherLang', {
                  initialValue: (typeof this.state.orderDetail.otherLang == 'string' && this.state.orderDetail.otherLang)?this.state.orderDetail.otherLang.split(','):[]
                })(
                  <Select disabled={this.state.disabled} mode="multiple">
                    {otherLanguageOptions}
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formTableLayout}>
                <Table columns={columns3} bordered pagination={false}
                       dataSource={this.state.ordCstSkill} />
              </Form.Item>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Row style={{marginBottom: "28px", paddingLeft: "18px", paddingRight: "13px", fontSize: '1.3em', backgroundColor: "#e2dccc"}}>
              工作经历
              <span onClick={this.display.bind(this, "display_workExperience")} className="pull-right">
                <Icon type="down" />
              </span>
            </Row>
            <Row id="display_workExperience">
              <Form.Item {...formTableLayout}>
                <Table columns={columns4} bordered pagination={false}
                      dataSource={this.state.ordCstWork} />
              </Form.Item>
              <Form.Item {...formTableLayout}>
                <Form.Item style={{float:'left'}}>
                  <span className="ant-form-item-required"></span>
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('chk', {
                    valuePropName: 'checked',
                    initialValue: this.state.disabled,
                    rules: [{
                      required: true,
                      whitespace: true,
                      type: 'boolean',
                      validator: (rule,value,callback) => {
                        if (value) {
                          callback();
                        } else {
                          callback('确认信息后请打勾!');
                        }
                      }
                    }],
                  })(
                    <Checkbox disabled={this.state.disabled} style={{fontSize:'15px'}}>
                        本人确认以上信息均为本人信息，信息真是准确。若因信息虚假造成的一切影响均由本人承担。
                      </Checkbox>
                  )}
                </Form.Item>
              </Form.Item>
            </Row>
            <Row style={{textAlign:'center'}}>
              <Button type="default" disabled={this.state.disabled} style={{width:'120px',height:'40px',marginRight: '80px'}} onClick={this.goBack.bind(this)}>取消</Button>
              <Button type="primary" id="submitBtn" disabled={this.state.disabled} style={{width:'120px',height:'40px'}} onClick={this.handleSubmit.bind(this)}>提交</Button>
            </Row>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(ProductionSubscribeComponent);
