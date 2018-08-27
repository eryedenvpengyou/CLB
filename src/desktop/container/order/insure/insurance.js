import { connect } from 'dva';
import * as styles from '../../../styles/appointment.css';
import ProtalLayout from "../../../components/layout/ProtalLayout";
import BreadcrumbLayout from "../../../components/layout/BreadcrumbLayout";
import Insurance from "../../../components/order/insure/Insurance";




const insurance = ({location, dispatch, params})=>{
  const itemList = [{
      name: '工作台',
      url: '/#/portal/home'
    },{
      name: '选择业务类型',
      url: '/#/portal/businessChoose'
    },{
      name: '保险/预约签单',
      url: '/#/order/insurance/'+params.orderId,
    }];

  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread_sty}>
          <BreadcrumbLayout itemList={itemList} />
        </div>
        <Insurance dispatch={dispatch} orderId={params.orderId}/>
      </div>
    </ProtalLayout>
  );
}

export default connect()(insurance);
