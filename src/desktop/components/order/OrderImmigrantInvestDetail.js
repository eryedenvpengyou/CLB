import React  , { Component } from 'react';
import {Tabs,Table, Button,textarea} from 'antd';
import * as styles from '../../styles/order.css';
import * as commonStyle from '../../styles/common.css';
import  OrderImmigrantInvestDetailTabsForm from './OrderImmigrantInvestDetailTabsForm';
import  OrderImmigrantInvestDetailForm from './OrderImmigrantInvestDetailForm';
import  OrderImmigrantInvestDetailForm2 from './OrderImmigrantInvestDetailForm2';
import Modals from '../common/modal/Modal';
import * as service from '../../services/order';
import { getCode } from '../../services/code';
const TabPane = Tabs.TabPane;

export default class OrderImmigrantInvestDetail extends Component {
  constructor(props){
    super(props);
    this.state = {
      orderDetail: {},
      commissionList: [],
      codeList: {
        currencyCodes: []
      }
    }
  }

  componentWillMount() {
    //获取快码值
    const codeBody = {
      currencyCodes: 'PUB.CURRENCY',
    };
    getCode(codeBody).then((data)=>{
      this.setState({
        codeList: data
      });
    });
    //订单信息
    if (this.props.prePage == 'team') {
      service.fetchOrderTeamList({params:{orderId:this.props.orderId}}).then((data)=>{
        if (data.success) {
          const orderDetail = data.rows[0] || {};
          this.setState({orderDetail: orderDetail});
        }
      });
    } else {
      service.fetchOrderDetail({orderId:this.props.orderId}).then((data)=>{
        if (data.success) {
          const orderDetail = data.rows[0] || {};
          this.setState({orderDetail: orderDetail});
        }
      });
    }
    //佣金明细
    service.fetchOrderDetailordCommissionList({orderId:this.props.orderId}).then((data)=>{
      const cList = data.rows?data.rows:[];
      cList.map((row, index) => {
        row.key = index;
      });
      this.setState({commissionList: cList});
    });
  }

  lod(){
    location.hash = '/production/subscribe/DC/orderQuery/'+this.props.orderId
  }

  //取消订单
  cancelOrder(){
    Modals.warning(this.orderCancel(),"您确定取消订单吗？");
  }
  orderCancel(flag){
    if(flag){
      let params = {};
      params.orderId = this.props.orderId;
      service.fetchCancelOrder(params).then((data) => {
        if (data.success) {
          Modals.success({
            title: '取消成功！'
          });
          this.selectList();
        } else {
          Modals.error({
            title: '提交失败！',
            content: `请联系系统管理员,${data.message}`,
          });
        }
      });
    }
  }


  render() {
    let statusFalg = true;
    if(this.state.orderDetail.status!=='"RESERVE_CANCELLED"'||this.state.orderDetail.status!=='BUY_SUCCESS'){
      statusFalg = false;
    }
    const columns = [
      {
        title: '人员',
        dataIndex: 'commissionPerson',
        key: 'commissionPerson',
      },{
        title: '产品',
        dataIndex: 'itemName',
        key: 'itemName',
      },{
        title: '佣金率',
        dataIndex: 'theFirstYear',
        key: 'theFirstYear',
        render: (text, record) => {
          if (text) {
            return Math.round(text*10000)/100+'%';
          } else {
            return '';
          }
        }
      },{
        title: '应派',
        dataIndex: 'firstYearAmount',
        key: 'firstYearAmount',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          } else {
            return '';
          }
        }
      },{
        title: '实派',
        dataIndex: 'firstYearActual',
        key: 'firstYearActual',
        render: (text, record) => {
          if (text) {
            return (""+Math.round(text * 100) / 100).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
          } else {
            return '';
          }
        }
      }
    ];

    return (
      <div>
        <div style={{margin:'28px 12px',paddingBottom:'28px'}}>
          <span className={commonStyle.iconL}></span>
          <span className={commonStyle.iconR}>订单详情</span>
          {statusFalg&&
          <span  style={{float:'right'}}>
            <Button type='default' style={{ marginLeft: 8 ,fontSize:'16px',height:'40px',width:'140px',fontWeight:'normal'}} onClick={this.cancelOrder.bind(this)}>
              取消预约
            </Button>
          </span>
          }
        </div>
        <div style={{marginTop:'28px'}}>
          <OrderImmigrantInvestDetailForm orderDetail={this.state.orderDetail} orderId={this.props.orderId} />
        </div>

        <div style={{margin:'28px 12px',paddingBottom:'28px',borderBottom:'1px solid #dbdbdb'}}>
          <span className={commonStyle.iconL}></span>
          <span className={commonStyle.iconR}>时间信息</span>
        </div>
        <div style={{marginTop:'28px'}}>
          <OrderImmigrantInvestDetailForm2 orderDetail={this.state.orderDetail} orderId={this.props.orderId} />
        </div>

        <div style={{margin:'30px 14px 0px 12px'}}>
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab='预约确认信息' key="1">
              <div style={{marginBottom:'30px',marginTop:'30px'}}>
                <OrderImmigrantInvestDetailTabsForm orderDetail={this.state.orderDetail} orderId={this.props.orderId} />
              </div>
            </TabPane>
            {
              JSON.parse(localStorage.user).userType == "ADMINISTRATION" ? ""
              :
              this.props.prePage != 'introduction' ?
                <TabPane tab="佣金明细" key="2">
                  <div style={{marginBottom:'30px',marginTop:'20px'}}>
                    <Table pagination={false} dataSource={this.state.commissionList} scroll={{x: '100%'}} columns={columns} bordered/>
                  </div>
                </TabPane>
                :
                ''
            }
            <TabPane tab={<span onClick={this.lod.bind(this)}>预约资料</span>} key="3">
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
