import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Row, Tabs } from 'antd';
import CommonData from './CommonData';
import ProductionData from './ProductionData';
import style from '../../styles/database.css';

const { Content } = Layout;
const TabPane = Tabs.TabPane;

class Database extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      tabKey,
      datumType,
      supplierId,
    } = this.props;
    const tab = (
      <Row className={`${style.container} ${style['background-white']} ${style['margin-top']}`}>
        <Tabs type="card" defaultActiveKey={tabKey || 'commonData'}>
          <TabPane tab="通用资料" key="commonData"><CommonData datumType={datumType} supplierId={supplierId} /></TabPane>
          <TabPane tab="产品资料" key="productionData"><ProductionData /></TabPane>
        </Tabs>
      </Row>
    );
    return (
      <Layout className={`${style.database} ${style.main}`}>
        <Content className={`${style.content} ${style.container} ${style['background-white']}`}>
          <Layout className={`${style.frame} ${style.container}`}>
            <Content className={`${style['background-white']}`}>
              {tab}
            </Content>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

export default connect()(Database);

