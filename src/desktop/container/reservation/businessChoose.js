import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as styles from '../../styles/sys.css'
import BusinessChoose from "../../components/reservation/BusinessChoose";
import BreadcrumbLayout from "../../components/layout/BreadcrumbLayout";

const businessChoose = ({ location,reservation,dispatch })=>{
  const itemList = [{
    name: '工作台',
    url: '/#/portal/home'
  },{
    name: '选择业务类型',
    url: '/#/portal/businessChoose'
  }];
  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread_sty}>
          <BreadcrumbLayout itemList={itemList} />
        </div>
        <BusinessChoose reservation={reservation} dispatch={dispatch}/>
      </div>
    </ProtalLayout>
  );
}

export default connect(({reservation}) => ({reservation}))(businessChoose);
