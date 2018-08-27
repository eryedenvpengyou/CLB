import React from 'react';
import { Form,Button, Select,InputNumber,DatePicker} from 'antd';
import moment from 'moment';
import {indexOf} from 'lodash';
import Uploads from '../../../components/common/Upload';
import {formatFile} from '../../../utils/common';
import * as styles from '../../../styles/appointment.css';
import * as service from '../../../services/order';
import * as codeService from '../../../services/code';
import * as  common from '../../../utils/common';
import Modals from "../../common/modal/Modal";
import Lov from '../../common/Lov';


const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 11,
    },
  },
};


class InsureProduct extends React.Component {
  state = {
    insureance: {},
    disabled: false,
    medicalFlag:false,
    companyList:[],                         //所有保险公司
    productList:[],                         //所有产品

    prdItemSublineList:[],                  //供款年期（子产品）
    prdItemPaymode:[],                      //保单币种
    payMethodList:[],                       //供款方式
    prdItemSecurityPlan:[],                 //保障级别、保障地区
    prdItemSelfpayList:[],                  //自付选项

    disableButton: false,
  };

  componentWillMount() {
    //查询所有保险公司
    service.fetchCompany({businessScope: '保险'}).then((data)=>{
      if(data.success){
        this.setState({companyList: data.rows,});
      }
    });

    const insureance = this.props.insureance || {};
    this.setState({
      insureance: insureance,
      productList: insureance.productList,
    },()=>{
      this.formatValue(insureance.itemId);
    });


    //如果是修改的情况下
    if(this.props.orderId && this.props.orderId != '000'){
      const productList = [{itemId: insureance.itemId || '', itemName:insureance.itemName || ''}];
      const prdItemSublineList = [{sublineId: insureance.sublineId || '', sublineItemName:insureance.sublineItemName || ''}];
      codeService.getCode({
        payMethodList: 'CMN.PAY_METHOD',
        prdItemPaymode: 'PUB.CURRENCY',
      }).then((data)=>{
        const payMethod = insureance.payMethod || '', currency = insureance.currency || '';
        let payMethodList = data.payMethodList || [], prdItemPaymode = data.prdItemPaymode || [];

        payMethodList = payMethodList.filter((item)=> item.value == payMethod);
        if(payMethodList[0]){
          payMethodList[0].wayId = payMethodList[0].value || '';
          payMethodList[0].way = payMethodList[0].meaning || '';
        }


        prdItemPaymode = prdItemPaymode.filter((item)=> item.value == currency);
        if(prdItemPaymode[0]){
          prdItemPaymode[0].currencyCode = prdItemPaymode[0].value || '';
          prdItemPaymode[0].currencyName = prdItemPaymode[0].meaning || '';
        }

        this.setState({productList, prdItemSublineList, payMethodList, prdItemPaymode});
      });
    }
  }


  //当选择保险公司的时候，查出该保险公司下的所有产品
  companySelect(value){
    const params = {supplierId: value, bigClass: 'BX', unAdditionalRiskFlag: 'Y', pageSize: 999999,enabledFlag: 'Y'};
    service.fetchProduct(params).then((data)=>{
      if(data.success){
        this.setState({productList: data.rows});
      }
    });

    //保险公司改变 就清掉产品输入框的内容
    if(value){
      this.props.form.setFieldsValue({itemId:'',sublineId:'', payMethod:'', currency:'',}) ;
    }
  }

  //产品发生改变，把其它的数据清空，并重新生成数据
  onProductSelect(value){
    if(!value) return;
    this.props.form.resetFields(['sublineId', 'payMethod', 'currency', 'reserveDate']);
    this.formatValue(value);
  }

  //格式化下拉列表的值
  formatValue(value){
    let productList = this.state.productList || [], product = {};
    for(let i in productList){
      if(productList[i].itemId == value)
        product =  productList[i];
    }

    //生成下拉列表
        let prdItemSublineList = product.prdItemSublineList || [],              //供款年期
            prdItemPaymode = [],                                                //保单币种
            payMethodList = [],                                                 //年缴保费方式
            prdItemSecurityPlan = product.prdItemSecurityPlan || [],                  //保障级别、保障地区
            prdItemSelfpayList = product.prdItemSelfpayList || [];              //自付选项

    //保单币种
      let j=0;
      for(let i in product.prdItemPaymode){
        if(product.prdItemPaymode[i].enabledFlag=="Y"){
          prdItemPaymode[j] = product.prdItemPaymode[i];
          j += 1;
        }
      }

    //生成 保单币种 下拉列表
    for(let i in prdItemPaymode){
      if(prdItemPaymode[i].enabledFlag=="Y"){
        switch(prdItemPaymode[i].currencyCode){
          case 'USD': prdItemPaymode[i].currencyName = '美元'; break;
          case 'HKD': prdItemPaymode[i].currencyName = '港币'; break;
          case 'CNY': prdItemPaymode[i].currencyName = '人民币'; break;
          case 'AUD': prdItemPaymode[i].currencyName = '澳币'; break;
          case 'EURO': prdItemPaymode[i].currencyName = '欧元'; break;
          case 'MOP': prdItemPaymode[i].currencyName ='澳门元'; break;
          case 'SGD': prdItemPaymode[i].currencyName ='新加坡元'; break;
          case 'GBP': prdItemPaymode[i].currencyName ='英镑'; break;
          case 'JPY': prdItemPaymode[i].currencyName ='日元'; break;
          case 'TWD': prdItemPaymode[i].currencyName ='新台币'; break;
          case 'KRW': prdItemPaymode[i].currencyName ='韩元'; break;
          case 'THB': prdItemPaymode[i].currencyName ='泰铢'; break;
          case 'PHP': prdItemPaymode[i].currencyName ='菲律宾比索'; break;
          case 'CAD': prdItemPaymode[i].currencyName ='加元'; break;
          case 'SEK': prdItemPaymode[i].currencyName ='瑞典克朗'; break;
          case 'CHF': prdItemPaymode[i].currencyName ='瑞士法郎'; break;
          case 'RUB': prdItemPaymode[i].currencyName ='卢布'; break;
          case 'NZD': prdItemPaymode[i].currencyName ='纽西兰元'; break;
        }
      }else if(prdItemPaymode[i].enabledFlag=="N"){
        // delete prdItemPaymode[i];
      }
    }

    //生成 缴费方式 下拉列表
    if(product){
      if (product.fullyear == 'Y')
        payMethodList.push({ wayId:'WP', way: '整付' });
      if (product.oneyear == 'Y')
        payMethodList.push({ wayId: 'AP', way: '年缴' });
      if (product.halfyear == 'Y')
        payMethodList.push({ wayId: 'SAP', way: '半年缴' });
      if (product.quarter == 'Y')
        payMethodList.push({ wayId: 'QP', way: '季缴' });
      if (product.onemonth == 'Y')
        payMethodList.push({ wayId: 'MP', way: '月缴' });
      if (product.prepayFlag == 'Y')
        payMethodList.push({ wayId: 'FJ', way: '预缴' });

      // common.sortCustom(payMethodList, 'PAYMETHOD');
    }

    //判断高端医疗是否展示
    let medicalFlag = false;
    if(product && product.minClassName == "高端医疗"){
      medicalFlag = true;
      //高端医疗字符选项排个序
      prdItemSelfpayList = common.sortCustom(prdItemSelfpayList, 'SELFPAY');
    }

    // 供款年期排个序
    // prdItemSublineList = common.sortCustom(prdItemSublineList, 'SUBLINE');

    this.setState({product, prdItemSublineList, prdItemPaymode, payMethodList, prdItemSecurityPlan, prdItemSelfpayList, medicalFlag});
  }



  //校验交易路线
  checkRoutes(code, value){
    //如果前4个有值 就校验
    let v = this.props.form.getFieldsValue();
    v[code] = value;
    if(v.itemId && v.sublineId && v.currency && v.payMethod){
      let contributionPeriod, prdItemSublineList = this.state.prdItemSublineList || [];
      for(let i in prdItemSublineList){
        if(v.sublineId == prdItemSublineList[i].sublineId ){
          contributionPeriod = prdItemSublineList[i].sublineItemName;
        }
      }
      const effectiveDate = v.reserveDate? moment(v.reserveDate).format('YYYY-MM-DD') : '';
      const params ={
        channelId: v.channelId.value,
        itemId: this.state.product.itemId || this.state.insureance.itemId,
        currency: v.currency || '',
        payMethod: v.payMethod || '',
        contributionPeriod: contributionPeriod,
        effectiveDate: effectiveDate,
        additionRiskList: [],
        birthDate: null,
      }
      service.fetchCommission(params).then((data)=>{
        if(!data.success || data.rows.length <= 0){
          Modals.error({content:'您选择的产品无转介费率，暂时无法预约，请联系您的上级！'});
          this.setState({disableButton: true});
        }else{
          this.setState({disableButton: false});

          let doFlag = true;
          if(this.props.orderId && this.props.orderId != '000'){
            const dealPath = this.state.insureance? this.state.insureance.dealPath : '';
            if(dealPath){
              let temp = data.rows.filter((item)=> item.dealPath == dealPath);
              if(!temp || temp.length <= 0){
                doFlag = false;
              }
            }
          }

          if(!doFlag){
            Modals.error({content:'您选择的产品与主险交易路线不一致，暂时无法预约，请联系您的上级！'});
            this.setState({disableButton: true});
          }
        }
      });
    }
  }


  //不可选日期
  disabledStartDate(current) {
    if(!current){
      return false;
    }
    var date = new Date();
    current = new Date(current);
    date = moment(date.getFullYear()+"/"+(date.getMonth()+1)+"/"+(date.getDate()),"YYYY/MM/DD");
    current = moment(current.getFullYear()+"/"+(current.getMonth()+1)+"/"+(current.getDate()),"YYYY/MM/DD")
    return date.valueOf() > current.valueOf();
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




  //下一步
  clickNext(){
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let insureance = this.state.insureance || {};
        values.medicalFlag = this.state.medicalFlag;
        values.planFile = values.planFileId;
        values.planFileId = formatFile(values.planFileId || [], true);
        values.productList = this.state.productList;                      //产品
        values.prdItemPaymode = this.state.prdItemPaymode;                //保单币种
        values.payMethodList = this.state.payMethodList;                  //供款方式
        values.reserveDate = moment(values.reserveDate).format('YYYY-MM-DD HH:mm:ss');   //预约时间
        for(let i in this.state.prdItemSublineList){
          if(values.sublineId == this.state.prdItemSublineList[i].sublineId ){
            insureance.contributionPeriod = this.state.prdItemSublineList[i].sublineItemName;
            break;
          }
        }
        for(let i in values){
          if(i != 'channelId')
            insureance[i] = values[i];
        }
        insureance.channelId = insureance.channelId || values.channelId.value;

        // localStorage.insureance = JSON.stringify(insureance);
        // this.props.callback(values);
        this.props.goNext('ADDITONAL', insureance);
      }else{
        Modals.error({content:'请先填写完必填信息'});
        return;
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const insureance = this.state.insureance || {};

    //保单详情 当保单时间过了48小时，并且状态为初审通过的时候，保单可以进行更改
    const total = new Date((insureance.reserveDate||'').replace(/-/g,'/')).getTime() - new Date().getTime();
    const hours = total/(3600*1000);
    var reserveDate2 = new Date((insureance.reserveDate||'').replace(/-/g,'/')).getTime()+100000000;
    if(hours>=48&&insureance.status=="PRE_APPROVED"){
      insureance.editFlag=true;
    }

    const editFlag = insureance.editFlag || false;
    const upClass = editFlag ? styles['has-remove'] : styles['no-remove'];
    const orderId = this.props.orderId;
    let disabledFlag = true, disabledFlagDate = true;
    if(!orderId || orderId == '000'){
      disabledFlag = false;
      disabledFlagDate = false;
    }
    if(orderId && orderId != '000' && insureance.status == 'UNSUBMITTED' ){
      disabledFlag = false;
      disabledFlagDate = false;
    }

    //信息修改时的 初始化文件
    if(!insureance.planFile && orderId != '000' && insureance.planFileId && insureance.planFileId !== 0){
      insureance.planFile = common.initFile([{fileId: insureance.planFileId}]);
    }

    // console.log(this.state.prdItemSublineList)

    return (
      <div className={styles.table_border}>
        <Form className='disableds'>

          {/*选择产品*/}
          <div className={styles.item_div}>
            <div className={styles.title_sty}>
              <span className={styles.iconL} ></span>
              <font className={styles.title_font2}>预约签单</font>
            </div>
            <div className={styles.model_title}>选择产品</div>

            <div style={{display: JSON.parse(localStorage.user).userType == "ADMINISTRATION"? 'block' : 'none'}}>
              <Form.Item label="渠道" {...formItemLayout}>
                {getFieldDecorator('channelId', {
                  rules: [{
                    required: true,
                    validator: (rule,value,callback) => {
                      if (!value.value) {
                        callback('请选择渠道');
                      } else {
                        callback();
                      }
                    }
                  }],
                  initialValue: {value: insureance.channelId || JSON.parse(localStorage.user).relatedPartyId, meaning: insureance.channelName || ''},
                })(
                  <Lov title="选择渠道" disabled={disabledFlag} lovCode='CNL_AGENCY_NAME' params ={{userId:JSON.parse(localStorage.user).userId}} />
                )}
              </Form.Item>
            </div>

            <FormItem {...formItemLayout} label="保险公司">
              {getFieldDecorator('productSupplierId', {
                rules: [{required:true,message:'保险公司必选'}],
                initialValue:insureance.productSupplierId || '',
              })(
                <Select
                  disabled={disabledFlag}
                  showSearch
                  optionFilterProp="children"
                  style={{height:'40px!important'}}
                  onChange={this.companySelect.bind(this)} >
                  {
                    this.state.companyList &&
                    this.state.companyList.map((item)=>
                      <Option value={item.supplierId} key={item.name}>{item.name}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>


            <FormItem label="产品" {...formItemLayout} className={styles.formitem_sty} >
              {getFieldDecorator('itemId', {
                rules: [{required:true,message:'产品必选'}],
                initialValue:insureance.itemId || '',
              })(
                <Select
                  onSelect={this.onProductSelect.bind(this)}
                  disabled={disabledFlag}
                  showSearch
                  optionFilterProp="children" >
                  {
                    this.state.productList &&
                    this.state.productList.map((item)=>
                      <Option value={item.itemId} key={item.itemName}>{item.itemName}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} className={styles.formitem_sty} label="供款年期">
              {getFieldDecorator('sublineId', {
                rules: [{required:true,message:'供款年期必选'}],
                initialValue:insureance.sublineId || '',
              })(
                <Select
                  disabled={disabledFlag}
                  onSelect={this.checkRoutes.bind(this,'sublineId')}
                  showSearch
                  optionFilterProp="children">
                  {
                    this.state.prdItemSublineList &&
                    this.state.prdItemSublineList.map((item)=>
                      <Option value={item.sublineId} key={item.sublineItemName} >{item.sublineItemName}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} className={styles.formitem_sty} label="保单币种">
              {getFieldDecorator('currency', {
                rules: [{ required: true, message: '请选择保单币种', whitespace: true }],
                initialValue:insureance.currency || '',
              })(
                <Select
                  disabled={disabledFlag}
                  onSelect={this.checkRoutes.bind(this,'currency')}
                  showSearch
                  optionFilterProp="children">
                  {
                    this.state.prdItemPaymode &&
                    this.state.prdItemPaymode.map((item)=>
                      <Option value={item.currencyCode} key={item.currencyCode}>{item.currencyName}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} className={styles.formitem_sty} label="供款方式">
              {getFieldDecorator('payMethod', {
                rules: [{ required: true, message: '请选择供款方式', whitespace: true }],
                initialValue:insureance.payMethod || '',
              })(
                <Select
                  disabled={disabledFlag}
                  onSelect={this.checkRoutes.bind(this,'payMethod')}
                  showSearch
                  optionFilterProp="children">
                  {
                    this.state.payMethodList &&
                    this.state.payMethodList.map((item)=>
                      <Option value={item.wayId} key={item.way}>{item.way}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="主险首期保费"  className={styles.formitem_sty}>
              {getFieldDecorator('yearPayAmount', {
                rules: [{ type:'number',required: true, message: '主险首期保费(精确到两位小数)', whitespace: true }],
                initialValue:insureance.yearPayAmount=== 0?0:insureance.yearPayAmount || '',
              })(
                <InputNumber
                  disabled={!editFlag}
                  min={0}
                  step={0.01}
                  precision={2}
                  className={styles.number_input}
                  formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  style={{width:'100%'}}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="保监征费"  className={styles.formitem_sty}>
              {getFieldDecorator('iaLevies', {
                rules: [{ type:'number', message: '保监征费(精确到两位小数)', whitespace: true }],
                initialValue:insureance.iaLevies === 0?0:insureance.iaLevies || undefined,
              })(
                <InputNumber
                  disabled={!editFlag}
                  min={0}
                  step={0.01}
                  precision={2}
                  formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  className={styles.number_input}
                  style={{width:'100%'}}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="保额"  className={styles.formitem_sty}>
              {getFieldDecorator('policyAmount', {
                rules: [{ type:'number', message: '保额(精确到两位小数)', whitespace: true }],
                initialValue:insureance.policyAmount === 0?0:insureance.policyAmount || undefined,
              })(
                <InputNumber
                  disabled={!editFlag}
                  min={0}
                  step={0.01}
                  precision={2}
                  formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  className={styles.number_input}
                  style={{width:'100%'}}
                />
              )}
            </FormItem>

            {
              this.state.medicalFlag &&
              <div>
                <FormItem {...formItemLayout} className={styles.formitem_sty} label="保障级别">
                  {getFieldDecorator('securityLevel', {
                    rules: [{required: true, message: '请选择保障级别', whitespace: true}],
                    initialValue:insureance.securityLevel || '',
                  })(
                    <Select
                      disabled={!editFlag}
                      showSearch
                      optionFilterProp="children">
                      {
                        this.state.prdItemSecurityPlan &&
                        this.state.prdItemSecurityPlan.map((item)=>
                          <Option key={item.securityLevel} value={item.securityLevel}>{item.securityLevel}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={styles.formitem_sty} label="保障地区">
                  {getFieldDecorator('securityRegion', {
                    rules: [{required: true, message: '请选择保障地区', whitespace: true}],
                    initialValue:insureance.securityRegion || '',
                  })(
                    <Select
                      disabled={!editFlag}
                      showSearch
                      optionFilterProp="children">
                      {
                        this.state.prdItemSecurityPlan &&
                        this.state.prdItemSecurityPlan.map((item)=>
                          <Option key={item.securityRegion} value={item.securityRegion}>{item.securityRegion}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={styles.formitem_sty} label="自付选项">
                  {getFieldDecorator('selfpay', {
                    rules: [{required: true, message: '请选择自付选项', whitespace: true}],
                    initialValue:insureance.selfpay || '',
                  })(
                    <Select
                      disabled={!editFlag}
                      showSearch
                      optionFilterProp="children">
                      {
                        this.state.prdItemSelfpayList &&
                        this.state.prdItemSelfpayList.map((item)=>
                          <Option key={item.selfpayId} value={item.selfpay}>{item.selfpay}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </div>
            }

            <Form.Item label="预约时间" {...formItemLayout}>
              {getFieldDecorator('reserveDate', {
                rules: [
                  {required: true,message: '请选择预约时间',whitespace: true, type:'object'}
                ],
                initialValue:insureance.reserveDate? moment(insureance.reserveDate, 'YYYY/MM/DD HH:mm') : null,
              })(
                <DatePicker
                  disabled={disabledFlagDate}
                  onChange={this.checkRoutes.bind(this,'reserveDate')}
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: moment('09:00', 'HH:mm'),
                    format: 'HH:mm'
                  }}
                  disabledTime={this.disabledDateTime.bind(this)}
                  format="YYYY-MM-DD HH:mm"
                  disabledDate={this.disabledStartDate.bind(this)}
                  style={{width:"100%"}}
                  placeholder='请选择预约时间'/>
              )}
            </Form.Item>

            <FormItem {...formItemLayout} label="上传计划书" className={styles.formitem_sty}>
              {getFieldDecorator('planFileId', {
                rules: [
                  {required: editFlag, message: '请上传计划书附件', type:'array'},
                  {validator: common.vdFile.bind(this),},
                ],
                initialValue:insureance.planFile,
              })(
                <Uploads disabled={!editFlag} fileNum={1} className={upClass}/>
              )}
            </FormItem>

            <FormItem {...tailFormItemLayout} >
              <Button
                disabled={this.state.disableButton}
                type='primary'
                style={{ width:'160px',height:'40px'}}
                size='large'
                onClick={this.clickNext.bind(this)}>下一步</Button>
            </FormItem>
          </div>
        </Form>
      </div>
    );
  }
}


export default Form.create()(InsureProduct);
