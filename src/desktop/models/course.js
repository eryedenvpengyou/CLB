import dva from 'dva';
import * as service from '../services/course';

/**
 *
 */
export default {
  namespace: 'course',
  state: {
    courses:{},          //【我的课程】主界面数据

  },

  subscriptions: {
    setup ({ dispatch }) {
      // dispatch({ type: 'fetchCourse',payload:{params}});
    },
  },

  effects: {

    *fetchCourse({ payload:{params}},{ call, put }) {
      const data = yield call(service.fetchCourse, params);
      for(let i in data.rows){
        data.rows[i].key = data.rows[i].courseId;
      }
      yield put({
        type: 'courseSave',
        payload: {
          courses: data
        }
      });
    },

  },


  reducers: {
    courseSave(state, { payload: { courses} } ) {
      return { ...state, courses};
    },
  },

};
