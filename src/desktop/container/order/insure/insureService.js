import { connect } from 'dva';
import * as styles from '../../../styles/appointment.css';
import ProtalLayout from "../../../components/layout/ProtalLayout";
import BreadcrumbLayout from "../../../components/layout/BreadcrumbLayout";
import InsureService from "../../../components/order/insure/InsureService";




const insureService = ({location, dispatch, params})=>{
  const itemList = [{
      name: '工作台',
      url: '/#/portal/home'
    },{
      name: '添加增值服务',
      url: `/#/order/insurance/service/${params.reId}/${params.reNumber}`,
  }];

  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread_sty}>
          <BreadcrumbLayout itemList={itemList} />
        </div>
        <InsureService dispatch={dispatch} reId={params.reId} reNumber={params.reNumber}/>
      </div>
    </ProtalLayout>
  );
}

export default connect()(insureService);
