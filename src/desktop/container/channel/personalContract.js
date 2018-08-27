import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import PersonalContract from '../../components/channel/PersonalContract';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import * as styles from '../../styles/qa.css';

const personalContract = ({ location,dispatch,personal,params})=>{
  let itemList = [{
    name: '工作台',
    url: '/#/portal/home'
  },{
    name: '个人中心',
    url: `/#/channel/personal`
  },{
    name: '合约详情',
    url: `/#/channel/personal/${params.channelId}/${params.channelContractId}/${params.contractCode}/${params.userName}`
  }];

  if(params.channelId != JSON.parse(localStorage.user).relatedPartyId){
    itemList = [{
      name: '工作台',
      url: '/#/portal/home'
    },{
      name: '我的团队',
      url: '/#/channel/team',
    },{
      name: '渠道详情',
      url: `javascript:history.back()`,
    },{
      name: '合约详情',
      url: `/#/channel/personal/${params.channelId}/${params.channelContractId}/${params.contractCode}/${params.userName}`,
    }];
  }

  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread}>
          <BreadcrumbLayout itemList={itemList} />
        </div>
        <PersonalContract
          personal={personal}
          dispatch={dispatch}
          channelId={params.channelId}
          channelContractId={params.channelContractId}
          contractCode={params.contractCode}
          userName={params.userName}/>
      </div>
    </ProtalLayout>
  );
}

export default connect(({ personal }) => ({ personal }))(personalContract);
