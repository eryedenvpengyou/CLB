import React from 'react';
import { connect } from 'dva';
import { Col, Tabs } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as styles from '../../styles/sys.css';
import * as orderStyles from '../../styles/ordersummary.css';
import SuReservation from "../../components/reservation/SuReservation";
import SvReservation from "../../components/reservation/SvReservation";
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';

class reservation extends React.Component {

  state = {
    itemList: [],
    suTab: '',
    svTab: '',
  };

  componentWillMount(){
    let itemList = [{name: '我的预约', url: '/#/portal/home' }], suTab = '', svTab = '';
    if (this.props.params.key == '1') {
      itemList.push({
        name: '业务支援',
        url: '/#/portal/reservation/1',
      });
      suTab = <SuReservation />;
    } else {
      itemList.push({
        name: '增值服务',
        url: '/#/portal/reservation/2',
      });
      svTab = <SvReservation />;
    }
    this.setState({itemList, suTab, svTab});
  }

  onTabClick(value){
    let itemList = [{name: '我的预约', url: '/#/portal/home' }];
      if(value == '1'){
      const suTab = <SuReservation />, svTab = '';
      itemList.push({
        name: '业务支援',
        url: '/#/portal/reservation/1',
      });
      this.setState({itemList, suTab, svTab});
      window.location.hash = '/portal/reservation/1';
    }else if(value == '2'){
      const suTab = '', svTab = <SvReservation />;
      itemList.push({
        name: '增值服务',
        url: '/#/portal/reservation/2',
      });
      this.setState({itemList, suTab, svTab});
      window.location.hash = '/portal/reservation/2';
    }
  }

  render(){

    return (
      <ProtalLayout location={location}>
        <div className={styles.main}>
          <div className={styles.bread}>
            <BreadcrumbLayout itemList={this.state.itemList} />
          </div>
          <div style={{width: '100%'}}>
            <Col className={orderStyles.content}>
              <br/>
              <Tabs defaultActiveKey={this.props.params.key || '1'} type="card" onTabClick={this.onTabClick.bind(this)}>
                <Tabs.TabPane tab="业务支援" key="1">
                  <br/>
                  {this.state.suTab}
                </Tabs.TabPane>

                <Tabs.TabPane tab="增值服务" key='2'>
                  <br/>
                  {this.state.svTab}
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </div>
        </div>
      </ProtalLayout>
    );
  }

}

export default connect()(reservation);
