import request from '../utils/request';
import { HTTP_HEADERS } from '../constants';
import { stringify } from 'qs';

//课程 列表
export function fetchCourse(body = {}) {
  const url = `/api/course/list${(body.page) ? `?page=${body.page}&pageSize=${body.pagesize}` : ''}`;
  return request(url, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//我的课程 列表
export function fetchMyCourse(body = {}) {
  const url = `/api/course/enrollList${(body.page) ? `?page=${body.page}&pageSize=${body.pagesize}` : ''}`;
  return request(url, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}