import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import AfterFollowOtherModel from '../../components/order/AfterFollowOther';
import * as styles from '../../styles/order.css'
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import { Col } from 'antd';


class AfterFollowOther extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: [{
        id: this.props.params.id,
        afterStatus: this.props.params.afterStatus,
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
          name: '保单信息',
          url: '/#/after/AfterFollowOther/'+this.props.params.id+this.props.params.orderId+this.props.params.afterStatus
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
            <AfterFollowOtherModel afterStatus={this.props.params.afterStatus} orderId={this.props.params.orderId} afterId={this.props.params.id} dispatch={this.props.dispatch} order={this.props.order}/></Col>

        </div>
      </ProtalLayout>
    );
  }
}

export default connect(({ order }) => ({ order }))(AfterFollowOther);
