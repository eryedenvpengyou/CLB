import dva from 'dva';
import * as service from '../services/maxim';
import {stringify} from 'qs';

/**
 *
 */
export default {
  namespace: 'maxim',
  state: {
    maximPersonList : [],
    maximTeamList : [],
    maximDetailList : [],
  },

  subscriptions: {
    setup ({ dispatch }) {
    },
  },

  effects: {
    *fetchMaximPersonQuery({ payload:{params}},{ call, put }) {
      const {rows} = yield call(service.fetchMaximPersonQuery, params);
      yield put({
        type: 'maximPerson',
        payload: {
          maximPersonList: rows
        }
      });
    },

    *fetchMaximTeamQuery({ payload:{params}},{ call, put }) {
      const {rows} = yield call(service.fetchMaximTeamQuery, params);
      yield put({
        type: 'maximTeam',
        payload: {
          maximTeamList: rows
        }
      });
    },

    *queryWsMxOrderDetail({ payload:{params}},{ call, put }) {
      const {rows} = yield call(service.queryWsMxOrderDetail, params);
      yield put({
        type: 'maximDetail',
        payload: {
          maximDetailList: rows
        }
      });
    },

  },


  reducers: {
    maximPerson(state,{payload:{maximPersonList}}) {
      return { ...state, maximPersonList }
    },

    maximTeam(state,{payload:{maximTeamList}}) {
      return { ...state, maximTeamList }
    },

    maximDetail(state,{payload:{maximDetailList}}) {
      return { ...state, maximDetailList }
    },
  },
};
