/**
 *
 * created by xiaoyong.luo@hand-china.com at 2017/7/21 00:48
 *
 * 比较通用的 接口，不属于某个模块
 */

import request from '../utils/request';
import {directRequest} from '../utils/request';
import {HTTP_HEADERS} from '../constants';
import {stringify} from 'qs';


 /**
 * 删除文件， 个人中心下的文件修改，其实主要删除的是渠道的附件表
 * @param body
 * @returns {Object}
 */
export function removeChannelFile(body={}) {
  return request(`api/channel/personal/archiveDelete`,{
   method: 'POST',
   headers: HTTP_HEADERS,
   body: JSON.stringify(body),
  });
 }