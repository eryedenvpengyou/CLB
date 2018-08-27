/*
 * show 付款对账单详情
 * @author:zhouting
 * @version:20180426
 */
import React from 'react';
import { connect } from 'dva';
import { Form,Button,Table,Input,Dropdown,Menu,Modal,Badge} from 'antd';
import { handleTableChange } from '../../utils/table';
import * as service from '../../services/settlement';
import * as serChannel from '../../services/channel';
import * as codeService from '../../services/code';
import Modals from '../common/modal/Modal';
import SignModal from './SignModal';
import style from '../../styles/settlement.css';
class PaymentDetail extends React.Component{
    state = {
        expand:false
    }
    constructor(props){
        super(props);
        this.state={
            dataList:[], 
            code: {},
            remark:'',
            record:{},
            visible:false,
            signVisible:false,
            infoList:[],
            bdFlag:false
        }
    }
    componentDidMount(){
        let params = {
            paymentCurrency :'PUB.CURRENCY',
            paymentTypes :'FET.PAYMENT_TYPE',
        }
        codeService.getCode(params).then((data)=>{
            this.setState({code:data})
        });
        this.query();
        this.refer();
    }
    query(){
        service.queryFetSettlement({settlementSummaryId:this.props.settlementSummaryId}).then(data=>{
            if(data.success){
                this.setState({dataList:data.rows});
            }
        });
    }
    refer(){
        //查询付款人收款人信息
        service.summaryQuery({settlementSummaryId:this.props.settlementSummaryId}).then((data)=>{
            if(data.success){
                this.setState({infoList:data.rows[0]});
                if(data.rows[0].status == 'CONFIRMING' || data.rows[0].status == 'ASKING' ||data.rows[0].status == 'CANCELLED' ){
                    document.getElementsByClassName('top')[0].style.display = 'none'
                }
                if(data.rows[0].questionId !== null){
                    //查询问题反馈角标
                    let info = this.state.infoList;
                    let bdParams = {
                        paymentCompanyId: info.paymentCompanyId,
                        receiveCompanyId: info.receiveCompanyId,
                        channelId: info.receiveCompanyId,
                        checkPeriod: info.periodName,
                        settlementSummaryId: info.settlementSummaryId
                    }
                    serChannel.fetchFeedback(bdParams).then((data) => {
                        if (data.success) {
                            if (!data.rows[0].lines[data.rows[0].lines.length - 1].isRight) {
                                this.setState({ bdFlag: true })
                            }
                        }
                    })
                }
            }
        })
    }
    operate(action,record,index){
        switch(action){
            case 'edit':
                record.__status = 'update';
                this.props.form.resetFields();
                this.setState({visible:true,record})
                break;
            case 'delete':
                Modals.warning(this.onDelete.bind(this,record),{ content: '确定删除吗？' });
                break;
        }
    }
    //取消备注弹框
    onCancel(){
        this.setState({visible:false})
    }
    //提交备注
    submit(){
        this.state.dataList.map((item) => {
            if (item.payId == this.state.record.payId) {
                if (item.factPayDiffer !== this.props.form.getFieldValue("factPayDiffer")) {
                    let record = this.state.record;
                    record.factPayDiffer = this.props.form.getFieldValue("factPayDiffer");
                    service.submit([record]).then((data) => {
                        if (data.success) {
                            Modals.success({ content: data.message })
                            this.query();
                            this.refer();
                        } else {
                            Modals.error({ content: data.message })
                        }
                    })
                }
            }
        })
        this.setState({ visible: false });
    }
    //删除
    onDelete(record,flag){
        if(flag){
            service.remove([record]).then((data)=>{
                if(data.success){
                    Modals.success({ content: data.message })
                    this.query();
                    this.refer();
                }else{
                    Modals.error({content:data.message})
                }
            })
        }
    }
    //签单费、刷卡费
    add(){
        this.setState({signVisible:true});
        this.props.form.resetFields();
    }
    callback(record){
        this.setState({signVisible:false});
        if(record.paymentType){
            record.settlementSummaryId = this.props.settlementSummaryId
            record.__status = 'add';
            record.orderId = record.orderNumber ? record.orderNumber.value:''
            record.orderNumber = record.orderNumber ? record.orderNumber.meaning:''
            service.submit([record]).then((data)=>{
                if(data.success){
                    Modals.success({ content: data.message });
                    this.query();
                    this.refer();
                }else{
                    Modals.error({content:data.message})
                }
            })
        }
    }
    //付款确认
    confirmed(){
        service.confirmed({settlementSummaryId:this.props.settlementSummaryId}).then((data)=>{
            if(data.success){
                Modals.success({ content: data.message });
                setTimeout(() => {
                    location.hash='/settlement/check/2'
                }, 3000);
            }else{
                Modals.error({content:data.message})
            }
        })
    }
    //审核完成
    changeStatus(){
        service.changeStatus([{settlementSummaryId:this.props.settlementSummaryId,status:'CONFIRMING'}]).then((data)=>{
            if(data.success){
                Modals.success({ content: data.message });
                setTimeout(() => {
                    location.hash='/settlement/check/2'
                }, 3000);
            }else{
                Modals.error({content:data.message})
            }
        })
    }
    //取消
    cancel(flag){
        if(flag){
            service.cancel({settlementSummaryId:this.props.settlementSummaryId}).then((data)=>{
                if(data.success){
                    Modals.success({ content: data.message });
                    document.getElementsByClassName('off')[0].style.display = 'none';
                    if(document.getElementsByClassName('done')[0]){
                        document.getElementsByClassName('done')[0].style.display = 'none';
                    }
                    document.getElementsByClassName('top')[0].style.display = 'none'
                    this.query();
                    this.refer();
                }else{
                    Modals.error({content:data.message})
                }
            })
        }
    }
    off(){
        Modals.warning(this.cancel.bind(this),{ content: '确定取消该对账单吗？' });
    }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: {span: 24},
              sm: {span: 7},
            },
            wrapperCol: {
              xs: {span: 20},
              sm: {span: 12},
            },
          }
          
        const record = this.state.infoList
        const columns = [ {
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
            key: 'name',
            dataIndex: 'name'
        },{
            title: '产品名称',
            key: 'itemName',
            dataIndex: 'itemName'
        },{
            title: '订单币种',
            key: 'orderCurrency',
            dataIndex: 'orderCurrency',
            render:(text)=>{
                if(text && this.state.code.paymentCurrency){
                    for(let i in this.state.code.paymentCurrency){
                        if(text == this.state.code.paymentCurrency[i].value){
                            return this.state.code.paymentCurrency[i].meaning
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
            render:(text,record)=>{
                return record.paymentType == 'QDF' || record.paymentType == 'SKF'?
                '': (text*100).toFixed(2)+'%'
            }
        }, {
            title: '汇率',
            key: 'exchangeRate',
            dataIndex: 'exchangeRate'
        }, {
            title: '应付总额（结算币种）',
            key: 'exchangeRateAmount',
            dataIndex: 'exchangeRateAmount',
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '实付金额（结算币种）',
            key: 'factPaySettlement',
            dataIndex: 'factPaySettlement',
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '本期结算金额（结算币种）',
            key: 'unpaidSettlement',
            dataIndex: 'unpaidSettlement',
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '备注',
            key: 'factPayDiffer',
            dataIndex: 'factPayDiffer',
        }];
        if(record.status !== 'CONFIRMING' && record.status !== 'ASKING' && record.status !== 'PAID' ){
            columns.push({
                title: '操作',
                key:'operate',
                dataIndex:'operate',
                width: '140px',
                render:(text,record)=>{
                    return <div>
                        <Dropdown
                            overlay = {
                                <Menu>
                                    <Menu.Item>
                                        <Button style={{ width: '100px', fontSize: '14px' }} type='default' onClick={this.operate.bind(this,'edit',record)}>编辑</Button>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Button style={{ width: '100px', fontSize: '14px' }} type='default' onClick={this.operate.bind(this,'delete',record)}>删除</Button>
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
        return(
            <div className={style.main} >
                <div>
                    <div>
                        {
                                record.status == 'PAID' ?
                                '': 
                                <Form className='top' layout='inline' style={{ margin: '20px 0' }}>
                                    <Form.Item>
                                        <Button type='primary' style={{ fontSize: '20px', width: '120px', height: '40px' }} onClick={() => location.hash = `/settlement/paymentNew/${this.props.settlementSummaryId}`}>添加</Button>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type='default' style={{ fontSize: '20px', width: '200px', height: '40px' }} onClick={this.add.bind(this)}>添加签单费/刷卡费</Button>
                                    </Form.Item>
                                </Form>
                        }
                        <Table rowKey='key'
                            dataSource={this.state.dataList}
                            columns={columns}
                            bordered
                            scroll={{x:'150%'}}
                        />
                        <div style={{ clear: 'both', width: '100%', textAlign: 'center', padding: '30px' }}>
                            {
                                record.status == 'NEW' || record.status == 'APRROVING'?
                                <Button type='primary' className='done' style={{ width: '120px', height: '40px' }} onClick={this.changeStatus.bind(this)}>审核完成</Button>:
                                record.status == 'CONFIRMED'?
                                <Button type='primary' style={{ width: '120px', height: '40px' }} onClick={this.confirmed.bind(this)}>付款确认</Button>:
                                ''   
                            }
                            {
                                record.status == 'CONFIRMING'|| 
                                record.status == 'NEW' || 
                                record.status == 'APRROVING'||
                                record.status == 'CONFIRMED' ||
                                record.status == 'ASKING'?
                                <Button type='default' className='off' style={{ width: '120px', height: '40px', marginLeft: '65px' }} onClick={this.off.bind(this)}>取消对账单</Button>
                                :''
                            }
                            {
                                record.questionId !== null ?
                                    <Badge dot = {this.state.bdFlag}>
                                        <Button type='default'
                                            style={{ width: '120px', height: '40px', marginLeft: '65px' }}
                                            onClick={() => location.hash = `/channel/checkFeedback/${record.periodName.replace(/\//g, "%2F")}/${record.paymentCompanyType}/${record.receiveCompanyType}/${record.paymentCompanyId}/${record.receiveCompanyId}/${record.paymentCompanyName}/${record.receiveCompanyName}/${record.settlementSummaryId}/${record.status}/${record.receiveFlag}/${record.questionId}/2`}>问题反馈
                                    </Button>
                                    </Badge> : ''
                            }
                        </div>
                        <Modal
                            title={'设置备注'}
                            width={600}
                            style={{ top: 200 }}
                            maskClosable={false}
                            closable={true}
                            footer={null}
                            visible={this.state.visible}
                            onCancel={this.onCancel.bind(this)}
                            className={style.modal}
                        >
                            <Form>
                                <div style={{ padding: '10px', margin: '15px 25px 10px 25px' }}>
                                    <Form.Item {...formItemLayout} label="备注" >
                                        {getFieldDecorator('factPayDiffer', {
                                            rules: [
                                                { message: '请输入备注', whitespace: true }
                                            ],
                                            initialValue:this.state.record.factPayDiffer || ''
                                        })(
                                            <Input />
                                            )}
                                    </Form.Item>
                                </div>
                                <div style={{ textAlign: 'center', marginBottom: '20px', marginLeft: '25px' }}>
                                    <Button onClick={this.onCancel.bind(this)} type="default" style={{ width: '120px', height: '38px' }} >取消</Button>
                                    <Button onClick={this.submit.bind(this)} type="primary" style={{ width: '120px', height: '38px', marginLeft: '32px' }} >确定</Button>
                                </div>
                            </Form>
                        </Modal>
                        <SignModal
                            visible={this.state.signVisible}
                            callback={this.callback.bind(this)}
                            form={this.props.form}
                        />
                    </div>              
                </div>
            </div>
        )
    }
}
export default Form.create()(PaymentDetail)