/**
 * Created by FengWanJun on 2017/6/17.
 */

import React from 'react';
import { Row, Col, Button, Select, Form, InputNumber, DatePicker, Input } from 'antd';
import commonStyles from '../../styles/common.css';
import Lov from "../common/Lov";
import TipModal from "../common/modal/Modal";
import { productionDetail } from '../../services/production';
import { getCode } from '../../services/code';
import { NumberInput } from "../../components/common/Input";
import styles from "../../styles/production.css";
import moment from "moment";

class ProductionSubscribeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productDetail: {
        //子产品
        prdItemSublineList: [],
      },
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
  disabledEndDate(endValue) {
    const startValue = this.props.form.getFieldValue("checkinDate");
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() >= endValue.valueOf();
  }
  handleChangeDate(value) {
    if (value) {
      document.getElementsByClassName("ant-calendar-picker-input ant-input ant-input-lg")[1].disabled = false;
      var date = new Date(value);
      this.props.form.setFieldsValue({checkoutDate:moment(date.getFullYear()+"/"+(date.getMonth()+1)+"/"+(date.getDate()+1),"YYYY/MM/DD")});
    }
  }
  componentDidMount() {
    document.getElementsByClassName("ant-calendar-picker-input ant-input ant-input-lg")[1].disabled = true;
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
    const customerPhoneCode = (
      getFieldDecorator('customerPhoneCode', {
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
        <Form.Item label="入住客户姓名" {...formItemLayout}>
          {getFieldDecorator('lodgerName', {
            rules: [{
              required: true,
              message: '请输入入住客户姓名',
              whitespace: true
            }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="入住客户拼音姓名" {...formItemLayout}>
          {getFieldDecorator('lodgerPinyin', {
            rules: [{
              required: true,
              message: '请输入入住客户拼音姓名',
              whitespace: true,
            }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="联系电话" {...formItemLayout}>
          {getFieldDecorator('customerPhone', {
            rules: [{
              required: true,
              message: '请输入联系电话',
              whitespace: true,
            }],
          })(
            <NumberInput addonBefore={customerPhoneCode} style={{width:'100%'}} />
          )}
        </Form.Item>
        <Form.Item label="酒店所在区域" {...formItemLayout}>
          {getFieldDecorator('sublineId', {
            rules: [{
              required: true,
              message: '请选择酒店所在区域',
              whitespace: true
            }],
          })(
            <Select>
              {itemSublineNameOptions}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="价格区间（每晚）" {...formItemLayout}>
          {getFieldDecorator('priceInterval', {
            rules: [{
              required: true,
              message: '请选择价格区间（每晚）',
              whitespace: true
            }],
          })(
            <Select>
              <Select.Option value="300元以下"> 300元以下</Select.Option>
              <Select.Option value="300-600元"> 300-600元</Select.Option>
              <Select.Option value="600-1000元"> 600-1000元</Select.Option>
              <Select.Option value="1000元以上"> 1000元以上</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="入住人数" {...formItemLayout}>
          {getFieldDecorator('peopleCount', {
            rules: [{
              required: true,
              message: '请输入入住人数',
              whitespace: true,
            }],
          })(
            <Input style={{width:'100%'}} addonAfter={"人"} />
          )}
        </Form.Item>
        <Form.Item label="入住日期" {...formItemLayout}>
          {getFieldDecorator('checkinDate', {
            rules: [{
              required: true,
              message: '请选择入住日期',
              whitespace: true,
              type: 'object',
            }],
          })(
            <DatePicker format="YYYY/MM/DD" onChange={this.handleChangeDate.bind(this)} disabledDate={this.disabledStartDate.bind(this)} style={{width:"100%"}} />
          )}
        </Form.Item>
        <Form.Item label="退房日期" {...formItemLayout}>
          {getFieldDecorator('checkoutDate', {
            rules: [{
              required: true,
              message: '请选择退房日期',
              whitespace: true,
              type: 'object',
            }],
          })(
            <DatePicker format="YYYY/MM/DD" disabledDate={this.disabledEndDate.bind(this)} style={{width:"100%"}} />
          )}
        </Form.Item>
        <Form.Item label="房间数" {...formItemLayout}>
          {getFieldDecorator('roomCount', {
            rules: [{
              required: true,
              message: '请输入房间数',
              whitespace: true,
              type: 'number',
            }],
          })(
            <InputNumber style={{width:"100%"}} />
          )}
        </Form.Item>
        <Form.Item label="房型" {...formItemLayout}>
          {getFieldDecorator('roomType', {
            rules: [{
              required: true,
              message: '请输入房型',
              whitespace: true,
            }],
          })(
            <Input placeholder="如：大床房、标准房" />
          )}
        </Form.Item>
        <Form.Item label="指定酒店名称或地段" {...formItemLayout}>
          {getFieldDecorator('hotelName', {})(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="预约对接人" {...formItemLayout}>
          {getFieldDecorator('reserveContactPerson', {
            rules: [{
              required: true,
              message: '请输入预约对接人',
              whitespace: true,
            }],
            initialValue: JSON.parse(localStorage.user).userName
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="对接人电话" {...formItemLayout}>
          {getFieldDecorator('reserveContactPhone', {
            rules: [{
              required: true,
              message: '请输入对接人电话',
              whitespace: true,
            }],
            initialValue: JSON.parse(localStorage.user).phone
          })(
            <NumberInput addonBefore={reserveContactPhoneCode} style={{width:'100%'}} />
          )}
        </Form.Item>
        <Form.Item label="备注" {...formItemLayout}>
          {getFieldDecorator('reserveComment', {})(
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
          <Row>1、请填写详细客房需求（例：双床房2间/大床房1间）。</Row>
          <Row>2、香港酒店价格在不同日期价格波动极大，客户服务部会提供即时报价。</Row>
        </Col>
      </Row>
    )
  }
}

export default (ProductionSubscribeComponent);
