import { connect } from 'dva';
import { Col } from 'antd';
import OrderDetailComponents from "../../components/order/OrderDetail";
import ProtalLayout from "../../components/layout/ProtalLayout";
import * as styles from '../../styles/ordersummary.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';




class OrderDetail extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        /*面包屑数据*/
        itemList: [{
          name: '工作台',
          url: '/#/portal/home'
        },{
          name: '订单管理',
          url: '/#/order/summary'
        },
          {
          name: '订单详情',
          url: '/#/order/orderDetail/'+this.props.params.prePage+'/'+this.props.params.orderId
        }]
      };
    }
  render() {
    return (
      <ProtalLayout location={this.props.location}>
        <div style={{width: '100%'}}>
          <BreadcrumbLayout itemList={this.state.itemList}/>
            <Col className={styles.content}>
              <OrderDetailComponents prePage={this.props.params.prePage} orderDetail={this.props.orderDetail} dispatch={this.props.dispatch} orderId={this.props.params.orderId}/>
            </Col>
        </div>
      </ProtalLayout>
    );
  }
}

export default connect(({ order }) => ({ order }))(OrderDetail);


