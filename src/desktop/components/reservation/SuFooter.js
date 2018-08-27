import React  , { Component } from 'react';
import { Button,Form,DatePicker,Input,InputNumber,Row,Col,Modal,Select} from 'antd';
import * as service from '../../services/reservation';
import * as styles from '../../styles/sys.css';

const FormItem = Form.Item;

class SuFooter extends Component {
  state={
    singleFlag: true,
  }

  componentWillMount(){
    const record = this.props.record || {};
  }


  inspect(){
    let statusCode = this.props.fields.status;
    if(statusCode){
      if(statusCode ==='CANCEL'||statusCode ==='FAIL'){
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.props.callback1()
          }
        })
      }
      else {
        this.props.callback1()
      }
    }

  }

  /**
   *
   *
   * @returns
   * @memberof FormResult
   */
  render(){
    let record = this.props.fields || {};
    let singleFlag = true, meaning1 = null, meaning2 = null;
    let singleFlag2 = true;
    if(record.status){
      switch(record.status){
        //取消申请
        case 'CANCEL':
          singleFlag = true; meaning1 = '重新申请';  break;

        //申请失败
        case 'FAIL':
          singleFlag = true; meaning1 = '重新申请'; break;

        //审核中
        case 'APPROVAL':
          singleFlag = true; meaning1 = '取消申请'; break;

        //待支付
        case 'PAYMENT':
            singleFlag = false; meaning1 = '取消申请'; meaning2 = '去支付'; break;

      }
    }else{
      record.status = '';
    }
    return(
      <div>
        {
          record.status &&
          record.status != 'RESERVE_CANCELLED' &&
          record.status != 'AMOUNT' &&
          record.status != 'SUCCESS' &&

          <div>
            {
              singleFlag &&
              <Row>
                <Col span={7}></Col>
                <Col span={6}>
                  <Button onClick={this.inspect.bind(this)} type="default" style={{ width: 110, color: 'white', backgroundColor: JSON.parse(localStorage.theme).themeColor}} size="large" >
                    {meaning1}
                  </Button>
                </Col>
              </Row>
            }
            {
              !singleFlag &&
              <Row>
                <Col span={12}>
                  <Button onClick={this.props.callback1} type="default" style={{width: 110, color: 'white', backgroundColor: JSON.parse(localStorage.theme).themeColor}} size="large" >
                    {meaning1}
                  </Button>
                </Col>
                <Col span={12}>
                  <Button onClick={this.props.callback2} type="default" style={{width: 110,float:'right', color: 'white', backgroundColor: JSON.parse(localStorage.theme).themeColor}} size="large" >
                      {meaning2}
                  </Button>
                </Col>
              </Row>
            }
          </div>
        }
      </div>
    );
  }

}


export default Form.create()(SuFooter);

