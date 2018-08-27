import React  , { Component } from 'react';
import {Tabs,Table, Form, Checkbox,Input,Row,Col, Button, Select, DatePicker,Tooltip,Icon,InputNumber,Modal,textarea} from 'antd';
import * as styles from '../../styles/order.css';
import * as models from '../../models/order';
import request from '../../utils/request';
import  AfterPerson from './AfterFormPerson';
import  AfterTeam from './AfterFormTeam';
import moment from 'moment';

const TabPane = Tabs.TabPane;

function cancelAfter(that,value){
  if(value.afterStatus=='FAIL'||value.afterStatus=='SUCCESS'){
    Modal.info({
      title: '提示！',
      content: '未提交、处理成功、处理失败的售后数据不允许取消！',
    });
  }else {
    const params = {
      afterId: value.afterId,
      afterStatus: value.afterStatus
    };
    Modal.confirm({
      title: '提示',
      content: '确定取消售后申请？',
      okText: '确认',
      cancelText: '取消',
      onOk:cancelOK
    });
    function cancelOK(){
      that.props.dispatch({
        type:'order/fetchCancelAfter',
        payload:{params},
      });
    }
  }
}


export default class OrderAppreciationServe extends Component {


  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentWillMount() {

    this.props.dispatch({
      type: 'order/fetchAfter',
      payload: {},
    });

    let paramsCode ={
      afterStatusCodes : 'ORD.AFTER_STATUS',  //售后状态
      afterTypeCodes : 'ORD.AFTER_TYPE'
    };
    this.props.dispatch({
      type: 'order/fetchCode',
      payload: {paramsCode},
    });
  }


  render() {
    const that = this ;
    const atListCode = that.props.order.codeList.afterTypeCodes;
    const asListCode = that.props.order.codeList.afterStatusCodes;
    const columns = [
      {
        title: '售后编号',
        dataIndex: 'afterNum',
        className:styles.text_center
      },{
        title: '保单编号',
        dataIndex: 'policyNumber',
        className:styles.text_center,
        render(text, record, index) {
          return <div>
            <a onClick={()=>location.hash = '/OrderDetail/'+record.afterId}>{record.policyNumber}</a>
          </div>
        }
      },{
        title: '产品信息',
        dataIndex: 'item',
        className:styles.text_center
      },{
        title: '投保人',
        dataIndex: 'applicant',
        className:styles.text_center
      },{
        title: '受保人',
        dataIndex: 'insurant',
        className:styles.text_center
      },{
        title: '售后类型',
        dataIndex: 'afterType',
        className:styles.text_center,
        render(text, record, index){
          for(let i = 0;i<atListCode.length;i++){
            if(record.afterType == atListCode[i].value){
              return <div>{atListCode[i].meaning}</div>
            }
          }
        }
      },{
        title: '提交时间',
        dataIndex: 'creationDate',
        className:styles.text_center
      },{
        title: '最后更新时间',
        dataIndex: 'lastUpdateDate',
        className:styles.text_center,
      },{
        title: '状态',
        dataIndex: 'afterStatus',
        className:styles.text_center,
        render(text, record, index){
          for(let j = 0;j<asListCode.length;j++){
            if(record.afterStatus == asListCode[j].value){
              return <div>{asListCode[j].meaning}</div>
            }
          }
        }
      },{
        title: '查看日志',
        className:styles.text_center,
        render(text, record, index) {
          return <div>
            <Button style={{marginRight:'5%',backgroundColor:'#d1b97f',color:'white'}} onClick={()=>location.hash = '/renewalPersonal/'+record.afterId}>查看日志</Button>
          </div>
        }
      }, {
        title: '跟进',
        className:styles.text_center,
        render(text, record, index) {
          if(record.afterType=='XB'){
            return <div>
              <Button style={{marginRight:'5%',backgroundColor:'#d1b97f',color:'white'}} onClick={()=>location.hash = '/AfterFollowApplication/'+record.afterId+'/'+record.orderId}>跟进</Button>
            </div>
          }
          else if(record.afterType=='TB'){
            return <div>
              <Button style={{marginRight:'5%',backgroundColor:'#d1b97f',color:'white'}} onClick={()=>location.hash = '/AfterFollowExit/'+record.afterId+'/'+record.orderId}>跟进</Button>
            </div>
          }else {
            return <div>
              <Button style={{marginRight:'5%',backgroundColor:'#d1b97f',color:'white'}} onClick={()=>location.hash = '/AfterFollowOther/'+record.afterId}>跟进</Button>
            </div>
          }
        }
      }, {
        title: '取消',
        className:styles.text_center,
        onCellClick(record, event){
        },
        render(text, record, index) {
          return <div>
            <Button style={{marginRight:'5%',backgroundColor:'#d1b97f',color:'white'}}
                    onClick={cancelAfter.bind(this,that,record)}>取消</Button>
          </div>
        }
      }]

    const columns2 = [
      {
        title: '售后编号',
        dataIndex: 'afterNum',
        className:styles.text_center
      },{
        title: '保单编号',
        dataIndex: 'policyNumber',
        className:styles.text_center,
        render(text, record, index) {
          return <div>
            <a onClick={()=>location.hash = '/OrderDetail/'+record.afterId}>{record.policyNumber}</a>
          </div>
        }
      },{
        title: '渠道',
        dataIndex: 'channelName'
      },{
        title: '产品信息',
        dataIndex: 'item'
      },{
        title: '售后类型',
        dataIndex: 'afterType',
        className:styles.text_center,
        render(text, record, index){
          for(let i = 0;i<atListCode.length;i++){
            if(record.afterType == atListCode[i].value){
              return <div>{atListCode[i].meaning}</div>
            }
          }
        }
      },{
        title: '提交时间',
        dataIndex: 'creationDate',
        className:styles.text_center
      },{
        title: '最后更新时间',
        dataIndex: 'lastUpdateDate',
        className:styles.text_center,
      },{
        title: '状态',
        dataIndex: 'afterStatus',
        className:styles.text_center,
        render(text, record, index){
          for(let j = 0;j<asListCode.length;j++){
            if(record.afterStatus == asListCode[j].value){
              return <div>{asListCode[j].meaning}</div>
            }
          }
        }
      },{
        title: '查看日志',
        className:styles.text_center,
        render(text, record, index) {
          return <div>
            <Button style={{marginRight:'5%',backgroundColor:'#d1b97f',color:'white'}} onClick={()=>location.hash = '/renewalTeam/'+record.afterId}>查看日志</Button>
          </div>
        }
      }, {
        title: '跟进',
        className:styles.text_center,
        render(text, record, index) {
          if(record.afterType=='XB'){
            return <div>
              <Button style={{marginRight:'5%',backgroundColor:'#d1b97f',color:'white'}} onClick={()=>location.hash = '/AfterFollowApplication/'+record.afterId+'/'+record.orderId}>跟进</Button>
            </div>
          }
          else if(record.afterType=='TB'){
            return <div>
              <Button style={{marginRight:'5%',backgroundColor:'#d1b97f',color:'white'}} onClick={()=>location.hash = '/AfterFollowApplication/'+record.afterId+'/'+record.orderId}>跟进</Button>
            </div>
          }else {
            return <div>
              <Button style={{marginRight:'5%',backgroundColor:'#d1b97f',color:'white'}} onClick={()=>location.hash = '/AfterFollowOther/'+record.afterId}>跟进</Button>
            </div>
          }
        }
      }]


    return (
      <div className={styles.order} >
        <div className={styles.item_div}>
          <b className={styles.b_sty} >|</b>
          <font className={styles.title_font}>售后申请</font>
          <Button style={{float:'right',backgroundColor:'#d1b97f',color:'white'}} onClick={()=>location.hash = '/AfterNew'}>售后申请</Button>
          <Button style={{marginRight:'2%',float:'right',backgroundColor:'#d1b97f',color:'white'}} onClick={()=>location.hash = '/AfterRenewal'}>待续保清单</Button>

          <Tabs   type="card" defaultActiveKey="1" >
            <TabPane tab={<span>个人</span>} style={{clear:'both'}} key="1">
              <div  className={styles.item_div2} class="col-sm-6">
                <AfterPerson order={this.props.order} dispatch={this.props.dispatch}/>
              </div>
              <div className={styles.item_div3}>
                <Table dataSource={this.props.order.afterList} scroll={{x: '130%'}}  columns={columns} bordered/>
              </div>
            </TabPane>

            <TabPane tab={<span>团队</span>} style={{clear:'both'}} key="2">
              <div  className={styles.item_div2} class="col-sm-6">
                <AfterTeam order={this.props.order} dispatch={this.props.dispatch}/>
              </div>
              <div className={styles.item_div3}>
                <Table dataSource={this.props.order.afterList} scroll={{x: '130%'}}  columns={columns2} bordered/>
              </div>
            </TabPane>

            <TabPane tab={<span>转介绍</span>} style={{clear:'both'}} key="3">
              <div  className={styles.item_div2} class="col-sm-6">
                <AfterTeam order={this.props.order} dispatch={this.props.dispatch}/>
              </div>
              <div className={styles.item_div3}>
                <Table dataSource={this.props.order.afterList} scroll={{x: '130%'}}   columns={columns3} bordered/>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
