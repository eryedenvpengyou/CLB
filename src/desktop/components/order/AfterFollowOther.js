import React  , { Component } from 'react';
import {Table, Form} from 'antd';
import * as styles from '../../styles/afterApplication.css';
import AfterFollowOtherForm from "./AfterFollowOtherForm";
import AfterFollowOtherForm2 from "./AfterFollowOtherForm2";
import Download from '../common/Download';
import * as service from '../../services/order';


export default class AfterFollowOther extends Component {

  constructor(props){
    super(props);
    this.state = {
      statusFlag: false,
      aFId:'',
      getOrderData:[],
      aStatus:'',
      tfData:{},
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      }
    }
  }
  componentWillMount() {
    if(this.props.afterStatus=='AUDITAGIN'|| this.props.afterStatus == 'TOAUDIT' || this.props.afterStatus == 'SUBMIT'){
      this.setState({
        statusFlag : true
      })
    }

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
          tfData : data,
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
  getOrder(value){
    this.setState({
      getOrderData:value
    })
  }

  changeStatus(value){
    this.setState({
      aStatus:value
    })
  }
  changeRFData(value){
    this.setState({
      tfData : value
    })
  }
  changeSFlag(value){
    this.setState({
      statusFlag : value
    })
  }

  render() {
    const  that = this;
    const columns = [
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
          return <span style={{fontSize:'14px', display: 'block', textAlign: 'left'}}>{record.content}</span>
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
      <div  className={styles.table_border2}>
        <div className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>保单信息</font>
        </div>

        <div style={{marginTop:'30px'}}>
          <AfterFollowOtherForm
            getOrder={that.getOrder.bind(that)}
            order={this.props.order}
            aStatus={that.state.aStatus}
            dispatch={this.props.dispatch}
            afterId={this.props.afterId}/>
        </div>

        <div className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>售后跟进记录</font>
        </div>

        <div>
          <div  style={{marginTop:'30px'}} >
            <Table className={styles.commons} dataSource={this.state.tfData.rows}
                   pagination={this.state.pagination}  onChange={this.tableChange.bind(this)}
                   columns={columns} bordered rowKey='id'/>
          </div>
          <div style={{margin:'2%'}}>
          </div>
        </div>
        <div>
          {
            this.state.statusFlag &&
            <AfterFollowOtherForm2
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
