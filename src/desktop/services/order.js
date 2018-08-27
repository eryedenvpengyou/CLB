import request from '../utils/request';
import {stringify} from 'qs';
import {HTTP_HEADERS} from '../constants';


const headers={
  'Content-Type': 'application/json;utf-8',
};



/**
 * 我的Pengding
 * @param body
 * @returns {Object}
 */
export function fetchOrderPengding(body={}) {
  if(!body.params){
    body.params = {};
  }
  return request(`/api/ordPending/query`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.params)
  });
}

/**
 * 我的Pending
 * @param body
 * @returns {Object}
 */
export function fetchOrderPendingService(body={}) {
  return request(`api/ordPending/queryPersonal?page=${body.page || 1}&pageSize=${body.pageSize || 20}`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 我的Pending
 * @param body
 * @returns {Object}
 */
export function fetchOrderPendingServiceTotal(body={}) {
  return request(`/api/ordPending/queryOrdPendingTotle`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 我的Pengding团队数据
 * @param body
 * @returns {Object}
 */
export function fetchOrderPendingTeam(body={}) {
  if(!body.paramsTeam){
    body.paramsTeam = {};
  }
  return request(`api/ordPending/queryTeam?page=${body.page || 1}&pageSize=${body.pageSize || 20}`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.paramsTeam)
  });
}

/**
 * 我的Pending团队数据
 * @param body
 * @returns {Object}
 */
export function fetchOrderPendingTeamService(body={}) {
  return request(`api/ordPending/queryTeam`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 订单列表查询
 * @param body
 * @returns {Object}
 */
export function fetchOrderList(body={}) {
  let url = '';
  if(body.params && body.params.page){
    url = '/api/ordOrder/query?page='+body.params.page+"&pageSize="+body.params.pageSize;
  }else{
    url = '/api/ordOrder/query';
  }
  return request(url,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.params),
  });
}

/**
 * 订单个人列表查询
 * @param body
 * @returns {Object}
 */
export function fetchOrderPersonListService(body={}) {
  return request(`/api/ordOrder/queryPersonal?page=${body.page || 1}&pageSize=${body.pageSize || 10}`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 订单团队列表查询
 * @param body
 * @returns {Object}
 */
export function fetchOrderReferralListService(body={}) {
  return request(`/api/ordOrder/queryReferral?page=${body.page || 1}&pageSize=${body.pageSize || 20}`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 订单团队列表查询
 * @param body
 * @returns {Object}
 */
export function fetchOrderTeamList(body={}) {
  let url = '';
  if(body.params && body.params.page){
    url = '/api/ordOrder/queryTeam?page='+body.params.page+"&pageSize="+body.params.pageSize;
  }else{
    url = '/api/ordOrder/queryTeam';
  }
  return request(url,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.params),
  });
}


/**
 * 订单团队列表查询
 * @param body
 * @returns {Object}
 */
export function fetchOrderTeamListService(body={}) {
  return request(`/api/ordOrder/queryTeam?page=${body.page || 1}&pageSize=${body.pageSize || 20}`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 订单详情查询
 * @param body
 * @returns {Object}
 */
export function fetchOrderDetail(body={}) {
  return request('/api/ordOrder/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 订单详情查询-附加险信息
 * @param body
 * @returns {Object}
 */
export function fetchOrderDetailAddtionalList(body={}) {
  return request('/api/ordAddition/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


/**
 * 订单详情查询-售后信息 /api/ordAfter/query
 * @param body
 * @returns {Object}
 */
export function fetchOrderDetailCusServiceList(body={}) {
  let url = "";
  if (body.page) {
    url = '/api/ordAfter/queryOrdAfterList?page='+body.page+"&pageSize="+body.pageSize;
  } else {
    url = '/api/ordAfter/queryOrdAfterList';
  }
  return request(url,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


/**
 * 售后 需复查条数
 * @param body
 */
export function fetchOrderDetailCusServiceListTotal(body={}) {
  return request('/api/ordAfter/queryOrdAfterListTotal',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 订单详情查询-pending照会信息
 * @param body
 * @returns {Object}
 */
export function fetchOrderDetailPendingList(body={}) {
  return request('/api/ordPending/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


/**
 * 订单详情查询-续保信息查询
 * @param body
 * @returns {Object}
 */
export function fetchOrderDetailRenewalList(body={}) {
  return request('/api/ordOrderRenewal/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}



/**
 * 订单详情查询-佣金查询
 * @param body
 * @returns {Object}
 */
export function fetchOrderDetailordCommissionList(body={}) {
  return request('/api/ordCommission/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 订单详情查询-付款计划
 * @param body
 * @returns {Object}
 */
export function fetchOrderDetailordPlanList(body={}) {
  return request('/api/ordPaymentPlanList/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 订单详情查询-付款计划确认付款
 * @param body
 * @returns {Object}
 */
export function fetchOrderDetailordPlanSubmit(body={}) {
  return request('/api/ordPaymentPlan/submit',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 订单详情查询-状态历史记录
 * @param body
 * @returns {Object}
 */
export function fetchOrderDetailordStatusHisList(body={}) {
  return request('/api/ordStatusHis/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


/**
 * 订单列表-修改订单状态
 * @param body
 * @returns {Object}
 */
export function updateOrderStatus(body={}) {
  return request('/api/ordOrder/updateStatus',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}



export function fetchOrderIntroduce(body={}) {
  if(!body.paramOrderIntroduce ){
    body.paramOrderIntroduce  = {};
  }
  return request(`/api/ordOrder/query`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.paramOrderIntroduce )
  });
}

export function fetchOrderIntroduceService(body={}) {
  return request(`/api/ordOrder/query?page=${body.page || 1}&pageSize=${body.pageSize || 20}`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

export function fetchOrderTeam(body={}) {
  if(!body.paramOrderTeam ){
    body.paramOrderTeam  = {};
  }
  return request(`api/ordOrder/queryTeam`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.paramOrderTeam )
  });
}

export function fetchOrderTeamService(body={}) {
  return request(`api/ordOrder/queryTeam?page=${body.page || 1}&pageSize=${body.pageSize || 20}`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

export function fetchOrdStatusHis(body={}) {
  if(!body.paramOrdStatusHis ){
    body.paramOrdStatusHis  = {};
  }
  return request(`/api/ordStatusHis/query`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.paramOrdStatusHis)
  });
}

export function fetchOrderCommissionTable(body={}) {
  if(!body.paramOrdCommission ){
    body.paramOrdCommission  = {};
  }
  return request(`/api/ordCommission/query`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.paramOrdCommission)
  });
}

export function fetchOrderPerson(body={}) {
  if(!body.paramOrderPerson ){
    body.paramOrderPerson  = {};
  }
  return request(`/api/ordOrder/query`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.paramOrderPerson )
  });
}

export function fetchOrderPersonService(body={}) {
  return request(`/api/ordOrder/query?page=${body.page || 1}&pageSize=${body.pageSize || 20}`, {
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * Pengding详情
 * @param body
 * @returns {Object}
 */
export function fetchOrderTrails(body={}) {
  if(!body.params){
    body.params = {};
  }
  return request('/api/ordPendingFollow/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body:JSON.stringify(body.params)
  }).then((data) => {
    return data;
  });
}
/**
 * Pengding详情Form
 * @param body
 * @returns {Object}
 */
export function fetchOrderTrailForm(body={}) {
  if(!body.params){
    body.params = {};
  }
  return request('/api/ordPending/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body:JSON.stringify(body.params)
  }).then((data) => {
    return data;
  });
}
/**
 * Pengding详情Form
 * @param body
 * @returns {Object}
 */
export function fetchOrderTrailFormService(body={}) {
  return request('/api/ordPending/query',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body:JSON.stringify(body)
  });
}
/**
 * Pending详情提交
 */
export function submitOrderTrail(body={}){
    let params = [];
    params.push(body);
    return request(`api/ordPendingFollow/submit`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(params)
  });
}

/**
 * Pending详情文件验证下载
 */
export function orderTrailDownFile(body={}) {
  if(!body.params){
    body.params = {};
  }
  return request('/api/ordAfterFollow/filePath',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body:JSON.stringify(body.params)
  }).then((data) => {
    return data;
  });
}

/**
 * 续保清单列表 个人
 * @param body
 * @returns {Object}
 */
export function fetchRenewalPerson(body={}) {
  if(!body.params){
    body.params = {};
  }
  return request(`/api/ordRenewal/queryOrdRenewalList`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.params)
  });
}

/**
 * 续保清单列表 个人
 * @param body
 * @returns {Object}
 */
export function fetchRenewalPersonService(body={}) {
  return request(`/api/ordRenewal/queryOrdRenewalList?page=${body.page || 1}&pageSize=${body.pageSize || 20}`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 售后项目接口
 * @param body
 * @returns {Object}
 */
export function queryOrdAfterProject(body={}) {
  return request(`/api/ordRenewal/queryOrdAfterProject`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 售后类型接口
 * @param body
 * @returns {Object}
 */
export function queryOrdAfterType(body={}) {
  return request(`/api/ordRenewal/queryOrdAfterTypeAndTemplateId`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}


/**
 * 续保清单列表 团队
 * @param body
 * @returns {Object}
 */
export function fetchRenewalTeam(body={}) {
  if(!body.params){
    body.params = {};
  }
  return request(`/api/ordRenewal/queryOrdRenewalTeamList`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.params)
  });
}

/**
 * 续保清单列表 团队
 * @param body
 * @returns {Object}
 */
export function fetchRenewalTeamService(body={}) {
  return request(`/api/ordRenewal/queryOrdRenewalTeamList?page=${body.page || 1}&pageSize=${body.pageSize || 20}`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 续保清单列表--跟进--续保信息表格
 * @param body
 * @returns {Object}
 */
export function fetchRenewalFollowTable(body={}) {
  if(!body.paramsRenewalFollowTable){
    body.paramsRenewalFollowTable = {};
  }
  //return request(`/api/ordRenewal/queryRenewalByOrderId`,{
  return request(`/api/ordRenewal/queryRenewalGridAllByOrderId`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.paramsRenewalFollowTable)
  });
}

/**
 * 续保清单列表--跟进--续保信息表格
 * @param body
 * @returns {Object}
 */
export function fetchRFoTable(body={}) {
  return request(`/api/ordRenewal/queryRenewalGridAllByOrderId`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 续保清单跟进
 * @param body
 * @returns {Object}
 */
export function fetchRenewalFollowByOrderId(body={}) {
  if(!body.params){
    body.params = {};
  }
  return request(`/api/ordAfter/queryOrdAfterListFollow`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.params)
  });
}


/**
 * 续保清单跟进 （续保信息）
 * @param body
 * @returns {Object}
 */
export function queryRenewalInfoByOrderIdService(body={}) {
  return request(`/api/ordAfter/queryRenewalInfoByOrderId`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}



/**
 * 续保详情表格
 * @param body
 * @returns {Object}
 */
export function fetchRenewalDetailTable(body={}) {
  if(!body.paramsDetail){
    body.paramsDetail = {};
  }
  return request(`/api/ordRenewal/queryRenewalByOrderId`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.paramsDetail)
  });
}

/**
 * 跟进续保信息
 * @param body
 * @returns {Object}
 */
export function fetchFollowRenewalDetail(body={}) {
  if(!body.params){
    body.params = {};
  }
  return request(`/api/ordAfter/queryOrdInfoByOrderId`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.params)
  });
}
/**
 * 跟进续保信息
 * @param body
 * @returns {Object}
 */
export function fetchFollowRenewalDetailService(body={}) {
  return request(`/api/ordAfter/queryOrdInfoByOrderId`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 售后查看日志
 * @param body
 * @returns {Object}
 */
export function fetchAfterLogService(body={}) {
  return request(`/api/ordRenewal/queryAfterLog`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 售后跟进表格
 * @param body
 * @returns {Object}
 */
export function fetchRenewalFollow(body={}) {
  if(!body.paramsRF){
    body.paramsRF = {};
  }
  return request(`/api/ordAfter/queryAfterFollow`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.paramsRF)
  });
}

/**
 * 售后跟进表格
 * @param body
 * @returns {Object}
 */
export function fetchRenewalFollowService(body={}) {
  return request(`/api/ordAfter/queryAfterFollow?page=${body.page || 1}&pageSize=${body.pageSize || 20}`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}


/**
 * 新建续保申请lov带出的数据
 * @param body
 * @returns {Object}
 */
export function fetchNewRenewalLov(body={}) {
  return request(`/api/ordOrder/queryOrdOrderByOrderId`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}


/**
 * 获取快码
 * @param body
 * @returns {Object}
 */
export function fetchCode(body={}) {
  return request(`api/clb/common/clbCode`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.paramsCode),
  });
}

/**
 * 售后列表的数据 个人
 * @param body
 * @returns {Object}
 */
export function fetchAfter(body={}) {
  if(!body.params){
      body.params = {};
    }
  return request(`/api/ordAfter/queryOrdAfterList`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.params),
  });
}

/**
 * 售后列表的数据 个人
 * @param body
 * @returns {Object}
 */
export function fetchAfterService(body={}) {
  return request(`/api/ordAfter/queryOrdAfterList?page=${body.page || 1}&pageSize=${body.pageSize || 20}`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 售后列表的数据 团队
 * @param body
 * @returns {Object}
 */
export function queryOrdAfterTeamService(body={}) {
  return request(`/api/ordAfter/queryOrdAfterTeamList?page=${body.page || 1}&pageSize=${body.pageSize || 20}`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

/**
 * 售后列表的数据 团队
 * @param body
 * @returns {Object}
 */
export function queryOrdAfterTeamList(body={}) {
  if(!body.params){
    body.params = {};
  }
  return request(`/api/ordAfter/queryOrdAfterTeamList`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.params),
  });
}

/**
 * 售后跟进（售后列表）保单信息
 * @param body
 * @returns {Object}
 */
export function fetchAfterByAfterId(body={}) {
  if(!body.params){
    body.params = {};
  }
  return request(`/api/ordAfter/queryOrderInfoByAfterId`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.params),
  });
}

/**
 * 售后列表取消
 */
export function fetchCancelAfter(body={}){
  if(!body.params){
    body.params = {};
  }
  return request(`/api/ordAfter/cancel`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body.params)
  });
}

/**
 * 售后列表取消
 */
export function fetchCancelAfterService(body={}){
  return request(`/api/ordAfter/cancel`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 订单取消预约
 */
export function fetchCancelOrder(body={}){
  return request(`/api/cancel/reservation`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 售后跟进记录删除
 */
export function fetchFollowDelete(body={}){
  return request(`/api/ordAfter/deleteAfterFollow`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 续保产品列表
 * @param body
 * @returns {Object}
 */
export function fetchRenewalProduct(body={}) {
  if(!body.params){
    body.params = {};
  }
  return request(`/api/ordAfter/queryRenewalGridByOrderId`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.params),
  });
}
/**
 * 续保产品列表
 * @param body
 * @returns {Object}
 */
export function fetchRPService(body={}) {
  return request(`/api/ordAfter/queryRenewalGridByOrderId`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
/**
 * 续保产品列表根据orderId
 * @param body
 * @returns {Object}
 */
export function fetchRenewalProductByOrderId(body={}) {
  if(!body.params){
    body.params = {};
  }
  return request(`/api/ordRenewal/queryRenewalByOrderId`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body.params)
  });
}
/**
 * 续保产品列表根据orderId
 * @param body
 * @returns {Object}
 */
export function fetchRPByOId(body={}) {
  return request(`/api/ordAfter/queryRenewalInfoByOrderId`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}
/**
 * 售后跟进 提交
 */
export function submitAfterFollow(body={}){

  return request(`/api/ordAfter/ordAfterSubmit`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 售后列表——新建售后——提交
 */
export function submitAfterNew(body={}){
  return request(`/api/ordRenewal/ordAfterApplication`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}


/**
 * 售后跟进退保表格
 */
export function fetchAfterFollowExit(body={}){
  if(!body.params){
    body.params = {};
  }
  return request(`/api/ordOrder/queryOrdOrderItems`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body.params)
  });
}

/**
 * 售后跟进退保表格
 */
export function fetchAFExit(body={}){
  return request(`/api/ordOrder/queryOrdOrderItems`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 售后跟进退保表格ByOrderId
 */
export function fetchAfterFollowExitByOrderId(body={}){
  return request(`/api/ordAfter/queryAfterFollowExit`,{
    method: 'POST',
    headers:HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}


//查询交易路线
export function fetchCommission(body={}) {
  return request(`/api/cmn/chooseCommission`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


//提交 订单基本信息
export function submitOrder(body=[]) {
  return request('/api/ordOrder/submit',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//提交 订单客户信息
export function submitOrdCustomer(body=[]) {
  return request('/api/ordCustomer/submit',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


//提交 订单增值服务信息
export function submitOrderService(body=[]) {
  return request(' api/ordOrder/submit',{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}



//选择产品-选择保险公司
export function fetchCompany(body={}) {
  return request(`/api/supplier/queryAll`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
//选择产品-选择保险公司下的产品
export function fetchProduct(body={}) {
  return request(`/api/production/headerlist?page=${body.page || 1}&pageSize=${body.pageSize || 20}`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//选择产品-选择自付选项
export function fetchSefPay(body={}) {
  return request(`/api/plan/item/selfpay`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}



//选择产品-选择保险公司
export function fetchSupplier(body={}) {
  return request(`/api/supplier/queryByChannel`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//选择产品-选择保险公司下渠道下 的产品
export function fetchChannelProduct(body={}) {
  return request(`/api/production/queryByChannel`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//选择年期（子产品）
export function fetchChannelSubline(body={}) {
  return request(`/api/subline/queryByChannel`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


//查询交易路线
export function fetchTradeRoute(body={}) {
  return request(`/api/ordOrder/validateTradeRoute`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}





/**
 * 保险重构
 */

 //查看订单信息接口  主数据
 export function getOrder(body={}) {
  return request(`api/ordOrder/query`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

 //查看订单附加险数据
 export function getOrdAddition(body={}) {
  return request(`api/ordAddition/query`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

 //查看订单受益人数据
 export function getOrdBeneficiary(body={}) {
  return request(`api/ordBeneficiary/query`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

 //查看订单客户数据
 export function getOrdCustomer(body={}) {
  return request(`api/ordCustomer/query`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

 //查看订单 附件数据
 export function getOrdFile(body={}) {
  return request(`api/ordOrderFileList/query`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

 //查看订单增值服务数据
 export function getOrdService(body={}) {
  return request(`api/ordOrder/query`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

 //查看产品数据
 export function getProduction(body={}) {
  return request(`api/production/list?page=${body.page || 1}&pageSize=${body.pageSize || 20}`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

 //是否工作日查询
//  export function isWeekday(body={}) {
//   return request(`api/supplier/isWeekday`,{
//     method: 'POST',
//     headers: HTTP_HEADERS,
//     body: JSON.stringify(body),
//   });
// }

//交易路线修改时
export function validateUpdateOrder(body={}) {
  return request(`api/cmn/validateUpdateOrder`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}


//删除附加险
export function additionRemove(body={}) {
  return request(`api/ordAddition/remove`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//删除受益人
export function beneficiaryRemove(body={}) {
  return request(`api/ordBeneficiary/remove`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

//删除附件
export function fileRemove(body={}) {
  return request(`api/ordFile/remove`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
//团队列表里面的订单，调用该接口是返回true以及订单在冷静期前才可以修改订单佣金；
export function checkUpdateOrdCommission(body={}) {
  return request(`api/order/checkUpdateOrdCommission`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
//订单佣金修改
export function ordCommissionSubmit(body={}) {
  return request(`api/ordCommission/submit`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}
//身份证是否重复
export function identityNumberSubmit(body={}) {
  return request(`/api/ctmCustomer/isRepetitionOfIdentityNumber`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body),
  });
}

// 获取续保需知内容
export function getRenewalNotice() {
  return request(`/api/public/article/queryRenewalNotice`,{
    method: 'POST',
    headers: HTTP_HEADERS,
  });
}
