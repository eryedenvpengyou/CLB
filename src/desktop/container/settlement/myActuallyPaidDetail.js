/*
 * show 我的实付详情
 * @author:zhouting
 * @version:20180502
 */
import React from 'react';
import { connect } from 'dva';
import { Row,Col } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as styles from '../../styles/settlement.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import MyActuallyPaidDetailComponent from '../../components/settlement/MyActuallyPaidDetail.js';

const MyActuallyPaidDetail =({location,dispatch,params})=>{
    const itemList = [{
        name: '工作台',
        url: '/#/portal/home'
    }, {
        name: '结算管理',
        url: '/#/settlement/settlementManage'
    }, {
        name: '我的实付',
        url: '/#/settlement/myActuallyPaid'
    }, {
        name: '详情',
    }]

    return (
        <ProtalLayout location={location}>
            <div style={{ width: '100%' }}>
                <BreadcrumbLayout itemList={itemList} />
                <Col className={styles.content}>
                    <MyActuallyPaidDetailComponent 
                     dispatch={dispatch}
                     actualSummaryId= {params.actualSummaryId}
                     settleCurrency={params.settleCurrency}
                     settlementSummaryType={params.settlementSummaryType}
                     receiveCompanyId={params.receiveCompanyId}
                     receiveCompanyType={params.receiveCompanyType}
                    />
                </Col>
            </div>
        </ProtalLayout>
    )

}
export default connect()(MyActuallyPaidDetail);