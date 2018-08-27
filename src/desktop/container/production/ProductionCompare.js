/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { connect } from 'dva';
import { Col } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import SlideshowComponent from '../../components/portal/Slideshow';
import ProductionCompareComponent from '../../components/production/ProductionCompare';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import styles from '../../styles/production.css';

class ProductionCompare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*面包屑数据*/
      itemList: [{
        name: '产品库',
        url: '/#/production/list/BX'
      },{
        name: '产品对比',
        url: '/#/production/compare'
      }]
    };
  }
  render() {
    return (
      <ProtalLayout location={location}>
        <div style={{width: '100%'}}>
          <BreadcrumbLayout itemList={this.state.itemList} />
          <Col className={styles.content}>
            <ProductionCompareComponent />
          </Col>
        </div>
      </ProtalLayout>
    );
  }
}

export default connect()(ProductionCompare);
