/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Icon } from 'antd';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import { productionCompareTable } from '../../services/production';
import TipModal from "../common/modal/Modal";

class ProductionCompareRadar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      compareInfo: this.props.compareInfo,
      productCompare: {
        itemList: [],
        premiumMeasureList: [],
        prdItemAttrList: [],
        securityPlanList: [],
      },
      columns1: [{
        dataIndex: 'attrName',
        className: styles.tableColumnCenter,
        width: '25%'
      }],
      columns2: [{
        dataIndex: 'attrName',
        className: styles.tableColumnCenter,
        width: '25%'
      }],
      columns3: [{
        title: '现金价值表',
        dataIndex: 'attrName',
        width: '25%'
      }]
    }
  }
  componentWillMount() {
    productionCompareTable(this.state.compareInfo.itemList).then((data) => {
      if (data.success) {
        //产品列表
        let itemName = {}, supplierName = {};
        itemName.attrName = "产品名称";
        supplierName.attrName = "所属公司";
        //保费测算
        let _premiumMeasureYear = [], _premiumMeasureTotal = [];//用于确定最大最小值
        let premiumMeasureYear = {}, premiumMeasureTotal = {};
        premiumMeasureYear.attrName = "年缴保费";
        premiumMeasureTotal.attrName = "总保费";
        //保障利益
        let _surrenderCash30 = [], _surrenderCash40 = [], _surrenderCash50 = [], _surrenderCash60 = [];//用于确定最大最小值
        let _dieCash30 = [], _dieCash40 = [], _dieCash50 = [], _dieCash60 = [];//用于确定最大最小值
        let securityPlan30 = {}, securityPlan40 = {}, securityPlan50 = {}, securityPlan60 = {};
        securityPlan30.attrName = "30年后";
        securityPlan40.attrName = "40年后";
        securityPlan50.attrName = "50年后";
        securityPlan60.attrName = "60年后";

        for (var i=0; i<data.rows.length; i++) {
          //产品列表
          itemName["name"+(i+1)] = data.rows[i].itemName;
          supplierName["name"+(i+1)] = data.rows[i].supplierName;
          //产品属性
          if (i == 0) {
            for (var j=0; j<data.rows[i].prdAttributeSetLine.length; j++) {
              let _prdItemAttr = [];//用于确定最大最小值
              let prdItemAttr = {};
              if (data.rows[i].prdAttributeSetLine[j].attGroupName == "基本属性") {
                prdItemAttr["key"] = j;
                prdItemAttr["attrName"] = data.rows[i].prdAttributeSetLine[j].attName;
                for (var k=0; k<data.rows.length; k++) {
                  prdItemAttr["detail"+(k+1)] = data.rows[k][data.rows[k].prdAttributeSetLine[j].fieldCode.toLowerCase()];
                  _prdItemAttr.push(data.rows[k][data.rows[k].prdAttributeSetLine[j].fieldCode.toLowerCase()]);
                }
                if (data.rows[i].prdAttributeSetLine[j].compareRule == "MAX") {
                  prdItemAttr.max = Math.max.apply(Math,_prdItemAttr)
                } else if (data.rows[i].prdAttributeSetLine[j].compareRule == "MIN") {
                  prdItemAttr.min = Math.min.apply(Math,_prdItemAttr)
                }
              }
              if (prdItemAttr["attrName"]) {
                this.state.productCompare.prdItemAttrList.push(prdItemAttr);
              }
            }
          }
          //保费测算
          premiumMeasureYear["detail"+(i+1)] = data.rows[i].yearPermium;
          _premiumMeasureYear.push(data.rows[i].yearPermium);
          premiumMeasureTotal["detail"+(i+1)] = isNaN(this.state.compareInfo.itemList[i].productionAgeLimit)?'':(data.rows[i].yearPermium*this.state.compareInfo.itemList[i].productionAgeLimit).toFixed(2);
          _premiumMeasureTotal.push(premiumMeasureTotal["detail"+(i+1)]);
          //保障利益
          securityPlan30["detail"+(i+1)+"_1"] = data.rows[i].dieCash30;
          _dieCash30.push(data.rows[i].dieCash30);
          securityPlan30["detail"+(i+1)+"_2"] = data.rows[i].surrenderCash30;
          _surrenderCash30.push(data.rows[i].surrenderCash30);
          securityPlan40["detail"+(i+1)+"_1"] = data.rows[i].dieCash40;
          _dieCash40.push(data.rows[i].dieCash40);
          securityPlan40["detail"+(i+1)+"_2"] = data.rows[i].surrenderCash40;
          _surrenderCash30.push(data.rows[i].surrenderCash40);
          securityPlan50["detail"+(i+1)+"_1"] = data.rows[i].dieCash50;
          _dieCash50.push(data.rows[i].dieCash50);
          securityPlan50["detail"+(i+1)+"_2"] = data.rows[i].surrenderCash50;
          _surrenderCash30.push(data.rows[i].surrenderCash50);
          securityPlan60["detail"+(i+1)+"_1"] = data.rows[i].dieCash60;
          _dieCash60.push(data.rows[i].dieCash60);
          securityPlan60["detail"+(i+1)+"_2"] = data.rows[i].surrenderCash60;
          _surrenderCash30.push(data.rows[i].surrenderCash60);
          //生成表格列
          this.state.columns1.push({
            dataIndex: 'name'+(i+1),
            width: '25%',
          });
          this.state.columns2.push({
            dataIndex: 'detail'+(i+1),
            width: '25%',
            render: (text,record,index) => {
              if (record.max && record.max == text) {
                return <span style={{color:"#ee9867"}}>{text} <Icon type="arrow-up" /></span>;
              } else if (record.min && record.min == text) {
                return <span style={{color:"#74ad4f"}}>{text} <Icon type="arrow-down" /></span>;
              }
              return <span>{text||"-"}</span>;
            }
          });
          this.state.columns3.push({
            title: '重疾/身故理赔',
            dataIndex: 'detail'+(i+1)+'_1',
            width: '13%'
          },{
            title: '退保价值',
            dataIndex: 'detail'+(i+1)+'_2',
            width: '12%'
          });
        }
        //产品列表
        //产品名称
        itemName.key = 0;
        this.state.productCompare.itemList.push(itemName);
        //所属公司
        supplierName.key = 1;
        this.state.productCompare.itemList.push(supplierName);
        if (this.state.compareInfo.minClass == 'GD') {
          //保障级别/地区
          this.state.productCompare.itemList.push({
            key: 2,
            attrName: '保障级别',
            name1: this.state.compareInfo.itemList[0].securityLevel,
            name2: this.state.compareInfo.itemList[1].securityLevel,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].securityLevel:null,
          });
          this.state.productCompare.itemList.push({
            key: 3,
            attrName: '保障地区',
            name1: this.state.compareInfo.itemList[0].securityArea,
            name2: this.state.compareInfo.itemList[1].securityArea,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].securityArea:null,
          });
          //自付选项
          this.state.productCompare.itemList.push({
            key: 4,
            attrName: '自付选项',
            name1: this.state.compareInfo.itemList[0].selyPay,
            name2: this.state.compareInfo.itemList[1].selyPay,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].selyPay:null,
          });
        } else {
          //缴费年期
          this.state.productCompare.itemList.push({
            key: 2,
            attrName: '缴费年期',
            name1: this.state.compareInfo.itemList[0].productionAgeLimit,
            name2: this.state.compareInfo.itemList[1].productionAgeLimit,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].productionAgeLimit:null,
          });
          //缴费方式
          this.state.productCompare.itemList.push({
            key: 3,
            attrName: '缴费方式',
            name1: this.state.compareInfo.itemList[0].paymentMethodMeaning,
            name2: this.state.compareInfo.itemList[1].paymentMethodMeaning,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].paymentMethodMeaning:null,
          });
        }
        //保费测算
        premiumMeasureYear.key = 0;
        this.state.productCompare.premiumMeasureList.push(premiumMeasureYear);
        premiumMeasureTotal.key = 1;
        this.state.productCompare.premiumMeasureList.push(premiumMeasureTotal);
        //保障利益
        securityPlan30.key = 0;
        this.state.productCompare.securityPlanList.push(securityPlan30);
        securityPlan40.key = 1;
        this.state.productCompare.securityPlanList.push(securityPlan40);
        securityPlan50.key = 2;
        this.state.productCompare.securityPlanList.push(securityPlan50);
        securityPlan60.key = 3;
        this.state.productCompare.securityPlanList.push(securityPlan60);
        this.setState({
          productCompare: this.state.productCompare,
          column1: this.state.columns1,
          column2: this.state.columns2,
        });
      } else {
        TipModal.error({content:data.message});
        return;
      }
    });
  }
  render () {
    return (
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Row style={{textAlign: 'center', fontSize: '1.5em', fontWeight: 'bold'}}>
            产品比较
          </Row>
          <Row style={{margin: '28px 0px'}}>
            <Table dataSource={this.state.productCompare.itemList}
                   columns={this.state.columns1} showHeader={false}
                   pagination={false} rowKey="key" />
          </Row>
          <Row>
            <Row style={{padding:'0px 12px'}}>
              <span className={commonStyles.iconL}></span>
              <span className={commonStyles.iconR}>保费测算</span>
            </Row>
            <Row style={{margin: '28px 0px'}}>
              <Table dataSource={this.state.productCompare.premiumMeasureList}
                     columns={this.state.columns2} showHeader={false}
                     pagination={false} rowKey="key" />
            </Row>
          </Row>
          <Row>
            <Row style={{padding:'0px 12px'}}>
              <span className={commonStyles.iconL}></span>
              <span className={commonStyles.iconR}>产品属性</span>
            </Row>
            <Row style={{margin: '28px 0px'}}>
              <Table dataSource={this.state.productCompare.prdItemAttrList}
                     columns={this.state.columns2} showHeader={false}
                     pagination={false} rowKey="key" />
            </Row>
          </Row>
          <Row>
            <Row style={{padding:'0px 12px'}}>
              <span className={commonStyles.iconL}></span>
              <span className={commonStyles.iconR}>保障利益</span>
            </Row>
            <Row style={{margin: '28px 0px'}}>
              <Table dataSource={this.state.productCompare.securityPlanList}
                     columns={this.state.columns3} rowKey="key" pagination={false} />
            </Row>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default (ProductionCompareRadar);
