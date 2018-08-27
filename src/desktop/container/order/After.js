import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import AfterPersonal from '../../components/order/AfterPersonal';
import AfterTeam from '../../components/order/AfterTeam';
import * as styles from '../../styles/ordersummary.css';
import { Tabs ,Col } from 'antd';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
class After extends React.Component {
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
        name: '售后申请',
        url: '/#/after/list/'+this.props.params.key||'1'
      }],
      key1: 1,
      key2: 1,
    };
  };

  onTabClick(key){
    if(key == 1){
      this.setState({key1: new Date().getTime()});
    }
    else if(key == 2){
      this.setState({key2: new Date().getTime()});
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
                <Tabs.TabPane tab="个人" key="1">
                  <br/>
                  <AfterPersonal key1={this.state.key1}/>
                </Tabs.TabPane>
                {
                  JSON.parse(localStorage.user).userType != "ADMINISTRATION" &&
                  <Tabs.TabPane tab="团队" key="2">
                    <br/>
                    <AfterTeam key2={this.state.key2}/>
                  </Tabs.TabPane>
                }
              </Tabs>
          </Col>

        </div>
      </ProtalLayout>
    );
  }
}
export default connect()(After);
