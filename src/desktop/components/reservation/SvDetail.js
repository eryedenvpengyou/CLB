import React from 'react';
import { Form} from 'antd';
import Modals from '../common/modal/Modal';
import * as common from '../../utils/common';
import * as service from '../../services/reservation';
import SvDetailHPV from "./SvDetailHPV";
import SvDetailHSYD from "./SvDetailHSYD";
import SvDetailJDYD from "./SvDetailJDYD";
import SvDetailTTQZ from "./SvDetailTTQZ";
import SvDetailZCFW from "./SvDetailZCFW";
import SvDetailYHKH from "./SvDetailYHKH";
import SvDetailZQKH from "./SvDetailZQKH";

class SvDetail  extends React.Component {
  state={
    detail: {},
    detailTab:'',
    ordCustomerId:''
  };

  componentWillMount() {
    const midClass = this.props.midClass;
    const orderId = this.props.orderId;

    if(!orderId || orderId == '000'){
      let detail = {
        disableFlag: false,
        status: 'CREATE',
        relatedOrderId: this.props.reId,
        relatedOrderNumber: this.props.reNumber,
      };
      this.setState({detail},()=>{
        this.setDetailTad(midClass);
      });
    }else{
      //查看增值服务
      service.fetchServiceDetail({orderId: orderId}).then((data)=>{
        if(data.success){
          let detail = data.rows[0] || {};
          detail.disableFlag = data.rows[0].status == 'NEED_REVIEW'? false : true;
          if(detail.status == 'WAIT_PAY'){
            const params ={
              sourceId: detail.orderId,
              sourceType: 'ORDER',
            };
            service.getPayOrderInfo(params).then((newData)=>{
              if(newData.success){
                const creationDate = newData.rows[0].creationDate;
                const payLimitTime = newData.rows[0].payLimitTime;
                let seconds = 0;
                if(isNaN(payLimitTime)){
                  seconds = 0;
                }else{
                  seconds = payLimitTime * 60 * 1000;
                }
                let startTime = new Date(creationDate).getTime() + seconds;
                let endTime = new Date().getTime();

                if(startTime > endTime){
                  detail.status = 'WAIT_PAY';
                  detail.payTime = creationDate;
                  detail.payLimitTime = payLimitTime;
                }else{
                  detail.status = 'RESERVE_CANCELLED';
                }

                this.setState({detail},()=>{
                  this.setDetailTad(midClass);
                });
              }
            });
          }else{
            this.setState({detail},()=>{
              this.setDetailTad(midClass);
            });
          }
        }
      });
      service.fetchServiceCustomerDetail({orderId:orderId}).then((data)=>{
        if(data.success && data.rows[0]){
          this.setState({
            ordCustomerId:data.rows[0].ordCustomerId
          })
        }
      })
    }
  }


  //跳转 控制器
  setDetailTad(midClass){
    let detailTab = '';
    switch (midClass) {
      case 'HPV': detailTab = <SvDetailHPV
                      detail={this.state.detail}
                      itemId={this.props.itemId}
                      form={this.props.form}
                      reload={this.reload.bind(this)}
                      callback1={this.callback1.bind(this)}
                      callback2={this.callback2.bind(this)}/>; break;

      case 'HSYD': detailTab = <SvDetailHSYD
                      detail={this.state.detail}
                      itemId={this.props.itemId}
                      form={this.props.form}
                      reload={this.reload.bind(this)}
                      callback1={this.callback1.bind(this)}
                      callback2={this.callback2.bind(this)}/>; break;

      case 'JDYD': detailTab = <SvDetailJDYD
                      detail={this.state.detail}
                      itemId={this.props.itemId}
                      form={this.props.form}
                      reload={this.reload.bind(this)}
                      callback1={this.callback1.bind(this)}
                      callback2={this.callback2.bind(this)}/>; break;

      case 'TTQZ': detailTab = <SvDetailTTQZ
                      detail={this.state.detail}
                      itemId={this.props.itemId}
                      form={this.props.form}
                      reload={this.reload.bind(this)}
                      callback1={this.callback1.bind(this)}
                      callback2={this.callback2.bind(this)}/>; break;

      case 'YHKH': detailTab = <SvDetailYHKH
                      detail={this.state.detail}
                      itemId={this.props.itemId}
                      form={this.props.form}
                      reload={this.reload.bind(this)}
                      callback1={this.callback1.bind(this)}
                      callback2={this.callback2.bind(this)}/>; break;

      case 'ZCFW': detailTab = <SvDetailZCFW
                      detail={this.state.detail}
                      itemId={this.props.itemId}
                      form={this.props.form}
                      reload={this.reload.bind(this)}
                      callback1={this.callback1.bind(this)}
                      callback2={this.callback2.bind(this)}/>; break;

      case 'ZQKH': detailTab = <SvDetailZQKH
                      detail={this.state.detail}
                      itemId={this.props.itemId}
                      form={this.props.form}
                      reload={this.reload.bind(this)}
                      callback1={this.callback1.bind(this)}
                      callback2={this.callback2.bind(this)} />; break;

      default: break;
    }
    this.setState({detailTab});
  }


  //状态改变重新加载界面
  reload(){
    const midClass = this.props.midClass;
    const orderId = this.props.orderId;
    const itemId = this.props.itemId;
    const params ={orderId:orderId,};
    //查看增值服务
    service.fetchAddService(params).then((data)=>{
      if(data.success){
        let detail = data.rows[0] || {};
        detail.disableFlag = data.rows[0].status == 'NEED_REVIEW'? false : true;
        if(detail.status == 'WAIT_PAY'){
            const params ={
              sourceId: detail.orderId,
              sourceType: 'ORDER',
            };
            service.getPayOrderInfo(params).then((newData)=>{
              if(newData.success){
                const creationDate = newData.rows[0].creationDate;
                const payLimitTime = newData.rows[0].payLimitTime;
                const curDate = detail.curDate;
                let seconds = 0;
                if(isNaN(payLimitTime)){
                  seconds = 0;
                }else{
                  seconds = payLimitTime * 60 * 1000;
                }
                let startTime = new Date(creationDate).getTime() + seconds;
                let endTime = new Date(curDate).getTime();

                if(startTime > endTime){
                  detail.status = 'WAIT_PAY';
                  detail.payTime = creationDate;
                  detail.payLimitTime = payLimitTime;
                }else{
                  detail.status = 'RESERVE_CANCELLED';
                }

                this.setState({detail},()=>{
                  this.setDetailTad(midClass);
                });
              }
            });
          this.setState({detail},()=>{
           this.setDetailTad(midClass);
          });
        }else{
          this.setState({detail},()=>{
            this.setDetailTad(midClass);
          });
        }
      }
    });
  }


  //第一个按钮对应的函数
  callback1(detail){

    if(detail && detail.status == 'NEED_REVIEW'){
      Modals.warning(this.ensureCancel.bind(this),'资料正在审核中，确定取消当前预约？');

    }else if(detail && detail.status == 'CREATE'){
      //新建状态下 取消按钮对应的函数
      window.history.back();

    }else{
      Modals.warning(this.ensureCancel.bind(this),'是否确定取消预约？');
    }
  }


  //第二个按钮对应的 函数
  callback2(status, dataSource){
    console.log(status, dataSource)
    //取消预约
    if(status == 'RESERVE_CANCELLED'){

    //预约资料审核中
    }if(status == 'RESERVING'){

    //预约成功
    }else if(status == 'RESERVE_SUCCESS'){

    //需复查
    }else if(status == 'NEED_REVIEW'){
      this.update(dataSource);

    //待支付
    }else if(status == 'WAIT_PAY'){
      Modals.warning(this.ensurePay.bind(this),'订单成功后，如需撤销退款，需在工作日内提前24小时提交撤销申请。确认后支付。');

    }else if(status == 'CREATE'){
      this.submit(dataSource);
    }
  }


  //点击取消预约
  ensureCancel(flag){
    if(!flag) return;

    //将状态变为 取消
    let detail = this.state.detail;
    detail.status = 'RESERVE_CANCELLED';
    detail.__status = 'update';
    service.submitAddService([detail]).then((data)=>{
      if(data.success){
        const midClass = this.props.midClass;
        detail = data.rows[0] || {};
        detail.disableFlag = detail == 'NEED_REVIEW'? false : true;
        this.setState({detail: data.rows[0] || {}},()=>{
          this.setDetailTad(midClass);
        });
        Modals.success({content:'取消预约成功！', url:'/portal/reservation/2'});
      }else{
        Modals.error({content:'取消预约失败失败！'});
      }
    });
  }


  //确认支付
  ensurePay(flag){
    if(flag){
      // location.hash = '/portal/payOnline/ORDER/'+this.props.orderId;
      window.open('/#/portal/payOnline/ORDER/'+this.props.orderId);
      Modals.warning(this.reload.bind(this),{
        content:'请在新打开的界面上完成支付！',
        cancel: '支付成功',
        ensure: '支付失败',
      });
    }
  }


  //新建预约
  submit(dataSource) {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let orderBody = values;
        let orderCustomer = {}
        //客户姓名和ID
        if (values.applicantCustomerId.value) {
          orderBody.applicantCustomerId = values.applicantCustomerId.value;
        }

        //新建订单初始化
        orderBody.channelId = values.channelId? values.channelId.value? values.channelId.value: JSON.parse(localStorage.user||'{}').relatedPartyId: JSON.parse(localStorage.user||'{}').relatedPartyId;
        orderBody.itemId = this.props.itemId;                       //产品编号
        orderBody.valueaddType = this.props.midClass;               //增值服务类型
        orderBody.__status = "add";
        orderBody.orderType = "VALUEADD";                           //订单类型
        orderBody.status = 'DATA_APPROVING';                        //增值服务状态
        orderBody.customerType = 'APPLICANT';                       //客户类型  投保人
        orderBody.hisStatus = 'DATA_APPROVING';                     //日志状态
        orderBody.hisDesc = '预约资料审核中';                        //日志描述
        orderBody.submitDate = common.formatSecond(new Date());     //数据提交时间

        //预约时间
        orderBody.signDate = orderBody.reserveDate = common.formatSecond(new Date(orderBody.reserveDate));

        //酒店入住时间
        if(orderBody.checkinDate){
          orderBody.checkinDate = common.formatSecond(new Date(orderBody.checkinDate));
          orderBody.signDate = orderBody.checkinDate;
        }
        //酒店结束时间
        if(orderBody.checkoutDate){
          orderBody.checkoutDate = common.formatSecond(new Date(orderBody.checkoutDate));
        }
        // 酒店房间信息
        if (orderBody.valueaddType === 'JDYD' && dataSource && dataSource.length > 0) {
          orderBody.ordSubscribeRoom = dataSource
        }

        //关联 保单订单号
        if(values.relatedOrderId){
          if (values.relatedOrderId.value) {
            orderBody.relatedOrderNumber = values.relatedOrderId.meaning;
            orderBody.relatedOrderId = values.relatedOrderId.value;
          } else {
            orderBody.relatedOrderId = null;
          }
        }

        //价格
        if (this.props.midClass == 'HPV') {
          orderBody.price = parseFloat(orderBody.price);
          orderBody.reserveEndDate
          = common.formatSecond(new Date(orderBody.reserveEndDate
          ));
        }

        if (dataSource && dataSource.length > 1 && orderBody.valueaddType !== 'JDYD') {

          let ordTeamVisitor = [];
          for(let i = 1; i< dataSource.length ; i++){
            ordTeamVisitor.push(dataSource[i]);
          }
          orderBody.ordTeamVisitor = ordTeamVisitor;
        }else if (dataSource && dataSource.length <= 1  && orderBody.valueaddType !== 'JDYD') {
          Modals.error({content:'请至少添加一条L签访客信息！'});
          return;
        }
        //证券开户
        if(this.props.midClass == 'ZQKH'){
          let birthday
          let birthday_d = values.birthDate._d;
          birthday = birthday_d.getFullYear() + '-' + (birthday_d.getMonth() + 1) + '-' + birthday_d.getDate() + " " +
            "00" + ":" + "00" + ":" + "00";
          orderBody.birthDate = birthday;
          orderBody.customerNation = (values.mailingArea)[0];
          orderBody.customerProvince = (values.mailingArea)[1];
          orderBody.customerCity = (values.mailingArea)[2];
          orderCustomer.currentAssets = values.currentAssets;
          orderCustomer.fixedAssets = values.fixedAssets;
          orderCustomer.liabilities = values.liabilities;
          orderCustomer.identityFileId = values.identityFileId ? values.identityFileId[0].response.file.fileId:'';
          orderCustomer.addressFileId = values.addressFileId ? values.addressFileId[0].response.file.fileId:'';
          orderCustomer.cardFileId = values.cardFileId ? values.cardFileId[0].response.file.fileId:'';
          orderCustomer.customerType = 'INSURANT'
        }
        console.log(orderBody)
        // return
        service.submitAddService([orderBody]).then((orderData) => {
          if (orderData.success) {
            if(this.props.midClass == 'ZQKH'){
              orderCustomer.orderId = orderData.rows[0].orderId
              service.submitOrdCustomer([orderCustomer]).then((data) =>{
                Modals.success({content:"预约资料已提交，请耐心等待审核！",url:'/portal/reservation/2', closable:false, count:2});
              })
            } else {
              Modals.success({ content: "预约资料已提交，请耐心等待审核！", url: '/portal/reservation/2', closable: false, count: 2 });
            }
          } else {
            Modals.error({content:"预约提交失败："+orderData.message});
          }
        });
      }
    });
  }


  //更新
  update(dataSource){
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let orderBody = values;
        let orderCustomer = {}
        //客户姓名和ID
        if (values.applicantCustomerId.value) {
          orderBody.applicantCustomerId = values.applicantCustomerId.value;
        }
        //修改订单初始化
        orderBody.channelId = values.channelId? values.channelId.value? values.channelId.value: JSON.parse(localStorage.user||'{}').relatedPartyId: JSON.parse(localStorage.user||'{}').relatedPartyId;
        orderBody.orderType = "VALUEADD";                                 //订单类型
        orderBody.status = 'DATA_APPROVING';                              //增值服务状态
        orderBody.customerType = 'APPLICANT';                             //客户类型  投报人

        orderBody.hisStatus = 'DATA_APPROVING';                           //日志状态
        orderBody.hisDesc = '订单状态变更为预约资料审核中,请耐心等候!';      //日志描述

        orderBody.orderId = this.props.orderId;                           //订单Id
        orderBody.orderNumber = this.state.detail.orderNumber || '';      //订单编号
        orderBody.itemId = this.props.itemId;                             //产品编号
        orderBody.valueaddType = this.props.midClass;                     //增值服务类型
        orderBody.submitDate = common.formatSecond(new Date());           //数据提交时间
        orderBody.__status = "update";

        //预约时间
        orderBody.signDate = orderBody.reserveDate = common.formatSecond(new Date(orderBody.reserveDate));

        //酒店入住时间
        if(orderBody.checkinDate){
          orderBody.checkinDate = common.formatSecond(new Date(orderBody.checkinDate));
        }
        //酒店结束时间
        if(orderBody.checkoutDate){
          orderBody.checkoutDate = common.formatSecond(new Date(orderBody.checkoutDate));
        }
        // 酒店房间信息
        if (orderBody.valueaddType === 'JDYD' && dataSource && dataSource.length > 0) {
          orderBody.ordSubscribeRoom = dataSource
        }

        //关联 保单订单号
        if(values.relatedOrderId){
          if (values.relatedOrderId.value) {
            orderBody.relatedOrderNumber = values.relatedOrderId.meaning;
            orderBody.relatedOrderId = values.relatedOrderId.value;
          } else {
            orderBody.relatedOrderId = null;
            orderBody.relatedOrderNumber = null;
          }
        }
        if(this.props.midClass == 'ZQKH'){
          orderBody.birthDate = values.birthDate._i
          orderBody.customerNation = (values.mailingArea)[0];
          orderBody.customerProvince = (values.mailingArea)[1];
          orderBody.customerCity = (values.mailingArea)[2];
          orderCustomer.currentAssets = values.currentAssets;
          orderCustomer.fixedAssets = values.fixedAssets;
          orderCustomer.liabilities = values.liabilities;
          orderCustomer.identityFileId = values.identityFileId? values.identityFileId[0].response.file.fileId:'';
          orderCustomer.addressFileId = values.addressFileId ? values.addressFileId[0].response.file.fileId:'';
          orderCustomer.cardFileId = values.cardFileId ? values.cardFileId[0].response.file.fileId:'';
          orderCustomer.orderId = this.props.orderId;
          orderCustomer.ordCustomerId = this.state.ordCustomerId? this.state.ordCustomerId:'';
          orderCustomer.customerType = 'INSURANT'
        }
        //价格
        if (this.props.midClass == 'HPV') {
          orderBody.price = parseFloat(orderBody.price); 
          orderBody.reserveEndDate
          = common.formatSecond(new Date(orderBody.reserveEndDate
          ));
        }

        if (dataSource && dataSource.length > 1 && orderBody.valueaddType !== 'JDYD') {

          let ordTeamVisitor = [];
          for(let i = 1; i< dataSource.length ; i++){
            ordTeamVisitor.push(dataSource[i]);
          }
          orderBody.ordTeamVisitor = ordTeamVisitor;
        }else if (dataSource && dataSource.length <= 1  && orderBody.valueaddType !== 'JDYD') {
          Modals.error({content:'请至少添加一条L签访客信息！'});
          return;
        }
        service.submitAddService([orderBody]).then((orderData) => {
          if (orderData.success) {
            const midClass = this.props.midClass;
            let detail = orderData.rows[0] || {};
            detail.disableFlag = detail == 'NEED_REVIEW'? false : true;
            // this.setState({detail},()=>{
            //   this.setDetailTad(midClass);
            // });
            if(this.props.midClass == 'ZQKH'){
              service.submitOrdCustomer([orderCustomer]).then((data) =>{
                Modals.success({content:"预约资料已提交，请耐心等待审核！",url:'/portal/reservation/2', closable:false, count:2});
              })
            }else{
              Modals.success({content:'预约资料已提交，请耐心等待审核', url:'/portal/reservation/2', closable:false, count:2});
            }
          }else{
            Modals.error({content:'预约提交失败：'+orderData.message});
          }
        });
      }
    });
  }



  render(){
    return(
      <div>
        {this.state.detailTab}
      </div>
    );
  }
}

export default Form.create()(SvDetail);
