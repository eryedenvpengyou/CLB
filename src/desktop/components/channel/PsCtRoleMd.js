/**
 * created by xiaoyong.luo at 2017/07/09 21:27
 */

import React from 'react';
import { Modal,Button, Form,InputNumber,Select} from 'antd';
import moment from 'moment';
import Lov from '../common/Lov';
import { indexOf } from 'lodash';
import * as styles from '../login/modal.css';
import Modals from '../common/modal/Modal';

const FormItem = Form.Item;
const Option = Select.Option;
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


class PsCtRoleMd extends React.Component {

  constructor(props) {
    super(props);
  }

  //提交
  submit() {
    this.props.form.validateFields((err, values) => {
      if(!err){
        console.log(values);
        let record = this.props.record || {};
        for(let f in values){
          record[f] = values[f];
        }

        if(values.role === "INTRODUCER"){
          record.roleUserId = values.name ? values.name.value? values.name.value: null : null;
          record.name = values.name ? values.name.meaning? values.name.meaning: null : null;
        }else{
          record.roleUserId = values.name2 ? values.name2.value? values.name2.value: null : null;
          record.name = values.name2 ? values.name2.meaning? values.name2.meaning: null : null;
        }

        if(values.role === 'ADMINISTRATION' || values.role === 'AGENCY'){
          record.benefit = 0;
        }

        this.props.callback(record);
        this.props.form.resetFields();
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const roles = ['SAM', 'AGENCY','ADMINISTRATION'];
    let record = this.props.record || {};
    let disabledFlag = true;
    return (
      <div >
        <Modal
          width={650}
          style={{top:80}}
          visible={this.props.visible}
          maskClosable={false}
          closable={true}
          onCancel={this.props.callback}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit}>
            <div className={styles.phonecheck_content}>
              <FormItem {...formItemLayout} label="角色" >
                {getFieldDecorator('role',{
                  rules: [
                    {required: false, message: '请选择角色', whitespace: true }
                  ],
                  initialValue:record.role || '',
                })(
                  <Select
                    disabled={!disabledFlag}
                    placeholder=" ">
                    {
                      this.props.codeList &&
                      this.props.codeList.map((item)=>
                        <Option key={item.value} value={item.value}>{item.meaning}</Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>

              {
                this.props.form.getFieldValue('role') === "INTRODUCER" &&
                <FormItem {...formItemLayout} label="姓名" >
                  {getFieldDecorator('name',{
                    rules: [],
                    initialValue:{value: record.roleUserId || '', meaning: record.name || ''},
                  })(
                    <Lov
                      suffix={true}
                      disabled={!disabledFlag}
                      //lovCode='CNL_CHANNEL_NAME_PORTAL'
                      lovCode='CNL_CHANNEL_NAME_CONT'
                    />
                  )}
                </FormItem>
              }
              
              {
                this.props.form.getFieldValue('role') !== "INTRODUCER" &&
                <FormItem {...formItemLayout} label="姓名">
                  {getFieldDecorator('name2', {
                    rules: [],
                    initialValue: {value: record.roleUserId || '', meaning: record.name || ''},
                  })(
                      <Lov
                        disabled={!disabledFlag}
                        lovCode='CNL_CONTRACT_ROLE_USER'
                        params={{
                          role: getFieldValue('role') || '',
                          ownershipType: indexOf(roles, getFieldValue('role')) >= 0 ? this.props.partyType : 'CHANNEL',
                          ownershipId: indexOf(roles, getFieldValue('role')) >= 0 ? this.props.partyId : this.props.channelId,
                        }}
                      />
                  )}
                </FormItem>
              }

              {
                this.props.form.getFieldValue('role') !== 'ADMINISTRATION' &&
                this.props.form.getFieldValue('role') !== 'AGENCY' &&
                <FormItem {...formItemLayout} label="利益(%)" >
                  {getFieldDecorator('benefit',{
                    rules: [
                      { required: true, message: '请输入利益', type:'number'}
                    ],
                    initialValue:record.benefit || 0,
                  })(
                    <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} style={{width:'100%'}}/>
                  )}
                </FormItem>
              }

            </div>

            <div style={{textAlign:'center',marginBottom:'20px'}}>
              <Button onClick={this.submit.bind(this)} type="primary" style={{ width:'120px',height:'38px'}} >确定</Button>
            </div>
          </Form>

        </Modal>
      </div>
    );
  }
}


export default Form.create()(PsCtRoleMd);
