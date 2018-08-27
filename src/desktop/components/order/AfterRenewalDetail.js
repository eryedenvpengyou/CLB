import React  , { Component } from 'react';
import {Table, Form,  Button } from 'antd';
import * as styles from '../../styles/order.css';
import AfterRenewalDetailForm1 from "./AfterRenewalDetailForm1";
import AfterRenewalDetailForm2 from "./AfterRenewalDetailForm2";
import * as service from '../../services/order';
import {dataFormat,fmoneyCommon} from '../../utils/common'
import { getCode } from '../../services/code';


const FormItem = Form.Item;


export default class AfterRenewalDetail extends Component {

  constructor(props){
    super(props);
    this.state = {
      rf: {},
      ar:[],
      codeList: {
        afterSCodes: [],
      }
    }
  }

  componentWillMount() {
    //获取快码值
    const codeBody = {
      afterSCodes: 'ORD.RENEWAL_STATUS', };
    getCode(codeBody).then((data)=>{
      this.setState({
        codeList: data
      });
    });
    const paramsRenewalFollowTable = {
      orderId : this.props.orderId
    };
    this.props.dispatch({
      type:'order/fetchRenewalPerson',
      payload:{paramsRenewalFollowTable},
    });
    service.fetchFollowRenewalDetailService(paramsRenewalFollowTable).then((data) => {
      if (data.success) {
        this.setState({
          ar:data.rows
        },()=>{
          service.fetchRFoTable(paramsRenewalFollowTable).then((data) => {
            if (data.success) {
              let rfr = data.rows;
              if(rfr){
                for(let i = 0;i<rfr.length;i++){
                  if(rfr[i].renewalStatus==='ADMIN'||rfr[i].renewalStatus==='NACHFRIST'){
                    rfr[i].rStatus = 'TOFAIL'
                  }
                  else {
                    rfr[i].rStatus = rfr[i].renewalStatus
                  }
                }
                data.rows = rfr;
              }
              this.setState({
                rf:data
              })
            }
          });
        })
      }
    });
  }

  render() {
    const that = this;
    let columns = [];
    columns.push({
      title: '',
      children: [{
        title: '产品',
        dataIndex: 'itemName',
        fixed : true,
        width : '150px',
        render(text, record, index){
          return <span style={{fontSize:'14px'}}>{record.itemName}</span>
        }
      }]
    });
    let scrollNum =0;
    if(this.state.ar) {
      if (this.state.ar[0] && this.state.ar[0].payPeriods > 0) {
        if((this.state.ar[0].payPeriods+1)>3){
          const year = (this.state.ar[0].payPeriods+1);
          scrollNum = (1+(.34)*year)*100
        }
        for (let i = 2; i <= (this.state.ar[0].payPeriods+1); i++) {
          let children = [{
            title: '预期续保日',
            dataIndex: 'renewalDate'+i,
            className:styles.text_center,
            render(text, record, index){
              return <span style={{fontSize:'14px'}}>{dataFormat(record['renewalDate'+i])}</span>
            }
          },{
            title: '预计保费',
            dataIndex: 'totalAmount'+i,
            className:styles.text_center,
            render(text, record, index){
              return <span style={{fontSize:'14px'}}>{record['totalAmount'+i] && record['totalAmount'+i].toFixed(2)}</span>
            }
          },{
            title: '币种',
            dataIndex: 'currency'+i,
            className:styles.text_center,
            render(text, record, index){
              return <span style={{fontSize:'14px'}}>{record['currency'+i]}</span>
            }
          },{
            title: '状态',
            dataIndex: 'renewalStatus'+i,
            className:styles.text_center,
            render(text, record, index){
              if(text == 'ADMIN'||text == 'NACHFRIST'){
                text == 'TOFAIL'
              }
              let asListCode = that.state.codeList.afterSCodes;
                for (let i = 0; i < asListCode.length; i++) {
                  if (text  == asListCode[i].value) {
                    return <div style={{fontSize:'14px'}}>{asListCode[i].meaning}</div>
                  }
                }
            }
          }];
          columns.push(
            {
              title: '第' + i + '期',
              children: children,
            }
          );
        }
      }
    }
    return (
      <div   className={styles.table_border2}>
        <div style={{marginTop:'20px', position: 'relative'}} className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>保单信息</font>
          <Button  style={{fontSize:'20px', position: 'absolute', right:'10px', width : '140px',height:'40px',backgroundColor:JSON.parse(localStorage.theme).themeColor,color:'white'}} onClick={()=>location.hash = '/after/AfterNew/RENEWAL/续保/'+this.props.orderId}>申请续保</Button>
        </div>

        <div style={{marginTop:'30px'}} className={styles.formFontStyle}>
          <AfterRenewalDetailForm1
            dispatch={this.props.dispatch}
            order={this.props.order}
            orderId={this.props.orderId}
          />
        </div>
        <div className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>续保信息</font>
        </div>

        <div style={{marginTop:'30px'}} className={styles.formFontStyle}>
          <AfterRenewalDetailForm2 dispatch={this.props.dispatch}  order={this.props.order}  orderId={this.props.orderId}/>
        </div>

        <div style={{marginTop:'20px'}}>
          <Table rowKey="itemId" scroll={{x: `${scrollNum}%`}} dataSource={this.state.rf.rows} columns={columns} bordered/>
        </div>
        {/*<div className={styles.item_div3} style={{textAlign:'center',marginTop:'30px',marginBottom:'30px'}}>
          <Button  style={{fontSize:'20px',width : '140px',height:'40px',backgroundColor:JSON.parse(localStorage.theme).themeColor,color:'white'}} onClick={()=>location.hash = '/after/AfterNew/RENEWAL/续保/'+this.props.orderId}>申请售后</Button>
        </div>*/}
      </div>
    );
  }
}
