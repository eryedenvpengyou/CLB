/**
 * Created by Kitty on 2017/6/3.
 */

import request from '../utils/request';
import {HTTP_HEADERS} from '../constants';
import {stringify} from 'qs';

/**
 * 获取快码
 * @param body
 * @returns {Object}
 */
export function getCode(body={}) {
  return request('/api/clb/common/clbCode',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return JSON.parse(data);
  });
}

/**
 * 获取快码--不需要token验证
 * @param body
 * @returns {Object}
 */
export function getPublicCode(body={}) {
  return request('/api/public/common/clbCode',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return JSON.parse(data);
  });
}