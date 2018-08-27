/*
 * show 结算管理
 * @author:zhouting
 * @version:20180425
 */
import React from 'react';
import { connect } from 'dva';
import { Row,Col } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import SettlementManageComponent from '../../components/settlement/SettlementManage.js';
import banner from '../../styles/images/settlement/banner.png';

class SettlementManage extends React.Component {
   constructor(props){
        super(props);
        this.state = {
            itemList :[{
                name:'工作台',
                url:'/#/portal/home'
            },{
                name:'结算管理'
            }]
        }
    }
  render() {
    return(
        <ProtalLayout location={location}>
            <div>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <img src={banner} alt="" width='100%'/>
                    </Col>
                </Row>
                <div>
                    {/*面包屑*/}
                    <BreadcrumbLayout itemList={this.state.itemList} />
                    <SettlementManageComponent />
                </div>
            </div>
        </ProtalLayout>
    )
  }
}
export default connect()(SettlementManage);