import React from 'react';
import { Menu,Dropdown,message,Form,Tabs,Checkbox,Input,Row,Col, Button, Select,Table, DatePicker,Tooltip,Icon,InputNumber,Modal,Cascader } from 'antd';
import * as service from '../../services/order';
import * as styles from '../../styles/orderDetail.css';
import * as style from '../../styles/ordersummary.css';
import * as commonStyle from '../../styles/common.css';
import * as codeService from '../../services/code';
import Download from '../common/Download';
import * as util from '../../utils/common';
import Modals from '../common/modal/Modal';
import moment from 'moment';


function formatCurrency(num) {
  if(typeof num == 'undefined' || num == null){
    return ''
  }else{
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
      num = "0";
    let sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    let cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10)
      cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
      num = num.substring(0,num.length-(4*i+3))+','+
        num.substring(num.length-(4*i+3));
    return (((sign)?'':'-') + num + '.' + cents);
  }
}

const FormItem = Form.Item;
const Option = Select.Option;
//tab 页面
const TabPane = Tabs.TabPane;

class OrderBondsComponents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetail: {},
      pendingData: [],
      commissionList: [],
      code: {},
      statusHisList:[],
      codeList: {
        orderCurrencyCode: [],
        renewalStatus: [],
      }
    };
  }

  componentWillMount() {
    let params = {
      orderCurrencyCode: 'PUB.CURRENCY',
      renewalStatus: 'ORD.RENEWAL_STATUS',
    };
    codeService.getCode(params).then((data)=>{
      this.setState({
        codeList: data,
      });
    });
    //订单信息
    if (this.props.prePage == 'team') {
      service.fetchOrderTeamList({params:{orderId:this.props.orderId}}).then((data)=>{
        if (data.success) {
          const orderDetail = data.rows[0] || {};
          if (orderDetail.currency) {
            this.state.codeList.orderCurrencyCode.map((code) => {
              if (code.value == orderDetail.currency) {
                orderDetail.currencyMeaning = code.meaning;
                return;
              }
            });
          }
          orderDetail.updateStatus = false;
          //渠道在需复查状态下才可以修改预约信息。
          if (orderDetail.status == 'NEED_REVIEW') {
            orderDetail.updateStatus = true;
          }
          this.setState({orderDetail: orderDetail});
        }
      });
    } else {
      service.fetchOrderDetail({orderId:this.props.orderId}).then((data)=>{
        if (data.success) {
          const orderDetail = data.rows[0] || {};
          if (orderDetail.currency) {
            this.state.codeList.orderCurrencyCode.map((code) => {
              if (code.value == orderDetail.currency) {
                orderDetail.currencyMeaning = code.meaning;
                return;
              }
            });
          }
          orderDetail.updateStatus = false;
          //渠道在需复查状态下才可以修改预约信息。
          if (orderDetail.status == 'NEED_REVIEW') {
            orderDetail.updateStatus = true;
          }
          this.setState({orderDetail: orderDetail});
        }
      });
    }
    //pending照会
    service.fetchOrderDetailPendingList({orderId:this.props.orderId}).then((data)=>{
      if (data.success) {
        const pendingData = data.rows || [];
        pendingData.map((row, index) => {
          row.key = index;
        });
        this.setState({pendingData: pendingData});
      }
    });
    //佣金明细
    service.fetchOrderDetailordCommissionList({orderId:this.props.orderId}).then((data)=>{
      if (data.success) {
        const commissionList = data.rows || [];
        commissionList.map((row, index) => {
          row.key = index;
        });
        this.setState({commissionList: commissionList});
      }
    });
    //状态跟进信息
    service.fetchOrderDetailordStatusHisList({orderId:this.props.orderId}).then((data)=>{
      if (data.success) {
        const statusHisList = data.rows || [];
        statusHisList.map((row, index) => {
          row.key = index;
        });
        this.setState({statusHisList: statusHisList});
      }
    });
  }

  cancelOrder(){
    Modals.warning(this.cancelOrderConfirm.bind(this),"您确定进行取消债券订单吗？");
  }

  cancelOrderConfirm(flag){
    if(flag){
      service.updateOrderStatus([{orderId: this.state.orderDetail.orderId,status: "CANCELLED"}]).then((data)=>{
        if (data.success) {
          Modal.success({
            title: '提交成功！'
          });
          location.hash = '#/order/bonds/personal';
        } else {
          Modal.error({
            title: '提交失败！',
            content: `请联系系统管理员,${data.message}`,
          });
        }
      });
    }
  }

  lod(){
    location.hash = '#production/subscribe/ZQ/orderUpdate/' + this.state.orderDetail.orderId;
  }

  //查看日志
  orderShowLog(orderDetail){
    service.fetchOrderDetailordStatusHisList({orderId:orderDetail.orderId}).then((data)=>{
      const statusHisList = data.rows || [];
      this.setState({statusHisList: statusHisList});
      Modals.LogModel({List:this.state.statusHisList});
    });
  }

  render() {
    //pending 照会
    const pendingColumns = [{
      title: 'pending编号',
      dataIndex: 'pendingNumber',
      key: 'pendingNumber',
    }, {
      title: 'pending类别',
      dataIndex: 'applyClassDesc',
      key: 'applyClassDesc',
    }, {
      title: 'pending项目名称',
      dataIndex: 'applyItem',
      key: 'applyItem',
    },{
      title: '最后更新时间',
      dataIndex: 'lud',
      key: 'lud',
    },{
      title: '处理截止时间',
      dataIndex: 'dealEndDate',
      key: 'dealEndDate',
    },{
      title: '处理人',
      dataIndex: 'dealPersonName',
      key: 'dealPersonName',
    },{
      title: '状态',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
    },{
      title: '跟进',
      dataIndex: 'grade',
      key: 'grade',
      render: (text, record) =>{
      return (
        <div>
          <Button type='primary' onClick={()=>location.hash = '#/orderPending/OrderPendingTrail/bonds/person/'+record.orderId+'/'+record.pendingId} style={{ marginLeft: 8 ,fontSize:'14px',height:'30px',width : '80px',fontWeight:'normal'}}>
            跟进
          </Button>
        </div>
      )
    }
    }];

    //佣金明细
    let commissionCol = [];
    if (this.props.prePage == 'team') {
      commissionCol.push({
        title: '人员',
        dataIndex: 'commissionPerson',
        key: 'commissionPerson',
      })
    }
    commissionCol.push({
      title: '产品',
      dataIndex: 'itemName',
      key: 'itemName',
    }, {
      title: '佣金率',
      dataIndex: 'theFirstYear',
      key: 'theFirstYear',
      render: (text, record, index) => {
        if (text) {
          return Math.round(text*10000)/100+'%';
        } else {
          return '';
        }
      }
    }, {
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
    }, {
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
    });

    const rowSelection = {
      onChange: this.onSelectChange,
    };

    const orderDetail = this.state.orderDetail;
    const pendingData = this.state.pendingData;
    const commissionList = this.state.commissionList;
    const statusHisList = this.state.statusHisList;

    let orderStatusColor;
    if(orderDetail.status === 'POLICY_EFFECTIVE'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'SIGNED'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'RESERVE_SUCCESS'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'NEW'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'NEED_REVIEW'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'SURRENDERING'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'SURRENDER_APPLY'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'SURRENDERED'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'PENDING'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'APPROVING'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'ARRIVAL'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'RESERVE_FAIL'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'RESERVING'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'APPROVED'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'CANCELLED'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'CONFIRMED'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'UNCONFIRMED'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'DATA_APPROVED'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'DATA_APPROVING'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'LEAVE'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'EXPIRED'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'SUSPENDED'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'DECLINED'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'RESERVE_CANCELLED'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'NEGOTIATE'){
      orderStatusColor = '#CCB57D';
    }else if(orderDetail.status === 'BUY_SUCCESS'){
      orderStatusColor = '#CCB57D';
    }

    //状态跟进
    const menu = (
      <Menu  style={{height : '350px',width : '290px' ,overflow:'scroll'}}>
        {
          statusHisList.map((item)=>
            <Menu.Item key={item.statusHisId}>{item.statusDate}&nbsp;{item.meaning}&nbsp;{item.description}</Menu.Item>
          )
        }
      </Menu>
    );

    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
      wrapperCol: {
        xs: {span: 20},
        sm: {span: 12},
      },
    };
    const addItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 20},
        sm: {span: 17},
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 20,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 6,
        },
      },
    };


    /**
     * 删除动态增加的输入框
     */
    const removeInsurance = (k) => {
      const keys = form.getFieldValue('keys');

      if (keys.length === 0) {
        return;
      }
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      });
    };

    /**
     * 动态添加输入框
     */
    const addInsurance = () => {
      insuranceid++;
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(insuranceid);

      form.setFieldsValue({
        keys: nextKeys,
      });
    };



    //验证手机号
    const checkPhone = (rule, value, callback) => {
      // const form = this.props.form;
      var regex = /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/;
      if (value && !regex.test(value)) {
        callback('手机号格式不正确！');
      } else {
        callback();
      }
    };


    /**
     * 点击提交按钮执行的函数
     */
    const handleSubmit = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          //校验通过就提交到后台

        } else {
          Modal.error({
            title: '提交失败！',
            content: '请正确填写完相关信息',
          });
        }
      });
    };


    return (
      <div>
        <Form onSubmit={handleSubmit}>
          {/*订单详情*/}
          <div>
            <div style={{margin:'28px 12px',paddingBottom:'28px'}}>
              <span className={commonStyle.iconL}></span>
              <span className={commonStyle.iconR}>债券详情<span style={{fontSize:'18px'}}>(债券编号：{orderDetail.orderNumber})</span></span>
              {
                orderDetail.updateStatus ?
                  <span style={{float:'right',padding: '10px'}}>
                    <Button type='priamry' style={{ marginLeft:8,fontSize:'16px',height:'40px',width :'140px',fontWeight:'normal'}} onClick={()=>location.hash = '#/production/subscribe/ZQ/order/' +orderDetail.orderId }>
                      资料修改
                    </Button>
                  </span>
                  :
                  ""
              }
              <span style={{float:'right',padding: '10px'}}>
              {
                orderDetail.status !== 'WAITING_ISSUE' &&
                orderDetail.status !== 'ISSUE_SUCCESS' &&
                orderDetail.status !== 'RESERVE_CANCELLED'
                ?
                <Button type='primary' style={{marginLeft:8,fontSize:'16px',height:'40px',width :'140px',fontWeight:'normal'}} onClick={this.cancelOrder.bind(this)} >
                  取消预约
                </Button>
                : ''
              }
              </span>
            </div>
            <div style={{marginTop:'28px'}}>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}} label="当前状态">
                    <span style={{color:orderStatusColor,fontSize:'16px'}}>{orderDetail.statusDesc}</span>
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="状态跟进">
                    {getFieldDecorator('orderStatusFollow', {})(
                      <Button type='primary' onClick={this.orderShowLog.bind(this,orderDetail)} style={{fontSize:'16px',height:'35px',width:'60%',fontWeight:'normal'}} >订单日志状态跟进</Button>

                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="订单编号">
                    {getFieldDecorator('orderNumber', {
                      initialValue:orderDetail.orderNumber || '',
                      rules: [{ whitespace: true }],
                    })(
                      <Input size="large"  style={{fontSize:'22px'}} readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="股票代码">
                    {getFieldDecorator('stockCode', {
                      initialValue:orderDetail.stockCode || '',
                      rules: [{whitespace: true }],
                    })(
                      <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="产品名称">
                    {getFieldDecorator('itemName', {
                      initialValue:orderDetail.itemName || '',
                      rules: [{whitespace: true }],
                    })(
                      <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="年期">
                    {getFieldDecorator('investedSubline', {
                      initialValue:orderDetail.investedSubline || '',
                      rules: [{whitespace: true }],
                    })(
                      <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="币种">
                    {getFieldDecorator('currency', {
                      initialValue: orderDetail.currencyMeaning || '',
                    })(
                      <Input size="large" readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="金额">
                    {getFieldDecorator('policyAmount', {
                      initialValue:formatCurrency(orderDetail.policyAmount) || '',
                    })(
                      <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="年利息">
                    {getFieldDecorator('annualInterest', {
                      initialValue:orderDetail.annualInterest || '',
                      rules: [{ whitespace: true }],
                    })(
                      <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="认购费">
                    {getFieldDecorator('subscriptionFee', {
                      initialValue:orderDetail.subscriptionFee || '',
                      rules: [{ whitespace: true }],
                    })(
                      <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="托管费">
                    {getFieldDecorator('custodyFee', {
                      initialValue:orderDetail.custodyFee || '',
                      rules: [{ whitespace: true }],
                    })(
                      <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="客户">
                    {getFieldDecorator('applicant', {
                      initialValue:orderDetail.applicant || '',
                      rules: [{ whitespace: true }],
                    })(
                      <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="渠道">
                    {getFieldDecorator('channelName', {
                      initialValue:orderDetail.channelName || '',
                      rules: [{ whitespace: true }],
                    })(
                      <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
          </div>
          {/*时间信息*/}
          <div>
            <div style={{margin:'28px 12px',paddingBottom:'28px',borderBottom:'1px solid #dbdbdb'}}>
              <span className={commonStyle.iconL}></span>
              <span className={commonStyle.iconR}>时间信息</span>
            </div>
            <Row gutter={40} >
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="提交时间">
                  {getFieldDecorator('submitDate', {
                    initialValue: (orderDetail.submitDate || '').substr(0,16)
                  })(
                    <Input size="large" readOnly={true}/>
                  )}
                </FormItem>
              </Col>
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="签单时间">
                  {getFieldDecorator('reserveDate', {
                    initialValue: (orderDetail.reserveDate || '').substr(0,16)
                  })(
                    <Input size="large" readOnly={true}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40} >
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="发行日期">
                  {getFieldDecorator('issueDate', {
                    initialValue: (orderDetail.issueDate || '').substr(0,10)
                  })(
                    <Input size="large" readOnly={true}/>
                  )}
                </FormItem>
              </Col>
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="派息周期">
                  {getFieldDecorator('dividendPeriod', {
                    initialValue:(orderDetail.dividendPeriod || '').substr(0,16),
                    rules: [{ whitespace: true }],
                  })(
                    <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40} >
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="派息日期">
                  {getFieldDecorator('dividendDate1', {
                    initialValue: (orderDetail.dividendDate||'').substr(0,10),
                  })(
                    <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                  )}
                </FormItem>
              </Col>
              <Col span={11}>
              </Col>
            </Row>
          </div>
          {/*Tab */}
          <div style={{margin:'28px 12px'}}>
            <Tabs defaultActiveKey="1"   type="card">
              <TabPane tab="预约确认信息" key="1">
                <Row gutter={40} >
                  <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="产品经理">
                      {getFieldDecorator('productManager', {
                        initialValue:orderDetail.productManager || '',
                        rules: [{whitespace: true }],
                      })(
                        <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="联络电话">
                      {getFieldDecorator('productManagerPhone', {
                        initialValue:orderDetail.productManagerPhone || '',
                        rules: [{ whitespace: true }],
                      })(
                        <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={40} >
                  <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="联络人">
                      {getFieldDecorator('contactPerson', {
                        initialValue:orderDetail.contactPerson || '',
                        rules: [{ whitespace: true }],
                      })(
                        <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                    <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="联络电话">
                      {getFieldDecorator('contactPhone', {
                        initialValue:orderDetail.contactPhone || '',
                        rules: [{ whitespace: true }],
                      })(
                        <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={40} >
                  <Col span={11} >
                    <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="见面地址">
                      {getFieldDecorator('meetAddress', {
                        initialValue:orderDetail.meetAddress || '',
                      })(
                        <Input size="large" readOnly={true} style={{width:'830px'}}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </TabPane>
              {
                JSON.parse(localStorage.user).userType == "ADMINISTRATION" ? ""
                :
                this.props.prePage != 'introduction' ?
                  <TabPane tab="佣金明细" key="2">
                    <div className={styles.item_div2}>
                      <div className={style.order_table}>
                        <Table rowKey="key" pagination={false} dataSource={commissionList} columns={commissionCol} scroll={{x:'100%'}} bordered/>
                      </div>
                    </div>
                  </TabPane>
                  :
                  ''
              }
              <TabPane tab="Pending照会" key="3">
                <div className={styles.item_div2}>
                  <div className={style.order_table}>
                    <Table rowKey="key" columns={pendingColumns} dataSource={pendingData} pagination={false} scroll={{x:'100%'}} bordered/>
                  </div>
                </div>
              </TabPane>
              <TabPane tab={<span onClick={this.lod.bind(this)}>预约资料</span>} key="4">
                {/*基本信息*/}
                <div className={styles.item_div}>
                  <b className={styles.b_sty}>|</b>
                  <font className={styles.title_font} style={{fontSize:'22px'}}>基本信息</font>
                  <Row gutter={40} >
                    <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                      <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="客户名称">
                        {getFieldDecorator('vaccineCustomerName', {
                          initialValue:orderDetail.vaccineCustomerName || '',
                          rules: [{ whitespace: true }],
                        })(
                          <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                      <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="性别">
                        {getFieldDecorator('vaccineCustomerSex', {
                          initialValue:orderDetail.vaccineCustomerSex || '',
                          rules: [{ whitespace: true }],
                        })(
                          <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={40} >
                    <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                      <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="客户语言">
                        {getFieldDecorator('hkContactPerson', {
                          initialValue:orderDetail.hkContactPerson || '',
                          rules: [{ whitespace: true }],
                        })(
                          <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                      <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="持有香港银行卡">
                        {getFieldDecorator('hkContactPhone', {
                          initialValue:orderDetail.hkContactPhone || '',
                          rules: [{ whitespace: true }],
                        })(
                          <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={40} >
                    <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                      <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="持有证券账户">
                        {getFieldDecorator('hkContactPerson', {
                          initialValue:orderDetail.hkContactPerson || '',
                          rules: [{ whitespace: true }],
                        })(
                          <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                      <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="个人专业投资者">
                        {getFieldDecorator('hkContactPhone', {
                          initialValue:orderDetail.hkContactPhone || '',
                          rules: [{ whitespace: true }],
                        })(
                          <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={40} >
                    <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                      <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="客户联系电话">
                        {getFieldDecorator('customerPhone', {
                          initialValue:orderDetail.customerPhone || '',
                          rules: [{ whitespace: true }],
                        })(
                          <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                      <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="电子邮箱">
                        {getFieldDecorator('firstPaymentMethod', {
                          initialValue:orderDetail.firstPaymentMethod || '',
                          rules: [{ whitespace: true }],
                        })(
                          <Input size="large" style={{fontSize:'22px'}} readOnly={true}/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={40} >
                    <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                      <FormItem {...formItemLayout} className={styles.formitem_sty}  style={{fontSize:'16px'}} label="预约时间">
                        {getFieldDecorator('reserveDate', {
                          initialValue: moment(orderDetail.reserveDate || '', 'YYYY/MM/DD')
                        })(
                          <DatePicker format='YYYY/MM/DD' style={{width:'100%'}} readOnly={true} disabled={true}/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Form>
      </div>
    );
  }
}


export default Form.create()(OrderBondsComponents);
