import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import OrderPendingTrailModel from '../../components/order/OrderPendingTrail';
import * as styles from '../../styles/order.css'
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import { Spin, Switch, Alert ,Col } from 'antd';


class OrderPendingTrail extends React.Component {
  constructor(props) {
    super(props);
    let name = '', url = '';
    if (this.props.params.orderType == 'bonds') {
      name = '债券订单详情';
      url = '/#/order/orderBondsDetail/personal/'+this.props.params.orderId;
    } else if (this.props.params.orderType == 'insurance') {
      name = '订单详情';
      url = '/#/order/orderDetail/personal/'+this.props.params.orderId;
    } else if (this.props.params.orderType == 'pending') {
      name = '我的pending';
      url = '/#/OrderPending/list';
    }
    this.state = {
      params: [{
        pendingId: this.props.pendingId,
        orderId: this.props.orderId,
        PDType:this.props.PDType,
        orderType:this.props.orderType
      }],
      /*面包屑数据*/
      itemList: [
        {
          name: '工作台',
          url: '/#/portal/home'
        },{
          name,
          url
        },{
          name: 'Pending详情',
          url: '/#/OrderPending/OrderPendingTrail/'+this.props.params.orderType+'/'+this.props.params.PDType+'/'+this.props.params.orderId+'/'+this.props.params.pendingId
        }
      ]
    };
  };


  render () {
    const that = this;
    return (
      <Spin spinning={this.props.order.loading} size="large" className={styles['ant-spin-dot']} >
        <ProtalLayout location={location}>
          <div className={styles.main}>
            <BreadcrumbLayout itemList={this.state.itemList} />
            <Col offset={4}  className={styles.content}>
              <OrderPendingTrailModel orderType={this.props.params.orderType} PDType={this.props.params.PDType} pendingId={this.props.params.pendingId} orderId={this.props.params.orderId} dispatch={this.props.dispatch} order={this.props.order}/>
            </Col>
          </div>
        </ProtalLayout>
      </Spin>
    );
  }
}

export default connect(({ order }) => ({ order }))(OrderPendingTrail);
