import { connect } from 'dva';
import { Col } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import OrderBondsIntroduction from '../../components/order/OrderBondsIntroduction';
import * as styles from '../../styles/ordersummary.css';
import {fetchorderList} from '../../services/order';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import {stringify} from 'qs';


class OrderBondsIntroductionPage extends React.Component {
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
      <OrderBondsIntroduction order={this.props.order} key3={this.props.key3} dispatch={this.props.dispatch}/>
    );
  }
}

export default connect(({ order }) => ({ order }))(OrderBondsIntroductionPage);




