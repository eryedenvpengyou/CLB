import dva from 'dva';
import * as service from '../services/qa';

export default {
  namespace: 'qa',
  state: {
    guides: [],
    guideFileList: [],        //指引文件列表
    questionList: [],         //问题列表
    conLines: [],             //聊天记录（追问）

    subMenuKey: '',
    currentKey:'',
    breadItem:[],
  },

  subscriptions: {
    setup ({ dispatch }) {},
  },

  effects: {

    //查询操作指引列表
    *fetchGuid({ payload:{guidelineName}},{ call, put }){
      const {rows}  = yield call(service.fetchGuide, {guidelineName});
      yield put({ type: 'guideSave', payload: {guides: rows } });
    },
    //搜索操作指引
    *searchGuide({ payload:{searchValue}},{ call, put }){
      yield put({ type: 'fetchGuid', payload: {guidelineName: searchValue} });
    },
    //查询操作指引附件
    *fetchGuideFile({ payload:{guidelineId}},{ call, put }){
      const {rows}  = yield call(service.fetchGuideFile, {guidelineId});
      yield put({ type: 'fileSave', payload: {guideFileList: rows } });
    },

    
    //查询问题列表
    *fetchQuestion({ payload:{questionType,questionName}},{ call, put }){
      const {rows}  = yield call(service.fetchQuestion, {questionType, questionName});
      if(questionName != undefined){
        if(rows && rows.length>0){
          let currentKey = '/qaBasic/qaQuestion?param='+rows[0].questionType;
          yield put({ type: 'keySave',payload: {currentKey: currentKey} });
        }
      }
      yield put({ type: 'questionSave', payload: {questionList: rows} });
    },
    //搜索问题列表
    *searchQuestion({ payload:{searchValue}},{ call, put }){
      yield put({ type: 'fetchQuestion',payload: {questionName: searchValue} });
    },


    //查询问题咨询列表
    *fetchConLine({ payload:{params}},{ call, put }){
      const {rows}  = yield call(service.fetchConLine, params);
      yield put({type: 'conLineSave', payload: {conLines: rows}});
    },
    //提交问题咨询
    *conLineSubmit({ payload:{params}},{ call, put }){
      const data = yield call(service.conLineSubmit, params);
      if(data.success){
          yield put({type: 'conLineSave', payload: {conLines: data.rows || []}});
      }
    },
  },

  reducers: {
    guideSave(state, { payload: { guides} } ) {
      return { ...state, guides};
    },
    fileSave(state, { payload: { guideFileList} } ) {
      return { ...state, guideFileList};
    },
    questionSave(state, { payload: { questionList} } ) {
      return { ...state, questionList};
    },
    conLineSave(state, { payload: { conLines} } ) {
      return { ...state, conLines};
    },
    keySave(state, { payload: { currentKey} } ) {
      return { ...state, currentKey};
    },
    breadItemSave(state, { payload: { breadItem} } ) {
      return { ...state, breadItem};
    },
    subMenuKeySave(state, { payload: { subMenuKey} } ) {
      return { ...state, subMenuKey};
    },
  },

};
