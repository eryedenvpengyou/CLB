import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import Customer from '../../components/customer/Customer';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import * as styles from '../../styles/qa.css';

const customer = ({ location,dispatch,customer})=>{
  const itemList = [{
      name: '工作台',
      url: '/#/portal/home'
    },{
      name: '我的客户',
      url: '/#/portal/customer'
    }];
  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread}>
          <BreadcrumbLayout itemList={itemList} />
        </div>
        <Customer customer={customer} dispatch={dispatch}/>
      </div>
    </ProtalLayout>
  );
}

export default connect(({ customer }) => ({ customer }))(customer);
