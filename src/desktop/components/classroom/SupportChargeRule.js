/*
 * view 财课堂
 * @author:Lijun
 * @version:20170705
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Layout, Row, Table } from 'antd';
import style from '../../styles/classroom.css';

const { Content } = Layout;

class SupportChargeRule extends Component {

  handleLocation() {
    this.$this.props.dispatch(routerRedux.push(this.url));
  }

  render() {
    const columns1 = [
      {
        title: '一类城市',
        dataIndex: 'cities1',
      }, {
        title: '二类城市',
        dataIndex: 'cities2',
      }, {
        title: '三类城市',
        dataIndex: 'cities3',
      },
    ];

    const dataSource1 = [
      {
        cities1: '500元/天',
        cities2: '400元/天',
        cities3: '300元/天',
      },
    ];
    const dataSource2 = [
      {
        cities1: '北京、上海、青岛、广州、深圳、杭州',
        cities2: '天津、成都、西安、济南、南京、武汉、昆明、长沙、大连、厦门、福州、无锡、苏州、常州、东莞、温州、台州',
        cities3: '沈阳、石家庄、郑州、烟台、南宁、唐山、重庆、太原、长春、哈尔滨、珠海、泉州、汕头、合肥、徐州、海口、南昌、兰州、贵阳、及其他城市',
      },
    ];

    return (
      <Content className={`${style.container} ${style['support-charge-rule']}`}>
        <Row className={`${style['background-white']}`}>
          <Row className={style['title-container']} ><span className={style['title-bar']}>支援服务收费规则</span></Row>
          <Row className={`${style.container}`}>
            <h5 style={{ color: '#000', margin: '20px 0', fontWeight: 'bold' }}>一、培训费用</h5>
            <p>
              培训费用包括差旅费和课时费，由申请单位承担。差旅费包括交通及住宿费，为实报实销，其中市内交通每天上限200元。课时费根据课时数计算，具体如下：培训类（初级: 200元/小时、专业：500元/小时、首席：800元/小时）；2、申请单位提前打款至财课堂指定账户<span style={{ color: 'red' }}>（在此需要跟财务沟通是哪个公司账号来收钱）</span>。公司收到课时费后将派出人员实施培训。
            </p>
            <h5 style={{ color: '#000', margin: '20px 0', fontWeight: 'bold' }}>二、会销费用</h5>
            <p>
              会销费用包括出场费和差旅费，由申请单位承担。申请单位按以下下表标准提前将出场费打款至财课堂指定账号。会销类（初级: 500元/小时、专业：800元/小时、首席：1000元/小时）。公司收到出场费后将派出人员实施培训。差旅费包括交通及住宿费，为实报实销，其中市内交通上限每天200元。
            </p>
            <h5 style={{ color: '#000', margin: '20px 0', fontWeight: 'bold' }}>三、会客支援</h5>
            <p>
              会客支援包括差旅费和业务佣金提成，由申请单位承担。专业理财师抽成：20%，高级理财师抽成：30%；首席理财师抽成：50%。差旅费包括交通及住宿费，为实报实销，其中市内交通上限每天200元。
            </p>
            <h5 style={{ color: '#000', margin: '20px 0', fontWeight: 'bold' }}>四、住宿费标准</h5>
            <p>
              <Row className={style.table}>
                <Table
                  columns={columns1} dataSource={dataSource1}
                  bordered
                  pagination={false}
                />
              </Row>
            </p>
            <h5 style={{ color: '#000', margin: '20px 0', fontWeight: 'bold' }}>附：出差城市分类</h5>
            <p>
              <Row className={style.table}>
                <Table
                  columns={columns1} dataSource={dataSource2}
                  bordered
                  pagination={false}
                />
              </Row>
            </p>
            <h5 style={{ color: '#000', margin: '20px 0', fontWeight: 'bold' }}>五、交通费标准</h5>
            <p>
            交通费包括：机票、出租票、及地铁、公交车票。机票包括往返程，出租票及地铁、公交车票报销工作之所需，市内交通每天上限每天200元。
            </p>
          </Row>
        </Row>
        <Row className={`${style.container} ${style['background-white']} ${style['text-center']}`}>
          <Button type="default" className={`${style.btn}`} htmlType="submit" size="large" onClick={this.handleLocation.bind({ $this: this, url: '/classroom/business' })}>
          我已阅读</Button>
        </Row>
      </Content>
    );
  }
}

export default connect()(SupportChargeRule);
