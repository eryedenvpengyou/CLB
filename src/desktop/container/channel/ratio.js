import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import Ratio from '../../components/channel/Ratio';
import * as styles from '../../styles/qa.css';

const ratio = ({ location,dispatch,channel})=>{
  const itemList = [{
      name: '工作台',
      url: '/#/portal/home'
    },{
      name: '渠道分成',
      url: '/#/channel/ratio'
    }];
  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread}>
          <BreadcrumbLayout itemList={itemList} />
        </div>
        <Ratio channel={channel} dispatch={dispatch}/>
      </div>
    </ProtalLayout>
  );
}

export default connect(({ channel }) => ({ channel }))(ratio);
