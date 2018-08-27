/**
 * Created by FengWanJun on 2017/6/17.
 */

import React from 'react';
import { Row, Col, Button, Table, Select, Form, DatePicker, Input, Modal, Upload} from 'antd';
import { productionDetail } from '../../services/production';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import modalStyles from '../login/modal.css';
import Lov from "../common/Lov";
import TipModal from "../common/modal/Modal";
import TableCellEditor from '../common/TableCellEditor';
import { getCode } from '../../services/code';
import { NumberInput } from "../../components/common/Input";
import { PICTURE_ADDRESS } from '../../constants';
import moment from "moment";

class ProductionSubscribeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priceFlag: true,
      visible: false,
      dataSourceList: [
        [{
          __status: "add",
          number: "例",
          name: "张三",
          sex: "男",
          birthDate: '1993-01-01',
          signAddress: '广东省广州市',
          passNumber: '35435588533',
          fileName: '查看样本',
        },{
          __status: "add",
          number: "1"
        },{
          __status: "add",
          number: "2"
        },{
          __status: "add",
          number: "3"
        },{
          __status: "add",
          number: "4"
        },{
          __status: "add",
          number: "5"
        },{
          __status: "add",
          number: "6"
        }],
      ],
      productDetail: {
        //子产品
        prdItemSublineList: [],
      },
      codeList: {
       phoneCodeList: [],
      }
    };
  }
  componentWillMount() {
    const detailBody = {
      itemId: this.props.itemId
    };
    productionDetail(detailBody).then((detailData) => {
      if (detailData.success) {
        this.setState({
          productDetail: detailData.rows[0]
        });
        const codeBody = {
          phoneCodeList: "PUB.PHONE_CODE",
        }
        getCode(codeBody).then((data) => {
          this.setState({
            codeList: data
          });
        })
      } else {
        TipModal.error({content:detailData.message});
        return;
      }
    });
  }
  //页面返回
  goBack() {
    this.props.onCancel();
  }
  handleChangeSubline(value) {
    //深圳过境关口
    if (value) {
      this.state.productDetail.prdItemSublineList.map((data) => {
        if (data.sublineId == value) {
          if (isNaN(data.price)) {
            this.setState({priceFlag: false});
          } else {
            this.setState({priceFlag: true});
          }
          this.props.form.setFieldsValue({price:data.price});
        }
      });
    } else {
      this.setState({priceFlag: true});
      this.props.form.setFieldsValue({price:"0.00"});
    }
  }
  //不可选日期
  disabledStartDate(current) {
    if (current) {
      var date = new Date();
      current = new Date(current);
      date = moment(date.getFullYear()+"/"+(date.getMonth()+1)+"/"+(date.getDate()),"YYYY/MM/DD");
      current = moment(current.getFullYear()+"/"+(current.getMonth()+1)+"/"+(current.getDate()),"YYYY/MM/DD")
      return date.valueOf() > current.valueOf();
    } else {
      return false;
    }
  }
  //确认预约
  handleSubmit(e) {
    let tableList = [];
    tableList[0] = [];
    let flag = true, _index = 0;
    this.state.dataSourceList[0].map((row, index) => {
      if (index != 0) {
        if (row.name || row.sex || row.birthDate || row.signAddress || row.passNumber || row.file) {
          if (!row.name) {
            //document.getElementById('input_name_'+index).style.display = 'block';
            //document.getElementById('input_name_'+index).children[1].style.display = 'block';
            flag = false;
            _index = index;
          }
          if (!row.sex) {
            //document.getElementById('input_sex_'+index).style.display = 'block';
            //document.getElementById('input_sex_'+index).children[1].style.display = 'block';
            flag = false;
            _index = index;
          }
          if (!row.birthDate) {
            //document.getElementById('input_birthDate_'+index).style.display = 'block';
            //document.getElementById('input_birthDate_'+index).children[1].style.display = 'block';
            flag = false;
            _index = index;
          }
          if (!row.signAddress) {
            //document.getElementById('input_signAddress_'+index).style.display = 'block';
            //document.getElementById('input_signAddress_'+index).children[1].style.display = 'block';
            flag = false;
            _index = index;
          }
          if (!row.passNumber) {
            //document.getElementById('input_passNumber_'+index).style.display = 'block';
            //document.getElementById('input_passNumber_'+index).children[1].style.display = 'block';
            flag = false;
            _index = index;
          }
          if (row.file) {
            if (row.file.response.success) {
              row.fielId = row.file.response.file.fileId;
            } else {
              TipModal.error({content: "第 "+_index+" 行，附件上传失败："+row.file.response.message});
              flag = false;
              _index = 0;
            }
          } else {
            //document.getElementById('message_file_'+index).style.display = 'block';
            flag = false;
            _index = index;
          }
          if (!flag) {
            return false;
          }
          tableList[0].push(row);
        }
      }
    });
    if (tableList[0].length == 0) {
      TipModal.error({content:"至少需要填写一条访客信息才可预约"});
      return;
    }
    if (flag) {
      this.props.onConfirm(tableList);
    } else {
      if (_index != 0) {
        TipModal.error({content:"第 "+_index+" 行，访客信息未填写完整"});
        return;
      }
    }
  }
  showModal() {
    this.setState({
      visible: true,
    });
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    //子产品
    const itemSublineNameOptions = [];
    this.state.productDetail.prdItemSublineList.map((data) => {
      let result;
      result = <Select.Option key={data.sublineId}>{data.sublineItemName}</Select.Option>;
      itemSublineNameOptions.push(result);
    });
    const phoneCodeOptions = this.state.codeList.phoneCodeList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>;
    });
    const reserveContactPhoneCode = (
      getFieldDecorator('reserveContactPhoneCode', {
        initialValue:  JSON.parse(localStorage.user).phoneCode||"86",
      })(
        <Select style={{ width: 110 }}>
          {phoneCodeOptions}
        </Select>
      )
    );
    const customerPhoneCode = (
      getFieldDecorator('customerPhoneCode', {
        initialValue:  JSON.parse(localStorage.user).phoneCode||"86",
      })(
        <Select style={{ width: 110 }}>
          {phoneCodeOptions}
        </Select>
      )
    );
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 7 },
    };
    const formTableLayout = {
      labelCol: {span: 9},
      wrapperCol: {span: 20, offset: 2},
    };
    const columns = [{
      key: 'number',
      dataIndex: 'number',
      title: '编号',
      width: '10%',
    }, {
      key: 'name',
      dataIndex: 'name',
      title: '姓名',
      width: '10%',
      render: (text, record, index) => {
        if (index == 0) {
          return text;
        } else {
          return <TableCellEditor isRequired={true} rowData={this.state.dataSourceList[0][index]} type="Input" index={index} name="name" />
        }
      }
    }, {
      key: 'sex',
      dataIndex: 'sex',
      title: '性别',
      width: '10%',
      render: (text, record, index) => {
        if (index == 0) {
          return text;
        } else {
          return <TableCellEditor isRequired={true} rowData={this.state.dataSourceList[0][index]} type="Input" index={index} name="sex" />
        }
      }
    }, {
      key: 'birthDate',
      dataIndex: 'birthDate',
      title: '出生日期',
      width: '20%',
      render: (text, record, index) => {
        if (index == 0) {
          return text;
        } else {
          return <TableCellEditor isRequired={true} rowData={this.state.dataSourceList[0][index]} type="DatePicker" index={index} name="birthDate" />
        }
      }
    }, {
      key: 'signAddress',
      dataIndex: 'signAddress',
      title: '签发地点',
      width: '20%',
      render: (text, record, index) => {
        if (index == 0) {
          return text;
        } else {
          return <TableCellEditor isRequired={true} rowData={this.state.dataSourceList[0][index]} type="Input" index={index} name="signAddress" />
        }
      }
    }, {
      key: 'passNumber',
      dataIndex: 'passNumber',
      title: '港澳通行证号',
      width: '15%',
      render: (text, record, index) => {
        if (index == 0) {
          return text;
        } else {
          return <TableCellEditor isRequired={true} rowData={this.state.dataSourceList[0][index]} type="NumberLetterInput" index={index} name="passNumber" />
        }
      }
    }, {
      key: 'file',
      dataIndex: 'file',
      title: '签注页',
      width: '15%',
      render: (text,record,index) => {
        if (record.fileName) {
          return (
            <Button type="primary" onClick={this.showModal.bind(this)}>查看样本</Button>
          )
        } else {
          return (
            <Upload name={"file_"+index} modularName='PRD'>
              <Button type="default">上传附件</Button>
              <div className="ant-form-explain" id={"message_file_"+index} style={{display:'none',color:'red'}}>请上传附件</div>
            </Upload>
          )
        }
      }
    }];
    return (
      <Row style={{paddingTop: '28px'}} className={styles.productSubscribe}>
        <Form.Item label="客户（投保人）" {...formItemLayout}>
          {getFieldDecorator('applicantCustomer', {
            rules: [{
              required: true,
              validator: (rule,value,callback) => {
                if (value && (!value.value || !value.meaning)) {
                  callback('请选择客户（投保人）');
                } else {
                  callback();
                }
              }
            }],
            initialValue: {value: '', meaning: ''},
          })(
            <Lov placeholder="请选择客户（投保人）" lovCode='ORD_CUSTOMER' width="100%" />
          )}
        </Form.Item>
        <Form.Item label="保单订单编号" {...formItemLayout}>
          {getFieldDecorator('orderNumber', {
            initialValue: {value: '', meaning: ''},
          })(
            <Lov placeholder="请选择保单订单编号" lovCode='ORD_ORDERDETAIL' width="100%" />
          )}
        </Form.Item>
        <Col xs={7} sm={7} md={7} lg={7} xl={7} offset={9} style={{fontSize:"12px",color:"#d2d2d2",top:"-20px"}}>
          如果客户当天同时预约了赴港签单，请输入订单编号，方便工作人员合理安排行程。
        </Col>
        <Form.Item label="联系电话" {...formItemLayout}>
          {getFieldDecorator('customerPhone', {
            rules: [{
              required: true,
              message: '请输入联系电话',
              whitespace: true,
            }],
          })(
            <NumberInput addonBefore={customerPhoneCode} style={{width:'100%'}} />
          )}
        </Form.Item>
        <Form.Item label="深圳过境关口" {...formItemLayout}>
          {getFieldDecorator('sublineId', {
            rules: [{
              required: true,
              message: '请选择深圳过境关口',
              whitespace: true,
            }],
          })(
            <Select onChange={this.handleChangeSubline.bind(this)}>
              {itemSublineNameOptions}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="团队签证价格" {...formItemLayout}>
          {getFieldDecorator('price', {
            initialValue: "0.00",
          })(
            this.state.priceFlag ?
              <Input addonBefore={<span style={{fontSize:'15px'}}>￥</span>} style={{width:'100%'}} disabled />
              :
              <Input disabled />
          )}
        </Form.Item>
        <Form.Item label="预约过境时间" {...formItemLayout}>
          {getFieldDecorator('reserveDate', {
            rules: [{
              required: true,
              message: '请选择预约过境时间',
              whitespace: true,
              type: 'object',
            }],
          })(
            <DatePicker showTime disabledDate={this.disabledStartDate.bind(this)} format="YYYY/MM/DD HH:mm" style={{width:"100%"}} />
          )}
        </Form.Item>
        <Form.Item {...formTableLayout}>
          <Table dataSource={this.state.dataSourceList[0]} columns={columns} pagination={false}
                 title={() => <span style={{border:'1px solid #deb97f',padding:'18px 831px 24px 12px',fontWeight:'bold',fontSize:'20px',color:'#d1b97f',borderRadius:'4px 4px 0px 0px'}}>L签访客信息</span>} />
        </Form.Item>
        <Form.Item label="预约对接人" {...formItemLayout}>
          {getFieldDecorator('reserveContactPerson', {
            rules: [{
              required: true,
              message: '请输入预约对接人',
              whitespace: true,
            }],
            initialValue: JSON.parse(localStorage.user).userName
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="对接人电话" {...formItemLayout}>
          {getFieldDecorator('reserveContactPhone', {
            rules: [{
              required: true,
              message: '请输入对接人电话',
              whitespace: true,
            }],
            initialValue: JSON.parse(localStorage.user).phone
          })(
            <NumberInput addonBefore={reserveContactPhoneCode} style={{width:'100%'}} />
          )}
        </Form.Item>
        <Form.Item label="备注" {...formItemLayout}>
          {getFieldDecorator('reserveComment', {})(
            <textarea placeholder="可为空" style={{width:"100%",padding:"0 5px"}} />
          )}
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 7, offset: 9 },
            sm: { span: 7, offset: 9 },
          }}
        >
          <Button type="primary" className={commonStyles.btnPrimary} onClick={this.handleSubmit.bind(this)}>确认预约</Button>
          <Button type="default" className={commonStyles.btnDefault} onClick={this.goBack.bind(this)} style={{float:'right'}}>取消</Button>
        </Form.Item>
        <Col xs={22} sm={22} md={22} lg={22} xl={22} offset={1} className={styles.productSubscribeReminder} style={{paddingTop:"28px"}}>
          温馨提示：
          <Row>1、本服务为收费服务，若客户购买任何保险产品，单张保单年缴保费≥10万美金或趸交保费≥50万美金，我司免费提供团签服务，同一投保人两张及以上保单累计达以上金额不享受该免费服务。申请免费团签服务请务必在备注栏填写投保信息。</Row>
          <Row>2、如已享受免费团签服务的客户因各种原因未能投保成功及退保，我司将会补收该费用。</Row>
          <Row>3、所有增值服务以预约时信息为准，由于无预约、信息错误等产生的费用由客户承担，且过后不可以补办和报销。</Row>
          <Row>4、使用L签访港的旅客需要持旅行社提供的文件一同过关方可进入香港；离港时无需旅行社文件，亦无需一同过关，请根据客户签证类型选择此项服务。</Row>
        </Col>
        <Modal maskClosable={false} visible={this.state.visible} footer={false} onCancel={this.handleCancel.bind(this)}>
          <div className={modalStyles.title_div}>
            <div className={modalStyles.title_font}>签注页样本</div>
          </div>
          <div>
            <img src={PICTURE_ADDRESS+"CLBDATA/PRD/2017616d360d8e9-185d-4ff3-b7e9-e118f37a4193"} alt={'签注页样本'} width="100%" />
          </div>
        </Modal>
      </Row>
    )
  }
}

export default (ProductionSubscribeComponent);
