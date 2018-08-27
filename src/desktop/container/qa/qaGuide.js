import { connect } from 'dva';
import QaGuide from '../../components/qa/QaGuide';

const qaGuide = ({qa})=>{
  return (
    <QaGuide props={qa}/>
  );
}
export default connect(({ qa }) => ({ qa }))(qaGuide);
