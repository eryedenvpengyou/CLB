/*
 * view 财课堂-业务支援-会客支援
 * @author:Lijun
 * @version:20170705
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { isEmpty, round } from 'lodash';
import isFunction from 'lodash/isFunction';
import { getCode } from '../../services/code.js';
import { Form, Input, Row, Col, Button, DatePicker, Select as AntSelect, Layout, InputNumber, Cascader } from 'antd';
import { submitTrainData as submit } from '../../services/classroom.js';
import * as codeService from '../../services/code';
import pcCascade from '../../utils/common';
import Modal from './Modal';
import style from '../../styles/classroom.css';
import Lov from '../common/Lov';
const FormItem = Form.Item;
const Option = AntSelect.Option;
const { Content } = Layout;

class ReceiveSupportComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      codeList: {},
      loading: false,
    };

    [
      'render',
      'handleSubmit',
      'handleback',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    const codeType = {
      provinceList: 'PUB.PROVICE',                            //省份
      cityList: 'PUB.CITY',
    };
    codeService.getCode(codeType).then((data) => {
      const options = pcCascade(data);
      this.setState({options: options, codeList: data });
    });

  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { getFieldValue } = this.props.form;
      const prefix = getFieldValue('prefix');
      const user = JSON.parse(localStorage.user);
      const param = values;
      if(JSON.parse(localStorage.user).userType == "ADMINISTRATION"){
        param.channelId = this.props.form.getFieldValue('channelId').value;
      }else {
        param.channelId = user.relatedPartyId;
      }
      param.supportType = 'GUEST';
      param.phoneCode = prefix;
      param.guestDate = values.guestDate.format('YYYY-MM-DD HH:mm:ss');
      const part = values.part;
      param.province = part[0];
      param.city = part[1];
      const guestPercent = param.guestPercent;
      param.guestPercent = round(guestPercent / 100, 4);

      if (!(this.validatePhoneAera(prefix, param.contactPhone, (msg) => {
        if (!isEmpty(msg)) {
          Modal.error({
            content: `提交失败！${msg}`,
            isOk: true,
            autoClose: true,
          });
        }
      }))) {
        return;
      }

      if (prefix !== '86') {
        param.contactPhone = `${param.contactPhone}`;
      }
      this.setState({
        loading: true,
      });
      submit(values).then((data) => {
        if (data.success) {
          Modal.success({
            content: '提交成功！',
            isOk: true,
            closable: false,
            autoClose: true,
            handleOk: () => {
              this.props.dispatch(routerRedux.push('/portal/reservation/1'));
              this.props.form.resetFields();
            },
          });
        } else {
          Modal.error({
            content: `提交失败！请联系系统管理员,${data.message}`,
            isOk: true,
            autoClose: true,
          });
        }
        this.setState({
          loading: false,
        });
      });
    });
  }

  handleback() {
    this.props.dispatch(routerRedux.push('/classroom/business'));
  }

  handlePhoneCheck = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    const prefix = getFieldValue('prefix');
    this.validatePhoneAera(prefix, value, callback);
    callback();
  }

  handlePhoneAeraCheck = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    const prefix = value;
    const contactPhone = getFieldValue('contactPhone');
    this.validatePhoneAera(prefix, contactPhone);
    callback();
  }

  handleEmail = (rule, value, callback) => {
    if (!(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)) && isFunction(callback)) {
      callback('邮箱格式不正确');
    }
    callback();
  }

  validatePhoneAera(prefix, value, callback) {
    let flag = true;
    let msg = '';
    if (!value) {
      flag = false;
      msg = '请输入联系人手机';
    }

    if (prefix === '86' && value && !(/^\d{11}$/.test(value))) {
      msg = '请输入正确的手机号(大陆地区为11位)';
      flag = false;
      if (isFunction(callback)) {
        callback(msg);
      }
    } else if (prefix === '00852' && value && !(/^\d{8}$/.test(value))) {
      msg = '请输入正确的手机号(港澳地区为8位)'; // /^([6|9])\d{7}$/ // /^[0][9]\d{8}$/
      flag = false;
      if (isFunction(callback)) {
        callback(msg);
      }
    } else if (prefix === '00853' && value && !(/^\d{8}$/.test(value))) {
      msg = '请输入正确的手机号(港澳地区为8位)';
      flag = false;
      if (isFunction(callback)) {
        callback(msg);
      }
    } else if (prefix === '00886' && value && !(/^\d{9}$/.test(value))) {
      msg = '请输入正确的手机号(台湾地区为9位)';
      flag = false;
      if (isFunction(callback)) {
        callback(msg);
      }
    }

    this.setState({
      validateStatus: flag ? 'success' : 'error',
      help: msg,
    });

    if (isFunction(callback)) {
      callback();
    }

    return flag;
  }

  disabledDate = current => current && current.valueOf() < moment(moment(new Date()).format('YYYY-MM-DD 00:00:00')).toDate();

  render() {
    const { form } = this.props;
    const {
      getFieldDecorator,
      getFieldValue,
    } = form;
    const {
      codeList,
      loading,
      validateStatus,
      help,
    } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 10 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 20,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 6,
        },
      },
    };

    const phoneType = [{
      value: '86',
      description: '+86(大陆)',
    }, {
      value: '00852',
      description: '+852(香港)',
    }, {
      value: '00853',
      description: '+853(澳门)',
    }, {
      value: '00886',
      description: '+886(台湾)',
    }];

    const phoneOptions = [];

    phoneType.map((n) => {
      phoneOptions.push(<Option key={n.value} value={n.value}>{n.description}</Option>);
    });

    const selectPhoneTypeBefore = (
      getFieldDecorator('prefix', { initialValue: '86',
        rules: [{ required: true, message: '请选择国际区号', whitespace: true }, {
          validator: this.handlePhoneAeraCheck,
        }],
      })(
        <AntSelect style={{ width: 150 }}>
          {phoneOptions}
        </AntSelect>,
      )
    );

    return (
      <Content className={`${style.container} ${style['support-charge-rule']}`}>
        <Row className={`${style['background-white']}`}>
          <Row className={style['title-container']} ><span className={style['title-bar']}>会客支援</span></Row>
          <Row className={`${style.container}`} >
            <div style={{ marginLeft: '10%' }}>
              <Form onSubmit={this.handleSubmit}>
                {
                  JSON.parse(localStorage.user).userType === "ADMINISTRATION" &&
                    <FormItem label="渠道" {...formItemLayout}>
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
                        })(
                        <Lov disabled={this.props.dFlag} title="选择渠道" lovCode='CNL_AGENCY_NAME' params ={{userId:JSON.parse(localStorage.user).userId}}/>
                      )}
                    </FormItem>
                }
                <FormItem {...formItemLayout} label="申请人" >
                  {getFieldDecorator('createrName', {
                    rules: [{ required: true, message: '请输入申请人', whitespace: true }],
                  })(
                    <Input placeholder=" " />,
                      )}
                </FormItem>
                <FormItem {...formItemLayout} label="联系人手机"  validateStatus={validateStatus} help={help}>
                  { getFieldDecorator('contactPhone', {
                    rules: [{ required: true, message: '请输入联系人手机', whitespace: true }, {
                      validator: this.handlePhoneCheck,
                    }],
                  })(
                    <Input addonBefore={selectPhoneTypeBefore} placeholder=" " style={{ width: '100%' }}/>,
                      )}
                </FormItem>
                <FormItem {...formItemLayout} label="联系人邮箱" >
                  {getFieldDecorator('contactEmail', {
                    rules: [
                      { message: '邮箱格式不正确',pattern:/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/ },
                      { required: true, message: '请输入联系人邮箱', }
                    ],
                  })(
                    <Input placeholder=" " />,
                      )}
                </FormItem>
                <FormItem {...formItemLayout} className={style.formitem_sty} label="会客人数">
                  {getFieldDecorator('guestParTotal', {
                    rules: [{ required: true, message: '请输入会客人数', whitespace: true, type: 'number' }],
                  })(
                    <InputNumber style={{ width: '100%' }} precision={0} placeholder=" " size="large" min={1} />,
                      )}
                </FormItem>
                <FormItem {...formItemLayout} label="会客时间" >
                  {getFieldDecorator('guestDate', {
                    rules: [{ type: 'object', required: true, message: '请输入会客时间' }],
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD HH:mm"
                      showTime={{ initialValue: moment('00:00', 'HH:mm'), format: 'HH:mm' }}
                      disabledDate={this.disabledDate}
                    />,
                      )}
                </FormItem>
                <FormItem {...formItemLayout} label="会客地点" >
                  {getFieldDecorator('part', {
                    rules: [
                      {required:true, message:'请选择会客地点'},
                    ],
                  })(
                    <Cascader options={this.state.options} placeholder=" "/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="详细地址" >
                  {getFieldDecorator('guestAddress', {
                    rules: [{ required: true, message: '请输入详细地址', whitespace: true }],
                  })(
                    <Input placeholder=" " />,
                      )}
                </FormItem>
                <FormItem {...formItemLayout} label="指定培训讲师" >
                  {getFieldDecorator('guestTeacher', {})(
                    <Input placeholder=" " />,
                      )}
                </FormItem>
                <FormItem {...formItemLayout} label="会客洽谈内容" >
                  {getFieldDecorator('guestDiscussContent', {
                    rules: [{ required: true, message: '请输入会客洽谈内容', whitespace: true }],
                  })(
                    <Input placeholder=" " />,
                      )}
                </FormItem>
                <FormItem {...formItemLayout} label="愿意提取佣金比例" >
                  {getFieldDecorator('guestPercent', {
                    rules: [{ required: true, message: '请输入愿意提取佣金比例', whitespace: true, type: 'number' }],
                  })(
                    <InputNumber
                      min={0}
                      max={100}
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                      step={0.01}
                      style={{ width: '100%'}}
                    />,
                      )}
                </FormItem>
                <FormItem {...formItemLayout} label="客户背景简单描述" style={{ marginBottom: '2%' }}>
                  {getFieldDecorator('guestBackground', {
                    rules: [{ required: true, message: '请输入客户背景简单描述', whitespace: true }],
                  })(
                    <Input type="textarea" rows={4} maxLength={100} />,
                      )}
                </FormItem>
                <FormItem {...formItemLayout} label="其他要求" style={{ marginBottom: '2%' }}>
                  {getFieldDecorator('other')(
                    <Input type="textarea" rows={4} maxLength={100} />,
                      )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Row gutter={24}>
                    <Col span={10}>
                      <Button size="large" type="default" style={{ height: 40, width: 120 }} onClick={this.handleback}>取消申请</Button>
                    </Col>
                    <Col span={14}>
                      <Button type="primary" style={{ float: 'right', height: 40, width: 120 }} loading={loading} htmlType="submit" size="large" >提交申请</Button>
                    </Col>
                  </Row>
                </FormItem>
              </Form>
            </div>
          </Row>
        </Row>
      </Content>
    );
  }
}

const ReceiveSupport = Form.create()(ReceiveSupportComponent);
export default connect()(ReceiveSupport);
