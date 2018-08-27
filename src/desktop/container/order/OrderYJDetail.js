import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import OrderFMSZDetailModel from '../../components/order/OrderFMSZDetail';
import OrderGDYLDetailModel from '../../components/order/OrderGDYLDetail';
import * as styles from '../../styles/order.css'
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import { Spin, Switch, Alert ,Col } from 'antd';


class OrderYJDetail extends React.Component {
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
        this.props.params.type == 'FMSZ'&&{
          name: '订单详情',
          url: '/#/order/orderYJ/orderYJDetail/'+this.props.params.prePage+'/'+this.props.params.type+'/'+this.props.params.orderId
          
        },
        this.props.params.type == 'GDYL'&&{
          name: '订单详情',
          url: '/#/order/orderYJ/orderYJDetail/'+this.props.params.prePage+'/'+this.props.params.type+'/'+this.props.params.orderId
          
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
           { this.props.params.type == 'FMSZ'&&<OrderFMSZDetailModel orderId={this.props.params.orderId} prePage={this.props.params.prePage} type={this.props.params.type} dispatch={this.props.dispatch} order={this.props.order}/>}
           { this.props.params.type == 'GDYL'&&<OrderGDYLDetailModel orderId={this.props.params.orderId} prePage={this.props.params.prePage} type={this.props.params.type} dispatch={this.props.dispatch} order={this.props.order}/>}
            </Col>
          </div>
        </ProtalLayout>
      </Spin>
    );
  }
}

export default connect(({ order }) => ({ order }))(OrderYJDetail);
