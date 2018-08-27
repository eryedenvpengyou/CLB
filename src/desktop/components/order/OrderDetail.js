import React from 'react';
import { Menu,Dropdown,message,Form,Tabs,Checkbox,Input,Row,Col, Button, Select,Table, DatePicker,Tooltip,Icon,InputNumber,Modal,Cascader } from 'antd';
import * as styles from '../../styles/orderDetail.css';
import * as style from '../../styles/ordersummary.css';
import * as commonStyle from '../../styles/common.css';
import * as service from '../../services/order';
import * as codeService from '../../services/code';
import Download from '../common/Download';
import * as util from '../../utils/common';
import Modals from '../common/modal/Modal';
import moment from 'moment';
import OrdCommissionMd from './OrdCommissionMd';

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


const FormItem = Form.Item;
const Option = Select.Option;
//tab 页面
const TabPane = Tabs.TabPane;


class OrderDetailComponents extends React.Component {
  state = {
    orderDetail: {updateStatus:false},
    addtionalData: [],
    cusServiceData: [],
    pendingData: [],
    renewalList: [],
    commissionList: [],
    code: {},
    statusHisList:[],
    addvisible :'',
    renewvisible :'',
    codeList:{
      payMethodList: [],
      renewalStatus: [],
      orderCurrencyCode: [],
    },
    teamOrdCommission:false,
    commissionVisible:false,
    dataList:[],
    commissionRecord:{},
  };
  /**
   * reserveDate2 预约时间，如果是非工作日，则需要加一天，知道是工作日为止
   * hour 允许相差的小时数
   * hours 当前时间和预约时间相差的小时数
   */
  // isWeekday(reserveDate2,hour,hours) {
  //   //hours<0 说明预约时间已过，是不可以修改订单的
  //   if (hours > 0) {
  //     //hours<=hour 需要判断工作日来决定是否可以修改订单
  //     //hours>hour 可以修改订单的
  //     if (hours > hour) {
  //       this.state.orderDetail.updateStatus = true;
  //       return;
  //     }
  //     const body = {
  //       "supplierId": this.state.orderDetail.productSupplierId,
  //       "theYear": new Date(reserveDate2).getFullYear(),
  //       "theMonth": new Date(reserveDate2).getMonth()+1,
  //       "theDay": new Date(reserveDate2).getDate()
  //     }
  //     service.isWeekday(body).then((dayData) => {
  //       if (dayData.success) {
  //         //-1：休息日，0：工作日
  //         if (dayData.code == '-1') {
  //           hours += 24;
  //           reserveDate2 += 100000000;
  //           this.isWeekday(reserveDate2,hour,hours);
  //         } else {
  //           if (hours <= hour) {
  //             this.state.orderDetail.updateStatus = false;
  //             return;
  //           } else {
  //             this.state.orderDetail.updateStatus = true;
  //             return;
  //           }
  //         }
  //       } else {
  //         Modals.error({content: `请先维护日历信息！`});
  //         this.state.orderDetail.updateStatus = false;
  //         return;
  //       }
  //     });
  //   } else {
  //     this.state.orderDetail.updateStatus = false;
  //     return;
  //   }
  // }

  componentWillMount() {
    let params = {
      orderCurrencyCode: 'PUB.CURRENCY',
      renewalStatus: 'ORD.RENEWAL_STATUS',
      payMethodList: 'CMN.PAY_METHOD',
      balancePaymentMethodCodes: 'ORD.BALANCE_PAY_METHOD',
      ddaStatus: 'ORD.DDA_STATUS',
    };
    codeService.getCode(params).then((data)=>{
      this.setState({
        codeList: data,
      });
    });
    //订单信息
    if (this.props.prePage == 'team') {
      service.fetchOrderTeamList({params:{orderId:this.props.orderId}}).then((data)=>{
        if (data.success) {
          this.state.orderDetail = data.rows[0] || {};
          if (this.state.orderDetail.payMethod) {
            this.state.codeList.payMethodList.map((code) => {
              if (code.value == this.state.orderDetail.payMethod) {
                this.state.orderDetail.payMethodMeaning = code.meaning;

              }
            });
          }
          if (this.state.orderDetail.currency) {
            this.state.codeList.orderCurrencyCode.map((code) => {
              if (code.value == this.state.orderDetail.currency) {
                this.state.orderDetail.currencyMeaning = code.meaning;

              }
            });
          }
          this.state.orderDetail.updateStatus = false;
          if (this.state.orderDetail.reserveDate) {
            //渠道在未提交、资料审核中、预审成功、预审中、需复查、资料审核通过、预约中、预约成功。这几个状态下都可以修改预约信息，但必须是在签单时间48小时之前，渠道才可以更改信息，香港工作日为准推算。
            if (this.state.orderDetail.status == 'UNSUBMITTED' || this.state.orderDetail.status == 'DATA_APPROVING'
              || this.state.orderDetail.status == 'PRE_APPROVED' || this.state.orderDetail.status == 'PRE_APPROVING'
              || this.state.orderDetail.status == 'NEED_REVIEW' || this.state.orderDetail.status == 'DATA_APPROVED'
              || this.state.orderDetail.status == 'RESERVING' || this.state.orderDetail.status == 'RESERVE_SUCCESS') {
                const total = new Date((this.state.orderDetail.reserveDate||'').replace(/-/g,'/')).getTime() - new Date().getTime();
                const hours = total/(3600*1000);
                var reserveDate2 = new Date((this.state.orderDetail.reserveDate||'').replace(/-/g,'/')).getTime()+100000000;
                // this.isWeekday(reserveDate2,48,hours);
                if (hours <= 48) {
                  this.state.orderDetail.updateStatus = false;
                } else {
                  this.state.orderDetail.updateStatus = true;
                }
            }
          }
          this.setState({orderDetail: this.state.orderDetail});
        }
      });
      //团队列表里面的订单，调用该接口是返回true以及订单在冷静期前才可以修改订单佣金；
      service.checkUpdateOrdCommission({userId: JSON.parse(localStorage.user).userId}).then((data) => {
        if (data.success) {
          this.setState({ teamOrdCommission: true })
        }
      })
    } else {
      service.fetchOrderDetail({orderId:this.props.orderId}).then((data)=>{
        if (data.success) {
          this.state.orderDetail = data.rows[0] || {};
          if (this.state.orderDetail.payMethod) {
            this.state.codeList.payMethodList.map((code) => {
              if (code.value == this.state.orderDetail.payMethod) {
                this.state.orderDetail.payMethodMeaning = code.meaning;

              }
            });
          }
          if (this.state.orderDetail.currency) {
            this.state.codeList.orderCurrencyCode.map((code) => {
              if (code.value == this.state.orderDetail.currency) {
                this.state.orderDetail.currencyMeaning = code.meaning;

              }
            });
          }
          this.state.orderDetail.updateStatus = false;
          if (this.state.orderDetail.reserveDate) {
            //渠道在未提交、资料审核中、预审中、预审成功、需复查、资料审核通过、预约中、预约成功。这几个状态下都可以修改预约信息，但必须是在签单时间一个工作日之前，渠道才可以更改信息，香港工作日为准推算。
            if (this.state.orderDetail.status == 'UNSUBMITTED' || this.state.orderDetail.status == 'DATA_APPROVING'
              || this.state.orderDetail.status == 'PRE_APPROVING' || this.state.orderDetail.status == 'PRE_APPROVED'
              || this.state.orderDetail.status == 'NEED_REVIEW' || this.state.orderDetail.status == 'DATA_APPROVED'
              || this.state.orderDetail.status == 'RESERVING' || this.state.orderDetail.status == 'RESERVE_SUCCESS') {
                const total = new Date((this.state.orderDetail.reserveDate||'').replace(/-/g,'/')).getTime() - new Date().getTime();
                const hours = total/(3600*1000);
                var reserveDate2 = new Date((this.state.orderDetail.reserveDate||'').replace(/-/g,'/')).getTime()+100000000;
                // this.isWeekday(reserveDate2,48,hours);
                if (hours <= 48) {
                  this.state.orderDetail.updateStatus = false;
                } else {
                  this.state.orderDetail.updateStatus = true;
                }
            }
          }
          this.setState({orderDetail: this.state.orderDetail});
        }
      });
    }
    //附加险信息
    service.fetchOrderDetailAddtionalList({orderId:this.props.orderId}).then((data)=>{
      if (data.success) {
        const addtionalData = data.rows || [];
        addtionalData.map((row, index) => {
          row.key = index;
        });
        this.setState({addtionalData: addtionalData});
      }
    });
    //售后信息
    service.fetchOrderDetailCusServiceList({orderId:this.props.orderId}).then((data)=>{
      if (data.success) {
        const cusServiceData = data.rows || [];
        cusServiceData.map((row, index) => {
          row.key = index;
        });
        this.setState({cusServiceData: cusServiceData});
      }
    });
    //pending信息
    service.fetchOrderDetailPendingList({orderId:this.props.orderId}).then((data)=>{
      if (data.success) {
        const pendingData = data.rows || [];
        pendingData.map((row, index) => {
          row.key = index;
        });
        this.setState({pendingData: pendingData});
      }
    });
    //续保信息
    service.fetchOrderDetailRenewalList({orderId:this.props.orderId}).then((data)=>{
      if (data.success) {
        const renewalList = data.rows || [];
        renewalList.map((row, index) => {
          row.key = index;
        });
        this.setState({renewalList: renewalList});
      }
    });
    //佣金明细
    service.fetchOrderDetailordCommissionList({orderId:this.props.orderId,orderType:this.props.prePage}).then((data)=>{
      if (data.success) {
        const commissionList = data.rows || [];
        commissionList.map((row, index) => {
          row.key = index;
        });
        this.setState({commissionList: commissionList});
      }
    });
    //状态跟进信息
    service.fetchOrderDetailordStatusHisList({orderId:this.props.orderId}).then((data)=>{
      if (data.success) {
        const statusHisList = data.rows || [];
        statusHisList.map((row, index) => {
          row.key = index;
        });
        this.setState({statusHisList: statusHisList});
      }
    });
  }
  //取消订单
  cancelOrder(record){
    Modals.message(this.cancelOrderConfirm.bind(this, record),"您确定取消订单吗？");
  }
  cancelOrderConfirm(record, flag, values){
    if (flag) {
      service.updateOrderStatus([{orderId: this.state.orderDetail.orderId,status: "CANCELLED",hisDesc: values.comments}]).then((data)=>{
        if (data.success) {
          Modals.success('提交成功！');
            setTimeout(function(){
              location.hash = '#/order/summary';
            },3000)
        } else {
          Modals.error(`请联系系统管理员,${data.message}`);
        }
      });
    }
  }

  lod(){
    location.hash = '/order/insurance/' + this.props.orderId;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      debugger;
      const { getFieldValue } = this.props.form;
      const prefix = getFieldValue('prefix');
      const user = JSON.parse(localStorage.user);
      const param = values;
      param.channelId = user.relatedPartyId;
      param.supportType = 'TRAIN';

      this.setState({
        loading: true,
      });
      submit(values).then((data) => {
        if (data.success) {
          Modal.success({
            title: '提交成功！',
            onOk: () => {
              this.props.dispatch(routerRedux.push('/classroom/business'));
              this.props.form.resetFields();
            },
          });
        } else {
          Modal.error({
            title: '提交失败！',
            content: `请联系系统管理员,${data.message}`,
          });
        }
        this.setState({
          loading: false,
        });
      });
    });
  };

  //查看日志
  orderShowLog(orderDetail){
    service.fetchOrderDetailordStatusHisList({orderId:orderDetail.orderId}).then((data)=>{
      const statusHisList = data.rows || [];
      this.setState({statusHisList: statusHisList});
      Modals.LogModel({List:this.state.statusHisList});
    });
  }
  //佣金明细弹出窗回调
  callback(record,flag) {
    if(record && record.commissionId && flag == false){
      this.setState({commissionVisible: false});
      this.submit(record);
    }else{
      this.setState({commissionVisible: false});
    }
  }
  detClick(record){
    this.setState({commissionRecord:record,commissionVisible:true})
  }
  //提交数据
  submit(record){
    let commissionList = [];
    this.state.commissionList.map((item,i)=>{
      if(record.itemId == item.itemId){
        if(item.commissionPerson == '下级佣金率'){
          commissionList.push({
            key:item.key,
            itemId:item.itemId,
            commissionId:item.commissionId,
            theFirstYear : (item.theFirstYear)/100,
            theSecondYear : (item.theSecondYear)/100,
            theThirdYear : (item.theThirdYear)/100,
            theFourthYear : (item.theFourthYear)/100,
            theFifthYear :( item.theFifthYear)/100,
            theSixthYear :( item.theSixthYear)/100,
            theSeventhYear : (item.theSeventhYear)/100,
            theEightYear :( item.theEightYear)/100,
            theNinthYear :( item.theNinthYear)/100,
            theTenthYear :( item.theTenthYear)/100,
            firstYearAmount:(item.theFirstYear*item.yearPayAmount)/100,
            secondYearAmount:(item.theSecondYear*item.yearPayAmount)/100,
            thirdYearAmount:(item.theThirdYear*item.yearPayAmount)/100,
            fourthYearAmount:(item.theFourthYear*item.yearPayAmount)/100,
            fifthYearAmount:(item.theFifthYear*item.yearPayAmount)/100,
            sixthYearAmount:(item.theSixthYear*item.yearPayAmount)/100,
            seventhYearAmount:(item.theSeventhYear*item.yearPayAmount)/100,
            eightYearAmount:(item.theEightYear*item.yearPayAmount)/100,
            ninthYearAmount:(item.theNinthYear*item.yearPayAmount)/100,
            tenthYearAmount:(item.theTenthYear*item.yearPayAmount)/100,
            __status : 'update'
          })
        }
      }
    });
    service.ordCommissionSubmit(commissionList).then((data)=>{
      if(data.success){
        Modals.success({ content: '提交成功' });
        service.fetchOrderDetailordCommissionList({ orderId: this.props.orderId,orderType:this.props.prePage }).then((data) => {
          if (data.success) {
            const commissionList = data.rows || [];
            commissionList.map((row, index) => {
              row.key = index;
            });
            this.setState({ commissionList: commissionList });
          }
        });
      }else{
        Modals.error({content: data.message});
      }
    });
  }
  render() {
    const bpmListCode = this.state.codeList.balancePaymentMethodCodes;
    const ddaStatus = this.state.codeList.ddaStatus;
    const addtionalColumns = [{
      title: '附加产品',
      dataIndex: 'itemName',
      key: 'itemName',
    }, {
      title: '缴费方式',
      dataIndex: 'payMethodDesc',
      key: 'payMethodDesc',
    }, {
      title: '币种',
      dataIndex: 'currency',
      key: 'currency',
      render: (text,record,index) => {
        return this.state.orderDetail.currencyMeaning||'';
      }
    },{
      title: '年缴保费',
      dataIndex: 'yearPayAmount',
      key: 'yearPayAmount',
      render(text, record) {
        return <span title="年缴保费" style={{fontSize:'14px'}}>{formatCurrency(record.yearPayAmount)}</span>
      }
    },{
      title: '保额',
      dataIndex: 'policyAmount',
      key: 'policyAmount',
      render(text, record) {
        return <span title="保额" style={{fontSize:'14px'}}>{formatCurrency(record.policyAmount)}</span>
      }
    },{
      title: '状态',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
    }];

    const pendingColumns = [{
      title: 'pending编号',
      dataIndex: 'pendingNumber',
      key: 'pendingNumber',
    }, {
      title: 'pending类别',
      dataIndex: 'applyClassDesc',
      key: 'applyClassDesc',
    }, {
      title: 'pending项目名称',
      dataIndex: 'applyItem',
      key: 'applyItem',
    },{
      title: '最后更新时间',
      dataIndex: 'lud',
      key: 'lud',
    },{
      title: '处理截至时间',
      dataIndex: 'dealEndDate',
      key: 'dealEndDate',
    },{
      title: '处理人',
      dataIndex: 'dealPersonName',
      key: 'dealPersonName',
    },{
      title: '状态',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
    },{
      title: '跟进',
      dataIndex: 'grade',
      key: 'grade',
      render: (text, record) =>{
        return (
          <div>
              <Button type='primary' onClick={()=>location.hash = '#/orderPending/OrderPendingTrail/insurance/person/'+record.orderId+'/'+record.pendingId} style={{ marginLeft: 8 ,fontSize:'14px',height:'30px',width : '80px',fontWeight:'normal'}}>
                跟进
              </Button>
          </div>
        )
      }
    }];

    const cusServiceColumns = [{
      title: '售后编号',
      dataIndex: 'afterNum',
      key: 'afterNum',
      render: (text, record, index) => {
        if(record.afterType=='续保'){
          return <div>
            <a style={{fontSize:'14px',color:'#d1b97f',}} onClick={()=>location.hash = '/after/AfterFollowApplication/'+record.afterId+'/'+record.orderId+'/'+record.afterStatus}>{record.afterNum}</a>
          </div>
        }
        else if(record.afterType=='冷静期后退保'||record.afterType=='冷静期内退保' || record.afterType == '批核中退保'){
          return <div>
            <a style={{fontSize:'14px',color:'#d1b97f',}} onClick={()=>location.hash = '/after/AfterFollowExit/'+record.afterId+'/'+record.orderId+'/'+record.afterStatus}>{record.afterNum}</a>
          </div>
        }else {
          return <div>
            <a style={{ fontSize: '14px', color: '#d1b97f', }} onClick={() => location.hash = '/after/AfterFollowOther/' + record.afterId + '/' + record.afterStatus}>{record.afterNum}</a>
          </div>
        }

      }
    }, {
      title: '售后项目',
      dataIndex: 'afterProjectDesc',
      key: 'afterProjectDesc',
    }, {
      title: '项目类别',
      dataIndex: 'afterType',
      key: 'afterType',
    },{
      title: '提交时间',
      dataIndex: 'creationDate',
      key: 'creationDate',
    },{
      title: '状态',
      dataIndex: 'afterStatusDesc',
      key: 'afterStatusDesc',
    }/*,{
      title: '操作',
      dataIndex: 'grade',
      key: 'grade',
    }*/];

    const rowSelection = {
      onChange: this.onSelectChange,
    };
    const orderDetail = this.state.orderDetail;
    //orderDetail.yearPayAmount = formatCurrency(orderDetail.yearPayAmount);
    //orderDetail.policyAmount = formatCurrency(orderDetail.policyAmount);

    const addtionalData = this.state.addtionalData;
    const cusServiceData = this.state.cusServiceData;
    const pendingData = this.state.pendingData;
    const renewalList = this.state.renewalList;
    const commissionList = this.state.commissionList;
    const statusHisList = this.state.statusHisList;
    if(addtionalData.length > 0){
      this.state.addvisible = true;
    }else{
      this.state.addvisible = false;
    }

    let orderStatusColor;
    if(orderDetail.status === 'POLICY_EFFECTIVE'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'SIGNED'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'RESERVE_SUCCESS'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'NEW'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'NEED_REVIEW'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'SURRENDERING'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'SURRENDER_APPLY'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'SURRENDERED'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'PENDING'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'APPROVING'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'ARRIVAL'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'RESERVE_FAIL'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'RESERVING'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'APPROVED'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'CANCELLED'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'CONFIRMED'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'UNCONFIRMED'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'DATA_APPROVED'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'DATA_APPROVING'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'LEAVE'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'EXPIRED'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'SUSPENDED'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'DECLINED'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'RESERVE_CANCELLED'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'NEGOTIATE'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }else if(orderDetail.status === 'BUY_SUCCESS'){
      orderStatusColor = JSON.parse(localStorage.theme).themeColor;
    }


    const menu = (
      <Menu  style={{height : '350px',width : '290px' ,overflow:'scroll'}}>
        {
          statusHisList.map((item, index)=>
            <Menu.Item key={index}>{item.statusDate}&nbsp;{item.meaning}&nbsp;{item.description}</Menu.Item>
          )
        }
      </Menu>
    );

    //续保清单
    let renewalColumns = [{
      title: '',
      key: 1,
      children: [{
        title: '产品',
        dataIndex: 'itemName',
        key: 'itemName',
        fixed : true,
        width : '150px',
      }]
    }];
    let orderCurrencyCode  = this.state.codeList.orderCurrencyCode;
    let renewalStatus  = this.state.codeList.renewalStatus;
    let scrollNum =0;
    if(renewalList == null){
      this.state.renewvisible = false;
    }else{
      if(renewalList.length > 0){
        this.state.renewvisible = true;
        for (let i = 2; i <= 100; i++) {
          // if (renewalList[0]['renewalDate'+i] || renewalList[1]['renewalDate'+i]) {
          if (i <= orderDetail.payPeriods + 1) {
            scrollNum = i;
            renewalColumns.push({
              title: '第' + i + '期',
              key: i,
              children: [{
                title: '预计续保日',
                dataIndex: 'renewalDate'+i,
                key: 'renewalDate'+i,
                render(text, record) {
                  return <span style={{fontSize:'14px'}}>{util.dateConvertymd(text)}</span>
                }
              },{
                title: '币种',
                dataIndex: 'currency'+i,
                key: 'currency'+i,
                render(text, record) {
                  return <span style={{fontSize:'14px'}}>{util.getCodeMeaning(text,orderCurrencyCode)}</span>
                }
              },{
                title: '预计保费',
                dataIndex: 'totalAmount'+i,
                key: 'totalAmount'+i,
                render(text, record) {
                  return <span style={{fontSize:'14px'}}>{util.formatCurrency(text)}</span>
                }
              },{
                title: '状态',
                dataIndex: 'renewalStatus'+i,
                key: 'renewalStatus'+i,
                render(text, record) {
                  return <span style={{fontSize:'14px'}}>{util.getCodeMeaning(text,renewalStatus)}</span>
                }
              }]
            });
          } else {
            break;
          }
        }
        if(scrollNum > 3){
          scrollNum = (1+(.34)*scrollNum)*100
        }
      }else{
        this.state.renewvisible = false;
      }
    }

    //佣金明细
    let commissionCol = [];
    if (this.props.prePage == 'team') {
      commissionCol.push({
        title: '',
        key: '-1',
        children: [{
          title: '人员',
          dataIndex: 'commissionPerson',
          key: 'commissionPerson',
          width : '150px',
        }]
      });
    }
    commissionCol.push({
      title: '',
      key: '0',
      children: [{
        title: '产品',
        dataIndex: 'itemName',
        key: 'itemName',
        width : '150px',
      }]
    }, {
      title: '第1年',
      key: '1',
      children: [{
        title: '佣金率',
        width: '100px',
        dataIndex: 'theFirstYear',
        key: 'theFirstYear',
        render: (text, record, index) => {
          if (text) {
            return (text*100).toFixed(2)+'%';
          }else if(text === 0){
            return 0
          }else {
            return '';
          }
        }
      },{
        title: '应派',
        width: '100px',
        dataIndex: 'firstYearAmount',
        key: 'firstYearAmount',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      },{
        title: '实派',
        width: '100px',
        dataIndex: 'firstYearActual',
        key: 'firstYearActual',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      }]
    }, {
      title: '第2年',
      key: '2',
      children: [{
        title: '佣金率',
        width: '100px',
        dataIndex: 'theSecondYear',
        key: 'theSecondYear',
        render: (text, record, index) => {
          if (text) {
            return (text*100).toFixed(2)+'%';
          }else if(text === 0){
            return 0
          }else {
            return '';
          }
        }
      },{
        title: '应派',
        width: '100px',
        dataIndex: 'secondYearAmount',
        key: 'secondYearAmount',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      },{
        title: '实派',
        width: '100px',
        dataIndex: 'secondYearActual',
        key: 'secondYearActual',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      }]
    }, {
      title: '第3年',
      key: '3',
      children: [{
        title: '佣金率',
        width: '100px',
        dataIndex: 'theThirdYear',
        key: 'theThirdYear',
        render: (text, record, index) => {
          if (text) {
            return (text*100).toFixed(2)+'%';
          }else if(text === 0){
            return 0
          }else {
            return '';
          }
        }
      },{
        title: '应派',
        width: '100px',
        dataIndex: 'thirdYearAmount',
        key: 'thirdYearAmount',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      },{
        title: '实派',
        width: '100px',
        dataIndex: 'thirdYearActual',
        key: 'thirdYearActual',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      }]
    }, {
      title: '第4年',
      key: '4',
      children: [{
        title: '佣金率',
        width: '100px',
        dataIndex: 'theFourthYear',
        key: 'theFourthYear',
        render: (text, record, index) => {
          if (text) {
            return (text*100).toFixed(2)+'%';
          }else if(text === 0){
            return 0
          }else {
            return '';
          }
        }
      },{
        title: '应派',
        width: '100px',
        dataIndex: 'fourthYearAmount',
        key: 'fourthYearAmount',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      },{
        title: '实派',
        width: '100px',
        dataIndex: 'fourthYearActual',
        key: 'fourthYearActual',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      }]
    }, {
      title: '第5年',
      key: '5',
      children: [{
        title: '佣金率',
        width: '100px',
        dataIndex: 'theFifthYear',
        key: 'theFifthYear',
        render: (text, record, index) => {
          if (text) {
            return (text*100).toFixed(2)+'%';
          }else if(text === 0){
            return 0
          }else {
            return '';
          }
        }
      },{
        title: '应派',
        width: '100px',
        dataIndex: 'fifthYearAmount',
        key: 'fifthYearAmount',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      },{
        title: '实派',
        width: '100px',
        dataIndex: 'fifthYearActual',
        key: 'fifthYearActual',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      }]
    }, {
      title: '第6年',
      key: '6',
      children: [{
        title: '佣金率',
        width: '100px',
        dataIndex: 'theSixthYear',
        key: 'theSixthYear',
        render: (text, record, index) => {
          if (text) {
            return (text*100).toFixed(2)+'%';
          }else if(text === 0){
            return 0
          }else {
            return '';
          }
        }
      },{
        title: '应派',
        width: '100px',
        dataIndex: 'sixthYearAmount',
        key: 'sixthYearAmount',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      },{
        title: '实派',
        width: '100px',
        dataIndex: 'sixthYearActual',
        key: 'sixthYearActual',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      }]
    }, {
      title: '第7年',
      key: '7',
      children: [{
        title: '佣金率',
        width: '100px',
        dataIndex: 'theSeventhYear',
        key: 'theSeventhYear',
        render: (text, record, index) => {
          if (text) {
            return (text*100).toFixed(2)+'%';
          }else if(text === 0){
            return 0
          }else {
            return '';
          }
        }
      },{
        title: '应派',
        width: '100px',
        dataIndex: 'seventhYearAmount',
        key: 'seventhYearAmount',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      },{
        title: '实派',
        width: '100px',
        dataIndex: 'seventhYearActual',
        key: 'seventhYearActual',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      }]
    }, {
      title: '第8年',
      key: '8',
      children: [{
        title: '佣金率',
        width: '100px',
        dataIndex: 'theEightYear',
        key: 'theEightYear',
        render: (text, record, index) => {
          if (text) {
            return (text*100).toFixed(2)+'%';
          }else if(text === 0){
            return 0
          }else {
            return '';
          }
        }
      },{
        title: '应派',
        width: '100px',
        dataIndex: 'eightYearAmount',
        key: 'eightYearAmount',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      },{
        title: '实派',
        width: '100px',
        dataIndex: 'eightYearActual',
        key: 'eightYearActual',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      }]
    }, {
      title: '第9年',
      key: '9',
      children: [{
        title: '佣金率',
        width: '100px',
        dataIndex: 'theNinthYear',
        key: 'theNinthYear',
        render: (text, record, index) => {
          if (text) {
            return (text*100).toFixed(2)+'%';
          }else if(text === 0){
            return 0
          }else {
            return '';
          }
        }
      },{
        title: '应派',
        width: '100px',
        dataIndex: 'ninthYearAmount',
        key: 'ninthYearAmount',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      },{
        title: '实派',
        width: '100px',
        dataIndex: 'ninthYearActual',
        key: 'ninthYearActual',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      }]
    }, {
      title: '第10年',
      key: '10',
      children: [{
        title: '佣金率',
        width: '100px',
        dataIndex: 'theTenthYear',
        key: 'theTenthYear',
        render: (text, record, index) => {
          if (text) {
            return (text*100).toFixed(2)+'%';
          }else if(text === 0){
            return 0
          }else {
            return '';
          }
        }
      },{
        title: '应派',
        width: '100px',
        dataIndex: 'tenthYearAmount',
        key: 'tenthYearAmount',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      },{
        title: '实派',
        width: '100px',
        dataIndex: 'tenthYearActual',
        key: 'tenthYearActual',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          }else if(text === 0){
            return 0
          } else {
            return '';
          }
        }
      }]
    }
  );

  if(this.state.teamOrdCommission == true){
    commissionCol.push({
      title: '',
      key: '0',
      fixed:'right',
      children: [{
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width : '150px',
        render: (text, record,index) => {
          if(record.commissionPerson == '下级佣金率'){
            return (
              <div>
                <span>
                  <a onClick={this.detClick.bind(this,record)} style={{ marginRight: 5, color: 'rgb(209, 185, 127)' }}>编辑</a>
                </span>
              </div>
            );
          }
        }
      }]
    })
  }

    const { form } = this.props;
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
    };
    const formItemLayoutLong = {
      labelCol: {
        xs: {span: 5},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 25},
        sm: {span: 18},
      },
    };

    return (
      <div >
        <Form onSubmit={this.handleSubmit}>
          {/*订单详情*/}
          <div>
            <div style={{margin:'28px 12px',paddingBottom:'28px'}}>
              <span className={commonStyle.iconL}></span>
              <span className={commonStyle.iconR}>订单详情<span style={{fontSize:'18px'}}>(订单编号：{orderDetail.orderNumber})</span></span>
              {
                this.state.orderDetail.updateStatus ?
                  <span style={{float:'right'}}>
                    <Button type='primary' style={{marginLeft:8,fontSize:'16px',height:'40px',width:'140px',fontWeight:'normal'}} onClick={()=>location.hash = '/order/insurance/' + orderDetail.orderId}>
                      资料修改
                    </Button>
                  </span>
                  :
                  ""
              }
              <span style={{float:'right'}}>
                { orderDetail.status === 'DATA_APPROVING' ||
                  orderDetail.status === 'DATA_APPROVED' ||
                  orderDetail.status === 'PRE_APPROVING' ||
                  orderDetail.status === 'PRE_APPROVED' ||
                  orderDetail.status === 'NEED_REVIEW' ||
                  orderDetail.status === 'RESERVE_CANCELLED' ||
                  orderDetail.status === 'RESERVING' ||
                  orderDetail.status === 'RESERVE_SUCCESS' ||
                  orderDetail.status === 'RESERVE_FAIL' ||
                  orderDetail.status === 'ARRIVAL'
                  ?
                  <Button type='primary' style={{marginLeft:8,fontSize:'16px',height:'40px',width:'140px',fontWeight:'normal'}} onClick={this.cancelOrder.bind(this)} >
                  取消预约
                </Button> : ''
                }
              </span>
            </div>
            <div style={{marginTop:'28px'}}>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}} label="当前状态">
                    <span style={{color:orderStatusColor,fontSize:'16px'}}>{orderDetail.statusDesc}</span>
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}} label="日志状态跟进">
                    {getFieldDecorator('orderStatusFollow', {})(
                      <Button  type='primary' onClick={this.orderShowLog.bind(this,orderDetail)} style={{fontSize:'16px',height:'35px',width:'60%',fontWeight:'normal'}} >订单日志状态跟进</Button>

                      /*<Dropdown overlay={menu} >
                      <Button type='primary' style={{fontSize:'16px',height:'35px',width:'100%',fontWeight:'normal'}}>
                      订单状态跟进 <Icon type="down" />
                      </Button>
                      </Dropdown>*/
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="保单编号">
                    {getFieldDecorator('policyNumber', {
                      initialValue:orderDetail.policyNumber || ''
                    })(
                      <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="缴费编号">
                    {getFieldDecorator('payNumber', {
                      initialValue:orderDetail.payNumber || ''
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="客户编号">
                    {getFieldDecorator('customerNumber', {
                      initialValue:orderDetail.customerNumber || ''
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
                {/*<Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="渠道所属公司">
                    {getFieldDecorator('companyChannelId', {
                      initialValue:orderDetail.companyChannelId || ''
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>*/}

                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="渠道">
                    {getFieldDecorator('channelId', {
                      initialValue:orderDetail.channelName || ''
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                {/*<Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="业务行政">
                    {getFieldDecorator('contractRoleId', {
                      initialValue:orderDetail.contractRoleId || ''
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>*/}
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="投保人">
                    {getFieldDecorator('applicantCustomerId', {
                      initialValue:orderDetail.applicant || ''
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="受保人">
                    {getFieldDecorator('insurantCustomerId', {
                      initialValue:orderDetail.insurant || ''
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>

              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="主险产品">
                    {getFieldDecorator('itemId', {
                      initialValue:orderDetail.item || ''
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="币种">
                    {getFieldDecorator('currency', {
                      initialValue: orderDetail.currencyMeaning || '',
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>

              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="缴费方式">
                    {getFieldDecorator('payMethod', {
                      initialValue:orderDetail.payMethodMeaning || ''
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="主险首期保费">
                    {getFieldDecorator('yearPayAmount', {
                      initialValue: formatCurrency(orderDetail.yearPayAmount) || ''
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>

              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}} label="保额">
                    {getFieldDecorator('policyAmount', {
                      initialValue:formatCurrency(orderDetail.policyAmount) || ''
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="保监征费">
                    {getFieldDecorator('iaLevies', {
                      initialValue: formatCurrency(orderDetail.iaLevies) || ''
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>

              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="首期总保费">
                    {getFieldDecorator('firstSumPremium', {
                      initialValue: formatCurrency(orderDetail.firstSumPremium) || ''
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}} label="保单快递号">
                    {getFieldDecorator('expressNum', {
                      initialValue:orderDetail.expressNumber || ''
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}} label="计划书下载">
                    <span style={{float:'left'}}>
                      <Download fileId={orderDetail.planFileId}>
                        <Button type="default" disabled={orderDetail.planFileId?false:true}><Icon type="download" style={{color: '#d1b97f'}}/></Button>
                      </Download>
                    </span>
                  </FormItem>
                </Col>
              </Row>
            </div>
          </div>

          {/*附加险信息*/}
          {
            this.state.addvisible &&
            <div>
              <div style={{margin:'28px 12px',paddingBottom:'28px',borderBottom:'1px solid #dbdbdb'}}>
                <span className={commonStyle.iconL}></span>
                <span className={commonStyle.iconR}>附加险信息</span>
              </div>
              <div style={{marginTop:'28px'}}>
                <Table columns={addtionalColumns} scroll={{x:'100%'}}
                       dataSource={addtionalData} bordered pagination={true} />
              </div>
            </div>
          }

          {/*时间信息*/}
            <div>
              <div style={{margin:'28px 12px',paddingBottom:'28px',borderBottom:'1px solid #dbdbdb'}}>
                <span className={commonStyle.iconL}></span>
                <span className={commonStyle.iconR}>时间信息</span>
              </div>
              <div style={{marginTop:'28px'}}>
                <Row gutter={40} >
                  <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="提交时间">
                      {getFieldDecorator('submitDate', {
                        initialValue: (orderDetail.submitDate || '').substr(0,16)
                      })(
                        <Input size="large" readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="签单时间">
                      {getFieldDecorator('reserveDate', {
                        initialValue: (orderDetail.reserveDate || '').substr(0,16)
                      })(
                        <Input size="large" readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={40} >
                  <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="保单生效日">
                      {getFieldDecorator('effectiveDate', {
                        initialValue: (orderDetail.effectiveDate||'').substr(0,10)
                      })(
                        <Input size="large" readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="批核日">
                      {getFieldDecorator('approveDate', {
                        initialValue: (orderDetail.approveDate||'').substr(0,10)
                      })(
                        <Input size="large" readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={40} >
                  <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="预计冷静期">
                      {getFieldDecorator('expectCoolDate', {
                        initialValue: (orderDetail.expectCoolDate||'').substr(0,10)
                      })(
                        <Input size="large" readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="首期保费日">
                      {getFieldDecorator('firstPayDate', {
                        initialValue: (orderDetail.firstPayDate||'').substr(0,10)
                      })(
                        <Input size="large" readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={40} >
                  <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="保费到期日">
                      {getFieldDecorator('renewalDueDate', {
                        initialValue: (orderDetail.renewalDueDate || '').substr(0,10)
                      })(
                        <Input size="large" readOnly={true} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="当前期数">
                      {getFieldDecorator('payPeriods', {
                        initialValue:orderDetail.payPeriods || ''
                      })(
                        <Input size="large" readOnly={true} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
          <br />

          {/*信息确认*/}
          <div style={{margin:'0px 14px 0px 12px'}}>
            <Tabs defaultActiveKey="1" type="card">
              <TabPane tab="预约确认信息" key="1">
                <Row gutter={40} style={{ marginLeft: -16, marginRight: 0, padding: 0 }}>
                  <Col span={11} style={{ margin: 0, padding: 0 }}>
                    <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="联络人">
                      {getFieldDecorator('contactPerson', {
                        initialValue:orderDetail.contactPerson || ''
                      })(
                        <Input size="large" readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={11} style={{ margin: 0, padding: 0 }}>
                    <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="联络电话">
                      {getFieldDecorator('contactPhone', {
                        initialValue:orderDetail.contactPhone || '',
                      })(
                        <Input size="large" readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={40} style={{ marginLeft: -16, marginRight: 0, padding: 0 }}>
                  <Col span={22} style={{ margin: 0, padding: 0 }}>
                    <FormItem {...formItemLayoutLong} className={styles.formitem_sty} style={{fontSize:'16px',width : '100%'}}  label="预约到达时间">
                      {getFieldDecorator('reserveArrivalDate', {
                        initialValue: (orderDetail.reserveArrivalDate || '').substr(0, 16)
                      })(
                        <Input size="large" readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={40} style={{ marginLeft: -16, marginRight: 0, padding: 0 }}>
                  <Col span={22} style={{ margin: 0, padding: 0 }}>
                    <FormItem {...formItemLayoutLong} className={styles.formitem_sty} style={{fontSize:'16px',width : '100%'}}  label="见面地址">
                      {getFieldDecorator('meetAddress', {
                        initialValue:orderDetail.meetAddress || ''
                      })(
                        <Input size="large" readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={40} style={{ marginLeft: -16, marginRight: 0, padding: 0 }}>
                  <Col span={22} style={{ margin: 0, padding: 0 }}>
                    <FormItem {...formItemLayoutLong} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="签单地址">
                      {getFieldDecorator('signAddress', {
                        initialValue:orderDetail.signAddress || ''
                      })(
                        <Input size="large" readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </TabPane>
              {
                JSON.parse(localStorage.user).userType == "ADMINISTRATION" ? ""
                :
                this.props.prePage != 'introduction' ?
                  <TabPane tab="佣金明细" key="2">
                    <div className={styles.item_div}>
                      <div className={style.order_table}>
                    <Table rowKey="key" scroll={{x:'300%'}} bordered pagination={false}
                          dataSource={commissionList} columns={commissionCol} />
                      </div>
                        <OrdCommissionMd
                          visible={this.state.commissionVisible}
                          record={this.state.commissionRecord}
                          callback={this.callback.bind(this)}
                        />
                    </div>
                  </TabPane>
                  :
                  ''
              }
              <TabPane tab="Pending照会" key="3">
                <div className={styles.item_div}>
                  <div className={style.order_table}>
                    <Table columns={pendingColumns} dataSource={pendingData} bordered
                      scroll={{ x: '100%' }} pagination={false} />
                  </div>
                </div>
              </TabPane>
              {
                this.props.prePage == 'personal' ?
                  <TabPane  tab={<span onClick={this.lod.bind(this)}>预约资料</span>} key="4">
                  </TabPane>
                  :
                  ''
              }
              <TabPane tab="售后/续保" key="5">
                {/*续保清单*/}
                <div>
                  {
                    this.state.renewvisible &&
                    <div>
                      <div style={{margin:'28px 0px',paddingBottom:'28px',borderBottom:'1px solid #dbdbdb'}}>
                        <span className={commonStyle.iconL}></span>
                        <span className={commonStyle.iconR}>续保清单</span>
                        <Button  style={{float:'right',fontSize:'20px',width : '140px',height:'40px',backgroundColor:'#d1b97f',color:'white'}}  onClick={()=>location.hash = '/after/AfterNew/RENEWAL/续保/'+this.props.orderId}>申请售后</Button>
                      </div>
                      <div style={{marginTop:'28px', marginBottom: '28px'}}>
                        <Table rowKey="key" scroll={{x: `${scrollNum}%`}} dataSource={renewalList.reverse()}
                              columns={renewalColumns} bordered pagination={false} />
                      </div>
                    </div>
                  }
                  <Row gutter={40} >
                    <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                      <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="本期保监征费">
                        {getFieldDecorator('nextIaLevies', {
                          initialValue:formatCurrency(orderDetail.nextIaLevies) || ''
                        })(
                          <Input size="large" readOnly={true}/>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                      <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="回馈余额">
                        {getFieldDecorator('feedbackBalance', {
                          initialValue:formatCurrency(orderDetail.feedbackBalance) || ''
                        })(
                          <Input size="large" readOnly={true}/>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                      <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="账户余额">
                        {getFieldDecorator('accountBalance', {
                          initialValue:formatCurrency(orderDetail.accountBalance) || ''
                        })(
                          <Input size="large" readOnly={true}/>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                      <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="付款方法">
                        {getFieldDecorator('balancePaymentMethod',{
                          initialValue:orderDetail.balancePaymentMethod || ''
                        })(
                          <Select disabled={true} style={{color:'#333'}}>
                            {
                              bpmListCode &&
                              bpmListCode.map((item, index)=>
                                <Option value={item.value} key={index}>{item.meaning}</Option>
                              )
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  {
                    orderDetail.balancePaymentMethod === 'AUTOPAY' &&
                    <Row gutter={40} >
                      <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                        <FormItem {...formItemLayout} label='DDA状态' style={{marginBottom:'0'}}>
                          {getFieldDecorator('ddaFlag', {
                            initialValue:orderDetail.ddaFlag || ''
                          })(
                            <Select disabled={true} style={{color: '#333'}}>
                              {
                                ddaStatus &&
                                ddaStatus.map((item, index)=>
                                  <Option value={item.value} key={index}>{item.meaning}</Option>
                                )
                              }
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      {
                        orderDetail.ddaFlag === 'DDA_SUCCESS' &&
                        <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                          <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="DDA提交日期">
                            {getFieldDecorator('ddaSubmitDate',{
                              initialValue:orderDetail.ddaSubmitDate?util.dataFormat(orderDetail.ddaSubmitDate):''
                            })(
                              <Input readOnly={true} />
                            )}
                          </FormItem>
                        </Col>
                      }
                      {
                        orderDetail.ddaFlag === 'DDA_SUCCESS' &&
                        <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                          <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="DDA生效日期">
                            {getFieldDecorator('ddaEffectiveDate',{
                              initialValue:orderDetail.ddaEffectiveDate?util.dataFormat(orderDetail.ddaEffectiveDate):''
                            })(
                              <Input readOnly={true} />
                            )}
                          </FormItem>
                        </Col>
                      }
                      {
                        orderDetail.ddaFlag === 'DDA_SUCCESS' &&
                        <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                          <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="DDA账户号码">
                            {getFieldDecorator('ddaAccountNo',{
                              initialValue:orderDetail.ddaAccountNo || ''
                            })(
                              <Input readOnly={true} />
                            )}
                          </FormItem>
                        </Col>
                      }
                      {
                        orderDetail.ddaFlag === 'DDA_SUCCESS' &&
                        <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                          <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="DDA自动转账日期">
                            {getFieldDecorator('ddaAutoTransferDate',{
                              initialValue:orderDetail.ddaAutoTransferDate || ''
                            })(
                              <Input readOnly={true} />
                            )}
                          </FormItem>
                        </Col>
                      }
                      {
                        orderDetail.ddaFlag === 'DDA_FAIL' &&
                        <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                          <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="DDA失败原因">
                            {getFieldDecorator('ddaFailCause',{
                              initialValue:orderDetail.ddaFailCause || ''
                            })(
                              <Input readOnly={true} />
                            )}
                          </FormItem>
                        </Col>
                      }
                    </Row>
                  }

                </div>
                {/*售后*/}
                <div>
                  <div style={{margin:'28px 0px',paddingBottom:'28px',borderBottom:'1px solid #dbdbdb'}}>
                    <span className={commonStyle.iconL}></span>
                    <span className={commonStyle.iconR}>售后</span>
                  </div>
                  <div style={{marginTop:'28px'}}>
                    <Table columns={cusServiceColumns} dataSource={cusServiceData} bordered
                           scroll={{x:'100%'}} pagination={true} />
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Form>
      </div>
    );
  }
}


export default Form.create()(OrderDetailComponents);
