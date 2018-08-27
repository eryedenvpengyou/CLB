/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Input, InputNumber, Select, Cascader, Col, Row } from 'antd';
import { getCode } from '../../services/code';
import TipModal from '../common/modal/Modal';
import commonStyles from '../../styles/common.css';

class ProductionCompareModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      visible: false,
      compareList: {
        number: 0,
        item1: {},
        item2: {},
        item3: {},
      },
      //快码值
      codeList: {
        genderList: [],
        payMethodList: [],
        currencyList: [],
        yesOrNo: [],
        nationList: [],
      }
    };
  }
  showModal() {
    if (this.props.compareList.number < 2) {
      TipModal.error({content:'请选择2-3个产品！'});
      return;
    }
    //获取快码值
    var body = {
      genderList: 'HR.EMPLOYEE_GENDER',
      payMethodList: 'CMN.PAY_METHOD',
      currencyList: 'PUB.CURRENCY',
      yesOrNo: 'SYS.YES_NO',
      nationList: 'PUB.NATION',
    };
    getCode(body).then((data)=>{
      this.setState({
        codeList: data
      });
    });
    this.props.form.resetFields();
    this.setState({
      visible: true,
      compareList: this.props.compareList,
    });
  };
  handleOk() {
    this.setState({ loading: true });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        this.setState({ loading: false, visible: true });
        return;
      } else {
        var compareInfo = {};
        compareInfo.minClass = this.state.compareList.minClass;
        compareInfo.itemList = [];
        if (compareInfo.minClass == 'GD') {
          for (var i=1; i<4; i++) {
            if (this.state.compareList["item"+i] && this.state.compareList["item"+i].prdItemSublineList) {
              compareInfo.itemList.push({
                key: i,
                itemId: this.state.compareList["item"+i].itemId,
                age: values.age,
                gender: values.gender,
                smokeFlag: values.smokeFlag,
                currency: values.currency,
                productionAgeLimit: values.productionAgeLimit,
                livingCity: values.livingCity,
                securityLevel: values['securityPlan_'+i]?values['securityPlan_'+i][0]:null,
                securityArea: values['securityPlan_'+i]?values['securityPlan_'+i][1]:null,
                selyPay: values['selyPay_'+i],
              });
            }
          }
        } else {
          for (var i=1; i<4; i++) {
            if (this.state.compareList["item"+i] && this.state.compareList["item"+i].prdItemSublineList) {
              compareInfo.itemList.push({
                key: i,
                itemId: this.state.compareList["item"+i].itemId,
                age: values.age,
                gender: values.gender,
                smokeFlag: values.smokeFlag,
                coverage: values.coverage,
                currency: values.currency,
                productionAgeLimit: values['productionAgeLimit_'+i],
                paymentMethod: values['paymentMethod_'+i],
              });
            }
          }
        }
        localStorage.compareInfo = JSON.stringify(compareInfo);
        location.hash = '/production/compare';
        this.setState({ loading: false, visible: false });
      }
    });
  };
  handleCancel() {
    this.props.form.resetFields();
    this.setState({ visible: false });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const compareList = this.state.compareList;
    //缴费年期
    var agePremiumOptions = [];
    //缴费方式
    var payMethodOptions = [];
    //币种
    var currencyList = [];
    //保障级别/地区
    var securityPlanOptions = [];
    //自付选项
    var selfpayOptions = [];
    for (var i=1; i<4; i++) {
      if (compareList["item"+i] && compareList["item"+i].prdItemSublineList) {
        agePremiumOptions[i] = [];
        payMethodOptions[i] = [];
        securityPlanOptions[i] = [];
        selfpayOptions[i] = [];
        //子产品
        compareList["item"+i].prdItemSublineList.map((item) => {
          //缴费年期
          if (item.enabledFlag != "N") {
            agePremiumOptions[i].push(<Select.Option key={item.sublineItemName}>{item.sublineItemName}</Select.Option>);
          }
        });
        //缴费方式
        if (compareList["item"+i].fullyear == "Y") {
          payMethodOptions[i].push(<Select.Option key="WP">整付</Select.Option>);
        }
        if (compareList["item"+i].oneyear == "Y") {
          payMethodOptions[i].push(<Select.Option key="AP">年缴</Select.Option>);
        }
        if (compareList["item"+i].halfyear == "Y") {
          payMethodOptions[i].push(<Select.Option key="SAP">半年缴</Select.Option>);
        }
        if (compareList["item"+i].quarter == "Y") {
          payMethodOptions[i].push(<Select.Option key="QP">季缴</Select.Option>);
        }
        if (compareList["item"+i].onemonth == "Y") {
          payMethodOptions[i].push(<Select.Option key="MP">月缴</Select.Option>);
        }
        if (compareList["item"+i].prepayFlag == "Y") {
          payMethodOptions[i].push(<Select.Option key="FJ">预缴</Select.Option>);
        }
        //币种
        compareList["item"+i].prdItemPaymode.map((item) => {
          var currency = {};
          this.state.codeList.currencyList.map((code) => {
            if (item.currencyCode == code.value && item.enabledFlag != "N") {
              var flag = true;
              for(var j=0; j<currencyList.length; j++) {
                if (currencyList[j].value == code.value) {
                  flag = false;
                  break;
                }
              }
              if (flag) {
                currency.value = code.value;
                currency.meaning = code.meaning;
                currencyList.push(currency);
              }
            }
          });
        });
        //保障级别/地区
        compareList["item"+i].prdItemSecurityPlan.map((item) => {
          if (item.enabledFlag != "N") {
            var flag = true;
            for(var j=0; j<securityPlanOptions[i].length; j++) {
              if (securityPlanOptions[i][j].value == item.securityLevel) {
                flag = false;
                break;
              }
            }
            if (flag) {
              var result = {
                value: item.securityLevel,
                label: item.securityLevel,
                children: []
              };
              compareList["item"+i].prdItemSecurityPlan.map((item2) => {
                if (item.securityLevel == item2.securityLevel && item2.enabledFlag != "N") {
                  result.children.push({
                    value: item2.securityRegion,
                    label: item2.securityRegion
                  });
                }
              });
              securityPlanOptions[i].push(result);
            }
          }
        });
        //自付选项
        compareList["item"+i].prdItemSelfpayList.map((item) => {
          if (item.enabledFlag != "N") {
            selfpayOptions[i].push(<Select.Option key={item.selfpay}>{item.selfpay}</Select.Option>);
          }
        });
      }
    }
    //根据快码值生成下拉列表
    const genderOptions = this.state.codeList.genderList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const currencyOptions = currencyList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const yesOrNoOptions = this.state.codeList.yesOrNo.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const nationOptions = this.state.codeList.nationList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    var selectCurrency = "币种";
    if (compareList.minClass != "GD" && currencyList.length > 0) {
      selectCurrency = (
        getFieldDecorator('currency', {
          initialValue: currencyList[0].value,
          rules: [{ required: true, message: '请选择币种' }],
        })(
          <Select style={{ width: 80 }}>
            {currencyOptions}
          </Select>
        )
      );
    } else {
      selectCurrency = "币种";
    }
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    const formItemLayout2 = {
      wrapperCol: { span: 24 },
    };
    return (
      <div>
        <Button type="primary" style={{width:'155px',height:'42px'}} className={commonStyles.btnPrimary} onClick={this.showModal.bind(this)}>
          开始对比
        </Button>
        <Modal maskClosable={false}
          visible={this.state.visible}
          width='693px'
          title={<h3 style={{ textAlign: 'center' }}>投保对象信息</h3>}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          footer={
            <div style={{ textAlign: 'center' }}>
              <Button type="default" size="large" onClick={this.handleCancel.bind(this)}>
                取消对比
              </Button>
              <Button type="primary" size="large" loading={this.state.loading} onClick={this.handleOk.bind(this)}>
                立即对比
              </Button>
            </div>
          }
        >
          <Form style={{margin:'10px 130px 0 130px'}}>
            <Form.Item label="年龄" {...formItemLayout}>
              {getFieldDecorator('age', {
                initialValue: 25,
                rules: [{
                  required: true,
                  message: '请输入年龄',
                  type: 'number'
                }],
              })(
                <InputNumber min={0} style={{width:"100%"}} />
              )}
            </Form.Item>
            <Form.Item label="性别" {...formItemLayout}>
              {getFieldDecorator('gender', {
                initialValue: "M",
                rules: [{ required: true, message: '请选择性别' }],
              })(
                <Select>
                  {genderOptions}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="是否吸烟" {...formItemLayout}>
              {getFieldDecorator('smokeFlag', {
                initialValue: "N",
                rules: [{ required: true, message: '请选择是否吸烟' }],
              })(
                <Select>
                  {yesOrNoOptions}
                </Select>
              )}
            </Form.Item>
            {
              compareList.minClass != "GD" ?
                <Row>
                  <span>
                    {getFieldDecorator('livingCity', {})}
                    {getFieldDecorator('productionAgeLimit', {})}
                    {
                      [0,1,2].map((data, index) => {
                        getFieldDecorator('securityPlan_'+index, {})
                        getFieldDecorator('selyPay_'+index, {})
                      })
                    }
                  </span>
                  <Form.Item label="保险总额" {...formItemLayout}>
                    {getFieldDecorator('coverage', {
                      rules: [{ required: true, message: '请输入保险总额' }],
                    })(
                      <Input style={{width:'100%'}} addonAfter={selectCurrency} />
                    )}
                  </Form.Item>
                  {
                    payMethodOptions.map((data, index) => {
                      return (
                        <Row key={index}>
                          <Col style={{fontSize:'18px',color:JSON.parse(localStorage.theme).themeColor,paddingBottom:'20px'}} span={24}>
                            {compareList['item'+index].itemName}
                          </Col>
                          <Col span={12}>
                            <Form.Item {...formItemLayout2}>
                              {getFieldDecorator('productionAgeLimit_'+index, {
                                rules: [{ required: true, message: '请选择缴费年期' }],
                              })(
                                <Select placeholder='请选择缴费年期' style={{paddingLeft:'5px'}}>
                                  {agePremiumOptions[index]}
                                </Select>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item {...formItemLayout2}>
                              {getFieldDecorator('paymentMethod_'+index, {
                                rules: [{ required: true, message: '请选择缴费方式' }],
                              })(
                                <Select placeholder='请选择缴费方式' style={{paddingLeft:'5px'}}>
                                  {data}
                                </Select>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      )
                    })
                  }
                </Row>
                :
                <Row>
                  <span>
                    {getFieldDecorator('coverage', {})}
                    {
                      [0,1,2].map((data, index) => {
                        getFieldDecorator('productionAgeLimit_'+index, {})
                        getFieldDecorator('paymentMethod_'+index, {})
                      })
                    }
                  </span>
                  <Form.Item label="居住地" {...formItemLayout}>
                    {getFieldDecorator('livingCity', {
                      rules: [{ required: true, message: '请选择居住地' }],
                    })(
                      <Select>
                        {nationOptions}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="缴费年期" {...formItemLayout}>
                    {getFieldDecorator('productionAgeLimit', {
                      initialValue: agePremiumOptions[0]?agePremiumOptions[0][0]:null,
                      rules: [{ required: true, message: '请选择缴费年期' }],
                    })(
                      <Select>
                        {agePremiumOptions[0]||agePremiumOptions[1]||agePremiumOptions[2]}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="缴费币种" {...formItemLayout}>
                    {getFieldDecorator('currency', {
                      rules: [{ required: true, message: '请选择缴费币种' }],
                    })(
                      <Select>
                        {currencyOptions}
                      </Select>
                    )}
                  </Form.Item>
                  {
                    securityPlanOptions.map((data, index) => {
                      return (
                        <Row key={index}>
                          <Col style={{fontSize:'18px',color:'#d1b97f',paddingBottom:'20px'}} span={24}>
                            {compareList['item'+index].itemName}
                          </Col>
                          <Col span={12}>
                            <Form.Item {...formItemLayout2} style={{float:'left'}}>
                              {getFieldDecorator('securityPlan_'+index, {
                                rules: [{ required: true, message: '请选择保障级别/地区',type:'array' }],
                              })(
                                <Cascader style={{paddingRight:'5px'}} expandTrigger="hover" placeholder="请选择保障级别/地区" options={data} />
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item {...formItemLayout2}>
                              {getFieldDecorator('selyPay_'+index, {
                                rules: [{ required: true, message: '请选择自付选项' }],
                              })(
                                <Select placeholder="请选择自付选项" style={{paddingLeft:'5px'}}>
                                  {selfpayOptions[index]}
                                </Select>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      )
                    })
                  }
                </Row>
            }
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ProductionCompareModal);
