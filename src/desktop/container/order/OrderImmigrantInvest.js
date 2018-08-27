import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as styles from '../../styles/ordersummary.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import { Tabs ,Col } from 'antd';
import OrderImmigrantInvestPerson from '../../components/order/OrderImmigrantInvestPerson';
import OrderImmigrantInvestTeam from '../../components/order/OrderImmigrantInvestTeam';
import OrderImmigrantInvestIntroduce from '../../components/order/OrderImmigrantInvestIntroduce';


class OrderImmigrantInvest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*面包屑数据*/
      itemList: [
        {
          name: '工作台',
          url: '/#/portal/home'
        },{
          name: '订单管理',
          url: '/#/order/orderImmigrantInvest/'+this.props.params.key||'1'
        }
      ],
      key1: 1,
      key2: 1,
      key3: 1,
    };
  };

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

  render() {
    return (
      <ProtalLayout location={this.props.location}>
        <div style={{width: '100%'}}>
            <BreadcrumbLayout itemList={this.state.itemList} />
            <Col className={styles.content}>
               <br/>
               <Tabs defaultActiveKey={this.props.params.key||'1'}  onTabClick={this.onTabClick.bind(this)} type="card">
                  <Tabs.TabPane tab="个人" key="1" >
                    <br/>
                    <OrderImmigrantInvestPerson key1={this.state.key1}/>
                  </Tabs.TabPane>
                  {
                    JSON.parse(localStorage.user).userType != "ADMINISTRATION" &&
                    <Tabs.TabPane tab="团队" key="2">
                      <br/>
                      <OrderImmigrantInvestTeam key2={this.state.key2}/>
                    </Tabs.TabPane>
                  }
                  {
                    JSON.parse(localStorage.user).userType != "ADMINISTRATION" &&
                    <Tabs.TabPane tab="转介绍" key="3">
                      <br/>
                      <OrderImmigrantInvestIntroduce key3={this.state.key3}/>
                    </Tabs.TabPane>
                  }
                </Tabs>
            </Col>
        </div>
      </ProtalLayout>
    );
  }
}
export default connect()(OrderImmigrantInvest);

