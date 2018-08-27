import React from 'react';
import { Form, BackTop,Input,Row,Col,Select,Table, DatePicker,InputNumber,Cascader,Radio} from 'antd';
import moment from 'moment';
import {npcCascade} from '../../utils/common';
import CodeOption from '../common/CodeOption';
import * as codeService from '../../services/code';
import * as service from '../../services/customer';
import * as styles from '../../styles/qa.css';
import Modals from '../common/modal/Modal';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const columns = [{
  title: '姓名',
  dataIndex: 'memberName',
  key: 'memberName',
  className:styles.text_center,
}, {
  title: '与客户关系',
  dataIndex: 'relationship',
  key: 'relationship',
  className:styles.text_center,
}, {
  title: '年龄',
  dataIndex: 'age',
  key: 'age',
  className:styles.text_center,
},{
  title: '出生日期',
  dataIndex: 'birthday',
  key: 'birthday',
  className:styles.text_center,
  render:(text)=>{
    return text ? moment(text).format('YYYY-MM-DD') :'';
  }
},{
  title: '身份证号码',
  dataIndex: 'identityNumber',
  key: 'identityNumber',
  className:styles.text_center,
}];


class CustomerDetail extends React.Component {
  state = {
    disabledFlag: true,
    active:1,
    customer: '',
    code: {},
    options:[],
    fields: [{
        fieldId: 'smokeFlag',
        fieldDesc: 'smokeDesc',
        content: '是否吸烟'
      },
      {
        fieldId: 'drinkFlag',
        fieldDesc: 'drinkDesc',
        content: '是否饮酒'
      },
      {
        fieldId: 'drugFlag',
        fieldDesc: 'drugDesc',
        content: '您是否服用任何成瘾药物或毒品'
      },
      {
        fieldId: 'dangerousFlag',
        fieldDesc: 'dangerousDesc',
        content: '您是否出于因工作或娱乐目的，参与或计划参与任何危险性活动？例如潜水、赛车、飞行（以乘客身份搭乘商业性民航客机除外）'
      },
      {
        fieldId: 'abroadFlag',
        fieldDesc: 'abroadDesc',
        content: '过去12月内，您是否曾在居住地址以外的国家逗留？'
      },
      {
        fieldId: 'disabilityFlag',
        fieldDesc: 'disabilityDesc',
        content: '是否有任何缺陷、断肢、先天及/或后天的身体残疾？'
      },
      {
        fieldId: 'spiritFlag',
        fieldDesc: 'spiritDesc',
        content: '是否有大脑性麻痹、癫痫、中风、抑郁或其他精神失常？'
      },
      {
        fieldId: 'endocrineFlag',
        fieldDesc: 'endocrineDesc',
        content: '是否 糖尿病、甲状腺或其他内分泌失调？'
      },
      {
        fieldId: 'faceFlag',
        fieldDesc: 'faceDesc',
        content: '是否有眼睛、鼻子、喉或耳朵之疾病/功能失常？'
      },
      {
        fieldId: 'respirationFlag',
        fieldDesc: 'respirationDesc',
        content: '是否有哮喘、肺炎、肺结核或呼吸系统疾病？'
      },
      {
        fieldId: 'threeFlag',
        fieldDesc: 'threeDesc',
        content: '是否有血脂高或高血压？三高症状？'
      },
      {
        fieldId: 'cycleFlag',
        fieldDesc: 'cycleDesc',
        content: '是否有胸痛、心悸、心脏血管或循环系统疾病？'
      },
      {
        fieldId: 'digestionFlag',
        fieldDesc: 'digestionDesc',
        content: '是否有溃疡、疝气、痔疮、肠胃不适或消化系统疾病？'
      },
      {
        fieldId: 'liverFlag',
        fieldDesc: 'liverDesc',
        content: '是否有肝炎或带菌、胆囊、胆管及其他肝脏之疾病/功能失常？'
      },
      {
        fieldId: 'reproductionFlag',
        fieldDesc: 'reproductionDesc',
        content: '是否有肾脏、膀胱、前列腺或生殖系统之疾病/功能失常或结石？'
      },
      {
        fieldId: 'jointFlag',
        fieldDesc: 'jointDesc',
        content: '是否有神经炎、关节炎、通风症、脊柱裂、其他肢体关节、脊柱或肌肉骨骼疾病？'
      },
      {
        fieldId: 'tumorFlag',
        fieldDesc: 'tumorDesc',
        content: '是否有任何囊肿、肿瘤或癌症？'
      },
      {
        fieldId: 'bloodFlag',
        fieldDesc: 'bloodDesc',
        content: '是否有任何种类之贫血症或血友病或其他有关血液之疾病？'
      },
      {
        fieldId: 'aidsFlag',
        fieldDesc: 'aidsDesc',
        content: '您曾否接受/想接受爱滋病有关或任何性传染病的医药建议辅导或治疗？'
      },
      {
        fieldId: 'aidsTestFlag',
        fieldDesc: 'aidsTestDesc',
        content: '您曾否接受艾滋病抗体测试？如有，请注明日期及原因。'
      },
      {
        fieldId: 'skinFlag',
        fieldDesc: 'skinDesc',
        content: '过去三个月内有否连续一星期以上出现疲倦、体重下降、腹泻、淋巴肿大或不正常的皮肤破损？'
      },
      {
        fieldId: 'otherFlag',
        fieldDesc: 'otherDesc',
        content: '您是否患有任何上文未有提及的心理或生理疾病、或意外？'
      },
      {
        fieldId: 'otherTreatFlag',
        fieldDesc: 'otherTreatDesc',
        content: '您有否因上述疾病及/或意外而正在接受诊治或药物治疗？'
      },
      {
        fieldId: 'examinationFlag',
        fieldDesc: 'examinationDesc',
        content: '在过去五年内您曾否因疾病或不适而接受X光、超声波检查、磁力共振、电脑扫描、细胞组织化验、心电图、血液或小便检查？'
      },
      {
        fieldId: 'hereditaryFlag',
        fieldDesc: 'hereditaryDesc',
        content: '您的父母、兄弟姊妹或子女曾否被诊断患有心脏病、中风、高血压、糖尿病、肝病、肾病、精神病、肿瘤或癌症、唐氏综合症、脊柱裂、系统性红斑狼疮、先天的身体残疾或任何遗传疾病？'
      },
      {
        fieldId: 'pregnancyFlag',
        fieldDesc: 'pregnancyDesc',
        content: '您现在是否怀孕？'
      },
      {
        fieldId: 'downTestFlag',
        fieldDesc: 'downTestDesc',
        content: '曾否或将接受唐氏综合症的测试？'
      },
      {
        fieldId: 'gynecologyFlag',
        fieldDesc: 'gynecologyDesc',
        content: '您曾否因为妇科问题而看医生，例如：两次经期间之出血、盆腔炎疾病、子宫颈部或乳房异常？'
      },
      {
        fieldId: 'complicationFlag',
        fieldDesc: 'complicationDesc',
        content: '在过去十年内，您曾否在怀孕期间患有并发症(例如：宫外孕、弥漫性血管内凝血、糖尿病或高血压等)？'
      },
      {
        fieldId: 'gynecologyOthFlag',
        fieldDesc: 'gynecologyOthDesc',
        content: '您曾否接受或被建议接受或打算接受乳房X光像、乳房或盆腔超声波检查、子宫颈细胞涂片检查、锥形切片检查或阴道镜检查？'
      },
    ],
  };


  componentWillMount() {
    let params = {
      nationalList: 'PUB.NATION',                //国籍
      provinceList: 'PUB.PROVICE',              //省份
      cityList: 'PUB.CITY',                     //城市
      marryList: 'CTM.MARITAL_STATUS' ,         //婚姻状况
      certificateList: 'CTM.CERTIFICATE_TYPE',  //其他证件
      diplomaList: 'PUB.EDUCATION',          //教育程度
      usaConnectivityProof: 'ORD.USA_CONNECT',                 //美国连接性证明
    };
    codeService.getCode(params).then((data)=>{
      const options = npcCascade(data);
      this.setState({
        options: options,
        code: data,
      });
    });
    service.fetchCustomerDetail({customerId:this.props.customerId}).then((data)=>{
      let customer = data.rows[0] || {};
      customer.premiumRate = customer.premiumRate? parseFloat(customer.premiumRate * 100).toFixed(4) : 0;
      this.setState({customer: customer});
    });
  }

  //更新
  update(values){
    let customer = this.state.customer;
    for(let i in values){
      customer[i] = values[i];
    }
    for(let i in values.customerFamilyList){
      values.customerFamilyList[i].__status = 'update';
    }
    customer.customerFamilyList = values.customerFamilyList;
    customer.__status = 'update';
    return customer;
  }

  //创建
  create(values){
    for(let i in values.customerFamilyList){
      values.customerFamilyList[i].__status = 'add';
    }
    values.__status = 'add';
    return values;
  }

  //提交表单
  submit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      //校验通过就提交到后台
      if (!err) {
        const form = this.props.form;
        let values = this.props.form.getFieldsValue() || {};
        values.birthDate = form.getFieldValue('birthDate')?form.getFieldValue('birthDate').format('YYYY-MM-DD HH:mm:ss') : null;
        //values.identityEffectiveDate = form.getFieldValue('identityEffectiveDate')?form.getFieldValue('identityEffectiveDate').format('YYYY-MM-DD HH:mm:ss') : null;
        values.badEffactiveDate = form.getFieldValue('badEffactiveDate')?form.getFieldValue('badEffactiveDate').format('YYYY-MM-DD HH:mm:ss') : null;
        //values.certificateEffectiveDate = form.getFieldValue('certificateEffectiveDate')?form.getFieldValue('certificateEffectiveDate').format('YYYY-MM-DD HH:mm:ss') : null;
        if(values.identify.length){
          values.identityNation = values.identify[0];
          values.identityProvince = values.identify[1];
          values.identityCity = values.identify[2];
        }
        if(values.post.length){
          values.postNation = values.post[0];
          values.postProvince = values.post[1];
          values.postCity = values.post[2];
        }
        if(values.company.length){
          values.companyNation = values.post[0];
          values.companyProvince = values.post[1];
          values.companyCity = values.post[2];
        }
        values.customerFamilyList = this.state.customer.customerFamilyList || [];

        let results = {};
        if(this.props.customerId == 0){
          results = this.create(values);
        }else if(this.props.customerId > 0){
          results = this.update(values);
        }
        service.submitCustomer(results).then((data) =>{
          if(data.success){
            this.setState({customer: data.rows[0] || {}});
            Modals.success({content:'提交成功！'});
          }else{
            Modals.error({content:'请联系系统管理员'});
          }
        });
      } else {
        Modals.error({content:'请正确填写完相关信息'});
      }
    });
  }

  //点击单选按钮时触发
  onChange(fieldId,e){
    let customer  = this.state.customer;
    customer[fieldId] = e.target.value;
    this.props.dispatch({
      type: 'customer/customerDetailSave',
      payload: {customer},
    });
  }

  liChange(index, element){
    this.setState({active:index});
    document.getElementById(element).scrollIntoView(true);
  }


  render() {
    const customer = this.state.customer;
    const disabledFlag = this.state.disabledFlag;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    let post = [], identify = [], company = [];
    if(customer.identityNation){
      identify.push(customer.identityNation);
      identify.push(customer.identityProvince);
      identify.push(customer.identityCity);
    }
    if(customer.postNation){
      post.push(customer.postNation);
      post.push(customer.postProvince);
      post.push(customer.postCity);
    }
    if(customer.companyNation){
      company.push(customer.companyNation);
      company.push(customer.companyProvince);
      company.push(customer.companyCity);
    }

    return (
      <div  className={styles.disableds}>
        <Form onSubmit={this.submit.bind(this)} className={styles.form_sty}>

          <div className={styles['customer-detail']}>
            <a
              className={this.state.active == 1? styles.active:''}
              style={{color:'#ffffff'}}
              href="javascript:void(0)"
              onClick={this.liChange.bind(this, 1, "personalInfo")}
            >
              个人信息
            </a>

            <a
              className={this.state.active == 2? styles.active:''}
              href="javascript:void(0)"
              onClick={this.liChange.bind(this, 2, "moneyInfo")}
            >
              财力证明
            </a>

            <a
              className={this.state.active == 3? styles.active:''}
              href="javascript:void(0)"
              onClick={this.liChange.bind(this, 3, "orderlInfo")}
            >
              保单信息
            </a>

            <a
              className={this.state.active == 4? styles.active:''}
              href="javascript:void(0)"
              onClick={this.liChange.bind(this, 4, "healthyInfo")}
            >
              健康信息
            </a>

            <a
              className={this.state.active == 5? styles.active:''}
              href="javascript:void(0)"
              onClick={this.liChange.bind(this, 5, "familyInfo")}
            >
              家庭成员
            </a>
          </div>

          {/*个人信息*/}
          <div className={styles.div_item_line} id="personalInfo">
            <b className={styles.b_short_line} >|</b>
            <font className={styles.title_font}>个人信息</font>
            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>中文姓名</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('chineseName', {
                    validateTrigger: 'onBlur',
                    trigger: 'onBlur',
                    initialValue:customer.chineseName || '',
                    rules: [{ required: true, message: '请输入用户名称', whitespace: true }],
                  })(
                    <Input disabled={disabledFlag} size="large" placeholder="请输入用户名称"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>拼音姓名</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('englishName', {
                    initialValue:customer.englishName || '',
                    rules: [],
                  })(
                    <Input disabled={disabledFlag} size="large" placeholder="请输入拼音名称"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>出生日期</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('birthDate', {
                    initialValue:customer.birthDate ? moment(customer.birthDate, 'YYYY-MM-DD') : null,
                  })(
                    <DatePicker disabled={disabledFlag} style={{width:'100%'}} />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>性别</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('sex', {
                    initialValue:customer.sex || '',
                  })(
                    <Select disabled={disabledFlag} className={styles['select-disableds']}>
                      <Option key="1" value="M">男</Option>
                      <Option key="2" value="F">女</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>国籍</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('nationality', {
                    initialValue:customer.nationality || '',
                  })(
                    <CodeOption disabled={disabledFlag} codeList={this.state.code.nationalList} className={styles['select-disableds']}/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>身高(cm)</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('height', {
                    initialValue:customer.height || '',
                  })(
                    <InputNumber disabled={disabledFlag} style={{width:'100%'}} size="large" min={1} max={300} />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>体重(kg)</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('weight', {
                    initialValue:customer.weight || '',
                  })(
                    <InputNumber disabled={disabledFlag} style={{width:'100%'}} size="large" min={1} max={300} />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>教育程度</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('education', {
                  initialValue:customer.education || '',
                  })(
                    <CodeOption disabled={disabledFlag} codeList={this.state.code.diplomaList} className={styles['select-disableds']}/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>婚姻状况</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('marriageStatus', {
                    initialValue:customer.marriageStatus || '',
                  })(
                    <CodeOption disabled={disabledFlag} codeList={this.state.code.marryList} className={styles['select-disableds']}/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>联系电话</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('phone', {
                    rules: [{
                       required: true, message: '请输入正确电话号码', whitespace: true , pattern:/((\d{3})|(0085[23])|(00886))\d{8}/
                     }],
                     initialValue:customer.phone || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>电子邮件</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('email', {
                    rules: [{
                      type:'email', message: '请输入正确的邮箱地址',
                    }],
                    initialValue:customer.email || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>身份证号码</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('identityNumber', {
                    rules: [{
                       required: true, message: '请输入正确的身份证号码', whitespace: true , pattern:/^[0-9a-zA-Z]+$/
                     }],
                     initialValue:customer.identityNumber || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>身份证有效期</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('identityEffectiveDate', {
                    //initialValue:customer.identityEffectiveDate ? moment(customer.identityEffectiveDate, 'YYYY-MM-DD') : null,
                    initialValue:customer.identityEffectiveDate || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                   // <DatePicker disabled={disabledFlag} style={{width:'100%'}} />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>其他证件</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('certificateType', {
                    initialValue:customer.certificateType || '',
                  })(
                    <CodeOption disabled={disabledFlag} codeList={this.state.code.certificateList} className={styles['select-disableds']}/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>证件号码</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('certificateNumber', {
                    initialValue:customer.certificateNumber || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>证件有效期</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('certificateEffectiveDate', {
                    initialValue:customer.certificateEffectiveDate || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
            </Row>
{/*
            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>身份证地址</label>
              </Col>
              <Col  span={9}>
                <FormItem className={styles['cascader-disableds']}>
                  {getFieldDecorator('identify', {
                    initialValue:identify || [],
                  })(
                    <Cascader disabled={disabledFlag} options={this.state.options} placeholder="请选择"/>
                  )}
                </FormItem>
              </Col>
            </Row>
*/}
            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>身份证详细地址</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('identityAddress', {
                    initialValue:customer.identityAddress || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>是否以身份证作为邮寄通讯地址</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('identityFlag', {
                    initialValue:customer.identityFlag || '',
                  })(
                    <Select disabled={disabledFlag} className={styles['select-disableds']}>
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <span style={{lineHeight:'32px',float:'right',paddingRight:'10px',fontSize:'16px'}}>邮寄通讯地址</span>
              </Col>
              <Col  span={9}>
                <FormItem className={styles['cascader-disableds']} >
                  {getFieldDecorator('post', {
                    initialValue:post || [],
                  })(
                    <Cascader disabled={disabledFlag} options={this.state.options} placeholder="请选择"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>详细地址</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('postAdress', {
                    initialValue:customer.postAddress || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>居住地址</label>
              </Col> 
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('residentialAddress', {
                    initialValue:customer.residentialAddress || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <div style={{float:'right',paddingRight:'10px',fontSize:'16px'}}>是否为美国公民或税务居民</div>
              </Col>
              <Col  span={9}>
                <FormItem style={{lineHeight:'32px'}}>
                  {getFieldDecorator('americanCitizenFlag', {
                    initialValue:customer.americanCitizenFlag || 'N',
                  })(
                    <Select disabled={disabledFlag} className={styles['select-disableds']}>
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>公司名称</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('companyName', {
                    initialValue:customer.companyName || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>公司业务性质(行业)</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('industry', {
                    initialValue:customer.industry || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
            </Row>
{/*
            <Row span={24}>
              <Col span={2}></Col>
              <Col span={6}>
                <span style={{lineHeight:'32px',float:'right',paddingRight:'10px',fontSize:'16px'}}>公司地址</span>
              </Col>
              <Col span={9}>
                <FormItem className={styles['cascader-disableds']}>
                  {getFieldDecorator('company', {
                    initialValue:company || [],
                  })(
                    <Cascader disabled={disabledFlag} options={this.state.options} placeholder="请选择公司地址"/>
                  )}
                </FormItem>
              </Col>
            </Row>
*/}
            <Row span={24}>
              <Col span={2}></Col>
              <Col span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>公司详细地址</label>
              </Col>
              <Col span={9}>
                <FormItem>
                  {getFieldDecorator('companyAddress', {
                    initialValue:customer.companyAddress || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            {/*<Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>职位</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('job', {
                    initialValue:customer.job || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
            </Row>*/}

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>职位</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('position', {
                    initialValue:customer.position || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <div style={{lineHeight:'32px',float:'right',paddingRight:'10px',fontSize:'16px'}}>月收入水平(港币)</div>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('income', {
                    initialValue:customer.income || '',
                  })(
                    <InputNumber disabled={disabledFlag} style={{width:'100%'}} size="large" min={0} />
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>



          {/*财力证明*/}
          <div className={styles.div_item_line} id="moneyInfo">
            <b className={styles.b_short_line} >|</b>
            <font className={styles.title_font}>财力证明</font>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>保费资金来源</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('premiumSource', {
                    initialValue:customer.premiumSource || '',
                  })(
                    <Input disabled={disabledFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <div style={{lineHeight:'32px',float:'right',paddingRight:'10px',fontSize:'16px'}}>您平均每月约支出多少(港币)</div>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('amountPerMonth', {
                    initialValue:customer.amountPerMonth || 0,
                  })(
                    <InputNumber
                      disabled={disabledFlag}
                      size="large"
                      style={{width:'100%'}}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>您现持多少流动资产(港币)</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('currentAssets', {
                    initialValue:customer.currentAssets || 0,
                  })(
                    <InputNumber
                      disabled={disabledFlag}
                      size="large"
                      style={{width:'100%'}}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <div style={{float:'right',paddingRight:'10px',fontSize:'16px'}}>持有不动资产的总值约为多少(港币)</div>
              </Col>
              <Col span={9}>
                <FormItem>
                  {getFieldDecorator('fixedAssets', {
                    initialValue:customer.fixedAssets || 0,
                  })(
                    <InputNumber
                      disabled={disabledFlag}
                      size="large"
                      style={{width:'100%'}}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{float:'right',paddingRight:'10px'}}>您每年承担的保费占您个人收入的比例约为多少</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('premiumRate', {
                    initialValue:customer.premiumRate || 0,
                  })(
                    <InputNumber
                      disabled={disabledFlag}
                      size="large"
                      style={{width:'100%'}}
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>您现时负债大约有多少(港币)</label>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('liabilities', {
                    initialValue:customer.liabilities || 0,
                  })(
                    <InputNumber
                      disabled={disabledFlag}
                      size="large"
                      style={{width:'100%'}}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>


          {/*保单信息*/}
          <div className={styles.div_item_line} id="orderlInfo">
            <b className={styles.b_short_line} >|</b>
            <font className={styles.title_font}>保单信息</font>

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <div style={{float:'right',paddingRight:'10px',fontSize:'16px'}}>
                  您是否曾被保险公司拒保、推迟承保、增加保费或更改受保条件？
                </div>
              </Col>
              <Col  span={9}>
                <FormItem className={styles.form_sty}>
                  {getFieldDecorator('badFlag', {
                    initialValue:customer.badFlag || 'N',
                  })(
                    <Select disabled={disabledFlag} className={styles['select-disableds']}>
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            {
              (this.props.form.getFieldValue('badFlag') === 'Y') &&
              <div>
                <Row span={24}>
                  <Col  span={2}></Col>
                  <Col  span={6}>
                    <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>保险公司/产品名称</label>
                  </Col>
                  <Col  span={9}>
                    <FormItem>
                      {getFieldDecorator('badInsuranceName', {
                        initialValue:customer.badInsuranceName || '',
                      })(
                        <Input disabled={disabledFlag} size="large"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row span={24}>
                  <Col  span={2}></Col>
                  <Col  span={6}>
                    <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>拒保推迟承保或者出现增加保费的原因</label>
                  </Col>
                  <Col  span={9}>
                    <FormItem>
                      {getFieldDecorator('badInsuranceType', {
                        initialValue:customer.badInsuranceType || '',
                      })(
                        <Input disabled={disabledFlag} size="large"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row span={24}>
                  <Col  span={2}></Col>
                  <Col  span={6}>
                    <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>最后一次申请日期</label>
                  </Col>
                  <Col  span={9}>
                    <FormItem>
                      {getFieldDecorator('badEffactiveDate', {
                        initialValue:customer.badEffactiveDate ? moment(customer.badEffactiveDate, 'YYYY-MM-DD') : null,
                      })(
                        <DatePicker disabled={disabledFlag} style={{width:'100%'}} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            }

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <div style={{float:'right',paddingRight:'10px',fontSize:'16px'}}>
                  您是否因以外、伤病或健康理由而申请社会福利或保险赔偿？
                </div>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('compensateFlag', {
                    initialValue:customer.compensateFlag || 'N',
                  })(
                    <Select disabled={disabledFlag} className={styles['select-disableds']}>
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>


            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <div style={{float:'right',paddingRight:'10px',fontSize:'16px'}}>
                  您是否有现行生效（包括在申请中）之保险保障？
                </div>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('guaranteeFlag', {
                    initialValue:customer.guaranteeFlag || 'N',
                  })(
                    <Select disabled={disabledFlag} className={styles['select-disableds']}>
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            {
              (this.props.form.getFieldValue('guaranteeFlag') === 'Y') &&
              <div>
                <Row span={24}>
                  <Col  span={2}></Col>
                  <Col  span={6}>
                    <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>保单1（请注明保险公司/险种/保额/保单生效日）</label>
                  </Col>
                  <Col  span={9}>
                    <FormItem>
                      {getFieldDecorator('guaranteeInsuranceName', {
                        initialValue:customer.guaranteeInsuranceName || '',
                      })(
                        <Input disabled={disabledFlag} size="large"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row span={24}>
                  <Col  span={2}></Col>
                  <Col  span={6}>
                    <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>保单2（请注明保险公司/险种/保额/保单生效日）</label>
                  </Col>
                  <Col  span={9}>
                    <FormItem>
                      {getFieldDecorator('guaranteeInsuranceType', {
                        initialValue:customer.guaranteeInsuranceType || '',
                      })(
                        <Input disabled={disabledFlag} size="large"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row span={24}>
                  <Col  span={2}></Col>
                  <Col  span={6}>
                    <label style={{lineHeight:'32px',float:'right',paddingRight:'10px'}}>保单3（请注明保险公司/险种/保额/保单生效日）</label>
                  </Col>
                  <Col  span={9}>
                    <FormItem>
                      {getFieldDecorator('guaranteeEffactiveDate', {
                        initialValue:customer.guaranteeEffactiveDate || '',
                      })(
                        <Input disabled={disabledFlag} size="large"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            }

            <Row span={24}>
              <Col  span={2}></Col>
              <Col  span={6}>
                <div style={{float:'right',paddingRight:'10px',fontSize:'16px'}}>
                  美国连接性证明（美国保单需填写）
                </div>
              </Col>
              <Col  span={9}>
                <FormItem>
                  {getFieldDecorator('usaConnectFlag', {
                    initialValue:customer.usaConnectFlag || 'N',
                  })(
                    <Select disabled={disabledFlag} className={styles['select-disableds']}>
                      {
                        this.state.code.usaConnectivityProof &&
                        this.state.code.usaConnectivityProof.map((item) =>
                          <Option key={item.value} value={item.value}>{item.meaning}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

          </div>


          {/*健康信息*/}
          <div className={styles.div_item_line} id="healthyInfo">
            <b className={styles.b_short_line} >|</b>
            <font className={styles.title_font}>健康信息</font>

            <table className={styles.table1}>
              <tbody>
              {
                this.state.fields.map((item)=>{
                  const fieldId = item.fieldId;
                  const fieldDesc = item.fieldDesc;
                  return(
                    <tr key={fieldId}>
                      <td>
                        <label style={{marginRight:'10px'}}>{item.content}</label>
                        {
                          customer[fieldId] === 'Y' &&
                          <FormItem>
                            {getFieldDecorator(''+fieldDesc+'',{
                              initialValue:customer[fieldDesc]
                            })(
                              <Input disabled={disabledFlag} size='large' />
                            )}
                          </FormItem>
                        }
                      </td>
                      <td style={{width:'15%'}}>
                        <FormItem>
                          {getFieldDecorator(''+fieldId+'',{
                            initialValue:customer[fieldId]
                          })(
                            <RadioGroup onChange={this.onChange.bind(this, item.fieldId)} disabled={disabledFlag}>
                              <Radio value='Y'>是</Radio>
                              <Radio value='N'>否</Radio>
                            </RadioGroup>
                          )}
                        </FormItem>
                      </td>
                    </tr>
                  );
                })
              }
              </tbody>
            </table>
          </div>


          {/*家庭成员*/}
          <div className={styles.div_item_last} id="familyInfo">
            <b className={styles.b_short_line} >|</b>
            <font className={styles.title_font}>家庭成员</font>

            <div style={{width:'100%',marginTop:'15px'}}>
              <Table
                rowKey='customerFamilyId'
                columns={columns}
                dataSource={customer.customerFamilyList}
                bordered
                pagination={false}/>
            </div>
          </div>



          {/*<FormItem style={{marginLeft:'10%'}} >
            <Row gutter={24}>
              <Col span={5}></Col>
              <Col span={6}>
                <Button onClick={()=>location.hash = '/portal/customer'} type='default'  style={{ width: 160, height:40}} >返回</Button>
              </Col>

              <Col span={12}>
                <Button onClick={this.submit.bind(this)} type='primary' style={{ width: 160, height:40}} size="large" >提交</Button>
              </Col>
            </Row>
          </FormItem>*/}


        </Form>
        <BackTop />
      </div>
    );
  }
}

CustomerDetail = Form.create()(CustomerDetail);
export default CustomerDetail;
