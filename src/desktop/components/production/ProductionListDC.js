/**
 * wanjun.feng@hand-china.com
 * 2017/6/7
 */

import React from 'react';
import { Table, Button, Row, Col, Input, Form, Icon } from 'antd';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import { productionHeaderList } from '../../services/production';
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
      orderBy: [],
      pagination: {},
      //快码值
      codeList: {
        currencyList: [],
        requisitionPeriod: [],
      },
      body: {
        bigClass: "DC",
        enabledFlag: 'Y',
      },
    };
  }
  componentWillMount() {
    //获取快码值
    const codeBody = {
      currencyList: 'PUB.CURRENCY',
      requisitionPeriod: 'PRD.REQUISITION_PERIOD'
    };
    getCode(codeBody).then((data)=>{
      this.setState({
        codeList: data
      });
    });
    this.queryDC();
  }
  //查询产品
  queryDC() {
    this.state.body.itemName = this.props.form.getFieldValue("itemNameDC");
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
          this.state.codeList.requisitionPeriod.map((code) => {
            if (code.value == data.rows[i].attribute71) {
              data.rows[i].requisitionPeriod = code.meaning;
            }
          });
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
  componentWillReceiveProps(nextProps) {
    if (this.props.refresh != nextProps.refresh && nextProps.refresh == 'DC') {
      if (document.getElementById("queryDC").style.display == "block") {
        document.getElementById("queryDC").style.display = "none";
        document.getElementsByName("displayMoreDC")[0].innerHTML = '更多 <i class="anticon anticon-down"></i>';
      }
    }
  }
  //折叠查询条件
  displayQueryDC(index, e) {
    if (document.getElementById("queryDC")) {
      if (document.getElementById("queryDC").style.display == "none") {
        document.getElementById("queryDC").style.display = "block";
        document.getElementsByName("displayMoreDC")[index].innerHTML = '收起 <i class="anticon anticon-up"></i>';
      } else {
        document.getElementById("queryDC").style.display = "none";
        document.getElementsByName("displayMoreDC")[index].innerHTML = '更多 <i class="anticon anticon-down"></i>';
      }
    }
  }
  //清空查询条件-query
  clearQueryDC() {
    this.state.body = {
      bigClassName: "移民投资",
      enabledFlag: 'Y',
    };
    //清空输入框
    this.props.form.setFieldsValue({itemNameDC:""});
    this.queryDC();
    //清空样式
    let p = document.getElementsByClassName(styles.tab2)[2].getElementsByTagName("p");
    for (var i=0; i<p.length; i++) {
      let a = p[i].getElementsByTagName("a");
      for (var j=0; j<a.length; j++) {
        if (j == 0) {
          a[j].style.color = "rgb(209, 185, 127)";
        } else {
          a[j].style.color = "#000";
        }
      }
    }
    p = document.getElementById("queryDC").getElementsByTagName("p");
    for (var i=0; i<p.length; i++) {
      let a = p[i].getElementsByTagName("a");
      for (var j=0; j<a.length; j++) {
        if (j == 0) {
          a[j].style.color = "rgb(209, 185, 127)";
        } else {
          a[j].style.color = "#000";
        }
      }
    }
    document.getElementById("queryDC").style.display = "none";
    document.getElementsByName("displayMoreDC")[0].innerHTML = '更多 <i class="anticon anticon-down"></i>';
  }
  //投资币种-query
  investCurrencyQuery(currencyCode, e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
    } else {
      var children = document.getElementById("investCurrency").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
    }
    this.state.body.currencyCode = currencyCode;
    this.queryDC();
  }
  //投资地区-query
  investAreaQuery(e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
      this.state.body.attribute75 = null;
    } else {
      var children = document.getElementById("investArea").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
      this.state.body.attribute75 = e.target.innerText;
      if (e.target.innerText == "不限") {
        this.state.body.attribute75 = null;
      }
    }
    this.queryDC();
  }
  //投资目的-query
  investPurposeQuery(e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
      this.state.body.attribute74 = null;
    } else {
      var children = document.getElementById("investPurpose").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
      this.state.body.attribute74 = e.target.innerText;
      if (e.target.innerText == "不限") {
        this.state.body.attribute74 = null;
      }
    }
    this.queryDC();
  }
  //投资金额-query
  investAmountQuery(investmentAmountFrom, investmentAmountTo, e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
    } else {
      var children = document.getElementById("investAmount").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
    }
    this.state.body.investmentAmountFrom = investmentAmountFrom;
    this.state.body.investmentAmountTo = investmentAmountTo;
    this.queryDC();
  }
  //办理周期-query
  manageCycleQuery(value, e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
    } else {
      var children = document.getElementById("manageCycle").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
    }
    this.state.body.attribute71 = value;
    //this.state.body.transactionDataFrom = transactionDataFrom;
    //this.state.body.transactionDataTo = transactionDataTo;
    this.queryDC();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const columns = [{
      dataIndex: 'pictureFilePath',
      key: 'pictureFilePath',
      width: '25%',
      render: (text, record, index) => {
        return (
          <img onClick={()=>location.hash = '/production/detail/DC/'+record.itemId} style={{cursor:'pointer'}} src={text?PICTURE_ADDRESS+text:showImg} alt={''} width="247px" height='236px' />
        );
      },
    }, {
      key: 'description',
      width: '50%',
      render: (text, record, index) => {
        return (
          <div style={{textAlign:'left'}}>
            <Row className={styles.product_title}>
              <span onClick={()=>location.hash = '/production/detail/DC/'+record.itemId} style={{cursor:'pointer'}} className={styles.product_name}>
                {record.itemName}
              </span>
            </Row>
            <Row className={styles.product_attribute}>
              投保方式：{record.attribute70}
            </Row>
            <Row className={styles.product_attribute}>
              办理周期：{record.requisitionPeriod||record.attribute71}
            </Row>
            <Row className={styles.product_attribute}>
              投资货币：
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
            <Row style={{margin:'0px'}} className={styles.product_attribute}>
              投资门槛：{record.attribute73?(""+record.attribute73).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,"):""}
            </Row>
          </div>
        );
      }
    }, {
      key: 'actions',
      width: '25%',
      render: (text, record, index) => {
        return (
          <div>
            <Row style={{ marginBottom: '28px' }}>
              <Button type="primary" style={{width:'190px',height:'46px',fontWeight:'normal'}} className={commonStyles.btnPrimary} onClick={()=>location.hash = '/production/detail/DC/'+record.itemId}>
                产品详情
              </Button>
            </Row>
            <Row>
              <Button type="default" style={{width:'190px',height:'46px',fontWeight:'normal'}} className={commonStyles.btnDefault} onClick={()=>location.hash = '/production/subscribe/DC/DC/'+record.itemId}>
                立即预约
              </Button>
            </Row>
          </div>
        );
      },
    }];
    return (
      <Row className={styles.productList}>
        <div className={styles.tab1}>
          <div id="investCurrency" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
            <div style={{width:'120px',float:'left'}}>
              <span style={{float:'right'}}>投资币种：</span>
            </div>
            <a onClick={this.investCurrencyQuery.bind(this, null)} style={{color: "rgb(209, 185, 127)"}}>不限</a>
            <a onClick={this.investCurrencyQuery.bind(this, "USD")}>美元</a>
            <a onClick={this.investCurrencyQuery.bind(this, "EURO")}>欧元</a>
            <a onClick={this.investCurrencyQuery.bind(this, "AUD")}>澳币</a>
            <span>
              <a name='displayMoreDC' onClick={this.displayQueryDC.bind(this, 0)} style={{float:'right'}}>
                更多 <Icon type="down" />
              </a>
            </span>
          </div>
          <div id="investArea" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
            <div style={{width:'120px',float:'left'}}>
              <span style={{float:'right'}}>投资地区：</span>
            </div>
            <a onClick={this.investAreaQuery.bind(this)} style={{color: "rgb(209, 185, 127)"}}>不限</a>
            <a onClick={this.investAreaQuery.bind(this)}>北美</a>
            <a onClick={this.investAreaQuery.bind(this)}>欧洲</a>
            <a onClick={this.investAreaQuery.bind(this)}>亚洲</a>
            <a onClick={this.investAreaQuery.bind(this)}>澳洲</a>
          </div>
          <div id="investPurpose" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
            <div style={{width:'120px',float:'left'}}>
              <span style={{float:'right'}}>投资目的：</span>
            </div>
            <a onClick={this.investPurposeQuery.bind(this)} style={{color: "rgb(209, 185, 127)"}}>不限</a>
            <a onClick={this.investPurposeQuery.bind(this)}>移民</a>
            <a onClick={this.investPurposeQuery.bind(this)}>投资</a>
            <a onClick={this.investPurposeQuery.bind(this)}>留学</a>
            <a onClick={this.investPurposeQuery.bind(this)}>居住</a>
            <a onClick={this.investPurposeQuery.bind(this)}>护照</a>
            <a onClick={this.investPurposeQuery.bind(this)}>税务规则</a>
          </div>
          <div id="queryDC" style={{display: 'none'}}>
            <div id="investAmount" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
              <div style={{width:'120px',float:'left'}}>
                <span style={{float:'right'}}>投资门槛：</span>
              </div>
              <a onClick={this.investAmountQuery.bind(this, null, null)} style={{color: "rgb(209, 185, 127)"}}>不限</a>
              <a onClick={this.investAmountQuery.bind(this, null, 10000000)}>100万以下</a>
              <a onClick={this.investAmountQuery.bind(this, 10000000, 20000000)}>100万-200万</a>
              <a onClick={this.investAmountQuery.bind(this, 20000000, 30000000)}>200万-300万</a>
              <a onClick={this.investAmountQuery.bind(this, 30000000, 50000000)}>300万-500万</a>
              <a onClick={this.investAmountQuery.bind(this, 50000000, null)}>500万以上</a>
            </div>
            <div id="manageCycle" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
              <div style={{width:'120px',float:'left'}}>
                <span style={{float:'right'}}>办理周期：</span>
              </div>
              <a onClick={this.manageCycleQuery.bind(this, null)} style={{color: "rgb(209, 185, 127)"}}>不限</a>
              {
                this.state.codeList.requisitionPeriod.map((code, index) => {
                  return <a key={index} onClick={this.manageCycleQuery.bind(this, code.value)}>{code.meaning}</a>
                })
              }
            </div>
          </div>
          <Row style={{clear:'both',paddingTop:'20px'}}>
            <div style={{float:'left',width:'120px',height:'40px',lineHeight:'40px',color:'#000'}}>
              <span style={{float:'right'}}>产品关键字：</span>
            </div>
            <Form.Item style={{padding:'0',margin:'0 0 0 10px',width:'545px',float:'left'}} >
              {getFieldDecorator('itemNameDC', {})(
                <Input style={{width:'100%'}} placeholder="请输入您想查找的产品名称或关键字" addonAfter={<a onClick={this.queryDC.bind(this)}>立即搜索</a>} />
              )}
            </Form.Item>
          </Row>
        </div>
        <Row>
          <Table showHeader={false} columns={columns}
                 onChange={handleTableChange.bind(this,productionHeaderList,this.state.body)}
                 pagination={this.state.pagination} dataSource={this.state.dataList}/>
        </Row>
      </Row>
    );
  }
}

export default Form.create()(ProductionShowComponent);
