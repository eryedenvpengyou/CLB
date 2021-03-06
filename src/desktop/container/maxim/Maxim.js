import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import MaximPerson from '../../components/maxim/MaximPerson';
import MaximTeam from '../../components/maxim/MaximTeam';
import * as styles from '../../styles/ordersummary.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import { Tabs ,Col } from 'antd';


class Maxim extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*面包屑数据*/
      itemList: [
        {
          name: '工作台',
          url: '/#/portal/home'
        },{
          name: '我的基金',
          url: '/#/maxim/list/'+this.props.params.key||'1'
        }
      ],
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
                <MaximPerson key1={this.state.key1}/>
              </Tabs.TabPane>
              {
                JSON.parse(localStorage.user).userType != "ADMINISTRATION" &&
                <Tabs.TabPane tab="团队" key="2">
                  <br/>
                  <MaximTeam key2={this.state.key2}/>
                </Tabs.TabPane>
              }
            </Tabs>
          </Col>
        </div>
      </ProtalLayout>
    );
  }
}
export default connect(({ maxim }) => ({maxim}))(Maxim);

