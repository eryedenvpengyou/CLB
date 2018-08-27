/**
 * Created by hand on 2017/6/1.
 */
import request from '../utils/request';
import {HTTP_HEADERS} from '../constants';

export function noticeList(body={}) {
  let url = "";
  if (body.page) {
    url = 'api/announcement/summary?page='+body.page+"&pagesize="+body.pagesize;
  } else {
    url = 'api/announcement/summary';
  }
  return request(url, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

// 公告类型列表
export function noticeType(body = {}) {
  return request('api/announcement/noticeType', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then(data => {
    return data;
  })
}

export function noticeUpdate(body={}) {
  return request('api/announcement/update', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
