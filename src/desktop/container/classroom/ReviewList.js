/*
 * view 财课堂-往期回顾
 * @author:Lijun
 * @version:20170704
 */
import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import ReviewListComponent from '../../components/classroom/ReviewList';
import style from '../../styles/classroom.css';

const { Content } = Layout;

class ReviewList extends Component {
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
        name: '往期回顾',
        url: '/#/classroom/reviewList',
      }],
    };
  }

  render() {
    return (
      <ProtalLayout location={this.props.location}>
        <Layout className={style.classroom}>
          <Content className={`${style.content} ${style['background-white']}`}>
            <Layout className={`${style.frame} ${style['background-white']}`}>
              <BreadcrumbLayout itemList={this.state.itemList} />
            </Layout>
            <Layout className={`${style.frame} ${style['background-white']}`}>
              <ReviewListComponent />
            </Layout>
          </Content>
        </Layout>
      </ProtalLayout>
    );
  }
}

export default connect()(ReviewList);
