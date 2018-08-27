import React  , { Component } from 'react';
import {Menu,Form, Row, Col, Input,Tabs,Table, Button} from 'antd';
import * as commonStyle from '../../styles/common.css';
import Modals from '../common/modal/Modal';
import * as service from '../../services/maxim';
import * as styles from '../../styles/common.css'
import * as styles2 from '../../styles/order.css'
import { getCode } from '../../services/code';
import CustomerLov from "../common/CustomerLov";
const TabPane = Tabs.TabPane;

const FormItem = Form.Item;
class MaximDetail extends Component {
  constructor(props){
    super(props);
    this.state = {
      PTFlag : "person",
      statusHisList: [],
      codeList: {
        mxList:[]
      },
      mxDetail:[],
      reservationList:[],
      payoutsList:[],
      saveList:[],
      dto:[]
    }
  }
  componentWillMount() {
    //获取快码值
    const codeBody = {
      mxList: 'ORD.MX_ORDER_STATUS',
    };
    getCode(codeBody).then((data) => {
      this.setState({
        codeList: data
      })
    });
    let params = {
      orderId:this.props.orderId,
      orderNumber:this.props.orderNumber,
      status:this.props.status
    }
    service.queryWsMxOrderDetail(params).then((data)=>{
      if(data.success){
        this.setState({
          mxDetail:data.rows[0]
        })
      }
    })
    // 预约资料
    service.queryWsMxOrderReservation({orderId:this.props.orderId}).then((data)=>{
      if(data.success){
        this.setState({
          reservationList:data.rows[0]
        })
      }
    })
    // 回款明细
    service.queryWsMxOrderPayouts({orderId:this.props.orderId}).then((data)=>{
      if(data.success){
        this.setState({
          payoutsList:data.rows[0]
        })
      }
    })
  }   
  
    
  //取消订单
  cancelMaxim(){
    Modals.warning(this.saveMaxim.bind(this),"您确定取消订单吗？");
  }
  //保存、取消
  saveMaxim(res){
    if(res){
      let params = [];
      if(res.value == ''){
        params = [{orderId:this.props.orderId}]
      }else {
        res == true?
        params = [{status:'cancelled',orderId:this.props.orderId}]:
        params = [{applicantCustomerId:res.value,orderId:this.props.orderId}]
      }
      service.submitOrder(params).then((data)=>{
        if(data.success){
          if(res.value == ''){
            Modals.success({
              content: `保存成功！`
            })
          } 
          else{
            res == true?
            Modals.success({
              content: '取消成功！'
            }):
            Modals.success({
              content: '保存成功！'
            })
          }
        }
      })
    }
  }


  maximCancel(flag){
    if(flag){
      let params = {};
      service.fetchCancelMaxim(params).then((data) => {
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

  //查看日志
  orderShowLog(fields){
    let params = {orderId:this.props.orderId};
    service.fetchMaximStatusHisList(params).then((data)=>{
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
  render() {
    const fields =this.state.mxDetail;
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
    const maximPerson = [
      {
        title: '产品名称',
        dataIndex: 'pendingNumber',
        key: 'pendingNumber',
      }, {
        title: '佣金率',
        dataIndex: 'applyClassDesc',
        key: 'applyClassDesc',
      }, {
        title: '应派',
        dataIndex: 'applyItem',
        key: 'applyItem',
      },{
        title: '实派',
        dataIndex: 'lud',
        key: 'lud',
      }];
    const maximTeam = [
      {
        title: '人员',
        dataIndex: 'pendingNumber',
        key: 'pendingNumber',
      },{
        title: '产品名称',
        dataIndex: 'pendingNumber',
        key: 'pendingNumber',
      }, {
        title: '佣金率',
        dataIndex: 'applyClassDesc',
        key: 'applyClassDesc',
      }, {
        title: '应派',
        dataIndex: 'applyItem',
        key: 'applyItem',
      },{
        title: '实派',
        dataIndex: 'lud',
        key: 'lud',
      }];
    const maximBack = [
      {
        title: '序号',
        dataIndex: 'afterNum',
        key: 'afterNum',
      }, {
        title: '派息时间',
        dataIndex: 'afterProjectDesc',
        key: 'afterProjectDesc',
        render(text,record) {
          return <div>{record.payoutCreatedAt}</div>
        }
      }, {
        title: '派息金额',
        dataIndex: 'afterType',
        key: 'afterType',
        render(text,record) {
          return <div>{record.payoutAmount}</div>
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
    const formItemLayoutLong = {
      labelCol: {
        xs: {span: 5},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 25},
        sm: {span: 18},
      },
    };
    const menu = (
      <Menu style={{height : '250px',width : '290px',overflow:'scroll'}}>
        {
          this.state.statusHisList.map((item)=>
            <Menu.Item key={item.statusHisId}>{item.statusDate}&nbsp;&nbsp;{item.meaning}&nbsp;&nbsp;{item.description}</Menu.Item>
          )
        }
      </Menu>
    );

    return (
      <div>
        <Form>
        <div style={{margin:'28px 12px',paddingBottom:'28px'}}>
          <span className={commonStyle.iconL}></span>
          <span className={commonStyle.iconR}>基金订单详情</span>

          <span  style={{float:'right'}}>
            <Button type='primary' style={{ marginLeft: 8 ,fontSize:'16px',height:'40px',width:'140px',fontWeight:'normal'}} onClick={this.saveMaxim.bind(this,this.props.form.getFieldValue('person'))}>
              保存
            </Button>
            <Button type='default' style={{ marginLeft: 8 ,fontSize:'16px',height:'40px',width:'140px',fontWeight:'normal'}} onClick={this.cancelMaxim.bind(this)}>
              取消预约
            </Button>
          </span>

        </div>
        <div style={{marginTop:'28px'}}>
          <Row gutter={40} >
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span style={{ color:JSON.parse(localStorage.theme).themeColor }}>订单状态</span>} className={styles.formitem_sty} style={{ fontSize: '16px' }}>
                  {
                    this.state.codeList.mxList.map((code, index) => {
                      if (fields.status == code.value) {
                        return <span style={{ color: JSON.parse(localStorage.theme).themeColor, fontSize: '16px' }} key={index}>{code.meaning}</span>
                      }
                    })
                  }
                </FormItem>
                    
            </Col>
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}} label="状态跟进">
                {getFieldDecorator('orderStatusFollow', {})(
                  <Button type='primary' onClick={this.orderShowLog.bind(this,fields)} style={{fontSize:'16px',height:'35px',width:'60%',fontWeight:'normal'}} >订单日志状态跟进</Button>

                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40} >
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>订单编号</span>}>
                {getFieldDecorator('orderNumber',{
                  initialValue:fields.orderNumber?fields.orderNumber:''
                })(
                  <Input readOnly={true}  style={{height:'40px',fontSize:'16px'}}/>
                )}
              </FormItem>
            </Col>
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="投资期限">
                {getFieldDecorator('attribute42',{
                  initialValue:fields.attribute42?fields.attribute42:''
                })(
                  <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40} >

            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="产品信息">
                {getFieldDecorator('itemName',{
                  initialValue:fields.itemName?fields.itemName:''
                })(
                  <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                )}
              </FormItem>
            </Col>
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>投资金额</span>}>
                {getFieldDecorator('yearPayAmount',{
                  initialValue:fields.yearPayAmount?fields.yearPayAmount:''
                })(
                  <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40} >
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>投资人名</span>}>
                {getFieldDecorator('hkContactPerson',{
                  initialValue:fields.hkContactPerson?fields.hkContactPerson:''
                })(
                  <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                )}
              </FormItem>
            </Col>
            <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>渠道</span>}>
                {getFieldDecorator('channelName',{
                  initialValue:fields.channelName?fields.channelName:''
                })(
                  <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40} style={{position:'relative'}}>
              <Col span={5} style={{ position:'absolute', top:'-61px',left:'516px',paddingLeft: '0', paddingRight: '0' }}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('person', {
                    rules: [{
                      required: true,
                      validator: (rule,value,callback) => {
                        if (value && (!value.value || !value.meaning)) {
                          callback('请选择客户');
                        } else {
                          callback();
                        }
                      }
                    }],
                    initialValue:{
                      value:fields.applicantCustomerId?fields.applicantCustomerId:'',
                      meaning:fields.applicantCustomerName?fields.applicantCustomerName:''
                    }
                  })(
                    <CustomerLov
                      params={{channelId:JSON.parse(localStorage.user).relatedPartyId}}
                      lovCode='ORD_CUSTOMER'
                      width="100%"
                      onChange={this.personSelect.bind(this)}
                    />
                    )}
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
                {getFieldDecorator('submitDate', {
                  initialValue:fields.submitDate?fields.submitDate:''
                })(
                  <Input size="large" style={{width:'100%',height:'40px',fontSize:'16px'}}  readOnly={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={11} style={{marginTop:'20px'}} >
              <FormItem {...formItemLayout}  label={<span className={styles2.item_font_form}>起息时间</span>}>
                {getFieldDecorator('effectiveDate', {
                  initialValue:fields.effectiveDate?fields.effectiveDate:''
                })(
                  <Input size="large" style={{width:'100%',height:'40px',fontSize:'16px'}} readOnly={true}/>
                )}
              </FormItem>
            </Col>
          </Row>
        </div>

        <div style={{margin:'30px 14px 0px 12px'}}>
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="预约资料" key="1">
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>投资人名</span>}>
                    {getFieldDecorator('reservationHkContactPerson',{
                      initialValue:fields.hkContactPerson?fields.hkContactPerson:''
                    })(
                      <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>护照号</span>}>
                    {getFieldDecorator('investorPassport',{
                      initialValue:this.state.reservationList.investorPassport?this.state.reservationList.investorPassport:''
                    })(
                      <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>联系电话</span>}>
                    {getFieldDecorator('investorPhone',{
                      initialValue:this.state.reservationList.investorPhone?this.state.reservationList.investorPhone:''
                    })(
                      <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>电子邮箱</span>}>
                    {getFieldDecorator('investorEmail',{
                      initialValue:this.state.reservationList.investorEmail?this.state.reservationList.investorEmail:''
                    })(
                      <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>联系地址</span>}>
                    {getFieldDecorator('investorAddress',{
                      initialValue:this.state.reservationList.investorAddress?this.state.reservationList.investorAddress:''
                    })(
                      <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>邮编</span>}>
                    {getFieldDecorator('investorAddressPostcode',{
                      initialValue:this.state.reservationList.investorAddressPostcode?this.state.reservationList.investorAddressPostcode:''
                    })(
                      <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>付款银行名</span>}>
                    {getFieldDecorator('bankName',{
                      initialValue:this.state.reservationList.bankName?this.state.reservationList.bankName:''
                    })(
                      <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>银行账号</span>}>
                    {getFieldDecorator('bankAccountNumber',{
                      initialValue:this.state.reservationList.bankAccountNumber?this.state.reservationList.bankAccountNumber:''
                    })(
                      <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>银行地址</span>}>
                    {getFieldDecorator('bankAddress',{
                      initialValue:this.state.reservationList.bankAddress?this.state.reservationList.bankAddress:''
                    })(
                      <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>SwiftCode</span>}>
                    {getFieldDecorator('swiftCode',{
                      initialValue:this.state.reservationList.swiftCode?this.state.reservationList.swiftCode:''
                    })(
                      <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={40} >
                <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>预约文件</span>}>
                    {getFieldDecorator('currency',{
                      initialValue:fields.currency?fields.currency:''
                    })(
                      <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="佣金明细" key="3">
              <div className={styles.item_div} style={{marginTop:"20px",marginBottom:"30px"}}>
                <div className={styles.order_table} style={{marginTop:"20px",marginBottom:"30px"}}>
                  {this.state.PTFlag =='person'&&
                  <Table columns={maximPerson}  bordered
                         scroll={{ x: '100%' }} pagination={false} />
                  }
                  {this.state.PTFlag =='team'&&
                  <Table columns={maximTeam}  bordered
                         scroll={{ x: '100%' }} pagination={false} />
                  }
                </div>
              </div>
            </TabPane>
            <TabPane tab="回款明细" key="5">
              <div className={styles.item_div} style={{marginTop:"20px",marginBottom:"30px"}}>
                <div className={styles.order_table} >
                  <Table columns={maximBack}  bordered
                         scroll={{x:'100%'}} pagination={true}
                         dataSource={this.state.payoutsList} 
                  />
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
        </Form>
      </div>
    );
  }
}

export default Form.create()(MaximDetail);
