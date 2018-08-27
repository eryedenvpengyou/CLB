import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import TeamChart from '../../components/channel/TeamChart';
import * as styles from '../../styles/qa.css'

const teamChart = ({ location, channel})=>{
  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <TeamChart channel={channel}/>
      </div>
    </ProtalLayout>
  );
}

export default connect(({ channel }) => ({ channel }))(teamChart);
