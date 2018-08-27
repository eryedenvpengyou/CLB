import React from 'react';
import { connect } from 'dva';
import {Table, Icon,Button,Input,Row,Col,Form,Select,InputNumber} from 'antd';
import * as styles from '../../styles/sys.css';
import style from '../../styles/plan.css';
import Download from '../common/Download';
import stylesCommon from '../../styles/common.css';
import {pendingList,queryAllSecurityLevel,queryAllSecurityArea,queryAllSublineName,queryAllSelfPay,queryAllPayMethod} from '../../services/pending';
import {handleTableChange} from '../../utils/table';
import {selfpay} from '../../services/plan.js';
import { getCode } from '../../services/code';
import Lov from '../common/Lov';
import TipModal from "../common/modal/Modal";
import {person,planCount} from '../../services/plan.js';
import { sortCustom } from '../../utils/common';
const FormItem = Form.Item;
function byObj(name){
  return function(o, p){
    let a, b;
    if (typeof o === "object" && typeof p === "object" && o && p) {
      a = o[name];
      b = p[name];
      if (a === b) {
        return 0;
      }
      if (typeof a === typeof b) {
        return a < b ? -1 : 1;
      }
      return typeof a < typeof b ? -1 : 1;
    }else {
      throw ("error");
    }
  }
}

class PlanLibrarySummary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataList:[],
      orderBy: [],
      pagination: {
      },
      //快码值
      codeList: {
        genderList: [],
        payMethodList: [],
        currencyList: [],
        smokeFlagList: [],
        nationList:[],
        cityList:[],
        securityAreaList:[],
        securityLevel:[],
      },

      body2:{
         itemId:'',
         securityLevel:''
      },

      body3:{

      },

      //自付
      body4:{
        itemId:''
      },
      amountList:[],//数量
      selfpayList:[],//自付
      slevelList:[],//获取保障级别
      sregionList:[],//获取保障地区
      sublineItemNameList:[],//查询所有年期

      itemSelfpayList:[],//通过产品查询自付
      itemSlevelList:[],//通过产品获取保障级别
      itemSregionList:[],//通过产品获取保障地区
      itemSublineItemNameList:[],//通过产品查询所有年期
      itemPayMethod:[],//查询
    };
  }

  body = {};
  componentWillMount() {
    //获取快码值
    var body = {
      genderList: 'HR.EMPLOYEE_GENDER',
      smokeFlagList: 'SYS.YES_NO',
      payMethodList: 'CMN.PAY_METHOD',
      currencyList: 'PUB.CURRENCY',
      nationList:'PUB.NATION',
      cityList:'PUB.CITY',
      securityAreaList:'PRD.SECURITY_AREA',
      securityLevel:'PRD.SECURITY_LEVEL',
    };
    getCode(body).then((data)=>{
      this.setState({
        codeList: data
      });
    });

    //获取所有安全级别
    queryAllSecurityLevel(this.body2).then((data) =>{
      if (data.success) {
        this.setState({
          slevelList:data.rows
        });
      }
    });

    //获取所有安全区域
    queryAllSecurityArea(this.body2).then((data) =>{
      if (data.success) {
        this.setState({
          sregionList:data.rows
        });
      }
    });

    //获取所有年期
    queryAllSublineName(this.body2).then((data) =>{
      if (data.success) {
        this.setState({
          sublineItemNameList:data.rows
        });
      }
    });

    //查询所有自付选项
    queryAllSelfPay(this.body2).then((data) =>{
      if (data.success) {
        this.setState({
          selfpayList:data.rows
        });
      }
    });

    pendingList(this.body).then((data) => {
      if (data.success) {
        const pagination = this.state.pagination;
        pagination.total = data.total;
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({
          loading: true,
          dataList: data.rows,
          pagination
        });
      }
    });

    //个人额度查询
    var personData = {
      userId: JSON.parse(localStorage.user).userId
    }
    person(personData).then((data) =>{
      if (data.success) {
        this.setState({
          amountList:data.rows,
        });
      }
    });
  }

  //判断是否存在额度
  requestPlan(){
    if (this.state.amountList[0].avilAmount > 0 || JSON.parse(localStorage.user).userType == "ADMINISTRATION")//代办行政
     {
      location.hash='/plan/PlanApply/apply/0/0';
    } 
    else {
      planCount().then((data) => {
        TipModal.error({
          content: <div><font>计划书额度不够！</font>
            <br /><font>友情提示：保单签单时可扩增计划书额度，1张签单={data}份计划书</font></div>
        });
        return;
      })
    }
  }

  /**
   * 产品修改事件
   * @param value
   */
  itemChange(value){
    this.state.body2.itemId = value.record.itemId;
    this.state.itemSlevelList = [];
    this.state.itemSregionList = [];
    this.state.itemSublineItemNameList = [];
    this.state.itemSelfpayList = [];
    this.state.itemPayMethod = [];
    //通过产品获取所有安全级别
    queryAllSecurityLevel(this.state.body2).then((data) =>{
      this.setState({
        itemSlevelList:data.rows
      });
    });

    //通过产品获取所有安全区域
    queryAllSecurityArea(this.state.body2).then((data) =>{
      this.setState({
        itemSregionList:data.rows
      });
    });

    //通过产品获取所有年期
    queryAllSublineName(this.state.body2).then((data) =>{
      let arr1 = [], arr2 = [], arr3 = [];
      data.rows.map((item) => {
        if(/^[0-9]+.?[0-9]*$/.test(item.meaning)){
          item.sortIndex = Number(item.meaning);
          arr1.push(item);
        }else if(item.meaning.indexOf('至被保人') >= 0){
          item.sortIndex = Number(item.meaning.replace(/[^0-9]/ig,""));
          arr2.push(item);
        }else if(item.meaning == '整付'){
          item.sortIndex = 1;
          arr3.push(item);
        }else if(item.meaning == '终身'){
          item.sortIndex = 2;
          arr3.push(item);
        }
      });
      arr1.sort(byObj('sortIndex'));
      arr2.sort(byObj('sortIndex'));
      arr3.sort(byObj('sortIndex'));
      console.log(arr1.concat(arr2, arr3))
      this.setState({
        itemSublineItemNameList:arr1.concat(arr2, arr3)
      });
    });

    //通过产品查询所有自付选项
    queryAllSelfPay(this.state.body2).then((data) =>{
      data.rows.map((item)=>{
      let selfpay = item.meaning;
      let i = selfpay.indexOf("\/");
      if(i >= 0){
        selfpay = selfpay.substring(0,i);
        item.sortIndex = Number(selfpay.replace(/[^0-9]/ig,""));
      }
    });
      this.setState({
        itemSelfpayList:data.rows.sort(byObj('sortIndex'))
      });
    });

    /**
     * 查询付款方式
     */
    queryAllPayMethod(this.state.body2).then((data) =>{
      data.rows.map((item) => {
        switch(item.meaning){
          case '整付': item.sortIndex = 1; break;
          case '年缴': item.sortIndex = 2; break;
          case '半年缴': item.sortIndex = 3; break;
          case '季缴': item.sortIndex = 4; break;
          case '月缴': item.sortIndex = 5; break;
          case '预缴': item.sortIndex = 6; break;
          default : break;
        }
      });
      this.setState({
        itemPayMethod:data.rows.sort(byObj('sortIndex'))
      });
    });
  }

  /**
   * 查询安全区域
   */
  accessSecurityArea(val){
     // this.props.form.resetFields([securityArea]);
      this.state.body2.securityLevel = val;
      this.state.itemSregionList=[];
      //通过产品获取所有安全区域
      queryAllSecurityArea(this.state.body2).then((data) =>{
       this.setState({
         itemSregionList:data.rows
       });
    });
  }
  /**
   * 条件查询事件
   */
  res() {
    const resetFields =  this.props.form;
    const values = this.props.form.getFieldsValue();

    this.body.page = 1;
    this.body.pagesize = 10;
    this.body.orderBy = "";
    this.state.orderBy = [];

    //产品编码
    this.body.itemCode = values.itemCode.value;
    //年期
    this.body.sublineItemName = values.sublineItemName;
    //性别
    this.body.gender = values.gender;
    //年龄范围
    this.body.age = values.age;
    //是否吸烟
    this.body.smokeFlag = values.smokeFlag;
    //缴款方式
    this.body.payMethod = values.payMethod;
    //保费起
    this.body.premiumStart = values.premiumStart;
    //保费至
    this.body.premiumEnd = values.premiumEnd;
    //保额起
    this.body.amountStart = values.amountStart;
    //保额至
    this.body.amountEnd = values.amountEnd;
    //保障级别
    this.body.securityLevel = values.securityLevel;
    //保障区域
    this.body.securityArea = values.securityArea;
    //自付选项
    this.body.selfpay = values.selfpay;
    //国籍
    this.body.nationality = values.nationality;
    //居住国
    this.body.residence = values.residence;
    //居住城市
    this.body.city = values.city;

    pendingList(this.body).then((data) => {
      if (data.success) {
        const pagination = this.state.pagination;
        pagination.current = 1;
        pagination.total = data.total;
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({
          body: this.body,
          dataList:data.rows,
          total:data.total,
          pagination
        });
      }
    });
  }

  render() {
    const {getFieldDecorator,getFieldValue ,resetFields} = this.props.form;

    const handleReset = () => {
      this.state.itemSlevelList = [];
      this.state.itemSregionList = [];
      this.state.itemSublineItemNameList = [];
      this.state.itemSelfpayList = [];
      this.state.itemPayMethod = [];
      this.body.itemCode = "";
      this.body.orderBy = "";
      this.state.orderBy = [];
      resetFields();
      this.res();
    }
    const genderOptions = this.state.codeList.genderList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const payMethodOptions = this.state.codeList.payMethodList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const smokeFlagOptions = this.state.codeList.smokeFlagList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const cityOptions = this.state.codeList.cityList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const nationList = this.state.codeList.nationList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const securityAreaList = this.state.codeList.securityAreaList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const securityLevel = this.state.codeList.securityLevel.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    //获取自付选项
    const selfpayListOptions = this.state.selfpayList.map((res) => {
      return <Select.Option key={res.value}>{res.meaning}</Select.Option>
    });
    //获取保障级别
    const slevelListOptions = this.state.slevelList.map((res) => {
      return <Select.Option key={res.value}>{res.meaning}</Select.Option>
    });
    //获取保障区域
    const sregionListOptions = this.state.sregionList.map((res) => {
      return <Select.Option key={res.value}>{res.meaning}</Select.Option>
    });
    //获取年期
    const sublineItemNameListOptions = this.state.sublineItemNameList.map((res) => {
      return <Select.Option key={res.value}>{res.meaning}</Select.Option>
    });
    //获取自付选项（产品）
    const itemSelfpayListOptions = this.state.itemSelfpayList.map((res) => {
      return <Select.Option key={res.value}>{res.meaning}</Select.Option>
    });
    //获取保障级别（产品）
    const itemSlevelListOptions = this.state.itemSlevelList.map((res) => {
      return <Select.Option key={res.value}>{res.meaning}</Select.Option>
    });
    //获取保障区域（产品）
    const itemSregionListOptions = this.state.itemSregionList.map((res) => {
      return <Select.Option key={res.value}>{res.meaning}</Select.Option>
    });
    //获取年期（产品）
    const itemSublineItemNameListOptions = this.state.itemSublineItemNameList.map((res) => {
      return <Select.Option key={res.value}>{res.meaning}</Select.Option>
    });
    //缴款方式（产品）
    const itemPayMethodListOptions = this.state.itemPayMethod.map((res) => {
      return <Select.Option key={res.value}>{res.meaning}</Select.Option>
    });

    const values = this.props.form.getFieldsValue();
    const columns = [
      {
        title: '下载',
        dataIndex: 'fileId',
        key: 'fileId',
        fixed: 'left',
        width: 45,
        render: (text, record, index) => {
          if (text != null &&text!="") {
            return (
              <Download fileId={text}>
                <Icon type="download" style={{fontSize:'36px',color:'#d1b97f'}}/>
              </Download>
            )
          } else {
            return (
              <Icon type="download" style={{fontSize:'36px',color:'#9d9d9d'}}/>
            )
          }
        }
      }, {
        title: '产品信息',
        dataIndex: 'itemName',
        fixed: 'left',
        width: 175,
      }, {
        title: '币种',
        dataIndex: 'currency',
        fixed: 'left',
        width: 70,
        render: (text, record, index) => {
          for (var i=0; i<this.state.codeList.currencyList.length; i++) {
            if(this.state.codeList.currencyList[i].value == text){
              return this.state.codeList.currencyList[i].meaning;
            }
          }
          return text;
        },
      }, {
        title: '年期',
        dataIndex: 'sublineItemName',
        fixed: 'left',
        width: 120,
      }, {
        title: '缴款方式',
        dataIndex: 'payMethod',
        render: (text, record, index) => {
          for (var i=0; i<this.state.codeList.payMethodList.length; i++) {
            if(this.state.codeList.payMethodList[i].value == text){
              return this.state.codeList.payMethodList[i].meaning;
            }
          }
          return text;
        },
      }, {
        title: '年龄',
        dataIndex: 'age',
        sorter: true
      }, {
        title: '性别',
        dataIndex:'gender',
        render: (text, record, index) => {
          for (var i=0; i<this.state.codeList.genderList.length; i++) {
            if(this.state.codeList.genderList[i].value == text){
              return this.state.codeList.genderList[i].meaning;
            }
          }
          return text;
        }
      }, {
        title: '是否吸烟',
        dataIndex: 'smokeFlag',
        render: (text, record, index) => {
          for (var i=0; i<this.state.codeList.smokeFlagList.length; i++) {
            if(this.state.codeList.smokeFlagList[i].value == text){
              return this.state.codeList.smokeFlagList[i].meaning;
            }
          }
          return text;
        }
      },{
        title: '国籍',
        dataIndex: 'nationality',
        render: (text, record, index) => {
          for (var i=0; i<this.state.codeList.nationList.length; i++) {
            if(this.state.codeList.nationList[i].value == text){
              return this.state.codeList.nationList[i].meaning;
            }
          }
          return text;
        }
      },{
        title: '居住地',
        dataIndex: 'residence',
        render: (text, record, index) => {
          for (var i=0; i<this.state.codeList.nationList.length; i++) {
            if(this.state.codeList.nationList[i].value == text){
              return this.state.codeList.nationList[i].meaning;
            }
          }
          return text;
        }
      },{
        title: '居住城市',
        dataIndex: 'city',
        render: (text, record, index) => {
          for (var i=0; i<this.state.codeList.cityList.length; i++) {
            if(this.state.codeList.cityList[i].value == text){
              return this.state.codeList.cityList[i].meaning;
            }
          }
          return text;
        }
      }, {
        title: '保额',
        dataIndex: 'amount',
        sorter: true
      }, {
        title: '保费',
        dataIndex: 'premium',
        sorter: true
      }, {
        title: '保障级别',
        dataIndex: 'securityLevel',
        render: (text, record, index) => {
          for (var i=0; i<this.state.slevelList.length; i++) {
            if(this.state.slevelList[i].value == text){
              return this.state.slevelList[i].meaning;
            }
          }
          return text;
        },
      }, {
        title: '保障地区',
        dataIndex: 'securityArea',
        render: (text, record, index) => {
          for (var i=0; i<this.state.sregionList.length; i++) {
            if(this.state.sregionList[i].value == text){
              return this.state.sregionList[i].meaning;
            }
          }
          return text;
        }
      },{
        title: '自付选项',
        dataIndex: 'selfpay',
      }
    ];
    const { selectedRowKeys } = this.state
    const pagination = {
      total: this.state.dataList.length
    }
    return (
      <div className={style.table_border}>
        <div>
          <span className={stylesCommon.iconL} ></span>
          <font className={stylesCommon.iconR}>计划书库</font>
          <Button  onClick={this.requestPlan.bind(this)}  style={{float:'right',width:'120px',height:'40px',textAlign:'center'}} type="primary">计划书申请</Button>
        </div>
        <hr className={styles.hr_line}/>
        <div>
        <Form className={styles.search_form} onSubmit={this.handleSearch}>
          <Row>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('itemCode',{
                  initialValue: {value:'', meaning:''},
                })(
                  <Lov lovCode='PRD_ITEM_BY_PLAN' style={{width:'400px', height:'100%'}} placeholder="请选择产品" params={{}} itemChange={this.itemChange.bind(this)} />
                )}
              </FormItem>
            </Col>
            <Col span={3} style={{paddingLeft:'10px'}}>
              <FormItem>
                {getFieldDecorator('sublineItemName',{})(
                  <Select placeholder="年期" style={{width:'100%'}} allowClear>
                    {itemSublineItemNameListOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={2} style={{paddingLeft:'10px'}}>
              <FormItem>
                {getFieldDecorator('gender', {})(
                  <Select placeholder="性别" style={{width:'100%'}} allowClear>
                    {genderOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3} style={{paddingLeft:'10px'}}>
              <FormItem>
                {getFieldDecorator('age',{})(
                  <Select placeholder="年龄范围" style={{width:'100%'}} allowClear>
                    <Select.Option value="0015">0-15岁</Select.Option>
                    <Select.Option value="1630">16-30岁</Select.Option>
                    <Select.Option value="3145">31-45岁</Select.Option>
                    <Select.Option value="4661">46-61岁</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3} style={{paddingLeft:'10px'}}>
              <FormItem>
                {getFieldDecorator('smokeFlag', {})(
                  <Select placeholder="是否吸烟" style={{width:'100%'}}  allowClear>
                    {smokeFlagOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3} style={{paddingLeft:'10px'}}>
              <FormItem>
                {getFieldDecorator('payMethod', {})(
                  <Select placeholder="缴费方式" style={{width:'100%'}}  allowClear>
                    {itemPayMethodListOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={2} style={{paddingLeft:'10px',paddingRight:'5px'}}>
              <Form.Item>
                {getFieldDecorator('type', {
                  initialValue: "premium",
                })(
                  <Select style={{width:'100%'}} allowClear>
                    <Select.Option value="premium">保费</Select.Option>
                    <Select.Option value="amount">保额</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            {
              getFieldValue("type") == "premium" ?
                <span>
                  <Col span={2}>
                    <Form.Item>
                      {getFieldDecorator('premiumStart', {})(
                        <InputNumber placeholder="保费起" style={{width:'85%',margin:'0 5px 0 0'}} min={0} />
                      )}
                      -
                    </Form.Item>
                  </Col>
                  <Col span={2} style={{paddingLeft:'5px'}}>
                    <Form.Item>
                      {getFieldDecorator('premiumEnd', {})(
                        <InputNumber placeholder="保费至" style={{width:'85%'}}  min={0} />
                      )}
                    </Form.Item>
                  </Col>
                </span>
                :
                <span>
                  <Col span={2}>
                    <Form.Item>
                      {getFieldDecorator('amountStart', {})(
                        <InputNumber placeholder="保额起" style={{width:'85%',margin:'0 5px 0 0'}} min={0} />
                      )}
                      -
                    </Form.Item>
                  </Col>
                  <Col span={2} style={{paddingLeft:'5px'}}>
                    <Form.Item>
                      {getFieldDecorator('amountEnd', {})(
                        <InputNumber placeholder="保额至" style={{width:'85%'}}  min={0} />
                      )}
                    </Form.Item>
                  </Col>
                </span>
            }
          </Row>
          <Row>
            <Col span={2}>
              <FormItem>
                {getFieldDecorator('securityLevel')(
                  <Select placeholder="保障级别" style={{width:'100%'}} onSelect={this.accessSecurityArea.bind(this)} allowClear>
                    {itemSlevelListOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3} style={{paddingLeft:'10px'}}>
              <FormItem>
                {getFieldDecorator('securityArea')(
                  <Select placeholder="保障地区" style={{width:'100%'}}  allowClear>
                    {itemSregionListOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4} style={{paddingLeft:'10px'}}>
              <FormItem >
                {getFieldDecorator('selfpay', {})(
                  <Select placeholder="自付选项" style={{width:'100%'}} allowClear>
                    {itemSelfpayListOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3} style={{paddingLeft:'10px'}}>
              <FormItem>
                {getFieldDecorator('nationality')(
                  <Select placeholder="国籍" style={{width:'100%'}} allowClear>
                    {nationList}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3} style={{paddingLeft:'10px'}}>
              <FormItem>
                {getFieldDecorator('residence')(
                  <Select placeholder="居住国" style={{width:'100%'}}  allowClear>
                    {nationList}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3} style={{paddingLeft:'10px'}}>
              <FormItem>
                {getFieldDecorator('city')(
                  <Select placeholder="居住城市" style={{width:'100%'}} allowClear>
                    {cityOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
                <Button type="default" className={style.backBlock} style={{float:'right',marginLeft:'10px',height:'40px',width:'110px'}} onClick={handleReset}>全部</Button>
                <Button type="primary" style={{float:'right',height:'40px',width:'110px'}} htmlType="submit" onClick={this.res.bind(this)}>查询</Button>
            </Col>
          </Row>
        </Form>

        <Table columns={columns} scroll={{x:'150%'}} dataSource={this.state.dataList} bordered pagination={this.state.pagination} onChange={handleTableChange.bind(this,pendingList,this.body)}/>
        </div>
        </div>

    )
  }
}
export default PlanLibrarySummary = Form.create()(PlanLibrarySummary);
