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
        houseList: [],
        housePriceList:[],
        housePropertyList:[],
        houseTypeList:[]
      },
      body: {
        bigClass: "FC",
        enabledFlag: 'Y',
      },
    };
  }
  componentWillMount() {
    //获取快码值
    const codeBody = {
      currencyList: 'PUB.CURRENCY',
      houseList: 'PRD.HOUSE_LOCATION',
      housePriceList:'PRD.HOUSE_PRICE_RANGE',
      housePropertyList:'PRD.HOUSE_PROPERTY_TYPE',
      houseTypeList:'PRD.HOUSE_TYPE'
    };
    getCode(codeBody).then((data)=>{
      this.setState({
        codeList: data
      });
    });
    this.queryFC();
  }
  //查询产品
  queryFC() {
    this.state.body.itemName = this.props.form.getFieldValue("itemNameFC");
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
        //   this.state.codeList.requisitionPeriod.map((code) => {
        //     if (code.value == data.rows[i].attribute71) {
        //       data.rows[i].requisitionPeriod = code.meaning;
        //     }
        //   });
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
  displayQueryFC(index, e) {
    if (document.getElementById("queryFC")) {
      if (document.getElementById("queryFC").style.display == "none") {
        document.getElementById("queryFC").style.display = "block";
        document.getElementsByName("displayMoreFC")[index].innerHTML = '收起 <i class="anticon anticon-up"></i>';
      } else {
        document.getElementById("queryFC").style.display = "none";
        document.getElementsByName("displayMoreFC")[index].innerHTML = '更多 <i class="anticon anticon-down"></i>';
      }
    }
  }
  //清空查询条件-query
  clearQueryFC() {
    this.state.body = {
      bigClassName: "移民投资",
      enabledFlag: 'Y',
    };
    //清空输入框
    this.props.form.setFieldsValue({itemNameFC:""});
    this.queryFC();
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
    p = document.getElementById("queryFC").getElementsByTagName("p");
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
    document.getElementById("queryFC").style.display = "none";
    document.getElementsByName("displayMoreFC")[0].innerHTML = '更多 <i class="anticon anticon-down"></i>';
  }

  //所在地区
  whereRegionQuery(value,e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
      this.state.body.attribute81 = null;
    } else {
      var children = document.getElementById("whereRegion").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
      this.state.body.attribute81 = value;
      if (e.target.innerText == "不限") {
        this.state.body.attribute81 = null;
      }
    }
    this.queryFC();
  }

  //价格（折合人名币）
  priceQuery(value,e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
      this.state.body.attribute83 = null;
    } else {
      var children = document.getElementById("price").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
      this.state.body.attribute83 = value;
      if (e.target.innerText == "不限") {
        this.state.body.attribute83 = null;
      }
    }
    this.queryFC();
  }

  //物业类型
  propertyTypeQuery(value,e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
      this.state.body.attribute82 = null;
    } else {
      var children = document.getElementById("propertyType").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
      this.state.body.attribute82 = value;
      if (e.target.innerText == "不限") {
        this.state.body.attribute82 = null;
      }
    }
    this.queryFC();
  }

  //房屋类型
  houseTypeQuery(value, e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
    } else {
      var children = document.getElementById("houseType").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
      this.state.body.attribute80 = value;
      if (e.target.innerText == "不限") {
        this.state.body.attribute80 = null;
      }
    }
    this.queryFC();
  }



  render() {
    const { getFieldDecorator } = this.props.form;
    const columns = [{
      dataIndex: 'pictureFilePath',
      key: 'pictureFilePath',
      width: '25%',
      render: (text, record, index) => {
        return (
          <img onClick={()=>location.hash = '/production/detail/FC/'+record.itemId} style={{cursor:'pointer'}} src={text?PICTURE_ADDRESS+text:showImg} alt={''} width="247px" height='236px' />
        );
      },
    }, {
      key: 'description',
      width: '50%',
      render: (text, record, index) => {
        return (
          <div style={{textAlign:'left'}}>
            <Row className={styles.product_title}>
              <span onClick={()=>location.hash = '/production/detail/FC/'+record.itemId} style={{cursor:'pointer'}} className={styles.product_name}>
                {record.itemName}
              </span>
            </Row>
            <Row className={styles.product_attribute}>
              所在城市：{record.attribute84}
            </Row>
            <Row className={styles.product_attribute}>
              物业类型：
              {
                this.state.codeList.housePropertyList.map((code,index) => {
                  if(record.attribute82 === code.value){
                    return <span key={index}>{code.meaning}</span>
                  }else if(record.attribute82 === code.meaning){
                    return <span key={index}>{record.attribute82}</span>
                  }
                })
              }
            </Row>
            <Row className={styles.product_attribute}>
              房屋类型：{
                 this.state.codeList.houseTypeList.map((code,index) => {
                  if(record.attribute80 === code.value){
                    return <span key={index}>{code.meaning}</span>
                  }else if(record.attribute80 === code.meaning){
                    return <span key={index}>{record.attribute80}</span>
                  }
                })
              }
            </Row>
            <Row style={{margin:'0px'}} className={styles.product_attribute}>
              价格范围：{
                 this.state.codeList.housePriceList.map((code,index) => {
                  if(record.attribute83 === code.value){
                    return <span key={index}>{code.meaning}</span>
                  }else if(record.attribute83 === code.meaning){
                    return <span key={index}>{record.attribute83}</span>
                  }
                })
              }
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
              <Button type="primary" style={{width:'190px',height:'46px',fontWeight:'normal'}} className={commonStyles.btnPrimary} onClick={()=>location.hash = '/production/detail/FC/'+record.itemId}>
                查看详情
              </Button>
            </Row>
            <Row>
              <Button type="default" style={{width:'190px',height:'46px',fontWeight:'normal'}} className={commonStyles.btnDefault} onClick={()=>location.hash = '/production/subscribe/FC/FC/'+record.itemId}>
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

          {/*所在地区*/}
          <div id="whereRegion" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
            <div style={{width:'160px',float:'left'}}>
              <span style={{float:'right'}}>所在地区：</span>
            </div>
            <a onClick={this.whereRegionQuery.bind(this,null)} style={{ color: "rgb(209, 185, 127)" }}>不限</a>
            {this.state.codeList.houseList.map((code,index)=>{
              return <a onClick={this.whereRegionQuery.bind(this,code.value)} key={index}>{code.meaning}</a>
            })}
          </div>

          {/*价格（折合人名币）*/}
          <div id="price" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
            <div style={{width:'160px',float:'left'}}>
              <span style={{float:'right'}}>价格（折合人名币）：</span>
            </div>
            <a onClick={this.priceQuery.bind(this,null)} style={{ color: "rgb(209, 185, 127)" }}>不限</a>
            {this.state.codeList.housePriceList.map((code,index)=>{
              return <a onClick={this.priceQuery.bind(this,code.value)} key={index}>{code.meaning}</a>
            })}
          </div>

          {/*物业类型*/}
          <div id="propertyType" style={{clear:'both',paddingTop:'20px',color:'#000'}}>
            <div style={{width:'160px',float:'left'}}>
              <span style={{float:'right'}}>物业类型：</span>
            </div>
            <a onClick={this.propertyTypeQuery.bind(this,null)} style={{ color: "rgb(209, 185, 127)" }}>不限</a>
            {this.state.codeList.housePropertyList.map((code,index)=>{
              return <a onClick={this.propertyTypeQuery.bind(this,code.value)} key={index}>{code.meaning}</a>
            })}
          </div>

          {/*房屋类型*/}
          <div id="houseType" style={{ clear: 'both', paddingTop: '20px', color: '#000' }}>
              <div style={{ width: '160px', float: 'left' }}>
                  <span style={{ float: 'right' }}>房屋类型：</span>
              </div>
              <a onClick={this.houseTypeQuery.bind(this, null)} style={{ color: "rgb(209, 185, 127)" }}>不限</a>
              {this.state.codeList.houseTypeList.map((code, index) => {
                return <a onClick={this.houseTypeQuery.bind(this, code.value)} key={index}>{code.meaning}</a>
              })}
          </div>

          {/*产品搜索*/}
          <Row style={{clear:'both',paddingTop:'20px'}}>
            <div style={{float:'left',width:'160px',height:'40px',lineHeight:'40px',color:'#000'}}>
              <span style={{float:'right'}}>产品搜索：</span>
            </div>
            <Form.Item style={{padding:'0',margin:'0 0 0 10px',width:'545px',float:'left'}} >
              {getFieldDecorator('itemNameFC', {})(
                <Input style={{width:'100%'}} placeholder="请输入您想查找的产品名称或关键字" addonAfter={<a onClick={this.queryFC.bind(this)}>立即搜索</a>} />
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
