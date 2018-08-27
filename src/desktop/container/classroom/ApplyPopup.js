/*
 * show 报名弹窗
 * @author:zhouting
 * @version:20170527
 */
import React from 'react';
import { connect } from 'dva';
import ApplyPopupComponent from '../../components/classroom/ApplyPopup';


function ApplyPopup({ location }) {
  return (
    <div>
      <ApplyPopupComponent />
    </div>
  );
}
export default connect()(ApplyPopup);