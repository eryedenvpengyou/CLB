import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import OrderImmigrantInvestDetailModel from '../../components/order/OrderImmigrantInvestDetail';
import * as styles from '../../styles/order.css'
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import { Spin, Switch, Alert ,Col } from 'antd';


class OrderImmigrantInvestDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: [{
        orderId: this.props.params.orderId
      }],
      /*面包屑数据*/
      itemList: [
        {
          name: '工作台',
          url: '/#/portal/home'
        },{
          name: '订单详情',
          url: '/order/orderImmigrantInvest/OrderImmigrantInvestDetail/'+this.props.params.prePage+'/'+this.props.params.orderId
        }
      ]
    };
  };
  render () {
    const that = this;
    return (
      <Spin spinning={that.props.order.loading} size="large" className={styles['ant-spin-dot']} >
        <ProtalLayout location={location}>
          <div className={styles.main}>
            <BreadcrumbLayout itemList={this.state.itemList} />
            <Col offset={4} className={styles.content}>
              <OrderImmigrantInvestDetailModel orderId={this.props.params.orderId} prePage={this.props.params.prePage} dispatch={this.props.dispatch} order={this.props.order}/>
            </Col>
          </div>
        </ProtalLayout>
      </Spin>
    );
  }
}

export default connect(({ order }) => ({ order }))(OrderImmigrantInvestDetail);
