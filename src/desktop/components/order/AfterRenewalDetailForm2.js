import { Form, Row, Col, Input, Button,Checkbox,InputNumber,Select } from 'antd';
import { getCode } from '../../services/code';
import { dataFormat } from '../../utils/common';
import * as service from '../../services/order';
const FormItem = Form.Item;


class AfterRenewalDetailForm2 extends React.Component {

  state = {
    expand: false,
    RIBOList:[],
    check1Falg:false,
    check2Falg:false,
    codeList:{
      balancePaymentMethodCodes: [],
      payMethodCodes: [],
    }
  };

  componentWillMount() {
    const params = {
      orderId: this.props.orderId
    };
    service.queryRenewalInfoByOrderIdService(params).then((data) => {
      if(data.success){
        this.setState({
          RIBOList: data.rows
        },()=>{
          if(this.state.RIBOList){
            if(this.state.RIBOList[0] && this.state.RIBOList[0].ddaFlag=='Y'){
              this.setState({
                check1Falg:true
              })
            }
            if(this.state.RIBOList[0] &&this.state.RIBOList[0].increaseFlag=='Y'){
              this.setState({
                check2Falg:true
              })
            }
          }
        })
      }
    });
    const codeBody = {
      balancePaymentMethodCodes: 'ORD.BALANCE_PAY_METHOD',
      payMethodCodes: 'CMN.PAY_METHOD',
      ddaStatus: 'ORD.DDA_STATUS'
    };
    getCode(codeBody).then((data)=>{
      this.setState({
        codeList: data
      });
    });
  }

  render() {
    const pmsListCode = this.state.codeList.payMethodCodes;
    const bpmListCode = this.state.codeList.balancePaymentMethodCodes;
    const ddaStatus = this.state.codeList.ddaStatus;

    const fields = this.state.RIBOList[0]?this.state.RIBOList[0]:{};
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
    };

    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={40} >
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='客户编号' style={{marginBottom:'0'}}>
              {getFieldDecorator('customerNumber',{
                initialValue:fields.customerNumber?fields.customerNumber:''
              })(
                <Input disabled={true} />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='納费编号' style={{marginBottom:'0'}}>
              {getFieldDecorator('payNumber',{
                initialValue:fields.payNumber?fields.payNumber:''
              })(
                <Input disabled={true} />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保费递增' style={{marginBottom:'0'}}>
              {getFieldDecorator('increaseFlag', {
                initialValue: fields.increaseFlag === 'Y'
              })(
                <Select disabled={true} style={{color:'#333'}}>
                  <Option value={true} >是</Option>
                  <Option value={false} >否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='首期保费日' style={{marginBottom:'0'}}>
              {getFieldDecorator('firstPayDate',{
                initialValue:fields.firstPayDate?dataFormat(fields.firstPayDate):''
              })(
                <Input disabled={true} />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保单生效日' style={{marginBottom:'0'}}>
              {getFieldDecorator('effectiveDate',{
                initialValue:fields.effectiveDate?dataFormat(fields.effectiveDate):''
              })(
                <Input disabled={true} />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保费到期日' style={{marginBottom:'0'}}>
              {getFieldDecorator('renewalDueDate',{
                initialValue:fields.renewalDueDate?dataFormat(fields.renewalDueDate):''
              })(
                <Input disabled={true} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='回馈余额' style={{marginBottom:'0'}}>
              {getFieldDecorator('feedbackBalance',{
                initialValue:fields.feedbackBalance || 0
              })(
                <InputNumber
                  style={{width:'100%'}}
                  formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  min={0} step={0}
                  disabled = {true}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='账户余额' style={{marginBottom:'0'}}>
              {getFieldDecorator('accountBalance',{
                initialValue:fields.accountBalance || 0
              })(
                <InputNumber
                  style={{width:'100%'}}
                  formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  min={0} step={0}
                  disabled = {true}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='缴费方式' style={{marginBottom:'0'}}>
              {getFieldDecorator('payMethod',{
                initialValue:fields.payMethod?fields.payMethod:''
              })(
                <Select disabled={true} style={{color:'#333'}}>
                  {
                    pmsListCode &&
                    pmsListCode.map((item, index)=>
                      <Option value={item.value} key={index}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='付款方法' style={{marginBottom:'0'}}>
              {getFieldDecorator('balancePaymentMethod',{
                initialValue:fields.balancePaymentMethod?fields.balancePaymentMethod:''
              })(
                <Select disabled={true} style={{color:'#333'}}>
                  {
                    bpmListCode &&
                    bpmListCode.map((item, index)=>
                      <Option value={item.value} key={index}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          {
            fields.balancePaymentMethod === 'AUTOPAY' &&
            <div style={{padding: 0}}>
              <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label='DDA状态' style={{marginBottom:'0'}}>
                  {getFieldDecorator('ddaFlag', {
                    initialValue:fields.ddaFlag || ''
                  })(
                    <Select disabled={true} style={{color: '#333'}}>
                      {
                        ddaStatus &&
                        ddaStatus.map((item, index)=>
                          <Option value={item.value} key={index}>{item.meaning}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              {
                fields.ddaFlag === 'DDA_SUCCESS' &&
                <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} label='DDA提交日期' style={{marginBottom:'0'}}>
                    {getFieldDecorator('ddaSubmitDate',{
                      initialValue:fields.ddaSubmitDate?dataFormat(fields.ddaSubmitDate):''
                    })(
                      <Input disabled={true} style={{color:'#333'}} />
                    )}
                  </FormItem>
                </Col>
              }
              {
                fields.ddaFlag === 'DDA_SUCCESS' &&
                <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} label='DDA生效日期' style={{marginBottom:'0'}}>
                    {getFieldDecorator('ddaEffectiveDate',{
                      initialValue:fields.ddaEffectiveDate?dataFormat(fields.ddaEffectiveDate):''
                    })(
                      <Input disabled={true} style={{color:'#333'}}/>
                    )}
                  </FormItem>
                </Col>
              }
              {
                fields.ddaFlag === 'DDA_SUCCESS' &&
                <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} label='DDA账户号码' style={{marginBottom:'0'}}>
                    {getFieldDecorator('ddaAccountNo',{
                      initialValue:fields.ddaAccountNo || ''
                    })(
                      <Input disabled={true} style={{color:'#333'}}/>
                    )}
                  </FormItem>
                </Col>
              }
              {
                fields.ddaFlag === 'DDA_SUCCESS' &&
                <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} label='DDA自动转账日期' style={{marginBottom:'0'}}>
                    {getFieldDecorator('ddaAutoTransferDate',{
                      initialValue:fields.ddaAutoTransferDate || ''
                    })(
                      <Input disabled={true} style={{color:'#333'}}/>
                    )}
                  </FormItem>
                </Col>
              }
              {
                fields.ddaFlag === 'DDA_FAIL' &&
                <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
                  <FormItem {...formItemLayout} label='DDA失败原因' style={{marginBottom:'0'}}>
                    {getFieldDecorator('ddaFailCause',{
                      initialValue:fields.ddaFailCause || ''
                    })(
                      <Input disabled={true} style={{color:'#333'}}/>
                    )}
                  </FormItem>
                </Col>
              }

            </div>
          }
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='本期保监征费' style={{marginBottom:'0'}}>
              {getFieldDecorator('nextIaLevies',{
                initialValue:fields.nextIaLevies || 0
              })(
                <Input disabled={true} style={{color:'#333'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='本期续保总保费' style={{marginBottom:'0'}}>
              {getFieldDecorator('nextPolicyAmount',{
                initialValue:fields.nextPolicyAmount || 0
              })(
                <Input disabled={true} style={{color:'#333'}}/>
              )}
            </FormItem>
          </Col>
        </Row>


      </Form>
    );
  }

}

AfterRenewalDetailForm2 = Form.create()(AfterRenewalDetailForm2);

export default AfterRenewalDetailForm2;
