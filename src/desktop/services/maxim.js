import request from '../utils/request';
import {stringify} from 'qs';
import {HTTP_HEADERS} from '../constants';


const headers={
  'Content-Type': 'application/json;utf-8',
};


/**
 * 我的Maxim个人
 * @param body
 * @returns {Object}
 */
export function fetchMaximPersonQuery(body={}) {
  return request(`/api/ordMx/queryWsMxPersonOrderList`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}


/**
 * 我的Maxim团队数据
 * @param body
 * @returns {Object}
 */
export function fetchMaximTeamQuery(body={}) {
  return request(`/api/ordMx/queryWsMxTeamOrderList`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 我的Maxim详情数据
 * @param body
 * @returns {Object}
 */
export function queryWsMxOrderDetail(body={}) {
  return request(`/api/ordMx/queryWsMxOrderDetail`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 我的Maxim详情数据-预约资料
 * @param body
 * @returns {Object}
 */
export function queryWsMxOrderReservation(body={}) {
  return request(`/api/ordMx/queryWsMxOrderReservation`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}


/**
 * 我的Maxim详情数据-回款明细
 * @param body
 * @returns {Object}
 */
export function queryWsMxOrderPayouts(body={}) {
  return request(`/api/ordMx/queryWsMxOrderPayouts`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 查看日志
 * @param body
 * @returns {Object}
 */
export function fetchMaximStatusHisList(body={}) {
  return request('/api/ordMx/queryWsMxOrderLog',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
/**
 * 保存,取消 
 * @param body
 * @returns {Object}
 */
export function submitOrder(body={}) {
  return request('/api/ordMx/submitOrder',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}