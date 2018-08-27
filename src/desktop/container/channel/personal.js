import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import Personal from '../../components/channel/Personal';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import * as styles from '../../styles/qa.css';

const personal = ({ location,dispatch,personal,params})=>{
  let itemList = [{
    name: '工作台',
    url: '/#/portal/home'
  },{
    name: '个人中心',
    url: '/#/channel/personal'
  }];

  if(params.channelId){
    itemList = [{
      name: '工作台',
      url: '/#/portal/home'
    },{
      name: '我的团队',
      url: '/#/channel/team',
    },{
      name: '渠道详情',
      url: '/#/channel/personal/'+params.channelId + '/' + params.userName
    }];
  }

  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread}>
          <BreadcrumbLayout itemList={itemList} />
        </div>
        <Personal personal={personal} dispatch={dispatch} channelId={params.channelId} userName={params.userName}/>
      </div>
    </ProtalLayout>
  );
}

export default connect(({ personal }) => ({ personal }))(personal);
