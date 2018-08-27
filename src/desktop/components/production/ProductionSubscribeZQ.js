/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { Row, Col, Button, Icon, Table, Select, Form, InputNumber, DatePicker, Input, Popconfirm, Modal } from 'antd';
import { ordOrderQuery, ordCustomerQuery, ordFileListQuery, ordOrderSubmit, ordCustomerSubmit } from '../../services/production';
import { handleTableChange } from '../../utils/table';
import {indexOf} from 'lodash';
import TableCellEditor from '../common/TableCellEditor';
import { getCode } from '../../services/code';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import Upload from "../common/Upload";
import Lov from "../common/Lov";
import LovMultiple from "../common/LovMultiple";
import CustomerLov from "../common/CustomerLov";
import TipModal from "../common/modal/Modal";
import { NumberInput, NumbericeInput, NumberLetterInput } from "../common/Input";
import moment from 'moment';

class ProductionSubscribeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      //香港银行账户附件是否必输
      hkCardRequired: false,
      channelParam : JSON.parse(localStorage.user).relatedPartyId,
      channelFlag : false,
      orderDetail: {
        fileList: [],
        otherFileList: [],
      },
      body: {
        bigClassName: "债券"
      },
      addSource: [{key:'1'},{key:'2'},{key:'3'}],
      //快码值
      codeList: {
        yesOrNo: [],
        genderList: [],
        customerLanguageList: [],
        presentCIESScheduleList: [],
        yearPeriodList: [],
        productionClassList: [],
        phoneCodeList: [],
        currencyList: [],
      }
    };
  }
  componentWillMount() {
    if(JSON.parse(localStorage.user).userType == "ADMINISTRATION"){
      this.setState({
        channelFlag:true,
      })
    }
    //获取快码值
    var body = {
      yesOrNo: 'SYS.YES_NO',
      genderList: 'HR.EMPLOYEE_GENDER',
      customerLanguageList: "PUB.CUSTOMER_LANGUAGE",
      presentCIESScheduleList: "PRD.PRESENT_CIES_SCHEDULE",
      yearPeriodList: "PRD.YEAR_PERIOD",
      productionClassList: "PRD.CLASS",
      phoneCodeList: "PUB.PHONE_CODE",
      currencyList: 'PUB.CURRENCY',
    };
    getCode(body).then((codeData)=>{
      this.setState({
        codeList: codeData
      });
      if (!isNaN(this.props.orderId)) {
        this.state.disabled = true;
        body = {
          orderId: this.props.orderId,
        };
        //查询预约单-订单信息
        ordOrderQuery(body).then((orderData)=>{
          if (orderData.success && orderData.rows[0]) {
            //订单在需复查状态下才可以修改预约信息。
            if (orderData.rows[0].status == 'NEED_REVIEW') {
              this.state.disabled = false;
            } else {
              this.state.disabled = true;
            }
            for (var i=0; i<codeData.currencyList.length; i++) {
              if (orderData.rows[0].currency == codeData.currencyList[i].value) {
                orderData.rows[0].currencyDesc = codeData.currencyList[i].meaning;
                break;
              } else {
                orderData.rows[0].currencyDesc = codeData.currencyList[i].value;
              }
            }
            this.state.addSource =  [{
              key: 1,
              id: orderData.rows[0].orderId,
              orderId: orderData.rows[0].orderId,
              orderNumber: orderData.rows[0].orderNumber,
              channelId: orderData.rows[0].channelId,
              channelCommissionLineId: orderData.rows[0].channelCommissionLineId,
              itemId: orderData.rows[0].itemId,
              itemName: orderData.rows[0].itemName,
              stockCode: orderData.rows[0].stockCode,
              productSupplierId: orderData.rows[0].productSupplierId,
              sublineId: orderData.rows[0].sublineId,
              contributionPeriod: orderData.rows[0].sublineItemName,
              policyAmount: orderData.rows[0].policyAmount,
              currencyCode: orderData.rows[0].currency,
              currencyDesc: orderData.rows[0].currencyDesc,
              keepFlag: orderData.rows[0].keepFlag,
              agreedPaymentDate: orderData.rows[0].agreedPaymentDate,
              __status: 'update',
            }];
            this.state.orderDetail = orderData.rows[0];
            this.state.orderDetail.fileList = [];
            this.state.orderDetail.otherFileList = [];
            body = {
              orderId: this.props.orderId,
            };
            //查询预约单-附件
            ordFileListQuery(body).then((fileData)=>{
              if (fileData.success) {
                fileData.rows.map((row) => {
                  if (row.fileSeq < 6) {
                    this.state.orderDetail.fileList[row.fileSeq] = {
                      uid: this.state.orderDetail.fileList.length,
                      name: row.fileName||'test',
                      status: 'query',
                      type: row.fileName.substring(row.fileName.lastIndexOf('.')+1),
                      removeFlag: false,
                      response: {
                        file: {
                          fileId: row.fileId,
                          fileName: row.fileName||'test',
                          filePath: row.filePath,
                          fileType: row.fileName.substring(row.fileName.lastIndexOf('.')+1),
                        }
                      }
                    };
                  } else {
                    this.state.orderDetail.otherFileList[row.fileSeq] = {
                      uid: this.state.orderDetail.otherFileList.length,
                      name: row.fileName||'test',
                      status: 'query',
                      type: row.fileName.split('.')[1],
                      response: {
                        file: {
                          fileId: row.fileId,
                          fileName: row.fileName||'test',
                          filePath: row.filePath,
                          fileType: row.fileName.split('.')[1],
                        }
                      }
                    };
                  }
                });
                //查询预约单-客户信息
                body = {
                  orderId: this.props.orderId,
                };
                ordCustomerQuery(body).then((customerData)=>{
                  if (customerData.success) {
                    for (let i in customerData.rows[0]) {
                      this.state.orderDetail[i] = customerData.rows[0][i]
                    }
                    this.setState({
                      orderDetail: this.state.orderDetail,
                    });
                  } else {
                    TipModal.error({content:customerData.message});
                    return;
                  }
                });
              } else {
                TipModal.error({content:fileData.message});
                return;
              }
            });
          } else {
            TipModal.error({content:orderData.message});
            return;
          }
        });
      }
    });
  }
  //产品lov点击事件
  itemClick() {
    if (JSON.parse(localStorage.user).userType == "ADMINISTRATION") {
      if (this.props.form.getFieldValue('channel')) {
        if (!this.props.form.getFieldValue('channel').meaning || !this.props.form.getFieldValue('channel').value) {
          TipModal.error({content:'请选择渠道！'});
          return false;
        }
      } else {
        TipModal.error({content:'请选择渠道！'});
        return false;
      }
    }
    return true;
  }
  //渠道change事件
  channelChange(value) {
    this.setState({
      channelParam:value.value,
      channelFlag:false
    });
    if (value.value && value.meaning) {
      this.state.addSource = [{key:'1'},{key:'2'},{key:'3'}];
      this.props.form.resetFields(['applicantCustomer','customer','email','sex','phone','identityNumber']);
    }
  }
  //是否持有香港银行卡change事件
  hkCardChange(value) {
    if (value == 'N') {
      this.setState({
        hkCardRequired: false,
      });
    } else {
      this.setState({
        hkCardRequired: true,
      });
    }
  }
  //添加产品模态框的保存
  handleAdd(data) {
    let DataSource = this.state.addSource;
    if (DataSource[0] && !DataSource[0].supplierName) {
      DataSource = [];
    }
    let _itemName = [];
    //newDataSource.push一个新的数组，这个数组直接将初始化中的数组copy过来即可
    for (var i=0; i<data.length; i++) {
      var flag = true;
      if (!data[i].theFirstYear && !data[i].channelCommissionLineId) {
        _itemName.push(data[i].itemName);
        flag = false;
      } else {
        for (var k=0; k<DataSource.length; k++) {
          if (DataSource[k].supplierName == data[i].supplierName) {
            flag = false;
            break;
          }
        }
      }
      if (flag) {
        data[i].currencyDesc = data[i].currency;
        data[i].key = DataSource.length;
        data[i].fileIds = [0];
        data[i].__status = 'ADD';
        DataSource.push(data[i]);
      }
    }
    if (_itemName.length > 0) {
      TipModal.error({content:"您选择的产品【"+_itemName.toString()+"】无转介费率，暂时无法预约，请联系您的上级！"});
    }
    //将DataSource新添加的数组给dataSource
    this.setState({
      addSource: DataSource,
    });
  }
  //产品列表的删除
  handleDelete(index){
    const DataSource = this.state.addSource;
    //index为获取的索引，后面的 1 是删除几行
    DataSource.splice(index, 1);
    //将DataSource新添加的数组给dataSource
    this.setState({
      addSource: DataSource,
    });
  }
  //客户姓名change事件
  customerChange(value) {
    if (value.record.email) {
      this.props.form.setFieldsValue({email:value.record.email});
    }
    if (value.record.sex) {
      this.props.form.setFieldsValue({sex:value.record.sex});
    }
    if (value.record.phone) {
      this.props.form.setFieldsValue({phone:value.record.phone});
    }
    if (value.record.identityNumber) {
      this.props.form.setFieldsValue({identityNumber:value.record.identityNumber});
    }
  }
  //选择电话号码区域事件
  phoneCodeChange(value) {
    if (value != this.props.form.getFieldValue('phoneCode')) {
      this.props.form.setFieldsValue({phone:''});
    }
  }
  reserveContactPhoneCodeChange(value) {
    if (value != this.props.form.getFieldValue('reserveContactPhoneCode')) {
      this.props.form.setFieldsValue({reserveContactPhone:''});
    }
  }
  //验证手机号-不同电话代码使用不同正则
  checkPhone(rule, value, callback) {
    const phoneCode = this.props.form.getFieldValue('phoneCode');
    let regex = /^\d{11}$/;
    if (phoneCode =='00852' || phoneCode =='00853') {
      regex = /^\d{8}$/;
    } else if (phoneCode =='00886'){
      regex = /^\d{9}$/;
    } else if (phoneCode == '86') {
      regex = /^\d{11}$/;
    } else {
      callback('请选择正确的电话代码！');
    }
    if ( value && !regex.test(value)  ) {
      callback('手机号格式不正确！');
    } else {
      callback();
    }
  }
  checkReserveContactPhone(rule, value, callback) {
    const phoneCode = this.props.form.getFieldValue('reserveContactPhoneCode');
    let regex = /^\d{11}$/;
    if (phoneCode =='00852' || phoneCode =='00853') {
      regex = /^\d{8}$/;
    } else if (phoneCode =='00886') {
      regex = /^\d{9}$/;
    } else if (phoneCode == '86') {
      regex = /^\d{11}$/;
    } else {
      callback('请选择正确的电话代码！');
    }
    if ( value && !regex.test(value)  ) {
      callback('手机号格式不正确！');
    } else {
      callback();
    }
  }
  //页面返回
  goBack() {
    window.history.back();
  }
  //确认预约
  handleSubmit(e) {
    //债券信息校验
    if (this.state.addSource.length <= 0) {
      TipModal.error({content: "请添加拟认购债券信息！"});
      return;
    } else {
      //债券信息属性校验
      for (var i=0; i<this.state.addSource.length; i++) {
        if (!this.state.addSource[i].policyAmount) {
          TipModal.error({content: "请完善拟认购债券信息，金额必输！"});
          return;
        } else if (!this.state.addSource[i].keepFlag) {
          TipModal.error({content: "请完善拟认购债券信息，是否预留必输！"});
          return;
        } else if (!this.state.addSource[i].agreedPaymentDate) {
          TipModal.error({content: "请完善拟认购债券信息，预定支付日必输！"});
          return;
        } if (parseFloat((""+this.state.addSource[i].policyAmount).replace(/,/g,''))%1000000 != 0) {
          TipModal.error({content: "请完善拟认购债券信息-金额,填写100万倍数的数字！"});
          return;
        }
      }
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          for (var i in values) {
            this.state.orderDetail[i] = values[i];
          }
          //客户语言
          this.state.orderDetail.customerLang = this.state.orderDetail.customerLang&&this.state.orderDetail.customerLang.length>0?this.state.orderDetail.customerLang.toString():null;
          //已投资产品种类
          this.state.orderDetail.investedItem = this.state.orderDetail.investedItem&&this.state.orderDetail.investedItem.length>0?this.state.orderDetail.investedItem.toString():null;
          if (this.state.orderDetail.applicantCustomer.value) {
            this.state.orderDetail.applicantCustomerId = this.state.orderDetail.applicantCustomer.record.customerId;
            this.state.orderDetail.chineseName = this.state.orderDetail.applicantCustomer.record.chineseName;
          }
          this.state.orderDetail.customerType = 'APPLICANT';
          this.state.orderDetail.orderType = 'BOND';
          this.state.orderDetail.__status = 'add';
          this.state.orderDetail.status = 'DATA_APPROVING';
          //提交时间
          this.state.orderDetail.submitDate = new Date().getFullYear() + '-'+ (new Date().getMonth()+1)+'-'+new Date().getDate()+ " " +
                              new Date().getHours() + ":" + new Date().getMinutes() + ":" + "00";
          //预约签单时间
          this.state.orderDetail.reserveDate = new Date(this.state.orderDetail.reserveDate);
          this.state.orderDetail.signDate = this.state.orderDetail.reserveDate = this.state.orderDetail.reserveDate.getFullYear() + '-'+ (this.state.orderDetail.reserveDate.getMonth()+1)+'-'+this.state.orderDetail.reserveDate.getDate()+ " " +
                               this.state.orderDetail.reserveDate.getHours() + ":" + this.state.orderDetail.reserveDate.getMinutes() + ":" + "00";
          //附件校验
          this.state.orderDetail.fileIds = [0];
          if (this.state.orderDetail.identification.length > 0) {
            if (this.state.orderDetail.identification[0].response) {
              if (this.state.orderDetail.identification[0].response.success || this.state.orderDetail.identification[0].status == 'query') {
                this.state.orderDetail.fileIds.push(this.state.orderDetail.identification[0].response.file.fileId);
              } else {
                TipModal.error({content: "身份证上传失败："+this.state.orderDetail.identification[0].response.message});
                return;
              }
            }
          } else {
            this.state.orderDetail.fileIds.push(0);
          }
          if (this.state.orderDetail.passport.length > 0) {
            if (this.state.orderDetail.passport[0].response) {
              if (this.state.orderDetail.passport[0].response.success || this.state.orderDetail.passport[0].status == 'query') {
                this.state.orderDetail.fileIds.push(this.state.orderDetail.passport[0].response.file.fileId);
              } else {
                TipModal.error({content: "护照上传失败："+this.state.orderDetail.passport[0].response.message});
                return;
              }
            }
          } else {
            this.state.orderDetail.fileIds.push(0);
          }
          if (this.state.orderDetail.address.length > 0) {
            if (this.state.orderDetail.address[0].response) {
              if (this.state.orderDetail.address[0].response.success || this.state.orderDetail.address[0].status == 'query') {
                this.state.orderDetail.fileIds.push(this.state.orderDetail.address[0].response.file.fileId);
              } else {
                TipModal.error({content: "地址证明上传失败："+this.state.orderDetail.address[0].response.message});
                return;
              }
            }
          } else {
            this.state.orderDetail.fileIds.push(0);
          }
          if (this.state.orderDetail.W800.length > 0) {
            if (this.state.orderDetail.W800[0].response) {
              if (this.state.orderDetail.W800[0].response.success || this.state.orderDetail.W800[0].status == 'query') {
                this.state.orderDetail.fileIds.push(this.state.orderDetail.W800[0].response.file.fileId);
              } else {
                TipModal.error({content: "800万资产证明上传失败："+this.state.orderDetail.W800[0].response.message});
                return;
              }
            }
          } else {
            this.state.orderDetail.fileIds.push(0);
          }
          if (this.state.orderDetail.blank.length > 0) {
            if (this.state.orderDetail.blank[0].response) {
              if (this.state.orderDetail.blank[0].response.success || this.state.orderDetail.blank[0].status == 'query') {
                this.state.orderDetail.fileIds.push(this.state.orderDetail.blank[0].response.file.fileId);
              } else {
                TipModal.error({content: "香港银行账户上传失败："+this.state.orderDetail.blank[0].response.message});
                return;
              }
            }
          } else {
            this.state.orderDetail.fileIds.push(0);
          }
          for (var i=0; i<this.state.orderDetail.otherFile.length; i++) {
            if (this.state.orderDetail.otherFile[i].response) {
              if (this.state.orderDetail.otherFile[i].response.success || this.state.orderDetail.otherFile[i].status == 'query') {
                this.state.orderDetail.fileIds.push(this.state.orderDetail.otherFile[i].response.file.fileId||0);
              } else {
                TipModal.error({content: "第 " + (i+1) + " 个附件上传失败："+this.state.orderDetail.otherFile[i].response.message});
                return;
              }
            }
          }
          let orderBody = [];
          if (this.props.orderId) {
            this.state.orderDetail.__status = 'update';
          }
          this.state.addSource.map((row,index) => {
            orderBody[index] = {};
            for (var i in this.state.orderDetail) {
              orderBody[index][i] = this.state.orderDetail[i];
            }
            orderBody[index].orderId = row.orderId;
            orderBody[index].orderNumber = row.orderNumber;
            orderBody[index].productSupplierId = row.productSupplierId;
            orderBody[index].currency = row.currencyCode;
            orderBody[index].channelId = row.channelId;
            orderBody[index].channelCommissionLineId = row.channelCommissionLineId;
            orderBody[index].itemId = row.itemId;
            orderBody[index].keepFlag = row.keepFlag;
            orderBody[index].policyAmount = row.policyAmount;
            orderBody[index].sublineId = row.sublineId;
            orderBody[index].agreedPaymentDate = new Date(row.agreedPaymentDate);
            orderBody[index].agreedPaymentDate = orderBody[index].agreedPaymentDate.getFullYear() + '-'+ (orderBody[index].agreedPaymentDate.getMonth()+1)+'-'+orderBody[index].agreedPaymentDate.getDate()+' 00:00:00';
          });
          //提交按钮disabled
          document.getElementById("submitBtn").disabled = true;
          //预约信息提交
          ordOrderSubmit(orderBody).then((orderData) => {
            if (orderData.success) {
              let customerBody = this.state.orderDetail;
              customerBody.orderIds = [];
              orderData.rows.map((row) => {
                customerBody.orderIds.push(row.orderId);
              });
              //客户信息提交
              ordCustomerSubmit([customerBody]).then((customerData) => {
                if (customerData.success) {
                  TipModal.success({content:"预约资料已提交，请耐心等待审核！"});
                  window.setTimeout(()=>{
                    location.hash = "/order/bonds";
                  },5000);
                } else {
                  TipModal.error({content:'提交失败'});
                  return;
                }
              });
            } else {
              TipModal.error({content:orderData.message});
              return;
            }
          });
        } else {
          TipModal.error({content:"请完善必填项！"});
          return;
        }
      });
    }
  }
  //时间选择半小时化
  range(start, end) {
    const used = [0, 30], result = [];
    for (let i = start; i < end; i++) {
      if(indexOf(used, i) < 0){
        result.push(i);
      }
    }
    return result;
  }

  disabledDateTime() {
    return {
      disabledMinutes: () => this.range(0, 60),
    };
  }

  //不可选日期
  disabledStartDate(current) {
    if (current) {
      var date = new Date();
      current = new Date(current);
      date = moment(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()),"YYYY-MM-DD");
      current = moment(current.getFullYear()+"-"+(current.getMonth()+1)+"-"+(current.getDate()),"YYYY-MM-DD")
      return date.valueOf() > current.valueOf();
    } else {
      return false;
    }
  }
  fun(record, callback) {
    record.policyAmount=(""+record.policyAmount).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")+" "+record.currencyCode;
    callback(record);
  }
  validate(rule,value,callback) {
    if (parseFloat(value.replace(/,/g,''))%1000000 != 0) {
      callback('请填写100万倍数的数字');
      return;
    }
    callback();
  }
  render() {
    const columns = [{
      title: <span className='ant-form-item-required'>上市公司及上市编号</span>,
      dataIndex: 'itemName',
      key: 'itemName',
      width: '30%',
      render: (text, record, index) => {
        if (text) {
          if (record.stockCode) {
            return text+'（'+record.stockCode+'）';
          } else {
            return text;
          }
        } else {
          return <div onClick={()=>document.getElementById('addProduct').click()} style={{width:'100%',height:'24px'}}></div>
        }
      }
    }, {
      title: '年期',
      dataIndex: 'contributionPeriod',
      key: 'contributionPeriod',
      width: '10%',
      render: (text, record, index) => {
        if (record.itemName) {
          return text||'';
        } else {
          return <div onClick={()=>document.getElementById('addProduct').click()} style={{width:'100%',height:'24px'}}></div>
        }
      }
    }, {
      title: <span className='ant-form-item-required'>金额</span>,
      dataIndex: 'policyAmount',
      key: 'policyAmount',
      width: '20%',
      render: (text, record, index) => {
        if (record.itemName) {
          return <TableCellEditor validator={this.validate.bind(this)} placeholder={'100万'+record.currencyDesc+'起'} inputValue={text?(""+text).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")+" "+record.currencyCode:''} disabled={this.state.disabled} isRequired={true} onChange={this.fun.bind(this)} rowData={this.state.addSource[index]} type="NumbericeInput" index={index} name="policyAmount" />
        } else {
          return <div onClick={()=>document.getElementById('addProduct').click()} style={{width:'100%',height:'24px'}}></div>
        }
      },
    }, {
      title: <span className='ant-form-item-required'>是否预留</span>,
      dataIndex: 'keepFlag',
      key: 'keepFlag',
      width: '10%',
      render: (text, record, index) => {
        if (record.itemName) {
          return <TableCellEditor inputValue={text} disabled={this.state.disabled} isRequired={true} rowData={this.state.addSource[index]} type="Select" valueList={this.state.codeList.yesOrNo} index={index} name="keepFlag" />
        } else {
          return <div onClick={()=>document.getElementById('addProduct').click()} style={{width:'100%',height:'24px'}}></div>
        }
      },
    }, {
      title: <span className='ant-form-item-required'>预定支付日</span>,
      dataIndex: 'agreedPaymentDate',
      key: 'agreedPaymentDate',
      width: '20%',
      render: (text, record, index) => {
        if (record.itemName) {
          return <TableCellEditor inputValue={text} disabled={this.state.disabled} isRequired={true} disabledDate={this.disabledStartDate.bind(this)} rowData={this.state.addSource[index]} type="DatePicker" index={index} name="agreedPaymentDate" />
        } else {
          return <div onClick={()=>document.getElementById('addProduct').click()} style={{width:'100%',height:'24px'}}></div>
        }
      },
    }, {
      title: '管理',
      key: 'operation',
      width: '10%',
      render: (text, record, index) => {
        if (record.itemName) {
          if (this.state.disabled) {
            return <Icon style={{cursor: 'pointer'}} type="delete"/>;
          } else {
            if (!isNaN(this.props.orderId)) {
              return <Icon style={{cursor: 'pointer'}} type="delete"/>;
            }
            return (
              <Popconfirm title="确定要删除吗?"onConfirm={this.handleDelete.bind(this, index)} okText="Yes" cancelText="No">
                <Icon style={{cursor:'pointer',color:'#d1b97f'}} type="delete"/>
              </Popconfirm>
            );
          }
        } else {
          return (
            <Icon type="plus-square" onClick={()=>document.getElementById('addProduct').click()} style={{cursor:'pointer',color:'#d1b97f'}} />
          )
        }
      }
    }];
    const { getFieldDecorator, getFieldValue } = this.props.form;
    //根据快码值生成下拉列表
    const genderOptions = this.state.codeList.genderList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const yesOrNoOptions = this.state.codeList.yesOrNo.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const customerLanguageOptions = this.state.codeList.customerLanguageList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const presentCIESScheduleOptions = this.state.codeList.presentCIESScheduleList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const yearPeriodOptions = this.state.codeList.yearPeriodList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const productionClassOptions = this.state.codeList.productionClassList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const phoneCodeOptions = this.state.codeList.phoneCodeList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>;
    });
    const phoneCode = (
      getFieldDecorator('phoneCode', {
        initialValue: this.state.orderDetail.phoneCode||JSON.parse(localStorage.user).phoneCode||"86",
      })(
        <Select onChange={this.phoneCodeChange.bind(this)} disabled={this.state.disabled} style={{ width: 110 }}>
          {phoneCodeOptions}
        </Select>
      )
    );
    const reserveContactPhoneCode = (
      getFieldDecorator('reserveContactPhoneCode', {
        initialValue: this.state.orderDetail.reserveContactPhoneCode||JSON.parse(localStorage.user).phoneCode||"86",
      })(
        <Select onChange={this.reserveContactPhoneCodeChange.bind(this)} disabled={this.state.disabled} style={{ width: 110 }}>
          {phoneCodeOptions}
        </Select>
      )
    );
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    return (
      <Form className={styles.productSubscribe}>
        <Row>
          <Row style={{borderBottom:'1px solid #dbdbdb',padding: '28px 0'}}>
            <span className={commonStyles.iconL}></span>
            <span className={commonStyles.iconR}>拟认购债券信息</span>
            {
              JSON.parse(localStorage.user).userType == "ADMINISTRATION" &&
              <div>
                <Form.Item label="渠道" {...formItemLayout}>
                  {getFieldDecorator('channel', {
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
                    initialValue: {
                      value: this.state.orderDetail.channelId || JSON.parse(localStorage.user).relatedPartyId,
                      meaning: this.state.orderDetail.channelName,
                      record: {
                        channelId: this.state.orderDetail.channelId || JSON.parse(localStorage.user).relatedPartyId,
                        channelName: this.state.orderDetail.channelName,
                      }
                    },
                  })(
                    <Lov title="选择渠道" disabled={this.state.disabled} itemChange={this.channelChange.bind(this)} lovCode='CNL_AGENCY_NAME' params ={{userId:JSON.parse(localStorage.user).userId}} />
                  )}
                </Form.Item>
              </div>
            }
            <LovMultiple params={{channelId: this.state.channelParam}} config={true} title="添加产品" lovCode='BOND_PRD_ITEMS' lovClick={this.itemClick.bind(this)} onSave={this.handleAdd.bind(this)}>
              <Button disabled={this.state.channelFlag||this.props.orderId?true:false} type="primary" id="addProduct" style={{float:'right',height:'40px',width:'140px'}}>添加产品</Button>
            </LovMultiple>
          </Row>
          <Table rowKey="key" columns={columns} dataSource={this.state.addSource} pagination={false} bordered style={{padding:'10px 0 10px 0'}}/>
        </Row>
        <Row>
          <Row style={{borderBottom:'1px solid #dbdbdb',padding: '28px 0'}}>
            <span className={commonStyles.iconL}></span>
            <span className={commonStyles.iconR}>基本信息</span>
          </Row>
          <Row style={{ paddingTop: '28px' }}>

            <Form.Item label="客户" {...formItemLayout}>
              {getFieldDecorator('applicantCustomer', {
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
                initialValue: {
                  value: this.state.orderDetail.applicantCustomerId,
                  meaning: this.state.orderDetail.chineseName,
                  record: {
                    customerId: this.state.orderDetail.applicantCustomerId,
                    chineseName: this.state.orderDetail.chineseName,
                    birthDate: this.state.orderDetail.birthDate,
                    email:this.state.orderDetail.email,
                    phone: this.state.orderDetail.phone,
                    phoneCode: this.state.orderDetail.phoneCode,
                    sex: this.state.orderDetail.sex,
                  }
                },
              })(
                <CustomerLov
                  disabled={this.state.disabled}
                  lovCode='ORD_CUSTOMER'
                  params ={{channelId:this.props.form.getFieldValue('channel') ? this.props.form.getFieldValue('channel').value:JSON.parse(localStorage.user).relatedPartyId}}
                  placeholder="请选择客户"
                  itemChange={this.customerChange.bind(this)}
                  width="100%" />
              )}
            </Form.Item>
            <Form.Item label="身份证号" {...formItemLayout}>
              {getFieldDecorator('identityNumber', {
                rules: [
                  {required:true,message:'请输入身份证号',whitespace:true},
                  {pattern:/^[A-Za-z0-9\(\)]*$/,message:'请输入数字、字母或者英文括号'}
                ],
                initialValue: this.state.orderDetail.identityNumber,
              })(
                <Input disabled={this.state.disabled} />
              )}
            </Form.Item>
            <Form.Item label="性别" {...formItemLayout}>
              {getFieldDecorator('sex', {
                rules: [{
                  required: true,
                  message: '请选择性别',
                  whitespace: true
                }],
                initialValue: this.state.orderDetail.applicantSex,
              })(
                <Select disabled={this.state.disabled}>
                  {genderOptions}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="客户语言" {...formItemLayout}>
              {getFieldDecorator('customerLang', {
                rules: [{
                  required: true,
                  message: '请选择客户语言',
                  whitespace: true,
                  type: 'array',
                }],
                initialValue: (typeof this.state.orderDetail.customerLang == 'string' && this.state.orderDetail.customerLang)?this.state.orderDetail.customerLang.split(','):[],
              })(
                <Select disabled={this.state.disabled} mode="multiple">
                  {customerLanguageOptions}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="持有香港银行卡" {...formItemLayout}>
              {getFieldDecorator('hkCardFlag', {
                rules: [{
                  required: true,
                  message: '请选择持有香港银行卡',
                  whitespace: true
                }],
                initialValue: this.state.orderDetail.hkCardFlag,
              })(
                <Select onChange={this.hkCardChange.bind(this)} disabled={this.state.disabled}>
                  {yesOrNoOptions}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="持有证券账户" {...formItemLayout}>
              {getFieldDecorator('securitiesFlag', {
                rules: [{
                  required: true,
                  message: '请选择持有证券账户',
                  whitespace: true
                }],
                initialValue: this.state.orderDetail.securitiesFlag,
              })(
                <Select disabled={this.state.disabled}>
                  {yesOrNoOptions}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="个人专业投资者" {...formItemLayout}>
              {getFieldDecorator('professionalFlag', {
                rules: [{
                  required: true,
                  message: '请选择个人专业投资者',
                  whitespace: true
                }],
                initialValue: this.state.orderDetail.professionalFlag,
              })(
                <Select disabled={this.state.disabled}>
                  {yesOrNoOptions}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="客户联系电话" {...formItemLayout}>
              {getFieldDecorator('phone', {
                rules: [{
                  required: true,
                  message: '请输入客户联系电话',
                  whitespace: true
                },{
                  validator: this.checkPhone.bind(this),
                }],
                initialValue: this.state.orderDetail.phone,
              })(
                <NumberInput disabled={this.state.disabled} addonBefore={phoneCode} style={{width:'100%'}} />
              )}
            </Form.Item>
            <Form.Item label="电子邮箱" {...formItemLayout}>
              {getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: '请输入合法的邮箱地址',
                },{
                  required: true,
                  message: '请输入电子邮箱',
                  whitespace: true
                }],
                initialValue: this.state.orderDetail.email,
              })(
                <Input disabled={this.state.disabled} />
              )}
            </Form.Item>
            <Form.Item label="预约时间" {...formItemLayout}>
              {getFieldDecorator('reserveDate', {
                rules: [{
                  required: true,
                  message: '请选择预约时间',
                  whitespace: true,
                  type: 'object'
                }],
                initialValue: isNaN(moment(this.state.orderDetail.reserveDate,"YYYY-MM-DD HH:mm"))?
                                null
                                :
                                moment(this.state.orderDetail.reserveDate,"YYYY-MM-DD HH:mm")
              })(
                <DatePicker
                  disabled={this.state.disabled}
                  placeholder=""
                  format="YYYY-MM-DD HH:mm"
                  disabledDate={this.disabledStartDate.bind(this)}
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: moment('09:00', 'HH:mm'),
                    format: 'HH:mm'
                  }}
                  disabledTime={this.disabledDateTime.bind(this)}
                  style={{width: '100%'}}
                />
              )}
            </Form.Item>
            <Form.Item label="预约联系人" {...formItemLayout}>
              {getFieldDecorator('reserveContactPerson', {
                rules: [{
                  required: true,
                  message: '请输入预约联系人',
                  whitespace: true
                }],
                initialValue: this.state.orderDetail.reserveContactPerson||JSON.parse(localStorage.user).userName,
              })(
                <Input disabled={this.state.disabled} />
              )}
            </Form.Item>
            <Form.Item label="预约联系电话" {...formItemLayout}>
              {getFieldDecorator('reserveContactPhone', {
                initialValue: this.state.orderDetail.reserveContactPhone||JSON.parse(localStorage.user).phone,
                rules: [{
                  required: true,
                  message: '请输入预约联系电话',
                  whitespace: true
                },{
                  validator: this.checkReserveContactPhone.bind(this),
                }],
              })(
                <NumberInput disabled={this.state.disabled} addonBefore={reserveContactPhoneCode} style={{width:'100%'}} />
              )}
            </Form.Item>
            <Form.Item label="香港投资人入境计划（CIES）" {...formItemLayout}>
              {getFieldDecorator('ciesFlag', {
                  rules: [{
                    required: true,
                    message: '请选择香港投资人入境计划（CIES）',
                    whitespace: true
                  }],
                  initialValue: this.state.orderDetail.ciesFlag,
                })(
                <Select disabled={this.state.disabled}>
                  <Select.Option value="N">无</Select.Option>
                  <Select.Option value="Y">有</Select.Option>
                </Select>
              )}
            </Form.Item>
            {
              getFieldValue("ciesFlag") == "Y" ?
                <div>
                  <Form.Item label="现CIES进度" {...formItemLayout}>
                    {getFieldDecorator('ciesProcessRate', {
                      rules: [{
                        required: true,
                        message: '请选择现CIES进度',
                        whitespace: true
                      }],
                      initialValue: this.state.orderDetail.ciesProcessRate,
                    })(
                      <Select disabled={this.state.disabled}>
                        {presentCIESScheduleOptions}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="已投资产品种类" {...formItemLayout}>
                    {getFieldDecorator('investedItem', {
                      rules: [{
                        required: true,
                        message: '请选择已投资产品种类',
                        whitespace: true,
                        type: 'array',
                      }],
                      initialValue: (typeof this.state.orderDetail.investedItem == 'string' && this.state.orderDetail.investedItem)?this.state.orderDetail.investedItem.split(','):[],
                    })(
                      <Select disabled={this.state.disabled} mode="multiple">
                        {productionClassOptions}
                      </Select>
                    )}
                  </Form.Item>
                  {
                    (getFieldValue("investedItem")||[]).indexOf("OTHER") > -1 ?
                      <Form.Item label="其他" {...formItemLayout}>
                        {getFieldDecorator('investedOther', {
                          rules: [{
                            required: true,
                            message: '请选择其他',
                            whitespace: true
                          }],
                          initialValue: this.state.orderDetail.investedOther,
                        })(
                          <Input disabled={this.state.disabled} />
                        )}
                      </Form.Item>
                      :
                      ""
                  }
                  <Form.Item label="已投资产品年期" {...formItemLayout}>
                    {getFieldDecorator('investedSubline', {
                      rules: [{
                        required: true,
                        message: '请选择已投资产品年期',
                        whitespace: true
                      }],
                      initialValue: this.state.orderDetail.investedSubline,
                    })(
                      <Select disabled={this.state.disabled}>
                        {yearPeriodOptions}
                      </Select>
                    )}
                  </Form.Item>
                </div>
                :
                ""
              }
          </Row>
        </Row>
        <Row>
          <Row style={{borderBottom:'1px solid #dbdbdb',padding: '28px 0'}}>
            <span className={commonStyles.iconL}></span>
            <span className={commonStyles.iconR}>附件上传</span>
          </Row>
          <Row style={{ paddingTop: '28px' }}>
            <Form.Item label="身份证" {...formItemLayout}>
              {getFieldDecorator('identification', {
                rules: [{
                  required: true,
                  message: '请上传身份证',
                  whitespace: true,
                  type: 'array'
                }],
                initialValue: this.state.orderDetail.fileList[1]?[this.state.orderDetail.fileList[1]]:[],
              })(
                <Upload disabled={this.state.disabled} fileNum={1} modularName='PRD'>
                  <Button disabled={this.state.disabled} type="primary">选择文件</Button>
                </Upload>
              )}
            </Form.Item>
            <Form.Item label="护照" {...formItemLayout}>
              {getFieldDecorator('passport', {
                initialValue: this.state.orderDetail.fileList[2]?[this.state.orderDetail.fileList[2]]:[],
              })(
                <Upload disabled={this.state.disabled} fileNum={1} modularName='PRD'>
                  <Button disabled={this.state.disabled} type="primary">选择文件</Button>
                </Upload>
              )}
            </Form.Item>
            <Form.Item label="地址证明" {...formItemLayout}>
              {getFieldDecorator('address', {
                initialValue: this.state.orderDetail.fileList[3]?[this.state.orderDetail.fileList[3]]:[],
              })(
                <Upload disabled={this.state.disabled} fileNum={1} modularName='PRD'>
                  <Button disabled={this.state.disabled} type="primary">选择文件</Button>
                </Upload>
              )}
            </Form.Item>
            <Form.Item label="800万资产证明" {...formItemLayout}>
              {getFieldDecorator('W800', {
                initialValue: this.state.orderDetail.fileList[4]?[this.state.orderDetail.fileList[4]]:[],
              })(
                <Upload disabled={this.state.disabled} fileNum={1} modularName='PRD'>
                  <Button disabled={this.state.disabled} type="primary">选择文件</Button>
                </Upload>
              )}
            </Form.Item>
            <Form.Item label="香港银行账户" {...formItemLayout}>
              {getFieldDecorator('blank', {
                rules: [{
                  required:this.state.hkCardRequired,
                  message: '请上传香港银行账户',
                  whitespace: true,
                  type: 'array'
                }],
                initialValue: this.state.orderDetail.fileList[5]?[this.state.orderDetail.fileList[5]]:[],
              })(
                <Upload disabled={this.state.disabled} fileNum={1} modularName='PRD'>
                  <Button disabled={this.state.disabled} type="primary">选择文件</Button>
                </Upload>
              )}
            </Form.Item>
            <Form.Item label="其他附件（可添加多个附件）" {...formItemLayout}>
              {getFieldDecorator('otherFile', {
                initialValue: this.state.orderDetail.otherFileList||[],
              })(
                <Upload disabled={this.state.disabled} fileNum={10} modularName='PRD'>
                  <Button disabled={this.state.disabled} type="primary">选择文件</Button>
                </Upload>
              )}
            </Form.Item>
          </Row>
        </Row>
        <Row>
          {
            !this.state.disabled &&
            <Form.Item
              wrapperCol={{
                xs: { span: 16, offset: 8 },
                sm: { span: 16, offset: 8 },
              }}
            >
              <Button type="default" disabled={this.state.disabled} style={{width:'120px',height:'40px',marginRight:'80px'}} onClick={this.goBack.bind(this)}>取消</Button>
              <Button type="primary" id="submitBtn" disabled={this.state.disabled} style={{width:'120px',height:'40px'}} onClick={this.handleSubmit.bind(this)}>确认提交</Button>
            </Form.Item>
          }
        </Row>
      </Form>
    )
  }
}

export default Form.create()(ProductionSubscribeComponent);
