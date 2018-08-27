/*
 * show 我的实付
 * @author:zhouting
 * @version:20180502
 */
import React from 'react';
import { connect } from 'dva';
import { Form,Button,Table,Input,Dropdown,Menu} from 'antd';
import { stringify } from 'qs';
import moment from 'moment';
import * as common from '../../utils/common';
import Uploads from '../../components/common/Upload';
import * as service from '../../services/settlement';
import Modals from '../common/modal/Modal';
import MyPayMd from './MyPayMd';
import MyPayTermMd from './MyPayTermMd';
import { handleTableChange } from '../../utils/table';
import * as codeService from "../../services/code";
import style from '../../styles/settlement.css';
class MyActuallyPaid extends React.Component{
    state = {
        expand:false
    }
    constructor(props){
        super(props);
        this.state={
            code:{},
            visible:false,
            dataList:[],
            record:{},
            errList:[],
            pagination:{},
            payParams : {
                paymentCompanyId:JSON.parse(localStorage.user).relatedPartyId,
                userId:JSON.parse(localStorage.user).userId,
                paymentCompanyType:JSON.parse(localStorage.user).userType
            }
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
        this.list()
    }
    //列表查询
    list(){
        service.payment(this.state.payParams).then((data)=>{
            const pagination = this.state.pagination;
            pagination.total = data.total
            this.setState({dataList:data.rows,pagination})
        })
    }
    //查询
    res(){
        this.state.payParams.receiveCompanyName = this.props.form.getFieldValue('receiveCompanyName');
        this.state.payParams.settlePeriod = this.props.form.getFieldValue('settlePeriod')
        this.state.payParams.page = 1;
        service.payment(this.state.payParams).then((data)=>{
            const pagination = this.state.pagination;
            pagination.total = data.total;
            pagination.current = 1;
            this.setState({dataList:data.rows,pagination})
        })
    }
    MyNew(){
        this.setState({visible:true})
    }
    callbackTerm(record){
        if(JSON.stringify(record) !== '{}'){
            this.setState({visible: false,record: record});
            let params = {
                paymentCompanyId: JSON.parse(localStorage.user).relatedPartyId,
                paymentCompanyType: JSON.parse(localStorage.user).userType,
                receiveCompanyId:record.receiveCompanyName.split(',')[0],
                receiveCompanyType:record.receiveCompanyName.split(',')[1],
                settleCurrency:record.settleCurrency,
                settlePeriod:record.settlePeriod,
                settleDate:moment(record.settleDate).format('YYYY-MM-DD'),
                __status : "add" ,
                summaryType: "PAY", 
            }
            service.listSubmit(params).then((data)=>{
                if(data.success){
                    Modals.success({ content: '保存成功，请在详情页面添加明细' });
                    this.list()
                }else{
                    Modals.error({content:data.message})
                }
            })
        }else{
            this.setState({visible:false});
        }
    }
    // //新建提交
    // callbackTerm(val,termRecord){
    //     if(val == 1){
    //         if(JSON.stringify(termRecord) !== '{}'){   
    //             this.setState({ termVisible: false });
    //             let datas = this.state.record
    //             let params = {
    //                 __status:'add',
    //                 paymentCompanyId:JSON.parse(localStorage.user).relatedPartyId,
    //                 paymentCompanyType:JSON.parse(localStorage.user).userType,
    //                 commissionId:datas.orderId.record?datas.orderId.record.commissionId:'',
    //                 itemId:datas.itemId.value,
    //                 orderCurrency:datas.orderCurrency,
    //                 orderId:datas.orderId.value,
    //                 incomePayId:datas.orderId.record?datas.orderId.record.incomePayId:'',
    //                 orderAmount:datas.orderAmount,
    //                 rate:parseFloat(datas.rate)/100 || '',
    //                 actualAmount:datas.actualAmount,
    //                 exchangeRate:datas.exchangeRate,
    //                 currencyAmount:datas.currencyAmount,
    //                 settleType:datas.settleType,
    //                 comments:datas.comments,
    //                 settleCurrency:datas.settleCurrency,
    //                 settlePeriod:termRecord.settlePeriod,
    //                 settleDate:moment(termRecord.settleDate).format('YYYY-MM-DD')
    //             }
    //             service.paymentSubmit(params).then((data)=>{
    //                 if(data.success){
    //                     Modals.success({ content: data.message });
    //                     this.list()
    //                 }else{
    //                     Modals.error({content:data.message})
    //                 }
    //             })
    //         }
    //     }else{
    //         this.setState({termVisible:false});
    //     }
    // }
    //删除
    delete(record,flag){
        if(flag){
            service.delActual([record]).then((data)=>{
                if(data.success){
                    Modals.success({ content: data.message });
                    this.list()
                }else{
                    Modals.error({content:data.message})
                }
            })
        }
    }
    onDelete(record){
        Modals.warning(this.delete.bind(this,record),{ content: '确定删除吗？' });
    }
    //上传
    upload(val){
        if(val.length){
            let uploadParams = {
                detailType:'PAY',
                companyId:JSON.parse(localStorage.user).relatedPartyId,
                companyType:JSON.parse(localStorage.user).userType
            }
            let files = common.formatFile(this.props.form.getFieldValue('uploadFile'),true);
            if (files && files != 0) {
                uploadParams.fileId = files
                service.loadExcel(uploadParams).then((data) => {
                    if (data.success) {
                        if (data.rows.filter((i) => i.status == 'false').length) {
                            this.setState({errList:data.rows.filter((i)=>i.status == 'false')})
                            this.state.errList.map((i)=>{
                                i.statusDate = '第'+i.id+'行',
                                i.description = i.errorMessage
                            })
                            Modals.LogModel({List:this.state.errList,title:'导入报错明细'})
                        } else {
                            Modals.success({ content: data.message });
                            setTimeout(() => {
                                location.reload()
                            }, 3000);
                        }
                    } else {
                        Modals.error({ content: data.message })
                    }
                })
            }
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
        const columns = [{
            title: '收款方名称',
            key: 'receiveCompanyName',
            dataIndex: 'receiveCompanyName'
        }, {
            title: '结算期间',
            key: 'settlePeriod',
            dataIndex: 'settlePeriod'
        }, {
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
        }, {
            title: '实付金额（结算币种）',
            key: 'summaryAmount',
            dataIndex: 'summaryAmount',
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
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
            render:(text,record,index)=>{
                if(record.settlementSummaryType == "PAYMENT_STATEMENT"){
                   return <div>
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item><Button style={{ width: '100px', fontSize: '14px' }} type='default' onClick={() => location.hash = `/settlement/myActuallyPaidDetail/${record.actualSummaryId}/${record.settleCurrency}/${record.settlementSummaryType}/${record.receiveCompanyId}/${record.receiveCompanyType}`}>查看详情</Button></Menu.Item>
                            </Menu>

                        } placement='bottomLeft'
                        >
                            <Button type='default' style={{ width: '110px', fontSize: '14px' }}>操作</Button>
                        </Dropdown>
                    </div>
                }else{
                    return <div>
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item><Button style={{ width: '100px', fontSize: '14px' }} type='default' onClick={() => location.hash = `/settlement/myActuallyPaidDetail/${record.actualSummaryId}/${record.settleCurrency}/${record.settlementSummaryType}/${record.receiveCompanyId}/${record.receiveCompanyType}`}>查看详情</Button></Menu.Item>
                                <Menu.Item><Button style={{ width: '100px', fontSize: '14px' }} type='default' onClick={this.onDelete.bind(this, record)}>删除</Button></Menu.Item>
                            </Menu>

                        } placement='bottomLeft'
                        >
                            <Button type='default' style={{ width: '110px', fontSize: '14px' }}>操作</Button>
                        </Dropdown>
                    </div>
                }
            }
        }];
        const params = {
            fileId:25088,
            access_token: localStorage.access_token,
        }
        return(
            <div className={style.main} >
                <div>
                    <div>
                        <Form layout='inline' style={{margin:'20px 0'}}>
                            <Form.Item>
                                <Button type='primary' style={{width:'150px',height:'40px'}} onClick={this.MyNew.bind(this)}>新建</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button type='default' style={{width:'150px',height:'40px'}} onClick={()=>{
                                    window.location.href = `/api/fms/sys/attach/file/detail?${stringify(params)}`
                                }}>导入模板下载</Button>
                            </Form.Item> 
                            <Form.Item>
                                {getFieldDecorator('uploadFile', {
                                    rules: [
                                        { validator: common.vdFile.bind(this) }
                                    ],

                                })(
                                    <Uploads type={'default'} fileNum={1} text={'Excel导入'} style={{width: '150px', height: '40px' }} onChange={this.upload.bind(this)} />
                                    )}
                            </Form.Item>  
                            <div style={{float:'right'}}>
                                <Form.Item>
                                    {getFieldDecorator('receiveCompanyName')(
                                        <Input style={{ width: '150px' }} placeholder='收款方' />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('settlePeriod')(
                                        <Input style={{ width: '150px' }} placeholder='结算期间' />
                                    )
                                    }
                                </Form.Item>
                                <Form.Item style={{marginRight: '-9px' }}>
                                    <Button type="default" htmlType="submit" style={{ width: '140px', height: '40px', marginRight: '10px' }}
                                    onClick={this.res.bind(this)}
                                    >查询</Button>
                                </Form.Item>  
                            </div>
                        </Form>
                        <Table rowKey='key'
                            dataSource={this.state.dataList}
                            columns={columns}
                            bordered
                            onChange={handleTableChange.bind(this, service.payment,this.state.payParams)}
                            pagination={this.state.pagination}
                        />
                        <MyPayTermMd
                            visible={this.state.visible}
                            callback={this.callbackTerm.bind(this)}
                        />
                    </div>              
                </div>
            </div>
        )
    }
}
export default Form.create()(MyActuallyPaid)