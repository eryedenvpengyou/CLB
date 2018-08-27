import React  , { Component } from 'react';
import { Button,Form,Row,Col,} from 'antd';


class SvFooter extends Component {
  state={
    singleFlag: true,
    meaning1: '',
    meaning2: '',
  }

  componentWillMount(){}


  /**
   *
   *
   * @returns
   * @memberof FormResult
   */
  render(){
    let record = this.props.detail || {};

    if(record.status && record.status == 'WAIT_PAY'){

    }

    let singleFlag = true, meaning1 = null, meaning2 = null;
    if(record.status){
      switch(record.status){
        //取消预约
        case 'RESERVE_CANCELLED':
          singleFlag = true, meaning1 = null;break;

        //预约资料审核中
        case 'DATA_APPROVING':
          singleFlag = true, meaning1 = '取消预约';break;

        //需复查
        case 'NEED_REVIEW':
          singleFlag = false, meaning1 = '取消预约';meaning2 = '提交';break;

        //预约成功
        case 'RESERVE_SUCCESS':
          singleFlag = true, meaning1 = null;break;

        //待支付
        case 'WAIT_PAY':
          singleFlag = false, meaning1 = '取消预约';meaning2 = '立即支付';break;

        //新增
        case 'CREATE':
          singleFlag = false, meaning1 = '取消';meaning2 = '确认预约';break;
      }
    }else{
      record.status = null;
    }
    return(
      <div>
        {
          record.status &&
          (record.status != 'RESERVE_CANCELLED' && record.status != 'RESERVE_SUCCESS' &&
          record.status != 'ACCOUNT_SUCCESS' && record.status != 'RECORDED_SUCCESS') &&
          <div>
            {
              singleFlag &&
              <Row>
                <Col span={7}></Col>
                <Col span={6}>
                  <Button onClick={this.props.callback1} type='primary' style={{ width:'140px',height:'40px'}}>
                    {meaning1}
                  </Button>
                </Col>
              </Row>
            }

            {
              !singleFlag &&
              <Row>
                <Col span={12}>
                  <Button onClick={this.props.callback1} type='default' style={{width: 120,height:40}} >
                    {meaning1}
                  </Button>
                </Col>
                <Col span={12}>
                  <Button id="submitBtn" onClick={this.props.callback2} type='primary' style={{width: 120,height:40,float:'right'}}>
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


export default Form.create()(SvFooter);

