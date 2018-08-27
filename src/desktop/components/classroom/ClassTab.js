/*
 * show tab栏
 * @author:zhouting
 * @version:20170522
 */
import React from 'react';
import { connect } from 'dva';
import { Col,Row,Tabs,Button,Icon} from 'antd';
import Course from './Course';
import Datum from './Datum';
import Business from './Business';
import style from '../../styles/classroom.css';

const TabPane = Tabs.TabPane;

class Tab extends React.Component {
  render(){
    return (
      <div className={`${style.classroom} ${style.main}`}>
        <Row>
          <Col xs={16} sm={16} md={16} lg={16} xl={16} offset={4} style={{backgroundColor:'#efefef',padding:12}}>
            <Tabs defaultActiveKey="1" style={{backgroundColor:'#fff'}}>
              <TabPane tab="培训课堂" key="1">
                <Course />
              </TabPane>
              <TabPane tab="培训资料" key="2">
                <Datum/>
              </TabPane>
              <TabPane tab="业务支援" key="3">
                <Business/>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    );
  }
}
export default connect()(Tab);
