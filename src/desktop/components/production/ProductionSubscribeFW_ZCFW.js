/**
 * Created by FengWanJun on 2017/6/17.
 */

import React from 'react';
import { Row, Col, Button, Icon, Table, Select, Form, InputNumber, DatePicker, Input, Upload, Popconfirm, Modal } from 'antd';
import { getCode } from '../../services/code';
import { productionDetail } from '../../services/production';
import Lov from "../common/Lov";
import TipModal from "../common/modal/Modal";
import commonStyles from '../../styles/common.css';
import { NumberInput } from "../../components/common/Input";
import styles from "../../styles/production.css";
import moment from "moment";

class ProductionSubscribeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priceFlag: true,
      productDetail: {
        //子产品
        prdItemSublineList: [],
      },
      //快码值
      codeList: {
        phoneCodeList: [],
      }
    };
  }
  componentWillMount() {
    const detailBody = {
      itemId: this.props.itemId
    };
    productionDetail(detailBody).then((detailData) => {
      if (detailData.success) {
        this.setState({
          productDetail: detailData.rows[0]
        });
        const codeBody = {
          phoneCodeList: "PUB.PHONE_CODE",
        }
        getCode(codeBody).then((data) => {
          this.setState({
            codeList: data
          });
        })
      } else {
        TipModal.error({content:detailData.message});
        return;
      }
    });
  }
  //页面返回
  goBack() {
    this.props.onCancel();
  }
  //确认预约
  handleSubmit(e) {
    this.props.onConfirm();
  }
  handleChangeSubline(value) {
    //预约路线
    if (value) {
      this.state.productDetail.prdItemSublineList.map((data) => {
        if (data.sublineId == value) {
          if (isNaN(data.price)) {
            this.setState({priceFlag: false});
          } else {
            this.setState({priceFlag: true});
          }
          this.props.form.setFieldsValue({price:data.price});
        }
      });
    } else {
      this.setState({priceFlag: true});
      this.props.form.setFieldsValue({price:"0.00"});
    }
  }
  //不可选日期
  disabledStartDate(current) {
    if (current) {
      var date = new Date();
      current = new Date(current);
      date = moment(date.getFullYear()+"/"+(date.getMonth()+1)+"/"+(date.getDate()),"YYYY/MM/DD");
      current = moment(current.getFullYear()+"/"+(current.getMonth()+1)+"/"+(current.getDate()),"YYYY/MM/DD")
      return date.valueOf() > current.valueOf();
    } else {
      return false;
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    //子产品
    const itemSublineNameOptions = [];
    this.state.productDetail.prdItemSublineList.map((data) => {
      let result;
      result = <Select.Option key={data.sublineId}>{data.sublineItemName}</Select.Option>;
      itemSublineNameOptions.push(result);
    });
    const phoneCodeOptions = this.state.codeList.phoneCodeList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>;
    });
    const reserveContactPhoneCode = (
      getFieldDecorator('reserveContactPhoneCode', {
        initialValue:  JSON.parse(localStorage.user).phoneCode||"86",
      })(
        <Select style={{ width: 110 }}>
          {phoneCodeOptions}
        </Select>
      )
    );
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 7 },
    };
    return (
      <Row style={{paddingTop: '28px'}}>
        <Form.Item label="客户（投保人）" {...formItemLayout}>
          {getFieldDecorator('applicantCustomer', {
            rules: [{
              required: true,
              validator: (rule,value,callback) => {
                if (value && (!value.value || !value.meaning)) {
                  callback('请选择客户（投保人）');
                } else {
                  callback();
                }
              }
            }],
            initialValue: {value: '', meaning: ''},
          })(
            <Lov placeholder="请选择客户（投保人）" lovCode='ORD_CUSTOMER' width="100%" />
          )}
        </Form.Item>
        <Form.Item label="保单订单编号" {...formItemLayout}>
          {getFieldDecorator('orderNumber', {
            initialValue: {value: '', meaning: ''},
          })(
            <Lov placeholder="请选择保单订单编号" lovCode='ORD_ORDERDETAIL' width="100%" />
          )}
        </Form.Item>
        <Col xs={7} sm={7} md={7} lg={7} xl={7} offset={9} style={{fontSize:"12px",color:"#d2d2d2",top:"-20px"}}>
          如果客户当天同时预约了赴港签单，请输入订单编号，方便工作人员合理安排行程。
        </Col>
        <Form.Item label="预约路线" {...formItemLayout}>
          {getFieldDecorator('sublineId', {
            rules: [{
              required: true,
              message: '请选择预约路线',
              whitespace: true
            }],
          })(
            <Select onChange={this.handleChangeSubline.bind(this)}>
              {itemSublineNameOptions}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="预计价格" {...formItemLayout}>
          {getFieldDecorator('price', {
            initialValue: "0.00",
          })(
            this.state.priceFlag ?
              <Input addonBefore={<span style={{fontSize:'15px'}}>￥</span>} style={{width:'100%'}} disabled />
              :
              <Input disabled />
          )}
        </Form.Item>
        <Form.Item label="预约时间" {...formItemLayout}>
          {getFieldDecorator('reserveDate', {
            rules: [{
              required: true,
              message: '请选择预约时间',
              whitespace: true,
              type: 'object',
            }],
          })(
            <DatePicker disabledDate={this.disabledStartDate.bind(this)} showTime format="YYYY/MM/DD HH:mm" style={{width:"100%"}} />
          )}
        </Form.Item>
        <Form.Item label="出发地" {...formItemLayout}>
          {getFieldDecorator('departure', {
            rules: [{
              required: true,
              message: '请输入出发地',
              whitespace: true,
            }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="目的地" {...formItemLayout}>
          {getFieldDecorator('destination', {
            rules: [{
              required: true,
              message: '请输入目的地',
              whitespace: true,
            }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="乘车总人数" {...formItemLayout}>
          {getFieldDecorator('peopleCount', {
            rules: [{
              required: true,
              message: '请输入乘车总人数',
              whitespace: true,
              type: 'number',
            }],
          })(
            <InputNumber style={{width:"100%"}} />
          )}
        </Form.Item>
        <Form.Item label="乘车联系人" {...formItemLayout}>
          {getFieldDecorator('reserveContactPerson', {
            rules: [{
              required: true,
              message: '请输入乘车联系人',
              whitespace: true,
            }],
            initialValue: JSON.parse(localStorage.user).userName
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="乘车联系人电话" {...formItemLayout}>
          {getFieldDecorator('reserveContactPhone', {
            rules: [{
              required: true,
              message: '请输入乘车联系人电话',
              whitespace: true,
            }],
            initialValue: JSON.parse(localStorage.user).phone
          })(
            <NumberInput addonBefore={reserveContactPhoneCode} style={{width:'100%'}} />
          )}
        </Form.Item>
        <Form.Item label="备注" {...formItemLayout}>
          {getFieldDecorator('comment', {})(
            <textarea placeholder="可为空" style={{width:"100%",padding:"0 5px"}} />
          )}
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 7, offset: 9 },
            sm: { span: 7, offset: 9 },
          }}
        >
          <Button type="primary" className={commonStyles.btnPrimary} onClick={this.handleSubmit.bind(this)}>确认预约</Button>
          <Button type="default" className={commonStyles.btnDefault} onClick={this.goBack.bind(this)} style={{float:'right'}}>取消</Button>
        </Form.Item>
        <Col xs={22} sm={22} md={22} lg={22} xl={22} offset={1} className={styles.productSubscribeReminder} style={{paddingTop:"28px"}}>
          温馨提示：
          <Row>1、本服务为收费服务，若客户购买任何保险产品，单张保单年缴保费≥10万美金或趸交保费≥50万美金，我司免费提供以上两次专车服务，超出两次专车接送另行收费。同一投保人两张及以上保单累计达以上金额不享受该免费服务。申请免费服务请务必在备注栏填写投保信息。</Row>
          <Row>2、如已享受以上专车服务的客户因各种原因未能投保成功及退保，我司将会补收该费用。</Row>
          <Row>3、所有增值服务以预约时信息为准，由于无预约、信息错误等产生的费用由客户承担，且过后不可以补办和报销。</Row>
          <Row>4、接送机自机场公布的航班到达时间接计，免费等60分钟，关口/酒店/码头等地点免费等30分钟，超出时间收费200-300/小时。</Row>
          <Row>5、节假日价格会有涨幅。</Row>
        </Col>
      </Row>
    )
  }
}

export default (ProductionSubscribeComponent);
