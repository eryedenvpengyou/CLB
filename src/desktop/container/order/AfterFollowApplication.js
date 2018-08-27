import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import AfterFollowApplicationModel from '../../components/order/AfterFollowApplication';
import * as styles from '../../styles/order.css'
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import { Col } from 'antd';



class AfterFollowApplication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: [{
        id: this.props.params.id,
        orderId : this.props.params.orderId,
        afterStatus : this.props.params.afterStatus,
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
          url: '/#/after/AfterFollowApplication/'+this.props.params.id+this.props.params.orderId+this.props.params.afterStatus
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
          <AfterFollowApplicationModel afterStatus={this.props.params.afterStatus} orderId={this.props.params.orderId} afterId={this.props.params.id} dispatch={this.props.dispatch} order={this.props.order}/>
          </Col>
        </div>
      </ProtalLayout>
    );
  }
}

export default connect(({ order }) => ({ order }))(AfterFollowApplication);
