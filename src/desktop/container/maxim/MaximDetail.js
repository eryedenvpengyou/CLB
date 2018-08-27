import { connect } from 'dva';
import { Col } from 'antd';
import MaximDetailModel from "../../components/maxim/MaximDetail";
import ProtalLayout from "../../components/layout/ProtalLayout";
import * as styles from '../../styles/ordersummary.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';




class MaximDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*面包屑数据*/
      itemList: [{
        name: '工作台',
        url: '/#/portal/home'
      },{
        name: '我的基金',
        url: '/#/maxim/list'
      },
        {
          name: '基金订单详情',
          url: '/#/maxim/maximDetail'
        }]
    };
  }
  render() {
    return (
      <ProtalLayout location={this.props.location}>
        <div style={{width: '100%'}}>
          <BreadcrumbLayout itemList={this.state.itemList}/>
          <Col className={styles.content}>
            <MaximDetailModel prePage={this.props.params.prePage} orderDetail={this.props.orderDetail} dispatch={this.props.dispatch} orderId={this.props.params.orderId} orderNumber={this.props.params.orderNumber} status={this.props.params.status}/>
          </Col>
        </div>
      </ProtalLayout>
    );
  }
}

export default connect(({ maxim }) => ({ maxim }))(MaximDetail);


