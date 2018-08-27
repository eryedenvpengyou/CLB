import React from 'react';
import {Table, Icon,Button,Input,DatePicker,Form, Select,InputNumber,Modal,Row,Col,Badge} from 'antd';
import { routerRedux } from 'dva/router'
import CheckModal from './CheckModal';
import * as service from '../../services/channel';
import * as codeService from '../../services/code';
import * as styles from '../../styles/qa.css';
import TipModal from "../common/modal/Modal";
import {stringify} from 'qs';

const { MonthPicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class CheckDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      code: {},
      checkDetails: {},
      visible: false,
      modalParams: {},
      exportBody: {
        sqlId: 'FetChannelCheckMapper.getData',
        userId: JSON.parse(localStorage.user).userId,
        checkPeriod: this.props.checkPeriod,
        paymentCompanyType: this.props.paymentCompanyType,
        receiveCompanyType: this.props.receiveCompanyType,
        paymentCompanyId: this.props.paymentCompanyId,
        receiveCompanyId: this.props.receiveCompanyId,
        version: this.props.version,
        paymentCompanyName: this.props.paymentCompanyName,
        receiveCompanyName: this.props.receiveCompanyName,
        access_token: localStorage.access_token,
      },
      PDFBody:{
        settlementSummaryId:this.props.settlementSummaryId,
        access_token: localStorage.access_token,
      },
      receiptVisible:false,
      recordStatus:'',
      bdFlag:false
    };
  }

  componentWillMount() {
    let params = {
      paymentTypes: 'FET.PAYMENT_TYPE',
      currencyTypes: 'PUB.CURRENCY',
    };
    //获取快码 付款类型
    codeService.getCode(params).then((data)=>{
      this.setState({code: data});
    });
    this.detail();
    //查询问题反馈角标
    let bdParams = {
        paymentCompanyId:this.props.paymentCompanyId,
        receiveCompanyId:this.props.receiveCompanyId,
        channelId:this.props.receiveCompanyId,
        checkPeriod:this.props.checkPeriod,
        settlementSummaryId:this.props.settlementSummaryId
    }
    service.fetchFeedback(bdParams).then((data)=>{
        if(data.success){
            if(!data.rows[0].lines[data.rows[0].lines.length-1].isRight){
                this.setState({bdFlag:true})
            }
        }
    })
  }
  detail(){
    let params = {
      settlementSummaryId:this.props.settlementSummaryId
    };
    service.fetchCheckDetail(params).then((data)=>{
      if(data.success){
        data.rows.map((row,index) => {
          row.key = index+1;
        });
        this.setState({checkDetails: data});
      }
    });
  }

  export() {
    let exportBody = {
      sqlId: 'FetChannelCheckMapper.getData',
      userId: JSON.parse(localStorage.user).userId,
      checkPeriod: this.props.checkPeriod,
      paymentCompanyType: this.props.paymentCompanyType,
      receiveCompanyType: this.props.receiveCompanyType,
      paymentCompanyId: this.props.paymentCompanyId,
      receiveCompanyId: this.props.receiveCompanyId,
      version: this.props.version,
      paymentCompanyName: this.props.paymentCompanyName,
      receiveCompanyName: this.props.receiveCompanyName,
    };
    service.checkExport(exportBody).then((data) => {
      if (!data.success) {
        TipModal.error({content:data.message});
        return;
      }
    })
  }

  clickSearch(){
    const params = {
      settlementSummaryId:this.props.settlementSummaryId,
      paymentType: this.props.form.getFieldValue('paymentType'),
      orderNumber: this.props.form.getFieldValue('orderNumber'),
      comments: this.props.form.getFieldValue('comments'),
    };
    service.fetchCheckDetail(params).then((data)=>{
      if(data.success){
        data.rows.map((row,index) => {
          row.key = index+1;
        });
        this.setState({checkDetails: data});
      }
    });
  }

  //查看所有
  searchAll(){
    const params = {
      settlementSummaryId:this.props.settlementSummaryId
    };
    service.fetchCheckDetail(params).then((data)=>{
      if(data.success){
        data.rows.map((row,index) => {
          row.key = index+1;
        });
        this.setState({checkDetails: data});
      }
    });
    this.props.form.resetFields();
  }

  //回调
  callback(visiable,flag,record){
    this.state.checkDetails.rows.map((row,index) => {
      row.status = 'YQR';
    });
    this.setState({
      visible:visiable,
    });
    if(flag){
      setTimeout(() => {
        this.detail()
        this.setState({
          recordStatus:record.status
        })
      }, 3000);
    }
  }

  //问题反馈
  feedback(){
    let record = this.props;
    const url =  `/channel/checkFeedback/${record.checkPeriod.replace(/\//g, "%2F")}/${record.paymentCompanyType}/${record.receiveCompanyType}/${record.paymentCompanyId}/${record.receiveCompanyId}/${record.paymentCompanyName}/${record.receiveCompanyName}/${record.settlementSummaryId}/${record.status}/${record.receiveFlag}/${record.questionId}/1`;
    this.props.dispatch(routerRedux.push(url));
  }

  //显示模态框
  changeVisible(){
    this.setState({visible:true});
  }
  confirm(){
    this.setState({receiptVisible:true})
  }
  onCancel(){
    this.setState({receiptVisible:false})
  }
  onOk(){
    let params = {
      settlementSummaryId:this.props.settlementSummaryId
    };
    service.confirmedReceive(params).then((data)=>{
      if(data.success){
        TipModal.success({content:data.message});
        document.getElementsByClassName('receipt')[0].style.display = 'none'
      }else{
        TipModal.error({content:data.message});
      }
      this.setState({receiptVisible:false})
    })
  }
  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    const checkPeriod = this.props.checkPeriod;
    const paymentCompanyName = this.props.paymentCompanyName;
    const receiveCompanyName = this.props.receiveCompanyName;
    
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },{
        title: '付款类型',
        dataIndex: 'paymentType',
        key: 'paymentType',
        render:(text,render)=>{
          if(text && this.state.code.paymentTypes){
            for(let i in this.state.code.paymentTypes){
              if(text == this.state.code.paymentTypes[i].value){
                return this.state.code.paymentTypes[i].meaning;
              }
            }
          }
          return "";
        },
      },{
        title: '订单编号',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
      },{
        title: '产品名称',
        dataIndex: 'itemName',
        width:'250px',
        key: 'itemName',
      },{
        title: '订单币种',
        dataIndex: 'orderCurrency',
        key: 'orderCurrency',
        render:(text,render)=>{
          if(text && this.state.code.currencyTypes){
            for(let i in this.state.code.currencyTypes){
              if(text == this.state.code.currencyTypes[i].value){
                return this.state.code.currencyTypes[i].meaning;
              }
            }
          } else {
            return text||"";
          }
        },
      },{
        title: '订单金额',
        dataIndex: 'orderAmount',
        key: 'orderAmount',
      },{
        title: '费率',
        dataIndex: 'rate',
        key: 'rate',
        render:(text)=>{
          if(text){
            return Math.round(text*10000)/100 + '%';
          }
        },
      },{
        title: '汇率',
        dataIndex: 'exchangeRate',
        key: 'exchangeRate',
      },{
        title: '结算金额',
        dataIndex: 'unpaidSettlement',
        key: 'unpaidSettlement',
        render:(text)=>{
            return  text === 0?0:text?text.toFixed(2):''
        }
      },{
        title: '签单日期',
        dataIndex: 'signDate',
        key: 'signDate'
      },{
        title: '备注',
        dataIndex: 'factPayDiffer',
        width:'250px',
        key: 'factPayDiffer',
      },];
    return(
      <div className={styles.content}>
        <div className={styles.item_div}>
          <div className={styles.title_sty}>
            <span className={styles.iconL} ></span>
            <font className={styles.title_font2}>{'对账单('+ checkPeriod + '>' + paymentCompanyName + '>' + receiveCompanyName +')'}</font>
          </div>
        </div>

        <div style={{marginBottom:'20px'}}>
          <a href={'/api/fms/fet/settlement/summary/toPDF?'+stringify(this.state.PDFBody)}>
            <Button type='primary' style={{float:'left',width:'120px',height:'40px',outLine:'none'}}>打印</Button>
          </a>
          {
            this.props.receiveFlag == 'N' && this.props.status == 'PAID'?
              <a onClick={this.confirm.bind(this)}>
                <Button className='receipt' type='primary' style={{ float: 'left', width: '120px', height: '40px', outLine: 'none', marginLeft: '25px' }}>收款确认</Button>
              </a> : ''
          }
          <Form layout="inline" style={{float:'right'}}>
            <FormItem>
              {getFieldDecorator('paymentType', {
              })(
                // <Select
                //   showSearch
                //   style={{ width: '150px' }}
                //   placeholder="付款类型"
                // >
                // {
                //   this.state.code.paymentTypes &&
                //   this.state.code.paymentTypes.map((item)=>
                //     <Option key={item.value}>{item.meaning}</Option>
                //   )
                // }
                // </Select>
                <Input placeholder="付款类型" />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('orderNumber', {
              })(
                <Input placeholder="订单编号" />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('comments', {
              })(
                <Input placeholder="备注" />
              )}
            </FormItem>

            <FormItem>
              <Button type='default' style={{height:'40px'}} onClick={this.clickSearch.bind(this)}>查询</Button>
            </FormItem>
            <FormItem>
              <Button type='default' style={{height:'40px'}} onClick={this.searchAll.bind(this)}>全部</Button>
            </FormItem>
          </Form>
        </div>

        <div style={{float:'right',width:'100%'}}>
          <Table scroll={{x:'100%'}} columns={columns} scroll={{ x: '120%' }} dataSource={this.state.checkDetails.rows} bordered pagination={false}/>
        </div>

        <div style={{clear:'both',width:'100%',textAlign:'center',padding:'10px'}}>
        {
          this.props.status == 'CONFIRMING' || this.props.status == 'ASKING' ?//待渠道确认，问询中
          this.state.recordStatus !== 'CONFIRMED'? <Button type='primary' style={{width:'120px',height:'40px'}} onClick={this.changeVisible.bind(this)}>确认</Button>:
          '':''
        }
        {
          this.props.status == 'CONFIRMING' || this.props.status == 'ASKING'?
          <Badge dot = {this.state.bdFlag}><Button type='default' style={{width:'120px',height:'40px', marginLeft:'10px'}} onClick={this.feedback.bind(this)}>问题反馈</Button></Badge>
          :
          this.props.questionId == null?'':
          <Badge dot = {this.state.bdFlag}><Button type='default' style={{width:'120px',height:'40px', marginLeft:'10px'}} onClick={this.feedback.bind(this)}>问题反馈</Button></Badge>
        }
          
        </div>

        <CheckModal 
          visible={this.state.visible}
          channelId={this.props.receiveCompanyId}
          checkPeriod={this.props.checkPeriod}
          settlementSummaryId={this.props.settlementSummaryId}
          paymentCompanyId={this.props.paymentCompanyId}
          paymentCompanyType={this.props.paymentCompanyType}
          receiveCompanyId={this.props.receiveCompanyId}
          callback={this.callback.bind(this)}/>
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

export default Form.create()(CheckDetail);
