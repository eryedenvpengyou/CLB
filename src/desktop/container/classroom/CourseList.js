/*
 * view 财课堂-培训课程
 * @author:Lijun
 * @version:20170704
 */
import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import CourseListComponent from '../../components/classroom/CourseList';
import Banner from '../../components/classroom/Banner';
import style from '../../styles/classroom.css';

const { Content } = Layout;

class CourseList extends Component {
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
      }],
    };
  }

  render() {
    return (
      <ProtalLayout location={this.props.location}>
        <Layout className={style.classroom}>
          <Banner
            className={style['classroom-banner-1']}
            title="business-support"
            enDesc="BUSINESS SUPPORT"
            description={['全方位立体支持系统，线上线下配合，', '协助您的业务扩展，满足您的多元化需求。']}
            href="/#/classroom/business"
          />
          <Content className={`${style.content} ${style['background-white']}`}>
            <Layout className={`${style.frame} ${style['background-white']}`}>
              <BreadcrumbLayout itemList={this.state.itemList} />
            </Layout>
            <Layout className={`${style.frame}`}>
              <CourseListComponent pageKey={this.props.params.key} />
            </Layout>
          </Content>
        </Layout>
      </ProtalLayout>
    );
  }
}
export default connect()(CourseList);
