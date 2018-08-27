/*
 * show 上线应派
 * @author:zhouting
 * @version:20180502
 */
import React from 'react';
import { connect } from 'dva';
import { Row,Col } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as styles from '../../styles/settlement.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import OnlineComponent from '../../components/settlement/Online.js';

class Online extends React.Component {
   constructor(props){
        super(props);
        this.state = {
            itemList :[{
                name:'工作台',
                url:'/#/portal/home'
            },{
                name:'结算管理',
                url:'/#/settlement/settlementManage'
            },{
                name:'上线实派',
            }]
        }
    }
  render() {
    return(
        <ProtalLayout location={location}>
            <div style={{width: '100%'}}>
                <BreadcrumbLayout itemList={this.state.itemList} />
                <Col className={styles.content}>
                    <OnlineComponent />
                </Col>
            </div>
        </ProtalLayout>
    )
  }
}
export default connect()(Online);