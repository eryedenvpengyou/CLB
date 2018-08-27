/*
 * @author:zhouting
 * @version:20170602
 */
import request from '../utils/request';
import {HTTP_HEADERS} from '../constants';
import {stringify} from 'qs';


export function cancelPlan(body={}){
  return request('/api/plan/update/plnStatusInfo', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 我的计划书
 */
export function plan(body={}) {
  let url = '';
  if (body.page) {
    url = '/api/plan/myPlan?page='+body.page+"&pagesize="+body.pagesize;
  } else {
    url = '/api/plan/myPlan';
  }
  return request(url, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data
  });
}
// 下载
export function downloadFile(body={}) {
 return request('/api/plan/update/downloadFlagInfo', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 查看团队额度
 */
export function team(body={}) {
  return request('/api/plan/queryTeamAmount', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 查看个人额度
 */
export function person(body={}) {
  return request('/api/plan/queryAmount', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 计划书申请--产品列表
 *
 */
export function production(body={}) {
  return request('api/production/headerlist?page='+body.page+"&pagesize="+body.pagesize, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 计划书申请--获取产品公司
 *
 */
export function queryAll(body={}) {
  return request('/api/supplier/queryAll?page='+body.page+"&pagesize="+body.pagesize, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 计划书申请--获取自付选项
 *
 */
export function selfpay(body={}) {
  return request('/api/plan/item/selfpay', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 计划书申请
 */
export function apply(body={}) {
  return request('/api/plan/requestSubmit', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
//提取
export function extract(body={}) {
  return request('/api/plan/queryExtract', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
//附加险
export function adtRisk(body={}) {
  return request('/api/plan/queryAdtRisk', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
//代办行政
export function channelAvil(body={}) {
  return request('/api/pln/plan/library/queryChanneAvilAmount', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
//计划书额度
export function planCount(body={}) {
  return request('/api/plan/request/queryAddPlanCount', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}