import React from 'react';
import moment from 'moment';
import SuDetailPX from "./SuDetailPX";
import SuDetailHK from "./SuDetailHK";
import SuDetailHX from "./SuDetailHX";
import * as service from '../../services/reservation';
import Modals from '../common/modal/Modal';

class SuDetailHandle  extends React.Component {
  state={
    detailTab:'',
    suDetailList:[],
    record:[],
    disableFlag:true
  };

  componentWillMount() {
    let supportType = this.props.supportType;
    let supportId = this.props.supportId;
    let params ={
      supportId:supportId
    }
    service.fetchSupportDetail(params).then((data)=>{
      if(data.success){
        data.rows[0].costSDDate = [moment(data.rows[0].costStartDate, 'YYYY-MM-DD HH:mm:ss'),moment(data.rows[0].costEndDate, 'YYYY-MM-DD HH:mm:ss')]
        data.rows[0].trainSDDate = [moment(data.rows[0].trainStartDate, 'YYYY-MM-DD HH:mm:ss'),moment(data.rows[0].trainEndDate, 'YYYY-MM-DD HH:mm:ss')]
        this.setState({
          suDetailList:data.rows[0]
        },()=>{
          let status = data.rows[0].status
          this.setDetailTad(supportType,status,supportId,this);
        });
      }
    });
  }



  //第一个按钮对应的函数
  callback1(record,status){
    if(record){
      record.status = status;
      //this.props.status =  status;
      console.log(this.props.status)
      record.supportId=this.props.supportId;
      record.guestPercent=(record.guestPercent)/100;
      if(record.status&&record.supportId){
        this.setState({
          record:record
        });
        if(status == 'FAIL'||status == 'CANCEL'){
          Modals.warning(this.supportSubmit.bind(this),'是否确定提交申请？');
        }
        else {
          Modals.warning(this.supportCancel.bind(this),'是否提交取消申请？');
        }
      }
    }
  }

  supportCancel(flag){
    if(flag){
      service.cancelSupportDetail(this.state.record).then((data) => {
        if(data.success){
          const params ={
            supportId:this.props.supportId
          }
          service.fetchSupportDetail(params).then((data)=>{
            if(data.success){
              Modals.success('取消成功')
              const supportType = this.props.supportType;
              const status = data.rows[0].status;
              const supportId = this.props.supportId;
              data.rows[0].costSDDate = [moment(data.rows[0].costStartDate, 'YYYY-MM-DD HH:mm:ss'),moment(data.rows[0].costEndDate, 'YYYY-MM-DD HH:mm:ss')]
              data.rows[0].trainSDDate = [moment(data.rows[0].trainStartDate, 'YYYY-MM-DD HH:mm:ss'),moment(data.rows[0].trainEndDate, 'YYYY-MM-DD HH:mm:ss')]
              this.setState({
                suDetailList:data.rows[0]
              },()=>{
                this.setDetailTad(supportType,status,supportId);
              })
            }
          });
        }
        else{
        }
      });
    }
  }
  supportSubmit(flag){
    if(flag){
      service.submitSupportDetail(this.state.record).then((data) => {
        if(data.success){
          const params ={
            supportId:this.state.record.supportId
          }
          service.fetchSupportDetail(params).then((data)=>{
            if(data.success){
              Modals.success('提交成功')
              const supportType = this.props.supportType;
              const status = data.rows[0].status;
              const supportId = this.props.supportId;
              data.rows[0].costSDDate = [moment(data.rows[0].costStartDate, 'YYYY-MM-DD HH:mm:ss'),moment(data.rows[0].costEndDate, 'YYYY-MM-DD HH:mm:ss')]
              data.rows[0].trainSDDate = [moment(data.rows[0].trainStartDate, 'YYYY-MM-DD HH:mm:ss'),moment(data.rows[0].trainEndDate, 'YYYY-MM-DD HH:mm:ss')]
              this.setState({
                suDetailList:data.rows[0]
              },()=>{
                this.setDetailTad(supportType,status,supportId);

              })
            }
          });
        }
        else{

        }
      });
    }
  }

  setDetailTad(supportType,status,supportId){
    if(status=='FAIL'||status=='CANCEL'){
      this.setState({
        disableFlag:false
      },()=>{
        let detailTab = '';
        if(supportType == 'TRAIN'){
          detailTab = <SuDetailPX disableFlag={this.state.disableFlag} callback1={this.callback1.bind(this)} status={status} supportId={supportId}  suDetailList={this.state.suDetailList}/>;
        }else if(supportType == 'GUEST'){
          detailTab = <SuDetailHK disableFlag={this.state.disableFlag} callback1={this.callback1.bind(this)} status={status} supportId={supportId} suDetailList={this.state.suDetailList}/>;
        }else if(supportType == 'COST'){
          detailTab = <SuDetailHX disableFlag={this.state.disableFlag} callback1={this.callback1.bind(this)} status={status} supportId={supportId} suDetailList={this.state.suDetailList}/>;
        }
        this.setState({detailTab});
      })
    }else {
      this.setState({
        disableFlag:true
      },()=>{
        let detailTab = '';
        if(supportType == 'TRAIN'){
          detailTab = <SuDetailPX disableFlag={this.state.disableFlag} callback1={this.callback1.bind(this)} status={status} supportId={supportId}  suDetailList={this.state.suDetailList}/>;
        }else if(supportType == 'GUEST'){
          detailTab = <SuDetailHK disableFlag={this.state.disableFlag} callback1={this.callback1.bind(this)} status={status} supportId={supportId} suDetailList={this.state.suDetailList}/>;
        }else if(supportType == 'COST'){
          detailTab = <SuDetailHX disableFlag={this.state.disableFlag} callback1={this.callback1.bind(this)} status={status} supportId={supportId} suDetailList={this.state.suDetailList}/>;
        }
        this.setState({detailTab});
      });
    }
  }


  render(){
    return(
      <div>
        {this.state.detailTab}
      </div>
    );
  }
}

export default SuDetailHandle;
