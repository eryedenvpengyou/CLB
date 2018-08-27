import {Badge, Form, Row, Col, Input, Select, Button, Table, Icon, Menu, Dropdown, } from 'antd';
import * as service from '../../services/order';
import Modals from '../common/modal/Modal';
import { getCode } from '../../services/code';
import * as styles from '../../styles/order.css';

const FormItem = Form.Item;
const Option = Select.Option;

class AfterPerson extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      page: 1,
      pageSize: 20,
      orderBy: [],
      after:{},
      codeList:{
        afterStatusCodes:[],
        afterLogCodes:[]
      },
      afterTypeData:[],
      totle:''
    }
  }

  //改变组件调用的方法
  componentWillReceiveProps(nextProps){
    if(this.props.key1 !== nextProps.key1) {
      //获取售后列表个人数据
      service.fetchAfterService().then((data) => {
        if(data.success){
          data.rows.map((row, index) => {
            row.key = index;
          });
          this.setState({
            after : data,
          });
        }
      });
      //获取快码
      const codeBody = {
        afterStatusCodes: 'ORD.AFTER_STATUS',
        afterLogCodes: 'ORD.AFTER_LOG',
      };
      getCode(codeBody).then((data)=>{
        this.setState({
          codeList: data,
        });
      });
      let params = {};
      params.page = 1;
      params.pageSize = this.state.pageSize;
      service.queryOrdAfterType(params).then((data) => {
        if (data.success) {
          if(data.rows){
            let bb = [];
            for(let i = 0; i<data.rows.length;i++){
              let afterTypeObject = {
                value:"",
                meaning:"",
              };
              afterTypeObject.value = data.rows[i].afterType;
              afterTypeObject.meaning = data.rows[i].afterType;
              bb.push(afterTypeObject);
            }
            this.setState({
              afterTypeData: bb,
              page: 1,
            });
          }
        }
      });
      this.getTotal();
    }
  }

  componentWillMount(){
    let params = {};
    params.page = 1;
    params.pageSize = this.state.pageSize;
    //获取售后列表个人数据
    service.fetchAfterService(params).then((data) => {
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({
          after : data,
          page : 1
        });
      }
    });
    //获取快码
    const codeBody = {
      afterStatusCodes: 'ORD.AFTER_STATUS',
      afterLogCodes: 'ORD.AFTER_LOG',
    };
    getCode(codeBody).then((data)=>{
      this.setState({
        codeList: data,
      });
    });
    service.queryOrdAfterType().then((data) => {
      if (data.success) {
        if(data.rows){
          let bb = [];
          for(let i = 0; i<data.rows.length;i++){
            let afterTypeObject = {
              value:"",
              meaning:"",
            };
            afterTypeObject.value = data.rows[i].afterType;
            afterTypeObject.meaning = data.rows[i].afterType;
            bb.push(afterTypeObject);
          }
          this.setState({
            afterTypeData: bb,
          });
        }
      }
    });
    this.getTotal();
  }

  getTotal(){
    service.fetchRenewalPersonService().then((data) => {
      if (data.success) {
        let j = 0;
        for (let i = 0;i<data.rows.length;i++){
          if(data.rows[i].renewalStatus=='ADMIN'||data.rows[i].renewalStatus=='NACHFRIST'||data.rows[i].renewalStatus == 'TOFAIL'||data.rows[i].renewalStatus == 'TORENEWAL'){
            j++
          }
        }
        this.setState({
          totle:j
        });
      }
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
    });
    let  params = {
      afterStatus : this.props.form.getFieldValue('afterStatus'),
      afterType :this.props.form.getFieldValue('afterType'),
      person :this.props.form.getFieldValue('person'),
      item :this.props.form.getFieldValue('item'),
      number :this.props.form.getFieldValue('number'),
    };
    params.page = 1;
    params.pageSize = this.state.pageSize;
    service.fetchAfterService(params).then((data) => {
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({
          after : data,
          page : 1
        });
      }
    });
    this.getTotal()
  }
  handleReset = () => {
    this.props.form.resetFields();
    let params = {};
    params.page = 1;
    params.pageSize = this.state.pageSize;
    service.fetchAfterService(params).then((data) => {
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({
          after : data,
          page : 1
        });
      }
    });
    this.getTotal()
  }

  //取消订单
  cancelAfter(value,that) {
    let flag;
    if(value.afterStatus=='FAIL'||value.afterStatus=='SUCCESS'){
      Modals.error({
        content: '未提交、处理成功、处理失败的售后数据不允许取消！',
      });
    }else {
      Modals.warning(this.cancelOK.bind(flag,value,that),'您确定取消订单吗？');
    }
  }
  //取消点击OK的方法
  cancelOK(value,that,flag) {
    if(flag) {
      const params = {
        afterId: value.afterId,
        afterStatus: value.afterStatus
      };
      //取消调用的方法
      service.fetchCancelAfterService(params).then((data) => {
        if (data.success) {
          service.fetchAfterService().then((data) => {
            if(data.success){
              that.setState({
                after : data,
              });
            }
          });
        } else {
          Modals.error({
            content: data.message,
          });
        }
      });
      that.getTotal();
    }
  }

  //售后日志方法
  orderShowLog(record){
    const params ={
      generalId:record.afterId,
      idType:'AFTER'
    }
    //查询日志数据
    service.fetchAfterLogService(params).then((data)=>{
      const statusHisList = data.rows || [];
      const afterLog = this.state.codeList.afterLogCodes
      if(statusHisList){
        for(let i = 0 ; i < statusHisList.length ; i++){
          for(let j = 0 ; j<afterLog.length;j++){
            if(statusHisList[i].state == afterLog[j].value){
              statusHisList[i].statusM = afterLog[j].meaning
            }
          }
        }
      }
      this.setState({statusHisList: statusHisList});
      Modals.LogModel({List:this.state.statusHisList})
    });
  }

  //跟进的方法
  readFollow(record){
    if(record.afterType=='续保'){
      location.hash = '/after/AfterFollowApplication/'+record.afterId+'/'+record.orderId+'/'+record.afterStatus
    }
    else if(record.afterType=='冷静期后退保'||record.afterType=='冷静期内退保' || record.afterType == '批核中退保'){
      location.hash = '/after/AfterFollowExit/'+record.afterId+'/'+record.orderId+'/'+record.afterStatus
    }else {
      location.hash = '/after/AfterFollowOther/'+record.afterId + '/' + record.orderId + '/'+record.afterStatus
    }
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
    let params = {};
    params = {
      afterStatus : this.props.form.getFieldValue('afterStatus'),
      afterType :this.props.form.getFieldValue('afterType'),
      person :this.props.form.getFieldValue('person'),
      item :this.props.form.getFieldValue('item'),
      number :this.props.form.getFieldValue('number'),
    }
    params.page = pagination.current;
    params.pageSize = pagination.pageSize;
    params.orderBy = (orderBy||[]).toString();
    //售后列表个人数据
    service.fetchAfterService(params).then((data)=>{
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({page: pagination.current, after: data});
      }
    })
    this.setState({orderBy});
    this.getTotal();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      wrapperCol: { span: 24 },
    };
    const columns = [
      {
        title: '售后编号',
        dataIndex: 'afterNum',
        width : '150px',
        render: (text, record, index) => {
          return <div>
            <a style={{fontSize:'14px',color:'#d1b97f',}} onClick={this.readFollow.bind(this,record)}>{record.afterNum}</a>
          </div>
        }
      },{
        title: '保单编号',
        dataIndex: 'policyNumber',
        width : '150px',
        render: (text, record, index) => {
          return <div>
            <a style={{fontSize:'14px',color:JSON.parse(localStorage.theme).themeColor}} onClick={()=>location.hash = '/order/OrderDetail/personal/'+record.orderId}>{record.policyNumber}</a>
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
        width : '74px',
        render: (text, record, index) => {
          return <span style={{fontSize:'14px'}}>{record.applicant}</span>
        }
      },{
        title: '受保人',
        dataIndex: 'insurant',
        width : '74px',
        render: (text, record, index) => {
          return <span style={{fontSize:'14px'}}>{record.insurant}</span>
        }
      }, {
        title: '渠道',
        dataIndex: 'channelName',
        width : '90px',
        render: (text, record, index) => {
          return <span style={{fontSize:'14px'}}>{record.channelName}</span>
        }
      },{
        title: '售后类型',
        dataIndex: 'afterType',
        width : '108px',
        render: (text, record, index) => {
          return <span style={{fontSize:'14px'}}>{record.afterType}</span>
        }
      },{
        title: '状态',
        width : '135px',
        dataIndex: 'afterStatus',
        render: (text, record, index) => {
          if (text) {
            return this.state.codeList.afterStatusCodes.map((code, index) => {
              if (text == code.value) {
                return <div style={{fontSize:'14px'}} key={index}>{code.meaning}</div>
              }
            });
          } else {
            return text||"";
          }
        }
      },{
        title: '操作',
        width: 140,
        render: (text, record, index) => {
          if(record.afterStatus=='FAIL'||
            record.afterStatus=='SUCCESS'||
            record.afterStatus=='CANCELED'||
            record.afterStatus=='SUBMIT')
          {
            return <div>
              <Dropdown
                overlay=
                  {<Menu>
                    <Menu.Item>
                      <Button style={{width:'100px',fontSize:'14px'}} type='default'
                              onClick={this.readFollow.bind(this,record)}>查看详情</Button>
                    </Menu.Item>
                    <Menu.Item>
                      <Button style={{width:'100px',fontSize:'14px'}} type='default'
                              onClick={this.orderShowLog.bind(this,record)} >查看日志</Button>
                    </Menu.Item>
                  </Menu>}
                placement="bottomLeft">
                <Button type='default' style={{width:'110px',fontSize:'14px'}}>操作</Button>
              </Dropdown>
            </div>
          }else {
            return <div>
              <Dropdown
                overlay=
                  {<Menu>
                    <Menu.Item>
                      <Button style={{width:'100px',fontSize:'14px'}} type='default'
                              onClick={this.readFollow.bind(this,record)}>查看详情</Button>
                    </Menu.Item>
                    <Menu.Item>
                      <Button style={{width:'100px',fontSize:'14px'}} type='default'
                              onClick={this.orderShowLog.bind(this,record)} >查看日志</Button>
                    </Menu.Item>
                    <Menu.Item>
                      <Button style={{width:'100px',fontSize:'14px'}} type='default'
                              onClick={this.cancelAfter.bind(this,record,this)} >取消</Button>
                    </Menu.Item>
                  </Menu>}
                placement="bottomLeft">
                <Button type='default' style={{width:'110px',fontSize:'14px'}}>操作</Button>
              </Dropdown>
            </div>
          }
        }
      }
    ];
    return (
      <div>
        <div style={{paddingRight:'10px'}}>
          <Form onSubmit={this.handleSearch}>
            <Row>
              <Col span={4} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout} >
                  {getFieldDecorator('afterStatus')(
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
                  {getFieldDecorator('afterType')(
                    <Select placeholder="售后类型">
                      {
                        this.state.afterTypeData &&
                        this.state.afterTypeData.map((item)=>
                          <Option key={item.value}>{item.meaning}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={4} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('person')(
                    <Input placeholder="投保人/受保人/拼音"/>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
              </Col>
              <Col span={3}>
                <Button type='primary' style={{fontSize:'20px',width:'140px',height:'40px'}} onClick={()=>location.hash ='/after/AfterNew/0/0/'+0}>售后申请</Button>
              </Col>
              <Col span={3}>
                <Badge id='total' count={this.state.totle} >
                  <Button type='primary' style={{fontSize:'20px',width:'140px',height:'40px'}} onClick={()=> {location.hash = '/after/AfterRenewal/list'}}>待续保清单</Button>
                </Badge>
              </Col>
            </Row>
            <Row>
              <Col span={4} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('number')(
                    <Input placeholder="售后编号/保单编号"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('item')(
                    <Input placeholder="产品"/>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
              </Col>
              <Col span={3}>
                <Button htmlType="submit" type='default' style={{fontSize:'20px',width:'140px',height:'40px'}}>查询</Button>
              </Col>
              <Col span={3}>
                <Button onClick={this.handleReset} type='primary' style={{fontSize:'20px',width:'140px',height:'40px'}}>全部</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div >
          <Table
            dataSource={this.state.after.rows}
            columns={columns}
            bordered
            onChange={this.tableChange.bind(this)}
            pagination={{
              current: this.state.page || 1,
              pageSize: this.state.pageSize || 20,
              total:this.state.after.total || 0,
            }}
          />
        </div>
      </div>
    );
  }

}

AfterPerson = Form.create()(AfterPerson);

export default AfterPerson;
