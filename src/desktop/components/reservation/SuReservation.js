import React  , { Component } from 'react';
import {Table, Button,Form,Radio,Select,Row,Col,Input} from 'antd';
import * as codeService from '../../services/code';
import * as services from '../../services/reservation';
import * as styles from '../../styles/sys.css';
import * as commonStyle from '../../styles/common.css';
import {dateConvertymdhms} from "../../utils/common";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

class SuReservation extends Component {
  constructor(props){
    super(props);
    this.state = {
      value:'support',
      code: {
        supportType: [],
        status: [],
      },
      page: 1,
      pageSize: 20,
      reservation: {},
    }
  }

  handleReset = () => {
    this.state.page = 1;
    this.props.form.resetFields();
  }

  componentWillMount() {
    let params = {
      page: 1,
      pageSize: 20,
    }
    services.fetchSupport(params).then((supportData) => {
      if (supportData.success) {
        supportData.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({reservation: supportData})
      }
    });
    params ={
      status: 'COURSE.SUPPORT_STATUS',
      supportType: 'COURSE.SUPPORT_TYPE',
    };
    codeService.getCode(params).then((data)=>{
      this.setState({
        code: data,
      });
    });
  }

  //筛选
  clickSearch(){
    let params = {};
    params.supportNum = this.props.form.getFieldValue('supportNum');
    params.supportType = this.props.form.getFieldValue('supportType');
    params.status = this.props.form.getFieldValue('status');
    params.page = 1;
    params.pageSize = this.state.pageSize;
    services.fetchSupport(params).then((supportData) => {
      if (supportData.success) {
        supportData.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({reservation: supportData,page: 1})
      }
    });
  }

  //分页
  tableChange(value){
    let params = {};
    params.supportNum = this.props.form.getFieldValue('supportNum');
    params.supportType = this.props.form.getFieldValue('supportType');
    params.status = this.props.form.getFieldValue('status');
    params.page = value.current;
    params.pageSize = value.pageSize;
    services.fetchSupport(params).then((supportData) => {
      if (supportData.success) {
        supportData.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({
          reservation: supportData,
          pageSize: value.pageSize,
          page: value.current,
        })
      }
    });
  }

  turnDetail(record){
    location.hash = `/portal/suDetailHandle/${record.supportType}/${record.status}/${record.supportId}/1`;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const data = this.state.reservation.rows || [];
    if(data){
      for(let i =0; i<data.length;i++){
        if(data[i].supportType =='GUEST'){
          data[i].sDate = data[i].guestDate,
          data[i].eDate = data[i].guestEndDate
        }
        else if(data[i].supportType=='TRAIN'){
          data[i].sDate = data[i].trainStartDate,
          data[i].eDate = data[i].trainEndDate
        }
        else if(data[i].supportType=='COST'){
          data[i].sDate = data[i].costStartDate,
          data[i].eDate = data[i].costEndDate
        }
        else {
          data[i].sDate = '',
          data[i].eDate = ''
        }
      }
    }
    const supportTypeList = this.state.code.supportType || [];
    const statusList = this.state.code.status || [];
    const columns1 = [
      {
      title: '申请编号',
      dataIndex: 'supportNum',
      key:'supportNum',
    }, {
        title: '渠道',
        dataIndex: 'channelName',
        key:'channelName',
        width:'90px',
      },{
      title: '业务支援类型',
      dataIndex: 'supportType',
      key:'supportType',
      render: (text, record, index) => {
        for(let j = 0;j<supportTypeList.length;j++){
          if(record.supportType == supportTypeList[j].value){
            return <div>{supportTypeList[j].meaning}</div>
          }
        }
      }
    },{
      title: '创建时间',
      dataIndex: 'submitDate',
      render: (text, record, index) => {
        if(record.submitDate){
          return <span>{dateConvertymdhms(record.submitDate)}</span>
        }else {
          return ''
        }
      }
    },{
      title: '开始时间',
      dataIndex: 'sDate',
      render: (text, record, index) => {
        if(record.startFrom){
          return <span>{dateConvertymdhms(record.sDate)}</span>
        }else {
          return ''
        }
      }
    },{
      title: '结束时间',
      dataIndex: 'eDate',
      render: (text, record, index) => {
        if(record.startTo){
          return <span>{dateConvertymdhms(record.eDate)}</span>
        }else {
          return ''
        }
      }
    },{
      title: '状态',
      dataIndex: 'status',
      key:'status',
      render: (text, record, index) => {
        for(let j = 0;j<statusList.length;j++){
          if(record.status == statusList[j].value){
            return <div>{statusList[j].meaning}</div>
          }
        }
      }
    },{
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) =>{
        return(
          <Button type='default' onClick={this.turnDetail.bind(this,record) }>查看</Button>
        )
      }
    }] ;
    const columns2 = [
      {
        title: '申请编号',
        dataIndex: 'supportNum',
        key:'supportNum',
      },{
        title: '业务支援类型',
        dataIndex: 'supportType',
        key:'supportType',
        render: (text, record, index) => {
          for(let j = 0;j<supportTypeList.length;j++){
            if(record.supportType == supportTypeList[j].value){
              return <div>{supportTypeList[j].meaning}</div>
            }
          }
        }
      },{
        title: '创建时间',
        dataIndex: 'submitDate',
        render: (text, record, index) => {
          if(record.submitDate){
            return <span>{dateConvertymdhms(record.submitDate)}</span>
          }else {
            return ''
          }
        }
      },{
        title: '开始时间',
        dataIndex: 'sDate',
        render: (text, record, index) => {
          if(record.startFrom){
            return <span>{dateConvertymdhms(record.sDate)}</span>
          }else {
            return ''
          }
        }
      },{
        title: '结束时间',
        dataIndex: 'eDate',
        render: (text, record, index) => {
          if(record.startTo){
            return <span>{dateConvertymdhms(record.eDate)}</span>
          }else {
            return ''
          }
        }
      },{
        title: '状态',
        dataIndex: 'status',
        key:'status',
        render: (text, record, index) => {
          for(let j = 0;j<statusList.length;j++){
            if(record.status == statusList[j].value){
              return <div>{statusList[j].meaning}</div>
            }
          }
        }
      },{
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) =>{
          return(
            <Button type='default' onClick={this.turnDetail.bind(this,record) }>查看</Button>
          )
        }
      }] ;
    return (
      <div style={{marginBottom:'28px'}}>
        <div style={{paddingBottom:'20px',height: 40}}>
          <span style={{float:'right'}}>
            <Button type='primary' style={{width:140,height:40,}} onClick={()=>location.hash = '/classroom/business'}>
              新建预约
            </Button>
          </span>
        </div>
        <div style={{marginTop:'20px'}}>
          <Form>
            <Row>
            <Col span={4} style={{paddingRight:'10px'}}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('supportType', {
                })(
                  <Select showSearch placeholder='业务支援类型'>
                    {
                      this.state.code.supportType &&
                      this.state.code.supportType.map((item)=>
                        <Option key={item.value} value={item.value}>{item.meaning}</Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4} style={{paddingRight:'10px'}}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('supportNum')(
                  <Input placeholder="申请编号" />
                )}
              </FormItem>
            </Col>
            <Col span={4} style={{paddingRight:'10px'}}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('status', {
                })(
                  <Select showSearch placeholder='状态'>
                    {
                      this.state.code.status &&
                      this.state.code.status.map((item)=>
                        <Option key={item.value} value={item.value}>{item.meaning}</Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4} style={{paddingRight:'10px'}}>
            </Col>
            <Col span={8}>
              <Button type='primary' style={{float:'right',marginLeft:'10px',width:140,height:40,}} onClick={this.handleReset.bind(this)}>全部</Button>
              <Button type='default' style={{float:'right',width:140,height:40,}} onClick={this.clickSearch.bind(this)}>查询</Button>
            </Col>
            </Row>
          </Form>
        </div>
        <div  className={styles.item_div3}>
          {/*<Table columns={columns} dataSource={this.props.reservation.supportList} bordered/>*/}
          <Table
            columns={JSON.parse(localStorage.user).userType == "ADMINISTRATION"?columns1:columns2}
            dataSource={data}
            bordered scroll={{x:'100%'}}
            onChange={this.tableChange.bind(this)}
            pagination={{
              showSizeChanger: false,
              current: this.state.page,
              pageSize: this.state.pageSize,
              total:this.state.reservation.total || 0,
            }}
          />
        </div>
      </div>
    );
    }
  }

export default Form.create()(SuReservation);
