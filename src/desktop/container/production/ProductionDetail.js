/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { Col } from 'antd';
import { connect } from 'dva';
import ProductionDetailBXComponent from '../../components/production/ProductionDetailBX';
import ProductionDetailZQComponent from '../../components/production/ProductionDetailZQ';
import ProductionDetailJJComponent from '../../components/production/ProductionDetailJJ';
import ProductionDetailDCComponent from '../../components/production/ProductionDetailDC';
import ProductionDetailFCComponent from '../../components/production/ProductionDetailFC';
import ProductionDetailYJComponent from '../../components/production/ProductionDetailYJ';
import ProductionDetailFWComponent from '../../components/production/ProductionDetailFW';
import ProtalLayout from '../../components/layout/ProtalLayout';
import SlideshowComponent from '../../components/portal/Slideshow';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import styles from '../../styles/production.css';

class ProductionDetail extends React.Component {
  constructor(props) {
    super(props);
    var name = "产品库";
    if (this.props.params.bigClass == 'BX') {
      name = '产品';
    } else if (this.props.params.bigClass == 'ZQ') {
      name = '债券';
    } else if (this.props.params.bigClass == 'JJ') {
      name = '基金';
    }else if (this.props.params.bigClass == 'DC') {
      name = '移民投资';
    }else if (this.props.params.bigClass == 'FC'){
      name = '海外房产';
    }else if (this.props.params.bigClass == 'YJ') {
      name = '医疗教育';
    }else if (this.props.params.bigClass == 'FW') {
      name = '增值服务';
    }
    this.state = {
      params: [{
        bigClass: this.props.params.bigClass,
        itemId: this.props.params.itemId
      }],
      /*面包屑数据*/
      itemList: [{
        name: "产品库",
        url: '/#/production/list/BX'
      },{
        name: name,
        url: '/#/production/list/'+this.props.params.bigClass
      },{
        name: '产品详情',
        url: '/#/production/detail/'+this.props.params.bigClass+'/'+this.props.params.itemId
      }]
    };
  };
  render () {
    return (
    <ProtalLayout location={location}>
      <div style={{width: '100%'}}>
        <BreadcrumbLayout itemList={this.state.itemList} />
        <Col className={styles.content}>
          {
            this.state.params.map((item, index) => {
              if (item.bigClass == 'BX') {
                return <ProductionDetailBXComponent key={index} itemId={item.itemId}/>;
              } else if (item.bigClass == 'ZQ') {
                return <ProductionDetailZQComponent key={index} itemId={item.itemId}/>;
              } else if (item.bigClass == 'JJ') {
                return <ProductionDetailJJComponent key={index} itemId={item.itemId}/>;
              }else if (item.bigClass == 'DC') {
                return <ProductionDetailDCComponent key={index} itemId={item.itemId}/>;
              }else if(item.bigClass == 'FC'){
                return <ProductionDetailFCComponent key={index} itemId={item.itemId}/>;
              }else if(item.bigClass == 'YJ'){
                return <ProductionDetailYJComponent key={index} itemId={item.itemId}/>;
              }else if (item.bigClass == 'FW') {
                return <ProductionDetailFWComponent key={index} itemId={item.itemId}/>;
              }
            })
          }
        </Col>
      </div>
    </ProtalLayout>
    );
  }
}

export default connect()(ProductionDetail);
