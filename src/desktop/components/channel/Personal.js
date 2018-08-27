/**
 *  created by xiaoyong.luo@hand-china.com at 2017/7/1 22:48
 */
import React from 'react';
import { Form, Checkbox,Input,Row,Col, Button,Table,Icon,Cascader,Switch} from 'antd';
import {formatFile} from '../../utils/common';
import Uploads from '../../components/common/Upload';
import {indexOf} from 'lodash';
import isEmpty from 'lodash/isEmpty';
import pcCascade from '../../utils/common';
import * as codeService from '../../services/code';
import * as service from '../../services/channel';
import * as registerService from '../../services/register';
import * as common from '../../utils/common';
import PsPasswdMd from './PsPasswdMd';
import PsPhoneNewMd from './PsPhoneNewMd';
import PsPhoneNowMd from './PsPhoneNowMd';
import Modals from '../common/modal/Modal';
import CodeOption from '../common/CodeOption';
import Avatar from './Avatar';
import {PICTURE_ADDRESS} from '../../constants';
import * as styles from '../../styles/qa.css';
import photo from '../../styles/images/photo.png';


const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;


const formItemLayout = {
  labelCol: {
    sm: { span: 10 , offset: 0},
  },
  wrapperCol: {
    sm: { span: 10 , offset: 0},
  },
};

const plainOptions = [
  {label: '邮件', value:'email'},
  {label: '短信', value:'sms'},
  {label: '微信', value:'wechat'},
  {label: '系统', value:'platform'}
];


class Personal extends React.Component {
  state = {
    channelId: this.props.channelId || JSON.parse(localStorage.user||'{}').relatedPartyId,
    userName: this.props.userName || JSON.parse(localStorage.user||'{}').userName,
    info: {},
    userInfo:{},
    contract: [],
    code: {},
    options:[],
    phoneVisibleNew: false,
    phoneVisibleNow: false,
    passwordVisible: false,
    ntcFlag: false,
    parrentChannels:'',
    modifyFlag: false,
    oldEmail: '',
    editable: false,
  };

  componentWillMount() {
    let params ={
      nationalList: 'PUB.NATION',                           //国籍
      provinceList: 'PUB.PROVICE',                          //省份
      cityList: 'PUB.CITY',                                 //城市
      channelTypeCodes: 'CNL.CHANNEL_TYPE',                 //渠道类型
      industryBackgrounds: 'CNL.INDUSTRY_BACKGROUND',       //行业背景
      experienceFlags: 'SYS.YES_NO',                        //有无经验
      exhibitionModes: 'CNL.EXHIBITION_MODE',               //展业模式
      exhibitionRanges: 'CNL.EXHIBITION_RANGE',             //展业范围
      phoneCodes: 'PUB.PHONE_CODE',                         //手机号前缀
      certificateTypes: 'CNL.CERTIFICATE_TYPE',             //证件类型
      hkBanks: 'PUB.HK_BANK',                               //香港银行类型
      ilBanks: 'PUB.IL_BANK',                               //内地银行类型
      contractTypes: 'CNL.CONTRACT_TYPE',                   //合约类别
      partyTypes: 'CNL.PARTY_TYPE',                         //合同主体分类
      productDivisions: 'PRD.PRODUCT_DIVISION',             //产品大分类
      channelClass: 'CNL.CHANNEL_CLASS',                    //渠道分类
    };
    codeService.getCode(params).then((data)=>{
      const options = pcCascade(data);
      this.setState({
        options: options,
        code: data,
      });
    });

    params = {
      channelId: this.state.channelId,
    };
    service.fetchPersonal(params).then((data)=>{
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
        });
        const info = data.rows[0] || {};
        this.setState({info, oldEmail: info.email});

        //当渠道的状态为"已审核"时，"渠道名称"字段不可编辑
        if(!isEmpty(data.rows[0]) && data.rows[0].statusCode === "APPROVED"){
          this.setState({modifyFlag:true})
        }else{
          this.setState({modifyFlag:false})
        }
      }
    });

    // const sameFlag = this.props.channelId == JSON.parse(localStorage.user||'{}').relatedPartyId? true : false;
    if(this.props.channelId){
      params.parentChannelId = JSON.parse(localStorage.user||'{}').relatedPartyId;
    }
    //查看合约
    service.personalContract(params).then((data)=>{
      if(data.success){
        const contract = data.rows || [];
        let parrentChannels = '';
        for(let i in contract){
          parrentChannels =  contract[i].partyName + '、' + parrentChannels;
        }
        this.setState({contract,parrentChannels});
      }
    });
    let query = {}
    location.hash.split('?')[1].split('&').map(i => {
      query[i.split('=')[0]] = i.split('=')[1]
    })
    let memberType = decodeURI(query.memberType || '')
    service.checkUpdateChannelInfo({userId: JSON.parse(localStorage.user).userId}).then(data => {
      // 含有团队下线才可进行编辑
      this.setState({editable: data.success && ~memberType.indexOf('团队下线')})
    })
    //查看用户信息
    registerService.fetchUserInfo({userId:JSON.parse(localStorage.user).userId}).then((data)=>{
      if(data.success){
        const userInfo = data.rows[0] || {};
        const ntcFlag = userInfo.ntcFlag == 'Y' ? true : false;
        this.setState({userInfo, ntcFlag})
      }
    });
  }

  //校验身份证号格式
  checkNumber = (rule, value, callback) => {
    let certificateType = this.props.form.getFieldValue('certificateType')
    let regex = /^[A-Za-z0-9]+$/;

    if( certificateType =='IDENTITY'){
      regex = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    }else if(certificateType =='TW_IDENTITY' ){
      regex = /^[A-Z][0-9]{9}$/;
    }else if(certificateType =='HK_IDENTITY' ){
      //英文+六位数字+(数字/英文) 英文+六位数字+数字/英文 2位英文+5位数字+(数字/英文)
     regex = /^((\s?[A-Za-z])|([A-Za-z]{2}))\d{5}(\([0−9A-Za-z]\)|\([0-9A-Za-z]\))$|^((\s?[A-Za-z])|([A-Za-z]{2}))\d{5}(\（[0−9A-Za-z]\）|\（[0-9A-Za-z]\）)$|^[A-Za-z][0-9]{6}\([0-9A-Za-z]\)$|^[A-Za-z][0-9]{6}\（[0-9A-Za-z]\）$|^[A-Za-z][0-9]{6}[0-9A-Za-z]$/;
    }

    if ( value && !regex.test(value)  ) {
      callback('证件格式不正确');
    } else {
      callback();
    }
  }
  //当证件类型改变时 重置证件编号字段
  resetNumber (value){
    if(value){
      this.props.form.setFieldsValue({certificateNumber:''}) ;
    }
  }


  //原手机号回调
  phoneVisibleNow(flag){
    if(flag){
      this.setState({phoneVisibleNow:false, phoneVisibleNew:true});
    }else{
      this.setState({phoneVisibleNow:false, phoneVisibleNew:false});
    }
  }

  //变更手机号 弹出框 隐藏
  phoneVisibleNew(value){
    this.setState({ phoneVisibleNow:false, phoneVisibleNew:false});
  }


  //修改密码 控制弹出框 显示隐藏
  passwordVisible(value){
    this.setState({passwordVisible:false});
  }

  //点击 变更手机号按钮 对应事件
  openPhoneNow(){
    // if(this.props.channelId == JSON.parse(localStorage.user||'{}').relatedPartyId){
    //   this.setState({phoneVisibleNow:true, phoneVisibleNew:false});
    // }
    if(!this.props.channelId || this.state.editable){
      this.setState({phoneVisibleNow:true, phoneVisibleNew:false});
    }
  }

  //点击 修改密码按钮 对应事件
  openPasswordMd(){
    this.setState({passwordVisible:true});
  }

  //改变开关的时候触发
  switchChange(flag,e){
    this.setState({[flag]:e});
  }

  // 校验香港账户名称和英文全称是否一致
  checkSame (rule, value, callback){
    if (value && value.toLowerCase() !== this.props.form.getFieldValue('englishName').toLowerCase()) {
      if(typeof callback === 'function') {
        callback('香港账户名称与英文全称必须一致');
      }
    } else {
      if(typeof callback === 'function') {
        callback();
      }
    }
  }

  //提交表单
  submit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let values = this.props.form.getFieldsValue() || {}, results = [];

        values.englishName = values.englishName.toUpperCase(); //英文全称 转化 成大写 英文
        values.hkBankAccountName = values.hkBankAccountName.toUpperCase(); //香港账户名称 转化 成大写 英文

        if(values.hkBankAccountName === values.englishName){

          values.channelId = this.state.info.channelId || JSON.parse(localStorage.user).relatedPartyId;
          values.province = values.part ? values.part[0]? values.part[0] : null : null;
          values.city = values.part ? values.part[1] : null;
          values.photoFileId = values.photo ? values.photo.success ? values.photo.fileId : ''  : '';

          //附件表
          let files = [];
          files.push.apply(files,formatFile(values.hkCardFile || [], false, '香港银行卡复印件'));
          files.push.apply(files,formatFile(values.ilCardFile || [], false, '内地银行卡复印件'));
          files.push.apply(files,formatFile(values.companyFile || [], false, '公司证明'));
          files.push.apply(files,formatFile(values.identifyFile || [], false, '身份证副本'));

          for(let i in files){
            if(files[i].channelArchiveId)
              files[i].channelId = this.state.info.channelId || JSON.parse(localStorage.user).relatedPartyId;
          }

          values.cnlChannelArchive = files;
          values.__status = 'update';

          values.user = {};
          values.user.userId = this.state.info.userId || JSON.parse(localStorage.user).userId;
          values.user.email = values.email;
          values.oldEmail = this.state.oldEmail;
          results.push(values);

          //提交个人信息
          service.submitDetail(results).then((data) =>{
            if(data.success){
              this.setState({oldEmail: data.rows[0].email})
              Modals.success({content:'提交成功'});
            }else{
              Modals.error({content:data.message});
            }
          });

          let params = {}, platform = values.platform || [];
          params.ntcFlag = this.state.ntcFlag ? 'Y' : 'N';
          params.emailFlag = indexOf(platform, 'email') < 0 ? 'N' : 'Y';
          params.smsFlag = indexOf(platform, 'sms') < 0 ? 'N' : 'Y';
          params.wechatFlag = indexOf(platform, 'wechat') < 0 ? 'N' : 'Y';
          params.platformFlag = indexOf(platform, 'platform') < 0 ? 'N' : 'Y';
          params.userId = this.state.info.userId || JSON.parse(localStorage.user).userId;

          //提交个人设置
          service.personalSetting(params).then((data)=>{

          });
        }else {
          Modals.error({content:'香港账户名称与英文全称必须一致'});
        }
      } else {
        Modals.error({content:'请正确填写完相关信息'});
      }
    });
  }


  //可编辑况下的附件初始化
  initFile(archive, type){
    let files = [];
    if(archive && archive.length > 0){
      for(let i in archive){
        let temp = {
          uid: archive[i].fileId + i,
          deleteFileId: archive[i].channelArchiveId || '',
          interface: 'PERSONAL',
          name: archive[i].fileName  || '查看附件',
          type: archive[i].name || '',      //来判断是身份证 公司证明啥的
          status: 'done',
          response: {
            success: true,
            file:{
              fileId: archive[i].fileId,
              filePath: archive[i].filePath || '',
              fileType: archive[i].fileType || '',
              fileName: archive[i].fileName || '',
              fileSize: archive[i].fileSize || '',
            }
          }
        };
        files.push(temp);
      }
    }
    return type ? files.filter((item)=> item.type == type) : files;
  }


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const sameFlag = this.state.editable || !this.props.channelId;
    const info = this.state.info || {};
    const upClass = sameFlag ? styles['has-remove'] : styles['no-remove'];
    const contract = this.state.contract || [];

    //银行倒序
    let hkBanks = this.state.code.hkBanks || [], ilBanks = this.state.code.ilBanks || [];
    for(let start=0,end=hkBanks.length-1; start<=end; start++,end--) {
			let temp = hkBanks[start];
			hkBanks[start] = hkBanks[end];
			hkBanks[end] = temp;
    }
    for(let start=0,end=ilBanks.length-1; start<=end; start++,end--) {
			let temp = ilBanks[start];
			ilBanks[start] = ilBanks[end];
			ilBanks[end] = temp;
		}

    //附件初始化
    const archive = info.cnlChannelArchive || [];
    info.hkCardFile = this.initFile(archive, '香港银行卡复印件');
    info.ilCardFile = this.initFile(archive, '内地银行卡复印件');
    info.companyFile = this.initFile(archive, '公司证明');
    info.identifyFile = this.initFile(archive, '身份证副本');



    //省市级联
    info.part = [];
    if(info.province){
      info.part.push(info.province);
      info.part.push(info.city);
    };


    //用户设置相关
    const userInfo = this.state.userInfo || {};
    info.platform = [];
    if(userInfo.platformFlag == 'Y')
      info.platform.push('platform');
    if(userInfo.emailFlag == 'Y')
      info.platform.push('email');
    if(userInfo.smsFlag == 'Y')
      info.platform.push('sms');
    if(userInfo.wechatFlag == 'Y')
      info.platform.push('wechat');

    const certificateType = this.props.form.getFieldValue('certificateType') || '';    //身份证附件 必输项
    const channelTypeCode = this.props.form.getFieldValue('channelTypeCode') || '';    //公司附件 必输项
    let companyFileFlag = false, identifyFileFlag = false;
    if(channelTypeCode === 'COMPANY'){
      companyFileFlag = true;
    }
    if(certificateType ==='IDENTITY' || certificateType ==='TW_IDENTITY' || certificateType ==='HK_IDENTITY'){
      identifyFileFlag = true;
    }

    const cursor = sameFlag ? 'pointer' : 'auto';
    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: info.phoneCode,
    })(
      <CodeOption disabled={true} codeList={this.state.code.phoneCodes} width={120}/>
    );
    const prefixLink = <span style={{cursor:cursor,height:'40px',fontSize:'16px'}} onClick={this.openPhoneNow.bind(this)} disabled={!sameFlag}>修改</span>;

    const columns = [{
        title: '合约编号',
        dataIndex: 'contractCode',
        key: 'contractCode',
      }, {
        title: '合约类型',
        dataIndex: 'contractTypeCode',
        key: 'contractTypeCode',
        render: (text, record)=>{
          if(text && this.state.code.contractTypes){
            for(let i in this.state.code.contractTypes){
              if(text == this.state.code.contractTypes[i].value){
                return(<div style={{width:'60px'}}>{this.state.code.contractTypes[i].meaning}</div>)
              }
            }
          }
        }
      }, {
        title: '产品分类',
        dataIndex: 'productDivision',
        key: 'productDivision',
        render: (text, record)=>{
          if(text && this.state.code.productDivisions){
            for(let i in this.state.code.productDivisions){
              if(text == this.state.code.productDivisions[i].value){
                return(<div style={{width:'60px'}}>{this.state.code.productDivisions[i].meaning}</div>)
              }
            }
          }
        }
      },{
        title: '合约主体分类',
        dataIndex: 'partyType',
        key: 'partyType',
        render: (text, record)=>{
          if(text && this.state.code.partyTypes){
            for(let i in this.state.code.partyTypes){
              if(text == this.state.code.partyTypes[i].value){
                return(<div style={{width:'60px'}}>{this.state.code.partyTypes[i].meaning}</div>)
              }
            }
          }
        }
      },{
        title: '合约主体名称',
        dataIndex: 'partyName',
        key: 'partyName',
      },{
        title: '渠道分类',
        dataIndex: 'channelTypeCode',
        key: 'channelTypeCode',
        render: (text, record)=>{
          if(text && this.state.code.channelClass){
            for(let i in this.state.code.channelClass){
              if(text == this.state.code.channelClass[i].value){
                return(<div style={{width:'60px'}}>{this.state.code.channelClass[i].meaning}</div>)
              }
            }
          }
        }
      },{
        title: '合约起始时间',
        dataIndex: 'startDate',
        key: 'startDate',
      },{
        title: '合约终止时间',
        dataIndex: 'endDate',
        key: 'endDate',
      },{
        title: '操作',
        dataIndex: 'edit',
        key: 'edit',
        render: (text, record)=>{
          return(
            <Button  className={styles.btn_operation} style={{ width:'120px',height:'32px'}}onClick={()=>location.hash='/channel/personalContract/'+this.state.channelId+'/'+record.channelContractId+'/'+record.contractCode + '/' + this.state.userName}>查看合约详情 </Button>
          )
        },
      }];

    return (
      <div className={styles.content}>
        <PsPhoneNowMd visible={this.state.phoneVisibleNow} userId={info.userId} handVisble={this.phoneVisibleNow.bind(this)} codeList={this.state.code.phoneCodes} phoneCode={info.phoneCode} contactPhone={info.contactPhone}/>
        <PsPhoneNewMd visible={this.state.phoneVisibleNew} userId={info.userId} handVisble={this.phoneVisibleNew.bind(this)} codeList={this.state.code.phoneCodes}/>
        <PsPasswdMd visible={this.state.passwordVisible} userId={info.userId} handVisble={this.passwordVisible.bind(this)}/>
        <Form onSubmit={this.submit.bind(this)} className={styles.form_sty}>
          {/*个人中心*/}
          {sameFlag ? '' :
            <div className={styles.div_item_line}>
              <b className={styles.b_short_line} >|</b>
              <font className={styles.title_font_lg}>
                {'渠道详情' + '(用户：' + this.state.userName + ')'}
              </font>
            </div>
          }


          {/*基本信息*/}
          <div className={styles.div_item_line}>
            <b className={styles.b_short_line} >|</b>
            <font className={styles.title_font}>基础信息</font>

            <Row>
              <Col span={20}>
                <FormItem {...formItemLayout} label="渠道编号" >
                  {getFieldDecorator('channelCode', {
                    rules: [
                      {required:true, message:'请输入渠道编号'},
                    ],
                    initialValue: info.channelCode || '',
                  })(
                    <Input disabled size="large"/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="渠道名称" >
                  {getFieldDecorator('channelName', {
                    rules: [
                      {required:true, message:'请输入渠道名称'},
                    ],
                    initialValue: info.channelName || '',
                  })(
                    <Input disabled={this.state.editable || this.state.modifyFlag || !sameFlag} size="large" maxLength="48"/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="中文全称" >
                  {getFieldDecorator('chineseName', {
                  rules: [
                    {required:true, message:'请输入中文全称'},
                  ],
                    initialValue: info.chineseName || '',
                  })(
                    <Input disabled={!sameFlag} size="large" maxLength="48"/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="英文全称" >
                  {getFieldDecorator('englishName', {
                    rules: [
                      {required:true, message:'请输入英文全称',whitespace: true },
                      {pattern:/^[A-Za-z ]+$/, message:'英文全称输入仅限48字内字母'},
                    ],
                    initialValue: info.englishName || '',
                  })(
                    <Input type="text" style={{textTransform:'uppercase'}} disabled={!sameFlag} size="large" maxLength="48"/>
                  )}
                </FormItem>

                <FormItem className={styles.formitem_sty} {...formItemLayout} label="证件类型" >
                  {getFieldDecorator('certificateType', {
                    rules: [{ required: true, message: '请选择证件类型', whitespace: true }],
                    initialValue:info.certificateType || '',
                  })(
                    <CodeOption onChange={this.resetNumber.bind(this)} disabled={!sameFlag} codeList={this.state.code.certificateTypes} placeholder="请选择您的证件类型"/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="证件编号" >
                  {getFieldDecorator('certificateNumber', {
                    rules: [
                      {required:true, message:'请输入证件编号'},
                      {validator: this.checkNumber.bind(this),}
                    ],
                    initialValue: info.certificateNumber || '',
                  })(
                    <Input disabled={!sameFlag} size="large"/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="联系人姓名" >
                  {getFieldDecorator('contactPerson', {
                    rules: [
                      {required:true, message:'请输入联系人姓名'},
                    ],
                    initialValue: info.contactPerson || '',
                  })(
                    <Input disabled={!sameFlag} size="large"/>
                  )}
                </FormItem>

                <FormItem  {...formItemLayout} label="手机号">
                  {getFieldDecorator('contactPhone', {
                    rules: [
                      {required:true, message:'请输入手机号'},
                    ],
                    initialValue: info.contactPhone || '',
                  })(
                    <Input disabled={true}  addonBefore={prefixSelector}  addonAfter={prefixLink} style={{width:'100%'}} size="large" />
                  )}
                </FormItem>


                <FormItem {...formItemLayout} label="电子邮箱" >
                  {getFieldDecorator('email', {
                    rules: [
                      {required:true, message:'请输入电子邮箱'},
                    ],
                    initialValue: info.email || '',
                  })(
                    <Input disabled={!sameFlag} size="large"/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="所在地区" >
                  {getFieldDecorator('part', {
                    rules: [
                      {required:true, message:'请输入所在地区'},
                    ],
                    initialValue: info.part || [],
                  })(
                    <Cascader disabled={!sameFlag} options={this.state.options} placeholder="请选择"/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="详细地址" >
                  {getFieldDecorator('address', {
                    rules: [
                      {required:true, message:'请输入详细地址'},
                    ],
                    initialValue: info.address || [],
                  })(
                    <Input disabled={!sameFlag} size="large"/>
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem {...formItemLayout} >
                  {getFieldDecorator('photo', {
                  })(
                    <Avatar disabled={!sameFlag} imageUrl={info.photoFilePath ? PICTURE_ADDRESS+info.photoFilePath : photo} />
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>


          {/*背景信息*/}
          <div className={styles.div_item_line}>
            <b className={styles.b_short_line} >|</b>
            <font className={styles.title_font}>背景信息</font>
            <Row>
              <Col span={20}>
                <FormItem {...formItemLayout} label="渠道类型" >
                  {getFieldDecorator('channelTypeCode', {
                    rules: [
                      {required:true, message:'请选择渠道类型'},
                    ],
                    initialValue: info.channelTypeCode || '',
                  })(
                    <CodeOption disabled={!sameFlag} codeList={this.state.code.channelTypeCodes} />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="行业背景" >
                  {getFieldDecorator('industryBackground', {
                    rules: [
                      {required:true, message:'请选择行业背景'},
                    ],
                    initialValue: info.industryBackground || '',
                  })(
                    <CodeOption disabled={!sameFlag} codeList={this.state.code.industryBackgrounds} />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="有无经验" >
                  {getFieldDecorator('experienceFlag', {
                    rules: [
                      {required:true, message:'请选择有无经验'},
                    ],
                    initialValue: info.experienceFlag || '',
                  })(
                    <CodeOption disabled={!sameFlag} codeList={this.state.code.experienceFlags} />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="展业模式" >
                  {getFieldDecorator('exhibitionMode', {
                    rules: [
                      {required:true, message:'请选择展业模式'},
                    ],
                    initialValue: info.exhibitionMode || '',
                  })(
                    <CodeOption disabled={!sameFlag} codeList={this.state.code.exhibitionModes} />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="展业范围" >
                  {getFieldDecorator('exhibitionRange', {
                    rules: [
                      {required:true, message:'请选择展业范围'},
                    ],
                    initialValue: info.exhibitionRange || '',
                  })(
                    <CodeOption disabled={!sameFlag} codeList={this.state.code.exhibitionRanges} />
                  )}
                </FormItem>
              </Col>
              <Col span={4}></Col>
            </Row>
          </div>



          {/*保单信息*/}
          <div className={styles.div_item_line}>
            <b className={styles.b_short_line} >|</b>
            <font className={styles.title_font}>资料收集</font>
            <Row>
              <Col span={20}>
                <FormItem {...formItemLayout} label="香港开户行" >
                  {getFieldDecorator('hkBank', {
                    rules: [
                      {required:true, message:'请选择香港开户行'},
                    ],
                    initialValue: info.hkBank || '',
                  })(
                    <CodeOption disabled={!sameFlag} codeList={hkBanks || []} showSearch optionFilterProp="children"/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="香港账户名称" >
                  {getFieldDecorator('hkBankAccountName', {
                    rules: [
                      {required:true, message:'请输入香港账户名称'},
                      {validator: this.checkSame.bind(this),}
                    ],
                    // initialValue: info.hkBankAccountName,
                    initialValue : this.props.form.getFieldValue('englishName').toUpperCase() || '',
                  })(
                    <Input disabled={!sameFlag} type="text" style={{textTransform:'uppercase'}} placeholder="请输入香港账户名称"/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="香港账户号码" >
                  {getFieldDecorator('hkBankAccountNum', {
                    rules: [
                      {required:true, message:'请输入香港账户号码'},
                    ],
                    initialValue: info.hkBankAccountNum,
                  })(
                    <Input disabled={!sameFlag} placeholder="香港账户号码" />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="香港银行卡复印件：" >
                  {getFieldDecorator('hkCardFile', {
                    rules: [
                      {required: true, message: '请上传香港银行卡复印件', type:'array'},
                      {validator: common.validateFile.bind(this),}
                    ],
                    initialValue:info.hkCardFile,
                  })(
                    <Uploads disabled={!sameFlag} fileNum={1} className={upClass}/>
                  )}
                </FormItem>

                <hr style={{marginBottom:'3%'}}/>



                <FormItem {...formItemLayout} label="内地开户行" >
                  {getFieldDecorator('ilBank', {
                    initialValue: info.ilBank || '',
                  })(
                    <CodeOption disabled={!sameFlag} codeList={ilBanks || []} showSearch optionFilterProp="children"/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="内地账户名称" >
                  {getFieldDecorator('ilBankAccountName', {
                    initialValue: info.ilBankAccountName,
                  })(
                    <Input disabled={!sameFlag} style={{ width: '100%'}} placeholder="请输入内地账户名称" />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="内地账户号码" >
                  {getFieldDecorator('ilBankAccountNum', {
                    initialValue: info.ilBankAccountNum,
                  })(
                    <Input disabled={!sameFlag} style={{ width: '100%'}} placeholder="内地账户号码" />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="内地银行卡复印件：" >
                  {getFieldDecorator('ilCardFile', {
                    rules: [{validator: common.vdFile.bind(this),}],
                    initialValue:info.ilCardFile,
                  })(
                    <Uploads disabled={!sameFlag} fileNum={1} className={upClass}/>
                  )}
                </FormItem>

                <hr style={{marginBottom:'3%'}}/>

                <FormItem {...formItemLayout} label="公司证明：" >
                  {getFieldDecorator('companyFile', {
                    rules: [
                      {required: companyFileFlag, message: '请上传公司证明', type:'array'},
                      {validator: companyFileFlag ? common.validateFile.bind(this) : common.vdFile.bind(this),}
                    ],
                    initialValue:info.companyFile,
                  })(
                    <Uploads disabled={!sameFlag} fileNum={3} className={upClass}/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="身份证副本：" >
                  {getFieldDecorator('identifyFile', {
                    rules: [
                      {required: identifyFileFlag, message: '请上传身份证副本', type:'array'},
                      {validator: identifyFileFlag ? common.validateFile.bind(this) : common.vdFile.bind(this),}
                    ],
                    initialValue:info.identifyFile,
                  })(
                    <Uploads disabled={!sameFlag} fileNum={2} className={upClass}/>
                  )}
                </FormItem>

              </Col>
              <Col span={4}></Col>
            </Row>
          </div>


          {/*渠道归属*/}
            {/* sameFlag ? '':*/}
          <div className={styles.div_item_line}>
            <b className={styles.b_short_line} >|</b>
            <font className={styles.title_font}>合约信息</font>

            <div style={{padding:'20px 0'}}>
              <div style={{clear:'both'}}>
                <Table
                  rowKey='channelContractId'
                  columns={columns}
                  dataSource={contract}
                  bordered scroll={{x:'100%'}}
                  pagination={false}/>
              </div>
            </div>
          </div>


          {/*个人设置*/}
          {
            sameFlag &&
            <div className={styles.div_item_last}>
              <b className={styles.b_short_line} >|</b>
              <font className={styles.title_font}>个人设置</font>

              <Row span={24}>
                <Col  span={6}></Col>

                <Col  span={18}>
                  <Row span={24} style={{marginBottom:'20px'}}>
                    <Col  span={4}>
                      <span style={{lineHeight:'32px',fontSize:'16px'}}>修改密码：</span>
                    </Col>
                    <Col  span={8}>
                      <FormItem>
                        <Button type='default' style={{ width:'120px',height:'40px'}} onClick={this.openPasswordMd.bind(this)} size="large">修改密码</Button>
                      </FormItem>
                    </Col>
                  </Row>

                  <Row span={24} style={{marginBottom:'20px'}}>
                    <Col  span={4}>
                      <span style={{lineHeight:'32px',fontSize:'16px'}}>通知管理：</span>
                    </Col>

                    <Col span={18}>
                      <Row>
                        <Col span={6}><span style={{lineHeight:'32px',fontSize:'16px'}}>是否接受消息通知</span></Col>
                        <Col span={12}>
                          <FormItem  style={{float:'left'}}>
                            {getFieldDecorator('ntcFlag', {
                            })(
                              <div className={styles.switch}>
                                <Switch
                                  checked={this.state.ntcFlag}
                                  onChange={this.switchChange.bind(this,'ntcFlag')}
                                  checkedChildren={<Icon type="check" />}
                                  unCheckedChildren={<Icon type="cross" />} />
                              </div>
                            )}
                          </FormItem>
                        </Col>
                      </Row>

                      {
                        this.state.ntcFlag &&
                        <Row>
                          <Col span={6}><span style={{lineHeight:'34px',fontSize:'16px'}}>选择接受方式(多选)</span></Col>
                          <Col span={12}>
                            <FormItem >
                              {getFieldDecorator('platform', {
                                  initialValue:info.platform || [],
                                })(
                                  <CheckboxGroup disabled={!this.state.ntcFlag} options={plainOptions}/>
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      }
                    </Col>
                  </Row>

                </Col>
              </Row>
            </div>
          }


          {/*按钮*/}
          {
            sameFlag &&
            <FormItem style={{marginLeft:'10%'}} >
              <Row gutter={24}>
                <Col span={6}></Col>
                <Col span={6}>
                  <Button onClick={()=>location.hash = '/portal/home'} type='default' style={{ width: 160,height:40}}>返回</Button>
                </Col>
                <Col span={12}>
                  <Button onClick={this.submit.bind(this)} type='primary' style={{ width: 160,height:40}}>提交</Button>
                </Col>
              </Row>
            </FormItem>
          }

        </Form>
      </div>
    );
  }
}

export default Form.create()(Personal);
