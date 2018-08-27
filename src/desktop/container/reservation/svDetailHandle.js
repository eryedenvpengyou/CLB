import { connect } from 'dva';
import { Col, Tabs } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as styles from '../../styles/sys.css';
import * as orderStyles from '../../styles/ordersummary.css';
import SvDetailHandle from "../../components/reservation/SvDetailHandle";
import SuDetailHandle from "../../components/reservation/SuDetailHandle";
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';

const svDetailHandle = ({ location,params,dispatch })=>{
  let itemList = [{
    name: '我的预约',
    url: '/#/portal/home'
  }];
  if(params.key == '2'){
    itemList.push({
      name: '增值服务',
      url: '/#/portal/reservation/2',
    },{
      name: '详情',
      url: `/#/portal/svDetailHandle/${params.midClass}/${params.id}/${params.itemId}/2`,
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
              </Tabs.TabPane>

              <Tabs.TabPane tab="增值服务" key='2'>
                <br/>
                <SvDetailHandle midClass={params.midClass} id={params.id} itemId={params.itemId}/>
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </div>
      </div>
    </ProtalLayout>
  );
}

export default connect()(svDetailHandle);
