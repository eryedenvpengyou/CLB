import dva from 'dva';
import pcCascade from '../utils/common';
import * as service from '../services/channel';

/**
 *
 */
export default {
  namespace: 'channel',
  state: {
    check:{},                //单个对象
    feedbacks: [],           //问题反馈

    teamList:[],                  //【我的团队】主界面
    recordManage: {},             //管理模态框里填充的数据
    manageModal:false,            //是否显示渠道对付单的模态框
    protocolModal:false,          //是否显示渠道对付单的模态框
    addModal: false,              //添加成员模态框

    rateList:[],                  //转介费率
  },

  subscriptions: {
    setup ({ dispatch }) {},
  },

  effects: {

    *fetchTeam({ payload:{params}},{ call, put }) {
      const {rows} = yield call(service.fetchTeam, params);
      yield put({
        type: 'teamSave',
        payload: {
          teamList: rows
        }
      });
    },



    *fetchRate({ payload:{params}},{ call, put }) {
      const data = yield call(service.fetchRate, {params});
      yield put({
        type: 'rateSave',
        payload: {
          rateList: data,
        },
      });
    },

    *submit({ payload:{body}},{ call, put }){
      let data = yield call(service.submit,{body});
    },

    *updateUserStatus({ payload:{userId}},{ call, put }) {
      yield call(service.updateUserStatus, {userId});
    },
  },


  reducers: {
    teamSave(state, { payload: { teamList} } ) {
      return { ...state, teamList};
    },
    manageModalSave(state, { payload: { manageModal,recordManage} } ) {
      return { ...state, manageModal,recordManage};
    },
    protocolModalSave(state, { payload: { protocolModal} } ) {
      return { ...state, protocolModal};
    },
    addModalSave(state, { payload: { addModal} } ) {
      return { ...state, addModal};
    },
    rateSave(state, { payload: { rateList} } ) {
      return { ...state, rateList};
    },
  },

};
