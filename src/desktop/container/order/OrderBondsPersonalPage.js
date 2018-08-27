import { connect } from 'dva';
import { Col } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import OrderBondsPersonal from '../../components/order/OrderBondsPersonal';
import * as styles from '../../styles/ordersummary.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';

class OrderBondsPersonalPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*面包屑数据*/
      itemList: [{
        name: '工作台',
        url: '/#/portal/home'
      },{
        name: '债券管理',
        url: '/#/order/bonds'
      }]
    };
  }

  render() {
    return (
      <OrderBondsPersonal order={this.props.order} key1={this.props.key1} dispatch={this.props.dispatch}/>
    );
  }
}


export default connect(({ order }) => ({
  order,
}))(OrderBondsPersonalPage);
