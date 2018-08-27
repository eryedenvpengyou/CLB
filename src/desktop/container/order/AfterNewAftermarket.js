import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import AfterNewAftermarketModel from '../../components/order/AfterNewAftermarket';
import * as styles from '../../styles/order.css'
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import { Col } from 'antd';


class AfterNewAftermarket extends React.Component {
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
          name: '售后申请',
          url: '/#/after/list'
        },
        {
          name: '新建售后申请',
          url: '/#/after/AfterNewAftermarket/'+this.props.params.orderId
        }]
    };
  };
  render () {
    const that = this;
    return (
      <ProtalLayout location={location}>
        <div className={styles.main}>
          <BreadcrumbLayout itemList={this.state.itemList} />
          <Col offset={4} className={styles.content}>
            <AfterNewAftermarketModel orderId={this.props.params.orderId} dispatch={this.props.dispatch} order={this.props.order}/>
          </Col>
        </div>
      </ProtalLayout>
    );
  }
}

export default connect(({ order }) => ({ order }))(AfterNewAftermarket);
