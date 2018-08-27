import React from 'react';
import { Form,Icon } from 'antd';
import * as service from '../../services/pay';
import * as styles from '../../styles/register.css';


class PaySuccess extends React.Component {
  state = {
    count: 3,
  };


  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[]]/g, "\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2]);
  }

  componentDidMount() {
    let orderNumber = this.getParameterByName('out_trade_no');
    const paymentType = this.props.paymentType || 'ALIPAY';
    if(orderNumber){

      //如果是支付宝支付，更新数据
      if(paymentType === 'ALIPAY'){
        service.payOff({orderNumber,paymentType});
      }

      //根据sourceType 跳转
      service.queryByorderNumber({orderNumber}).then((data)=>{
        if(data.success){
          const record = data.rows[0] || {};
          if(record.sourceType){
            let url = '/portal/reservation/2';         //跳转地址
            switch(record.sourceType){
              case 'ORDER': url = '/portal/reservation/2'; break;         //增值服务

              case 'COURSE': url = 'portal/myCourse'; break;

              case 'SUPPORT': url = '/portal/reservation/1'; break;       //业务支援

              default: break;
            }

            if(this.timer) clearInterval(this.timer);
            this.timer = setInterval(function () {
              let count = this.state.count;
              count = count - 1;
              this.setState({count: count});
              if (count < 1) {
                clearInterval(this.timer);
                location.hash = url;
              }
            }.bind(this), 1000);
          }
        }
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    let text = this.state.count + '秒后自动跳转';

    return (
      <div>
        <div className={styles.fieldset_sty}>
          <Form  onSubmit={this.handleSubmit} >
            <div style={{textAlign:'center',marginTop:'5%'}} >
              <Icon type="check-circle-o" style={{fontSize:110,color:'#d1b97f',marginBottom:'28px'}} /><br/>
              <label title="Login" style={{fontWeight:'normal',fontFamily:'Microsoft YaHei',fontSize:'26px',textAlign:'center'}}>支付成功!</label>
            </div>
            <div style={{marginBottom:'75px',marginTop:'90px',width:'100%',textAlign:'center',fontSize:'16px'}}>
              <div>{text}</div>
            </div>

          </Form>
        </div>
      </div>
    );
  }
}


export default Form.create()(PaySuccess);
