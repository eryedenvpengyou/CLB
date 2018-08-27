/*
 * show 付款对账单
 * @author:zhouting
 * @version:20180426
 */
import React from 'react';
import { connect } from 'dva';
import  moment from 'moment';
import { Form,DatePicker,Select,Button,Table,Input,Dropdown,Menu} from 'antd';
import * as service from '../../services/settlement';
import Modals from '../common/modal/Modal';
import { handleTableChange } from '../../utils/table';
import * as codeService from "../../services/code";
import style from '../../styles/settlement.css';
class Payment extends React.Component{
    state = {
        expand:false
    }
    constructor(props){
        super(props);
        this.state={
            code:{
                paymentStatus:[]
            },
            dataList:[]
        }
    }
    componentDidMount(){
        let params = {
            paymentTypes :'FET.PAYMENT_TYPE',
            paymentStatus:'FET.SETTLEMENT_STATUS',
            currencyTypes: 'PUB.CURRENCY',
        }
        codeService.getCode(params).then((data)=>{
            this.setState({code:data})
        })
        this.res();
    }
    res(){
        let payParams = {
            paymentCompanyType:JSON.parse(localStorage.user).userType,
            paymentCompanyId:JSON.parse(localStorage.user).relatedPartyId,
        }
        service.summaryQuery(payParams).then((data)=>{
            this.setState({dataList:data.rows})
        })
    }
    refer(){
        let payParams = {
            paymentCompanyType:JSON.parse(localStorage.user).userType,
            paymentCompanyId:JSON.parse(localStorage.user).relatedPartyId,
            periodName:this.props.form.getFieldValue('periodName'),
            status:this.props.form.getFieldValue('status'),
            receiveCompanyName:this.props.form.getFieldValue('receiveCompanyName')
        }
        service.summaryQuery(payParams).then((data)=>{
            this.setState({dataList:data.rows})
        })
    }
    //付款确认
    confirmed(record){
        service.confirmed({settlementSummaryId:record.settlementSummaryId}).then((data)=>{
            if(data.success){
                Modals.success({ content: data.message });
                this.res();
            }else{
                Modals.error({content:data.message})
            }
        })
    }
    //审核完成
    changeStatus(record){
        service.changeStatus([{settlementSummaryId:record.settlementSummaryId,status:'CONFIRMING'}]).then((data)=>{
            if(data.success){
                Modals.success({ content: data.message });
                this.res();
            }else{
                Modals.error({content:data.message})
            }
        })
    }
    //取消
    cancel(record,flag){
        if(flag){
            service.cancel({settlementSummaryId:record.settlementSummaryId}).then((data)=>{
                if(data.success){
                    Modals.success({ content: data.message });
                    this.res();
                }else{
                    Modals.error({content:data.message})
                }
            })
        }
    }
    onCancel(record){
        Modals.warning(this.cancel.bind(this,record),{ content: '确定取消该对账单吗？' });
    }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const columns = [
        {
            title: '收款方名称',
            key: 'receiveCompanyName',
            dataIndex: 'receiveCompanyName'
        }, {
            title: '结算期间',
            key: 'periodName',
            dataIndex: 'periodName'
        }, {
            title: '结算币种',
            key: 'currency',
            dataIndex: 'currency',
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
            title: '结算金额',
            key: 'amount',
            dataIndex: 'amount',
            render:(text)=>{
                return text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render:(text)=>{
                if(text && this.state.code.paymentStatus){
                    for(let i in this.state.code.paymentStatus){
                        if(text == this.state.code.paymentStatus[i].value){
                            return this.state.code.paymentStatus[i].meaning
                        }
                    }
                }
                return ''
            }
        }, {
            title: '付款日期',
            key: 'settleDate',
            dataIndex: 'settleDate',
            render:(text)=>{
                return moment(text).format("YYYY-MM-DD")
            }
        },{
            title: '操作',
            width:'140px',
            render:(text,record,index)=>{
                let opr = [];
                let done = <Menu.Item><Button style={{ width: '100px', fontSize: '14px' }} type='default' onClick={this.changeStatus.bind(this,record)}>审核完成</Button></Menu.Item>
                let confirm =  <Menu.Item><Button style={{ width: '100px', fontSize: '14px' }} type='default'onClick={this.confirmed.bind(this,record)}>付款确认</Button></Menu.Item>
                let cancel = <Menu.Item><Button style={{ width: '100px', fontSize: '14px' }} type='default' onClick={this.onCancel.bind(this,record)}>取消</Button></Menu.Item>
                let detail = <Menu.Item><Button style={{ width: '100px', fontSize: '14px' }} type='default' onClick={()=>location.hash=`/settlement/paymentDetail/${record.settlementSummaryId}/${record.receiveCompanyName}`}>查看详情</Button></Menu.Item>

                if(record.status == 'NEW' || record.status == 'APRROVING'){//新建 待审核
                    opr = [detail,done,cancel]
                }else if(record.status == 'CONFIRMED'){//已确认
                    opr = [detail,confirm,cancel]
                }else if(record.status == 'CONFIRMING' || record.status == 'ASKING'){//待渠道确认 问询中
                    opr = [detail,cancel]
                }else{
                    opr = [detail]
                }
                return (
                    <div>
                        <Dropdown overlay={
                            <Menu>
                                {
                                    opr.map((item) =>
                                        item
                                    )
                                }
                            </Menu>

                        } placement='bottomLeft'
                        >
                            <Button type='default' style={{ width: '110px', fontSize: '14px' }}>操作</Button>
                        </Dropdown>
                    </div>
                )
            }
        }];
        const statusOptions = this.state.code.paymentStatus.map((item)=>{
            return  <Select.Option key={item.value}>{item.meaning}</Select.Option>
        });
        return(
            <div className={style.main} >
                <div>
                    <div>
                        <Form layout='inline' style={{margin:'20px 0'}}>
                            <Form.Item>
                                <Button type='primary' style={{fontSize:'20px',width:'140px',height:'40px',marginRight:'65px'}} onClick={()=>location.hash = `/settlement/paymentNew/000`}>新建对账单</Button>
                            </Form.Item> 
                            <div style={{float:'right'}}>
                                <Form.Item>
                                    {
                                        getFieldDecorator('periodName')(
                                            <Input style={{ width: '150px' }} placeholder='结算期间' />
                                        )
                                    }
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('status')(
                                        <Select showSearch placeholder="状态"
                                            optionFilterProp="children" style={{ width: '150px' }}
                                            allowClear
                                        >
                                            {statusOptions}
                                        </Select>
                                    )
                                    }
                                </Form.Item>
                                <Form.Item>
                                    {
                                        getFieldDecorator('receiveCompanyName')(
                                            <Input style={{ width: '150px' }} placeholder='收款方名称' />
                                        )
                                    }
                                </Form.Item>
                                <Form.Item style={{marginRight: '-9px' }}>
                                    <Button type="default" htmlType="submit" style={{ width: '140px', height: '40px', marginRight: '10px' }} onClick={this.refer.bind(this)}>查询</Button>
                                </Form.Item>  
                            </div>
                        </Form>
                        <Table rowKey='key'
                            dataSource={this.state.dataList}
                            columns={columns}
                            bordered
                        //onChange={this.sortChange.bind(this)}
                        //pagination={this.state.pagination}
                        />
                    </div>              
                </div>
            </div>
        )
    }
}
export default Form.create()(Payment)