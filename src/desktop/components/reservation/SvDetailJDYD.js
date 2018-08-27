import React, {Component} from 'react';
import {Form, DatePicker, Input, Button, Icon, Table, Popconfirm, InputNumber, Row, Col, Select} from 'antd';
import moment from 'moment';
import Lov from "../common/Lov";
import CodeOption from "../common/CodeOption";
import SvFooter from "./SvFooter";
import SvHeader from "./SvHeader";
import Modals from '../common/modal/Modal';
import * as service from '../../services/reservation';
import * as codeService from '../../services/code';
import * as styles from '../../styles/qa.css';
import CustomerLov from "../common/CustomerLov";
import HotelTable from './HotelTable'


const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {xs: {span: 9}, sm: {span: 9},},
  wrapperCol: {xs: {span: 8}, sm: {span: 8},},
};
const tailFormItemLayout = {
  wrapperCol: {xs: {span: 8, offset: 9,}, sm: {span: 8, offset: 9,},},
};

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({value});
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render() {
    return (
      <div className="editable-cell">
        <Input
          required
          addonBefore={this.props.addonBefore}
          disabled={this.props.disabled}
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

class EditableSelect extends React.Component {
  state = {
    value: this.props.value,
    dataList: this.props.dataList,
  }
  handleChange = (value) => {
    this.setState({value})
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  render() {
    const options = this.state.dataList && this.state.dataList.map((item, index) => {
      return (<Select.Option value={item.value} key={index}>{item.meaning}</Select.Option>)
    })
    return (
      <Select
        defaultValue={this.state.value}
        onChange={this.handleChange}
        disabled={this.props.disabled}
        className={this.props.disabled ? styles.selectDisabled : ''}
      >
        {options}
      </Select>
    );
  }
}

class SvDetailJDYD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: this.props.detail || {},
      productDetail: {},
      code: {},
      editIndex: '',
      dataSource: (this.props.detail && this.props.detail.ordSubscribeRoom) || [],
      columns: []
    };

  }

  async componentWillMount() {
    await codeService.getCode({
      phoneCodes: 'PUB.PHONE_CODE',
      roomType: 'ORD.VALUE_ADD_ROOM_TYPE',
      bedType: 'ORD.VALUE_ADD_BED_TYPE',
      reserveContactPurpose: 'ORD.RESERVE_CONTACT_PURPOSE',
    }).then(async (data) => {
      await this.setState({code: data});

      let columns = [
        {
          title: '编号',
          dataIndex: 'index',
          render: function (text, record, index) {
            return (index + 1)
          },
          width: 60,
        },
        {
          title: '房间类型',
          dataIndex: 'roomType',
          editable: true,
          render: (text, record, index) => {
            const editable = this.isEditing(index)
            let meaning = ''
            this.state.code.roomType && this.state.code.roomType.map(item => {
              if (item.value === text) meaning = item.meaning
            })
            return (
              <div>
                {editable ? (
                  <EditableSelect
                    value={text}
                    disabled={this.props.detail.disableFlag}
                    onChange={this.onCellChange(index, 'roomType')}
                    dataList={this.state.code.roomType}
                  />
                ) : meaning || text}
              </div>
            )
          },
          width: 140,
        },
        {
          title: '单床/双床',
          dataIndex: 'bedType',
          editable: true,
          render: (text, record, index) => {
            const editable = this.isEditing(index)
            let meaning = ''
            this.state.code.bedType && this.state.code.bedType.map(item => {
              if (item.value === text) meaning = item.meaning
            })
            return (
              <div>
                {editable ? (
                  <EditableSelect
                    value={text}
                    disabled={this.props.detail.disableFlag}
                    onChange={this.onCellChange(index, 'bedType')}
                    dataList={this.state.code.bedType}
                  />
                ) : meaning || text}
              </div>
            )
          },
          width: 140,
        },
        {
          title: '客户姓名',
          dataIndex: 'customerName',
          editable: true,
          render: (text, record, index) => {
            const editable = this.isEditing(index)
            return (
              <div>
                {editable ? (
                  <EditableCell
                    value={text}
                    disabled={this.props.detail.disableFlag}
                    onChange={this.onCellChange(index, 'customerName')}
                  />
                ) : text}
              </div>
            )
          },
          width: 110,
        },
        {
          title: '客户拼音姓名',
          dataIndex: 'customerPinyinName',
          editable: true,
          render: (text, record, index) => {
            const editable = this.isEditing(index)
            return (
              <div>
                {editable ? (
                  <EditableCell
                    value={text}
                    disabled={this.props.detail.disableFlag}
                    onChange={this.onCellChange(index, 'customerPinyinName')}
                  />
                ) : text}
              </div>
            )
          },
          // width: 140,
        },
        {
          title: '通行证号码',
          dataIndex: 'passNumber',
          editable: true,
          render: (text, record, index) => {
            const editable = this.isEditing(index)
            return (
              <div>
                {editable ? (
                  <EditableCell
                    value={text}
                    disabled={this.props.detail.disableFlag}
                    onChange={this.onCellChange(index, 'passNumber')}
                  />
                ) : text}
              </div>
            )
          },
          // width: 140,
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
          editable: true,
          render: (text, record, index) => {
            const editable = this.isEditing(index)
            let meaning = ''
            this.state.code.phoneCodes && this.state.code.phoneCodes.map(item => {
              if (item.value === record.phoneCode) meaning = item.meaning
            })
            const selectBefore = (
              <EditableSelect
                value={record.phoneCode}
                disabled={this.props.detail.disableFlag}
                onChange={this.onCellChange(index, 'phoneCode')}
                dataList={this.state.code.phoneCodes}
              />
            );
            return (
              <div>
                {editable ? (
                  <EditableCell
                    addonBefore={selectBefore}
                    value={text}
                    disabled={this.props.detail.disableFlag}
                    onChange={this.onCellChange(index, 'phone')}
                  />
                ) : `${meaning || record.phoneCode}-${text}`}
              </div>
            )
          },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          hidden: true,
          render: (text, record, index) => {
            const editable = this.isEditing(index)
            return (
              <div style={{display: 'flex', justifyContent: 'space-around'}}>
                <span
                  style={{color: JSON.parse(localStorage.theme).themeColor, cursor: 'pointer', padding: '5px 15px',background:'#fff', borderRadius:'5px'}}
                  onClick={() => this.onDelete(record, index)}
                >删除</span>
                {
                  /*editable ? (
                    <span>
                  <Button size='small' style={{marginRight: '5px'}}
                          onClick={() => this.saveRow(record, index)}>保存</Button>
                  <Button disabled={this.props.detail.disableFlag} onClick={() => this.onDelete(record, index)}
                          type="danger" size='small'>删除</Button>
                </span>
                  ) : (
                    <span>
                  <Button disabled={this.props.detail.disableFlag} onClick={() => this.edit(index)} size='small'
                          style={{marginRight: '5px'}}>编辑</Button>
                  <Button disabled={this.props.detail.disableFlag} onClick={() => this.onDelete(record, index)}
                          type="danger" size='small'>删除</Button>
                </span>
                  )*/
                }

              </div>
            )
          },
          width: 120,
        }
      ]
      this.setState({columns})
    });

    service.productionDetail({itemId: this.props.itemId}).then((data) => {
      if (data.success) {
        this.setState({productDetail: data.rows[0] || {}});
      } else {
        Modals.error({content: data.message});
      }
    })


    const detail = this.props.detail;
    if (detail.disableFlag) {
      this.setState({columns: this.state.columns.slice(0, -1)})
    }
    if (detail.price) {
      if (!isNaN(detail.price)) {
        detail.price = detail.price;
      } else {
        this.setState({priceFlag: false})
      }
    }
  }

  //验证客户手机号
  checkCustomerPhone(rule, value, callback) {
    let phoneCode = this.props.form.getFieldValue('customerPhoneCode')
    let regex = /^\d{11}$/, msg = '手机号位数不正确(大陆地区为11位)';

    if (phoneCode === '00852' || phoneCode === '00853') {
      regex = /^\d{8}$/;
      msg = '手机号位数不正确(港澳地区为8位)';
    } else if (phoneCode === '00886') {
      regex = /^\d{9}$/;
      msg = '手机号位数不正确(台湾地区为9位)';
    }

    if (value && !regex.test(value)) {
      if (typeof callback === 'function') {
        callback(msg);
      }
    } else {
      if (typeof callback === 'function') {
        callback();
      }
    }
  }

  resetCustomerPhone(value) {
    if (value) {
      this.props.form.setFieldsValue({customerPhone: ''});
    }
  }

  //验证对接人手机号
  checkContactPhone(rule, value, callback) {
    let phoneCode = this.props.form.getFieldValue('reserveContactPhoneCode')
    let regex = /^\d{11}$/, msg = '手机号位数不正确(大陆地区为11位)';

    if (phoneCode === '00852' || phoneCode === '00853') {
      regex = /^\d{8}$/;
      msg = '手机号位数不正确(港澳地区为8位)'
    } else if (phoneCode === '00886') {
      regex = /^\d{9}$/;
      msg = '手机号位数不正确(台湾地区为9位)';
    }

    if (value && !regex.test(value)) {
      if (typeof callback === 'function') {
        callback(msg);
      }
    } else {
      if (typeof callback === 'function') {
        callback();
      }
    }
  }

  resetContactPhone(value) {
    if (value) {
      this.props.form.setFieldsValue({reserveContactPhone: ''});
    }
  }

  //第一个按钮对应的函数
  callback1() {
    this.props.callback1(this.state.detail);
  }

  //第二个按钮对应的 函数
  callback2() {
    const status = this.state.detail.status || '';
    let lastItem = this.state.dataSource[this.state.dataSource.length - 1]
    if (this.state.dataSource.length > 0) {
      if (this.validateRoom(true)) {
        this.props.callback2(status, this.state.dataSource)
      }
    } else {
      Modals.error({content: '请填写预订房间信息'});
      return
    }
  }

  //不可选日期
  disabledStartDate(current) {
    if (!current) {
      return false;
    }
    var date = new Date();
    current = new Date(current);
    date = moment(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate()), "YYYY-MM-DD");
    current = moment(current.getFullYear() + "-" + (current.getMonth() + 1) + "-" + (current.getDate()), "YYYY-MM-DD")
    return date.valueOf() > current.valueOf();
  }

  //不可选退房日期
  disabledEndDate(endValue) {
    const startValue = this.props.form.getFieldValue("checkinDate");
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() >= endValue.valueOf();
  }

  handleChangeDate(value) {
    if (value) {
      document.getElementsByClassName("ant-calendar-picker-input ant-input ant-input-lg")[1].disabled = false;
      var date = new Date(value);
      this.props.form.setFieldsValue({checkoutDate: moment(date.getTime() + 24 * 3600 * 1000)});
    }
  }

  channelLovChange(value) {
    //渠道
    if (value && value.value && value.meaning && value.record) {

      if (value.record.channelName) {
        this.props.form.setFieldsValue({reserveContactPerson: value.record.channelName});
      } else {
        this.props.form.setFieldsValue({reserveContactPerson: ''});
      }

      if (value.record.phoneCode) {
        this.props.form.setFieldsValue({reserveContactPhoneCode: value.record.phoneCode});
        this.props.form.setFieldsValue({reserveContactPhone: value.record.phone});
      } else {
        this.props.form.setFieldsValue({reserveContactPhoneCode: ''});
        this.props.form.setFieldsValue({reserveContactPhone: ''});
      }

    }
  }

  customerLovChange(value) {
    //客户（投保人）
    if (value && value.value && value.meaning && value.record) {

      //当所选的客户是新增的 就清空保单订单编号字段
      if (value.record.addStatus === "add") {
        this.props.form.setFieldsValue({relatedOrderId: {value: '', meaning: ''}});
      }

    }
  }

  hotelChange(item) {
    this.props.form.setFieldsValue({comments: item.comments})
    this.props.form.setFieldsValue({price: item.price})
    this.props.form.setFieldsValue({sublineId: item.sublineId})
    this.props.form.setFieldsValue({sublineItemName: item.sublineItemName})
  }

  async onDelete(record, index) {
    let response
    if (record.subscribeRoomId || record.subscribeRoomId === 0) {
      response = await service.deleteRoom([{subscribeRoomId: record.subscribeRoomId}])
      if (response.success) {
        const dataSource = [...this.state.dataSource].filter((item, i) => i !== index);
        this.setState({dataSource: dataSource, editIndex: ''});
        if (dataSource.length > 0 && !dataSource[dataSource.length - 1].roomType) {
          this.setState({editIndex: dataSource.length - 1})
        }
      } else {
        Modals.error({content: '错误!'})
      }
    } else {
      const dataSource = [...this.state.dataSource].filter((item, i) => i !== index);
      this.setState({dataSource: dataSource, editIndex: ''});
      if (dataSource.length > 0 && !dataSource[dataSource.length - 1].roomType) {
        this.setState({editIndex: dataSource.length - 1})
      }
    }
  }

  addRoom() {
    const dataSource = [...this.state.dataSource];
    if (!this.validateRoom(true)) return;
    dataSource.push({
      subscribeRoomId: '',
      orderId: '',
      roomType: 'senior_guest_room',
      bedType: '',
      customerName: '',
      customerPinyinName: '',
      passNumber: '',
      phone: '',
      phoneCode: '86',
    })
    this.setState({dataSource, editIndex: dataSource.length - 1})
  }

  isEditing = (index) => {
    return true
    // return index === this.state.editIndex;
  }

  edit(index) {
    if (this.validateRoom()) {
      this.setState({editIndex: index})
    } else {
      Modals.error({content: '请先保存'})
    }
  }

  saveRow(record, index) {
    if (this.validateRoom(true)) {
      this.setState({editIndex: ''})
    }
  }

  onCellChange = (key, dataIndex) => {
    return async (value) => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find((item, index) => index === key);
      if (target) {
        target[dataIndex] = value;
        await this.setState({dataSource});
      }
    }
  };

  validateRoom(showModal) {
    let tip = []
    this.state.dataSource.map((item, index) => {
      if (!item.roomType) {
        tip.push(`第${index + 1}条房间信息: 房间类型不能为空!`)
        return
      }
      if (!item.bedType) {
        tip.push(`第${index + 1}条房间信息: 请选择床类型!`)
        return
      }
      if (!item.customerName) {
        tip.push(`第${index + 1}条房间信息: 客户姓名不能为空!`)
        return
      }
      if (!item.customerPinyinName) {
        tip.push(`第${index + 1}条房间信息: 客户拼音姓名不能为空!`)
        return
      } else if (!/^[A-Za-z ]+$/.test(item.customerPinyinName)) {
        tip.push(`第${index + 1}条房间信息: 客户拼音姓名只能输入英文字母或空格!`)
        return
      }
      if (!item.passNumber) {
        tip.push(`第${index + 1}条房间信息: 通行证号码不能为空!`)
        return
      }
      if (!item.phone) {
        tip.push(`第${index + 1}条房间信息: 联系电话不能为空!`)
      } else {
        if (item.phoneCode === '00852' || item.phoneCode === '00853') {
          !/^\d{8}$/.test(item.phone) && tip.push(`第${index + 1}条房间信息: 手机号位数不正确(港澳地区为8位)!`)
        } else if (item.phoneCode === '00886') {
          !/^\d{9}$/.test(item.phone) && tip.push(`第${index + 1}条房间信息: 手机号位数不正确(台湾地区为9位)!`)
        } else {
          !/^\d{11}$/.test(item.phone) && tip.push(`第${index + 1}条房间信息: 手机号位数不正确(大陆地区为11位)!`)
        }
      }
    })
    let content = tip.map((item, index) => {
      return (<div key={index}>{item}<br/></div>)
    })
    tip.length > 0 && showModal && Modals.error({content})
    return tip.length === 0
  }

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const detail = this.props.detail;
    // detail.OrdSubscribeRoom = this.state.dataSource
    const reserveContactPhoneCode = (
      getFieldDecorator('reserveContactPhoneCode', {
        initialValue: detail.reserveContactPhoneCode || "86",
      })(
        <CodeOption className={styles.pre} disabled={detail.disableFlag} codeList={this.state.code.phoneCodes}
                    onChange={this.resetContactPhone.bind(this)} width='120px'/>
      )
    );
    const customerPhoneCode = (
      getFieldDecorator('customerPhoneCode', {
        initialValue: detail.customerPhoneCode || "86",
      })(
        <CodeOption className={styles.pre} disabled={detail.disableFlag} codeList={this.state.code.phoneCodes}
                    onChange={this.resetCustomerPhone.bind(this)} width='120px'/>
      )
    );
    const commonPhoneCode = (
      getFieldDecorator('commonPhoneCode', {
        initialValue: detail.commonPhoneCode || '',
      })(
        <CodeOption className={styles.pre} disabled={detail.disableFlag} codeList={this.state.code.phoneCodes}
                    placeholder=" " width='120px'/>
      )
    );

    let {dataSource, columns} = this.state

    return (
      <div className={styles.disableds}>
        <Form>
          <SvHeader detail={detail} reload={this.props.reload}/>
          {
            JSON.parse(localStorage.user).userType == "ADMINISTRATION" &&
            <div>
              <Form.Item label="渠道" {...formItemLayout}>
                {getFieldDecorator('channelId', {
                  rules: [{
                    required: true,
                    validator: (rule, value, callback) => {
                      if (value && (!value.value || !value.meaning)) {
                        callback('请选择渠道');
                      } else {
                        callback();
                      }
                    }
                  }],
                  initialValue: {
                    value: detail.channelId || JSON.parse(localStorage.user).relatedPartyId,
                    meaning: detail.channelName || ''
                  },
                })(
                  <Lov
                    title="选择渠道"
                    disabled={detail.disableFlag}
                    lovCode='CNL_AGENCY_NAME'
                    params={{userId: JSON.parse(localStorage.user).userId}}
                    itemChange={this.channelLovChange.bind(this)}
                  />
                )}
              </Form.Item>
            </div>
          }


          <Form.Item label="客户" {...formItemLayout}>
            {getFieldDecorator('applicantCustomerId', {
              rules: [{
                required: true,
                validator: (rule, value, callback) => {
                  if (value && (!value.value || !value.meaning)) {
                    callback('请选择客户');
                  } else {
                    callback();
                  }
                }
              }],
              initialValue: {value: detail.applicantCustomerId || '', meaning: detail.applicant || ''},
            })(
              <CustomerLov
                disabled={detail.disableFlag}
                suffix={true}
                lovCode='ORD_CUSTOMER'
                params={{
                  channelId: getFieldValue('channelId') ? getFieldValue('channelId').value : JSON.parse(localStorage.user).relatedPartyId,
                  orderId: getFieldValue('relatedOrderId') ? getFieldValue('relatedOrderId').value : '',
                }}
                title="选择客户"
                placeholder=" "
                itemChange={this.customerLovChange.bind(this)}
              />
            )}
          </Form.Item>
          <Form.Item label="保单订单编号" {...formItemLayout}>
            {getFieldDecorator('relatedOrderId', {
              initialValue: {value: detail.relatedOrderId || '', meaning: detail.relatedOrderNumber || ''},
            })(
              <Lov
                disabled={detail.disableFlag}
                suffix={true}
                lovCode='ORD_ORDERDETAIL'
                params={{
                  channelId: getFieldValue('channelId') ? getFieldValue('channelId').value : JSON.parse(localStorage.user).relatedPartyId,
                  orderType: 'INSURANCE',
                  customerId: getFieldValue('applicantCustomerId') ? getFieldValue('applicantCustomerId').value : '',
                }}
                title="选择保单订单编号"
                placeholder=" "
              />
            )}
          </Form.Item>
          <Col sm={8} md={8} offset={9} style={{fontSize: "12px", color: "#9c9c9c", top: "-16px"}}>
            如果客户当天同时预约了赴港签单，请输入保单订单编号，方便工作人员合理安排行程。
          </Col>
          {/*<Form.Item label="客户姓名" {...formItemLayout}>
            {getFieldDecorator('lodgerName', {
              rules: [
                {required: true,message: '请输入客户姓名',whitespace: true}
              ],
              initialValue: detail.lodgerName || '',
            })(
              <Input disabled={detail.disableFlag} placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="客户拼音姓名" {...formItemLayout}>
            {getFieldDecorator('lodgerPinyin', {
              rules: [
                {required: true,message: '请输入客户拼音姓名',whitespace: true,},
                {pattern:/^[A-Za-z ]+$/, message:'请输入英文字母或空格'},
              ],
              initialValue: detail.lodgerPinyin || '',
            })(
              <Input type="text" style={{textTransform:'uppercase'}} disabled={detail.disableFlag} placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="联系电话" {...formItemLayout}>
            {getFieldDecorator('customerPhone', {
              rules: [
                {required: true,message: '请输入联系电话',whitespace: true,},
                {validator: this.checkCustomerPhone.bind(this),}
              ],
              initialValue: detail.customerPhone || '',
            })(
              <Input disabled={detail.disableFlag} addonBefore={customerPhoneCode} placeholder=" " style={{width:'100%'}}/>
            )}
          </Form.Item>*/}

          <Form.Item label="酒店名称" {...formItemLayout}>
            {getFieldDecorator('sublineItemName', {
              rules: [
                {required: true, message: '请输入酒店名称', whitespace: true,}
              ],
              initialValue: detail.sublineItemName || '',
            })(
              <HotelTable
                disabled={detail.disableFlag}
                meaning={getFieldValue('sublineItemName')}
                data={this.state.productDetail.prdItemSublineList}
                hotelChange={this.hotelChange.bind(this)}
              />
            )}
          </Form.Item>

          <Form.Item label="sublineId" {...formItemLayout} style={{display: 'none'}}>
            {getFieldDecorator('sublineId', {
              initialValue: detail.sublineId || '',
            })(
              <Input readOnly disabled={true} placeholder="sublineId"/>
            )}
          </Form.Item>

          <Form.Item label="酒店地址" {...formItemLayout}>
            {getFieldDecorator('comments', {
              rules: [
                {required: true, message: '请输入酒店地址', whitespace: true,}
              ],
              initialValue: detail.comments || '',
            })(
              <Input readOnly disabled={true} className={styles.disabledInput}/>
            )}
          </Form.Item>

          <Form.Item label="酒店价格" {...formItemLayout}>
            {getFieldDecorator('price', {
              rules: [
                {required: true, message: '请输入酒店价格', whitespace: true,}
              ],
              initialValue: detail.price || '',
            })(
              <Input readOnly disabled={true} className={styles.disabledInput}/>
            )}
          </Form.Item>

          {/*<Form.Item label="价格区间（每晚）" {...formItemLayout}>
            {getFieldDecorator('priceInterval', {
              rules: [
                {required: true,message: '请选择价格区间（每晚）',whitespace: true}
              ],
              initialValue: detail.priceInterval || '',
            })(
              <Select disabled={detail.disableFlag} placeholder=" " className={styles['select-disableds']}>
                <Select.Option value="300元以下"> 300元以下</Select.Option>
                <Select.Option value="300-600元"> 300-600元</Select.Option>
                <Select.Option value="600-1000元"> 600-1000元</Select.Option>
                <Select.Option value="1000元以上"> 1000元以上</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="入住人数" {...formItemLayout}>
            {getFieldDecorator('peopleCount', {
              rules: [
                {required: true,message: '请输入入住人数', whitespace: true,type:'number'},
                {pattern:/^[1-9]\d*$/, message:'请输入正整数'},
              ],
              initialValue: detail.peopleCount || '',
            })(
              <InputNumber min={0} disabled={detail.disableFlag} style={{width:'100%'}} placeholder=" " />
            )}
          </Form.Item>*/}
          <Form.Item label="入住日期" {...formItemLayout}>
            {getFieldDecorator('checkinDate', {
              rules: [
                {required: true, message: '请选择入住日期', whitespace: true, type: 'object',}
              ],
              initialValue: detail.checkinDate ? moment(detail.checkinDate, 'YYYY-MM-DD') : undefined,
            })(
              <DatePicker
                disabled={detail.disableFlag}
                showTime={{format: 'HH:mm'}}
                format="YYYY-MM-DD"
                disabledDate={this.disabledStartDate.bind(this)}
                onChange={this.handleChangeDate.bind(this)}
                style={{width: "100%"}}
                placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="退房日期" {...formItemLayout}>
            {getFieldDecorator('checkoutDate', {
              rules: [
                {required: true, message: '请选择退房日期', whitespace: true, type: 'object',}
              ],
              initialValue: detail.checkoutDate ? moment(detail.checkoutDate, 'YYYY-MM-DD') : undefined,
            })(
              <DatePicker
                disabled={detail.disableFlag}
                showTime={{format: 'HH:mm'}}
                format="YYYY-MM-DD"
                disabledDate={this.disabledEndDate.bind(this)}
                style={{width: "100%"}}
                placeholder=" "/>
            )}
          </Form.Item>

          <div style={{width: '100%', margin: 'auto', marginBottom: '20px'}}>
            <div className="toolbar" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #ffbe00',
              borderBottom: 'none',
              padding: '10px',
              borderColor: JSON.parse(localStorage.theme).themeColor
            }}>
              <h4>预订房间信息</h4>
              {
                this.props.detail.disableFlag ? '' :
                  (<span style={{color: JSON.parse(localStorage.theme).themeColor, cursor: 'pointer'}}
                         onClick={this.addRoom.bind(this)}>添加房间</span>)
              }
            </div>
            <Table bordered dataSource={dataSource} pagination={false} columns={columns} />
          </div>

          {/*<Form.Item label="房间数" {...formItemLayout}>
            {getFieldDecorator('roomCount', {
              rules: [
                {required: true,message: '请输入房间数',whitespace: true,type: 'number',},
                {pattern:/^[1-9]\d*$/, message:'请输入正整数'},
              ],
              initialValue: detail.roomCount || '',
            })(
              <InputNumber disabled={detail.disableFlag} style={{width:"100%"}} placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="房型" {...formItemLayout}>
            {getFieldDecorator('roomType', {
              rules: [
                {required: true,message: '请输入房型',whitespace: true,}
              ],
              initialValue: detail.roomType || '',
            })(
              <Input disabled={detail.disableFlag} placeholder="如：大床房、标准房" />
            )}
          </Form.Item>
          <Form.Item label="指定酒店名称或地段" {...formItemLayout}>
            {getFieldDecorator('hotelName', {})(
              <Input disabled={detail.disableFlag}/>
            )}
          </Form.Item>*/}
          <Form.Item label="预约目的" {...formItemLayout}>
            {getFieldDecorator('reserveContactPurpose', {
              rules: [
                {required: true, message: '请选择预约目的', whitespace: true,}
              ],
              initialValue: detail.reserveContactPurpose || '',
            })(
              <Select disabled={detail.disableFlag} placeholder="预约目的" className={styles.selectDisabled}>
                {this.state.code.reserveContactPurpose && this.state.code.reserveContactPurpose.map((item, index) => {
                  return (<Select.Option value={item.value} key={index}>{item.meaning}</Select.Option>)
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="预约对接人" {...formItemLayout}>
            {getFieldDecorator('reserveContactPerson', {
              rules: [
                {required: true, message: '请输入预约对接人', whitespace: true,}
              ],
              initialValue: detail.reserveContactPerson || JSON.parse(localStorage.user).userName,
            })(
              <Input disabled={detail.disableFlag} placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="对接人电话" {...formItemLayout}>
            {getFieldDecorator('reserveContactPhone', {
              rules: [
                {required: true, message: '请输入对接人电话', whitespace: true,},
                {validator: this.checkContactPhone.bind(this),}
              ],
              initialValue: detail.reserveContactPhone || JSON.parse(localStorage.user).phone,
            })(
              <Input disabled={detail.disableFlag} addonBefore={reserveContactPhoneCode} style={{width: '100%'}}
                     placeholder=" "/>
            )}
          </Form.Item>
          <Form.Item label="备注" {...formItemLayout} >
            {getFieldDecorator('reserveComment', {
              initialValue: detail.reserveComment || '',
            })(
              <Input type="textarea" className={styles['textarea-disableds']} disabled={detail.disableFlag}
                     placeholder=" "/>
            )}
          </Form.Item>

          {/*预约确认信息*/}
          {
            detail.disableFlag && (detail.status === 'WAIT_PAY' || detail.status === 'RESERVE_SUCCESS') &&
            <div style={{borderTop: '1px solid #E9E9E9', marginTop: '30px'}}>
              <div
                style={{fontFamily: 'Microsoft YaHei', fontSize: '20px', textAlign: 'center', margin: '20px'}}>预约确认信息
              </div>
              <Form.Item label="酒店名称" {...formItemLayout}>
                {getFieldDecorator('commonName', {
                  initialValue: detail.commonName || '',
                })(
                  <Input disabled={detail.disableFlag}/>
                )}
              </Form.Item>
              <Form.Item label="酒店电话" {...formItemLayout}>
                {getFieldDecorator('commonPhone', {
                  initialValue: detail.commonPhone || '',
                })(
                  <Input disabled={detail.disableFlag} addonBefore={commonPhoneCode} style={{width: '100%'}}/>
                )}
              </Form.Item>
              <Form.Item label="酒店地址" {...formItemLayout}>
                {getFieldDecorator('commonAddr', {
                  initialValue: detail.commonAddr || '',
                })(
                  <Input disabled={detail.disableFlag}/>
                )}
              </Form.Item>
              <Form.Item label="备注" {...formItemLayout}>
                {getFieldDecorator('commonRemark', {
                  initialValue: detail.commonRemark || '',
                })(
                  <Input type="textarea" className={styles['textarea-disableds']} disabled={detail.disableFlag}/>
                )}
              </Form.Item>
            </div>
          }
          <FormItem  {...tailFormItemLayout} >
            <SvFooter
              detail={detail}
              callback1={this.callback1.bind(this)}
              callback2={this.callback2.bind(this)}/>
          </FormItem>
        </Form>

        <Row>
          <Col xs={22} sm={22} md={22} lg={22} xl={22} offset={1} className={styles.productSubscribeReminder}
               style={{paddingTop: "28px", marginBottom: '30px'}}>
            温馨提示：
            <Row>1、所有酒店房型的价格以财联邦客服确认房源后提供的报价为准；</Row>
            <Row>2、所有酒店默认房型为高级客房，如需升级房型，请在预约中备注（其他房型价格请见“增值服务-酒店预订”的产品详情）；</Row>
            <Row>3、预约成功后，客人于入住日期前3日之前取消订单，房费全数退还;客人于入住日期前3日之内取消，将扣除首晚房费后，剩余金额退还。</Row>
          </Col>
        </Row>
      </div>
    );
  }

}

export default SvDetailJDYD;
