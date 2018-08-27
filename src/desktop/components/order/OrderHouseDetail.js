import React  , { Component } from 'react';
import {Menu,Form, Row, Col, Input,Tabs,Table, Button,Icon,Modal} from 'antd';
import * as commonStyle from '../../styles/common.css';
import moment from 'moment';
import Modals from '../common/modal/Modal';
import * as service from '../../services/order';
import Download from '../common/Download';
//import * as service from '../../services/maxim';
import * as styles from '../../styles/common.css'
import * as styles2 from '../../styles/order.css'
import { getCode } from '../../services/code';
import CustomerLov from "../common/CustomerLov";
import Uploads from '../../components/common/Upload';
import { team } from '../../services/plan';
const TabPane = Tabs.TabPane;

const FormItem = Form.Item;
class  orderHouseDetail extends Component {
  constructor(props){
    super(props);
    this.state = {
     orderHouseDetail:[],
     codeList: {
        statusList: [],
        currencyList:[]
      },
     commissionList:[],
     visible:false,
     planList:[],
     record:{},
     reservationsFileId:'',//预订单
     contractFileId:'',//合同
     depositVoucherFileId:'',//定金
    }
  }
  componentWillMount() {
      //获取快码值
    const codeBody = {
        statusList: 'ORD.HOUSE_STATUS',//海外房产订单状态
        paymentStatus:'ORD.PAYMENT_PLAN.STATUS',//付款状态
        currencyList:'PUB.CURRENCY'//币种
      };
      getCode(codeBody).then((data)=>{
        this.setState({
          codeList: data
        });
      });
    service.fetchOrderDetail({orderId:this.props.orderId}).then((data)=>{
        if (data.success) {
          const orderHouseDetail = data.rows[0] || {};
          if (orderHouseDetail.currency) {
            this.state.codeList.currencyList.map((code) => {
              if (code.value == orderHouseDetail.currency) {
                orderHouseDetail.currencyMeaning = code.meaning;
                return;
              }
            });
          }
          orderHouseDetail.sysFiles.map((index) =>{
            if(index.fileId == orderHouseDetail.reservationsFileId){
              this.setState({reservationsFileId:index.fileId})
            }
            if(index.fileId ==  orderHouseDetail.contractFileId){
              this.setState({contractFileId:index.fileId})
            }
            if(index.fileId == orderHouseDetail.depositVoucherFileId){
              this.setState({depositVoucherFileId:index.fileId})
            }
          })
          this.setState({orderHouseDetail: orderHouseDetail});

          //付款计划
          service.fetchOrderDetailordPlanList({ orderId: this.props.orderId }).then((data) => {
            if (data.success) {
              let row = data.rows;
              //已签预定单/需签合同/已签合同/购买成功等待过户/已过户
              if (this.state.orderHouseDetail.status == 'SIGNED_PRE-ORDER' ||
                this.state.orderHouseDetail.status == 'SIGNING_CONTRACT' ||
                this.state.orderHouseDetail.status == 'SIGNED_CONTRACT' ||
                this.state.orderHouseDetail.status == 'BUY_SUCCESS' ||
                this.state.orderHouseDetail.status == 'TRANSFERRED') {
                  this.setState({
                    planList: data.rows
                  })
              } else {
                row.map((item) => {
                  if (item.defaultDataFlag !== 'Y') {
                    this.setState({
                      planList: data.rows
                    })
                  }
                })
              }
            }
          })
        }
      });
    //佣金明细
    service.fetchOrderDetailordCommissionList({ orderId: this.props.orderId }).then((data) => {
        const cList = data.rows ? data.rows : [];
        cList.map((row, index) => {
            row.key = index;
        });
        this.setState({ commissionList: cList });
    });
  }

  lod(){
    location.hash = '/production/subscribe/FC/orderQuery/'+this.props.orderId
  }
  //查看日志
  orderShowLog(fields){
    let params = {orderId:this.props.orderId};
    service.fetchOrderDetailordStatusHisList(params).then((data)=>{
      const statusHisList = data.rows || [];
      this.setState({statusHisList: statusHisList});
      Modals.LogModel({List:this.state.statusHisList});
    });
  }
  personSelect(value){
    this.props.form.setFieldsValue(
      {person:value.value}
    )
  }
  //取消订单
  cancelOrder(){
    Modals.warning(this.orderCancel.bind(this),"您确定取消订单吗？");
  }
  orderCancel(flag){
    if(flag){
      let params = {};
      params.orderId = this.props.orderId;
      service.fetchCancelOrder(params).then((data) => {
        if (data.success) {
          Modals.success({
            title: '取消成功！'
          });
        } else {
          Modals.error({
            title: '提交失败！',
            content: `请联系系统管理员,${data.message}`,
          });
        }
      });
    }
  }
  //模态框提交
  modalSubmit(e){
    this.props.form.validateFields((err,values) =>{
      if(!err){
        this.setState({visible:false})
        let params = {};
        params.ordPaymentPlanId = this.state.record.ordPaymentPlanId;
        params.status = this.state.record.status;
        params.paymentVoucherFileId = values.payment[0].response.file.fileId
        service.fetchOrderDetailordPlanSubmit([params]).then((data) =>{
          if(data.success){
            Modals.success({title:'成功'});
            //付款计划
            service.fetchOrderDetailordPlanList({ orderId: this.props.orderId }).then((data) => {
              if (data.success) {
                this.setState({
                  planList: data.rows
                })
              }
            })
          }else{
            Modals.error({
              title: '提交失败！',
              content: `请联系系统管理员,${data.message}`,
            });
          }
        })
      }
    });
  }
  //确认付款
  confirm(record){
    this.setState({record,visible:true})
  }
  //关闭模态框
  onCancel(){
    this.setState({visible:false})
  }
  render() {
    //当订单状态为“预约中”“预约成功”时，订单详情页面右上角出现“取消预约”功能键
    let statusFalg = true;
    if(this.state.orderHouseDetail.status =='RESERVE_CANCELLED'||this.state.orderHouseDetail.status =='BUY_SUCCESS'){
      statusFalg = false;
    }
    const fields =this.state.mxDetail;
    const columns = [
      {
        title: '产品',
        dataIndex: 'itemName',
        key: 'itemName',
      }, {
        title: '佣金率',
        dataIndex: 'theFirstYear',
        key: 'theFirstYear',
        render: (text, record) => {
          if (text) {
            return Math.round(text*10000)/100+'%';
          } else {
            return '';
          }
        }
      }, {
        title: '币种',
        dataIndex: 'currency',
        key: 'currency',
        render: (text, record, index) => {
          if (text) {
            return this.state.codeList.currencyList.map((item) =>
              item.value == record.currency ? <span key={item.value}>{item.meaning}</span> :''
            )
          } else {
            return "";
          }
        }
      },{
        title: '应派',
        dataIndex: 'firstYearAmount',
        key: 'firstYearAmount',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          } else {
            return '';
          }
        }
      },{
        title: '实派',
        dataIndex: 'firstYearActual',
        key: 'firstYearActual',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          } else {
            return '';
          }
        }
      }];
    const columns1 = [
      {
        title:'付款类型',
        dataIndex: 'paymentType',
        key: 'paymentType',
      },{
        title:'百分比',
        dataIndex: 'percentage',
        key: 'percentage',
        render:(text, record)=>{
          return <span>{((record.percentage)*100).toFixed(2) + `%`}</span>
        }
      },{
        title:'付款币种',
        dataIndex: 'paymentCurrency',
        key: 'paymentCurrency',
        render: (text, record, index) => {
          if (text) {
            return this.state.codeList.currencyList.map((item) =>
              item.value == record.paymentCurrency ? <span key={item.value}>{item.meaning}</span> :''
            )
          } else {
            return "";
          }
        }
      },{
        title:'应付金额',
        dataIndex: 'amountPayable',
        key: 'amountPayable',
      },{
        title:'付款截止日期',
        dataIndex: 'paymentDeadline',
        key: 'paymentDeadline',
        render:(text,record,index)=>{
          return (moment(record.paymentDeadline).format('YYYY-MM-DD'));
        }
      },{
        title:'状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record, index) => {
          if (text) {
            return this.state.codeList.paymentStatus.map((item) =>
              item.value == record.status ? <span key={item.value}>{item.meaning}</span> :''
            )
          } else {
            return "";
          }
        }
      },{
        title:'付款指引',
        dataIndex: 'paymentGuidanceFileId',
        key: 'paymentGuidanceFileId',
        render:(text,record,index)=>{
          if(record.sysFiles.length>0){
            return record.sysFiles.map((i) =>
              record.paymentGuidanceFileId == i.fileId ?
                <Download fileId={i.fileId}>
                  <Button type='default'>
                    <Icon type="download" style={{ color: '#d1b97f' }} />
                  </Button>
                </Download> : ''
          )
          }else{
            return ''
          }
        }
      },{
        title:'付款凭证',
        dataIndex: 'paymentVoucherFileId',
        key: 'paymentVoucherFileId',
        render:(text,record,index)=>{
          if(record.sysFiles.length>0){
            return record.sysFiles.map((i)=>
              record.paymentVoucherFileId == i.fileId?
                <Download fileId={i.fileId}>
                  <Button type='default'>
                    <Icon type="download" style={{ color: '#d1b97f' }} />
                  </Button>
                </Download>:''
            )
          }else{
            return ''
          }
        }
      },{
        title:'操作',
        dataIndex: 'operation',
        key: 'operation',
        render:(text,record)=>{
          return (
            <div>
                <span>
                  <a className={'confirmPay'} onClick={this.confirm.bind(this,record)} style={{color: '#d1b97f'}}>付款确认</a>
                </span>
              </div>
          )
        }
      }
    ]
    const { getFieldDecorator } = this.props.form;
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
    return (
      <div>
        <Form>
        <div style={{margin:'28px 12px',paddingBottom:'28px'}}>
          <span className={commonStyle.iconL}></span>
          <span className={commonStyle.iconR}>订单详情<span style={{fontSize:'18px'}}>(订单编号：{this.state.orderHouseDetail.orderNumber})</span></span>
          {statusFalg&&
            <span  style={{float:'right'}}>
            <Button type='default' style={{ marginLeft: 8 ,fontSize:'16px',height:'40px',width:'140px',fontWeight:'normal'}} onClick={this.cancelOrder.bind(this)}>
              取消预约
            </Button>
          </span>
          }
        </div>
        <div style={{marginTop:'28px'}}>
          <Row gutter={40} >
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span style={{ color:JSON.parse(localStorage.theme).themeColor }}>订单状态</span>} className={styles.formitem_sty} style={{ fontSize: '16px' }}>
                  {
                    this.state.codeList.statusList.map((code, index) => {
                      if (this.state.orderHouseDetail.status == code.value) {
                        return <span style={{ color: JSON.parse(localStorage.theme).themeColor, fontSize: '16px' }} key={index}>{code.meaning}</span>
                      }
                    })
                  }
                </FormItem>

            </Col>
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}} label="状态跟进">
                {getFieldDecorator('orderStatusFollow', {})(
                  <Button type='primary' onClick={this.orderShowLog.bind(this,fields)} style={{fontSize:'16px',height:'35px',width:'60%',fontWeight:'normal'}} >订单日志状态跟进</Button>

                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40} >
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>产品名称</span>}>
                {getFieldDecorator('orderName',{
                  initialValue:this.state.orderHouseDetail.itemName?this.state.orderHouseDetail.itemName:''
                })(
                  <Input readOnly={true}  style={{height:'40px',fontSize:'16px'}}/>
                )}
              </FormItem>
            </Col>
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>子产品</span>}>
                {getFieldDecorator('sublineItemName',{
                  initialValue:this.state.orderHouseDetail.sublineItemName?this.state.orderHouseDetail.sublineItemName:''
                })(
                  <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40} >
              <Col span={11} style={{ paddingLeft: '0', paddingRight: '0' }}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>币种</span>}>
                  {getFieldDecorator('currency', {
                    initialValue: this.state.orderHouseDetail.currencyMeaning || ''
                  })(
                    <Input readOnly={true} style={{ height: '40px', fontSize: '16px' }} />
                    )}
                </FormItem>
            </Col>
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>成交金额</span>}>
                {getFieldDecorator('policyAmount',{
                  initialValue:this.state.orderHouseDetail.policyAmount?this.state.orderHouseDetail.policyAmount:''
                })(
                  <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40} >
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>客户</span>}>
                {getFieldDecorator('applicant',{
                  initialValue:this.state.orderHouseDetail.applicant?this.state.orderHouseDetail.applicant:''
                })(
                  <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                )}
              </FormItem>
            </Col>
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>渠道</span>}>
                {getFieldDecorator('channelName',{
                  initialValue:this.state.orderHouseDetail.channelName?this.state.orderHouseDetail.channelName:''
                })(
                  <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                )}
              </FormItem>
            </Col>
          </Row>
        </div>

        <div style={{margin:'28px 12px',paddingBottom:'28px',borderBottom:'1px solid #dbdbdb'}}>
          <span className={commonStyle.iconL}></span>
          <span className={commonStyle.iconR}>时间信息</span>
        </div>
        <div style={{marginTop:'28px'}}>
          <Row gutter={40} >
            <Col span={11} style={{marginTop:'20px'}} >
              <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>提交时间</span>}>
                {getFieldDecorator('submitDate', {
                  initialValue:this.state.orderHouseDetail.submitDate?this.state.orderHouseDetail.submitDate:''
                })(
                  <Input size="large" style={{width:'100%',height:'40px',fontSize:'16px'}}  readOnly={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={11} style={{marginTop:'20px'}} >
              <FormItem {...formItemLayout}  label={<span className={styles2.item_font_form}>意向考察时间</span>}>
                {getFieldDecorator('inspectDate', {
                  initialValue:this.state.orderHouseDetail.vistitsTimeStart&&this.state.orderHouseDetail.vistitsTimeTo
                  ?this.state.orderHouseDetail.vistitsTimeStart+'至'+this.state.orderHouseDetail.vistitsTimeTo:''
                })(
                  <Input size="large" style={{width:'120%',height:'40px',fontSize:'16px'}} readOnly={true}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={11} style={{marginTop:'20px'}} >
              <FormItem {...formItemLayout}  label={<span className={styles2.item_font_form}>签约日期</span>}>
                {getFieldDecorator('signedDate', {
                  initialValue:this.state.orderHouseDetail.issueDate?moment(this.state.orderHouseDetail.issueDate).format('YYYY-MM-DD'):''
                })(
                  <Input size="large" style={{width:'100%',height:'40px',fontSize:'16px'}} readOnly={true}/>
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
        <div style={{margin:'28px 12px',paddingBottom:'28px',borderBottom:'1px solid #dbdbdb'}}>
          <span className={commonStyle.iconL}></span>
          <span className={commonStyle.iconR}>附件</span>
        </div>
        <div>
            {/* 需签预订单 */}
            <Row gutter={40}>
              <Col span={11} style={{ marginTop: '20px' }} >
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>预订单</span>}>
                  {getFieldDecorator('advanceOrder', {
                  })(
                    <div>
                    {
                      this.state.reservationsFileId?
                      <Download fileId={this.state.reservationsFileId}>
                        <Button type='default'>
                          <Icon type="download" style={{ color: '#d1b97f'}} />
                        </Button>
                      </Download>:
                         <Button type='default' className={'ban'}>
                          <Icon type="download"/>
                         </Button>
                      }
                    </div>
                    )}
                </FormItem>
              </Col>
            </Row>
            {/* 需签合同 */}
            <Row gutter={40}>
              <Col span={11} style={{ marginTop: '20px' }} >
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>合同</span>}>
                  {getFieldDecorator('pact', {
                  })(
                    <div>
                      {
                        this.state.contractFileId?
                        <Download fileId={this.state.contractFileId}>
                          <Button type='default'>
                          <Icon type="download" style={{ color: '#d1b97f'}} />
                        </Button>
                        </Download>:
                        <Button type='default' className={'ban'}>
                          <Icon type="download"/>
                         </Button>
                      }
                    </div>
                    )}
                </FormItem>
              </Col>
            </Row>
        </div>
        <div style={{margin:'30px 14px 0px 12px'}}>
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="预约确认信息" key="1">
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>联系人</span>}>
                        {getFieldDecorator('contactPerson',{
                        initialValue:this.state.orderHouseDetail.contactPerson?this.state.orderHouseDetail.contactPerson:''
                        })(
                        <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>联系电话</span>}>
                    {getFieldDecorator('contactPhone',{
                      initialValue:this.state.orderHouseDetail.contactPhone?this.state.orderHouseDetail.contactPhone:''
                    })(
                      <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>见面地址</span>}>
                    {getFieldDecorator('investorAddress',{
                      initialValue:this.state.orderHouseDetail.meetAddress?this.state.orderHouseDetail.meetAddress:''
                    })(
                      <Input readOnly={true} style={{height:'40px',fontSize:'16px',width:'200%'}}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="佣金明细" key="2">
              <div className={styles.item_div} style={{marginTop:"20px",marginBottom:"30px"}}>
                <div className={styles.order_table} style={{marginTop:"20px",marginBottom:"30px"}}>
                  <Table
                  columns={columns}
                  bordered
                  dataSource={this.state.commissionList}
                  scroll={{ x: '100%' }}
                  pagination={false} />
                </div>
              </div>
            </TabPane>
            <TabPane tab="预约资料" key="3" tab={<span onClick={this.lod.bind(this)}>预约资料</span>}>
            </TabPane>
            <TabPane tab="付款计划" key="4">
                <Row gutter={40}>
                  <Col span={11} style={{ marginTop: '20px' }} >
                  {/* 状态：已付定金 */}
                  {
                      < FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>定金</span>}>
                        {getFieldDecorator('earnest', {
                        })(
                          <div>
                          <span style={{ marginLeft: '50px' }}>
                            {this.state.orderHouseDetail.houseDeposit}
                            {this.state.codeList.currencyList.map((item) =>
                              item.value == this.state.orderHouseDetail.houseCurrency
                               ? item.meaning : ''
                            )}
                          </span>
                          {this.state.orderHouseDetail.depositVoucherFileId?
                            <Download fileId={this.state.orderHouseDetail.depositVoucherFileId}>
                              <Button type='default' style={{marginLeft:'50px'}}>
                                <Icon type="download" style={{ color: '#d1b97f' }} />
                              </Button>
                            </Download>
                            :''
                          }
                          </div>
                          )}
                      </FormItem>
                  }
                  </Col>
                </Row>
                <div className={styles.item_div} style={{marginTop:"20px",marginBottom:"30px"}}>
                  <div className={styles.order_table} style={{ marginTop: "20px", marginBottom: "30px" }}>
                    <Table
                      columns={columns1}
                      bordered
                      dataSource={this.state.planList}
                      scroll={{ x: '100%' }}
                      pagination={false} />
                  </div>
                </div>
            </TabPane>
          </Tabs>
        </div>
          <Modal
            title={'付款确认'}
            width={600}
            style={{ top: 200 }}
            maskClosable={false}
            closable={true}
            footer={null}
            visible={this.state.visible}
            onCancel={this.onCancel.bind(this)} 
            className={styles2.houseModal}
          >
            <Form>
              <div style={{padding:'10px' , margin:'15px 25px 10px 25px'}}>
                <FormItem {...formItemLayout} label="付款凭证" >
                  {getFieldDecorator('payment', {
                    rules: [
                      { required: true, message: '请选择付款凭证', whitespace: true ,type:'array'}
                    ],
                  })(
                    <Uploads fileNum={1} modularName='PRD'>
                      <Button type="primary">请选择附件</Button>
                    </Uploads>
                    )}
                </FormItem>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '20px',marginLeft:'190px' }}>
                <Button onClick={this.onCancel.bind(this)} type="default" style={{ width: '120px', height: '38px' }} >取消</Button>
                <Button onClick={this.modalSubmit.bind(this)} type="primary" style={{ width: '120px', height: '38px' , marginLeft:'32px' }} >确定</Button>
              </div>
            </Form>
          </Modal>
        </Form>
      </div>
    );
  }
}

export default Form.create()(orderHouseDetail);
