/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { Tabs } from 'antd';
import ProductionListBX from './ProductionListBX';
import ProductionListZQ from './ProductionListZQ';
import ProductionListJJ from './ProductionListJJ';
import ProductionListDC from './ProductionListDC';
import ProductionListFC from './ProductionListFC';
import ProductionListYJ from './ProductionListYJ';
import ProductionListFW from './ProductionListFW';
import { productShow } from '../../services/production';

class ProductionListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "1",
      productShowList:[],
    };
  }
  componentWillMount() {
    productShow({domainId:JSON.parse(localStorage.theme).domainId}).then((data)=>{
      if(data.success){
        this.setState({productShowList:data.rows})
      }
    });
  }

  render() {
    return (
      <Tabs style={{ padding: "28px 16px" }} defaultActiveKey={this.state.key} type="card">
        {
          this.state.productShowList.map((item) => {
            if (item.productType == 'BX') {
              return <Tabs.TabPane tab={<span onClick={() => location.hash = "/production/list/" + item.productType}>{item.productTypeDesc}</span>} key={item.sorting}>
                <div>
                  <ProductionListBX refresh={this.props.bigClass} />
                </div>
              </Tabs.TabPane>
            } else if (item.productType == 'ZQ') {
              return <Tabs.TabPane tab={<span onClick={() => location.hash = "/production/list/" + item.productType}>{item.productTypeDesc}</span>} key={item.sorting}>
                <div>
                  <ProductionListZQ refresh={this.props.bigClass} />
                </div>
              </Tabs.TabPane>
            }else if (item.productType == 'JJ') {
              return <Tabs.TabPane tab={<span onClick={() => location.hash = "/production/list/" + item.productType}>{item.productTypeDesc}</span>} key={item.sorting}>
                <div>
                  <ProductionListJJ refresh={this.props.bigClass} />
                </div>
              </Tabs.TabPane>
            }else if (item.productType == 'DC') {
              return <Tabs.TabPane tab={<span onClick={() => location.hash = "/production/list/" + item.productType}>{item.productTypeDesc}</span>} key={item.sorting}>
                <div>
                  <ProductionListDC refresh={this.props.bigClass} />
                </div>
              </Tabs.TabPane>
            }else if (item.productType == 'FC') {
              return <Tabs.TabPane tab={<span onClick={() => location.hash = "/production/list/" + item.productType}>{item.productTypeDesc}</span>} key={item.sorting}>
                <div>
                  <ProductionListFC refresh={this.props.bigClass} />
                </div>
              </Tabs.TabPane>
            }else if (item.productType == 'YJ') {
              return <Tabs.TabPane tab={<span onClick={() => location.hash = "/production/list/" + item.productType}>{item.productTypeDesc}</span>} key={item.sorting}>
                <div>
                  <ProductionListYJ refresh={this.props.bigClass} />
                </div>
              </Tabs.TabPane>
            }else if (item.productType == 'FW') {
              return <Tabs.TabPane tab={<span onClick={() => location.hash = "/production/list/" + item.productType}>{item.productTypeDesc}</span>} key={item.sorting}>
                <div>
                  <ProductionListFW refresh={this.props.bigClass} />
                </div>
              </Tabs.TabPane>
            }
          })
        }
      </Tabs>
    );
  }
}

export default (ProductionListComponent);
