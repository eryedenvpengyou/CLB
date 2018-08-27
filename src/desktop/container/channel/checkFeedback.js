import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import CheckFeedback from '../../components/channel/CheckFeedback';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import * as styles from '../../styles/qa.css';

const checkFeedback = ({ location,dispatch,channel,params})=>{
  const record = params;
  const itemList = [{
    name: '工作台',
    url: '/#/portal/home'
  },{
    name: '对账单详情',
    url: record.origin == '1'?`/#/channel/checkDetail/${record.checkPeriod}/${record.paymentCompanyType}/${record.receiveCompanyType}/${record.paymentCompanyId}/${record.receiveCompanyId}/${record.paymentCompanyName}/${record.receiveCompanyName}/${record.settlementSummaryId}/${record.status}/${record.receiveFlag}/${record.questionId}`:
    `/#/settlement/paymentDetail/${record.settlementSummaryId}/${record.receiveCompanyName}`,
  },{
    name: '问题反馈'
  }];
  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread}>
          <BreadcrumbLayout itemList={itemList} />
        </div>
        <CheckFeedback
          dispatch={dispatch}
          channel={channel}
          checkPeriod={params.checkPeriod}
          paymentCompanyType={params.paymentCompanyType}
          receiveCompanyType={params.receiveCompanyType}
          paymentCompanyId={params.paymentCompanyId}
          receiveCompanyId={params.receiveCompanyId}
          paymentCompanyName={params.paymentCompanyName}
          receiveCompanyName={params.receiveCompanyName}
          settlementSummaryId={params.settlementSummaryId}
          status={params.status}
          receiveFlag={params.receiveFlag}
          questionId={params.questionId}/>
      </div>
    </ProtalLayout>
  );
}

export default connect(({ channel }) => ({ channel }))(checkFeedback);
