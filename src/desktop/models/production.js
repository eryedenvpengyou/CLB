/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import * as service from '../services/production';

export default {
  namespace: 'production',
  state: {
    prospectus:{
      insuranceFlag:'N',
      drawFlag:'N',
      medicalFlag:'N',
    },
    productCompareInfo: {
      age: null,
      gender: null,
      productionAgeLimit: null,
      paymentMethod: null,
      coverage: null,
      currency: null,
      smokeFlag: null,
      itemIdList: [],
    },
    codeList:{},
  },
  subscriptions: {
    setup({ dispatch }) {},
  },
  effects: {
    *changeFlag({ payload:{insuranceFlag,drawFlag,medicalFlag}},{ call, put }) {
      yield put({ type: 'saveFlag' ,payload:{insuranceFlag,drawFlag,medicalFlag}})
    },
    *_productionList({ payload: {body} }, { call, put }) {
      const data = yield call(service.productionList, body);
      yield put({
        type: 'saveList',
        payload: {
          productList: JSON.parse(data)
        },
      });
    },
    *getProductCompareInfo({ payload: {compareInfo} }, { call, put }) {
      yield put({
        type: 'compareInfo',
        payload: {
          productCompareInfo: compareInfo
        },
      });
      location.hash = '/production/compare';
    },
    *fetchCode({ payload:{}},{ call, put }){
      let data = yield call(service.fetchCode);
      data =  JSON.parse(data);
      yield put({
        type: 'codeSave',
        payload: {
          codeList: data
        }
      });
    }

  },
  reducers: {
    saveFlag(state,{payload:{insuranceFlag,drawFlag,medicalFlag}}) {
      return {
        ...state,
        insuranceFlag,
        drawFlag,
        medicalFlag,
      }
    },
    saveList(state, { payload: { productList } }) {
      return { ...state, productList };
    },
    compareInfo(state, { payload: { productCompareInfo } }) {
      return { ...state, productCompareInfo };
    },
    codeSave(state, { payload: { codeList} } ){
      return { ...state, codeList};
    },
  }
};
