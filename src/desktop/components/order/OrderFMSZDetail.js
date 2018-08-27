import React  , { Component } from 'react';
import {Link} from 'dva/router'
import {Menu,Form, Row, Col, Input,Tabs,Table, Button} from 'antd';
import * as commonStyle from '../../styles/common.css';
import Modals from '../common/modal/Modal';
import * as service from '../../services/order';
//import * as service from '../../services/maxim';
import * as styles from '../../styles/common.css'
import * as styles2 from '../../styles/order.css'
import * as productStyle from '../../styles/production.css'
import { getCode } from '../../services/code';
import CustomerLov from "../common/CustomerLov";
const TabPane = Tabs.TabPane;

const FormItem = Form.Item;
class  orderFMSZDetail extends Component {
  constructor(props){
    super(props);
    this.state = {
     orderFMSZDetail:[],
     codeList: {
        statusList: [],
        currencyList:[]
      },
     commissionList:[]
    }
  }
  componentWillMount() {
      //获取快码值
    const codeBody = {
        statusList: 'ORD.MEDICAL_EDU',
        currencyList:'PUB.CURRENCY'//币种
      };
      getCode(codeBody).then((data)=>{
        this.setState({
          codeList: data
        });
      });
    service.fetchOrderDetail({orderId:this.props.orderId}).then((data)=>{
      if (data.success) {
        const orderFMSZDetail = data.rows[0] || {};
        if (orderFMSZDetail.currency) {
          this.state.codeList.currencyList.map((code) => {
            if (code.value == orderFMSZDetail.currency) {
              orderFMSZDetail.currencyMeaning = code.meaning;
              return;
            }
          });
        }
        this.setState({orderFMSZDetail: orderFMSZDetail});
      }
      });
    //佣金明细
    service.fetchOrderDetailordCommissionList({ orderId: this.props.orderId }).then((data) => {
        const cList = data.rows ? data.rows : [];
        cList.map((row, index) => {
            row.key = index;
        });
        this.setState({ commissionList: cList });
    });
  }

  //查看日志
  orderShowLog(fields){
    let params = {orderId:this.props.orderId};
    service.fetchOrderDetailordStatusHisList(params).then((data)=>{
      const statusHisList = data.rows || [];
      this.setState({statusHisList: statusHisList});
      Modals.LogModel({List:this.state.statusHisList});
    });
  }
  personSelect(value){
    this.props.form.setFieldsValue(
      {person:value.value}
    )
  }
  //取消订单
  cancelOrder(){
    Modals.warning(this.orderCancel.bind(this),"您确定取消订单吗？");
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
    //当订单状态为“预约中”“预约成功”时，订单详情页面右上角出现“取消预约”功能键
    let statusFalg = true;
    if(this.state.orderFMSZDetail.status =='RESERVE_CANCELLED'||this.state.orderFMSZDetail.status =='BUY_SUCCESS'){
      statusFalg = false;
    }
    const fields =this.state.mxDetail;
    const columns = [
      {
        title: '产品名称',
        dataIndex: 'itemName',
        key: 'itemName',
      },
      {
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
      },
      {
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
      },
      {
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
      }];
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
      wrapperCol: {
        xs: {span: 20},
        sm: {span: 12},
      },
    }
    let currencyDesc = '';
    this.state.codeList.currencyList.map(item => {
      if (item.value == this.state.orderFMSZDetail.currency) {
        currencyDesc = item.meaning;
      }
    })
    return (
      <div className={productStyle.disableds}>
        <Form>
        <div style={{margin:'28px 12px',paddingBottom:'28px'}}>
          <span className={commonStyle.iconL}></span>
          <span className={commonStyle.iconR}>订单详情<span style={{fontSize:'18px'}}>(订单编号：{this.state.orderFMSZDetail.orderNumber})</span></span>
          { this.props.prePage == 'personal' && statusFalg&&
            <span  style={{float:'right'}}>
              <Button type='default' style={{ marginLeft: 8 ,fontSize:'16px',height:'40px',width:'140px',fontWeight:'normal'}} onClick={this.cancelOrder.bind(this)}>
                取消预约
              </Button>
            </span>
          }
          {
            (this.state.orderFMSZDetail.status == 'NEED_REVIEW' || this.state.orderFMSZDetail.status == 'NEW' || this.state.orderFMSZDetail.status == 'APPROVING') &&this.props.prePage == 'personal' && 
            <span  style={{float:'right'}}>
            <Link to={{
            pathname: `/production/subscribe/YJ/FMSZ/${this.state.orderFMSZDetail.itemId}`,
            query: {flag: 'update', orderId: this.state.orderFMSZDetail.orderId, orderNumber: this.state.orderFMSZDetail.orderNumber}
          }}>
            <Button type='default' style={{ marginLeft: 8 ,fontSize:'16px',height:'40px',width:'140px',fontWeight:'normal'}}>
            修改订单
            </Button>
            </Link>
            </span>
          }
        </div>
        <div style={{marginTop:'28px'}} >
          <Row gutter={40} >
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout} label={<span style={{ color:JSON.parse(localStorage.theme).themeColor }}>订单状态</span>} className={styles.formitem_sty} style={{ fontSize: '16px' }}>
                {
                  this.state.codeList.statusList.map((code, index) => {
                    if (this.state.orderFMSZDetail.status == code.value) {
                      return <span style={{ color: JSON.parse(localStorage.theme).themeColor, fontSize: '16px' }} key={index}>{code.meaning}</span>
                    }
                  })
                }
              </FormItem>
            </Col>
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}} label="订单跟进">
                <Link to={{
                  pathname: `/order/followOrderState/${this.state.orderFMSZDetail.orderId}`,
                }}>
                  <Button type='primary' style={{fontSize:'16px',height:'35px',fontWeight:'normal'}} >订单进度跟进</Button>
                </Link>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40} >
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>产品名称</span>}>
                <Input disabled value={this.state.orderFMSZDetail.noticeItem || ''}/>
              </FormItem>
            </Col>
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>订单金额</span>}>
                <Input disabled value={
                  this.state.orderFMSZDetail.payAmount ? (this.state.orderFMSZDetail.policyAmount + '' + currencyDesc) : '0.00' + currencyDesc
                }/>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40} >
            <Col span={11} style={{ paddingLeft: '0', paddingRight: '0' }}>
              <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>客户</span>}>
                <Input disabled value={this.state.orderFMSZDetail.applicant || ''}/>
              </FormItem>
            </Col>
            {
              this.props.prePage == 'team'&&
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>渠道</span>}>
                  <Input disabled value={this.state.orderFMSZDetail.channelName || ''}/>
                </FormItem>
              </Col>
            }
          </Row>
          <Row gutter={40} >
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>已交定金</span>}>
                <Input disabled value={this.state.orderFMSZDetail.payAmount + currencyDesc || ''}/>
              </FormItem>
            </Col>
          </Row>
        </div>

        <div style={{margin:'28px 12px',paddingBottom:'28px',borderBottom:'1px solid #dbdbdb'}}>
          <span className={commonStyle.iconL}></span>
          <span className={commonStyle.iconR}>时间信息</span>
        </div>
        <div style={{marginTop:'28px'}}>
          <Row gutter={40} >
            <Col span={11} style={{marginTop:'20px'}} >
              <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>提交时间</span>}>
                <Input value={this.state.orderFMSZDetail.submitDate || ''} disabled={true}/>
              </FormItem>
            </Col>
            <Col span={11} style={{marginTop:'20px'}} >
              <FormItem {...formItemLayout}  label={<span className={styles2.item_font_form}>预产期</span>}>
                <Input value={this.state.orderFMSZDetail.reserveArrivalDate || ''} disabled={true}/>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={11} style={{marginTop:'20px'}} >
              <FormItem {...formItemLayout}  label={<span className={styles2.item_font_form}>期望面签时间</span>}>
                <Input value={this.state.orderFMSZDetail.reserveDate || ''} disabled={true}/>
              </FormItem>
            </Col>
            <Col span={11} style={{marginTop:'20px'}} >
              <FormItem {...formItemLayout}  label={<span className={styles2.item_font_form}>出境日期</span>}>
                <Input value={this.state.orderFMSZDetail.reserveCheckDate || ''} disabled={true}/>
              </FormItem>
            </Col>
          </Row>
        </div>

        <div style={{margin:'30px 14px 0px 12px'}}>
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="预约确认信息" key="1">
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>航班信息</span>}>
                    <Input value={this.state.orderFMSZDetail.flightNum || ''} disabled={true}/>
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>起飞时间</span>}>
                    <Input value={this.state.orderFMSZDetail.flightTime || ''} disabled={true}/>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>联系人</span>}>
                      <Input value={this.state.orderFMSZDetail.reserveContactPerson || ''} disabled={true}/>
                    </FormItem>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>联系电话</span>}>
                    <Input value={this.state.orderFMSZDetail.reserveContactPhone || ''} disabled={true}/>
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="佣金明细" key="2">
              <div className={styles.item_div} style={{marginTop:"20px",marginBottom:"30px"}}>
                <div className={styles.order_table} style={{marginTop:"20px",marginBottom:"30px"}}>
                  <Table
                  columns={columns}
                  bordered
                  dataSource={this.state.commissionList}
                  scroll={{ x: '100%' }}
                  pagination={false} />
                </div>
              </div>
            </TabPane>
            <TabPane key="3" tab={<Link to={{
              pathname: `/production/subscribe/YJ/FMSZ/${this.state.orderFMSZDetail.itemId}`,
              query: {flag: 'query', orderId: this.state.orderFMSZDetail.orderId, orderNumber: this.state.orderFMSZDetail.orderNumber}
            }}>预约资料</Link>}>
            </TabPane>
          </Tabs>
        </div>
        </Form>
      </div>
    );
  }
}

export default Form.create()(orderFMSZDetail);
