import React  , { Component } from 'react';
import  moment from 'moment';
import {Table, Button, Form, Select, Input, Row, Col} from 'antd';
import * as styles from '../../styles/order.css';
import { getCode } from '../../services/code';
import * as service from '../../services/maxim';

const FormItem = Form.Item;
const Option = Select.Option;

class MaximTeam extends Component {
  constructor(props){
    super(props);
    this.state = {
      page: 1,
      pageSize: 20,
      maximTeamList : [],
      orderBy: [],
      codeList: {}
    }
  }

  //改变组件调用的方法
  componentWillReceiveProps(nextProps){
  }

  componentWillMount() {
    //获取快码值
    const codeBody = {
      mxList: 'ORD.MX_ORDER_STATUS',
    };
    getCode(codeBody).then((codeData)=>{
      this.state.codeList = codeData
    })
    let params ={
    };
    params.page = 1;
    params.pageSize = this.state.pageSize;
    service.fetchMaximTeamQuery(params).then((data) => {
      if (data.success) {
        this.setState({
          maximTeamList: data,
          page: 1,
        });
      }
    });
  }

  //分页
  tableChange(pagination, filters, sorter){
    let params = {};
    params = {
    };
    //查询排序
    if (sorter.field) {
      const orderByName = sorter.order.substr(0,sorter.order.indexOf("end"));
      if (this.state.orderBy.indexOf(sorter.field+" desc") != -1) {
        this.state.orderBy.splice(this.state.orderBy.indexOf(sorter.field+" desc"),1);
      } else if (this.state.orderBy.indexOf(sorter.field+" asc") != -1) {
        this.state.orderBy.splice(this.state.orderBy.indexOf(sorter.field+" asc"),1);
      }
      this.state.orderBy.splice(0,0,sorter.field+" "+orderByName);
    }
    params.orderBy = this.state.orderBy.toString();
    params.page = pagination.current;
    params.pageSize = pagination.pageSize;
    service.fetchMaximTeamQuery(params).then((data)=>{
      if (data.success) {
        this.setState({
          maximTeamList: data,
          pageSize: pagination.pageSize,
          page: pagination.current,
        });
      }
    })
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.state.orderBy = [];
    this.props.form.validateFields((err, values) => {
    });
    const params = {
      page: 1,
      pageSize : this.state.pageSize
    };
    service.fetchMaximTeamQuery(params).then((data) => {
      if (data.success) {
        this.setState({
          maximTeamList: data,
          page: 1,
        });
      }
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    const params = {
      page: 1,
      pageSize : this.state.pageSize
    };
    service.fetchMaximTeamQuery(params).then((data) => {
      if (data.success) {
        this.setState({
          maximTeamList: data,
          page: 1,
        });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      wrapperCol: { span: 24 },
    };
    const  columns1 = [
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
        width : '120px',
        render: (text, record) => <span style={{color:JSON.parse(localStorage.theme).themeColor,cursor:'pointer'}} onClick={() => location.hash = '/maxim/maximDetail/'  + record.orderId + '/'+record.orderNumber +'/'+ record.status } >{record.orderNumber}</span>,
      },{
        title: '产品名称',
        dataIndex: 'itemName',
        key: 'itemName',
        render: (text, record, index) => {
          return <span style={{fontSize:'14px'}}>{record.itemName}</span>
        }
      },
      {
        title: '投资期限',
        dataIndex: 'attribute42',
        key: 'attribute',
        render: (text, record, index) => {
          return <span style={{fontSize:'14px'}}>{record.attribute42}</span>
        }
      }, {
        title: '起息日期',
        dataIndex: 'startInterestDay',
        key: 'startInterestDay',
        render: (text, record, index) => {
          return <span style={{fontSize:'14px'}}>{record.effectiveDate}</span>
        }
      },{
        title: '投资金额',
        dataIndex: 'orderInvestAmount',
        key: 'orderInvestAmount',
        sorter: true,
        render: (text, record, index) => {
          return <span  style={{fontSize:'14px'}}>{record.yearPayAmount}</span>
        }
      },{
        title: '投资人',
        dataIndex: 'hkContactPerson',
        key: 'hkContactPerson',
        render: (text, record, index) => {
          return <span  style={{fontSize:'14px'}}>{record.hkContactPerson}</span>
        }
      }, {
        title: '渠道',
        dataIndex: 'channelName ',
        key: 'channelName',
        width: 110,
        render: (text, record, index) => {
          return <div style={{fontSize:'14px'}}>{record.channelName}</div>
        }
      }, {
        title: '提交时间',
        dataIndex: 'submitDate',
        key: 'submitDate',
        width: 110,
        render: (text, record, index) => {
          return <div style={{fontSize:'14px'}}>{record.submitDate}</div>
        }
      }, {
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        width: 110,
        render: (text, record, index) => {
          return <div style={{fontSize:'14px'}}>{
            this.state.codeList.mxList.map((code,index)=>{
              if(record.status == code.value){
                return <span key={index}>{code.meaning}</span>
              }
            })
          }</div>
        }
      }
    ];

    return (
      <div>
        <div className={styles.table_border2}>
          <div style={{marginBottom:'15px',paddingTop:'10px'}}>
            <Form onSubmit={this.handleSearch}>
              <Row>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('status')(
                      <Select placeholder="状态">
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout} >
                    {getFieldDecorator('hkContactPerson')(
                      <Input placeholder="投资人拼音"/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('itemName')(
                      <Input placeholder="产品信息"/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <Button htmlType="submit" type='default' style={{fontSize:'20px',width:'140px',height:'40px',float:'right'}}>立即预约</Button>
                </Col>
              </Row>
              <Row>
                <Col span={8} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout} >
                    {getFieldDecorator('submitDateStart')(
                      <Input placeholder="提交时间从"/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout} >
                    {getFieldDecorator('submitDateTo')(
                      <Input placeholder="提交时间至"/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <Button onClick={this.handleReset} type='primary' style={{fontSize:'20px',width:'140px',height:'40px',float:'right'}}>全部</Button>
                  <Button htmlType="submit" type='default' style={{fontSize:'20px',width:'140px',marginRight:'10px',height:'40px',float:'right'}}>查询</Button>
                </Col>
              </Row>
            </Form>
          </div>
          <div id = 'maximTeam'>
            <Table
              rowKey="key"
              columns={columns1}
              dataSource={this.state.maximTeamList.rows}
              pagination={{
                pageSizeOptions: ['5','10','20','50'],
                pageSize: this.state.pageSize,
                current: this.state.page,
                total:this.state.maximTeamList.total || 0,
              }}
              bordered
            />
          </div>
        </div>
      </div>
    );
  }
}
export default Form.create()(MaximTeam);
