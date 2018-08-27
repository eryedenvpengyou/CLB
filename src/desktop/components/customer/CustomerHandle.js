import React from 'react';
import { Tabs } from 'antd';
import CustomerDetail from './CustomerDetail';
import CustomerOrder from './CustomerOrder';
import * as styles from '../../styles/qa.css';


const TabPane = Tabs.TabPane;

class CustomerHandle  extends React.Component {
  state={
    breadDetail:[],
  }

  componentWillMount() {
    const breadDetail = [{
        name: '工作台',
        url: '/#/portal/home'
      },{
        name: '我的客户',
        url: '/#/portal/customer'
      },{
        name: this.props.name ? ('个人信息>'+this.props.name): '个人信息',
        url: `/#/portal/customerHandle/${this.props.customerId}`,
      }];
    this.setState({breadDetail});
  }


   //tab 切换
   onTabClick(key){

   }

  render(){
    return(
      <div>
        <div className={styles.content}>
          <Tabs defaultActiveKey="2"  onTabClick={this.onTabClick.bind(this)} type="card" style={{marginTop:'20px'}}>
            <TabPane tab={<span>客户订单</span>} key="1">
              <CustomerOrder dispatch={this.props.dispatch} customerId={this.props.customerId} name={this.props.name}/>
            </TabPane>
            <TabPane tab={<span>个人信息</span>} key="2" style={{clear:'both'}}>
              <CustomerDetail dispatch={this.props.dispatch} customerId={this.props.customerId}/>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default CustomerHandle;
