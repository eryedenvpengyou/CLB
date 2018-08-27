/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import request from '../utils/request';
import {HTTP_HEADERS} from '../constants';
import {stringify} from 'qs';

/**
 * 获取快码
 * @param body
 * @returns {Object}
 */
export function fetchCode(body={}) {
  body.access_token = localStorage.access_token;
  body.nationality = 'PUB.NATION'; //国籍
  body.supplicer = 'COURSE.SUPPLIER_ID'; //产品公司
  body.payMethod = 'CMN.PAY_METHOD'; //缴费方式
  return request(`/api/clb/common/clbCode`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}


/**
 * 产品列表
 * @param body
 * @returns {Object}
 */
export function _productionList(body={}) {
  return request('/api/production/list',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 产品列表(详情)
 * @param body
 * @returns {Object}
 */
export function productionHeaderList(body={}) {
  let url = "";
  if (body.page) {
    url = '/api/production/headerlist?page='+body.page+"&pagesize="+body.pagesize;
  } else {
    url = '/api/production/list';
  }
  return request(url, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 产品列表(详情)
 * @param body
 * @returns {Object}
 */
export function productionList(body={}) {
  let url = "";
  if (body.page) {
    url = '/api/production/list?page='+body.page+"&pagesize="+body.pagesize;
  } else {
    url = '/api/production/list';
  }
  return request(url, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 产品标签
 * @returns {Object}
 */
export function productionItemLabels(body={}) {
  return request('/api/production/queryItemLabels', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 产品详情
 * @param body
 * @returns {Object}
 */
export function productionDetail(body={}) {
  return request('/api/production/detail',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 产品对比--对比表
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function productionCompareTable(body={}) {
  return request('/api/public/production/prdCompare',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 产品对比--雷达图
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function productionCompareRadar(body={}) {
  return request('/api/public/production/prdRadarChart',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 转交费查询
 * @param body
 * @returns {Promise.<TResult>|*}
 */
export function queryReferralFee(body={}) {
  let url = "";
  if (body.page) {
    url = '/api/cmn/queryReferralFee?page='+body.page+"&pagesize="+body.pagesize;
  } else {
    url = '/api/cmn/queryReferralFee';
  }
  return request(url, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 保费查询
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function getPrdPremium(body={}) {
  return request('/api/production/getPrdPremium', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 佣金测算
 * @param body
 * @returns {Promise.<TResult>|*}
 */
export function premuimMeasure(body={}) {
  return request('/api/cmn/productionCalcPremium', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 计划书资料库查询
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function queryPlanLibrary(body={}) {
  let url = "";
  if (body.page) {
    url = '/api/plan/libraryForPrd?page='+body.page+"&pagesize="+body.pagesize;
  } else {
    url = '/api/plan/libraryForPrd';
  }
  return request(url, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 产品资料查询
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function queryProductionInfo(body={}) {
  let url = "";
  if (body.page) {
    url = '/api/query/prdFile?page='+body.page+"&pagesize="+body.pagesize;
  } else {
    url = '/api/query/prdFile';
  }
  return request(url, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 产品资料下载次数
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function productionInfoDownloadTimes(body={}) {
  return request('/api/update/prdFileDownloadTimes', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 图文版块查询
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function getImageText(body={}) {
  return request('/api/production/getImageText', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 预约--预约信息提交
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function ordOrderSubmit(body={}) {
  return request('/api/ordOrder/submit', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 预约--预约信息查询
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function ordOrderQuery(body=[]){
  return request(`api/ordOrder/query`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 预约--客户信息提交
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function ordCustomerSubmit(body={}) {
  return request('/api/ordCustomer/submit', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 预约--客户信息查询
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function ordCustomerQuery(body={}) {
  return request('/api/ordCustomer/query', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 预约--家庭状况查询
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function ordBeneficiaryQuery(body={}) {
  return request('/api/ordBeneficiary/query', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 预约--教育经历查询
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function ordEducationQuery(body={}) {
  return request('/api/ordEducation/query', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 预约--技能特长查询
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function ordSkillQuery(body={}) {
  return request('/api/ordSkill/query', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}

/**
 * 预约--工作經歷查询
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function ordWorkQuery(body={}) {
  return request('/api/ordWork/query', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 预约--附件查询
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function ordFileListQuery(body={}) {
  return request('/api/ordOrderFileList/query', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 产品分享--短网址生成
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function generateShortUrl(body={}) {
  return request('/api/public/generateShortUrl', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 医疗教育-产品分类查询
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function proMidClass(body={}) {
  return request('/api/commons/lov/PRD_CLASS', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
/**
 * 产品分类设置及显示
 * @param body
 * @returns {*|Promise.<TResult>}
 */
export function productShow(body={}) {
  return request('/api/public/sysDomain/query/product', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
  }

/**
 * 赴美生子 套餐列表查询
 * @param body
 */
export function querySublineList(body={}) {
  return request('/api/production/querySublineList', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}


/**
 * 香港医疗服务 - 医疗服务项目
 * @param body
 */
export function YLquery(body={}) {
  return request('/api/subline/query', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  }).then((data) => {
    return data;
  });
}
