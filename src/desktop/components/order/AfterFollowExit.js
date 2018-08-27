import React  , { Component } from 'react';
import {Checkbox,Table, Form} from 'antd';
import * as styles from '../../styles/afterApplication.css';
import AfterFollowExitForm from "./AfterFollowExitForm";
import AfterFollowExitForm2 from "./AfterFollowExitForm2";
import Download from '../common/Download';
import * as service from '../../services/order';
import { getCode } from '../../services/code';
import {fetchAFExit } from '../../services/order';


export default class AfterFollowExit extends Component {

  constructor(props){
    super(props);
    this.state = {
      statusFlag: false,
      checkBoxFlag: true,
      rfData:{},
      aStatus:'',
      getOrderData:[],
      exitTableList:[],
      codeList:{
        osCodes: [],
      },
      aFId:'',
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      }
    }
  }


  componentWillMount() {
    if(this.props.afterStatus=='AUDITAGIN' || this.props.afterStatus == 'TOAUDIT' || this.props.afterStatus == 'SUBMIT'){
      this.setState({
        statusFlag : true,
        checkBoxFlag:false
      })
    }
    this.getAfterFollowData()
    const codeBody = {
      osCodes: 'ORD.ORDER_STATUS',
    };
    getCode(codeBody).then((data)=>{
        this.setState({
          codeList: data
        });
    });

    //售后跟进退保 表格
    const params = {
      orderId: this.props.orderId
    };
    fetchAFExit(params).then((data) => {
        if (data.success) {
          this.setState({
            exitTableList:data.rows
          })
        } else {
          return;
        }
      });
  }
  getAfterFollowData () {
    //售后跟进记录 表格
    const paramsRF = {
      afterId: this.props.afterId,
      page: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
    };
    service.fetchRenewalFollowService(paramsRF).then((data) => {
      if(data.success){
        let pagination = {...this.state.pagination}
        pagination.total = data.total
        this.setState({
          rfData : data,
          pagination: pagination,
        })
      }
    });
  }
  async tableChange (pagination,filters, sorter) {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current;
    await this.setState({
      pagination: pager,
    })
    this.getAfterFollowData()
  }

  changeRFData(value){
    this.setState({
      rfData : value
    })
  }
  changeExitTableList(value){
    this.setState({
      exitTableList:value
    })
  }

  changeSFlag(value){
    this.setState({
      statusFlag : value
    })
  }

  onChange(that,record,e) {
    let eTList = that.state.exitTableList;
    if(record.source=='ORDER' && e.target.checked){
      for(let i=0;i<eTList.length;i++){
        eTList[i].cbFlag = true//勾选变量
        eTList[i].daFlag = false//编辑变量
      }
    }
    else if(record.source=='ORDER' && !e.target.checked){
      for(let i=0;i<eTList.length;i++){
        eTList[i].cbFlag = false//勾选变量
        eTList[i].daFlag = false//编辑变量
      }
    }
    else if(e.target.checked && record.source != 'ORDER'){
      for(let i=0;i<eTList.length;i++){
        if(record.itemId == eTList[i].itemId){
          eTList[i].cbFlag = true;
          eTList[i].daFlag = false//编辑变量
        }
      }
    }
    else if(!e.target.checked && record.source != 'ORDER'){
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

  changeStatus(value){
    this.setState({
      aStatus:value
    })
  }

  getOrder(value){
    this.setState({
      getOrderData:value
    })
  }

  render() {
    const  that = this;
    const osListCode = this.state.codeList.osCodes;
    const columns = [
      {
        title: '跟进人',
        dataIndex: 'userName',
        width:'9%',
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{record.userName}</span>
        }
      },{
        title: '跟进时间',
        dataIndex: 'followDate',
        width:'18%',
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{record.followDate}</span>
        }
      },{
        title: '跟进内容',
        dataIndex: 'content',
        render(text, record) {
          return <span style={{fontSize:'14px', display: 'block', textAlign: 'left'}}>{record.content}</span>
        }
      },
      {
        title: '附件',
        dataIndex: 'fileId',
        key: 'fileId',
        width:'8%',
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

    const columns2 = [
      {
        title: '产品信息',
        dataIndex: 'itemName',
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{record.itemName}</span>
        }
      },{
        title: '状态',
        dataIndex: 'status',
        render(text, record, index){
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
      },{
        title: '选择退保产品',
        render(text, record, index) {
          if(record.surrenderFlag == 'Y'){
            return <div>
              <Checkbox disabled='true' checked={true}></Checkbox>
            </div>
          }
          else if (record.source == 'ORDER') {
            if(record.surrenderFlag == 'N'||record.surrenderFlag == ''||record.surrenderFlag == null){
              return <div>
                <Checkbox disabled={that.state.checkBoxFlag} onChange={that.onChange.bind(this,that,record)}></Checkbox>
              </div>
            }
          }
          else if(record.source == 'ADDITION') {
            if(record.surrenderFlag == 'N'||record.surrenderFlag == ''||record.surrenderFlag == null){
              return <div>
                <Checkbox disabled={record.daFlag||that.state.checkBoxFlag} checked={record.cbFlag} onChange={that.onChange.bind(this,that,record)}></Checkbox>
              </div>
            }
          }else {
            return <div>
              <Checkbox disabled={record.daFlag||that.state.checkBoxFlag} checked={record.cbFlag} onChange={that.onChange.bind(this,that,record)}></Checkbox>
            </div>
          }
        }

      }]

    return (
      <div className={styles.table_border2}>
        <div className={styles.item_div} style={{paddingBottom:'30px'}}>
          <b className={styles.b_sty} >|</b>
          <font  className={styles.title_font}>保单信息</font>
        </div>

        <div style={{marginTop:'30px'}}>
          <AfterFollowExitForm
            getOrder={that.getOrder.bind(that)}
            order={this.props.order}
            aStatus={that.state.aStatus}
            dispatch={this.props.dispatch}
            afterId={this.props.afterId}/>
        </div>

        <div>
        </div>
        <div className={styles.item_div}  style={{paddingBottom:'30px'}}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>第一步：选择退保项目</font>
        </div>
        <div>
          <div style={{marginTop:'30px'}}>
            <Table scroll={{x:'100%'}}
              dataSource={this.state.exitTableList}
              columns={columns2} bordered/>
          </div>
          <div style={{margin:'2%'}}>
          </div>
        </div>
        <div className={styles.item_div} >
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>第二步：上传退保申请表格</font>
        </div>
        <div>
          <div style={{marginTop:'30px'}}>
            <Table scroll={{x:'100%'}} dataSource={this.state.rfData.rows}
             pagination={this.state.pagination}  onChange={this.tableChange.bind(this)}
             columns={columns} bordered  rowKey='id'/>
          </div>

        </div>
        <div>
          {
            this.state.statusFlag &&
            <AfterFollowExitForm2
              getOrderData={that.state.getOrderData}
              changeSFlag={that.changeSFlag.bind(that)}
              changeStatus={that.changeStatus.bind(that)}
              changeExitTableList={that.changeExitTableList.bind(that)}
              changeRFData={that.changeRFData.bind(that)}
              order={that.props.order}
              dispatch={that.props.dispatch}
              exitTableList={that.state.exitTableList}
              afterId={that.props.afterId}
              orderId={that.props.orderId}
            />
          }
          </div>
      </div>
    );
  }
}
