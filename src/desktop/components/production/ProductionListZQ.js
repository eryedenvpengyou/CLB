/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { Table, Button, Row, Col, Input, Form, Icon } from 'antd';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import { productionHeaderList } from '../../services/production';
import { handleTableChange } from '../../utils/table';
import { PICTURE_ADDRESS } from '../../constants';
import TipModal from "../common/modal/Modal";
import ProductionReferralFee from './ProductionReferralFee';
import showImg from "../../styles/images/production/product_show_img.jpg";
import { getCode } from '../../services/code';

class ProductionShowComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      orderBy: [],
      pagination: {},
      body: {
        bigClass: "ZQ",
        enabledFlag: 'Y',
      },
      codeList: {
        dividendCycle: []
      }
    };
  }
  componentWillMount() {
    //获取快码值
    const codeBody = {
      dividendCycle: 'PRD.INTEREST PERIOD',
    };
    getCode(codeBody).then((codeData)=>{
      this.state.codeList = codeData;
      this.queryZQ();
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.refresh != nextProps.refresh && nextProps.refresh == 'ZQ') {
      if (document.getElementById("queryZQ").style.display == "block") {
        document.getElementById("queryZQ").style.display = "none";
        document.getElementsByName("displayMoreZQ")[0].innerHTML = '更多 <i class="anticon anticon-down"></i>';
      }
    }
  }
  //查询产品
  queryZQ() {
    this.state.body.itemName = this.props.form.getFieldValue("itemNameZQ");
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
          this.state.codeList.dividendCycle.map((code) => {
            if (code.value == data.rows[i].attribute53) {
              data.rows[i].dividendCycle = code.meaning;
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
  //折叠查询条件
  displayQueryZQ(index, e) {
    if (document.getElementById("queryZQ")) {
      if (document.getElementById("queryZQ").style.display == "none") {
        document.getElementById("queryZQ").style.display = "block";
        document.getElementsByName("displayMoreZQ")[index].innerHTML = '收起 <i class="anticon anticon-up"></i>';
      } else {
        document.getElementById("queryZQ").style.display = "none";
        document.getElementsByName("displayMoreZQ")[index].innerHTML = '更多 <i class="anticon anticon-down"></i>';
      }
    }
  }
  //清空查询条件-query
  clearQueryZQ() {
    this.state.body = {
      bigClassName: "债券",
      enabledFlag: 'Y',
    };
    //清空输入框
    this.props.form.setFieldsValue({itemNameZQ:""});
    this.queryZQ();
    //清空样式
    let p = document.getElementsByClassName(styles.tab2)[1].getElementsByTagName("p");
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
    p = document.getElementById("queryZQ").getElementsByTagName("p");
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
    document.getElementById("queryZQ").style.display = "none";
    for (var i=0; i<document.getElementsByName("displayMoreZQ").length; i++) {
      document.getElementsByName("displayMoreZQ")[i].innerHTML = '更多 <i class="anticon anticon-down"></i>';
    }
  }
  //债券年限-query
  bondYearPeriodQuery(value, e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
    } else {
      var children = document.getElementById("bondYearPeriod").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
    }
    this.state.body.sublineItemName = value;
    this.queryZQ();
  }
  //年利息-query
  annualInterestQuery(annualInterestFrom, annualInterestTo, e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
    } else {
      var children = document.getElementById("annualInterest").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
    }
    this.state.body.annualInterestFrom = annualInterestFrom;
    this.state.body.annualInterestTo = annualInterestTo;
    this.queryZQ();
  }
  //派息周期-query
  dividendCycleQuery(dividendCycleCode, e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
    } else {
      var children = document.getElementById("dividendCycle").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
    }
    this.state.body.attribute53 = dividendCycleCode;
    this.queryZQ();
  }
  //认购费-query
  subscriptionFeeQuery(e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
      this.state.body.attribute56 = null;
    } else {
      var children = document.getElementById("subscriptionFee").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
      this.state.body.attribute56 = e.target.innerText;
      if (e.target.innerText == "不限") {
        this.state.body.attribute56 = null;
      }
    }
    this.queryZQ();
  }
  //托管费-query
  trustFeeQuery(e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
      this.state.body.attribute56 = null;
    } else {
      var children = document.getElementById("trustFee").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
      this.state.body.attribute56 = e.target.innerText;
      if (e.target.innerText == "不限") {
        this.state.body.attribute56 = null;
      }
    }
    this.queryZQ();
  }
  //市值（港元）-query
  marketValueQuery(marketValueFrom, marketValueTo, e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
    } else {
      var children = document.getElementById("marketValue").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
    }
    this.state.body.marketValueFrom = marketValueFrom;
    this.state.body.marketValueTo = marketValueTo;
    this.queryZQ();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const columns = [{
      dataIndex: 'pictureFilePath',
      key: 'pictureFilePath',
      width: '25%',
      render: (text, record, index) => {
        return (
          <img  onClick={()=>location.hash = '/production/detail/ZQ/'+record.itemId} style={{cursor:'pointer'}} src={text?PICTURE_ADDRESS+text:showImg} alt={''} width="247px" height='236px' />
        );
      },
    }, {
      key: 'description',
      width: '50%',
      render: (text, record, index) => {
        return (
          <div style={{textAlign:'left'}}>
            <Row className={styles.productZQ_title}>
              <span onClick={()=>location.hash = '/production/detail/ZQ/'+record.itemId} style={{cursor:'pointer'}} className={styles.product_name}>{record.itemName}</span>
            </Row>
            <Row className={styles.productZQ_attribute}>
              股票代码：{record.attribute50}
            </Row>
            <Row className={styles.productZQ_attribute}>
              债券期限：
              {
                record.prdItemSublineList.map((item, index) => {
                  if(item.enabledFlag != "N") {
                    if (index == record.prdItemSublineList.length-1) {
                      return <span key={index}>{item.sublineItemName}</span>;
                    } else {
                      return <span key={index}>{item.sublineItemName+"、"}</span>;
                    }
                  }
                })
              }
            </Row>
            <Row className={styles.productZQ_attribute}>
              派息周期：{record.dividendCycle}
            </Row>
            <Row className={styles.productZQ_attribute}>
              年利息：{record.attribute52}
            </Row>
            <Row style={{margin:'0px'}} className={styles.productZQ_attribute}>
              市值：{record.attribute54}
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
              <Button type="primary" style={{width:'190px',height:'46px',fontWeight:'normal'}} className={commonStyles.btnPrimary} onClick={()=>location.hash = '/production/detail/ZQ/'+record.itemId}>
                产品详情
              </Button>
            </Row>
            <Row>
              <Button type="default" style={{width:'190px',height:'46px',fontWeight:'normal'}} className={commonStyles.btnDefault} onClick={()=>location.hash = '/production/subscribe/ZQ/ZQ/'+record.itemId}>
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
          <div id="bondYearPeriod" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
            <div style={{width:'120px',float:'left'}}>
              <span style={{float:'right'}}>债券年限：</span>
            </div>
            <a onClick={this.bondYearPeriodQuery.bind(this, null)} style={{color: "rgb(209, 185, 127)"}}>不限</a>
            <a onClick={this.bondYearPeriodQuery.bind(this, 2)}>2年</a>
            <a onClick={this.bondYearPeriodQuery.bind(this, 3)}>3年</a>
            <a onClick={this.bondYearPeriodQuery.bind(this, 4)}>4年</a>
            <a onClick={this.bondYearPeriodQuery.bind(this, 5)}>5年</a>
            <a onClick={this.bondYearPeriodQuery.bind(this, 6)}>6年</a>
            <a onClick={this.bondYearPeriodQuery.bind(this, 7)}>7年</a>
            <a onClick={this.bondYearPeriodQuery.bind(this, 7.5)}>7.5年</a>
            <a onClick={this.bondYearPeriodQuery.bind(this, 8)}>8年</a>
            <span>
              <a name='displayMoreZQ' onClick={this.displayQueryZQ.bind(this, 0)} style={{float:'right'}}>
                更多 <Icon type="down" />
              </a>
            </span>
          </div>
          <div id="annualInterest" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
            <div style={{width:'120px',float:'left'}}>
              <span style={{float:'right'}}>年利息：</span>
            </div>
            <a onClick={this.annualInterestQuery.bind(this, null, null)} style={{color: "rgb(209, 185, 127)"}}>不限</a>
            <a onClick={this.annualInterestQuery.bind(this, "4%", "6%")}>4~6%</a>
            <a onClick={this.annualInterestQuery.bind(this, "6%", "8%")}>6~8%</a>
            <a onClick={this.annualInterestQuery.bind(this, "8%", "10%")}>8~10%</a>
            <a onClick={this.annualInterestQuery.bind(this, "10%", null)}>10%以上</a>
          </div>
          <div id="dividendCycle" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
            <div style={{width:'120px',float:'left'}}>
              <span style={{float:'right'}}>派息周期：</span>
            </div>
            <a onClick={this.dividendCycleQuery.bind(this, null)} style={{color: "rgb(209, 185, 127)"}}>不限</a>
            {
              this.state.codeList.dividendCycle.map((code, index) => {
                return <a key={index} onClick={this.dividendCycleQuery.bind(this, code.value)}>{code.meaning}</a>
              })
            }
          </div>
          <div id="queryZQ" style={{display: 'none'}}>
            <div id="subscriptionFee" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
              <div style={{width:'120px',float:'left'}}>
                <span style={{float:'right'}}>认购费：</span>
              </div>
              <a onClick={this.subscriptionFeeQuery.bind(this)} style={{color: "rgb(209, 185, 127)"}}>不限</a>
              <a onClick={this.subscriptionFeeQuery.bind(this)}>0</a>
              <a onClick={this.subscriptionFeeQuery.bind(this)}>0.5%</a>
            </div>
            <div id="trustFee" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
              <div style={{width:'120px',float:'left'}}>
                <span style={{float:'right'}}>托管费：</span>
              </div>
              <a onClick={this.trustFeeQuery.bind(this)} style={{color: "rgb(209, 185, 127)"}}>不限</a>
              <a onClick={this.trustFeeQuery.bind(this)}>3000</a>
              <a onClick={this.trustFeeQuery.bind(this)}>5000</a>
            </div>
            <div id="marketValue" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
              <div style={{width:'120px',float:'left'}}>
                <span style={{float:'right'}}>市值（港元）：</span>
              </div>
              <a onClick={this.marketValueQuery.bind(this, null, null)} style={{color: "rgb(209, 185, 127)"}}>不限</a>
              <a onClick={this.marketValueQuery.bind(this, null, 10000000000)}>10亿以下</a>
              <a onClick={this.marketValueQuery.bind(this, 10000000000, 30000000000)}>10~30亿</a>
              <a onClick={this.marketValueQuery.bind(this, 30000000000, 50000000000)}>30~50亿</a>
              <a onClick={this.marketValueQuery.bind(this, 50000000000, 100000000000)}>50~100亿</a>
              <a onClick={this.marketValueQuery.bind(this, 100000000000, null)}>100亿以上</a>
            </div>
          </div>
          <Row style={{clear:'both',paddingTop:'20px',color:'#000'}}>
            <div style={{float:'left',width:'120px',height:'40px',lineHeight:'40px',color:'#000'}}>
              <span style={{float:'right'}}>产品关键字：</span>
            </div>
            <Form.Item style={{padding:'0',margin:'0 0 0 10px',width:'545px',float:'left'}} >
              {getFieldDecorator('itemNameZQ', {})(
                <Input style={{width:'100%'}} placeholder="请输入您想查找的产品名称或关键字" addonAfter={<a onClick={this.queryZQ.bind(this)}>立即搜索</a>} />
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
