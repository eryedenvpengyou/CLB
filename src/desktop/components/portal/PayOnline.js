import React from 'react';
import {Button,Row,Col,Modal,Radio} from 'antd';
import * as service from '../../services/pay';
import $ from 'jquery';
import Modals from '../../components/common/modal/Modal';
import * as styles from '../../styles/sys.css';
import wx from '../../styles/images/wx.png';
import zfb from '../../styles/images/zfb.png';


const RadioGroup = Radio.Group;


class PayOnline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: '',
      visible: false,
      QRCode:'',
      payment: 'WXPAY',
    }
  }

  componentWillMount() {
    const params = {
      sourceId: this.props.sourceId,
      sourceType: this.props.sourceType,
    };
    service.queryBySource(params).then((data)=>{
      if(data.success && data.rows.length > 0){
        this.setState({detail : data.rows[0] || {}});
      }else{
        Modals.error({content:'支付订单不存在'});
      }
    });
  }


  //关闭支付
  handleCancel(e){
    clearInterval(this.timer);
    this.setState({visible: false,});
  }

  //支付方式改变
  onChange(e){
    this.setState({payment: e.target.value});
  }

  //确定支付方式
  onSubmit(){
    const payment = this.state.payment || 'WXPAY';
    if(payment === 'WXPAY'){
      const params = {
        paymentType:"WXPAY",
        sourceType:this.props.sourceType,
        sourceId: this.props.sourceId,
        amount: this.state.detail.amount || 0,
        orderSubject:this.state.detail.orderSubject || '',
        orderContent:this.state.detail.orderContent || '',
      };
      //验证订单
      service.createOrder(params).then((data)=>{
        if(data.success){

          //返回微信二维码
          const QRCode = '/api/payment/wxpayStart?orderNumber='+data.orderNumber+'&access_token='+localStorage.access_token;
          this.setState({
            QRCode:QRCode,
            visible: true,
          });

          //不停的请求 /api/payment/payOff接口 ，直到返回成功
          this.timer = setInterval(function () {
            const params ={
              orderNumber: data.orderNumber,
              paymentType: "WXPAY",
            };

            service.payOff(params).then((newData)=>{
              if(newData.success){
                clearInterval(this.timer);
                this.setState({visible: false});
                location.hash = '/portal/paySuccess/WXPAY?out_trade_no='+ data.orderNumber|| '';
              }
            });
          }.bind(this),2000);
        }else{
          Modals.error({content: data.message});
        }
      });

    }else if(payment === 'ALIPAY'){
      const params = {
        paymentType:"ALIPAY",
        sourceType: this.props.sourceType,
        sourceId: this.props.sourceId,
        amount: this.state.detail.amount || 0,
        orderSubject: this.state.detail.orderSubject || '',
        orderContent: this.state.detail.orderContent || '',
      };

      //验证订单
      service.createOrder(params).then((data)=>{
        if(data.success){
          service.alipayStart({orderNumber: data.orderNumber,}).then((data)=>{
            if(data.success){
              $("#zhifu").html('zhifu').html(data.message);
            }
          });
        }else{
          Modals.error({content: data.message});
        }
      });
    }
  }



  //销毁
  componentWillUnmount(nextProps) {
    clearInterval(this.timer);
  }

  render() {
    const detail = this.state.detail || {};
    const wxTitle= '';
    return (
      <div className={styles.table_border}>
        <div className={styles.search_border} id='zhifu'>
          <b className={styles.b_sty}>|</b>
          <font style={{fontSize:'20px'}}>订单支付</font>
        </div>
        <div className={styles.content_div} style={{fontSize:'14px'}}>
          <Row>
            <Col xs={16} sm={16} md={16} lg={16} xl={16} offset={0}>
              <Row style={{ marginBottom:'2%'}}>
                <Col xs={3} sm={3} md={3} lg={3} xl={3} >
                  订单编号：
                </Col>
                <Col xs={17} sm={17} md={17} lg={17} xl={17} >
                  {detail.orderNumber}
                </Col>
              </Row>
              <Row>
                <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                  订单类型：
                </Col>
                <Col xs={21} sm={21} md={21} lg={21} xl={21} >
                  {detail.orderContent}
                </Col>
              </Row>
            </Col>
            <Col sm={8}>
              <Row style={{ marginBottom:'10px'}}>
                  &nbsp;
              </Row>
              <Row>
                <Col sm={24}>
                  <span style={{float:'right',fontSize:'16px'}}>
                    订单金额：<p style={{fontSize:'20px',color:'red',float:'right'}} >{`￥${detail.amount || 0}`}</p>
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div style={{fontSize:'16px',margin:'5% 0 0 0',padding:'20px 20px',backgroundColor: '#efefef'}}>
          请选择支付方式
        </div>

        <div style={{padding:'25px 15px'}}>
          <RadioGroup onChange={this.onChange.bind(this)} value={this.state.payment}>
            <Radio value='WXPAY' className={styles.radio_sty} style={{fontSize:'14px',}}><img src={wx} style={{width:'35px' ,margin:'20px'}} />微信支付</Radio>
            {/* <Radio value='ALIPAY' className={styles.radio_sty} style={{fontSize:'14px',}}><img src={zfb} style={{width:'35px' ,margin:'20px'}}/>支付宝支付</Radio> */}
          </RadioGroup>

          <div style={{clear:'both',marginTop:'30px'}}>
            <Button onClick={this.onSubmit.bind(this)} type='primary' style={{width:'165px',height:'40px'}} > 确定 </Button>
          </div>
        </div>

        <Modal
          visible={this.state.visible}
          width={535}
          maskClosable={false}
          onCancel={this.handleCancel.bind(this)}
          footer={null}
        >
          <div>
            <div style={{padding:'12px 0', margin:'-16px -16px 16px -16px',backgroundColor: JSON.parse(localStorage.theme).themeColor,fontSize:'18px'}}>
              <div style={{textAlign:'center'}}>使用微信扫一扫付款</div>
            </div>

            <div style={{textAlign:'center',marginTop:'90px'}}>
              <img src={this.state.QRCode}/>
            </div>

            <div style={{fontSize:'18px', textAlign:'center',marginTop:'10px',marginBottom:'80px'}}>
              {`支付金额 ￥${detail.amount || 0}`}
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default PayOnline;
