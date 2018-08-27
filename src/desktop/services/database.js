/*
 * service 资料库
 * @author:Li jun
 * @version:20170628
 */
import request from '../utils/request';
import { HTTP_HEADERS } from '../constants';
import { stringify } from 'qs';

/**
 * 更新下载次数
 * @author Li jun
 * @param  {} body={}
 * @returns {Object}
 */
export function updateCommonDataDowloadTimes(body = {}) {
  return request('/api/sys/updateDownloadTimes', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

export function updateProductionDataDowloadTimes(body = {}) {
  return request('/api/update/prdFileDownloadTimes', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 获取通用资料列表数据
 * @author Li jun
 * @param  {} body={}
 * @returns {Object}
 */
export function fetchCommonData(body = {}) {
  return request(`/api/sys/commonFileQuery${(body.page) ? `?page=${body.page}&pageSize=${body.pageSize}` : ''}`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 获取产品资料列表数据
 * @author Li jun
 * @param  {} body={}
 * @returns {Object}
 */
export function fetchProductionData(body = {}) {
  return request(`/api/query/prdFile${(body.page) ? `?page=${body.page}&pageSize=${body.pageSize}` : ''}`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
