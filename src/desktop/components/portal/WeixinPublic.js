/*
 * show 微信公众号二维码
 * @author:Rex.Hua
 * @version:20170510
 */
import React from 'react';
import { connect } from 'dva';
import { Affix } from 'antd';
import weixinpublic from '../../styles/images/weixinpublic.png';

function WeixinPublic({ location }) {
  return(
    <div >
      <Affix style={{ float: 'right' }}>
         <img src={weixinpublic} alt="财联邦" width="50%" />
      </Affix>
    </div>
  );
}
export default connect()(WeixinPublic);
