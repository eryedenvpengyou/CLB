/**
 * Created by FengWanJun on 2017/7/6.
 */

import React from 'react';
import { Row, Col, Button, Select, Form, DatePicker, Input } from 'antd';
import { productionDetail } from '../../services/production';
import { getCode } from '../../services/code';
import commonStyles from '../../styles/common.css';
import styles from '../../styles/production.css';
import Lov from "../common/Lov";
import TipModal from "../common/modal/Modal";
import { NumberInput } from "../../components/common/Input";
import moment from "moment";

class ProductionSubscribeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
  componentWillMount() {
    const detailBody = {
      itemId: this.props.itemId
    };
    productionDetail(detailBody).then((detailData) => {
      if (detailData.success) {
        this.setState({
          productDetail: detailData.rows[0]
        });
      } else {
        TipModal.error({content:detailData.message});
        return;
      }
    });
    //获取快码值
    var body = {
      phoneCodeList: "PUB.PHONE_CODE",
    };
    getCode(body).then((data)=>{
      this.setState({
        codeList: data
      });
    });
  }
  handleChangeSubline(value) {
    //子产品
    this.state.productDetail.prdItemSublineList.map((data) => {
      if (value == data.sublineId) {
        this.props.form.setFieldsValue({price: data.price});
      }
    });
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
        <Form.Item label="开户银行" {...formItemLayout}>
          {getFieldDecorator('blank', {
            rules: [{
              required: true,
              message: '请选择开户银行',
              whitespace: true,
            }],
          })(
            <Select onChange={this.handleChangeSubline.bind(this)}>
              {itemSublineNameOptions}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="价格" {...formItemLayout}>
          {getFieldDecorator('price', {
            initialValue: "0.00",
          })(
            <Input addonBefore={<span style={{fontSize:'15px'}}>￥</span>} style={{width:'100%'}} disabled />
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
            <DatePicker showTime disabledDate={this.disabledStartDate.bind(this)} format="YYYY/MM/DD HH:mm" style={{width:"100%"}} />
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
            <NumberInput />
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
          <Row>1、请至少提前两个工作日进行预约，且在预约同时提交港澳通行证资料照片。</Row>
          <Row>2、请按预约时间准时到达，迟到可能会导致开户不成功。</Row>
          <Row>3、请勿在同一时间预约多人开户。</Row>
          <Row>4、开户审批结果以银行最终决定为准。</Row>
        </Col>
      </Row>
    )
  }
}

export default (ProductionSubscribeComponent);
