/*
 * show 付款对账单新建
 * @author:zhouting
 * @version:20180427
 */
import React from 'react';
import { connect } from 'dva';
import { Row,Col } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as styles from '../../styles/settlement.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import PaymentNewComponent from '../../components/settlement/PaymentNew.js';

const PaymentNew =({location,dispatch,params})=>{
    const itemList = [
        {
            name: '工作台',
            url: '/#/portal/home'
        }, {
            name: '结算管理',
            url: '/#/settlement/settlementManage'
        }, {
            name: '对账单管理',
            url: '/#/settlement/check/2'
        }, {
            name: '新建',
        }
    ]
    return(
        <ProtalLayout location={location}>
            <div style={{width: '100%'}}>
                <BreadcrumbLayout itemList={itemList} />
                <Col className={styles.content}>
                    <PaymentNewComponent settlementSummaryId={params.settlementSummaryId}/>
                </Col>
            </div>
        </ProtalLayout>
    )
}
export default connect()(PaymentNew);