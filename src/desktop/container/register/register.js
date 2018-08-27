import { connect } from 'dva';
import Register from '../../components/register/Register';
import MainLayout from "../../components/layout/MainLayout";

const register = ({ location,register,dispatch})=>{
  return (
    <MainLayout location={location} title='| 渠道注册'>
      <div>
        <Register register={register} dispatch={dispatch}/>
      </div>
    </MainLayout>
  );
}

export default connect(({ register }) => ({ register }))(register);
