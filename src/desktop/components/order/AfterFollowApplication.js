import React  , { Component } from 'react';
import {Table, Form} from 'antd';
import * as styles from '../../styles/afterApplication.css';
import AfterFollowApplicationForm1 from "./AfterFollowApplicationForm1";
import AfterFollowApplicationForm2 from "./AfterFollowApplicationForm2";
import AfterFollowApplicationForm3 from "./AfterFollowApplicationForm3";
import Download from '../common/Download';
import * as service from '../../services/order';
import { getCode } from '../../services/code';


export default class AfterFollowApplicationForm extends Component {

  //构造器
  constructor(props){
    super(props);
    this.state = {
      statusFlag : false,
      aStatus:'',
      rfData:{},
      getOrderData:[],
      codeList:{
        currencyCodes:[],
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      }
    }
  }

  //界面初始加载的方法
  componentWillMount() {
    this.getAfterFollowData()
    if(this.props.afterStatus=='AUDITAGIN'|| this.props.afterStatus == 'TOAUDIT' || this.props.afterStatus == 'SUBMIT'){
      this.setState({
        statusFlag : true
      })
    }
    const params = {
      orderId: this.props.orderId
    };
    this.props.dispatch({
      type:'order/fetchRenewalProduct',
      payload:{params},
    });

    //币种快码
    const codeBody = {
      currencyCodes: 'PUB.CURRENCY',
    };
    getCode(codeBody).then((data)=>{
      this.setState({
        codeList: data,
      });
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
  
  getOrder(value){
    this.setState({
      getOrderData:value
    })
  }
  changeRFData(value){
    this.setState({
      rfData : value
    })
  }
  changeSFlag(value){
    this.setState({
      statusFlag : value
    })
  }
  changeStatus(value){
    this.setState({
      aStatus:value
    })
  }

  render() {
    const currencyCodesList = this.state.codeList.currencyCodes;
    const that =this;
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
          for(let i = 0;i<currencyCodesList.length;i++){
            if(record.currency == currencyCodesList[i].value){
              return <span style={{fontSize:'14px'}}>{currencyCodesList[i].meaning}</span>
            }else {
              return <span style={{fontSize:'14px'}}>{record.currency}</span>
            }
          }

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
        dataIndex: 'userName',
        className:styles.text_center,
        width:'9%',
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{record.userName}</span>
        }
      },{
        title: '跟进时间',
        dataIndex: 'followDate',
        className:styles.text_center,
        width:'18%',
        render(text, record) {
          return <span style={{fontSize:'14px'}}>{record.followDate}</span>
        }
      },{
        title: '跟进内容',
        dataIndex: 'content',
        className:styles.text_center,
        render(text, record) {
          return <span style={{fontSize:'14px', display: 'block', textAlign: 'left'}} dangerouslySetInnerHTML={{__html: record.content.replace(/\n/g, '</br>')}} />
        }
      },
      {
        title: '附件',
        dataIndex: 'fileId',
        key: 'fileId',
        width:'8%',
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

    return (
      <div className={styles.table_border2}>
        <div className={styles.item_div} style={{marginTop:'20px'}}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>保单信息</font>
        </div>

        <div  style={{marginTop:'30px'}}>
          <AfterFollowApplicationForm1
            aStatus={that.state.aStatus}
            getOrder={that.getOrder.bind(that)}
            order={this.props.order}
            dispatch={this.props.dispatch}
            afterId={this.props.afterId}/>
        </div>

        <div className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>续保信息</font>
        </div>
        <div  style={{marginTop:'30px'}}>
          <AfterFollowApplicationForm2  order={this.props.order} dispatch={this.props.dispatch} orderId={this.props.orderId}/>
        </div>
        <div className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>本期续保产品</font>
        </div>
        <div  style={{marginTop:'30px'}}>
          <Table className={styles.commons} dataSource={this.props.order.renewalProductList}  columns={columns1} bordered rowKey='id'/>
        </div>

        <div className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>售后跟进记录</font>
        </div>
        <div>
          <div style={{marginTop:'30px'}} >
            <Table className={styles.commons}  dataSource={this.state.rfData.rows}
                   pagination={this.state.pagination}  onChange={this.tableChange.bind(this)}
                   columns={columns2} bordered rowKey='id'/>
          </div>
          <div style={{margin:'2%'}}>
          </div>
        </div>
        <div>
          {
            this.state.statusFlag&&
            <AfterFollowApplicationForm3
              getOrderData={that.state.getOrderData}
              changeSFlag={that.changeSFlag.bind(that)}
              changeStatus={that.changeStatus.bind(that)}
              changeRFData={that.changeRFData.bind(that)}
              order={that.props.order}
              dispatch={that.props.dispatch}
              afterId={that.props.afterId}
              orderId={that.props.orderId}
            />
          }

        </div>

      </div>
    );
  }
}
