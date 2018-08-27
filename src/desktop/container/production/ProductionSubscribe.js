/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { Col, Row } from 'antd';
import ProductionSubscribeZQComponent from '../../components/production/ProductionSubscribeZQ';
import ProductionSubscribeDCComponent from '../../components/production/ProductionSubscribeDC';
import ProductionSubscribeFCComponent from '../../components/production/ProductionSubscribeFC';
import ProductionSubscribeFWComponent from '../../components/production/ProductionSubscribeFW';
import ProductionSubscribeYJComponent from '../../components/production/ProductionSubscribeYJ';
import SvDetail from "../../components/reservation/SvDetail";
import ProtalLayout from '../../components/layout/ProtalLayout';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import styles from '../../styles/production.css';

class ProductionSubscribe extends React.Component {
  constructor(props) {
    super(props);
    var name = "产品库", name1 = '产品详情', name2 = "预约";
    if (this.props.params.bigClass == 'BX') {
      name = '产品';
    } else if (this.props.params.bigClass == 'ZQ') {
      name = '债券';
    } else if (this.props.params.bigClass == 'DC') {
      name = '移民投资';
    } else if (this.props.params.bigClass == 'FC') {
      name = '海外房产';
    } else if (this.props.params.bigClass == 'FW') {
      name = '增值服务';
      if (this.props.params.midClass == 'JDYD') {
        name2 = '酒店预定';
      } else if (this.props.params.midClass == 'ZCFW') {
        name2 = '专车服务';
      } else if (this.props.params.midClass == 'HSYD') {
        name2 = '预定财联邦会所';
      } else if (this.props.params.midClass == 'TTQZ') {
        name2 = '团队签订';
      } else if (this.props.params.midClass == 'HPV') {
        name2 = '预约疫苗';
      } else if (this.props.params.midClass == 'ZQKH') {
        name2 = '证券开户';
      }
    } else if (this.props.params.bigClass == 'YJ') {
      name = '医疗教育';
      if(this.props.params.midClass == 'FMSZ'){
        name1 = '赴美生子'
      }else if(this.props.params.midClass == 'GDYL'){
        name1 = '香港医疗服务'
      }
    }
    /*面包屑数据*/
    var itemList =  [{
      name: name,
      url: '/#/production/list/'+this.props.params.bigClass
    },{
      name: name1,
      url: '/#/production/detail/'+this.props.params.bigClass+'/'+this.props.params.id
    },{
      name: name2,
      url: '/#/production/subscribe/'+this.props.params.bigClass+'/'+this.props.params.midClass+'/'+this.props.params.id
    }];
    var orderId;
    if (this.props.params.midClass == 'order' || this.props.params.midClass == 'orderQuery' || this.props.params.midClass == 'orderUpdate') {
      if (!isNaN(this.props.params.id)) {
        orderId = this.props.params.id;
      }
      let url;
      if (this.props.params.bigClass == 'ZQ') {
        url = '/#/order/orderBondsDetail/personal/'+this.props.params.id;
      } else if (this.props.params.bigClass == 'DC') {
        url = '/#/order/orderImmigrantInvest/OrderImmigrantInvestDetail/personal/'+this.props.params.id;
      } else {
        url = '/#/index'
      }
      itemList =  [{
        name: '订单详情',
        url: url,
      },{
        name: name2,
        url: '/#/production/subscribe/'+this.props.params.bigClass+'/'+this.props.params.midClass+'/'+this.props.params.id
      }];
    } else if (this.props.params.midClass == 'orderAdd') {
      itemList =  [{
        name: name,
        url: '/#/production/list/'+this.props.params.bigClass
      },{
        name: name2,
        url: '/#/production/subscribe/'+this.props.params.bigClass+'/'+this.props.params.midClass+'/'+this.props.params.id
      }];
    } else {
      if (isNaN(this.props.params.id)) {
        itemList =  [{
          name: name,
          url: '/#/production/list/'+this.props.params.bigClass
        },{
          name: name2,
          url: '/#/production/subscribe/'+this.props.params.bigClass+'/'+this.props.params.midClass+'/'+this.props.params.id
        }];
      }
    }
    this.state = {
      /*面包屑数据*/
      itemList,
      orderId,
    };
  };
  render () {
    let component;
    switch (this.props.params.bigClass) {
      case 'ZQ':
        component = <ProductionSubscribeZQComponent orderType={this.props.params.midClass} orderId={this.state.orderId} />;
        break;
      case 'DC':
        component = <ProductionSubscribeDCComponent orderType={this.props.params.midClass} orderId={this.state.orderId} />;
        break;
      case 'FC':
        component = <ProductionSubscribeFCComponent orderType={this.props.params.midClass} orderId={this.state.orderId} />;
        break;
      case 'FW':
        component = <div style={{marginTop:'28px'}}>
                      <SvDetail itemId={this.props.params.id} reId={this.props.params.reId||''} reNumber={this.props.params.reNumber||''} midClass={this.props.params.midClass}/>
                    </div>;
        break;
      case 'YJ':
        component = <ProductionSubscribeYJComponent location={this.props.location} params={this.props.params} orderId={this.state.orderId} />;
        break;
      default:
        component = '';
        break;
    }
    return (
    <ProtalLayout location={location}>
      <div style={{width: '100%'}}>
        <BreadcrumbLayout itemList={this.state.itemList} />
        <Col className={styles.content} style={{padding:'28px 12px'}}>
          <Row style={{ borderBottom: '1px solid #dbdbdb', paddingBottom: '28px', textAlign: 'center', fontSize: '1.5em'}}>
            预约资料
          </Row>
          {component
            /*this.props.params.bigClass == 'ZQ' ?
              <ProductionSubscribeZQComponent orderType={this.props.params.midClass} orderId={this.state.orderId} />
              :
              this.props.params.bigClass == 'DC' ?
                <ProductionSubscribeDCComponent orderType={this.props.params.midClass} orderId={this.state.orderId} />
                :
                 this.props.params.bigClass == 'FC' ?
                 <ProductionSubscribeFCComponent orderType={this.props.params.midClass} orderId={this.state.orderId} />
                 :
                this.props.params.bigClass == 'FW' ?
                  <div style={{marginTop:'28px'}}>
                    <SvDetail itemId={this.props.params.id} reId={this.props.params.reId||''} reNumber={this.props.params.reNumber||''} midClass={this.props.params.midClass}/>
                  </div>
                  /!*<ProductionSubscribeFWComponent midClass={this.props.params.midClass} itemId={this.props.params.id} />*!/
                  :
                  ""*/
          }
        </Col>
      </div>
    </ProtalLayout>
    );
  }
}

export default (ProductionSubscribe);
