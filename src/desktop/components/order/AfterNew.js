import React  , { Component } from 'react';
import {Checkbox,Table,Form} from 'antd';
import * as styles from '../../styles/order.css';
import AfterNewForm from "./AfterNewForm";
import AfterNewAftermarketRenewal1 from "./AfterNewAftermarketRenewal1";
import AfterNewAftermarketRenewal2 from "./AfterNewAftermarketRenewal2";
import Download from '../common/Download';
import AfterNewExit from "./AfterNewExit";
import AfterNewAftermarketOther from "./AfterNewAftermarketOther";
import { getCode } from '../../services/code';

const FormItem = Form.Item;


class AfterNew extends Component {

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
      showFlag:true,
      rfTableData:{},
      dFlag:false,
      aStatus:'',
      codeList:{
        osCodes: [],
      },
    }
  }

  componentWillMount() {
      const codeBody = {
        osCodes: 'ORD.ORDER_STATUS',
      };
      getCode(codeBody).then((data)=>{
        this.setState({codeList: data});
      });
  }
  changeStatus(value){
    this.setState({
      aStatus:value
    })
  }
  changeRFTableData(value){
    this.setState({
      rfTableData:value
    })
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
    this.setState({
      exitTableList:value
    });
  }
  onChange(that,record,e) {
    let eTList = that.state.exitTableList;
    let inputArr = document.getElementsByClassName('ant-checkbox-input');
    for(var i = 0;i<inputArr.length;i++){
     inputArr[i].style.display = 'none' ;
    }
    if(record.source=='ORDER' && e.target.checked){
      for(let i=0;i<eTList.length;i++){
        eTList[i].cbFlag = true//勾选变量
        eTList[i].daFlag = true//编辑变量
      }
    }
    else if(record.source=='ORDER' && !e.target.checked){
      for(let i=0;i<eTList.length;i++){
        eTList[i].cbFlag = false//勾选变量
        eTList[i].daFlag = false//编辑变量
      }
    }
    else if(e.target.checked && record.source !='ORDER'){
      for(let i=0;i<eTList.length;i++){
        if(record.itemId == eTList[i].itemId){
          eTList[i].cbFlag = true;
          eTList[i].daFlag = false//编辑变量
        }
      }
    }
    else if(!e.target.checked && record.source !='ORDER'){
      for(let i=0;i<eTList.length;i++){
        if(record.itemId == eTList[i].itemId){
          eTList[i].cbFlag = false;
          eTList[i].daFlag = false//编辑变量
        }
      }
    }
    that.setState({
      exitTableList:eTList
    })
  }
  changeShow(value){
    this.setState({
      showFlag:value
    })
  }
  changeDisable(value){
    this.setState({
      dFlag:value
    })
  }



  render() {
    const  that =this;
    const osListCode = this.state.codeList.osCodes;
    let hiddenFlagNew = true;
    let hiddenFlagRenewal = false;
    let hiddenFlagExit = false;
    let hiddenFlagOther = false;
    if(this.state.afterProjectParams&&this.state.afterTypeParams){
      if(this.state.afterProjectParams=='RENEWAL'){
        hiddenFlagNew = false;
        hiddenFlagRenewal = true;
        hiddenFlagOther = false;
        hiddenFlagExit = false;
      }
      else if(this.state.afterProjectParams=='EXIT'){
        hiddenFlagNew = false;
        hiddenFlagRenewal = false;
        hiddenFlagExit = true;
        hiddenFlagOther = false;
      }else {
        hiddenFlagExit =false;
        hiddenFlagNew = false;
        hiddenFlagRenewal = false;
        hiddenFlagOther = true;
      }
    }
    /**
     * 续保界面的表格。
     */
    const columns1 = [
      {
        title: '缴费期数',
        dataIndex: 'payPeriods',
        className:styles.text_center,
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{record.payPeriods}</span>
        }
      },{
        title: '产品',
        dataIndex: 'itemName',
        className:styles.text_center,
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{record.itemName}</span>
        }
      },{
        title: '本期保费',
        dataIndex: 'totalAmount',
        className:styles.text_center,
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{record.totalAmount}</span>
        }
      },{
        title: '币种',
        dataIndex: 'currency',
        className:styles.text_center,
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{record.currency}</span>
        }
      },{
        title: '保费到期日',
        dataIndex: 'renewalDueDate',
        className:styles.text_center,
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{record.renewalDueDate}</span>
        }
      }]
    const columns2 = [
      {
        title: '跟进人',
        dataIndex: 'userName',width:'9%',
        className:styles.text_center,
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{record.userName}</span>
        }
      },{
        title: '跟进时间',
        dataIndex: 'followDate',width:'18%',
        className:styles.text_center,
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{record.followDate}</span>
        }
      },{
        title: '跟进内容',
        dataIndex: 'content',
        className:styles.text_center,
        render(text, record) {
          return <span style={{fontSize:'14px', display: 'block', textAlign: 'left'}}>{record.content}</span>
        }
      },
      {
        title: '附件',
        dataIndex: 'fileId',
        key: 'fileId',width:'8%',
        className:styles.text_center,
        render: (text, record, index) => {
          if(record.fileId){
            return (
              <Download fileId={record.fileId} />
            )
          }else {
            return ''
          }
        }
      }]
    const columns3 = [
      {
        title: '产品信息',
        dataIndex: 'itemName',
        className:styles.text_center,
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{record.itemName}</span>
        }
      },{
        title: '状态',
        dataIndex: 'status',
        className:styles.text_center,
        render(text, record) {
          if(osListCode){
            for(let j = 0;j<osListCode.length;j++){
              if(record.saveStatus){
                if(record.saveStatus == osListCode[j].value){
                  return <div style={{fontSize:'14px'}}>{osListCode[j].meaning}</div>
                }
              }
              else if(!record.saveStatus){
                if(record.status == osListCode[j].value){
                  return <div style={{fontSize:'14px'}}>{osListCode[j].meaning}</div>
                }
              }
            }
          }else {
            return <div style={{fontSize:'14px'}}>{record.status}</div>
          }
        }
      }, {
        title: '选择退保产品',
        dataIndex: 'surrenderFlag',
        className: styles.text_center,
        render(text, record, index) {
          if(record.surrenderFlag == 'Y'){
            return <div>
              <Checkbox disabled='true' checked={true}></Checkbox>
            </div>
          }
          else if (record.source == 'ORDER') {
            if(record.surrenderFlag == 'N'||record.surrenderFlag == ''||record.surrenderFlag == null){
              return <div>
                <Checkbox onChange={that.onChange.bind(this,that,record)}></Checkbox>
              </div>
            }
          }
          else if(record.source == 'ADDITION') {
            if(record.surrenderFlag == 'N'||record.surrenderFlag == ''||record.surrenderFlag == null){
              return <div>
                <Checkbox disabled={record.daFlag} checked={record.cbFlag} onChange={that.onChange.bind(this,that,record)}></Checkbox>
              </div>
            }
          }else {
            return <div>
              <Checkbox disabled={record.daFlag} checked={record.cbFlag} onChange={that.onChange.bind(this,that,record)}></Checkbox>
            </div>
          }
        }
      }]

    return (
      <div style={{marginTop:'20px'}} className={styles.table_border2}>
        {/*根据下拉动态显示头*/}
        {hiddenFlagNew&&
        <div className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>新建售后申请</font>
        </div>
        }
        {hiddenFlagRenewal&&
        <div className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>保单信息</font>
        </div>
        }
        {
          hiddenFlagOther&&
        <div className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>保单信息</font>
        </div>
        }
        {hiddenFlagExit&&
        <div className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>保单信息</font>
        </div>
        }

        <div  style={{marginTop:'30px'}}>
          <AfterNewForm
            afterType={that.props.afterType}
            afterProject={that.props.afterProject}
            aStatus={that.state.aStatus}
            dFlag={that.state.dFlag}
            applyOrderId={that.state.applyOrderId}
            form={that.props.form}
            getRenewalTableList={that.getRenewalTableList.bind(that)}
            getExitTableList={that.getExitTableList.bind(that)}
            getLovValue={that.getLovValue.bind(that)}
            getRenewalFormList={that.getRenewalFormList.bind(that)}
            order={that.props.order}
            dispatch={that.props.dispatch}/>
        </div>

        {/*根据下拉值 续保 显示续保界面*/}
        {hiddenFlagRenewal&&
        <div>
          <div className={styles.item_div}>
            <b className={styles.b_sty} >|</b>
            <font className={styles.title_font}>续保信息</font>
          </div>
          <div style={{marginTop:'30px'}}  className={styles.formFontStyle}>
            <AfterNewAftermarketRenewal1
              orderIdParams={this.state.orderIdParams}
              dispatch={this.props.dispatch}
              renewalFromList={this.state.renewalFromList}/>
          </div>
          <div className={styles.item_div}>
            <b className={styles.b_sty} >|</b>
            <font className={styles.title_font}>本期续保产品</font>
          </div>
          <div style={{marginTop:'30px'}}   >
            <Table className={styles.commons} dataSource={this.state.renewalTableList} rowKey='itemId'  columns={columns1} bordered/>
          </div>
          <div style={{marginTop:'30px'}} className={styles.item_div}>
            <b className={styles.b_sty} >|</b>
            <font className={styles.title_font}>售后跟进记录</font>
          </div>
          <div style={{marginTop:'30px'}} >
            <Table className={styles.commons} dataSource={this.state.rfTableData.rows} columns={columns2} bordered/>
          </div>
          <div style={{marginTop: '30px'}} className={styles.formFontStyle}>
            {
              this.state.showFlag &&
              <AfterNewAftermarketRenewal2
                form = {this.props.form}
                changeRFTableData={this.changeRFTableData.bind(this)}
                changeShow={this.changeShow.bind(this)}
                changeStatus={this.changeStatus.bind(this)}
                changeDisable={this.changeDisable.bind(this)}
                orderIdParams={this.state.orderIdParams}
                orderId={this.props.orderId}
                afterTypeParams={this.state.afterTypeParams}
                afterProjectParams={this.state.afterProjectParams}>
              </AfterNewAftermarketRenewal2>
            }
          </div>
        </div>
        }

        {/*根据下拉值 其他售后 界面*/}
        {hiddenFlagOther&&
        <div>
          <div className={styles.item_div}>
            <b className={styles.b_sty} >|</b>
            <font className={styles.title_font}>售后跟进记录</font>
          </div>
          <div style={{marginTop:'30px'}}>
            <Table className={styles.commons} dataSource={this.state.rfTableData.rows}  columns={columns2} bordered/>
          </div>
          <div style={{marginTop: '30px'}}>
            {
              this.state.showFlag &&
              <AfterNewAftermarketOther
                form = {this.props.form}
                changeRFTableData={this.changeRFTableData.bind(this)}
                changeShow={this.changeShow.bind(this)}
                changeStatus={this.changeStatus.bind(this)}
                changeDisable={this.changeDisable.bind(this)}
                orderIdParams={that.state.orderIdParams}
                orderId={this.props.orderId}
                afterTypeParams={this.state.afterTypeParams}
                afterProjectParams={this.state.afterProjectParams}>
              </AfterNewAftermarketOther>
            }
          </div>
        </div>
        }


        {/*根据下拉值 退保售后 界面*/}
        {hiddenFlagExit&&
        <div>
          <div className={styles.item_div}>
            <b className={styles.b_sty} >|</b>
            <font className={styles.title_font}>第一步：选择退保项目</font>
          </div>
          <div style={{marginTop:'30px'}}>
            <Table className={styles.commons} dataSource={this.state.exitTableList}  columns={columns3} bordered/>
          </div>
          <div style={{marginTop:'30px'}} className={styles.item_div}>
            <b className={styles.b_sty} >|</b>
            <font className={styles.title_font}>第二步：上传退保申请表格</font>
          </div>
          <div style={{marginTop:'30px'}}>
            <Table  dataSource={this.state.rfTableData.rows} className={styles.commons} columns={columns2} bordered/>
          </div>
          <div style={{marginTop:'30px'}}>
            {
              this.state.showFlag&&
              <AfterNewExit
                form = {this.props.form}
                changeRFTableData={this.changeRFTableData.bind(this)}
                changeShow={this.changeShow.bind(this)}
                changeStatus={this.changeStatus.bind(this)}
                changeDisable={this.changeDisable.bind(this)}
                orderIdParams={this.state.orderIdParams}
                afterTypeParams={this.state.afterTypeParams}
                afterProjectParams={this.state.afterProjectParams}
                exitTableList={this.state.exitTableList}>
              </AfterNewExit>
            }
          </div>
        </div>}

      </div>
    );
  }
}
AfterNew = Form.create()(AfterNew);
export default AfterNew;
