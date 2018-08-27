import { connect } from 'dva';
import RegSuccess from '../../components/register/RegSuccess';
import MainLayout from "../../components/layout/MainLayout";

const regSuccess = ({ location,dispatch,register})=>{
  return (
    <MainLayout location={location} title='| 渠道注册'>
      <div>
        <RegSuccess dispatch={dispatch} register={register}/>
      </div>
    </MainLayout>
  );
}

export default connect(({ register }) => ({ register }))(regSuccess);
