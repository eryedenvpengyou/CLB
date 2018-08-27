import React from 'react';
import { Form,Button, Table,Row,Col,} from 'antd';
import moment from 'moment';
import * as service from '../../../services/order';
import * as styles from '../../../styles/appointment.css';
import Modals from "../../common/modal/Modal";

class InsureSupplier extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      commissionList:[],
      checkRecord:{},
      countLine: 1,
      spinning: false,
      saveloading: false, //保存按钮旋转
      subloading: false, //提交至行政按钮旋转
    };
  }



  componentWillMount(){
    const insureance = this.props.insureance || {};

    let ordAddition =insureance.ordAddition;
    let itemIds = [];
    for(let i in ordAddition ){
      itemIds.push({itemId:ordAddition[i].itemId, sublineItemName: ordAddition[i].sublineItemName });
      // itemIds.push({itemId:ordAddition[i].itemId});
    }

    let birthDate =moment(insureance.customers[0].birthDate).format('YYYY-MM-DD');

    const params ={
      channelId: insureance.channelId || JSON.parse(localStorage.user).relatedPartyId,
      birthDate: birthDate,
      prdSupplierId: insureance.productSupplierId,
      currency: insureance.currency || '',
      payMethod: insureance.payMethod || '',
      contributionPeriod: insureance.contributionPeriod,
      itemId: insureance.itemId,
      effectiveDate: insureance.reserveDate || '',
      additionRiskList: itemIds || [],
    }
    service.fetchCommission(params).then((data)=>{
      if(data.success){
        let datas  = data.rows || [];
        let count = 1, countLine = this.state.countLine, checkRecord = {};
        for(let i = 0; i < datas.length -1; i++){
          datas[i].index = i;
          datas[i].count = 0;
          datas[i].autoSupplierName = '供应商' + countLine;
          if(datas[i].dealPath == datas[i+1].dealPath){
            count ++;
            if(i == datas.length -2) {
              datas[datas.length-count].count = count;
              datas[datas.length -1 ].count = 0;
              datas[datas.length -1].index = datas.length -1;
              datas[datas.length -1].autoSupplierName = '供应商' + countLine;
            }
          }else{
            datas[i+1 -count].count = count;
            count = 1;
            countLine++;
            datas[i+1].autoSupplierName = '供应商' + countLine;
            datas[i+1].index = i + 1;
            datas[i+1].count = count;
          }
        }

        if(datas.length == 1){
          datas[0].index = 0;
          datas[0].autoSupplierName = '供应商' + countLine;
          datas[0].count = count;
        }

        if(countLine == 1){
          checkRecord = datas[0];
        }

        this.setState({commissionList:datas, checkRecord, countLine});
      }
    });
  }


  //提交至行政
  submit(e){
    e.preventDefault();
    if(this.state.commissionList && this.state.commissionList.length > 0){
      if(!this.state.checkRecord || !this.state.checkRecord.lineId){
        Modals.error({content: '请先选择交易路线'});
        return;
      }
      this.setState({spinning: true,subloading:true});

      let insureance = this.props.insureance || {};

      //1、提交订单信息
      //添加当前页面中的选项
      const checkRecord = this.state.checkRecord || {};
      insureance.channelCommissionLineId = checkRecord.lineId || '';
      insureance.signSupplierId = checkRecord.supplierCommissionId  || '';
      insureance.insurantBirthDate = moment(insureance.customers[0].birthDate).format('YYYY-MM-DD');
      insureance.status = 'DATA_APPROVING';
      insureance.orderType = 'INSURANCE';
      insureance.hisStatus = 'DATA_APPROVING';                      //日志状态
      insureance.hisDesc = '预约资料审核中，请耐心等待';              //日志描述
      insureance.__status = this.props.orderId == '000' ? 'add' : 'update';
      insureance.ordCustomer = insureance.customers || [];

      service.submitOrder([insureance]).then((data) => {
        if(data.success){
          this.setState({spinning: false,subloading:true});
          const orderId = data.rows[0].orderId;
          const orderNumber = data.rows[0].orderNumber;
          Modals.warning(this.ensureService.bind(this, orderId, orderNumber),{
            content: <div><font>您的预约已提交成功，行政会及时处理！</font><br/><font style={{marginTop:'20px',color:JSON.parse(localStorage.theme).themeColor}}>是否继续添加增值服务信息？</font></div>,
            cancel: '返回',
            ensure: '添加',
          });

          //2、提交客户信息
          // let customers = insureance.customers || [];
          // for(let i in customers){
          //   customers[i].orderId = data.rows[0].orderId;
          // }
          // const orderId = data.rows[0].orderId;
          // const orderNumber = data.rows[0].orderNumber;
          // service.submitOrdCustomer(customers).then((data) => {
          //   if(data.success){
          //     this.setState({spinning: false});
          //     Modals.warning(this.ensureService.bind(this, orderId, orderNumber),{
          //       content: <div><font>您的预约已提交成功，行政会及时处理！</font><br/><font style={{marginTop:'20px',color:'#d1b97f'}}>是否继续添加增值服务信息？</font></div>,
          //       cancel: '返回',
          //       ensure: '添加',
          //     });
          //   }
          // });
        }else{
          this.setState({spinning: true});
          Modals.error({content:'提交失败，请联系管理员'});
        }
      });
    }else{
      Modals.error({content: '没有交易路线，提交失败！'});
    }
  }

  //选择是否继续添加增值服务信息
  ensureService(orderId, orderNumber, flag){
    if(flag)
      location.hash = `/order/insurance/service/${orderId}/${orderNumber}`;
    else
      location.hash = '/order/summary';
  }


  //保存按钮
  saveInfo(){
    let insureance = this.props.insureance || {};
    this.setState({spinning: true,saveloading:true});
    //添加当前页面中的选项
    const checkRecord = this.state.checkRecord || {};
    insureance.channelCommissionLineId = '';
    insureance.signSupplierId = '';
    insureance.insurantBirthDate = moment(insureance.customers[0].birthDate).format('YYYY-MM-DD');
    insureance.status = 'UNSUBMITTED';
    insureance.orderType = 'INSURANCE';
    insureance.__status = this.props.orderId == '000' ? 'add' : 'update';
    insureance.ordCustomer = insureance.customers || [];

    service.submitOrder([insureance]).then((data) => {
      if(data.success){

        this.setState({spinning: false,saveloading:false});
        Modals.success({content:'保存成功', url:'/order/summary', closable:false, count:2});

        //2、提交客户信息
        // let customers = insureance.customers || [];
        // for(let i in customers){
        //   customers[i].orderId = data.rows[0].orderId;
        // }
        // service.submitOrdCustomer(customers).then((data) => {
        //   if(data.success){
        //     this.setState({spinning: false});
        //     Modals.success({content:'保存成功', url:'/order/summary', });
        //   }
        // });
      }else{
        Modals.error({content:'请联系系统管理员'});
        return;
      }
    });
  }


  radioChange(checkRecord){
    this.setState({checkRecord});
  }

  render() {
    const insureance = this.props.insureance || {};
    const editFlag = insureance.editFlag || false;
    const columns = [{
      title: '供应商',
      dataIndex: 'autoSupplierName',
      key:'autoSupplierName',
      className:styles.text_center,
      width:'161px',
      render: (text,record,index ) => {
        if (index == record.index) {
          return {
            children: text,
            props: { rowSpan: record.count, },
          };
        }
      },
    }, {
      title: '产品信息',
      dataIndex: 'itemName',
      key:'itemName',
      className:styles.text_center,
      width:'150px',
      // render: renderContent,
    }, {
      title: '首年佣金',
      dataIndex: 'theFirstYear',
      key:'theFirstYear',
      className:styles.text_center,
      width:'115px',
      render:(text)=>{
        if(/^[0]+(.[0]{1,100})?$/.test(text))
          return '0';
        if(text && !isNaN(text)){
          return text === -999 ? 'XXX' : parseFloat(text * 100).toFixed(2) + '%';
          // return parseFloat(text * 100).toFixed(2) + '%';
        }
      }
    }, {
      title: '第二年佣金',
      dataIndex: 'theSecondYear',
      key:'theSecondYear',
      className:styles.text_center,
      width:'115px',
      render:(text)=>{
        if(/^[0]+(.[0]{1,100})?$/.test(text))
          return '0';
        if(text && !isNaN(text)){
          return text === -999 ? 'XXX' : parseFloat(text * 100).toFixed(2) + '%';
        }
      }
    }, {
      title: '第三年佣金',
      dataIndex: 'theThirdYear',
      key:'theThirdYear',
      className:styles.text_center,
      width:'115px',
      render:(text)=>{
        if(/^[0]+(.[0]{1,100})?$/.test(text))
          return '0';
        if(text && !isNaN(text)){
          return text === -999 ? 'XXX' : parseFloat(text * 100).toFixed(2) + '%';
        }
      }
    }, {
      title: 'pending率',
      dataIndex: 'pendingRate',
      key:'pendingRate',
      className:styles.text_center,
      width:'130px',
      render: (text,record,index ) => {
        if (index == record.index) {
          return {
            children: text,
            props: { rowSpan: record.count, },
          };
        }
      },
    }, {
      title: '服务评分',
      dataIndex: 'serviceScore',
      key:'serviceScore',
      className:styles.text_center,
      width:'90px',
      render: (text,record,index ) => {
        if (index == record.index) {
          return {
            children: text,
            props: { rowSpan: record.count, },
          };
        }
      },
    }, {
      title: '选择',
      dataIndex: 'radio',
      key:'radio',
      className:styles.text_center,
      width:'90px',
      render: (text,record,index ) => {
        if (index == record.index) {
          let input = '';
          if(this.state.countLine == 1){
            input = <input
              checked={true}
              type="radio"
              name="choose"
              className={styles.radios}
              style={{width:'16px',height:'16px',border:'1px solid #d1b97f',color:'#d1b97f',backgroundColor:'#d1b97f',background: '#d1b97f',}}
              onClick={this.radioChange.bind(this,record)}/>;
          }else{
            input = <input
              type="radio"
              name="choose"
              className={styles.radios}
              style={{width:'16px',height:'16px',border:'1px solid #d1b97f',color:'#d1b97f',backgroundColor:'#d1b97f',background: '#d1b97f',}}
              onClick={this.radioChange.bind(this,record)}/>;
          }
          return {
            children: input,
            props: { rowSpan: record.count, },
          };
        }
      },
    }];

    return (
      <div className={styles.table_border}>
        <div className={styles.item_div}>

        <div className={styles.title_sty}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font2}>预约签单</font>
        </div>
        <div className={styles.model_title}>选择供应商</div>
          <Table style={{margin:'30px 100px'}} columns={columns} dataSource={this.state.commissionList} pagination={false} bordered/>

          <Row gutter={24} style={{marginBottom:'2%'}}>
            <Col span={4} offset={7}>
              <Button onClick={this.saveInfo.bind(this)} type='default' style={{ width:'160px',height:'40px'}}  size='large' loading={this.state.saveloading}>保存</Button>
            </Col>
            <Col span={2}>
            </Col>
            <Col span={4}>
              <Button onClick={this.submit.bind(this)} type='primary' style={{ width:'160px',height:'40px'}}  size='large' loading={this.state.subloading}>提交至行政</Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Form.create()(InsureSupplier);
