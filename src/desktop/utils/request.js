import fetch from 'dva/fetch';
import { EFFECT_MINUTE } from '../constants';
import TipModal from '../components/common/modal/Modal';
import $ from 'jquery';
import qs from 'qs'
import * as styles from "../styles/login.css";

function checkStatus(response) {
  if (response && response.status && response.status >= 200 && response.status < 300) {
    return response;
  } else {
    /**
     * 用户未登录
     */
    if (response && response.status && response.status == 401) {
      localStorage.access_token = '';
      location.hash = '/login';
    }
    /**
     * 权限问题
     */
    if (response && response.status && response.status == 403) {
    }
    /**
     * 找不到页面
     */
    if (response && response.status && response.status == 404) {
    }
    /**
     * 服务器错误
     */
    if (response && response.status && response.status >= 500 && response.status <= 505) {
    }
    const error = new Error(response.statusText || '');
    error.response = response;
    throw error;
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default async function request(url, options) {
  //加载遮罩
  document.getElementsByClassName('ant-spin')[0].setAttribute('class', 'ant-spin ant-spin-spinning');
  document.getElementsByClassName('ant-spin-container')[0].setAttribute('class', 'ant-spin-container ant-spin-blur');

  if (localStorage.access_token) {
    if (url.indexOf("?") >= 0) {
      url += "&access_token=" + localStorage.access_token + "&sessionId=" + localStorage.sessionId;
    } else {
      url += "?access_token=" + localStorage.access_token + "&sessionId=" + localStorage.sessionId;
    }
  }
  const response = await fetch(url, options);

  //去掉遮罩
  document.getElementsByClassName('ant-spin')[0].setAttribute('class', 'ant-spin');
  document.getElementsByClassName('ant-spin-container')[0].setAttribute('class', 'ant-spin-container');

  checkStatus(response);
  const data = await response ? response.json() : {};
  return data;
}

//不需要 access_token
export async function directRequest(url, options) {
  const response = await fetch(url, options);

  checkStatus(response);

  const data = await response ? response.json() : {};

  return data;
}

/**
 * 路由跳转监听事件：用户类型校验
 * add by wanjun.feng at 2017/8/29
 * @param  {[type]} nextState [description]
 * @param  {[type]} replace   [description]
 * @return {[type]}           [description]
 */
export function routerBack(nextState, replace) {
  //用户类型=渠道/行政代办/供应商，登录前端；用户类型=客户/平台用户，登录后端
  if (localStorage.length > 0) {
    const user = JSON.parse(localStorage.user);
    if (user.userType === 'CUSTOMER' || user.userType === 'OPERATOR') {
      $("#backpage").html('backpage').html(localStorage.message);
    }
  }
}

/**
 * 路由跳转监听事件：用户类型以及token校验
 * add by xiaoyong.luo at 2017/6/9 13:51
 * @param  {[type]} nextState [description]
 * @param  {[type]} replace   [description]
 * @return {[type]}           [description]
 */
export function routerAuth(nextState, replace){
  if (location.hash.indexOf('/login?') != -1) {//登录页面route='/login'
    if (localStorage.access_token) {
      //用户类型=渠道/行政代办/供应商，登录前端；用户类型=客户/平台用户，登录后端
      const user = JSON.parse(localStorage.user);
      if (user.userType === 'CUSTOMER' || user.userType === 'OPERATOR') {
        $("#backpage").html('backpage').html(localStorage.message);
      } else {
        replace({ pathname: '/index' });
      }
    }
  } else {//其他页面
    if (!localStorage.access_token) {
      if (location.search) {
        mxLogin()
      } else {
        replace({ pathname: '/login' });
      }
    } else {
      //用户类型=渠道/行政代办/供应商，登录前端；用户类型=客户/平台用户，登录后端
      const user = JSON.parse(localStorage.user);
      if (user.userType === 'CUSTOMER' || user.userType === 'OPERATOR') {
        $("#backpage").html('backpage').html(localStorage.message);
      }
    }
  }
}
function mxLogin () {
  let data = qs.parse(location.search.slice(1))
  data.user.relatedPartyId = parseInt(data.user.relatedPartyId)
  data.user.userId = parseInt(data.user.userId)
  localStorage.access_token = data.token.access_token
  localStorage.sessionId = data.sessionId
  localStorage.user = JSON.stringify(data.user)
  localStorage.channelName = data.user.channelName
  localStorage.userName = data.user.userName
  localStorage.currentTime = new Date().getTime();
  let styleMenu = {};
  styleMenu.styleMenuWorkbench = styles.menuChoosed;
  styleMenu.styleMenuDivWorkbench = styles.menuChunked;
  styleMenu.styleMenuProductionLibrary = styles.menuChoose;
  styleMenu.styleMenuFinancial = styles.menuChoose;
  styleMenu.styleMenuDataLibrary = styles.menuChoose;
  styleMenu.styleMenuQaBasic = styles.menuChoose;
  styleMenu.styleMenuDivProductionLibrary = styles.menuChunk;
  styleMenu.styleMenuDivFinancial = styles.menuChunk;
  styleMenu.styleMenuDivDataLibrary = styles.menuChunk;
  styleMenu.styleMenuDivQaBasic = styles.menuChunk;
  localStorage.styleMenu = JSON.stringify(styleMenu);
  location.href = '/#/portal/home'
  // replace({ pathname: '/portal/home' });
}

export function convertResponse(type, component, callback) {

  return function (res) {
    if (isUnMounted(component)) {
      return new Promise((resolve, reject) => {
        res.abort = true;
        reject(res);
      });
    }
    callback && callback();
    if (res.ok) {
      return res[type]();
    } else {
      return new Promise((resolve, reject) => {
        reject(res);
      });
    }
  }
}
