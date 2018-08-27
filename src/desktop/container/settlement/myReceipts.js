/*
 * show 我的实收
 * @author:zhouting
 * @version:20180428
 */
import React from 'react';
import { connect } from 'dva';
import { Row,Col } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as styles from '../../styles/settlement.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import MyReceiptsComponent from '../../components/settlement/MyReceipts.js';

class MyReceipts extends React.Component {
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
                name:'我的实收',
            }]
        }
    }
  render() {
    return(
        <ProtalLayout location={location}>
            <div style={{width: '100%'}}>
                <BreadcrumbLayout itemList={this.state.itemList} />
                <Col className={styles.content}>
                    <MyReceiptsComponent />
                </Col>
            </div>
        </ProtalLayout>
    )
  }
}
export default connect()(MyReceipts);