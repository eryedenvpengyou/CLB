/**
 *  created by xiaoyong.luo@hand-china.com at 2017/9/11 10:48
 */
import React from 'react';
import { Form,Input,Row,Col, Button,Table,Icon,Cascader,Modal,InputNumber } from 'antd';
import Modals from '../common/modal/Modal';
import RatioDetailMd from './RatioDetailMd';
import {handleTableChange} from '../../utils/table';
import * as service from '../../services/channel';
import * as styles from '../../styles/qa.css';


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



class RatioDetail extends React.Component {
  state = {
    ratioVisible: false,
    ratioRecord: {},
    dataList: [],
    pagination:{},
    body:{
      ratioId: this.props.ratioId
    }
  };

  componentWillMount() {
    service.fetchRatioDetail(this.state.body).then((data)=>{
      if(data.success){
        const pagination = this.state.pagination;
        pagination.total = data.total;
        let dataList = data.rows || [];
        dataList.map((item,index)=>{
           item.key = index;
           item.theFirstYear = item.theFirstYear? parseFloat(item.theFirstYear * 100).toFixed(2) : 0;
           item.theSecondYear = item.theSecondYear? parseFloat(item.theSecondYear * 100).toFixed(2) : 0;
           item.theThirdYear = item.theThirdYear? parseFloat(item.theThirdYear * 100).toFixed(2) : 0;
           item.theFourthYear = item.theFourthYear? parseFloat(item.theFourthYear * 100).toFixed(2) : 0;
           item.theFifthYear = item.theFifthYear? parseFloat(item.theFifthYear * 100).toFixed(2) : 0;
           item.theSixthYear = item.theSixthYear? parseFloat(item.theSixthYear * 100).toFixed(2) : 0;
           item.theSeventhYear = item.theSeventhYear? parseFloat(item.theSeventhYear * 100).toFixed(2) : 0;
           item.theEightYear =  item.theEightYear? parseFloat(item.theEightYear * 100).toFixed(2) : 0;
           item.theNinthYear = item.theNinthYear? parseFloat(item.theNinthYear * 100).toFixed(2) : 0;
           item.theTenthYear = item.theTenthYear? parseFloat(item.theTenthYear * 100).toFixed(2) : 0;
        });
        this.setState({ dataList , pagination}); 
        // 新建级别名称后，直接跳转至该级别的分成设置详情页，并点开首条新增记录界面
        if(data.rows.length == 0){
          this.ratioEdit('add',{})
        }
      }
    });
  }

  itemChange(type, value){
    if (value && value.value && value.meaning && value.record) {
      if(type==='bigClass'){
        this.props.form.setFieldsValue({
          midClass: {value:'', meaning:''},
          minClass: {value:'', meaning:''},
        });
      }else if(type==='midClass'){
        this.props.form.setFieldsValue({
          minClass: {value:'', meaning:''},
        });
      }
    }
  }

  //佣金分成编辑
  ratioEdit(action, record, index){
    switch(action){
      case 'detail':
        location.hash = '/';
        break;

      case 'add':
        record.__status = 'add';
        this.props.form.resetFields();
        this.setState({ratioRecord: record, ratioVisible: true});
        break;

      case 'edit':
        record.__status = 'update';
        //注意设置这两个 state的顺序，注意
        this.setState({ratioVisible: true,},()=>{
          this.setState({ratioRecord: record});
        });
        break;

      case 'delete':
        Modals.warning(this.ratioDelete.bind(this, record,index), {content:'确定删除吗？'});
        break;
    }
  }
  //佣金分成弹出窗回调
  callback(record,flag){
    if(record && record.__status && flag == false){
      let dataList = this.state.dataList || [];
      if(record.__status == 'update'){
        dataList[record.key] = record;
      }else{
        record.__status = 'update';
        record.ratioId = this.props.ratioId;
        dataList.push(record);
      }
      dataList.map((item,index)=>{ item.key = index });
      this.setState({dataList, ratioVisible: false});
      this.submit(record);
    }else{
      this.setState({ratioVisible: false});
    }
  }
  //佣金分成从数据库删除
  ratioDelete(record, index, flag){
    if(flag){
      let dataList = this.state.dataList || [];
      dataList.splice(index, 1);
      if(record.ratioLineId){
        service.removeRatioDetail([{ratioLineId: record.ratioLineId}]);        
      }
      dataList.map((item,index)=>{ item.key = index });
      this.setState({dataList});
    }
  }


  //提交数据
  submit(record){
    let dataList = this.state.dataList || [];
    dataList.map((item,index)=>{
      item.theFirstYear = this.parse(item.theFirstYear);
      item.theSecondYear = this.parse(item.theSecondYear);
      item.theThirdYear = this.parse(item.theThirdYear);
      item.theFourthYear = this.parse(item.theFourthYear);
      item.theFifthYear = this.parse(item.theFifthYear);
      item.theSixthYear = this.parse(item.theSixthYear);
      item.theSeventhYear = this.parse(item.theSeventhYear);
      item.theEightYear = this.parse(item.theEightYear);
      item.theNinthYear = this.parse(item.theNinthYear);
      item.theTenthYear = this.parse(item.theTenthYear);
      if(item.ratioLineId){
        item.__status = 'update';
        if(item.objectVersionNumber){
          item.objectVersionNumber = null;
        }
      }else{
        item.__status = 'add';        
      }
    });
    service.submitRatioDetail(dataList).then((data)=>{
      if(data.success){
        Modals.success({content:'提交成功'});
        service.fetchRatioDetail(this.state.body).then((data)=>{
          if(data.success){
            const pagination = this.state.pagination;
            pagination.total = data.total;
            let dataList = data.rows || [];
            dataList.map((item,index)=>{
               item.key = index;
               item.theFirstYear = item.theFirstYear? parseFloat(item.theFirstYear * 100).toFixed(2) : 0;
               item.theSecondYear = item.theSecondYear? parseFloat(item.theSecondYear * 100).toFixed(2) : 0;
               item.theThirdYear = item.theThirdYear? parseFloat(item.theThirdYear * 100).toFixed(2) : 0;
               item.theFourthYear = item.theFourthYear? parseFloat(item.theFourthYear * 100).toFixed(2) : 0;
               item.theFifthYear = item.theFifthYear? parseFloat(item.theFifthYear * 100).toFixed(2) : 0;
               item.theSixthYear = item.theSixthYear? parseFloat(item.theSixthYear * 100).toFixed(2) : 0;
               item.theSeventhYear = item.theSeventhYear? parseFloat(item.theSeventhYear * 100).toFixed(2) : 0;
               item.theEightYear =  item.theEightYear? parseFloat(item.theEightYear * 100).toFixed(2) : 0;
               item.theNinthYear = item.theNinthYear? parseFloat(item.theNinthYear * 100).toFixed(2) : 0;
               item.theTenthYear = item.theTenthYear? parseFloat(item.theTenthYear * 100).toFixed(2) : 0;
            });
            this.setState({ dataList , pagination});
          }
        });
      }else{
        Modals.error({content: data.message});
        if(record.objectVersionNumber == null){
          service.fetchRatioDetail(this.state.body).then((data)=>{
            if(data.success){
              const pagination = this.state.pagination;
              pagination.total = data.total;
              let dataList = data.rows || [];
              dataList.map((item,index)=>{
                 item.key = index;
                 item.theFirstYear = item.theFirstYear? parseFloat(item.theFirstYear * 100).toFixed(2) : 0;
                 item.theSecondYear = item.theSecondYear? parseFloat(item.theSecondYear * 100).toFixed(2) : 0;
                 item.theThirdYear = item.theThirdYear? parseFloat(item.theThirdYear * 100).toFixed(2) : 0;
                 item.theFourthYear = item.theFourthYear? parseFloat(item.theFourthYear * 100).toFixed(2) : 0;
                 item.theFifthYear = item.theFifthYear? parseFloat(item.theFifthYear * 100).toFixed(2) : 0;
                 item.theSixthYear = item.theSixthYear? parseFloat(item.theSixthYear * 100).toFixed(2) : 0;
                 item.theSeventhYear = item.theSeventhYear? parseFloat(item.theSeventhYear * 100).toFixed(2) : 0;
                 item.theEightYear =  item.theEightYear? parseFloat(item.theEightYear * 100).toFixed(2) : 0;
                 item.theNinthYear = item.theNinthYear? parseFloat(item.theNinthYear * 100).toFixed(2) : 0;
                 item.theTenthYear = item.theTenthYear? parseFloat(item.theTenthYear * 100).toFixed(2) : 0;
              });
              this.setState({ dataList , pagination});
  
            }
          });
        }else{
          this.ratioDelete(record,record.key,true);
        }
      }
     // setTimeout("location.reload()", 2000);
    });
  }

  //格式化数据
  parse(number){
    return number? parseFloat(number/100).toFixed(4) : 0;
  }


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    let record = this.state.record || {}, dataList = this.state.dataList || [];

    const columns = [{
        title: '产品大分类',
        dataIndex: 'bigClassName',
      }, {
        title: '产品中分类',
        dataIndex: 'midClassName',
      }, {
        title: '产品小分类',
        dataIndex: 'minClassName',
      }, {
          title: '产品名称',
          dataIndex: 'itemName',
      }, {
        title: '供款期',
        dataIndex: 'sublineItemName',
      }, {
        title: '第一年',
        dataIndex: 'theFirstYear',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第二年',
        dataIndex: 'theSecondYear',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第三年',
        dataIndex: 'theThirdYear',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第四年',
        dataIndex: 'theFourthYear',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第五年',
        dataIndex: 'theFifthYear',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第六年',
        dataIndex: 'theSixthYear',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第七年',
        dataIndex: 'theSeventhYear',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第八年',
        dataIndex: 'theEightYear',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第九年',
        dataIndex: 'theNinthYear',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第十年',
        dataIndex: 'theTenthYear',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '分成备注',
        dataIndex: 'comments',
      },{
        title: '操作',
        dataIndex: 'operate',
        fixed: 'right',
        width: 140,
        render: (text, record, index) => {
          return (
            <div>
              <span>
                <a onClick={this.ratioEdit.bind(this,'edit',record,index)} style={{ marginRight: 5, color: 'rgb(209, 185, 127)' }}>编辑</a>
                <a onClick={this.ratioEdit.bind(this,'delete',record,index)} style={{ color: 'rgb(209, 185, 127)' }}>删除</a>
              </span>
            </div>
          );
        },
      },
    ];

    return (
      <div className={styles.content}>
        {/*渠道归属*/}
        <div className={styles.div_item_no_line}>
          <b className={styles.b_short_line} >|</b>
          <font className={styles.title_font}>分成设置</font>

          <div style={{padding:'20px 0'}}>
            <div>
              <Button
                onClick={this.ratioEdit.bind(this,'add',{},)}
                style={{float:'right',width:100,height:38,marginBottom:5}}
                type='default' >新增</Button>
            </div>

            <div style={{clear:'both'}}>
              <Table
                columns={columns}
                dataSource={this.state.dataList}
                onChange={handleTableChange.bind(this, service.fetchRatioDetail, this.state.body)}
                bordered scroll={{x:'150%'}}
                pagination={this.state.pagination}/>
            </div>
            
            <RatioDetailMd
              visible={this.state.ratioVisible}
              record={this.state.ratioRecord}
              dataSource={this.state.dataList}
              form={this.props.form}
              callback={this.callback.bind(this)}/>
          </div>
        </div>


        {/*按钮*/}
        {/* <Row gutter={24}>
          <Col span={6}></Col>
          <Col span={6}>
            <Button onClick={()=>location.hash = '/channel/ratio'} type='default' style={{ width: 160,height:40}}>返回</Button>
          </Col>
          <Col span={12}>
            <Button onClick={this.submit.bind(this)} type='primary' style={{ width: 160,height:40}}>提交</Button>
          </Col>
        </Row> */}
      </div>
    );
  }
}

export default  Form.create()(RatioDetail);
