/*
 * show 代办列表
 * @author:zhouting
 * @version:20170510
 */
import React from 'react';
import { connect } from 'dva';
import {Row, Col, Table, Button } from 'antd';
import * as portalStyles from '../../styles/portal.css';
import { getNotificationList, updateNotificationList } from '../../services/home';
import class02 from '../../styles/images/portal/class02.png';

function cutString(str,len,suffix){
    if(!str) return "";
    if(len<= 0) return "";
    if(!suffix) suffix = "";
    var templen=0;
    for(var i=0;i<str.length;i++){
        if(str.charCodeAt(i)>255){
            templen+=2;
        }else{
            templen++
        }
        if(templen == len){
            return str.substring(0,i+1)+suffix;
        }else if(templen >len){
            return str.substring(0,i)+suffix;
        }
    }
        return str;
}

class Commission extends React.Component {
  // 构造器
  constructor(props) {
    super(props);
    this.state = {
      dataList:[],
      undoCount:0,
    };
  }
  // 页面加载前执行
  componentWillMount() {
    //待办查询
    var body = {
      page: 1,
      pagesize: 999999999
    };
    getNotificationList(body).then((data) => {
        for (var i=0; i<data.rows.length; i++) {
          data.rows[i].key = i+1;
        }
        this.setState({
          loading: true,
          dataList: data.rows,
        });
    });
    //待办数量汇总
    body = {
      status: "NEW",
        page: 1,
        pagesize: 999999999
    };
    getNotificationList(body).then((data) => {
        this.setState({
          undoCount: data.total,
        });
    });
  }

  //打开通知URL
  openDetail(record,e){
      var body = {};
      body.notificationId = record.notificationId;
      body.status = "READ";
      var bodyAttr = [];
      bodyAttr.push(body)
      // 文章已读标识
      updateNotificationList(bodyAttr).then((data) => {
      })
      if(record.requestUrl)
        location.hash = record.requestUrl;
  }

  render() {
      //待办列表
      const columns = [{
        title: '待办',
        dataIndex: 'content',
        key: 'content',
        width: 420,
        render: (text, record, index) => {
          // 读取状态
          if(record.status=="READ"){
            var noticeStyle = portalStyles.noticeListRead;
            var noticeStyleTitle = portalStyles.noticeListRead;
          }else if(record.importantFlag=="Y"){
            var noticeStyle = portalStyles.importantNew;
            var noticeStyleTitle = portalStyles.importantNew;
          }else if(record.status=="NEW"){
            var noticeStyle = portalStyles.noticeListNew;
            var noticeStyleTitle = portalStyles.noticeListTitleNew;
          }
          var text = record.content;
          var titleLength = ( "["+record.title+"]").length;
          text = cutString(text,(61 - titleLength));
          return(
            <a className={noticeStyle} style={{float:'left'}} href="javascript:;" onClick={this.openDetail.bind(this,record)} title= {record.content}><span className={noticeStyleTitle}>[{record.title}] </span><span>{text}</span></a>
          )
        }
      }, {
        title: '按钮',
        dataIndex: 'button',
        key: 'button',
        width: 100,
        render: (text, record, index) => {
          // 读取状态
          if(record.status=="READ"){
            var noticeStyle = portalStyles.noticeListRead;
          }else if(record.importantFlag=="Y"){
            var noticeStyle = portalStyles.importantNew;
            var noticeStyleTitle = portalStyles.importantNew;
          }else if(record.status=="NEW"){
            var noticeStyle = portalStyles.noticeListNew;
          }
          var showDate = record.showDate;
          showDate = showDate.substr(0,10);
          return(
            <a className={noticeStyle} style={{float:'right'}} href="javascript:;" onClick={this.openDetail.bind(this,record)}  >{showDate}</a>
          )
        }
      }];

    return(
      <div>
        <Col className={portalStyles.class02} >
          <Row>
            <Col span={6} className={portalStyles.class02Left}>
                <div className={portalStyles.lf} style={{width:'290px',height:'412px',backgroundImage:'url('+class02+')'}}>
                    {/* <img src={class02} /> */}
                    <h2>待办列表 ({this.state.undoCount})</h2>
                    <h4>List of agents ({this.state.undoCount})</h4>
                </div>
            </Col>
            <Col span={18} className={portalStyles.class02Right}>
              <div style={{marginTop:'30px',height:'80%',width:'90%',marginLeft:'50px'}}>
                <Table scroll={{x:100,y:350}} columns={columns} dataSource={this.state.dataList} showHeader={false} pagination={false}/>
              </div>
            </Col>
          </Row>
         </Col>
      </div>
    );
  }
}
export default connect()(Commission);
