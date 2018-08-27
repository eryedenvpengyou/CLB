import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import OrderAppreciationServeModel from '../../components/order/OrderAppreciationServe';
import * as styles from '../../styles/order.css'
import {fetchAfter} from '../../services/order';
import {stringify} from 'qs';

class OrderAppreciationServe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    return (
      <ProtalLayout location={location}>
        <div className={styles.main}>
          <OrderAppreciationServeModel order={this.props.order} dispatch={this.props.dispatch}/>
        </div>
      </ProtalLayout>
    );
  }
}
export default connect(({ order }) => ({order}))(OrderAppreciationServe);

