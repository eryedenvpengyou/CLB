import React  , { Component } from 'react';
import {Link} from 'dva/router'
import {Menu,Form, Row, Col, Input,Tabs,Table, Button, Icon} from 'antd';
import Upload from '../common/Upload';
import * as commonStyle from '../../styles/common.css';
import Modals from '../common/modal/Modal';
import * as common from '../../utils/common';
import * as service from '../../services/order';
import * as styles from '../../styles/common.css'
import * as styles2 from '../../styles/order.css'
import { getCode } from '../../services/code';
import Download from '../common/Download'
const TabPane = Tabs.TabPane;

const FormItem = Form.Item;
class  orderFMSZState extends Component {
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
        this.orderShowLog();
      }
    });
  }

  //查看日志
  orderShowLog(fields){
    let params = {pendingId:this.state.orderFMSZDetail.pendingId};
    service.fetchOrderTrails({params}).then((data)=>{
      const statusHisList = data.rows || [];
      this.setState({statusHisList: statusHisList});
      console.log(this.state.statusHisList)
      // Modals.LogModel({List:this.state.statusHisList});
    });
  }

  // 提交跟进状态
  handleSubmit = e => {
    e.preventDefault();
    let status = 'APPROVING';
    if (this.state.orderFMSZDetail.status == 'PAY_MONEY') {
      status = 'VERIFY_MONEY';
    }
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log(err)
        Modals.error({content: '请填写完整或上传正确的附件'});
        return;
      }

      let params = {
        pendingId: this.state.orderFMSZDetail.pendingId,
        content: values.content,
        fileId: common.formatFile(values.fileId || [], true),
        followStatus: status,
        status: status,
        __status: 'add',
      };
      service.submitOrderTrail(params).then(data => {
        if (data.success) {
          Modals.success({content: "预约资料已提交，请耐心等待审核！"});
          window.setTimeout(()=>{
            window.location.reload();
          },3000);
         
        } else {
          Modals.error({content: '提交失败：'+data.meaasge});
          return;
        }
      }).catch(err => {
        Modals.error({content: '提交失败：'+err});
        return
      })
    });
  }

  render() {
    let {getFieldDecorator} = this.props.form;
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

    let columns = [
      {
        title: '更新人',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '订单状态',
        dataIndex: 'followStatus',
        render: (text, record, index) => {
          return this.state.codeList.statusList.map((item) =>
            record.followStatus == item.value ? <span title="状态" style={{ fontSize: '14px' }} key={index}>{item.meaning}</span> : ''
          )
        }
      },
      {
        title: '更新时间',
        dataIndex: 'followDate',
        key: 'followDate',
      },
      {
        title: '备注',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '附件',
        dataIndex: 'fileId',
        key: 'fileId',
        render: (text, record, index) => {
          if (record.fileId) {
            return (
              <Download fileId={record.fileId} />
            )
          } else {
            return ''
          }
        },
      },
    ];

    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <div style={{margin:'28px 12px',paddingBottom:'28px', borderBottom:'1px solid #dbdbdb'}}>
            <span className={commonStyle.iconL}></span>
            <span className={commonStyle.iconR}>海外医疗预约跟进</span>
          </div>
          <div style={{marginTop:'28px'}}>
            <Row gutter={40} >
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>订单编号</span>}>
                  <div style={{lineHeight: '40px', fontSize: '16px'}}>{this.state.orderFMSZDetail.orderNumber || ''}</div>
                </FormItem>
              </Col>
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>产品信息</span>}>
                  <div style={{lineHeight: '40px', fontSize: '16px'}}>{this.state.orderFMSZDetail.noticeItem || ''}</div>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40} >
              <Col span={11} style={{ paddingLeft: '0', paddingRight: '0' }}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>客户</span>}>
                  <div style={{lineHeight: '40px', fontSize: '16px'}}>{this.state.orderFMSZDetail.applicant || ''}</div>
                </FormItem>
              </Col>
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>期望面签时间</span>}>
                  <div style={{lineHeight: '40px', fontSize: '16px'}}>{this.state.orderFMSZDetail.reserveDate}</div>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40} >
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>预产期</span>}>
                  <div style={{lineHeight: '40px', fontSize: '16px'}}>{this.state.orderFMSZDetail.reserveArrivalDate || ''}</div>
                </FormItem>
              </Col>
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>计划出境日期</span>}>
                  <div style={{lineHeight: '40px', fontSize: '16px'}}>{this.state.orderFMSZDetail.reserveCheckDate || ''}</div>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40} >
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>预计赴美人数</span>}>
                  <div style={{lineHeight: '40px', fontSize: '16px'}}>{this.state.orderFMSZDetail.peopleCount || '1'}人</div>
                </FormItem>
              </Col>
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>需办签证人数</span>}>
                  <div style={{lineHeight: '40px', fontSize: '16px'}}>{this.state.orderFMSZDetail.visaCount || '0'}人</div>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40} >
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>当前处理人</span>}>
                  <div style={{lineHeight: '40px', fontSize: '16px'}}>{this.state.orderFMSZDetail.applicant || ''}</div>
                </FormItem>
              </Col>
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>订单状态</span>}>
                  {
                    this.state.codeList.statusList.map((code, index) => {
                      if (this.state.orderFMSZDetail.status == code.value) {
                        return <div style={{lineHeight: '40px', fontSize: '16px'}} key={index}>{code.meaning}</div>
                      }
                    })
                  }
                </FormItem>
              </Col>
            </Row>
          </div>
          <div style={{margin:'28px 12px',paddingBottom:'28px', borderBottom:'1px solid #dbdbdb'}}>
            <span className={commonStyle.iconL}></span>
            <span className={commonStyle.iconR}>跟进记录</span>
          </div>
          <div style={{padding: '0 20px 20px 20px'}}>
            <Table rowKey='pendingFollowId' columns={columns} bordered scroll={{x: '100%'}} pagination={false} dataSource={this.state.statusHisList}/>
          </div>
          {
            !(this.state.orderFMSZDetail.status == 'PAY_MONEY' || this.state.orderFMSZDetail.status == 'NEED_REVIEW') ? '':
            <div>
              <FormItem label="附件上传" labelCol={{span: 4}} wrapperCol={{span: 12}}>
                {getFieldDecorator('fileId', {})(
                  <Upload fileNum={1} modularName='ORD' disabled={false}>
                    <Button>
                      <Icon type="upload" /> 选择附件
                    </Button>
                  </Upload>
                )}
                <p>如需上传多个附件,可打包压缩上传,支持格式rar/zip/7z的压缩文件</p>
              </FormItem>
              <FormItem label="备注" labelCol={{span: 4}} wrapperCol={{span: 12}}>
                {getFieldDecorator('content', {
                  rules: [{
                    message: '请填写备注',
                  }],
                })(
                  <Input type='textarea'/>
                )}
              </FormItem>
            </div>
          }
          <Row style={{paddingBottom: '20px',textAlign:'center'}}>
            {
              !(this.state.orderFMSZDetail.status == 'PAY_MONEY' || this.state.orderFMSZDetail.status == 'NEED_REVIEW') ? '':

                <Button type='primary' style={{ width: '120px', height: '40px' }} htmlType='submit'>提交</Button>
              
            }
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(orderFMSZState);
