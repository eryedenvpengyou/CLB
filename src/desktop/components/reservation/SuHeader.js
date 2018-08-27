import React  , { Component } from 'react';
import { Button,Form,Input,InputNumber,Row,Col} from 'antd';


const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 9 },
    sm: { span: 9 },
  },
  wrapperCol: {
    xs: { span: 8 },
    sm: { span: 8 },
  },
};

class SuHeader extends Component {
  state={
    label: '',
    color:'#d1b97f',
    status:'',
  }

  componentWillMount(){
    const record = this.props.fields || {};
  }


  /**
   *
   * @returns
   * @memberof FormResult
   */
  render(){
    const { getFieldDecorator } = this.props.form;
    const record = this.props.fields || {};
    const payAmount = record.amount;
    const costContent = record.costContent;
    const cancelDate = record.lastUpdateDate;
    let labelStatus = '', labelReason = '', reasonValue = '', reasonFlag = false, color = 'red' ;
    if(record.status){
      switch(record.status){
          //取消申请
          case 'CANCEL':
            labelStatus = '取消申请';labelReason = '取消时间'; reasonValue = cancelDate; reasonFlag = true;break;

          //申请失败
          case 'FAIL':
            labelStatus = '申请失败';labelReason = '失败原因'; reasonValue = costContent; reasonFlag = true;break;

          //审核中
          case 'APPROVAL':
            labelStatus = '审核中';labelReason = ''; reasonValue = ''; reasonFlag = false;break;

          //申请成功
          case 'SUCCESS':
            labelStatus = '申请成功';labelReason = ''; reasonValue = ''; reasonFlag = false;break;

          //待支付
          case 'PAYMENT':
            labelStatus = '待支付';labelReason = '支付价格'; reasonValue = payAmount; reasonFlag = true;break;

          //已支付
          case 'AMOUNT':
            labelStatus = '已支付';labelReason = '支付价格'; reasonValue = payAmount; reasonFlag = true;break;
      }
    }else{
      record.status = '';
    }

    return(
      <div>
        <FormItem {...formItemLayout} label='申请状态' style={{marginBottom:'6px'}}>
          {getFieldDecorator('orderStatus')(
            <span style={{color:color,fontSize:'15px'}}>{labelStatus}</span>
          )}
        </FormItem>

        {
          reasonFlag &&
          <FormItem {...formItemLayout} label={labelReason} style={{marginBottom:'12px'}}>
            {getFieldDecorator('cancelReason')(
              <span style={{color:color,fontSize:'15px'}}>{reasonValue}</span>
            )}
          </FormItem>
        }
      </div>
    );
  }

}


export default Form.create()(SuHeader);

