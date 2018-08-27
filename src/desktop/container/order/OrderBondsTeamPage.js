import { connect } from 'dva';
import { Col } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import OrderBondsTeam from '../../components/order/OrderBondsTeam';
import * as styles from '../../styles/ordersummary.css';
import {fetchorderList} from '../../services/order';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import {stringify} from 'qs';

class OrderBondsTeamPage extends React.Component {
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
      <OrderBondsTeam order={this.props.order} key2={this.props.key2} dispatch={this.props.dispatch}/>
    );
  }
}

export default connect(({ order }) => ({
  order,
}))(OrderBondsTeamPage);
