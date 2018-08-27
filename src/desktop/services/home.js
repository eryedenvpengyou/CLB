import request from '../utils/request';
import {directRequest} from '../utils/request';
import {HTTP_HEADERS} from '../constants';
import {stringify} from 'qs';

/**
 * 获取轮播图
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function getArticleLBT(body={}){
  return request(`/api/article/LBT`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 待办列表
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function getNotificationList(body={}){
  return request(`/api/notification/list?page=`+body.page+"&pagesize="+body.pagesize ,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 待办列表已读
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function updateNotificationList(body={}){
  return request(`/api/notification/update`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 获取工作台功能按钮
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function getWorkbenchModuleList(body={}){
  return request(`/api/workbench/module/list`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 获取可用自定义功能图标
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function getAvailableFuncs(body={}){
  return request(`/api/userCustom/getAvailableFuncs`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 获取已拥有自定义功能图标
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function getOwnFuncs(body={}){
  return request(`/api/userCustom/getOwnFuncs`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


/**
 * 提交自定功能设置
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function userFuncsSubmit(body={}){
  return request(`/api/userCustom/saveUserFunction`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 *获取主题色
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function domanManagement(body={}){
  return request(`/api/public/sysDomain/query`,{
    method:"POST",
    headers:HTTP_HEADERS,
    body:JSON.stringify(body)
  });
}
