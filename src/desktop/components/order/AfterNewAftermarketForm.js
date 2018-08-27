import {Select, Form, Row, Col, Input, Button } from 'antd';
import Lov from '../common/Lov';
import {validateLov} from '../../utils/common';
import { fetchNewRenewalLov,fetchRPByOId,fetchRPService,fetchAFExit } from '../../services/order';
import { getCode } from '../../services/code';

const FormItem = Form.Item;

class AfterNewAftermarketForm extends React.Component {

  state = {
    expand: false,
    dataLov:[],


    //快码值
    codeList: {
      afterProjectCodesList:[],
      afterTypeCodesList:[],
      afterStatusCodes:[],
    },
    codes:{
      afterProjectCodesList:[],
      afterTypeCodesList:[],
      afterStatusCodes:[],
    },
  };

  componentWillMount() {
    const paramsLov = {
      orderId: this.props.applyOrderId
    };
    fetchNewRenewalLov(paramsLov)
      .then((data) => {
        if (data.success) {
          this.setState({
            dataLov: data.rows,
          });
        } else {
          message.warn(data.message);
          return;
        }
      });
    //获取快码值
    const codeBody = {
      afterProjectCodesList: 'ORD.AFTER_PROJECT',//售后项目
      afterStatusCodes: 'ORD.AFTER_STATUS',//售后状态
      afterTypeCodesList: 'ORD.AFTER_TYPE',//售后类型
    };
    getCode(codeBody).then((data)=>{
      this.setState({
        codeList: data,
      });
    });

    getCode(codeBody).then((data)=>{
      this.setState({
        codes:data,
      });
    });
  }


  itemChange(value){
    const paramsLov = {
      orderId: value.value
    };
    let afterProjectValue =this.props.form.getFieldValue('afterProject');
    if(afterProjectValue&&value.value){
      const params = {
        orderId : value.value
      };
      if(afterProjectValue=='RENEWAL'){
        //新建售后——续保产品表格//fetchRenewalProductByOrderId
        fetchRPService(params)
          .then((data) => {
            if (data.success) {
              this.props.getRenewalTableList(data.rows);
            } else {
              message.warn(data.message);
              return;
            }
          });

        //新建售后——续保信息
        fetchRPByOId(params)
          .then((data) => {
            if (data.success) {
              this.props.getRenewalFormList(data.rows);
            } else {
              message.warn(data.message);
              return;
            }
          });
      }
      else if(afterProjectValue=='EXIT'){
        //退保项目表格接口//fetchAfterFollowExitByOrderId
        fetchAFExit(params)
          .then((data) => {
            if (data.success) {
              this.props.getExitTableList(data.rows);
            } else {
              message.warn(data.message);
              return;
            }
          });
      }
      else {

      }
    }

    if(this.props.form.getFieldValue('afterProject')){
      this.changeSelect(this.props.form.getFieldValue('afterProject'))
    }
    fetchNewRenewalLov(paramsLov)
      .then((data) => {
        if (data.success) {
          this.setState({
            dataLov: data.rows,
          });
        } else {
          message.warn(data.message);
          return;
        }
      });
  }

  changeSelect(value){
    let rows = {};
    rows.policyNumber =this.props.form.getFieldValue('policyNumber');
    rows.item =this.props.form.getFieldValue('item');
    rows.channelName =this.props.form.getFieldValue('channelName');
    rows.applicant =this.props.form.getFieldValue('applicant');
    rows.insurant =this.props.form.getFieldValue('insurant');
    rows.currency =this.props.form.getFieldValue('currency');
    rows.yearPayAmount =this.props.form.getFieldValue('yearPayAmount');
    rows.policyAmount =this.props.form.getFieldValue('policyAmount');
    rows.afterProject =value;
    rows.afterType =this.props.form.getFieldValue('afterType');
    rows.status =this.props.form.getFieldValue('status');

    const atCodes =this.state.codes.afterTypeCodesList;
    let atcList = [];
    let changeList = this.state.codeList;
    if (rows.afterProject=='RENEWAL'){
      for(let i=0;i<atCodes.length;i++){
        if(atCodes[i].value=='XB'){
          atcList.push(atCodes[i]);
        }
      }
    }
    else if(rows.afterProject=='EXIT'){
      for(let i=0;i<atCodes.length;i++){
        if(atCodes[i].value=='TB'){
          atcList.push(atCodes[i]);
        }
      }
    }
    else if(rows.afterProject=='REGAIN'){
      for(let i=0;i<atCodes.length;i++){
        if(atCodes[i].value=='BDFX'){
          atcList.push(atCodes[i]);
        }
      }
    }
    else if(rows.afterProject=='DIVIDEND'){
      for(let i=0;i<atCodes.length;i++){
        if(atCodes[i].value=='TQHL'){
          atcList.push(atCodes[i]);
        }
      }
    }
    else if(rows.afterProject=='INFO'){
      for(let i=0;i<atCodes.length;i++){
        if(atCodes[i].value=='GGDZ'||atCodes[i].value=='GGSYR'||atCodes[i].value=='	GGTBR'){
          atcList.push(atCodes[i]);
        }
      }
    }
    else if(rows.afterProject=='CLAIMS'){
      for(let i=0;i<atCodes.length;i++){
        if(atCodes[i].value=='ZLLP'||atCodes[i].value=='ZYLP'){
          atcList.push(atCodes[i]);
        }
      }
    }
    else{
    }
    this.props.form.setFieldsValue({'afterType': '' });
    changeList.afterTypeCodesList = atcList;
    this.setState({
      codeList: changeList
    });



    this.props.dispatch({
      type: 'order/fetchNewRenewalSelect',
      payload: {rows},
    });
    if(rows.policyNumber&&rows.afterProject){
      if(rows.policyNumber.value&&rows.afterProject){
        const params = {
          orderId : rows.policyNumber.value
        };
        if(rows.afterProject=='RENEWAL'){
          //新建售后——续保产品表格//fetchRenewalProductByOrderId
          fetchRPService(params)
            .then((data) => {
              if (data.success) {
                this.props.getRenewalTableList(data.rows);
              } else {
                message.warn(data.message);
                return;
              }
            });

          //新建售后——续保信息
          fetchRPByOId(params)
            .then((data) => {
              if (data.success) {
                this.props.getRenewalFormList(data.rows);
              } else {
                message.warn(data.message);
                return;
              }
            });
        }
        else if(rows.afterProject=='EXIT'){
          //退保项目表格接口//fetchAfterFollowExitByOrderId
          fetchAFExit(params)
            .then((data) => {
              if (data.success) {
                this.props.getExitTableList(data.rows);
              } else {
                message.warn(data.message);
                return;
              }
            });
        }
        else {

        }
      }
    }
    this.props.getLovValue(this.props.form.getFieldValue('policyNumber').value,rows.afterProject,rows.afterType);
  }


  render() {
    const fields = this.state.dataLov.length? this.state.dataLov[0]:'';

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
    };

    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保单编号' style={{marginBottom:'0'}}>
              {getFieldDecorator('policyNumber', {
                rules: [{  validator: validateLov.bind(this)}],
                initialValue: {value:fields?fields.policyNumber:'', meaning:fields?fields.policyNumber:''},
              })(
                <Lov width='100%'lovCode='ORD_ORDERDETAIL' params={{codeName:'PUB.IL_BANK'}} itemChange={this.itemChange.bind(this)}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='订单信息' style={{marginBottom:'0'}}>
              {getFieldDecorator('item',{
                initialValue:fields?fields.item:''
              })(
                <Input disabled="disabled"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='渠道' style={{marginBottom:'0'}}>
              {getFieldDecorator('channelName',{
                initialValue:fields?fields.channelName:''
              })(
                <Input disabled="disabled"/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='投保人' style={{marginBottom:'0'}}>
              {getFieldDecorator('applicant',{
                initialValue:fields?fields.applicant:''
              })(
                <Input disabled="disabled"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='受保人' style={{marginBottom:'0'}}>
              {getFieldDecorator('insurant',{
                initialValue:fields?fields.insurant:''
              })(
                <Input disabled="disabled"/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='币种' style={{marginBottom:'0'}}>
              {getFieldDecorator('currency',{
                initialValue:fields?fields.currency:''
              })(
                <Input disabled="disabled"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保费' style={{marginBottom:'0'}}>
              {getFieldDecorator('yearPayAmount',{
                initialValue:fields?fields.yearPayAmount:''
              })(
                <Input disabled="disabled"/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保额' style={{marginBottom:'0'}}>
              {getFieldDecorator('policyAmount',{
                initialValue:fields?fields.policyAmount:''
              })(
                <Input disabled="disabled"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='售后项目' style={{marginBottom:'0'}}>
              {getFieldDecorator('afterProject',{
                initialValue:fields?fields.afterProject:''
              })(
                <Select onChange={this.changeSelect.bind(this)}>
                  {
                    this.state.codeList.afterProjectCodesList &&
                    this.state.codeList.afterProjectCodesList.map((item)=>
                      <Option value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='项目类型' style={{marginBottom:'0'}}>
              {getFieldDecorator('afterType',{
                initialValue:fields?fields.afterType:''
              })(
                <Select >
                {
                    this.state.codeList.afterTypeCodesList &&
                    this.state.codeList.afterTypeCodesList.map((item)=>
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
            <FormItem {...formItemLayout} label='状态' style={{marginBottom:'0'}}>
              {getFieldDecorator('status',{
                initialValue:fields?fields.status:''
              })(
                <Input  disabled="disabled"/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

AfterNewAftermarketForm = Form.create()(AfterNewAftermarketForm);

export default AfterNewAftermarketForm;
