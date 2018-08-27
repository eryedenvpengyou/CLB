import {Select, InputNumber,Form, Row, Col, Input, Button } from 'antd';
import * as service from '../../services/order';
import { getCode } from '../../services/code';
import CodeOption from '../common/CodeOption';

const FormItem = Form.Item;


class AfterRenewalDetailForm1 extends React.Component {

  state = {
    expand: false,
  };
  constructor(props){
    super(props);
    this.state = {
      afterRenewalDetailData:[],
      codeList:{
        currencyCodes:[],
        asCodes:[]
      }
    }
  }

  componentWillMount() {
    const params = {
      orderId: this.props.orderId
    };
    this.props.dispatch({
      type: 'order/fetchFollowRenewalDetail',
      payload: {params},
    });
    service.fetchFollowRenewalDetailService(params).then((data) => {
      if(data.success){
        this.setState({
          afterRenewalDetailData:data.rows
        },()=>{
          const codeBody = {
            currencyCodes: 'PUB.CURRENCY',
            asCodes: 'ORD.ORDER_STATUS',
            phoneCodeList: 'PUB.PHONE_CODE'
          };
          getCode(codeBody).then((data)=>{
            this.setState({
              codeList: data,
            });
          });
        })
      }
    })
  }


  render() {
    const asListCode = this.state.codeList.asCodes;
    const cListCode = this.state.codeList.currencyCodes;
    const fields = this.state.afterRenewalDetailData[0]?this.state.afterRenewalDetailData[0]:{};
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
    };

    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保单号码' style={{marginBottom:'0'}}>
              {getFieldDecorator('policyNumber',{
                initialValue:fields.policyNumber?fields.policyNumber:''
              })(
                <Input disabled={true}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='产品信息' style={{marginBottom:'0'}}>
              {getFieldDecorator('item',{
                initialValue:fields.item?fields.item:''
              })(
                <Input disabled={true}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='渠道' style={{marginBottom:'0'}}>
              {getFieldDecorator('channelName',{
                initialValue:fields.channelName?fields.channelName:''
              })(
                <Input disabled={true}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='投保人' style={{marginBottom:'0'}}>
              {getFieldDecorator('applicant',{
                initialValue:fields.applicant?fields.applicant:''
              })(
                <Input disabled={true}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='投保人电话' style={{marginBottom:'0'}}>
              {getFieldDecorator('applicantPhone',{
                initialValue:fields.applicantPhone?fields.applicantPhone:''
              })(
                <Input disabled={true}
                       addonBefore= {getFieldDecorator('hkContactCode', {
                         initialValue: fields.applicantPhoneCode || '86',
                       })(
                         <CodeOption disabled={true}
                                     codeList={this.state.codeList.phoneCodeList}
                                     width={125}
                                     placeholder=" "
                         />
                       )}
                />
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='投保人邮箱' style={{marginBottom:'0'}}>
              {getFieldDecorator('applicantEmail',{
                initialValue:fields.applicantEmail?fields.applicantEmail:''
              })(
                <Input disabled={true}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='投保人通讯地址' style={{marginBottom:'0'}}>
              {getFieldDecorator('applicantPostAddress',{
                initialValue:fields.applicantPostAddress?fields.applicantPostAddress:''
              })(
                <Input disabled={true}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='受保人' style={{marginBottom:'0'}}>
              {getFieldDecorator('insurant',{
                initialValue:fields.insurant?fields.insurant:''
              })(
                <Input disabled={true}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='币种' style={{marginBottom:'0'}}>
              {getFieldDecorator('currency',{
                initialValue:fields.currency?fields.currency:''
              })(
                <Select disabled={true} style={{height:'40px',fontSize:'16px',color:'#333'}}>
                  {
                    cListCode &&
                    cListCode.map((item, index)=>
                      <Option value={item.value} key={index}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='主险首期保费' style={{marginBottom:'0'}}>
              {getFieldDecorator('yearPayAmount',{
                initialValue:fields.yearPayAmount?fields.yearPayAmount:''
              })(
                <InputNumber
                  style={{width:'100%',color:"#000"}}
                  formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  min={0} step={0}
                  disabled = {true}
                />
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保额' style={{marginBottom:'0'}}>
              {getFieldDecorator('policyAmount',{
                initialValue:fields.policyAmount || 0
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
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='状态' style={{marginBottom:'0'}}>
              {getFieldDecorator('status',{
                initialValue:fields.status?fields.status:''
              })(
                <Select disabled={true} style={{height:'40px',fontSize:'16px',color:'#333'}}>
                  {
                    asListCode &&
                    asListCode.map((item, index)=>
                      <Option value={item.value} key={index}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

}

AfterRenewalDetailForm1 = Form.create()(AfterRenewalDetailForm1);

export default AfterRenewalDetailForm1;
