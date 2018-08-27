/*
 * view 财课堂-课程详情
 * @author:Lijun
 * @version:20170704
 */
import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import TrainingCourseDetailComponent from '../../components/classroom/TrainingCourseDetail';
import style from '../../styles/classroom.css';

const { Content } = Layout;

class TrainingCourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 面包屑数据
      itemList: [{
        name: '工作台',
        url: '/#/portal/home',
      }, {
        name: '财课堂',
        url: '/#/classroom/course',
      }, {
        name: '培训课程',
        url: '/#/classroom/courseList',
      }, {
        name: '课程详情',
        url: `/#/classroom/trainingCourseDetail/${this.props.params.courseId}`,
      }],
      params: {
        courseId: this.props.params.courseId,
      },
    };
  }

  render() {
    const { params } = this.state;
    return (
      <ProtalLayout location={location}>
        <Layout className={style.classroom}>
          <Content className={`${style.content} ${style['background-white']}`}>
            <Layout className={`${style.frame} ${style['background-white']}`}>
              <BreadcrumbLayout itemList={this.state.itemList} />
            </Layout>
            <Layout className={`${style.frame}`}>
              <TrainingCourseDetailComponent itemId={params.courseId} />
            </Layout>
          </Content>
        </Layout>
      </ProtalLayout>
    );
  }
}

export default connect()(TrainingCourseDetail);
