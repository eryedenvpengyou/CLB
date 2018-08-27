import React from 'react';
import {Table, Form, Checkbox,Input,Row,Col, Button,Dropdown,Menu,Pagination, Select, DatePicker,Tooltip,Icon,InputNumber,Modal,textarea} from 'antd';
import * as service from '../../services/order';
import * as codeService from '../../services/code';
import { handleTableChange } from '../../utils/table';
import * as styles from '../../styles/ordersummary.css';
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
      page: 1,
      pageSize: 20,
      orderList:{},
      visible: false,
    };
  }

  componentWillReceiveProps(nextProps){
    this.state.orderBy = [];
    if(this.props.key3 !== nextProps.key3) {
      let params = {
        page: 1,
        pageSize: 20,
        dateType: 'RESERVE',
        orderType: 'INSURANCE'
      };
      params.dateType = 'RESERVE';
      params.orderType = 'INSURANCE';
      params.item = this.props.form.getFieldValue('item');
      params.applicant =this.props.form.getFieldValue('applicant');
      params.insurant =this.props.form.getFieldValue('applicant');
      params.status =this.props.form.getFieldValue('status');
      params.number =this.props.form.getFieldValue('number');
      params.startDateActive =formatDay(this.props.form.getFieldValue('startDateActive'));
      params.endDateActive =formatDay(this.props.form.getFieldValue('endDateActive'));

      service.fetchOrderReferralListService(params).then((data) => {
        if (data.success) {
          data.rows.map((row, index) => {
            row.key = index;
          });
          this.setState({
            orderList: data,
            page: 1,
          })
        }
      })
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
    params = {
      page: 1,
      pageSize: 20,
      dateType: 'RESERVE',
      orderType: 'INSURANCE'
    };
    service.fetchOrderReferralListService(params).then((data)=>{
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({
          orderList:data
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
    params.dateType = 'RESERVE';
    params.orderType = 'INSURANCE';
    params.item = this.props.form.getFieldValue('item');
    params.applicant =this.props.form.getFieldValue('applicant');
    params.insurant =this.props.form.getFieldValue('applicant');
    params.status =this.props.form.getFieldValue('status');
    params.number =this.props.form.getFieldValue('number');
    params.startDateActive =formatDay(this.props.form.getFieldValue('startDateActive'));
    params.endDateActive =formatDay(this.props.form.getFieldValue('endDateActive'));
    params.page = 1;
    params.pageSize = this.state.pageSize;
    service.fetchOrderReferralListService(params).then((data)=>{
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
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
    params.item = this.props.form.getFieldValue('item');
    params.applicant =this.props.form.getFieldValue('applicant');
    params.insurant =this.props.form.getFieldValue('applicant');
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
    service.fetchOrderReferralListService(params).then((data)=>{
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({
          orderList:data,
          page: pagination.current,
        });
      }
    });
  }

  handVisble(value){
    if(value.modalValue == 'Y'){
      // service.deleteCustomer([{orderId:this.state.record.orderId}]).then((data)=>{
      //   if(data.success){
      //     this.setState({visible:false});
      //     let params = {};
      //     const user = JSON.parse(localStorage.user||'{}');
      //     params.introducer = user.userId;
      //     params.item = this.props.form.getFieldValue('item');
      //     params.applicantInsurant =this.props.form.getFieldValue('applicantInsurant');
      //     params.status =this.props.form.getFieldValue('status');
      //     params.startDate =this.props.form.getFieldValue('startDate');
      //     params.endDate =this.props.form.getFieldValue('endDate');
      //     params.page = 1;
      //     params.pageSize = this.state.pageSize;
      //     this.props.dispatch({
      //       type: 'order/fetchOrderQuery',
      //       payload: {params},
      //     });
      //   }
      // });
    }else{
      this.setState({record:'',visible:false});
    }
  }

  delete(value){
    this.setState({visible:true,record:value});
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
    location.hash = `/order/orderDetail/introduction/${record.orderId}`;
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
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        width : '150px',
        render:(text, record)=>{
          return (
            <a onClick={this.orderSelect.bind(this, record)}  style={{fontSize:'14px',color:'#d1b97f'}}>{record.orderNumber}</a>
          );
        }
      }, {
        title: '产品(年期)',
        dataIndex: 'item',
        render(text, record) {
          return <span title="产品(年期)" style={{fontSize:'14px'}}>{record.item}</span>
        }
      }, {
        title: '投保人',
        dataIndex: 'applicant',
        width : '74px',
        render(text, record) {
          return <span title="投保人" style={{fontSize:'14px'}}>{record.applicant}</span>
        }
      }, {
        title: '受保人',
        dataIndex: 'insurant',
        width : '74px',
        render(text, record) {
          return <span title="受保人" style={{fontSize:'14px'}}>{record.insurant}</span>
        }
      }, {
        title: '主险年缴保费',
        dataIndex: 'yearPayAmount',
        sorter: true,
        width : '150px',
        render(text, record) {
          return <span title="主险年缴保费" style={{fontSize:'14px'}}>{formatCurrency(record.yearPayAmount)}{record.currency}</span>
        }
      }, {
        title: '渠道',
        dataIndex: 'channelName',
        width : '90px',
        sorter: true,
        render(text, record) {
          return <span title="渠道" style={{fontSize:'14px'}}>{record.channelName}</span>
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
        width : '140px',
        render: (text, record, index) =>{
          let result = [];
          let pending =  <Menu.Item key={index+'_1'}>
            <Button type='default' style={{fontSize:'14px',width:'90px',}} onClick={this.pendingOrder.bind(this,record)}>跟进订单</Button>
          </Menu.Item>;
          let showLog =  <Menu.Item key={index+'_2'}>
            <Button type='default' style={{fontSize:'14px',width:'90px',}} onClick={this.orderShowLog.bind(this,record)}>查看日志</Button>
          </Menu.Item>;

          if(record.status == 'PENDING' ||
            (record.status == 'POLICY_EFFECTIVE' && record.countPending > 0) ||
            record.status == 'SURRENDERED' ||
            (record.status == 'DECLINED' && record.countPending > 0) ||
            (record.status == 'SUSPENDED' && record.countPending > 0) ||
            (record.status == 'EXPIRED' && record.countPending > 0)
          ){
            result = [pending,showLog];
          }
          else {
            result = [showLog];
          }
          return (
            <Dropdown overlay={
              <Menu>
                {
                  result.map((item)=> item)
                }
              </Menu>
            }>
              <Button type='default' style={{width:'110px',}}>操作</Button>
            </Dropdown>
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
            <Form onSubmit={this.handleSearch} >
              <Row>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout}  style={{fontSize:'16px'}}>
                    {getFieldDecorator('status')(
                      <Select
                        showSearch
                        style={{width:'100%'}}
                        placeholder='状态'>
                        {orderStatusOptions}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout} style={{fontSize:'16px'}}>
                    {getFieldDecorator('startDateActive')(
                      <DatePicker disabledDate={this.disabledStartDate} placeholder="预约日期从"  format={dateFormat} style={{width:'100%'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout} style={{fontSize:'16px'}}>
                    {getFieldDecorator('endDateActive')(
                      <DatePicker disabledDate={this.disabledEndDate} placeholder="预约日期至"  format={dateFormat} style={{width:'100%'}}/>
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
                    {getFieldDecorator('applicant')(
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
                   columns={columns}
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

