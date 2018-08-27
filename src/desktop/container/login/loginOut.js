import { connect } from 'dva';
import MainLayout from "../../components/layout/MainLayout";
import LoginTabs from "../../components/login/LoginTabs";


class loginOut extends React.Component {

    constructor(props) {
      super(props);

      localStorage.clear(); 
    }

    render() {
      return (
        <MainLayout>
          <div>
            <LoginTabs/>
          </div>
        </MainLayout>
      );
    }
}

export default connect()(loginOut);
