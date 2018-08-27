/**
 * created by xiaoyong.luo at 2017/07/09 21:27
 */

import React from 'react';
import { Modal, Checkbox,Button, Form,Input,Row,Col,Select,Cascader,DatePicker} from 'antd';
import moment from 'moment';
import CodeOption from '../CodeOption';
import Uploads from '../Upload';
import {formatFile} from '../../../utils/common';
import pcCascade from '../../../utils/common';
import * as codeService from '../../../services/code';
import * as service from '../../../services/register';
import * as styles from '../../login/modal.css';
import Modals from './Modal';

const FormItem = Form.Item;
const Option = Select.Option;

class TDZQModal extends React.Component {

  constructor(props) {
    super(props);
  }


  componentWillMount(){
    const params ={
      nationalList: 'PUB.NATION',                           //国籍
      provinceList: 'PUB.PROVICE',                          //省份
      cityList: 'PUB.CITY',                                 //城市
    };
    codeService.getCode(params).then((data)=>{
      const options = pcCascade(data);
      this.setState({
        options: options,
        code: data,
      });
    });
  }


  //提交
  submit() {
    this.props.form.validateFields((err, value) => {
      if(!err){
        const user = JSON.parse(localStorage.user);
        let values = this.props.form.getFieldsValue();
        values.birthDate = moment(values.birthDate).format('YYYY-MM-DD HH:mm:ss') || '';
        values.fileId = formatFile(this.props.form.getFieldValue('file'), true);
        values.type = this.props.record.type;
        values.number = this.props.record.number;

        this.props.callback(values);
        this.props.close();
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    let record = this.props.record || {};

    if(record.type == 'add'){
      record = ''
    }

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

    return (
      <div >
        <Modal
          width={635}
          style={{top:80}}
          visible={true}
          maskClosable={false}
          closable={true}
          onCancel={()=>this.props.close()}
          footer={null}
        >
          <div className={styles.log_title_div}>
            <div className={styles.title_font} style={{height:'30px'}}> </div>
          </div>
          <div >
            <div style={{textAlign: 'center',fontSize:'20px'}}>L签访客信息</div>
            <Form onSubmit={this.handleSubmit}>
              <div className={styles.phonecheck_content}>
                <FormItem {...formItemLayout} label="姓名" >
                  {getFieldDecorator('name',{
                    rules: [
                      { required: true, message: '请输入姓名', whitespace: true }
                    ],
                    initialValue:record.name || '',
                  })(
                    <Input/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="性别" >
                  {getFieldDecorator('sex',{
                    rules: [
                      { required: true, message: '请选择性别', whitespace: true }
                    ],
                    initialValue:record.sex || '',
                  })(
                    <Select>
                      <Option value="M">男</Option>
                      <Option value="F">女</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="出生日期" >
                  {getFieldDecorator('birthDate', {
                    rules: [
                      { required: true, message: '请选择出生日期', whitespace: true, type:'object'}
                    ],
                    initialValue:record.birthDate ? moment(record.birthDate, 'YYYY-MM-DD') :'',
                  })(
                    <DatePicker  placeholder=" " format='YYYY-MM-DD' style={{width:'100%'}} />
                  )}
                </FormItem>
                <FormItem  {...formItemLayout} label="签发地">
                  {getFieldDecorator('signAddress', {
                    rules: [
                      { required: true, message: '请选择签发地', whitespace: true,}
                    ],
                    initialValue:record.signAddress || '',
                  })(
                    <Input placeholder=" "/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="港澳通行证号" >
                  {getFieldDecorator('passNumber',{
                    rules: [
                      { required: true, message: '请输入港澳通行证号', whitespace: true },
                      {pattern:/^[A-Za-z0-9]+$/, message:'请输入英文字母或数字'},
                    ],
                    initialValue:record.passNumber || '',
                  })(
                    <Input/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="签注页"  >
                  {getFieldDecorator('file', {
                    rules: [
                      { required: true, message: '请上传签注页复印件', whitespace: true, type:'array'}
                    ],
                    initialValue:record.file || [],
                  })(
                    <Uploads fileNum={1}/>
                  )}
                </FormItem>
              </div>

              <div style={{textAlign:'center',marginBottom:'25px'}}>
                <Button onClick={this.submit.bind(this)} type='primary' style={{width: 120,height:40,}} >提交</Button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}


export default Form.create()(TDZQModal);
