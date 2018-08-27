/*
 * show 结算管理
 * @author:zhouting
 * @version:20180425
 */
import React from 'react';
import { connect } from 'dva';
import { Form,DatePicker,Select,Button,Table,Input,Icon} from 'antd';
import * as service from '../../services/settlement';
import * as codeService from "../../services/code";
import moment from 'moment';
import style from '../../styles/settlement.css';
import double from '../../styles/images/icon-double-right.png';
import icon4 from '../../styles/images/settlement/icon4.png';
import img4 from '../../styles/images/settlement/img4.png';
//获取当前月份天数
function mGetDate(year, month){
    var d = new Date(year, month, 0);
    return d.getDate();
}
const RangePicker = DatePicker.RangePicker;
class SettlementManage extends React.Component{
    state = {
        expand:false
    }
    constructor(props){
        super(props);
        this.state={
            code:{
                paymentTypes:[]
            },
            orderList:[],
            summaryList:[],
            realList:[],
            monthIncome:'',
            monthPay:'',
            locale:{}
        }
    }
    componentWillMount(){
        let settlementParams = {
            receiveCompanyType:JSON.parse(localStorage.user).userType,
            receiveCompanyId:JSON.parse(localStorage.user).relatedPartyId
        }
        //订单结算明细
        service.settleOrderDetail(settlementParams).then((data)=>{
            if(data.success && data.rows.length){
                this.setState({
                    locale:{emptyText:'请输入关键词进行查找~'}
                })
            }
        })
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
        let mouthParams={
            dueStartTime:new Date().getFullYear() + '-' + (new Date().getMonth() + 1)+'-'+'1'+' '+'00:00:00',
            dueEndTime:new Date().getFullYear() + '-' + (new Date().getMonth() + 1)+'-'+mGetDate(new Date().getFullYear(),(new Date().getMonth() + 1))+' '+'23:59:59',
            paymentCompanyType:JSON.parse(localStorage.user).userType,
            paymentCompanyId:JSON.parse(localStorage.user).relatedPartyId,
            settleFlag:'Y',
        }
        let payParams = {
            receiveCompanyId: JSON.parse(localStorage.user).relatedPartyId,
            userId: JSON.parse(localStorage.user).userId
        };
        let realParams ={
            receiveCompanyType:JSON.parse(localStorage.user).userType,
            receiveCompanyId:JSON.parse(localStorage.user).relatedPartyId,
            userId: JSON.parse(localStorage.user).userId
        }
        //本月应收未收应付未付
        service.queryMonthAmount(mouthParams).then((data)=>{
            if(data.success){
                this.setState({
                    monthIncome:data.rows[0].monthIncome.toFixed(2),
                    monthPay:data.rows[0].monthPay.toFixed(2)
                })
            }
        })
        //待处理对账单
        service.pendingQuery(payParams).then((data)=>{
            if(data.success){
                this.setState({summaryList:data.rows})
            }
        });

        //最近一笔实派
        service.realSent(realParams).then((data)=>{
            if(data.success){
                this.state.realList.push(data.rows[0])
            }
        });
    }
    search(){
        const values = this.props.form.getFieldsValue();
        if (values.rangePicker) {
            for (var i = 0; i < values.rangePicker.length; i++) {
              var start = values.rangePicker[0]._d.getFullYear() + '-' + (values.rangePicker[0]._d.getMonth() + 1) + '-' + values.rangePicker[0]._d.getDate();
              var end = values.rangePicker[1]._d.getFullYear() + '-' + (values.rangePicker[1]._d.getMonth() + 1) + '-' + values.rangePicker[1]._d.getDate();
            }
          }
        let settlementParams = {
            receiveCompanyType:JSON.parse(localStorage.user).userType,
            receiveCompanyId:JSON.parse(localStorage.user).relatedPartyId,
            paymentType:this.props.form.getFieldValue('paymentType'),
            applicantName:this.props.form.getFieldValue('applicantName'),
            orderNumber:this.props.form.getFieldValue('orderNumber'),
            dueStartTime:start,
            dueEndTime:end
        }
        //订单结算明细
        service.settleOrderDetail(settlementParams).then((data)=>{
            if(data.success){
                let datas = data.rows || [];
                let count = 1
                for(let i=0;i<datas.length-1;i++){
                    datas[i].count = 0;
                    datas[i].index = i;
                    if (datas[i].incomePayId == datas[i+1].incomePayId){
                        count ++;
                        if(i == datas.length -2){
                            datas[datas.length - count].count = count;
                            datas[datas.length - 1].count = 0;
                            datas[datas.length - 1].index = datas.length - 1;
                        }
                    }else{
                        datas[i + 1 - count].count = count;
                        count = 1;
                        datas[i+1].index = i + 1;
                        datas[i+1].count = count;
                    }
                }
                if(datas.length == 1){
                    datas[0].index = 0;
                    datas[0].count = count
                }
                this.setState({orderList:datas})
            }
        })
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        //订单结算明细查询
        const columns = [ 
            {
                title: '保单/订单编号',
                key: 'orderNumber',
                dataIndex: 'orderNumber',
                width: 150,
                fixed:'left',
                render: (text,record,index ) => {
                  if (index == record.index) {
                    return {
                      children: <a style={{color:'#d1b97f'}} onClick={()=>location.hash = '/order/OrderDetail/personal/'+record.orderId}>{text?text:'-'}</a>,
                      props: { rowSpan: record.count, },
                    };
                  }
                }
            },{
            title: '结算类型',
            key: 'paymentType',
            dataIndex: 'paymentType',
            width: 150,
            fixed:'left',
            render:(text,record,index)=>{
                if(text && this.state.code.paymentTypes){
                    for(let i in this.state.code.paymentTypes){
                        if(text == this.state.code.paymentTypes[i].value){
                            return {
                                children: text?this.state.code.paymentTypes[i].meaning:'-',
                                props: { rowSpan: record.count},
                            }
                        }
                    }
                }
                return ''
            }
        }, {
            title: '订单信息',
            key: 'orderDetail',
            dataIndex: 'orderDetail',
            width: 291,
            fixed:'left',
            render: (text,record,index ) => {
              if (index == record.index) {
                return {
                  children: text?text:'-',
                  props: { rowSpan: record.count, },
                };
              }
            }
        }, {
            title: '我的应收（HKD）',
            key: 'settleAmount',
            dataIndex: 'settleAmount',
            width: 250,
            render: (text,record,index ) => {
              if (index == record.index) {
                return {
                  children: text?text == 999999999 ?'暂无可换算汇率':text.toFixed(2):'-',
                  props: { rowSpan: record.count, },
                };
              }
            }
        }, {
            title: '我的实收（HKD）',
            key: 'factIncome',
            dataIndex: 'factIncome',
            width: 250,
            render: (text,record,index ) => {
              if (index == record.index) {
                return {
                  children: text?text == 999999999 ?'暂无可换算汇率':text.toFixed(2):record.receiveCompanyName?'0':'0',
                  props: { rowSpan: record.count, },
                };
              }
            }
        }, {
            title: '预计收款日',
            key: 'dueDate',
            dataIndex: 'dueDate',
            width: 150,
            render: (text,record,index ) => {
              if (index == record.index) {
                return {
                  children: text?(moment(text).format('YYYY-MM-DD')):'-',
                  props: { rowSpan: record.count, },
                };
              }
            }
        }, {
            title: '收款方',
            key: 'receiveCompanyName',
            dataIndex: 'receiveCompanyName',
            width: 150,
            render:(text)=>{
                return text?text:'-'
            }
        }, {
            title: '我的应付（HKD）',
            key: 'settlePay',
            dataIndex: 'settlePay',
            width: 250,
            render:(text)=>{
                return text?text == 999999999 ?'暂无可换算汇率':text.toFixed(2):'-'
            }
        }, {
            title: '我的实付（HKD）',
            key: 'factPay',
            dataIndex: 'factPay',
            width: 250,
            render:(text,record)=>{
                return text?text == 999999999 ?'暂无可换算汇率':text.toFixed(2):record.receiveCompanyName?'0':'-'
            }
        }];
        //待处理对账单
        const columns1 = [{
            title: '付款方',
            key: 'paymentCompanyName',
            dataIndex: 'paymentCompanyName',
            width: 150,
        },
        // {
        //     title: '收款方',
        //     key: 'receiveCompanyName',
        //     dataIndex: 'receiveCompanyName',
        //     width: 150,
        // },
        {
            title: '对账期间',
            key: 'periodName',
            dataIndex: 'periodName',
            width: 150,
        },{
            title: '结算币种',
            key: 'currency',
            dataIndex: 'currency',
            width: 150,
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
            key: 'amount',
            dataIndex: 'amount',
            width: 150,
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        },{
            title: '付款日期',
            dataIndex: 'settleDate',
            key: 'settleDate',
            width: 150,
            render:(text)=>{
                return moment(text).format("YYYY-MM-DD")
            }
          },{
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            width: 150,
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
        },{
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render:(text,record)=>{    
                return (
                    <div>
                        <span>
                            <a 
                             href={`/#/channel/checkDetail/${record.periodName.replace(/\//g, "%2F")}/${record.paymentCompanyType}/${record.receiveCompanyType}/${record.paymentCompanyId}/${record.receiveCompanyId}/${record.paymentCompanyName}/${record.receiveCompanyName}/${record.settlementSummaryId}/${record.status}/${record.receiveFlag}/${record.questionId}`}
                             className={'confirmPay'} 
                             style={{color:'rgb(209, 185, 127)' }}>查看详情</a>
                        </span>
                    </div>
                )
                
            }
        }];
        //最近一笔实派
        const columns2 = [{
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
            render:(text,record)=>{
                return (
                    <div>
                        <span>
                            <a 
                             href={`/#/settlement/onlineDetail/${record.actualSummaryId}/${record.receiveFlag}/${record.settlementSummaryType}/${record.settlementSummaryId}`}
                             className={'confirmPay'} 
                             style={{color:'rgb(209, 185, 127)' }}>查看详情</a>
                        </span>
                    </div>
                )
                
            }
        }];
        return (
            <div className={style.main}>
                <div className={style.part1}>
                    <div className={style.lf}>
                        <span>应收<br/>未收</span>
                        <div className={style.headInfo}>
                            <p>本月应收未收</p>
                            <h2>
                                {this.state.monthIncome}
                             <span>港币</span>
                            </h2>
                            <a href='/#/settlement/forecast/1'>
                                <img src={icon4}/>
                            </a>
                        </div>
                        <i></i>
                    </div>
                    <div className={style.rt}>
                        <span>应付<br/>未付</span>
                        <div className={style.headInfo}>
                            <p>本月应付未付</p>
                            <h2>
                            {this.state.monthPay}
                             <span>港币</span>
                            </h2>
                            <a href='/#/settlement/forecast/2'>
                                <img src={icon4}/>
                            </a>
                        </div>
                    </div>
                </div>
                <div className={style.part2}>
                    <div>
                        <p className={style.title}>订单结算明细查询</p>
                        <Form layout='inline'> 
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
                                    getFieldDecorator('applicantName')(
                                        <Input style={{ width: '150px' }} placeholder='投保人' />
                                    )
                                }
                            </Form.Item> 
                            <Form.Item>
                                {getFieldDecorator('rangePicker', {
                                })(
                                    <RangePicker style={{ width: '250px' }} placeholder={['预计收款日从','预计收款日至']}/>
                                    )}
                            </Form.Item>
                            <Form.Item style={{float:'right',marginRight:'-9px'}}>
                                <Button type="default" htmlType="submit" style={{width:'140px',height:'40px',marginRight:'10px'}} onClick={this.search.bind(this)}>查询</Button>
                            </Form.Item>   
                        </Form>
                        <Table
                            dataSource={this.state.orderList}
                            columns={columns}
                            bordered 
                            scroll={{ x: 1900 ,y:230}}
                            pagination={false}
                            locale={this.state.locale}
                        //onChange={this.sortChange.bind(this)}
                        //pagination={this.state.pagination}
                        />
                    </div>              
                </div>
                <div className={style.part3}>
                    <div className={style.frame}>
                        <p className={style.title}>待处理对账单</p>
                        <a href="/#/settlement/check/1" className={style.link}>查看更多>></a>
                        <Table
                            dataSource={this.state.summaryList}
                            columns={columns1}
                            scroll={{width:2000,y:85}}
                            pagination={false}
                            bordered
                        />
                        <p className={style.title}>最近一笔实派</p>
                        <a href="/#/settlement/online" className={style.link}>查看更多>></a>
                        <Table 
                            dataSource={this.state.realList}
                            columns={columns2}
                            pagination={false}
                            bordered
                        />
                    </div>
                </div>
                <div className={style.part4}>
                    <p className={style.title}>下线结算管理</p>
                    <div><img src={img4}/> </div>             
                    <div className={style.bgM}>
                        <a href="/#/settlement/check/1"><span style={{left:'24px'}}>对账单管理</span></a>
                        <a href="/#/settlement/myReceipts"><span style={{left:'33px'}}>我的实收</span></a>
                        <a href="/#/settlement/myActuallyPaid"><span style={{left:'33px'}}>我的实付</span></a>
                    </div>
                </div>
            </div>
        )
    }
}
export default Form.create()(SettlementManage)