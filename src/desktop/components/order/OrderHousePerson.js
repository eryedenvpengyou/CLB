import { Form, Row, Col, Input, Select, Button, Table, Dropdown, Menu, Icon,Modal } from 'antd';
import * as service from '../../services/order';
import * as codeService from '../../services/code';
import * as styles2 from '../../styles/order.css'
import Modals from '../common/modal/Modal';
import Download from '../common/Download';
import OrderHouseSign from './OrderHouseSign';

const FormItem = Form.Item;
const Option = Select.Option;

class OrderHousePerson extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      codeList: {
        orderStatusList: [],
        currencyList:[]
      },
      orderBy: [],
      pageSize: 20,
      page: 1,
      visible: false,
      signBackVisible:false,
      orderList: {},
      record:{},
      signBackRecord:{},
      customerList:[],
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
      orderType : 'HOUSE'
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
// 全部
  handleReset = () => {
    this.state.orderBy = [];
    this.state.page = 1;
    this.props.form.resetFields();
    let paramOrderPerson = {
      orderType : 'HOUSE'
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
      orderType : 'HOUSE'
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
      orderType : 'HOUSE'
    };
    service.fetchOrderPersonListService(paramOrderPerson).then((data) => {
      if (data.success) {
        this.setState({
          orderList: data,
        });
      }
    });
  }
  //上传预订单
  signModal(record){
    this.setState({
      record,
      visible:true
    });
    service.getOrdCustomer({orderId: record.orderId }).then((data)=>{
      this.setState({customerList:data.rows[0]})
     });
  }
  //上传预订单回调
  callback(record){
    const paramOrderPerson = {
      page:1,
      pageSize:20,
      orderType : 'HOUSE'
    };
    if (this.props.form.getFieldValue('applicant')){
      paramOrderPerson.applicant = this.props.form.getFieldValue('applicant');
    }
    else if(this.props.form.getFieldValue('status')) {
      paramOrderPerson.status = this.props.form.getFieldValue('status');
    }
    else if( this.props.form.getFieldValue('orderNumber')){
      paramOrderPerson.orderNumber = this.props.form.getFieldValue('orderNumber');
    }
    else if(this.props.form.getFieldValue('itemName')){
      paramOrderPerson.item = this.props.form.getFieldValue('itemName');
    } else{
      const paramOrderPerson = {
        orderType : 'HOUSE'
      };
    }
      service.fetchOrderPersonListService(paramOrderPerson).then((data) => {
        if (data.success) {
          this.setState({
            orderList: data,
          });
        }
      });
  }
  //关闭上传预订单
  close(e){
    this.setState({visible:false})
  }
  //签回合同
  signBack(record){
    this.setState({
      signBackRecord:record,
      signBackVisible:true
    })
  }
  //签回合同 关闭模态框
  onCancel=()=>{
    this.setState({signBackVisible:false})
  }
  //签回合同 提交
  modalSubmit(e){
    this.props.form.validateFields((err,values) =>{
      if(!err){
        const signBackParam = {};
        signBackParam.orderNumber = this.state.signBackRecord.orderNumber;
        signBackParam.status = this.state.signBackRecord.status;
        signBackParam.hourseExpressInfo = values.expressage;
        signBackParam.orderId = this.state.signBackRecord.orderId;
        signBackParam.clientFlag = 'Y';
        service.submitOrder([signBackParam]).then((data)=>{
          if(data.success){
            Modals.success({title:'成功'});
            this.onCancel();
            this.callback(data.rows[0]);
          }else{
            Modals.error({
              title: '提交失败！',
              content: `请联系系统管理员,${data.message}`,
            });
          }
        })
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      wrapperCol: { span: 24 },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 13 },
      },
    };
    const columns1 = [
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        width : '150px',
        render: (text, record, index) => {
          return <div>
            {<a style={{fontSize:'14px',color:'#d1b97f',}} onClick={()=>location.hash = '/order/orderHouse/orderHouseDetail/personal/'+record.orderId}>{record.orderNumber}</a>}
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
              item.value == record.currency ? <span key={item.value}>{item.meaning}</span> :''
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
          return record.vistitsTimeStart && record.vistitsTimeTo ?
          <span title="考察时间" style={{fontSize:'14px'}}>{record.vistitsTimeStart} {`至`} {record.vistitsTimeTo}</span>:
          ''
        }
      },{
        title: '签约日期',
        dataIndex: 'dealTime',
        //width : '90px',
        render: (text, record, index) => {
          if(record.issueDate !== null){
            var sDate = record.issueDate;
            sDate = sDate.replace(/-/g,"/");
            var newDate = new Date(sDate);
            var issueDate = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();
            return <span title="签约日期" style={{fontSize:'14px'}}>{issueDate}</span>
          }else{
            return <span title="签约日期" style={{fontSize:'14px'}}>{record.issueDate}</span>
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
          //需签预定单
          else if(record.status == 'SIGNING_PRE-ORDER'){
            return <div>
              <Dropdown overlay=
                {<Menu>
                  {
                    record.reservationsFileId ?
                      <Menu.Item key={index + '_1'}>
                        <Download fileId={record.reservationsFileId}>
                          <Button type='default' style={{ fontSize: '14px', width: '100px' }}>下载预定单</Button>
                        </Download>
                      </Menu.Item> : ''
                  }
                  <Menu.Item key={index+'_2'}>
                    <Button type='default' style={{fontSize:'14px',width:'100px'}} onClick={this.signModal.bind(this,record)} >上传预定单</Button>
                  </Menu.Item>
                  <Menu.Item key={index+'_3'}>
                    <Button type='default' style={{fontSize:'14px',width:'100px'}} onClick={this.orderShowLog.bind(this,record)} >查看日志</Button>
                  </Menu.Item>
                </Menu>}
                placement="bottomLeft">
                <Button type='default' style={{width:'110px'}}>操作</Button>
              </Dropdown>
            </div>
          }
          //需签合同
          else if(record.status == 'SIGNING_CONTRACT'){
            return <div>
              <Dropdown  overlay=
                {<Menu>
                  {
                  record.contractFileId ?
                    <Menu.Item key={index + '_1'}>
                      <Download fileId={record.contractFileId}>
                        <Button type='default' style={{ fontSize: '14px', width: '90px' }}>下载合同</Button>
                      </Download>
                    </Menu.Item> : ''
                  }
                  <Menu.Item key={index+'_2'}>
                    <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.signBack.bind(this,record)} >签回合同</Button>
                  </Menu.Item>
                  <Menu.Item key={index+'_3'}>
                    <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.orderShowLog.bind(this,record)} >查看日志</Button>
                  </Menu.Item>
                </Menu>}
                placement="bottomLeft">
                <Button type='default' style={{width:'110px'}}>操作</Button>
              </Dropdown>
            </div>
          }
          //需复查
          else if(record.status == "NEED_CHECKING"){
            return <div>
              <Dropdown overlay=
                {<Menu>
                  <Menu.Item key={index + '_1'}>
                    <Button type='default' style={{ fontSize: '14px', width: '90px' }} onClick={() => location.href = `/#/production/subscribe/FC/orderQuery/${record.orderId}`}>修改订单</Button>
                  </Menu.Item>
                  <Menu.Item key={index+'_2'}>
                    <Button type='default' style={{fontSize:'14px',width:'90px'}} onClick={this.cancelOrder.bind(this,record)}>取消预约</Button>
                  </Menu.Item>
                  <Menu.Item key={index + '_3'}>
                    <Button type='default' style={{ fontSize: '14px', width: '90px' }} onClick={this.orderShowLog.bind(this, record)} >查看日志</Button>
                  </Menu.Item>
                </Menu>}
                placement="bottomLeft">
                <Button type='default' style={{ width: '110px' }}>操作</Button>
              </Dropdown>
            </div>
          }
          else{
            return <div>
              <Dropdown  overlay=
                {<Menu>
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
                <Button onClick={()=>location.hash = '/production/subscribe/FC/orderAdd/FC'} style={{fontSize:'20px',height:'40px',width : '140px',float:'right',backgroundColor:JSON.parse(localStorage.theme).themeColor,color:'white'}}>立即预约</Button>

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
                 columns={columns1}
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
        <OrderHouseSign
          visible={this.state.visible}
          close={this.close.bind(this)}
          record = {this.state.record}
          customerList={this.state.customerList}
          callback={this.callback.bind(this)}
         />
        <Modal
          title='补充快递信息'
          width={600}
          style={{ top: 200 }}
          maskClosable={false}
          closable={true}
          footer={null}
          visible={this.state.signBackVisible}
          onCancel={this.onCancel}
          className={styles2.houseModal}
        >
          <Form>
            <div style={{ padding: '10px', margin: '15px 25px 10px 25px' }}>
              <FormItem {...formItemLayout1} label="快递信息" >
                {getFieldDecorator('expressage', {
                  rules: [
                    { required: true, message: '请输入快递公司和快递单号', whitespace: true }
                  ],
                })(
                  <Input type="textarea" placeholder="请输入快递公司和快递单号" />
                  )}
              </FormItem>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Button onClick={this.onCancel} type="default" style={{ width: '120px', height: '38px',marginLeft: '100px' }} >取消</Button>
              <Button onClick={this.modalSubmit.bind(this)} type="primary" style={{ width: '120px', height: '38px', marginLeft: '32px' }} >确定</Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }

}
export default Form.create()(OrderHousePerson);
