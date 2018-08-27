import React from 'react';
import { Form, Checkbox,Input,Row,Col, Button, Select, DatePicker,Tooltip,Icon,InputNumber,Modal,Cascader } from 'antd';
import * as styles from '../../styles/proposal.css';


const FormItem = Form.Item;
const Option = Select.Option;

let insuranceid = 0;
let drawid = 1;

function onChange(value) {
  console.log('changed', value);
}


const ProspectusApply =({props,
                          dispatch,
                          form: {
                            getFieldDecorator,
                            getFieldValue,
                            setFieldsValue,
                            validateFields,
                            resetFields,
                          },})=>{


  const options = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
      value: 'hangzhou',
      label: 'Hangzhou',
      children: [{
        value: 'xihu',
        label: 'West Lake',
      }],
    }],
  }, {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
      value: 'nanjing',
      label: 'Nanjing',
      children: [{
        value: 'zhonghuamen',
        label: 'Zhong Hua Men',
      }],
    }],
  }];

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
  const addItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 17 },
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


  /**
   * 删除动态增加的输入框
   */
  const removeInsurance = (k) => {
    const keys = getFieldValue('keys');

    if (keys.length === 0) {
      return;
    }
    setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  /**
   * 动态添加输入框
   */
  const addInsurance = () => {
    insuranceid++;
    const keys = getFieldValue('keys');
    const nextKeys = keys.concat(insuranceid);

    setFieldsValue({
      keys: nextKeys,
    });
  }


  const removeDraw = (j) => {
    const names = getFieldValue('names');
    if (names.length === 0) {
      return;
    }
  setFieldsValue({
      names: names.filter(key => key !== j),
    });
  }

  const addDraw = () => {
    drawid++;
    const names = getFieldValue('names');
    const nextKeys = names.concat(drawid);
    setFieldsValue({
      names: nextKeys,
    });
  }


  getFieldDecorator('keys', { initialValue: [] });
  const keys = getFieldValue('keys');
  const formItems = keys.map((k, index) => {
    return (
      <div>
        <Row gutter={24}>
          <Col span={14} offset={4} style={{paddingLeft: '3%',paddingRight: '3%'}}>
            <FormItem {...addItemLayout} label={"附加险"+(k+1)} key={(k+1)+'gg'}>
              {getFieldDecorator(`names-${(k+1)}`, )(
                <Select showSearch placeholder="请选择附加险" style={{width:'100%'}}
                        optionFilterProp="children"
                >
                  <Option value="Y">fujiaxian1</Option>
                  <Option value="N">fujiaxian1</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...addItemLayout} label={'附加险'+(k+1)+'备注'} >
              {getFieldDecorator(`loves-${(k+1)}`)(
                <Input type="textarea" rows={3} maxLength={200} placeholder="附加险备注..."/>
              )}
            </FormItem>
          </Col>
          <Col span={3} style={{float:'left'}}>
            <Icon
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => removeInsurance(k)}
            />
          </Col>
        </Row>
      </div>
    );
  });


  getFieldDecorator('names', { initialValue: [] });
  const names = getFieldValue('names');
  const otherItems = names.map((j, index) => {
    return (
      <div>
        <Row>
          <Col span={14} offset={4} style={{paddingLeft: '3%',paddingRight: '3%'}}>
            <FormItem {...addItemLayout} label={"提取年龄"+j} key={j+'gg'}>
              <Row gutter={24}>
                {getFieldDecorator(`years1-${j}`)(
                  <Col span={8} style={{paddingRight:'0'}}>
                <span>
                  第 <InputNumber style={{width:'50%',marginRight:'0'}} placeholder="请输入年期..." size="large" min={1} max={200} initialValue={10}/> 年 -
                    </span>
                  </Col>
                )}
                {getFieldDecorator(`years2-${j}`)(
                  <Col span={8} style={{paddingLeft:'0'}}>
                <span>
                  第 <InputNumber style={{width:'50%',marginRight:'0'}} placeholder="请输入年期..." size="large" min={1} max={200} initialValue={10}/> 年
                </span>
                  </Col>
                )}
                {getFieldDecorator(`amount-${j}`)(
                  <Col span={8} style={{paddingLeft:'0'}}>
                    <Select style={{width:'100%'}} size="large"
                            showSearch placeholder="请选择提取方式"
                            optionFilterProp="children"
                    >
                      <Option value="Y">固定金额</Option>
                      <Option value="N">否</Option>
                    </Select>
                  </Col>
                )}
              </Row>
            </FormItem>
          </Col>
          <Col span={3} style={{float:'left'}}>
            <Icon
              type="minus-circle-o"
              disabled={names.length === 1}
              onClick={() =>removeDraw(j)}
            />
          </Col>
        </Row>
      </div>
    );
  });



  /**
   * 重置功能
   */
  const handleReset = () => {
    resetFields();
  }
  /**
   * 点击提交按钮执行的函数
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        //校验通过就提交到后台

      }else{
        Modal.error({
          title: '提交失败！',
          content: '请正确填写完相关信息',
        });

      }
    });
  }



    return (
      <div className={styles.table_border}>


        <Form  onSubmit={handleSubmit} >

          <div className={styles.item_div}>
            {/*受保人信息*/}
            <b className={styles.b_sty} >|</b>
            <font className={styles.title_font}>受保人信息</font>
            <FormItem {...formItemLayout} label="受保人姓名"  className={styles.formitem_sty} hasFeedback>
              {getFieldDecorator('guaranteeName', {
                rules: [{ required: true, message: '请输入受保人姓名!', whitespace: true }],
              })(
                <Input placeholder="请输入受保人姓名..." />
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="国籍">
              {getFieldDecorator('nationality', {
                rules: [{ required: true, message: '请选择国籍!', whitespace: true }],
              })(
                <Select showSearch placeholder="请选择您的国籍"
                        optionFilterProp="children"
                >
                  {props.codeList.nationality && props.codeList.nationality.map((item)=>
                    <Option value={item.value}>{item.meaning}</Option>
                  )}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="居住地">
              {getFieldDecorator('country', {
                rules: [{ required: true, message: '请选择居住地!', whitespace: true }],
              })(
                <Select showSearch placeholder="请选择您的居住地"
                        optionFilterProp="children"
                >
                  {props.codeList.nationality && props.codeList.nationality.map((item)=>
                    <Option value={item.value}>{item.meaning}</Option>
                  )}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="居住城市" >
              {getFieldDecorator('city', {
                rules: [{ type: 'array', required: true, message: '请选择居城市!' }],
              })(
                <Cascader options={options} onChange={onChange} placeholder="请选择居住城市..." />

              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="性别">
              {getFieldDecorator('gender', {
                rules: [{ required: true, message: '请选择性别!', whitespace: true }],
              })(
                <Select showSearch placeholder="请选择您的性别"
                        optionFilterProp="children"
                >
                  <Option value="M">男</Option>
                  <Option value="F">女</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="是否吸烟">
              {getFieldDecorator('smokes', {
                rules: [{ required: true, message: '请选择是否吸烟!', whitespace: true }],
              })(
                <Select showSearch placeholder="请选择您是否吸烟"
                        optionFilterProp="children"
                >
                  <Option value="Y">是</Option>
                  <Option value="N">否</Option>
                </Select>
              )}
            </FormItem>
            <FormItem className={styles.formitem_sty}
                      {...formItemLayout}
                      label={(
                        <span>
              出生日期&nbsp;
                          <Tooltip title="如需保单回溯日追溯，出计划书时可在生日里直接扣减回溯">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
                      )}
            >
              {getFieldDecorator('birthday', {
                rules: [{ type: 'object', required: true, message: '请选择日期!' }],
              })(
                <DatePicker style={{width:'100%'}}/>
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout} className={styles.formitem_sty}>
              {getFieldDecorator('checks')(
                <Checkbox defaultChecked>投保人与受保人不同</Checkbox>
              )}
            </FormItem>
          </div>

          <div className={styles.item_div}>
            {/*投保人信息*/}
            <b className={styles.b_sty} >|</b>
            <font className={styles.title_font}>投保人信息</font>
            <FormItem {...formItemLayout} label="投保人姓名" className={styles.formitem_sty} hasFeedback>
              {getFieldDecorator('policyholderName', {
                rules: [{ required: true, message: '请输入投保人姓名!', whitespace: true }],
              })(
                <Input placeholder="请输入投保人姓名..." />
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="国籍">
              {getFieldDecorator('pnationality', {
                rules: [{ required: true, message: '请选择国籍!', whitespace: true }],
              })(
                <Select showSearch placeholder="请选择您的国籍"
                        optionFilterProp="children"
                >
                  {props.codeList.nationality && props.codeList.nationality.map((item)=>
                    <Option value={item.value}>{item.meaning}</Option>
                  )}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="居住地">
              {getFieldDecorator('pcountry', {
                rules: [{ required: true, message: '请选择居住地!', whitespace: true }],
              })(
                <Select showSearch placeholder="请选择您的居住地"
                        optionFilterProp="children"
                >
                  {props.codeList.nationality && props.codeList.nationality.map((item)=>
                    <Option value={item.value}>{item.meaning}</Option>
                  )}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="居住城市" >
              {getFieldDecorator('pcity', {
                rules: [{ type: 'array', required: true, message: '请选择居城市!' }],
              })(
                <Cascader options={options} onChange={onChange} placeholder="请选择居住城市..." />

              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="性别">
              {getFieldDecorator('pgender', {
                rules: [{ required: true, message: '请选择性别!', whitespace: true }],
              })(
                <Select showSearch placeholder="请选择您的性别"
                        optionFilterProp="children"
                >
                  <Option value="M">男</Option>
                  <Option value="F">女</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="是否吸烟">
              {getFieldDecorator('psmokes', {
                rules: [{ required: true, message: '请选择是否吸烟!', whitespace: true }],
              })(
                <Select showSearch placeholder="请选择您是否吸烟"
                        optionFilterProp="children"
                >
                  <Option value="Y">是</Option>
                  <Option value="N">否</Option>
                </Select>
              )}
            </FormItem>
            <FormItem className={styles.formitem_sty}
                      {...formItemLayout}
                      label="出生日期"
            >
              {getFieldDecorator('pbirthday', {
                rules: [{ type: 'object', required: true, message: '请选择日期!' }],
              })(
                <DatePicker style={{width:'100%'}}/>
              )}
            </FormItem>
          </div>


          <div className={styles.item_div}>
            {/*产品信息*/}
            <b className={styles.b_sty} >|</b>
            <font className={styles.title_font}>产品信息</font>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="产品公司">
              {getFieldDecorator('productsSCompany', {
                rules: [{ required: true, message: '请选择产品公司!', whitespace: true }],
              })(
                <Select showSearch placeholder="请选择产品公司"
                        optionFilterProp="children"
                >
                  {props.codeList.supplicer && props.codeList.supplicer.map((item)=>
                    <Option value={item.value}>{item.meaning}</Option>
                  )}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="产品">
              {getFieldDecorator('products  ', {
                rules: [{ required: true, message: '请选择产品!', whitespace: true }],
              })(
                <Select showSearch placeholder="请选择产品"
                        optionFilterProp="children"
                >
                  <Option value="1">守护健康危机加倍保</Option>
                  <Option value="2">美国万通</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="年期">
              {getFieldDecorator('years',{
                rules: [{ required: true, message: '请输入年期!', whitespace: true }],
              })(
                <InputNumber style={{width:'100%'}} placeholder="请输入年期..." size="large" min={1} max={200} initialValue={10} onChange={onChange} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="缴费方式">
              {getFieldDecorator('payMethod', {
                rules: [{ required: true, message: '请选择缴费方式!', whitespace: true }],
              })(
                <Select showSearch placeholder="请选择您的缴费方式"
                        optionFilterProp="children"
                >
                  {props.codeList.payMethod && props.codeList.payMethod.map((item)=>
                    <Option value={item.value}>{item.meaning}</Option>
                  )}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="保险总额">
              {getFieldDecorator('totalAccount', {
                rules: [{ required: true, message: '请选择保险总额!', whitespace: true }],
              })(
                <Select showSearch placeholder="请选择您的保险总额"
                        optionFilterProp="children"
                >
                  <Option value="Y">100000</Option>
                  <Option value="N">10000</Option>
                </Select>
              )}
            </FormItem>
          </div>


          <div className={styles.item_div}>
            {/*添加附加险*/}
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="添加附加险">
              {getFieldDecorator('insuranceAdd', {
                rules: [{ required: true, message: '请选择是否添加附加险!', whitespace: true }],
              })(
                <Select showSearch placeholder="请选择是否添加附加险"
                        optionFilterProp="children"
                        onChange={props.changeFlag.bind(this,'insurance')}
                >
                  <Option value="Y">是</Option>
                  <Option value="N">否</Option>
                </Select>
              )}
            </FormItem>

            {
              getFieldValue('insuranceAdd') == 'Y' &&
              // props.insuranceFlag == 'Y' &&
              <div>
                <b className={styles.b_sty}>|</b>
                <font className={styles.title_font}>添加附加险</font>
                <FormItem {...formItemLayout} className={styles.formitem_sty} label="附加险1">
                  {getFieldDecorator('add1')(
                    <Select showSearch placeholder="请选择附加险"
                            optionFilterProp="children"
                    >
                      <Option value="Y">fujiaxian1</Option>
                      <Option value="N">fujiaxian1</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={styles.formitem_sty} label='附加险1备注' style={{marginBottom: '2%'}}>
                  {getFieldDecorator('channelName')(
                    <Input type="textarea" rows={3} maxLength={200} placeholder="附加险备注..."/>
                  )}
                </FormItem>
                {formItems}
                <FormItem {...tailFormItemLayout} className={styles.formitem_sty}>
                  <Button type="dashed" onClick={addInsurance} style={{width: '100%'}}>
                    <Icon type="plus"/> 添加
                  </Button>
                </FormItem>
              </div>
            }
          </div>


          <div className={styles.item_div}>
            {/*添加提取*/}
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="提取金额">
              {getFieldDecorator('draw',{
                rules: [{ required: true, message: '请选择是否添加提取!', whitespace: true }],
              })(
                <Select showSearch placeholder="是否提取金额"
                        optionFilterProp="children"
                        onChange={props.changeFlag.bind(this,'draw')}
                >
                  <Option value="Y">是</Option>
                  <Option value="N">否</Option>
                </Select>
              )}
            </FormItem>

            {
              getFieldValue('draw') == 'Y' &&
              // props.drawFlag =='Y' &&
              <div>
                {/*当选择‘是’提取金额的时候才显示*/}
                <b className={styles.b_sty} >|</b>
                <font className={styles.title_font}>添加提取</font>
                <FormItem {...formItemLayout} className={styles.formitem_sty} label="提取类型">
                  {getFieldDecorator('drawType')(
                    <Select showSearch placeholder="请选择提取类型"
                            optionFilterProp="children"
                    >
                      <Option value="cash">现金价值</Option>
                      <Option value="bonus">红利提取</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={styles.formitem_sty} label="提取方式">
                  {getFieldDecorator('drawMethod')(
                    <Select showSearch placeholder="请选择提取方式"
                            optionFilterProp="children"
                    >
                      <Option value="max">最高金额</Option>
                      <Option value="fixed">固定金额</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem  {...formItemLayout} className={styles.formitem_sty} label="提取年龄1">

                  <Row gutter={24}>
                    {getFieldDecorator('years1')(
                      <Col span={8} style={{paddingRight:'0'}}>
                <span>
                  第 <InputNumber style={{width:'50%',marginRight:'0'}} placeholder="请输入年期..." size="large" min={1} max={200} initialValue={10} onChange={onChange} /> 年 -
                    </span>
                      </Col>
                    )}
                    {getFieldDecorator('years2')(
                      <Col span={8} style={{paddingLeft:'0'}}>
                <span>
                  第 <InputNumber style={{width:'50%',marginRight:'0'}} placeholder="请输入年期..." size="large" min={1} max={200} initialValue={10} onChange={onChange} /> 年
                </span>
                      </Col>
                    )}
                    {getFieldDecorator('amount')(
                      <Col span={8} style={{paddingLeft:'0'}}>
                        <Select style={{width:'100%'}} size="large"
                                showSearch placeholder="请选择提取方式"
                                optionFilterProp="children"
                        >
                          <Option value="Y">固定金额</Option>
                          <Option value="N">否</Option>
                        </Select>
                      </Col>
                    )}
                  </Row>
                </FormItem>
                {otherItems}
                <FormItem {...tailFormItemLayout} className={styles.formitem_sty}>
                  <Button type="dashed" style={{ width: '100%' }} onClick={addDraw}>
                    <Icon type="plus" /> 添加
                  </Button>
                </FormItem>
              </div>
            }
          </div>


          <div className={styles.item_div}>
            {/*添加高端医疗*/}
            <FormItem {...formItemLayout} className={styles.formitem_sty} label="添加高端医疗">
              {getFieldDecorator('topMedical',{
                rules: [{ required: true, message: '请选择是否添加高端医疗!', whitespace: true }],
              })(
                <Select showSearch placeholder="是否添加高端医疗"
                        optionFilterProp="children"
                        onChange={props.changeFlag.bind(this,'medical')}
                >
                  <Option value="Y">是</Option>
                  <Option value="N">否</Option>
                </Select>
              )}
            </FormItem>

            {
              getFieldValue('topMedical') == 'Y' &&
              // props.medicalFlag == 'Y' &&
              <div>
                {/*当选择‘是’添加高端医疗 的时候才显示*/}
                <b className={styles.b_sty}>|</b>
                <font className={styles.title_font}>添加高端医疗</font>
                <FormItem {...formItemLayout} className={styles.formitem_sty} label="产品名称">
                  {getFieldDecorator('productsName')(
                    <Select showSearch placeholder="请选择产品名称"
                            optionFilterProp="children"
                    >
                      <Option value="Y">活亮人生保障系列</Option>
                      <Option value="N">否</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={styles.formitem_sty} label="保障级别">
                  {getFieldDecorator('protectLevel')(
                    <Select showSearch placeholder="请选择保障级别"
                            optionFilterProp="children"
                    >
                      <Option value="Y">标准</Option>
                      <Option value="N">高级</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={styles.formitem_sty} label="保障地区">
                  {getFieldDecorator('protectArea')(
                    <Select showSearch placeholder="请选择保障地区"
                            optionFilterProp="children"
                    >
                      <Option value="Y">环球</Option>
                      <Option value="N">国家</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} className={styles.formitem_sty} label="自付选项">
                  {getFieldDecorator('payOptions')(
                    <Select showSearch placeholder="请选择自付选项"
                            optionFilterProp="children"
                    >
                      <Option value="Y">0港币/0美元</Option>
                      <Option value="N">国家</Option>
                    </Select>
                  )}
                </FormItem>
              </div>
            }
          </div>

          <div style={{marginTop:'3%'}}>
            {/*其他备注*/}
            <FormItem {...formItemLayout} label='其他备注' className={styles.formitem_sty} style={{marginBottom:'2%'}}>
              {getFieldDecorator('remarks')(
                <Input type="textarea" rows={4} maxLength={100} placeholder="其他备注信息..." />
              )}
            </FormItem>
            <FormItem  {...tailFormItemLayout} className={styles.formitem_sty}>
              <Row gutter={24}>
                <Col span={10}>
                  <Button size="large" type="default" style={{ width: 120}} onClick={handleReset}>重置</Button>
                </Col>
                <Col span={4}>

                </Col>
                <Col span={10}>
                  <Button type="default" style={{ width: 120,color:'white',backgroundColor:'#d1b97f',outLine:'none' }} htmlType="submit" size="large" >提交</Button>
                </Col>
              </Row>
            </FormItem>
          </div>

        </Form>
      </div>
    );
}


export default Form.create()(ProspectusApply);
