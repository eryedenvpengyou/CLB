import dva from 'dva';
import * as service from '../services/secureOrder';


export default {
  namespace: 'secureOrder',
  state: {
    insurantCustomer:{},        //受保人
    appliacntCustomer:{},       //投保人
  },

  subscriptions: {
    setup ({ dispatch }) {

    },
  },


  effects: {
    *fetchOrderCustomer({ payload:{params}},{ call, put }) {
      params.orderId= 1;
      params.customerType = 'INSURANT';
      const {rows} = yield call(service.fetchOrderCustomer, params);
      yield put({type: 'appliacntSave', payload: {appliacntCustomer: rows[0] || {} } });


      params.customerType = 'APPLICANT';
      const data = yield call(service.fetchOrderCustomer, params);
      let row = data.rows[0] || {}, newLow = {};
      for(let field in row){
        const newField = field +'2';
        newLow[newField] = row[field];
      }
      yield put({type: 'insurantSave', payload: {insurantCustomer: newLow || {} } });

    },
  },


  reducers: {
    //保存 受报人
    insurantSave (state,{payload:{insurantCustomer}}) {
      return {...state, insurantCustomer}
    },

    //保存 投保人
    appliacntSave (state,{payload:{appliacntCustomer}}) {
      return {...state, appliacntCustomer}
    },
  },

};
