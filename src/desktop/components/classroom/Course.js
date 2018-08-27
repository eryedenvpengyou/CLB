/*
 * view 财课堂
 * @author:Lijun
 * @version:20170704
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Col, Icon, Layout, Row, Spin, Table } from 'antd';
import isEmpty from 'lodash/isEmpty';
import chunk from 'lodash/chunk';
import moment from 'moment';
import { fetchCourse as course } from '../../services/course.js';
import { fetchReviewList as fetchReview } from '../../services/classroom.js';
import style from '../../styles/classroom.css';
import { PICTURE_ADDRESS } from '../../constants';
import ApplyPopup from './ApplyPopup';
import EvaluationPopup from './EvaluationPopup';
import DatumButton from './DatumButton';
import img4 from '../../styles/images/image4.png';
import img1 from '../../styles/images/image1.png';
import img2 from '../../styles/images/image5.png';
import img3 from '../../styles/images/image6.png';

const { Content } = Layout;

const imgs = [img1, img2, img3, img4];

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      videoList: [],
      reviewList: [],
      loading: false,
      loading2: false,
      loading3: false,
    };

    [
      'render',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const params1 = {};
    params1.pagesize = 15;
    params1.page = 1;
    params1.pcFlag = 'Y';
    this.setState({ loading: true });
    course(params1)
     .then((data) => {
       const d = data;

       d.rows.map((rowData, i) => {
         rowData.key = i + 1;
       });

       this.setState({
         loading: false,
         dataList: data.rows,
       });
     });

    if (isEmpty(this.state.videoList)) {
      const params3 = {};
      params3.pagesize = 14;
      params3.page = 1;
      params3.boutiqueVideo = 'Y';
      params3.pcFlag = 'Y';
      this.setState({ loading2: true });
      course(params3)
     .then((data) => {
       const d = data;

       d.rows.map((rowData, i) => {
         rowData.key = i + 1;
       });

       this.setState({
         loading2: false,
         videoList: data.rows,
       });
     });
    }

    if (isEmpty(this.state.reviewList)) {
      const params2 = {};
      params2.pagesize = 3;
      params2.page = 1;
      params2.releasePosition = 'WQHG';
      this.setState({ loading3: true });
      fetchReview(params2)
     .then((data) => {
       const d = data;
       this.setState({
         loading3: false,
         reviewList: d.rows,
       });
     });
    }
  };

  handleLocation() {
    this.$this.props.dispatch(routerRedux.push(this.url));
  }

  render() {
    const {
      buttonIconImg,
      dataList,
      loading,
      loading2,
      loading3,
      reviewList,
      videoList,
    } = this.state;
    const tableData = isEmpty(dataList) ? [] : chunk(dataList, 10)[0];
    const tempList = [];
    let list = [];
    if (!isEmpty(videoList)) {
      videoList.map((n, i) => {
        if (n.boutiqueVideo === 'Y') {
          tempList.push(<li key={`c${i}`} ><a href={`/#/classroom/trainingCourseDetail/${n.courseId}`}><i className={`${style.icon} ${style['icon-video']}`} /><span>{n.topic}</span></a></li>);
        }
      });
      list = chunk(tempList, 7);
    }

    const reviewImgList = [];
    if (!isEmpty(reviewList)) {
      reviewList.map((n, i) => {
        reviewImgList.push(
          <Col xs={8} sm={8} md={8} lg={8} xl={8} key={`r${i}`}>
            <a className={style['img-container']} href={`/#/classroom/reviewDetail/classroom/${n.articleId}`}><img src={isEmpty(n.coverFilePath) ? imgs[i] : `${PICTURE_ADDRESS}${n.coverFilePath}`} alt="" />{n.title}</a>
          </Col>,
        );
      });
    }

    const columns = [
      {
        title: '课程时间',
        dataIndex: 'courseDate',
        render: (text, record) => {
          const date = new Date(text);
          const endDate = new Date(Date.parse(date) + (record.duration ?
          record.duration * 60 * 1000 : 0));
          return (
            <span>
              {moment(text).format('YYYY年MM月DD日')}
              <br />
              {`${moment(text).format('HH:mm')}-${moment(endDate).format('HH:mm')}`}
            </span>);
        },
      },
      {
        title: '课程内容',
        dataIndex: 'topic',
        render: (text, record) => <a className={style.color} href={`/#/classroom/trainingCourseDetail/${record.courseId}`}>{text}</a>,
      }, {
        title: '讲师',
        dataIndex: 'lecturer',
      }, {
        title: '地点',
        dataIndex: 'address',
      }, {
        title: '费用',
        dataIndex: 'price',
        render: text => (Number(text) === 0 ? '0.00' : text),
      }, {
        title: '操作',
        dataIndex: 'apply',
        render: (text, rowData) => {
          const status = rowData.status;
          let button;
          if (status === 'NOTSTARTED') {
            button = (
              <ApplyPopup rowData={rowData} fetchData={this.fetchData} />
            );
          } else if (status === 'COMPLETE' && rowData.enrollFlag === 'Y') {
            button = (
              <EvaluationPopup rowData={rowData} />
            );
          } else {
            button = (
              <Button className={`${style.btn} ${style.blank}`} size="large" onClick={this.handleLocation.bind({ $this: this, url: `/classroom/trainingCourseDetail/${rowData.courseId}` })}>
                <span>查看</span>
              </Button>
            );
          }
          return (<div className={style['button-container']}>{button}</div>);
        },
      },
    ];

    return (
      <Content className={`${style.content} ${style.course}`}>
        <div className={style.container}>
          <Row className={style.frame}>
            <Row className={style.title}>
              <h1>最新课程</h1>
              <span>LATEST CURRICULUM</span>
            </Row>
            <DatumButton className={style.left} />
            {!isEmpty(list) ? <a className={`${style.right} ${style.link}`} href="/#/classroom/courseList"> 更多课程 <i className={`${style.icon} ${style['icon-double-right']}`} /></a> : ''}
            <div className={style.clear} />
            <Row>
              <Table
                columns={columns}
                dataSource={tableData}
                bordered scroll={{ x: '100%' }}
                pagination={false}
                loading={loading}
              />
            </Row>
          </Row>
        </div>
        <div className={`${style.container} ${style['course-background-2']} ${style['course-more']}`}>
          <Row className={style.frame}>
            <Spin spinning={loading2}>
              <Row className={style.title}>
                <h1>精品视频</h1>
                <span>BOUTIQUE VIDEO</span>
              </Row>
              {!isEmpty(list) ? <a className={`${style.right} ${style.link}`} href="/#/classroom/courseList/boutiqueVideo"> 查看更多 <i className={`${style.icon} ${style['icon-double-right']}`} /></a> : ''}
              <div className={style.clear} />
              <Row className={style.row}>
                {!isEmpty(list) ? (
                  <div className={style.left} style={{ marginRight: 12 }}>
                    <a className={style['img-container']} href="javascript:;"><img src={img4} alt="" /></a>
                  </div>) : ''
                }
                <div className={style.left} style={{ width: 'calc(100% - 238px)', marginLeft: 18 }}>
                  <ul className={`${style.left} ${style.list}`}>
                    {!isEmpty(list) ? list[0] : ''}
                  </ul>
                  {!isEmpty(list) && list.length > 1 ? <div style={{ position: 'absolute', height: 256, marginTop: -5, marginLeft: 'calc(40% - 8px)', border: '1px solid rgba(193, 193, 193, 0.33)' }} /> : ''}
                  <ul className={`${style.right} ${style.list}`}>
                    {!isEmpty(list) && list.length > 1 ? list[1] : ''}
                  </ul>
                </div>
              </Row>
            </Spin>
          </Row>
        </div>
        <div className={`${style.container} ${style['review-more']}`}>
          <Row className={style.frame}>
            <Spin spinning={loading3}>
              <Row className={style.title}>
                <h1>往期回顾</h1>
                <span>TO REVIEW</span>
              </Row>
              {!isEmpty(reviewImgList) ? <a className={`${style.right} ${style.link}`} href="/#/classroom/reviewList"> 查看更多 <i className={`${style.icon} ${style['icon-double-right']}`} /></a> : ''}
              <div className={style.clear} />
              <Row className={style.row}>
                {reviewImgList}
              </Row>
            </Spin>
          </Row>
        </div>
      </Content>
    );
  }
}

export default connect()(Course);
