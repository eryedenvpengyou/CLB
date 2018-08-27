/*
 * view 财课堂-往期回顾详情
 * @author:Lijun
 * @version:20170704
 */
import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import ReviewDetailComponent from '../../components/classroom/ReviewDetail';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import * as styles from '../../styles/sys.css';
import style from '../../styles/classroom.css';

const { Content } = Layout;

class ReviewDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        articleId: this.props.params.articleId,
      },
      /*面包屑数据*/
      itemList: [],
      itemListAnnouncement: [{
        name: '公告栏',
        url: '/#/portal/announcementSummary',
      }, {
        name: name+'公告详情',
        url: `/#/classroom/reviewDetail/${this.props.params.articleId}`,
      }],
      itemListClassroom: [{
        name: '财课堂',
        url: '/#/classroom/course'
      }, {
        name: name+'往期回顾详情',
        url: `/#/classroom/reviewDetail/${this.props.params.articleId}`,
      }],
    };
  }

  componentWillMount() {
    if (this.props.params.bigBreadcrumbType === 'announcement') {
      this.state.itemList = this.state.itemListAnnouncement;
    } else if (this.props.params.bigBreadcrumbType === 'classroom') {
      this.state.itemList = this.state.itemListClassroom;
    }
  }

  render() {
    const { params } = this.state;
    return (
      <ProtalLayout location={this.props.location}>
        <Layout className={style.classroom}>
          <Content className={`${style.content} ${style['background-white']}`}>
            <Layout className={`${style.frame} ${style['background-white']}`}>
              <BreadcrumbLayout itemList={this.state.itemList} />
            </Layout>
            <Layout className={`${style.frame}`}>
              <ReviewDetailComponent itemId={params.articleId} />
            </Layout>
          </Content>
        </Layout>
      </ProtalLayout>
    );
  }
}

export default connect()(ReviewDetail);
