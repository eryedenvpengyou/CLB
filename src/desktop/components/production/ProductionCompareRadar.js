/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { connect } from 'dva';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/radar';
import { Row, Col, Table, Icon } from 'antd';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import { productionCompareRadar } from '../../services/production';
import TipModal from "../common/modal/Modal";

class ProductionCompareRadar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: ['#5b9ad2','#74ad4f','#ee9867'],
      compareInfo: this.props.compareInfo,
      productCompare: this.props.productCompare,
    };
  }
  componentDidMount() {
    const radar = echarts.init(document.getElementById("radarChart"));
    radar.setOption(this.props.option);
  }
  render () {
    let columns1 = [{
      dataIndex: 'attrName',
      key: 'attrName',
      className: styles.tableColumnCenter,
      width: '25%'
    },{
      dataIndex: 'name1',
      key: 'name1',
      width: '25%',
      render: (text,record,index) => {
        return <span style={{color:this.state.color[0]}}>{text}</span>;
      }
    },{
      dataIndex: 'name2',
      key: 'name2',
      width: '25%',
      render: (text,record,index) => {
        return <span style={{color:this.state.color[1]}}>{text}</span>;
      }
    }];
    let columns2 = [{
      dataIndex: 'attrName',
      key: 'attrName',
      width: '25%',
      className: styles.tableColumnCenter,
      render: (text, record, index) => {
        return text.replace("#"," - ");
      }
    },{
      dataIndex: 'detail1',
      key: 'detail1',
      width: '25%',
      render: (text,record,index) => {
        if (record.max && record.max == text) {
          return <span style={{color:this.state.color[0]}}>{text} <Icon type="arrow-up" /></span>;
        } else if (record.min && record.min == text) {
          return <span style={{color:this.state.color[0]}}>{text} <Icon type="arrow-down" /></span>;
        }
        return <span style={{color:this.state.color[0]}}>{text||"-"}</span>;
      }
    },{
      dataIndex: 'detail2',
      key: 'detail2',
      width: '25%',
      render: (text,record,index) => {
        if (record.max && record.max == text) {
          return <span style={{color:this.state.color[1]}}>{text} <Icon type="arrow-up" /></span>;
        } else if (record.min && record.min == text) {
          return <span style={{color:this.state.color[1]}}>{text} <Icon type="arrow-down" /></span>;
        }
        return <span style={{color:this.state.color[1]}}>{text||"-"}</span>;
      }
    }];
    if (this.state.compareInfo.itemList.length == 3) {
      columns1.push({
        dataIndex: 'name3',
        key: 'name3',
        width: '25%',
        render: (text,record,index) => {
          return <span style={{color:this.state.color[2]}}>{text}</span>;
        }
      });
      columns2.push({
        dataIndex: 'detail3',
        key: 'detail3',
        width: '25%',
        render: (text,record,index) => {
          if (record.max && record.max == text) {
            return <span style={{color:this.state.color[2]}}>{text} <Icon type="arrow-up" /></span>;
          } else if (record.min && record.min == text) {
            return <span style={{color:this.state.color[2]}}>{text} <Icon type="arrow-down" /></span>;
          }
          return <span style={{color:this.state.color[2]}}>{text||"-"}</span>;
        }
      });
    }
    return (
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Row style={{textAlign: 'center', fontSize: '1.5em', fontWeight: 'bold'}}>
            产品比较
          </Row>
          <Row style={{margin: '28px 0px'}}>
            <Table dataSource={this.props.productCompare.itemList}
                   columns={columns1} showHeader={false}
                   pagination={false} rowKey="key" />
          </Row>
          <Row>
            <Col xs={16} sm={16} md={16} lg={16} xl={16} offset={4} id="radarChart" style={{height: '300px'}}>
              雷达图
            </Col>
          </Row>
          <Row>
            <Row>
              <span className={commonStyles.iconL}></span>
              <span className={commonStyles.iconR}>财联邦评分</span>
            </Row>
            <Row style={{margin: '28px 0px'}}>
              <Table dataSource={this.props.productCompare.scoreList}
                     columns={columns2} showHeader={false}
                     pagination={false} rowKey="key" />
            </Row>
          </Row>
          {
            this.props.productCompare.scoreList ?
              this.props.productCompare.scoreList.map((item, index) => {
                for (var i=0; i<item.lineList.length; i++) {
                  item.lineList[i].key = i;
                }
                return (
                  <Row key={index}>
                    <Row>
                      <span className={commonStyles.iconL}></span>
                      <span className={commonStyles.iconR}>{item.attrName}</span>
                    </Row>
                    <Row style={{margin: '28px 0px'}}>
                      <Table dataSource={item.lineList}
                             showHeader={false} columns={columns2}
                             pagination={false} rowKey="key" />
                    </Row>
                  </Row>
                )
              })
              :
              ""
          }
        </Col>
      </Row>
    );
  }
}

export default (ProductionCompareRadar);
