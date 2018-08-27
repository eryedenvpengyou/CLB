/*
 * @author:zhouting
 * @version:20170602
 */
import request from '../utils/request';
import { HTTP_HEADERS } from '../constants';
import { stringify } from 'qs';
/**
 * 往期回顾列表
 * @author Li jun
 * @param body
 * @returns {Object}
 */
export function fetchReviewList(body = {}) {
  return request(`/api/article/list${(body.page) ? `?page=${body.page}&pageSize=${body.pagesize}` : ''}`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 获取培训资料列表数据
 * @author Li jun
 * @param  {} body={}
 * @returns {Object}
 */
export function fetchDatumList(body = {}) {
  return request(`/api/course/fileList${(body.page) ? `?page=${body.page}&pageSize=${body.pagesize}` : ''}`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 提交培训支援数据
 * @author Li jun
 * @param  {} body={}
 * @returns {Object}
 */
export function submitTrainData(body = {}) {
  return request('/api/support/submit', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
/**
 * 获取往期回顾详情
 * @author Li jun
 * @param  {} body={}
 * @returns {Object}
 */
export function fetchReviewDetail(body = {}) {
  return request('/api/article/detail', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 更新下载次数
 * @author Li jun
 * @param  {} body={}
 * @returns {Object}
 */
export function updateDowloadTimes(body = {}) {
  return request('/api/course/updateDowloadTimest', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 提交报名信息
 * @author Li jun
 * @param  {} body={}
 * @returns {Object}
 */
export function enrollData(body = {}) {
  return request('/api/student/enroll', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 提交评价信息
 * @author Li jun
 * @param  {} body={}
 * @returns {Object}
 */
export function submitEvaluationData(body = {}) {
  return request('/api/course/evaluate', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
