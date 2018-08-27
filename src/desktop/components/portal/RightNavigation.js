
import React from 'react';
import { connect } from 'dva';
import { Affix } from 'antd';
import styple from './RightNavigation.css';

function RightNavigation({ location }) {
  return(
    <div>
      <Affix style={{ float: 'right' }} offsetTop={120} onChange={affixed => console.log(affixed)}>
         <div className={styple.ant_back_top_inner} style={{ marginBottom:10+'px' }} >财联邦公众号</div>
         <div className={styple.ant_back_top_inner} style={{ marginBottom:10+'px' }} >意见反馈</div>
         <div className={styple.ant_back_top_inner} style={{ marginBottom:10+'px' }} >返回顶部</div>
      </Affix>
     </div>
  );
}
export default connect()(RightNavigation);
