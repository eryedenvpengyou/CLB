/*
 * show 我的计划书
 * @author:zhouting
 * @version:20170517
 */
import React from 'react';
import { connect } from 'dva';
import { Breadcrumb ,Row, Col,Button,Input,Table,DatePicker,Form,Icon,Select,Radio,Modal,Menu,Dropdown} from 'antd';
import style from '../../styles/plan.css';
import styles from '../../styles/common.css';
import { plan,team,person,view,downloadFile,cancelPlan} from '../../services/plan.js';
import {handleTableChange} from '../../utils/table';
import icon01 from '../../styles/images/mine/icon01.png';
import icon02 from '../../styles/images/mine/icon02.png';
import Download from '../common/Download';
import TipModal from "../common/modal/Modal";

const FormItem = Form.Item;
//日期选择范围
const RangePicker = DatePicker.RangePicker;
//单选框   
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class MyLines extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personList: [],
      teamList: [],
      body2: {
        userId: JSON.parse(localStorage.user).userId
      },
      body3: {
        userId: JSON.parse(localStorage.user).userId
      }
    }
  }
  showModal = () => {
    person(this.state.body2).then((data) =>{
      if (data.success) {
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({personList:data.rows});
      }
    });
    team(this.state.body3).then((data) =>{
      if (data.success) {
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({teamList:data.rows});
      }
    });
    this.setState({
      visible: true,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  //弹出框表格--个人
  c1 = [
    {
      title: '已使用额度',
      key:'personUsed',
      render:(record) => {return(<div>{record.usedAmount}</div>)}
    },
    {
      title: '总额度',
      key:'personTotal',
      render:(record) => {return(<div>{record.totalAmount}</div>)}
    },
    {
      title: '剩余额度',
      key:'personResidue',
      render:(record) => {return(<div>{record.avilAmount}</div>)}
    }
  ];
   //弹出框表格--团队
   c2 = [
    {
      title: '渠道',
      key:'teamChannel',
      render:(record) => {return(<div>{record.channelName}</div>)}
    },
    {
      title: '已使用额度',
      key:'teamUsed',
      render:(record) => {return(<div>{record.usedAmount}</div>)}
    },
    {
      title: '总额度',
      key:'teamTotal',
      render:(record) => {return(<div>{record.totalAmount}</div>)}
    },
    {
      title: '剩余额度',
      key:'teamResidue',
      render:(record) => {return(<div>{record.avilAmount}</div>)}
    }
  ];
  render() {
    return (
      <div className={style.pop}>
        <span onClick={this.showModal} className={style.textYellow}>查看额度</span>
        <Modal visible={this.state.visible}
          onCancel={this.handleCancel} 
          footer={null}
         width='836px' height='690px' className={style.limitAll}
        >
        {
          JSON.parse(localStorage.user).userType == "ADMINISTRATION" ? ""
          :
          <div>
            <p className={style.title}>我的额度</p>
            <Table className={style.modalT}  columns={this.c1} dataSource={this.state.personList} bordered pagination={false}></Table>
          </div>
        }
          <div>
            <p className={style.title}>团队成员额度</p>
            <Table className={style.modalT}  columns={this.c2} dataSource={this.state.teamList} bordered pagination={false}></Table>
          </div>
        </Modal>
      </div>
    );
  }
}

class myPlan extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dataList:[],
      orderBy: [],
      pagination:{},
      body : {
        orderBy: '',
        planId: '',
        status: '',
        requestNumber: '',
        insurantName: '',
        startDate: '',
        endDate: '',
        type: 'personal',
      },
      selectBody:{
        planId:'',
        status: '',
        requestNumber:'',
        insurantName:'',
        startDate:'',
        endDate:'',
        type:''
      }
    }
  }
  componentDidMount(){
    this.state.body.planId = ''
    this.state.body.status = '';
    this.state.body.requestNumber = '';
    this.state.body.insurantName = '';
    this.state.body.startDate = '';
    this.state.body.endDate = '';

    plan(this.state.body).then((data) => {
      if (data.success) {
        const pagination = this.state.pagination;
        pagination.total = data.total;
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({
          dataList: data.rows,
          pagination
        });
      } else {
        message.warn(data.message);
        return;
      }
    });
    if(JSON.parse(localStorage.user).userType == "ADMINISTRATION"){
      document.getElementsByClassName('team')[0].style.display ='none'
    }
    (function(){
       var ele = document.getElementsByClassName('ant-radio-button-wrapper');
       ele[0].style.borderColor = JSON.parse(localStorage.theme).themeColor;
       ele[0].style.backgroundColor = JSON.parse(localStorage.theme).themeColor;
       ele[0].style.color = '#fff';
       ele[1].style.color = '#000';
    })();
  }
  //查询按钮
  res() {
    this.state.orderBy = [];
    this.state.body.orderBy = '';
    const values = this.props.form.getFieldsValue();
    //获取时间
    if (values.rangePicker) {
      for (var i = 0; i < values.rangePicker.length; i++) {
        var start = values.rangePicker[0]._d.getFullYear() + '-' + (values.rangePicker[0]._d.getMonth() + 1) + '-' + values.rangePicker[0]._d.getDate();
        var end = values.rangePicker[1]._d.getFullYear() + '-' + (values.rangePicker[1]._d.getMonth() + 1) + '-' + values.rangePicker[1]._d.getDate();
      }
      this.state.body.startDate = start;
      this.state.body.endDate = end;
    }
    else {
      this.state.body.startDate = '';
      this.state.body.endDate = '';
    }
    this.state.body.status = values.status;
    this.state.body.requestNumber = values.num || '';
    this.state.body.insurantName = values.applicant || '';
    this.state.body.page = 1;
    this.state.body.pagesize = 10;
    plan(this.state.body).then((data) => {
      if (data.success) {
        const pagination = this.state.pagination;
        pagination.current = 1;
        pagination.total = data.total;
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({
          dataList: data.rows,
          pagination
        });
      } else {
        message.warn(data.message);
        return;
      }
    });
  }

  //tab标签
  handleClick(index,e) {
    this.state.orderBy = [];
    this.state.body.orderBy = '';
    this.state.body.page = 1;
    this.state.body.pagesize = 10;
    var ele = document.getElementsByClassName('ant-radio-button-wrapper');
    if(index == 0){
      ele[0].style.backgroundColor = JSON.parse(localStorage.theme).themeColor;
      ele[1].style.backgroundColor = '#fff';
      ele[0].style.color = '#fff';
      ele[1].style.color = '#333';
      ele[0].style.borderColor = JSON.parse(localStorage.theme).themeColor;
      ele[0].style.borderRight = JSON.parse(localStorage.theme).themeColor;
      this.state.body.type = 'personal'
    } else if(index == 1){
      ele[1].style.backgroundColor = JSON.parse(localStorage.theme).themeColor;
      ele[0].style.backgroundColor ='#fff';
      ele[1].style.color = '#fff';
      ele[0].style.color = '#333';
      ele[1].style.borderColor = JSON.parse(localStorage.theme).themeColor;
      ele[1].style.borderLeft = JSON.parse(localStorage.theme).themeColor;
      ele[1].style.boxShadow = 'none';
      this.state.body.type = 'team';
    }
    plan(this.state.body).then((data) => {
      if (data.success) {
        const pagination = this.state.pagination;
        pagination.current = 1;
        pagination.total = data.total;
        if (data.rows) {
          data.rows.map((row, index) => {
            row.key = index;
          });
        }
        this.setState({
          dataList: data.rows,
          pagination
        });
      } else {
        message.warn(data.message);
        return;
      }
    });
  }
  downloadClick(flag){
    var downloadBody = {
      downloadFlag:'Y',
      planId:flag
    }
    downloadFile(downloadBody).then((data) =>{
      if (!data.success) {
        TipModal.success({
          content: data.message
        });
      }
    });
  }
  //计划书申请取消
  handleCancel(record) {
    TipModal.warning(this.cancelOrderConfirm.bind(this,record),"确定取消申请该计划书吗？");
    
  }
  cancelOrderConfirm(record,flag) {
    if(flag){
      this.state.selectBody.status = 'PLN_CANCELLED' ;
      this.state.selectBody.type = this.state.body.type;
      this.state.selectBody.planId = record.planId
      cancelPlan(this.state.selectBody).then((data) => {
        if (data.success) {
          TipModal.success({
            title: '取消成功！',
          });
          setTimeout(function() {
            window.location.reload();
          }, 2000);
        } else {
          TipModal.error({
            title: '取消失败！',
            content: `请联系系统管理员,${data.message}`,
          });
        }
      }); 
    }
  }
  //渲染
  render(){
    //表单
    const {getFieldDecorator,getFieldValue,resetFields} = this.props.form;
    //重置
    const handleReset = () => {
      resetFields();
      this.state.orderBy = [];
      this.state.body.orderBy = '';
      this.state.body.planId = '';
      this.state.body.status = '';
      this.state.body.requestNumber = '';
      this.state.body.insurantName = '';
      this.state.body.startDate = '';
      this.state.body.endDate = '';
      plan(this.state.body).then((data) => {
        if (data.success) {
          const pagination = this.state.pagination;
          pagination.total = data.total;
          pagination.current = 1;
          data.rows.map((row, index) => {
            row.key = index;
          });
          this.setState({
            dataList: data.rows,
            pagination
          });
        } else {
          message.warn(data.message);
          return;
        }
      });
    }
    //表格
    const columns = [
      {
        title: '计划书申请编号',
        dataIndex: 'planNum',
        width: '180px',
        render:(text,record)=>{
          let status
          record.status == 'REVIEW'?status = 'edit':status = 'view'
          if( this.state.body.type == 'personal'){
            return <a style={{color:'#d1b97f'}} href={`/#/plan/planApply/${status}/${record.planId}/1`}>{record.requestNumber}</a>
          }else if( this.state.body.type == 'team'){
            return <a style={{color:'#d1b97f'}} href={`/#/plan/planApply/${status}/${record.planId}/2`}>{record.requestNumber}</a>
          }
        }
      }];
      if(this.state.body.type == 'team' || JSON.parse(localStorage.user).userType == "ADMINISTRATION") {
        columns.push({
          title: '渠道',
          dataIndex: 'channelName',
          width : '90px',
        });
      }
      columns.push(
        {
          title: '产品名称',
          dataIndex: 'planName',
          width: '160px',
          render(text,record){
            return <div>{record.itemName}</div>
          }
        }, {
          title: '申请时间',
          dataIndex: "requestDate",
          width: '160px',
          sorter: true,
          render(text,record) {
            return <div>{record.requestDate}</div>
          }
        }, {
          title: '投保人',
          dataIndex: "applicant",
          width: '80px',
          render: (text,record) => {
            return <div>{record.policyHolderName}</div>
          }
        }, {
          title: '受保人',
          dataIndex: 'insurant',
          width: '80px',
          render: (text,record) => {
            return <div>{record.insurantName}</div>
          }
        }, {
          title: '状态',
          dataIndex: 'status',
          width: '70px',
          render: (text,record) => {
            if (record.status == 'REVIEW') {
              return <div>需复查</div>
            }
            else if (record.status == 'COMPLETED') {
              return <div>已完成</div>
            }
            else if (record.status == 'PLN_CANCELLED') {
              return <div>已取消</div>
            }
            else if (record.status == 'PROCESSING'){
              return <div>处理中</div>
            }
          }
        }, {
          title: '处理说明',
          dataIndex: 'explain',
          render: (text,record) => {
            return <div>{record.processComments}</div>
          }
        }, {
          title: '操作',
          dataIndex: 'alter',
          width: '70px',
          render: (text,record,index) => {
            let result = [];
            let cancel =  <Menu.Item key={index+'_1'}>
              <Button type='default' style={{fontSize:'12px',width:'65px'}} onClick={this.handleCancel.bind(this,record)}>
                <span style={{marginLeft:'-6px'}}>取消申请</span>
              </Button>
            </Menu.Item>;
            let review =  <Menu.Item key={index+'_2'}>
              {this.state.body.type == 'personal'?
              <Button type='default' style={{fontSize:'12px',width:'65px'}} onClick={() => location.hash = `/plan/planApply/edit/${record.planId}/1`}>修改</Button>:
              
              <Button type='default' style={{fontSize:'12px',width:'65px'}} onClick={() => location.hash = `/plan/planApply/edit/${record.planId}/2`}>修改</Button>}
            </Menu.Item>;
            if(record.status =='PROCESSING'){
                  result = [cancel]
              }else if(record.status == 'REVIEW'){
                result = [cancel,review]
              }
              return (
                <div>
                  <Dropdown overlay={
                    <Menu>
                      {
                        result.map((item)=>
                          item
                        )
                      }
                    </Menu>
                  }>{
                    record.status == 'COMPLETED'||
                    record.status == 'PLN_CANCELLED'?
                    <Button  type='default' style={{width:'80px',fontSize:'12px',cursor: 'not-allowed',color:'rgba(0, 0, 0, 0.25)',borderColor:'#d9d9d9',background:'#f7f7f7'}}>操作</Button>:
                    <Button  type='default' style={{width:'80px',fontSize:'12px'}}>操作</Button>
                  }
                  </Dropdown>
                </div>
              )
          }
        }, {
          title: '下载',
          dataIndex: 'download',
          width: '90px',
          render: (res,record) => {
            let text = '点击下载';
            if (record.status == 'COMPLETED') {
              if (record.downloadFlag == "Y") {
                text = '再次下载';
              }
              return <Download fileId={record.fileId}>
                  <Button style={{fontSize:'12px'}} onClick={this.downloadClick.bind(this, record.planId)} type="default">{text}</Button>
                </Download>
            } else {
              return <Button style={{fontSize:'12px'}} disabled type="default">{text}</Button>;
            }
          }
        }
      );
    return(
        <div className={style.main}>
          <div className={style.mainContent}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Row className={style.contentT}>
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                  <span className={styles.iconL} ></span>
                  <font className={styles.iconR}>我的计划书</font>
                  <MyLines />
                </Col>
                <Col xs={18} sm={18} md={18} lg={18} xl={18} className={style.rad}>
                  <RadioGroup className={style.rt} defaultValue='a'>
                    <RadioButton style={{ width: '120px', height: '40px', textAlign: 'center', lineHeight: '40px' }} className='person' value='a' onClick={this.handleClick.bind(this, 0)}>个人数据</RadioButton>
                    <RadioButton style={{ width: '120px', height: '40px', textAlign: 'center', lineHeight: '40px' }} className='team' value='b' onClick={this.handleClick.bind(this, 1)}>团队数据</RadioButton>
                  </RadioGroup>
                </Col>
              </Row>
              <Row className={style.contentB}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Form layout='inline' onSubmit={this.handleSearch}>
                    <FormItem>
                      {getFieldDecorator('num')(
                        <Input style={{width:'200px'}} placeholder='计划书申请编号'/>
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('rangePicker', {
                      })(
                        <RangePicker style={{width:'250px'}} />
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('status', {
                        rules: [{ message: '状态:', whitespace: true }],
                      })(
                        <Select showSearch placeholder="状态"
                          optionFilterProp="children" style={{width:'120px'}}
                        >
                          <Option value="CANCELLED">已取消</Option>
                          <Option value="PROCESSING">处理中</Option>
                          <Option value="REVIEW">需复查</Option>
                          <Option value="COMPLETED">已完成</Option>
                        </Select>
                        )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('applicant')(
                        <Input placeholder='投保人/受保人' style={{width:'120px'}} />
                      )}
                    </FormItem>
                    <FormItem style={{margin:0,float:'right'}}>
                      <Button type="default" htmlType="submit" style={{width:'140px',height:'40px',marginRight:'10px'}} onClick={this.res.bind(this)}>查询</Button>
                      <Button type="primary" style={{width:'140px',height:'40px'}} onClick={handleReset}>全部</Button>
                    </FormItem>
                  </Form>
                  <Table className={style.tb1} dataSource={this.state.dataList}
                      onChange={handleTableChange.bind(this, plan, this.state.body)}
                      pagination={this.state.pagination}
                      columns={columns} bordered />
                </Col>
              </Row>
            </Col>
          </div>
        </div>
    );
  };
}
export default Form.create()(myPlan)
