import dva from 'dva';
import * as service from '../services/functional';

/**
 *
 */
export default {
  namespace: 'functional',
  state: {
    orderPayList:[],          //支付订单

  },

  subscriptions: {
    setup ({ dispatch }) {
      // dispatch({ type: 'fetchCourse',payload:{params}});
    },
  },

  effects: {

    *fetchPay({ payload:{params}},{ call, put }) {
      const {rows} = yield call(service.fetchPay, {params});
      yield put({
        type: 'paySave',
        payload: {
          orderPayList: rows
        }
      });
    },

  },


  reducers: {
    paySave(state, { payload: { orderPayList} } ) {
      return { ...state, orderPayList};
    },
  },

};
