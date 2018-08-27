/*
 * show tab栏
 * @author:zhouting
 * @version:20170522
 */
import React from 'react';
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import ClassTabComponent from '../../components/classroom/ClassTab';


function Tab({ location }) {
  return (
    <ProtalLayout location={location}>
      <ClassTabComponent />
    </ProtalLayout>
    
  );
}
export default connect()(Tab);