/*
 * show 上线应派详情
 * @author:zhouting
 * @version:20180502
 */
import React from 'react';
import { connect } from 'dva';
import { Row,Col } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as styles from '../../styles/settlement.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import OnlineDetailComponent from '../../components/settlement/OnlineDetail.js';

const OnlineDetail =({location,dispatch,params})  =>{
    const itemList = [{
        name: '工作台',
        url: '/#/portal/home'
    }, {
        name: '结算管理',
        url: '/#/settlement/settlementManage'
    }, {
        name: '上线应派',
        url: '/#/settlement/online'
    }, {
        name: '详情',
    }]

    return (
        <ProtalLayout location={location}>
            <div style={{ width: '100%' }}>
                <BreadcrumbLayout itemList={itemList} />
                <Col className={styles.content}>
                    <OnlineDetailComponent
                        dispatch={dispatch}
                        actualSummaryId={params.actualSummaryId}
                        receiveFlag={params.receiveFlag}
                        settlementSummaryType={params.settlementSummaryType}
                        settlementSummaryId={params.settlementSummaryId}
                    />
                </Col>
            </div>
        </ProtalLayout>
    )
}

export default connect()(OnlineDetail);