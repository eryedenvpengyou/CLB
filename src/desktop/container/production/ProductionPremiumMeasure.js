/**
 * Created by FengWanJun on 2017/6/1.
 */

import React from 'react';
import { Col } from 'antd';
import { connect } from 'dva';
import ProductionPremiumMeasureComponent from '../../components/production/ProductionPremiumMeasure';
import ProtalLayout from '../../components/layout/ProtalLayout';
import SlideshowComponent from '../../components/portal/Slideshow';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import styles from '../../styles/production.css';

class ProductionPremiumMeasure extends React.Component {
  constructor(props) {
    super(props);
    var name = "产品库";
    if (this.props.params.bigClass == 'BX') {
      name = '产品';
    } else if (this.props.params.bigClass == 'ZQ') {
      name = '债券';
    } else if (this.props.params.bigClass == 'DC') {
      name = '移民投资';
    }
    this.state = {
      /*面包屑数据*/
      itemList: [{
        name: name,
        url: '/#/production/list/'+this.props.params.bigClass
      },{
        name: '产品详情',
        url: '/#/production/detail/'+this.props.params.bigClass+'/'+this.props.params.itemId
      },{
        name: '保费测算',
        url: '/#/production/premiumMeasure/'+this.props.params.bigClass+'/'+this.props.params.midClass+'/'+this.props.params.minClass+'/'+this.props.params.itemId
      }]
    };
  };
  render () {
    return (
      <ProtalLayout location={location}>
        <div style={{width: '100%'}}>
          <BreadcrumbLayout itemList={this.state.itemList} />
          <Col className={styles.content}>
            <ProductionPremiumMeasureComponent
              midClass={this.props.params.midClass}
              minClass={this.props.params.minClass}
              itemId={this.props.params.itemId} />
          </Col>
        </div>
      </ProtalLayout>
    );
  }
}

export default connect()(ProductionPremiumMeasure);
