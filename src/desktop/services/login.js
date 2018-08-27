import request from '../utils/request';
import {directRequest} from '../utils/request';
import {HTTP_HEADERS} from '../constants';
import {stringify} from 'qs';

// const headers = {
//   'Content-Type': 'application/x-www-form-urlencoded;utf-8',
// };


/**
 * 先发送Get请求登录
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function loginFirst(body={}){
  return directRequest(`/api/public/user/login`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 *发送短信验证码
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function smscode(body={}){
  return directRequest('/sc/send/smscode',{
    method: 'POST',
    headers: {
      'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: stringify(body),
  });
}

/**
 *短信验证码登录
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function mexinLogin(body={}){
  return directRequest('/sc/smscode/login',{
    method: 'POST',
    headers: {
      'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: stringify(body),
  });
}

/**
 *短信登录手机区号
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function phoneCode(body={}){
  return directRequest('/api/public/query/phoneCode',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 登录函数
 * @param url
 * @param options
 * @returns {Promise<Promise<any>|*>}
 */
export function login(body={}) {
  return directRequest(`/oauth/token`,{
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded;utf-8',
    },
    body: stringify(body)
  });
}



/**
 * 以下接口都是为了  团队中创建的成员 第一次登录服务，在别的地方不要用
 */

/**
 * 发送短信验证码
 * @type {Object}
 */
 export function sendVerifiCode(body={}){
   return directRequest('/api/public/sendVerifiCode',{
     method: 'POST',
     headers: HTTP_HEADERS,
     body: JSON.stringify(body),
   });
 }

 /**
 * 验证手机验证码   这里传的 sessionId 需要是发送验证码的 sessionId
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function checkVerifyCode(body={}) {
  return directRequest('/api/user/verifyPhome?access_token=' + localStorage.temp_token +'&sessionId='+body.sessionId || '',{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 修改密码
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function changePassword(body={}) {
  return directRequest('/api/user/modifyPasswordById?access_token='+localStorage.temp_token,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 更新用户状态
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function updateUserStatus(body={}) {
  return directRequest('/api/user/active?access_token=' + localStorage.temp_token,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}
