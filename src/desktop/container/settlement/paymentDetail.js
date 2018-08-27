/*
 * show 付款对账单详情
 * @author:zhouting
 * @version:20180426
 */
import React from 'react';
import { connect } from 'dva';
import { Row,Col } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as styles from '../../styles/settlement.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import PaymentDetailComponent from '../../components/settlement/PaymentDetail.js';

const PaymentDetail =({location,dispatch,params})=>{
    const itemList =[{
        name:'工作台',
        url:'/#/portal/home'
    },{
        name:'结算管理',
        url:'/#/settlement/settlementManage'
    },{
        name:'对账单管理',
        url:'/#/settlement/check/2'
    },{
        name:`对账单详情-收款方 ${params.receiveCompanyName}`,
    }];
    return(
        <ProtalLayout location={location}>
            <div>
                <BreadcrumbLayout itemList={itemList} />
                <Col className={styles.content}>
                    <PaymentDetailComponent  
                        dispatch={dispatch}
                        settlementSummaryId={params.settlementSummaryId}
                        receiveCompanyName={params.receiveCompanyName}
                    />
                </Col>
            </div>
        </ProtalLayout>
    )
}
export default connect()(PaymentDetail);