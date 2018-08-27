import request from '../utils/request';
import { HTTP_HEADERS } from '../constants';
import { stringify } from 'qs';



//查看订单 投保人、受保人信息
export function fetchOrderCustomer(body = {}) {
  return request('/api/ordCustomer/query', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
