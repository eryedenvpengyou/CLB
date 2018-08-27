import React from 'react';
import { connect } from 'dva';
import { stringify } from 'qs';
import { Row, Col, Button, Icon, Table, Tabs, Radio } from 'antd';
import ProductionReferralFee from './ProductionReferralFee';
import { getCode } from '../../services/code';
import { productionDetail, queryProductionInfo, getImageText, productionInfoDownloadTimes } from '../../services/production';
import { handleTableChange } from '../../utils/table';
import Download from '../common/Download';
import TipModal from "../common/modal/Modal";
import styles from "../../styles/production.css";
import commonStyles from '../../styles/common.css';

class ProductionDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productLineHeight: false,
      productDetail: {
        prdAttributeSetLine: [],
        prdItemPaymode: [],
      },
      pagination: {},
      dataList: [],
      imageText: [],
      //快码值
      codeList: {
        currencyList: [],
      }
    };
  }
  componentWillMount() {
    const detailBody = {
      itemId: this.props.itemId
    };
    productionDetail(detailBody).then((detailData) => {
      if (detailData.success) {
        detailData.rows[0].prdAttributeSetLine.map((attr) => {
          if (attr.displayFlag == 'Y' && detailData.rows[0][attr.fieldCode.toLowerCase()]) {
            this.state.productLineHeight = true;
            return;
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
      const prdBody = {
        itemId: this.state.productDetail.itemId,
        type: 'ITEM'
      };
      queryProductionInfo(prdBody).then((prdData) => {
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
      //图文版块查询
      const imageTextBody = {
        itemId: this.state.productDetail.itemId
      };
      getImageText(imageTextBody).then((imageTextData) => {
        if (imageTextData.success) {
          if (imageTextData.total > 0) {
            this.setState({
              imageText: imageTextData.rows
            });
          }
        } else {
          TipModal.error({content:imageTextData.message});
          return;
        }
      });
    });
    //获取快码值
    const codeBody = {
      currencyList: 'PUB.CURRENCY',
    };
    getCode(codeBody).then((data)=>{
      this.setState({
        codeList: data
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
      return (
        record.lineId?
        <a
          onClick = {() =>{
            productionInfoDownloadTimes({lineId:record.lineId}).then((data)=>{
              if(!data.success){
                TipModal.error({ content: '下载次数记录异常' });
                return;
              }else{
                window.location.href = record.filePath
              }
            })
          }}
        >
          <span>
            <Icon type="download" style={{ fontSize: '36px', color: '#d1b97f' }} />
          </span>
        </a>:
        <a>
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
    var productHeightLine = 0;
    return (
      <div className={styles.productDetail}>
        <Row style={{borderBottom: '12px solid #efefef'}}>
          <Col xs={18} sm={18} md={18} lg={18} xl={18} id="top_col1">
            <Row style={{borderBottom: '2px solid #efefef', padding: '20px 36px 20px 16px'}}>
              <Col>
                <span className={styles.product_name}>
                  {this.state.productDetail.itemName}
                </span>
              </Col>
            </Row>
            <Row style={{padding: '20px 36px 20px 16px', fontSize: '16px'}}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                预期收益率：{this.state.productDetail.attribute41}
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                投资期限：{this.state.productDetail.attribute42}
              </Col>
            </Row>
            <Row style={{padding: '0px 36px 20px 16px', fontSize: '16px'}}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                开售预期：{this.state.productDetail.attribute46}
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                起息日期：{this.state.productDetail.attribute45}
              </Col>
            </Row>
            <Row style={{padding: '0px 36px 20px 16px', fontSize: '16px'}}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                起投金额：{this.state.productDetail.attribute43}
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
                    })
                  })
                }
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                增加金额：{this.state.productDetail.attribute44}
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
                    })
                  })
                }
              </Col>
            </Row>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} xl={6} id="top_col2" style={{padding: '20px'}}>
            <div style={{margin:"0 auto",width:"100%"}}>
            <Row style={{ marginTop: '0px' }}>
              <Button type="primary" className={commonStyles.btnPrimary} style={{width:'230px',height:'60px',fontSize:'26px',fontWeight:'normal'}} onClick={()=>window.open("https://invest.meixinglobal.com/product/product_list.html?partner_id=CLBSZ0000&third_party_id=768","_blank")}>
                立即预约
              </Button>
            </Row>
            {
              JSON.parse(localStorage.user).userType == "ADMINISTRATION" ? ""
              :
              <Row style={{ marginTop: '27px' }}>
                <ProductionReferralFee bigClass="JJ" itemName={this.state.productDetail.itemName} itemSupplierName={this.state.productDetail.supplierName} itemId={this.props.itemId}>
                  <Button type="default" className={commonStyles.btnDefault} style={{width:'230px',height:'60px',fontSize:'26px',fontWeight:'normal'}}>
                    查看转介费
                  </Button>
                </ProductionReferralFee>
              </Row>
            }
            </div>
          </Col>
        </Row>
        <Row>
          <Row style={{borderTop:'2px solid #efefef',padding:'28px 14px 28px 12px'}}>
            <span className={commonStyles.iconL}></span>
            <span className={commonStyles.iconR}>产品简介</span>
          </Row>
          <Row id='imageText' style={{borderTop:'2px solid #efefef',padding:'28px 14px 28px 12px'}}>
          {
            this.state.imageText.map((imageText, index) => {
              if (!document.getElementById('imageText_none')) {
                let ele = document.createElement('div');
                ele.setAttribute('id','imageText_none');
                ele.style.display = 'none';
                document.getElementById('imageText').appendChild(ele);
              }
              document.getElementById('imageText_none').innerHTML = imageText.imageText;
              return (
                <div key={index} className={styles.imageText}
                      dangerouslySetInnerHTML={{__html: document.getElementById('imageText_none').innerText}} />
              )
            })
          }
          </Row>
        </Row>
        <Row>
          <Row style={{borderTop:'2px solid #efefef',padding:'28px 14px 28px 12px'}}>
            <span className={commonStyles.iconL}></span>
            <span className={commonStyles.iconR}>产品资料</span>
          </Row>
          <Row style={{borderTop: '2px solid #efefef', padding: '28px 14px 28px 12px'}}>
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
