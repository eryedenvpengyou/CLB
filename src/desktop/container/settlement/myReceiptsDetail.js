/*
 * show 我的实收详情
 * @author:zhouting
 * @version:20180428
 */
import React from 'react';
import { connect } from 'dva';
import { Row,Col } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as styles from '../../styles/settlement.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import MyReceiptsDetailComponent from '../../components/settlement/MyReceiptsDetail.js';

const MyReceiptsDetail =({location,dispatch,params})=>{
    const itemList = [{
        name: '工作台',
        url: '/#/portal/home'
    }, {
        name: '结算管理',
        url: '/#/settlement/settlementManage'
    }, {
        name: '我的实收',
        url: '/#/settlement/myReceipts'
    }, {
        name: '详情',
    }]

    return (
        <ProtalLayout location={location}>
            <div style={{ width: '100%' }}>
                <BreadcrumbLayout itemList={itemList} />
                <Col className={styles.content}>
                    <MyReceiptsDetailComponent
                     dispatch={dispatch}
                     actualSummaryId= {params.actualSummaryId}
                     settleCurrency={params.settleCurrency}
                     settlementSummaryType={params.settlementSummaryType}
                     paymentCompanyId={params.paymentCompanyId}
                     paymentCompanyType={params.paymentCompanyType}
                    />
                </Col>
            </div>
        </ProtalLayout>
    )
}
export default connect()(MyReceiptsDetail);