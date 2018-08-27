/*
 * show 我的实付详情
 * @author:zhouting
 * @version:20180502
 */
import React from 'react';
import { connect } from 'dva';
import { Form,DatePicker,Select,Button,Table,Input,Dropdown,Menu} from 'antd';
import * as service from '../../services/settlement';
import Modals from '../common/modal/Modal';
import * as codeService from "../../services/code";
import style from '../../styles/settlement.css';
import MyPayMd from './MyPayMd';
import MyPayTermMd from './MyPayTermMd';
class MyActuallyPaidDetail extends React.Component{
    state = {
        expand:false
    }
    constructor(props){
        super(props);
        this.state={
            code:{
                paymentTypes:[]
            },
            visible:false,
            dataList:[],
        }
    }
    componentDidMount(){
        let params = {
            paymentTypes :'FET.PAYMENT_TYPE',
            currencyTypes: 'PUB.CURRENCY',
        }
        codeService.getCode(params).then((data)=>{
            this.setState({code:data})
        })
        service.paymentDetail({actualSummaryId:this.props.actualSummaryId}).then((data)=>{
            if(data.success){
                this.setState({dataList:data.rows});
            }
        })
    }
    //查询
    res(){
        let payParams = {
            actualSummaryId:this.props.actualSummaryId,
            orderNumber:this.props.form.getFieldValue('orderNumber'),
            settleType:this.props.form.getFieldValue('settleType')
        }
        service.paymentDetail(payParams).then((data)=>{
            if(data.success){
                this.setState({dataList:data.rows})
            }
        })
    }
    open(type,record){
        switch(type){
            case 'new':
                record.__status = 'add';
                this.props.form.resetFields();
                this.setState({record:record,visible:true});
            break;
            case 'edit':
                record.__status = 'update';
                this.setState({visible:true},()=>{
                    this.setState({record:record})
                })
            break
        }
    }
    callback(record){
        let datas={};
        if(record.settleType){
            this.setState({ visible: false });
            let params = {};
            console.log(record)
            if(this.state.record.__status == 'add'){
                datas = record.orderId.record;
                params.exchangeRate = record.exchangeRate;
                params.currencyAmount = record.currencyAmount;
                params.paymentCompanyId =  datas?datas.paymentcompanyid:''
            }else if(this.state.record.__status == 'update'){
                datas = this.state.record;
                params.exchangeRate = record.exchangeRate;
                params.currencyAmount = record.currencyAmount;
                params.paymentCompanyId = datas.paymentcompanyid;
                params.actualId = datas.actualId;
            }
            params.detailType = 'PAY'
            params.actualSummaryId = this.props.actualSummaryId
            params.commissionId = datas?datas.commissionId:''
            params.itemId = record.itemId.value
            params.orderCurrency = record.orderCurrency
            params.orderId = record.orderId.value
            params.incomePayId = datas?datas.incomePayId:''
            params.orderAmount = record.orderAmount
            params.rate = parseFloat(record.rate)/100
            params.actualAmount = record.actualAmount
            params.settleType = record.settleType
            params.__status = this.state.record.__status
            params.comments = record.comments

            service.detailSubActual(params).then((data) => {
                if (data.success) {
                    Modals.success({ content: data.message });
                    service.paymentDetail({ actualSummaryId: this.props.actualSummaryId }).then((data) => {
                        this.setState({ dataList: data.rows })
                    })
                } else {
                    Modals.error({ content: data.message })
                }
            })
        }else{
            this.setState({visible:false,record:{}});
        }
    }
    //删除
    delete(record,flag){
        if(flag){
            service.detailDelActual([record]).then((data)=>{
                if(data.success){
                    Modals.success({ content: data.message });
                    service.paymentDetail({ actualSummaryId: this.props.actualSummaryId }).then((data) => {
                        this.setState({ dataList: data.rows })
                    })
                }else{
                    Modals.error({content:data.message})
                }
            })
        }
    }
    onDelete(record){
        Modals.warning(this.delete.bind(this,record),{ content: '确定删除吗？' });
    }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const columns = [{
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
        },{
            title: '保单/订单编号',
            key: 'orderNumber',
            dataIndex: 'orderNumber'
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
            title: '订单金额',
            key: 'orderAmount',
            dataIndex: 'orderAmount',
            render:(text,record)=>{
                return record.settleType == 'QDF' || record.settleType == 'SKF' ?
                    '' : text
            }
        }, {
            title: '费率',
            key: 'rate',
            dataIndex: 'rate',
            render:(text,record)=>{
                return record.settleType == 'QDF' || record.settleType == 'SKF' ?
                    '' : (text * 100).toFixed(2) + '%'
            }
        }, {
            title: '实付金额',
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
            title: '实付金额（结算币种）',
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
        if(this.props.settlementSummaryType !=='PAYMENT_STATEMENT'){
            columns.push({
                title: '操作',
                width:'140px',
                render:(text,record)=>{
                    return <div>
                        <Dropdown
                            overlay = {
                                <Menu>
                                    <Menu.Item>
                                        <Button style={{ width: '100px', fontSize: '14px' }} type='default' onClick={this.open.bind(this,'edit',record)}
                                        >编辑</Button>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Button style={{ width: '100px', fontSize: '14px' }} type='default' onClick={this.onDelete.bind(this,record)}
                                        >删除</Button>
                                    </Menu.Item>
                                </Menu>
                               
                            }placement='bottomLeft'
                        >
                        <Button type='default' style={{width:'110px',fontSize:'14px'}}>操作</Button>
                        </Dropdown>
                    </div>
                }
            })
        }
        let settleSel = [];
        this.state.dataList.map((item)=>{
            this.state.code.paymentTypes.filter(
                function(i){
                    if(i.value ==item.settleType){
                        return settleSel.push(i)
                    }
                }
            )
        })
        function thesame(arr) {
            //Set数据结构，它类似于数组，其成员的值都是唯一的
            return Array.from(new Set(arr)); // 利用Array.from将Set结构转换成数组
        }
       const paymentOptions =  thesame(settleSel).map((item)=>{
            return  <Select.Option key={item.value}>{item.meaning}</Select.Option>
        });
        return(
            <div className={style.main} >
                <div>
                    <div style={{overflow:'hidden'}}>
                        {
                            this.props.settlementSummaryType == 'PAYMENT_STATEMENT' ? '' :
                                <Button type='primary' style={{ width: '140px', height: '40px' }} onClick={this.open.bind(this, 'new', {})}>新建</Button>
                        }
                        <Form layout='inline' style={{float: 'right'}}>
                            <Form.Item>
                                {getFieldDecorator('settleType')(
                                    <Select showSearch allowClear placeholder="结算类型"
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
                            <Form.Item style={{ marginRight: '-9px' }}>
                                <Button type="default" htmlType="submit" style={{ width: '140px', height: '40px', marginRight: '10px' }}
                                    onClick={this.res.bind(this)}>查询</Button>
                            </Form.Item>  
                        </Form>
                    </div> 
                    <Table rowKey='key'
                        dataSource={this.state.dataList}
                        columns={columns}
                        bordered
                    //onChange={this.sortChange.bind(this)}
                    //pagination={this.state.pagination}
                    />
                    <MyPayMd
                        visible={this.state.visible}
                        callback={this.callback.bind(this)}
                        settleCurrency={this.props.settleCurrency}
                        receiveCompanyId={this.props.receiveCompanyId}
                        receiveCompanyType={this.props.receiveCompanyType}
                        record={this.state.record}
                    />             
                </div>
            </div>
        )
    }
}
export default Form.create()(MyActuallyPaidDetail)