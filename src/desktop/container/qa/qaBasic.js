import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import { Input} from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import QaBasic from '../../components/qa/QaBasic';
import * as styles from '../../styles/qa.css'


const Search = Input.Search;

const qaBasic = ({ location, children, dispatch, qa })=>{
  
  return (
    <ProtalLayout location={location}>
      <div className={styles.qa_main}>
        {/* <div style={{backgroundColor:'#EFEFEF',width:'100%',height:'70px'}}>
          <Search placeholder="请输入您要查询的问题" style={{ margin:'15px 20%',width:'60%'}}
            onSearch={value => {
              dispatch({type: 'qa/clickSearch',payload: {searchValue:value}});
              dispatch(routerRedux.push('/qaBasic/qaQuestion'));
            }}
          />
        </div> */}
        <QaBasic qa={qa} children={children} dispatch={dispatch}/>
      </div>
    </ProtalLayout>
  );
}


export default connect(({ qa }) => ({ qa }))(qaBasic);
