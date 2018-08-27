import { connect } from 'dva';
import PasswdReset from '../../components/register/PasswdReset';
import MainLayout from "../../components/layout/MainLayout";

const passwdReset = ({ location,dispatch,register})=>{
  return (
    <MainLayout location={location} title='| 忘记密码'>
      <div>
        <PasswdReset dispatch={dispatch} register={register}/>
      </div>
    </MainLayout>
  );
}

export default connect(({ register }) => ({ register }))(passwdReset);
