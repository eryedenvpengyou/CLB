/*
 * show 我的应收应付预测
 * @author:zhouting
 * @version:20180425
 */
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import ReceivableForecast from '../../components/settlement/ReceivableForecast';
import ActualForecast from '../../components/settlement/ActualForecast';
import * as styles from '../../styles/settlement.css';
import { Tabs ,Col } from 'antd';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
class Forecast extends React.Component {
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
        name: this.props.params.key=='1'?'我的应收预测':'我的应付预测',
      }],
      key1: 1,
      key2: 1,
    };
  };
  onTabClick(key){
    if(key == 1){
      this.setState({key1: new Date().getTime()});
      this.state.itemList[2].name = '我的应收预测'
    }
    else if(key == 2){
      this.setState({key2: new Date().getTime()});
      this.state.itemList[2].name = '我的应付预测'
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
                <Tabs.TabPane tab="我的应收预测" key="1">
                  <br/>
                  <ReceivableForecast key1={this.state.key1}/>
                </Tabs.TabPane>
                  <Tabs.TabPane tab="我的应付预测" key="2">
                    <br/>
                    <ActualForecast key2={this.state.key2}/>
                  </Tabs.TabPane>
              </Tabs>
          </Col>

        </div>
      </ProtalLayout>
    );
  }
}
export default connect()(Forecast);
