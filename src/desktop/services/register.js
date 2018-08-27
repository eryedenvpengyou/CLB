import request from '../utils/request';
import {directRequest} from '../utils/request';
import {HTTP_HEADERS} from '../constants';
import {stringify} from 'qs';


/**
 * 获取快码
 * @param body
 * @returns {Object}
 */
export function fetchCode(body={}) {
  return request(`/api/clb/common/clbCode`,{
   method: 'POST',
   headers: HTTP_HEADERS,
   body: JSON.stringify(body.params),
  });
 }


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
 * 注册
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function submit(body={}){
  return directRequest('/api/public/user/regest?sessionId='+body.sessionId || '',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


/**
 * 注册详细信息填写，更新刚刚注册账号的信息
 */
export function submitDetail(body={}){
  return request(`/api/cnlChannel/submit`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}



/**
 * 验证手机验证码   这里传的 sessionId 需要是发送验证码的 sessionId
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function checkVerifyCode(body={}) {
  return directRequest('/api/user/verifyPhome?access_token=' + localStorage.access_token +'&sessionId='+body.sessionId || '',{
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
  return request(`/api/user/modifyPasswordById`,{
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
  return request(`/api/user/active`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 忘记密码
 *
 * @export
 * @param {any} [body={}]
 */
export function passwdback(body={}){
  return directRequest('/api/public/user/forgetPassword?sessionId='+body.sessionId || '',{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}


/**
 * 获取用户信息
 * @param {*} body
 */
export function fetchUserInfo(body={}){
  return request('/api/user/queryUserInfo',{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 变更手机号 -- 第二步
 * @param {*} body
 */
export function changePhoneSecond(body={}){
  return directRequest('/api/user/changePhone?access_token=' + localStorage.access_token +'&sessionId='+body.sessionId || '',{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 服务协议
 * @param {*} body
 */
export function queryDomainProtocol(body={}){
  return request('/api/public/sysDomain/queryDomainProtocol',{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
