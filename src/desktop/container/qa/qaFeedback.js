import { connect } from 'dva';
import QaFeedback from '../../components/qa/QaFeedback';


const qaFeedback = ({qa,dispatch})=>{
  return (
    <QaFeedback qa={qa} dispatch={dispatch}/>
  );
}


export default connect(({ qa }) => ({ qa }))(qaFeedback);
