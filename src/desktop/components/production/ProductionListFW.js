/**
 * wanjun.feng@hand-china.com
 * 2017/6/7
 */

import React from 'react';
import { Table, Button, Row, Col, Input } from 'antd';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import { productionHeaderList } from '../../services/production';
import { handleTableChange } from '../../utils/table';
import { PICTURE_ADDRESS } from '../../constants';
import TipModal from "../common/modal/Modal";
import showImg from "../../styles/images/production/product_show_img.jpg";

class ProductionShowComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      body: {
        bigClass: "FW",
        enabledFlag: 'Y',
      },
      dataList: [],
      orderBy: [],
      pagination: {}
    };
  }
  componentWillMount() {
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
          dataList: data.rows,
          pagination
        });
      } else {
        TipModal.error({content:data.message});
        return;
      }
    });
  }
  render() {
    const columns = [{
      dataIndex: 'pictureFilePath',
      key: 'pictureFilePath',
      width: '25%',
      render: (text, record, index) => {
        return (
          <img onClick={()=>location.hash = '/production/detail/FW/'+record.itemId} style={{cursor:'pointer'}} src={text?PICTURE_ADDRESS+text:showImg} alt={''} width="247px" height='236px' />
        );
      },
    }, {
      key: 'description',
      width: '50%',
      render: (text, record, index) => {
        let _record = [];
        let description = "";
        let priceDescription = "免费";
        let numberFlag = false;
        record.prdItemSublineList.map((item) => {
          if (!isNaN(item.price)) {
            numberFlag = true;
          } else {
            priceDescription = item.price;
          }
          if (item.price && !isNaN(item.price) && _record.indexOf(item.price) == -1) {
            _record.push(item.price);
          }
        });

        if (record.midClass === "HPV") {
          description = '';
          priceDescription = '以最终报价为准'
        } else if (record.midClass === "JDYD") {
          priceDescription = Math.min.apply(null, record.prdItemSublineList.map(i=>parseFloat(i.price))) + '起'
        }
        return (
          <div style={{marginTop:'18px',textAlign:'left'}}>
            <Row className={styles.product_title}>
              <span onClick={()=>location.hash = '/production/detail/FW/'+record.itemId} style={{cursor:'pointer'}} className={styles.product_name}>{record.itemName}</span>
            </Row>
            <Row className={styles.product_attribute}>
              价格：
              {
                _record.length > 0 ?
                  record.midClass === 'HPV' ? '以最终报价为准' :
                  numberFlag ?
                    "￥"+Math.min.apply(Math,_record)+"-"+Math.max.apply(Math,_record)+description
                    :
                    _record.map((item, index) => {
                      if (!isNaN(item)) {
                        item = "￥" + item;
                      }
                      if (_record.length == index+1) {
                        return item;
                      } else {
                        return item + "、";
                      }
                    })
                  :
                  priceDescription
              }
            </Row>
            <Row style={{margin:'0px'}} className={styles.product_attribute}>
              <div dangerouslySetInnerHTML={{__html: (record.attribute90||"").replace(/\n/g,"<br/>")}} />
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
              <Button type="primary" style={{width:'190px',height:'46px',fontWeight:'normal'}} className={commonStyles.btnPrimary} onClick={()=>location.hash = '/production/detail/FW/'+record.itemId}>
                查看详情
              </Button>
            </Row>
            <Row>
              <Button type="default" style={{width:'190px',height:'46px',fontWeight:'normal'}} className={commonStyles.btnDefault} onClick={()=>location.hash = '/production/subscribe/FW/'+(record.midClass||"FW")+"/"+record.itemId}>
                立即预约
              </Button>
            </Row>
          </div>
        );
      },
    }];
    return (
      <Row className={styles.productListFW}>
        <div className={styles.tab1}></div>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Table showHeader={false} columns={columns}
                 onChange={handleTableChange.bind(this,productionHeaderList,this.state.body)}
                 pagination={this.state.pagination} dataSource={this.state.dataList}/>
        </Col>
      </Row>
    );
  }
}

export default (ProductionShowComponent);
