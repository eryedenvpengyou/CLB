/*
 * view 财课堂-往期回顾详情
 * @author:Lijun
 * @version:20170704
 */
import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import SupportChargeRuleComponent from '../../components/classroom/SupportChargeRule';
import style from '../../styles/classroom.css';

const { Content } = Layout;

class SupportChargeRule extends Component {
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
        name: '业务支援',
        url: '/#/classroom/business',
      }, {
        name: '支援服务收费规则',
        url: '/#/classroom/supportChargeRule',
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
            <Layout className={`${style.frame}`}>
              <SupportChargeRuleComponent />
            </Layout>
          </Content>
        </Layout>
      </ProtalLayout>
    );
  }
}

export default connect()(SupportChargeRule);
