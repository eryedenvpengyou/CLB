/*
 * show 公告栏
 * @author:zhouting
 * @version:20170510
 */
import React from 'react';
import { connect } from 'dva';
import style from '../../styles/Public.css';

function Notice({ location }) {
  return(
    <div>
        <div className={style.communal}>
            <span></span>
            <span>公告栏</span>
         </div>
         <ul>
             <li><a href="JavaScript:;">【假期】香港4月份假期一览 <span>3-20</span></a></li>
             <li><a href="JavaScript:;">【假期】香港4月份假期一览 <span>3-20</span></a></li>
             <li><a href="JavaScript:;">【假期】香港4月份假期一览 <span>3-20</span></a></li>
             <li><a href="JavaScript:;">【假期】香港4月份假期一览 <span>3-20</span></a></li>
             <li><a href="JavaScript:;">【假期】香港4月份假期一览 <span>3-20</span></a></li>
         </ul>
    </div>
  );
}
export default connect()(Notice);
