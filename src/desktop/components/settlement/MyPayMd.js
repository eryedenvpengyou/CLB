/*
 * show 我的实付新建
 * @author:zhouting
 * @version:20180428
 */
import React from 'react';
import { connect } from 'dva';
import { Form,DatePicker,Select,Button,Table,Input,InputNumber,Dropdown,Menu,Modal} from 'antd';
import Lov from "../common/Lov";
import * as service from '../../services/settlement';
import * as codeService from "../../services/code";
import Modals from '../common/modal/Modal';
import style from '../../styles/settlement.css';
function thesame(arr) {
    //Set数据结构，它类似于数组，其成员的值都是唯一的
    return Array.from(new Set(arr)); // 利用Array.from将Set结构转换成数组
}
class MyPayMd extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            code:{
                paymentTypes:[],
                currency:[]
            },
            required:true,
            proReq:true,
            setttleList:[] ,//结算类型列表
            style2:'#fff',
            selRecord:{}
        }
    }
    componentDidMount() {
        let params = {
            paymentTypes: 'FET.PAYMENT_TYPE',
            currency:'PUB.CURRENCY' ,//币种
        }
        codeService.getCode(params).then((data) => {
            this.setState({ code: data })
        })
    }
    back(val){
        let record = {}
        if(val == 1){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    for (let i in values) {
                        if (values[i] === '') {
                            record[i] = ''
                        } else {
                            record[i] = values[i]
                        }
                    }
                    this.props.callback(record);
                    this.props.form.resetFields();
                    this.setState({setttleList:[]})
                }
            })
        }else if(val == 0){
            this.props.callback(record);
            this.props.form.resetFields();
            this.setState({setttleList:[]})
        }
    }
    //更改订单
    orderChange(val){
        if(val.record){
            this.props.form.setFieldsValue({
                settleType:''
            })
            let settleType = this.props.form.getFieldValue('settleType')
            settleType.indexOf('JSF')>-1 || settleType.indexOf('CKJT')>-1 || settleType.indexOf('SAMJT')>-1?this.props.form.setFieldsValue({
                itemId:{value:'', meaning:''}
            }):this.props.form.setFieldsValue({
                itemId:{value:val.record.itemId, meaning:val.record.itemName}
            });
            let typeParams = {
                orderNumber:val.meaning,
                receiveCompanyId: val.record.receivecompanyid,
                receiveCompanyType:val.record.receivecompanytype,
                paymentCompanyId:val.record.paymentcompanyid,
                paymentCompanyType:val.record.paymentcompanytype,
                detailType:'PAY',
                itemId:  settleType.indexOf('JSF')>-1 || settleType.indexOf('CKJT')>-1 || settleType.indexOf('SAMJT')>-1?'':this.props.form.getFieldValue('itemId').value
            }
            service.settleType(typeParams).then((data)=>{
                this.setState({setttleList:data.rows});
            })
        }
    }
    //结算类型
    settleChange(val){
        let selRecord = this.state.setttleList.filter((i)=>i.settleType == val)[0];
        this.setState({selRecord:selRecord})
        if(val){
            let order = this.props.form.getFieldValue('orderId');
            if(val == 'QDF' || val == 'SKF' ){
                this.setState({required:false,proReq:false,style2:'#f7f7f7'});
                this.props.form.setFieldsValue({
                    // orderId:{value:'',meaning:''},
                    itemId:{value:'',meaning:''},
                    orderCurrency:'',
                    orderAmount:'',
                    rate:'',
                    actualAmount:'',
                    exchangeRate:'',
                    currencyAmount:''
                })
            }else if(val.indexOf('JSF')>-1 || val.indexOf('CKJT')>-1 || val.indexOf('SAMJT')>-1){
                this.props.form.setFieldsValue({
                    itemId:{value:'', meaning:''},
                });
                this.setState({proReq:false,required:true,style2:'#fff'})
            }else{
                order.record ? this.props.form.setFieldsValue({
                    itemId: { value: order.record.itemId, meaning: order.record.itemName },
                }) : '';
                this.setState({required:true,proReq:true,style2:'#fff'});
            }
            if(val!== 'QDF' && val !== 'SKF'){
                //实付详情新建
                if( order.value !== ''){
                    let currencyAmount = {
                        settleType: val,
                        itemId: this.props.form.getFieldValue('itemId').value,
                        orderId: order.value,
                        orderCurrency: order.record.orderCurrency,
                        payPeriods: selRecord.payPeriods,
                        incomePayId: selRecord.incomePayId,
                        commissionId: order.record.commissionId,
                        receiveCompanyId: order.record.receivecompanyid,
                        summaryCurrency: this.props.settleCurrency,
                        detailType: 'PAY'
                    }
                    service.selectOrder(currencyAmount).then((data) => {
                        if (data.success) {
                            let datas = data.rows[0];
                            let orderCurrency;
                            this.state.code.currency.map((item) => {
                                if (item.value == datas.orderCurrency) {
                                    orderCurrency = item.value
                                }
                            })
                            this.props.form.setFieldsValue({
                                orderCurrency: orderCurrency,
                                orderAmount: datas.orderAmount,
                                rate: ((datas.rate)*100).toFixed(2)+'%',
                                actualAmount:datas.actualAmount,
                                exchangeRate:datas.exchangeRate === 0?'':datas.exchangeRate,
                                currencyAmount:datas.currencyAmount
                            });
                        }
                    })
                }
            }
        }
    }
    amount(val,i){
        if (i == 0) {
            this.props.form.getFieldValue('exchangeRate') !== ''?
            this.props.form.setFieldsValue({
                currencyAmount: (this.props.form.getFieldValue('exchangeRate') * val).toFixed(2)
            }):''
        } else if (i == 1) {
            this.state.required ?
            val && this.props.form.getFieldValue('exchangeRate') !== ''?
            this.props.form.setFieldsValue({
                actualAmount: (val / this.props.form.getFieldValue('exchangeRate')).toFixed(2)
            }):'':''
        } else if (i == 2) {
            val?
            this.props.form.setFieldsValue({
                currencyAmount: (this.props.form.getFieldValue('actualAmount') * val).toFixed(2)
            }):''
        }
    }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form; 
        const formItemLayout = {
            labelCol: {
              xs: {span: 24},
              sm: {span: 10},
            },
            wrapperCol: {
              xs: {span: 20},
              sm: {span: 12},
            },
          }
        const record = this.props.record || {};
        if(record.__status == 'update'){
            if (record.settleType == 'QDF' || record.settleType == 'SKF') {
                this.state.style2 = '#f7f7f7';
                this.state.required = false;
                this.state.proReq = false;
            } else if (record.settleType.indexOf('JSF') > -1 || record.settleType.indexOf('CKJT') > -1 || record.settleType.indexOf('SAMJT') > -1) {
                this.state.proReq = false;
                this.state.required = true;
            } else {
                this.state.style2 = '#fff';
                this.state.required = true;
                this.state.proReq = true;
            }
        }else if(JSON.stringify(record) == '{}' ){ 
            this.state.style2 = '#fff';
            this.state.required = true;
            this.state.proReq = true;
        }
        //根据保单编号筛选结算类型
        let settleSel = [];
        this.state.setttleList.map((item) => {
            this.state.code.paymentTypes.filter(
                function (i) {
                    if (i.value == item.settleType) {
                        i.incomePayId = item.incomePayId
                        return settleSel.push(i)
                    }
                }
            )
        })
        const typeOptions = record.__status == 'update'?
        this.state.code.paymentTypes.map((item)=>{
            return <Select.Option key={item.value}
            >{item.meaning}</Select.Option>
        }):thesame(settleSel).map((item) => {
                return <Select.Option key={item.value}
                >{item.meaning}</Select.Option>
            })
        const currencyOptions = this.state.code.currency.map((item)=>{
            return <Select.Option key={item.value}>{item.meaning}</Select.Option>
        })
        return(
            <div>
                <Modal
                    title={'我的实付详情'}
                    width={600}
                    style={{ top: 20 }}
                    maskClosable={false}
                    closable={true}
                    footer={null}
                    visible={this.props.visible}
                    onCancel={this.back.bind(this, 0)}
                    className={style.modal}
                >
                    <Form>
                        <div className={style.orderDis} style={{ paddingTop: '10px'}}>
                            <Form.Item {...formItemLayout} label="保单/订单编号" >
                                {getFieldDecorator('orderId', {
                                    rules: [
                                        { required: this.state.required, message: '请选择保单/订单编号', }
                                    ],
                                    initialValue: { value: record.orderId || '', meaning: record.orderNumber || '' }
                                })(
                                    <Lov suffix={true} placeholder="请选择订单"
                                        lovCode='FET_INCOME_ORDERNUMBER_WS'
                                        params={{
                                            paymentCompanyId: JSON.parse(localStorage.user).relatedPartyId,
                                            paymentCompanyType: JSON.parse(localStorage.user).userType,
                                            receiveCompanyId:this.props.receiveCompanyId,
                                            receiveCompanyType:this.props.receiveCompanyType,
                                            detailType: 'PAY',
                                            settleType: this.props.form.getFieldValue('settleType') == 'QDF' ||
                                            this.props.form.getFieldValue('settleType') == 'SKF'?'':this.props.form.getFieldValue('settleType')
                                        }}
                                        onChange={this.orderChange.bind(this)}
                                        disabled={record.__status == "update" ? true : false}
                                        width="100%" />
                                    )}
                            </Form.Item>
                        </div>
                            <div className={style.disableds} >
                                <Form.Item {...formItemLayout} label="结算类型" >
                                    {getFieldDecorator('settleType', {
                                        rules: [
                                            { required: true, message: '请选择结算类型', whitespace: true }
                                        ],
                                        initialValue: record.settleType || '', onChange: this.settleChange.bind(this),
                                    })(
                                        record.__status == "update"?
                                        <Select
                                            allowClear
                                            showSearch
                                            disabled={true}
                                            style={{ color: 'rgba(0, 0, 0, 0.65)' }}
                                        >
                                            {typeOptions}
                                        </Select>:
                                        this.state.setttleList.length?
                                        <Select
                                            allowClear
                                            showSearch
                                            disabled={false}
                                            style={{ color: 'rgba(0, 0, 0, 0.65)' }}
                                        >
                                            {typeOptions}
                                        </Select>:
                                        <Select
                                            allowClear
                                            showSearch
                                            disabled={false}
                                            style={{ color: 'rgba(0, 0, 0, 0.65)' }}
                                        >

                                            <Select.Option value="QDF">签单费</Select.Option>
                                            <Select.Option value="SKF">刷卡费</Select.Option>
                                        </Select>
                                        )}
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="产品名称" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                                    {getFieldDecorator('itemId', {
                                        rules: [
                                            { required: this.state.proReq, message: '请输入产品名称' }
                                        ],
                                        initialValue: this.state.proReq ?{ value: record.itemId || '', meaning: record.itemName || '' }:''
                                    })(
                                        <Lov suffix={true} placeholder=" "
                                            lovCode='FET_INCOME_ITEM_WS'
                                            disabled={true}
                                            params={{
                                                paymentCompanyId: JSON.parse(localStorage.user).relatedPartyId,
                                                paymentCompanyType: JSON.parse(localStorage.user).userType,
                                                detailType: 'PAY',
                                                settleType:  this.props.form.getFieldValue('settleType') == 'QDF' ||
                                                this.props.form.getFieldValue('settleType') == 'SKF'?'':this.props.form.getFieldValue('settleType'),
                                                orderNumber:  this.props.form.getFieldValue('orderId') ?  this.props.form.getFieldValue('orderId').meaning : ''
                                            }}
                                            width="100%" />
                                        )}
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="订单币种" >
                                    {getFieldDecorator('orderCurrency', {
                                        rules: [
                                            { required: this.state.required, message: '请输入订单币种' }
                                        ],
                                        initialValue: record.orderCurrency || ''
                                    })(

                                        <Select
                                            showArrow={false}
                                            disabled={true}
                                            style={{ color: 'rgba(0, 0, 0, 0.65)' }}
                                        >
                                            {currencyOptions}
                                        </Select>
                                        )}
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="订单金额" >
                                    {getFieldDecorator('orderAmount', {
                                        rules: [
                                            { required: this.state.required, message: '请输入订单金额' }
                                        ],
                                        initialValue: record.settleType == 'QDF' || record.settleType == 'SKF' ?
                                        '' : record.orderAmount === 0 ? 0 : (record.orderAmount || '')
                                    })(
                                        <Input readOnly />
                                        )}
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="费率" >
                                    {getFieldDecorator('rate', {
                                        rules: [
                                            { required: this.state.required, message: '请输入费率' }
                                        ],
                                        initialValue: record.rate === 0 ? 0 : record.rate ? ((record.rate) * 100).toFixed(2) + '%' : ''
                                    })(
                                        <Input readOnly />
                                        )}
                                </Form.Item>
                                <div className={style.message}></div>
                                <Form.Item {...formItemLayout} label="实付金额" >
                                    {getFieldDecorator('actualAmount', {
                                        rules: [
                                            { required: this.state.required, message: '请输入实付金额' }
                                        ],
                                        initialValue: record.actualAmount === 0 ? 0 : (record.actualAmount || '')
                                    })(
                                        <InputNumber precision={2} style={{background:this.state.style2, width:'100%'}}  disabled={this.state.required ? false : true} onBlur={this.amount.bind(this, getFieldValue('actualAmount'), 0)} />
                                        )}
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="汇率" >
                                    {getFieldDecorator('exchangeRate', {
                                        rules: [
                                            { required: this.state.required, message: '请输入汇率' }
                                        ],
                                        initialValue: record.exchangeRate === 0 ? 0 : (record.exchangeRate || ''),
                                    })(
                                        <InputNumber precision={2} style={{background:this.state.style2 , width:'100%'}}  disabled={this.state.required ? false : true}
                                            onBlur={this.amount.bind(this, getFieldValue('exchangeRate'), 2)}
                                        />
                                        )}
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="实付金额（结算币种）" >
                                    {getFieldDecorator('currencyAmount', {
                                        rules: [
                                            { required: true, message: '请输入实付金额（结算币种）' }
                                        ],
                                        initialValue: record.currencyAmount === 0 ? 0 : (record.currencyAmount || ''),

                                    })(
                                        <InputNumber precision={2} style={{width:'100%'}} onBlur={this.amount.bind(this, getFieldValue('currencyAmount'), 1)} />
                                        )}
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="备注" >
                                    {getFieldDecorator('comments', {
                                        rules: [
                                            { message: '请输入备注', whitespace: true }
                                        ],
                                        initialValue: record.comments || ''
                                    })(
                                        <Input />
                                        )}
                                </Form.Item>
                            </div>
                        <div style={{ textAlign: 'center', marginBottom: '20px', marginLeft: '176px' }}>
                            <Button type="default" onClick={this.back.bind(this,0)} style={{ width: '120px', height: '38px' }} >取消</Button>
                            <Button type="primary" onClick={this.back.bind(this,1)} style={{ width: '120px', height: '38px', marginLeft: '32px' }} >确定</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(MyPayMd)