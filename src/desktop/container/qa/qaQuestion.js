import { connect } from 'dva';
import QaQuestion from '../../components/qa/QaQuestion';


const qaQuestion = ({qa, dispatch})=>{
  return (
    <QaQuestion qa={qa.questionList} dispatch={dispatch}/>
  );
}

export default connect(({ qa }) => ({ qa }))(qaQuestion);
