/**
 * Created by FengWanJun on 2017/6/1.
 */

import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Select, Input, Button, Table, Cascader } from 'antd';
import { productionDetail, premuimMeasure } from '../../services/production';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import { getCode } from '../../services/code';
import TipModal from "../common/modal/Modal";
import { NumbericeInput, NumberInput } from "../common/Input";
import { sortCustom } from '../../utils/common';

class ProductionPremiumMeasurement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productDetail: {},
      //保障级别/地区下拉数据
      securityPlanOptions: [],
      //自付选项下拉数据
      selfpayOptions: [],
      //年期下拉数据
      agePremiumOptions: [],
      //币种下拉数据
      currencyList: [],
      //缴费方式下拉数据
      payMethodOptions: [],
      premium: {
        cnmChannelCommissionList: [],
      },
      //快码值
      codeList: {
        genderList: [],
        currencyList: [],
        smokeFlagList: [],
        nationList: [],
      },
      body: {
        channelId: JSON.parse(localStorage.user).relatedPartyId,
        itemId: this.props.itemId,
        productionAgeLimit: null,
        currency: null,
        securityLevel: null,
        age: null,
        gender: null,
        livingCity: null,
        selfpay: null,
        smokeFlag: null,
        coverage: null,
        paymentMethod: null,
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
      } else {
        TipModal.error({content:detailData.message});
        return;
      }
      //保障级别/地区
      detailData.rows[0].prdItemSecurityPlan.map((item) => {
        if (item.enabledFlag != "N") {
          var flag = true;
          for(var j=0; j<this.state.securityPlanOptions.length; j++) {
            if (this.state.securityPlanOptions[j].securityLevel == item.securityLevel) {
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
            detailData.rows[0].prdItemSecurityPlan.map((item2) => {
              if (item.securityLevel == item2.securityLevel && item2.enabledFlag != "N") {
                result.children.push({
                  value: item2.securityRegion,
                  label: item2.securityRegion
                });
              }
            });
            this.state.securityPlanOptions.push(result);
          }
        }
      });
      //自付选项
      detailData.rows[0].prdItemSelfpayList = sortCustom(detailData.rows[0].prdItemSelfpayList,'SELFPAY');
      detailData.rows[0].prdItemSelfpayList.map((item) => {
        if (item.enabledFlag != "N") {
          this.state.selfpayOptions.push(<Select.Option key={item.selfpay}>{item.selfpay}</Select.Option>);
        }
      });
      //子产品
      detailData.rows[0].prdItemSublineList = sortCustom(detailData.rows[0].prdItemSublineList,'SUBLINE');
      detailData.rows[0].prdItemSublineList.map((item) => {
        //缴费年期
        if (item.enabledFlag != "N") {
          this.state.agePremiumOptions.push(<Select.Option key={item.sublineItemName}>{item.sublineItemName}</Select.Option>);
        }
      });
      //缴费方式
      if (detailData.rows[0].fullyear == "Y") {
        this.state.payMethodOptions.push(<Select.Option key="WP">整付</Select.Option>);
      }
      if (detailData.rows[0].oneyear == "Y") {
        this.state.payMethodOptions.push(<Select.Option key="AP">年缴</Select.Option>);
      }
      if (detailData.rows[0].halfyear == "Y") {
        this.state.payMethodOptions.push(<Select.Option key="SAP">半年缴</Select.Option>);
      }
      if (detailData.rows[0].quarter == "Y") {
        this.state.payMethodOptions.push(<Select.Option key="QP">季缴</Select.Option>);
      }
      if (detailData.rows[0].onemonth == "Y") {
        this.state.payMethodOptions.push(<Select.Option key="MP">月缴</Select.Option>);
      }
      //获取快码值
      var body = {
        genderList: 'HR.EMPLOYEE_GENDER',
        smokeFlagList: 'SYS.YES_NO',
        currencyList: 'PUB.CURRENCY',
        nationList: 'PUB.NATION',
      };
      getCode(body).then((data)=>{
        //币种
        detailData.rows[0].prdItemPaymode.map((item) => {
          var currency = {};
          data.currencyList.map((code) => {
            if (item.currencyCode == code.value && item.enabledFlag != "N") {
              var flag = true;
              for(var j=0; j<this.state.currencyList.length; j++) {
                if (this.state.currencyList[j].value == code.value) {
                  flag = false;
                  break;
                }
              }
              if (flag) {
                currency.value = code.value;
                currency.meaning = code.meaning;
                this.state.currencyList.push(currency);
              }
            }
          });
        });
        this.setState({
          codeList: data
        });
      });
    });
  }
  measure() {
    document.getElementById("premium").style.display = "none";
    let values = {};
    this.props.form.validateFieldsAndScroll((err, _values) => {
      if (err) {
        return;
      } else {
        values = _values;
      }
    });
    this.state.body.currency = values.currency;
    this.state.body.age = values.age;
    if (this.props.minClass == "GD") {
      this.state.body.minClass = 'GD';
      this.state.body.securityLevel = values.securityPlan[0];
      this.state.body.securityArea = values.securityPlan[1];
      this.state.body.selfpay = values.selfpay;
      this.state.body.livingCountry = values.livingCountry;
    } else {
      this.state.body.productionAgeLimit = values.productionAgeLimit;
      this.state.body.gender = values.gender;
      this.state.body.smokeFlag = values.smokeFlag;
      this.state.body.coverage = values.coverage*10000;
      this.state.body.paymentMethod = values.paymentMethod;
    }
    premuimMeasure(this.state.body).then((data) => {
      if (data.success) {
        for (var i=0; i<this.state.codeList.currencyList.length; i++) {
          if (this.state.codeList.currencyList[i].value == this.props.form.getFieldValue("currency")) {
            data.rows[0].currency = this.state.codeList.currencyList[i].meaning;
          }
        }
        data.rows[0].cnmChannelCommissionList = [data.rows[0].cnmChannelCommissionList];
        this.setState({
          premium: data.rows[0]
        });
        document.getElementById("premium").style.display = "block";
      } else {
        TipModal.error({content:data.message});
        return;
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    const formLabelLayout = {
      labelCol: { span: 10, },
    };
    //根据快码值生成下拉列表
    const genderOptions = this.state.codeList.genderList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const smokeFlagOptions = this.state.codeList.smokeFlagList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const livingCountryOptions = this.state.codeList.nationList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const currencyOptions = this.state.currencyList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const columns = [{
      title: "第一年",
      key: "theFirstYear",
      dataIndex: "theFirstYear",
      width: 100,
      render: (text, record, index) => {
        if (!text) {
          return "-";
        } else {
          return Number(text).toFixed(2)+this.state.premium.currency;
        }
      }
    },{
      title: "第二年",
      key: "theSecondYear",
      dataIndex: "theSecondYear",
      width: 100,
      render: (text, record, index) => {
        if (!text) {
          return "-";
        } else {
          return Number(text).toFixed(2)+this.state.premium.currency;
        }
      }
    },{
      title: "第三年",
      key: "theThirdYear",
      dataIndex: "theThirdYear",
      width: 100,
      render: (text, record, index) => {
        if (!text) {
          return "-";
        } else {
          return Number(text).toFixed(2)+this.state.premium.currency;
        }
      }
    },{
      title: "第四年",
      key: "theFourthYear",
      dataIndex: "theFourthYear",
      width: 100,
      render: (text, record, index) => {
        if (!text) {
          return "-";
        } else {
          return Number(text).toFixed(2)+this.state.premium.currency;
        }
      }
    },{
      title: "第五年",
      key: "theFifthYear",
      dataIndex: "theFifthYear",
      width: 100,
      render: (text, record, index) => {
        if (!text) {
          return "-";
        } else {
          return Number(text).toFixed(2)+this.state.premium.currency;
        }
      }
    },{
      title: "第六年",
      key: "theSixthYear",
      dataIndex: "theSixthYear",
      width: 100,
      render: (text, record, index) => {
        if (!text) {
          return "-";
        } else {
          return Number(text).toFixed(2)+this.state.premium.currency;
        }
      }
    },{
      title: "第七年",
      key: "theSeventhYear",
      dataIndex: "theSeventhYear",
      width: 100,
      render: (text, record, index) => {
        if (!text) {
          return "-";
        } else {
          return Number(text).toFixed(2)+this.state.premium.currency;
        }
      }
    },{
      title: "第八年",
      key: "theEightYear",
      dataIndex: "theEightYear",
      width: 100,
      render: (text, record, index) => {
        if (!text) {
          return "-";
        } else {
          return Number(text).toFixed(2)+this.state.premium.currency;
        }
      }
    },{
      title: "第九年",
      key: "theNinthYear",
      dataIndex: "theNinthYear",
      width: 100,
      render: (text, record, index) => {
        if (!text) {
          return "-";
        } else {
          return Number(text).toFixed(2)+this.state.premium.currency;
        }
      }
    },{
      title: "第十年",
      key: "theTenthYear",
      dataIndex: "theTenthYear",
      width: 100,
      render: (text, record, index) => {
        if (!text) {
          return "-";
        } else {
          return Number(text).toFixed(2)+this.state.premium.currency
        }
      }
    }];
    return (
      <div className={styles.product}>
        <Row style={{borderBottom:'1px solid #d2d2d2',padding:'28px 12px'}}>
          <span className={commonStyles.iconL}></span>
          <span className={commonStyles.iconR}>保费测算</span>
        </Row>
        <Form>
          <Form.Item style={{textAlign:'center',marginTop:'38px'}}>
            <Row style={{fontSize:'23px',marginBottom:'28px'}}>
              {this.state.productDetail.itemName}
              <span className={styles.product_supplier}>{this.state.productDetail.supplierName}</span>
            </Row>
            <Row style={{fontSize:'18px'}}>
              {this.state.productDetail.bigClassName+(this.state.productDetail.midClassName?"-"+this.state.productDetail.midClassName:"")+(this.state.productDetail.minClassName?"-"+this.state.productDetail.minClassName:"")}
            </Row>
          </Form.Item>
          {
            this.props.minClass != "GD" ?
              <Form.Item label="性别" {...formItemLayout}>
                {getFieldDecorator('gender', {
                  rules: [{ required: true, message: '请选择性别' }],
                })(
                  <Select style={{width:'375px'}} allowClear={true}>
                    {genderOptions}
                  </Select>
                )}
              </Form.Item>
              :
              ""
          }
          <Form.Item label="年龄" {...formItemLayout}>
            {getFieldDecorator('age', {
              rules: [{ required: true, message: '请输入年龄' }],
            })(
              <NumberInput style={{width:'375px'}} addonAfter={<span style={{fontSize:'15px'}}>岁</span>} />
            )}
          </Form.Item>
          {
            this.props.minClass != "GD" ?
              <Form.Item label="是否抽烟" {...formItemLayout}>
                {getFieldDecorator('smokeFlag', {
                  rules: [{ required: true, message: '请选择是否抽烟' }],
                })(
                  <Select style={{width:'375px'}} allowClear={true}>
                    {smokeFlagOptions}
                  </Select>
                )}
              </Form.Item>
              :
              ""
          }
          <Form.Item label="币种" {...formItemLayout}>
            {getFieldDecorator('currency', {
              rules: [{ required: true, message: '请选择币种' }],
            })(
              <Select style={{width:'375px'}} allowClear={true}>
                {currencyOptions}
              </Select>
            )}
          </Form.Item>
          {
            this.props.minClass == "GD" ?
              <div>
                <Form.Item label="居住地" {...formItemLayout}>
                  {getFieldDecorator('livingCountry', {
                    rules: [{ required: true, message: '请选择居住地' }],
                  })(
                    <Select style={{width:'375px'}} allowClear={true}>
                      {livingCountryOptions}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="保障级别/地区" {...formItemLayout}>
                  {getFieldDecorator('securityPlan', {
                    rules: [{ required: true, message: '请选择保障级别/地区',type:'array' }],
                  })(
                    <Cascader style={{width:'375px'}} expandTrigger="hover" placeholder='' options={this.state.securityPlanOptions} />
                  )}
                </Form.Item>
                <Form.Item label="自付选项" {...formItemLayout}>
                  {getFieldDecorator('selfpay', {
                    rules: [{ required: true, message: '请选择自付选项' }],
                  })(
                    <Select style={{width:'375px'}} allowClear={true}>
                      {this.state.selfpayOptions}
                    </Select>
                  )}
                </Form.Item>
              </div>
              :
              ""
          }
          {
            this.props.minClass != "GD" ?
              <div>
                <Form.Item label="年期" {...formItemLayout}>
                  {getFieldDecorator('productionAgeLimit', {
                    rules: [{ required: true, message: '请选择年期' }],
                  })(
                    <Select style={{width:'375px'}} allowClear={true}>
                      {this.state.agePremiumOptions}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="保额" {...formItemLayout}>
                  {getFieldDecorator('coverage', {
                    rules: [{ required: true, message: '请输入保额' }],
                  })(
                    <NumbericeInput style={{width:'375px'}} addonAfter={<span style={{fontSize:'15px'}}>万元</span>} />
                  )}
                </Form.Item>
                <Form.Item label="缴费方式" {...formItemLayout}>
                  {getFieldDecorator('paymentMethod', {
                    rules: [{ required: true, message: '请选择缴费方式' }],
                  })(
                    <Select style={{width:'375px'}} allowClear={true}>
                      {this.state.payMethodOptions}
                    </Select>
                  )}
                </Form.Item>
              </div>
              :
              ""
          }
          <Form.Item style={{ textAlign: 'center' }}>
            <Button style={{width:'214px',height:'40px',fontSize:'15px',fontWeight:'normal'}} type="primary" className={commonStyles.btnPrimary} onClick={this.measure.bind(this)}>
              保费测算
            </Button>
          </Form.Item>
        </Form>
        <Row>
          <Col xs={22} sm={22} md={22} lg={22} xl={22} offset={1} style={{ marginBottom: '30px', fontSize: '16px' }}>
            温馨提示：
                <Row style={{color: 'rgb(156, 156, 156)'}}>由于数据缺失，产品的部分币种/年期保费测算不出来，因此可以选择该产品的其他币种/年期进行测算，测算结果仅供参考，具体请以保险公司的计划书为准。</Row>
          </Col>
        </Row>
        <div id="premium" style={{display: 'none'}}>
          <Row style={{borderBottom:'1px solid #d2d2d2',padding:'28px 12px'}}>
            <span className={commonStyles.iconL}></span>
            <span className={commonStyles.iconR}>测算结果</span>
          </Row>
          <Row style={{margin:'40px 0 20px'}}>
            {
              (this.props.minClass == "GD" || this.state.premium.paymentMethod == 'WP' || this.state.premium.paymentMethod == 'AP') ?
                <Form.Item label="客户首期保费 " {...formItemLayout}>
                  <span style={{fontSize:'15px',fontWeight:'bold'}}>{Number(this.state.premium.stagePermium).toFixed(2)}{this.state.premium.currency}</span>
                </Form.Item>
                :
                <Form.Item label="客户首期保费 " {...formItemLayout}>
                  <span style={{fontSize:'15px',fontWeight:'bold'}}>
                    {Number(this.state.premium.stagePermium).toFixed(2)}{this.state.premium.currency}
                    (首年保费：{Number(this.state.premium.yearPermium).toFixed(2)}{this.state.premium.currency})
                  </span>
                </Form.Item>
            }
            {
              JSON.parse(localStorage.user).userType == "ADMINISTRATION" ? "":
              this.state.premium.cnmChannelCommissionList.length > 0 && this.state.premium.cnmChannelCommissionList[0].theFirstYear ?
                (this.props.minClass == "GD" || this.state.premium.paymentMethod == 'WP' || this.state.premium.paymentMethod == 'AP') ?
                  <Form.Item label="您首期最高可获得转介费 " {...formItemLayout}>
                    <span style={{fontSize:'15px',fontWeight:'bold'}}>
                      {Number(this.state.premium.cnmChannelCommissionList[0].theFirstYear*this.state.premium.stagePermium).toFixed(2)}{this.state.premium.currency}
                    </span>
                  </Form.Item>
                  :
                  <Form.Item label="您首期最高可获得转介费 " {...formItemLayout}>
                    <span style={{fontSize:'15px',fontWeight:'bold'}}>
                      {Number(this.state.premium.cnmChannelCommissionList[0].theFirstYear*this.state.premium.stagePermium).toFixed(2)}{this.state.premium.currency}
                      (首年转介费：{Number(this.state.premium.cnmChannelCommissionList[0].theFirstYear*this.state.premium.yearPermium).toFixed(2)}{this.state.premium.currency})
                    </span>
                  </Form.Item>
                :
                <Form.Item label="您首期最高可获得转介费 " {...formItemLayout}>
                  <span style={{fontSize:'15px',fontWeight:'bold'}}>
                    未能找到有效的佣金表
                  </span>
                </Form.Item>
            }
          </Row>
        </div>
      </div>
    )
  }
}

export default connect()(Form.create()(ProductionPremiumMeasurement));
