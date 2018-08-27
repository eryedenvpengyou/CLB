import { connect } from 'dva';
import PaySuccess from "../../components/portal/PaySuccess";
import ProtalLayout from "../../components/layout/ProtalLayout";
import * as styles from '../../styles/qa.css'
import BreadcrumbLayout from "../../components/layout/BreadcrumbLayout";


const paySuccess = ({ location,dispatch, params})=>{
  const itemList = [{
    name: '支付成功',
    url: `/#/portal/paySuccess/${params.paymentType}`,
  }];
  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread_sty}>
          <BreadcrumbLayout style={{display:'inline'}} itemList={itemList} />
        </div>
        <PaySuccess dispatch={dispatch} paymentType={params.paymentType}/>
      </div>
    </ProtalLayout>
  );
}

export default connect()(paySuccess);
