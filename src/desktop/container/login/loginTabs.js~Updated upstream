import { connect } from 'dva';
import MainLayout from "../../components/layout/MainLayout";
import LoginTabs from "../../components/login/LoginTabs";


const loginTabs = ({ location,dispatch})=>{
  return (
    <MainLayout location={location}  title='| 登录'>
      <div>
        <LoginTabs dispatch={dispatch}/>
      </div>
    </MainLayout>
  );
}

export default connect()(loginTabs);
