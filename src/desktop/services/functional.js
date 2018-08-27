import request from '../utils/request';
import {HTTP_HEADERS} from '../constants';
import {stringify} from 'qs';


export function fetchPay(body={}) {
  return request(`/api/protal/pay`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.params),
  });
}

/**
 * Pending查询 数量
 * @param body{orderType:"INSURANCE",status:'PENDING_MATERIAL'}
 * @returns {Object}
 */
export function queryOrdPendingTotal(body={}) {
  return request(`/api/ordPending/queryOrdPendingTotle`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 业务支援 需复查、待支付 数量
 * @param body{status:'PAYMENT'}
 * @returns {Object}
 */
export function querySupportTotal(body={}) {
  return request(`/api/support/supportQueryTotal`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 订单查询 数量
 * @param body={orderType='VALUEADD/INSURANCE/BOND/IMMIGRANT',status,status1,status2,status3,status4}
 * @returns {Object}
 */
export function queryPersonalTotal(body={}) {
  return request(`/api/ordOrder/queryPersonalTotal`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 售后查询 数量
 * @param body{afterStatus:'AUDITAGIN'}
 * @returns {Object}
 */
export function queryOrdAfterListTotal(body={}) {
  return request(`/api/ordAfter/queryOrdAfterListTotal`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 续保查询 数量
 * @param body
 * @returns {Object}
 */
export function queryRenewalTotal(body={}) {
  return request(`/api/ordRenewal/queryRenewalTotal`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 我的计划书 数量
 * @param body{status:'REVIEW', extraStatus:'COMPLETED', downloadFlag:'N'}
 * @returns {Object}
 */
export function getMyPlanCount(body={}) {
  return request(`/api/plan/getMyPlanCount`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 对账单查询 数量
 * @param body{paramStatus:'APPROVED',status:'YQR'}
 * @returns {Object}
 */
export function getCheckCount(body={}) {
  return request(`/api/channelcheck/getCheckCount`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}
