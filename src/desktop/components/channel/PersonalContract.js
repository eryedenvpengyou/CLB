import React from 'react';
import { Form, Checkbox,Input,Row,Col, Button, Select,Table,Cascader, InputNumber, DatePicker,Radio} from 'antd';
import CodeOption from '../common/CodeOption';
import Download from '../common/Download';
import Lov from '../common/Lov';
import Modals from '../common/modal/Modal';
import moment from 'moment';
import PsCtFileMd from './PsCtFileMd';
import PsCtRoleMd from './PsCtRoleMd';
import PsCtCommisionMd from './PsCtCommisionMd';
import PsCtLogsMd from './PsCtLogsMd';
import { isEmpty, round, isNumber, indexOf } from 'lodash';
import * as codeService from '../../services/code';
import * as service from '../../services/channel';
import * as styles from '../../styles/qa.css';


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 11 , offset: 0},
    sm: { span: 11 , offset: 0},
  },
  wrapperCol: {
    xs: { span: 10 , offset: 0},
    sm: { span: 10 , offset: 0},
  },
};


class PersonalContract extends React.Component {
  state = {
    code: {},
    info: {},       //合约主表
    dataList: [], //佣金分成
    role:[],
    archive: [],
    ratio: [],
    fileVisible: false,
    roleVisible: false,
    commissionVisible: false,
    logsVisible: false,
    radioChecked: 'select',
    personalRateParams:{},
  };


  componentWillMount() {
    let params = {
      YNList: 'SYS.YES_NO',                         //是否结算
      settlementList: 'SPE.SETTLEMENT_METHOD',      //结算方式
      settleAccountList: 'CNL.SETTLE_ACCOUNT',      //结算账户
      approachList: 'CNL.CONTRACT_APPROACH',        //合同方式
      contractRoles: 'CNL.CONTRACT_ROLE',           //角色

    };
    codeService.getCode(params).then((data)=>{
      let code = data;
      let contractRoles = code.contractRoles || [],roleList=[];

      for(let i in contractRoles) {
        if (contractRoles[i].value !== "MAKER" && contractRoles[i].value !== "SAM") {
          roleList.push(contractRoles[i]);
        }
      }
      code.contractRoles = roleList;
      this.setState({code});

    });

    //查分成，用于下拉列表的值
    service.fetchRatio({companyType:'CHANNEL',channelId: JSON.parse(localStorage.user||'{}').relatedPartyId, page: 1, pagesize: 99999}).then((data)=>{
      if(data.success){
        this.setState({ratio: data.rows || [] });
      }
    });

    params = {
      channelId: this.props.channelId,
      channelContractId: this.props.channelContractId,
    };
    this.state.personalRateParams= {
      channelId: this.props.channelId,
      channelContractId: this.props.channelContractId,
      page:1,
      pagesize:999999999
    }
    //合约
    service.personalContract(this.state.personalRateParams).then((data)=>{
      if(data.success){
        let info = data.rows[0] || {};
        this.setState({ info });

        //选择
        if(info.defineRateFlag === 'Y'){
          this.state.personalRateParams.defineRateFlag = 'Y';
          this.setState({radioChecked: 'custom'});
        }else{
          this.state.personalRateParams.defineRateFlag = 'N';
          this.state.personalRateParams.rateLevelId = info.rateLevelId;
          this.state.personalRateParams.rateLevelName = info.rateLevelName;
          this.state.personalRateParams.partyType = 'CHANNEL';
        }

        //费率
        service.personalRate(this.state.personalRateParams).then((data)=>{
          if(data.success){
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
            this.setState({ dataList });
          }
        });
      }
    });



    //利益分配(角色)
    service.personalRole(params).then((data)=>{
      if(data.success){
        let role = data.rows || [];
        role.map((item,index)=>{
          item.key = index;
          item.benefit = item.benefit? parseFloat(item.benefit * 100).toFixed(2) : 0;
        });
        this.setState({ role });
      }
    });

    //附件
    service.personalArchive({channelContractId: this.props.channelContractId}).then((data)=>{
      if(data.success)  this.setState({archive: data.rows || []});

    });
  }

  //提交
  submit(){
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.channelId = this.props.channelId;
        values.channelContractId = this.props.channelContractId;
        values.contractCode = this.state.info.contractCode || '';
        values.__status = 'update';

        //因为后台用到的是 updateByPrimaryKey方法，调用这玩意的时候没有传值竟然直接置空，所以需要拿到原数据库中的值
        let info = this.state.info || {};
        for(let i in values){
          info[i] = values[i];
        }
        // info.cnlContractRateHistory = [{rateLevelNameOld: info.rateLevelName || "自定义级别"}];
        info.rateLevelNameOld = info.rateLevelName||"自定义级别";
        info.defineRateFlag = this.state.radioChecked === 'custom'? 'Y' : 'N';
        if(info.defineRateFlag === 'N'){
          let rateLevelId = values.rateLevelId;
          let rateLevelName = null;
          this.state.ratio.map((item)=>{
            if(item.ratioId === rateLevelId)
              rateLevelName = item.ratioName;
          });
          info.rateLevelId = rateLevelId;
          info.rateLevelName = rateLevelName;
        }

        //组织3个行表的数据
        let cnlContractArchive = this.state.archive || [],
            cnlContractRate = JSON.parse(JSON.stringify(this.state.dataList)) || [],
            cnlContractRoles = this.state.role || [];

        //设置附件表数据
        cnlContractArchive.map((item, index)=>{
          if(item.contractArchiveId){
            item.__status = 'update';
          }else{
            item.__status = 'add';
          }
        });

        cnlContractRate.map((item, index)=>{
          console.log(item)
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


        //设置角色表 利益
        cnlContractRoles.map((item, index)=>{
          item.benefit = this.parse(item.benefit);
          if(item.contractRoleId){
            item.__status = 'update';
          }else{
            item.__status = 'add';
          }
        });



        info.cnlContractArchive = cnlContractArchive;
        info.cnlContractRate = cnlContractRate;
        info.cnlContractRoles = cnlContractRoles;
        // info.fixFlag = 'N';


        //提交个人信息
        service.contractSubmit([info]).then((data) =>{
          if(data.success){
            Modals.success({content:'提交成功'});
            //setTimeout("location.reload()", 2000);
          }else{
            Modals.error({content:data.message});
          }
        });
      } else {
        Modals.error({content:'请正确填写完相关信息'});
        return;
      }
    });
  }

  //格式化数据
  parse(number){
    return number? parseFloat(number/100).toFixed(4) : 0;
  }


  //附件
  fileEdit(index, action, record){
    let data = this.state.archive, fileRecord = {};
    switch(action){
      case 'add':
        fileRecord = {__status: 'add',};
        this.setState({fileRecord}, ()=>{
          this.setState({fileVisible: true});
        });
        break;

      case 'edit':
        fileRecord = data[index] || {};
        fileRecord.index = index;
        this.setState({fileRecord }, ()=>{
          this.setState({fileVisible: true});
        });
        break;

      case 'delete':
        Modals.warning(this.fileRealRmemove.bind(this, index, record),{content:'确定删除该记录吗？'});
        break;

      default: break;
    }

    this.setState({ archive: data });
  }
  //附件 弹出窗回调，利用下标进行 update操作
  fileCallback(record){
    if(record && record.__status){
      let archive = this.state.archive || []
      if(record.__status == 'update'){
        archive[record.index] == record;
      }else if(record.__status == 'add'){
        record.__status = 'update';
        archive.push(record);
      }
      this.setState({archive, fileVisible: false});
    }else{
      this.setState({fileVisible: false});
    }
  }
  //附件 删除
  fileRealRmemove(index, record, flag){
    if(flag){
      if(record && record.contractArchiveId){
        service.contractArchiveDelete([{contractArchiveId: record.contractArchiveId}]).then((data)=>{
          if(data.success){
            // Modals.success({content: '附件删除成功'});
          }
        });
      }
      let archive = this.state.archive || [];
      archive = archive.filter((item, idx)=> idx != index);
      this.setState({archive});
    }
  }



  //角色 编辑
  roleEdit(action, record ){
    switch(action){
      case 'add':
        record.__status = 'add';
        this.setState({roleRecord: record}, ()=>{
          this.setState({roleVisible: true});
        });
        break;

      case 'edit':
        record.__status = 'update';
        this.setState({ roleRecord: record }, ()=>{
          this.setState({roleVisible: true});
        });
        break;

      case 'delete':
        Modals.warning(this.roleRealRmemove.bind(this, record),{content:'确定删除该记录吗？'});
        break;

      default: break;
    }
  }
  //角色 弹出窗回调
  roleCallback(record){
    if(record && record.__status){
      let role = this.state.role || [];
      if(record.__status == 'update'){
        role[record.key] = record;
      }else{
        record.__status = 'update';
        role.push(record);
      }
      role.map((item,idx)=>{item.key = idx;});
      this.setState({role, roleVisible: false});
    }else{
      this.setState({roleVisible: false});
    }
  }
  //角色 删除
  roleRealRmemove(record, flag){
    if(flag){
      let role = this.state.role || [];
      role.splice(record.key, 1);
      role.map((item,idx)=>{item.key = idx;});
      this.setState({role});
      if(record && record.contractRoleId){
        service.contractRoleDelete([{contractRoleId: record.contractRoleId}]);
      }
    }
  }



  //佣金分成编辑
  commissionEdit(action, record){
    switch(action){
      case 'detail':
        location.hash = '/';
        break;

      case 'add':
        record.__status = 'add';
        this.setState({commissionRecord: record, commissionVisible: true});
        break;

      case 'edit':
        record.__status = 'update';
        //注意设置这两个 state的顺序，注意
        this.setState({commissionVisible: true,},()=>{
          this.setState({commissionRecord: record});
        });
        // this.setState({commissionRecord: record, commissionVisible: true});
        break;

      case 'delete':
        Modals.warning(this.commissionDelete.bind(this, record), {content:'确定删除吗？'});
        break;
    }
  }
  //佣金分成弹出窗回调
  commissionCallback(record){
      //渠道详情-合约详情获取已有自定义分类
    Array.apply(window, {length: 10}).map((v, i) => {
      record['rate' + (i + 1)] = parseFloat(record['rate' + (i + 1)]).toFixed(2)
    })
    if(record && record.__status){
      let dataList = this.state.dataList || [];
      if(record.__status == 'update'){
        dataList[record.key] = record;
      }else{
        record.__status = 'update';
        record.objectVersionNumber = 0;
        dataList.push(record);
      }
      dataList.map((item,idx)=>{
        item.key = idx;
        item.fixFlag = 'N'
      });
      console.log(dataList)
      this.setState({dataList, commissionVisible: false});
    }else{
      this.setState({commissionVisible: false});
    }
  }
  //佣金分成从数据库删除
  commissionDelete(record, flag){
    if(flag){
      let dataList = this.state.dataList || [];
      dataList.splice(record.key, 1);
      dataList.map((item,idx)=>{item.key = idx;});
      this.setState({dataList});
      if(record.channelRateId){
        service.contractRateDelete([{channelRateId: record.channelRateId}]);
      }
    }
  }


  //日志模态框回调
  logsCallback(record){
    this.setState({logsVisible: false});
  }


  //单选按钮改变
  radioChange(e){
    this.setState({radioChecked: e.target.value});
    if(e.target.value === 'select'){
      let rateLevelId = this.props.form.getFieldValue('rateLevelId');
      this.ratioChange(rateLevelId, 'select');

    }else if(e.target.value === 'custom'){
      this.state.personalRateParams = {
        channelId: this.props.channelId,
        channelContractId: this.props.channelContractId,
        defineRateFlag: 'Y',
        page: 1,
        pagesize: 999999999
      };
      //费率
      service.personalRate(this.state.personalRateParams).then((data)=>{
        if(data.success){
          let dataList = data.rows || [] ;
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
          this.setState({ dataList});
        }
      });
    }
  }

  //等级发生改变
  ratioChange(value, radioChecked){
    if(this.state.radioChecked !== 'select' && radioChecked !== 'select' ) return;

    let rateLevelName = null;
    this.state.ratio.map((item)=>{
      if(item.ratioId === value)
        rateLevelName = item.ratioName;
    });
    this.state.personalRateParams = {
      channelId: this.props.channelId,
      channelContractId: this.props.channelContractId,
      defineRateFlag: 'N',
      rateLevelId: value,
      rateLevelName: rateLevelName,
      partyType: 'CHANNEL',
      page:1,
      pagesize:999999999
    };

    //费率
    service.personalRate(this.state.personalRateParams).then((data)=>{
      if(data.success){
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
        this.setState({ dataList });
      }
    });
  }


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const sameFlag = this.props.channelId == JSON.parse(localStorage.user||'{}').relatedPartyId? true : false;
    const info = this.state.info || {};
    const archive = this.state.archive || [];
    const dataList = this.state.dataList || [];
    const role = this.state.role || [];

    const archiveColumns = [{
        title: '文件名称',
        dataIndex: 'name',
        width:'20%',
      }, {
        title: '备注',
        dataIndex: 'comments',
        width:'20%',
      }, {
        title: '文件大小',
        dataIndex: 'fileSize',
        width:'15%',
      },{
        title: '更新时间',
        dataIndex: 'uploadDate',
        width:'25%',
      },{
        title: '操作',
        dataIndex: 'download',
        width:'20%',
        render: (text, record, index) => {
          if(sameFlag){
            return <Download fileId={record.fileId} />;
          }else{
            return (
              <div>
                <Button onClick={this.fileEdit.bind(this, index, 'edit')} type="default" style={{height:28,fontSize:14}}>上传</Button>
                <span style={{marginLeft:10}}><Download fileId={record.fileId}/></span>
                <Button onClick={this.fileEdit.bind(this, index, 'delete', record)} type="default" style={{marginLeft:10,height:28,fontSize:14}}>删除</Button>
              </div>
            );
          }
        },
      }
    ];

    const commissionColumns =[
    {
      title: '产品大分类',
      dataIndex: 'bigClassDesc',
      width:120
    }, {
      title: '产品中分类',
      dataIndex: 'midClassDesc',
      width:120
    }, {
      title: '产品小分类',
      dataIndex: 'minClassDesc',
      width:120
    }, {
        title: '产品名称',
        dataIndex: 'itemName',
        width:120
    }, {
      title: '供款期',
      dataIndex: 'sublineItemName',
      width:120
    }, {
      title: '第一年',
      dataIndex: 'rate1',
      width:120,
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
      width:120,
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
      width:120,
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
      width:120,
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
      width:120,
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
      width:120,
      render:(text)=>{
        if(/^[0]+(.[0]{1,100})?$/.test(text))
          return '0%';
        if(text && !isNaN(text)){
          return text + '%';
        }
      }
    },{
      title: '第七年',
      dataIndex: 'rate7',
      width:120,
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
      width:120,
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
      width:120,
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
      width:120,
      render:(text)=>{
        if(/^[0]+(.[0]{1,100})?$/.test(text))
          return '0%';
        if(text && !isNaN(text)){
          return text + '%';
        }
      }
    },{
      title: '分成备注',
      dataIndex: 'performanceRequire',
      width:120,
    }, {
      title: '调整记录',
      dataIndex: 'specialDesc',
      width:120,
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
              onClick={this.commissionEdit.bind(this,'edit',record)} >编辑</Button>

            <Button
              type="default" style={{height:28,fontSize:14, marginLeft:5}}
              disabled={this.state.radioChecked === 'custom'? false: true}
              onClick={this.commissionEdit.bind(this,'delete',record)} >删除</Button>
          </div>
        );
      },
    })
  }

    const benefitColumns = [{
        title: '角色',
        dataIndex: 'role',
        width:'27%',
        render: (text)=>{
          const data = this.state.code.contractRoles || [];
          for(let i in data){
            if(data[i].value == text){
              return data[i].meaning;
            }
          }
          return '';
        }
      }, {
        title: '姓名',
        dataIndex: 'name',
        width:'27%',
      }, {
        title: '利益',
        dataIndex: 'benefit',
        width:'27%',
        render:(text)=>{
          if(/^[0]+(.[0]{1,100})?$/.test(text))
            return '0%';
          if(text && !isNaN(text)){
            return text + '%';
          }
        }
      },{
        title: '操作',
        dataIndex: 'opera',
        width:'19%',
        render: (text, record, index) => {
          return (
            <div>
              <Button onClick={this.roleEdit.bind(this, 'edit', record) } type="default" style={{height:28,fontSize:14}}>编辑</Button>
              <Button onClick={this.roleEdit.bind(this, 'delete', record) } type="default" style={{marginLeft:10,height:28,fontSize:14}}>删除</Button>
            </div>
          );
        },
      }
    ];

    return (
      <div className={styles.content}>
        <Form>
          {/*个人中心*/}
          <div className={styles.div_item_line}>
            <b className={styles.b_short_line} >|</b>
            <font className={styles.title_font_lg}>合约详情(合约编号：{this.props.contractCode})</font>
          </div>

          {/*结算信息*/}
          <div className={styles.div_item_line}>
            <b className={styles.b_short_line} >|</b>
            <font className={styles.title_font}>结算信息</font>
            <Row>
              <Col span={20}>
                <FormItem {...formItemLayout} label="是否结算" >
                  {getFieldDecorator('settleFlag', {
                    initialValue: info.settleFlag || '',
                  })(
                    <CodeOption disabled={sameFlag} codeList={this.state.code.YNList}/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="结算方式" >
                  {getFieldDecorator('settleTypeCode', {
                    initialValue: info.settleTypeCode || '',
                  })(
                    <CodeOption disabled={sameFlag} codeList={this.state.code.settlementList} />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="结算账户" >
                  {getFieldDecorator('settleAccount', {
                    initialValue: info.settleAccount || '',
                  })(
                    <CodeOption disabled={sameFlag} codeList={this.state.code.settleAccountList}/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="合同方式" >
                  {getFieldDecorator('contractApproach', {
                    initialValue: info.contractApproach || '',
                  })(
                    <CodeOption disabled={sameFlag} codeList={this.state.code.approachList}/>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="特别处理" >
                  {getFieldDecorator('specialTreatment', {
                    initialValue: info.specialTreatment || '',
                  })(
                    <Input disabled={sameFlag} size="large"/>
                  )}
                </FormItem>
                </Col>
              <Col span={4}></Col>
            </Row>
          </div>

          {/*合约文件*/}
          <div className={styles.div_item_line}>
            <b className={styles.b_short_line} >|</b>
            <font className={styles.title_font}>合约文件</font>

            {
              !sameFlag &&
              <div>
                <Button
                  onClick={this.fileEdit.bind(this, 0, 'add')}
                  style={{float:'right',width:100,height:38,marginBottom:5}}
                  type='default' >新增</Button>
              </div>
            }

            <div style={{clear:'both'}}>
              <Table
                rowKey='customerFamilyId'
                columns={archiveColumns}
                dataSource={archive}
                bordered scroll={{x:'100%'}}
                pagination={false}/>
            </div>

            <PsCtFileMd
              visible={this.state.fileVisible}
              record={this.state.fileRecord}
              callback={this.fileCallback.bind(this)}/>
          </div>


          {/*佣金分成*/}
          {
            !sameFlag &&
            <div className={styles.div_item_line}>
              <b className={styles.b_short_line} >|</b>
              <font className={styles.title_font}>佣金分成</font>

              <div style={{margin:'20px 0 10px 10px'}}>
                <RadioGroup value={this.state.radioChecked} onChange={this.radioChange.bind(this)} style={{width:'100%'}}>
                  <Row span={24} style={{marginBottom:10}}>
                    <Col span={4}>
                      <Radio value='select' style={{fontSize:'16px',fontWeight:'normal',width:'100%',lineHeight:'40px'}}>选择渠道等级</Radio>
                    </Col>


                    {
                      this.state.radioChecked === 'select' &&
                      <Col span={20}>
                        <FormItem labelCol={{sm:{span:4}}} wrapperCol={{sm:{span:20}}} label=" " colon={false} >
                          {getFieldDecorator('rateLevelId', {
                            initialValue: info.rateLevelId || undefined,
                            rules:[
                              {required: true, message:'选择渠道等级'},
                            ]
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
                </RadioGroup>
              </div>

              <div>
                <Button onClick={()=>{ this.setState({logsVisible: true});} } type='default' style={{float:'right',width:100,height:38,marginBottom:5}} >查看日志</Button>
                {
                  this.state.radioChecked === 'custom' &&
                  <Button onClick={this.commissionEdit.bind(this,'add',{})} type='default' style={{float:'right',width:100,height:38,marginBottom:5,marginRight:5}} >新增</Button>
                }
              </div>

              <div style={{clear:'both'}}>
                <Table
                  columns={commissionColumns}
                  dataSource={dataList}
                  bordered
                  scroll={{x:'200%',y:'350px'}}
                  pagination={false}/>
              </div>

              <PsCtCommisionMd
                visible={this.state.commissionVisible}
                record={this.state.commissionRecord}
                callback={this.commissionCallback.bind(this)}/>

              <PsCtLogsMd
                visible={this.state.logsVisible}
                channelContractId={this.props.channelContractId}
                callback={this.logsCallback.bind(this)}/>
            </div>
          }


          {/*利益分配 角色*/}
          {/* {
            !sameFlag &&
            <div className={styles.div_item_line}>
              <b className={styles.b_short_line} >|</b>
              <font className={styles.title_font}>利益分配</font>
              <div>
                <Button
                  onClick={this.roleEdit.bind(this,'add',{})}
                  style={{float:'right',width:100,height:38,marginBottom:5}}
                  type='default'>新增</Button>
              </div>
              <div style={{clear:'both'}}>
                <Table
                  rowKey='roleId'
                  columns={benefitColumns}
                  dataSource={role}
                  bordered
                  scroll={{x:'100%'}}
                  pagination={false}/>
              </div>

              <PsCtRoleMd
                visible={this.state.roleVisible}
                record={this.state.roleRecord}
                partyType={this.state.info.partyType || ''}
                partyId={this.state.info.partyId || ''}
                channelId={this.props.channelId}
                codeList={this.state.code.contractRoles}
                callback={this.roleCallback.bind(this)}/>

            </div>
          } */}


          {/*按钮*/}
          {
            !sameFlag &&
            <FormItem style={{marginLeft:'10%', marginTop:'30px'}} >
              <Row gutter={24}>
                <Col span={6}></Col>
                <Col span={6}>
                  <Button onClick={()=>history.back()} type='default' style={{ width: 160,height:40}} >返回</Button>
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


export default Form.create()(PersonalContract);
