/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { connect } from 'dva';
import { stringify } from 'qs';
import { Row, Col, Button, Icon, Table } from 'antd';
import { handleTableChange } from '../../utils/table';
import ProductionReferralFee from './ProductionReferralFee';
import { getCode } from '../../services/code';
import { productionDetail, queryProductionInfo, productionInfoDownloadTimes } from '../../services/production';
import Download from '../common/Download';
import TipModal from "../common/modal/Modal";
import styles from "../../styles/production.css";
import commonStyles from '../../styles/common.css';

class ProductionDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productDetail: {
        //产品属性
        prdAttributeSetLine: [],
        //子产品
        prdItemSublineList: [],
      },
      pagination: {},
      dataList: [],
      //产品资料查询body
      prdBody: {},
      //快码值
      codeList: {
        genderList: [],
        payMethodList: [],
        currencyList: [],
        smokeFlagList: [],
        dividendCycle: []
      }
    };
  }
  componentWillMount() {
    //获取快码值
    const codeBody = {
      genderList: 'HR.EMPLOYEE_GENDER',
      smokeFlagList: 'SYS.YES_NO',
      payMethodList: 'CMN.PAY_METHOD',
      currencyList: 'PUB.CURRENCY',
      dividendCycle: 'PRD.INTEREST PERIOD',
    };
    getCode(codeBody).then((codeData)=>{
      this.state.codeList = codeData;
      const detailBody = {
        itemId: this.props.itemId
      };
      productionDetail(detailBody).then((detailData) => {
        if (detailData.success) {
          //派息周期
          this.state.codeList.dividendCycle.map((code) => {
            if (code.value == detailData.rows[0].attribute53) {
              detailData.rows[0].dividendCycle = code.meaning;
            }
          });
          this.setState({
            productDetail: detailData.rows[0]
          });
        } else {
          TipModal.error({content:detailData.message});
          return;
        }
        //产品资料查询
        this.state.prdBody = {
          itemId: this.state.productDetail.itemId,
          type: 'ITEM'
        };
        queryProductionInfo(this.state.prdBody).then((prdData) => {
          if (prdData.success) {
            const pagination = this.state.pagination;
            pagination.total = prdData.total;
            prdData.rows.map((row, index) => {
              row.key = index;
            });
            this.setState({
              dataList: prdData.rows,
              pagination
            });
          } else {
            TipModal.error({content:prdData.message});
            return;
          }
        });
      });
    });
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
  downloadColumns = [{
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
    width: '50%',
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
    width: '20%',
    render: (text,record,index) => {
      return text||record.lastUpdateDate
    }
  }];
  subscribe() {
    location.hash = '/production/subscribe/ZQ/ZQ/'+this.state.productDetail.itemId;
  }
  componentDidMount() {
    setTimeout(()=>{
      if (document.getElementById("top_col1").offsetHeight >= document.getElementById("top_col2").offsetHeight) {
        document.getElementById("top_col1").style.borderRight = "12px solid #efefef";
      } else {
        document.getElementById("top_col2").style.borderLeft = "12px solid #efefef";
      }
    },500);
  }
  render() {
    return (
      <div className={styles.productDetail}>
        <Row>
          <Col xs={18} sm={18} md={18} lg={18} xl={18} id="top_col1">
            <Row style={{borderBottom: '2px solid #efefef', padding: '20px 36px 20px 16px'}}>
              <Col>
                <span className={styles.product_name}>
                  {this.state.productDetail.itemName}
                </span>
                <span style={{float:'right'}} className={styles.product_code}>
                 （股票代码：{this.state.productDetail.attribute50}）
                </span>
              </Col>
            </Row>
            <Row style={{padding: '20px 36px 20px 16px', fontSize: '16px'}}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                债券年期：
                {
                  this.state.productDetail.prdItemSublineList.map((item, index) => {
                    if (item.enabledFlag != "N") {
                      if (index == this.state.productDetail.prdItemSublineList.length-1) {
                        return <span key={index}>{item.sublineItemName}</span>;
                      } else {
                        return <span key={index}>{item.sublineItemName+"、"}</span>;
                      }
                    }
                  })
                }
              </Col>
            </Row>
            <Row style={{padding: '0px 36px 20px 16px', fontSize: '16px'}}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                市值：{this.state.productDetail.attribute54}
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                年利息：{this.state.productDetail.attribute52}
              </Col>
            </Row>
            <Row style={{padding: '0px 36px 20px 16px', fontSize: '16px'}}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                派息周期：{this.state.productDetail.dividendCycle}
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                派息日期：{this.state.productDetail.attribute36}
              </Col>
            </Row>
            <Row style={{padding: '0px 36px 20px 16px', fontSize: '16px'}}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                认购费：{this.state.productDetail.attribute56}
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                托管费：{this.state.productDetail.attribute55}
              </Col>
            </Row>
            <Row style={{padding: '0px 36px 20px 16px', fontSize: '16px'}}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                负债比率：{this.state.productDetail.attribute59}
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                除税后及股息后盈利：{this.state.productDetail.attribute60}
              </Col>
            </Row>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} xl={6} id="top_col2" style={{padding: '20px'}}>
            <div style={{margin:"0 auto",width:"100%"}}>
            <Row style={{ marginTop: '0px' }}>
              <Button type="primary" className={commonStyles.btnPrimary} onClick={this.subscribe.bind(this)} style={{width:'230px',height:'60px',fontSize:'26px',fontWeight:'normal'}}>立即预约</Button>
            </Row>
            {
              JSON.parse(localStorage.user).userType == "ADMINISTRATION" ? ""
              :
              <Row style={{marginTop: '27px'}}>
                <ProductionReferralFee bigClass="ZQ" itemName={this.state.productDetail.itemName} itemSupplierName={this.state.productDetail.supplierName} itemId={this.props.itemId}>
                  <Button type="default" className={commonStyles.btnDefault} style={{width:'230px',height:'60px',fontSize:'26px',fontWeight:'normal'}}>
                    查看转介费
                  </Button>
                </ProductionReferralFee>
              </Row>
            }
            <Row style={{ marginTop: '27px',fontSize: '20px' }}>
              <a href={'/#/classroom/datum'}>
                <Icon type="download" style={{ color: '#d1b97f' }}/> 培训资料下载
              </a>
            </Row>
            <Row style={{ marginTop: '27px',fontSize: '20px' }}>
              <a href={'/#/classroom/business'}>
                <Icon type="solution" style={{ color: '#d1b97f' }}/> 预约培训/见客/会销
              </a>
            </Row>
            </div>
          </Col>
        </Row>
        {/* <Row>
          <Row style={{borderTop:'12px solid #efefef',padding:'28px 14px 28px 12px'}}>
            <span className={commonStyles.iconL}></span>
            <span className={commonStyles.iconR}>产品亮点</span>
          </Row>
          <Row style={{borderTop: '2px solid #efefef', padding: '28px 14px 28px 12px'}}>
            {
              this.state.productDetail.prdAttributeSetLine.map((attr, index)=>{
                if (attr.displayFlag == 'Y' && this.state.productDetail[attr.fieldCode.toLowerCase()]) {
                  return (
                    <Row key={index} style={{padding: '0px 36px 20px 16px', fontSize: '16px'}}>
                      {this.state.productDetail[attr.fieldCode.toLowerCase()]}
                    </Row>
                  )
                }
              })
            }
          </Row>
        </Row> */}
        <Row>
          <Row style={{borderTop:'12px solid #efefef',padding:'28px 14px 28px 12px'}}>
            <span className={commonStyles.iconL}></span>
            <span className={commonStyles.iconR}>产品资料下载</span>
            {/*<Button type="default" className={commonStyles.btnDefault} style={{width:'264px',height:'40px',float:'right'}}>保险公司通用表格下载</Button>*/}
          </Row>
          <Row style={{borderTop: '2px solid #efefef', padding: '28px 14px 28px 12px', fontWeight: 'bold'}}>
            <Table bordered rowKey="key"
                   pagination={this.state.pagination}
                   dataSource={this.state.dataList}
                   columns={this.downloadColumns}
                   onChange={handleTableChange.bind(this, queryProductionInfo, this.state.prdBody)} />
          </Row>
        </Row>
      </div>
    );
  }
}

export default connect(({production})=>({
  production
}))(ProductionDetailComponent);
