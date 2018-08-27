/**
 * created by xiaoyong.luo at 2017/09/14 14:27
 */

import React from 'react';
import { Modal, Checkbox,Button, Form,Input,InputNumber,Table, Cascader} from 'antd';
import moment from 'moment';
import * as common from '../../utils/common';
import * as styles from '../login/modal.css';
import Modals from '../common/modal/Modal';
import Lov from '../common/Lov';
import * as codeService from '../../services/code';
import * as service from '../../services/channel';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 18 },
  },
};
class PsCtCommisionMd extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      arrAdd:[],
      bigFlag:{},
      midFlag:{},
      minFlag:{}
    }
  }
  componentWillMount(){
    //渠道详情-合约详情获取已有自定义分类
    if(location.href.split('/')[6]&&location.href.split('/')[7]){
      var personalRateParams = {
        channelId: location.href.split('/')[6],
        channelContractId: location.href.split('/')[7],
        defineRateFlag: 'Y',
        page: 1,
        pagesize: 999999999
      }
      service.personalRate(personalRateParams).then((data) => {
        if (data.success) {
          let dataList = data.rows || [];
          dataList.map((item, index) => {
            //查重
            this.state.arrAdd.push({
              bigClass: item.bigClass,
              midClass: item.midClass,
              minClass: item.minClass,
              itemId: item.itemId,
              sublineId: item.sublineId
            });
          })
        }
      })
    }
  }

  itemChange(type, value){
    if (value && value.value && value.meaning && value.record) {
      if(type==='bigClass'){
        this.props.form.setFieldsValue({
          midClass: {value:'', meaning:''},
          minClass: {value:'', meaning:''},
          itemId:{value:'', meaning:''}
        });
      }else if(type==='midClass'){
        this.props.form.setFieldsValue({
          minClass: {value:'', meaning:''},
          itemId:{value:'', meaning:''}
        });
      } else if(type === 'itemId'){
        this.state.bigFlag = {value: value.record.bigClass,meaning:value.record.bigClassName}
        if(value.record.midClassName){
          this.props.form.setFieldsValue({
            midClass: {value: value.record.midClass,meaning:value.record.midClassName},
           })
           this.state.midFlag = {value: value.record.midClass,meaning:value.record.midClassName}
        }else{
          this.props.form.setFieldsValue({
            midClass: {value: '',meaning:''},
           })
        }
        if(value.record.minClassName){
          this.props.form.setFieldsValue({
            minClass: {value: value.record.minClass,meaning:value.record.minClassName},
           })
           this.state.minFlag = {value: value.record.minClass,meaning:value.record.minClassName}
        }else{
          this.props.form.setFieldsValue({
            minClass: {value:'', meaning:''},
          })
        }
      }
    }
  }

  //提交
  modalSubmit() {    
    //选择产品名称时 中小分类必显示
    if(this.props.form.getFieldValue(`itemId`).value && this.props.form.getFieldValue(`itemId`).meaning){
      this.props.form.setFieldsValue({
        bigClass: this.state.bigFlag,
        midClass: this.state.midFlag,
        minClass: this.state.minFlag
      })
    }
    this.props.form.validateFields((err, values) => {
      if(!err){
        values.bigClassDesc = values.bigClass? values.bigClass.meaning? values.bigClass.meaning : null : null;
        values.bigClass = values.bigClass? values.bigClass.value? values.bigClass.value : null : null;

        values.midClassDesc = values.midClass? values.midClass.meaning? values.midClass.meaning : null : null;
        values.midClass = values.midClass? values.midClass.value? values.midClass.value : null : null;

        values.minClassDesc = values.minClass? values.minClass.meaning? values.minClass.meaning : null : null;
        values.minClass = values.minClass? values.minClass.value? values.minClass.value : null : null;

        values.itemName = values.itemId? values.itemId.meaning? values.itemId.meaning : null : null;
        values.itemId = values.itemId? values.itemId.value? values.itemId.value : null : null;

        values.sublineItemName = values.sublineId? values.sublineId.meaning? values.sublineId.meaning : null : null;
        values.sublineId = values.sublineId? values.sublineId.value? values.sublineId.value : null : null;

        let record = this.props.record || {};
        for(let f in values){
          record[f] = values[f];
        }
        this.props.callback(record);
        this.props.form.resetFields();
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const record = this.props.record || {};

    return (
      <div>
        <Modal
          title='佣金分成'
          width='40%'
          style={{top:30}}
          maskClosable={false}
          closable={true}
          footer={null}
          visible={this.props.visible}
          onCancel={this.props.callback}
        >
          <Form>
            <div className={styles.phonecheck_content} style={{height:520,overflowY:'scroll'}}>
              <FormItem {...formItemLayout} label="产品大分类" >
                {getFieldDecorator('bigClass',{
                  //rules: [{
                    //required: true,
                    //validator: (rule,value,callback) => {
                      //if (value && (!value.value || !value.meaning)) {
                        //callback('请选择产品大分类');
                      //} else {
                        //callback();
                      //}
                    //}
                  //}],
                  initialValue:{value: record.bigClass || '', meaning: record.bigClassDesc || ''}
                })(
                  <Lov suffix={true} lovCode='PRD_DIVISION' itemChange={this.itemChange.bind(this, 'bigClass')}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="产品中分类" >
                {getFieldDecorator('midClass',{
                  initialValue:{value: record.midClass || '', meaning: record.midClassDesc || ''}
                })(
                  <Lov
                    suffix={true}
                    lovCode='PRD_CLASS'
                    itemChange={this.itemChange.bind(this, 'midClass')}
                    params ={{
                      className1: getFieldValue('bigClass')? getFieldValue('bigClass').value? getFieldValue('bigClass').value :'NULL' :'NULL',
                    }}
                  />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="产品小分类" >
                {getFieldDecorator('minClass',{
                  initialValue:{value: record.minClass || '', meaning: record.minClassDesc || ''}
                })(
                  <Lov
                    suffix={true}
                    lovCode='PRD_CATAGORY'
                    params ={{
                      className1: getFieldValue('bigClass')? getFieldValue('bigClass').value? getFieldValue('bigClass').value :'NULL' :'NULL',
                      className2: getFieldValue('midClass')? getFieldValue('midClass').value? getFieldValue('midClass').value :'NULL' :'NULL',
                    }}
                  />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="产品名称" >
                {getFieldDecorator('itemId',{
                  initialValue:{value: record.itemId || '', meaning: record.itemName || ''},
                })(
                  <Lov
                    suffix={true}
                    lovCode='PRD_ITEM_PROTAL'
                    itemChange={this.itemChange.bind(this,'itemId')}
                    params ={{
                      bigClass: getFieldValue('bigClass')? getFieldValue('bigClass').value? getFieldValue('bigClass').value :'NULL' :'NULL',
                      midClass: getFieldValue('midClass')? getFieldValue('midClass').value? getFieldValue('midClass').value :'' :'',
                      minClass: getFieldValue('minClass')? getFieldValue('minClass').value? getFieldValue('minClass').value :'' :'',
                      channelId: this.props.partyId,
                    }}
                  />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="供款期" >
                {getFieldDecorator('sublineId',{
                  initialValue:{value: record.sublineId || '', meaning: record.sublineItemName || ''},
                })(
                  <Lov
                    suffix={true}
                    lovCode='ORD_SUBLINE'
                    params={{
                      itemId: getFieldValue('itemId')? getFieldValue('itemId').value? getFieldValue('itemId').value :-1 :-1,
                    }}
                  />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第一年(%)" >
                {getFieldDecorator('rate1',{
                  rules: [],
                  initialValue:record.rate1 || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第二年(%)" >
                {getFieldDecorator('rate2',{
                  rules: [],
                  initialValue:record.rate2 || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第三年(%)" >
                {getFieldDecorator('rate3',{
                  rules: [],
                  initialValue:record.rate3 || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第四年(%)" >
                {getFieldDecorator('rate4',{
                  rules: [],
                  initialValue:record.rate4 || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第五年(%)" >
                {getFieldDecorator('rate5',{
                  rules: [],
                  initialValue:record.rate5 || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第六年(%)" >
                {getFieldDecorator('rate6',{
                  rules: [],
                  initialValue:record.rate6 || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第七年(%)" >
                {getFieldDecorator('rate7',{
                  rules: [],
                  initialValue:record.rate7 || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第八年(%)" >
                {getFieldDecorator('rate8',{
                  rules: [],
                  initialValue:record.rate8 || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第九年(%)" >
                {getFieldDecorator('rate9',{
                  rules: [],
                  initialValue:record.rate9 || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第十年(%)" >
                {getFieldDecorator('rate10',{
                  rules: [],
                  initialValue:record.rate10 || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="分成备注" >
                {getFieldDecorator('performanceRequire',{
                  rules: [],
                  initialValue:record.performanceRequire || '',
                })(
                  <Input style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="调整记录" >
                {getFieldDecorator('specialDesc',{
                  rules: [],
                  initialValue:record.specialDesc || '',
                })(
                  <Input style={{width:'100%'}}/>
                )}
              </FormItem>
            </div>

            <div style={{textAlign:'center',marginBottom:'20px'}}>
              <Button onClick={this.modalSubmit.bind(this)} type="primary" style={{ width:'120px',height:'38px'}} >确定</Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}


export default Form.create()(PsCtCommisionMd);
