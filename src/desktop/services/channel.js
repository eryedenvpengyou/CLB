import request from '../utils/request';
import {HTTP_HEADERS} from '../constants';
import {stringify} from 'qs';


/**
 * 渠道对账单
 *
 * @export
 * @param {any} [body={}]
 * @returns
 */

//获取对账单时间
export function fetchCheckTime(body={}) {
  return request('/api/channelcheck/queryPeriods',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//渠道对账单首页
export function fetchCheck(body={}){
  const url = `/api/fms/fet/settlement/summary/query?page=${body.page || 1}&pageSize=${body.pageSize || 20}` ;
  return request(url,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//渠道对账单详情
export function fetchCheckDetail(body={}) {
  const url = `/api/fms/fet/settlement/summary/queryFetSettlement?page=${body.page || 1}&pageSize=${body.pageSize || 20}` ;
  return request(url,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//渠道对账单 详情确认
export function checkEnsure(body={}) {
  return request('/api/channelcheck/ensure',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//渠道对账单 导出
export function checkExport(body={}) {
  return request('/api/channelcheck/export',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//渠道对账单 确认收款
export function confirmedReceive(body={}) {
  return request('/api/fms/fet/settlement/summary/confirmedReceive',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//渠道对账单 问题反馈
export function fetchFeedback(body={}) {
  return request(`/api/channelcheck/feedback/query`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//问题反馈提交
export function submitFeedback(body={}) {
  return request(`/api/channelcheck/feedback/submit`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 我的团队
 *
 * @export
 * @param {any} [body={}]
 * @returns
 */

//渠道我的团队（树形图的数据也是用这个接口）
export function fetchTeam(body={}) {
  return request(`/api/channel/team`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

// 成员类型
export function queryMemberType(body={}) {
  return request(`/api/channel/memberDropList`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//树状图
export function fetchChannelTree(body={}) {
  return request(`/api/channel/tree`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//渠道转介费率
export function fetchRate(body={}) {
  const url = `/api/cmn/queryReferralFee${(body.page) ? `?page=${body.page}&pageSize=${body.pagesize}` : ''}`;
  return request(url, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body:  JSON.stringify(body)
  });
}

//添加成员
export function createChannel(body={}) {
  return request(`/api/user/addChannelUser`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

//渠道管理
export function manager(body={}) {
  return request(`/api/channel/channelManage`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

export function fetchMyTeamData(body = {}) {
  return request('/api/channel/myTeamData', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
//成员账号管理

export function queryByUserId(body = {}) {
  return request('/api/user/queryByUserId', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

export function updateByUserId(body = {}) {
  return request('/api/user/updateByUserId', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
/**
 *
 *  渠道个人信息详情 界面 API
 *
 * @export
 * @param {any} [body={}]
 * @returns
 */

//查看个人信息
export function fetchPersonal(body={}) {
  return request('/api/channel/personal/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 更新用户是否能编辑下级渠道信息
 * @param  {Object} [body={}] [description]
 * @return {[type]}           [description]
 */
export function checkUpdateChannelInfo(body={}) {
  return request(`/api/channel/checkUpdateChannelInfo`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}


//查看 个人中心 合约(详情)
export function personalContract(body={}) {
  return request('/api/channel/personal/contract',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//查看 合约详情中的付款条件
export function contractPatment(body={}) {
  return request('/api/channel/personal/contract/payment',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}



//查看 个人中心 合约 费率
export function personalRate(body={}) {
  const url = `/api/channel/personal/contract/rate${(body.page) ? `?page=${body.page}&pageSize=${body.pagesize}` : ''}`;
  return request(url,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//查看 个人中心 利益分配
export function personalRole(body={}) {
  return request('/api/channel/personal/contract/role',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//查看 个人中心 合约附件
export function personalArchive(body={}) {
  return request('/api/channel/personal/contract/archive',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//个人中心 合约 费率 删除
export function contractRateDelete(body={}) {
  return request('/api/channel/personal/contract/rate/delete',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
//个人中心 合约 利益分配（角色）
export function contractRoleDelete(body={}) {
  return request('/api/channel/personal/contract/role/delete',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
//合约附件删除
export function contractArchiveDelete(body={}) {
  return request('/api/channel/personal/contract/archiveDelete',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


// 提交信息
export function submitDetail(body={}){
  return request(`/api/cnlChannel/submit`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

// 渠道合约信息提交
export function contractSubmit(body={}){
  return request(`/api/cnlChannel/contract/submit`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

// 合约 费率 提交
export function rateSubmit(body={}){
  return request(`/api/cnlChannel/contract/rate/submit`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}



//个人中心 设置
export function personalSetting(body={}){
  return request(`/api/user/personalSetting`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

export function fetchTeamMemberCommission(body = {}) {
  return request('/api/channel/teamMemberCommission', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//渠道分成查询
export function fetchRatio(body = {}) {
  let url = '';
  if(body.page){
    url = '/api/cmn/channel/ratio/query?page='+body.page+"&pagesize="+body.pagesize;
  }else{
    url = '/api/cmn/channel/ratio/query'
  }
  return request(url, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//获取计划书额度
export function getQuoat(body = {}) {
  return request('/api/channel/personal/queryPlanQuota', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//渠道分成提交
export function submitRatio(body = {}) {
  return request('/api/cmn/channel/ratio/submit', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//渠道分成详情查询
export function fetchRatioDetail(body = {}) {
  let url = '';
  if(body.page){
    url = '/api/cmn/channel/ratio/detail/query?page='+body.page+"&pagesize"+body.pagesize;
  }else{
    url = '/api/cmn/channel/ratio/detail/query'
  }
  return request(url, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//渠道分成详情提交
export function submitRatioDetail(body = {}) {
  return request('/api/cmn/channel/ratio/detail/submit', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//渠道分成详情删除
export function removeRatioDetail(body = {}) {
  return request('/api/cmn/channel/ratio/detail/remove', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//渠道详情 合约详情 费率 日志 查询
export function fetchRateHistory(body = {}) {
  return request('/api/channel/personal/contract/rate/history', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//渠道详情 合约详情 费率 日志 提交
export function submitRateHistory(body = {}) {
  return request('/api/channel/personal/contract/rate/his/submit', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
/*我的团队 -创建成员账号自定义佣金分成重复校验*/
export function validateChannelRate(body = {}) {
  return request('/api/channel/rate/validateChannelRate', {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
