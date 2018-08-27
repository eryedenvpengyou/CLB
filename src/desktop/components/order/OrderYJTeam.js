import { Form, Row, Col, Input, Select, Button, Table, Dropdown, Menu, Icon, DatePicker } from 'antd';
import {Link} from 'dva/router'
import * as service from '../../services/order';
import * as codeService from '../../services/code';
import moment from 'moment';
import {handleTableChange} from '../../utils/table';
import {formatDay} from "../../utils/common";
import * as styles from '../../styles/ordersummary.css';
import Modals from '../common/modal/Modal';

const FormItem = Form.Item;
const Option = Select.Option;

class OrderYJTeam extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      codeList: {
        orderStatusList: [],
        currencyList:[]
      },
      orderBy: [],
      visible: false,
      dataList: [],
      pagination:{},
    };
  }

  componentWillMount() {
    let paramsCode = {
      orderStatusList: 'ORD.MEDICAL_EDU',  //
      currencyList: 'PUB.CURRENCY'//币种
    };
    codeService.getCode(paramsCode).then((data) => {
      console.log(data);
      this.setState({
        codeList: data,
      });
    });
    this.orderList();
  }

  orderList = () => {
    //团队数据
    this.state.body = {
      orderType : 'MEDICALEDU'
    };
    this.props.form.resetFields();
    service.fetchOrderTeamListService(this.state.body).then((data) => {
      if (data.success) {
        const pagination = this.state.pagination;
        pagination.total = data.total;
        pagination.current = 1;
        this.setState({
          dataList: data.rows,
          pagination
        });
      }
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.state.orderBy = [];
    this.state.body = {
      applicant: this.props.form.getFieldValue('applicant'),
      status: this.props.form.getFieldValue('status'),
      // orderNumber :this.props.form.getFieldValue('orderNumber'),
      itemName: this.props.form.getFieldValue('itemName'),
      orderType: 'MEDICALEDU',
      dateType: 'RESERVE',
      startDateActive: formatDay(this.props.form.getFieldValue('startDateActive')),
      endDateActive: formatDay(this.props.form.getFieldValue('endDateActive')),
      page : 1,
      pageSize : 10
    };
    service.fetchOrderTeamListService(this.state.body).then((data) => {
      if(data.success){
        const pagination = this.state.pagination;
        pagination.total = data.total;
        this.setState({
          dataList: data.rows,
          pagination
        });
      }
    });
  }

  disabledStartDate = (startValue) => {
    const endValue = this.props.form.getFieldValue('endDateActive');
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.props.form.getFieldValue('startDateActive');
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
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
 //查看日志
 orderShowLog(record){
  service.fetchOrderDetailordStatusHisList({orderId:record.orderId}).then((data)=>{
    const statusHisList = data.rows || [];
    this.setState({statusHisList: statusHisList});
    Modals.LogModel({List:this.state.statusHisList})
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
           {record.midClass == "FMSZ" &&<a style={{fontSize:'14px',color:'#d1b97f',}} onClick={()=>location.hash = '/order/orderYJ/orderYJDetail/team/FMSZ/'+record.orderId}>{record.orderNumber}</a>}
            {record.midClass == "GDYL" &&<a style={{fontSize:'14px',color:'#d1b97f',}} onClick={()=>location.hash = '/order/orderYJ/orderYJDetail/team/GDYL/'+record.orderId}>{record.orderNumber}</a>}
          </div>
        }
      },
      {
        title: '产品名称',
        dataIndex: 'itemName',
        render: (text, record, index) => {
            return <span title="产品名称" style={{fontSize:'14px'}}>{`${record.itemName}(${record.sublineItemName})`}</span>
        }
      },
      {
        title: '客户',
        dataIndex: 'applicant',
        render: (text, record, index) => {
          return <span title="客户" style={{fontSize:'14px'}}>{record.applicant}</span>
        }
      },
      {
        title: '渠道',
        dataIndex: 'channel',
        render: (text, record, index) => {
          return <span title="渠道" style={{fontSize:'14px'}}>{record.channelName}</span>
        }
      },
      {
        title: '预约/面签时间',
        dataIndex: 'reserveDate',
        render: (text, record, index) => {
          if (text) {
            return <span title="面签时间" style={{fontSize:'14px'}}>{record.reserveDate ? moment(record.reserveDate).format('YYYY-MM-DD HH:mm') : ''}</span>;
          } else {
            return "";
          }
        }
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        render: (text, record, index) => {
          return this.state.codeList.orderStatusList.map((item) =>
            record.status == item.value ? <span title="状态" style={{ fontSize: '14px' }} key={item.value}>{item.meaning}</span> : ''
          )
        }
      },
      {
        title: '操作',
        width : '140px',
        render: (text, record, index) => {
          return <div>
               <Dropdown  overlay=
                 {<Menu>
                   <Menu.Item >
                    <Button type='default' style={{ fontSize: '14px', width: '90px' }} onClick={this.orderShowLog.bind(this,record)}>
                      查看日志
                    </Button>
                  </Menu.Item>
                 </Menu>}
                 placement="bottomCenter">
                 <Button type='default' style={{fontSize:'14px',width:'110px'}}>操作</Button>
               </Dropdown>
          </div>
        }
      }
    ];
    return (
      <div>
        <div style={{position: 'relative'}}>
          <Link to={{
            pathname: `/production/subscribe/YJ/FMSZ/1000331`,
          }}>
            <Button type='primary' style={{fontSize:'20px',right:'0',top:'-70px',height:'40px',width : '140px',position:'absolute'}} >立即预约</Button>
          </Link>
          <Form onSubmit={this.handleSearch}>
            <Row>
              <Col span={3} style={{paddingRight:'10px'}}>
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
                  {getFieldDecorator('itemName')(
                    <Input  style={{width:'100%',height:'40px'}} placeholder="产品信息"/>
                  )}
                </FormItem>
              </Col>
              <Col span={3} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('applicant')(
                    <Input placeholder="客户" style={{width:'100%',height:'40px'}} />
                  )}
                </FormItem>
              </Col>
              <Col span={4} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout} style={{fontSize:'16px'}}>
                  {getFieldDecorator('startDateActive')(
                    <DatePicker
                      placeholder="预约/面签日期从"
                      disabledDate={this.disabledStartDate}
                      style={{width:'100%'}}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={4} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout} style={{fontSize:'16px'}}>
                  {getFieldDecorator('endDateActive')(
                    <DatePicker
                      placeholder="预约/面签日期至"
                      disabledDate={this.disabledEndDate}
                      style={{width:'100%'}}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <Button type='primary' onClick={this.orderList} style={{fontSize:'20px',marginLeft:'10px',height:'40px',width : '130px',float:'right'}} >全部</Button>
                <Button type='default' htmlType="submit" style={{fontSize:'20px',width : '130px',height:'40px',float:'right'}} >查询</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div>
          <Table rowKey='orderId'
                 columns={columns1}
                 dataSource={this.state.dataList}
                  bordered
                  onChange={handleTableChange.bind(this, service.fetchOrderPersonListService, this.state.body)}
                  pagination={this.state.pagination}/>
        </div>
      </div>
    );
  }

}
export default Form.create()(OrderYJTeam);
