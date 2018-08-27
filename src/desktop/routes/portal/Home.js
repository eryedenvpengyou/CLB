/*
 * show 工作台-首页.
 * @author:Rex.Hua
 * @version:20170510
 */
import React from 'react';
import { connect } from 'dva';
import styles from './Home.css';
import ProtalLayout from '../../components/layout/ProtalLayout';
import HomeComponent from '../../container/portal/Home';
import { routerRedux } from 'dva/router';

function Home({ location }) {
return (
    <ProtalLayout location={location}>
      <div className={styles.normal}>
        <HomeComponent /> 
      </div>
    </ProtalLayout>
  );
}

 // export default Products;
export default connect()(Home);
