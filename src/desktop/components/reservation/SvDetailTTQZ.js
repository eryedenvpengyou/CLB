import React  , { Component } from 'react';
import { Button,Form,DatePicker,Input,Row,Col,Modal,Select,Table} from 'antd';
import moment from 'moment';
import Lov from "../common/Lov";
import CodeOption from "../common/CodeOption";
import SvFooter from "./SvFooter";
import SvHeader from "./SvHeader";
import Uploads from '../common/Upload';
import { PICTURE_ADDRESS } from '../../constants';
import Modals from '../common/modal/Modal';
import * as common from '../../utils/common';
import * as service from '../../services/reservation';
import * as codeService from '../../services/code';
import * as styles from '../../styles/qa.css';
import Downloads from "../channel/Downloads";
import CustomerLov from "../common/CustomerLov";
import photoTxz from '../../styles/images/photo-txz.jpg';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {xs: { span: 9 }, sm: { span: 9 }, },
  wrapperCol: {xs: { span: 8 }, sm: { span: 8 }, },
};
const tailFormItemLayout = {
  wrapperCol: {xs: {span: 8,offset: 9,}, sm: {span: 8,offset: 9,}, },
};
const formTableLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 20, offset: 2},
};


class SvDetailTTQZ extends Component {
  constructor(props){
    super(props);
    this.state = {
      priceFlag: true,
      visible: false,
      detail: this.props.detail || {},
      productDetail: {},
      code: {},
      dataSource: [{
        __status: "add",
        number: <span style={{color:'#9c9c9c'}}>例</span>,
        name: <span style={{color:'#9c9c9c'}}>张三</span>,
        sex: <span style={{color:'#9c9c9c'}}>男</span>,
        birthDate: <span style={{color:'#9c9c9c'}}>1999-01-01</span>,
        signAddress: <span style={{color:'#9c9c9c'}}>广东省广州市</span>,
        passNumber: <span style={{color:'#9c9c9c'}}>35435588533</span>,
        fileId: <span style={{color:'#9c9c9c'}}>查看样本</span>,
        file: [],
      }],
    }
  }

  componentWillMount(){
    const orderId = this.props.detail.orderId || null;
    if(orderId){
      let dataSource = this.state.dataSource;
      service.ordTeamVisitor({orderId: orderId}).then((data)=>{
        if(data.success){
          const rows = data.rows || [];
          for(let i = 0, j=1; i< rows.length ; i++){
            rows[i].__status = 'updete';
            rows[i].number = j;
            rows[i].file = common.initFile([rows[i]]);
            dataSource.push(rows[i]);
            j++;
          }
          this.setState({dataSource});
        }
      });
    }


    service.productionDetail({itemId: this.props.itemId}).then((data) => {
      if (data.success) {
        this.setState({productDetail: data.rows[0] || {} });
      } else {
        Modals.error({content:data.message});
      }
    });

    codeService.getCode({phoneCodes: 'PUB.PHONE_CODE'}).then((data)=>{
      this.setState({code: data});
    });

    const detail = this.props.detail;
    if(detail.price){
      if(!isNaN(detail.price)){
        detail.price = detail.price ;
      }else{
        this.setState({priceFlag: false})
      }
    }
  }  //验证客户手机号
  checkCustomerPhone(rule, value, callback){
    let phoneCode = this.props.form.getFieldValue('customerPhoneCode')
    let regex = /^\d{11}$/, msg='手机号位数不正确(大陆地区为11位)';

    if( phoneCode ==='00852' || phoneCode ==='00853' ){
      regex = /^\d{8}$/;
      msg='手机号位数不正确(港澳地区为8位)';
    }else if(phoneCode ==='00886' ){
      regex = /^\d{9}$/;
      msg='手机号位数不正确(台湾地区为9位)';
    }

    if ( value && !regex.test(value)  ) {
      if(typeof callback === 'function') {
        callback(msg);
      }
    } else {
      if(typeof callback === 'function') {
        callback();
      }
    }
  }
  resetCustomerPhone (value){
    if(value){
      this.props.form.setFieldsValue({customerPhone:''}) ;
    }
  }

  //验证对接人手机号
  checkContactPhone(rule, value, callback){
    let phoneCode = this.props.form.getFieldValue('reserveContactPhoneCode')
    let regex = /^\d{11}$/, msg='手机号位数不正确(大陆地区为11位)';

    if( phoneCode ==='00852' || phoneCode ==='00853' ){
      regex = /^\d{8}$/;
      msg='手机号位数不正确(港澳地区为8位)';
    }else if(phoneCode ==='00886' ){
      regex = /^\d{9}$/;
      msg='手机号位数不正确(台湾地区为9位)';
    }

    if ( value && !regex.test(value)  ) {
      if(typeof callback === 'function') {
        callback(msg);
      }
    } else {
      if(typeof callback === 'function') {
        callback();
      }
    }
  }
  resetContactPhone (value){
    if(value){
      this.props.form.setFieldsValue({reserveContactPhone:''}) ;
    }
  }



  //子产品改变
  onChange(value){
    this.state.productDetail.prdItemSublineList.map((data) => {
      if (value == data.sublineId) {
        if (isNaN(data.price)) {
          this.setState({priceFlag: false});
        } else {
          this.setState({priceFlag: true});
        }
        this.props.form.setFieldsValue({price: data.price});
      }
    });
  }

  //展示
  showModal() {
    this.setState({visible: true,});
  }
  //隐藏
  handleCancel() {
    this.setState({visible: false,});
  }



   //第一个按钮对应的函数
  callback1(){
    this.props.callback1(this.state.detail);
  }

  //第二个按钮对应的 函数
  callback2(){
    const status = this.state.detail.status || '';
    this.props.callback2(status, this.state.dataSource);
  }


  //表格动态添加修改数据
  handleVisible(record){
    Modals.tdqzModal(record,this.callback.bind(this));
  }

  //lov 改变
  customerLovChange(value){
    //客户（投保人）
    if (value && value.value && value.meaning && value.record) {
        this.props.form.setFieldsValue({
          customerPhone: value.record.phone,
        });

      //当所选的客户是新增的 就清空保单订单编号字段
      if(value.record.addStatus === "add"){
        this.props.form.setFieldsValue({relatedOrderId: {value:'',meaning:''}});
      }
    }
  }

  //回调
  callback(record){

    let dataSource = this.state.dataSource;
    if(record.type == 'add'){
      record.number = dataSource.length;
      record.__status = 'add';
      dataSource.push(record);
    }else{
      for(let i in dataSource){
        if(record.number == dataSource[i].number){
          dataSource[i] = record;
          break;
        }
      }
    }
    this.setState({dataSource});
  }

  //不可选日期
  disabledStartDate(current) {
    if(!current){
      return false;
    }
    var date = new Date();
    current = new Date(current);
    date = moment(date.getFullYear()+"/"+(date.getMonth()+1)+"/"+(date.getDate()),"YYYY-MM-DD");
    current = moment(current.getFullYear()+"/"+(current.getMonth()+1)+"/"+(current.getDate()),"YYYY-MM-DD")
    return date.valueOf() > current.valueOf();
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const detail = this.props.detail;
    const reserveContactPhoneCode = (
      getFieldDecorator('reserveContactPhoneCode', {
        initialValue: detail.reserveContactPhoneCode || "86",
      })(
        <CodeOption className={styles.pre} disabled={detail.disableFlag} codeList={this.state.code.phoneCodes} onChange={this.resetContactPhone.bind(this)} width='120px'/>
      )
    );

    const customerPhoneCode = (
      getFieldDecorator('customerPhoneCode', {
        initialValue: detail.customerPhoneCode || "86",
      })(
        <CodeOption className={styles.pre} disabled={detail.disableFlag} codeList={this.state.code.phoneCodes} onChange={this.resetCustomerPhone.bind(this)} width='120px'/>
      )
    );

    const dataSource = detail.ordTeamVisitor || this.state.dataSource;
    let columns = [
      {
        key: 'number',
        dataIndex: 'number',
        title: '编号',
        width: '70px',
        className:styles.text_center,
      }, {
        key: 'name',
        dataIndex: 'name',
        title: "姓名",
        className:styles.text_center,
      }, {
        key: 'sex',
        dataIndex: 'sex',
        title: "性别",
        width: '70px',
        className:styles.text_center,
        render:(text, record, index)=>{
          if(index === 0){
            return text;
          }else{
            return text === 'M' ? '男' : '女';
          }
        },
      }, {
        key: 'birthDate',
        dataIndex: 'birthDate',
        title: "出生日期",
        width: '15%',
        className:styles.text_center,
        render:(text,record,index)=> {
          if (index === 0) {
            return text;
          } else {
            return (moment(text).format('YYYY-MM-DD'));
          }
        }
      },{
        key: 'signAddress',
        dataIndex: 'signAddress',
        title: "签发地点",
        width: '20%',
        className:styles.text_center,
      }, {
        key: 'passNumber',
        dataIndex: 'passNumber',
        title: "港澳通行证号",
        width: '15%',
        className:styles.text_center,
      }, {
        key: 'file',
        dataIndex: 'file',
        title: "签注页",
        width: '10%',
        className:styles.text_center,
        render:(text, record, index)=>{
          if(index == 0){
            return( <Button type='default' onClick={this.showModal.bind(this)} style={{height:'32px',fontSize:'14px',width:'90px'}}>查看样本</Button> );
          }else{
            return(
              <FormItem>
                {getFieldDecorator('file', {
                  rules: [
                    {required: true, message: '请上传附件', type:'array'}
                  ],
                  initialValue:record.file,
                })(
                  <Uploads disabled={detail.disableFlag} fileNum={1} className={styles['no-remove']} />
                )}
              </FormItem>
            );
          }
        },
      },
      {
        key: 'edit',
        dataIndex: 'edit',
        title: '操作',
        width: '107px',
        className:styles.text_center,
        render:(text, record, index)=>{
          if(!detail.disableFlag){
            if(index == 0 ){
              if(this.state.dataSource.length <= 99999){
                record.type = 'add';
                return(
                  <div>
                    <Button type="primary" onClick={this.handleVisible.bind(this,record)} style={{height:'32px',fontSize:'14px',width:'90px'}}>添加更多</Button>
                  </div>
                )
              }
            }else{
              record.type = 'update';
              return(
                <div>
                  <Button type="primary" onClick={this.handleVisible.bind(this,record)} style={{height:'32px',fontSize:'14px',width:'90px'}}>编辑</Button>
                </div>
              )
            }
          }

        },
      }];


    const columns2 = [
      {
      key: 'number',
      dataIndex: 'number',
      title: '编号',
      width: '70px',
      className:styles.text_center,
    }, {
      key: 'name',
      dataIndex: 'name',
      title: "姓名",
      width: '10%',
      className:styles.text_center,
    }, {
      key: 'sex',
      dataIndex: 'sex',
      title: "性别",
      width: '70px',
      className:styles.text_center,
      render:(text, record)=>{
        if(text== 'M'){
          return('男');
        }
        if(text== 'F'){
          return('女');
        }
      },
    }, {
      key: 'birthDate',
      dataIndex: 'birthDate',
      title: "出生日期",
      width: '15%',
      className:styles.text_center,
      render:(text)=>{
        return(moment(text).format('YYYY-MM-DD'));
      }
    }, {
      key: 'signAddress',
      dataIndex: 'signAddress',
      title: "签发地点",
      width: '20%',
      className:styles.text_center,
    }, {
      key: 'passNumber',
      dataIndex: 'passNumber',
      title: "港澳通行证号",
      width: '15%',
      className:styles.text_center,
    }, {
      key: 'file',
      dataIndex: 'file',
      title: "签注页",
      width: '10%',
      className:styles.text_center,
      render:(text, record, index)=>{
        const file = common.initFileDown([record]);

        if(index == 0){
          return( <Button type='default' onClick={this.showModal.bind(this)}>查看样本</Button> );
        }else{
          return(
            <Downloads files={file} />
          );
        }
      },
    },];

    if(detail.disableFlag){
      columns = columns2;
    }


    return (
      <div className={styles.disableds}>
        <Form>
          <SvHeader detail={detail} reload={this.props.reload}/>
          {
            JSON.parse(localStorage.user).userType == "ADMINISTRATION" &&
            <div>
              <Form.Item label="渠道" {...formItemLayout}>
                {getFieldDecorator('channelId', {
                  rules: [{
                    required: true,
                    validator: (rule,value,callback) => {
                      if (value && (!value.value || !value.meaning)) {
                        callback('请选择渠道');
                      } else {
                        callback();
                      }
                    }
                  }],
                  initialValue: {value: detail.channelId || JSON.parse(localStorage.user).relatedPartyId, meaning: detail.channelName || ''},
                })(
                  <Lov title="选择渠道"
                       disabled={detail.disableFlag}
                       lovCode='CNL_AGENCY_NAME'
                       params ={{userId:JSON.parse(localStorage.user).userId}} />
                )}
              </Form.Item>
            </div>
          }
          <Form.Item label="客户" {...formItemLayout}>
            {getFieldDecorator('applicantCustomerId', {
              rules: [{
                required: true,
                validator: (rule,value,callback) => {
                  if (value && (!value.value || !value.meaning)) {
                    callback('请选择客户');
                  } else {
                    callback();
                  }
                }
              }],
              initialValue: {value: detail.applicantCustomerId || '', meaning: detail.applicant || ''},
            })(
              <CustomerLov
                disabled={detail.disableFlag}
                suffix={true}
                lovCode='ORD_CUSTOMER'
                params ={{
                  channelId:getFieldValue('channelId') ? getFieldValue('channelId').value:JSON.parse(localStorage.user).relatedPartyId,
                  orderId:getFieldValue('relatedOrderId') ? getFieldValue('relatedOrderId').value :'',
                }}
                title="选择客户"
                placeholder=" "
                itemChange={this.customerLovChange.bind(this)}
              />
            )}
          </Form.Item>
          <Form.Item label="保单订单编号" {...formItemLayout}>
            {getFieldDecorator('relatedOrderId', {
              initialValue: {value: detail.relatedOrderId || '', meaning: detail.relatedOrderNumber || ''},
            })(
              <Lov
                disabled={detail.disableFlag}
                suffix={true}
                lovCode='ORD_ORDERDETAIL'
                params ={{
                  channelId: getFieldValue('channelId') ? getFieldValue('channelId').value:JSON.parse(localStorage.user).relatedPartyId,
                  orderType: 'INSURANCE',
                  customerId: getFieldValue('applicantCustomerId') ? getFieldValue('applicantCustomerId').value :'',
                }}
                title="选择保单订单编号"
                placeholder=" "
              />
            )}
          </Form.Item>
          <Col sm={8} md={8} offset={9} style={{fontSize:"12px",color:"#9c9c9c",top:"-16px"}}>
            如果客户当天同时预约了赴港签单，请输入保单订单编号，方便工作人员合理安排行程。
          </Col>
          <Form.Item label="联系电话" {...formItemLayout}>
            {getFieldDecorator('customerPhone', {
              rules: [
                {required: true,message: '请输入联系电话',whitespace: true,},
                {validator: this.checkCustomerPhone.bind(this),}
              ],
              initialValue: detail.customerPhone || '',
            })(
              <Input disabled={detail.disableFlag} addonBefore={customerPhoneCode} style={{width:'100%'}}/>
            )}
          </Form.Item>
          <Form.Item label="深圳过境关口" {...formItemLayout}>
            {getFieldDecorator('sublineId', {
              rules: [
                {required: true,message: '请选择深圳过境关口',whitespace: true,type:'number'}
              ],
              initialValue: detail.sublineId || '',
            })(
              <Select
                disabled={detail.disableFlag}
                placeholder=" "
                onChange={this.onChange.bind(this)}
                className={styles['select-disableds']}>
                {
                  this.state.productDetail.prdItemSublineList &&
                  this.state.productDetail.prdItemSublineList.map((item) =>
                    <Select.Option value={item.sublineId} key={item.sublineId}>{item.sublineItemName}</Select.Option>
                  )
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item label="团队签证价格" {...formItemLayout}>
            {getFieldDecorator('price', {
              initialValue: detail.price || '0.00',
            })(
              this.state.priceFlag ?
              <Input disabled addonBefore={<span style={{fontSize:'15px'}}>￥</span>} style={{width:'100%'}} />
              :
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item label="预约过境时间" {...formItemLayout}>
            {getFieldDecorator('reserveDate', {
              rules: [
                {required: true,message: '请选择预约过境时间',whitespace: true, type:'object'}
              ],
              initialValue:detail.reserveDate? moment(detail.reserveDate, 'YYYY-MM-DD HH:mm') : null,
            })(
              <DatePicker
                disabled={detail.disableFlag}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                disabledDate={this.disabledStartDate.bind(this)}
                style={{width:"100%"}}
                placeholder=' '/>
            )}
          </Form.Item>
          <Form.Item {...formTableLayout}>
            <Table
              dataSource={this.state.dataSource}
              columns={columns}
              bordered
              pagination={false}
              title={() => <span style={{color:'#d1b97f',fontSize:'20px'}}>L签访客信息</span>} />
          </Form.Item>
          <Form.Item label="预约对接人" {...formItemLayout}>
            {getFieldDecorator('reserveContactPerson', {
              rules: [
                {required: true,message: '请输入预约对接人',whitespace: true,}
              ],
              initialValue: detail.reserveContactPerson || JSON.parse(localStorage.user).userName,
            })(
              <Input disabled={detail.disableFlag}/>
            )}
          </Form.Item>
          <Form.Item label="对接人电话" {...formItemLayout}>
            {getFieldDecorator('reserveContactPhone', {
              rules: [
                {required: true,message: '请输入对接人电话',whitespace: true,},
                {validator: this.checkContactPhone.bind(this),}
              ],
              initialValue: detail.reserveContactPhone || JSON.parse(localStorage.user).phone,
            })(
              <Input disabled={detail.disableFlag} addonBefore={reserveContactPhoneCode} style={{width:'100%'}}/>
            )}
          </Form.Item>
          <Form.Item label="备注" {...formItemLayout}>
            {getFieldDecorator('reserveComment', {
              initialValue: detail.reserveComment || '',
            })(
              <Input type="textarea" className={styles['textarea-disableds']} disabled={detail.disableFlag}  placeholder=" "/>
              )}
          </Form.Item>
          <FormItem  {...tailFormItemLayout} label=''>
            <SvFooter
              detail={detail}
              callback1={this.callback1.bind(this)}
              callback2={this.callback2.bind(this)}/>
          </FormItem>
        </Form>

        <Row>
          <Col xs={22} sm={22} md={22} lg={22} xl={22} offset={1} className={styles.productSubscribeReminder} style={{paddingTop:"28px",marginBottom:'30px'}}>
            温馨提示：
            <Row>1、本服务为收费服务，若客户购买任何保险产品，单张保单年缴保费≥10万美金或趸交保费≥50万美金，我司免费提供团签服务，同一投保人两张及以上保单累计达以上金额不享受该免费服务。申请免费团签服务请务必在备注栏填写投保信息。</Row>
            <Row>2、如已享受免费团签服务的客户因各种原因未能投保成功及退保，我司将会补收该费用。</Row>
            <Row>3、所有增值服务以预约时信息为准，由于无预约、信息错误等产生的费用由客户承担，且过后不可以补办和报销。</Row>
            <Row>4、使用L签访港的旅客需要持旅行社提供的文件一同过关方可进入香港；离港时无需旅行社文件，亦无需一同过关，请根据客户签证类型选择此项服务。</Row>
          </Col>
        </Row>

        <Modal
          maskClosable={false}
          visible={this.state.visible}
          footer={false}
          onCancel={this.handleCancel.bind(this)}
        >
          <div className={styles.title_div}>
            <div className={styles.title_font}>签注页样本</div>
          </div>
          <div>
            <img src={photoTxz} alt={'签注页样本'} width="100%" />
          </div>
        </Modal>
      </div>
    );
  }

  }

export default SvDetailTTQZ;
