import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import OrderState from '../../components/order/OrderFMSZState';
import * as styles from '../../styles/order.css'
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import { Spin, Switch, Alert ,Col } from 'antd';


class OrderFMSZState extends React.Component {
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
        },
        {
          name: '医疗教育',
          url: '/#/order/orderYJ'
        },
        {
          name: '医疗教育预约跟进',
          url: '/#/order/followOrderState/'+this.props.params.orderId
        },
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
              <OrderState orderId={this.props.params.orderId} prePage={this.props.params.prePage} dispatch={this.props.dispatch} order={this.props.order}/>
            </Col>
          </div>
        </ProtalLayout>
      </Spin>
    );
  }
}

export default connect(({ order }) => ({ order }))(OrderFMSZState);
