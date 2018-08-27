/*
 * show 预约签单/计划书库
 * @author:zhouting
 * @version:20170510
 */
import React from 'react';
import { connect } from 'dva';
import style from '../../styles/Public.css';

function Plan({ location }) {
  return(
      <div className={style.plan}>
          <div>
              <a className={style.act} href="javascript:;" onClick={() => { window.location.hash = '/portal/businessChoose'; }}>预约签单</a>
              <a href="/#/plan/myPlanLibrary">计划书库</a>
          </div>
        <div>签单累计：</div>
        <div>
            <span>签单量：</span>
            <span className={style.num}>25/34</span>
        </div>
        <div>
            <span>已派转介费：</span>
            <span className={style.num}>25/34</span>
            <span>港币</span>
        </div>
    </div>
  );
}
export default connect()(Plan);
