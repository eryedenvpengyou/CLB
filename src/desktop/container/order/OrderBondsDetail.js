/**
 * Created by Detai on 2017/7/18.
 */
import { connect } from 'dva';
import { Col } from 'antd';
import OrderBondsComponents from "../../components/order/OrderBonds";
import ProtalLayout from "../../components/layout/ProtalLayout";
import * as styles from '../../styles/ordersummary.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';


class OrderBondsDetail extends React.Component {
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
      },{
        name: '债券订单详情',
        url: '/#/order/orderBondsDetail/'+this.props.params.prePage+'/'+this.props.params.orderId
      }]
    };
  }
  render() {
    return (
      <ProtalLayout location={this.props.location}>
        <div style={{width: '100%'}}>
          <BreadcrumbLayout itemList={this.state.itemList}/>
          <Col className={styles.content}>
            <OrderBondsComponents orderDetail={this.props.orderDetail} prePage={this.props.params.prePage} dispatch={this.props.dispatch} orderId={this.props.params.orderId}/>
          </Col>
        </div>
      </ProtalLayout>
    );
  }
}

export default connect(({ order }) => ({ order }))(OrderBondsDetail);
