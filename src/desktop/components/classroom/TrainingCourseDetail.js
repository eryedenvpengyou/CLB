/*
 * view 财课堂
 * @author:Lijun
 * @version:20170705
 */
import React, { Component } from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { isEmpty, isNumber } from 'lodash';
import { Button, Col, Form, Input, Layout, Modal, Row, Spin, Table } from 'antd';
import moment from 'moment';
import { Player } from 'video-react';
import style from '../../styles/classroom.css';
import { fetchCourse as fetchDetailData } from '../../services/course.js';
import { fetchDatumList as fetchDatumData, updateDowloadTimes } from '../../services/classroom.js';
import { personalContract as fetchPersonalContract } from '../../services/channel.js';
import ApplyPopup from './ApplyPopup';
import EvaluationPopup from './EvaluationPopup';
import icon02 from '../../styles/images/mine/icon02.png';
import icon01 from '../../styles/images/mine/icon01.png';

const { Content } = Layout;

class TrainingCourseDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      loading2: false,
      detailData: undefined,
      datumData: [],
      pagination: {},
      isSignedChannel: false,
      studentsList: [],
      visible: false,
      videoVisible: false,
    };

    [
      'render',
      'handleChange',
      'handleOpenVideo',
      'handleCloseVideo',
      'handleShowStudentsInfoModal',
      'handleHideStudentsInfoModal',
      'handleRefresh',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    this.fetchPersonalContractData();
  }

  componentDidMount() {
    const params = {};
    const { itemId } = this.props;
    params.courseId = Number(itemId);
    if (!this.state.detailData) {
      this.fetchCourseData(params);
    }

    if (isEmpty(this.state.datumData)) {
      const params2 = {};
      params2.pagesize = 20;
      params2.page = 1;
      params2.courseId = Number(itemId);
      this.fetchData(params2);
    }
  }

  handleRefresh() {
    const params = {};
    const { itemId } = this.props;
    params.courseId = Number(itemId);
    this.fetchCourseData(params);
  }

  fetchCourseData(paramsData) {
    const params = paramsData;
    this.setState({
      loading: true,
    });
    params.pcFlag = 'Y';
    fetchDetailData(params)
     .then((data) => {
       const d = data;

       if (!isEmpty(d.rows)) {
         this.setState({
           loading: false,
           detailData: d.rows[0],
         });
       }
     });
  }


  fetchData(paramsData = {}) {
    const params = paramsData;
    this.setState({
      loading2: true,
    });
    fetchDatumData(params)
     .then((data) => {
       const d = data;
       const pagination = this.state.pagination;
       pagination.pageSize = params.pagesize;
       pagination.total = d.total;
       d.rows.map((rowData, i) => {
         rowData.key = i + 1;
       });

       this.setState({
         loading2: false,
         datumData: data.rows,
         pagination,
       });
     });
  }

  fetchPersonalContractData() {
    let isSignedChannel = this.state.isSignedChannel;
    const params = {};
    params.channelId = JSON.parse(localStorage.user).relatedPartyId;
    fetchPersonalContract(params).then((data) => {
      if (data.success && !isEmpty(data.rows)) {
        isSignedChannel = true;
        this.setState({
          isSignedChannel,
        });
      }
    });
  }

  handleChange(pager) {
    const params = {};
    const pagination = pager;
    this.setState({
      pagination,
    });
    params.pagesize = pagination.pageSize;
    params.page = pagination.current;
    this.fetchData(params);
  }

  handleGoToVoice() {
    if(this.url.indexOf('http://') < 0){
      if(this.url.indexOf('https://') < 0){
        window.open(`http://${this.url}`);
      }else{
        window.open(this.url);
      }
    }else{
      window.open(this.url);
    }
    // window.open((this.url.indexOf('http://') < 0 || this.url.indexOf('https://') < 0) ? `http://${this.url}` : this.url);
  }

  handleGetStudentsList(studentsList) {
    const detailData = this.state.detailData;
    detailData.students = studentsList;
    this.setState({
      detailData,
    });
  }

  handleShowStudentsInfoModal() {
    this.setState({
      visible: true,
    });
  }

  handleHideStudentsInfoModal() {
    this.setState({
      visible: false,
    });
  }

  handleOpenVideo() {
    this.setState({
      videoVisible: true,
    }, () => {
      const video = document.querySelector('video');
      if (video !== undefined && video !== null) {
        video.oncontextmenu = () => false;
      }
    });
  }

  handleCloseVideo() {
    this.setState({
      videoVisible: false,
    });
  }

  render() {
    const {
      detailData,
      datumData,
      pagination,
      loading,
      loading2,
      isSignedChannel,
      visible,
      videoVisible,
    } = this.state;

    const courseDate = (detailData && detailData.courseDate) ?
          new Date(detailData.courseDate) : undefined;
    const endCourseDate = courseDate ? new Date(Date.parse(courseDate) +
          (detailData && detailData.duration ?
          detailData.duration * 60 * 1000 : 0)) : '';
    let popupButton;
    let videoButton;
    if (detailData && detailData.status) {
      if (detailData.status === 'NOTSTARTED') {
        popupButton = (
          <ApplyPopup
            rowData={detailData}
            appliedDesc="课程报名"
            getStudentsList={this.handleGetStudentsList}
            fetchData={this.handleRefresh}
          />
      );
      } else if (detailData.status === 'COMPLETE' && detailData.enrollFlag === 'Y') {
        popupButton = (
          <EvaluationPopup rowData={detailData} />
      );
      } else {
        popupButton = '';
      }
      //更新财课堂逻辑
      if (detailData.url) {
        videoButton = (
          <Button className={`${style.btn} ${style['link-btn']}`} onClick={this.handleGoToVoice.bind({ url: detailData && detailData.url ? detailData.url : '' })} size="large">点我看课程</Button>
        );
      } else {
        videoButton = (
          <Button className={`${style.btn} ${style['link-btn']}`} disabled={isEmpty(detailData.boutiqueUrl) || !isSignedChannel} onClick={this.handleOpenVideo} size="large">点我看视频</Button>
        );
      }


      // if (detailData.status === 'COMPLETE') {
      //   videoButton = (
      //     <Button className={`${style.btn} ${style['link-btn']}`} disabled={isEmpty(detailData.boutiqueUrl) || !isSignedChannel} onClick={this.handleOpenVideo} size="large">点我看视频</Button>
      //   );
      // } else {
      //   videoButton = (
      //     <Button className={`${style.btn} ${style['link-btn']}`} onClick={this.handleGoToVoice.bind({ url: detailData && detailData.url ? detailData.url : '' })} size="large">点我看直播</Button>
      //   );
      // }
    }

    if (detailData && detailData.students) {
      detailData.students.map((n, i) => {
        const data = n;
        data.key = `student${i + 1}`;
      });
    }

    const columns = [
      {
        title: '下载',
        dataIndex: 'fileId',
        className: `${style['text-center']}`,
        key: 'fileId',
        width: 60,
        render: (text, record) => {
          const param = {
            fileId: record.fileId,
            access_token: localStorage.access_token,
          };
          let downloadButton;
          if (isSignedChannel && record.fileId !== undefined && record.fileId !== null) {
            downloadButton = (
              <a
                onClick={() => {
                  window.location.href = `/api/fms/sys/attach/file/detail?${stringify(param)}`;
                  updateDowloadTimes({ lineId: record.lineId });
                }}
                style={{ display: 'inline-block', textAlign: 'center', width: '100%' }}
              >
                <img src={icon02} style={{ display: 'inline-block' }} alt="下载" />
              </a>
            );
          } else {
            downloadButton = (
              <a
                style={{ display: 'inline-block', textAlign: 'center', width: '100%', cursor: 'not-allowed' }}
              >
                <img src={icon01} style={{ display: 'inline-block' }} alt="下载" />
              </a>
            );
          }
          return (downloadButton);
        },
      }, {
        title: '关联课程',
        className: `${style['text-center']}`,
        dataIndex: 'topic',
        width: 180,
      }, {
        title: '文件内容',
        className: `${style['text-center']}`,
        dataIndex: 'fileName',
      }, {
        title: '文件大小',
        className: `${style['text-center']}`,
        dataIndex: 'fileSize',
        width: 90,
        render: text => (`${text}kb`),
      }, {
        title: '更新时间',
        className: `${style['text-center']}`,
        dataIndex: 'lastUpdateDate',
        width: 160,
        render: text => (isEmpty(text) ? '' : moment(text).format('YYYY-MM-DD HH:mm:ss')),
      },
    ];

    const studentsDetailButton = detailData && !isEmpty(detailData.students) ? <Button className={`${style.btn} ${style.apply} ${style['margin-top']}`} onClick={this.handleShowStudentsInfoModal}>查看报名信息</Button> : '';
    const columns2 = [{
      title: '姓名',
      className: `${style['text-center']}`,
      dataIndex: 'name',
      width: 120,
    }, {
      title: '电话',
      className: `${style['text-center']}`,
      dataIndex: 'phoneNumber',
      width: 150,
    }, {
      title: '邮箱',
      className: `${style['text-center']}`,
      dataIndex: 'mailAddress',
      width: 200,
    }, {
      title: '公司',
      className: `${style['text-center']}`,
      dataIndex: 'company',
      width: 120,
    }, {
      title: '职位',
      className: `${style['text-center']}`,
      dataIndex: 'position',
      width: 120,
    }, {
      title: '参与方式',
      className: `${style['text-center']}`,
      dataIndex: 'joinMethod',
      width: 120,
      render:(text,record) =>{
        if(text === 1){
          return "线上";
        }else if(text === 2){
          return "线下";
        }else{
          return "线上及线下";
        }
      }
    }];

    return (
      <Content className={`${style.container} ${style['course-detail']}`}>
        <Spin spinning={loading}>
          <Row className={`${style['background-white']}`}>
            <Col xs={18} sm={18} md={18} lg={18} xl={18}>
              <Row className={`${style.container} ${style['border-bottom-grey']}`}>
                <h3 className={style.topic}>{detailData ? detailData.topic : ''}</h3>
              </Row>
              <Row className={`${style.container}`}>
                <ul className={style.list}>
                  <li><i className={`${style.icon} ${style['icon-normal']} ${style['icon-clock']}`} /><h5>课程时间：{courseDate ? moment(courseDate).format('YYYY年MM月DD日 HH:mm') : ''} {courseDate ? `-${moment(endCourseDate).format('HH:mm')}` : ''}</h5></li>
                  <li><i className={`${style.icon} ${style['icon-normal']} ${style['icon-book']}`} /><h5>培训方式：{detailData ? detailData.trainingMethodName : ''}</h5></li>
                  <li><i className={`${style.icon} ${style['icon-normal']} ${style['icon-person']}`} /><h5>培训讲师：{detailData ? detailData.lecturer : ''}</h5></li>
                  <li><i className={`${style.icon} ${style['icon-normal']} ${style['icon-location']}`} /><h5>培训地址：{detailData ? detailData.address : ''}</h5></li>
                  <li><i className={`${style.icon} ${style['icon-normal']} ${style['icon-voice']}`} />
                    <div key="video-dialog">
                      {videoButton}
                      <Modal
                        wrapClassName={`${style.classroom} ${style['student-info']}`}
                        visible={videoVisible}
                        title={null}
                        onOK={this.handleCloseVideo}
                        onCancel={this.handleCloseVideo}
                        footer={null}
                        width={748}
                        onContextmenu={() => false}
                      >
                        <Player>
                          <source src={detailData && detailData.boutiqueUrl ? detailData.boutiqueUrl : ''} />
                        </Player>
                      </Modal>
                      { detailData && detailData.enrollFlag === 'Y' && !isEmpty(detailData.password) ? <span style={{ marginLeft: 12 }}>
                      直播密码：
                      <font className={style.color}>{detailData.password}</font>
                      </span> : ''}
                    </div>
                  </li>
                  <li style={{ paddingLeft: 36, marginTop: -12, color: '#7d7272' }}>温馨提示：仅签约渠道可查看精品视频及下载资料</li>
                </ul>
              </Row>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6} xl={6} className={`${style.container} ${style['border-left-grey']}`} style={{ height: 395, maxHeight: 395 }} >
              <div className={style.action}>
                <h1>￥{(detailData && detailData.price) ? detailData.price : '0.00'}</h1>
                {popupButton}
                <div key="student-info-dialog">
                  {studentsDetailButton}
                  <Modal
                    wrapClassName={`${style.classroom} ${style['student-info']}`}
                    visible={visible}
                    title={null}
                    onOK={this.handleHideStudentsInfoModal}
                    onCancel={this.handleHideStudentsInfoModal}
                    footer={null}
                    width={850}
                  >
                    <Row style={{ height: 48, background: '#e4e4e4' }} />
                    <Row style={{ padding: '12px 50px 60px 50px' }}>
                      <Row className={`${style.title} ${style['text-center']}`}>
                        <h1>报名信息</h1>
                      </Row>
                      <Row className={`${style.table} ${style['margin-top']}`}>
                        <Table
                          pagination={false}
                          bordered
                          columns={columns2}
                          dataSource={detailData ? detailData.students : []}
                          scroll={{ y: 240 }}
                        />
                      </Row>
                    </Row>
                  </Modal>
                </div>
              </div>
            </Col>
          </Row>
          <Row className={`${style['margin-top']} ${style['background-white']}`}>
            <Row className={style['title-container']} ><span className={style['title-bar']}>课程简介</span></Row>
            <Content className={`${style.container}`}>
              {
                detailData && detailData.courseIntroduction ?
                  <Row  className={style.imageText} dangerouslySetInnerHTML={{ __html: (detailData.courseIntroduction) }} />
                : (
                  <div className="ant-table-placeholder">
                    <span>
                      <i className="anticon anticon-frown-o" />
                      暂无数据
                    </span>
                  </div>
                )
              }
            </Content>
          </Row>
          <Row className={`${style['margin-top']} ${style['background-white']}`}>
            <Row className={style['title-container']} ><span className={style['title-bar']}>讲师简介</span></Row>
            <Content className={`${style.container}`}>
              {
                detailData && detailData.lecturerIntroduction ?
                  <Row className={`${style['lecturer-introduction']} ${style.imageText}`} dangerouslySetInnerHTML={{ __html: (detailData.lecturerIntroduction) }} />
                : (
                  <div className="ant-table-placeholder">
                    <span>
                      <i className="anticon anticon-frown-o" />
                      暂无数据
                    </span>
                  </div>
                )
              }
            </Content>

          </Row>
        </Spin>
        <Row className={`${style['margin-top']} ${style['background-white']}`}>
          <Row className={style['title-container']} ><span className={style['title-bar']}>培训资料下载</span></Row>
          <Content className={`${style.container} ${style.table}`}>
            <Table
              pagination={pagination} columns={columns}
              dataSource={datumData}
              loading={loading2}
              onChange={this.handleChange}
              bordered
            />
          </Content>
        </Row>
      </Content>
    );
  }
}
export default connect()(TrainingCourseDetail);
