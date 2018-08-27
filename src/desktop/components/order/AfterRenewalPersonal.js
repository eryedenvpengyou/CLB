import React  , { Component } from 'react';
import {Tabs,Table, Icon,Button,Input,Row,Col,Select, Form, Menu, Dropdown} from 'antd';
import * as styles from '../../styles/order.css';
import * as service from '../../services/order';
import { fmoneyCommon } from '../../utils/common';
import { getCode } from '../../services/code';

const FormItem = Form.Item;
const Option = Select.Option;

class AfterRenewal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 20,
      orderBy: [],
      startValue: this.props.form.getFieldValue('creationDate'),
      endValue: this.props.form.getFieldValue('creationDate'),
      endOpen: false,
      codeList: {
        afterStatusCodes: [],
      },
      selectedRowKeys: [],
      afterRenewalList:[],
    };
  }

  //改变组件调用的方法
  componentWillReceiveProps(nextProps){
    if(this.props.key1 !== nextProps.key1) {
      let params = {};
      params.page = 1;
      params.pageSize = this.state.pageSize;
      service.fetchRenewalPersonService(params).then((data) => {
        if (data.success) {
          for(let i = 0; i<data.rows.length;i++){
            data.rows[i].key = i;
            if(data.rows[i].renewalStatus==='ADMIN'||data.rows[i].renewalStatus==='NACHFRIST'){
              data.rows[i].rStatus = 'TOFAIL'
            }else {
              data.rows[i].rStatus = data.rows[i].renewalStatus
            }
          }
          this.setState({
            afterRenewalList:data,
            page : 1
          })
        }
      });
      const codeBody = {
        afterStatusCodes: 'ORD.RENEWAL_STATUS_FRONT'
      };
      getCode(codeBody).then((data)=>{
        this.setState({
          codeList: data
        });
      });
    }
  }

  componentWillMount() {
    service.fetchRenewalPersonService().then((data) => {
      if (data.success) {
        for(let i = 0; i<data.rows.length;i++){
          data.rows[i].key = i;
          if(data.rows[i].renewalStatus==='ADMIN'||data.rows[i].renewalStatus==='NACHFRIST'){
            data.rows[i].rStatus = 'TOFAIL'
          }else {
            data.rows[i].rStatus = data.rows[i].renewalStatus
          }
        }
        this.setState({
          afterRenewalList:data
        })
      }
    });
    const codeBody = {
      afterStatusCodes: 'ORD.RENEWAL_STATUS_FRONT'
    };
    getCode(codeBody).then((data)=>{
      this.setState({
        codeList: data
      });
    });
  }

  changeData(data){
    for(let i = 0; i<data.rows.length;i++){
      data.rows[i].key = i;
      if(data.rows[i].renewalStatus==='ADMIN'||data.rows[i].renewalStatus==='NACHFRIST'){
        data.rows[i].rStatus = 'TOFAIL'
      }else {
        data.rows[i].rStatus = data.rows[i].renewalStatus
      }
    }
    this.setState({
      afterRenewalList:data,
      page: 1,
    });
  }
  //分页
  tableChange(pagination,filters, sorter){
    let orderBy = this.state.orderBy || [];
    if (sorter.field) {
      const orderByName = sorter.order.substr(0,sorter.order.indexOf("end"));
      const field = sorter.field.replace(/([A-Z])/g,"_$1").toUpperCase();
      if (orderBy.indexOf(field+" desc") != -1) {
        orderBy.splice(orderBy.indexOf(field+" desc"),1);
      } else if (orderBy.indexOf(field+" asc") != -1) {
        orderBy.splice(orderBy.indexOf(field+" asc"),1);
      }
      orderBy.splice(0,0,field+" "+orderByName);
    }
    let params = {
      item : this.props.form.getFieldValue('item'),
      renewalStatus :this.props.form.getFieldValue('renewalStatus'),
      person :this.props.form.getFieldValue('person'),
      creationDate :this.props.form.getFieldValue('creationDate'),
      endDateActive :this.props.form.getFieldValue('endDateActive'),
      dateType : "RENEWAL_DUE_DATE"
    };
    params.page = pagination.current;
    params.pageSize = pagination.pageSize;
    params.orderBy = (orderBy||[]).toString();
    //个人数据
    service.fetchRenewalPersonService(params).then((data)=>{
      if (data.success) {
        for(let i = 0; i<data.rows.length;i++){
          data.rows[i].key = i;
          if(data.rows[i].renewalStatus=='ADMIN'||data.rows[i].renewalStatus=='NACHFRIST'){
            data.rows[i].rStatus = 'TOFAIL'
          }else {
            data.rows[i].rStatus = data.rows[i].renewalStatus
          }
        }
        this.setState({
          afterRenewalList:data,
          page: pagination.current,
          orderBy
        });
      }
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
    let params = {};
    params.page = 1;
    params.pageSize = this.state.pageSize;
    service.fetchRenewalPersonService(params).then((data) => {
      if (data.success) {
        this.changeData(data)
      }
    });
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
    });
    let params = {
      item : this.props.form.getFieldValue('item'),
      renewalStatus :this.props.form.getFieldValue('renewalStatus'),
      person :this.props.form.getFieldValue('person'),
      creationDate :this.props.form.getFieldValue('creationDate'),
      endDateActive :this.props.form.getFieldValue('endDateActive'),
      dateType : "RENEWAL_DUE_DATE"
    };
    params.page = 1;
    params.pageSize = this.state.pageSize;
    service.fetchRenewalPersonService(params).then((data) => {
      if (data.success) {
        this.changeData(data)
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      wrapperCol: { span: 24 },
    };
    const columns = [
      {
        title: '保单编号',
        dataIndex: 'policyNumber',
        width : '150px',
        render: (text, record, index) => {
          return <div>
            <a style={{fontSize:'14px',color:'#d1b97f',}} onClick={()=>location.hash = '/order/orderDetail/personal/'+record.orderId}>{record.policyNumber}</a>
          </div>
        }
      },{
        title: '产品信息',
        dataIndex: 'item',
        render: (text, record, index) => {
          return <span style={{fontSize:'14px'}}>{record.item}</span>
        }
      },{
        title: '投保人',
        dataIndex: 'applicant',
        render: (text, record, index) => {
          return <span style={{fontSize:'14px'}}>{record.applicant}</span>
        }
      },{
        title: '受保人',
        dataIndex: 'insurant',
        render: (text, record, index) => {
          return <span style={{fontSize:'14px'}}>{record.insurant}</span>
        }
      },{
        title: '币种',
        dataIndex: 'currency',
        render: (text, record, index) => {
          return <span style={{fontSize:'14px'}}>{record.currency}</span>
        }
      },{
        title: '纳费期数',
        dataIndex: 'payPeriods',
        render: (text, record, index) => {
          return <span style={{fontSize:'14px'}}>{record.payPeriods}</span>
        }
      },{
        title: '预计续保费用',
        dataIndex: 'nextPolicyAmount',
        render: (text, record, index) => {
          return <span style={{fontSize:'14px'}}>{fmoneyCommon(record.nextPolicyAmount)}</span>
        }
      }, {
        title: '续保到期日',
        dataIndex: 'renewalDueDate',
        render: (text, record, index) => {
          return <span style={{fontSize:'14px'}}>{record.renewalDueDate}</span>
        }
      }, {
        title: '状态',
        dataIndex: 'rStatus',
        render: (text, record, index) => {
          let asListCode = this.state.codeList.afterStatusCodes;
          if(asListCode){
            for(let i = 0;i<asListCode.length;i++){
              if(record.rStatus == asListCode[i].value){
                return <div style={{fontSize:'14px'}}>{asListCode[i].meaning}</div>
              }
            }
          }
        }
      }, {
        title: '查看',
        width: 140,
        /*render: (text, record, index) => {
          return <div>
            <Button  type='default' onClick={()=>location.hash = '/after/AfterRenewal/AfterRenewalDetail/'+record.orderId}>查看</Button>
          </div>
        }*/
        render: (text, record, index) => {
          return <Dropdown overlay={
            <Menu>
              <Menu.Item>
                <Button style={{width:'100px'}} type='default' onClick={()=>location.hash = '/after/AfterRenewal/AfterRenewalDetail/'+record.orderId}>查看</Button>
              </Menu.Item>
              <Menu.Item>
                <Button style={{width:'100px'}} type='default' onClick={()=>location.hash = '/after/AfterNew/RENEWAL/续保/'+record.orderId} >申请续保</Button>
              </Menu.Item>
            </Menu>
          } placement='bottomCenter'>
            <Button>操作</Button>
          </Dropdown>
        }
      }
    ];

    return (
      <div>
        <div>
          <div>
            <Form onSubmit={this.handleSearch}>
              <Row style={{marginBottom : '20px'}}>
                <Col span={6}>
                </Col>
                <Col span={6}>
                </Col>
                <Col span={6}>
                </Col>
                <Col span={3}>
                </Col>
                <Col span={3}>
                  <Button type='primary' style={{fontSize:'20px',width : '140px',height:'40px'}}  onClick={()=>location.hash ='/after/AfterNew/0/0/'+0}>售后申请</Button>
                </Col>
              </Row>
              <Row>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('renewalStatus')(
                      <Select placeholder="状态">
                        {
                          this.state.codeList.afterStatusCodes.map((item)=>
                            <Option key={item.value}>{item.meaning}</Option>
                          )
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('item')(
                      <Input placeholder="产品"/>
                    )}
                  </FormItem>
                </Col>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('person')(
                      <Input placeholder="受保人/投保人/拼音"/>
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                </Col>
                <Col span={3}>
                  <Button type='default' style={{fontSize:'20px',width:'140px',height:'40px'}} htmlType="submit">查询</Button>
                </Col>
                <Col span={3}>
                  <Button type='primary' style={{fontSize:'20px',width:'140px',height:'40px'}} onClick={this.handleReset.bind(this)}>全部</Button>
                </Col>

              </Row>
            </Form>
          </div>
          <div style={{marginTop:'20px'}} className={styles.item_div3}>
            <Table
              scroll={{x: '100%'}}
              columns={columns}
              dataSource={this.state.afterRenewalList.rows}
              bordered
              onChange={this.tableChange.bind(this)}
              pagination={{
                current: this.state.page || 1,
                pageSize: this.state.pageSize || 20,
                total:this.state.afterRenewalList.total || 0,
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(AfterRenewal);
