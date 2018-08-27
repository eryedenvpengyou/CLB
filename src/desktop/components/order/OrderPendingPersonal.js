import React  , { Component } from 'react';
import  moment from 'moment';
import {Table, Button, Form, Select, Input, Row, Col} from 'antd';
import * as styles from '../../styles/order.css';
import * as service from '../../services/order';
import * as codeService from '../../services/code';

const FormItem = Form.Item;
const Option = Select.Option;

class OrderPending extends Component {
  constructor(props){
    super(props);
    this.state = {
      data_flag: true ,
      all: true,
      loading: false,
      showChannel: JSON.parse(localStorage.user).userType = "ADMINISTRATION"?true:false,
      orderBy: [],
      page: 1,
      pageSize: 20,
      butStyle1:'#ffffff',
      butStyle2:'#ffffff',
      oPList : [],
      codeList: {
        statusCodes: [],
      }
    }
  }

  //改变组件调用的方法
  componentWillReceiveProps(nextProps){
    this.state.orderBy = [];
    if(this.props.key1 !== nextProps.key1) {
      const paramsCode ={
        statusCodes: 'ORD.PENDING_STATUS',  //pending状态
      };
      codeService.getCode(paramsCode).then((data)=>{
        this.setState({
          codeList: data,
        });
      });
      let params ={
        orderType : "INSURANCE"
      };
      params.page = 1;
      params.pageSize = this.state.pageSize;
      service.fetchOrderPendingService(params).then((data) => {
        if (data.success) {
          for(let i=0;i<data.rows.length;i++){
            data.rows[i].pendingItems = data.rows[i].applyClassDesc+'-'+data.rows[i].applyItem;
            data.rows[i].key = data.rows[i].pendingId;
          }
          this.setState({
            oPList: data,
            page: 1,
          });
          this.changeColor()
        }
      });
    }
  }

  componentWillMount() {
    const paramsCode ={
      statusCodes: 'ORD.PENDING_STATUS',  //pending状态
    };
    codeService.getCode(paramsCode).then((data)=>{
      this.setState({
        codeList: data,
      });
    });
    let params ={
      orderType : "INSURANCE"
    };
    params.page = 1;
    params.pageSize = this.state.pageSize;
    service.fetchOrderPendingService(params).then((data) => {
      if (data.success) {
        for(let i=0;i<data.rows.length;i++){
          data.rows[i].pendingItems = data.rows[i].applyClassDesc+'-'+data.rows[i].applyItem;
          data.rows[i].key = data.rows[i].pendingId;
        }
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({
          oPList: data,
        });
        this.changeColor()
      }
    });
  }

  changeColor(){
    var rows = document.getElementsByClassName("ant-table-tbody")[0].getElementsByTagName("tr");
    if(rows) {

      for (let i = 0; i < rows.length; i++) {
        let row = rows[i]
        if (JSON.parse(localStorage.user).userType == "ADMINISTRATION") {
          row = row.getElementsByTagName("td")[7].getElementsByTagName("div")[0].innerHTML;
        }
        else {
          row = row.getElementsByTagName("td")[6].getElementsByTagName("div")[0].innerHTML;
        }
        if (row == "需补资料") {
          rows[i].style.background = "yellow";
        } else {
          rows[i].style.background = "white";
        }
      }
    }
    return true;
  }

  //分页
  tableChange(pagination, filters, sorter){
    let params = {};
    params = {
      orderType : "INSURANCE",
      orderInfo : this.props.form.getFieldValue('orderInfo'),
      status :this.props.form.getFieldValue('status'),
      pendingNumber :this.props.form.getFieldValue('pendingNumber'),
      policyNumber :this.props.form.getFieldValue('policyNumber'),
      channelName :this.props.form.getFieldValue('channelName'),
      person :this.props.form.getFieldValue('person'),
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

    //个人数据
    service.fetchOrderPendingService(params).then((data)=>{
      if (data.success) {
        for(let i=0;i<data.rows.length;i++){
          data.rows[i].pendingItems = data.rows[i].applyClassDesc+'-'+data.rows[i].applyItem;
          data.rows[i].key = data.rows[i].pendingId;
        }
        this.setState({
          oPList: data,
          pageSize: pagination.pageSize,
          page: pagination.current,
        });
        this.changeColor();
      }
    })
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.state.orderBy = [];
    this.props.form.validateFields((err, values) => {
    });
    const params = {
      orderType : "INSURANCE",
      orderInfo : this.props.form.getFieldValue('orderInfo'),
      status :this.props.form.getFieldValue('status'),
      pendingNumber :this.props.form.getFieldValue('pendingNumber'),
      policyNumber :this.props.form.getFieldValue('policyNumber'),
      channelName :this.props.form.getFieldValue('channelName'),
      person :this.props.form.getFieldValue('person'),
      page: 1,
      pageSize : this.state.pageSize
    };
    service.fetchOrderPendingService(params).then((data) => {
      if (data.success) {
        for(let i=0;i<data.rows.length;i++){
          data.rows[i].pendingItems = data.rows[i].applyClassDesc+'-'+data.rows[i].applyItem;
          data.rows[i].key = data.rows[i].pendingId;
        }
        this.setState({
          oPList: data,
          page: 1,
        });
        this.changeColor()
      }
    });
  }
  handleReset = () => {
    this.state.orderBy = [];
    this.props.form.resetFields();
    const user = JSON.parse(localStorage.user);
    let params ={
      orderType : "INSURANCE"
    };
    params.page = 1;
    params.pageSize = this.state.pageSize;
    service.fetchOrderPendingService(params).then((data) => {
      if (data.success) {
        for(let i=0;i<data.rows.length;i++){
          data.rows[i].pendingItems = data.rows[i].applyClassDesc+'-'+data.rows[i].applyItem;
          data.rows[i].key = data.rows[i].pendingId;
        }
        this.setState({
          oPList: data,
          page: 1,
        });
        this.changeColor()
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
          title: '保单编号',
          dataIndex: 'policyNumber',
          key: 'policyNumber',
          fixed: 'left',
          width : '120px',
          render: (text, record) => <span style={{color:JSON.parse(localStorage.theme).themeColor,cursor:'pointer'}} onClick={() => location.hash = '/order/orderDetail/personal/' + record.orderId } >{text}</span>,
        },{
          title: '订单信息',
          dataIndex: 'orderInfo',
          key: 'orderInfo',
          render: (text, record, index) => {
            return <span style={{fontSize:'14px'}}>{record.orderInfo}</span>
          }
        },
        {
          title: '渠道',
          dataIndex: 'channelName',
          sorter: true,
          key: 'channelName',
          render: (text, record, index) => {
            return <span style={{fontSize:'14px'}}>{record.channelName}</span>
          }
        }, {
          title: 'Pending事项',
          dataIndex: 'pendingItems',
          key: 'pendingItems',
          render: (text, record, index) => {
            return <span style={{fontSize:'14px'}}>{record.pendingItems}</span>
          }
        },{
          title: '最后更新时间',
          dataIndex: 'lud',
          key: 'lud',
          sorter: true,
          render: (text, record, index) => {
            return <span  style={{fontSize:'14px'}}>{moment(record.lud).format("YYYY-MM-DD HH:mm")}</span>
          }
        },{
          title: '截止时间',
          dataIndex: 'dealEndDate',
          key: 'dealEndDate',
          sorter: true,
          render: (text, record, index) => {
            return <span  style={{fontSize:'14px'}}>{record.dealEndDate}</span>
          }
        }, {
          title: '状态',
          dataIndex: 'statusDesc',
          key: 'statusDesc',
          fixed: 'right',
          width: 110,
          render: (text, record, index) => {
            return <div style={{fontSize:'14px'}}>{record.statusDesc}</div>
          }
        }, {
          title: '跟进',
          fixed: 'right',
          width: 110,
          render: (text, record, index) => {
            return <div>
              <Button type='default' onClick={()=>location.hash = '/OrderPending/orderPendingTrail/pending/ORDOrderPending/'+record.orderId+'/'+record.pendingId}>跟进</Button>
            </div>
          }
        }
      ];

    const  columns2 = [
        {
          title: '保单编号',
          dataIndex: 'policyNumber',
          key: 'policyNumber',
          fixed: 'left',
          width : '120px',
          render: (text, record) => <span style={{color:JSON.parse(localStorage.theme).themeColor,cursor:'pointer'}} onClick={() => location.hash = '/order/orderDetail/personal/' + record.orderId } >{text}</span>,
        },{
          title: '订单信息',
          dataIndex: 'orderInfo',
          key: 'orderInfo',
          render: (text, record, index) => {
            return <span style={{fontSize:'14px'}}>{record.orderInfo}</span>
          }
        },{
          title: 'Pending事项',
          dataIndex: 'pendingItems',
          key: 'pendingItems',
          render: (text, record, index) => {
            return <span style={{fontSize:'14px'}}>{record.pendingItems}</span>
          }
        },{
          title: '最后更新时间',
          dataIndex: 'lud',
          key: 'lud',
          sorter: true,
          render: (text, record, index) => {
            return <span  style={{fontSize:'14px'}}>{moment(record.lud).format("YYYY-MM-DD HH:mm")}</span>
          }
        },{
          title: '截止时间',
          dataIndex: 'dealEndDate',
          key: 'dealEndDate',
          sorter: true,
          render: (text, record, index) => {
            return <span  style={{fontSize:'14px'}}>{record.dealEndDate}</span>
          }
        }, {
          title: '状态',
          dataIndex: 'statusDesc',
          key: 'statusDesc',
          fixed: 'right',
          width: 110,
          render: (text, record, index) => {
            return <div style={{fontSize:'14px'}}>{record.statusDesc}</div>
          }
        }, {
          title: '跟进',
          fixed: 'right',
          width: 110,
          render: (text, record, index) => {
            return <div>
              <Button type='default' onClick={()=>location.hash = '/OrderPending/orderPendingTrail/pending/ORDOrderPending/'+record.orderId+'/'+record.pendingId}>跟进</Button>
            </div>
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
                        {
                          this.state.codeList.statusCodes.map((item)=>
                            <Option key={item.value}>{item.meaning}</Option>
                          )
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={4} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('policyNumber')(
                      <Input placeholder="保单编号"/>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{paddingRight:'10px'}}>
                  <FormItem {...formItemLayout} >
                    {getFieldDecorator('person')(
                      <Input placeholder="投保人/受保人/拼音"/>
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
          <div id = 'pendingPerson'>
            <Table
              rowKey="key"
              columns={JSON.parse(localStorage.user).userType == "ADMINISTRATION"?columns1:columns2}
              dataSource={this.state.oPList.rows}
              bordered scroll={{x:'130%'}}
              onChange={this.tableChange.bind(this)}
              pagination={{
                pageSizeOptions: ['5','10','20','50'],
                pageSize: this.state.pageSize,
                current: this.state.page,
                total:this.state.oPList.total || 0,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default Form.create()(OrderPending);
