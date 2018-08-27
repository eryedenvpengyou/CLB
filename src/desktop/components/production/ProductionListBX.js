/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { Table, Button, Row, Col, Collapse, Input, Form, Affix, Icon } from 'antd';
import ProductionCompareModal from './ProductionCompareModal';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import { productionHeaderList, productionItemLabels, getPrdPremium } from '../../services/production';
import { queryAll } from '../../services/plan';
import { handleTableChange } from '../../utils/table';
import { getCode } from '../../services/code';
import { PICTURE_ADDRESS } from '../../constants';
import TipModal from "../common/modal/Modal";
import showImg from "../../styles/images/production/product_show_img.jpg";

class ProductionShowComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      labelList: [],
      companyList: [],
      pagination: {},
      compareList: {
        number: 0,
        minClass: null,
        item1: null,
        item2: null,
        item3: null
      },
      orderBy: [],
      body: {
        bigClass: "BX",
        enabledFlag: 'Y',
      },
      //快码值
      codeList: {
        currencyList: [],
      }
    };
  };
  componentWillMount() {
    //获取快码值
    const codeBody = {
      currencyList: 'PUB.CURRENCY',
    };
    getCode(codeBody).then((codeData)=>{
      this.state.codeList = codeData;
      //查询产品公司
      const bodyCompany = {
        type: 'PC',
        businessScope: '保险',
        page:1,
        pagesize:999999
      }
      queryAll(bodyCompany).then((companyData) => {
        if (companyData.success) {
          this.state.companyList = companyData.rows;
          //查询产品标签
          productionItemLabels({bigClass:'BX'}).then((labelData) => {
            if (labelData.success) {
              this.state.labelList = labelData.rows;
              this.queryBX();
            }
          });
        }
      });
    });
  }
  componentDidMount() {
    document.getElementsByClassName("ant-collapse-item ant-collapse-item-active")[0].className = "ant-collapse-item";
    document.getElementsByClassName("ant-collapse-header")[0].setAttribute("aria-expanded", "false");
    document.getElementsByClassName("ant-collapse-content ant-collapse-content-active")[0].className = "ant-collapse-content ant-collapse-content-inactive";
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.refresh != nextProps.refresh && nextProps.refresh == 'BX') {
      if (document.getElementById("supplierNameDisplay") && document.getElementById("supplierNameDisplay").style.display == "block") {
        document.getElementById("supplierNameDisplay").style.display = "none";
        document.getElementsByName("displayMoreBX")[0].innerHTML = '更多 <i class="anticon anticon-down"></i>';
      }
      if (document.getElementById("itemLabelDisplay") && document.getElementById("itemLabelDisplay").style.display == "block") {
        document.getElementById("itemLabelDisplay").style.display = "none";
        document.getElementsByName("displayMoreBX")[1].innerHTML = '更多 <i class="anticon anticon-down"></i>';
      }
    }
  }
  //查询产品
  queryBX() {
    this.state.body.itemName = this.props.form.getFieldValue("itemNameBX");
    this.state.body.page = 1;
    this.state.body.pagesize = 10;
    productionHeaderList(this.state.body).then((data) => {
      if (data.success) {
        const pagination = {};
        pagination.current = 1;
        pagination.pagesize = 10;
        pagination.total = data.total;
        for (var i=0; i<data.rows.length; i++) {
          data.rows[i].key = i+1;
        }
        this.setState({
          body: this.state.body,
          dataList: data.rows,
          pagination
        });
      } else {
        TipModal.error({content:data.message});
        return;
      }
    });
  }
  //保费测算
  premiumMeasures(midClass,minClass,itemId) {
    getPrdPremium({itemId}).then((data) => {
      if (data.success) {
        if (data.rows.length > 0) {
          location.hash='/production/premiumMeasure/BX/'+(midClass||"BX")+"/"+(minClass||"BX")+"/"+itemId;
        } else {
          TipModal.error({content:'很抱歉，该产品资料不全，无法测算保费'});
           return;
        }
      } else {
        TipModal.error({content:data.message});
        return;
      }
    })
  }
  //添加产品
  addProduct(value) {
    if (document.getElementsByClassName("ant-collapse-header")[0].getAttribute("aria-expanded") == "false") {
      document.getElementsByClassName("ant-collapse-item")[0].className = "ant-collapse-item ant-collapse-item-active";
      document.getElementsByClassName("ant-collapse-header")[0].setAttribute("aria-expanded", "true");
      document.getElementsByClassName("ant-collapse-content ant-collapse-content-inactive")[0].className = "ant-collapse-content ant-collapse-content-active";
    }
    for (var i=1; i<4; i++) {
      //判断对比栏中是否存在该产品，若存在则移除
      if (this.state.compareList["item"+i]
        && this.state.compareList["item"+i].itemId == value.itemId) {
        this.removeProduct("item"+i);
        return;
      }
      //判断所选产品是否属于同一属性组
      if (this.state.compareList["item"+i]
        && this.state.compareList["item"+i].attSetId != value.attSetId) {
        TipModal.error({content:'请选择相同属性组的产品！'});
        return;
      }
    }
    //对比栏中最多有三个产品
    if (this.state.compareList.number < 3) {
      //循环查看缺少的是哪个空位
      for (var i=1; i<4; i++) {
        if (!this.state.compareList["item"+i]) {
          document.getElementById("item"+i).getElementsByTagName("div")[0].innerText = value.itemName;
          document.getElementById("item"+i).getElementsByTagName("div")[1].getElementsByTagName("span")[0].innerText = "删除";
          this.state.compareList.number += 1;
          this.state.compareList["item"+i] = value;
          //更改对比栏数据
          if (this.state.compareList.number == 1) {
            this.state.compareList.minClass = value.minClass;
            this.state.body.attSetId = value.attSetId;
            this.queryBX();
          }
          this.setState({
            compareList: this.state.compareList
          });
          break;
        }
      }
    } else {
      TipModal.error({content:'对比栏已满！'});
      return;
    }
  }
  //在对比栏中移除某个产品
  removeProduct(name) {
    //移除后改变按钮样式
    for (var i=0; i<this.state.dataList.length; i++) {
      if (this.state.compareList[name].id == this.state.dataList[i].itemId) {
        document.getElementsByName("compareBtn")[i].innerHTML = <span>添加对比</span>;
      }
    }
    this.state.compareList.number -= 1;
    this.state.compareList[name] = null;
    document.getElementById(name).getElementsByTagName("div")[0].innerText = "您还可以继续添加";
    document.getElementById(name).getElementsByTagName("div")[1].getElementsByTagName("span")[0].innerText = "";
    //更改对比栏数据
    if (this.state.compareList.number == 0) {
      if (document.getElementsByClassName("ant-collapse-header")[0].getAttribute("aria-expanded") == "true") {
        document.getElementsByClassName("ant-collapse-item ant-collapse-item-active")[0].className = "ant-collapse-item";
        document.getElementsByClassName("ant-collapse-header")[0].setAttribute("aria-expanded", "false");
        document.getElementsByClassName("ant-collapse-content ant-collapse-content-active")[0].className = "ant-collapse-content ant-collapse-content-inactive";
      }
      this.state.body.attSetId = null;
      this.state.compareList.minClass = null;
      this.queryBX();
    }
    this.setState({
      compareList: this.state.compareList
    });
  }
  //在对比栏中移除全部产品
  removeAll() {
    this.state.compareList.number = 0;
    this.state.compareList['item1'] = null;
    this.state.compareList['item2'] = null;
    this.state.compareList['item3'] = null;
    document.getElementById("item1").getElementsByTagName("div")[0].innerText = "您还可以继续添加";
    document.getElementById("item2").getElementsByTagName("div")[0].innerText = "您还可以继续添加";
    document.getElementById("item3").getElementsByTagName("div")[0].innerText = "您还可以继续添加";
    document.getElementById("item1").getElementsByTagName("div")[1].getElementsByTagName("span")[0].innerText = "";
    document.getElementById("item2").getElementsByTagName("div")[1].getElementsByTagName("span")[0].innerText = "";
    document.getElementById("item3").getElementsByTagName("div")[1].getElementsByTagName("span")[0].innerText = "";
    //更改对比栏数据
    if (document.getElementsByClassName("ant-collapse-header")[0].getAttribute("aria-expanded") == "true") {
      document.getElementsByClassName("ant-collapse-item ant-collapse-item-active")[0].className = "ant-collapse-item";
      document.getElementsByClassName("ant-collapse-header")[0].setAttribute("aria-expanded", "false");
      document.getElementsByClassName("ant-collapse-content ant-collapse-content-active")[0].className = "ant-collapse-content ant-collapse-content-inactive";
    }
    this.state.body.attSetId = null;
    this.state.compareList.minClass =  null;
    this.queryBX();
    this.setState({
      compareList: this.state.compareList
    });
  }
  //折叠查询条件
  displayQueryBX(index, e) {
    if (index == 0 && document.getElementById("supplierNameDisplay")) {
      if (document.getElementById("supplierNameDisplay").style.display == "none") {
        document.getElementById("supplierNameDisplay").style.display = "block";
        document.getElementsByName("displayMoreBX")[index].innerHTML = '收起 <i class="anticon anticon-up"></i>';
      } else {
        document.getElementById("supplierNameDisplay").style.display = "none";
        document.getElementsByName("displayMoreBX")[index].innerHTML = '更多 <i class="anticon anticon-down"></i>';
      }
    } else if (index == 1 && document.getElementById("itemLabelDisplay")) {
      if (document.getElementById("itemLabelDisplay").style.display == "none") {
        document.getElementById("itemLabelDisplay").style.display = "block";
        document.getElementsByName("displayMoreBX")[index].innerHTML = '收起 <i class="anticon anticon-up"></i>';
      } else {
        document.getElementById("itemLabelDisplay").style.display = "none";
        document.getElementsByName("displayMoreBX")[index].innerHTML = '更多 <i class="anticon anticon-down"></i>';
      }
    }
  }
  //清空查询条件-query
  clearQueryBX() {
    this.state.body = {
      bigClassName: "保险",
      enabledFlag: 'Y',
    };
    //清空输入框
    this.props.form.setFieldsValue({itemNameBX:""});
    this.queryBX();
    //清空样式
    let p = document.getElementsByClassName(styles.tab2)[0].getElementsByTagName("p");
    for (var i=0; i<p.length; i++) {
      let a = p[i].getElementsByTagName("div")[1].getElementsByTagName("a");
      for (var j=0; j<a.length; j++) {
        if (j == 0) {
          a[j].style.color = "rgb(209, 185, 127)";
        } else {
          a[j].style.color = "#000";
        }
      }
    }
    if (document.getElementById("supplierNameDisplay")) {
      document.getElementById("supplierNameDisplay").style.display = "none";
      document.getElementsByName("displayMoreBX")[0].innerHTML = '更多 <i class="anticon anticon-down"></i>';
    }
    if (document.getElementById("itemLabelDisplay")) {
      document.getElementById("itemLabelDisplay").style.display = "none";
      document.getElementsByName("displayMoreBX")[1].innerHTML = '更多 <i class="anticon anticon-down"></i>';
    }
  }
  //保险公司-query
  supplierNameQuery(e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
      this.state.body.supplierName = null;
    } else {
      var children = document.getElementById("supplierName").children[1].children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      if (children[11]) {
        for (var i=0; i<children[11].children.length; i++) {
          children[11].children[i].style.color = '#000';
        }
      }
      e.target.style.color = 'rgb(209, 185, 127)';
      this.state.body.supplierName = e.target.innerText;
      if (e.target.innerText == "不限") {
        this.state.body.supplierName = null;
      }
    }
    this.queryBX();
  }
  //产品种类-query
  midClassQuery(code, e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
      this.state.body.midClass = null;
    } else {
      var children = document.getElementById("midClass").children[1].children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
      this.state.body.midClass = code;
      if (e.target.innerText == "不限") {
        this.state.body.midClass = null;
      }
    }
    this.queryBX();
  }
  //投保对象-query
  agePeriodQuery(ageFrom, ageTo, e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
      this.state.body.ageFrom = null;
      this.state.body.ageTo = null;
    } else {
      var children = document.getElementById("agePeriod").children[1].children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
      this.state.body.ageFrom = ageFrom;
      this.state.body.ageTo = ageTo;
      if (e.target.innerText == "不限") {
        this.state.body.ageFrom = null;
        this.state.body.ageTo = null;
      }
    }
    this.queryBX();
  }
  //产品标签-query
  itemLabelQuery(e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
      this.state.body.itemLabel = null;
      this.state.body.hotRecommendFlag = null;
      this.state.body.discountFlag = null;
      this.state.body.minClassName = null;
    } else {
      var children = document.getElementById("itemLabel").children[1].children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      if (children[9]) {
        for (var i=0; i<children[9].children.length; i++) {
          children[9].children[i].style.color = '#000';
        }
      }
      e.target.style.color = 'rgb(209, 185, 127)';
      this.state.body.hotRecommendFlag = null;
      this.state.body.discountFlag = null;
      this.state.body.minClassName = null;
      this.state.body.itemLabel = e.target.innerText;
      if (e.target.innerText == '不限') {
        this.state.body.itemLabel = null;
      } else if (e.target.innerText == '热销产品') {
        this.state.body.itemLabel = null;
        this.state.body.hotRecommendFlag = 'Y';
      } else if (e.target.innerText == "最新优惠") {
        this.state.body.itemLabel = null;
        this.state.body.discountFlag = 'Y';
      } else if (e.target.innerText == "高端医疗") {
        this.state.body.itemLabel = null;
        this.state.body.minClassName = '高端医疗'
      }
    }
    this.queryBX();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const columns = [{
      dataIndex: 'pictureFilePath',
      key: 'pictureFilePath',
      width: '25%',
      render: (text, record, index) => {
        return (
          <img onClick={()=>location.hash = '/production/detail/BX/'+record.itemId} src={text?PICTURE_ADDRESS+text:showImg} alt={''} style={{cursor:'pointer'}} width="247px" height='236px' />
        );
      },
    },
    {
      key: 'description',
      width: '50%',
      render: (text, record, index) => {
        return (
          <div style={{textAlign:'left'}}>
            {
              record.itemName.length < 13 ?
                <Row className={styles.product_title}>
                  <span className={styles.product_name} style={{cursor:'pointer'}} onClick={()=>location.hash = '/production/detail/BX/'+record.itemId}>{record.midClass=='FJX'?'(附加险)':''}{record.itemName}</span>
                  <span className={styles.product_supplier}>{record.supplierName}</span>
                </Row>
                :
                <Row className={styles.product_title}>
                  <span className={styles.product_name} style={{cursor:'pointer',fontSize:'24px'}} onClick={()=>location.hash = '/production/detail/BX/'+record.itemId}>{record.midClass=='FJX'?'(附加险)':''}{record.itemName}</span>
                  <span className={styles.product_supplier} style={{fontSize:'20px'}}>{record.supplierName}</span>
                </Row>
            }
            <Row className={styles.product_attribute}>
              投保年龄：{record.attribute2}-{record.attribute3}岁
            </Row>
            <Row className={styles.product_attribute}>
              可选币种：
              {
                record.prdItemPaymode.map((item, index) => {
                  return this.state.codeList.currencyList.map((code) => {
                    if (item.currencyCode == code.value && item.enabledFlag != "N") {
                      if (index == record.prdItemPaymode.length-1) {
                        return <span key={index}>{code.meaning}</span>;
                      } else {
                        return <span key={index}>{code.meaning+"、"}</span>;
                      }
                    }
                  })
                })
              }
            </Row>
            <Row className={styles.product_attribute}>
              保障期限：{record.attribute4}
            </Row>
            <Row style={{margin:'0px'}} className={styles.product_attribute}>
              缴费期限：
              {
                record.prdItemSublineList.map((item, index) => {
                  if (item.enabledFlag != "N") {
                    var sublineItemName = "";
                    if (!isNaN(item.sublineItemName)) {
                      sublineItemName = item.sublineItemName + "年";
                    } else {
                      sublineItemName = item.sublineItemName;
                    }
                    if (index == record.prdItemSublineList.length-1) {
                      return <span key={index}>{sublineItemName}</span>;
                    } else {
                      return <span key={index}>{sublineItemName+"、"}</span>;
                    }
                  }
                })
              }
            </Row>
          </div>
        );
      }
    },
    {
      key: 'actions',
      width: '25%',
      render: (text, record, index) => {
        var compareEle = <span>添加对比</span>;
        for (var i=1; i<this.state.compareList.number+1; i++) {
          if (this.state.compareList["item"+i] && this.state.compareList["item"+i].itemId == record.itemId) {
            compareEle = <span name="compareProduct"><Icon type="check" /><span> 已添加</span></span>;
          }
        }
        return (
          <div>
            <Row style={{marginBottom:'28px'}}>
              <Button style={{width:'190px',height:'46px',fontWeight:'normal'}} type="primary" onClick={()=>location.hash = '/production/detail/BX/'+record.itemId}>
                产品详情
              </Button>
            </Row>
            <Row style={{marginBottom:'28px'}}>
              <Button disabled={record.midClass=='FJX'?true:false} style={{width:'190px',height:'46px',fontWeight:'normal'}} name="compareBtn" type="default" onClick={this.addProduct.bind(this,record)}>
                {compareEle}
              </Button>
            </Row>
            <Row>
              <Button disabled={record.midClass == 'FJX' ? true : false} style={{ width: '190px', height: '46px', fontWeight: 'normal' }} type="default" onClick={this.premiumMeasures.bind(this, record.midClass, record.minClass, record.itemId)}>
                保费测算
                </Button>
            </Row>
          </div>
        );
      },
    }];
    return (
      <Row className={styles.productList}>
        <div className={styles.tab1}>
          <div id="supplierName" style={{paddingTop:'20px',color:'#000'}}>
            <div style={{width:'120px',float:'left'}}>
              <span style={{float:'right'}}>保险公司：</span>
            </div>
            <div style={{width:'890px',float:'left'}}>
              <a onClick={this.supplierNameQuery.bind(this)} style={{color: "#d1b97f"}}>不限</a>
              {
                this.state.companyList.map((company, index) => {
                  if (index < 10) {
                    return <a key={company.supplierId} onClick={this.supplierNameQuery.bind(this)}>{company.name}</a>;
                  }
                })
              }
              {
                this.state.companyList.length >= 10 ?
                  <div id="supplierNameDisplay" style={{width:'800px',clear:'both',display:'none'}}>
                    {
                      this.state.companyList.map((company, index) => {
                        if (index >= 10) {
                          return <a key={company.supplierId} onClick={this.supplierNameQuery.bind(this)}>{company.name}</a>;
                        }
                      })
                    }
                  </div>
                  :
                  ''
              }
            </div>
            {
              this.state.companyList.length >= 10 ?
                <span>
                  <a name='displayMoreBX' onClick={this.displayQueryBX.bind(this, 0)} style={{float:'right'}}>
                    更多 <Icon type="down" />
                  </a>
                </span>
                :
                ""
            }
          </div>
          <div id="midClass" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
            <div style={{width:'120px',float:'left'}}>
              <span style={{float:'right'}}>产品种类：</span>
            </div>
            <div style={{width:'800px',float:'left'}}>
              <a onClick={this.midClassQuery.bind(this, null)} style={{color: "#d1b97f"}}>不限</a>
              <a onClick={this.midClassQuery.bind(this, "FJX")}>附加险</a>
              <a onClick={this.midClassQuery.bind(this, "ZJX")}>重疾险</a>
              <a onClick={this.midClassQuery.bind(this, "CXX")}>储蓄险</a>
              <a onClick={this.midClassQuery.bind(this, "RSX")}>人寿险</a>
              <a onClick={this.midClassQuery.bind(this, "YLX")}>医疗险</a>
              <a onClick={this.midClassQuery.bind(this, "TLX")}>投连险</a>
              <a onClick={this.midClassQuery.bind(this, "WYSX")}>万用寿险</a>
              <a onClick={this.midClassQuery.bind(this, "ZSXJJ")}>指数型基金</a>
            </div>
          </div>
          <div id="agePeriod" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
            <div style={{width:'120px',float:'left'}}>
              <span style={{float:'right'}}>投保年龄：</span>
            </div>
            <div style={{width:'800px',float:'left'}}>
              <a onClick={this.agePeriodQuery.bind(this, null, null)} style={{color: "#d1b97f"}}>不限</a>
              <a onClick={this.agePeriodQuery.bind(this, 1, 15)}>1-15岁</a>
              <a onClick={this.agePeriodQuery.bind(this, 16, 30)}>16-30岁</a>
              <a onClick={this.agePeriodQuery.bind(this, 31, 45)}>31-45岁</a>
              <a onClick={this.agePeriodQuery.bind(this, 45, null)}>45以上</a>
            </div>
          </div>
          <div id="itemLabel" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
            <div style={{width:'120px',float:'left'}}>
              <span style={{float:'right'}}>产品标签：</span>
            </div>
            <div style={{width:'890px',float:'left'}}>
              <a onClick={this.itemLabelQuery.bind(this)} style={{color: "#d1b97f"}}>不限</a>
              <a onClick={this.itemLabelQuery.bind(this)}>热销产品</a>
              <a onClick={this.itemLabelQuery.bind(this)}>最新优惠</a>
              <a onClick={this.itemLabelQuery.bind(this)}>高端医疗</a>
              {
                this.state.labelList.map((label, index) => {
                  if (index < 5) {
                    return <a key={label.labelId} onClick={this.itemLabelQuery.bind(this)}>{label.labelName}</a>;
                  }
                })
              }
              {
                this.state.labelList.length >= 5 ?
                  <div id="itemLabelDisplay" style={{width:'800px',clear:'both',display:'none'}}>
                    {
                      this.state.labelList.map((label, index) => {
                        if (index >= 5) {
                          return <a key={label.labelId} onClick={this.itemLabelQuery.bind(this)}>{label.labelName}</a>;
                        }
                      })
                    }
                  </div>
                  :
                  ''
              }
            </div>
            {
              this.state.labelList.length >= 5 ?
                <span>
                  <a name='displayMoreBX' onClick={this.displayQueryBX.bind(this, 1)} style={{float:'right'}}>
                    更多 <Icon type="down" />
                  </a>
                </span>
                :
                ""
            }
          </div>
          <Row style={{clear:'both',paddingTop:'20px'}}>
            <div style={{float:'left',width:'120px',height:'40px',lineHeight:'40px',color:'#000'}}>
              <span style={{float:'right'}}>产品关键字：</span>
            </div>
            <Form.Item style={{padding:'0',margin:'0 0 0 10px',width:'545px',float:'left'}} >
              {getFieldDecorator('itemNameBX', {})(
                <Input style={{width:'100%'}} placeholder="请输入您想查找的产品名称或关键字" addonAfter={<a onClick={this.queryBX.bind(this)}>立即搜索</a>} />
              )}
            </Form.Item>
          </Row>
        </div>
        <Row>
          <Table dataSource={this.state.dataList} showHeader={false}
                 onChange={handleTableChange.bind(this,productionHeaderList,this.state.body)}
                 pagination={this.state.pagination} columns={columns} />
          <Affix offsetBottom={28}>
            <Collapse defaultActiveKey={['1']} style={{ position: 'absolute', zIndex: '1000', width: '100%', bottom: '-28px' }}>
              <Collapse.Panel header={<span id="compareHeader">保险产品对比（{this.state.compareList.number}/3）</span>} key="1">
                <Col id="item1" xs={6} sm={6} md={6} lg={6} xl={6} style={{ borderRight: '2px solid #d2d2d2', padding: '20px'}}>
                  <Row>您还可以继续添加</Row>
                  <Row><span onClick={this.removeProduct.bind(this,'item1')} style={{cursor: 'pointer'}}></span></Row>
                </Col>
                <Col id="item2" xs={6} sm={6} md={6} lg={6} xl={6} style={{ borderRight: '2px solid #d2d2d2', padding: '20px'}}>
                  <Row>您还可以继续添加</Row>
                  <Row><span onClick={this.removeProduct.bind(this,'item2')} style={{cursor: 'pointer'}}></span></Row>
                </Col>
                <Col id="item3" xs={6} sm={6} md={6} lg={6} xl={6} style={{ borderRight: '2px solid #d2d2d2', padding: '20px'}}>
                  <Row>您还可以继续添加</Row>
                  <Row><span onClick={this.removeProduct.bind(this,'item3')} style={{cursor: 'pointer'}}></span></Row>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} xl={6} style={{padding:'20px',textAlign:'center'}}>
                  <Row style={{ marginBottom: '13px' }}>
                    <ProductionCompareModal compareList={this.state.compareList} />
                  </Row>
                  <Row>
                    <a onClick={this.removeAll.bind(this)}>清空对比栏</a>
                  </Row>
                </Col>
              </Collapse.Panel>
            </Collapse>
          </Affix>
        </Row>
      </Row>
    );
  }
}

export default Form.create()(ProductionShowComponent);
