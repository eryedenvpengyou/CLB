/**
 * Created by FengWanJun on 2017/6/17.
 */

import React from 'react';
import { Row, Col, Button, Select, Form, DatePicker, Input } from 'antd';
import { productionDetail } from '../../services/production';
import { getCode } from '../../services/code';
import commonStyles from '../../styles/common.css';
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
        genderList: [],
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
    this.props.onConfirm([]);
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
      genderList: 'HR.EMPLOYEE_GENDER',
      phoneCodeList: "PUB.PHONE_CODE",
    };
    getCode(body).then((data)=>{
      this.setState({
        codeList: data
      });
    });
  }
  //选择框值改变
  handleChangeTimes(value) {
    //times
    if(value == '1') {
      document.getElementById("displayDiv_times").style.display = 'block';
    } else {
      document.getElementById("displayDiv_times").style.display = 'none';
    }
  }
  handleChangeCustomerName(value) {
    //customerName
    if(value == 'one') {
      document.getElementById("displayDiv_customerName").style.display = 'block';
      this.props.form.setFieldsValue({
        vaccineCustomerName: null,
        vaccineCustomerAge: null,
        vaccineCustomerSex: null,
        customerPhone: null,
      });
    } else if(value == 'two') {
      const record = this.props.form.getFieldValue("applicantCustomer").record;
      record.age = null;
      if (record.birthDate) {
        record.age = new Date().getFullYear()-new Date(record.birthDate).getFullYear()+1;
      }
      this.props.form.setFieldsValue({
        vaccineCustomerName: record.chineseName,
        vaccineCustomerAge: record.age,
        vaccineCustomerSex: record.sex,
        customerPhone: record.phone,
      });
      document.getElementById("displayDiv_customerName").style.display = 'none';
    }
  }
  handleChangeSubline(value) {
    //疫苗类型
    this.state.productDetail.prdItemSublineList.map((data) => {
      if (value == data.sublineId) {
        this.props.form.setFieldsValue({price: data.price+"（需现场支付）"});
      }
    });
  }
  itemChangeApplicantCustomer(value) {
    //客户（投保人）
    if (value && value.value && value.meaning && value.record) {
      if (this.props.form.getFieldValue("customerName") == "two") {
        value.record.age = null;
        if (value.record.birthDate) {
          value.record.age = new Date().getFullYear()-new Date(value.record.birthDate).getFullYear()+1;
        }
        this.props.form.setFieldsValue({
          vaccineCustomerName: value.record.chineseName,
          vaccineCustomerAge: value.record.age,
          vaccineCustomerSex: value.record.sex,
          customerPhone: value.record.phone,
        });
      }
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    //根据快码值生成下拉列表
    const genderOptions = this.state.codeList.genderList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
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
            initialValue: {value:'',meaning:''},
          })(
            <Lov placeholder="请选择客户（投保人）" itemChange={this.itemChangeApplicantCustomer.bind(this)} lovCode='ORD_CUSTOMER' width="100%" />
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
        <Form.Item label="疫苗注射客户姓名" {...formItemLayout}>
          {getFieldDecorator('customerName', {
            initialValue: "two",
            rules: [{
              required: true,
              message: '请选择疫苗注射客户姓名',
              whitespace: true,
            }],
          })(
            <Select onChange={this.handleChangeCustomerName.bind(this)}>
              <Select.Option value="one">与投保人不同</Select.Option>
              <Select.Option value="two">同投保人</Select.Option>
            </Select>
          )}
        </Form.Item>
        <div id="displayDiv_customerName" style={{display:"none"}}>
          <Form.Item wrapperCol={{xs:{span:7,offset:10},sm:{span:7,offset:9},}}>
            {getFieldDecorator('vaccineCustomerName', {
              rules: [{
                required: true,
                message: '请输入客户姓名',
                whitespace: true,
              }],
            })(
              <Input placeholder="请输入客户姓名" />
            )}
          </Form.Item>
        </div>
        <Form.Item label="年龄" {...formItemLayout}>
          {getFieldDecorator('vaccineCustomerAge', {
            rules: [{
              required: true,
              message: '请输入年龄',
              whitespace: true,
            }],
          })(
            <NumberInput style={{width:'100%'}} addonAfter={"岁"} />
          )}
        </Form.Item>
        <Form.Item label="性别" {...formItemLayout}>
          {getFieldDecorator('vaccineCustomerSex', {
            rules: [{
              required: true,
              message: '请选择性别',
              whitespace: true,
            }],
          })(
            <Select>
              {genderOptions}
            </Select>
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
        <Form.Item label="通行证号码" {...formItemLayout}>
          {getFieldDecorator('vaccineCustomerPass', {
            rules: [{
              required: true,
              message: '请输入通行证号码',
              whitespace: true,
            }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="第几次注射HPV疫苗" {...formItemLayout}>
          {getFieldDecorator('vaccineCustomerTimes', {
            initialValue: "1",
            rules: [{
              required: true,
              message: '请选择第几次注射HPV疫苗',
              whitespace: true,
            }],
          })(
            <Select onChange={this.handleChangeTimes.bind(this)}>
              <Select.Option value="1">1次</Select.Option>
              <Select.Option value="2">2次</Select.Option>
              <Select.Option value="3">3次</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="疫苗种类" {...formItemLayout}>
          {getFieldDecorator('sublineId', {
            rules: [{
              required: true,
              message: '请选择疫苗种类',
              whitespace: true,
            }],
          })(
            <Select onChange={this.handleChangeSubline.bind(this)}>
              {itemSublineNameOptions}
            </Select>
          )}
        </Form.Item>
        <div id="displayDiv_times">
          <Form.Item label="价格" {...formItemLayout}>
            {getFieldDecorator('price', {
              initialValue: "0.00",
            })(
              <Input addonBefore={<span style={{fontSize:'15px'}}>￥</span>} style={{width:'100%'}} disabled />
            )}
          </Form.Item>
        </div>
        <Form.Item label="给客户的报价" {...formItemLayout}>
          {getFieldDecorator('customerPrice', {
            rules: [{
              required: true,
              message: '请输入给客户的报价',
              whitespace: true,
            }],
          })(
            <Input addonBefore={<span style={{fontSize:'15px'}}>￥</span>} style={{width:'100%'}} />
          )}
        </Form.Item>
        <Form.Item label="预约疫苗注射时间" {...formItemLayout}>
          {getFieldDecorator('reserveDate', {
            rules: [{
              required: true,
              message: '请选择预约疫苗注射时间',
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
      </Row>
    )
  }
}

export default (ProductionSubscribeComponent);
