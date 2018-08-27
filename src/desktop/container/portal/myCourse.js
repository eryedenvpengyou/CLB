import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as React from "react";
import MyCourse from "../../components/portal/MyCourse";
import BreadcrumbLayout from "../../components/layout/BreadcrumbLayout";
import * as styles from '../../styles/sys.css'
import {Button} from 'antd';

const myCourse = ({ location,course,dispatch })=>{

  const itemList = [{
    name: '我的课程',
    url: '/#/portal/myCourse'
  }];

  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread_sty}>
          <BreadcrumbLayout style={{display:'inline'}} itemList={itemList} />
        </div>
        <MyCourse course={course} dispatch={dispatch}/>
      </div>
    </ProtalLayout>
  );
}

export default connect(({course}) => ({course}))(myCourse);
