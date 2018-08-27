import React from 'react';
import {Link} from 'dva/router'
import {Row, Col, Button, Select, Form, DatePicker, Input, InputNumber, Card, Icon} from 'antd';
import styles from '../../styles/production.css';
import * as common from '../../utils/common'
import TipModal from "../common/modal/Modal";
import CustomerLov from "../common/CustomerLov";
import Lov from "../common/Lov";
import Upload from '../common/Upload';
import Download from '../common/Download'
import {ordOrderSubmit, querySublineList, queryProductionInfo} from '../../services/production';
import {getOrdService, getOrdFile} from '../../services/order'
import { getCode } from '../../services/code';
import moment from 'moment';
const FormItem = Form.Item;

class ProductionSubscribeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      orderId: '',
      customerId: '',
      orderDetail: {},
      orderFile: [],
      status: 'APPROVING',
      codeList: {
        phoneCodeList: [],
      },
      prdItemSublineList: [],
      downloadFileList: [],
      currentType: {},
      currencyCode: '',
      currencyDesc: '',
    }
    if (this.props.params && this.props.params.flag) {
      if (this.props.params.flag === 'query') {
        this.state.disabled = true;
      } else if (this.props.params.flag === 'update') {
        // this.state.status = 'NEW'
      }
      this.state.orderId = this.props.params.orderId || '';
    }
  }

  handleSubmit = (e, status) => {
    if (this.state.disabled) return;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let files = {}, customerBody = {};
      if (err) {
        TipModal.error({content: '请完善必填项'});
        return
      }
      if (values.depPaidFileId[0] && values.depPaidFileId[0].response.success) {
        values.depPaidFileId[0].response.file && (files.depPaidFileId = values.depPaidFileId[0].response.file.fileId);
      }
      if (values.serviceFileId[0] && values.serviceFileId[0].response.success) {
        values.serviceFileId[0].response.file && (files.serviceFileId = values.serviceFileId[0].response.file.fileId);
      }
      if (values.handleVisaFlag === 'Y') {
        if (values.visaPaidFileId[0] && values.visaPaidFileId[0].response.success) {
          values.visaPaidFileId[0].response.file && (files.visaPaidFileId = values.visaPaidFileId[0].response.file.fileId);
        }
        if (values.visaApplyFileId[0] && values.visaApplyFileId[0].response.success) {
          values.visaApplyFileId[0].response.file && (files.visaApplyFileId = values.visaApplyFileId[0].response.file.fileId);
        }
      }
      Object.assign(customerBody, values, files);
      customerBody.applicantCustomerId = values.applicantCustomerId.value;
      customerBody.itemId = this.props.itemId;
      if (values.visaFlag === 'Y') {
        customerBody.payAmount = this.state.currentType.price * 0.4;
      } else {
        customerBody.payAmount = 3000
      }
      if (values.handleVisaFlag === 'Y') {
        customerBody.signFee = (values.visaCount ? values.visaCount * 1500 : 0);
      } else {
        customerBody.signFee = 0;
      }
      customerBody.policyAmount = this.state.currentType.price;

      customerBody.orderType = 'MEDICALEDU';
      customerBody.status = status;
      customerBody.hisStatus = status;
      customerBody.payMethod = 'WP';
      customerBody.sublineId = this.state.currentType.sublineId || '1';
      customerBody.channelId = JSON.parse(localStorage.user).relatedPartyId;
      customerBody.currency = this.state.currencyCode;
      customerBody.submitDate = moment().format("YYYY-MM-DD HH:mm:ss");
      customerBody.reserveArrivalDate = values.reserveArrivalDate.format('YYYY-MM-DD HH:mm:ss');
      customerBody.passportDate = values.passportDate.format('YYYY-MM-DD HH:mm:ss');
      customerBody.reserveDate = values.reserveDate && values.reserveDate.format('YYYY-MM-DD HH:mm:ss');
      customerBody.fileIds = this.getFileIds() || [];

      if (customerBody.depPaidFileId != this.state.orderDetail.depPaidFileId) {
        customerBody.oldDepPaidFileId = this.state.orderDetail.depPaidFileId || '';
      }
      if (customerBody.serviceFileId != this.state.orderDetail.serviceFileId) {
        customerBody.oldServiceFileId = this.state.orderDetail.serviceFileId || '';
      }
      if (customerBody.visaPaidFileId != this.state.orderDetail.visaPaidFileId) {
        customerBody.oldVisaPaidFileId = this.state.orderDetail.visaPaidFileId || '';
      }
      if (customerBody.visaApplyFileId != this.state.orderDetail.visaApplyFileId) {
        customerBody.oldVisaApplyFileId = this.state.orderDetail.visaApplyFileId || '';
      }
      if (this.props.params.flag === 'update') {
        customerBody.orderId = this.props.params.orderId || '';
        customerBody.orderNumber = this.props.params.orderNumber || '';
      }

      console.log(customerBody);
      ordOrderSubmit([customerBody]).then(orderData => {
        if (orderData.success) {
          if(status == 'APPROVING'){
            TipModal.success({ content: '预约资料已提交，请耐心等待审核！' });
          }else if(status == 'NEW'){
            TipModal.success({ content: '保存成功' });
          }
          window.setTimeout(() => {
            location.hash = '/order/orderYJ'
          }, 3000)
          console.log(orderData)
        }
      });
    });
  }

  //获取附件
  getFileIds(){
    const values = this.props.form.getFieldsValue();
    //附件表
    let fileIds = [0];
    fileIds.push(common.formatFile(values.depPaidFileId || [], true ));
    fileIds.push(common.formatFile(values.serviceFileId || [], true ));
    fileIds.push(common.formatFile(values.visaPaidFileId || [], true ));
    fileIds.push(common.formatFile(values.visaApplyFileId || [], true ));

    return fileIds;
  }

  //客户姓名change事件
  customerChange(value) {
   let data = value.record;
   this.props.form.setFieldsValue({customerEmail: data.email || ''});
   if (data.certificateType === 'PASSPORT'){
     this.props.form.setFieldsValue({passportNumber: data.certificateNumber || ''});
   } else {
     this.props.form.setFieldsValue({passportNumber: ''});
   }
   this.props.form.setFieldsValue({passportDate: data.certificateEffectiveDate ? moment(data.certificateEffectiveDate, "YYYY-MM-DD HH:mm") : undefined});
   this.props.form.setFieldsValue({customerPhoneCode: data.phoneCode || ''});
   this.props.form.setFieldsValue({customerPhone: data.phone || ''});
  }

  disabledDate(current) {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() + 6);
    return current && current.valueOf() < startDate;
  }

  // 选择套餐类型
  chooseType (typeId) {
    let type = this.state.prdItemSublineList.filter((item) => {
      return item.sublineId == typeId;
    });
    this.setState({currentType: type[0]});
  }

  // 移除文件
  fileRemove = (file) => {
    return (this.props.params.flag != 'query')
  }

  componentWillMount () {
    let body = {
      phoneCodeList: "PUB.PHONE_CODE",
      statusData: 'ORD.VISA_LOCATION',
    };
    getCode(body).then((codeData)=>{
      this.setState({
        codeList: codeData,
      })
    });

    queryProductionInfo({
      itemId: this.props.itemId,
      type: 'ITEM',
    }).then((prdData) => {
      if (prdData.success) {
        this.setState({
          downloadFileList: prdData.rows,
        });
      } else {
        TipModal.error({content:prdData.message});
        return;
      }
    }).catch(err => {
      TipModal.error({content:error.toString()});
    });

    querySublineList({itemId: this.props.itemId}).then(res => {
      if (!res.success) return;
      this.setState({
        prdItemSublineList: res.rows[0].prdItemSublineList,
        currencyCode: res.rows[0].currencyCode,
        currencyDesc: res.rows[0].currencyDesc,
      });

      if (this.props.params && this.props.params.orderId) {
        // 获取订单详情
        getOrdService({orderId: this.props.params.orderId}).then(res => {
          res.success && this.setState({orderDetail: res.rows[0]});
          this.chooseType(this.state.orderDetail.sublineId);
        });
        // 获取订单附件
        getOrdFile({orderId: this.props.params.orderId}).then(res => {
          if (res.success) {
            let files = res.rows || [], orderFile = {};
            for(let i in files){
              const fieldName = 'file'+ files[i].fileSeq;
              const file = [files[i]];
              orderFile[fieldName] = common.initFile(file);
            }
            this.setState({orderFile: orderFile});
          }
        });
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const disabled = this.state.disabled;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const prefixSelector = getFieldDecorator('customerPhoneCode', {
      initialValue: this.state.orderDetail.channelPhoneCode || '86',
    })(
      <Select style={{ width: 130 }} disabled={disabled}>
        {
          this.state.codeList.phoneCodeList.map(code => {
            return <Select.Option key={code.value}>{code.meaning}</Select.Option>;
          })
        }
      </Select>
    );
    return (
      <Row className={'disableds ant-modal-body'} style={{padding: 0}}>
        <Col span={12} className={'product'} style={{borderRight: '2px dashed #d1b97f', borderColor: JSON.parse(window.localStorage.theme).themeColor, padding: '10px', fontSize: '16px'}}>
          <Row style={{margin: '10px 0'}}>
            <Col span={8}>
              <Link to={{
                pathname: '/order/orderYJ',
              }}>套餐说明:</Link>
            </Col>
            <Col span={8} offset={8} style={{textAlign: 'right', cursor: 'pointer', color: JSON.parse(window.localStorage.theme).themeColor}}>
              <Download fileId={this.state.downloadFileList[1] && this.state.downloadFileList[1].fileId}>
                <span style={{color: JSON.parse(window.localStorage.theme).themeColor}}>详细资料</span> <Icon type="download" style={{fontSize: '24px'}}/>
              </Download>
            </Col>
          </Row>
          <Row className={styles.productSubscribeFMSZ}>
            <table className={'attach_div'}>
              <tbody>
                <tr>
                  <td width='20%'>套餐类型</td>
                  <td width='20%'>A套餐</td>
                  <td width='20%'>B套餐</td>
                  <td width='20%'>C套餐</td>
                  <td width='20%'>D套餐</td>
                </tr>
                <tr>
                  <td>价格</td>
                  <td style={{color: JSON.parse(window.localStorage.theme).themeColor}}>22,000美元</td>
                  <td style={{color: JSON.parse(window.localStorage.theme).themeColor}}>29,800美元</td>
                  <td style={{color: JSON.parse(window.localStorage.theme).themeColor}}>35,000美元</td>
                  <td style={{color: JSON.parse(window.localStorage.theme).themeColor}}>45,000美元</td>
                </tr>
                <tr>
                  <td>房间类型</td>
                  <td>15-18平雅房</td>
                  <td>25平套房带独立卫生间</td>
                  <td>15-18平雅房2间</td>
                  <td>180平的3房公寓独享</td>
                </tr>
                <tr>
                  <td>通乳按摩</td>
                  <td>100美元/次</td>
                  <td>免费1次</td>
                  <td>免费2次</td>
                  <td>免费3次</td>
                </tr>
                <tr>
                  <td>婴儿保姆配比</td>
                  <td>2:1</td>
                  <td>1:1</td>
                  <td>1:1</td>
                  <td>1:1</td>
                </tr>
                <tr>
                  <td>中药泡脚、擦脚</td>
                  <td>免费3次</td>
                  <td>免费4次</td>
                  <td>免费5次</td>
                  <td>免费7次</td>
                </tr>
              </tbody>
            </table>
          </Row>
          <Row>服务协议(请按所选套餐下载协议，填写并签署后上传)：</Row>
          <Row style={{padding: '10px'}}>
            <Col span={12} style={{color: JSON.parse(window.localStorage.theme).themeColor}}>
              <Download fileId={this.state.downloadFileList[3] && this.state.downloadFileList[3].fileId}>
                <Icon type="download" style={{fontSize: '18px', marginRight: '10px'}}/>
                <span style={{color: JSON.parse(window.localStorage.theme).themeColor}}>{this.state.downloadFileList[3] ? this.state.downloadFileList[3].fileName : ''}</span>
              </Download>
            </Col>
            <Col span={12} style={{color: JSON.parse(window.localStorage.theme).themeColor}}>
              <Download fileId={this.state.downloadFileList[4] && this.state.downloadFileList[4].fileId}>
                <Icon type="download" style={{fontSize: '18px', marginRight: '10px'}}/>
                <span style={{color: JSON.parse(window.localStorage.theme).themeColor}}>{this.state.downloadFileList[4] ? this.state.downloadFileList[4].fileName : ''}</span>
              </Download>
            </Col>
            <Col span={12} style={{color: JSON.parse(window.localStorage.theme).themeColor}}>
              <Download fileId={this.state.downloadFileList[5] && this.state.downloadFileList[5].fileId}>
                <Icon type="download" style={{fontSize: '18px', marginRight: '10px'}}/>
                <span style={{color: JSON.parse(window.localStorage.theme).themeColor}}>{this.state.downloadFileList[5] ? this.state.downloadFileList[5].fileName : ''}</span>
              </Download>
            </Col>
            <Col span={12} style={{color: JSON.parse(window.localStorage.theme).themeColor}}>
              <Download fileId={this.state.downloadFileList[6] && this.state.downloadFileList[6].fileId}>
                <Icon type="download" style={{fontSize: '18px', marginRight: '10px'}}/>
                <span style={{color: JSON.parse(window.localStorage.theme).themeColor}}>{this.state.downloadFileList[6] ? this.state.downloadFileList[6].fileName : ''}</span>
              </Download>
            </Col>
          </Row>
          <Row>签证资料：</Row>
          <Row>每个需要办理签证的同行人员，都需要填写D160申请表、并提供护照首页照片、证件照片、打包上传，每人一套</Row>
          <Row style={{padding: '10px'}}>
            <Col span={10} style={{color: JSON.parse(window.localStorage.theme).themeColor}}>
              <Download fileId={this.state.downloadFileList[2] && this.state.downloadFileList[2].fileId}>
                <Icon type="download" style={{fontSize: '18px', marginRight: '10px'}}/>
                <span style={{color: JSON.parse(window.localStorage.theme).themeColor}}>D160申请表.doc</span>
              </Download>
            </Col>
          </Row>
          <Row style={{marginTop: '10px'}}>定金收款说明：</Row>
          <Row>情况一：孕妇持有美国签证，定金按所选套餐金额的40%收取。</Row>
          <Row>情况二：孕妇未持有美国签证，事先收取定金3000美元。当签证办理成功后，需补足情况一中剩余款额。</Row>
          <Row style={{marginTop: '10px'}}>定金收款账户：</Row>
          <Row className={styles.disableds}>
            <Form>
              <FormItem label="收款人中文名"  labelCol={{span: 6}} wrapperCol={{span:16}}>
                <Input value="财联邦金融科技有限公司" disabled={true} />
              </FormItem>
              <FormItem label="收款人英文名"  labelCol={{span: 6}} wrapperCol={{span:16}}>
                <Input value="Fortune Federation Financial Technology Ltd" disabled />
              </FormItem>
              <FormItem label="收款人账号"  labelCol={{span: 6}} wrapperCol={{span:16}}>
                <Input value="027 553 020 50706" disabled />
              </FormItem>
              <FormItem label="收款银行中文名"  labelCol={{span: 6}} wrapperCol={{span:16}}>
                <Input value="交通银行" disabled />
              </FormItem>
              <FormItem label="收款银行英文名"  labelCol={{span: 6}} wrapperCol={{span:16}}>
                <Input value="Bank of Communications" disabled />
              </FormItem>
              <FormItem label="收款银行SWIFT"  labelCol={{span: 6}} wrapperCol={{span:16}}>
                <Input value="COMMHKHKXXX" disabled />
              </FormItem>
              <FormItem label="收款银行地址"  labelCol={{span: 6}} wrapperCol={{span:16}}>
                <Input value="368 Hennessy Road,WanChai,HK" disabled />
              </FormItem>
            </Form>
          </Row>
          <Row style={{margin: '10px 0'}}>
            <Col span={6}>签证费收款说明：</Col>
            <Col>1500元/人</Col>
          </Row>
          <Row style={{margin: '10px 0'}}>签证费收款账户：</Row>
          <Row className={styles.disableds}>
            <Form>
              <FormItem label="收款人"  labelCol={{span: 6}} wrapperCol={{span:16}}>
                <Input value="吴菊萍" disabled={true} />
              </FormItem>
              <FormItem label="收款人账号"  labelCol={{span: 6}} wrapperCol={{span:16}}>
                <Input value="6214 8578 1338 5616" disabled />
              </FormItem>
              <FormItem label="开户行名称"  labelCol={{span: 6}} wrapperCol={{span:16}}>
                <Input value="招商银行深圳分行皇岗支行" disabled />
              </FormItem>
            </Form>
          </Row>
        </Col>
        <Col span={12}>
          <Form style={{padding: '10px', marginTop: '10px'}}>
            {
              JSON.parse(localStorage.user).userType === "ADMINISTRATION" &&
                <Form.Item label="渠道" {...formItemLayout}>
                  {getFieldDecorator('channelId', {
                    rules: [{
                      // required: true,
                      validator: (rule,value,callback) => {
                        if (!value.value) {
                          callback('请选择渠道');
                        } else {
                          callback();
                        }
                      }
                    }],
                    initialValue: {value: '', meaning: ''},
                  })(
                    <Lov title="选择渠道" disabled={this.state.disabled} lovCode='CNL_AGENCY_NAME' params ={{userId:JSON.parse(localStorage.user).userId}} />
                  )}
                </Form.Item>
            }

            <FormItem label="套餐选择"  {...formItemLayout} >
              <Row gutter={8}>
                <Col span={12} className={'ant-select-lg'}>
                  {getFieldDecorator('sublineId', {
                    rules: [{ required: true, message: '请选择套餐!' }],
                    initialValue: this.state.orderDetail.sublineId ? this.state.orderDetail.sublineId+'' : '',
                  })(
                    <Select onChange={this.chooseType.bind(this)} disabled={disabled}>
                      {
                        this.state.prdItemSublineList.map((item, index) => {
                          // return <Select.Option key={index} value={item.sublineItemName}>{item.sublineItemName}</Select.Option>
                          return <Select.Option key={index} value={item.sublineId+''}>{item.sublineItemName}</Select.Option>
                        })
                      }
                    </Select>
                  )}
                </Col>
                <Col span={12}>{this.state.currentType ? this.state.currentType.price : '0.00'}美元</Col>
              </Row>
            </FormItem>
            <FormItem label="客户姓名"  {...formItemLayout}>
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
                initialValue: {
                  value: this.state.orderDetail.applicantCustomerId || '',
                  meaning: this.state.orderDetail.applicant || '',
                },
              })(
                <CustomerLov
                  disabled={disabled}
                  lovCode='ORD_CUSTOMER'
                  placeholder="请选择客户"
                  params ={{
                    channelId:getFieldValue('channelId') ? getFieldValue('channelId').value:JSON.parse(localStorage.user).relatedPartyId,
                  }}
                  itemChange={this.customerChange.bind(this)}
                  width="100%" />
              )}
            </FormItem>
            <FormItem label="护照号"  {...formItemLayout}>
              {getFieldDecorator('passportNumber', {
                rules: [{required: true, message: '请输入护照号!'}],
                initialValue: this.state.orderDetail.passportNumber || '',
              })(
                <Input disabled={disabled}/>
              )}
            </FormItem>
            <FormItem label="护照有效期"  {...formItemLayout}>
              {getFieldDecorator('passportDate', {
                rules: [{required: true,message: '请输入护照有效期!'}],
                initialValue: this.state.orderDetail.passportDate && moment(this.state.orderDetail.passportDate, 'YYYY-MM-DD'),
              })(
                <DatePicker format="YYYY-MM-DD" disabled={disabled}/>
              )}
            </FormItem>
            <FormItem label="联系电话"  {...formItemLayout}>
              {getFieldDecorator('customerPhone', {
                rules: [{required: true, message: '请输入手机号!'}],
                initialValue: this.state.orderDetail.channelPhone || '',
              })(
                <Input addonBefore={prefixSelector} disabled={disabled}/>
              )}
            </FormItem>
            <FormItem label="邮箱"  {...formItemLayout}>
              {getFieldDecorator('customerEmail', {
                rules: [{required: true, message: '请输入邮箱!', type: 'email'}],
                initialValue: this.state.orderDetail.customerEmail || '',
              })(
                <Input disabled={disabled}/>
              )}
            </FormItem>
            <FormItem label="预产期"  {...formItemLayout}>
              {getFieldDecorator('reserveArrivalDate', {
                rules: [{required: true, message: '请选择预产期',}],
                initialValue: this.state.orderDetail.reserveArrivalDate && moment(this.state.orderDetail.reserveArrivalDate, 'YYYY-MM-DD'),
              })(
                <DatePicker format="YYYY-MM-DD" disabled={disabled}/>
              )}
            </FormItem>
            <FormItem label="孕妇本人是否有签证"  {...formItemLayout} >
              {getFieldDecorator('visaFlag', {
                rules: [{ required: true}],
                initialValue: this.state.orderDetail.visaFlag || 'N',
              })(
                <Select disabled={disabled}>
                  <Select.Option value="Y">是</Select.Option>
                  <Select.Option value="N">否</Select.Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="预计赴美人数"  {...formItemLayout}>
              {getFieldDecorator('peopleCount', {
                rules: [{required: true,message: '请输入人数!'}],
                initialValue: this.state.orderDetail.visaCount || 1,
              })(
                <InputNumber min={1} max={15} disabled={disabled}/>
              )}
            </FormItem>
            <FormItem label="是否需要办理签证"  {...formItemLayout} >
              {getFieldDecorator('handleVisaFlag', {
                rules: [{ required: true}],
                initialValue: this.state.orderDetail.handleVisaFlag || 'N',
              })(
                <Select disabled={disabled}>
                  <Select.Option value="Y">是</Select.Option>
                  <Select.Option value="N">否</Select.Option>
                </Select>
              )}
            </FormItem>
            {getFieldValue('handleVisaFlag') === 'Y' &&
            <FormItem label="需办签证人数"  {...formItemLayout}>
              {getFieldDecorator('visaCount', {
                rules: [{ required: getFieldValue('handleVisaFlag') === 'Y'}],
                initialValue: this.state.orderDetail.visaCount || 1,
              })(
                <InputNumber min={1} max={15} disabled={disabled}/>
              )}
            </FormItem>
            }
            {getFieldValue('handleVisaFlag') === 'Y' &&
            <FormItem label="所在领取"  {...formItemLayout} >
              {getFieldDecorator('securityRegion', {
                initialValue: this.state.orderDetail.securityRegion || 'BJ',
              })(
                <Select disabled={disabled}>
                  {
                    this.state.codeList.statusData.map(code => {
                      return <Select.Option key={code.value}>{code.meaning}</Select.Option>;
                    })
                  }
                </Select>
              )}
            </FormItem>
            }
            {getFieldValue('handleVisaFlag') === 'Y' &&
            <FormItem label="期望面签时间"  {...formItemLayout}>
              {getFieldDecorator('reserveDate', {
                message: '请选择面签时间',
                initialValue: this.state.orderDetail.reserveDate && moment(this.state.orderDetail.reserveDate, 'YYYY-MM-DD'),
              })(
                <DatePicker format="YYYY-MM-DD"  disabledDate={this.disabledDate} disabled={disabled} />
              )}
            </FormItem>
            }
            <Row>
              <Col span={8} style={{textAlign: 'right',padding:'5px 10px'}}>需支付</Col>
              <Col style={{color: 'red', fontWeight: 'bold',fontSize:'24px'}}>
                {
                  (getFieldValue('visaFlag') == 'Y' && this.state.currentType && this.state.currentType.price) ? this.state.currentType.price * 0.4 : '3000'
                }美元(定金)
              </Col>
            </Row>
            <Row>
              <Col offset={8} style={{color: 'red', fontWeight: 'bold',fontSize:'24px'}}>
                {getFieldValue('handleVisaFlag') === 'Y'?(getFieldValue('visaCount')*1500): '0.00'}人民币(签证费)
              </Col>
            </Row>
            <Card style={{margin: '40px 0'}} bodyStyle={{ padding: '0 0 24px 0'}}>
              <Row style={{lineHeight: '48px',fontSize: '20px', background: JSON.parse(window.localStorage.theme).themeColor, color: '#fff', marginBottom: 30, padding: '0 30px'}}>
                <span>上传附件<sub>(如有多份请压缩打包上传，支持zip/rar/7z格式)</sub></span>
              </Row>
              <FormItem label="定金缴费凭证(转账截图等)"  labelCol={{span: 14}} wrapperCol={{span:10}}>
                {getFieldDecorator('depPaidFileId', {
                  rules: [{
                    required: true,
                    message: '请上传缴费凭证',
                  }],
                  initialValue: this.state.orderFile.file1,
                })(
                  <Upload fileNum={1} modularName='PRD' disabled={disabled} onRemove={this.fileRemove}>
                    <Button type="primary">选择附件</Button>
                  </Upload>
                )}
              </FormItem>
              <FormItem label="上传服务协议"  labelCol={{span: 14}} wrapperCol={{span:10}}>
                {getFieldDecorator('serviceFileId', {
                  rules: [{
                    required: true,
                    message: '请上传服务协议',
                  }],
                  initialValue: this.state.orderFile.file2,
                })(
                  <Upload fileNum={1} modularName='PRD' disabled={disabled} onRemove={this.fileRemove}>
                    <Button type="primary">选择附件</Button>
                  </Upload>
                )}
              </FormItem>
              {getFieldValue('handleVisaFlag') === 'Y' &&
              <FormItem label="签证费缴费凭证(转账截图等)" labelCol={{span: 14}} wrapperCol={{span: 10}}>
                {getFieldDecorator('visaPaidFileId', {
                  rules: [{
                    required: getFieldValue('handleVisaFlag') === 'Y',
                    message: '请上传缴费凭证',
                  }],
                  initialValue: this.state.orderFile.file3,
                })(
                  <Upload fileNum={1} modularName='PRD' disabled={disabled} onRemove={this.fileRemove}>
                    <Button type="primary">选择附件</Button>
                  </Upload>
                )}
              </FormItem>
              }
              {getFieldValue('handleVisaFlag') === 'Y' &&
              <FormItem label="签证申请资料(每人一份)" labelCol={{span: 14}} wrapperCol={{span: 10}}>
                {getFieldDecorator('visaApplyFileId', {
                  rules: [{
                    required: getFieldValue('handleVisaFlag') === 'Y',
                    message: '请上传签证资料',
                  }],
                  initialValue: this.state.orderFile.file4,
                })(
                  <Upload fileNum={1} modularName='PRD' disabled={disabled} onRemove={this.fileRemove}>
                    <Button type="primary">选择附件</Button>
                  </Upload>
                )}
              </FormItem>
              }
            </Card>
            <Row>
              <Col span={4}>
                {
                  this.props.params.flag ?
                    <Button style={{width: '100%'}} onClick={() => {window.history.back()}}>返回</Button> :
                    <Button style={{width: '100%'}} onClick={(e)=>{this.handleSubmit(e, 'NEW')}}>保存</Button>
                }
              </Col>
              <Col span={4} offset={16}>
                {
                  this.props.params.flag != 'query' &&
                  <Button style={{width: '100%'}} type="primary" onClick={(e)=>{this.handleSubmit(e, 'APPROVING')}}>提交</Button>
                }
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    )
  }
}

export default Form.create()(ProductionSubscribeComponent);
