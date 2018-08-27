import React  , { Component } from 'react';
import {Checkbox,Table,Form,Input,Row, Button, Select} from 'antd';
import * as styles from '../../styles/order.css';
import AfterNewAftermarketForm from "./AfterNewAftermarketForm";
import AfterNewAftermarketRenewal1 from "./AfterNewAftermarketRenewal1";
import AfterNewAftermarketRenewal2 from "./AfterNewAftermarketRenewal2";
import Download from '../common/Download';
import AfterNewAftermarketOther from "./AfterNewAftermarketOther";
import AfterNewExit from "./AfterNewExit";

const FormItem = Form.Item;

function onChange(that,value,e) {
  let eTList = that.state.exitTableList;
  if(value.attribute1=='Y'&&e.target.checked){
    for(let i=0;i<eTList.length;i++){
      eTList[i].checkabled =true
    }
  }
  else if(value.attribute1=='Y'&&!e.target.checked){
    for(let i=0;i<eTList.length;i++){
      eTList[i].checkabled  =false;
    }
  }
  else if(e.target.checked&&value.attribute1!='Y'){
    for(let i=0;i<eTList.length;i++){
      if(value.itemId == eTList[i].itemId){
        eTList[i].checkabled  =true;
      }
    }
  }
  else if(!e.target.checked&&value.attribute1!='Y'){
    for(let i=0;i<eTList.length;i++){
      if(value.itemId == eTList[i].itemId){
        eTList[i].checkabled=false;
      }
    }
  }
  that.setState({
    exitTableList:eTList
  })

}

export default class AfterNewAftermarket extends Component {

  constructor(props){
    super(props);
    this.state = {
      orderIdParams : 0,
      afterProjectParams : '',
      afterTypeParams : '',
      renewalTableList:[],
      exitMap:[],
      exitTableList:[],
      formList:[],
      renewalFromList:[],
      applyOrderId : this.props.orderId,
    }
  }
  getLovValue(orderIdParam,afterProjectParam,afterTypeParam){
    this.setState({
      orderIdParams:orderIdParam,
      afterProjectParams:afterProjectParam,
      afterTypeParams:afterTypeParam
    });
  }
  getRenewalTableList(value){
    this.setState({
      renewalTableList:value
    });
  }
  getFormList(value){
    this.setState({
      formList:value
    });
  }
  getRenewalFormList(value){
    this.setState({
      renewalFromList:value
    });
  }
  getExitTableList(value){
    let checkabled=false;
    this.setState({
      exitTableList:value
    });
    if(this.state.exitTableList.length>0){
      for(let i=0;i<this.state.exitTableList.length;i++){
        if(this.state.exitTableList[i].surrenderFlag=='Y'){
          checkabled = true
        }else {
          checkabled = false
        }
        this.state.exitTableList[i].push(checkabled)
      }
    }
  }

  render() {
    const selectList = this.props.order.renewalSelectList;
    let hiddenFlagNew = false;
    let hiddenFlagRenewal = true;
    let hiddenFlagExit = true;
    let hiddenFlagOther = true;
    if(selectList.rows){
      if(selectList.rows.afterProject=='RENEWAL'){
        hiddenFlagNew = true;
        hiddenFlagRenewal = false;
        hiddenFlagOther = true;
        hiddenFlagExit = true;
      }
      else if(selectList.rows.afterProject=='EXIT'){
        hiddenFlagNew = true;
        hiddenFlagRenewal = true;
        hiddenFlagExit = false;
        hiddenFlagOther = true;
      }else {
        hiddenFlagExit =true;
        hiddenFlagNew = true;
        hiddenFlagRenewal = true;
        hiddenFlagOther = false;
      }
    }


    const  that = this;
    /**
     * 续保界面的表格。
     */
    const columns1 = [
      {
        title: '缴费期数',
        dataIndex: 'orderId',
        className:styles.text_center
      },{
        title: '产品',
        dataIndex: 'itemName',
        className:styles.text_center
      },{
        title: '币种',
        dataIndex: 'currency'
      },{
        title: '预计保费金额',
        dataIndex: 'totalAmount',
        className:styles.text_center
      },{
        title: '保费到期日',
        dataIndex: 'renewalDate',
        className:styles.text_center
      }]
    const columns2 = [
      {
        title: '跟进人',
        dataIndex: 'userName',
        className:styles.text_center
      },{
        title: '跟进时间',
        dataIndex: 'followDate',
        className:styles.text_center
      },{
        title: '跟进内容',
        dataIndex: 'content',
        className:styles.text_center
      },
      {
        title: '附件下载',
        dataIndex: 'fileId',
        key: 'fileId',
        render: (text, record, index) => {
          if(record.fileId&&record.filePath){
            return (
              <Download fileId={record.fileId} />
            )
          }else {
            return ''
          }
        }
      }, {
        title: '删除',
        dataIndex: 'open',
        className:styles.text_center,
        onCellClick(record, event){
        },
        render(text, record, index) {
          return <div>
            <Button style={{marginRight:'5%',backgroundColor:'#d1b97f',color:'white'}} onClick={()=>location.hash= '/orderTrail'}>删除</Button>
          </div>
        }
      }]

    const columns3 = [
      {
        title: '产品信息',
        dataIndex: 'itemName',
        className:styles.text_center
      },{
        title: '状态',
        dataIndex: 'status',
        className:styles.text_center
      }, {
        title: '选择退保产品',
        dataIndex: 'surrenderFlag',
        className: styles.text_center,
        render(text, record, index) {
          if(record.surrenderFlag == 'Y'&&record.attribute1=='Y'){
            return <div>
              <Checkbox disabled checked={true}></Checkbox>
            </div>
          }
          else if (record.surrenderFlag == 'Y') {
            return <div>
              <Checkbox disabled checked={true}></Checkbox>
            </div>
          }
          else {
            return <div>
              <Checkbox checked={record.checkabled} onChange={onChange.bind(this,that,record)}></Checkbox>
            </div>
          }
        }
      }]


    return (
      <div  style={{marginTop:'20px'}} className={styles.table_border2}>
        {/*根据下拉动态显示头*/}
        <div hidden={hiddenFlagNew} className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>新建售后申请</font>
        </div>
        <div hidden={hiddenFlagRenewal} className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>保单信息</font>
        </div>
        <div hidden={hiddenFlagOther} className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>保单信息</font>
        </div>
        <div hidden={hiddenFlagExit} className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>保单信息</font>
        </div>


        <div  style={{marginTop:'30px'}}>
          <AfterNewAftermarketForm applyOrderId={that.state.applyOrderId} getRenewalTableList={this.getRenewalTableList.bind(this)} getExitTableList={this.getExitTableList.bind(this)} getLovValue={this.getLovValue.bind(this)} getRenewalFormList={this.getRenewalFormList.bind(this)} order={this.props.order} dispatch={this.props.dispatch}/>
        </div>

        {/*根据下拉值 续保 显示续保界面*/}
        <div hidden={hiddenFlagRenewal} className={sincreaseFlagtyles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>续保信息</font>
        </div>
        <div hidden={hiddenFlagRenewal}  style={{marginTop:'30px'}} >
          <AfterNewAftermarketRenewal1 orderIdParams={this.state.orderIdParams}  dispatch={this.props.dispatch} renewalFromList={this.state.renewalFromList}/>
        </div>
        <div hidden={hiddenFlagRenewal} className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>本期续保产品</font>
        </div>
        <div hidden={hiddenFlagRenewal} style={{marginTop:'30px'}}>
          <Table className={styles.commons} dataSource={this.state.renewalTableList}   columns={columns1} bordered/>
        </div>
        <div hidden={hiddenFlagRenewal} className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>售后跟进记录</font>
        </div>
        <div hidden={hiddenFlagRenewal} style={{marginTop:'30px'}} >
          <Table className={styles.commons} dataSource={this.props.order.renewalFollowList} columns={columns2} bordered/>
        </div>
        <div hidden={hiddenFlagRenewal} style={{marginTop:'30px'}} >
          <AfterNewAftermarketRenewal2 orderIdParams={this.state.orderIdParams} afterTypeParams={this.state.afterTypeParams} afterProjectParams={this.state.afterProjectParams}></AfterNewAftermarketRenewal2>
        </div>


        {/*根据下拉值 其他售后 界面*/}
        <div hidden={hiddenFlagOther} className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>售后跟进记录</font>
        </div>
        <div hidden={hiddenFlagOther} style={{marginTop:'30px'}} >
          <Table className={styles.commons} dataSource={this.props.order.renewalFollowList}  columns={columns2} bordered/>
        </div>
        <div hidden={hiddenFlagOther} style={{marginTop:'30px'}} >
          <AfterNewAftermarketOther orderIdParams={this.state.orderIdParams} afterTypeParams={this.state.afterTypeParams} afterProjectParams={this.state.afterProjectParams}></AfterNewAftermarketOther>
        </div>

        {/*根据下拉值 退保售后 界面*/}
        <div hidden={hiddenFlagExit} className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>第一步：选择退保项目</font>
        </div>
        <div hidden={hiddenFlagExit} style={{marginTop:'30px'}}>
          <Table className={styles.commons} dataSource={this.state.exitTableList}  columns={columns3} bordered/>
        </div>
        <div hidden={hiddenFlagExit}  style={{marginTop:'30px'}} className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>第二步：上传退保申请表格</font>
        </div>
        <div hidden={hiddenFlagExit} style={{marginTop:'30px'}}>
          <Table className={styles.commons} columns={columns2} bordered/>
        </div>
        <div hidden={hiddenFlagExit}  style={{marginTop:'30px'}}>
          <AfterNewExit orderIdParams={this.state.orderIdParams} afterTypeParams={this.state.afterTypeParams} afterProjectParams={this.state.afterProjectParams} exitTableList={this.state.exitTableList}></AfterNewExit>
        </div>
      </div>
    );
  }
}
