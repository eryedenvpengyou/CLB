/*
 * show 工作台-首页
 * @author:Rex.Hua
 * @version:20170509
 */
import React from 'react';
import { connect } from 'dva';
import {Row, Col } from 'antd';
import SlideshowComponent from '../../components/portal/Slideshow.js';
import SetTopComponent from '../../components/portal/SetTop.js';
import SetBottomComponent from '../../components/portal/SetBottom.js';
import PlanComponent from '../../components/portal/Plan.js';
import ProductStrComponent from '../../components/portal/ProductStr.js';
import CommissionComponent from '../../components/portal/Commission.js';
import CourseComponent from '../../components/portal/Course.js'
import SideComponent from '../../components/portal/SideBar.js';
import * as styles from './Home.css'
import * as sysStyles from '../../styles/sys.css';
import InfoModal from '../../components/register/InfoModal';


function Home({ dispatch, register, list: dataSource, loading, total, page: current }) {
  return (
    <div>
      <InfoModal dispatch={dispatch} register={register}/>
      <SlideshowComponent />
      <Row>
        <Col className={sysStyles.bodyContent}>
          <Row>
            <SetBottomComponent />
          </Row>
        </Col>
        {
          JSON.parse(localStorage.user).userType == "ADMINISTRATION" ? ""
          :
          <Col className={styles.icon12}>
            <Row className={sysStyles.bodyContent}>
              <ProductStrComponent />
            </Row>
          </Col>
        }
        <Col className={styles.icon13}>
          <Row className={sysStyles.bodyContent}>
            <CommissionComponent />
          </Row>
        </Col> 
        {
          JSON.parse(localStorage.user).userType == "ADMINISTRATION" ? ""
          :
          <Col className={styles.icon14}>
            <Row className={sysStyles.bodyContent}>
              <CourseComponent />
            </Row>
          </Col>
        }
      </Row>
      <SideComponent />
    </div>

  );
}
export default connect(({register})=>({register}))(Home);
