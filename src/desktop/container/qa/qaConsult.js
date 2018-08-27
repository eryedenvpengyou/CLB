import { connect } from 'dva';
import QaConsult from '../../components/qa/QaConsult';


const qaConsult = ({qa,dispatch})=>{
  return (
    <QaConsult qa={qa} dispatch={dispatch}/>
  );
}


export default connect(({ qa }) => ({ qa }))(qaConsult);
