/*
 * show 我的实收
 * @author:zhouting
 * @version:20180428
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
import MyActTermMd from './MyActTermMd';
import * as codeService from "../../services/code";
import { handleTableChange } from '../../utils/table';
import style from '../../styles/settlement.css';
class MyReceipts extends React.Component{
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
            recParams: {
                receiveCompanyId: JSON.parse(localStorage.user).relatedPartyId,
                userId: JSON.parse(localStorage.user).userId,
                receiveCompanyType: JSON.parse(localStorage.user).userType
            },
            pagination:{}
        }
    }
    componentDidMount(){
        let params = {
            currencyTypes: 'PUB.CURRENCY',
        }
        codeService.getCode(params).then((data)=>{
            this.setState({code:data})
        })
        this.list()
    }
    //列表查询
    list(){
        service.receipt(this.state.recParams).then((data)=>{
            if(data.success){
                const pagination = this.state.pagination
                pagination.total = data.total
                this.setState({dataList:data.rows,pagination})
            }
        })
    }
    //查询
    res(){
        this.state.recParams.paymentCompanyName = this.props.form.getFieldValue('paymentCompanyName'),
        this.state.recParams.settlePeriod = this.props.form.getFieldValue('settlePeriod')
        this.state.recParams.page = 1
        service.receipt(this.state.recParams).then((data)=>{
            const pagination = this.state.pagination
            pagination.current = 1;
            pagination.total = data.total
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
                receiveCompanyId: JSON.parse(localStorage.user).relatedPartyId,
                receiveCompanyType: JSON.parse(localStorage.user).userType,
                paymentCompanyId:record.paymentCompanyName.split(',')[0],
                paymentCompanyType:record.paymentCompanyName.split(',')[1],
                settleCurrency:record.settleCurrency,
                settlePeriod:record.settlePeriod,
                settleDate:moment(record.settleDate).format('YYYY-MM-DD'),
                __status : "add" ,
                summaryType: "INCOME", 
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
                detailType:'INCOME',
                companyId:JSON.parse(localStorage.user).relatedPartyId,
                companyType:JSON.parse(localStorage.user).userType
            }
            let files = common.formatFile(this.props.form.getFieldValue('uploadFile'),true);
            if (files && files != 0) {
                uploadParams.fileId = files
                service.loadExcel(uploadParams).then((data)=>{
                    if(data.success){
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
                        Modals.error({content:data.message})
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
            title: '付款方名称',
            key: 'paymentCompanyName',
            dataIndex: 'paymentCompanyName'
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
            title: '实收金额（结算币种）',
            key: 'summaryAmount',
            dataIndex: 'summaryAmount',
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '收款日期',
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
                                <Menu.Item><Button style={{ width: '100px', fontSize: '14px' }} type='default' onClick={() => location.hash = `/settlement/myReceiptsDetail/${record.actualSummaryId}/${record.settleCurrency}/${record.settlementSummaryType}/${record.paymentCompanyId}/${record.paymentCompanyType}`}>查看详情</Button></Menu.Item>
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
                                <Menu.Item><Button style={{ width: '100px', fontSize: '14px' }} type='default' onClick={() => location.hash = `/settlement/myReceiptsDetail/${record.actualSummaryId}/${record.settleCurrency}/${record.settlementSummaryType}/${record.paymentCompanyId}/${record.paymentCompanyType}`}>查看详情</Button></Menu.Item>
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
            fileId:25089,
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
                                }
                                }>导入模板下载</Button>
                            </Form.Item>  
                            <Form.Item>
                                {getFieldDecorator('uploadFile', {
                                    rules: [
                                        { validator: common.vdFile.bind(this) }
                                    ],
                                    
                                })(
                                    <Uploads type={'default'} fileNum={1} text={'Excel导入'} style={{width:'150px',height:'40px',color:'#000'}} onChange={this.upload.bind(this)}/>
                                    )}
                            </Form.Item> 
                            <div style={{float:'right'}}>
                                <Form.Item>
                                {getFieldDecorator('paymentCompanyName')(
                                    <Input style={{ width: '150px' }} placeholder='付款方' />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('settlePeriod')(
                                         <Input style={{ width: '150px' }} placeholder='结算期间' />
                                    )
                                    }
                                </Form.Item>
                                <Form.Item style={{marginRight: '-9px' }}>
                                    <Button type="default" htmlType="submit" style={{ width: '140px', height: '40px', marginRight: '10px' }} onClick={this.res.bind(this)}>查询</Button>
                                </Form.Item>  
                            </div>
                        </Form>
                        <Table rowKey='key'
                            dataSource={this.state.dataList}
                            columns={columns}
                            bordered
                            onChange={handleTableChange.bind(this,service.receipt,this.state.recParams)}
                            pagination={this.state.pagination}
                        />
                        <MyActTermMd
                            visible={this.state.visible}
                            callback={this.callbackTerm.bind(this)}
                        />
                    </div>              
                </div>
            </div>
        )
    }
}
export default Form.create()(MyReceipts)