/**
 * Created by hand on 2017/6/20.
 */

import { connect } from 'dva';
import React from 'react';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import ProtalLayout from '../../components/layout/ProtalLayout';
import PendingSummary from '../../components/plan/PlanLibrarySummary';
import * as styles from '../../styles/ordersummary.css'

class PlanLibrary extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      itemList :[{
        name:'工作台',
        url:'/#/portal/home'
      },{
        name:'计划书库'
      }]
    }
  }
  render() {
   return (
     <ProtalLayout location={location}>
      <div className={styles.main}>
        <BreadcrumbLayout itemList={this.state.itemList} />
        <PendingSummary />
      </div>
    </ProtalLayout>
   )
  }
}

export default connect()(PlanLibrary);
