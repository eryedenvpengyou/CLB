/*
 * show 资料库-通用资料
 * @author:lijun
 * @version:20170627
 */
import React from 'react';
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import CommonDataComponent from '../../components/database/CommonData';

class CommonData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        datumType: this.props.params.datumType,
        supplierId: this.props.params.supplierId,
      },
    };
  }

  render() {
    const { params } = this.state;
    return (
      <ProtalLayout location={location}>
        <CommonDataComponent datumType={params.datumType} supplierId={params.supplierId} />
      </ProtalLayout>
    );
  }
}

export default connect()(CommonData);
