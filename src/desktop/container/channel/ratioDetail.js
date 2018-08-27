import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import RatioDetail from '../../components/channel/RatioDetail';
import * as styles from '../../styles/qa.css';

const ratioDetail = ({ location,dispatch,channel, params})=>{
  const itemList = [{
      name: '工作台',
      url: '/#/portal/home'
    },{
      name: '渠道分成',
      url: '/#/channel/ratio'
    },{
      name: '分成设置',
      url: `/#/channel/ratioDetail/${params.ratioId}`
    }];
  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread}>
          <BreadcrumbLayout itemList={itemList} />
        </div>
        <RatioDetail channel={channel} dispatch={dispatch} ratioId={params.ratioId}/>
      </div>
    </ProtalLayout>
  );
}

export default connect(({ channel }) => ({ channel }))(ratioDetail);
