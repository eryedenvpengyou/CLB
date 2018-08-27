import request from '../utils/request';
import {stringify} from 'qs';
import {HTTP_HEADERS} from '../constants';


const headers={
  'Content-Type': 'application/json;utf-8',
};

/**
 * 用户权限
 * @param body
 * @returns {Object}
 */
export function userAuthority(body={}) {
    return request('/api/public/meixin/signin?data='+body.data+'&partnerName='+body.partnerName,{
      method: 'POST',
      headers: HTTP_HEADERS,
      body: JSON.stringify(body),
    });
  }
