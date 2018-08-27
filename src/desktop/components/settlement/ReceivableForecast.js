/*
 * show 应收预测
 * @author:zhouting
 * @version:20180425
 */
import React from 'react';
import { connect } from 'dva';
import  moment from 'moment';
import { Form,DatePicker,Select,Button,Table,Input} from 'antd';
import * as service from '../../services/settlement';
import { handleTableChange } from '../../utils/table';
import * as codeService from "../../services/code";
import style from '../../styles/settlement.css';
class ReceivableForecast extends React.Component{
    state = {
        expand:false
    }
    constructor(props){
        super(props);
        this.state={
            code:{},
            dataList:[]
        }
    } 
    componentDidMount(){
        let params = {
            paymentTypes :'FET.PAYMENT_TYPE',
            currencyTypes: 'PUB.CURRENCY',
        }
        let settlementParams = {
            settleFlag:'Y',
            receiveCompanyType:JSON.parse(localStorage.user).userType,
            receiveCompanyId:JSON.parse(localStorage.user).relatedPartyId
        }
        codeService.getCode(params).then((data)=>{
            this.setState({code:data})
        })
        service.queryReceiveForecast(settlementParams).then((data)=>{
            this.setState({dataList:data.rows})
        })
    }
    refer(){
        let settlementParams = {
            settleFlag:'Y',
            receiveCompanyType:JSON.parse(localStorage.user).userType,
            receiveCompanyId:JSON.parse(localStorage.user).relatedPartyId,
            paymentType:this.props.form.getFieldValue('paymentType'),
            orderNumber:this.props.form.getFieldValue('orderNumber'),
            patron:this.props.form.getFieldValue('patron')
        }
        service.queryReceiveForecast(settlementParams).then((data)=>{
            this.setState({dataList:data.rows})
        })
    }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const columns = [{
            title: '付款方名称',
            key: 'paymentCompanyName',
            dataIndex: 'paymentCompanyName'
        }, {
            title: '结算类型',
            key: 'paymentType',
            dataIndex: 'paymentType',
            render:(text)=>{
                if(text && this.state.code.paymentTypes){
                    for(let i in this.state.code.paymentTypes){
                        if(text == this.state.code.paymentTypes[i].value){
                            return this.state.code.paymentTypes[i].meaning
                        }
                    }
                }
                return ''
            }
        }, {
            title: '保单/订单编号',
            key: 'orderNumber',
            dataIndex: 'orderNumber'
        }, {
            title: '投保人',
            key: 'patron',
            dataIndex: 'patron'
        }, {
            title: '产品名称',
            key: 'itemName',
            dataIndex: 'itemName'
        }, {
            title: '订单币种',
            key: 'orderCurrency',
            dataIndex: 'orderCurrency',
            render:(text)=>{
                if(text && this.state.code.currencyTypes){
                    for(let i in this.state.code.currencyTypes){
                        if(text == this.state.code.currencyTypes[i].value){
                            return this.state.code.currencyTypes[i].meaning
                        }
                    }
                }
                return ''
            }
        }, {
            title: '保费',
            key: 'amount',
            dataIndex: 'amount'
        }, {
            title: '费率',
            key: 'rate',
            dataIndex: 'rate'
        }, {
            title: '结算币种',
            key: 'payCurrency',
            dataIndex: 'payCurrency',
            render:(text)=>{
                if(text && this.state.code.currencyTypes){
                    for(let i in this.state.code.currencyTypes){
                        if(text == this.state.code.currencyTypes[i].value){
                            return this.state.code.currencyTypes[i].meaning
                        }
                    }
                }
                return ''
            }
        }, {
            title: '汇率',
            key: 'exchangeRate',
            dataIndex: 'exchangeRate'
        }, {
            title: '应收总额（结算币种）',
            key: 'exchangeRateAmount',
            dataIndex: 'exchangeRateAmount',
            render:(text)=>{
                return text.toFixed(2)
            }
        }, {
            title: '实收总额（结算币种）',
            key: 'factIncomeSettlement',
            dataIndex: 'factIncomeSettlement',
            render:(text)=>{
                return text.toFixed(2)
            }
        }, {
            title: '应收未收总额（结算币种）',
            key: 'unpaidSettlement',
            dataIndex: 'unpaidSettlement',
            render:(text)=>{
                return text.toFixed(2)
            }
        }, {
            title: '预计结算日',
            key: 'dueDate',
            dataIndex: 'dueDate',
            render:(text)=>{
                return moment(text).format("YYYY-MM-DD")
            }
        }, {
            title: '实收差异原因',
            key: 'factPayDiffer',
            dataIndex: 'factPayDiffer'
        }];
        return(
            <div className={style.main} >
                <div>
                    <div>
                        <Form layout='inline' style={{margin:'20px 0'}}> 
                            <Form.Item>
                                {
                                    getFieldDecorator('paymentType')(
                                        <Input style={{ width: '150px' }} placeholder='结算类型' />
                                    )
                                }
                            </Form.Item>
                            <Form.Item>
                                {
                                    getFieldDecorator('orderNumber')(
                                        <Input style={{ width: '150px' }} placeholder='保单/订单编号' />
                                    )
                                }
                            </Form.Item>
                            <Form.Item>
                                {
                                     getFieldDecorator('patron')(
                                        <Input style={{ width: '150px' }} placeholder='投保人' />
                                     )
                                }
                            </Form.Item>
                            <Form.Item style={{float:'right',marginRight:'-9px'}}>
                                <Button type="default" htmlType="submit" style={{width:'140px',height:'40px',marginRight:'10px'}} onClick={this.refer.bind(this)}>查询</Button>
                            </Form.Item>   
                        </Form>
                        <Table rowKey='key'
                            dataSource={this.state.dataList}
                            columns={columns}
                            bordered scroll={{ x: '180%' }}
                        />
                    </div>              
                </div>
            </div>
        )
    }
}
export default Form.create()(ReceivableForecast)