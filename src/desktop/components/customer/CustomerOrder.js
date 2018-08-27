import React from 'react';
import {Table, Button } from 'antd';
import * as service from '../../services/customer';
import * as codeService from '../../services/code';
import moment from 'moment';
import * as styles from '../../styles/qa.css';
import * as utils from '../../utils/common';

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
import {formatCurrency} from "../../utils/common";
import Modals from '../common/modal/Modal';



class CustomerOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      code:{},
      orders:[],
      orderChart: [],
      insuranceChart: [],
    };
  }

  componentDidMount() {
    // 饼图
    var pieCharts = echarts.init(document.getElementById('pie'));

    function setOptions(orderData,insuranceData){
      var option = {
        title: {
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: function(data){
              return `${data.seriesName} <br/> ${data.name} : ${formatCurrency(data.value)} 港币 (${data.percent}%)`
            },
        },
        series: [{
          name:'订单类型',
          type:'pie',
          selectedMode: 'single',
          center:['50%', '50%'],
          radius: [0, '45%'],
          label: {
              normal: {
                  position: 'inner'
              }
          },
          labelLine: {
              normal: {
                  show: false
              }
          },
          color: ['#ff4100', '#ff8e00', '#ffbc00'],
          data:orderData,

        },{
          name:'保险类型',
          type:'pie',
          radius: ['55%', '75%'],
          color: ['#f79a01', '#b1db49', '#ff9773', '#ffc173', '#bf9a30', '#ff7140', '#3e97d1', '#a65c00'],
          data:insuranceData,
        }]
      }
      pieCharts.setOption(option);
    }


    //获取 饼图数据
    service.fetchClassAmount({
      customerId:this.props.customerId,
      channelId:JSON.parse(localStorage.user).relatedPartyId
    }).then((data)=>{
      if (data.success) {
        let orderData = [], insuranceData = [], flag = true;
        const rows = data.rows;
        for (let i in data.rows || []) {
          //保险类型
          if (rows[i].midClassName ) {
            insuranceData.map((midClassData) => {
              if (rows[i].midClassName == midClassData.name) {
                midClassData.value = midClassData.value + rows[i].orderAmount;
                flag = false;
                return;
              }
            });
            if (flag) {
              insuranceData.push({
                value: rows[i].orderAmount,
                name: rows[i].midClassName,
              });
            }
          }

          //订单类型
          if (rows[i].bigClassName) {
            orderData.map((bigClassData) => {
              if (rows[i].bigClassName == bigClassData.name) {
                bigClassData.value = bigClassData.value + rows[i].orderAmount;
                flag = false;
                return;
              }
            });
            if (flag) {
              orderData.push({
                value: rows[i].orderAmount,
                name: rows[i].bigClassName,
              });
            }
          }
        }

        setOptions(orderData, insuranceData);
      }

    });


    //获取表格数据
    service.fetchCustomerOrder({
      customerId:this.props.customerId,
      // channelId:JSON.parse(localStorage.user).relatedPartyId     数据屏蔽不传 channelId
    }).then((data)=>{
      if (data.success) {
        this.setState({orders: data.rows || []});
      }
    });

    //快码
    const codeParams = {
      orderStatus: 'ORD.ORDER_STATUS',             //保险订单状态
      valueAddStatus:'ORD.VALUEADD_STATUS',        //增值服务 订单状态
      bondStatus:'ORD.BOND_STATUS',                //债券订单状态
      imaginationStatus:'ORD.IMMIGRANT_STATUS',    //投资移民 订单状态
    };
    codeService.getCode(codeParams).then((data)=>{
      this.setState({code: data,});
    });

  }

  //查看日志
  svLog(record){
    service.fetchHisLog({orderId:record.orderId}).then((data)=>{
      const statusHisList = data.rows || [];
      this.setState({statusHisList: statusHisList});

      Modals.LogModel({List:this.state.statusHisList})


    });
  }

  render() {
    const orders = this.state.orders || [];
    let insuranceData = [], valueaddData = [], bondData = [], immigrantData = [];
    for(let i in orders){
      if(orders[i].orderType == 'INSURANCE'){
        insuranceData.push(orders[i]);
      }else if(orders[i].orderType == 'VALUEADD'){
        valueaddData.push(orders[i]);
      }else if(orders[i].orderType == 'BOND'){
        bondData.push(orders[i]);
      }else if(orders[i].orderType == 'IMMIGRANT'){
        immigrantData.push(orders[i]);
      }
    }


    const column = {
      //保险订单
      insuranceColumns: [{
          title: '订单编号',
          dataIndex: 'orderNumber',
          key: 'orderNumber',
          className:styles.text_center,
          width:'150px',
        render: (text, record) => <span style={{color:JSON.parse(localStorage.theme).themeColor,cursor:'pointer'}} onClick={() => location.hash = '/order/insurance/' + record.orderId } >{text}</span>,
      }, {
          title: '产品（年期）',
          dataIndex: 'item',
          key: 'item',
          className:styles.text_center,
        },{
          title: '投保人',
          dataIndex: 'applicant',
          key: 'applicant',
          className:styles.text_center,
        },{
          title: '受保人',
          dataIndex: 'insurant',
          key: 'insurant',
          className:styles.text_center,
        },{
          title: '年缴保费',
          dataIndex: 'policyAmount',
          key: 'policyAmount',
          className:styles.text_center,
          render(text, record) {
            return <span>{formatCurrency(record.yearPayAmount)}{record.policyAmount? (record.currency):''}</span>
          }
        },{
          title: '预约签单时间',
          dataIndex: 'reserveDate',
          key: 'reserveDate',
          className:styles.text_center,
          width:'150px',
          render: (text, record) => {
            return text ? moment(text).format('YYYY-MM-DD HH:mm') :'';
          },
        },{
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          className:styles.text_center,
          width:'100px',
          render: (text, record)=>{
            if(text && this.state.code.orderStatus){
              for(let i in this.state.code.orderStatus){
                if(text == this.state.code.orderStatus[i].value){
                  return(this.state.code.orderStatus[i].meaning)
                }
              }
            }
          },
        },{
          title: '操作',
          dataIndex: 'identityNumber',
          key: 'position',
          className:styles.text_center,
          width:'130px',
          render: (text, record) => {
            return(
              <Button className={styles.btn_operation} style={{ height:'32px'}} onClick={this.svLog.bind(this,record)} >
                查看日志
              </Button>
            )
          }
        }],

      //增值服务
      valueaddColumns: [{
          title: '订单编号',
          dataIndex: 'orderNumber',
          key: 'orderNumber',
          className:styles.text_center,
          width:'160px',
          render: (text, record) => <span style={{color:JSON.parse(localStorage.theme).themeColor,cursor:'pointer'}}
                                          onClick={() => location.hash = '/portal/svDetailHandle/' + record.valueaddType + '/'+record.orderId+ '/'+record.itemId +'/'+2} >{text}</span>,

      }, {
          title: '产品名称',
          dataIndex: 'itemName',
          key: 'itemName',
          className:styles.text_center,
          width:'240px',
        }, {
          title: '保单订单编号',
          dataIndex: 'relatedOrderNumber',
          key: 'relatedOrderNumber',
          className:styles.text_center,
          width:'160px',
          render: (text, record) => <span style={{color:JSON.parse(localStorage.theme).themeColor,cursor:'pointer'}} onClick={() => location.hash = '/order/orderDetail/personal/' + record.relatedOrderId} >{text}</span>,
      },{
          title: '客户姓名',
          dataIndex: 'applicant',
          key: 'applicant',
          className:styles.text_center,
          width:'160px',
      },{
          title: '预约时间',
          dataIndex: 'signDate',
          key: 'signDate',
          className:styles.text_center,
          width:'150px',
          render: (text, record) => {
            return text ? moment(text).format('YYYY-MM-DD HH:mm') :'';
          },
        },{
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          className:styles.text_center,
          render: (text, record)=>{
            if(text && this.state.code.valueAddStatus){
              for(let i in this.state.code.valueAddStatus){
                if(text == this.state.code.valueAddStatus[i].value){
                  return(this.state.code.valueAddStatus[i].meaning)
                }
              }
            }
          },
        },{
          title: '操作',
          dataIndex: 'identityNumber',
          key: 'position',
          className:styles.text_center,
          width:'130px',
          render: (text, record) => {
            return(
              <Button className={styles.btn_operation} style={{ height:'32px'}} onClick={this.svLog.bind(this,record)}>
                查看日志
              </Button>
            )
          }
        }],

      //债券
      bondColumns: [{
          title: '订单编号',
          dataIndex: 'orderNumber',
          key: 'orderNumber',
          className:styles.text_center,
          render: (text, record) =>
            <span style={{color:JSON.parse(localStorage.theme).themeColor,cursor:'pointer'}} onClick={() => location.hash = '/production/subscribe/ZQ/orderQuery/' + record.orderId} >{text}</span>,
      }, {
          title: '产品信息',
          dataIndex: 'item',
          key: 'item',
          className:styles.text_center,
          render:(text,record) => {
            return <span>{record.itemName}-{record.sublineItemName}</span>;
          }
        },{
          title: '金额',
          dataIndex: 'policyAmount',
          key: 'policyAmount',
          className:styles.text_center,
          render(text, record) {
            return <span>{formatCurrency(record.policyAmount)}{record.policyAmount? (record.currency):''}</span>
          }
        },{
          title: '预约时间',
          dataIndex: 'signDate',
          key: 'signDate',
          className:styles.text_center,
          width:'150px',
          render: (text, record) => {
            return text ? moment(text).format('YYYY-MM-DD HH:mm') :'';
          },
        },{
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          className:styles.text_center,
          render: (text, record)=>{
            if(text && this.state.code.bondStatus){
              for(let i in this.state.code.bondStatus){
                if(text == this.state.code.bondStatus[i].value){
                  return (this.state.code.bondStatus[i].meaning)
                }
              }
            }
          },
        },{
          title: '操作',
          dataIndex: 'opera',
          key: 'opera',
          className:styles.text_center,
          width:'130px',
          render: (text, record) => {
            return(
              <Button className={styles.btn_operation} style={{ height:'32px'}} onClick={this.svLog.bind(this,record)}>
                查看日志
              </Button>
            )
          }
        }],

      //投资移民
      immigrantColumns: [{
          title: '订单编号',
          dataIndex: 'orderNumber',
          key: 'orderNumber',
          className:styles.text_center,
          width:'190px',
          render: (text, record) => <span style={{color:JSON.parse(localStorage.theme).themeColor,cursor:'pointer'}} onClick={() => location.hash = '/order/orderImmigrantInvest/OrderImmigrantInvestDetail/personal/' + record.orderId} >{text}</span>,
      }, {
          title: '产品信息',
          dataIndex: 'item',
          key: 'item',
          className:styles.text_center,
          width:'280px',
          render:(text,record) => {
            return <span>{record.itemName}-{record.sublineItemName}</span>;
          }
        },{
        title: '金额',
        dataIndex: 'policyAmount',
        key: 'policyAmount',
        className:styles.text_center,
        width:'205px',
        render(text, record) {
          return <span>{formatCurrency(record.policyAmount)}{record.policyAmount? (record.currency):''}</span>
        }
      }, {
          title: '基本预算(RMB)',
          dataIndex: 'budget',
          key: 'budget',
          className:styles.text_center,
          width:'205px',
          render(text, record) {
            return <span>{formatCurrency(record.budget)}{record.budget ? 'CNY':''}</span>
          }
        },{
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          className:styles.text_center,
          width:'150px',
          render: (text, record)=>{
            if(text && this.state.code.imaginationStatus){
              for(let i in this.state.code.imaginationStatus){
                if(text == this.state.code.imaginationStatus[i].value){
                  return(this.state.code.imaginationStatus[i].meaning)
                }
              }
            }
          },
        },{
          title: '操作',
          dataIndex: 'identityNumber',
          key: 'position',
          className:styles.text_center,
          width:'130px',
          render: (text, record) => {
            return(
              <Button className={styles.btn_operation} style={{ height:'32px'}} onClick={this.svLog.bind(this,record)}>
                查看日志
              </Button>
            )
          }
      }],

    };
    return (
      <div>
        {/*图*/}
        <div className={styles.div_item_line}>
          <b className={styles.b_short_line} >|</b>
          <font className={styles.title_font}>{this.props.name}资产配置图</font>
          <div id='pie' style={{width:1200, height:400,textAlign:'center'}}></div>
        </div>


        {/*保险订单*/}
        <div className={styles.div_item_line}>
          <b className={styles.b_short_line} >|</b>
          <font className={styles.title_font}>保险订单</font>

          <div style={{width:'100%',marginTop:'15px'}}>
            <Table
              rowKey='orderId'
              scroll={{x:'100%'}}
              dataSource={insuranceData}
              columns={column.insuranceColumns}
              bordered
              pagination={false}/>
          </div>
        </div>


        {/*增值服务*/}
        <div className={styles.div_item_line}>
          <b className={styles.b_short_line} >|</b>
          <font className={styles.title_font}>增值服务</font>

          <div style={{width:'100%',marginTop:'15px'}}>
            <Table
              rowKey='orderId'
              dataSource={valueaddData}
              columns={column.valueaddColumns}
              bordered
              pagination={false}/>
          </div>
        </div>

        {/*债券*/}
        <div className={styles.div_item_line}>
          <b className={styles.b_short_line} >|</b>
          <font className={styles.title_font}>债券</font>

          <div style={{width:'100%',marginTop:'15px'}}>
            <Table
              rowKey='orderId'
              dataSource={bondData}
              columns={column.bondColumns}
              bordered
              pagination={false}/>
          </div>
        </div>

        {/*投资移民*/}
        <div className={styles.div_item_line}>
          <b className={styles.b_short_line} >|</b>
          <font className={styles.title_font}>投资移民</font>

          <div style={{width:'100%',marginTop:'15px'}}>
            <Table
              rowKey='orderId'
              dataSource={immigrantData}
              columns={column.immigrantColumns}
              bordered
              pagination={false}/>
          </div>
        </div>

      </div>
    )
  }
}


export default CustomerOrder;
