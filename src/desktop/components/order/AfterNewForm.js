import {Select, Form, Row, Col, Input, Button } from 'antd';
import Lov from '../common/Lov';
import {validateLov} from '../../utils/common';
import {queryOrdAfterType,queryOrdAfterProject, fetchNewRenewalLov,fetchRPByOId,fetchRPService,fetchAFExit } from '../../services/order';
import { getCode } from '../../services/code';


const FormItem = Form.Item;

class AfterNewForm extends React.Component {

  state = {
    expand: false,
    dataLov:[],
    afterProjectData:[],
    afterTypeData:[],
    afterTypeP:'',
    flagType : true,
    channelFlag : false,
    channelIdData : JSON.parse(localStorage.user).relatedPartyId,
    //快码值
    codeList: {
      afterStatusCodes:[],
      currencyCodes:[],
    }
  };

  componentWillMount() {
    const paramsLov = {
      orderId: this.props.applyOrderId
    };

    if(JSON.parse(localStorage.user).userType == "ADMINISTRATION"){
      this.setState({
        channelFlag:true
      })
    }
      fetchNewRenewalLov(paramsLov)
        .then((data) => {
          if (data.success) {
            if(this.props.afterProject!=0){
              data.rows[0].afterProject = this.props.afterProject
              this.firstSelect(this.props.applyOrderId,this.props.afterProject)
            }
            if(this.props.afterType!=0){
              data.rows[0].afterType = this.props.afterType
            }
            this.setState({
              dataLov: data.rows,
            })
          } else {
            return;
          }
        });
    queryOrdAfterProject(paramsLov)
      .then((data) => {
        if (data.success) {
          if(data.rows){
            let cc = [];
            for(let i = 0; i<data.rows.length;i++){
              let afterProjectObject = {
                value:"",
                meaning:"",
              };
              afterProjectObject.value = data.rows[i].afterProject;
              afterProjectObject.meaning = data.rows[i].applyClass;
              cc.push(afterProjectObject);
            }
            this.setState({
              afterProjectData:cc
            })
          }
        } else {
          return;
        }
      });
    //获取快码值
    let paramsCode ={
      afterProjectCodes : 'ORD.APPLY_CLASS'
    };
    this.props.dispatch({
      type: 'order/fetchCode',
      payload: {paramsCode},
    });
    const codeBody = {
      afterTypeCodesList: 'ORD.AFTER_TYPE',//售后类型
      currencyCodes: 'PUB.CURRENCY',
    };
    getCode(codeBody).then((data)=>{
        this.setState({
          codeList: data,
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
                return;
              }
            });
          //新建售后——续保信息
          fetchRPByOId(params)
            .then((data) => {
              if (data.success) {
                this.props.getRenewalFormList(data.rows);
              } else {
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
                return;
              }
            });
        }
        else {

        }
      let rows = {};
      rows.afterProject =this.props.form.getFieldValue('afterProject');
      rows.afterType =this.props.form.getFieldValue('afterType');
      this.props.getLovValue(this.props.form.getFieldValue('policyNumber').value,rows.afterProject,rows.afterType);
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
          return;
      }
    });
  }

  firstSelect(orderIdParam,value){
    let orderIdParams = orderIdParam;
    this.setState({
      flagType : false
    })
    let params = {
      afterProject: value
    };
    let afterTypeValue = {};
    queryOrdAfterType(params)
      .then((data) => {
        if (data.success) {
          if(data.rows){
            let bb = [];
            for(let i = 0; i<data.rows.length;i++){
              let afterTypeObject = {
                value:"",
                meaning:"",
              };
              afterTypeObject.value = data.rows[i].templateId;
              afterTypeObject.meaning = data.rows[i].afterType;
              if(this.props.afterType != 0){
                  if(this.props.afterType == data.rows[i].afterType){
                    afterTypeValue.value = data.rows[i].templateId;
                    afterTypeValue.meaning = data.rows[i].afterType;
                }
              }
              bb.push(afterTypeObject);
            }

            let rows = {};
            this.props.form.setFieldsValue({'afterType': afterTypeValue.value});
            rows.policyNumber =this.props.form.getFieldValue('policyNumber');
            rows.item =this.props.form.getFieldValue('item');
            rows.channelName =this.props.form.getFieldValue('channelName');
            rows.applicant =this.props.form.getFieldValue('applicant');
            rows.insurant =this.props.form.getFieldValue('insurant');
            rows.currency =this.props.form.getFieldValue('currency');
            rows.yearPayAmount =this.props.form.getFieldValue('yearPayAmount');
            rows.policyAmount =this.props.form.getFieldValue('policyAmount');
            rows.afterProject =value;
            rows.afterType =afterTypeValue.value;
            rows.status =this.props.form.getFieldValue('status');
            if(orderIdParams>0&&rows.afterProject){
              const params = {
                orderId : orderIdParams
              };
              if(rows.afterProject=='RENEWAL'){
                //新建售后——续保产品表格//fetchRenewalProductByOrderId
                fetchRPService(params).then((data) => {
                  if (data.success) {
                    this.props.getRenewalTableList(data.rows);
                  } else {
                    return;
                  }
                });

                //新建售后——续保信息
                fetchRPByOId(params)
                  .then((data) => {
                    if (data.success) {
                      this.props.getRenewalFormList(data.rows);
                    } else {
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
                      return;
                    }
                  });
              }
              else {
              }
            }
            this.props.getLovValue(orderIdParams,rows.afterProject,rows.afterType);
            this.setState({
              afterTypeData: bb,
            });
          }
        } else {
          return;
        }
      });

  }

  changeSelect(value){
    this.setState({
      flagType : false
    })
    let params = {
      afterProject: value
    };
    queryOrdAfterType(params)
      .then((data) => {
        if (data.success) {
          if(data.rows){
            let bb = [];
            for(let i = 0; i<data.rows.length;i++){
              let afterTypeObject = {
                value:"",
                meaning:"",
              };
              afterTypeObject.value = data.rows[i].templateId;
              afterTypeObject.meaning = data.rows[i].afterType;
              bb.push(afterTypeObject);
            }
            this.setState({
              afterTypeData: bb,
            });
          }
        } else {
          return;
        }
      });
    this.props.form.setFieldsValue({'afterType': '' });
    let rows = {};
    if(parseInt(this.props.applyOrderId)>0){
      this.props.form.getFieldValue('policyNumber').value = this.props.applyOrderId
    }
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
                return;
            }
          });

          //新建售后——续保信息
          fetchRPByOId(params)
            .then((data) => {
              if (data.success) {
                this.props.getRenewalFormList(data.rows);
              } else {
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
                return;
              }
          });
        }
        else {
        }
      }
    }
    let orderIdParams;
    if(isNaN(this.props.form.getFieldValue('policyNumber').value)){
      orderIdParams = this.props.orderId
    }else {
      orderIdParams = this.props.form.getFieldValue('policyNumber').value
    }
    this.props.getLovValue(orderIdParams,rows.afterProject,rows.afterType);
  }

  getAfterTypeValue(t,value){
    let rows = {};
    rows.afterProject =t.props.form.getFieldValue('afterProject');
    rows.afterType =value;
    this.setState({
      afterTypeP:value
    })
    let orderIdParams;
    if(isNaN(t.props.form.getFieldValue('policyNumber').value)){
       orderIdParams = t.props.applyOrderId
    }else {
       orderIdParams = t.props.form.getFieldValue('policyNumber').value
    }
    this.props.getLovValue(orderIdParams,rows.afterProject,rows.afterType);
  }

  channelChange(value){
    this.setState({
      channelIdData:value.value,
      channelFlag:false
    });
  }

  render() {
    let flag = true;
    let policyNumberFlag =this.props.form.getFieldValue('policyNumber');
    let afterProjectFlag =this.props.form.getFieldValue('afterProject');
    if(policyNumberFlag){
      if(policyNumberFlag.value){
        flag = false;
      }
    }
    const fields = this.state.dataLov.length? this.state.dataLov[0]:'';
    if(fields){
      fields.afterStatus = this.props.aStatus;
    }
    const { getFieldDecorator } = this.props.form;
    const user = JSON.parse(localStorage.user);

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
    };
    return (
      <Form  onSubmit={this.handleSearch}>
        <Row gutter={40}>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            {
              JSON.parse(localStorage.user).userType == "ADMINISTRATION" &&
              <div>
                <Form.Item label="渠道" {...formItemLayout}>
                  {getFieldDecorator('channelId', {
                    rules: [{
                      required: true,
                      validator: (rule,value,callback) => {
                        if (value && (!value.value || !value.meaning)) {
                          callback('请选择渠道');
                        } else {
                          callback();
                        }
                      }
                    }],
                    initialValue: {value: fields.channelId || JSON.parse(localStorage.user).relatedPartyId, meaning: fields.channelName || ''},
                  })(
                    <Lov disabled={this.props.dFlag} title="选择渠道" lovCode='CNL_AGENCY_NAME' params ={{userId:JSON.parse(localStorage.user).userId}} itemChange={this.channelChange.bind(this)}/>
                  )}
                </Form.Item>
              </div>
            }
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保单编号' style={{marginBottom:'0',color:'#333'}}>
              {getFieldDecorator('policyNumber', {
                rules: [{  validator: validateLov.bind(this)}],
                initialValue: {value:fields?fields.policyNumber:'', meaning:fields?fields.policyNumber:''},
              })(
                <Lov disabled={this.props.dFlag||this.state.channelFlag} lovCode='ORD_ORDER_AFTER' config={true} params={{codeName:'PUB.IL_BANK',channelId:this.state.channelIdData}} itemChange={this.itemChange.bind(this)}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='订单信息' style={{marginBottom:'0'}}>
              {getFieldDecorator('item',{
                initialValue:fields?fields.item:''
              })(
                <Input disabled={true}/>
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
                <Input disabled={true}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='投保人' style={{marginBottom:'0'}}>
              {getFieldDecorator('applicant',{
                initialValue:fields?fields.applicant:''
              })(
                <Input disabled={true}/>
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
                <Input disabled={true}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='币种' style={{marginBottom:'0'}}>
              {getFieldDecorator('currency',{
                initialValue:fields?fields.currency:''
              })(
                <Select  style={{width:'100%',height:'40px',color:'#333'}} disabled = {true}>
                  {
                    this.state.codeList.currencyCodes &&
                    this.state.codeList.currencyCodes.map((item, index)=>
                      <Option value={item.value} key={index}>{item.meaning}</Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='主险首期保费' style={{marginBottom:'0'}}>
              {getFieldDecorator('yearPayAmount',{
                initialValue:fields?fields.yearPayAmount:''
              })(
                <Input disabled={true}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='保额' style={{marginBottom:'0'}}>
              {getFieldDecorator('policyAmount',{
                initialValue:fields?fields.policyAmount:''
              })(
                <Input disabled={true}/>
              )}
            </FormItem>
          </Col>

          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='首期保监征费' style={{marginBottom:'0'}}>
              {getFieldDecorator('iaLevies',{
                initialValue: fields.iaLevies || ''
              })(
                <Input
                  style={{width:'100%',color:'#333'}}
                  // formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  // parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  // min={0} step={0}
                  disabled={true}
                />
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='首期总保费' style={{marginBottom:'0'}}>
              {getFieldDecorator('firstSumPremium',{
                initialValue:fields.firstSumPremium || ''
              })(
                <Input
                  style={{width:'100%',color:'#333'}}
                  // formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  // parser={value => value &&  value.toString().replace(/\$\s?|(,*)/g, '')}
                  // min={0} step={0}
                  disabled={true}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='售后项目' style={{marginBottom:'0'}}>
              {getFieldDecorator('afterProject',{
                rules: [{ required: true, message: '请选择售后项目', whitespace: true }],
                initialValue:fields?fields.afterProject:undefined
              })(
                <Select disabled={flag||this.props.dFlag} onChange={this.changeSelect.bind(this)} style={{color:'#333'}}>
                  {
                    this.state.afterProjectData &&
                    this.state.afterProjectData.map((item, index)=>
                      <Select.Option value={item.value.toString()} key={index}>{item.meaning}</Select.Option>
                    )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={10} style={{paddingLeft:'0',paddingRight:'0'}}>
            <FormItem {...formItemLayout} label='项目类型' style={{marginBottom:'0'}}>
              {getFieldDecorator('afterType',{
                rules: [{ required: true, message: '请选择项目类型', whitespace: true,}],
                initialValue:fields?fields.afterType:undefined,
              })(
                <Select disabled={this.state.flagType||this.props.dFlag} onChange={this.getAfterTypeValue.bind(this,this)} style={{color:'#333'}}>
                  {
                    this.state.afterTypeData &&
                    this.state.afterTypeData.map((item, index)=>
                      <Select.Option value={item.value.toString()} key={index}>{item.meaning}</Select.Option>
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
              {getFieldDecorator('afterStatus',{
                initialValue:fields?fields.afterStatus:''
              })(
                <Input disabled={true}/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

}



export default AfterNewForm;
