import request from '../utils/request';
import {HTTP_HEADERS} from '../constants';
import {stringify} from 'qs';



//查看客户 数据屏蔽
export function fetchCustomer(body={}) {
  const url = `/api/ctmCustomer/wsQuery?page=${body.page || 1}&pageSize=${body.pageSize || 20}` ;
  return request(url,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


//查看 客户详情
export function fetchCustomerDetail(body={}) {
  return request(`/api/ctmCustomer/detail/query`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


//删除
export function deleteCustomer(body={}){
  return request('/api/ctmCustomer/delete',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}



//提交信息
export function submitCustomer(body={}) {
  return request('/api/ctmCustomer/submit',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}



//查看 客户订单信息
export function fetchCustomerOrderB(body={}) {
  return request('/api/ordOrder/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
};

//查看 客户订单信息  数据屏蔽
export function fetchCustomerOrder(body={}) {
  return request('/api/ordOrder/queryPersonal',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
};

//查看 客户订单信息 图
export function fetchClassAmount(body={}) {
  return request('/api/ordOrder/queryClassAmount',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
};


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
