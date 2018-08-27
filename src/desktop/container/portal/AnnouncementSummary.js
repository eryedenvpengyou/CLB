/**
 * Created by hand on 2017/5/25.
 */

import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import AnnouncementSummary from '../../components/portal/AnnouncementSummary';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import * as styles from '../../styles/sys.css'

class notice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*面包屑数据*/
      noticeList: [{
        name: '公告栏汇总',
        url: '/#/portal/announcementSummary'
      }]
    };
  }
  render() {
    return (
      <ProtalLayout location={this.props.location}>
        <div style={{width: '100%'}}>
          <BreadcrumbLayout itemList={this.state.noticeList} />
          <div className={styles.bodyContent}>
            <AnnouncementSummary />
          </div>
        </div>
      </ProtalLayout>
    );
  }
}

export default (notice);
