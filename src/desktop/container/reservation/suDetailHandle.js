import { connect } from 'dva';
import { Col, Tabs } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as styles from '../../styles/sys.css';
import * as orderStyles from '../../styles/ordersummary.css';
import SvDetailHandle from "../../components/reservation/SvDetailHandle";
import SuDetailHandle from "../../components/reservation/SuDetailHandle";
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';

const suDetailHandle = ({ location,params,dispatch })=>{
  let itemList = [{
    name: '我的预约',
    url: '/#/portal/home'
  }];
  if(params.key == '1'){
    itemList.push({
      name: '业务支援',
      url: '/#/portal/reservation/1',
    },{
      name: '详情',
      url: `/#/portal/suDetailHandle/${params.supportType}/${params.status}/${params.supportId}/1`,
    });
  }

  const onTabClick = function(value){
    if(value == '1'){
      window.location.hash = '/portal/reservation/1';
    }else if(value == '2'){
      window.location.hash = '/portal/reservation/2';
    }
  }

  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <div className={styles.bread}>
          <BreadcrumbLayout itemList={itemList} />
        </div>

        <div style={{width: '100%'}}>
          <Col className={orderStyles.content}>
            <br/>
            <Tabs defaultActiveKey={params.key||'1'} type="card" onTabClick={onTabClick}>

              <Tabs.TabPane tab="业务支援" key='1'>
                <br/>
                <SuDetailHandle dispatch={dispatch} supportId={params.supportId} supportType={params.supportType} status={params.status}/>
              </Tabs.TabPane>

              <Tabs.TabPane tab="增值服务" key='2'>
                <br/>
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </div>
      </div>
    </ProtalLayout>
  );
}

export default connect()(suDetailHandle);



