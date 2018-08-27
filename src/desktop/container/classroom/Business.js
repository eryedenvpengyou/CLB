/*
 * view 财课堂-业务支援
 * @author:Lijun
 * @version:20170704
 */
import React, { Component } from 'react';
import { Col, Layout } from 'antd';
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import BusinessComponent from '../../components/classroom/Business';
import Banner from '../../components/classroom/Banner';
import style from '../../styles/classroom.css';

const { Content } = Layout;

class Business extends Component {
  render() {
    return (
      <ProtalLayout location={this.props.location}>
        <Layout className={style.classroom}>
          <Banner
            className={style['classroom-banner-2']}
            title="training-course"
            enDesc="TRAINING COURSE"
            description={['涵盖新人系列培训、产品系列培训、', '销售系列培训、理财师养成培训、国际认证培训等。']}
            href="/#/classroom/course"
          />
          <BusinessComponent />
        </Layout>
      </ProtalLayout>
    );
  }
}

export default connect()(Business);