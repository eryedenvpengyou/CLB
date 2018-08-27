import request from '../utils/request';
import {directRequest} from '../utils/request';
import {stringify} from 'qs';
import {HTTP_HEADERS} from '../constants';


//支付之前验证订单
export function createOrder(body={}) {
  return request('/api/payment/createOrder', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

//获取微信支付(会二维码)
export function wxpayStart(body={}) {
  return directRequest('/api/payment/wxpayStart?orderNumber='+body.orderNumber+'&access_token='+body.access_token, {
    method: 'POST',
headers: HTTP_HEADERS,
  })
}


//支付宝支付
export function alipayStart(body={}) {
  return request('/api/payment/alipayStart', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  })
}


//支付之后的接口
export function payOff(body={}) {
  return request('/api/payment/payOff', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  })
}


//查增值服务
export function fetchAddService(body=[]){
  return request(`api/ordOrder/query`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


//查询支付订单
export function queryBySource(body=[]){
  return request(`api/payment/queryBySource`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//根据orderNumber 查询 数据
export function queryByorderNumber(body=[]){
  return request(`api/payment/queryByOrderNumber`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}









