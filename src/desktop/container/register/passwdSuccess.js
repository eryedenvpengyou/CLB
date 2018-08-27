import { connect } from 'dva';
import PasswdSuccess from '../../components/register/PasswdSuccess';
import MainLayout from "../../components/layout/MainLayout";

const passwdSuccess = ({ location,dispatch,register})=>{
  return (
    <MainLayout location={location} title='| 忘记密码'>
      <div>
        <PasswdSuccess dispatch={dispatch} register={register}/>
      </div>
    </MainLayout>
  );
}

export default connect(({ register }) => ({ register }))(passwdSuccess);
