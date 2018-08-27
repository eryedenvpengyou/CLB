import React from 'react';
import { Form, Input, Select,Button,Cascader,Row,Col,Icon,Tooltip} from 'antd';
import * as  common from '../../utils/common';
import Uploads from '../../components/common/Upload';
import Modals from '../../components/common/modal/Modal';
import pcCascade from '../../utils/common';
import * as codeService from '../../services/code';
import * as service from '../../services/register';
import * as channelService from '../../services/channel';
import * as styles from '../../styles/register.css';

const FormItem = Form.Item;
const Option = Select.Option;


class BaseInfo extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      one : 'block',
      two : 'none',
      three : 'none',
      code: {},
      options:[],
      info: {},
    };
  }

  componentWillMount(){
    const params ={
      nationalList: 'PUB.NATION',                           //国籍
      provinceList: 'PUB.PROVICE',                          //省份
      cityList: 'PUB.CITY',                                 //城市
      channelTypeCodes: 'CNL.CHANNEL_TYPE',                 //渠道类型
      industryBackgrounds: 'CNL.INDUSTRY_BACKGROUND',       //行业背景
      experienceFlags: 'SYS.YES_NO',                        //有无经验
      exhibitionModes: 'CNL.EXHIBITION_MODE',               //展业模式
      exhibitionRanges: 'CNL.EXHIBITION_RANGE',             //展业模式
      certificateTypes: 'CNL.CERTIFICATE_TYPE',             //证件类型
      hkBanks: 'PUB.HK_BANK',                               //香港银行类型
      ilBanks: 'PUB.IL_BANK',                               //内地银行类型
    };
    codeService.getCode(params).then((data)=>{
      const options = pcCascade(data);
      this.setState({
        options: options,
        code: data,
      });
    });

    //查看渠道个人信息
    channelService.fetchPersonal({
      channelId: JSON.parse(localStorage.user).relatedPartyId
    }).then((data)=>{
      if(data.success){
        this.setState({info:data.rows[0] || {} })
      }
    })
  }

  //校验身份证号格式
  checkNumber = (rule, value, callback) => {
    let certificateType = this.props.form.getFieldValue('certificateType')
    let regex = /^[A-Za-z0-9]+$/;

    if( certificateType ==='IDENTITY'){
      regex = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    }else if(certificateType ==='TW_IDENTITY' ){
      regex = /^[A-Z][0-9]{9}$/;
    }else if(certificateType ==='HK_IDENTITY' ){
      //regex = /^((\s?[A-Za-z])|([A-Za-z]{2}))\d{6}(([0−9aA])|([0-9aA]))$|^[A-Za-z][0-9]{6}\([0-9]\)$|^[A-Za-z][0-9]{6}\（[0-9]\）$/;
      regex = /^((\s?[A-Za-z])|([A-Za-z]{2}))\d{5}(\([0−9A-Za-z]\)|\([0-9A-Za-z]\))$|^((\s?[A-Za-z])|([A-Za-z]{2}))\d{5}(\（[0−9A-Za-z]\）|\（[0-9A-Za-z]\）)$|^[A-Za-z][0-9]{6}\([0-9A-Za-z]\)$|^[A-Za-z][0-9]{6}\（[0-9A-Za-z]\）$|^[A-Za-z][0-9]{6}[0-9A-Za-z]$/;
    }

    if ( value && !regex.test(value)  ) {
      callback('证件格式不正确');
    } else {
      callback();
    }
  }

  resetNumber (value){
    if(value){
      this.props.form.setFieldsValue({certificateNumber:''}) ;

    }
  }


  //第一个下一步
  clickNext1(){
    this.props.form.validateFields(['chineseName','englishName','contactPerson','part','address','email','certificateType','certificateNumber'],(err, values) => {
      if(!err){
        this.props.dispatch({
          type:'register/stepSave',
          payload:{step:1}
        });

        this.setState({
          one : 'none',
          two : 'block',
          three : 'none',
        });
      }
    });
  }




  //第一个上一步
  clickBack(){
        this.props.dispatch({
          type:'register/stepSave',
          payload:{step:0}
        });

        this.setState({
          one : 'block',
          two : 'none',
          three : 'none',
        });
  }
  //第二个上一步
  clickBack2(){
    this.props.dispatch({
      type:'register/stepSave',
      payload:{step:1}
    });

    this.setState({
      one : 'none',
      two : 'block',
      three : 'none',
    });
  }
  //第二个下一步
  clickNext2(){
    let validates = ['channelTypeCode','industryBackground','experienceFlag','exhibitionMode','exhibitionRange'];
    this.props.form.validateFields(validates,(err, values) => {
      if(!err){
        this.props.dispatch({
          type:'register/stepSave',
          payload:{step:2}
        });

        this.setState({
          one : 'none',
          two : 'none',
          three : 'block',
        });
      }
    });
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



  //先保存，稍后补充
  submitTemp(){
    const form = this.props.form;
    let result = [];
    const values = form.getFieldsValue();
    values.channelId = JSON.parse(localStorage.user).relatedPartyId;
    values.channelName = JSON.parse(localStorage.user).relatedPartyName;
    values.province = values.part ? values.part[0] : '';
    values.city = values.part ? values.part[1] : '';
    values.statusCode = this.state.info.statusCode || 'REGISTED';
    values.channelSource = this.state.info.channelSource || 'ONLINE';
    values.englishName = values.englishName.toUpperCase(); //英文全称 转化 成大写 英文
    values.hkBankAccountName = values.hkBankAccountName.toUpperCase(); //香港账户名称 转化 成大写 英文


    //附件表
    let files = [];
    files.push.apply(files,common.formatFile(values.hkCardFile || [], false, '香港银行卡复印件'));
    files.push.apply(files,common.formatFile(values.ilCardFile || [], false, '内地银行卡复印件'));
    files.push.apply(files,common.formatFile(values.companyFile || [], false, '公司证明'));
    files.push.apply(files,common.formatFile(values.identifyFile || [], false, '身份证副本'));
    values.cnlChannelArchive = files;
    values.__status = 'update';

    //更新用户邮箱
    values.user = {};
    values.user.userId = JSON.parse(localStorage.user).userId;
    values.user.email = values.email || '';

    //参数需要一个 数组
    result.push(values);
    service.submitDetail(result).then((data) => {
      if(data.success == true){
        this.props.dispatch({
          type:'register/stepSave',
          payload:{step:0}
        });
        this.props.dispatch({
          type:'register/visibleSave',
          payload:{modalVisible:false}
        });
        location.hash= '/portal/home';
      }else{
        Modals.error({content: '登录失败！请与管理员联系'});
      }
    });
  }


  //完成
  submit(){
    this.props.form.validateFields((err, values) => {
      if(!err){
        const form = this.props.form;
        let result = [];
        const values = form.getFieldsValue();
        values.channelId = JSON.parse(localStorage.user).relatedPartyId;
        values.channelName = JSON.parse(localStorage.user).relatedPartyName;
        values.province = values.part ? values.part[0] : '';
        values.city = values.part ? values.part[1] : '';
        values.statusCode = this.state.info.statusCode || 'REGISTED';
        values.channelSource = this.state.info.channelSource || 'ONLINE';

        values.englishName = values.englishName.toUpperCase();  //英文全称 转化 成大写 英文
        values.hkBankAccountName = values.hkBankAccountName.toUpperCase(); //香港账户名称 转化 成大写 英文


        //附件表
        let files = [];
        files.push.apply(files,common.formatFile(values.hkCardFile || [], false, '香港银行卡复印件'));
        files.push.apply(files,common.formatFile(values.ilCardFile || [], false, '内地银行卡复印件'));
        files.push.apply(files,common.formatFile(values.companyFile || [], false, '公司证明'));
        files.push.apply(files,common.formatFile(values.identifyFile || [], false, '身份证副本'));
        values.cnlChannelArchive = files;
        values.__status = 'update';

        //更新用户邮箱
        values.user = {};
        values.user.userId = JSON.parse(localStorage.user).userId;
        values.user.email = values.email || '';

        service.submitDetail([values]).then((data) => {
          if(data.success == true){
            this.props.dispatch({
              type:'register/stepSave',
              payload:{step:0}
            });
            this.props.dispatch({
              type:'register/visibleSave',
              payload:{modalVisible:false}
            });
            location.hash= '/portal/home';
          }else{
            Modals.error({content: '登录失败！请与管理员联系'});
          }
        });
      }else {
        Modals.error({content:'请正确填写完相关信息'});
      }
    });
  }


  //附件初始化
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

    //初始化附件
    const info = this.state.info || {};
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


    const certificateType = this.props.form.getFieldValue('certificateType') || '';    //身份证附件 必输项
    const channelTypeCode = this.props.form.getFieldValue('channelTypeCode') || '';    //公司附件 必输项
    let companyFileFlag = false, identifyFileFlag = false;
    if(channelTypeCode === 'COMPANY'){
      companyFileFlag = true;
    }
    if(certificateType ==='IDENTITY' || certificateType ==='TW_IDENTITY' || certificateType ==='HK_IDENTITY'){
      identifyFileFlag = true;
    }

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 10 },
      },
    };

    return (
      <Form  onSubmit={this.handleSubmit} className={styles.form_sty}>

        <div style={{marginTop:'5%',display:this.state.one}} id="area1">
          <FormItem className={styles.formitem_sty} {...formItemLayout} label="中文全称">
            {getFieldDecorator('chineseName', {
              rules: [{ required: true, message: '请输入中文全称', whitespace: true }],
              initialValue:info.chineseName || '',
            })(
              <Input  />
            )}
          </FormItem>

          <FormItem className={styles.formitem_sty} {...formItemLayout} label="英文全称">
            {getFieldDecorator('englishName', {
              rules: [
                { required: true, message: '请输入英文全称', whitespace: true },
                {pattern:/^[A-Za-z ]+$/, message:'请输入英文字母或空格'},
              ],
              initialValue:info.englishName || '',
            })(
              <Input  type="text" style={{textTransform:'uppercase'}}/>
            )}
          </FormItem>
          <FormItem className={styles.formitem_sty} {...formItemLayout} label="主要联系人">
            {getFieldDecorator('contactPerson', {
              rules: [{ required: true, message: '请输入联系人', whitespace: true }],
              initialValue:info.contactPerson || '',
            })(
              <Input />
            )}
          </FormItem>
         <FormItem className={styles.formitem_sty} {...formItemLayout} label="证件类型" >
            {getFieldDecorator('certificateType', {
              rules: [
                { required: true, message: '请选择证件类型', whitespace: true },
              ],
              initialValue:info.certificateType || '',
            })(
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="请选择您的证件类型"
                getPopupContainer={() => document.getElementById('area1')}
                onChange={this.resetNumber.bind(this)}
              >
              {
                this.state.code.certificateTypes &&
                this.state.code.certificateTypes.map((item)=>
                  <Option key={item.value} value={item.value} >{item.meaning}</Option>
                )
              }
              </Select>
            )}
          </FormItem>

          <FormItem className={styles.formitem_sty} {...formItemLayout} label="证件号码" >
            {getFieldDecorator('certificateNumber', {
              rules: [
                { required: true, message: '请输入证件号码', whitespace: true },
                {validator: this.checkNumber.bind(this),}
              ],
              initialValue:info.certificateNumber || '',
            })(
              <Input rows={3} maxLength={100}
                style={{ width: '100%'}}  placeholder="证件号码" />
            )}
          </FormItem>

          <FormItem className={styles.formitem_sty} {...formItemLayout} label="所在地区" >
            {getFieldDecorator('part', {
              rules: [
                { type:'array', required: true, message: '请选择所在地区', whitespace: true }
              ],
              initialValue:info.part || [],
            })(
              <Cascader options={this.state.options} placeholder="请选择" getPopupContainer={() => document.getElementById('area1')}/>
            )}
          </FormItem>


          <FormItem className={styles.formitem_sty} {...formItemLayout} label="通讯地址" >
            {getFieldDecorator('address', {
              rules: [
                { required: true, message: '请输入通讯地址', whitespace: true }
              ],
              initialValue:info.address || '',
            })(
              <Input type="textarea" rows={3} maxLength={100}
                style={{ width: '100%'}}  placeholder="通讯地址" />
            )}
          </FormItem>
          <FormItem className={styles.formitem_sty} {...formItemLayout} label="电子邮箱" >
            {getFieldDecorator('email', {
              rules: [
                { required: true, type:'email',  message: '请输入电子邮箱', whitespace: true }
              ],
              initialValue:info.email || '',
            })(
              <Input style={{ width: '100%'}}  placeholder="电子邮箱" />
            )}
          </FormItem>

          <FormItem className={styles.button_sty} {...formItemLayout} >
            {getFieldDecorator('next', {
            })(
              <Button type='primary' style={{ float:'right',width:'120px',marginRight:'10px',height:'40px'}} onClick={this.clickNext1.bind(this)}>下一步</Button>
            )}
          </FormItem>
        </div>


        <div style={{marginTop:'5%',display:this.state.two}}>
          <FormItem className={styles.formitem_sty} {...formItemLayout} label="渠道类型" >
            {getFieldDecorator('channelTypeCode', {
              rules: [
                { required: true, message: '请选择渠道类型', whitespace: true }
              ],
              initialValue:info.channelTypeCode || '',
            })(
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="请选择渠道类型"
              >
              {
                this.state.code.channelTypeCodes &&
                this.state.code.channelTypeCodes.map((item)=>
                  <Option key={item.value} value={item.value}>{item.meaning}</Option>
                )
              }
              </Select>
            )}
          </FormItem>

          <FormItem className={styles.formitem_sty} {...formItemLayout} label="行业背景" >
            {getFieldDecorator('industryBackground', {
              rules: [
                { required: true, message: '请选择行业背景', whitespace: true }
              ],
              initialValue:info.industryBackground || '',
            })(
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="请选择您的行业背景"
              >
              {
                this.state.code.industryBackgrounds &&
                this.state.code.industryBackgrounds.map((item)=>
                  <Option key={item.value} value={item.value}>{item.meaning}</Option>
                )
              }
              </Select>
            )}
          </FormItem>
          <FormItem className={styles.formitem_sty} {...formItemLayout} label="有无经验" >
            {getFieldDecorator('experienceFlag', {
              rules: [
                { required: true, message: '请选择是否有经验', whitespace: true }
              ],
              initialValue:info.experienceFlag || '',
            })(
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="请选择是否有经验"
              >
              {
                this.state.code.experienceFlags &&
                this.state.code.experienceFlags.map((item)=>
                  <Option key={item.value} value={item.value}>{item.meaning}</Option>
                )
              }
              </Select>
            )}
          </FormItem>
          <FormItem className={styles.formitem_sty} {...formItemLayout} label="展业模式" >
            {getFieldDecorator('exhibitionMode', {
              rules: [
                { required: true, message: '请选择展业模式', whitespace: true }
              ],
              initialValue:info.exhibitionMode || '',
            })(
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="请选择展业模式"
              >
              {
                this.state.code.exhibitionModes &&
                this.state.code.exhibitionModes.map((item)=>
                  <Option key={item.value} value={item.value}>{item.meaning}</Option>
                )
              }
              </Select>
            )}
          </FormItem>
          <FormItem className={styles.formitem_sty} {...formItemLayout} label="展业范围" >
            {getFieldDecorator('exhibitionRange', {
              rules: [
                { required: true, message: '请选择展业范围', whitespace: true }
              ],
              initialValue:info.exhibitionRange || '',
            })(
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="请选择展业范围"
              >
              {
                this.state.code.exhibitionRanges &&
                this.state.code.exhibitionRanges.map((item)=>
                  <Option key={item.value} value={item.value}>{item.meaning}</Option>
                )
              }
              </Select>
            )}
          </FormItem>

          <FormItem style={{margin:'30px 190px 0px 190px'}}>
            {getFieldDecorator('next2', {
            })(
              <div>
                <Button type='primary' style={{ float:'left',width:'120px',marginRight:10,height:'40px'}} onClick={this.clickBack.bind(this)}>上一步</Button>
                <Button type='primary' style={{ float:'right',width:'120px',marginRight:10,height:'40px'}} onClick={this.clickNext2.bind(this)}>下一步</Button>
              </div>
            )}
          </FormItem>
        </div>




        <div style={{marginTop:'5%',display:this.state.three}} id="area">
          <FormItem className={styles.formitem_sty} {...formItemLayout} label="香港开户行" >
            {getFieldDecorator('hkBank', {
              rules: [
                { required: true, message: '请选择香港开户行', whitespace: true }
              ],
              initialValue:info.hkBank || '',
            })(
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="请选择香港开户行"
                optionFilterProp="children"
                getPopupContainer={() => document.getElementById('area')}
              >
              {
                hkBanks &&
                hkBanks.map((item)=>
                  <Option key={item.value} value={item.value}>{item.meaning}</Option>
                )
              }
              </Select>
            )}
          </FormItem>
          <FormItem className={styles.formitem_sty} {...formItemLayout} label="香港账户名称" >
            {getFieldDecorator('hkBankAccountName', {
              rules: [
                { required: true, message: '请输入香港账户名称', whitespace: true },
                {validator: this.checkSame.bind(this),}
              ],
              // initialValue:info.hkBankAccountName || '',
              initialValue : this.props.form.getFieldValue('englishName').toUpperCase() || '',
            })(
              <Input type="text" style={{textTransform:'uppercase'}} placeholder="请输入香港账户名称" />
            )}
          </FormItem>
          <FormItem className={styles.formitem_sty} {...formItemLayout} label="香港账户号码" >
            {getFieldDecorator('hkBankAccountNum', {
              rules: [
                { required: true, message: '请输入香港账户号码', whitespace: true }
              ],
              initialValue:info.hkBankAccountNum || '',
            })(
              <Input placeholder="香港账户号码" />
            )}
          </FormItem>

          <FormItem className={styles.formitem_sty} {...formItemLayout} label="香港银行卡复印件："  >
            {getFieldDecorator('hkCardFile', {
              rules: [
                { required: true, message: '请上传香港银行卡复印件', whitespace: true ,type:'array'},
                {validator: common.validateFile.bind(this),}
              ],
              initialValue:info.hkCardFile || [],
            })(
              <Uploads fileNum={1}/>
            )}
          </FormItem>

          <hr style={{marginBottom:'3%'}}/>

          <FormItem className={styles.formitem_sty} {...formItemLayout} label="内地开户行" >
            {getFieldDecorator('ilBank', {
              rules: [],
              initialValue:info.ilBank || '',
            })(
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="请选择内地开户行"
                optionFilterProp="children"
                getPopupContainer={() => document.getElementById('area')}
              >
              {
                ilBanks &&
                ilBanks.map((item)=>
                  <Option key={item.value} value={item.value}>{item.meaning}</Option>
                )
              }
              </Select>
            )}
          </FormItem>

          <FormItem className={styles.formitem_sty} {...formItemLayout} label="内地账户名称" >
            {getFieldDecorator('ilBankAccountName', {
              rules: [],
              initialValue:info.ilBankAccountName || '',
            })(
              <Input style={{ width: '100%'}} placeholder="请输入内地账户名称" />
            )}
          </FormItem>

          <FormItem className={styles.formitem_sty} {...formItemLayout} label="内地账户号码" >
            {getFieldDecorator('ilBankAccountNum', {
              rules: [],
              initialValue:info.ilBankAccountNum || '',
            })(
              <Input style={{ width: '100%'}} placeholder="内地账户号码" />
            )}
          </FormItem>


          <FormItem className={styles.formitem_sty} {...formItemLayout} label="内地银行卡复印件：" >
            {getFieldDecorator('ilCardFile', {
              rules: [{validator: common.vdFile.bind(this),}],
              initialValue:info.ilCardFile || [],
            })(
              <Uploads fileNum={1}/>
            )}
          </FormItem>

          <hr style={{marginBottom:'3%'}}/>


          <FormItem className={styles.formitem_sty} {...formItemLayout} label="公司证明：">
            {getFieldDecorator('companyFile', {
              rules: [
                {required: companyFileFlag, message: '请上传公司证明', type:'array'},
                {validator: companyFileFlag ? common.validateFile.bind(this) : common.vdFile.bind(this),}
              ],
              initialValue:info.companyFile || [],
            })(
              <Uploads fileNum={3}/>
            )}
          </FormItem>

          <FormItem className={styles.formitem_sty} {...formItemLayout} label="身份证副本：">
            {getFieldDecorator('identifyFile', {
              rules: [
                {required: identifyFileFlag, message: '请上传身份证副本', type:'array'},
                {validator: identifyFileFlag ? common.validateFile.bind(this) : common.vdFile.bind(this),}
              ],
              initialValue:info.identifyFile || [],
            })(
              <Uploads fileNum={2}/>
            )}
          </FormItem>

          <FormItem >
            <Row span={24}>
              <Col offset={4} span={6}>
                <Button type='primary' style={{ float:'left',width:'120px',marginRight:10,height:'40px'}} onClick={this.clickBack2.bind(this)}>上一步</Button>
              </Col>
              <Col offset={3} span={7}>
                <Button type='primary' style={{ float:'left',width:120,height:40,marginLeft:50}} onClick={this.submit.bind(this)}>提交</Button>
              </Col>

              <Col offset={2} span={2}>
                {/* <Button type='default' style={{ width:160,height:40,float:'right'}} onClick={this.submitTemp.bind(this)}>先保存，稍后补充</Button> */}
                <Tooltip placement="topLeft" title='先保存，稍后补充'>
                  <Icon
                    type="save"
                    style={{fontSize:'43px', color:'#d1b97f', cursor:'pointer'}}
                    onClick={this.submitTemp.bind(this)} />
                </Tooltip>
              </Col>
            </Row>
          </FormItem>

        </div>
      </Form>
    );
  }
}

export default Form.create()(BaseInfo);
