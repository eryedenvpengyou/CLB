import React from 'react';
import { Modal, Button, Row,Col,Icon} from 'antd';
import * as service from '../../services/channel';
import TipModal from "../common/modal/Modal";
import Modals from "../common/modal/Modal";

class CheckModal extends React.Component {

  onOk(){
    const params = {
      channelId: this.props.channelId,
      checkPeriod: this.props.checkPeriod,
      settlementSummaryId:this.props.settlementSummaryId,
      paymentCompanyId: this.props.paymentCompanyId,
      paymentCompanyType: this.props.paymentCompanyType,
      receiveCompanyId: this.props.receiveCompanyId,
    };
    service.checkEnsure(params).then((data)=>{
      if(data.success){
        TipModal.success({content:data.message});
      }else{
        TipModal.error({content:data.message});
      }
      this.props.callback(false,true,data.rows[0]);
    });
  };

  onCancel(){
    this.props.callback(false,false,[]);
  };

  render(){
    return (
      <Modal
        style={{marginTop:'5%'}}
        visible={this.props.visible}
        onCancel={()=>this.props.callback(false,false,[])}
        footer={null}
      >

        <div style={{textAlign:'center',marginTop:'5%',marginBottom:'10%'}} >
          <Icon type="question-circle-o" style={{fontSize:110,color:'#d1b97f',marginBottom:28}} /><br/>
          <label title="Login" style={{fontSize:20,textAlign:'center'}}>确认本期对账单？</label>
        </div>

        <Row gutter={24}>
          <hr style={{marginBottom:'2%'}}/>
          <Col span={6}>
          </Col>

          <Col span={6}>
            <Button type="default" onClick={this.onOk.bind(this)} style={{ width:100,float:'right'}} size="large" >确定</Button>
          </Col>
          <Col span={6}>
            <Button type="default" onClick={this.onCancel.bind(this)} style={{ width: 100,}}size="large" >取消</Button>
          </Col>
        </Row>
      </Modal>
    )
  }

}

export default CheckModal;
