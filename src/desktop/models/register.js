import dva from 'dva';
import pcCascade from '../utils/common';
import * as service from '../services/register';

export default {
  namespace: 'register',
  state: {
    codeList:{},
    options:[],
    step:0,
    askVisible:false,       //进入工作台的询问模态框
    modalVisible:false,     //是否显示填写详细信息弹出框
    phoneVisible: false,    //校验手机
    protocolVisible:false,  //是否弹出协议
    passwordVisible:false,  //修改密码
    intiPhone:'',
  },

  subscriptions: {
    setup ({ dispatch }) {},
  },

  effects: {
    *submit({ payload:{body}},{ call, put }){
      let data = yield call(service.submit,{body});
    },

    *submitDetail({ payload:{params}},{ call, put }){
      let data = yield call(service.submitDetail,{params});
    },
  },


  reducers: {
    stepSave(state, { payload: { step} } ) {
      return { ...state, step};
    },
    visibleSave(state, { payload: { modalVisible} } ) {
      return { ...state, modalVisible};
    },
    phoneSave(state, { payload: { phoneVisible,intiPhone} } ) {
      return { ...state, phoneVisible,intiPhone};
    },
    protocolSave(state, { payload: { protocolVisible} } ) {
      return { ...state, protocolVisible};
    },
    passwordSave(state, { payload: { passwordVisible} } ) {
      return { ...state, passwordVisible};
    },
  },

};
