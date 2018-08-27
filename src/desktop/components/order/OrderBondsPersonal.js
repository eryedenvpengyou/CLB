import React from 'react';
import {Table, Form, Checkbox,Input,Row,Col, Button,Dropdown,Menu, Select, DatePicker,Tooltip,Icon,InputNumber,Modal,textarea} from 'antd';
import * as service from '../../services/order';
import * as codeService from '../../services/code';
import { handleTableChange } from '../../utils/table';
import * as styles from '../../styles/ordersummary.css';
import Modals from '../common/modal/Modal';
import {formatDay} from "../../utils/common";
import OrderBondsTab from './OrderBondsTab';

const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';


function formatCurrency(num) {
  if(typeof num == 'undefined' || num == null){
    return ''
  }else{
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
      num = "0";
    let sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    let cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10)
      cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
      num = num.substring(0,num.length-(4*i+3))+','+
        num.substring(num.length-(4*i+3));
    return (((sign)?'':'-') + num + '.' + cents);
  }
}

class OrderBondsPersonal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codeList:'',
      orderBy: [],
      pageSize: 20,
      page: 1,
      visible: false,
      orderList:{},
      cancelOrderId:'',
    };
  }

  //改变组件调用的方法
  componentWillReceiveProps(nextProps){
    this.state.orderBy = [];
    this.state.page = 1;
    if(this.props.key1 !== nextProps.key1){
      this.props.form.resetFields();
      let params = {
        dateType: 'RESERVE',
        orderType: 'BOND'
      };
      params.page = 1;
      params.pageSize = this.state.pageSize;
      service.fetchOrderPersonListService(params).then((data)=>{
        if(data.success){
          this.setState({
            orderList:data,
            page : 1
          });
        }
      });
    }
  }

  componentWillMount() {
    let params = {
      orderStatusList: 'ORD.BOND_STATUS',
    };
    codeService.getCode(params).then((data)=>{
      this.setState({
        codeList: data,
      });
    });

    let params1 = {
      dateType: 'RESERVE',
      orderType: 'BOND'
    };
    params1.page = 1;
    params1.pageSize = this.state.pageSize;
    service.fetchOrderPersonListService(params1).then((data)=>{
      if(data.success){
        this.setState({
          orderList:data,
          page : 1
        });
      }
    });
  }

  //全部
  handleReset = () =>{
    this.state.orderBy = [];
    this.state.page = 1;
    this.props.form.resetFields();
    this.handleSearch();
  }

  //搜索
  handleSearch = (e) => {
    this.state.orderBy = [];
    this.state.page = 1;
    let params = {};
    params.dateType = 'RESERVE';
    params.orderType = 'BOND';
    params.orderNumber = this.props.form.getFieldValue('itemPersonal');
    params.itemName =this.props.form.getFieldValue('applicantInsurantPersonal');
    params.status =this.props.form.getFieldValue('statusPersonal');
    params.person =this.props.form.getFieldValue('person');
    params.startDateActive = formatDay(this.props.form.getFieldValue('startDateActive'));
    params.endDateActive =formatDay(this.props.form.getFieldValue('endDateActive'));
    params.page = 1;
    params.pageSize = this.state.pageSize;
    service.fetchOrderPersonListService(params).then((data)=>{
      if(data.success){
        this.setState({
          orderList:data
        });
      }
    });
  }

  //分页
  tableChange(pagination, filters, sorter){
    let params = {};
    params.page = pagination.current;
    params.pageSize = pagination.pageSize;
    params.dateType = 'RESERVE';
    params.orderType = 'BOND';
    params.orderNumber = this.props.form.getFieldValue('itemPersonal');
    params.itemName =this.props.form.getFieldValue('applicantInsurantPersonal');
    params.status =this.props.form.getFieldValue('statusPersonal');
    params.person =this.props.form.getFieldValue('person');
    params.startDateActive = formatDay(this.props.form.getFieldValue('startDateActive'));
    params.endDateActive =formatDay(this.props.form.getFieldValue('endDateActive'));
    //查询排序
    if (sorter.field) {
      const orderByName = sorter.order.substr(0,sorter.order.indexOf("end"));
      if (this.state.orderBy.indexOf(sorter.field+" desc") != -1) {
        this.state.orderBy.splice(this.state.orderBy.indexOf(sorter.field+" desc"),1);
      } else if (this.state.orderBy.indexOf(sorter.field+" asc") != -1) {
        this.state.orderBy.splice(this.state.orderBy.indexOf(sorter.field+" asc"),1);
      }
      this.state.orderBy.splice(0,0,sorter.field+" "+orderByName);
    }
    let orderBy = this.state.orderBy || [];
    params.orderBy = this.state.orderBy.toString();
    service.fetchOrderPersonListService(params).then((data)=>{
      if(data.success){
        this.setState({
          orderList:data,
          page: pagination.current,
          orderBy
        });
      }
    });
  }

  //查看日志
  orderShowLog(record){
    service.fetchOrderDetailordStatusHisList({orderId:record.orderId}).then((data)=>{
      const statusHisList = data.rows || [];
      this.setState({statusHisList: statusHisList});
      Modals.LogModel({List:this.state.statusHisList})
    });
  }

  //跟进
  pendingOrder(record){
    service.fetchOrderDetailPendingList({orderId:record.orderId}).then((data)=>{
      if (data.success) {
        if (data.rows.length == 0) {
          Modals.error({content:'找不到订单对应的pending详情！'});
          return;
        } else {
          const pendingData = data.rows || [];
          location.hash = '#/orderPending/OrderPendingTrail/bonds/person/'+pendingData[0].orderId+'/'+pendingData[0].pendingId;
        }
      } else {
        Modals.error({content:data.message});
        return;
      }
    });
  }

  //查看详情/修改
  orderSelect(record){
    location.hash = `/order/orderBondsDetail/personal/${record.orderId}`;
  }

  orderUpdate(record){
    location.hash = `/production/subscribe/ZQ/order/${record.orderId}`;
  }

  //取消订单
  orderCancel(record){
    this.state.cancelOrderId = record.orderId;
    Modals.warning(this.cancelOrder.bind(this,record),"您确定取消订单吗？");
  }
  cancelOrder(record,flag){
    if(flag){
      service.updateOrderStatus([{orderId: this.state.cancelOrderId,status: "RESERVE_CANCELLED"}]).then((data)=>{
        if (data.success) {
          this.handleSearch();
        } else {
          Modal.error({
            title: '提交失败！',
            content: `请联系系统管理员,${data.message}`,
          });
        }
      });
    }
  }

  disabledStartDate = (startValue) => {
    const endValue = this.props.form.getFieldValue('endDateActive');
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }
  disabledEndDate = (endValue) => {
    const startValue = this.props.form.getFieldValue('startDateActive');
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  render(){
    const formItemLayout = {
      wrapperCol: { span: 24 },
    };
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const columns1 = [
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        width : '150px',
        render:(text, record)=>{
          return (
            <a onClick={this.orderSelect.bind(this, record)} style={{fontSize:'14px',color:'#d1b97f'}}>{record.orderNumber}</a>
          );
        }
      },{
        title: '产品信息',
        dataIndex: 'itemName',
      },{
        title: '年期',
        width : '64px',
        dataIndex: 'sublineItemName',
      },{
        title: '金额',
        dataIndex: 'policyAmount',
        width : '150px',
        sorter: true,
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{formatCurrency(record.policyAmount)}{record.currency}</span>
        }
      },{
        title: '客户',
        dataIndex: 'applicant',
        width : '74px',
      },{
        title: '渠道',
        dataIndex: 'channelName',
        width : '90px',
      }, {
        title: '预约时间',
        dataIndex: 'signDate',
        width : '145px',
        sorter: true,
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{(text||"").substr(0,16)}</span>
        }
      }, {
        title: '状态',
        width : '90px',
        dataIndex: 'statusDesc',
      }, {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width : '140px',
        render: (text, record, index) =>{
          let result = [];
          let select =  <Menu.Item key={index+'_1'}>
            <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.orderSelect.bind(this,record)}>查看订单</Button>
          </Menu.Item>;
          let update =  <Menu.Item key={index+'_2'}>
            <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.orderUpdate.bind(this,record)}>修改订单</Button>
          </Menu.Item>;
          let cancel =  <Menu.Item key={index+'_3'}>
            <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.orderCancel.bind(this,record)}>取消订单</Button>
          </Menu.Item>;
          let pending =  <Menu.Item key={index+'_4'}>
            <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.pendingOrder.bind(this,record)}>跟进订单</Button>
          </Menu.Item>;
          let log = <Menu.Item key={index+'_5'}>
            <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.orderShowLog.bind(this,record)}>查看日志</Button>
          </Menu.Item>;
          result.push(log);
          //跟进
          if ((record.status === 'PENDING' || record.status === 'PENDING_HANDLING' || record.status === 'PENDING_APPROVING' || record.status === 'WAITING_ISSUE' || record.status === 'ISSUE_SUCCESS' || record.status === 'RESERVE_CANCELLED') && record.countPending > 0) {
            result.push(pending);
          }
          // 取消预约
          if (record.status !== 'WAITING_ISSUE' && record.status !== 'ISSUE_SUCCESS' && record.status !== 'RESERVE_CANCELLED' ) {
            result.push(cancel);
          }
          // 修改
          if (record.status === 'NEED_REVIEW') {
            result.push(update);
          }
          return (
            <div>
              <Dropdown overlay={
                <Menu>
                  {
                    result.map((item)=>
                      item
                    )
                  }
                </Menu>
              }>
                <Button type='default' style={{fontSize:'14px', width: '110px'}}>
                  操作
                </Button>
              </Dropdown>
            </div>
          )
        }
      }
    ];
    const columns2 = [
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        width : '150px',
        render:(text, record)=>{
          return (
            <a onClick={this.orderSelect.bind(this, record)} style={{fontSize:'14px',color:'#d1b97f'}}>{record.orderNumber}</a>
          );
        }
      },{
        title: '产品信息',
        dataIndex: 'itemName',
      },{
        title: '年期',
        width : '64px',
        dataIndex: 'sublineItemName',
      },{
        title: '金额',
        dataIndex: 'policyAmount',
        width : '150px',
        sorter: true,
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{formatCurrency(record.policyAmount)}{record.currency}</span>
        }
      },{
        title: '客户',
        dataIndex: 'applicant',
        width : '74px',
      }, {
        title: '预约时间',
        dataIndex: 'signDate',
        width : '145px',
        sorter: true,
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{(text||"").substr(0,16)}</span>
        }
      }, {
        title: '状态',
        width : '90px',
        dataIndex: 'statusDesc',
      }, {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width : '140px',
        render: (text, record, index) =>{
          let result = [];
          let select =  <Menu.Item key={index+'_1'}>
            <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.orderSelect.bind(this,record)}>查看订单</Button>
          </Menu.Item>;
          let update =  <Menu.Item key={index+'_2'}>
            <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.orderUpdate.bind(this,record)}>修改订单</Button>
          </Menu.Item>;
          let cancel =  <Menu.Item key={index+'_3'}>
            <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.orderCancel.bind(this,record)}>取消订单</Button>
          </Menu.Item>;
          let pending =  <Menu.Item key={index+'_4'}>
            <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.pendingOrder.bind(this,record)}>跟进订单</Button>
          </Menu.Item>;
          let log = <Menu.Item key={index+'_5'}>
            <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.orderShowLog.bind(this,record)}>查看日志</Button>
          </Menu.Item>;
          result.push(log);
          //跟进
          if ((record.status === 'PENDING' || record.status === 'PENDING_HANDLING' || record.status === 'PENDING_APPROVING' || record.status === 'WAITING_ISSUE' || record.status === 'ISSUE_SUCCESS' || record.status === 'RESERVE_CANCELLED') && record.countPending > 0) {
            result.push(pending);
          }
          // 取消预约
          if (record.status !== 'WAITING_ISSUE' && record.status !== 'ISSUE_SUCCESS' && record.status !== 'RESERVE_CANCELLED' ) {
            result.push(cancel);
          }
          // 修改
          if (record.status === 'NEED_REVIEW') {
            result.push(update);
          }
          return (
            <div>
              <Dropdown overlay={
                <Menu>
                  {
                    result.map((item)=>
                      item
                    )
                  }
                </Menu>
              }>
                <Button type='default' style={{fontSize:'14px', width: '110px'}}>
                  操作
                </Button>
              </Dropdown>
            </div>
          )
        }
      }
    ];
    return(
        <div>
          <div>
            <Form>
              <Row>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout}  style={{fontSize:'16px'}}>
                    {getFieldDecorator('statusPersonal')(
                      <Select
                        showSearch
                        style={{width:'100%'}}
                        placeholder='状态'>
                        {
                          this.state.codeList.orderStatusList &&
                          this.state.codeList.orderStatusList.map((item)=>
                            <Option key={item.value} value={item.value}>{item.meaning}</Option>
                          )
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout} style={{marginBottom:'0', fontSize:'16px'}}>
                    {getFieldDecorator('itemPersonal')(
                      <Input placeholder="请输入订单编号" style={{width:'100%'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout} style={{marginBottom:'0'}}>
                    {getFieldDecorator('applicantInsurantPersonal')(
                      <Input placeholder="请输入公司名称" style={{width:'100%'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                </Col>
                <Col span={6}>
                  <Button style={{float:'right',backgroundColor:JSON.parse(localStorage.theme).themeColor,color:'white',fontSize:'20px',height:'40px',width : '140px'}} onClick={()=>location.hash = '#/production/subscribe/ZQ/orderAdd/ZQ'}>添加订单</Button>
                </Col>
              </Row>
              <Row>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout} style={{fontSize:'16px'}}>
                    {getFieldDecorator('startDateActive')(
                      <DatePicker
                        disabledDate={this.disabledStartDate}
                        placeholder="预约日期从"
                        format={dateFormat}
                        style={{width:'100%'}}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout} style={{fontSize:'16px'}}>
                    {getFieldDecorator('endDateActive')(
                      <DatePicker
                        disabledDate={this.disabledEndDate}
                        placeholder="预约日期至"
                        format={dateFormat}
                        style={{width:'100%'}}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout} style={{marginBottom:'0'}}>
                    {getFieldDecorator('person')(
                      <Input placeholder="请输入客户名称" style={{width:'100%'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <Button type='primary' onClick={this.handleReset} style={{ float:'right',marginLeft:'10px',fontSize:'20px',height:'40px',width : '140px',fontWeight:'normal'}}>
                    全部
                  </Button>
                  <Button type='default' onClick={this.handleSearch} style={{float:'right',fontSize:'20px',height:'40px',width : '140px',fontWeight:'normal'}}>查询</Button>
                </Col>
              </Row>
            </Form>
          </div>

          <div>
            <Table rowKey='orderId'
                   columns={JSON.parse(localStorage.user).userType == "ADMINISTRATION"?columns1:columns2}
                   dataSource={this.state.orderList.rows || []}
                   bordered
                   onChange={this.tableChange.bind(this)}
                   pagination={{
                     pageSizeOptions: ['5','10','20','50'],
                     pageSize: this.state.pageSize||20,
                     total:this.state.orderList.total || 0,
                     current: this.state.page||1,
                   }}/>
          </div>
        </div>
    );
  }
}

OrderBondsPersonal = Form.create()(OrderBondsPersonal);
export default OrderBondsPersonal;
