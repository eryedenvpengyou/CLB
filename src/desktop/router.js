import React from 'react';
import { Router, Route, IndexRoute, history} from 'dva/router'
import { routerAuth, routerBack } from './utils/request';
import './styles/common.css';

//登录 、注册 、忘记密码、主页
const register = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/register/register"))
  }, "register")
}
const regSuccess = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/register/regSuccess"))
  }, "regSuccess")
}
const passwdReset = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/register/passwdReset"))
  }, "passwdReset")
}
const passwdSuccess = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/register/passwdSuccess"))
  }, "passwdSuccess")
}
const Home = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./routes/portal/Home"))
  }, "Home")
}

//渠道
const team = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/channel/team"))
  }, "team")
}
const teamRate = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/channel/teamRate"))
  }, "teamRate")
}
const teamChart = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/channel/teamChart"))
  }, "teamChart")
}
// const check = (nextState, callback)=>{
//   require.ensure([], (require)=> {
//     callback(null, require("./container/channel/check"))
//   }, "check")
// }
const checkDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/channel/checkDetail"))
  }, "checkDetail")
}
const checkFeedback = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/channel/checkFeedback"))
  }, "checkFeedback")
}
const personal = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/channel/personal"))
  }, "personal")
}
const personalContract = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/channel/personalContract"))
  }, "personalContract")
}
const ratio = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/channel/ratio"))
  }, "ratio")
}
const ratioDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/channel/ratioDetail"))
  }, "ratioDetail")
}
const prospectusApply = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/production/prospectusApply"))
  }, "prospectusApply")
}

//qa常见问题
const qaBasic = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/qa/qaBasic"))
  }, "qaBasic")
}
const qaGuide = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/qa/qaGuide"))
  }, "qaGuide")
}
const qaQuestion = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/qa/qaQuestion"))
  }, "qaQuestion")
}
const qaConsult = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/qa/qaConsult"))
  }, "qaConsult")
}

const qaFeedback = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/qa/qaFeedback"))
  }, "qaFeedback")
}

const qaNull = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/qa/qaNull"))
  }, "qaNull")
}

//产品库
const ProductionList = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/production/ProductionList"))
  }, "ProductionList")
}
const ProductionDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/production/ProductionDetail"))
  }, "ProductionDetail")
}
const ProductionSubscribe = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/production/ProductionSubscribe"))
  }, "ProductionSubscribe")
}
const ProductionCompare = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/production/ProductionCompare"))
  }, "ProductionCompare")
}
const ProductionCompareShare = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/production/ProductionCompareShare"))
  }, "ProductionCompareShare")
}
const ProductionPremiumMeasure = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/production/ProductionPremiumMeasure"))
  }, "ProductionPremiumMeasure")
}

//订单管理
const OrderSummaryPage = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/OrderSummaryPage"))
  }, "OrderSummaryPage")
}
const OrderDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/OrderDetail"))
  }, "OrderDetail")
}
const OrderBondsPage = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/OrderBondsPage"))
  }, "OrderBondsPage")
}
const OrderBondsDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/OrderBondsDetail"))
  }, "OrderBondsDetail")
}

// 我的计划书
const MyPlan = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/plan/MyPlan"))
  }, "MyPlan")
}
const PlanApply = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/plan/PlanApply"))
  }, "PlanApply")
}
const myPlanLibrary = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/plan/PlanLibrary"))
  }, "myPlanLibrary")
}

//Add by tanzhiqian
const OrderPending = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/OrderPending"))
  }, "OrderPending")
}
const OrderPendingTrail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/OrderPendingTrail"))
  }, "OrderPendingTrail")
}
const AfterRenewalDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/AfterRenewalDetail"))
  }, "AfterRenewalDetail")
}
const AfterRenewal = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/AfterRenewal"))
  }, "AfterRenewal")
}
const RenewalNeedKnow = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/RenewalNeedKnow"))
  }, "RenewalNeedKnow")
}
const AfterNewAftermarket = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/AfterNewAftermarket"))
  }, "AfterNewAftermarket")
}
const AfterNew = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/AfterNew"))
  }, "AfterNew")
}
const AfterFollowApplication = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/AfterFollowApplication"))
  }, "AfterFollowApplication")
}
const AfterFollowOther = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/AfterFollowOther"))
  }, "AfterFollowOther")
}
const AfterFollowExit = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/AfterFollowExit"))
  }, "AfterFollowExit")
}
const After = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/After"))
  }, "After")
}
const OrderImmigrantInvest = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/OrderImmigrantInvest"))
  }, "OrderImmigrantInvest")
}
const OrderImmigrantInvestDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/OrderImmigrantInvestDetail"))
  }, "OrderImmigrantInvestDetail")
}
const Maxim = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/maxim/Maxim"))
  }, "Maxim")
}
const MaximDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/maxim/MaximDetail"))
  }, "MaximDetail")
}
const OrderHouse = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/OrderHouse"))
  }, "OrderHouse")
}
const OrderHouseDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/OrderHouseDetail"))
  }, "OrderHouseDetail")
}

// 赴美生子
const OrderYJ = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/OrderYJ"))
  }, "OrderYJ")
}
const OrderYJDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/OrderYJDetail"))
  }, "OrderYJDetail")
}
const followOrderState = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/OrderFMSZState"))
  }, "followOrderState")
}

//财课堂
const ClassTab = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/classroom/ClassTab"))
  }, "ClassTab")
}
const Course = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/classroom/Course"))
  }, "Course")
}
const Datum = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/classroom/Datum"))
  }, "Datum")
}
const Business = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/classroom/Business"))
  }, "Business")
}
const CourseList = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/classroom/CourseList"))
  }, "CourseList")
}
const ReceiveSupport = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/classroom/ReceiveSupport"))
  }, "ReceiveSupport")
}
const MarketSupport = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/classroom/MarketSupport"))
  }, "MarketSupport")
}
const TrainSupport = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/classroom/TrainSupport"))
  }, "TrainSupport")
}
const ReviewList = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/classroom/ReviewList"))
  }, "ReviewList")
}
const ReviewDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/classroom/ReviewDetail"))
  }, "ReviewDetail")
}
const SupportChargeRule = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/classroom/SupportChargeRule"))
  }, "SupportChargeRule")
}
const CourseEvaluation = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/classroom/CourseEvaluation"))
  }, "CourseEvaluation")
}
const TrainingCourseDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/classroom/TrainingCourseDetail"))
  }, "TrainingCourseDetail")
}
const ApplyPopup = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/classroom/ApplyPopup"))
  }, "ApplyPopup")
}

//客户管理
const customer = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/customer/customer"))
  }, "customer")
}
const customerHandle = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/customer/customerHandle"))
  }, "customerHandle")
}

//工作台
const payOnline = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/portal/payOnline"))
  }, "payOnline")
}
const paySuccess = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/portal/paySuccess"))
  }, "paySuccess")
}
const notice = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/portal/AnnouncementSummary"))
  }, "notice")
}
const myCourse = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/portal/myCourse"))
  }, "myCourse")
}
const insurance = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/insure/insurance"))
  }, "insurance")
}
const insureService = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/order/insure/insureService"))
  }, "insureService")
}
const reservation = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/reservation/reservation"))
  }, "reservation")
}
const svDetailHandle = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/reservation/svDetailHandle"))
  }, "svDetailHandle")
}
const suDetailHandle = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/reservation/suDetailHandle"))
  }, "suDetailHandle")
}
const businessChoose = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/reservation/businessChoose"))
  }, "businessChoose")
}

//我的业绩
const myPerformance = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/performance/MyPerformance"))
  }, "myPerformance")
}

// 资料库
const Database = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/database/Database"))
  }, "Database")
}
const loginTabs = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/login/loginTabs"))
  }, "loginTabs")
}
const loginOut = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/login/loginOut"))
  }, "loginOut")
}
const userAuthority = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/login/userAuthority"))
  }, "userAuthority")
}
//首页
const homePage = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/homePage/HomePage"))
  }, "homePage")
}
//结算模块
//结算管理
const settlementManage = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/settlement/settlementManage"))
  }, "settlementManage")
}
//我的应收应付预测
const forecast = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/settlement/forecast"))
  }, "forecast")
}
//对账单管理
const check = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/settlement/check"))
  }, "check")
}
//付款对账单详情
const paymentDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/settlement/paymentDetail"))
  }, "paymentDetail")
}
//付款对账单新建
const paymentNew = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/settlement/paymentNew"))
  }, "paymentNew")
}
//我的实收
const myReceipts = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/settlement/myReceipts"))
  }, "myReceipts")
}
//我的实收详情
const myReceiptsDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/settlement/myReceiptsDetail"))
  }, "myReceiptsDetail")
}
//我的实付
const myActuallyPaid = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/settlement/myActuallyPaid"))
  }, "myActuallyPaid")
}
//我的实付详情
const myActuallyPaidDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/settlement/myActuallyPaidDetail"))
  }, "myActuallyPaidDetail")
}
//上线应派
const online = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/settlement/online"))
  }, "online")
}
//上线应派详情
const onlineDetail = (nextState, callback)=>{
  require.ensure([], (require)=> {
    callback(null, require("./container/settlement/onlineDetail"))
  }, "onlineDetail")
}
function RouterConfig({ history }) {
  return (
    <Router history={history}>
      {/* <Route path='/' name='home' getComponent={Home} onEnter={routerAuth} />
       <Route path="/home" getComponent={Home} onEnter={routerAuth}/>
       */}
      {/*
       <Route path="/" getComponent={Home} >
       <IndexRoute getComponent={Home} />
       </Route>
       */}
      <Route path="/" getComponent={homePage} />
      <Route path="/homePage" getComponent={homePage} />
      <Route path="/index" getComponent={Home} onEnter={routerBack} />
      <Route path="/login" getComponent={loginTabs} />
      <Route path="/loginOut" getComponent={loginOut} />
      <Route path="/register" getComponent={register} />
      <Route path="/register/success" getComponent={regSuccess} />
      <Route path="/passwdback/reset" getComponent={passwdReset} />
      <Route path="/passwdback/success" getComponent={passwdSuccess} />
      <Route path="/userAuthority/data=:data" getComponent={userAuthority} />

      <Route path="/channel" onEnter={routerAuth}>
        <Route path="/channel/team" getComponent={team} />
        <Route path="/channel/teamRate(/:id(/:parentPartyId/:parentPartyType(/:userName(/:channelName))))" getComponent={teamRate} />
        <Route path="/channel/teamchart" getComponent={teamChart} />
        {/* <Route path="/channel/check" getComponent={check} /> */}
        <Route path="/channel/checkDetail/:checkPeriod/:paymentCompanyType/:receiveCompanyType/:paymentCompanyId/:receiveCompanyId/:paymentCompanyName/:receiveCompanyName/:settlementSummaryId/:status/:receiveFlag/:questionId" getComponent={checkDetail} />
        <Route path="/channel/checkFeedback/:checkPeriod/:paymentCompanyType/:receiveCompanyType/:paymentCompanyId/:receiveCompanyId/:paymentCompanyName/:receiveCompanyName/:settlementSummaryId/:status/:receiveFlag/:questionId/:origin" getComponent={checkFeedback} />
        <Route path="/channel/personal(/:channelId/:userName)" getComponent={personal} />
        <Route path="/channel/personalContract/:channelId/:channelContractId/:contractCode/:userName" getComponent={personalContract} />
        <Route path="/channel/ratio" getComponent={ratio} />
        <Route path="/channel/ratioDetail/:ratioId" getComponent={ratioDetail} />
      </Route>

      <Route path="/qaBasic" getComponent={qaBasic} onEnter={routerAuth}>
        <Route path="/qaBasic/qaGuide" getComponent={qaGuide} />
        <Route path="/qaBasic/qaQuestion" getComponent={qaQuestion} />
        <Route path="/qaBasic/qaConsult" getComponent={qaConsult} />
        <Route path="/qaBasic/qaFeedback" getComponent={qaFeedback} />
        <Route path="/qaBasic/qaNull" getComponent={qaNull} />
      </Route>

      <Route path="/production" onEnter={routerAuth}>
        <Route path="/production/list/:bigClass" getComponent={ProductionList} />
        <Route path="/production/detail/:bigClass/:itemId" getComponent={ProductionDetail} />
        <Route path="/production/subscribe/:bigClass/:midClass/:id(/:reId/:reNumber)" getComponent={ProductionSubscribe} />
        <Route path="/production/compare" getComponent={ProductionCompare} />
        <Route path="/production/compareShare/:compareInfo" getComponent={ProductionCompareShare} />
        <Route path="/production/premiumMeasure/:bigClass/:midClass/:minClass/:itemId" getComponent={ProductionPremiumMeasure} />
      </Route>

      <Route path="/portal" onEnter={routerAuth}>
        <Route path="/portal/payOnline/:sourceType/:sourceId" getComponent={payOnline} />
        <Route path="/portal/paySuccess/:paymentType" getComponent={paySuccess} />
        <Route path="/portal/home" getComponent={Home} />
        <Route path="/portal/myCourse" getComponent={myCourse} />
        <Route path="/portal/businessChoose" getComponent={businessChoose} />
        <Route path="/portal/reservation(/:key)" getComponent={reservation} />
        <Route path="/portal/svDetailHandle/:midClass/:id/:itemId/:key" getComponent={svDetailHandle} />
        <Route path="/portal/suDetailHandle/:supportType/:status/:supportId/:key" getComponent={suDetailHandle} />
        <Route path="/portal/customer" getComponent={customer} />
        <Route path="/portal/customerHandle/:id/:name" getComponent={customerHandle} />
        <Route path="/portal/announcementSummary" getComponent={notice} />
      </Route>

      <Route path="/plan" onEnter={routerAuth}>
        <Route path="/plan/myPlan" getComponent={MyPlan} />
        <Route path="/plan/planApply/:operationCode/:planId/:itemId" getComponent={PlanApply} />
        <Route path="/plan/myPlanLibrary" getComponent={myPlanLibrary} />
      </Route>

      <Route path="/order" onEnter={routerAuth}>
        <Route path="/order/insurance/:orderId" getComponent={insurance} />
        <Route path="/order/insurance/service/:reId/:reNumber" getComponent={insureService} />
        <Route path="/order/orderImmigrantInvest/list(/:key)" getComponent={OrderImmigrantInvest} />
        {/*prePage => personal/team/introduction*/}
        <Route path="/order/orderImmigrantInvest/OrderImmigrantInvestDetail/:prePage/:orderId" getComponent={OrderImmigrantInvestDetail} />
        <Route path="/order/summary(/:key)" getComponent={OrderSummaryPage} />
        {/*prePage => personal/team/introduction*/}
        <Route path="/order/orderDetail/:prePage/:orderId" getComponent={OrderDetail} />
        <Route path="/order/bonds(/:key)" getComponent={OrderBondsPage} />
        {/*prePage => personal/team/introduction*/}
        <Route path="/order/orderBondsDetail/:prePage/:orderId" getComponent={OrderBondsDetail} />

        <Route path="/order/orderHouse(/:key)" getComponent={OrderHouse} />
        <Route path="/order/orderHouse/orderHouseDetail/:prePage/:orderId" getComponent={OrderHouseDetail} />

        <Route path="/order/orderYJ(/:key)" getComponent={OrderYJ} />
        <Route path="/order/orderYJ/orderYJDetail/:prePage/:type/:orderId" getComponent={OrderYJDetail} />
        <Route path='/order/followOrderState/:orderId' getComponent={followOrderState} />
      </Route>

      <Route path="/orderPending" onEnter={routerAuth}>
        <Route path="/orderPending/list(/:key)" getComponent={OrderPending} />
        <Route path="/orderPending/OrderPendingTrail/:orderType/:PDType/:orderId/:pendingId" getComponent={OrderPendingTrail} />
      </Route>

      <Route path="/maxim" onEnter={routerAuth}>
        <Route path="/maxim/list(/:key)" getComponent={Maxim} />
        <Route path="/maxim/maximDetail/:orderId/:orderNumber/:status" getComponent={MaximDetail} />
      </Route>

      <Route path="/after" onEnter={routerAuth}>
        <Route path="/after/list(/:key)" getComponent={After} />
        <Route path="/after/AfterRenewal/list(/:key)" getComponent={AfterRenewal} />
        <Route path="/after/RenewalNeedKnow" getComponent={RenewalNeedKnow} />
        <Route path="/after/AfterRenewal/AfterRenewalDetail/:orderId" getComponent={AfterRenewalDetail} />
        <Route path="/after/AfterNewAftermarket/:orderId" getComponent={AfterNewAftermarket} />
        <Route path="/after/AfterNew/:afterProject/:afterType/:orderId" getComponent={AfterNew} />
        <Route path="/after/AfterFollowApplication/:id/:orderId/:afterStatus" getComponent={AfterFollowApplication} />
        <Route path="/after/AfterFollowOther/:id/:orderId/:afterStatus" getComponent={AfterFollowOther} />
        <Route path="/after/AfterFollowExit/:id/:orderId/:afterStatus" getComponent={AfterFollowExit} />
      </Route>

      <Route path="/classroom" onEnter={routerAuth}>
        <Route path="/classroom/classTab" getComponent={ClassTab} />
        <Route path="/classroom/course" getComponent={Course} />
        <Route path="/classroom/datum(/:fileContent)" getComponent={Datum} />
        <Route path="/classroom/business" getComponent={Business} />
        <Route path="/classroom/courseList(/:key)" getComponent={CourseList} />
        <Route path="/classroom/receiveSupport" getComponent={ReceiveSupport} />
        <Route path="/classroom/marketSupport" getComponent={MarketSupport} />
        <Route path="/classroom/trainSupport" getComponent={TrainSupport} />
        <Route path="/classroom/reviewList" getComponent={ReviewList} />
        <Route path="/classroom/reviewDetail/:bigBreadcrumbType/:articleId" getComponent={ReviewDetail} />
        <Route path="/classroom/supportChargeRule" getComponent={SupportChargeRule} />
        <Route path="/classroom/courseEvaluation/:courseId" getComponent={CourseEvaluation} />
        <Route path="/classroom/trainingCourseDetail/:courseId" getComponent={TrainingCourseDetail} />
        <Route path="/classroom/applyPopup" getComponent={ApplyPopup} />
        <Route path="/classroom/myCourse" getComponent={myCourse} />
      </Route>

      <Route path="/proposal" getComponent={prospectusApply} onEnter={routerAuth} />

      <Route path="/performance/MyPerformance" getComponent={myPerformance} onEnter={routerAuth} />

      <Route path="/database(/:key(/:datumType(/:supplierId)))" getComponent={Database} onEnter={routerAuth} />

      <Route path='/settlement' onEnter={routerAuth}>
        <Route path="/settlement/settlementManage" getComponent={settlementManage}/>
        <Route path="/settlement/forecast(/:key)" getComponent={forecast} />
        <Route path="/settlement/check(/:key)" getComponent={check} />
        <Route path="/settlement/paymentDetail/:settlementSummaryId/:receiveCompanyName" getComponent={paymentDetail} />
        <Route path="/settlement/paymentNew/:settlementSummaryId" getComponent={paymentNew} />
        <Route path="/settlement/myReceipts" getComponent={myReceipts} />
        <Route path="/settlement/myReceiptsDetail/:actualSummaryId/:settleCurrency/:settlementSummaryType/:paymentCompanyId/:paymentCompanyType" getComponent={myReceiptsDetail} />
        <Route path="/settlement/myActuallyPaid" getComponent={myActuallyPaid} />
        <Route path="/settlement/myActuallyPaidDetail/:actualSummaryId/:settleCurrency/:settlementSummaryType/:receiveCompanyId/:receiveCompanyType" getComponent={myActuallyPaidDetail} />
        <Route path="/settlement/online" getComponent={online} />
        <Route path="/settlement/onlineDetail/:actualSummaryId/:receiveFlag/:settlementSummaryType/:settlementSummaryId" getComponent={onlineDetail} />
      </Route>
    </Router>
  );
}

export default RouterConfig;
