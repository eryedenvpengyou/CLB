/*
 * show 计划书申请
 * @author:zhouting
 * @version:20170517
 */
import React from 'react';
import {connect} from 'dva';
import {Breadcrumb,Form,Checkbox,Input,Row,Col, Button, Select, DatePicker,Tooltip,Icon,InputNumber,Modal,message,Radio,Cascader} from 'antd';
import {queryAll,apply,production,selfpay,plan,extract,adtRisk,cancelPlan,team,planCount} from '../../services/plan.js';
import moment from 'moment';
import {npcCascade,sortCustom} from '../../utils/common';
import {getCode} from '../../services/code';
import {NumberInput} from "../common/Input";
import Lov from '../common/Lov';
import TipModal from "../common/modal/Modal";
import style from '../../styles/plan.css';
import styles from '../../styles/common.css';

const RadioGroup = Radio.Group;

const FormItem = Form.Item;
const Option = Select.Option;

const typeCodeView = "view";
const typeCodeEdit = "edit";
const typeCodeApply = "apply";

function unique(a) {
  return a.concat().sort().filter(function (item, pos, ary) {
    return !pos || item != ary[pos - 1];
  });
}
class planApply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          uuid: 0,
          uuid2: 0,
          channelList:[],
          operationCode: this.props.operationCode, //界面操作权限
          disabled: false,
          checkAll: false, //投保人与受保人不同
          validateInsuredSum: '请输入保险总额',
          //查询条件后端交互对象
          selectBody : {
            planId:this.props.planId,
            status: '',
            requestNumber:'',
            insurantName:'',
            startDate:'',
            endDate:'',
            type:'personal'
          },
          selectExtractBody : {
            planId:this.props.planId
          },
          //提交后端交互对象
          body: {
            planId:'',
            crawlerFlag:'N',
            insurantName:'',//
            insurantNationality:'',
            insurantResidence:'',
            insurantGender:'',
            insurantSmokeFlag:'',
            insurantBirth:'',
            policyInsurantSameFlag:'',

            objectVersionNumber:1,
            policyHolderName:'',
            policyHolderNationality:'',
            policyHolderResidence:'',
            policyHolderGender:'',
            policyHolderSmokeFlag:'',
            policyHolderBirth:'',

            supplierName:'',
            itemId:1,
            sublineId:10,
            payMethod:'',
            currency:'',
            //amountType:'',
            //amount:'',
            extractFlag:'N',
            additionalRiskFlag:'N',
            advancedMedicalFlag:'N',
            extractType:'',
            extractMethod:'',
            advancedMedicalItemId:'',
            advancedMedicalSecurityLevel:'',
            advancedMedicalSecurityArea:'',
            advancedMedicalSelfpayId:'',

            comments:'',
            province:'',
            city:'',
            requestDate:'',
            requestType:'一般申请',

            plnPlanRequestAdtlRiskList:[
              {
                planId:'',
                itemId: 2,
                comments: 'test2',
                objectVersionNumber: 1,
                lineId: 1,
              }
            ],
            plnPlanRequestExtractList:[{
              planId:'',
              amount:101,
              yearFrom:2001,
              yearTo:2001,
              objectVersionNumber: 1,
              lineId: 1,
            }],
            channelName:JSON.parse(localStorage.user).relatedPartyId,
            channelId:JSON.parse(localStorage.user).relatedPartyId,
            downloadFlag:'N'
          },
          //动态必输验证
          bodyValidateItem: {
            //投保人与受保人不同
            checkDiff: false,
            //产品为高端医疗、万用寿险、普通产品时
            checkDefaultProduct: false,
            checkMedicalProduct: false,
            checkHome:true,
            checkLiving: false,
            checkInsuredSum: true,
            //附加险信息
            checkAdditionalRisk: false,
            //添加提取
            checkAddExtract: false,
            //提取时金额是否必输
            checkMoney:false,
            //添加高端医疗
            checkHighMedical: false,
            //提交
            submitConfirm:false
          },
            //快码值
          codeList: {
            nationalList: [],
            provinceList:[],
            cityList: [],
            genderList: [],
            smokeFlagList: [],
            backtrackFlagList: [],
            payMethodList: [],
            currencyList: [],
            moneyTypeList:[],
            extractType:[],
            extractWay:[],
          },
          //获取产品公司
          companyList:[],
          //所选产品公司名称
          companyName: '',
          bodyCompany: {
            type: 'PC',
            businessScope: '保险',
            page:1,
            pagesize:999999,
          },
          //所选产品的名称
          productName: '',
          bodyAllProduction: {
            supplierId: '',
            itemId:'',
            bigClassName:'保险',
            enabledFlag: 'Y',
            page:1,
            pagesize:999999
          },
          //获取全部产品列表
          allProductionList:[],
          //获取主险产品列表
          productionList:[],
          //高端医疗-产品列表
          productionListMed:[],
          //附加险=是 产品列表
          addProductionList:[],
          //获取产品--年期
          productYeatList:[],
          //获取产品--缴费方式
          paymentList:[],
          //获取产品--缴费币种
          defaultCurrencyList:[],
          //高端医疗保障级别保障地区
          levelList:[],
          prdItemSecurityPlanList:[],//保障地区-高端医疗产品
          prdItemAddSecurityPlanList:[],//保障地区-添加高端医疗
          SlevelList:[],//保障级别-高端医疗产品
          addSlevelList:[],//保障级别-添加高端医疗
          SregionList:[],//获取保障地区-高端医疗产品
          addSregionList:[],//获取保障地区-添加高端医疗
          selfpayList:[],//自付选项-高端医疗产品
          addSelfpayList:[],//自付选项-添加高端医疗

          options:[],
          livingDetail:[],

          keys1: [],
          keys2: [],

          proHl:true
        }
    }
    componentDidMount() {
      //获取快码值
      var codeBody = {
        nationalList: 'PUB.NATION',
        provinceList:'PUB.PROVICE',
        cityList: 'PUB.CITY',
        genderList: 'HR.EMPLOYEE_GENDER',
        smokeFlagList: 'SYS.YES_NO',
        backtrackFlagList: 'PLN.BACK_TRACK',
        payMethodList: 'CMN.PAY_METHOD',
        currencyList: 'PUB.CURRENCY',
        moneyTypeList: 'PLN.AMOUNT_TYPE',
        extractType:'PLN.EXTRACT_TYPE',
        extractWay:'PLN.EXTRACT_METHOD',
      };
      getCode(codeBody).then((data) => {
        const options = npcCascade(data);
        this.setState({
          options: options,
          codeList: data
        });
      });
      //获取产品公司
      queryAll(this.state.bodyCompany).then((data) =>{
        this.state.companyList = data.rows;
        this.setState({
          companyList:data.rows
        });
        if (this.state.operationCode == typeCodeView) {//仅查看
          this.selectPlanApply(this.state.operationCode);
        } else if (this.state.operationCode == typeCodeEdit) {//可编辑
          this.selectPlanApply(this.state.operationCode);
        } else if (this.state.operationCode == typeCodeApply){//来源-产品
          if (this.props.planId > 0 && this.props.itemId > 0) {
            this.productPlanApply();
          }
        }
      });
      this.attrSet();
    }
    componentDidUpdate(){
      var selectDis = document.getElementsByClassName('ant-select-disabled');
      var inputDis = document.getElementsByClassName('ant-input');
      var numDis = document.getElementsByClassName('ant-input-number-input');
      for (var i = 0; i < selectDis.length; i++) {
        selectDis[i].style.color = '#595959';
      };
      for (var i = 0; i < inputDis.length; i++) {
        inputDis[i].style.color = '#595959';
      };
      for(var i=0;i<numDis.length;i++){
        numDis[i].style.color = '#333';
      }
    }
    //属性权限控制
    attrSet() {
      if (this.state.operationCode == typeCodeView) {
        var temp = document.getElementById('root').getElementsByTagName('input');
        for (var i=0;i<temp.length;i++) {
          temp[i].disabled = true;
        }
        var temp = document.getElementById('root').getElementsByTagName('textarea');
        for (var i=0;i<temp.length;i++) {
          temp[i].disabled = true;
        }
        this.state.disabled = true;
        document.getElementsByClassName('handleReset')[0].style.display = 'none';
        document.getElementsByClassName('handleSubmit')[0].style.display = 'none';
        document.getElementsByClassName('handleCancel')[0].style.display = 'none';
      } else if (this.state.operationCode == typeCodeEdit) {
        document.getElementsByClassName('handleReset')[0].style.display = 'none';
        document.getElementsByClassName('handleReturn')[0].style.display = 'none';
        if(this.state.status=="PLN_CANCELLED"){
          document.getElementsByClassName('handleCancel')[0].style.display = 'none';
        }
      } else if (this.state.operationCode == typeCodeApply) {
        document.getElementsByClassName('handleCancel')[0].style.display = 'none';
        document.getElementsByClassName('handleReturn')[0].style.display = 'none';
      }
    }
    //计划书申请查询展示
    selectPlanApply(typeCode) {
      if (typeCode == typeCodeView || typeCode == typeCodeEdit) {
        if (this.props.itemId == 1) {
          this.state.selectBody.type = 'personal';
        } else if(this.props.itemId == 2) {
          this.state.selectBody.type = 'team';
        }
        plan(this.state.selectBody).then((data) =>{
          if (data.success) {
            this.state.body = data.rows[0];
            this.state.companyName = this.state.body.name;
            this.state.productName = this.state.body.itemName;
            //投保人受保人是否相同
            this.state.body.policyInsurantSameFlag == 'Y'?
            this.props.form.setFieldsValue({checks:true}):
            this.props.form.setFieldsValue({checks:false})
            //全部产品
            this.state.allProductionList = [];
            //主险产品
            this.state.productionList = [];
            //高端医疗产品
            this.state.productionListMed = [];
            //附加险产品
            this.state.addProductionList = [];
            this.insuranceChange(this.state.body.amountType);
            //获取产品信息
            this.state.bodyAllProduction.supplierId = this.state.body.supplierName;
            this.state.bodyAllProduction.itemId = '';
            production(this.state.bodyAllProduction).then((data) => {
              if (data.success) {
                this.state.allProductionList = data.rows;
                data.rows.map((res)=>{
                  //主险产品
                  if (res.midClass != 'FJX' ) {
                    this.state.productionList.push(res);
                  }
                  //高端医疗获取产品信息
                  if (res.minClassName == '高端医疗' && res.attribute1 == 'Y') {
                    this.state.productionListMed.push(res);
                  }
                  //附加险获取产品信息
                  if (res.attribute1 == 'Y') {
                    this.state.addProductionList.push(res);
                  }
                });
                if(this.state.body.requestType=='高端医疗'){
                  this.handleProductionChange(this.state.body.itemId,this.state.body.securityLevel,true);
                }else{
                  this.handleProductionChange(this.state.body.itemId,this.state.body.securityLevel,true);
                  this.handleMdeProductionChange(this.state.body.advancedMedicalItemId,this.state.body.advancedMedicalSecurityLevel)
                }

                this.handleSelectChange(0,true,this.state.body.additionalRiskFlag);
                this.handleSelectChange(1,true,this.state.body.extractFlag);
                this.handleSelectChange(2,true,this.state.body.advancedMedicalFlag);
                //居住城市
                this.state.livingDetail.push(this.state.body.insurantResidence);
                this.state.livingDetail.push(this.state.body.province);
                this.state.livingDetail.push(this.state.body.city);
                //Set Form属性值
                this.props.form.setFieldsValue({
                  //渠道信息
                  channel: {
                    value: this.state.body.channelId,
                    meaning: this.state.body.channelName,
                    record: {
                      channelId: this.state.body.channelId,
                      channelName: this.state.body.channelName,
                    }
                  },
                  //受保人
                  name:this.state.body.insurantName,
                  nationality:this.state.body.insurantNationality,
                  home:this.state.body.insurantResidence,
                  livingCity:this.state.livingDetail,
                  gender:this.state.body.insurantGender,
                  smokes:this.state.body.insurantSmokeFlag,
                  backtrackFlag:this.state.body.backtrackFlag,
                  birthday:moment(this.state.body.insurantBirth,'YYYY-MM-DD'),
                  //投保人
                  applicant:this.state.body.policyHolderName,
                  applicantNationality:this.state.body.policyHolderNationality,
                  applicantHome:this.state.body.policyHolderResidence,
                  applicantGender:this.state.body.policyHolderGender,
                  applicantSmokes:this.state.body.policyHolderSmokeFlag,
                  applicantBirthday:moment(this.state.body.policyHolderBirth,'YYYY-MM-DD'), //
                  //产品信息
                  company:this.state.body.supplierName,
                  defaultCurrency:this.state.body.currency,
                  defaultMedicalCurrency:this.state.body.currency,
                  //
                  payment:this.state.body.payMethod,
                  totalAccount:this.state.body.amountType,
                  currency:this.state.body.currency,
                  insuranceAdd:this.state.body.additionalRiskFlag,
                  draw:this.state.body.extractFlag,
                  topMedical:this.state.body.advancedMedicalFlag,

                  remarks:this.state.body.comments,
                  extractType:this.state.body.extractType,
                  extractWay:this.state.body.extractMethod,
                });
                if(this.state.body.selfpayId){
                  this.props.form.setFieldsValue({
                    medicalRank:this.state.body.securityLevel,
                    medicalRegion:this.state.body.securityArea,
                    medicalSelfPay:this.state.body.selfpayId.toString(),
                  });
                }
                if(this.state.body.amount){
                  this.props.form.setFieldsValue({
                    totalAccountInput:parseInt(this.state.body.amount),
                  })
                }
                if(this.state.body.itemId){
                  this.props.form.setFieldsValue({
                    products:this.state.body.itemId.toString(),
                    years:this.state.body.sublineId.toString(),
                  })
                }
                if(this.state.body.advancedMedicalItemId){
                  this.props.form.setFieldsValue({
                    addMedicalProductName:this.state.body.advancedMedicalItemId.toString(),
                    addMedicalRank:this.state.body.advancedMedicalSecurityLevel.toString(),
                    safeguardArea:this.state.body.advancedMedicalSecurityArea,
                    addMedicalHighSelfPay:this.state.body.advancedMedicalSelfpayId.toString(),
                  })
                }
                //添加提取
                this.state.uuid = 0;
                adtRisk(this.state.selectExtractBody).then((data) => {
                  this.state.body.plnPlanRequestAdtlRiskList = data.rows;
                  this.state.body.plnPlanRequestAdtlRiskList.map((res,index)=>{
                    if(index==0){
                      this.props.form.setFieldsValue({
                        additional: res.itemId.toString(),
                        additionalRemarks: res.comments,
                        additionalLineId: res.lineId,
                        additionalObjectVersionNumber: res.objectVersionNumber,
                      });
                    }else{
                      this.add(1, true);
                      this.props.form.setFieldsValue({
                        [`additional${index}`]: res.itemId.toString(),
                        [`additionalRemarks${index}`]: res.comments,
                        [`additionalLineId${index}`]: res.lineId,
                        [`additionalObjectVersionNumber${index}`]: res.objectVersionNumber,
                      });
                    }
                  });
                });

                this.handleExtractWayChange(this.state.body.extractMethod);
                extract(this.state.selectExtractBody).then((data) => {
                  this.state.body.plnPlanRequestExtractList = data.rows;
                  this.state.uuid2 = 0;
                  this.state.body.plnPlanRequestExtractList.map((res,index)=>{
                    if(index==0){
                      this.props.form.setFieldsValue({
                        extractYearHead: res.yearFrom.toString(),
                        extractYearEnd:res.yearTo.toString(),
                        extractSum: res.amount == null?null:res.amount.toString(),
                        extractLineId: res.lineId,
                        extractObjectVersionNumber: res.objectVersionNumber,
                      });
                    }else{
                      this.add(2, true);
                      this.props.form.setFieldsValue({
                        [`extractYearHead${index}`]: res.yearFrom.toString(),
                        [`extractYearEnd${index}`]: res.yearTo.toString(),
                        [`extractSum${index}`]:  res.amount == null?null:res.amount.toString(),
                        [`extractLineId${index}`]: res.lineId,
                        [`extractObjectVersionNumber${index}`]: res.objectVersionNumber,
                      });
                    }
                  });
                });

                //投保人与受保人相同
                if(this.state.body.policyInsurantSameFlag=="Y"){
                  this.handleCheckChange(true,`true`);
                }

                if(this.state.body.status=="PLN_CANCELLED"&&this.state.operationCode==typeCodeView){
                  document.getElementsByClassName('handleReturn')[0].remove();
                }else if(this.state.body.status=="COMPLETED"){
                  document.getElementsByClassName('handleReturn')[0].remove();
                  document.getElementsByClassName('handleCancel')[0].remove();
                }
              }
            });
          }
        });
      }
    }
    //产品出计划书展示
    productPlanApply(){
      //全部产品
      this.state.allProductionList = [];
      //主险产品
      this.state.productionList = [];
      //高端医疗产品
      this.state.productionListMed = [];
      //附加险产品
      this.state.addProductionList = [];
      this.state.body.supplierName = this.props.planId;
      this.state.body.itemId = this.props.itemId;
      this.state.bodyAllProduction.supplierId = this.state.body.supplierName;
      this.state.bodyAllProduction.itemId = '';
      this.state.companyList.map((res) => {
        if (this.props.planId == res.supplierId) {
          this.state.companyName = res.name;
          return;
        }
      });
      production(this.state.bodyAllProduction).then((data) => {
        if (data.success) {
          this.state.allProductionList = data.rows;
          data.rows.map((res)=>{
            //主险产品
            if (res.midClass != 'FJX' ) {
              this.state.productionList.push(res);
            }
            //高端医疗获取产品信息
            if (res.minClassName == '高端医疗' && res.attribute1 == 'Y') {
              this.state.productionListMed.push(res);
            }
            //附加险获取产品信息
            if (res.attribute1 == 'Y') {
              this.state.addProductionList.push(res);
            }
          });
          this.handleSelectChange(0,false,'N');
          this.handleSelectChange(1,false,'N');
          this.handleSelectChange(2,false,'N');
          this.handleProductionChange(this.state.body.itemId);
          //Set Form属性值
          this.props.form.setFieldsValue({
            //产品信息
            company:this.state.body.supplierName,
            products:this.state.body.itemId.toString()
          });
        }
      });
    }

    //Set state 产品信息
    setProuctionList(val){
      //获取产品信息
      this.state.bodyAllProduction.supplierId = val;
      this.state.bodyAllProduction.itemId = '';
      this.state.companyList.map((res) => {
        if (val == res.supplierId) {
          this.state.companyName = res.name;
          this.state.bodyAllProduction.supplierName = res.name
          return;
        }
      });
      //全部产品
      this.state.allProductionList = [];
      //主险产品
      this.state.productionList = [];
      //高端医疗产品
      this.state.productionListMed = [];
      //附加险产品
      this.state.addProductionList = [];
      production(this.state.bodyAllProduction).then((data) => {
        if (data.success) {
          data.rows.map((res)=>{
            //主险产品
            if (res.midClass != 'FJX' ) {
              this.state.productionList.push(res);
            }
            //高端医疗获取产品信息
            if (res.minClassName == '高端医疗' && res.attribute1 == 'Y') {
              this.state.productionListMed.push(res);
            }
            //附加险获取产品信息
            if (res.attribute1 == 'Y') {
              this.state.addProductionList.push(res);
            }
          });
          this.handleSelectChange(0,false,'N');
          this.handleSelectChange(1,false,'N');
          this.handleSelectChange(2,false,'N');
          this.setState({
            allProductionList: data.rows,
            productionList: this.state.productionList,
            productionListMed: this.state.productionListMed,
            addProductionList: this.state.addProductionList,
          });
        }
      });
    }
    //计划书申请提交
    handleSubmit() {
      if (parseInt(this.state.channelList) <= 0) {
        planCount().then((data) => {
          TipModal.error({
            content: <div><font>计划书额度不够！</font>
              <br /><font>友情提示：保单签单时可扩增计划书额度，1张签单={data}份计划书</font></div>
          });
          return;
        })
      } else {
        //保险总额请输入为100倍数的数字
        var total = this.props.form.getFieldValue(`totalAccountInput`);
        var totalAccount = this.props.form.getFieldValue(`totalAccount`);
        if (this.state.companyName.indexOf('保诚') != -1 && totalAccount == 'IC' && total % 100 != 0) {
          this.props.form.setFields({
            totalAccountInput: {
              value: total,
              errors: [new Error('保险总额请输入为100倍数的数字')],
            },
          });
          return;
        }
        this.props.form.validateFields((err, values) => {
          if (!err) {
            //initialValue
            this.state.body.plnPlanRequestAdtlRiskList = [];
            this.state.body.plnPlanRequestExtractList = [];

            var insurantB_d;
            var birthday;
            if (values.birthday) {
              insurantB_d = values.birthday._d;
              birthday = insurantB_d.getFullYear() + '-' + (insurantB_d.getMonth() + 1) + '-' + insurantB_d.getDate() + " " +
                "00" + ":" + "00" + ":" + "00";
            }
            var myDate = new Date();
            if (JSON.parse(localStorage.user).userType == "ADMINISTRATION") {
              this.state.body.channelName = values.channel.record.channelName
              this.state.body.channelId = values.channel.record.channelId
            }
            this.state.body.requestDate = myDate.toLocaleString();
            this.state.body.insurantName = values.name;
            this.state.body.insurantNationality = values.nationality;
            if (this.state.bodyValidateItem.checkLiving == true) {
              this.props.form.setFieldsValue({
                home: (values.livingCity)[0]
              });
              this.state.body.province = (values.livingCity)[1]
              this.state.body.city = (values.livingCity)[2]
            } else if (this.state.bodyValidateItem.checkLiving == false) {
              this.state.body.city = '';
              this.state.body.province = '';
            }

            this.state.body.insurantResidence = this.props.form.getFieldValue(`home`);
            this.state.body.insurantGender = values.gender;
            this.state.body.insurantSmokeFlag = values.smokes;
            this.state.body.backtrackFlag = values.backtrackFlag;
            this.state.body.insurantBirth = birthday;
            if (values.checks == undefined || values.checks == false) {
              this.state.body.policyInsurantSameFlag = 'N'
              this.state.body.policyHolderName = values.name;
              this.state.body.policyHolderNationality = values.nationality;
              if (this.state.bodyValidateItem.checkLiving == true) {
                this.state.body.policyHolderResidence = (values.livingCity)[0];
              } else if (this.state.bodyValidateItem.checkLiving == false) {
                this.state.body.policyHolderResidence = values.home;
              }
              this.state.body.policyHolderGender = values.gender;
              this.state.body.policyHolderSmokeFlag = values.smokes;
              this.state.body.policyHolderBirth = birthday;
            } else if (values.checks == true) {
              var applicantB_d = values.applicantBirthday._d;
              var applicantBirthday = applicantB_d.getFullYear() + '-' + (applicantB_d.getMonth() + 1) + '-' + applicantB_d.getDate() + " " +
                "00" + ":" + "00" + ":" + "00";

              this.state.body.policyInsurantSameFlag = 'Y'
              this.state.body.policyHolderName = values.applicant;
              this.state.body.policyHolderNationality = values.applicantNationality;
              this.state.body.policyHolderResidence = values.applicantHome;
              this.state.body.policyHolderGender = values.applicantGender;
              this.state.body.policyHolderSmokeFlag = values.applicantSmokes;
              this.state.body.policyHolderBirth = applicantBirthday;
            }

            this.state.body.supplierName = values.company
            this.state.body.itemId = parseInt(values.products)
            this.state.body.sublineId = parseInt(values.years);
            this.state.body.payMethod = values.payment;
            if (this.state.body.requestType == '高端医疗') {
              this.state.body.currency = values.defaultMedicalCurrency;
            } else {
              this.state.body.currency = values.defaultCurrency;
            }
            if(values.totalAccountInput){
              this.state.body.amountType = values.totalAccount;
              this.state.body.amount = (values.totalAccountInput).toFixed(2);
            }
            this.state.body.additionalRiskFlag = values.insuranceAdd
            this.state.body.extractFlag = values.draw
            this.state.body.advancedMedicalFlag = values.topMedical
            this.state.body.extractType = values.extractType
            this.state.body.extractMethod = values.extractWay
            this.state.body.advancedMedicalItemId = parseInt(values.addMedicalProductName)
            this.state.body.advancedMedicalSecurityLevel = values.addMedicalRank
            this.state.body.advancedMedicalSecurityArea = values.safeguardArea
            this.state.body.advancedMedicalSelfpayId = parseInt(values.addMedicalHighSelfPay)
            //产品本身是高端医疗
            this.state.body.securityLevel = values.medicalRank;
            this.state.body.securityArea = values.medicalRegion;
            this.state.body.selfpayId = values.medicalSelfPay;
            this.state.body.comments = values.remarks;

            var hour = new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours();
            var minute = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes();
            var second = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
            var nowDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + " " +
              hour + ":" + minute + ":" + second;
            this.state.body.requestDate = nowDate;
            //附加险信息、添加提取
            if ((values.additional == undefined || values.additional == "") && (values.additionalRemarks == undefined || values.additionalRemarks == "")) {
              this.state.body.plnPlanRequestAdtlRiskList = []
            } else {
              const AdtlRiskList = {};
              AdtlRiskList.itemId = parseInt(values.additional);
              AdtlRiskList.comments = values.additionalRemarks;
              AdtlRiskList.planId = this.state.body.planId
              AdtlRiskList.lineId = parseInt(values.additionalLineId)
              AdtlRiskList.objectVersionNumber = parseInt(values.additionalObjectVersionNumber)
              this.state.body.plnPlanRequestAdtlRiskList.push(AdtlRiskList);
            }
            if ((values.amount == undefined || values.amount == "") && (values.extractYearHead == undefined || values.extractYearHead == "") && (values.extractYearEnd == undefined || values.extractYearEnd == "")) {
              this.state.body.plnPlanRequestExtractList = []
            } else {
              const ExtractList = {};
              ExtractList.amount = values.extractSum
              ExtractList.yearFrom = parseInt(values.extractYearHead)
              ExtractList.yearTo = parseInt(values.extractYearEnd)
              ExtractList.planId = this.state.body.planId
              ExtractList.lineId = parseInt(values.extractLineId)
              ExtractList.objectVersionNumber = parseInt(values.extractObjectVersionNumber)
              this.state.body.plnPlanRequestExtractList.push(ExtractList);
            }
            for (var i = 1; i <= 2; i++) {
              this.state['keys' + i].map((k, index) => {
                const AdtlRiskList = {};
                const ExtractList = {};
                if (i == 1 && values[`additional${k.key}`] != '') {
                  if (k.type == 'add' && this.state.operationCode == typeCodeApply) {
                    AdtlRiskList.itemId = parseInt(values[`additional${k.key}`]);
                    AdtlRiskList.comments = values[`additionalRemarks${k.key}`];
                    AdtlRiskList.planId = this.state.body.planId
                    AdtlRiskList.lineId = parseInt(values[`additionalLineId${k.key}`]);
                    AdtlRiskList.objectVersionNumber = parseInt(values[`additionalObjectVersionNumber${k}`]);
                    this.state.body.plnPlanRequestAdtlRiskList.push(AdtlRiskList);
                  }  else if (this.state.operationCode == typeCodeEdit) {
                    AdtlRiskList.itemId = parseInt(values[`additional${k.key}`]);
                    AdtlRiskList.comments = values[`additionalRemarks${k.key}`];
                    AdtlRiskList.planId = this.state.body.planId
                    AdtlRiskList.lineId = parseInt(values[`additionalLineId${k.key}`]);
                    AdtlRiskList.objectVersionNumber = parseInt(values[`additionalObjectVersionNumber${k}`]);
                    if (k.type == 'delete') {
                      AdtlRiskList.type = 'delete';
                      if (AdtlRiskList.lineId) {
                        this.state.body.plnPlanRequestAdtlRiskList.push(AdtlRiskList);
                      }
                    } else {
                      this.state.body.plnPlanRequestAdtlRiskList.push(AdtlRiskList);
                    }
                  }
                }
                if (i == 2 && (values[`extractYearHead${k.key}`] != '' && values[`extractYearEnd${k.key}`] != '' && values[`extractSum${k.key}`] != '')) {
                  if (k.type == 'add' && this.state.operationCode == typeCodeApply) {
                    ExtractList.yearFrom = parseInt(values[`extractYearHead${k.key}`]);
                    ExtractList.yearTo = parseInt(values[`extractYearEnd${k.key}`]);
                    ExtractList.amount = values[`extractSum${k.key}`];
                    ExtractList.planId = this.state.body.planId
                    ExtractList.lineId = parseInt(values[`extractLineId${k.key}`]);
                    ExtractList.objectVersionNumber = parseInt(values[`extractObjectVersionNumber${k.key}`]);
                    this.state.body.plnPlanRequestExtractList.push(ExtractList);
                  } else if (this.state.operationCode == typeCodeEdit) {
                    ExtractList.yearFrom = parseInt(values[`extractYearHead${k.key}`]);
                    ExtractList.yearTo = parseInt(values[`extractYearEnd${k.key}`]);
                    ExtractList.amount = values[`extractSum${k.key}`];
                    ExtractList.planId = this.state.body.planId
                    ExtractList.lineId = parseInt(values[`extractLineId${k.key}`]);
                    ExtractList.objectVersionNumber = parseInt(values[`extractObjectVersionNumber${k.key}`]);
                    if (k.type == 'delete') {
                      ExtractList.type = 'delete';
                      if (ExtractList.lineId) {
                        this.state.body.plnPlanRequestExtractList.push(ExtractList);
                      }
                    } else {
                      this.state.body.plnPlanRequestExtractList.push(ExtractList);
                    }
                  }
                }
              });
            }
            //是否启动爬虫程序
            if (values.backtrackFlag == "N" && values.draw == "N" && values.insuranceAdd == "N" && values.topMedical == "N") {
              this.state.body.crawlerFlag = "Y";
            }
            apply(this.state.body).then((data) => {
              if (data.success) {
                TipModal.success({ content: data.message });
                window.location.href = '/#/plan/MyPlan';
              } else if (data.success == false && data.message.indexOf("record_not_exists_or_version_not_match") > 0) {
                TipModal.error({ content: "数据已过期，请重新查询" })
              } else {
                TipModal.error({ content: data.message })
              }
            });
          }
          this.state.bodyValidateItem.submitConfirm = true;
        });
      }
    }
    //计划书申请取消
    handleCancel() {
      TipModal.warning(this.cancelOrderConfirm.bind(this),"确定取消申请该计划书吗？");
    }
    cancelOrderConfirm(flag) {
      if(flag){
        this.state.selectBody.status = 'PLN_CANCELLED' ;
        cancelPlan(this.state.selectBody).then((data) => {
          if (data.success) {
            TipModal.success({
              title: '取消成功！',
            });
            window.location.href = '/#/plan/MyPlan';
          } else {
            TipModal.error({
              title: '取消失败！',
              content: `请联系系统管理员,${data.message}`,
            });
          }
        });
      }
    }

    //投保人与受保人相同
    handleCheckChange(initFlag,e) {
      if(e==`true`||e==`false`) var checked = e;
      else var checked = `${e.target.checked}`;
      var applicantInfo = document.getElementsByClassName('applicantInfo');
      this.state.bodyValidateItem.checkDiff = false;
      if (checked == `true`) {
        this.state.checkAll = true;
        applicantInfo[0].style.display='block';
        document.getElementsByClassName(style.checkStatus)[0].firstChild.lastChild.style.backgroundColor ='#d1b97f';
        this.state.bodyValidateItem.checkDiff = true;
        if (this.state.bodyValidateItem.submitConfirm == true) {
          this.setState({
            bodyValidateItem: this.state.bodyValidateItem,
          }, () => {
              this.props.form.validateFields([
                'applicant',
                'applicantNationality',
                'applicantHome',
                'applicantGender',
                'applicantSmokes',
                'applicantBirthday',
              ], { force: true });
            }
          );
        }
      } else if (checked == `false`) {
        this.state.checkAll = false;
        applicantInfo[0].style.display='none';
        document.getElementsByClassName(style.checkStatus)[0].firstChild.lastChild.style.backgroundColor ='#fff';
        if (initFlag == false) {
          this.props.form.setFieldsValue({
            applicant: '',
            applicantNationality: '',
            applicantHome: '',
            applicantGender: '',
            applicantSmokes: '',
            applicantBirthday: null
          });
          this.setState({
            bodyValidateItem: this.state.bodyValidateItem,
          });
        }
      }
      this.setState({
        bodyValidateItem: this.state.bodyValidateItem,
      });
    }
    //选择产品公司
    handleCompany = (val) => {
      this.props.form.setFieldsValue({
        products:'',
        years:'',
        payment:'',
        defaultCurrency:'',
        defaultMedicalCurrency:'',
        medicalRank:'',
        medicalRegion:'',
        medicalSelfPay:'',
        totalAccountInput:null,
        totalAccount:'IC',
        insuranceAdd:'N',
        draw:'N',
        topMedical:'N',
      });
      this.state.productName = '';
      this.state.proHl = true
      this.setProuctionList(val);
    }
    //选择产品
    handleProductionChange = (val, securityRegion, initFlag) =>{
      this.props.form.setFieldsValue({
        years: '',
        payment: '',
        defaultCurrency: '',
        defaultMedicalCurrency:'',
        medicalRank: '',
        medicalRegion: '',
        medicalSelfPay: '',
        addMedicalProductName: '',
        safeguardArea: '',
        addMedicalHighSelfPay: '',
        extractType:'',
        extractWay:'',
        additional:'',
        additionalRemarks:'',
        extractYearHead:'',
        extractYearEnd:'',
        extractSum:'',
        insuranceAdd:'N',
        draw:'N',
        topMedical:'N',
        totalAccountInput:null,
      });
      for (var i = 1; i <= 2; i++) {
        this.state['keys' + i].map((k, index) => {
          this.remove(i, k.key, true)
        });
      }
      if (initFlag==true) {
        this.handleSelectChange(0,false,this.state.body.additionalRiskFlag);
        this.handleSelectChange(1,false,this.state.body.extractFlag);
        this.handleSelectChange(2,false,this.state.body.advancedMedicalFlag);
      } else {
        this.handleSelectChange(0,false,this.props.form.getFieldValue('insuranceAdd'));
        this.handleSelectChange(1,false,this.props.form.getFieldValue('draw'));
        this.handleSelectChange(2,false,this.props.form.getFieldValue('topMedical'));
      }
      //document.getElementsByClassName('extractAge')[0].style.display = 'none';
      //产品相关信息获取
      this.state.productionList.map((res) => {
        if (val == res.itemId) {
          this.state.productName = res.itemName;
          //保障级别 自付 年期
          this.state.levelList = [];
          res.prdItemSecurityPlan.map((im) => {
            this.state.levelList.push(im.securityLevel)
          });
          this.setState({
            prdItemSecurityPlanList: res.prdItemSecurityPlan,
            selfpayList: sortCustom(res.prdItemSelfpayList,'SELFPAY'),
            productYeatList: sortCustom(res.prdItemSublineList||[],'SUBLINE'),
            SlevelList: unique(this.state.levelList)
          });
          //保障列表-保障地区
          this.handleSecurityRegionChange(securityRegion);
          this.state.bodyValidateItem.checkDefaultProduct = false;
          this.state.bodyValidateItem.checkMedicalProduct = false;
          this.state.bodyValidateItem.checkHome = true;
          this.state.bodyValidateItem.checkLiving = false;
          this.state.bodyValidateItem.checkInsuredSum = false;
          if (res.midClassName == '万用寿险') {//中类为万用寿险
            this.state.body.requestType = '万用寿险'
            this.state.bodyValidateItem.checkLiving = true;
            this.state.bodyValidateItem.checkHome = false;
            this.state.bodyValidateItem.checkInsuredSum = true;
            this.setState({
              body: this.state.body,
              bodyValidateItem: this.state.bodyValidateItem,
            });
            document.getElementsByClassName('defaultProduct')[0].style.display = 'none';
            document.getElementsByClassName('living')[0].style.display = 'block';
            document.getElementsByClassName('placeL')[0].style.display = 'none';
            document.getElementsByClassName('medicalProduct')[0].style.display = 'none';
            document.getElementsByClassName('insuredSum')[0].style.display = 'block';//保费
            //默认附加险，提取，高端医疗
            var selectInfo = document.getElementsByClassName('selectInfo');
            selectInfo[0].style.display = 'none';
            selectInfo[1].style.display = 'none';
            selectInfo[2].style.display = 'none';
          } else if (res.minClassName == '高端医疗') {//小类为高端医疗
            this.state.body.requestType = '高端医疗'
            this.state.bodyValidateItem.checkMedicalProduct = true;
            this.setState({
              body: this.state.body,
              bodyValidateItem: this.state.bodyValidateItem,
            });
            document.getElementsByClassName('defaultProduct')[0].style.display = 'none';
            document.getElementsByClassName('medicalProduct')[0].style.display = 'block';
            document.getElementsByClassName('living')[0].style.display = 'none';
            document.getElementsByClassName('placeL')[0].style.display = 'block';
            document.getElementsByClassName('insuredSum')[0].style.display = 'none';
            //默认附加险，提取，高端医疗
            var selectInfo = document.getElementsByClassName('selectInfo');
            selectInfo[0].style.display = 'none';
            selectInfo[1].style.display = 'none';
            selectInfo[2].style.display = 'none';
          } else {
            this.state.body.requestType = '一般申请'
            this.state.bodyValidateItem.checkDefaultProduct = true;
            this.state.bodyValidateItem.checkInsuredSum = true;
            this.setState({
              body: this.state.body,
              bodyValidateItem: this.state.bodyValidateItem,
            });
            document.getElementsByClassName('defaultProduct')[0].style.display = 'block';
            document.getElementsByClassName('medicalProduct')[0].style.display = 'none';
            document.getElementsByClassName('living')[0].style.display = 'none';
            document.getElementsByClassName('placeL')[0].style.display = 'block';
            document.getElementsByClassName('insuredSum')[0].style.display = 'block';
            var selectInfo = document.getElementsByClassName('selectInfo');
            if (this.props.form.getFieldValue('insuranceAdd') == 'Y') {
              selectInfo[0].style.display = 'none';
            }
            if (this.props.form.getFieldValue('draw') == 'Y') {
              selectInfo[1].style.display = 'none';
            }
            if (this.props.form.getFieldValue('topMedical') == 'Y') {
              selectInfo[2].style.display = 'none';
            }
          }
          if (this.state.bodyValidateItem.submitConfirm == true) {
            this.setState({
              bodyValidateItem: this.state.bodyValidateItem,
            },()=>{
                this.props.form.validateFields([
                  'defaultMedicalCurrency',
                  'medicalRank',
                  'medicalRegion',
                  'livingCity',
                  'totalAccount',
                  'totalAccountInput',
                  'defaultCurrency',
                ], { force: true });
              }
            );
          }
          //缴费方式存储
          var arr = [];
          if (res.fullyear == 'Y') {
            arr.push({ wayName: '整付', wayId: 'WP' })
          }
          if (res.oneyear == 'Y') {
            arr.push({ wayName: '年缴', wayId: 'AP' })
          }
          if (res.halfyear == 'Y') {
            arr.push({ wayName: '半年缴', wayId: 'SAP' })
          }
          if (res.quarter == 'Y') {
            arr.push({ wayName: '季缴', wayId: 'QP' })
          }
          if (res.onemonth == 'Y') {
            arr.push({ wayName: '月缴', wayId: 'MP' })
          }
          if (res.prepayFlag == 'Y') {
            arr.push({ wayName: '预付', wayId: 'FJ' })
          }
          //缴费方式、缴费币种
          this.setState({
            paymentList: arr,
            defaultCurrencyList: res.prdItemPaymode||[],
          });
          // 宏利的所有产品中分类=储蓄险，申请计划书时，可以输入保额/保费
          if(this.state.bodyAllProduction.supplierName == '宏利' || this.state.bodyAllProduction.supplierName == '宏利1'){
            if(res.midClassName == '储蓄险'){
              this.state.proHl = true
            }else{
              this.state.proHl = false
            }
          }
          return;
        }
      });
    }
    //高端医疗-选择产品
    handleMdeProductionChange = (val, securityRegion) =>{
      // initialValue
      this.props.form.setFieldsValue({
        addMedicalRank: '',
        safeguardArea: '',
        addMedicalHighSelfPay: '',
      });
      this.state.productionListMed.map((res) => {
        if (val == res.itemId) {
          this.state.levelList = [];
          res.prdItemSecurityPlan.map((im) => {
            this.state.levelList.push(im.securityLevel)
          });
          this.setState({
            prdItemAddSecurityPlanList: res.prdItemSecurityPlan,
            addSlevelList: unique(this.state.levelList),
            addSelfpayList: sortCustom(res.prdItemSelfpayList,'SELFPAY')
          });
          this.handleAddSecurityRegionChange(securityRegion);
          return;
        }
      });
    }
    //保障列表-保障地区-高端医疗产品
    handleSecurityRegionChange = (val) => {
      const regionList = [];
      this.state.prdItemSecurityPlanList.map((res) => {
        if (val == res.securityLevel) {
          regionList.push(res.securityRegion)
        }
      });
      this.setState({
        SregionList:regionList
      });
    }
    //保障列表-保障地区-添加高端医疗
    handleAddSecurityRegionChange = (val) => {
      const regionList = [];
      this.state.prdItemAddSecurityPlanList.map((res) => {
        if (val == res.securityLevel) {
          regionList.push(res.securityRegion);
        }
      });
      this.setState({
        addSregionList:regionList
      });
    }
    //展开附加险，提取金额，高端医疗
    handleSelectChange = (index,initialValue,value) =>{
      var selectInfo = document.getElementsByClassName('selectInfo');
      if (value == 'Y') {
        selectInfo[index].style.display = 'block';
        document.getElementsByClassName('others')[0].style.display = 'block'
      } else if(value == 'N') {
        selectInfo[index].style.display = 'none';

        if(selectInfo[0].style.display == 'none'&&
        selectInfo[1].style.display == 'none'&&
        selectInfo[2].style.display == 'none'){
          document.getElementsByClassName('others')[0].style.display = 'none'
          this.props.form.setFieldsValue({
            remarks:'',
          })
        }
      }
      //动态必输校验
      if (index==0) {//附加险
        if (value == 'Y') {
          this.state.bodyValidateItem.checkAdditionalRisk = true ;
        } else if (value == 'N') {
          this.state.bodyValidateItem.checkAdditionalRisk = false ;
          if(initialValue == false){
            this.state.keys1.map((item) => {
              item.type = 'delete';
            });
            this.props.form.setFieldsValue({
              additional:'',
              additionalRemarks:'',
            });
          }
        }
      } else if (index==1) {//添加提取
        if (value == 'Y') {
          this.state.bodyValidateItem.checkAddExtract = true ;
          this.state.bodyValidateItem.checkMoney = true;
        } else if (value == 'N') {
          this.state.bodyValidateItem.checkAddExtract = false ;
          this.state.bodyValidateItem.checkMoney = false;
          if (initialValue==false) {
            this.state.keys2.map((item) => {
              item.type = 'delete';
            });
            this.props.form.setFieldsValue({
              extractType:'',
              extractWay:'',
              extractYearHead:'',
              extractYearEnd:'',
              extractSum:'',
            });
          }
        }
      } else if (index==2) {
        if (value == 'Y') {
          this.state.bodyValidateItem.checkHighMedical = true ;
        } else if (value == 'N') {
          this.state.bodyValidateItem.checkHighMedical = false ;
          if(initialValue==false){
            this.props.form.setFieldsValue({
              addMedicalProductName:'',
              addMedicalRank:'',
              safeguardArea:'',
              addMedicalHighSelfPay:'',
            })
          }
        }
      }
      if (this.state.bodyValidateItem.submitConfirm == true) {
        this.setState({
          bodyValidateItem: this.state.bodyValidateItem,
        },()=>{
            this.props.form.validateFields([
              'additional',
              'extractType',
              'extractWay',
              'extractYearHead',
              'extractYearEnd',
              'extractSum',
              'addMedicalProductName',
              'addMedicalRank',
              'safeguardArea',
              'addMedicalHighSelfPay',
            ], { force: true });
          }
        );
      }
    }
    //提取方式为固定金额
    handleExtractWayChange = (val) =>{
      if(val == 'FA'){
        document.getElementsByClassName('extractPlus')[0].style.display ='block';
        document.getElementsByClassName('inputMoney')[0].style.display = 'inline-block';
        document.getElementsByClassName('maximum1')[0].style.width = '30%';
        document.getElementsByClassName('maximum2')[0].style.width = '30%';
        document.getElementsByClassName('maximum2')[0].style.left = '44%';
        document.getElementsByClassName('maximum3')[0].style.left = '55.5%';
        this.state.bodyValidateItem.checkAddExtract = true ;
        this.state.bodyValidateItem.checkMoney = true;
        this.setState({
          bodyValidateItem: this.state.bodyValidateItem,
        });
      }else if(val == 'MA'){
        document.getElementsByClassName('inputMoney')[0].style.display = 'none';
        document.getElementsByClassName('extractPlus')[0].style.display ='none'
        document.getElementsByClassName('maximum1')[0].style.width = '50%';
        document.getElementsByClassName('maximum2')[0].style.width = '52%';
        document.getElementsByClassName('maximum2')[0].style.left = '50%';
        document.getElementsByClassName('maximum3')[0].style.left = '68.5%';
        var addExtractAge =document.getElementsByClassName('addExtractAge');
        for(var i=0;i<addExtractAge.length;i++){
          addExtractAge[i].style.display = 'none';
        }
        this.state.keys2.map((k, index) => {
          k.type = 'delete';
        });
        this.state.bodyValidateItem.checkAddExtract = true ;
        this.state.bodyValidateItem.checkMoney = false;
        this.setState({
          bodyValidateItem: this.state.bodyValidateItem,
        });
        this.props.form.setFieldsValue({
          extractSum: '',
        });
      }
      if(this.state.bodyValidateItem.submitConfirm == true){
        this.setState({
          bodyValidateItem: this.state.bodyValidateItem,
        }
          , () => {
            this.props.form.validateFields([
              'extractYearHead',
              'extractYearEnd',
              'extractSum',
            ], { force: true });
          }
        );
      }
    }
    //新增移除
    remove(k, k2, initialValue) {
      if(initialValue==false){
        if(this.state.disabled==true) return;
      }
      const keys = this.state['keys' + k];
      for (var i=0; i<keys.length; i++) {
        if (keys[i].key == k2) {
          keys[i].type = 'delete';
          break;
        }
      }
      if (k == 0) {
        return;
      } else if (k == 1) {
        this.setState({
          keys1: keys
        },() => {
          this.props.form.setFieldsValue({
            additionalLineId:this.state.body.plnPlanRequestAdtlRiskList[0]?this.state.body.plnPlanRequestAdtlRiskList[0].lineId:''
          });
        });
      } else if (k == 2) {
        this.setState({
          keys2: keys
        },() => {
          this.props.form.setFieldsValue({
            extractLineId:this.state.body.plnPlanRequestExtractList[0]?this.state.body.plnPlanRequestExtractList[0].lineId:''
          });
        });
      }
    }
    add(index, initialValue) {
      if(initialValue == false){
        if(this.state.disabled == true) return;
      }
      const keys = this.state['keys' + index];
      if (index == 1) {
        this.state.uuid++;
        this.setState({
          keys1: keys.concat({key:this.state.uuid,type:'add'})
        });
      } else if (index == 2) {
        this.state.uuid2++;
        this.setState({
          keys2: keys.concat({key:this.state.uuid2,type:'add'})
        });
      }
    }
    //保险总额
    insuranceChange = (val) => {
      var total = this.props.form.getFieldValue(`totalAccountInput`);
      if(val == "IC"){
        this.setState({
          validateInsuredSum: '请输入保险总额',
        });
        //保险总额请输入为100倍数的数字
        var totalAccount = this.props.form.getFieldValue(`totalAccount`);
        if (this.state.companyName.indexOf('保诚') != -1) {
          if (total % 100 != 0) {
            this.props.form.setFields({
                totalAccountInput: {
                  value: total,
                  errors: [new Error('保险总额请输入为100倍数的数字')],
                },
              });
          }
        }
      } else {
        this.setState({
          validateInsuredSum: '请输入保费',
        });
        this.props.form.setFieldsValue({
          totalAccountInput: total
        });
      }
    }
    //出生年月不可选日期
    disabledStartDate(current) {
      if (!current) {
        return false;
      }
      var date = new Date();
      current = new Date(current);
      date = moment(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + (date.getDate()), "YYYY/MM/DD");
      current = moment(current.getFullYear() + "/" + (current.getMonth() + 1) + "/" + (current.getDate()), "YYYY/MM/DD")
      return date.valueOf() < current.valueOf();
    }
    //保险总额请输入为100倍数的数字
    accountChange(){
      var total = this.props.form.getFieldValue(`totalAccountInput`);
      var totalAccount = this.props.form.getFieldValue(`totalAccount`);
      if (this.state.companyName.indexOf('保诚') != -1 && totalAccount == 'IC') {
        if (total % 100 != 0) {
           this.props.form.setFields({
              totalAccountInput: {
                value: total,
                errors: [new Error('保险总额请输入为100倍数的数字')],
              },
            });
        }
      }
    }
    render() {
      const {getFieldDecorator, getFieldValue,getFieldsValue ,validateFields, resetFields} = this.props.form;
      /**
     * 重置功能
     */
      const handleReset = (index,value) => {
          resetFields();
          var selectInfo = document.getElementsByClassName('selectInfo');
          selectInfo[0].style.display = 'none';
          selectInfo[1].style.display = 'none';
          selectInfo[2].style.display = 'none';
          this.state.allProductionList = [];
          this.state.productionList = [],
          this.state.productionListMed = [],
          this.state.productYeatList = [],
          this.state.paymentList = [],
          this.state.defaultCurrencyList = [],
          this.state.selfpayList=[],
          this.state.SlevelList = [],
          this.state.addSlevelList = [],
          this.state.addselfpayList = [],
          this.state.SregionList =[],
          this.state.addSregionList = [],
          this.state.addProductionList =[]
      }
      const formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 10},
      };
      const tailFormItemLayout = {
        wrapperCol: {
          span: 18,
          offset: 6,
        },
      };
      //快码值渲染
      const nationOptions = this.state.codeList.nationalList.map((code) => {
        return <Select.Option key={code.value}>{code.meaning}</Select.Option>
      });
      const genderOptions = this.state.codeList.genderList.map((code) => {
        return <Radio key={code.value}>{code.meaning}</Radio>
      });
      const genderOptions1 = this.state.codeList.genderList.map((code) => {
        return <Select.Option key={code.value}>{code.meaning}</Select.Option>
      });
      const smokeFlagOptions = this.state.codeList.smokeFlagList.map((code) => {
        return <Select.Option key={code.value}>{code.meaning}</Select.Option>
      });
      const backtrackFlagOptions = this.state.codeList.backtrackFlagList.map((code) => {
        return <Select.Option key={code.value}>{code.meaning}</Select.Option>
      });
      const payMethodOptions = this.state.codeList.payMethodList.map((code) => {
        return <Select.Option key={code.value}>{code.meaning}</Select.Option>
      });
      const currencyOptions = this.state.codeList.currencyList.map((code) => {
        return <Select.Option key={code.value}>{code.meaning}</Select.Option>
      });
      const moneyOptions = this.state.codeList.moneyTypeList.map((code) => {
        return <Select.Option key={code.value}>{code.meaning}</Select.Option>
      });
      const extractTypeOptions = this.state.codeList.extractType.map((code) => {
        return <Select.Option key={code.value}>{code.meaning}</Select.Option>
      });
      const extractWayOptions = this.state.codeList.extractWay.map((code) => {
        return <Select.Option key={code.value}>{code.meaning}</Select.Option>
      });
      //获取产品公司
      const companyListOptions = this.state.companyList.map((res) => {
        return <Select.Option key={res.supplierId}>{res.name}</Select.Option>
      });
      //获取产品列表
      const productNameListOptions = this.state.productionList.map((res) => {
        return <Select.Option key={res.itemId} midClass>{res.itemName}</Select.Option>
      });
      //附加险获取产品列表
      const addProductNameListOptions = this.state.addProductionList.map((res) => {
        return <Select.Option key={res.itemId} midClass>{res.itemName}</Select.Option>
      });
      //高端医疗-产品列表
      const productionListMedOptions = this.state.productionListMed.map((res) => {
        return <Select.Option key={res.itemId} midClass>{res.itemName}</Select.Option>
      });
      //获取产品列表--年期
      const productYearOptions = this.state.productYeatList.map((res) => {
        return <Select.Option key={res.sublineId}>{res.sublineItemName}</Select.Option>
      });
      //获取产品列表--缴费方式
      const paymentOptions = this.state.paymentList.map((res) => {
        return <Select.Option key={res.wayId}>{res.wayName}</Select.Option>
      });

      let defaultCurrencyList =[];
      let j=0;
      for(let i in this.state.defaultCurrencyList){
        if(this.state.defaultCurrencyList[i].enabledFlag=="Y"){
          defaultCurrencyList[j] = this.state.defaultCurrencyList[i];
          j += 1;
        }
      }

      const defaultCurrencyOptions = defaultCurrencyList.map((res) => {
        var result = {};
        this.state.codeList.currencyList.map((res2)=>{
          if (res.currencyCode == res2.value) {
            result = res2.meaning
          }
        })
        return <Select.Option key={res.currencyCode}>{result}</Select.Option>
      })
      //自付选项-高端医疗产品
      const selfpayListOptions = this.state.selfpayList.map((res) => {
        return <Select.Option key={res.selfpayId}>{res.selfpay}</Select.Option>
      });
      //自付选项-添加高端医疗
      const addselfpayListOptions = this.state.addSelfpayList.map((res) => {
        return <Select.Option key={res.selfpayId}>{res.selfpay}</Select.Option>
      });
      //保障级别-高端医疗产品
      const securityLevelOptions = this.state.SlevelList.map((res) => {
        return <Select.Option key={res}>{res}</Select.Option>
      });
      //保障级别-添加高端医疗
      const addSecurityLevelOptions = this.state.addSlevelList.map((res) => {
        return <Select.Option key={res}>{res}</Select.Option>
      });
      //保障地区-高端医疗产品
      const securityAreaListOptions = this.state.SregionList.map((res) => {
        return <Select.Option key={res}>{res}</Select.Option>
      });
      //保障地区-添加高端医疗
      const addSecurityAreaListOptions = this.state.addSregionList.map((res) => {
        return <Select.Option key={res}>{res}</Select.Option>
      });

      return (
        <div className={style.main}>
          <div className={style.mainContent}>
            <Form className={'formClass'}>
              <div className={style.common}>
                <span className={styles.iconL}></span>
                <font className={styles.iconR}>受保人信息</font>
              </div>
              {/*受保人信息*/}
              <div>
                {
                  JSON.parse(localStorage.user).userType == "ADMINISTRATION" &&
                  <FormItem {...formItemLayout} className={style.formitem_sty} label="渠道">
                    {getFieldDecorator('channel', {
                      initialValue: {
                        value: JSON.parse(localStorage.user).relatedPartyId,
                        meaning: '',
                        record: {
                          channelId: JSON.parse(localStorage.user).relatedPartyId,
                          channelName: '',
                        }
                      },
                      rules: [{
                        required: true,
                        validator: (rule, value, callback) => {
                          if (value && (!value.value || !value.meaning)) {
                            callback('请选择渠道');
                          } else {
                            team({userId:JSON.parse(localStorage.user).userId}).then((data) =>{
                              if (data.success) {
                                data.rows.map((row, index) => {
                                  if (row.channelName == value.meaning) {
                                    this.setState({
                                      channelList: row.avilAmount
                                    });
                                    if (row.avilAmount <= 0) {
                                      this.props.form.setFieldsValue({
                                        channel: {
                                          value: JSON.parse(localStorage.user).relatedPartyId,
                                          meaning: '',
                                          record: {
                                            channelId: JSON.parse(localStorage.user).relatedPartyId,
                                            channelName: '',
                                          }
                                        }
                                      });
                                      planCount().then((data) => {
                                        TipModal.error({
                                          content: <div><font>计划书额度不够！</font>
                                            <br /><font>友情提示：保单签单时可扩增计划书额度，1张签单={data}份计划书</font></div>
                                        });
                                        return;
                                      })
                                      callback();
                                    }
                                  }
                                });
                              }
                            });
                            callback();
                          }
                        }
                      }],
                    })(
                      <Lov disabled={this.state.disabled} title="请选择渠道" lovCode='CNL_AGENCY_NAME' params={{ userId: JSON.parse(localStorage.user).userId }} />
                    )}
                  </FormItem>
                }
                <FormItem {...formItemLayout} label="受保人姓名" className={style.formitem_sty}>
                  {getFieldDecorator('name', {
                  })(
                    <Input placeholder="请输入受保人姓名"/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="国籍">
                  {getFieldDecorator('nationality', {
                    rules: [{ required: true, message: '请选择国籍', whitespace: true }],
                  })(
                    <Select showSearch placeholder="请选择国籍" disabled={this.state.disabled}
                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {nationOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="居住地" className='placeL' style={{marginLeft: '10%' }}>
                  {getFieldDecorator('home', {
                    rules: [{ required: this.state.bodyValidateItem.checkHome, message: '请输入居住地', whitespace: true }],
                  })(
                    <Select showSearch placeholder="请选择居住地" disabled={this.state.disabled}
                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {nationOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="居住城市" className='living' style={{ display: 'none', marginLeft: '10%' }}>
                  {getFieldDecorator('livingCity', {
                    rules: [{type:'array',required: this.state.bodyValidateItem.checkLiving, message: '请选择居住城市', whitespace: true }],
                  })(
                    <Cascader disabled={this.state.disabled} showSearch options={this.state.options} placeholder="请选择居住城市"
                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="性别">
                  {getFieldDecorator('gender', {
                    rules: [{ required: true, message: '请选择性别', whitespace: true }],
                  })(
                    <Select showSearch placeholder="请选择性别" disabled={this.state.disabled}>
                      {genderOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="是否吸烟">
                  {getFieldDecorator('smokes', {
                    rules: [{ required: true, message: '请选择是否吸烟', whitespace: true }],
                  })(
                    <Select showSearch placeholder="请选择是否吸烟" disabled={this.state.disabled}>
                      {smokeFlagOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="保单回溯">
                  {getFieldDecorator('backtrackFlag', {
                    rules: [{ required: true, message: '请选择是否回溯', whitespace: true}],
                    initialValue: 'N',
                  })(
                    <Select showSearch placeholder="请选择是否回溯" disabled={this.state.disabled}>
                      {backtrackFlagOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem className={style.formitem_sty}
                  {...formItemLayout} label={<span>出生日期</span>}>
                  {getFieldDecorator('birthday', {
                    rules: [{ type: 'object', required: true, message: '请选择或填写出生日期，例如1990-01-01' }],
                  })(
                    <DatePicker
                     style={{ width: '100%' }}
                     disabled={this.state.disabled}
                     disabledDate={this.disabledStartDate.bind(this)}
                    placeholder={`请选择或填写出生日期，例如1990-01-01`}
                     />
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout} className={style.formitem_sty}>
                  {getFieldDecorator('checks')(
                    <Checkbox onChange={this.handleCheckChange.bind(this, false)} className={style.checkStatus} checked={this.state.checkAll}>投保人与受保人不同</Checkbox>
                  )}
                </FormItem>
              </div>
              {/*投保人信息--勾选投保人与受保人不同*/}
              <div className='applicantInfo' style={{ display: 'none' }}>
                <div className={style.common} style={{ borderTop: '1px solid #d0d0d0', paddingTop: '20px' }}>
                  <span className={styles.iconL} ></span>
                  <font className={styles.iconR}>投保人信息</font>
                </div>
                <FormItem {...formItemLayout} label="投保人姓名" className={style.formitem_sty}>
                  {getFieldDecorator('applicant', {
                  })(
                    <Input placeholder="请输入投保人姓名..." />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="国籍">
                  {getFieldDecorator('applicantNationality', {
                    rules: [{ required: this.state.bodyValidateItem.checkDiff, message: '请选择国籍', whitespace: true }],
                  })(
                    <Select showSearch placeholder="请选择国籍" disabled={this.state.disabled}
                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {nationOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="居住地">
                  {getFieldDecorator('applicantHome', {
                    rules: [{ required: this.state.bodyValidateItem.checkDiff, message: '请输入居住地', whitespace: true }],
                  })(
                    <Select showSearch placeholder="请选择居住地" disabled={this.state.disabled}>
                      {nationOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="性别">
                  {getFieldDecorator('applicantGender', {
                    rules: [{ required: this.state.bodyValidateItem.checkDiff, message: '请选择性别', whitespace: true }],
                  })(
                    <Select showSearch placeholder="请选择性别" disabled={this.state.disabled}>
                      {genderOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="是否吸烟">
                  {getFieldDecorator('applicantSmokes', {
                    rules: [{ required: this.state.bodyValidateItem.checkDiff, message: '请选择是否吸烟', whitespace: true }],
                  })(
                    <Select showSearch placeholder="请选择否吸烟" disabled={this.state.disabled}>
                      {smokeFlagOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem className={style.formitem_sty}
                  {...formItemLayout} label={<span>出生日期</span>}>
                  {getFieldDecorator('applicantBirthday', {
                    rules: [{ type: 'object', required: this.state.bodyValidateItem.checkDiff, message: '请选择或填写出生日期，例如1990-01-01' }],
                  })(
                    <DatePicker
                    style={{ width: '100%' }}
                    disabled={this.state.disabled}
                    disabledDate={this.disabledStartDate.bind(this)}
                    placeholder={`请选择或填写出生日期，例如1990-01-01`}
                    />
                  )}
                </FormItem>
              </div>
              {/*产品信息-默认页面*/}
              <div className='productInformation'>
                <div className={style.common} style={{ borderTop: '1px solid #d0d0d0', paddingTop: '20px' }}>
                  <span className={styles.iconL} ></span>
                  <font className={styles.iconR}>产品信息</font>
                </div>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="产品公司">
                  {getFieldDecorator('company', {
                    rules: [{ required: true, message: '请选择产品公司', whitespace: true }],
                    onChange: this.handleCompany.bind(this)
                  })(
                    <Select showSearch placeholder="请选择产品公司" disabled={this.state.disabled}
                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {companyListOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="产品">
                  {getFieldDecorator('products', {
                    rules: [{ required: true, message: '请选择产品', whitespace: true }],
                    onChange: this.handleProductionChange.bind(this)
                  })(
                    <Select showSearch placeholder="请选择产品" disabled={this.state.disabled}
                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {productNameListOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="年期">
                  {getFieldDecorator('years', {
                    rules: [{ required: true, message: '请选择年期', whitespace: true }],
                  })(
                    <Select showSearch placeholder="请选择年期" disabled={this.state.disabled}>
                      {productYearOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="缴费方式">
                  {getFieldDecorator('payment', {
                    rules: [{ required: true, message: '请选择缴费方式', whitespace: true }],
                  })(
                    <Select showSearch placeholder="请选择缴费方式" disabled={this.state.disabled}>
                      {paymentOptions}
                    </Select>
                  )}
                </FormItem>
                <div className='insuredSum' style={{ position: 'relative', marginBottom: '30px' }}>
                    <div style={{ position: 'relative', left: 
                    this.state.proHl == false|| 
                    this.state.productName.indexOf('康挚选危疾保障计划') != -1 ||
                     this.state.productName.indexOf('「简选易」定期寿x') != -1 ?0:'250px' }}>
                      <FormItem {...formItemLayout} style={{marginLeft:'10%'}} className={style.formitem_sty} label={
                        this.state.proHl == false|| 
                        this.state.productName.indexOf('康挚选危疾保障计划') != -1 || 
                        this.state.productName.indexOf('「简选易」定期寿x') != -1 ?'保险总额':null}>
                        {getFieldDecorator('totalAccount', {
                          initialValue: 'IC',
                          rules: [{ required: this.state.bodyValidateItem.checkInsuredSum, message: '请选择保险类型', whitespace: true }],
                          onChange: this.insuranceChange,
                        })(
                          <Select showSearch placeholder="保险总额" className={
                            this.state.proHl == false || 
                            this.state.productName.indexOf('康挚选危疾保障计划') != -1 || 
                            this.state.productName.indexOf('「简选易」定期寿x') != -1 ?'':style.moneyType} 
                          style={{display:
                            this.state.proHl == false ||
                          this.state.productName.indexOf('康挚选危疾保障计划') != -1 || 
                          this.state.productName.indexOf('「简选易」定期寿x') != -1 ?'none':'block'}} disabled={this.state.disabled}>
                            {moneyOptions}
                          </Select>
                        )}
                        {
                          this.state.proHl == false || 
                          this.state.productName.indexOf('康挚选危疾保障计划') != -1 || 
                          this.state.productName.indexOf('「简选易」定期寿x') != -1 ?
                          ''
                          :
                          <span style={{ display: 'inline-block', position: 'absolute', left: '-4px', top: '2px', color: '#000' }}>:</span>
                        }
                        {
                          this.state.proHl == false || 
                          this.state.productName.indexOf('康挚选危疾保障计划') != -1 || 
                          this.state.productName.indexOf('「简选易」定期寿x') != -1 ?
                          ''
                          :
                          <span style={{ display: 'inline-block', position: 'absolute', left: '-22%', top: '10%', color: 'red', fontSize: 'small', fontWeight: 'bold' }}>*</span>
                        }
                      </FormItem>
                    </div>
                  <div style={{ width: '56.3%', marginRight: '0', position: 'absolute', left: '375px', top: '2px' }} >
                    <FormItem {...formItemLayout}>
                      {getFieldDecorator('totalAccountInput', {
                        rules: [{
                          type: 'number',
                          required: this.state.bodyValidateItem.checkInsuredSum,
                          message: this.state.validateInsuredSum,
                          whitespace: true,
                        }],
                      })
                        (
                        <InputNumber
                          onBlur={this.accountChange.bind(this)}
                          style={{width:"100%"}}
                          placeholder={this.state.validateInsuredSum}
                          min={0}
                          disabled={this.state.disabled}
                          formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value && value.toString().replace(/\$\s?|(,*)/g, '')}
                        />
                      )}
                    </FormItem>
                  </div>
                  <div style={{ width: '33.3%', position: 'absolute', left: '623px', top: '2px' }}>
                    <FormItem {...formItemLayout} style={{ marginLeft: '10%' }}>
                      {getFieldDecorator('defaultCurrency', {
                        rules: [{ required: this.state.bodyValidateItem.checkInsuredSum, message: '请选择缴费币种', whitespace: true }],
                      })(
                        <Select showSearch placeholder="请选择缴费币种" disabled={this.state.disabled}>
                          {defaultCurrencyOptions}
                        </Select>
                      )}
                    </FormItem>
                  </div>
                </div>
                {/*产品信息--默认*/}
                <div className='defaultProduct'>
                  <FormItem {...formItemLayout} className={style.formitem_sty} label="添加附加险">
                    {getFieldDecorator('insuranceAdd', {
                      onChange: this.handleSelectChange.bind(this, 0, false),
                      initialValue: 'N'
                    })(
                      <Select showSearch placeholder="是否添加附加险" disabled={this.state.disabled}>
                        <Option value="Y">是</Option>
                        <Option value="N">否</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} className={style.formitem_sty} label="添加提取金额">
                    {getFieldDecorator('draw', {
                      onChange: this.handleSelectChange.bind(this, 1, false),
                      initialValue: 'N'
                    })(
                      <Select showSearch placeholder="是否提取金额"
                        optionFilterProp="children"
                        disabled={this.state.disabled}
                      >
                        <Option value="Y">是</Option>
                        <Option value="N">否</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} className={style.formitem_sty} label="添加高端医疗">
                    {getFieldDecorator('topMedical', {
                      onChange: this.handleSelectChange.bind(this, 2, false),
                      initialValue: 'N'
                    })(
                      <Select showSearch placeholder="是否添加高端医疗"
                        optionFilterProp="children"
                        disabled={this.state.disabled}
                      >
                        <Option value="Y">是</Option>
                        <Option value="N">否</Option>
                      </Select>
                    )}
                  </FormItem>
                </div>
                {/*产品信息--高端医疗*/}
                <div className='medicalProduct' style={{ display: 'none' }}>
                  <FormItem {...formItemLayout} className={style.formitem_sty} label="缴费币种">
                    {getFieldDecorator('defaultMedicalCurrency', {
                      rules: [{ required: this.state.bodyValidateItem.checkMedicalProduct, message: '请选择缴费币种', whitespace: true }],
                    })(
                      <Select showSearch placeholder="请缴费币种" disabled={this.state.disabled}>
                        {defaultCurrencyOptions}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} className={style.formitem_sty} label="保障级别">
                    {getFieldDecorator('medicalRank', {
                      rules: [{ required: this.state.bodyValidateItem.checkMedicalProduct, message: '请选择保障级别', whitespace: true }],
                      onChange: this.handleSecurityRegionChange.bind(this)
                    })(
                      <Select showSearch placeholder="请选择保障级别" disabled={this.state.disabled}>
                        {securityLevelOptions}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} className={style.formitem_sty} label="保障地区">
                    {getFieldDecorator('medicalRegion', {
                      rules: [{ required: this.state.bodyValidateItem.checkMedicalProduct, message: '请选择保障地区', whitespace: true }],
                    })(
                      <Select showSearch placeholder="请选择保障地区" disabled={this.state.disabled}>
                        {securityAreaListOptions}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} className={style.formitem_sty} label="自付选项">
                    {getFieldDecorator('medicalSelfPay', {
                      rules: [{ required: this.state.bodyValidateItem.checkMedicalProduct, message: '请选择自付选项', whitespace: true }],
                    })(
                      <Select showSearch placeholder="请选择自付选项"
                        optionFilterProp="children"
                        disabled={this.state.disabled}
                      >
                        {selfpayListOptions}
                      </Select>
                    )}
                  </FormItem>
                </div>
                {/*产品--大额保单(隐藏产品信息--默认)*/}
              </div>
              {/*附加险信息*/}
              <div className='selectInfo' style={{ display: 'none' }}>

                <div className={style.common} style={{ borderTop: '1px solid #d0d0d0', paddingTop: '20px' }}>
                  <span className={styles.iconL} ></span>
                  <font className={styles.iconR}>附加险信息</font>
                </div>
                <div>
                  <FormItem {...formItemLayout} className={style.formitem_sty} label="附加险1">
                    {getFieldDecorator('additional', {
                      rules: [{ required: this.state.bodyValidateItem.checkAdditionalRisk, message: '请选择附加险', whitespace: true }],
                    })(
                      <Select showSearch placeholder="请选择附加险" disabled={this.state.disabled}>
                        {addProductNameListOptions}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label='附加险备注1' className={style.formitem_sty} style={{ marginBottom: '2%' }}>
                    {getFieldDecorator('additionalRemarks', {
                    })(
                      <Input type="textarea" rows={4} maxLength={100} placeholder="附加险备注信息..." />
                    )}
                    <Icon type="plus" className='iconPlus' name="iconPlus" onClick={this.add.bind(this, 1, false)} style={{ position: 'absolute', color: '#d1b97f', top: '30%', right: '-8%', cursor: 'pointer' }} />
                  </FormItem>
                  <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator(`additionalLineId`)(
                      <Input />
                    )}
                  </FormItem>
                  <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator(`additionalObjectVersionNumber`)(
                      <Input />
                    )}
                  </FormItem>
                  {
                    this.state.keys1.map((k, index) => {
                      if (k.type == 'add') {
                        return (
                          <div key={'additional_'+index}>
                            <FormItem {...formItemLayout} className={style.formitem_sty} label={`附加险${k.key + 1}`} >
                              {getFieldDecorator(`additional${k.key}`, {
                                rules: [{ required: true, message: '请选择附加险' }],
                              })(
                                <Select showSearch placeholder="请选择附加险" disabled={this.state.disabled} style={{color:'#595959'}}>
                                  {addProductNameListOptions}
                                </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={`附加险备注${k.key + 1}`} className={style.formitem_sty} style={{ marginBottom: '2%' ,color:'#595959'}}>
                              {getFieldDecorator(`additionalRemarks${k.key}`, {})(
                                <Input type="textarea" rows={4} maxLength={100} placeholder="附加险备注信息..." disabled={this.state.disabled} />
                              )}
                              <Icon type="minus-circle-o" className="iconPlus" name="iconPlus" onClick={this.remove.bind(this, 1, k.key, false)} style={{ position: 'absolute', color: '#d1b97f', top: '30%', right: '-8%', cursor: 'pointer' }} />
                            </FormItem>
                            <FormItem style={{ display: 'none' }}>
                              {getFieldDecorator(`additionalLineId${k.key}`, {})(
                                <Input />
                              )}
                            </FormItem>
                            <FormItem style={{ display: 'none' }}>
                              {getFieldDecorator(`additionalObjectVersionNumber${k.key}`, {})(
                                <Input />
                              )}
                            </FormItem>
                          </div>
                        );
                      } else {
                        return (
                          <div key={'additional_'+index}>
                            {getFieldDecorator(`additional${k.key}`, {})}
                            {getFieldDecorator(`additionalRemarks${k.key}`, {})}
                            {getFieldDecorator(`additionalLineId${k.key}`, {
                              initialValue: this.state.body.plnPlanRequestAdtlRiskList[k.key]?
                                            this.state.body.plnPlanRequestAdtlRiskList[k.key].lineId
                                            :
                                            '',
                            })}
                            {getFieldDecorator(`additionalObjectVersionNumber${k.key}`, {})}
                          </div>
                        );
                      }
                    })
                  }
                </div>
              </div>
              {/*添加提取*/}
              <div className='selectInfo' style={{ display: 'none' }}>
                <div className={style.common} style={{ borderTop: '1px solid #d0d0d0', paddingTop: '20px' }}>
                  <span className={styles.iconL} ></span>
                  <font className={styles.iconR}>添加提取</font>
                </div>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="提取类型">
                  {getFieldDecorator('extractType', {
                    rules: [{ required: this.state.bodyValidateItem.checkAddExtract, message: '请选择提取类型', whitespace: true }],
                  })(
                    <Select showSearch placeholder="请选择提取类型" disabled={this.state.disabled}>
                      {extractTypeOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="提取方式">
                  {getFieldDecorator('extractWay', {
                    rules: [{ required: this.state.bodyValidateItem.checkAddExtract, message: '请选择提取方式', whitespace: true }],
                    onChange: this.handleExtractWayChange.bind(this),
                  })(
                    <Select showSearch placeholder="请选择提取方式" disabled={this.state.disabled}>
                      {extractWayOptions}
                    </Select>
                  )}
                </FormItem>
                <div style={{position:'relative'}} className='extractAge' >
                  <div>
                    <FormItem {...formItemLayout} label="提取年份1" className={style.formitem_sty}>
                      {getFieldDecorator('alert', {
                      })(
                        <span style={{ display: 'inline-block', position: 'absolute', left: '-22%', marginTop: '1%', color: 'red', fontSize: 'small', fontWeight: 'bold' }}>*</span>
                      )}
                    </FormItem>
                  </div>
                  <div className='maximum1' style={{position:'absolute',width:'30%',top:'0',left:'33%'}}>
                    <FormItem {...formItemLayout}>
                      <span style={{ fontSize: '16px' }}>第</span>
                      {getFieldDecorator('extractYearHead', {
                        rules: [{ required: this.state.bodyValidateItem.checkAddExtract, message: '请输入年份', whitespace: true }],
                      })(
                        <NumberInput style={{ width: '70%', margin: '0 2%' }} />
                      )}
                    </FormItem>
                  </div>
                  <div className='maximum2' style={{position:'absolute',width:'30%',top:'0',left:'44%'}}>
                    <FormItem {...formItemLayout}>
                      <span style={{ fontSize: '16px' }}>年-</span>
                      {getFieldDecorator('extractYearEnd', {
                        rules: [{ required: this.state.bodyValidateItem.checkAddExtract, message: '请输入年份', whitespace: true }],
                      })(
                        <NumberInput style={{ width: '70%', margin: '0 2%' }} />
                      )}
                    </FormItem>
                  </div>
                  <span className='maximum3' style={{position:'absolute',width:'34%',top:'8px',left:'55.5%', fontSize: '16px' }}>年</span>
                  <div className='inputMoney' style={{position:'absolute',width:'34%',top:'0',left:'57%'}}>
                    <FormItem {...formItemLayout}>
                      {getFieldDecorator('extractSum', {
                        rules: [{ required: this.state.bodyValidateItem.checkMoney, message: '请输入金额', whitespace: true }],
                      })(
                        //<NumberInput style={{ width: '88%', marginLeft: '2%' }} placeholder="请输入金额" />
                        <Input style={{ width: '88%', marginLeft: '2%' }} placeholder="请输入金额" />
                      )}
                      <Icon type="plus" className='extractPlus' onClick={this.add.bind(this, 2, false)} style={{ display:'none',position: 'absolute', color: '#d1b97f', top: '30%', right: '-22%', cursor: 'pointer' }} />
                    </FormItem>
                  </div>
                  <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator(`extractLineId`,{})(
                      <Input />
                    )}
                  </FormItem>
                  <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator(`extractObjectVersionNumber`,{})(
                      <Input />
                    )}
                  </FormItem>
                </div>
                {
                  this.state.keys2.map((k, index) => {
                    if (k.type == 'add') {
                      return (
                        <div key={'extract_'+index} className="addExtractAge"  style={{position:'relative'}}>
                          <div>
                            <FormItem {...formItemLayout} label={`提取年份${k.key+1}`} className={style.formitem_sty}>
                              {getFieldDecorator(`alert`, {})(
                                <span style={{ display: 'inline-block', position: 'absolute', left: '-22%', marginTop: '1%', color: 'red', fontSize: 'small', fontWeight: 'bold' }}>*</span>
                              )}
                            </FormItem>
                          </div>
                          <div style={{ position: 'absolute', width: '30%', top: '0', left: '33%' }}>
                            <FormItem {...formItemLayout}>
                              <span style={{ fontSize: '16px' }}>第</span>
                              {getFieldDecorator(`extractYearHead${k.key}`, {
                                rules: [{ required: this.state.bodyValidateItem.checkAddExtract, message: '请输入年份', whitespace: true }],
                              })(
                                <NumberInput style={{ width: '70%', margin: '0 2%' }} min={0} disabled={this.state.disabled} />
                              )}
                            </FormItem>
                          </div>
                          <div style={{ position: 'absolute', width: '30%', top: '0', left: '44%' }}>
                            <FormItem {...formItemLayout}>
                              <span style={{ fontSize: '16px' }}>年-</span>
                              {getFieldDecorator(`extractYearEnd${k.key}`, {
                                rules: [{ required: this.state.bodyValidateItem.checkAddExtract, message: '请输入年份', whitespace: true }],
                              })(
                                <NumberInput style={{ width: '70%', margin: '0 2%' }} min={0} disabled={this.state.disabled} />
                              )}
                            </FormItem>
                          </div>
                          <div style={{ position: 'absolute', width: '34%', top: '0', left: '55.5%' }}>
                            <FormItem {...formItemLayout}>
                              <span style={{ fontSize: '16px' }}>年</span>
                              {getFieldDecorator(`extractSum${k.key}`, {
                                rules: [{ required: this.state.bodyValidateItem.checkAddExtract, message: '请输入金额', whitespace: true }],
                              })(
                                //<NumberInput style={{ width: '88%', marginLeft: '2%' }} placeholder="请输入金额" min={0} disabled={this.state.disabled} />
                                <Input style={{ width: '88%', marginLeft: '2%' }} placeholder="请输入金额" min={0} disabled={this.state.disabled} />
                              )}
                              <Icon type="minus-circle-o" className="iconPlus" name="iconPlus" onClick={this.remove.bind(this, 2, k.key, false)} style={{ position: 'absolute', color: '#d1b97f', top: '30%', right: '-33%', cursor: 'pointer' }} />
                            </FormItem>
                          </div>
                          <FormItem style={{display:'none'}}>
                            {getFieldDecorator(`extractLineId${k.key}`, {})(
                              <Input/>
                            )}
                          </FormItem>
                          <FormItem style={{display:'none'}}>
                            {getFieldDecorator(`extractObjectVersionNumber${k.key}`, {})(
                              <Input/>
                            )}
                          </FormItem>
                        </div>
                      );
                    } else {
                      return (
                        <div key={'extract_'+index}>
                          {getFieldDecorator(`alert${k.key}`, {})}
                          {getFieldDecorator(`extractYearHead${k.key}`, {})}
                          {getFieldDecorator(`extractYearEnd${k.key}`, {})}
                          {getFieldDecorator(`extractSum${k.key}`, {})}
                          {getFieldDecorator(`extractLineId${k.key}`, {
                            initialValue: this.state.body.plnPlanRequestExtractList[k.key]?
                                            this.state.body.plnPlanRequestExtractList[k.key].lineId
                                            :
                                            '',
                          })}
                          {getFieldDecorator(`extractObjectVersionNumber${k.key}`, {})}
                        </div>
                      );
                    }
                  })
                }
              </div>
              {/*添加高端医疗*/}
              <div className='selectInfo' style={{ display: 'none' }}>
                <div className={style.common} style={{ borderTop: '1px solid #d0d0d0', paddingTop: '20px' }}>
                  <span className={styles.iconL} ></span>
                  <font className={styles.iconR}>添加高端医疗</font>
                </div>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="产品名称">
                  {getFieldDecorator('addMedicalProductName', {
                    rules: [{ required: this.state.bodyValidateItem.checkHighMedical, message: '请选择产品名称', whitespace: true }],
                    onChange: this.handleMdeProductionChange.bind(this)
                  })(
                    <Select showSearch placeholder="请选择产品名称" disabled={this.state.disabled}>
                      {productionListMedOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="保障级别">
                  {getFieldDecorator('addMedicalRank', {
                    rules: [{ required: this.state.bodyValidateItem.checkHighMedical, message: '请选择保障级别', whitespace: true }],
                    onChange: this.handleAddSecurityRegionChange.bind(this)
                  })(
                    <Select showSearch placeholder="请选择保障级别" disabled={this.state.disabled}>
                      {addSecurityLevelOptions}
                    </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="保障地区">
                  {getFieldDecorator('safeguardArea', {
                    rules: [{ required: this.state.bodyValidateItem.checkHighMedical, message: '请选择保障地区', whitespace: true }],
                  })(
                    <Select showSearch placeholder="请选择保障地区" disabled={this.state.disabled}>
                      {addSecurityAreaListOptions}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="自付选项">
                  {getFieldDecorator('addMedicalHighSelfPay', {
                    rules: [{ required: this.state.bodyValidateItem.checkHighMedical, message: '请选择自付选项', whitespace: true }],
                  })(
                    <Select showSearch placeholder="请选择自付选项" disabled={this.state.disabled}>
                      {addselfpayListOptions}
                    </Select>
                  )}
                </FormItem>
              </div>
              {/* 其他备注栏 */}
              <div className='others' style={{ display: 'none' }}>
                  <FormItem {...formItemLayout} label='其他备注' className={style.formitem_sty}>
                    {getFieldDecorator('remarks', {
                    })(
                      <Input type="textarea" rows={4} placeholder="其他备注..." />
                    )}
                  </FormItem>
              </div>
              {/*尾部*/}
              <div>
                <FormItem  {...tailFormItemLayout} className={style.formitem_sty}>
                  <span className='handleReset' style={{marginRight:'10px'}}>
                    <Button className={style.bottomBtn} size="large" type="default" onClick={handleReset}>重置</Button>
                  </span>
                  <span className='handleCancel' style={{marginRight:'10px'}}>
                    <Button className={style.bottomBtn} onClick={this.handleCancel.bind(this)} size="large" type="danger" style={{ background: 'red', color: '#fff' }}>取消申请</Button>
                  </span>
                  <span className='handleSubmit' style={{marginRight:'10px'}}>
                    {/*htmlType="submit"*/}
                    <Button className={style.bottomBtn} type="primary" onClick={this.handleSubmit.bind(this)} size="large">提交</Button>
                  </span>
                  <span className='handleReturn' style={{marginRight:'10px'}}>
                    {/*htmlType="submit"*/}
                    <Button className={style.bottomBtn} onClick={this.handleCancel.bind(this)} type="danger" htmlType="submit" size="large" style={{ background: 'red', color: '#fff' }}>取消申请</Button>
                  </span>
                </FormItem>
              </div>
            </Form>
            <Row>
              <Col xs={22} sm={22} md={22} lg={22} xl={22} offset={1} style={{ marginBottom: '30px' ,color:'#000',fontSize:'16px'}}>
                温馨提示：
                <Row style={{color:'#9c9c9c'}}>宏利公司的计划书，申请所填写的出生日期与计划书上的日期存在不一样的情况，请以年龄为准即可。</Row>
              </Col>
            </Row>
          </div>
        </div>
      );
    }
  }
export default Form.create()(planApply);
