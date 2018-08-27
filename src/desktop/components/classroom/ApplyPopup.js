/*
 * view 报名弹窗
 * @author:Lijun
 * @version:20170706
 */
import schema from 'async-validator';
import React, { Component, PropTypes } from 'react';
import { Button, Col, Form, Icon, Input, Row, Select, Layout, Modal } from 'antd';
import { has, isEmpty, isFunction, omit, pullAt } from 'lodash';
import { enrollData as submit } from '../../services/classroom.js';
import { createOrder } from '../../services/pay.js';
import style from '../../styles/classroom.css';
import TipModal from './Modal';

const { Content } = Layout;
const Option = Select.Option;
let uuid = 0;

class ApplyPopupComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      tipVisible: false,
      active: (this.props.rowData.enrollFlag !== 'Y'),
      dataList: [this.currentInfo],
      errorItem: {},
      formData: {},
      confirmLoading: false,
      tipModalConfig: {
        success: false,
        isPay: false,
        title: '',
        content: '',
        payDataList: [],
        status: 'error',
      },
    };

    [
      'render',
      'handleShowModal',
      'handleOk',
      'handleCancel',
      'handleAddFormItems',
      'handleValidate',
      'handleTipModalAction',
      'handleShowTipModal',
      'handleHideTipModal',
      'handleCompleteOrder',
      'handleTipModalComplete',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if ('rowData' in nextProps) {
      this.setState({
        active: (nextProps.rowData.enrollFlag !== 'Y'),
      });
    }
  }

  handleShowModal() {
    if (this.state.active) {
      const dataList = [];
      const { form } = this.props;


      let join = this.props.rowData.trainingMethod, initMethod;
      if(join === "LINE"){
        initMethod = '2';
      }else if(join === "ONLINE" ){
        initMethod = '1';
      }else if(join === "ALLLINE"){
        initMethod = undefined;
      }

      const user = JSON.parse(localStorage.user);
      dataList.push(this.currentInfo);
      this.setState({
        visible: true,
        dataList,
        formData: {
          'company-0': undefined,
          'mailAddress-0': user.email,
          'position-0': undefined,
          'joinMethod-0': initMethod,
        },
        errorItem: {},
      });
      form.setFieldsValue({
        keys: [0],
      });
    }
  }

  handleOk() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 1000);
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  handleAddFormItems() {
    uuid += 1;
    const { form } = this.props;
    const { dataList, formData } = this.state;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    form.setFieldsValue({
      keys: nextKeys,
    });
    const data = {};
    data.key = uuid;

    const rule = {};
    rule[`name-${uuid}`] = {};
    rule[`name-${uuid}`].required = true;
    rule[`name-${uuid}`].type = 'string';
    rule[`name-${uuid}`].message = '请输入姓名';

    rule[`phoneNumber-${uuid}`] = [];
    rule[`phoneNumber-${uuid}`].push({
      required: true,
      message: '请输入联系方式',
    });

    rule[`phoneNumber-${uuid}`].push({
      validator: (rules, value, callback, source, options) => {
        const prefix = this.state.formData[rules.field.replace('phoneNumber', 'prefix')];// this.props.form.getFieldValue(rules.field.replace('phoneNumber', 'prefix'));
        this.validatePhoneAera(prefix, value, callback);
      },
    });

    rule[`company-${uuid}`] = {};
    rule[`company-${uuid}`].required = true;
    rule[`company-${uuid}`].type = 'string';
    rule[`company-${uuid}`].message = '请输入公司';

    rule[`joinMethod-${uuid}`] = {};
    rule[`joinMethod-${uuid}`].required = true;
    rule[`joinMethod-${uuid}`].type = 'string';
    rule[`joinMethod-${uuid}`].message = '请选择参与方式';

    rule[`mailAddress-${uuid}`] = [];
    rule[`mailAddress-${uuid}`].push({
      required: true,
      message: '请输入联系人邮箱',
    });
    rule[`mailAddress-${uuid}`].push({
      type: 'email',
      message: '邮箱格式不正确',
    });

    rule[`mailAddress-${uuid}`].push({
      validator: (rules, value, callback, source, options) => {
        if (!(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)) && isFunction(callback)) {
          callback('邮箱格式不正确');
        }
        callback();
      },
    });

    rule[`position-${uuid}`] = {};
    rule[`position-${uuid}`].required = true;
    rule[`position-${uuid}`].type = 'string';
    rule[`position-${uuid}`].message = '请输入职位';

    rule[`prefix-${uuid}`] = [];
    rule[`prefix-${uuid}`].push({
      required: true,
      message: '请选择国际区号',
    });

    rule[`prefix-${uuid}`].push({
      validator: (rules, value, callback, source, options) => {
        const prefix = value;
        const phone = this.state.formData[rules.field.replace('prefix', 'phoneNumber')];
        this.validatePhoneAera(prefix, phone, callback);
      },
    });

    let join = this.props.rowData.trainingMethod, initMethod;
    if(join === "LINE"){
      initMethod = '2';
    }else if(join === "ONLINE" ){
      initMethod = '1';
    }else if(join === "ALLLINE"){
      initMethod = undefined;
    }

    const itemData = {
      [`name-${uuid}`]: undefined,
      [`phoneNumber-${uuid}`]: undefined,
      [`mailAddress-${uuid}`]: undefined,
      [`company-${uuid}`]: undefined,
      [`position-${uuid}`]: undefined,
      [`joinMethod-${uuid}`]: initMethod,
      [`prefix-${uuid}`]: '86',
    };

    Object.assign(formData, itemData);

    data.rule = rule;
    dataList.push(data);
    this.setState({
      dataList,
      formData,
    });
  }

  validatePhoneAera(prefix, value, callback) {
    const flag = true;
    let msg = '';
    if (!value) {
      msg = '请输入联系人手机';
      callback(msg);
    }

    if (prefix === '86' && value && !(/^\d{11}$/.test(value))) {
      msg = '请输入正确的手机号(大陆地区为11位)';
      if (isFunction(callback)) {
        callback(msg);
      }
    } else if (prefix === '00852' && value && !(/^\d{8}$/.test(value))) {
      msg = '请输入正确的手机号(港澳地区为8位)'; // /^([6|9])\d{7}$/ // /^[0][9]\d{8}$/
      if (isFunction(callback)) {
        callback(msg);
      }
    } else if (prefix === '00853' && value && !(/^\d{8}$/.test(value))) {
      msg = '请输入正确的手机号(港澳地区为8位)';
      if (isFunction(callback)) {
        callback(msg);
      }
    } else if (prefix === '00886' && value && !(/^\d{9}$/.test(value))) {
      msg = '请输入正确的手机号(台湾地区为9位)';
      if (isFunction(callback)) {
        callback(msg);
      }
    }
    callback();
  }

  handleRemoveFormItems(k) {
    const { form } = this.props;
    const { dataList, formData } = this.state;
    const keys = form.getFieldValue('keys');
    let tempKey = 0;
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
    if (!isEmpty(dataList)) {
      dataList.map((n, i) => {
        if (n.key && n.key === k) {
          tempKey = i;
        }
      });
    }
    const tempformData = omit(formData, [`name-${k}`, `phoneNumber-${k}`, `mailAddress-${k}`, `company-${k}`, `position-${k}`, `prefix-${k}`,`joinMethod-${k}`,]);
    pullAt(dataList, tempKey);
    this.setState({
      dataList,
      formData: tempformData,
    });
  }

  handleTipModalAction() {
    const tipModalConfig = this.state.tipModalConfig;
    if (tipModalConfig.isPay && !isEmpty(tipModalConfig.payDataList)) {
      const params = {};
      params.sourceType = 'COURSE';

      let sourceId = '';

      tipModalConfig.payDataList.map((n) => {
        sourceId += `${n.lineId},`;
      });
      params.sourceId = sourceId.substring(0, sourceId.lastIndexOf(','));
      params.amount = tipModalConfig.payDataList.length * Number(this.props.rowData.price);
      /* params.orderSubject = this.props.rowData.topic;
      params.orderContent = `${tipModalConfig.payDataList.length}名学员报名费用`; */
      // location.hash = `portal/payOnline/${params.sourceType}/${params.sourceId}`;
      this.setState({
        confirmLoading: true,
        tipModalConfig: {
          success: false,
          isPay: true,
          title: '',
          content: '正在处理，请稍后...',
          status: 'info',
        },
      });
      window.open(`/#/portal/payOnline/${params.sourceType}/${params.sourceId}`);
      this.setState({
        success: true,
        content: '创建订单成功！跳转支付页面...',
        status: 'success',
        confirmLoading: false,
        tipModalConfig: {
          success: true,
          content: '完成支付',
          status: 'complete',
        },
      });
    } else {
      this.handleHideTipModal();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      form,
      rowData,
    } = this.props;
    const { formData } = this.state;
    const user = JSON.parse(localStorage.user);
    const keys = form.getFieldValue('keys');
    const data = [];
    const descriptor = {};
    this.state.dataList.map((n) => {
      Object.assign(descriptor, n.rule);
    });

    const validator = new schema(descriptor);
    const errorItem = this.state.errorItem || {};
    const $this = this;
    let flag = true;

    validator.validate(formData, (errors, fields) => {
      if (!isEmpty(errors)) {
        for (const key in fields) {
          if (key in fields && !(isEmpty(fields[key]))) {
            errorItem[key] = {};
            errorItem[key].validateStatus = 'error';
            errorItem[key].message = fields[key][0].message;
          }
        }
        flag = false;
        $this.setState({
          errorItem,
        });
      }
    });



    if (!flag) {
      return;
    }

    keys.map((k, index) => {
      const item = {};
      item.name = index === 0 && !isEmpty(this.state.dataList) && this.state.dataList[0].userId === user.userId ? user.userName : formData[`name-${k}`];
      item.phoneNumber = index === 0 && !isEmpty(this.state.dataList) && this.state.dataList[0].userId === user.userId ? user.phone : formData[`phoneNumber-${k}`];
      item.mailAddress = formData[`mailAddress-${k}`];
      item.position = formData[`position-${k}`];
      item.company = formData[`company-${k}`];
      item.joinMethod = formData[`joinMethod-${k}`];
      item.courseId = rowData.courseId;
      item.phoneCode = index === 0 && !isEmpty(this.state.dataList) && this.state.dataList[0].userId === user.userId ? user.phoneCode : formData[`prefix-${k}`];
      if (index === 0 && !isEmpty(this.state.dataList) &&
        this.state.dataList[0].userId === user.userId) {
        item.channelId = user.relatedPartyId;
      }

      item.belongTo = index === 0 && !isEmpty(this.state.dataList) && this.state.dataList[0].userId === user.userId ? 'COMPANY' : 'FOREIGN';
      if (!isEmpty(item.name) && !isEmpty(item.phoneNumber) && !isEmpty(item.position)
        && !isEmpty(item.company) && !isEmpty(item.mailAddress)) {
        data.push(item);
      }
    });

    if (isEmpty(data)) {
      TipModal.error({
        content: '提交失败！请填写完整报名信息',
      });
      return;
    }

    if (rowData.status === 'COMPLETE') {
      TipModal.error({
        content: '提交失败！课程已结束',
      });
      return;
    }

    if (rowData.status === 'INPROCESS') {
      TipModal.error({
        content: '提交失败！课程进行中',
      });
    }

    this.setState({ loading: true });
    submit(data).then((result) => {
      const d = result;
      let content = '提交失败！';
      let isPay = this.state.tipModalConfig.isPay;
      let success = this.state.tipModalConfig.success;
      let payDataList = this.state.tipModalConfig.payDataList;
      let status = this.state.tipModalConfig.status;
      if (d.success) {
        this.setState({ active: false });
        content = '提交成功！';
        success = true;
        status = 'success';
        this.props.fetchData();
        this.handleShowTipModal({
          success,
          content: d.message,
          isPay,
          payDataList,
          status,
        });
      } else if (!d.success && d.code === '-1') {
        isPay = true;
        payDataList = d.rows;
        let sourceId = '';
        success = true;
        payDataList.map((n) => {
          sourceId += `${n.lineId},`;
        });
        const params = {};
        params.sourceId = sourceId.substring(0, sourceId.lastIndexOf(','));
        params.amount = payDataList.length * Number(this.props.rowData.price);
        params.orderSubject = this.props.rowData.topic;
        params.orderContent = `${payDataList.length}名学员报名费用`;
        params.sourceType = 'COURSE';
        createOrder(params).then((data2) => {
          if (data2.success) {
            this.setState({ confirmLoading: false });
            this.props.fetchData();
            this.handleShowTipModal({
              success,
              content: '创建订单成功！请完成支付',
              isPay,
              payDataList,
              status: 'info',
            });
          } else {
            this.handleShowTipModal({
              success: false,
              content: `创建订单失败,${data.message}`,
              status: 'error',
              isPay,
              payDataList,
            });
          }
        });
      } else {
        this.handleShowTipModal({
          success,
          content: d.message,
          isPay,
          payDataList,
          status,
        });
      }


      if (!isEmpty(d.rows) && this.props.getStudentsList) {
        this.props.getStudentsList(d.rows);
      }
      this.setState({ loading: false, confirmLoading: false });
      this.handleCancel();
    });
  }

  handleValidate(e) {
    const value = e.target.value;
    const id = e.target.id;
    this.validate(id, value, this);
  }

  handleSelectChange(value) {
    const id = this.id;
    const $this = this.$this;
    $this.validate(id, value, $this);
  }

  validate(id, value, $this) {
    const descriptor = {};
    $this.state.dataList.map((n) => {
      if (!isEmpty(n.rule[id])) {
        descriptor[id] = n.rule[id];
      }
    });
    const validator = new schema(descriptor);
    const errorItem = $this.state.errorItem;
    const formData = $this.state.formData;
    validator.validate({ [id]: value }, (errors, fields) => {
      errorItem[id] = errorItem[id] || {};
      errorItem[id].validateStatus = !isEmpty(errors) && (id in fields) && !(isEmpty(fields[id])) ? 'error' : 'success';
      errorItem[id].message = !isEmpty(errors) && (id in fields) && !(isEmpty(fields[id])) ? fields[id][0].message : '';
      if (id.indexOf('prefix') >= 0) {
        errorItem[id.replace('prefix', 'phoneNumber')] = errorItem[id.replace('prefix', 'phoneNumber')] || {};
        errorItem[id.replace('prefix', 'phoneNumber')].validateStatus = !isEmpty(errors) && (id in fields) && !(isEmpty(fields[id])) ? 'error' : 'success';
        errorItem[id.replace('prefix', 'phoneNumber')].message = !isEmpty(errors) && (id in fields) && !(isEmpty(fields[id])) ? fields[id][0].message : '';
      }
      formData[id] = value;

      $this.setState({
        errorItem,
        formData,
      });
    });
  }

  handleShowTipModal(tipModalConfig) {
    this.setState({
      tipVisible: true,
      tipModalConfig,
    });
  }

  handleHideTipModal() {
    this.setState({
      tipVisible: false,
    });
  }

  handleCompleteOrder() {
    const tipModalConfig = this.state.tipModalConfig;
    tipModalConfig.payDataList = this.props.rowData.students;
    tipModalConfig.content = '创建订单成功！请完成支付';
    tipModalConfig.isPay = true;
    tipModalConfig.status = 'info';
    this.setState({
      tipModalConfig,
    });
    this.handleShowTipModal(tipModalConfig);
  }

  handleTipModalComplete() {
    this.handleHideTipModal();
    this.props.fetchData();
  }

  codeList = {
    belongTo: [],
  };

  currentInfo = {
    belongTo: 'COMPANY',
    channelId: JSON.parse(localStorage.user).relatedPartyId,
    courseId: this.props.rowData.courseId,
    name: JSON.parse(localStorage.user).userName,
    phoneNumber: JSON.parse(localStorage.user).phone,
    userId: JSON.parse(localStorage.user).userId,
    email: JSON.parse(localStorage.user).email,
    key: 0,
    rule: {
      'company-0': {
        required: true,
        type: 'string',
        message: '请输入公司',
      },
      'mailAddress-0': [
        {
          required: true,
          message: '请输入联系人邮箱',
        },
        {
          type: 'email',
          message: '邮箱格式不正确',
        },
        {
          validator: (rules, value, callback, source, options) => {
            if (!(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)) && isFunction(callback)) {
              callback('邮箱格式不正确');
            }
            callback();
          },
        },
      ],
      'position-0': {
        required: true,
        type: 'string',
        message: '请输入职位',
      },
      'joinMethod-0': {
        required: true,
        type:'string',
        message: '请选择参与方式',
      },
    },
  }

  selectPhoneTypeBefore = (id, value) => {
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
    return (
      <Select defaultValue="86" value={value} style={{ width: 120, height: 32 }} onChange={this.handleSelectChange.bind({ id, $this: this })}>
        {phoneOptions}
      </Select>
    );
  }


  selectJoinMethod = (id, value) => {
    const method = [
    //   {
    //   value: '1',
    //   description: '线上',
    // },
      {
      value: '2',
      description: '线下',
    }
    ];

    const methodOptions = [];

    method.map((n) => {
      methodOptions.push(<Option key={n.value} value={n.value}>{n.description}</Option>);
    });
    return (
      <Select  value={value} style={{ width: '100%'}} onChange={this.handleSelectChange.bind({ id, $this: this })} >
        {methodOptions}
      </Select>
    );
  };

  selectJoinMethod2 = (id, value) => {
    const method = [{
        value: '1',
        description: '线上',
      }];

    const methodOptions = [];

    method.map((n) => {
      methodOptions.push(<Option key={n.value} value={n.value}>{n.description}</Option>);
    });
    return (
      <Select  value={value} style={{ width: '100%'}} onChange={this.handleSelectChange.bind({ id, $this: this })} >
        {methodOptions}
      </Select>
    );
  };

  selectJoinMethod3 = (id, value) => {
    const method = [{
        value: '1',
        description: '线上',
      }, {
        value: '2',
        description: '线下',
      }];

    const methodOptions = [];

    method.map((n) => {
      methodOptions.push(<Option key={n.value} value={n.value}>{n.description}</Option>);
    });
    return (
      <Select  value={value} style={{ width: '100%'}} onChange={this.handleSelectChange.bind({ id, $this: this })} >
        {methodOptions}
      </Select>
    );
  };

  typeConfig = {
    success: {
      icon: 'check-circle-o',
      color: '#d1b97f',
    },
    error: {
      icon: 'close-circle-o',
      color: '#FF6C6C',
    },
    waring: {
      icon: 'exclamation-circle-o',
      color: '#F8D11C',
    },
    info: {
      icon: 'info-circle',
      color: '#d1b97f',
    },
    complete: {
      icon: 'info-circle',
      color: '#d1b97f',
    },
  }

  render() {
    const {
      loading,
      visible,
      active,
      dataList,
      errorItem,
      formData,
      tipVisible,
      confirmLoading,
      tipModalConfig,
    } = this.state;
    const {
      form,
      rowData,
      disabled,
      appliedDesc,
    } = this.props;
    const {
      getFieldDecorator,
      getFieldValue,
    } = form;

    const user = JSON.parse(localStorage.user);
    const FormItem = Form.Item;

    const formItemLayout = {
      labelCol: {
        xs: { span: 22 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
      },
    };

    const inputName = {
      name: '姓名',
      phoneNumber: '电话',
      mailAddress: '邮箱',
      position: '职位',
      company: '公司',
      joinMethod: '参与方式',
    };

    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      const borderBottom = ((index + 1) === keys.length) ? { borderBottom: 'initial', marginBottom: 'initial' } : {};
      return (
        <div key={`a${index}`} className={style.module} style={borderBottom}>
          <span className={style.mark}>·</span>
          <Button className={`${style.delete} ${style.blank} ${style.btn}`} onClick={() => this.handleRemoveFormItems(k)}>删除本条</Button>
          <FormItem
            {...formItemLayout}
            label={inputName.name}
            key={`name-${k}`}
            className={`${style['form-item-require']}`}
            validateStatus={index === 0 && !isEmpty(dataList) && dataList[0].userId === user.userId ? '' : (errorItem[`name-${k}`] ? errorItem[`name-${k}`].validateStatus : '')}
            help={index === 0 && !isEmpty(dataList) && dataList[0].userId === user.userId ? '' : (errorItem[`name-${k}`] ? errorItem[`name-${k}`].message : '')}
          >
            {index === 0 && !isEmpty(dataList) && dataList[0].userId === user.userId ? '' :
            <Input
              id={`name-${k}`}
              onChange={this.handleValidate}
              value={formData && formData[`name-${k}`] ? formData[`name-${k}`] : ''}
            />}
            {index === 0 && !isEmpty(dataList) && dataList[0].userId === user.userId ? <font style={{fontSize:'16px'}}>{user.userName}</font> : ''}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={inputName.phoneNumber}
            key={`phoneNumber-${k}`}
            className={`${style['form-item-require']}`}
            validateStatus={index === 0 && !isEmpty(dataList) && dataList[0].userId === user.userId ? '' : (errorItem[`phoneNumber-${k}`] ? errorItem[`phoneNumber-${k}`].validateStatus : '')}
            help={index === 0 && !isEmpty(dataList) && dataList[0].userId === user.userId ? '' : (errorItem[`phoneNumber-${k}`] ? errorItem[`phoneNumber-${k}`].message : '')}
          >
            {index === 0 && !isEmpty(dataList) && dataList[0].userId === user.userId ? '' :
            <Input
              id={`phoneNumber-${k}`}
              onChange={this.handleValidate}
              value={formData && formData[`phoneNumber-${k}`] ? formData[`phoneNumber-${k}`] : ''}
              addonBefore={this.selectPhoneTypeBefore(`prefix-${k}`, formData && formData[`prefix-${k}`] ? formData[`prefix-${k}`] : '86')}
            />
            }
            {index === 0 && !isEmpty(dataList) && dataList[0].userId === user.userId ? <font style={{fontSize:'16px'}}>{user.phone}</font> : ''}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={inputName.mailAddress}
            key={`mailAddress-${k}`}
            className={`${style['form-item-require']}`}
            validateStatus={(errorItem[`mailAddress-${k}`] ? errorItem[`mailAddress-${k}`].validateStatus : '')}
            help={(errorItem[`mailAddress-${k}`] ? errorItem[`mailAddress-${k}`].message : '')}
          >
            {
              <Input
                id={`mailAddress-${k}`}
                onChange={this.handleValidate}
                value={formData && formData[`mailAddress-${k}`] ? formData[`mailAddress-${k}`] : ''}
              />
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={inputName.position}
            key={`position-${k}`}
            className={`${style['form-item-require']}`}
            validateStatus={(errorItem[`position-${k}`] ? errorItem[`position-${k}`].validateStatus : '')}
            help={(errorItem[`position-${k}`] ? errorItem[`position-${k}`].message : '')}
          >
            {
              <Input
                id={`position-${k}`}
                onChange={this.handleValidate}
                value={formData && formData[`position-${k}`] ? formData[`position-${k}`] : ''}
              />
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={inputName.company}
            key={`company-${k}`}
            className={`${style['form-item-require']}`}
            validateStatus={(errorItem[`company-${k}`] ? errorItem[`company-${k}`].validateStatus : '')}
            help={(errorItem[`company-${k}`] ? errorItem[`company-${k}`].message : '')}
          >
            {
              <Input
                id={`company-${k}`}
                onChange={this.handleValidate}
                value={formData && formData[`company-${k}`] ? formData[`company-${k}`] : ''}
              />
            }
          </FormItem>

          {
            this.props.rowData.trainingMethod === "LINE" &&
            <FormItem
              {...formItemLayout}
              label={inputName.joinMethod}
              key={`joinMethod-${k}`}
              className={`${style['form-item-require']}`}
              validateStatus={(errorItem[`joinMethod-${k}`] ? errorItem[`joinMethod-${k}`].validateStatus : '')}
              help={(errorItem[`joinMethod-${k}`] ? errorItem[`joinMethod-${k}`].message : '')}
            >
              {
                this.selectJoinMethod(`joinMethod-${k}`, formData && formData[`joinMethod-${k}`] ? formData[`joinMethod-${k}`] : '2')

              }
            </FormItem>
          }
          {
            this.props.rowData.trainingMethod === "ONLINE" &&
            <FormItem
              {...formItemLayout}
              label={inputName.joinMethod}
              key={`joinMethod-${k}`}
              className={`${style['form-item-require']}`}
              validateStatus={(errorItem[`joinMethod-${k}`] ? errorItem[`joinMethod-${k}`].validateStatus : '')}
              help={(errorItem[`joinMethod-${k}`] ? errorItem[`joinMethod-${k}`].message : '')}
            >
              {
                this.selectJoinMethod2(`joinMethod-${k}`, formData && formData[`joinMethod-${k}`] ? formData[`joinMethod-${k}`] : '1')

              }
            </FormItem>
          }
          {
            this.props.rowData.trainingMethod === "ALLLINE" &&
            <FormItem
              {...formItemLayout}
              label={inputName.joinMethod}
              key={`joinMethod-${k}`}
              className={`${style['form-item-require']}`}
              validateStatus={(errorItem[`joinMethod-${k}`] ? errorItem[`joinMethod-${k}`].validateStatus : '')}
              help={(errorItem[`joinMethod-${k}`] ? errorItem[`joinMethod-${k}`].message : '')}
            >
              {
                this.selectJoinMethod3(`joinMethod-${k}`, formData && formData[`joinMethod-${k}`] ? formData[`joinMethod-${k}`] : '')

              }
            </FormItem>
          }
        </div>
      );
    });

    let enrollButton;
    if (this.props.rowData.enrollFlag === 'P') {
      enrollButton = (
        <Button className={`${style.blank} ${style.btn} ${style.apply}`} disabled={!active} onClick={this.handleCompleteOrder} size="large">
          待支付
        </Button>
      );
    } else {
      enrollButton = (
        <Button className={`${style.blank} ${style.btn} ${style.apply}`} disabled={!active} onClick={this.handleShowModal} size="large">
          {active ? appliedDesc : '已报名'}
        </Button>
      );
    }

    return (
      <div className={style['apply-popup']}>
        {enrollButton}
        <Modal
          wrapClassName={style.classroom}
          visible={visible}
          title={null}
          onOK={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Layout
            className={`${style['apply-popup-modal']} ${style.container} ${style['background-white']}`}
          >
            <Row>
              <a
                className={`${style['add-user']} ${style.right}`}
                onClick={this.handleAddFormItems}
              >
                <Icon type="user-add" />
                添加人员
              </a>
            </Row>
            <Content className={style.body}>
              <Row className={`${style.row} ${style.top}`}>
                <h5 className={`${style.topic} ${style.color}`}>
                  课程：{rowData.topic}
                </h5>
                <h5 className={`${style.price} ${style.color}`}>
                  费用：{ rowData.price ? rowData.price : '0.00'}
                </h5>
              </Row>
              <Row className={style.row}>
                <Form onSubmit={this.handleSubmit}>
                  {formItems}
                  <FormItem className={`${style.row} ${style['btn-container']}`}>
                    {isEmpty(dataList) ? '' : <Button type="default" className={`${style.btn} ${style.submit}`} loading={loading} htmlType="submit" size="large" >立即报名</Button>}
                  </FormItem>
                </Form>
              </Row>
            </Content>
          </Layout>
        </Modal>
        <Modal
          wrapClassName={`${style.classroom} ${style['classroom-tip-modal']}`}
          visible={tipVisible}
          title={null}
          onOK={this.handleCreateOrder}
          onCancel={this.handleHideIsPayModal}
          footer={null}
          maskClosable={false}
          closable={false}
          width={412}
        >
          <Layout>
            <Row className={style.header}>提示</Row>
            <Content className={`${style['background-white']}`}>
              <Row className={style.icon}>
                <Icon style={{ color: `${this.typeConfig[tipModalConfig.status].color}`, fontSize: 110 }} type={`${this.typeConfig[tipModalConfig.status].icon}`} />
              </Row>
              <Row className={style.content}>{tipModalConfig.content}</Row>
              <Row className={style.footer}>
                {tipModalConfig.success && !tipModalConfig.isPay ? '' : <Button className={`${style.btn} ${style.blank}`} onClick={this.handleHideTipModal} style={{ width: 140, height: 40, marginRight: '10%' }}>取消</Button>}
                {tipModalConfig.status === 'complete' ?
                  <Button className={`${style.btn}`} onClick={this.handleTipModalComplete} loading={confirmLoading} style={{ width: 140, height: 40 }}>完成支付</Button>
                  : <Button className={`${style.btn}`} onClick={this.handleTipModalAction} loading={confirmLoading} style={{ width: 140, height: 40 }}>{tipModalConfig.isPay ? '去支付' : '知道了'}</Button>
                }
              </Row>
            </Content>
          </Layout>
        </Modal>
      </div>
    );
  }
}

ApplyPopupComponent.propTypes = {
  disabled: PropTypes.bool,
  appliedDesc: PropTypes.string,
  getStudentsList: PropTypes.func,
  fetchData: PropTypes.func,
};

ApplyPopupComponent.defaultProps = {
  disabled: false,
  appliedDesc: '报名',
  getStudentsList: () => {},
  fetchData: () => {},
};

const ApplyPopup = Form.create()(ApplyPopupComponent);

export default ApplyPopup;
