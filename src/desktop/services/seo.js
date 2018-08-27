/**
 * wanjun.feng@hand-china.com
 * 2017/9/6
 */

import request from '../utils/request';
import {HTTP_HEADERS} from '../constants';

/**
 * 官网seo查询
 * @returns {Object}
 */
export function query(body={}) {
  return request('/api/public/sys/seo/query', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}