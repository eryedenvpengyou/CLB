import React from 'react';
import {Table, Icon,Button,Input,DatePicker,Form, Select,InputNumber,Dropdown,Menu,Modal,Row,Col} from 'antd';
import  moment from 'moment';
import * as service from '../../services/channel';
import CheckModal from './CheckModal';
import TipModal from "../common/modal/Modal";
import * as codeService from '../../services/code';
import * as styles from '../../styles/qa.css';

const { MonthPicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;




class Check extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      checks: {},
      checkTime: [],
      page: 1,
      pageSize: 20,
      code: {},
      visible: false,
      receiptVisible:false,
      confirmRe:{},
      conRecord:{}
    };
  }

  componentWillMount() {
    this.query();
    //获取对账时间
    service.fetchCheckTime({}).then((data)=>{
      this.setState({
        checkTime: data.rows || [],
      })
    });

    //获取快码
    codeService.getCode({checkStatus:'FET.SETTLEMENT_STATUS',currency:'PUB.CURRENCY'}).then((data)=>{
      this.setState({
        code: data,
      });
    });
  }
  query(){
    const params = {
      receiveCompanyId: JSON.parse(localStorage.user).relatedPartyId,
      userId: JSON.parse(localStorage.user).userId
    };
    service.fetchCheck(params).then((data)=>{
      if(data.success){
        this.setState({checks:data});
      }
    });
  }
  search(){
    let params = {};
    params.userId = JSON.parse(localStorage.user).userId;
    params.receiveCompanyId = JSON.parse(localStorage.user).relatedPartyId;
    params.paymentCompanyName = this.props.form.getFieldValue('paymentCompanyName');
   // params.receiveCompanyName = this.props.form.getFieldValue('receiveCompanyName');
    params.periodName = this.props.form.getFieldValue('checkPeriod');
    //params.version = this.props.form.getFieldValue('version');
    service.fetchCheck(params).then((data)=>{
      if(data.success){
        this.setState({checks:data});
      }
    });
  }

  //分页
  tableChange(value){
    let params = {};
    params.userId = JSON.parse(localStorage.user).userId;
    params.receiveCompanyId = JSON.parse(localStorage.user).relatedPartyId;
    params.paymentCompanyName = this.props.form.getFieldValue('paymentCompanyName');
    //params.channelName = this.props.form.getFieldValue('channelName');
    params.periodName = this.props.form.getFieldValue('checkPeriod');
    //params.version = this.props.form.getFieldValue('version');
    params.page = value.current;
    params.pageSize = value.pageSize;
    service.fetchCheck(params).then((data)=>{
      if(data.success){
        this.setState({checks:data, pageSize:value.pageSize, page:value.current, });
      }
    });
  }
  //回调
  callback(visiable,flag,record){
    this.setState({
      visible:visiable,
    });
    if (flag) {
      this.query()
    }
  }
  //显示模态框
  changeVisible(record){
    this.setState({visible:true,confirmRe:record});
  }
  confirm(record){
    this.setState({receiptVisible:true,conRecord:record})
  }
  onCancel(){
    this.setState({receiptVisible:false})
  }
  onOk(){
    let params = {
      settlementSummaryId:this.state.conRecord.settlementSummaryId
    };
    service.confirmedReceive(params).then((data)=>{
      if(data.success){
        TipModal.success({content:data.message});
        this.query();
      }else{
        TipModal.error({content:data.message});
      }
      this.setState({receiptVisible:false})
    })
  }
  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    //表格数据
    const columns = [
    //   {
    //   title: '结算单编号',
    //   dataIndex: 'settlementSummaryNumber',
    //   key: 'settlementSummaryNumber',
    // },
    {
      title: '付款方名称',
      dataIndex: 'paymentCompanyName',
      key: 'paymentCompanyName',
    }, 
    // {
    //   title: '收款方名称',
    //   dataIndex: 'receiveCompanyName',
    //   key: 'receiveCompanyName',
    // }, 
    {
      title: '对账期间',
      dataIndex: 'periodName',
      key: 'periodName',
    }, {
      title: '币种',
      dataIndex: 'currency',
      key: 'currency',
      render:(text ,record)=>{
        if(text && this.state.code.currency){
          for(let i in this.state.code.currency){
            if(text == this.state.code.currency[i].value){
              return(<div>{this.state.code.currency[i].meaning}</div>)
            }
          }
        }
      }
    },{
      title: '结算金额',
      dataIndex: 'amount',
      key: 'amount',
      render:(text)=>{
          return  text === 0?0:text?text.toFixed(2):''
      }
      },{
        title: '付款日期',
        dataIndex: 'settleDate',
        key: 'settleDate',
        render:(text)=>{
            return moment(text).format("YYYY-MM-DD")
        }
      },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record)=>{
        if(text && this.state.code.checkStatus){
          for(let i in this.state.code.checkStatus){
            if(text == this.state.code.checkStatus[i].value){
              if(record.receiveFlag == 'Y'){
                return(<div>已收款</div>)
              }else{
                return(<div>{this.state.code.checkStatus[i].meaning}</div>)
              }
            }
          }
        }
      }
    },{
      title: '查看详情',
      dataIndex: 'detail',
      key: 'detail',
      render: (text, record) => {
        let opr = [];
        let confirm =<Menu.Item><Button style={{ width: '90px', fontSize: '14px' }} type='default' onClick={this.changeVisible.bind(this,record)}>确认</Button></Menu.Item>
        let conReceipt =<Menu.Item><Button style={{ fontSize: '14px' }} type='default' onClick={this.confirm.bind(this,record)}>收款确认</Button></Menu.Item> 
        let detail = <Menu.Item>
          <Button className={styles.btn_operation} style={{ height: '32px' }} onClick={() => {
            location.hash = `/channel/checkDetail/${record.periodName.replace(/\//g, "%2F")}/${record.paymentCompanyType}/${record.receiveCompanyType}/${record.paymentCompanyId}/${record.receiveCompanyId}/${record.paymentCompanyName}/${record.receiveCompanyName}/${record.settlementSummaryId}/${record.status}/${record.receiveFlag}/${record.questionId}`;
          }}
          >
            查看详情
         </Button>
        </Menu.Item>
        if(record.status == 'ASKING' || record.status == 'CONFIRMING')//问询中 待渠道确认
        { 
          opr = [detail,confirm]
        }else if(record.status == 'PAID' && record.receiveFlag == "N"){
          opr = [detail,conReceipt]
        }else{
          opr = [detail]
        }
        return (
          <div>
            <Dropdown overlay={
              <Menu>
                {
                  opr.map((item) =>
                    item
                  )
                }
              </Menu>} placement='bottomLeft'>
              <Button type='default' style={{ width: '100px', fontSize: '14px' }}>操作</Button>
            </Dropdown>
          </div>
        )
      }
    }];


    //格式化表格数据
    let data = this.state.checks.rows || [];
    const pageSize =  this.state.pageSize, page = this.state.page;
    const index = pageSize * page - pageSize;
    for(let i = 1; i<= data.length; i++){
      data[i-1].key = index + i;
    }
    const confirmRe = this.state.confirmRe
    return(
      <div>
        <div style={{float:'right',marginBottom:'20px'}}>
          <Form layout="inline">
            <FormItem>
              {getFieldDecorator('paymentCompanyName', {
              })(
                <Input placeholder="付款方名称" />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('checkPeriod', {
              })(
                <Input placeholder="对账期间" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('channelName', {
              })(
                <Button style={{float:'right',width:'80px',height:'40px',color:'white',backgroundColor:JSON.parse(localStorage.theme).themeColor}} size='large' type="primary"  onClick={this.search.bind(this)}>查询</Button>
              )}
            </FormItem>
          </Form>
        </div>

        <div style={{clear:'both'}}>
          <Table
            columns={columns}
            dataSource={data}
            bordered scroll={{x:'100%'}}
            onChange={this.tableChange.bind(this)}
            pagination={{
              showSizeChanger: false,
              pageSizeOptions: ['5','10','20','50'],
              pageSize: this.state.pageSize,
              total:this.state.checks.total || 0,
            }}/>
        </div>
        <CheckModal
          visible={this.state.visible}
          channelId={JSON.parse(localStorage.user).relatedPartyId}
          checkPeriod={confirmRe.checkPeriod}
          settlementSummaryId={confirmRe.settlementSummaryId}
          paymentCompanyId={confirmRe.paymentCompanyId}
          paymentCompanyType={confirmRe.paymentCompanyType}
          receiveCompanyId={confirmRe.receiveCompanyId}
          callback={this.callback.bind(this)} 
          />
        <Modal
          width={600}
          style={{ top: 200 }}
          maskClosable={false}
          closable={true}
          footer={null}
          visible={this.state.receiptVisible}
          onCancel={this.onCancel.bind(this)}
        >
          <div style={{ textAlign: 'center', marginTop: '5%', marginBottom: '10%' }} >
            <Icon type="question-circle-o" style={{ fontSize: 110, color: '#d1b97f', marginBottom: 28 }} /><br />
            <label title="Login" style={{ fontSize: 20, textAlign: 'center' }}>确认收款？</label>
          </div>

          <Row gutter={24}>
            <hr style={{ marginBottom: '2%' }} />
            <Col span={6}>
            </Col>
            <Col span={6}>
              <Button type="default" onClick={this.onOk.bind(this)} style={{ width: 100, float: 'right' }} size="large" >确定</Button>
            </Col>
            <Col span={6}>
              <Button type="default" onClick={this.onCancel.bind(this)} style={{ width: 100, }} size="large" >取消</Button>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }


}

Check = Form.create()(Check);
export default Check;
