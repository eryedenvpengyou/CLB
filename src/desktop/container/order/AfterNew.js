import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import AfterNewModel from '../../components/order/AfterNew';
import * as styles from '../../styles/order.css'
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import { Col } from 'antd';


class AfterNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: [{
        orderId: this.props.params.orderId,
        afterProject: this.props.params.afterProject,
        afterType: this.props.params.afterType,
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
          url: '/#/after/AfterNew/'+this.props.params.afterProject+'/'+this.props.params.afterType+'/'+this.props.params.orderId
        }]
    };
  };
  render () {
    return (
      <ProtalLayout location={location}>
        <div className={styles.main}>
          <BreadcrumbLayout itemList={this.state.itemList} />
          <Col offset={4} style={{marginTop: "20px"}} className={styles.content}>
            <AfterNewModel
              orderId={this.props.params.orderId}
              afterProject={this.props.params.afterProject}
              afterType={this.props.params.afterType}
              dispatch={this.props.dispatch}
              order={this.props.order}
            />
          </Col>
        </div>
      </ProtalLayout>
    );
  }
}

export default connect(({ order }) => ({ order }))(AfterNew);
