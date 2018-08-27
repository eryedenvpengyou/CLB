import React from 'react';
import {Table, Form, Checkbox,Input,Row,Col, Button,Dropdown,Menu,Pagination, Select, DatePicker,Tooltip,Icon,InputNumber,Modal,textarea} from 'antd';
import * as service from '../../services/order';
import * as codeService from '../../services/code';
import { handleTableChange } from '../../utils/table';
import * as styles from '../../styles/ordersummary.css';
import * as comStyles from '../../styles/common.css';
import Modals from '../common/modal/Modal';
import {formatDay} from "../../utils/common";

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

class OrderSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codeList: {
        orderStatusList: [],
      },
      orderBy: [],
      pageSize: 20,
      page: 1,
      visible: false,
      orderList:{},
    };
  }
  //改变组件调用的方法
  componentWillReceiveProps(nextProps){
    if(this.props.key1 !== nextProps.key1) {
      this.state.orderBy = [];
      let params = {
        page: 1,
        pageSize: 20,
        dateType: 'RESERVE',
        orderType: 'INSURANCE'
      };
      params.item = this.props.form.getFieldValue('item');
      params.applicant =this.props.form.getFieldValue('applicant');
      params.insurant =this.props.form.getFieldValue('applicant');
      params.status =this.props.form.getFieldValue('status');
      params.number =this.props.form.getFieldValue('number');
      params.startDateActive =formatDay(this.props.form.getFieldValue('startDateActive'));
      params.endDateActive =formatDay(this.props.form.getFieldValue('endDateActive'));

      service.fetchOrderPersonListService(params).then((data) => {
        if (data.success) {
          data.rows.map((row, index) => {
            row.key = index;
          });
          this.setState({
            orderList: data,
            page: 1,
          });
        }
      });
    }
  }

  componentWillMount() {
    let params = {
      orderStatusList: 'ORD.ORDER_STATUS',
    };
    codeService.getCode(params).then((data)=>{
      this.setState({
        codeList: data,
      });
    });

    const user = JSON.parse(localStorage.user||'{}');
    params = {
      page: 1,
      pageSize: 20,
      dateType: 'RESERVE',
      orderType: 'INSURANCE'
    };
    service.fetchOrderPersonListService(params).then((data)=>{
      if(data.success){
        data.rows.map((record, index) => {
          record.key = index;
          record.updateState = true;
          const total = new Date((record.reserveDate||'').replace(/-/g,'/')).getTime() - new Date().getTime();
          const hours = total/(3600*1000);
          var reserveDate2 = new Date((record.reserveDate||'').replace(/-/g,'/')).getTime()+100000000;
          //hours<=48 需要判断工作日来决定是否可以修改订单
          //hours>48 可以修改订单的
          if (hours <= 48) {
            // if (!this.isWeekday(reserveDate2,48,hours,record.productSupplierId,record.productSupplierName)._v) {
            //   record.updateState = false;
            // }
            record.updateState = false;
          }else if(record.status==="PRE_APPROVED"){
            record.updateState = true;
          }
        });
        this.setState({
          orderList:data,
        });
      }
    });
  }

  //全部
  allData(){
    this.state.orderBy = [];
    this.props.form.resetFields();
    this.clickSearch();
  }

  //搜索
  clickSearch(){
    this.state.orderBy = [];
    let params = {};
    const user = JSON.parse(localStorage.user||'{}');
    params.dateType = 'RESERVE';
    params.orderType = 'INSURANCE';
    params.item = this.props.form.getFieldValue('item');
    params.person =this.props.form.getFieldValue('person');
    params.status =this.props.form.getFieldValue('status');
    params.number =this.props.form.getFieldValue('number');
    params.startDateActive =formatDay(this.props.form.getFieldValue('startDateActive'));
    params.endDateActive =formatDay(this.props.form.getFieldValue('endDateActive'));
    params.page = 1;
    params.pageSize = this.state.pageSize;
    service.fetchOrderPersonListService(params).then((data)=>{
      if(data.success){
        data.rows.map((record, index) => {
          record.key = index;
          record.updateState = true;
          const total = new Date((record.reserveDate||'').replace(/-/g,'/')).getTime() - new Date().getTime();
          const hours = total/(3600*1000);
          var reserveDate2 = new Date((record.reserveDate||'').replace(/-/g,'/')).getTime()+100000000;
          //hours<0 说明预约时间已过，是不可以修改订单的
          // if (hours > 0) {
          //hours<=48 需要判断工作日来决定是否可以修改订单
          //hours>48 可以修改订单的
          if (hours <= 48) {
            // if (!this.isWeekday(reserveDate2,48,hours,record.productSupplierId,record.productSupplierName)._v) {
            //   record.updateState = false;
            // }
            record.updateState = false;
          }
          // }
        });
        this.setState({
          orderList:data,
          page: 1,
        });
      }
    });
  }

  //分页
  tableChange(pagination, filters, sorter){
    let params = {};
    params = {
      dateType: 'RESERVE',
      orderType: 'INSURANCE'
    };
    params.dateType = 'RESERVE';
    params.orderType = 'INSURANCE';
    params.item = this.props.form.getFieldValue('item');
    params.person =this.props.form.getFieldValue('person');
    params.status =this.props.form.getFieldValue('status');
    params.number =this.props.form.getFieldValue('number');
    params.startDateActive =formatDay(this.props.form.getFieldValue('startDateActive'));
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
    params.orderBy = this.state.orderBy.toString();
    params.page = pagination.current;
    params.pageSize = pagination.pageSize;
    service.fetchOrderPersonListService(params).then((data)=>{
      if(data.success){
        data.rows.map((record, index) => {
          record.key = index;
          record.updateState = true;
          const total = new Date((record.reserveDate||'').replace(/-/g,'/')).getTime() - new Date().getTime();
          const hours = total/(3600*1000);
          var reserveDate2 = new Date((record.reserveDate||'').replace(/-/g,'/')).getTime()+100000000;
          //hours<0 说明预约时间已过，是不可以修改订单的
          // if (hours > 0) {
          //hours<=48 需要判断工作日来决定是否可以修改订单
          //hours>48 可以修改订单的
          if (hours <= 48) {
            // if (!this.isWeekday(reserveDate2,48,hours,record.productSupplierId,record.productSupplierName)._v) {
            //   record.updateState = false;
            // }
            record.updateState = false;
          }
          // }
        });
        this.setState({
          orderList:data,
          page: pagination.current
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
          location.hash = '#/orderPending/OrderPendingTrail/insurance/person/'+pendingData[0].orderId+'/'+pendingData[0].pendingId;
        }
      } else {
        Modals.error({content:data.message});
        return;
      }
    });
  }

  //订单退保
  orderWithdraw(record){
    Modals.warning(this.withdrawOrder.bind(this, record),"您确定进行订单退保吗？");
  }
  withdrawOrder(record, flag){
    if (flag) {
      location.hash = '/after/AfterNew/EXIT/0/'+record.orderId;
    }
  }

  //查看详情/修改
  orderUpdate(record){
    location.hash = `/order/insurance/${record.orderId}`;
  }

  orderSelect(record){
    location.hash = `/order/orderDetail/personal/${record.orderId}`;
  }

  //取消订单
  orderCancel(record){
    Modals.message(this.cancelOrder.bind(this, record),"您确定取消订单吗？");
  }
  cancelOrder(record, flag, values){
    if (flag) {
      service.updateOrderStatus([{orderId: record.orderId,status: "CANCELLED",hisDesc: values.comments}]).then((data)=>{
        if (data.success) {
          Modals.success('提交成功！');
          this.clickSearch();
        } else {
          Modals.error(`请联系系统管理员,${data.message}`);
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
  /**
   * reserveDate2 预约时间，如果是非工作日，则需要加一天，知道是工作日为止
   * hour 允许相差的小时数
   * hours 当前时间和预约时间相差的小时数
   * productSupplierId 供应商ID
   * productSupplierName 供应商名称
   * return: true 可以修改
   *         false 不可以修改
   */
  // isWeekday(reserveDate2,hour,hours,productSupplierId,productSupplierName) {
  //   const body = {
  //     "supplierId": productSupplierId,
  //     "theYear": new Date(reserveDate2).getFullYear(),
  //     "theMonth": new Date(reserveDate2).getMonth()+1,
  //     "theDay": new Date(reserveDate2).getDate()
  //   }
  //   return service.isWeekday(body).then((dayData) => {
  //     if (dayData.success) {
  //       //-1：休息日，0：工作日
  //       if (dayData.code == '-1') {
  //         hours += 24;
  //         reserveDate2 += 100000000;
  //         this.isWeekday(reserveDate2,hour,hours,productSupplierId,productSupplierName);
  //       } else {
  //         if (hours > hour) {
  //           return true;
  //         } else {
  //           return false;
  //         }
  //       }
  //     } else {
  //       Modals.error({content: `请维护 ${productSupplierName} 的日历信息！`});
  //       return false;
  //     }
  //   });
  // }
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
        title: '产品(年期)',
        dataIndex: 'item',
      },{
        title: '投保人',
        dataIndex: 'applicant',
        width : '74px',
      },{
        title: '受保人',
        dataIndex: 'insurant',
        width : '74px',
      },{
        title: '渠道',
        dataIndex: 'channelName',
        width : '90px',
      },{
        title: '主险年缴保费',
        dataIndex: 'yearPayAmount',
        sorter: true,
        width : '150px',
        render(text, record) {
          return <span title="主险年缴保费" style={{fontSize:'14px'}}>{formatCurrency(record.yearPayAmount)}{record.currency}</span>
        }
      }, {
        title: '预约签单时间',
        dataIndex: 'reserveDate',
        width : '145px',
        sorter: true,
        render(text, record) {
          return <span title="预约签单时间" style={{fontSize:'14px'}}>{(record.reserveDate).substr(0,16)}</span>
        }
      }, {
        title: '状态',
        dataIndex: 'statusDesc',
        width : '108px',
        render(text, record) {
          if(record.statusDesc=='预审中'||record.statusDesc=='预审成功'){
            return <span style={{fontSize:'14px'}}>资料审核中</span>
          }else {
            return <span style={{fontSize:'14px'}}>{record.statusDesc}</span>
          }
        }
      }, {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width : '74px',
        render: (text, record, index) =>{
          let result = [];
          let select =  <Menu.Item key={index+'_1'}>
            <Button type='default' style={{fontSize:'14px',width:'90px',}} onClick={this.orderSelect.bind(this,record)}>查看订单</Button>
          </Menu.Item>;
          let update =  <Menu.Item key={index+'_2'}>
            <Button type='default' style={{fontSize:'14px',width:'90px',}} onClick={this.orderUpdate.bind(this,record)}>修改订单</Button>
          </Menu.Item>;
          let cancel =  <Menu.Item key={index+'_3'}>
            <Button type='default' style={{fontSize:'14px',width:'90px',}} onClick={this.orderCancel.bind(this,record)}>取消订单</Button>
          </Menu.Item>;
          let pending =  <Menu.Item key={index+'_4'}>
            <Button type='default' style={{fontSize:'14px',width:'90px',}} onClick={this.pendingOrder.bind(this,record)}>跟进订单</Button>
          </Menu.Item>;
          let withdraw =  <Menu.Item key={index+'_5'}>
            <Button type='default' style={{fontSize:'14px',width:'90px',}} onClick={this.orderWithdraw.bind(this,record)}>订单退保</Button>
          </Menu.Item>;
          let showLog =  <Menu.Item key={index+'_6'}>
            <Button type='default' style={{fontSize:'14px',width:'90px',}} onClick={this.orderShowLog.bind(this,record)}>查看日志</Button>
          </Menu.Item>;
          //渠道在未提交、资料审核中、预审成功、预审中、需复查、资料审核通过、预约中、预约成功。这几个状态下都可以修改预约信息，但必须是在签单时间48小时之前，渠道才可以更改信息，香港工作日为准推算。
          if(record.status == 'DATA_APPROVING' ||
            record.status == 'DATA_APPROVED' ||
            record.status == 'RESERVING' ||
            record.status == 'PRE_APPROVED' ||
            record.status == 'PRE_APPROVING' ||
            record.status == 'RESERVE_SUCCESS'
          ){
            result = [update,cancel,showLog];
            if (!record.updateState) {
              result = [cancel,showLog];
            }
          }else if(record.status == 'NEED_REVIEW'){
            result = [update,cancel,showLog];
          }  else if(record.status == 'CANCELLED'){
            result = [showLog];
          } else if(record.status == 'RESERVE_FAIL' ||
            record.status == 'ARRIVAL'
          ){
            result = [cancel,showLog];
          } else if(record.status == 'LEAVE' ||
            record.status == 'SIGNED' ||
            record.status == 'APPROVING'
          ){
            result = [withdraw,showLog];
          } else if(record.status == 'PENDING'
          ){
            result = [withdraw,pending,showLog];
          } else if(record.status == 'SURRENDERED' ||
            (record.status == 'DECLINED' && record.countPending > 0) ||
            (record.status == 'SUSPENDED' && record.countPending > 0)||
            (record.status == 'POLICY_EFFECTIVE' && record.countPending > 0)||
            (record.status == 'SURRENDERING'&& record.countPending > 0)||
              (record.status == 'EXPIRED' && record.countPending > 0)
          ){
            result = [pending,showLog];
          }else if(record.status == 'SURRENDERING' ||
            (record.status == 'DECLINED') ||
            (record.status == 'SUSPENDED')||
            (record.status == 'POLICY_EFFECTIVE')||
            (record.status == 'EXPIRED')
          ){
            result = [showLog];
          }else if(record.status == 'NEW'){
            result = [showLog];
          }else if(record.status == 'UNSUBMITTED'){
            result = [update,cancel];
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
                <Button  type='default' style={{width:'110px',}}>操作</Button>
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
        title: '产品(年期)',
        dataIndex: 'item',
      },{
        title: '投保人',
        dataIndex: 'applicant',
        width : '74px',
      },{
        title: '受保人',
        dataIndex: 'insurant',
        width : '74px',
      },{
        title: '主险年缴保费',
        dataIndex: 'yearPayAmount',
        sorter: true,
        width : '150px',
        render(text, record) {
          return <span title="主险年缴保费" style={{fontSize:'14px'}}>{formatCurrency(record.yearPayAmount)}{record.currency}</span>
        }
      }, {
        title: '预约签单时间',
        dataIndex: 'reserveDate',
        width : '145px',
        sorter: true,
        render(text, record) {
          return <span title="预约签单时间" style={{fontSize:'14px'}}>{(record.reserveDate||'').substr(0,16)}</span>
        }
      }, {
        title: '状态',
        dataIndex: 'statusDesc',
        width : '108px',
        render(text, record) {
          if(record.statusDesc=='预审中'||record.statusDesc=='预审成功'){
            return <span style={{fontSize:'14px'}}>资料审核中</span>
          }else {
            return <span style={{fontSize:'14px'}}>{record.statusDesc}</span>
          }
        }
      }, {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width : '74px',
        render: (text, record, index) =>{
          let result = [];
          let select =  <Menu.Item key={index+'_1'}>
            <Button type='default' style={{fontSize:'14px',width:'90px',}} onClick={this.orderSelect.bind(this,record)}>查看订单</Button>
          </Menu.Item>;
          let update =  <Menu.Item key={index+'_2'}>
            <Button type='default' style={{fontSize:'14px',width:'90px',}} onClick={this.orderUpdate.bind(this,record)}>修改订单</Button>
          </Menu.Item>;
          let cancel =  <Menu.Item key={index+'_3'}>
            <Button type='default' style={{fontSize:'14px',width:'90px',}} onClick={this.orderCancel.bind(this,record)}>取消订单</Button>
          </Menu.Item>;
          let pending =  <Menu.Item key={index+'_4'}>
            <Button type='default' style={{fontSize:'14px',width:'90px',}} onClick={this.pendingOrder.bind(this,record)}>跟进订单</Button>
          </Menu.Item>;
          let withdraw =  <Menu.Item key={index+'_5'}>
            <Button type='default' style={{fontSize:'14px',width:'90px',}} onClick={this.orderWithdraw.bind(this,record)}>订单退保</Button>
          </Menu.Item>;
          let showLog =  <Menu.Item key={index+'_6'}>
            <Button type='default' style={{fontSize:'14px',width:'90px',}} onClick={this.orderShowLog.bind(this,record)}>查看日志</Button>
          </Menu.Item>;
          //渠道在未提交、资料审核中、预审成功、预审中、需复查、资料审核通过、预约中、预约成功。这几个状态下都可以修改预约信息，但必须是在签单时间48小时之前，渠道才可以更改信息，香港工作日为准推算。
          if(record.status == 'DATA_APPROVING' ||
            record.status == 'DATA_APPROVED' ||
            record.status == 'RESERVING' ||
            record.status == 'PRE_APPROVED' ||
            record.status == 'PRE_APPROVING' ||
            record.status == 'RESERVE_SUCCESS'
          ){
            result = [update,cancel,showLog];
            if (!record.updateState) {
              result = [cancel,showLog];
            }
          }else if(record.status == 'NEED_REVIEW'){
            result = [update,cancel,showLog];
          } else if(record.status == 'CANCELLED'){
            result = [showLog];
          } else if(record.status == 'RESERVE_FAIL' ||
            record.status == 'ARRIVAL'
          ){
            result = [cancel,showLog];
          } else if(record.status == 'LEAVE' ||
            record.status == 'SIGNED' ||
            record.status == 'APPROVING'
          ){
            result = [withdraw,showLog];
          } else if(record.status == 'PENDING'
          ){
            result = [withdraw,pending,showLog];
          } else if(record.status == 'SURRENDERED' ||
            (record.status == 'DECLINED' && record.countPending > 0) ||
            (record.status == 'SUSPENDED' && record.countPending > 0)||
            (record.status == 'POLICY_EFFECTIVE' && record.countPending > 0)||
            (record.status == 'SURRENDERING'&& record.countPending > 0)||
            (record.status == 'EXPIRED' && record.countPending > 0)
          ){
            result = [pending,showLog];
          }else if(record.status == 'SURRENDERING' ||
            (record.status == 'DECLINED') ||
            (record.status == 'SUSPENDED')||
            (record.status == 'POLICY_EFFECTIVE')||
            (record.status == 'EXPIRED')
          ){
            result = [showLog];
          }else if(record.status == 'NEW'){
            result = [showLog];
          }else if(record.status == 'UNSUBMITTED'){
            result = [update,cancel];
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
                <Button  type='default' style={{width:'110px',}}>操作</Button>
              </Dropdown>
            </div>
          )
        }
      }
    ];
    const orderStatusOptions = [];
    this.state.codeList.orderStatusList.map((item)=> {
      if (item.value != 'PRE_APPROVED' && item.value != 'PRE_APPROVING') {
        orderStatusOptions.push(<Option key={item.value} value={item.value}>{item.meaning}</Option>);
      }
    });
    return(
        <div>
          <div>
            <Form onSubmit={this.handleSearch}>
              <Row>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout}  style={{fontSize:'16px'}}>
                    {getFieldDecorator('status')(
                      <Select showSearch style={{width:'100%'}} placeholder='状态'>
                        {orderStatusOptions}
                      </Select>
                    )}
                  </FormItem>
                </Col>
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
                <Col span={6} style={{paddingRight:'10px'}}>
                </Col>
                <Col span={6}>
                  <Button type='primary' style={{float:'right',fontSize:'20px',height:'40px',width : '140px',fontWeight:'normal'}} onClick={()=>location.hash = '/order/insurance/000'}>预约签单</Button>
                </Col>
              </Row>
              <Row>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout} style={{fontSize:'16px'}}>
                    {getFieldDecorator('number')(
                      <Input style={{width:'100%'}} placeholder="订单编号/保单编号" />
                    )}
                  </FormItem>
                </Col>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout} style={{fontSize:'16px'}}>
                    {getFieldDecorator('item')(
                      <Input style={{width:'100%'}} placeholder="产品" />
                    )}
                  </FormItem>
                </Col>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout} style={{fontSize:'16px'}}>
                    {getFieldDecorator('person')(
                      <Input style={{width:'100%'}} placeholder="受保人/投保人"  />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <Button type='primary' style={{ float:'right',marginLeft: 8 ,fontSize:'20px',height:'40px',width : '140px',fontWeight:'normal'}} onClick={this.allData.bind(this)}>
                    全部
                  </Button>
                  <Button type='default' onClick={this.clickSearch.bind(this)} style={{float:'right',fontSize:'20px',height:'40px',width : '140px',fontWeight:'normal'}}>查询</Button>
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
                pageSize: this.state.pageSize,
                current: this.state.page,
                total:this.state.orderList.total || 0,
              }}/>
        </div>
      </div>
    );
  }
}

OrderSummary = Form.create()(OrderSummary);
export default OrderSummary;
