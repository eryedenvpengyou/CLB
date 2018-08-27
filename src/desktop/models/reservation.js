import dva from 'dva';
import * as service from '../services/reservation';

/**
 *
 */
export default {
  namespace: 'reservation',
  state: {
    supports:{},          //【业务支援】主界面数据

  },

  subscriptions: {
    setup ({ dispatch }) {
      // dispatch({ type: 'fetchCourse',payload:{params}});
    },
  },

  effects: {

    *fetchSupport({ payload:{params}},{ call, put }) {
      const data = yield call(service.fetchSupport, {params});
      for(let i in data.rows){
        data.rows[i].key = data.rows[i].supportId;
      }
      yield put({
        type: 'supportSave',
        payload: {
          supports: data
        }
      });
    },

  },


  reducers: {
    supportSave(state, { payload: { supports} } ) {
      return { ...state, supports};
    },
  },

};
