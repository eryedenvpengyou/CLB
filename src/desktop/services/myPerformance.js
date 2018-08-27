/*
 * @author:zhouting
 * @version:20170704
 */  
import request from '../utils/request';
import {HTTP_HEADERS} from '../constants';
import {stringify} from 'qs';

/**
 * 我的业绩
 */
export function performance(body={}) {
  let url = '';
  if (body.page) {
    url = '/api/ordPerformance/query?page='+body.page+"&pagesize="+body.pagesize;
  } else {
    url = '/api/ordPerformance/query';
  }
  return request(url, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}