import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import AfterRenewalDetailModel from '../../components/order/AfterRenewalDetail';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import { Col } from 'antd';
import styles from '../../styles/order.css';


class AfterRenewalDetail extends React.Component {
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
          name: '续保清单',
          url: '/#/after/AfterRenewal/list'
        },
        {
          name: '续保详情',
          url: '/#/after/AfterRenewal/AfterRenewalDetail/'+this.props.params.orderId
        }]
    };
  };

  render() {
    const that = this;
    return (
      <ProtalLayout location={location}>
        <div style={{width: '100%'}}>
          <BreadcrumbLayout itemList={this.state.itemList} />
          <Col offset={4}className={styles.content}>
            <AfterRenewalDetailModel orderId={this.props.params.orderId} order={this.props.order} dispatch={this.props.dispatch}/>
          </Col>
        </div>
      </ProtalLayout>
    );
  }
}
export default connect(({ order }) => ({order}))(AfterRenewalDetail);

