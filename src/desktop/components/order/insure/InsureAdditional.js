import React from 'react';
import { Form,Button, Select,InputNumber,Col,Row,Icon,Input,Tooltip} from 'antd';
import * as styles from '../../../styles/appointment.css';
import * as service from '../../../services/order';
import Modals from '../../common/modal/Modal';


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
      span: 10,
      offset: 7,
    },
  },
};

let uuidFJ = 3333, uuidGD = 9999;

class InsureAdditional extends React.Component {
  state = {
    insureance: {},                           //传过来的数据
    ordAddition: [],                          //本页面的附加险数据
    ordAdditionGD: [],                        //本页面的高端医疗附加险数据
    productList:[],                           //附加险产品
    prdItemPaymode:[],                        //保单币种（上个界面带过来）
    payMethodList:[],                         //供款方式（上个界面带过来）

    medicalProList:[],                        //高端医疗产品
    sublineListM:[],                          //高端医疗子产品
    prdItemSecurityPlan:[],                   //高端保障级别、保障地区
    prdItemSelfpayList:[],                    //高端自付选项

    disableButton: false,                     //校验失败，按钮不可点击
    formItemGDFlag: true,                     //是否显示高端医疗按钮
  };

  componentWillMount() {
    const insureance = this.props.insureance || {};
    const prdItemPaymode = insureance.prdItemPaymode || [], payMethodList = insureance.payMethodList || [];
    this.setState({insureance, prdItemPaymode, payMethodList});
    const orderId = this.props.orderId;

    //查询附加险
    service.getOrdAddition({orderId: orderId}).then((data)=>{
      if(data.success){
        let ordAddition = data.rows || [], ordAdditionGD = [], formItemGDFlag = true;
        ordAddition.map((item, index) => {item.__status = 'update'; item.disabled = true; } );
        ordAdditionGD = ordAddition.filter((item)=> item.minClass == 'GD');
        if(ordAdditionGD && ordAdditionGD.length > 0){
          formItemGDFlag = false;
          service.fetchProduct({itemId: ordAdditionGD[0].itemId }).then((data)=>{
            if(data.success){
                const product = data.rows[0] || {};
                const sublineListM = product.prdItemSublineList || [],
                      prdItemSecurityPlan = product.prdItemSecurityPlan || [],
                      prdItemSelfpayList = product.prdItemSelfpayList || [];
              this.setState({sublineListM, prdItemSecurityPlan, prdItemSelfpayList});
            }
          });
        }
        ordAddition = ordAddition.filter((item)=> item.minClass != 'GD');
        this.setState({ordAddition, ordAdditionGD, formItemGDFlag});

        //还原数据
        if(orderId && orderId != '000'){
          let tempState = {};
          for(let i in ordAddition){
            tempState['prdItemSublineList'+i] = [ ordAddition[i] ];
          }
          this.setState(tempState);
        }
      }
    });

    //先根据产品公司，附加险产品
    let params = {supplierId: insureance.productSupplierId, attribute1: "Y",pageSize: 999999,enabledFlag: 'Y'};
    service.fetchProduct(params).then((data)=>{
      if(data.success){
        this.setState({productList:data.rows,});
      }
    });

    //已选保险公司下 高端医疗产品
    params = {supplierId: insureance.productSupplierId,minClassName: "高端医疗", attribute1: "Y",pageSize: 999999,enabledFlag: 'Y'};
    service.fetchProduct(params).then((data)=>{
      if(data.success){
        this.setState({medicalProList:data.rows})
      }
    });
  }


  //在产品选择的时候触发、校验交易路线
  onProductSelect(code, index , fieldName, value){
    let ordAddition = this.state.ordAddition || [],
        ordAdditionGD = this.state.ordAdditionGD || [],
        additionRiskList = [];

    if(code == 'GD'){
      ordAdditionGD[index][fieldName] = value.target ? value.target.value : value;
      if(fieldName === 'itemId'){
        ordAdditionGD[index].sublineId = null;
        this.props.form.resetFields([`sublineId`]);
      }
      if(fieldName === 'sublineId'){
        let list = this.state.sublineListM || [];
        for(let k in list){
          if(list[k].sublineId == value){
            ordAdditionGD[index].sublineItemName = list[k].sublineItemName;
            break;
          }
        }
      }
      this.setState({ordAdditionGD});

      // this.onFieldChangeGD(index, fieldName, value);

    }else if(code == 'FJ'){
      ordAddition[index][fieldName] = value.target ? value.target.value : value;
      if(fieldName === 'itemId'){
        ordAddition[index].sublineId = null;
        this.props.form.resetFields([`sublineId-${index}`]);
      }
      if(fieldName === 'sublineId'){
        let list = this.state['prdItemSublineList'+index] || [];
        for(let k in list){
          if(list[k].sublineId == value){
            ordAddition[index].sublineItemName = list[k].sublineItemName;
            break;
          }
        }
      }
      this.setState({ordAddition});
      // this.onFieldChange(index, fieldName, value);
    }

    //如果符合校验条件，则调用接口校验
    let validateFlag = false;
    if(fieldName === 'itemId' || fieldName === 'sublineId'){
      if(code === 'GD' && ordAdditionGD[index].itemId && ordAdditionGD[index].sublineId){
        validateFlag = true;
      }else if(code === 'FJ' && ordAddition[index].itemId && ordAddition[index].sublineId){
        validateFlag = true;
      }
    }

    //执行校验操作
    if(validateFlag){
      for(let i in ordAdditionGD){
        let list = this.state.sublineListM || [];
        for(let k in list){
          if(list[k].sublineId == ordAdditionGD[i].sublineId ){
            additionRiskList.push({itemId: ordAdditionGD[i].itemId, sublineItemName: list[k].sublineItemName });
            break;
          }
        }
      }

      for(let i in ordAddition){
        let list = this.state['prdItemSublineList'+i] || [];

        for(let k in list){
          if(list[k].sublineId == ordAddition[i].sublineId ){
            additionRiskList.push({itemId: ordAddition[i].itemId, sublineItemName: list[k].sublineItemName });
            break;
          }
        }
      }

      const v = this.state.insureance || {};
      const params ={
        channelId: v.channelId || JSON.parse(localStorage.user).relatedPartyId,
        itemId: v.itemId,
        currency: v.currency || '',
        payMethod: v.payMethod || '',
        contributionPeriod: v.contributionPeriod || '',
        effectiveDate: v.reserveDate || '',
        additionRiskList: additionRiskList,
        birthDate: null,
        orderId:this.props.orderId,
        orderDealPathFlag:"client"
      };
      service.fetchCommission(params).then((data)=>{
        if(!data.success || data.rows.length <= 0){
          this.setState({disableButton: true});
          Modals.error({content:'您选择的产品无转介费率，暂时无法预约，请联系您的上级！'});
          // if(code == 'FJ'){
          //   this.setState({['prdItemSublineList'+index] : []});
          // }else if(code == 'GD'){
          //   this.setState({sublineListM : [], prdItemSecurityPlan : [], prdItemSelfpayList : []});
          // }


        }else if(data.success && data.rows.length > 0){
          this.setState({disableButton: true});
          let doFlag = false;
          if(!this.props.orderId || this.props.orderId == '000' || !this.state.insureance.dealPath){
            doFlag = true;
          }else if(this.props.orderId && this.props.orderId != '000' && this.state.insureance.dealPath){
            let temp = data.rows.filter((item)=> item.dealPath == this.state.insureance.dealPath);
            if(temp && temp.length > 0)
              doFlag = true;
          }

          if(doFlag){
            this.setState({disableButton: false});
            let productList = [], product = {};
            if(code == 'FJ'){
              productList = this.state.productList || [];
            }else if(code == 'GD'){
              productList = this.state.medicalProList || [];
            }

            for(let i in productList){
              if(code == 'FJ' && productList[i].itemId === ordAddition[index].itemId){
                product =  productList[i];
                break;
              }else if(code == 'GD' && productList[i].itemId === ordAdditionGD[index].itemId){
                product =  productList[i];
                break;
              }
            }
            let prdItemSublineList = product.prdItemSublineList || [];

            if(code == 'FJ'){
              this.setState({['prdItemSublineList'+index] : prdItemSublineList});
            }else if(code == 'GD'){
              const prdItemSecurityPlan = product.prdItemSecurityPlan || [],
                    prdItemSelfpayList = product.prdItemSelfpayList || [];
              this.setState({sublineListM: prdItemSublineList, prdItemSecurityPlan, prdItemSelfpayList});
            }

          }else{
            //修改保单的条件下， 不能修改附加险，只能添加附加险
            Modals.error({content:'您选择的产品与主险交易路线不一致，暂时无法预约，请联系您的上级！'});
            this.setState({disableButton: true});
            // if(code == 'FJ'){
            //   this.setState({['prdItemSublineList'+index] : []});
            // }else if(code == 'GD'){
            //   this.setState({sublineListM : [], prdItemSecurityPlan : [], prdItemSelfpayList : []});
            // }

          }
        }
      });
    }else{
      let productList = [], product = {};
      if(code == 'FJ'){
        productList = this.state.productList || [];
      }else if(code == 'GD'){
        productList = this.state.medicalProList || [];
      }

      for(let i in productList){
        if(productList[i].itemId == value)
          product =  productList[i];
      }
      let prdItemSublineList = product.prdItemSublineList || [];

      if(code == 'FJ'){
        this.setState({['prdItemSublineList'+index] : prdItemSublineList});
      }else if(code == 'GD'){
        const prdItemSecurityPlan = product.prdItemSecurityPlan || [],
              prdItemSelfpayList = product.prdItemSelfpayList || [];
        this.setState({sublineListM: prdItemSublineList, prdItemSecurityPlan, prdItemSelfpayList});
      }
    }
  }


  //改变属性时，改变 state 附加险
  onFieldChange(index, fieldName, value){
    let ordAddition = this.state.ordAddition || [];
    if (value) {
      ordAddition[index][fieldName] = value.target ? value.target.value : value;
    } else {
      ordAddition[index][fieldName] = '';
    }


    if(fieldName === 'sublineId'){
      let list = this.state['prdItemSublineList'+index] || [], sublineName = '';
      for(let k in list){
        if(list[k].sublineId == value){
          sublineName = list[k].sublineName;
          break;
        }
      }
      ordAddition[index].sublineName = sublineName;
    }
    this.setState({ ordAddition });
  }

  //改变属性时，改变 state  高端医疗
  onFieldChangeGD(index, fieldName, value){
    let ordAdditionGD = this.state.ordAdditionGD || [];
    ordAdditionGD[index][fieldName] = value.target ? value.target.value : value;

    if(fieldName === 'sublineId'){
      let list = this.state.sublineListM || [], sublineName = '';
      for(let k in list){
        if(list[k].sublineId == value){
          sublineName = list[k].sublineName;
          break;
        }
      }
      ordAdditionGD[index].sublineName = sublineName;
    }
    this.setState({ ordAdditionGD });
  }


  //附加险 新增
  insuranceCreate(){
    let ordAddition = this.state.ordAddition || [];
    ordAddition.push(this.getOrdAddition('keysFJ'));
    this.setState({ordAddition});
  }
  //附加险 删除
  insuranceDelete(index){
    const orderId = this.props.orderId;
    let ordAddition = this.state.ordAddition || [];

    if(!orderId || orderId == '000'){
      ordAddition = ordAddition.filter((item, i) => index != i);
      this.setState({ordAddition});
      //this.props.form.resetFields();        //不执行这行代码界面会出问题，什么鬼原因
    }else if(orderId || orderId != '000'){
      let realDelete = ordAddition[index];
      if(realDelete.additionId){
        Modals.warning(this.realDelet.bind(this,'keysFJ', realDelete.additionId), '确定要删除吗？');
      }else{
        ordAddition = ordAddition.filter((item, i) => index != i);
        this.setState({ordAddition});
        //this.props.form.resetFields();
      }
    }
  }


  //高端医疗 新增
  insuranceCreateGD(){
    let ordAdditionGD = this.state.ordAdditionGD || [];
    ordAdditionGD.push(this.getOrdAddition('keysGD'));
    this.setState({ordAdditionGD, formItemGDFlag: false});
  }
  //高端医疗 删除
  insuranceDeleteGD(index){
    const orderId = this.props.orderId;
    let ordAdditionGD = this.state.ordAdditionGD;
    if(!orderId || orderId == '000'){
      ordAdditionGD = ordAdditionGD.filter((item, i) => index != i);
      this.setState({formItemGDFlag: true, ordAdditionGD});
      this.props.form.resetFields();
    }else if(orderId || orderId != '000'){
      let realDelete = ordAdditionGD[index];
      if(realDelete.additionId){
        Modals.warning(this.realDelet.bind(this,'keysGD', realDelete.additionId), '确定要删除吗？');
      }else{
        ordAdditionGD = ordAdditionGD.filter((item, i) => index != i);
        this.setState({formItemGDFlag: true, ordAdditionGD});
        this.props.form.resetFields();
      }
    }
  }

  //真正的删除数据库中的数据
  realDelet(type, additionId, flag){
    if(!flag) return;
    if(additionId){
      service.additionRemove([{additionId}]).then((data)=>{
        if(data.success){
          if(type == 'keysGD'){
            let ordAdditionGD = this.state.ordAdditionGD || [];
            ordAdditionGD = ordAdditionGD.filter((item) => item.additionId != additionId );
            this.setState({formItemGDFlag: true, ordAdditionGD });
            this.props.form.resetFields();
          }else if(type == 'keysFJ'){
            let ordAddition = this.state.ordAddition || [];
            ordAddition = ordAddition.filter((item) => item.additionId != additionId);
            this.setState({ordAddition});
            this.props.form.resetFields();
          }
        }else{
          Modals.error({content:'删除失败!' + data.message});
        }
      });
    }
  }



  //上一步
  clickPrev(){
    // this.props.callback1();
    this.props.goBack('PRODUCT', this.state.insureance || {});
  }

  //下一步
  clickNext(){
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let insureance = this.state.insureance || {};
        let ordAddition = this.state.ordAddition || [], ordAdditionGD = this.state.ordAdditionGD || [];
        insureance.ordAddition = ordAddition.concat(ordAdditionGD);
        insureance.firstSumPremium = parseFloat(insureance.iaLevies || 0) + parseFloat(insureance.yearPayAmount || 0);
        insureance.ordAddition.map(item => {
          insureance.firstSumPremium += parseFloat(item.yearPayAmount || 0)
        });
        this.props.goNext('ORDER', insureance);
      }else{
        Modals.error({content:'请先填写完必填信息'});
      }
    });
  }

  //获取字表数据（附加险表的字段）
  getOrdAddition(keys){
    const insureance = this.state.insureance || {};
    return {
      additionId:  '',
      itemId: '',
      sublineId: '',
      currency: insureance.currency || '',
      payMethod: insureance.payMethod || '',
      yearPayAmount: '',
      policyAmount: '',
      securityLevel: '',
      securityRegion: '',
      selfpay: '',
      securityLevel: '',
      minClass: keys=='keysGD' ? 'GD' : '',
      __status: 'add',
    };
  }



  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue,setFieldsValue } = this.props.form;
    const insureance = this.state.insureance || {};
    const editFlag = insureance.editFlag || false;
    const orderId = this.props.orderId;

    let ordAddition = this.state.ordAddition || [], ordAdditionGD = this.state.ordAdditionGD || [];

    //如果是修改
    if(orderId && orderId != '000'){

    }else if(!orderId || orderId == '000'){

    }

    const formItemsFJ = ordAddition.map((item, index) => {
      return (
        <div>
          { index === 0 ? '':<hr style={{marginBottom:'3%'}}/> }
          {
            editFlag &&
            <FormItem  style={{marginRight:'200px'}} >
              <Tooltip placement="rightBottom" title="删除本条记录" >
                <Icon onClick={this.insuranceDelete.bind(this, index)} type="close" style={{cursor: 'pointer',float:'right',fontSize:'16px',fontWeight:'bold'}} />
              </Tooltip>
            </FormItem>
          }


          <div style={{display:'none'}}>
            <FormItem>
              {getFieldDecorator(`additionId-${index}`, {
                initialValue: item.additionId || '',
              })(
                <Input />
              )}
            </FormItem>
          </div>

          <FormItem {...formItemLayout} className={styles.formitem_sty} label='产品'>
            {getFieldDecorator(`itemId-${index}`, {
              rules: [{required:true,message:'产品必选'}],
              initialValue: item.itemId || '' ,
            })(
              <Select
                disabled={item.disabled || false}
                onChange={this.onProductSelect.bind(this, 'FJ', index, 'itemId')}
                showSearch
                optionFilterProp="children" >
                {
                  this.state.productList &&
                  this.state.productList.map((item)=>
                    <Option key={ `${item.itemId} index{index}` } value={item.itemId}>{item.itemName}</Option>
                  )
                }
              </Select>

            )}
          </FormItem>

          <FormItem {...formItemLayout} className={styles.formitem_sty} label="供款年期" >
            {getFieldDecorator(`sublineId-${index}`, {
              rules: [{required:true,message:'年期必选'}],
              initialValue: item.sublineId || '' ,
            })(
              <Select
                disabled={item.disabled || false}
                onChange={this.onProductSelect.bind(this, 'FJ', index, 'sublineId')}
                showSearch
                optionFilterProp="children">
                {
                  this.state['prdItemSublineList'+index] &&
                  this.state['prdItemSublineList'+index].map((item)=>
                    <Option key={ `${item.sublineId} index{index}` } value={item.sublineId}>{item.sublineItemName}</Option>
                  )
                }
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} className={styles.formitem_sty} label="保单币种">
            {getFieldDecorator(`currency-${index}`, {
              rules: [{required:true,message:'请选择保单币种'}],
              initialValue:insureance.currency || '',
            })(
              <Select
                disabled={true}
                onChange={this.onFieldChange.bind(this, index, 'currency')}
                showSearch
                optionFilterProp="children" >
                {
                  this.state.prdItemPaymode &&
                  this.state.prdItemPaymode.map((item)=>
                      <Option value={item.currencyCode}>{item.currencyName}</Option>
                  )
                }
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} className={styles.formitem_sty} label="供款方式">
            {getFieldDecorator(`payMethod-${index}`, {
              rules: [{required:true,message:'供款方式必选'}],
              initialValue:insureance.payMethod || '',
            })(
              <Select
                disabled={true}
                onChange={this.onFieldChange.bind(this, index, 'payMethod')}
                showSearch
                optionFilterProp="children">
                {
                  this.state.payMethodList &&
                  this.state.payMethodList.map((item)=>
                    <Option value={item.wayId}>{item.way}</Option>
                  )
                }
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label='年缴保费'  className={styles.formitem_sty}>
            {getFieldDecorator(`yearPayAmount-${index}`, {
              rules: [{ type:'number',required: true, message: '请输入年缴保费(精确到两位小数)', whitespace: true }],
              initialValue: item.yearPayAmount === 0 ?0:item.yearPayAmount || '',
            })(
              <InputNumber
                disabled={!editFlag}
                onChange={this.onFieldChange.bind(this, index, 'yearPayAmount')}
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

          <FormItem {...formItemLayout} label='保额'  className={styles.formitem_sty}>
            {getFieldDecorator(`policyAmount-${index}`, {
              rules: [{ type:'number', message: '保额(精确到两位小数)', whitespace: true }],
              initialValue: item.policyAmount || undefined,
            })(
              <InputNumber
                disabled={!editFlag}
                onChange={this.onFieldChange.bind(this, index, 'policyAmount')}
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
        </div>
      );
    });

    const formItemsGD = ordAdditionGD.map((item, index)=>{
      return(
        <div>
          {
            editFlag &&
            <FormItem  style={{marginRight:'200px'}}  >
              <Tooltip placement="rightBottom" title="删除本条记录" >
                <Icon onClick={this.insuranceDeleteGD.bind(this, index)} type="close" style={{cursor: 'pointer',float:'right',fontSize:'16px',fontWeight:'bold'}}/>
              </Tooltip>
            </FormItem>
          }

          <div style={{display:'none'}}>
            <FormItem>
              {getFieldDecorator(`additionId`, {
                initialValue: item.additionId || '',
              })(
                <Input />
              )}
            </FormItem>
          </div>

          <FormItem {...formItemLayout} className={styles.formitem_sty} label="产品名称">
            {getFieldDecorator(`itemId`, {
              rules: [{type:'number',required: true, message: '请选择产品名称', whitespace: true}],
              initialValue: item.itemId || '',
            })(
              <Select
                disabled={item.disabled || false}
                onChange={this.onProductSelect.bind(this, 'GD', index, 'itemId')}
                showSearch
                optionFilterProp="children" >
                {
                  this.state.medicalProList &&
                  this.state.medicalProList.map((item)=>
                    <Option key={item.itemId} value={item.itemId}>{item.itemName}</Option>
                  )
                }
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} className={styles.formitem_sty} label="供款年期" >
            {getFieldDecorator(`sublineId`, {
              rules: [{required:true,message:'年期必选'}],
              initialValue: item.sublineId || '',
            })(
              <Select
                disabled={item.disabled || false}
                onChange={this.onProductSelect.bind(this, 'GD', index, 'sublineId')}
                showSearch
                optionFilterProp="children">
                {
                  this.state.sublineListM &&
                  this.state.sublineListM.map((item)=>
                    <Option value={item.sublineId}>{item.sublineItemName}</Option>
                  )
                }
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} className={styles.formitem_sty} label="保单币种">
            {getFieldDecorator(`currency`, {
              rules: [{required:true,message:'供款方式必选'}],
              initialValue: insureance.currency || '',
            })(
              <Select
                disabled={true}
                onChange={this.onFieldChangeGD.bind(this, index, 'currency')}
                showSearch
                optionFilterProp="children" >
                {
                  this.state.prdItemPaymode &&
                  this.state.prdItemPaymode.map((item)=>
                      <Option value={item.currencyCode}>{item.currencyName}</Option>
                  )
                }
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} className={styles.formitem_sty} label="供款方式">
            {getFieldDecorator(`payMethod`, {
              rules: [{required:true,message:'供款方式必选'}],
              initialValue: insureance.payMethod || '',
            })(
              <Select
                disabled={true}
                onChange={this.onFieldChangeGD.bind(this, index, 'payMethod')}
                showSearch
                optionFilterProp="children">
                {
                  this.state.payMethodList &&
                  this.state.payMethodList.map((item)=>
                      <Option value={item.wayId}>{item.way}</Option>
                  )
                }
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label='年缴保费'  className={styles.formitem_sty}>
            {getFieldDecorator(`yearPayAmount`, {
              rules: [{ type:'number',required: true, message: '请输入年缴保费(精确到两位小数)', whitespace: true }],
              initialValue: item.yearPayAmount === 0 ? 0 : item.yearPayAmount || '',
            })(
              <InputNumber
                disabled={!editFlag}
                onChange={this.onFieldChangeGD.bind(this, index, 'yearPayAmount')}
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

          <FormItem {...formItemLayout} className={styles.formitem_sty} label="保障级别">
            {getFieldDecorator(`securityLevel`, {
              rules: [{required: true, message: '请选择保障级别', whitespace: true}],
              initialValue: item.securityLevel || '',
            })(
              <Select
                disabled={!editFlag}
                onChange={this.onFieldChangeGD.bind(this, index, 'securityLevel')}
                showSearch
                optionFilterProp="children" >
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
            {getFieldDecorator(`securityRegion`, {
              rules: [{required: true, message: '请选择保障地区', whitespace: true}],
              initialValue: item.securityRegion || '',
            })(
              <Select
                disabled={!editFlag}
                onChange={this.onFieldChangeGD.bind(this, index, 'securityRegion')}
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
            {getFieldDecorator(`selfpay`, {
              rules: [{required: true, message: '请选择自付选项', whitespace: true,}],
              initialValue: item.selfpay || '',
            })(
              <Select
                disabled={!editFlag}
                onChange={this.onFieldChangeGD.bind(this, index, 'selfpay')}
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
      );
    });

    return (
      <div className={styles.table_border}>
        <Form className='disableds' >
          <div className={styles.item_div}>
            <div className={styles.title_sty}>
              <span className={styles.iconL} ></span>
              <font className={styles.title_font2}>预约签单</font>
            </div>
            <div className={styles.model_title}>
              <font >添加附加险</font>
            </div>

            {/* 添加附加险 */}
            <div>
              {formItemsFJ}

              <FormItem {...tailFormItemLayout} className={styles.formitem_sty}>
                <div style={{textAlign:'center'}}>
                  <Button
                    disabled={!editFlag}
                    onClick={this.insuranceCreate.bind(this)}
                    type='default'
                    style={{width:'100%',height:'40px'}}>
                    <Icon type="plus" />添加更多附加险
                  </Button>
                </div>
              </FormItem>
            </div>

            <hr style={{margin:30}}/>

            {/* 添加高端医疗 */}
            <div>
              {formItemsGD}
              {
                this.state.formItemGDFlag &&
                <FormItem {...tailFormItemLayout} className={styles.formitem_sty}>
                  <div style={{textAlign:'center'}}>
                    <Button
                      disabled={!editFlag}
                      onClick={this.insuranceCreateGD.bind(this)}
                      type='default'
                      style={{width:'100%',height:'40px'}}>
                      <Icon type="plus" />添加高端医疗
                    </Button>
                  </div>
                </FormItem>
              }
            </div>

            <FormItem  {...tailFormItemLayout} style={{marginTop:60}}>
              <Row gutter={24}>
                <Col span={12}>
                  <Button type='primary' style={{ float:'left',width:'160px',height:'40px'}}  size='large' onClick={this.clickPrev.bind(this)}>上一步</Button>
                </Col>

                <Col span={12}>
                  <Button
                    disabled={this.state.disableButton}
                    type='primary'
                    style={{float:'right', width:'160px',height:'40px'}}
                    size='large'
                    onClick={this.clickNext.bind(this)}>下一步</Button>
                </Col>
              </Row>
            </FormItem>
          </div>

        </Form>
      </div>
    );
  }
}

export default Form.create()(InsureAdditional);

