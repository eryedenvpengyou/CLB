/**
 * wanjun.feng@hand-china.com
 * 2017/6/7
 */

import React from 'react';
import { connect } from 'dva';
import { stringify } from 'qs';
import { Row, Col, Button, Table, Icon } from 'antd';
import { handleTableChange } from '../../utils/table';
import { productionDetail, queryProductionInfo, getImageText, productionInfoDownloadTimes } from '../../services/production';
import { PICTURE_ADDRESS } from '../../constants';
import Download from '../common/Download';
import TipModal from "../common/modal/Modal";
import styles from "../../styles/production.css";
import commonStyles from '../../styles/common.css';
import showImg from "../../styles/images/production/product_show_img.jpg";

class ProductionDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productDetail: {
        prdAttributeSetLine: [],
        prdItemSublineList: [],
      },
      pagination: {},
      dataList: [],
      imageText: [],
      //产品资料查询body
      prdBody: {},
    };
  }
  numberFlag = false;
  description = "";
  priceDescription = '免费';
  componentWillMount() {
    const detailBody = {
      itemId: this.props.itemId
    };
    productionDetail(detailBody).then((detailData) => {
      if (detailData.success) {
        let _record = [];
        let priceDescript = '免费';
        detailData.rows[0].prdItemSublineList.map((item, index) => {
          if (!isNaN(item.price)) {
            this.numberFlag = detailData.rows[0].midClass !== "HPV"
          } else {
            this.priceDescription = item.price;
          }
          if (item.price && !isNaN(item.price) && _record.indexOf(item.price) == -1) {
            _record.push(item.price);
          }
        });
        if (detailData.rows[0].midClass === "HPV") {
          this.description = "";
          this.priceDescription = '以最终报价为准'
        } else if (detailData.rows[0].midClass === "JDYD") {
          this.priceDescription = Math.min.apply(null, detailData.rows[0].prdItemSublineList.map(i=>parseFloat(i.price))) + '起'
        }
        detailData.rows[0].prdItemSublineList = _record;
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
      //产品说明查询
      const imageTextBody = {
        itemId: this.state.productDetail.itemId
      };
      getImageText(imageTextBody).then((imageTextData) => {
        if (imageTextData.success) {
          this.setState({
            imageText: imageTextData.rows
          });
        } else {
          TipModal.error({content:imageTextData.message});
          return;
        }
      });
    });
  }
  subscribe() {
    location.hash = '/production/subscribe/FW/'+(this.state.productDetail.midClass||"FW")+'/'+this.state.productDetail.itemId;
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
        document.getElementById("top_col1").style.borderRight = "1px solid #efefef";
        document.getElementById("top_col2").style.marginTop = (document.getElementById("top_col1").offsetHeight/2-30)+"px";
      } else {
        document.getElementById("top_col2").style.borderLeft = "1px solid #efefef";
      }
    },500);
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
  }];
  render() {
    return (
      <div className={styles.productDetail}>
        <Row>
          <Col id="top_col1" style={{padding: '28px 12px',width:'872px',float:'left'}}>
            <Col style={{float:'left'}}>
              <img style={{width:'300px',height:'300px'}} src={this.state.productDetail.pictureFilePath?PICTURE_ADDRESS+this.state.productDetail.pictureFilePath:showImg} alt=""/>
            </Col>
            <Col style={{float:'left',marginLeft:'32px',width:'510px'}}>
              <Row>
                <span className={styles.product_name}>
                  {this.state.productDetail.itemName}
                </span>
              </Row>
              <Row style={{marginTop:'50px',fontSize:'16px'}}>
                价格：
                {
                  this.state.productDetail.prdItemSublineList.length>0 ?
                    this.numberFlag ?
                      "￥"+Math.min.apply(null,this.state.productDetail.prdItemSublineList)+"-"+Math.max.apply(null,this.state.productDetail.prdItemSublineList)+this.description
                      :
                      this.state.productDetail.midClass === 'HPV' ? '以最终报价为准' :
                      this.state.productDetail.prdItemSublineList.map((item, index) => {
                        if (!isNaN(item)) {
                          item = "￥" + item;
                        }
                        if (this.state.productDetail.prdItemSublineList.length == index+1) {
                          return item;
                        } else {
                          return item + "、";
                        }
                      })
                    :
                    this.priceDescription
                }
              </Row>
              <Row style={{marginTop:'50px',fontSize:'16px'}}>
                <div dangerouslySetInnerHTML={{__html: (this.state.productDetail.attribute90||"").replace(/\n/g,"<br/>")}} />
              </Row>
            </Col>
          </Col>
          <Col id="top_col2" style={{textAlign:'center',width:'304px',float:'left'}}>
            <Button type="primary" className={commonStyles.btnPrimary} onClick={this.subscribe.bind(this)}  style={{width:'230px',height:'60px',fontSize:'26px',fontWeight:'normal'}}>立即预约</Button>
          </Col>
        </Row>
        <Row>
          <Row style={{borderTop:'2px solid #efefef',padding:'28px 14px 28px 12px'}}>
            <span className={commonStyles.iconL}></span>
            <span className={commonStyles.iconR}>产品说明</span>
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
            <span className={commonStyles.iconR}>产品资料下载</span>
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
