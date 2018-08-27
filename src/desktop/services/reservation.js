import request from '../utils/request';
import {HTTP_HEADERS} from '../constants';
import {stringify} from 'qs';


//业务支援 列表
export function fetchSupport(body={}) {
  const   url = '/api/support/query?page='+body.page+"&pageSize="+body.pageSize;
  return request(url,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


//查看 业务支援 详情
export function fetchSupportDetail(body={}) {
  return request(`/api/support/query`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//取消申请 业务支援 详情
export function cancelSupportDetail(body={}) {
  return request(`/api/support/cancel`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//重新申请 业务支援 详情
export function submitSupportDetail(body={}) {
  return request(`/api/support/submit`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//增值服务订单列表及详情
export function fetchAddService(body=[]){
  return request(`api/ordOrder/queryPersonal?page=${body.page || 1}&pageSize=${body.pageSize || 20}`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
//增值服务详情
export function fetchServiceDetail(body=[]){
  return request(`api/ordOrder/query?page=${body.page || 1}&pageSize=${body.pageSize || 20}`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
//增值服务查询订单客户
export function fetchServiceCustomerDetail(body=[]){
  return request(`/api/ordCustomer/query`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
//产品数据
export function getProduction(body={}) {
  return request(`api/production/list?page=${body.page || 1}&pageSize=${body.pageSize || 20}`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


//提交增值服务详情
export function submitAddService(body=[]){
  return request(`api/ordOrder/submit`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//增值服务客户信息提交
export function submitOrdCustomer(body=[]) {
  return request('/api/ordCustomer/submit',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


/**
 * 产品详情
 * @param body
 * @returns {Object}
 */
export function productionDetail(body={}) {
  return request('/api/production/detail',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


/**
 * 查看支付订单信息
 *
 * @export
 * @param {any} [body={}]
 * @returns
 */
export function getPayOrderInfo(body={}){
  return request('/api/payment/queryBySource',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


/**
 * 查看 团队签证
 *
 * @export
 * @param {any} [body={}]
 * @returns
 */
export function ordTeamVisitor(body={}){
  return request('/api/ordTeamVisitor/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


/**
 * 查看日志
 * @param body
 * @returns {Object}
 */
export function fetchHisLog(body={}) {
  return request('/api/ordStatusHis/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 删除房间信息
 * @param body
 * @return {Object}
 */
export function deleteRoom(body={}) {
  return request('/api/ordSubscribeRoom/remove', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  })
}
