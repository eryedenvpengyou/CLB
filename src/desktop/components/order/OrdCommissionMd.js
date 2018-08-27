import React from 'react';
import { Modal, Checkbox,Button, Form,Input,InputNumber,Table, Cascader} from 'antd';
import moment from 'moment';
import * as common from '../../utils/common';
import * as styles from '../login/modal.css';
import Modals from '../common/modal/Modal';
import * as service from '../../services/order';
import Lov from '../common/Lov';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 18 },
  },
};


class OrdCommissionMd extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      commissionList:[]
    }
  }
  componentWillMount() {
    let orderId = location.href.split('?')[0];
    orderId = orderId.split('/')[7];
    let prePage = location.href.split('/')[6];
    //佣金明细
    service.fetchOrderDetailordCommissionList({orderId:orderId,orderType:prePage}).then((data)=>{
      if (data.success) {
        const commissionList = data.rows || [];
        commissionList.map((row, index) => {
          row.key = index;
        });
        this.setState({commissionList: commissionList});
      }
    });
  }
  //提交
  modalSubmit() {
    this.props.form.validateFields((err, values) => {
      if(!err){
        let commissionList =  [],
        commissionListLower = [],
        commissionListMine = [],
        lower = '',
        mine = '',
        flag = false;
        this.state.commissionList.map((item,i)=>{
          if(item.commissionPerson == "下级佣金率"){
            lower = item.itemId;
            commissionListLower.push({
             itemId:item.itemId,
             theFirstYear : item.theFirstYear,
             theSecondYear : item.theSecondYear,
             theThirdYear : item.theThirdYear,
             theFourthYear : item.theFourthYear,
             theFifthYear : item.theFifthYear,
             theSixthYear : item.theSixthYear,
             theSeventhYear : item.theSeventhYear,
             theEightYear : item.theEightYear,
             theNinthYear : item.theNinthYear,
             theTenthYear : item.theTenthYear,
            })
         }else if(item.commissionPerson == "我的分成"){
            mine = item.itemId;
            commissionListMine.push({
              itemId:item.itemId,
             theFirstYear : item.theFirstYear,
             theSecondYear : item.theSecondYear,
             theThirdYear : item.theThirdYear,
             theFourthYear : item.theFourthYear,
             theFifthYear : item.theFifthYear,
             theSixthYear : item.theSixthYear,
             theSeventhYear : item.theSeventhYear,
             theEightYear : item.theEightYear,
             theNinthYear : item.theNinthYear,
             theTenthYear : item.theTenthYear,
            })
         }
        });
        if(lower == mine){
          commissionListLower.map((i) => {
            commissionListMine.map((res) => { 
              if (this.props.record.itemId == res.itemId) {
                if (
                  (i.theFirstYear+res.theFirstYear) - values.theFirstYear/100 < 0 ||
                  (i.theSecondYear+res.theSecondYear) - values.theSecondYear/100 < 0 ||
                  (i.theThirdYear+res.theThirdYear) - values.theThirdYear/100 < 0 ||
                  (i.theFourthYear+res.theFourthYear) - values.theFourthYear/100 < 0 ||
                  (i.theFifthYear+res.theFifthYear) - values.theFifthYear/100 < 0 ||
                  (i.theSixthYear+res.theSixthYear) - values.theSixthYear/100 < 0 ||
                  (i.theSeventhYear+res.theSeventhYear) - values.theSeventhYear/100 < 0 ||
                  (i.theEightYear+res.theEightYear) - values.theEightYear/100 < 0 ||
                  (i.theNinthYear+res.theNinthYear) - values.theNinthYear/100 < 0 ||
                  (i.theTenthYear+res.theTenthYear) - values.theTenthYear/100 < 0) {
                  Modals.success({ content: '下级渠道佣金率不能高于本级渠道佣金率' });
                  flag = true;
                } else {
                  let record = this.props.record || {};
                  for (let f in values) {
                    record[f] = values[f];
                  }
                  this.props.callback(record, flag);
                  this.props.form.resetFields();
                  let orderId = location.href.split('?')[0];
                  orderId = orderId.split('/')[7];
                  let prePage = location.href.split('/')[6];
                  //佣金明细
                  service.fetchOrderDetailordCommissionList({ orderId: orderId,orderType:prePage }).then((data) => {
                    if (data.success) {
                      const commissionList = data.rows || [];
                      commissionList.map((row, index) => {
                        row.key = index;
                      });
                      this.setState({ commissionList: commissionList });
                    }
                  });
                }
              }
            })
          })
        }
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const record = this.props.record || {};

    return (
      <div>
        <Modal
          title='佣金明细'
          width='40%'
          style={{top:30}}
          maskClosable={false}
          closable={true}
          footer={null}
          visible={this.props.visible}
          onCancel={this.props.callback}
        >
          <Form>
            <div className={styles.phonecheck_content} style={{height:520,overflowY:'scroll'}}>

              <FormItem {...formItemLayout} label="第一年(%)" >
                {getFieldDecorator('theFirstYear',{
                  rules: [],
                  initialValue:(record.theFirstYear)*100 || 0,
                })(
                  <InputNumber precision={2} placeholder="" style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第二年(%)" >
                {getFieldDecorator('theSecondYear',{
                  rules: [],
                  initialValue:(record.theSecondYear)*100 || 0,
                })(
                  <InputNumber precision={2} placeholder="" style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第三年(%)" >
                {getFieldDecorator('theThirdYear',{
                  rules: [],
                  initialValue:(record.theThirdYear)*100 || 0,
                })(
                  <InputNumber precision={2} placeholder="" style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第四年(%)" >
                {getFieldDecorator('theFourthYear',{
                  rules: [],
                  initialValue:(record.theFourthYear)*100 || 0,
                })(
                  <InputNumber precision={2} placeholder="" style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第五年(%)" >
                {getFieldDecorator('theFifthYear',{
                  rules: [],
                  initialValue:(record.theFifthYear)*100 || 0,
                })(
                  <InputNumber precision={2} placeholder="" style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第六年(%)" >
                {getFieldDecorator('theSixthYear',{
                  rules: [],
                  initialValue:(record.theSixthYear)*100 || 0,
                })(
                  <InputNumber precision={2} placeholder="" style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第七年(%)" >
                {getFieldDecorator('theSeventhYear',{
                  rules: [],
                  initialValue:(record.theSeventhYear)*100 || 0,
                })(
                  <InputNumber precision={2} placeholder="" style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第八年(%)" >
                {getFieldDecorator('theEightYear',{
                  rules: [],
                  initialValue:(record.theEightYear)*100 || 0,
                })(
                  <InputNumber precision={2} placeholder="" style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第九年(%)" >
                {getFieldDecorator('theNinthYear',{
                  rules: [],
                  initialValue:(record.theNinthYear)*100 || 0,
                })(
                  <InputNumber precision={2} placeholder="" style={{width:'100%'}}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="第十年(%)" >
                {getFieldDecorator('theTenthYear',{
                  rules: [],
                  initialValue:(record.theTenthYear)*100 || 0,
                })(
                  <InputNumber precision={2} placeholder="" style={{width:'100%'}}/>
                )}
              </FormItem>

            </div>

            <div style={{textAlign:'center',marginBottom:'20px'}}>
              <Button onClick={this.modalSubmit.bind(this)} type="primary" style={{ width:'120px',height:'38px'}} >确定</Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}


export default Form.create() (OrdCommissionMd);
