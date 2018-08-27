import dva from 'dva';
import * as service from '../services/customer';

/**
 *
 */
export default {
  namespace: 'customer',
  state: {
    customers:{},       //客户管理
    customer:{},        //客户详情
    breadDetail: [],    //详情面包屑
  },

  subscriptions: {
    setup ({ dispatch }) {},
  },

  effects: {
    *fetchCustomer({ payload:{params}},{ call, put }) {
      const data = yield call(service.fetchCustomer, {params});
      for(let i in data.rows){
        data.rows[i].key = data.rows[i].customerId;
      }
      yield put({
        type: 'customerSave',
         payload: {
           customers: data
         }
      });
    },
    *fetchCustomerDetail({ payload:{params}},{ call, put }) {
      const {rows} = yield call(service.fetchCustomerDetail, {params});
      yield put({
        type: 'customerDetailSave',
         payload: {
           customer: rows[0] || {}
         }
      });
    },
  },


  reducers: {
    customerSave (state,{payload:{customers}}) {
      return {
        ...state,
        customers,
      }
    },
    customerDetailSave (state,{payload:{customer}}) {
      return {
        ...state,
        customer,
      }
    },
  },
  breadDetailSave(state,{payload:{breadDetail}}) {
    return {...state,breadDetail}
  },
};
