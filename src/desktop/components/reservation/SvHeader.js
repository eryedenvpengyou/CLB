import React  , { Component } from 'react';
import { Form,} from 'antd';


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

class SvHeader extends Component {
  state={
    detail: this.props.detail || {},
    text:'',
  }

  componentWillMount(){
    const detail = this.props.detail || {};
    if(detail.status && detail.status == 'WAIT_PAY'){

    }
    if(detail.status){
      if(detail.status == 'WAIT_PAY'){
        const creationDate = detail.payTime;
        const payLimitTime = detail.payLimitTime;
        const curDate = detail.curDate;
        let seconds = 0;
        if(isNaN(payLimitTime)){
          seconds = 0;
        }else{
          seconds = payLimitTime * 60 * 1000;
        }
        let payEndTime = new Date(creationDate).getTime() + seconds;
        let nowTime = new Date(curDate).getTime();


        if(payEndTime > nowTime){
          let second = parseInt((payEndTime - nowTime)/1000);
          this.setState({second},()=>{
            this.timer = setInterval(function () {
              if(this.state.second > 0){
                let second = this.state.second -1;
                if (second < 1) {
                  clearInterval(this.timer);
                  this.props.reload();
                }else{
                  let text = this.formatLabel(second);
                  this.setState({second, text});
                }
              }else{
                clearInterval(this.timer);
                this.props.reload();
              }
            }.bind(this), 1000);
          });
        }
      }
    }
  }


  //销毁
  componentWillUnmount(nextProps) {
    clearInterval(this.timer);
  }

  formatLabel(count){
    if(count > 0){
      let second = parseInt(count%60);
      let hour = parseInt(count/3600);
      let minute = parseInt(((count - (3600 * hour))/60));

      hour = '0' + hour + '：';
      if(minute < 10){
        minute = '0' + minute + '：';
      }else{
        minute = minute + '：';
      }

      if(second < 10){
        second = '0' + second + '';
      }else{
        second = second + '';
      }
      let text =hour + minute + second;
      return text;
    }
  }


  /**
   *
   * @returns
   * @memberof FormResult
   */
  render(){
    const { getFieldDecorator } = this.props.form;
    const detail = this.props.detail || {};
    let label = '', color = '#d1b97f', reasonFlag = false;

    if(detail.status){
      switch(detail.status){
        //取消预约
        case 'RESERVE_CANCELLED':
          label = '取消预约';reasonFlag = false;color = 'red';break;

        //预约资料审核中
        case 'DATA_APPROVING':
          label = '预约资料审核中';reasonFlag = false;color = '#d1b97f';break;

        //需复查
        case 'NEED_REVIEW':
          label = '需复查';reasonFlag = false;color = '#d1b97f';break;

        //预约成功
        case 'RESERVE_SUCCESS':
          label = '预约成功';reasonFlag = false;color = '#d1b97f';break;

        //开户成功
        case 'ACCOUNT_SUCCESS':
        label = '开户成功';reasonFlag = false;color = '#d1b97f';break;

        //入账成功
        case 'RECORDED_SUCCESS':
        label = '入账成功';reasonFlag = false;color = '#d1b97f';break;

        //等待支付
        case 'WAIT_PAY':
          label = '等待支付';reasonFlag = false;color = '#d1b97f';break;
      }
    }else{
      detail.status = '';
    }

    return(
      <div>
        {
          detail.status != 'CREATE' &&
          <div>
            {
              detail.status == 'WAIT_PAY' &&
              <div style={{textAlign:'center',fontSize:'20px'}}>
                请在<span style={{color:'red',fontSize:'20px',margin:'10px'}}>{this.state.text}</span> 内完成支付
              </div>
            }
            <FormItem {...formItemLayout} label='订单状态' style={{marginBottom:'6px'}}>
              {getFieldDecorator('orderStatus')(
                <font style={{color:color,fontSize:'15px'}}>{label}</font>
              )}
            </FormItem>

            {
              reasonFlag &&
              <FormItem {...formItemLayout} label="原因" style={{marginBottom:'12px'}}>
                {getFieldDecorator('cancelReason')(
                  <b style={{color:color,fontSize:'15px'}}>{detail.status}</b>
                )}
              </FormItem>
            }
          </div>
        }
      </div>
    );
  }

}


export default Form.create()(SvHeader);

