/*
 * view 财课堂
 * @author:Lijun
 * @version:20170704
 */
import React, { Component } from 'react';
import { Col, Layout } from 'antd';
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import CourseComponent from '../../components/classroom/Course';
import Banner from '../../components/classroom/Banner';
import style from '../../styles/classroom.css';

const { Content } = Layout;

class Course extends Component {
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
          <CourseComponent />
        </Layout>
      </ProtalLayout>
    );
  }
}

export default connect()(Course);
