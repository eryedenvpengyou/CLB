import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import AfterRenewalPersonal from '../../components/order/AfterRenewalPersonal';
import AfterRenewalTeam from '../../components/order/AfterRenewalTeam';
import * as styles from '../../styles/ordersummary.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import { Tabs ,Col, Button } from 'antd';


class AfterRenewal extends React.Component {
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
          name: '续保清单',
          url: '/#/after/AfterRenewal/list/'+this.props.params.key||'1'
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
    const operations = <a href='/#/after/RenewalNeedKnow' style={{textDecoration: 'underline', color: '#9c9c9c', cursor: 'pointer', fontSize: '20px'}}>《续保需知》</a>
    return (
      <ProtalLayout location={this.props.location}>
        <div style={{width: '100%'}}>
            <BreadcrumbLayout itemList={this.state.itemList} />
            <Col className={styles.content}>
               <br/>
               <Tabs defaultActiveKey={this.props.params.key||'1'} onTabClick={this.onTabClick.bind(this)}  type="card" tabBarExtraContent={operations}>
                  <Tabs.TabPane tab="个人" key="1">
                    <br/>
                    <AfterRenewalPersonal  key1={this.state.key1}/>
                  </Tabs.TabPane>
                  {
                    JSON.parse(localStorage.user).userType != "ADMINISTRATION" &&
                    <Tabs.TabPane tab="团队" key="2">
                      <br/>
                      <AfterRenewalTeam  key2={this.state.key2}/>
                    </Tabs.TabPane>
                  }
                </Tabs>
            </Col>
        </div>
      </ProtalLayout>
    );
  }
}
export default connect()(AfterRenewal);
