/*
 * show 对账单管理
 * @author:zhouting
 * @version:20180426
 */
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import CheckComponent from '../../components/channel/Check';
import Payment from '../../components/settlement/Payment';
import * as styles from '../../styles/settlement.css';
import { Tabs ,Col } from 'antd';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
class Check extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*面包屑数据*/
      itemList: [
      {
        name: '工作台',
        url: '/#/portal/home'
      },
      {
        name: '结算管理',
        url: '/#/settlement/settlementManage'
      },
      {
        name: this.props.params.key=='1'?'收款对账单':'付款对账单',
      }],
      key1: 1,
      key2: 1,
    };
  };

  onTabClick(key){
    if(key == 1){
      this.setState({key1: new Date().getTime()});
      this.state.itemList[2].name = '收款对账单'
    }
    else if(key == 2){
      this.setState({key2: new Date().getTime()});
      this.state.itemList[2].name = '付款对账单'
    }
    else {

    }
  }

  render() {
    return (
      <ProtalLayout location={this.props.location}>
        <div style={{width: '100%'}}>
          <BreadcrumbLayout itemList={this.state.itemList} />
          <Col className={styles.content}>
              <br/>
              <Tabs defaultActiveKey={this.props.params.key||'1'} onTabClick={this.onTabClick.bind(this)} type="card">
                <Tabs.TabPane tab="收款对账单" key="1">
                  <br/>
                  <CheckComponent key1={this.state.key1}/>
                </Tabs.TabPane>
                  <Tabs.TabPane tab="付款对账单" key="2">
                    <br/>
                    <Payment key2={this.state.key2}/>
                  </Tabs.TabPane>
              </Tabs>
          </Col>

        </div>
      </ProtalLayout>
    );
  }
}
export default connect()(Check);
