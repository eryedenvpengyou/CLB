/*
 * show 计划书申请
 * @author:zhouting
 * @version:20170517
 */
import React from 'react';
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import PlanApplyComponent from '../../components/plan/PlanApply.js';
import style from '../../styles/plan.css';

//界面操作权限
const typeCodeView = "view";
const typeCodeEdit = "edit";
const typeCodeApply = "apply";
class planApply extends React.Component {
  constructor(props){
        super(props);
        this.state = {
            params: {
              operationCode: this.props.params.operationCode,
              planId: this.props.params.planId,
              itemId:this.props.params.itemId
            },
            itemList:[],
            itemListApply :[{
                name:'工作台',
                url:'/#/portal/home'
            },{
                name:'计划书库',
                url:'/#/plan/myPlanLibrary',
            },{
                name:'计划书申请'
            }],
            itemListView :[{
                name:'工作台',
                url:'/#/portal/home'
            },{
                name:'我的计划书',
                url:'/#/plan/myPlan',
            },{
                name:'计划书申请查看'
            }],
            itemListEdit :[{
                name:'工作台',
                url:'/#/portal/home'
            },{
                name:'我的计划书',
                url:'/#/plan/myPlan',
            },{
                name:'计划书申请编辑'
            }],
            itemListProduct:[{
                name:'产品',
                url:'/#/production/list/BX'
            },{
                name:'产品详情',
                url: '/#/production/detail/BX/'+this.props.params.itemId,
            },{
                name:'计划书申请'
            }]
        }
        if(this.props.params.operationCode==typeCodeView){
          this.state.itemList = this.state.itemListView;
        }else if(this.props.params.operationCode==typeCodeEdit){
          this.state.itemList = this.state.itemListEdit;
        }else if(this.props.params.operationCode==typeCodeApply){
            if(this.state.params.itemId>0){
                this.state.itemList = this.state.itemListProduct
            } else {
                this.state.itemList = this.state.itemListApply;
            }
        }
    }
  render(){
    return(
      <ProtalLayout location={location}>
        <div className={style.plan}>
          <BreadcrumbLayout itemList={this.state.itemList} />
          <PlanApplyComponent operationCode={this.state.params.operationCode}
          planId={this.state.params.planId}
          itemId={this.state.params.itemId}/>
        </div>
      </ProtalLayout>
    )
  };
}
export default connect()(planApply);
