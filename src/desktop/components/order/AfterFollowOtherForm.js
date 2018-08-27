import {Select, Form, Row, Col, Input, InputNumber } from 'antd';
import { getCode } from '../../services/code';
import * as service from '../../services/order';

const FormItem = Form.Item;


class AfterFollowOtherForm extends React.Component {

  state = {
    expand: false,
    codeList:{
      currencyCodes:[],
      asCodes:[],
      afterProjectCodes:[]
    },
    followData:[]
  };

  componentWillMount() {
    //售后跟进（售后列表）保单信息
    const params = {
      afterId: this.props.afterId
    };
    this.props.dispatch({
      type: 'order/fetchAfterByAfterId',
      payload: {params},
    });
    service.fetchAfterService(params).then((data) => {
      if(data.success){
        this.props.getOrder(data.rows);
        this.setState({
          followData:data.rows
        })
      }
    });

    //币种快码
    const codeBody = {
      afterProjectCodes : 'ORD.APPLY_CLASS',
      currencyCodes: 'PUB.CURRENCY',
      asCodes: 'ORD.AFTER_STATUS',
    };
    getCode(codeBody).then((data)=>{
      this.setState({
        codeList: data,
      });
    });
  }


  render() {

    const fields = this.state.followData[0]?this.state.followData[0]:{};
    if(this.props.aStatus){
      fields.afterStatus = 'TOAUDIT';
    }
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
    };

    return (
      <Form  onSubmit={this.handleSearch}>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='售后编号' style={{marginBottom:'0'}}>
              {getFieldDecorator('afterNum',{
                initialValue:fields.afterNum?fields.afterNum:''
              })(
                <Input disabled="disabled"/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保单编号' style={{marginBottom:'0'}}>
              {getFieldDecorator('policyNumber',{
                initialValue:fields.policyNumber?fields.policyNumber:''
              })(
                <Input disabled="disabled"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='订单信息' style={{marginBottom:'0'}}>
              {getFieldDecorator('item',{
                initialValue:fields.item?fields.item:''
              })(
                <Input disabled="disabled"/>
              )}
            </FormItem>
          </Col>

          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='渠道' style={{marginBottom:'0'}}>
              {getFieldDecorator('channelName',{
                initialValue:fields.channelName?fields.channelName:''
              })(
                <Input disabled="disabled"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='投保人' style={{marginBottom:'0'}}>
              {getFieldDecorator('applicant',{
                initialValue:fields.applicant?fields.applicant:''
              })(
                <Input disabled="disabled"/>
              )}
            </FormItem>
          </Col>

          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='受保人' style={{marginBottom:'0'}}>
              {getFieldDecorator('insurant',{
                initialValue:fields.insurant?fields.insurant:''
              })(
                <Input disabled="disabled"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='币种' style={{marginBottom:'0'}}>
              {getFieldDecorator('currency',{
                initialValue:fields.currency?fields.currency:''
              })(
                <Select  style={{width:'100%',height:'40px',color:'#000'}} disabled = {true}>
                  {
                    this.state.codeList.currencyCodes &&
                    this.state.codeList.currencyCodes.map((item)=>
                      <Option value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>

          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保费' style={{marginBottom:'0'}}>
              {getFieldDecorator('yearPayAmount',{
                initialValue:fields.yearPayAmount?fields.yearPayAmount:''
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
        </Row>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保额' style={{marginBottom:'0'}}>
              {getFieldDecorator('policyAmount',{
                initialValue:fields.policyAmount?fields.policyAmount:''
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
            <FormItem {...formItemLayout} label='售后项目' style={{marginBottom:'0'}}>
              {getFieldDecorator('afterProject',{
                initialValue:fields.afterProject?fields.afterProject:''
              })(
                <Select disabled={true} style={{color:'#000'}}>
                  {
                    this.state.codeList.afterProjectCodes &&
                    this.state.codeList.afterProjectCodes.map((item)=>
                      <Option value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='项目类型' style={{marginBottom:'0'}}>
              {getFieldDecorator('afterType',{
                initialValue:fields.afterType?fields.afterType:''
              })(
                <Select disabled={true} style={{color:'#000'}}>
                  {
                    this.props.order.codeList.afterTypeCodes &&
                    this.props.order.codeList.afterTypeCodes.map((item)=>
                      <Option value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>

          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='状态' style={{marginBottom:'0'}}>
              {getFieldDecorator('afterStatus',{
                initialValue:fields.afterStatus?fields.afterStatus:''
              })(
                <Select disabled={true} style={{color:'#000'}}>
                  {
                    this.state.codeList.asCodes &&
                    this.state.codeList.asCodes.map((item)=>
                      <Option value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
  
          {
            fields.handleEndDate &&
            <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
              <FormItem {...formItemLayout} label='处理截止日期' style={{marginBottom:'0'}}>
                {getFieldDecorator('handleEndDate',{
                  initialValue: fields.handleEndDate.split(' ')[0]
                })(
                  <Input disabled="disabled"/>
                )}
              </FormItem>
            </Col>
          }
        </Row>
      </Form>
    );
  }

}

AfterFollowOtherForm = Form.create()(AfterFollowOtherForm);

export default AfterFollowOtherForm;
