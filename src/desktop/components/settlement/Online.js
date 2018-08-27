/*
 * show 上线应派
 * @author:zhouting
 * @version:20180502
 */
import React from 'react';
import { connect } from 'dva';
import { Form,DatePicker,Select,Button,Table,Input,Dropdown,Menu,Modal} from 'antd';
import moment from 'moment';
import TipModal from "../common/modal/Modal";
import * as service from '../../services/settlement';
import * as serviceChannel from '../../services/channel';
import * as codeService from "../../services/code";
import style from '../../styles/settlement.css';
class Online extends React.Component{
    state = {
        expand:false
    }
    constructor(props){
        super(props);
        this.state={
            code:{
                paymentTypes:[],
            },
            realList:[]
        }
    }
    componentDidMount(){
        let params = {
            paymentStatus:'FET.SETTLEMENT_STATUS',
            paymentTypes :'FET.PAYMENT_TYPE',
            currencyTypes: 'PUB.CURRENCY',
        }
        codeService.getCode(params).then((data)=>{
            this.setState({code:data})
        });
        this.query();
    }
    query(){
        let realParams ={
            receiveCompanyType:JSON.parse(localStorage.user).userType,
            receiveCompanyId:JSON.parse(localStorage.user).relatedPartyId,
            userId: JSON.parse(localStorage.user).userId
        }

        //最近一笔实派
        service.realSent(realParams).then((data)=>{
            if(data.success){
                this.setState({realList:data.rows})
            }
        });
    }
    //查询
    res(){
        let realParams = {
            receiveCompanyType:JSON.parse(localStorage.user).userType,
            receiveCompanyId:JSON.parse(localStorage.user).relatedPartyId,
            userId: JSON.parse(localStorage.user).userId,
            paymentCompanyName:this.props.form.getFieldValue('paymentCompanyName'),
            settlePeriod:this.props.form.getFieldValue('settlePeriod')
        }
        service.realSent(realParams).then((data)=>{
            if(data.success){
                this.setState({realList:data.rows})
            }
        });
    }
    //付款确认
    confirmed(record){
        serviceChannel.confirmedReceive({settlementSummaryId:record.settlementSummaryId}).then((data)=>{
            if(data.success){
                TipModal.success({content:data.message});
                this.query();
            }else{
                TipModal.error({content:data.message});
            }
        })
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
        const columns = [{
            title: '付款方',
            key: 'paymentCompanyName',
            dataIndex: 'paymentCompanyName'
        },{
            title: '结算期间',
            key: 'settlePeriod',
            dataIndex: 'settlePeriod'
        },{
            title: '结算币种',
            key: 'settleCurrency',
            dataIndex: 'settleCurrency',
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
            title: '结算金额',
            key: 'summaryAmount',
            dataIndex: 'summaryAmount',
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        },{
            title: '付款日期',
            key: 'settleDate',
            dataIndex: 'settleDate',
            render: (text) => {
                return moment(text).format('YYYY-MM-DD')}
        },{
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render:(text,record)=>{
                if(text && this.state.code.paymentStatus){
                    for(let i in this.state.code.paymentStatus){
                        if(text == this.state.code.paymentStatus[i].value){
                            if (record.receiveFlag == 'Y' && record.settlementSummaryType == 'PAYMENT_STATEMENT') {
                                return (<div>已收款</div>)
                            } else {
                                return (<div>{this.state.code.paymentStatus[i].meaning}</div>)
                            }
                        }
                    }
                }
                return ''
            }
        },{
            title: '操作',
            key:'operate',
            dataIndex:'operate',
            render:(text,record)=>{
                let opr = [];
                let confirm =<Menu.Item><Button style={{ width: '90px', fontSize: '14px' }} type='default'
                onClick={this.confirmed.bind(this,record)}
                >收款确认</Button></Menu.Item>
                let detail = <Menu.Item>
                    <Button style={{ width: '90px', fontSize: '14px' }} type='default' onClick={()=>{
                        location.hash = `/settlement/onlineDetail/${record.actualSummaryId}/${record.receiveFlag}/${record.settlementSummaryType}/${record.settlementSummaryId}`
                    }}>查看详情</Button>
                </Menu.Item>
                if(record.settlementSummaryType == 'PAYMENT_STATEMENT' && record.receiveFlag == 'N'){
                    opr = [detail,confirm]
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
                            </Menu>} placement='bottomLeft'>
                            <Button type='default' style={{ width: '100px', fontSize: '14px' }}>操作</Button>
                        </Dropdown>
                    </div>
                )
                
            }
        }];
        const paymentOptions = this.state.code.paymentTypes.map((item)=>{
            return  <Select.Option key={item.value}>{item.meaning}</Select.Option>
        });
        return(
            <div className={style.main} >
                <div>
                    <div>
                        <Form layout='inline' style={{ margin: '20px 0' }}>
                            <Form.Item>
                                {getFieldDecorator('settlePeriod')(
                                    <Input style={{ width: '150px' }} placeholder='结算期间' />
                                )
                                }
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('paymentCompanyName')(
                                    <Input style={{ width: '150px' }} placeholder='付款方' />
                                )}
                            </Form.Item>
                            <Form.Item style={{ marginRight: '-9px', float: 'right' }}>
                                <Button type="default" htmlType="submit" style={{ width: '140px', height: '40px', marginRight: '10px' }}onClick={this.res.bind(this)}>查询</Button>
                            </Form.Item>
                        </Form>
                        <Table rowKey='key'
                            dataSource={this.state.realList}
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
export default Form.create()(Online)
