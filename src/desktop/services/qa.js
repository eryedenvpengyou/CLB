import request from '../utils/request';
import {HTTP_HEADERS} from '../constants';
import {stringify} from 'qs';


// 查看指引
export function fetchGuide(body={}) {
  return request(`/api/qa/guideList?page=${body.page || 1}&pageSize=${body.pageSize || 999}`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


// 查看指引对应的文件
export function fetchGuideFile(body={}) {
  return request(`/api/qa/guideFile?page=${body.page || 1}&pageSize=${body.pageSize || 999}`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

// 查看问题列表
export function fetchQuestion(body={}) {
  return request(`/api/qa/question`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


//查看问题咨询列表
export function fetchConsult(body={}) {
  const url = `/api/qa/consult/query?page=${body.page || 1}&pageSize=${body.pageSize || 10}`;
  return request(url,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//查看聊天记录
export function fetchConLine(body={}) {
  return request(`/api/qa/conLine/query`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


/**
 * 提交 consult
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function consultSubmit(body={}){
  return request(`/api/qa/consult/submit`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 提交 feedback
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function feedbackSubmit(body={}){
  return request(`/api/qa/feedback/submit`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


/**
 * 提交一条聊天记录
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function conLineSubmit(body={}){
  return request(`/api/qa/conLine/Submit`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//查看个人信息
export function fetchPersonal(body={}) {
  return request('/api/channel/personal/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
