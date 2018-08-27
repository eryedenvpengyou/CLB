/*
 * show 上线实派详情
 * @author:zhouting
 * @version:20180502
 */
import React from 'react';
import { connect } from 'dva';
import { Form,DatePicker,Select,Button,Table,Input,Dropdown,Menu} from 'antd';
import * as service from '../../services/settlement';
import * as serviceChannel from '../../services/channel';
import * as codeService from "../../services/code";
import TipModal from "../common/modal/Modal";
import style from '../../styles/settlement.css';
class OnlineDetail extends React.Component{
    state = {
        expand:false
    }
    constructor(props){
        super(props);
        this.state = {
            code: {
                paymentTypes: [],
            },
            dataList:[]
        }
    }
    componentDidMount(){
        let params = {
            paymentTypes :'FET.PAYMENT_TYPE',
            currencyTypes: 'PUB.CURRENCY',
        }
        codeService.getCode(params).then((data)=>{
            this.setState({code:data})
        });
        this.query()
    }
    query(){
        let payParams = {
            actualSummaryId:this.props.actualSummaryId,
            dataSource:'WEB'
        }
        service.paymentDetail(payParams).then((data)=>{
            if(data.success){
                this.setState({dataList:data.rows})
            }
        })
    }
    //查询
    res(){
        let payParams = {
            actualSummaryId:this.props.actualSummaryId,
            dataSource:'WEB',
            orderNumber:this.props.form.getFieldValue('orderNumber'),
            settleType:this.props.form.getFieldValue('settleType')
        }
        service.paymentDetail(payParams).then((data)=>{
            if(data.success){
                this.setState({dataList:data.rows})
            }
        })
    }
    //付款确认
    confirmed() {
        serviceChannel.confirmedReceive({ settlementSummaryId: this.props.settlementSummaryId }).then((data) => {
            if (data.success) {
                TipModal.success({ content: data.message });
                document.getElementsByClassName('confirm')[0].style.display = 'none'
                this.query();
            } else {
                TipModal.error({ content: data.message });
            }
        })
    }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const columns = [ {
            title: '结算类型',
            key: 'settleType',
            dataIndex: 'settleType',
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
        },{
            title: '产品名称',
            key: 'itemName',
            dataIndex: 'itemName'
        },{
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
        },{
            title: '订单金额',
            key: 'orderAmount',
            dataIndex: 'orderAmount'
        }, {
            title: '费率',
            key: 'rate',
            dataIndex: 'rate',
            render:(text)=>{
                return  text === 0?0:text? (text*100).toFixed(2)+'%':''
            }
        }, {
            title: '结算金额',
            key: 'actualAmount',
            dataIndex: 'actualAmount',
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '汇率',
            key: 'exchangeRate',
            dataIndex: 'exchangeRate',
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '实收金额（结算币种）',
            key: 'currencyAmount',
            dataIndex: 'currencyAmount',
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '备注',
            key: 'comments',
            dataIndex: 'comments'
        }];
        const paymentOptions = this.state.code.paymentTypes.map((item)=>{
            return  <Select.Option key={item.value}>{item.meaning}</Select.Option>
        });
        return(
            <div className={style.main} >
                <div>
                    <div style={{overflow:'hidden'}}>
                        {
                            this.props.receiveFlag == 'N' && this.props.settlementSummaryType == 'PAYMENT_STATEMENT' ?
                                <a onClick={this.confirmed.bind(this)}>
                                    <Button className='confirm' type='primary' style={{ float: 'left', width: '120px', height: '40px', outLine: 'none' }}>收款确认</Button>
                                </a> : ''
                        }
                        <Form layout='inline' style={{float: 'right' }}>
                            <Form.Item>
                                {getFieldDecorator('settleType')(
                                    <Select showSearch placeholder="结算类型"
                                        optionFilterProp="children" style={{ width: '150px' }}
                                    >
                                        {paymentOptions}
                                    </Select>
                                )
                                }
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('orderNumber')(
                                    <Input style={{ width: '200px' }} placeholder='保单/订单编号' />
                                )}
                            </Form.Item>
                            <Form.Item style={{ marginRight: '-9px'}}>
                                <Button type="default" htmlType="submit" style={{ width: '140px', height: '40px', marginRight: '10px' }} onClick={this.res.bind(this)}>查询</Button>
                            </Form.Item>
                        </Form>
                    </div>              
                    <Table rowKey='key'
                            dataSource={this.state.dataList}
                            columns={columns}
                            bordered
                            scroll={{x:'120%'}}
                        //onChange={this.sortChange.bind(this)}
                        //pagination={this.state.pagination}
                        />
                </div>
            </div>
        )
    }
}
export default Form.create()(OnlineDetail)