import React  , { Component } from 'react';
import {Link} from 'dva/router'
import {Menu,Form, Row, Col, Input,Tabs,Table, Button} from 'antd';
import * as commonStyle from '../../styles/common.css';
import Modals from '../common/modal/Modal';
import * as service from '../../services/order';
import * as styles from '../../styles/common.css'
import * as styles2 from '../../styles/order.css'
import * as productStyle from '../../styles/production.css'
import { getCode } from '../../services/code';
import CustomerLov from "../common/CustomerLov";
const TabPane = Tabs.TabPane;

const FormItem = Form.Item;
class  orderGDYLDetail extends Component {
  constructor(props){
    super(props);
    this.state = {
     orderDetail:[],
     codeList: {
        statusList: [],
        currencyList:[]
      },
     commissionList:[],
     statusHisList:[]
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
        const orderDetail = data.rows[0] || {};
        if (orderDetail.currency) {
          this.state.codeList.currencyList.map((code) => {
            if (code.value == orderDetail.currency) {
              orderDetail.currencyMeaning = code.meaning;
              return;
            }
          });
        }
        this.setState({orderDetail: orderDetail});
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
  orderShowLog(){
    service.fetchOrderDetailordStatusHisList({orderId:this.props.orderId}).then((data)=>{
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
      if (item.value == this.state.orderDetail.currency) {
        currencyDesc = item.meaning;
      }
    })
    return (
      <div className={productStyle.disableds}>
        <Form>
        <div style={{margin:'28px 12px',paddingBottom:'28px'}}>
          <span className={commonStyle.iconL}></span>
          <span className={commonStyle.iconR}>订单详情<span style={{fontSize:'18px'}}>(订单编号：{this.state.orderDetail.orderNumber})</span></span>
        </div>
        <div style={{marginTop:'28px'}} >
          <Row gutter={40} >
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout} label={<span style={{ color:JSON.parse(localStorage.theme).themeColor }}>订单状态</span>} className={styles.formitem_sty} style={{ fontSize: '16px' }}>
                {
                  this.state.codeList.statusList.map((code, index) => {
                    if (this.state.orderDetail.status == code.value) {
                      return <span style={{ color: JSON.parse(localStorage.theme).themeColor, fontSize: '16px' }} key={index}>{code.meaning}</span>
                    }
                  })
                }
              </FormItem>
            </Col>
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}} label="订单跟进">
                  <Button type='primary' style={{fontSize:'16px',height:'35px',fontWeight:'normal'}} 
                   onClick={this.orderShowLog.bind(this)}
                  >操作日志</Button>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40} >
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>产品名称</span>}>
                <Input disabled value={this.state.orderDetail.noticeItem || ''}/>
              </FormItem>
            </Col>
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>订单金额</span>}>
                <Input disabled value={
                  this.state.orderDetail.policyAmount ? (this.state.orderDetail.policyAmount + '' + currencyDesc) : '0.00' + currencyDesc
                }/>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40} >
            <Col span={11} style={{ paddingLeft: '0', paddingRight: '0' }}>
              <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>客户</span>}>
                <Input disabled value={this.state.orderDetail.applicant || ''}/>
              </FormItem>
            </Col>
            {
              this.props.prePage == 'team'&&
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>渠道</span>}>
                  <Input disabled value={this.state.orderDetail.channelName || ''}/>
                </FormItem>
              </Col>
            }
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
                <Input value={this.state.orderDetail.submitDate || ''} disabled={true}/>
              </FormItem>
            </Col>
            <Col span={11} style={{marginTop:'20px'}} >
              <FormItem {...formItemLayout}  label={<span className={styles2.item_font_form}>预约时间</span>}>
                <Input value={this.state.orderDetail.reserveDate || ''} disabled={true}/>
              </FormItem>
            </Col>
          </Row>
        </div>

        <div style={{margin:'30px 14px 0px 12px'}}>
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="预约确认信息" key="1">
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>医疗中心名称</span>}>
                    <Input value={this.state.orderDetail.flightNum || ''} disabled={true}/>
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>医疗中心地址</span>}>
                    <Input value={this.state.orderDetail.medicalCentreAddress || ''} disabled={true}/>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>联系电话</span>}>
                    <Input value={this.state.orderDetail.medicalCentrePhoneNumber?`（${this.state.orderDetail.medicalCentrePhoneCode}）${this.state.orderDetail.medicalCentrePhoneNumber}` : ''} disabled={true}/>
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>备注</span>}>
                      <Input value={this.state.orderDetail.medicalCentreRemarks || ''} disabled={true}/>
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
              pathname: `/production/subscribe/YJ/GDYL/${this.state.orderDetail.itemId}`,
              query: {flag: 'query', prePage: this.props.prePage ,orderId: this.state.orderDetail.orderId, status:  this.state.orderDetail.status,orderNumber: this.state.orderDetail.orderNumber}
            }}>预约资料</Link>}>
            </TabPane>
          </Tabs>
        </div>
        </Form>
      </div>
    );
  }
}

export default Form.create()(orderGDYLDetail);
