import { connect } from 'dva';

const qaNull = ({qa})=>{
  return (<div></div>);
}
export default connect(({ qa }) => ({ qa }))(qaNull);
