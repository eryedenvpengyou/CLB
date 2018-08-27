import request from '../utils/request';
import {HTTP_HEADERS} from '../constants';


/**
 * 获取快码
 * @param body
 * @returns {Object}
 */
export function pendingList(body={}) {
  let url = "";
  if (body.page) {
    url = 'api/plan/library?page='+body.page+"&pagesize="+body.pagesize;
  } else {
    url = 'api/plan/library';
  }
  return request(url, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 查询安全级别
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function queryAllSecurityLevel(body={}) {
  return request('api/pln/plan/library/querySecurityLevelCode', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 查询安全区域
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function queryAllSecurityArea(body={}) {
  return request('api/pln/plan/library/querySecurityAreaCode', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 查询年期
 * @param body
 * @returns {Promise.<TResult>|*}
 */
export function queryAllSublineName(body={}) {
  return request('api/pln/plan/library/querySublineCode', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 查询自付
 * @param body
 * @returns {Promise.<TResult>|*}
 */
export function queryAllSelfPay(body={}) {
  return request('api/pln/plan/library/querySelfPayByItem', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

export function queryAllPayMethod(body={}) {
  return request('api/pln/plan/library/queryPaymethodByItem', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
