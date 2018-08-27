import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import Check from '../../components/channel/Check';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import * as styles from '../../styles/qa.css';

const check = ({ location,dispatch,channel})=>{
  const itemList = [{
      name: '工作台',
      url: '/#/portal/home'
    },{
      name: '对账单列表',
      url: '/#/channel/check'
    }];
  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread}>
          <BreadcrumbLayout itemList={itemList} />
        </div>
        <Check channel={channel} dispatch={dispatch}/>
      </div>
    </ProtalLayout>
  );
}

export default connect(({ channel }) => ({ channel }))(check);
