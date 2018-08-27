/*
 * view 财课堂-业务支援
 * @author:Lijun
 * @version:20170704
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Col, Icon, Layout, Row, Spin, Table } from 'antd';
import style from '../../styles/classroom.css';
import imgPlan from '../../styles/images/icon-plan.png';
import imgApply from '../../styles/images/icon-apply.png';
import imgTalk from '../../styles/images/icon-talk.png';
import imgLecturer from '../../styles/images/icon-lecturer.png';
import imgTrainingSupport from '../../styles/images/training-support.png';
import imgMarketSupport from '../../styles/images/market-support.png';
import imgReceiveSupport from '../../styles/images/receive-support.png';

const { Content } = Layout;

class Business extends Component {
  render() {
    return (
      <Content className={`${style.content} ${style.business} ${style['background-white']}`}>
        <div className={`${style.container} ${style['business-background-1']}`}>
          <Row className={style.frame}>
            <Row className={`${style.title} ${style['text-center']}`}>
              <h1>申请支援流程</h1>
              <span>APPLICATION PROCEDURE</span>
            </Row>
            <Row className={`${style['text-center']} ${style.frame}`} style={{ marginTop: 60 }}>
              <Col className={`${style.container} ${style.box}`} xs={6} sm={6} md={6} lg={6} xl={6}>
                <img alt="提前五个工作日提交" src={imgPlan} />
              </Col>
              <Col className={`${style.container} ${style.box}`} xs={6} sm={6} md={6} lg={6} xl={6}>
                <span style={{ color: '#d0d0d0', fontSize: 49, marginTop: -20, display: 'inline-block' }}>02</span>
                <h3>沟通细节，安排讲师</h3>
              </Col>
              <Col className={`${style.container} ${style.box}`} xs={6} sm={6} md={6} lg={6} xl={6}>
                <img alt="申请通过" src={imgApply} style={{ marginLeft: 20 }} />
              </Col>
              <Col className={`${style.container} ${style.box}`} xs={6} sm={6} md={6} lg={6} xl={6}>
                <span style={{ color: '#d0d0d0', fontSize: 49, marginTop: -20, display: 'inline-block' }}>04</span>
                <h3>派遣讲师</h3>
              </Col>
            </Row>
            <Row className={`${style['text-center']}`} style={{ marginTop: 40 }}>
              <Col className={`${style.container} ${style.box}`} xs={6} sm={6} md={6} lg={6} xl={6}>
                <span style={{ color: '#d0d0d0', fontSize: 49, marginTop: -20, display: 'inline-block' }}>01</span>
                <h3>提前五个工作日提交</h3>
              </Col>
              <Col className={`${style.container} ${style.box}`} xs={6} sm={6} md={6} lg={6} xl={6}>
                <img alt="沟通细节，安排讲师" src={imgTalk} style={{ marginLeft: 20 }} />
              </Col>
              <Col className={`${style.container} ${style.box}`} xs={6} sm={6} md={6} lg={6} xl={6}>
                <span style={{ color: '#d0d0d0', fontSize: 49, marginTop: -20, display: 'inline-block' }}>03</span>
                <h3>申请通过</h3>
              </Col>
              <Col className={`${style.container} ${style.box}`} xs={6} sm={6} md={6} lg={6} xl={6}>
                <img alt="派遣讲师" src={imgLecturer} style={{ marginLeft: 65 }} />
              </Col>
            </Row>
            <Row className={`${style['text-center']}`}>
              <a href="/#/classroom/supportChargeRule" style={{ fontSize: 30, color: '#9c9c9c', textDecoration: 'underline', marginTop: 50 }}>《查看支援服务收费规则》</a>
            </Row>
          </Row>
        </div>
        <div className={`${style.container} ${style['business-background-2']}`} style={{ marginTop: 90 }}>
          <Row
            className={`${style.title} ${style['text-center']} ${style['background-white']}`}
            style={{
              padding: '8px 12px',
              width: 212,
              height: 108,
              margin: '-70px auto 0 auto',
              borderWidth:'2px',
              borderStyle:'solid',
              borderColor:JSON.parse(localStorage.theme).themeColor,
              borderRadius: '2%',
            }}
          >
            <h1>支援项目</h1>
            <span>SUPPORT PROJECT</span>
          </Row>
          <Row
            className={`${style.frame} ${style.container}`}
          >
            <div className={`${style['list-content']} ${style['background-white']}`} style={{ marginTop: 28 }}>
              <a href="/#/classroom/trainSupport">
                <Row className={style.left}>
                  <img alt="培训支援" src={imgTrainingSupport} />
                </Row>
                <Row className={style.right}>
                  <Row className={style.padding}><i className={`${style.icon} ${style['icon-board']} ${style.left}`} /><h4 className={`${style.left}`}>培训申请</h4></Row>
                  <ul>
                    <li>新人系列培训、产品系列培训、销售系列培训、理财师养成培训、国际认证培训</li>
                    <li>给您团队系统培训知识，Step By Step 协助您打造全球资产配置卓越团队，零起点到专业人士的成长之路。</li>
                  </ul>
                </Row>
              </a>
            </div>
          </Row>
        </div>
        <div className={`${style.container}`} style={{ height: 458, maxHeight: 458 }} >
          <Row
            className={`${style.frame} ${style.container}`}
          >
            <div className={`${style['list-content']} ${style['background-white']}`} style={{ marginTop: 68 }}>
              <a href="/#/classroom/marketSupport">
                <Row className={style.left}>
                  <img alt="会销支援" src={imgMarketSupport} />
                </Row>
                <Row className={style.right}>
                  <Row className={style.padding}><i className={`${style.icon} ${style['icon-quotes']} ${style.left}`} /><h4 className={`${style.left}`}>会销支援</h4></Row>
                  <ul>
                    <li>会销指南下载、讲师现场分享、专业知识传递</li>
                    <li>提供会销指南，并有具足专业性和感染力的专业讲师，协助您完成一场收获影响力和业绩的会销活动。</li>
                  </ul>
                </Row>
              </a>
            </div>
          </Row>
        </div>
        <div className={`${style.container} ${style['business-background-3']}`} >
          <Row
            className={`${style.frame} ${style.container}`}
          >
            <div className={`${style['list-content']} ${style['background-white']}`} style={{ marginTop: 68 }}>
              <a href="/#/classroom/receiveSupport">
                <Row className={style.left}>
                  <img alt="会客支援" src={imgReceiveSupport} />
                </Row>
                <Row className={style.right}>
                  <Row className={style.padding}><i className={`${style.icon} ${style['icon-cup']} ${style.left}`} /><h4 className={`${style.left}`}>会客支援</h4></Row>
                  <ul>
                    <li>抓住客户需求、解决客户疑惑、成交尽在掌握</li>
                    <li>全球资产配置的私人银行家、顶级理财师、专业产品经理，协助您为您的客户完成最全面的配置。</li>
                  </ul>
                </Row>
              </a>
            </div>
          </Row>
        </div>
      </Content>
    );
  }
}

export default connect()(Business);
