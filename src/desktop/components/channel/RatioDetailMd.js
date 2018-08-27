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


class RatioDetailMd extends React.Component {

  constructor(props) {
    super(props);
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
      }
    }
  }
  //提交
  modalSubmit() {
    this.props.form.validateFields((err, values) => {
      if(!err){
        values.bigClassName = values.bigClass? values.bigClass.meaning? values.bigClass.meaning : null : null;
        values.bigClass = values.bigClass? values.bigClass.value? values.bigClass.value : null : null;

        values.midClassName = values.midClass? values.midClass.meaning? values.midClass.meaning : null : null;
        values.midClass = values.midClass? values.midClass.value? values.midClass.value : null : null;

        values.minClassName = values.minClass? values.minClass.meaning? values.minClass.meaning : null : null;
        values.minClass = values.minClass? values.minClass.value? values.minClass.value : null : null;

        values.itemName = values.itemId? values.itemId.meaning? values.itemId.meaning : null : null;
        values.itemId = values.itemId? values.itemId.value? values.itemId.value : null : null;

        values.sublineItemName = values.sublineItemId? values.sublineItemId.meaning? values.sublineItemId.meaning : null : null;
        values.sublineItemId = values.sublineItemId? values.sublineItemId.value? values.sublineItemId.value : null : null;

        
        let flag = false
        if(this.props.record.__status === 'add'|| this.props.record.__status === 'update'){
          //校验佣金分成不能重复
          if(this.props.record.__status === 'update' &&
            this.props.record.bigClass === values.bigClass && 
            this.props.record.midClass === values.midClass &&
            this.props.record.minClass === values.minClass &&
            this.props.record.itemId === values.itemId &&
            this.props.record.sublineItemId === values.sublineItemId && 
            this.props.record.theFirstYear === values.theFirstYear &&
            this.props.record.theSecondYear === values.theSecondYear &&
            this.props.record.theThirdYear === values.theThirdYear &&
            this.props.record.theFourthYear === values.theFourthYear &&
            this.props.record.theFifthYear === values.theFifthYear &&
            this.props.record.theSixthYear === values.theSixthYear &&
            this.props.record.theSeventhYear === values.theSeventhYear &&
            this.props.record.theEightYear === values.theEightYear &&
            this.props.record.theNinthYear === values.theNinthYear &&
            this.props.record.theTenthYear === values.theTenthYear &&
            this.props.record.comments === values.comments ) {
             flag = true;
          }
          else{
            let dataSource = this.props.dataSource || [], sameFlag = false;
            dataSource.map((item,idx)=>{
              if(item.bigClass === values.bigClass && item.midClass === values.midClass && item.minClass === values.minClass && 
                item.itemId === values.itemId && item.sublineItemId === values.sublineItemId ){
                  sameFlag = true;
                }
            });
          }
        }
        let record = this.props.record || {};
        for(let f in values){
          record[f] = values[f];
        }
        this.props.callback(record,flag);
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
                   // required: true,
                   // validator: (rule,value,callback) => {
                     // if (value && (!value.value || !value.meaning)) {
                     //   callback('请选择产品大分类');
                     // } else {
                     //   callback();
                     // }
                    //}
                 // }],
                  initialValue:{value: record.bigClass || '', meaning: record.bigClassName || ''}
                })(
                  <Lov suffix={true} lovCode='PRD_DIVISION' itemChange={this.itemChange.bind(this, 'bigClass')}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="产品中分类" >
                {getFieldDecorator('midClass',{
                  initialValue:{value: record.midClass || '', meaning: record.midClassName || ''}
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
                  initialValue:{value: record.minClass || '', meaning: record.minClassName || ''}
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
                {getFieldDecorator('sublineItemId',{
                  initialValue:{value: record.sublineItemId || '', meaning: record.sublineItemName || ''},
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
                {getFieldDecorator('theFirstYear',{
                  rules: [],
                  initialValue:record.theFirstYear || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第二年(%)" >
                {getFieldDecorator('theSecondYear',{
                  rules: [],
                  initialValue:record.theSecondYear || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第三年(%)" >
                {getFieldDecorator('theThirdYear',{
                  rules: [],
                  initialValue:record.theThirdYear || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第四年(%)" >
                {getFieldDecorator('theFourthYear',{
                  rules: [],
                  initialValue:record.theFourthYear || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第五年(%)" >
                {getFieldDecorator('theFifthYear',{
                  rules: [],
                  initialValue:record.theFifthYear || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第六年(%)" >
                {getFieldDecorator('theSixthYear',{
                  rules: [],
                  initialValue:record.theSixthYear || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第七年(%)" >
                {getFieldDecorator('theSeventhYear',{
                  rules: [],
                  initialValue:record.theSeventhYear || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第八年(%)" >
                {getFieldDecorator('theEightYear',{
                  rules: [],
                  initialValue:record.theEightYear || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第九年(%)" >
                {getFieldDecorator('theNinthYear',{
                  rules: [],
                  initialValue:record.theNinthYear || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第十年(%)" >
                {getFieldDecorator('theTenthYear',{
                  rules: [],
                  initialValue:record.theTenthYear || 0,
                })(
                  <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="分成备注" >
                {getFieldDecorator('comments',{
                  rules: [],
                  initialValue:record.comments || '',
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


export default RatioDetailMd;
