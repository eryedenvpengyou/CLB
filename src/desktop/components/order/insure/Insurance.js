import React from 'react';
import { Form} from 'antd';
import {indexOf} from 'lodash';
import * as service from '../../../services/order';
import InsureProduct from './InsureProduct';
import InsureAdditional from './InsureAdditional';
import InsureOrder from './InsureOrder';
import InsureSupplier from './InsureSupplier';


/**
 * 快速预约 -- 保险， 控制中心
 *
 * 传入参数 orderId  ，根据 oederId 判断是 新增操作还是 修改操作
 *
 * @class Insurance
 * @extends {React.Component}
 */


class Insurance  extends React.Component {
  state={
    insureance: {},
    handleTab:'',
  };

  componentWillMount() {
    const orderId = this.props.orderId;
    let insureance = {editFlag: true};

    //1、 orderId = '000'  代表新增状态,这时候不会调用接口获取保单数据
    if(orderId == '000'){
      this.setState({insureance}, ()=>{
        this.setHandleTab('PRODUCT');
      });

    //2、 order !=  '000' , 代表修改状态,这时候需要调用接口初始化数据
    }else{
      const ordStatus = ['DATA_APPROVING', 'NEED_REVIEW', 'DATA_APPROVED', 'RESERVING', 'RESERVE_SUCCESS','PRE_APPROVING'];
      service.getOrder({orderId: orderId}).then((data)=>{
        if(data.success){
          insureance = data.rows[0] || {};
          insureance.editFlag = true;
          //工作日判断
          if (indexOf(ordStatus, insureance.status) >= 0) {
            const total = new Date(insureance.reserveDate.replace(/-/g,'/')).getTime() - new Date().getTime();//兼容IE
            const hours = total/(3600*1000);
            if (hours <= 48) {
              insureance.editFlag = false;
            }
          } else {
            insureance.editFlag = false;
          }
          if (insureance.status == 'UNSUBMITTED' || insureance.status == 'NEED_REVIEW'){
            insureance.editFlag = true;
          }
          this.setState({insureance}, ()=>{
              this.setHandleTab('PRODUCT');
          });
        }
      });
    }
  }


  //跳转 控制器
  setHandleTab(tabCode){
    let handleTab = '';
    switch (tabCode) {
      case 'PRODUCT': handleTab = <InsureProduct
                      orderId={this.props.orderId}
                      insureance={this.state.insureance}
                      goBack={this.goBack.bind(this)}
                      goNext={this.goNext.bind(this)}/>; break;

      case 'ADDITONAL': handleTab = <InsureAdditional
                      orderId={this.props.orderId}
                      insureance={this.state.insureance}
                      goBack={this.goBack.bind(this)}
                      goNext={this.goNext.bind(this)}/>; break;

      case 'ORDER': handleTab = <InsureOrder
                      orderId={this.props.orderId}
                      insureance={this.state.insureance}
                      goBack={this.goBack.bind(this)}
                      goNext={this.goNext.bind(this)}/>; break;

      case 'SUPPILER': handleTab = <InsureSupplier
                      orderId={this.props.orderId}
                      insureance={this.state.insureance}
                      goBack={this.goBack.bind(this)}
                      goNext={this.goNext.bind(this)}/>; break;

      default: break;
    }
    this.setState({handleTab});
  }


  //返回上一步
  goBack(tabCode, insureance){
    if(tabCode){
      this.setState({insureance}, ()=>{
        this.setHandleTab(tabCode);
      });
    }
  }

  //下一步
  goNext(tabCode, insureance){
    if(tabCode){
      this.setState({insureance}, ()=>{
        this.setHandleTab(tabCode);
      });
    }
  }

  render(){
    return(
      <div>
        {this.state.handleTab}
      </div>
    );
  }
}

export default Form.create()(Insurance);
