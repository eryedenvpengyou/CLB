import React from 'react';
import { Button, Cascader, Col, DatePicker, Form, Input, Modal, Radio, Row, Select, Spin, Table } from 'antd';
import { isEmpty, isFunction } from 'lodash';
import {handleTableChange} from '../../utils/table';
import * as service from '../../services/channel';
import * as codeService from '../../services/code';
import pcCascade from '../../utils/common';
import CodeOption from '../common/CodeOption';
import Modals from '../common/modal/Modal';
import PsCtCommisionMd from './PsCtCommisionMd';
import style from '../../styles/channelTeam.css';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 19 },
  },
};
const formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 22 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 20,
      offset: 0,
    },
    sm: {
      span: 18,
      offset: 5,
    },
  },
};

class TeamCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: {},
      options: [],
      dataList:[],
      pagination:{},
      commissionVisible: false,
      radioChecked: 'select',       //佣金分成方式
      ratio: [],
      loading: false,
      modalKey: 0,
      formDisabled: false,
      passwordType: 'text',
      formDefaultData: {},
      personalRateParams:{},
      quota: '',
    };
  }

  async componentWillMount() {
    const params = {
      provinceList: 'PUB.PROVICE',                // 省份
      cityList: 'PUB.CITY',                       // 城市
      phoneCodes: 'PUB.PHONE_CODE',               // 手机号前缀
    };
    codeService.getCode(params).then((data) => {
      const options = pcCascade(data);
      this.setState({ options, code: data });
    });

    //分成 下拉列表的值
    service.fetchRatio({companyType:'CHANNEL',channelId: JSON.parse(localStorage.user||'{}').relatedPartyId, page: 1, pagesize: 99999}).then((data)=>{
      if(data.success){
        this.setState({ratio: data.rows || [] });
      }
    });
    let quota = await service.getQuoat()
    this.setState({quota});
  }


  // 关闭模态框
  handleCancel = () => {
    this.setState({
      dataList: [],
      modalKey: this.state.modalKey + 1,
      formDisabled: false,
      passwordType: 'text',
      formDefaultData: {},
    });
    this.props.form.resetFields();
    this.props.createClose(false);
  }

  // 重置功能
  handleReset = () => {
    this.props.form.resetFields();
    this.setState({
      passwordType: 'text',
      formDisabled: false,
      formDefaultData: {},
    });
  }

  // 点击提交按钮执行的函数
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {};
        const part = values.part;
        params.province = part[0];
        params.city = part[1];
        params.host = location.origin.split('://')[1];
        params.parentChannelId = JSON.parse(localStorage.user).relatedPartyId;
        params.channelName = values.channelName;
        params.contactPhone = values.contactPhone;
        params.phoneCode = values.prefix;
        params.contractperson = values.contractperson;
        params.email = values.email;
        params.chineseName =  values.channelName;
        params.contactPerson = values.channelName;
        if (this.state.formDisabled) {
          params.channelId = values.channelId;
        }
        params.statusCode = 'APPROVED'; /* REGISTED */
        params.channelSource = 'FRONT';
        params.channelTypeCode = 'PERSONAL';
        params.exhibitionMode = 'CUS';
        params.partyType = 'CHANNEL';

        params.user = {};
        params.user.email = values.email;
        params.user.userName = values.userName;
        params.user.password = values.password;
        params.user.phone = values.contactPhone;
        params.user.phoneCode = values.prefix;
        params.user.planQuota = values.planQuota;
        params.user.status = 'INACTIVE';
        params.user.userType = 'CHANNEL';

        //选择级别处理
        params.defineRateFlag = this.state.radioChecked === 'custom'? 'Y' : 'N';
        if(params.defineRateFlag === 'N'){
          let rateLevelId = values.rateLevelId;
          let rateLevelName = null;
          this.state.ratio.map((item)=>{
            if(item.ratioId === rateLevelId)
              rateLevelName = item.ratioName;
          });
          params.rateLevelId = rateLevelId;
          params.rateLevelName = rateLevelName;
          if(this.state.dataList.length<1){
            Modals.error({ content: '请选择已设置佣金分成的渠道等级' });
            return false;
          }
        }else{
          if(this.state.dataList.length<1){
            Modals.error({ content: '请至少自定义一行佣金分成' });
            return false;
          }
        }

        //格式化 佣金
        let cnlChannelContractRate = this.state.dataList || [];
        cnlChannelContractRate.map((item, index)=>{
          item.rate1 = this.parse(item.rate1);
          item.rate2 = this.parse(item.rate2);
          item.rate3 = this.parse(item.rate3);
          item.rate4 = this.parse(item.rate4);
          item.rate5 = this.parse(item.rate5);
          item.rate6 = this.parse(item.rate6);
          item.rate7 = this.parse(item.rate7);
          item.rate8 = this.parse(item.rate8);
          item.rate9 = this.parse(item.rate9);
          item.rate10 = this.parse(item.rate10);
          if(item.channelRateId){
            item.__status = 'update';
          }else{
            item.__status = 'add';
          }
        });
        params.cnlChannelContractRate = cnlChannelContractRate;

        this.setState({ loading: true });
        service.createChannel(params).then((data) => {
          if (data.success) {
            this.setState({
              dataList: [],
              modalKey: this.state.modalKey + 1,
              formDisabled: false,
              passwordType: 'text',
            });
            this.props.createClose(true);

          } else {
            Modals.error({ content: data.message });
            this.setState({ loading: false });
          }
        });

      } else {
        if(values.userName && values.channelName && values.contactPhone &&JSON.parse(localStorage.user).rateLevelId==undefined){
          Modals.error({ content: '请选择渠道等级' });
        }else{
          Modals.error({ content: '请正确填写完相关信息' });
        }
        return;
      }
    });
  }
  //格式化数据
  parse(number){
    return number? parseFloat(number/100).toFixed(4) : 0;
  }


  //当手机号改变的时候，需要根据手机号调用接口：手机号已存在则获取那条记录并返回，不存在则不返回
  setUserDetai() {
    const params = {};
    const form = this.props.form;
    const prefix = form.getFieldValue('prefix');
    let formDefaultData = this.state.formDefaultData;
    const contactPhone = form.getFieldValue('contactPhone');
    params.phoneCode = prefix;
    params.contactPhone = contactPhone;
    this.setState({ loading: true });
    service.fetchPersonal(params).then((data) => {
      if (data && data.success && !isEmpty(data.rows[0])) {
        this.props.form.resetFields();
        const d = data.rows[0];
        formDefaultData = {
          email: d.email,
          userName: d.userName,
          contactPhone: d.contactPhone,
          prefix: d.phoneCode,
          phoneCode: d.phoneCode,
          planQuota: d.planQuota,
          channelName: d.channelName,
          part: [d.province, d.city],
          contractperson: d.contractperson,
          channelId: d.channelId,
        };
        this.setState({ formDisabled: true, loading: false, passwordType: 'password', formDefaultData });
      } else {
        this.setState({ loading: false , dataList: []});
      }
    });
  }


  //当更改了phoneCode就清空手机号
  phoneCodeChange = (value) => {
    if(value){
      this.props.form.resetFields(['contactPhone']) ;
    }
  }
  //验证手机号
  checkPhone = (rule, value, callback) => {
    if(!value){
      callback();
    }else{
      let preCode = this.props.form.getFieldValue('prefix');
      let regex = /^\d{11}$/, msg = '手机号位数不正确(大陆地区为11位)';

      if( preCode ==='00852' || preCode ==='00853'){
        regex = /^\d{8}$/;
        msg = '手机号位数不正确(港澳地区为8位)';
      }else if(preCode ==='00886' ){
        regex = /^\d{9}$/;
        msg = '手机号位数不正确(台湾地区为9位)';
      }

      if ( value && !regex.test(value)  ) {
        if(isFunction(callback)) {
          callback(msg);
        }
      }else if(isFunction(callback)) {
        callback();
        this.setUserDetai();
      }
    }
  }


  //佣金分成编辑
  commissionEdit(action, record, index){
    switch(action){
      case 'detail':
        location.hash = '/';
        break;

      case 'add':
        if(this.state.dataList.length == 10){
          Modals.error({ content: '创建成员时，只能定义10条佣金分成' });
        }else{
          record.__status = 'add';
          this.setState({commissionRecord: record, commissionVisible: true});
        }
        break;

      case 'edit':
        record.__status = 'update';
        record.index = index;
        //注意设置这两个 state的顺序，注意
        this.setState({commissionVisible: true,},()=>{
          this.setState({commissionRecord: record});
        });
        // this.setState({commissionRecord: record, commissionVisible: true});
        break;

      case 'delete':
        Modals.warning(this.commissionDelete.bind(this, record,index), {content:'确定删除吗？'});
        break;
    }
  }
  //佣金分成弹出窗回调
  commissionCallback(record){
    if(record && record.__status){
      let dataList = this.state.dataList || [];
      if(record.__status == 'update'){
        dataList[record.key] = record;
      }else{
        record.__status = 'update';
        record.objectVersionNumber = 0;
        dataList.push(record);
      }
      dataList.map((item,idx)=>{item.key = idx;});
      this.setState({dataList, commissionVisible: false});
      this.customSubmit(record);
    }else{
      this.setState({commissionVisible: false});
    }
  }
  //佣金分成从数据库删除
  commissionDelete(record, index, flag){
    if(flag){
      let dataList = this.state.dataList || [];
      dataList.splice(index, 1);
      dataList.map((item,idx)=>{item.key = idx;});
      this.setState({dataList});
      // if(record.ratioIdLineId){
      //   service.removeRatioDetail({ratioIdLineId: record.ratioIdLineId});
      // }
    }
  }
  //佣金分成自定义新增编辑
  customSubmit(record){
    let dataList = [];
    this.state.dataList.map((item,index)=>{
      dataList.push({
        bigClass:item.bigClass,
        midClass:item.midClass ,
        minClass:item.minClass,
        itemId:item.itemId ,
        sublineId:item.sublineId ,
      })
    });
    service.validateChannelRate(dataList).then((data)=>{
      if(!data.success){
        Modals.error({content: data.message});
        this.commissionDelete(record,record.key,true)
      }
    });
  }
  //单选按钮改变
  radioChange(e){
    this.setState({radioChecked: e.target.value});
    if(e.target.value === 'select'){
      let rateLevelId = this.props.form.getFieldValue('rateLevelId');
      this.ratioChange(rateLevelId, 'select');
    }else if(e.target.value === 'custom'){
      //添加成员 这里的自定义应该不用查佣金，因为本来就没有
      this.state.dataList = [];
      this.state.pagination={
        current:0,
        pageSize:0,
        total:0
      };
    }
  }

  //等级发生改变
  ratioChange(value, radioChecked){
    this.state.pagination.current = 1;
    if(this.state.radioChecked !== 'select' && radioChecked !== 'select' ) return;

    let rateLevelName = null;
    this.state.ratio.map((item)=>{
      if(item.ratioId === value)
        rateLevelName = item.ratioName;
    });

    this.state.personalRateParams = {
      channelId: JSON.parse(localStorage.user||'{}').relatedPartyId,
      defineRateFlag: 'N',
      rateLevelId: value,
      rateLevelName: rateLevelName,
      partyType: 'CHANNEL',
    };

    //费率
    service.personalRate(this.state.personalRateParams).then((data)=>{
      if(data.success){
        const pagination = this.state.pagination;
        pagination.total = data.total;
        let dataList = data.rows || [];
        dataList.map((item,index)=>{
          item.key = index;
          item.rate1 = item.rate1? parseFloat(item.rate1 * 100).toFixed(2) : 0;
          item.rate2 = item.rate2? parseFloat(item.rate2 * 100).toFixed(2) : 0;
          item.rate3 = item.rate3? parseFloat(item.rate3 * 100).toFixed(2) : 0;
          item.rate4 = item.rate4? parseFloat(item.rate4 * 100).toFixed(2) : 0;
          item.rate5 = item.rate5? parseFloat(item.rate5 * 100).toFixed(2) : 0;
          item.rate6 = item.rate6? parseFloat(item.rate6 * 100).toFixed(2) : 0;
          item.rate7 = item.rate7? parseFloat(item.rate7 * 100).toFixed(2) : 0;
          item.rate8 =  item.rate8? parseFloat(item.rate8 * 100).toFixed(2) : 0;
          item.rate9 = item.rate9? parseFloat(item.rate9 * 100).toFixed(2) : 0;
          item.rate10 = item.rate10? parseFloat(item.rate10 * 100).toFixed(2) : 0;
        });
        this.setState({ dataList,pagination });
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      loading,
      modalKey,
      formDisabled,
      passwordType,
      formDefaultData,
      dataList,
    } = this.state;

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: formDefaultData && formDefaultData.phoneCode ? formDefaultData.phoneCode : '86',
    })(
      <CodeOption codeList={this.state.code.phoneCodes} width={180} onChange={this.phoneCodeChange}/>,
    );

    const commissionColumns = [
      {
        title: '产品大分类',
        dataIndex: 'bigClassDesc',
      }, {
        title: '产品中分类',
        dataIndex: 'midClassDesc',
      }, {
        title: '产品小分类',
        dataIndex: 'minClassDesc',
      }, {
        title: '产品名称',
        dataIndex: 'itemName',
      }, {
        title: '供款期',
        dataIndex: 'sublineItemName',
      }, {
        title: '第一年',
        dataIndex: 'rate1',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第二年',
        dataIndex: 'rate2',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第三年',
        dataIndex: 'rate3',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第四年',
        dataIndex: 'rate4',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第五年',
        dataIndex: 'rate5',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第六年',
        dataIndex: 'rate6',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第七年',
        dataIndex: 'rate7',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第八年',
        dataIndex: 'rate8',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第九年',
        dataIndex: 'rate9',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '第十年',
        dataIndex: 'rate10',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      }, {
        title: '分成备注',
        dataIndex: 'performanceRequire',
      }, {
        title: '调整记录',
        dataIndex: 'specialDesc',
      },
    ];
    if(this.state.radioChecked == 'custom'){
      commissionColumns.push({
        title: '操作',
        dataIndex: 'operate',
        fixed: 'right',
        width: 160,
        render: (text, record, index) => {
          return (
            <div>
              <Button
                type="default" style={{height:28,fontSize:14}}
                disabled={this.state.radioChecked === 'custom'? false: true}
                onClick={this.commissionEdit.bind(this,'edit',record,index)} >编辑</Button>

              <Button
                type="default" style={{height:28,fontSize:14, marginLeft:5}}
                disabled={this.state.radioChecked === 'custom'? false: true}
                onClick={this.commissionEdit.bind(this,'delete',record,index)} >删除</Button>
            </div>
          );
        },
      })
    }
    return (
      <div >
        <Modal
          wrapClassName={`${style.channel} ${style.modal} ${style.create}`}
          visible={this.props.visible}
          width={900}
          title="添加成员"
          style={{ top: 20 }}
          onCancel={this.handleCancel}
          footer={null}
          key={modalKey}
        >
          <Spin spinning={loading}>
            <Row id="area1">
              <Form >
                <Row style={{ borderBottom: '1px solid #d0d0d0' }}>
                  <FormItem {...formItemLayout} label="手机号" >
                    { getFieldDecorator('contactPhone', {
                      initialValue: formDefaultData && formDefaultData.contactPhone ? formDefaultData.contactPhone : '',
                      rules: [
                        {required: true, message: '请输入联系电话'},
                        {validator: this.checkPhone.bind(this),}
                      ],
                    })(
                     <Input disabled={formDisabled} addonBefore={prefixSelector} placeholder=" " style={{ width: '100%' }} />,
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('channelId', {
                      initialValue: formDefaultData && formDefaultData.channelId ? formDefaultData.channelId : ''
                    })(
                      <Input type="hidden" />,
                    )}
                  </FormItem>
                  <FormItem{...formItemLayout} label="渠道名称">
                    {getFieldDecorator('channelName', {
                      initialValue: formDefaultData && formDefaultData.channelName ? formDefaultData.channelName : '',
                      rules: [{ required: true, message: '请输入渠道名称', whitespace: true }],
                    })(
                      <Input disabled={formDisabled} placeholder=" " />,
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="电子邮箱" >
                    {getFieldDecorator('email', {
                      initialValue: formDefaultData && formDefaultData.email ? formDefaultData.email : '',
                      rules: [
                        { message: '邮箱格式不正确',pattern:/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/ },                      ],
                    })(
                      <Input disabled={formDisabled} />,
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="所在地区">
                    {getFieldDecorator('part', {
                      initialValue: formDefaultData && formDefaultData.part ? formDefaultData.part : [],
                    })(
                      <Cascader disabled={formDisabled} options={this.state.options} getPopupContainer={() => document.getElementById('area1')} placeholder=" " />,
                    )}
                  </FormItem>
                </Row>

                <Row style={{ marginTop: '5%' }}>
                  <FormItem
                    {...formItemLayout}
                    label="用户名"

                  >
                    {getFieldDecorator('userName', {
                      initialValue: formDefaultData && formDefaultData.userName ? formDefaultData.userName : '',
                      rules: [{ required: true, message: '请输入用户名', whitespace: true }],
                    })(
                      <Input disabled={formDisabled} placeholder=" " />,
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="初始密码"
                  >
                    {getFieldDecorator('password', {
                      initialValue: '123456',
                    })(
                      <Input type={passwordType} disabled />,
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="计划书额度"
                  >
                    {getFieldDecorator('planQuota', {
                      // initialValue: formDefaultData && (formDefaultData.planQuota || formDefaultData.planQuota === 0) ? formDefaultData.planQuota : this.state.quota,
                      initialValue: formDefaultData && formDefaultData.planQuota ? formDefaultData.planQuota : this.state.quota,
                    })(
                      <Input disabled />,
                    )}
                  </FormItem>
                </Row>

                <Row>
                  <FormItem {...formItemLayout} label="佣金分成" >
                    <RadioGroup style={{display:'block'}} value={this.state.radioChecked} onChange={this.radioChange.bind(this)}>
                      <Row >
                        <Col span={6}>
                          <Radio value='select' style={{fontSize:'16px',fontWeight:'normal',width:'100%',lineHeight:'40px'}}>选择渠道等级</Radio>
                        </Col>
                        {
                          this.state.radioChecked === 'select' &&
                          <Col span={18}>
                            <FormItem {...formItemLayout2} label=" " colon={false}>
                              {getFieldDecorator('rateLevelId', {
                                rules: [{required:true,message:'请选择渠道等级'}],
                              })(
                                <Select placeholder="选择渠道等级" style={{ width:'100%'}} onChange={this.ratioChange.bind(this)}>
                                  {
                                    this.state.ratio &&
                                    this.state.ratio.map((item)=>
                                      <Select.Option key={item.ratioName} value={item.ratioId} >{item.ratioName}</Select.Option>
                                    )
                                  }
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                        }
                      </Row>

                      <Radio value='custom' style={{fontSize:'16px',display:'block',fontWeight:'normal'}}>自定义</Radio>

                      {
                        this.state.radioChecked === 'custom' &&
                        <Button onClick={this.commissionEdit.bind(this,'add',{})} type='default' style={{float:'right',width:100,height:38,marginBottom:5,marginRight:5}} >新增</Button>
                      }
                      <div style={{clear:'both'}}>
                        <Table
                          columns={commissionColumns}
                          dataSource={dataList}
                          onChange={handleTableChange.bind(this, service.personalRate, this.state.personalRateParams)}
                          bordered
                          scroll={{x:'250%'}}
                          pagination={this.state.radioChecked === 'custom'?false:this.state.pagination}/>
                      </div>
                    </RadioGroup>
                  </FormItem>

                  <PsCtCommisionMd
                        visible={this.state.commissionVisible}
                        record={this.state.commissionRecord}
                        callback={this.commissionCallback.bind(this)}/>
                </Row>

                <FormItem {...tailFormItemLayout} >
                  <Row gutter={24}>
                    <Col span={6} offset={3}>
                      <Button type="default" style={{ width: 120,height: 40 }} onClick={this.handleReset}>重置</Button>
                    </Col>

                    <Col span={6} offset={4}>
                      <Button type="primary" style={{ width: 120,height: 40 }} htmlType="submit" size="large" loading={loading} disabled={false} onClick={this.handleSubmit}>提交</Button>
                    </Col>
                  </Row>
                </FormItem>
              </Form>
            </Row>

          </Spin>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(TeamCreate);
