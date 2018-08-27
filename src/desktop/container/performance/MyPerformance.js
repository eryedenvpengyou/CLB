/*
 * show 我的业绩
 * @author:zhouting
 * @version:20170626
 */
import React from 'react';
import { connect } from 'dva';
import { Row,Col } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
//import SlideshowComponent from '../../components/portal/Slideshow';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import MyPerformanceComponent from '../../components/performance/MyPerformance.js';
import photo1 from '../../styles/images/performance/photo1.png';

class MyPerformance extends React.Component {
   constructor(props){
        super(props);
        this.state = {
            itemList :[{
                name:'工作台',
                url:'/#/portal/home'
            },{
                name:'我的业绩'
            }]
        }
    }
  render() {
    return(
        <ProtalLayout location={location}>
            <div>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <img src={photo1} alt="" width='100%'/>
                    </Col>
                </Row>
                <div>
                    {/*面包屑*/}
                    <BreadcrumbLayout itemList={this.state.itemList} />
                    <MyPerformanceComponent />
                </div>
            </div>
        </ProtalLayout>
    )
  }
}
export default connect()(MyPerformance);
