import dva from 'dva';
import * as service from '../services/order';
import {stringify} from 'qs';

/**
 *
 */
export default {
  namespace: 'order',
  state: {
    orderPengding : [],
    orderPendingTeam : [],
    channelList:[],
    children:[],
    orderList:[],
    orderIntroduceList:[],
    orderTeamList:[],
    orderTrails:[],
    orderTrailForm:[],
    renewalList:[],
    renewalDetailTableList:[],
    renewalFollowList:[],
    renewalLovList:[],
    renewalSelectList:{},
    afterList:[],
    afterByAfterIdList:[],
    renewalProductList:[],
    renewalPList:[],
    renewalProductByOrderIdList:[],
    renewalPByOIdList:[],
    afterFollowExitList:[],
    newExitByOrderIdList:[],
    followRenewalDetailList:[],
    orderPersonList:[],
    ordCommissionList:[],
    ordStatusHisList:[],
    ordAfterTeamList:[],
    renewalFollowTableList:[],
    renewalFollowTeamList:[],
    queryRIByOrderIdList:[],
    aFExitList:[],

    codeList:{},
    options:[],

    loading:false,
  },

  subscriptions: {
    setup ({ dispatch }) {
    },
  },

  effects: {
    *fetchOrderQuery({ payload:{params}},{ call, put }) {
      const data = yield call(service.fetchOrderList, {params});
      for(let i in data.rows){
        data.rows[i].key = data.rows[i].orderId;
      }
      yield put({
        type: 'queryOrder',
        payload: {
          orderList: data
        }
      });
    },

    *fetchOrderTeamQuery({ payload:{params}},{ call, put }) {
      const data = yield call(service.fetchOrderTeamList, {params});
      for(let i in data.rows){
        data.rows[i].key = data.rows[i].orderId;
      }
      yield put({
        type: 'orderTeamQuery',
        payload: {
          orderList: data
        }
      });
    },

    *fetchOrderDetailQuery({ payload:{params}},{ call, put }) {
      const data = yield call(service.fetchOrderDetail, {params});
      yield put({
        type: 'queryOrderDetail',
        payload: {
          orderDetail: data.rows[0] || {}
        }
      });
    },

    *fetchOrderPerson({ payload:{paramOrderPerson}},{ call, put }) {
      const {rows} = yield call(service.fetchOrderPerson, {paramOrderPerson});
      yield put({
        type: 'queryOrderPerson',
        payload: {
          orderPersonList: rows
        }
      });
    },

    *fetchOrderCommissionTable({ payload:{paramOrdCommission}},{ call, put }) {
      const {rows} = yield call(service.fetchOrderCommissionTable, {paramOrdCommission});
      yield put({
        type: 'queryOrdCommission',
        payload: {
          ordCommissionList: rows
        }
      });
    },

    *fetchOrdStatusHis({ payload:{paramOrdStatusHis}},{ call, put }) {
      const {rows} = yield call(service.fetchOrdStatusHis, {paramOrdStatusHis});
      yield put({
        type: 'queryOrdStatusHis',
        payload: {
          ordStatusHisList: rows
        }
      });
    },

    *fetchOrderIntroduce({ payload:{paramOrderIntroduce}},{ call, put }) {
      const {rows} = yield call(service.fetchOrderIntroduce, {paramOrderIntroduce});
      yield put({
        type: 'queryOrderIntroduce',
        payload: {
          orderIntroduceList: rows
        }
      });
    },

    *fetchOrderTeam({ payload:{paramOrderTeam}},{ call, put }) {
      const {rows} = yield call(service.fetchOrderTeam, {paramOrderTeam});
      yield put({
        type: 'queryOrderTeam',
        payload: {
          orderTeamList: rows
        }
      });
    },

    *queryRenewalInfoByOrderId({ payload:{params}},{ call, put }) {
      const {rows} = yield call(service.queryRenewalInfoByOrderId, {params});
      yield put({
        type: 'queryRIByOrderId',
        payload: {
          queryRIByOrderIdList: rows
        }
      });
    },

    *fetchOrderPengding({ payload:{params}},{ call, put }) {
      const {rows} = yield call(service.fetchOrderPengding, {params});
      yield put({
        type: 'orderPengdingquary',
        payload: {
          orderPengdingList: rows
        }
      });
    },

    *fetchOrderPendingTeam({ payload:{paramsTeam}},{ call, put }) {
      const {rows} = yield call(service.fetchOrderPendingTeam, {paramsTeam});
      yield put({
        type: 'orderPendingT',
        payload: {
          orderPendingTeam: rows
        }
      });
    },

    *fetchOrderTrails({ payload:params},{ call, put }) {

      const {rows} = yield call(service.fetchOrderTrails, params);
      yield put({
        type: 'orderTrailTable',
        payload: {
          orderTrails: rows
        }
      });
    },
    *fetchOrderTrailForm({ payload:params},{ call, put }) {

      const {rows} = yield call(service.fetchOrderTrailForm, params);
      yield put({
        type: 'orderTrailForm',
        payload: {
          orderTrailForm: rows
        }
      });
    },
    *submitOrderTrail({ payload:{params}},{ call, put }){
      let data = yield call(service.submitOrderTrail,{params});
    },
    *orderTrailDownFile({ payload:{params}},{ call, put }){
      let data = yield call(service.orderTrailDownFile,{params});
    },
    *fetchRenewalPerson({ payload:params},{ call, put }) {
      const {rows} = yield call(service.fetchRenewalPerson, params);
      yield put({
        type: 'fetchRenewal',
        payload: {
          renewalList: rows
        }
      });
      let paramsDetail = {};
      paramsDetail.orderId = rows[0].orderId;
      const data = yield call(service.fetchRenewalDetailTable, {paramsDetail});
      yield put({
        type: 'fetchRenewalDetail',
        payload: {
          renewalDetailTableList: data.rows
        }
      });
    },

    *fetchRenewalFollowTable({ payload:paramsRenewalFollowTable},{ call, put }) {

      const {rows} = yield call(service.fetchRenewalFollowTable, paramsRenewalFollowTable);
      yield put({
        type: 'renewalFollowTable',
        payload: {
          renewalFollowTableList: rows
        }
      });
    },

    *fetchRenewalTeam({ payload:paramsTeam},{ call, put }) {

      const {rows} = yield call(service.fetchRenewalTeam, paramsTeam);
      yield put({
        type: 'renewalFollowTeam',
        payload: {
          renewalFollowTeamList: rows
        }
      });
    },

    *fetchRenewalFollow({ payload:paramsRF},{ call, put }) {

      const {rows} = yield call(service.fetchRenewalFollow, paramsRF);
      yield put({
        type: 'renewalFollow',
        payload: {
          renewalFollowList: rows
        }
      });
    },

    *fetchNewRenewalLov({ payload:paramsLov},{ call, put }) {

      const {rows} = yield call(service.fetchNewRenewalLov, paramsLov);
      yield put({
        type: 'renewalLov',
        payload: {
          renewalLovList: rows
        }
      });
    },

    *fetchCode({ payload:{paramsCode}},{ call, put }) {
      let data = yield call(service.fetchCode, {paramsCode});
      let options = [];
      if(data != undefined && data != ''){
        data =  JSON.parse(data);
      }else{
        data = [];
      }
      yield put({
        type: 'codeSave',
        payload: {
          codeList: data,
        }
      });
    },

    *fetchNewRenewalSelect({payload:rows},{ call, put }) {
      yield put({
        type: 'renewalSelect',
        payload: {
          renewalSelectList: rows
        }
      });
    },

    *fetchAfter({ payload:params},{ call, put }) {
      const {rows} = yield call(service.fetchAfter, params);
      yield put({
        type: 'after',
        payload: {
          afterList: rows
        }
      });
    },

    *queryOrdAfterTeamList({ payload:params},{ call, put }) {
      const {rows} = yield call(service.queryOrdAfterTeamList, params);
      yield put({
        type: 'ordAfterTeam',
        payload: {
          ordAfterTeamList: rows
        }
      });
    },

    *fetchAfterByAfterId({ payload:params},{ call, put }) {
      const {rows} = yield call(service.fetchAfterByAfterId, params);
      yield put({
        type: 'afterByAfterId',
        payload: {
          afterByAfterIdList: rows
        }
      });
    },

    *fetchRenewalProduct({ payload:params},{ call, put }) {
      const {rows} = yield call(service.fetchRenewalProduct, params);
      yield put({
        type: 'renewalProduct',
        payload: {
          renewalProductList: rows
        }
      });
    },

    *fetchRPService({ payload:params},{ call, put }) {
      const {rows} = yield call(service.fetchRPService, params);
      yield put({
        type: 'renewalP',
        payload: {
          renewalPList: rows
        }
      });
    },

    *fetchRenewalProductByOrderId({ payload:params},{ call, put }) {
      const {rows} = yield call(service.fetchRenewalProductByOrderId, params);
      yield put({
        type: 'renewalProductByOrderId',
        payload: {
          renewalProductByOrderIdList: rows
        }
      });
    },

    *fetchRPByOId({ payload:params},{ call, put }) {
      const {rows} = yield call(service.fetchRPByOId, params);
      yield put({
        type: 'renewalPByOId',
        payload: {
          renewalPByOIdList: rows
        }
      });
    },

    *fetchAfterFollowExitByOrderId({ payload:params},{ call, put }) {
      const {rows} = yield call(service.fetchAfterFollowExitByOrderId, params);
      yield put({
        type: 'newExitByOrderId',
        payload: {
          newExitByOrderIdList: rows
        }
      });
    },

    *fetchFollowRenewalDetail({ payload:params},{ call, put }) {
      const {rows} = yield call(service.fetchFollowRenewalDetail, params);
      yield put({
        type: 'followRenewalDetail',
        payload: {
          followRenewalDetailList: rows
        }
      });
    },

    *fetchCancelAfter({ payload:{params}},{ call, put }){
      let data = yield call(service.fetchCancelAfter,{params});
    },

    *fetchCancelOrder({ payload:{params}},{ call, put }){
      let data = yield call(service.fetchCancelOrder,{params});
    },

    *fetchFollowDelete({ payload:{params}},{ call, put }){
      let data = yield call(service.fetchFollowDelete,{params});
    },

    *submitAfterFollow({ payload:{params}},{ call, put }){
      let data = yield call(service.submitAfterFollow,{params});
    },

    *submitAfterNew({ payload:{params}},{ call, put }){
      let data = yield call(service.submitAfterNew,{params});
    },

    *fetchAfterFollowExit({ payload:params},{ call, put }) {
      const {rows} = yield call(service.fetchAfterFollowExit, params);
      yield put({
        type: 'afterFollowExit',
        payload: {
          afterFollowExitList: rows
        }
      });
    },


    *fetchAFExit({ payload:params},{ call, put }) {
      const {rows} = yield call(service.fetchAFExit, params);
      yield put({
        type: 'aFExit',
        payload: {
          aFExitList: rows
        }
      });
    },
  },


  reducers: {
    codeSave(state, { payload: { codeList,options} } ){
      return { ...state, codeList,options};
    },

    orderPendingT(state, { payload: { orderPendingTeam,options} } ){
      return { ...state, orderPendingTeam,options};
    },

    queryOrder (state,{payload:{orderList}}) {
      return { ...state, orderList }
    },

    orderTeamQuery (state,{payload:{orderList}}) {
      return { ...state, orderList }
    },

    queryOrderDetail (state,{payload:{orderDetail}}) {
      return { ...state, orderDetail }
    },

    renewalFollowTable (state,{payload:{renewalFollowTableList}}) {
      return { ...state, renewalFollowTableList }
    },

    renewalFollowTeam(state,{payload:{renewalFollowTeamList}}) {
      return { ...state, renewalFollowTeamList }
    },

    queryOrdCommission(state,{payload:{ordCommissionList}}) {
      return { ...state, ordCommissionList }
    },

    queryOrdStatusHis(state,{payload:{ordStatusHisList}}) {
      return { ...state, ordStatusHisList }
    },

    queryOrderIntroduce  (state,{payload:{orderIntroduceList}}) {
      return { ...state, orderIntroduceList }
    },

    queryOrderTeam  (state,{payload:{orderTeamList}}) {
      return { ...state, orderTeamList }
    },

    queryOrderPerson(state,{payload:{orderPersonList}}) {
      return { ...state, orderPersonList }
    },

    orderPengdingquary(state,{payload:{orderPengdingList}}) {
      return { ...state, orderPengdingList }
    },

    orderTrailTable (state,{payload:{orderTrails}}) {
      return { ...state, orderTrails }
    },

    orderTrailForm (state,{payload:{orderTrailForm}}) {
      return { ...state, orderTrailForm }
    },

    fetchRenewal (state,{payload:{renewalList}}) {
      return { ...state, renewalList }
    },

    fetchRenewalDetail (state,{payload:{renewalDetailTableList}}) {
      return { ...state, renewalDetailTableList }
    },

    renewalFollow (state,{payload:{renewalFollowList}}) {
      return { ...state, renewalFollowList }
    },

    renewalLov (state,{payload:{renewalLovList}}) {
      return { ...state, renewalLovList }
    },

    aFExit (state,{payload:{aFExitList}}) {
      return { ...state, aFExitList }
    },

    renewalSelect (state,{payload:{renewalSelectList}}) {
      return { ...state, renewalSelectList }
    },

    after(state,{payload:{afterList}}) {
      return { ...state, afterList }
    },

    ordAfterTeam(state,{payload:{ordAfterTeamList}}) {
      return { ...state, ordAfterTeamList }
    },

    afterByAfterId(state,{payload:{afterByAfterIdList}}) {
      return { ...state, afterByAfterIdList }
    },

    renewalProduct(state,{payload:{renewalProductList}}) {
      return { ...state, renewalProductList }
    },

    renewalP(state,{payload:{renewalPList}}) {
      return { ...state, renewalPList }
    },

    renewalProductByOrderId(state,{payload:{renewalProductByOrderIdList}}) {
      return { ...state, renewalProductByOrderIdList }
    },

    renewalPByOId(state,{payload:{renewalPByOIdList}}) {
      return { ...state, renewalPByOIdList }
    },

    afterFollowExit(state,{payload:{afterFollowExitList}}) {
      return { ...state, afterFollowExitList }
    },

    newExitByOrderId(state,{payload:{newExitByOrderIdList}}) {
      return { ...state, newExitByOrderIdList }
    },

    followRenewalDetail(state,{payload:{followRenewalDetailList}}) {
      return { ...state, followRenewalDetailList }
    },

    queryRIByOrderId(state,{payload:{queryRIByOrderIdList}}) {
      return { ...state, queryRIByOrderIdList }
    },

    changeLoading(state,{payload:{loading}}) {
      return { ...state, loading }
    },

  },
};
