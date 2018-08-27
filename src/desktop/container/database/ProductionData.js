/*
 * show 资料库-产品资料
 * @author:lijun
 * @version:20170627
 */
import React from 'react';
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import ProductionDataComponent from '../../components/database/ProductionData';

class ProductionData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ProtalLayout location={location}>
        <ProductionDataComponent />
      </ProtalLayout>
    );
  }
}

export default connect()(ProductionData);
