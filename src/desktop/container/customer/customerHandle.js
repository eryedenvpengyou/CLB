import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import CustomerHandle from '../../components/customer/CustomerHandle';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import * as styles from '../../styles/qa.css';

const customerHandle = ({ location,dispatch,customer,params})=>{
  const itemList = [{
      name: '工作台',
      url: '/#/portal/home'
    },{
      name: '我的客户',
      url: '/#/portal/customer'
    },{
      name: params.name ? ('个人信息>'+params.name): '个人信息',
      url: `/#/portal/customerHandle/${params.id}`,
    }];
  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread}>
          <BreadcrumbLayout itemList={itemList} />
        </div>
        <CustomerHandle customer={customer} dispatch={dispatch} customerId={params.id} name={params.name}/>
      </div>
    </ProtalLayout>
  );
}

export default connect(({ customer }) => ({ customer }))(customerHandle);
