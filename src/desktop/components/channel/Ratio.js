/**
 *  created by xiaoyong.luo@hand-china.com at 2017/9/11 10:48
 */
import React from 'react';
import { Form,Input,Row,Col, Button,Table,Icon,Cascader,Modal} from 'antd';
import Modals from '../common/modal/Modal';
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



class Ratio extends React.Component {
  state = {
    visible: false,
    record: {},
    dataList: [],
    pagination:{},
    body:{
      companyType:'CHANNEL',
      channelId: JSON.parse(localStorage.user||'{}').relatedPartyId
    },
    sameFlag:false,
    selfName:''
  };

  componentWillMount() {
    service.fetchRatio(this.state.body).then((data)=>{
      if(data.success){
        const pagination = this.state.pagination;
        pagination.total = data.total;
        let dataList = data.rows || [];
        dataList.map((item,idx)=>{item.key = idx;});
        this.setState({ dataList,pagination }); 
      }
    });
  }
  //不同操作
  columnsAction(action, record, index){
    switch(action){
      case 'detail':
        location.hash = `/channel/ratioDetail/${record.ratioId}`;
        break;

      case 'add':
        record.__status = 'add';
        this.setState({record, visible: true});
        break;

      case 'edit':
        record.__status = 'update';
        this.setState({record, visible: true,selfName:record.ratioName}); 
        break;

      case 'delete':
        Modals.warning(this.ensureDelete.bind(this, record, index), {content:'确定删除吗？'});
        break;
    }
  }

  //从数据库删除
  ensureDelete(record, index, flag){
    if(flag){
      let dataList = this.state.dataList || [];
      dataList.splice(index, 1);
    }
  }

  //模态框中 提交
  modalSubmit(e){
    this.props.form.validateFields((err, values) => {
      if(!err){
        let record = this.state.record || {}, dataList = this.state.dataList || []
        this.state.sameFlag = false;

        dataList.map((item,idx)=>{
          if(item.ratioName === values.ratioName && this.state.selfName == values.ratioName){
            this.state.sameFlag= true;
            // if(this.state.sameFlag == true){
            //   Modals.error({content:'自定义级别名称不能重复'});
            //   return;
            // }
            // else {this.state.sameFlag= false;}
          }
        });
        console.log(values)
        record = Object.assign(record, values);
        console.log(record)
        if(record.__status == 'update'){
          dataList.map((item,index)=>{
            if(item.index === record.key){
              item = record;
            }
          });
        }else{
          record.objectVersionNumber = 0;
          record.__status = 'update';
          dataList.push(record);
        }
        dataList.map((item,idx)=>{item.key = idx;});
        this.props.form.resetFields();
        this.setState({dataList, visible: false});
        this.submit();
      }
    });
  }

  //关闭模态框
  onCancel(){
    this.props.form.resetFields();
    this.setState({visible: false});
  }

  //提交数据
  submit(e){
    let dataList = this.state.dataList || [];
    dataList.map((item,index)=>{
      item.channelId = JSON.parse(localStorage.user||'{}').relatedPartyId;
      if(item.ratioId){
        item.__status = 'update';
      }else{
        item.__status = 'add';        
      }
    });
    this.state.sameFlag == false?
    service.submitRatio(dataList).then((data)=>{
      if(data.success){
        //Modals.success({content:'提交成功'});
       //新建级别名称后，直接跳转至该级别的分成设置详情页
        if (data.rows[data.rows.length - 1].__status == 'add') {
          setTimeout(function () {
            location.hash = `/channel/ratioDetail/${data.rows[data.rows.length - 1].ratioId}`;
          }, 500);
        }
      }else{
        Modals.error({content: data.message});        
      }
    }):this.setState({visible: false});
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    let record = this.state.record || {}, dataList = this.state.dataList || [];

    const columns = [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width:'20%',
        render:(text, record, index)=>{
            return index+1;
        }
      }, {
        title: '自定义级别',
        dataIndex: 'ratioName',
        key: 'ratioName',
        width:'50%',
      }, {
        title: '操作',
        dataIndex: 'edit',
        key: 'edit',
        width:'30%',
        render: (text, record, index)=>{
          return(
            <div>
              {
                record.ratioId != null &&
                <Button onClick={this.columnsAction.bind(this, 'detail', record, index)} className={styles.btn_operation} style={{ width:'100px',height:'32px'}} >分成设置</Button>
              }
              <Button onClick={this.columnsAction.bind(this, 'edit', record, index)} className={styles.btn_operation} style={{ width:'100px',height:'32px',marginLeft:20}} >编辑</Button>
            </div>
          )
        },
      }
    ];

    return (
      <div className={styles.content}>
        <div className={styles.div_item_no_line}>
          <b className={styles.b_short_line} >|</b>
          <font className={styles.title_font}>渠道分成</font>

          <div style={{padding:'20px 0'}}>
            <div>
              <Button
                onClick={this.columnsAction.bind(this,'add',{},)}
                style={{float:'right',width:100,height:38,marginBottom:5}}
                type='default' >新增</Button>
            </div>

            <div style={{clear:'both'}}>
              <Table
                rowKey='channelContractId'
                columns={columns}
                dataSource={this.state.dataList}
                onChange={handleTableChange.bind(this, service.fetchRatio, this.state.body)}
                bordered scroll={{x:'100%'}}
                pagination={this.state.pagination}/>
            </div>
          </div>
        </div>
        
        <Modal
          width={600}
          style={{top:200}}
          maskClosable={false}
          closable={true}
          footer={null}
          visible={this.state.visible}
          onCancel={this.onCancel.bind(this)}
        >
          <Form>
            <div className={styles.phonecheck_content}>
              <FormItem {...formItemLayout} label="自定义级别" >
                {getFieldDecorator('ratioName',{
                  rules: [
                    {required: true, message: '请输入自定义级别名称', whitespace: true }
                  ],
                  initialValue:record.ratioName || '',
                })(
                  <Input/>
                )}
              </FormItem>
            </div>

            <div style={{textAlign:'center',marginBottom:'20px'}}>
              <Button onClick={this.modalSubmit.bind(this)} type="primary" style={{ width:'120px',height:'38px'}} >确定</Button>
            </div>
          </Form>
        </Modal>




        {/*按钮*/}
        {/* <Row gutter={24}>
          <Col span={10}></Col>
          <Col span={11}>
            <Button onClick={()=>location.hash = '/portal/home'} type='default' style={{ width: 160,height:40}}>返回</Button>
          </Col>
          <Col span={11}>
            <Button onClick={this.submit.bind(this)} type='primary' style={{ width: 160,height:40}}>提交</Button>
          </Col>
        </Row> */}
      </div>
    );
  }
}

export default  Form.create()(Ratio);
