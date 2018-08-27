/*
 * show 设置
 * @author:zhouting
 * @version:20170510
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Icon } from 'antd';
import photo from '../../styles/images/photo.png';
import icon11 from '../../styles/images/portal/icon11.png';
import style from '../../styles/Public.css';
import { fetchPersonal } from '../../services/channel';
import {PICTURE_ADDRESS} from '../../constants';

class SetTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channelData: {},
    }
  }
  componentWillMount() {
    if (JSON.parse(localStorage.user).relatedPartyId) {
      fetchPersonal({channelId:JSON.parse(localStorage.user).relatedPartyId}).then((data)=>{
        if(data.success){
          const channelData = data.rows[0] || {};
          this.setState({channelData});
        }
      });
    }
  }
  render() {
    return(
      <Row style={{overflow:'hidden',margin:'28px 12px 28px 20px',height:'120px'}}>
        <div>
          <img style={{width:'120px',height:'120px',float:'left',borderRadius:'50%'}} src={this.state.channelData.photoFilePath ? PICTURE_ADDRESS+this.state.channelData.photoFilePath : photo}  alt=""/>
        </div>
        <div>
          <div style={{marginTop:'5px'}}>
            <span style={{fontSize:'26px',marginLeft:'32px'}}>{this.state.channelData.channelName}</span>
            <span style={{marginLeft:'10px',cursor:'pointer'}} onClick={()=>window.location.hash = '/channel/personal'}>
              <Icon type="edit" style={{color:'#d7b15e',fontSize:'26px'}} />
            </span>
          </div>
          {/* <div style={{marginTop:'10px'}}>
            <span style={{fontSize:'18px',marginLeft:'32px'}}>资深理财师</span>
          </div> */}
          <div style={{marginTop:'10px'}}>
            <span style={{fontSize:'18px',marginLeft:'32px',width:'69px',height:'25px',background:'#d1b97f',borderRadius:'3px',color:'#fff'}} className={'userType'}>
              {
                JSON.parse(localStorage.user).channelStatus == 'APPROVED' ?
                  '已签约'
                  :
                  '未签约'
              }
            </span>
            <span style={{fontSize:'18px',marginLeft:'165px'}}>签单量：<b className={'moneyNumber'}>{this.props.performanceData.newOrderQty}</b></span>
            <span style={{fontSize:'18px',float:'right'}}>已确认收入：<b className={'moneyNumber'}>{this.props.performanceData.paiedReferralFee?this.props.performanceData.paiedReferralFee.toFixed(0):0}港币</b></span>
          </div>
        </div>
      </Row>
    );
  }
}
export default SetTop;
