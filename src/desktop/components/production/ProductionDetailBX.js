/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { connect } from 'dva';
import { stringify } from 'qs';
import { Row, Col, Button, Icon, Table, Select, Form, InputNumber } from 'antd';
import ProductionReferralFee from './ProductionReferralFee';
import { getCode } from '../../services/code';
import { productionDetail, getPrdPremium, queryPlanLibrary, queryProductionInfo, productionInfoDownloadTimes } from '../../services/production';
import { person,planCount } from '../../services/plan';
import Download from '../common/Download';
import TipModal from "../common/modal/Modal";
import styles from "../../styles/production.css";
import commonStyles from '../../styles/common.css';
import moment from 'moment';

class ProductionDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      productDetail: {
        //产品属性
        prdAttributeSetLine: [],
        //缴费方式
        prdItemPaymode: [],
        //保障计划
        prdItemSecurityPlan: [],
        //自付选项
        prdItemSelfpayList: [],
        //子产品
        prdItemSublineList: [],
        //优惠信息
        prdDiscountList: [],
      },
      //缴费方式下拉数据
      payMethodOptions: [],
      prdPagination: {},
      planLibraryPagination: {},
      productData: [],
      planLibraryData: [],
      //快码值
      codeList: {
        genderList: [],
        payMethodList: [],
        currencyList: [],
        smokeFlagList: [],
      },
      //计划书额度
      planAm:''
    };
  }
  componentWillMount() {
    const detailBody = {
      itemId: this.props.itemId
    };
    productionDetail(detailBody).then((detailData) => {
      if (detailData.success) {
        //缴费方式
        if (detailData.rows[0].fullyear == "Y") {
          this.state.payMethodOptions.push(<Select.Option key="WP">整付</Select.Option>);
        }
        if (detailData.rows[0].oneyear == "Y") {
          this.state.payMethodOptions.push(<Select.Option key="AP">年缴</Select.Option>);
        }
        if (detailData.rows[0].halfyear == "Y") {
          this.state.payMethodOptions.push(<Select.Option key="SAP">半年缴</Select.Option>);
        }
        if (detailData.rows[0].quarter == "Y") {
          this.state.payMethodOptions.push(<Select.Option key="QP">季缴</Select.Option>);
        }
        if (detailData.rows[0].onemonth == "Y") {
          this.state.payMethodOptions.push(<Select.Option key="MP">月缴</Select.Option>);
        }
        if (detailData.rows[0].prepayFlag == "Y") {
          this.state.payMethodOptions.push(<Select.Option key="FJ">预缴</Select.Option>);
        }
        if (detailData.rows[0].midClass == 'FJX') {
          this.state.disabled = true;
        }
        this.setState({
          productDetail: detailData.rows[0],
          payMethodOptions: this.state.payMethodOptions,
          disabled: this.state.disabled,
        },() => {
          this.state.productDetail.prdDiscountList.map((discount,index) => {
            if (discount.noticeId) {
              if (!document.getElementById('topDiscount_none')) {
                let ele = document.createElement('div');
                ele.setAttribute('id','topDiscount_none');
                ele.style.display = 'none';
                document.getElementById('discount').appendChild(ele);
              }
              discount.noticeContent = discount.noticeContent.replace(/&nbsp;/ig, "");
              document.getElementById('topDiscount_none').innerHTML = discount.noticeContent;
              discount.noticeContent = document.getElementById('topDiscount_none').innerText;
            }
          });
        });
        //产品资料查询
        const prdBody = {
          itemId: this.state.productDetail.itemId,
          page: 1,
          pagesize: 10,
        };
        queryProductionInfo(prdBody).then((prdData) => {
          if (prdData.success) {
            const pagination = {};
            pagination.current = 1;
            pagination.pagesize = 10;
            pagination.total = prdData.total;
            for (var i=0; i<prdData.rows.length; i++) {
              prdData.rows[i].key = i+1;
            }
            this.setState({
              productData: prdData.rows,
              prdPagination: pagination,
            });
          } else {
            TipModal.error({content:prdData.message});
            return;
          }
        });
        //计划书资料库查询
        this.state.planLibraryBody = {
          itemCode: this.state.productDetail.itemCode,
          type: '',
        };
        queryPlanLibrary(this.state.planLibraryBody).then((planLibraryData) => {
          if (planLibraryData.success) {
            const pagination = {};
            pagination.current = 1;
            pagination.pagesize = 10;
            pagination.total = planLibraryData.total;
            for (var i=0; i<planLibraryData.rows.length; i++) {
              planLibraryData.rows[i].key = i+1;
            }
            this.setState({
              planLibraryData: planLibraryData.rows,
              planLibraryPagination: pagination,
              planLibraryBody: this.state.planLibraryBody
            });
          } else {
            TipModal.error({content:planLibraryData.message});
            return;
          }
        });
        //获取快码值
        const codeBody = {
          genderList: 'HR.EMPLOYEE_GENDER',
          smokeFlagList: 'SYS.YES_NO',
          payMethodList: 'CMN.PAY_METHOD',
          currencyList: 'PUB.CURRENCY',
        };
        getCode(codeBody).then((codeData)=>{
          this.setState({
            codeList: codeData
          });
        });
      } else {
        TipModal.error({content:detailData.message});
        return;
      }
    });
    
    person({userId: JSON.parse(localStorage.user).userId}).then((data) =>{
      if (data.success) {
        this.setState({planAm:data.rows})
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
  //出计划书
  planApply() {
    //个人额度查询
    if (JSON.parse(localStorage.user).userType == "ADMINISTRATION") {
      location.hash='/plan/PlanApply/apply/'+this.state.productDetail.supplierId+'/'+this.state.productDetail.itemId;
    } else {
      if (this.state.planAm[0].avilAmount > 0) {
        location.hash='/plan/PlanApply/apply/'+this.state.productDetail.supplierId+'/'+this.state.productDetail.itemId;
      } else {
        planCount().then((data) => {
          TipModal.error({
            content: <div><font>计划书额度不够！</font>
              <br /><font>友情提示：保单签单时可扩增计划书额度，1张签单={data}份计划书</font></div>
          });
          return;
        })
      }
    }
  }
  //计算文件大小
  calcFileSize = (value, type) => {
    const weight = [{ type: 'B', weight: 0 }, { type: 'KB', weight: 1 }, { type: 'MB', weight: 0 }, { type: 'GB', weight: 4 }];
    let v = 0;
    let count = 0;
    const result = {};
    let w = 0;
    weight.map((n) => {
      if (n.type === type) {
        w = n.weight;
      }
    });
    result.value = value;
    result.type = type;
    if (value >= 1024) {
      v = value / 1024;
      count += 1;
      result.type = weight[w + 1].type;
    }
    if (count > 0 && v >= 1024) {
      const vl = this.calcFileSize(v, result.type);
      v = vl.value;
      result.type = vl.type;
    }
    result.value = v;
    return result;
  }
  componentDidMount() {
    setTimeout(()=>{
      if (document.getElementById("top_col1").offsetHeight >= document.getElementById("top_col2").offsetHeight) {
        document.getElementById("top_col1").style.borderRight = "12px solid #efefef";
      } else {
        document.getElementById("top_col2").style.borderLeft = "12px solid #efefef";
      }
    },1000);
  }
  handlePrdTableChange(pagination, filters, sorter) {
    //产品资料查询
    const prdBody = {
      itemId: this.state.productDetail.itemId,
      pagesize: pagination.pageSize,
      page: pagination.current,
    };
    queryProductionInfo(prdBody).then((prdData) => {
      if (prdData.success) {
        pagination.total = prdData.total;
        for (var i=0; i<prdData.rows.length; i++) {
          prdData.rows[i].key = i+1;
        }
        this.setState({
          productData: prdData.rows,
          prdPagination: pagination
        });
      } else {
        TipModal.error({content:prdData.message});
        return;
      }
    });
  }
  handlePlanLibraryTableChange(pagination, filters, sorter) {
    //计划书资料库查询
    const body = this.props.form.getFieldsValue();
    body.itemCode = this.state.productDetail.itemCode;
    body.pagesize = pagination.pageSize;
    body.page = pagination.current;
    queryPlanLibrary(body).then((data) => {
      if (data.success) {
        for (var i=0; i<data.rows.length; i++) {
          data.rows[i].key = i+1;
        }
        pagination.total = data.total;
        this.setState({
          planLibraryData: data.rows,
          planLibraryPagination: pagination,
        });
      } else {
        TipModal.error({content:data.message});
        return;
      }
    });
  }
  //计划书资料库查询
  queryPlanLibrary() {
    const body = this.props.form.getFieldsValue();
    body.itemCode = this.state.productDetail.itemCode;
    queryPlanLibrary(body).then((data) => {
      if (data.success) {
        for (var i=0; i<data.rows.length; i++) {
          data.rows[i].key = i+1;
        }
        const pagination = {};
        pagination.current = 1;
        pagination.pagesize = 10;
        pagination.total = data.total;
        this.setState({
          planLibraryData: data.rows,
          planLibraryPagination: pagination,
        });
      } else {
        TipModal.error({content:data.message});
        return;
      }
    });
  }
  downloadColumns = [
    {
      title: '下载',
      dataIndex: 'fileId',
      key: 'fileId',
      width: '5%',
      render: (text, record, index) => {
        var body = {
          "fileId": record.fileId,
          "access_token": localStorage.access_token
        };
        return (
          record.lineId?
          <a
            onClick = {() =>{
              window.location.href = `/api/fms/sys/attach/file/detail?${stringify(body)}`;
              productionInfoDownloadTimes({lineId:record.lineId}).then((data)=>{
                if(!data.success){
                  TipModal.error({ content: '下载次数记录异常' });
                  return;
                }
              })
            }}
          >
            <span>
              <Icon type="download" style={{ fontSize: '36px', color: '#d1b97f' }} />
            </span>
          </a>:
          <a
            onClick = {() =>{
              window.location.href = `/api/fms/sys/attach/file/detail?${stringify(body)}`;
            }}
          >
            <span>
              <Icon type="download" style={{ fontSize: '36px', color: '#d1b97f' }} />
            </span>
          </a>
        );
      }
    },

    {
      title: '资料名称',
      dataIndex: 'fileName',
      key: 'fileName',
      width: '60%'
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: '10%',
      render: (text, record, index) => {
        const sizeObj = this.calcFileSize(Number(text), 'B');
        return `${Math.round(sizeObj.value*10)/10}${sizeObj.type}`;
      }
    },
    {
      title: '更新时间',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      width: '25%',
      render: (text,record,index) => {
        return text||record.lastUpdateDate
      }
    }
  ];
  render() {
    var productHeightLine = 0;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    //根据快码值生成下拉列表
    const genderOptions = this.state.codeList.genderList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    const smokeFlagOptions = this.state.codeList.smokeFlagList.map((code) => {
      return <Select.Option key={code.value}>{code.meaning}</Select.Option>
    });
    //子产品
    var prdItemSublineList = [];
    var prdItemSublineOptions = [];
    this.state.productDetail.prdItemSublineList.map((item) => {
      if (item.enabledFlag != "N" && prdItemSublineList.indexOf(item.sublineItemName) == -1) {
        prdItemSublineList.push(item.sublineItemName);
        prdItemSublineOptions.push(<Select.Option key={item.sublineItemName}>{item.sublineItemName}</Select.Option>);
      }
    });
    //缴费币种
    var prdItemCurrencyList = [];
    var prdItemCurrencyOptions = [];
    this.state.productDetail.prdItemPaymode.map((item) => {
      this.state.codeList.currencyList.map((code) => {
        if (item.currencyCode == code.value && item.enabledFlag != "N" && prdItemCurrencyList.indexOf(code.meaning) == -1) {
          prdItemCurrencyList.push(code.meaning);
          prdItemCurrencyOptions.push(<Select.Option key={code.value}>{code.meaning}</Select.Option>);
        }
      });
    });
    //保障级别 保障区域
    var prdItemSecurityLevelList = [];
    var prdItemSecurityRegionList = [];
    var prdItemSecurityLevelOptions = [];
    var prdItemSecurityRegionOptions = [];
    this.state.productDetail.prdItemSecurityPlan.map((item) => {
      if (item.enabledFlag != "N" && prdItemSecurityLevelList.indexOf(item.securityLevel) == -1) {
        prdItemSecurityLevelList.push(item.securityLevel);
        prdItemSecurityLevelOptions.push(<Select.Option key={item.securityLevel}>{item.securityLevel}</Select.Option>);
      }
      if (item.enabledFlag != "N" && prdItemSecurityRegionList.indexOf(item.securityRegion) == -1) {
        prdItemSecurityRegionList.push(item.securityRegion);
        prdItemSecurityRegionOptions.push(<Select.Option key={item.securityRegion}>{item.securityRegion}</Select.Option>);
      }
    });
    //自付选项
    var prdItemSelfpayList = [];
    var prdItemSelfpayOptions = [];
    this.state.productDetail.prdItemSelfpayList.map((item) => {
      if (item.enabledFlag != "N" && prdItemSelfpayList.indexOf(item.selfpay) == -1) {
        prdItemSelfpayList.push(item.selfpay);
        prdItemSelfpayOptions.push(<Select.Option key={item.selfpay}>{item.selfpay}</Select.Option>);
      }
    });
    return (
      <div className={styles.productDetail}>
        <Row>
          <div style={{width:'859px',float:'left'}} id="top_col1">
            <Row style={{borderBottom: '2px solid #efefef', padding: '20px 36px 20px 16px'}}>
              <Col>
                <span  className={styles.product_name}>
                  {this.state.productDetail.itemName}
                </span>
                <span style={{float:'right'}} className={styles.product_supplier}>
                  {this.state.productDetail.supplierName}
                </span>
              </Col>
            </Row>
            <Row style={{padding: '20px 36px 20px 16px', fontSize: '16px'}}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                投保年龄：{this.state.productDetail.attribute2}-{this.state.productDetail.attribute3}岁
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                可选币种：
                {
                  this.state.productDetail.prdItemPaymode.map((item, index) => {
                    return this.state.codeList.currencyList.map((code) => {
                      if (item.currencyCode == code.value && item.enabledFlag != "N") {
                        if (index == this.state.productDetail.prdItemPaymode.length-1) {
                          return <span key={index}>{code.meaning}</span>;
                        } else {
                          return <span key={index}>{code.meaning+"、"}</span>;
                        }
                      }
                    });
                  })
                }
              </Col>
            </Row>
            <Row style={{padding: '0px 36px 20px 16px', fontSize: '16px'}}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                保障期限：{this.state.productDetail.attribute4}
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                缴费期限：
                {
                  this.state.productDetail.prdItemSublineList.map((item, index) => {
                    if (item.sublineItemName && item.enabledFlag != "N") {
                      var sublineItemName = "";
                      if (!isNaN(item.sublineItemName)) {
                        sublineItemName = item.sublineItemName + "年";
                      } else {
                        sublineItemName = item.sublineItemName;
                      }
                      if (index == this.state.productDetail.prdItemSublineList.length-1) {
                        return <span key={index}>{sublineItemName}</span>;
                      } else {
                        return <span key={index}>{sublineItemName+"、"}</span>;
                      }
                    }
                  })
                }
              </Col>
            </Row>
            {
              this.state.productDetail.prdAttributeSetLine.map((attr, index)=>{
                if (attr.displayFlag == 'Y' && this.state.productDetail[attr.fieldCode.toLowerCase()]) {
                  productHeightLine += 1;
                  if (productHeightLine == 1) {
                    return (
                      <div key={index}>
                        <Row style={{padding: '10px 36px 20px 16px', fontSize: '16px'}}>
                          产品亮点
                        </Row>
                        <Row style={{padding: '0px 36px 20px 16px', fontSize: '16px'}}>
                          {attr.attName}：{this.state.productDetail[attr.fieldCode.toLowerCase()]}
                        </Row>
                      </div>
                    )
                  } else {
                    return (
                      <Row key={index} style={{padding: '0px 36px 20px 16px', fontSize: '16px'}}>
                        {attr.attName}：{this.state.productDetail[attr.fieldCode.toLowerCase()]}
                      </Row>
                    )
                  }
                }
              })
            }
          </div>
          <div id="top_col2" style={{width:'317px',padding: "58px 37px",float:'left'}}>
            <div style={{margin:"0 auto",width:"100%"}}>
              <Row>
                <Button type="primary" disabled={this.state.disabled} onClick={this.planApply.bind(this)} className={commonStyles.btnPrimary} style={{width:'230px',height:'60px',fontSize:'26px',fontWeight:'normal'}}>出计划书</Button>
              </Row>

              <Row style={{ marginTop: '27px' }}>
                <Button type="default" disabled={this.state.disabled} className={commonStyles.btnDefault} onClick={this.premiumMeasures.bind(this, this.state.productDetail.midClass, this.state.productDetail.minClass, this.state.productDetail.itemId)} style={{ width: '230px', height: '60px', fontSize: '26px', fontWeight: 'normal' }}>保费测算</Button>
              </Row>
              {
                JSON.parse(localStorage.user).userType == "ADMINISTRATION" ? ""
                :
                <Row style={{marginTop:'27px',fontSize:'20px'}}>
                  <ProductionReferralFee bigClass="BX" itemName={this.state.productDetail.itemName} itemSupplierName={this.state.productDetail.supplierName} itemId={this.props.itemId}>
                    <a>
                      <Icon type="search" style={{color:'#d1b97f'}} /> 转介费查询
                    </a>
                  </ProductionReferralFee>
                </Row>
              }
              <Row style={{marginTop:'27px',fontSize:'20px'}}>
                <a href={'/#/classroom/datum'}>
                  <Icon type="download" style={{color:'#d1b97f'}}/> 培训资料下载
                </a>
              </Row>
              <Row style={{ marginTop: '27px',fontSize: '20px' }}>
                <a href='/#/classroom/business'>
                  <Icon type="solution" style={{ color: '#d1b97f' }}/> 预约培训/见客/会销
                </a>
              </Row>
            </div>
          </div>
        </Row>
        {//优惠信息
          this.state.productDetail.prdDiscountList.length > 0 ?
            <Row id="discount">
              <Row style={{borderTop:'12px solid #efefef',padding:'28px 14px 28px 12px'}}>
                <span className={commonStyles.iconL}></span>
                <span className={commonStyles.iconR}>最新优惠</span>
              </Row>
              <Row id="discount" style={{borderTop:'2px solid #efefef', padding:'28px 14px 28px 12px'}}>
                {
                  this.state.productDetail.prdDiscountList.map((discount,index) => {
                    if (discount.noticeId) {
                      if (discount.noticeContent.length == 0) {
                        return (
                          <Row key={index} style={{paddingBottom:'18px'}}>
                            <Row style={{fontSize:'20px'}}>
                              <span className={commonStyles.iconCircle}></span>
                              <a href={"/#/classroom/reviewDetail/announcement/"+discount.noticeId}>{discount.content}</a>
                              <span style={{float:'right',fontSize:'14px',color:'#9f9f9f'}}>{"发布时间："+moment(discount.releaseDate,"YYYY/MM/DD").format("YYYY/MM/DD")}</span>
                            </Row>
                          </Row>
                        )
                      } else {
                        return (
                          <Row key={index} style={{paddingBottom:'18px'}}>
                            <Row style={{fontSize:'20px'}}>
                              <span className={commonStyles.iconCircle}></span>
                              <a href={"/#/classroom/reviewDetail/announcement/"+discount.noticeId}>{discount.content}</a>
                              <span style={{float:'right',fontSize:'14px',color:'#9f9f9f'}}>{"发布时间："+moment(discount.releaseDate,"YYYY/MM/DD").format("YYYY/MM/DD")}</span>
                            </Row>
                            <Row style={{paddingLeft:'20px',paddingTop:'10px',fontSize:'14px',color:'#9f9f9f'}}>
                              <div style={{width:800, textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>
                                {discount.noticeContent}
                              </div>
                            </Row>
                          </Row>
                        )
                      }
                    }
                  })
                }
              </Row>
            </Row>
            :
            ""
        }
        <Row>
          <Row style={{borderTop:'12px solid #efefef',padding:'28px 14px 28px 12px'}}>
            <span className={commonStyles.iconL}></span>
            <span className={commonStyles.iconR}>产品资料下载</span>
            <Button disabled={this.state.productDetail.supplierId?false:true} onClick={()=>location.hash="/database/commonData/FWBG/"+this.state.productDetail.supplierId} type="default" className={commonStyles.btnDefault} style={{width:'264px',height:'40px',borderColor:'#000',fontSize:'21px',float:'right',fontWeight:'normal'}}>
              保险公司通用表格下载
            </Button>
          </Row>
          <Row style={{borderTop:'2px solid #efefef', padding:'28px 14px 28px 12px',fontWeight:'bold'}}>
            <Table bordered rowKey="key"
                   pagination={this.state.prdPagination}
                   onChange={this.handlePrdTableChange.bind(this)}
                   dataSource={this.state.productData}
                   columns={this.downloadColumns} />
          </Row>
        </Row>
        <Row>
          <Row style={{borderTop:'12px solid #efefef',padding:'28px 14px 28px 12px'}}>
            <span className={commonStyles.iconL}></span>
            <span className={commonStyles.iconR}>计划书资料库</span>
          </Row>
          <Row style={{borderTop: '2px solid #efefef', padding: '28px 14px 28px 12px', fontWeight: 'bold'}}>
            <Form layout="inline" style={{marginBottom: '28px'}}>
              <Form.Item style={{padding:"5px 0px"}}>
                {getFieldDecorator('sublineItemName', {})(
                  <Select placeholder="年期" style={{width:'145px',fontSize:'15px'}} allowClear>
                    {prdItemSublineOptions}
                  </Select>
                )}
              </Form.Item>
              <Form.Item style={{padding:"5px 0px"}}>
                {getFieldDecorator('gender', {})(
                  <Select placeholder="性别" style={{width:'80px',fontSize:'15px'}} allowClear>
                    {genderOptions}
                  </Select>
                )}
              </Form.Item>
              <Form.Item style={{padding:"5px 0px"}}>
                {getFieldDecorator('age', {})(
                  <Select placeholder="年龄范围" style={{width:'100px',fontSize:'15px'}} allowClear>
                    <Select.Option value="0015">0-15岁</Select.Option>
                    <Select.Option value="1630">16-30岁</Select.Option>
                    <Select.Option value="3145">31-45岁</Select.Option>
                    <Select.Option value="4661">46-61岁</Select.Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item style={{padding:"5px 0px"}}>
                {getFieldDecorator('smokeFlag', {})(
                  <Select placeholder="是否吸烟" style={{width:'100px',fontSize:'15px'}} allowClear>
                    {smokeFlagOptions}
                  </Select>
                )}
              </Form.Item>
              <Form.Item style={{padding:"5px 0px"}}>
                {getFieldDecorator('payMethod', {})(
                  <Select placeholder="缴费方式" style={{width:'100px',fontSize:'15px'}} allowClear>
                    {this.state.payMethodOptions}
                  </Select>
                )}
              </Form.Item>
              {
                this.state.productDetail.minClass == "GD" ?
                  <span>
                    <Form.Item style={{padding:"5px 0px"}}>
                      {getFieldDecorator('currency', {})(
                        <Select placeholder="缴费币种" style={{width:'100px',fontSize:'15px'}} allowClear>
                          {prdItemCurrencyOptions}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item style={{padding:"5px 0px"}}>
                      {getFieldDecorator('securityLevel', {})(
                        <Select placeholder="保障级别" style={{width:'100px',fontSize:'15px'}} allowClear>
                          {prdItemSecurityLevelOptions}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item style={{padding:"5px 0px"}}>
                      {getFieldDecorator('securityArea', {})(
                        <Select placeholder="保障地区" style={{width:'165px',fontSize:'15px'}} allowClear>
                          {prdItemSecurityRegionOptions}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item style={{padding:"5px 0px"}}>
                      {getFieldDecorator('selfpay', {})(
                        <Select placeholder="自付选项" style={{width:'165px',fontSize:'15px'}} allowClear>
                          {prdItemSelfpayOptions}
                        </Select>
                      )}
                    </Form.Item>
                  </span>
                  :
                  <span>
                    <Form.Item style={{padding:"5px 0px"}}>
                      {getFieldDecorator('type', {
                        initialValue: "premium",
                      })(
                        <Select style={{width:'80px',fontSize:'15px'}} allowClear>
                          <Select.Option value="premium">保费</Select.Option>
                          <Select.Option value="amount">保额</Select.Option>
                        </Select>
                      )}
                    </Form.Item>
                    {
                      getFieldValue("type") == "premium" ?
                        <span>
                          <Form.Item style={{padding:"5px 0px"}}>
                            {getFieldDecorator('premiumStart', {})(
                              <InputNumber style={{width:'80px',fontSize:'15px'}} min={0} />
                            )}
                            -
                          </Form.Item>
                          <Form.Item style={{padding:"5px 0px"}}>
                            {getFieldDecorator('premiumEnd', {})(
                              <InputNumber style={{width:'80px',fontSize:'15px'}}  min={0} />
                            )}
                          </Form.Item>
                        </span>
                        :
                        <span>
                          <Form.Item style={{padding:"5px 0px"}}>
                            {getFieldDecorator('amountStart', {})(
                              <InputNumber style={{width:'80px',fontSize:'15px'}} min={0} />
                            )}
                            -
                          </Form.Item>
                          <Form.Item style={{padding:"5px 0px"}}>
                            {getFieldDecorator('amountEnd', {})(
                              <InputNumber style={{width:'80px',fontSize:'15px'}}  min={0} />
                            )}
                          </Form.Item>
                        </span>
                    }
                  </span>
              }
              <Form.Item style={{padding:"5px 0px",float:'right'}}>
                <Button type="primary" style={{width:'68px',fontSize:'15px'}} className={commonStyles.btnPrimary} onClick={this.queryPlanLibrary.bind(this)}>
                  查找
                </Button>
              </Form.Item>
            </Form>
            <div style={{clear:'both'}}>
              <Table bordered rowkey="key" onChange={this.handlePlanLibraryTableChange.bind(this)}
                     pagination={this.state.planLibraryPagination}
                     dataSource={this.state.planLibraryData}
                     columns={this.downloadColumns} />
            </div>
          </Row>
        </Row>
      </div>
    );
  }
}

export default connect(({production})=>({
  production
}))(Form.create()(ProductionDetailComponent));
