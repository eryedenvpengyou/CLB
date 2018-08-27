/**
 * Created by Kitty on 2017/6/7.
 */

import request from '../utils/request';
import {HTTP_HEADERS} from '../constants';
import {stringify} from 'qs';

/**
 * 获取快码
 * @param body
 * @returns {Object}
 */
export function download(body={}) {
  return request("/api/fms/sys/attach/file/detail",{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}
