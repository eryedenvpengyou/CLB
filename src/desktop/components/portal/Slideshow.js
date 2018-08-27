/*
 * show 轮播图
 * @author:Rex.Hua
 * @version:20170510
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Button  } from 'antd';

import { Carousel } from 'react-bootstrap';
import styles from '../layout/ProtalLayout.css';
import * as portalStyles from '../../styles/portal.css';
import HeaderBg from '../../styles/images/loginbg.png';
import { getArticleLBT } from '../../services/home';
import { PICTURE_ADDRESS } from  '../../constants';
import {noticeUpdate,noticeList} from '../../services/notice';

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

function getLen(str){
    if(!str) return "";
    var templen=0;
    for(var i=0;i<str.length;i++){
        if(str.charCodeAt(i)>255){
            templen+=2;
        }else{
            templen++
        }
    }
    return templen;
}

var noticeStyle = portalStyles.noticeListNew;

class Slideshow extends React.Component {
  // 构造器
  constructor(props) {
    super(props);
    this.state = {
      //轮播图
      ArticleLBTList: [],
      noticeDataList:[],
    };
  }
  // 页面加载前执行
  componentWillMount() {
    //轮播图查询
    const detailBody = {
      status: "release",
      pcFlag: "Y"
    };
    getArticleLBT(detailBody).then((data) => {
      if (data.success) {
        this.setState({
          ArticleLBTList: data.rows
        });
      } else {
        message.warn(data.message);
        return;
      }
    });
    //公告栏查询
    const noticeBody = {
      releasePosition: "GGL",
      userId:JSON.parse(localStorage.user).userId,
      page: 1,
      pagesize: 8
    };
    noticeList(noticeBody).then((data) => {
        for (var i=0; i<data.rows.length; i++) {
          data.rows[i].key = i+1;
        }
        this.setState({
          loading: true,
          noticeDataList: data.rows,
        });
      });
  }
  //打开公告栏详情
  openDetail(record,e){
      var body = {};
      body.announcementId = record.announcementId;
      body.userId = JSON.parse(localStorage.user).userId;
      body.status = "READ";
      body.sourceCode = "ANNOUNCEMENT";
      body.sourceHeaderId = record.articleId;
      // 文章已读标识
      noticeUpdate(body).then((data) => {
      })
      window.open("/#/classroom/reviewDetail/announcement/"+record.articleId,"_blank")
  }
  //打开轮播图详情
  openLBTDetail(record, e) {
      if (record.dataSource == "ARTICLE") {
        if (record.sourceType == "WQHG") {
          location.hash = "/classroom/reviewDetail/classroom/"+record.dataSourceId;
        } else if (record.sourceType == 'GGL') {
          window.open("/#/classroom/reviewDetail/announcement/"+record.dataSourceId,"_blank")
        }
      } else if (record.dataSource == "COURSE") {
        location.hash = "/classroom/trainingCourseDetail/"+record.dataSourceId;
      }else if(record.dataSource == 'PRODUCT'){
        location.hash=`/production/detail/${record.sourceType}/${record.dataSourceId}`
      }
  }

  render() {
    //公告栏
    const noticeColumns = [{
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width:265,
      render: (text, record, index) => {
        // 读取状态
        if(record.status=="NEW"){
          noticeStyle = portalStyles.noticeListNew;
        }else{
          noticeStyle = portalStyles.noticeListRead;
        }
        if(getLen(text)>29){
          text = cutString(text, 29)+" ...";
        }
        return(
          <a className={noticeStyle} style={{float:'left'}} href="javascript:;" onClick={this.openDetail.bind(this,record)} title= {record.content}>{text}</a>
        )
      }
    }, {
      title: '日期',
      dataIndex: 'showDate',
      key: 'showDate',
      width: 60,
      render: (text, record, index) => {
        // 读取状态
        if(record.status=="NEW"){
          noticeStyle = portalStyles.noticeListNew;
        }else{
          noticeStyle = portalStyles.noticeListRead;
        }
        return(
          <a className={noticeStyle} style={{float:'right'}} href="javascript:;" onClick={this.openDetail.bind(this,record)}  >{text}</a>
        )
      }
    }];

    return (
      <Carousel style={{height:'500px'}}>
        {this.state.ArticleLBTList.map((data, index) => {
          if(data.pcFileSrc){
            return (
                <Carousel.Item  key={data.slideshowId}>
                  <div>
                    <a href="javascript:;" onClick={this.openLBTDetail.bind(this,data)} style={{height:'500px',width:'100%',margin:'0 auto',position:'relative', overflow:'hidden'}} >
                      <img src={PICTURE_ADDRESS+data.pcFileSrc} style={{height:'100%',minWidth:'fit-content',width:'100%',margin:'0 auto', overflow:'hidden',position:'absolute',left: '50%',transform:'translateX(-50%)'}} alt="财联邦" />
                    </a>
                    {/*<Carousel.Caption>
                      <h3>First slide label</h3>
                      <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>*/}
                    <div className={styles.slideshowContent}>
                      {/* 悬浮框 */}
                      <div style={{zIndex:'2',width:'100%',textAlign:'right'}}>
                          <a href="javascript:;" onClick={()=>{window.location.hash = '/portal/businessChoose'}}>
                            <div className={styles.subscribeBtn}>
                              快速预约
                          　</div>
                          </a>
                          <a href="javascript:;" onClick={()=>{window.location.hash = '/plan/myPlanLibrary'}}>
                            <div className={styles.planLibraryBtn}>
                              计划书库
                          　</div>
                          </a>
                      </div>
                      {/* 公告栏 */}
                      <div style={{zIndex:'2',width:'100%'}}>
                        <div style={{float:'right'}}>
                          <div className={styles.noticeBoard}>
                            <span></span>
                            <span>公告栏</span>
                          </div>
                          <Table className={styles.noticeList} columns={noticeColumns} dataSource={this.state.noticeDataList} pagination={false} showHeader={false} size="small" />
                          <div style={{zIndex:'16',width:'100%',textAlign:'center',marginTop:'-1px'}}>
                            <Button className={styles.noticeButton} onClick={()=>location.hash = "/portal/announcementSummary"} style={{height:'27px',lineHeight:'27px',zIndex:'9999'}}>查看更多</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Carousel.Item>
            )
          }
        })}
      </Carousel>
    );
  }
}
export default connect()(Slideshow);
