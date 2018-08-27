/**
 * created by xiaoyong.luo at 2017/07/09 21:27
 */

import React from 'react';
import { Modal, Checkbox,Button, Form,Input,Row,Col,Select,Cascader,DatePicker} from 'antd';
import moment from 'moment';
import * as common from '../../utils/common';
import Uploads from '../common/Upload';
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


class PsCtFileMd extends React.Component {

  constructor(props) {
    super(props);
  }


  //提交
  submit() {
    this.props.form.validateFields((err, values) => {
      if(!err){
        values.fileId = common.formatFile(this.props.form.getFieldValue('file'), true);
        if(values.fileId && values.fileId != 0){
          values.fileSize = this.props.form.getFieldValue('file')[0].size;
        }
        values.uploadDate = common.formatSecond(new Date());
        values.__status = this.props.record.__status || 'update';

        let record = this.props.record || {};
        for(let f in values){
          record[f] = values[f];
        }
        this.props.callback(record);
      }
    });
    this.props.form.resetFields();
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    let record = this.props.record || {};

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
              <FormItem {...formItemLayout} label="档案名称" >
                {getFieldDecorator('name',{
                  rules: [
                    {required: true, message: '请输入档案名称', whitespace: true }
                  ],
                  initialValue:record.name || '',
                })(
                  <Input/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="备注" >
                {getFieldDecorator('comments',{
                  rules: [
                    { required: true, message: '请输入备注', whitespace: true}
                  ],
                  initialValue:record.comments || '',
                })(
                  <Input/>
                )}
              </FormItem>

              <FormItem  {...formItemLayout} label="选择附件">
                {getFieldDecorator('file', {
                  initialValue:record.file || '',
                })(
                   <Uploads fileNum={1}/>
                )}
              </FormItem>
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


export default Form.create()(PsCtFileMd);
