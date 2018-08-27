import request from '../utils/request';
import {stringify} from 'qs';
import {HTTP_HEADERS} from '../constants';


const headers={
  'Content-Type': 'application/json;utf-8',
};

/**
 * 应收预测
 * @param body
 * @returns {Object}
 */
export function queryReceiveForecast(body={}) {
    const url = `/api/fms/fet/forecast/queryReceiveForecast?page=${body.page || 1}&pageSize=${body.pageSize || 10}`     
    return request(url,{
      method: 'POST',
      headers: HTTP_HEADERS,
      body: JSON.stringify(body)
    });
  }

/**
 * 应付预测
 * @param body
 * @returns {Object}
 */
export function queryPaymentForecast(body={}) {
    const url = `/api/fms/fet/forecast/queryPaymentForecast?page=${body.page || 1}&pageSize=${body.pageSize || 10}`   
    return request(url,{
      method: 'POST',
      headers: HTTP_HEADERS,
      body: JSON.stringify(body)
    });
  }  

  /**
 * 付款对账单
 * @param body
 * @returns {Object}
 */
export function summaryQuery(body={}) {
    const url = `/api/fms/fet/settlement/summary/payquery?page=${body.page || 1}&pageSize=${body.pageSize || 10}`
    return request(url,{
      method: 'POST',
      headers: HTTP_HEADERS,
      body: JSON.stringify(body)
    });
  } 

/**
 * 新建付款对账单查询
 * @param body
 * @returns {Object}
 */
export function selectUnselected(body={}) {
    return request(`/api/fms/fet/settlement/summary/selectUnselected`,{
      method: 'POST',
      headers: HTTP_HEADERS,
      body: JSON.stringify(body)
    });
  } 
  
 /**
 * 更改结算币种
 * @param body
 * @returns {Object}
 */
export function changeCurrency(body={}) {
  return request(`/api/fms/fet/settlement/summary/changeCurrency`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}
  
 /**
 * 创建付款结算单
 * @param body
 * @returns {Object}
 */
export function createSettlement(body={}) {
  return request(`/api/fms/fet/settlement/summary/createSettlement`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

 /**
 * 编辑付款结算单
 * @param body
 * @returns {Object}
 */
export function queryDetail(body={}) {
  return request(`/api/fms/fet/settlement/summary/queryDetail`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

 /**
 * 付款结算单详情
 * @param body
 * @returns {Object}
 */
export function queryFetSettlement(body={}) {
  return request(`/api/fms/fet/settlement/summary/queryFetSettlement`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

 /**
 * 付款结算单详情-保存
 * @param body
 * @returns {Object}
 */
export function submit(body={}) {
  return request(`/api/fms/fet/settlement/submit`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

 /**
 * 付款结算单详情-删除
 * @param body
 * @returns {Object}
 */
export function remove(body={}) {
  return request(`/api/fms/fet/settlement/remove`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

 /**
 * 付款结算单详情-付款确认
 * @param body
 * @returns {Object}
 */
export function confirmed(body={}) {
  return request(`/api/fms/fet/settlement/summary/confirmed`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

 /**
 * 付款结算单详情-审核完成
 * @param body
 * @returns {Object}
 */
export function changeStatus(body={}) {
  return request(`/api/fms/fet/settlement/summary/changeStatus`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

 /**
 * 付款结算单详情-取消
 * @param body
 * @returns {Object}
 */
export function cancel(body={}) {
  return request(`/api/fms/fet/settlement/summary/cancel`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 结算管理-本月应收未收应付未付
 * @param body
 * @returns {Object}
 */
export function queryMonthAmount(body={}) {
  return request(`/api/fms/fet/settlement/summary/queryMonthAmount`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 结算管理-订单结算明细
 * @param body
 * @returns {Object}
 */
export function settleOrderDetail(body={}) {
  return request(`/api/fms/fet/settlement/summary/settleOrderDetail`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 结算管理-待处理对账单
 * @param body
 * @returns {Object}
 */
export function pendingQuery(body={}) {
  return request(`/api/fms/fet/settlement/summary/pendingQuery`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 结算管理-我的实收列表
 * @param body
 * @returns {Object}
 */
export function receipt(body={}) {
  const url = `/api/fet/actual/summary/receipt/query?page=${body.page|| 1}&pageSize=${body.pageSize || 10}`
  return request(url,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
} 

/**
 * 结算管理-我的实收列表删除
 * @param body
 * @returns {Object}
 */
export function delActual(body={}) {
  return request(`/api/fet/actual/summary/delActual`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 结算管理-新建结算类型查询
 * @param body
 * @returns {Object}
 */
export function settleType(body={}) {
  return request(`/api/fet/actual/summary/settleType`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 结算管理-新建订单金额费率查询
 * @param body
 * @returns {Object}
 */
export function selectOrderAmount(body={}) {
  return request(`/api/fet/actual/summary/selectOrderAmount`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 结算管理-新建实收金额查询
 * @param body
 * @returns {Object}
 */
export function selectOrder(body={}) {
  return request(`/api/fet/actual/summary/selectOrder`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}


/**
 * 结算管理-我的实收新建
 * @param body
 * @returns {Object}
 */
export function receiptSubmit(body={}) {
  return request(`/api/fet/actual/summary/receipt/submit`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 结算管理-我的实收列表详情
 * @param body
 * @returns {Object}
 */
export function receiptDetail(body={}) {
  const url = `/api/fet/actual/summary/receipt/detail?page=${body.page|| 1}&pageSize=${body.pageSize || 10}`
  return request(url,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
} 


/**
 *  结算管理-我的实收列表详情删除
 * @param body
 * @returns {Object}
 */
export function detailDelActual(body={}) {
  return request(`/api/fet/actual/summary/detail/delActual`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 *  结算管理-我的实收列表详情新建编辑
 * @param body
 * @returns {Object}
 */
export function detailSubActual(body={}) {
  return request(`/api/fet/actual/summary/detail/submit`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 结算管理-我的实付
 * @param body
 * @returns {Object}
 */
export function payment(body={}) {
  const url = `/api/fet/actual/summary/payment/query?page=${body.page|| 1}&pageSize=${body.pageSize || 10}`
  return request(url,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
} 

/**
 * 结算管理-我的实付新建
 * @param body
 * @returns {Object}
 */
export function paymentSubmit(body={}) {
  return request(`/api/fet/actual/summary/payment/submit`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 结算管理-我的实付列表详情
 * @param body
 * @returns {Object}
 */
export function paymentDetail(body={}) {
  const url = `/api/fet/actual/summary/payment/detail?page=${body.page|| 1}&pageSize=${body.pageSize || 10}`
  return request(url,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
} 

/**
 * 结算管理-最近一笔实派
 * @param body
 * @returns {Object}
 */
export function realSent(body={}) {
  return request(`/api/fet/actual/summary/payment/realSent`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 导入
 * @param body
 * @returns {Object}
 */
export function loadExcel(body={}) {
  return request(`/api/fet/actual/summary/loadExcel`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 结算管理-我的实付实收新建
 * @param body
 * @returns {Object}
 */
export function listSubmit(body={}) {
  return request(`/api/fet/actual/summary/submit`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}

/**
 * 结算管理-我的实付实收新建查询付款方
 * @param body
 * @returns {Object}
 */
export function queryPersonList(body={}) {
  return request(`/api/fet/actual/summary/queryPersonList`,{
    method: 'POST',
    headers: HTTP_HEADERS,
    body: JSON.stringify(body)
  });
}