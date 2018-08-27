/*
 * show 工作台功能按钮设置
 * @author:Rex.Hua
 * @version:20170616
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Badge } from 'antd';
import styles from '../../styles/portal.css';
import { getWorkbenchModuleList } from '../../services/home';
import * as countServices from '../../services/functional';
import { PICTURE_ADDRESS } from  '../../constants';
import myselfSet from '../../styles/images/portal/myselfSet.png';
import more from '../../styles/images/portal/more.png';
import less from '../../styles/images/portal/less.png';
import PersonalFunctions from './PersonalFunctions';
import { plan } from '../../services/plan';
import { fetchSupport } from '../../services/reservation';
import { fetchRenewalPersonService } from '../../services/order';

var buttonContent = "";
var buttonShow = false;
const detailBody = {
    "status":"Y"
};

class SetBottom extends React.Component {
  // 构造器
  constructor(props) {
    buttonShow = false;
    super(props);
    this.state = {
      WorkbenchModuleList: [],
      userFuncsVisible: false,
      showAllbtn:true
    };
  }
  // 页面加载前执行
  componentWillMount() {
    getWorkbenchModuleList(detailBody).then((data) => {
      if (data.success) {
        this.setState({
          WorkbenchModuleList: data.rows
        });
        this.moreOrLess();
      } else {
        message.warn(data.message);
        return;
      }
    });

  }
  // 页面加载后执行
  componentDidMount(){
  }
  //
  moreOrLess(e) {
    var applicantInfo;
    var cnt = Math.ceil(this.state.WorkbenchModuleList.length/6)-1 ;

    if(buttonShow){
      for(var i=0;i<cnt;i++){
        applicantInfo = document.getElementById('button'+(cnt-i));
        applicantInfo.style.display="block";
        // applicantInfo.style.visibility="visible";
        // applicantInfo.style.opacity=1;
      }
      applicantInfo = document.getElementById('buttonImg');
      applicantInfo.src= less ;

      buttonShow = false;
    }else{
      for(var i=0;i<cnt;i++){
        applicantInfo = document.getElementById('button'+(cnt-i));
        applicantInfo.style.display="none";
        // applicantInfo.style.visibility="hidden";
        // applicantInfo.style.opacity=0;
      }
      applicantInfo = document.getElementById('buttonImg');
      applicantInfo.src= more;
      buttonShow = true;
    }
    this.setState({showAllbtn:!this.state.showAllbtn});
  }


  openUserFuncsMd(e){
    this.setState({userFuncsVisible:true});
  }

  userFuncsVisible(e){
    this.setState({userFuncsVisible:false});
    if(e=="F"){
      getWorkbenchModuleList(detailBody).then((data) => {
        if (data.success) {
          this.setState({
            WorkbenchModuleList: data.rows
          });
          this.moreOrLess();
        } else {
          message.warn(data.message);
          return;
        }
      });
    }
  }

  render() {
    buttonContent = ""
    return(
      <div className={styles.setting}>
        <ul>
          <div style={{height:'30px',width:'30px',marginLeft:'1160px'}}>
            <div className="setting_btn" style={{cursor:'pointer',width:'40px',height:'40px',backgroundImage:'url('+myselfSet+')',backgroundSize:'cover'}} onClick={this.openUserFuncsMd.bind(this)}></div>
            {/* <img src={myselfSet} alt="财联邦" width="100%" /> */}
          </div>
          {this.state.WorkbenchModuleList.map((data, index) => {
            if (data.functionName == '我的计划书') {
              //REVIEW需复查 COMPLETED已完成
              countServices.getMyPlanCount({status:'REVIEW',extraStatus:'COMPLETED',downloadFlag:'N'}).then((planTotal) => {
                if (planTotal && document.getElementById("myCount"+index)) {
                  document.getElementById("myCount"+index).setAttribute("class",styles.myCount);
                	document.getElementById("myCount"+index).innerText = planTotal;
                }
              });
            } else if (data.functionName == '我的保单') {
              //NEED_REVIEW需复查
              countServices.queryPersonalTotal({orderType:"INSURANCE",status:'NEED_REVIEW'}).then((orderTotal) => {
                if (orderTotal && document.getElementById("myCount"+index)) {
                  document.getElementById("myCount"+index).setAttribute("class",styles.myCount);
                	document.getElementById("myCount"+index).innerText = orderTotal;
                }
              });
            } else if (data.functionName == 'Pending') {
              //PENDING_MATERIAL需补资料
              countServices.queryOrdPendingTotal({orderType:"INSURANCE",status:'PENDING_MATERIAL'}).then((pendingTotal) => {
                if (pendingTotal && document.getElementById("myCount"+index)) {
                  document.getElementById("myCount"+index).setAttribute("class",styles.myCount);
                	document.getElementById("myCount"+index).innerText = pendingTotal;
                }
              });
            } else if (data.functionName == '服务预约') {
              //PAYMENT待支付
              countServices.querySupportTotal({status:'PAYMENT',userId:JSON.parse(localStorage.user).userId}).then((supportTotal) => {
                if (supportTotal!=null) {
                  //WAIT_PAY待支付 NEED_REVIEW需复查
                  countServices.queryPersonalTotal({orderType:"VALUEADD",sourceType:'ORDER',status:'WAIT_PAY',status1:'NEED_REVIEW'})
                    .then((orderTotal) => {
                    if (orderTotal!=null) {
                      supportTotal += orderTotal;
                      if (supportTotal > 0 && document.getElementById("myCount"+index)) {
                        document.getElementById("myCount"+index).setAttribute("class",styles.myCount);
                        document.getElementById("myCount"+index).innerText = supportTotal;
                      }
                    }
                  });
                }
              });
            } else if (data.functionName == '债券') {
              //NEED_REVIEW需复查 PENDINGPending需补资料
              countServices.queryPersonalTotal({orderType:"BOND",status:'NEED_REVIEW',status1:'PENDING'}).then((orderTotal) => {
                if (orderTotal && document.getElementById("myCount"+index)) {
                  document.getElementById("myCount"+index).setAttribute("class",styles.myCount);
                	document.getElementById("myCount"+index).innerText = orderTotal;
                }
              });
            } else if (data.functionName == '售后处理') {
              //AUDITAGIN资料需复查
              countServices.queryOrdAfterListTotal({afterStatus:'AUDITAGIN'}).then((orderAfterTotal) => {
                if (orderAfterTotal!=null) {
                  //TORENEWAL待续保 TOFAIL待确认失效 NACHFRIST ADMIN
                  countServices.queryRenewalTotal().then((orderRenewalTotal) => {
                    if (orderRenewalTotal!=null) {
                       orderAfterTotal += orderRenewalTotal;
                      if (orderAfterTotal > 0 && document.getElementById("myCount"+index)) {
                        document.getElementById("myCount"+index).setAttribute("class",styles.myCount);
                        document.getElementById("myCount"+index).innerText = orderAfterTotal;
                      }
                    }
                  });
                }
              });
            } else if (data.functionName == '对账单' || data.functionName == '结算管理') {
              //DQR待确认
              countServices.getCheckCount({paramStatus:'APPROVED',status:'DQR'}).then((checkbackTotal) => {
                if (checkbackTotal && document.getElementById("myCount"+index)) {
                  document.getElementById("myCount"+index).setAttribute("class",styles.myCount);
                	document.getElementById("myCount"+index).innerText = checkbackTotal;
                }
              });
            }
            if(index%6==0){
              buttonContent = buttonContent + "<div id='button"+index/6+"' class='ant-row "+ styles.animate +"' style='margin-bottom:40px;display:block'><li style='width:145px;margin-left:51px;float:left;' key={'li"+data.iconFileId+"'}>" +
                              "<a href='#"+data.functionCode+"'>"+
                              "<span id='myCount"+index+"'></span>"+
                              "<div class='tabIcon' style='background-image:url("+PICTURE_ADDRESS+data.filePath+");background-size:cover;width:128px;height:128px;'></div>"+
                              "<div class='typeTxt "+styles.buttonDiv+"' style='color:#d1b97f;font-size:20px;'>"+data.functionShowName+"</div>"+
                              "<div class="+styles.buttonDiv+" style='color:#9D9D9D;font-size:16px;'>"+data.englishName+"</div>"+
                              "</a>"+
                              "</li>" ;
            }else if(index%6==5 || index==this.state.WorkbenchModuleList.length){
              buttonContent = buttonContent + "<li style='width:145px;margin-left:51px;float:left;' key={'li"+data.iconFileId+"'}>" +
                              "<a href='#"+data.functionCode+"'>"+
                              "<span id='myCount"+index+"'></span>"+
                              "<div class='tabIcon' style='background-image:url("+PICTURE_ADDRESS+data.filePath+");background-size:cover;width:128px;height:128px;'></div>"+
                              "<div class='typeTxt "+styles.buttonDiv+"' style='color:#d1b97f;font-size:20px;'>"+data.functionShowName+"</div>"+
                              "<div class="+styles.buttonDiv+" style='color:#9D9D9D;font-size:16px;'>"+data.englishName+"</div>"+
                              "</a>"+
                              "</li></div>" ;
            }else{
              buttonContent = buttonContent + "<li style='width:145px;margin-left:51px;float:left;' key={'li"+data.iconFileId+"'}>" +
                              "<a href='#"+data.functionCode+"'>"+
                              "<span id='myCount"+index+"'></span>"+
                              "<div class='tabIcon' style='background-image:url("+PICTURE_ADDRESS+data.filePath+");background-size:cover;width:128px;height:128px;'></div>"+
                              "<div class='typeTxt "+styles.buttonDiv+"' style='color:#d1b97f;font-size:20px;'>"+data.functionShowName+"</div>"+
                              "<div class="+styles.buttonDiv+" style='color:#9D9D9D;font-size:16px;'>"+data.englishName+"</div>"+
                              "</a>"+
                              "</li>" ;
            }
          })}
          <div id="buttonContent" dangerouslySetInnerHTML={{ __html: buttonContent }} />
          <div className={this.state.showAllbtn?"actives":""} style={{height:'44px',width:'44px',marginLeft:'600px',cursor:'pointer',backgroundImage:'url('+more+')',backgroundSize:'cover'}} onClick={this.moreOrLess.bind(this)} id='buttonImg'>
          </div>
        </ul>
          <PersonalFunctions visible={this.state.userFuncsVisible} handVisble={this.userFuncsVisible.bind(this)}/>
      </div>
    );
  }
}
export default connect()(SetBottom);
