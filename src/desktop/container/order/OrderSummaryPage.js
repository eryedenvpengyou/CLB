import React from 'react';
import { connect } from 'dva';
import { Col,Row,Tabs,Button,Icon} from 'antd';
import isEmpty from 'lodash/isEmpty';
import ProtalLayout from '../../components/layout/ProtalLayout';
import OrderSummaryPersonal from './OrderSummaryPersonal';
import OrderSummaryTeam from './OrderSummaryTeam';
import OrderSummaryIntroduction from './OrderSummaryIntroduction';
import * as styles from '../../styles/ordersummary.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';

const TabPane = Tabs.TabPane;

class OrderSummaryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*面包屑数据*/
      itemList: [{
        name: '工作台',
        url: '/#/portal/home'
      },{
        name: '订单管理',
        url: '/#/order/summary/'+this.props.params.key||'1'
      }],
      key1: 1,
      key2: 1,
      key3: 1,
    };
  }

  onTabClick(key){
    if(key == 1){
      this.setState({key1: new Date().getTime()});
    }
    else if(key == 2){
      this.setState({key2: new Date().getTime()});
    }
    else if(key == 3){
      this.setState({key3: new Date().getTime()});
    }
    else {

    }
  }

  

  render(){
    return (
      <ProtalLayout location={this.props.location}>
        <div style={{width: '100%'}}>
            <BreadcrumbLayout itemList={this.state.itemList} />
            <Col className={styles.content}>
               <br/>
               <Tabs defaultActiveKey={this.props.params.key||'1'} type="card" onTabClick={this.onTabClick.bind(this)}>
                  <TabPane tab="个人" key="1">
                    <br/>
                    <OrderSummaryPersonal order={this.props.order} key1={this.state.key1} dispatch={this.props.dispatch}/>
                  </TabPane>
                  {
                    JSON.parse(localStorage.user).userType != "ADMINISTRATION" &&
                    <TabPane tab="团队" key="2">
                      <br/>
                      <OrderSummaryTeam order={this.props.order} key2={this.state.key2} dispatch={this.props.dispatch}/>
                    </TabPane>
                  }
                  {
                    JSON.parse(localStorage.user).userType != "ADMINISTRATION" &&
                    <TabPane tab="转介绍" key="3">
                      <br/>
                      <OrderSummaryIntroduction order={this.props.order} key3={this.state.key3} dispatch={this.props.dispatch}/>
                    </TabPane>
                  }
                </Tabs>
            </Col>
        </div>
      </ProtalLayout>
    );
  }
}
export default connect()(OrderSummaryPage);

