/**
 * created by xiaoyong.luo at 2017/09/14 14:27
 */

import React from 'react';
import { Modal, Checkbox,Button, Form,Input,InputNumber,Table, Cascader} from 'antd';
import * as common from '../../utils/common';
import Modals from '../common/modal/Modal';
import TableCellEdit from './TableCellEdit';
import * as service from '../../services/channel';

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


class PsCtLogsMd extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      dataSource: [],
    };
  }


  componentWillMount(){

    //查日志
    service.fetchRateHistory({channelContractId: this.props.channelContractId}).then((data)=>{
      if(data.success){
        let dataSource = data.rows || [];
        dataSource.map((item,idx)=>{item.key = idx;});
        this.setState({ dataSource });
      }
    });
  }


  onCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = this.state.dataSource;
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    };
  }

  //提交
  submit(){
    let dataSource = this.state.dataSource || [];
    dataSource.map((item)=>{
      if(item.rateHisId){
        item.__status = 'update';
      }else{
        item.__status = 'add';
      }
    });
    service.submitRateHistory(dataSource).then((data)=>{
      if(data.success){
        Modals.success({content:'提交成功'});
        setTimeout("location.reload()", 2000);
      }else{
        Modals.error({content: data.message});
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        width:'10%',
        render:(text,record,index)=>{
          return  index +1;
        }
      }, {
        title: '变更级别',
        dataIndex: 'rateLevelName',
        width:'20%',
      }, {
        title: '更新人',
        dataIndex: 'userName',
        width:'15%',
      },{
        title: '更新时间',
        dataIndex: 'creationDate',
        width:'20%',
      },{
        title: '备注',
        dataIndex: 'comments',
        width:'30%',
        render: (text, record) => (
          <TableCellEdit
            value={text}
            onChange={this.onCellChange(record.key, 'comments')}
          />
        ),
      }
    ];

    return (
      <div>
        <Modal
          title='变更记录'
          width='62%'
          style={{top:80}}
          maskClosable={false}
          closable={true}
          footer={null}
          visible={this.props.visible}
          onCancel={this.props.callback}
        >
          <Form>
            <div style={{clear:'both'}}>
              <Table
                rowKey='customerFamilyId'
                columns={columns}
                dataSource={this.state.dataSource}
                bordered 
                pagination={false}/>
            </div>

            <div style={{textAlign:'center',marginTop:'40px'}}>
              <Button onClick={this.submit.bind(this)} type="primary" style={{ width:'120px',height:'38px'}} >保存</Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}


export default Form.create()(PsCtLogsMd);
