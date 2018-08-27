import { Form, Row, Col, Input, Select, Button, Table, Dropdown, Menu, Icon } from 'antd';
import * as service from '../../services/order';
import * as codeService from '../../services/code';
import * as styles from '../../styles/ordersummary.css';
import Modals from '../common/modal/Modal';

const FormItem = Form.Item;
const Option = Select.Option;

class OrderImmigrantInvestPerson extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      codeList: {
        orderStatusList: [],
      },
      orderBy: [],
      pageSize: 20,
      page: 1,
      visible: false,
      orderList: {},
    };
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.state.orderBy = [];
    let paramOrderPerson = {
      applicant : this.props.form.getFieldValue('applicant'),
      status :this.props.form.getFieldValue('status'),
      orderNumber :this.props.form.getFieldValue('orderNumber'),
      item :this.props.form.getFieldValue('itemName'),
      orderType : 'IMMIGRANT'
    };
    paramOrderPerson.page = 1;
    paramOrderPerson.pageSize = this.state.pageSize;
    service.fetchOrderPersonListService(paramOrderPerson).then((data) => {
      if(data.success){
        this.setState({
          orderList:data
        });
      }
    });
  }

  handleReset = () => {
    this.state.orderBy = [];
    this.state.page = 1;
    this.props.form.resetFields();
    let paramOrderPerson = {
      orderType : 'IMMIGRANT'
    };
    paramOrderPerson.page = 1;
    paramOrderPerson.pageSize = this.state.pageSize;
    service.fetchOrderPersonListService(paramOrderPerson).then((data) => {
      if(data.success){
        this.setState({
          orderList:data
        })
      }
    });
  }

  //改变组件调用的方法
  componentWillReceiveProps(nextProps){
    this.state.orderBy = [];
    this.state.page = 1;
    if(this.props.key1 !== nextProps.key1) {
      let paramsCode ={
        orderStatusList: 'ORD.IMMIGRANT_STATUS',  //pending状态
      };
      codeService.getCode(paramsCode).then((data)=>{
        this.setState({
          codeList: data,
        });
      });
      this.selectList();
    }
  }

  componentWillMount() {
    let paramsCode ={
      orderStatusList: 'ORD.IMMIGRANT_STATUS',  //pending状态
    };
    codeService.getCode(paramsCode).then((data)=>{
      this.setState({
        codeList: data,
      });
    });
    this.selectList();
  }

  //查看日志
  orderShowLog(record){
    service.fetchOrderDetailordStatusHisList({orderId:record.orderId}).then((data)=>{
      const statusHisList = data.rows || [];
      this.setState({statusHisList: statusHisList});
      Modals.LogModel({List:this.state.statusHisList});
    });
  }
  //取消订单
  cancelOrder(record) {
    Modals.warning(this.orderCancel.bind(this,record),"您确定取消订单吗？");
  }
  orderCancel(record, flag) {
    if(flag){
      service.fetchCancelOrder({orderId:record.orderId}).then((data) => {
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

  //分页
  tableChange(pagination, filters, sorter) {
    let params = {};
    params = {
      applicant : this.props.form.getFieldValue('applicant'),
      status :this.props.form.getFieldValue('status'),
      orderNumber :this.props.form.getFieldValue('orderNumber'),
      item :this.props.form.getFieldValue('itemName'),
      orderType : 'IMMIGRANT'
    };
    params.page = pagination.current;
    params.pageSize = pagination.pageSize;
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
    //个人数据
    service.fetchOrderPersonListService(params).then((data)=>{
      if(data.success){
        this.setState({
          orderList: data,
          page: pagination.current,
        });
      }
    });
  }

  selectList = () => {
    //个人数据
    this.state.page = 1;
    const paramOrderPerson = {
      orderType : 'IMMIGRANT'
    };
    service.fetchOrderPersonListService(paramOrderPerson).then((data) => {
      if (data.success) {
        this.setState({
          orderList: data,
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      wrapperCol: { span: 24 },
    };
    const columns1 = [
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        width : '150px',
        render: (text, record, index) => {
          return <div>
            <a style={{fontSize:'14px',color:'#d1b97f',}} onClick={()=>location.hash = '/order/orderImmigrantInvest/OrderImmigrantInvestDetail/personal/'+record.orderId}>{record.orderNumber}</a>
          </div>
        }
      },{
        title: '产品信息',
        dataIndex: 'itemName',
        render: (text, record, index) => {
          if (record.itemName && record.sublineItemName) {
            return <span title="产品信息" style={{fontSize:'14px'}}>{record.itemName+'-'+record.sublineItemName}</span>
          } else if (record.itemName) {
            return <span title="产品信息" style={{fontSize:'14px'}}>{record.itemName}</span>
          } else if (record.sublineItemName) {
            return <span title="产品信息" style={{fontSize:'14px'}}>{record.sublineItemName}</span>
          } else {
            return "";
          }
        }
      },{
        title: '基本预算',
        dataIndex: 'budget',
        width : '150px',
        sorter: true,
        render: (text, record, index) => {
          if (text) {
            return <span title="基本预算" style={{fontSize:'14px'}}>{record.budget+' CNY'}</span>;
          } else {
            return "";
          }
        }
      },{
        title: '成交金额',
        dataIndex: 'policyAmount',
        width : '150px',
        sorter: true,
        render: (text, record, index) => {
          if (text) {
            return <span title="成交金额" style={{fontSize:'14px'}}>{(""+text).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")+record.currency}</span>;
          } else {
            return "";
          }
        }
      },{
        title: '客户',
        dataIndex: 'applicant',
        width : '74px',
        render: (text, record, index) => {
          return <span title="客户" style={{fontSize:'14px'}}>{record.applicant}</span>
        }
      },{
        title: '渠道',
        dataIndex: 'channelName',
        width : '90px',
      },{
        title: '状态',
        dataIndex: 'status',
        width : '90px',
        render: (text, record, index) => {
          if (text) {
            return this.state.codeList.orderStatusList.map((code) => {
              if (text == code.value) {
                return code.meaning;
              }
            });
          } else {
            return text||"";
          }
        }
      },{
        title: '操作',
        width : '140px',
        render: (text, record, index) => {
          if(
            record.status =='NEGOTIATE'||
            record.status =='RESERVING')
          {
            return <div>
              <Dropdown  overlay=
                {<Menu>
                  <Menu.Item key={index+'_1'}>
                    <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={()=>location.hash = '/order/orderImmigrantInvest/OrderImmigrantInvestDetail/personal/'+record.orderId}>查看详情</Button>
                  </Menu.Item>
                  <Menu.Item key={index+'_2'}>
                    <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.cancelOrder.bind(this,record)}>取消预约</Button>
                  </Menu.Item>
                  <Menu.Item key={index+'_3'}>
                    <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.orderShowLog.bind(this,record)} >查看日志</Button>
                  </Menu.Item>
                </Menu>}
                placement="bottomLeft">
                <Button type='default' style={{fontSize:'14px',width:'110px'}}>操作</Button>
              </Dropdown>
            </div>
          }
          else if(
            record.status =='BUY_SUCCESS'||
            record.status =='RESERVE_CANCELLED')
          {
            return <div>
              <Dropdown  overlay=
                {<Menu>
                  <Menu.Item key={index+'_1'}>
                    <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={()=>location.hash = '/order/orderImmigrantInvest/OrderImmigrantInvestDetail/personal/'+record.orderId}>查看详情</Button>
                  </Menu.Item>
                  <Menu.Item key={index+'_2'}>
                    <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.orderShowLog.bind(this,record)} >查看日志</Button>
                  </Menu.Item>
                </Menu>}
                placement="bottomLeft">
                <Button type='default' style={{width:'110px'}}>操作</Button>
              </Dropdown>
            </div>
          }
        }
      }
    ];
    const columns2 = [
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        width : '150px',
        render: (text, record, index) => {
          return <div>
            <a style={{fontSize:'14px',color:'#d1b97f',}} onClick={()=>location.hash = '/order/orderImmigrantInvest/OrderImmigrantInvestDetail/personal/'+record.orderId}>{record.orderNumber}</a>
          </div>
        }
      },{
        title: '产品信息',
        dataIndex: 'itemName',
        render: (text, record, index) => {
          if (record.itemName && record.sublineItemName) {
            return <span title="产品信息" style={{fontSize:'14px'}}>{record.itemName+'-'+record.sublineItemName}</span>
          } else if (record.itemName) {
            return <span title="产品信息" style={{fontSize:'14px'}}>{record.itemName}</span>
          } else if (record.sublineItemName) {
            return <span title="产品信息" style={{fontSize:'14px'}}>{record.sublineItemName}</span>
          } else {
            return "";
          }
        }
      },{
        title: '基本预算',
        dataIndex: 'budget',
        width : '150px',
        sorter: true,
        render: (text, record, index) => {
          if (text) {
            return <span title="基本预算" style={{fontSize:'14px'}}>{record.budget+' CNY'}</span>;
          } else {
            return "";
          }
        }
      },{
        title: '成交金额',
        dataIndex: 'policyAmount',
        width : '150px',
        sorter: true,
        render: (text, record, index) => {
          if (text) {
            return <span title="成交金额" style={{fontSize:'14px'}}>{(""+text).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")+record.currency}</span>;
          } else {
            return "";
          }
        }
      },{
        title: '客户',
        dataIndex: 'applicant',
        width : '74px',
        render: (text, record, index) => {
          return <span title="客户" style={{fontSize:'14px'}}>{record.applicant}</span>
        }
      },{
        title: '状态',
        dataIndex: 'status',
        width : '90px',
        render: (text, record, index) => {
          if (text) {
            return this.state.codeList.orderStatusList.map((code) => {
              if (text == code.value) {
                return code.meaning;
              }
            });
          } else {
            return text||"";
          }
        }
      },{
        title: '操作',
        width : '140px',
        render: (text, record, index) => {
          if(
            record.status =='NEGOTIATE'||
            record.status =='RESERVING')
          {
            return <div>
              <Dropdown  overlay=
                {<Menu>
                  <Menu.Item key={index+'_1'}>
                    <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={()=>location.hash = '/order/orderImmigrantInvest/OrderImmigrantInvestDetail/personal/'+record.orderId}>查看详情</Button>
                  </Menu.Item>
                  <Menu.Item key={index+'_2'}>
                    <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.cancelOrder.bind(this,record)}>取消预约</Button>
                  </Menu.Item>
                  <Menu.Item key={index+'_3'}>
                    <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.orderShowLog.bind(this,record)} >查看日志</Button>
                  </Menu.Item>
                </Menu>}
                placement="bottomLeft">
                <Button type='default' style={{fontSize:'14px',width:'110px'}}>操作</Button>
              </Dropdown>
            </div>
          }
          else if(
            record.status =='BUY_SUCCESS'||
            record.status =='RESERVE_CANCELLED')
          {
            return <div>
              <Dropdown  overlay=
                {<Menu>
                  <Menu.Item key={index+'_1'}>
                    <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={()=>location.hash = '/order/orderImmigrantInvest/OrderImmigrantInvestDetail/personal/'+record.orderId}>查看详情</Button>
                  </Menu.Item>
                  <Menu.Item key={index+'_2'}>
                    <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.orderShowLog.bind(this,record)} >查看日志</Button>
                  </Menu.Item>
                </Menu>}
              placement="bottomLeft">
                <Button type='default' style={{width:'110px'}}>操作</Button>
              </Dropdown>
            </div>
          }
        }
      }
    ];
    return (
      <div>
        <div>
          <Form onSubmit={this.handleSearch}>
            <Row>
              <Col span={4} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout}  >
                  {getFieldDecorator('status')(
                    <Select placeholder="状态">
                      {
                        this.state.codeList.orderStatusList.map((item)=>
                          <Option key={item.value}>{item.meaning}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={4} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('orderNumber')(
                    <Input placeholder="订单编号" />
                  )}
                </FormItem>
              </Col>
              <Col span={4} style={{paddingRight:'10px'}}>
              </Col>
              <Col span={6} style={{paddingRight:'10px'}}>
              </Col>
              <Col span={6}>
                <Button onClick={()=>location.hash = '/production/subscribe/DC/orderAdd/DC'} style={{fontSize:'20px',height:'40px',width : '140px',float:'right',backgroundColor:JSON.parse(localStorage.theme).themeColor,color:'white'}}>添加订单</Button>

              </Col>
            </Row>
            <Row>
              <Col span={4} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('applicant')(
                    <Input placeholder="客户" style={{width:'100%',height:'40px'}} />
                  )}
                </FormItem>
              </Col>
              <Col span={8} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('itemName')(
                    <Input  style={{width:'100%',height:'40px'}} placeholder="产品信息"/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <Button type='primary' onClick={this.handleReset} style={{fontSize:'20px',marginLeft:'10px',height:'40px',width : '140px',float:'right'}} >全部</Button>
                <Button type='default' htmlType="submit" style={{fontSize:'20px',width : '140px',height:'40px',float:'right'}} >查询</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div>
          <Table rowKey='orderId'
                 columns={JSON.parse(localStorage.user).userType == "ADMINISTRATION"?columns1:columns2}
                 dataSource={this.state.orderList.rows || []}
                  bordered
                  onChange={this.tableChange.bind(this)}
                  pagination={{
                    pageSizeOptions: ['5','10','20','50'],
                    pageSize: this.state.pageSize,
                    total:this.state.orderList.total || 0,
                    current: this.state.page,
                  }}/>
        </div>
      </div>
    );
  }

}

OrderImmigrantInvestPerson = Form.create()(OrderImmigrantInvestPerson);

export default OrderImmigrantInvestPerson;
