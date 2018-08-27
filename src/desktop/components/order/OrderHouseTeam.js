import { Form, Row, Col, Input,Select, Button, Table, Dropdown, Menu, Icon } from 'antd';
import * as service from '../../services/order';
import * as codeService from '../../services/code';
import * as styles from '../../styles/ordersummary.css';
import Modals from '../common/modal/Modal';

const FormItem = Form.Item;
const Option = Select.Option;

class OrderHouseTeam extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      codeList: {
        orderStatusList: [],
        currencyList:[]
      },
      orderBy: [],
      page: 1,
      pageSize: 20,
      visible: false,
      orderList:{},
    };
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.state.orderBy = [];
    this.state.page = 1;
    const paramOrderTeam = {
      page : 1,
      pageSize : this.state.pageSize,
      applicant : this.props.form.getFieldValue('applicant'),
      status :this.props.form.getFieldValue('status'),
      orderNumber :this.props.form.getFieldValue('orderNumber'),
      item:this.props.form.getFieldValue('itemName'),
      channelName :this.props.form.getFieldValue('channelName'),
      orderType : 'HOUSE'
    };
    service.fetchOrderTeamListService(paramOrderTeam).then((data) => {
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
    const paramOrderTeam = {
      orderType : 'HOUSE',
      page : 1,
      pageSize : this.state.pageSize,
    };
    service.fetchOrderTeamListService(paramOrderTeam).then((data) => {
      if(data.success){
        this.setState({
          orderList:data
        });
      }
    });
  }

  //改变组件调用的方法
  componentWillReceiveProps(nextProps){
    this.state.orderBy = [];
    this.state.page = 1;
    if(this.props.key2 !== nextProps.key2) {
      let paramsCode ={
        orderStatusList: 'ORD.HOUSE_STATUS',  //海外房产订单状态
        currencyList:'PUB.CURRENCY'//币种
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
      orderStatusList: 'ORD.HOUSE_STATUS',  //海外房产订单状态
      currencyList:'PUB.CURRENCY'//币种
    };
    codeService.getCode(paramsCode).then((data)=>{
      this.setState({
        codeList: data,
      });
    });
    this.selectList();
  }

  //分页
  tableChange(pagination, filters, sorter) {
    let params = {};
    params = {
      applicant : this.props.form.getFieldValue('applicant'),
      status :this.props.form.getFieldValue('status'),
      orderNumber :this.props.form.getFieldValue('orderNumber'),
      item :this.props.form.getFieldValue('itemName'),
      channelName :this.props.form.getFieldValue('channelName'),
      orderType : 'HOUSE'
    }
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
    service.fetchOrderTeamListService(params).then((data)=>{
      if(data.success){
        this.setState({
          orderList: data,
          page: pagination.current,
        });
      }
    });
  }

  //查看日志
  orderShowLog(record) {
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

  selectList = () => {
    //个人数据
    this.state.page = 1;
    let paramOrderPerson ={
      orderType : 'HOUSE'
    };
    paramOrderPerson.page = 1;
    paramOrderPerson.pageSize = this.state.pageSize;
    service.fetchOrderTeamListService(paramOrderPerson).then((data) => {
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
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        width : '150px',
        render: (text, record, index) => {
          return <div>
            <a style={{fontSize:'14px',color:'#d1b97f',}} onClick={()=>location.hash = '/order/orderHouse/orderHouseDetail/team/'+record.orderId}>{record.orderNumber}</a>
          </div>
        }
      },{
        title: '产品信息',
        dataIndex: 'itemName',
        render: (text, record, index) => {
            return <span title="产品信息" style={{fontSize:'14px'}}>{record.item}</span>
        }
      },{
        title: '币种',
        dataIndex: 'currency',
        //width : '150px',
        render: (text, record, index) => {
          if (text) {
              return this.state.codeList.currencyList.map((item) =>
                  item.value == record.currency ? <span key={item.value}>{item.meaning}</span> : ''
              )
          } else {
            return "";
          }
        }
      },{
        title: '成交金额',
        dataIndex: 'policyAmount',
        //width : '150px',
        sorter: true,
        render: (text, record, index) => {
          if (text) {
            return <span title="成交金额" style={{fontSize:'14px'}}>{(""+text).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")}</span>;
          } else {
            return "";
          }
        }
      },{
        title: '渠道',
        dataIndex: 'channelName',
        //width : '90px',
        sorter: true,
        render: (text, record, index) => {
          return <span title="渠道" style={{fontSize:'14px'}}>{record.channelName}</span>
        }
      },{
        title: '客户',
        dataIndex: 'applicant',
        //width : '74px',
        render: (text, record, index) => {
          return <span title="客户" style={{fontSize:'14px'}}>{record.applicant}</span>
        }
      },{
        title: '考察时间',
        dataIndex: 'inspectTime',
        //width : '90px',
        render: (text, record, index) => {
          return <span title="考察时间" style={{fontSize:'14px'}}>{record.vistitsTimeStart}</span>
        }
      },{
        title: '成交时间',
        dataIndex: 'dealTime',
        //width : '90px',
        render: (text, record, index) => {
          if(record.issueDate !== null){
            var sDate = record.issueDate;
            sDate = sDate.replace(/-/g,"/");
            var newDate = new Date(sDate);
            var issueDate = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();
            return <span title="成交时间" style={{fontSize:'14px'}}>{issueDate}</span>
          }else{
            return <span title="成交时间" style={{fontSize:'14px'}}>{record.issueDate}</span>
          }
        }
      },{
        title: '状态',
        dataIndex: 'status',
        render: (text, record, index) => {
          return this.state.codeList.orderStatusList.map((item) =>
            record.status == item.value ? <span title="状态" style={{ fontSize: '14px' }} key={item.value}>{item.meaning}</span> : ''
          )
        }
      },{
        title: '查看日志',
        width : '140px',
        render: (text, record, index) => {
            return <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.orderShowLog.bind(this,record)} >查看日志</Button>
        }
      }
    ];
    return (
      <div>
        <div>
          <Form onSubmit={this.handleSearch}>
            <Row>
              <Col span={4} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout} >
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
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('channelName')(
                    <Input placeholder="渠道" />
                  )}
                </FormItem>
              </Col>
              <Col span={6} style={{paddingRight:'10px'}}>
              </Col>
              <Col span={6}>
                <Button onClick={()=>location.hash = '/production/subscribe/FC/orderAdd/FC'} style={{fontSize:'20px',height:'40px',width : '140px',float:'right',backgroundColor:JSON.parse(localStorage.theme).themeColor,color:'white'}}>立即预约</Button>
              </Col>
            </Row>
            <Row>
              <Col span={4} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('applicant')(
                    <Input placeholder="客户" />
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
              <Col span={12}>
                <Button type='primary' onClick={this.handleReset} style={{fontSize:'20px',marginLeft:'10px',height:'40px',width : '140px',float:'right'}} >全部</Button>
                <Button type='default' htmlType="submit" style={{fontSize:'20px',width : '140px',height:'40px',float:'right'}} >查询</Button>
              </Col>
            </Row>
          </Form>
        </div>

        <div>
          <Table rowKey='orderId'
                columns={columns}
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
export default Form.create()(OrderHouseTeam);
