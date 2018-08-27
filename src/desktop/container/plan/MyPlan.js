/*
 * show 我的计划书
 * @author:zhouting
 * @version:20170517
 */
import React from 'react';
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import MyPlanComponent from '../../components/plan/MyPlan.js';
import style from '../../styles/plan.css';

class myPlan extends React.Component {
  constructor(props){
        super(props);
        this.state = {
            itemList :[{
                name:'工作台',
                url:'/#/portal/home'
            },{
                name:'我的计划书'
            }]
        }
    }
  render() {
    return(
      <ProtalLayout location={location}>
        <div className={style.plan}>
          <BreadcrumbLayout itemList={this.state.itemList} />
          <MyPlanComponent />
        </div>
    </ProtalLayout>
    )
  }
}
export default connect()(myPlan);
