/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { Col } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import SlideshowComponent from '../../components/portal/Slideshow';
import ProductionListComponent from '../../components/production/ProductionListShow';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import styles from '../../styles/production.css';

class ProductionList extends React.Component {
  constructor(props) {
    super(props);
    var name = "产品库";
    if (this.props.params.bigClass == 'BX') {
      name = '产品';
    } else if (this.props.params.bigClass == 'ZQ') {
      name = '债券';
    } else if (this.props.params.bigClass == 'DC') {
      name = '移民投资';
    } else if (this.props.params.bigClass == 'FW') {
      name = '增值服务';
    }
    this.state = {
      /*面包屑数据*/
      itemList: [{
        name: "产品库",
        url: '/#/production/list/'+this.props.params.bigClass
      }]
    };
  }
  render() {
    return (
      <ProtalLayout location={this.props.location}>
        <div style={{width:'100%'}}>
          <BreadcrumbLayout itemList={this.state.itemList} />
          <Col className={styles.content}>
            <ProductionListComponent bigClass={this.props.params.bigClass} />
          </Col>
        </div>
      </ProtalLayout>
    );
  }
}

export default (ProductionList);
