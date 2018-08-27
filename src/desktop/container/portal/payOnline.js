import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as React from "react";
import PayOnline from "../../components/portal/PayOnline";
import * as styles from '../../styles/sys.css';

const payOnline = ({ location,dispatch, params})=>{
  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <PayOnline dispatch={dispatch} sourceType={params.sourceType} sourceId={params.sourceId}/>
      </div>
    </ProtalLayout>
  );
}

export default connect()(payOnline);
