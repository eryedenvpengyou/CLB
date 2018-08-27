import React from 'react';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Button, Col, DatePicker, Dropdown, Form, Icon, Input, Layout, Menu, Radio, Row, Select, Spin, Table,Modal} from 'antd';
import { isEmpty, eq, isNumber, isFunction, round } from 'lodash';
import * as codeService from '../../services/code';
import * as utils from '../../utils/common';
import { fetchTeam, fetchMyTeamData,queryByUserId, updateByUserId, queryMemberType} from '../../services/channel.js';
import Banner from './Banner';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import TeamCreate from './TeamCreate';
import {PICTURE_ADDRESS} from '../../constants';
import style from '../../styles/channelTeam.css';
import photo from '../../styles/images/icon-user-photo.png';
import iconArrLeft from '../../styles/images/icon-arr-left.png';
import Modals from "../common/modal/Modal";

const FormItem = Form.Item;
const Option = Select.Option;
const { Content } = Layout;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 18 },
  },
};

class TeamComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1, // 初始页面
      pageSize: 5, // 页面数据
      dataList: [], // 成员列表及收益估算table数据
      code: {}, // 快码，userStatus 用户状态

      // 面包屑数据
      itemList: [{
        name: '工作台',
        url: '/#/portal/home',
      }, {
        name: '我的团队',
        url: '/#/channel/team',
      }],
      teamDataList: {}, // 团队基本信息数据
      teamQuantityDataList: [], // 团队基本信息数据（按数量）
      teamAmountDataList: [], // 团队基本信息数据（按金额）
      dateType: 'month', // 日期查询条件；日期RadioButton状态
      loading: false, // 用于加载上半部分基本信息loading状态
      loading2: false, // 用于加载成员列表及收益估算table数据loading状态
      loading3: false, // 用于加载团队基本信息数据（按数量）loading状态
      loading4: false, // 用于加载团队基本信息数据（按金额）loading状态
      amountSort: 'DESC', // 团队基本信息数据（按金额）排序状态
      quantitySort: 'DESC', // 团队基本信息数据（按数量）排序状态
      orderBy: [], // 排序状态字段集合

      createVisible: false,
      teamVisible:false,
      teamCode:'',
      teamAccStatus:'',
      teamAccFlag:false,
      titleName:'',
      memberType: [],
    };

    [
      'render',
      'handleRadiosChange',
      'handleSearch',
      'handleRangeDateChange',
      'handleChange',
      'handleAnchor',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    const dateType = this.state.dateType;
    // 获取快码
    codeService.getCode({ userStatus: 'SYS.USER_STATUS'}).then((data) => {
      this.setState({
        code: data,
      });
    });

    this.fetchTeamData({
      dateType,
    });

    queryMemberType({userId: JSON.parse(localStorage.user).userId}).then(res => {
      if (res.success) {
        let selectList = [];
        res.rows.map((item, index) => {
          if (item.memberTypeDesc !== '所有') {
            selectList.push({
              memberTypeDesc: item.memberTypeDesc,
              memberType: item.memberTypeDesc === '团队成员' ? 'team' :item.memberType
            })
          }
          //
          // selectList[index] = {};
          // selectList[index].memberTypeDesc = item.memberTypeDesc;
          // if (item.memberTypeDesc === '所有') {
          //   selectList[index].memberType = 'all'
          // } else if (item.memberTypeDesc === '团队成员') {
          //   selectList[index].memberType = 'team'
          // } else {
          //   selectList[index].memberType = item.memberType
          // }
        });
        this.setState({
          memberType: selectList
        })
      }

    });

    // 获取表格数据
    const params = {
      parentChannelId: JSON.parse(localStorage.user).relatedPartyId,
      orderBy: this.state.orderBy,
      userStatusCode:'ACTV',
      userId: JSON.parse(localStorage.user).userId,
      memberType: '',
    };

    this.fetchData(params);
  }

  // 添加成员
  changeVisible() {
    this.setState({createVisible: true,});
    // this.props.dispatch({
    //   type: 'channel/addModalSave',
    //   payload: { addModal: true },
    // });
  }
  //关闭模态框
  createClose(e){
    this.setState({createVisible: false,});
    if(e){
      Modals.success({ content: '添加成功！' });
      this.timer2 = setTimeout("location.reload()", 2000);
    }
  }


  // 成员列表及收益估算table查询重置按钮事件
  handleReset = () => {
    const params = {
      parentChannelId: JSON.parse(localStorage.user).relatedPartyId,
      userId: JSON.parse(localStorage.user).userId,
      memberType: '',
    };
    this.props.form.resetFields();
    this.props.form.setFieldsValue({userStatusCode: undefined});
    this.fetchData(params);
  };

  // 日期RadioButton事件
  handleRadiosChange(e) {
    const value = e.target.value;
    const { dateType } = this.state;
    this.setState({
      dateType: value,
      amountSort: 'DESC',
      quantitySort: 'DESC',
    });
    this.fetchTeamData({ dateType: value });
  }

  // 排序查询
  handleSetQuantitySort(value) {
    const $this = this.$this;
    const key = this.key;
    const {
      dateType,
    } = $this.state;
    $this.setState({
      [`${key}Sort`]: value, // 改变排序状态
    });
    $this.fetchTeamData({ // 获取排序数据
      dateType,
      rankDataType: key,
      orderingRule: value,
    }, key);
  }

  // 路由跳转
  handleLocation() {
    this.$this.props.dispatch(routerRedux.push(this.url));
  }

  // 获取团队基本信息
  fetchTeamData = (paramsData = {}, sourceType) => {
    const params = paramsData;
    params.channelId = JSON.parse(localStorage.user).relatedPartyId;
    switch (sourceType) {
      case 'quantity':
        this.setState({
          loading3: true,
        });
        break;
      case 'amount':
        this.setState({
          loading4: true,
        });
        break;
      default:
        this.setState({
          loading: true,
          loading3: true,
          loading4: true,
        });
    }
    fetchMyTeamData(params).then((data) => {
      if(data.success){
        const d = data;
        d.rows.map((rowData, i) => {
          rowData.key = i + 1;
        });

        d.rows[0].quantityRank.map((rowData, i) => {
          rowData.key = i + 1;
        });

        d.rows[0].amountRank.map((rowData, i) => {
          rowData.key = i + 1;
        });

        const teamAmountDataList = d.rows[0].amountRank;
        const teamQuantityDataList = d.rows[0].quantityRank;
        const state = {};

        switch (sourceType) {
          case 'quantity':
            state.teamQuantityDataList = teamQuantityDataList;
            state.loading3 = false;
            break;
          case 'amount':
            state.teamAmountDataList = teamAmountDataList;
            state.loading4 = false;
            break;
          default:
            state.teamQuantityDataList = teamQuantityDataList;
            state.teamAmountDataList = teamAmountDataList;
            state.teamDataList = d.rows[0];
            state.loading = false;
            state.loading3 = false;
            state.loading4 = false;
        }

        this.setState(state);
      }else{
        Modals.error({content: data.message});
      }

     });
  };

  // 成员列表信息查询
  handleSearch() {
    const params = {};
    params.channelName = this.props.form.getFieldValue('channelName');
    params.userName = this.props.form.getFieldValue('userName');
    if(this.props.form.getFieldValue('userStatusCode')){
      params.userStatusCode = this.props.form.getFieldValue('userStatusCode');
    }
    params.userStatus = this.props.form.getFieldValue('userStatus');
    params.parentChannelId = JSON.parse(localStorage.user).relatedPartyId;
    params.orderEffectiveDateFrom = this.params.orderEffectiveDateFrom;
    params.orderEffectiveDateTo = this.params.orderEffectiveDateTo;
    /* this.props.dispatch({
      type: 'channel/fetchTeam',
      payload: { params },
    }); */
    params.orderBy = this.state.orderBy;

    params.userId = JSON.parse(localStorage.user).userId;
    if (this.props.form.getFieldValue('memberType') === 'all') {
      params.memberType = '';
    } else if (this.props.form.getFieldValue('memberType') === 'team') {
      params.memberType = '';
      params.userId = '';
    } else {
      params.memberType = this.props.form.getFieldValue('memberType') || '';
    }

    this.fetchData(params);
  }

  // 成员列表信息获取
  fetchData(paramsData = {}) {
    const params = paramsData;
    this.setState({
      loading2: true,
    });
    fetchTeam(params).then((data) => {
      if(data.success){
        const d = data;
        d.rows.map((rowData, i) => {
          rowData.key = i + 1;
        });

        this.setState({
          loading2: false,
          dataList: data.rows,
        });
      }else{
        Modals.error({content: data.message});
      }

     });
  }

  handleRangeDateChange(dates, dateStrings) {
    this.params.orderEffectiveDateFrom = dateStrings[0];
    this.params.orderEffectiveDateTo = dateStrings[1];
  }

  handleSetLoading(loading, value = false) {
    this.setState({
      [loading]: value,
    });
  }

  // 成员列表数据排序
  handleChange(pager = {}, filters = {}, sorter) {
    const params = {};
    const orderBy = [];
    const tempOrderBy = {};

    params.channelName = this.props.form.getFieldValue('channelName');
    params.userName = this.props.form.getFieldValue('userName');
    params.userStatus = this.props.form.getFieldValue('userStatus');
    params.parentChannelId = JSON.parse(localStorage.user).relatedPartyId;
    params.orderEffectiveDateFrom = this.params.orderEffectiveDateFrom;
    params.orderEffectiveDateTo = this.params.orderEffectiveDateTo;
    if (sorter && sorter.field && sorter.order) {
      tempOrderBy.name = sorter.field;
      tempOrderBy.rule = sorter.order.replace('end', '') === 'desc' ? 0 : 1;

      orderBy.push(tempOrderBy);
      params.orderBy = orderBy;
      this.setState({ orderBy });
    }
    this.fetchData(params);
  }

  // 页面跳转指定位置
  handleAnchor() {
    document.getElementById('member').scrollIntoView(true);
  }

  params = {};

  teamAccChange(val){
    if(val !== this.props.form.getFieldValue('accStatus')){
      this.setState({
        teamAccFlag:true
      })
    }
  }
  //成员账号管理查询
  queryUser(record){
    this.setState({
      teamVisible:true,
      teamCode:record.userId
    });
    queryByUserId({userId:record.userId}).then((data)=>{
      if(data.success){
        this.setState({teamAccStatus:data.rows[0].status,titleName:data.rows[0].userName})
      }
    })
  }
  //成员列表模态框提交
  modalSubmit(e){
    this.props.form.validateFields((err, values) => {
      if(!err && this.state.teamAccFlag){
        let params = {
          userId:this.state.teamCode,
          status:this.props.form.getFieldValue('accStatus')
        };
        updateByUserId(params).then((data)=>{
          if(data.success){
            Modals.success({ content: '保存成功！' });
            const params = {
              parentChannelId: JSON.parse(localStorage.user).relatedPartyId
            };
            this.fetchData(params);
            this.props.form.setFieldsValue({ userStatusCode: ''})
          }
        })
      }
      this.setState({teamVisible: false});
    });
  }

  //成员列表关闭模态框
  onCancel() {
    this.props.form.resetFields();
    this.setState({ teamVisible: false });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      dateType,
      dataList,
      loading,
      loading2,
      loading3,
      loading4,
      teamDataList,
      teamQuantityDataList,
      teamAmountDataList,
    } = this.state;
    let { sortedInfo1, sortedInfo2 } = this.state;
    sortedInfo1 = sortedInfo1 || {};
    sortedInfo2 = sortedInfo2 || {};
    const footer = (currentPageData) => {
      return (
        <Row className={style.footer}>
          { isEmpty(currentPageData) ? '' :
          <tr>
            <td style={{ textAlign: 'left', width: 443, wordBreak: 'break-all' }}>合计：</td>
            <td style={{ textAlign: 'center', width: 155, wordBreak: 'break-all' }}>{utils.numberFormat(currentPageData[0].allInProcessQty)}</td>
            <td style={{ textAlign: 'center', width: 155, wordBreak: 'break-all' }}>{utils.numberFormat(currentPageData[0].allInEffictiveQty)}</td>
            <td style={{ textAlign: 'center', width: 155, wordBreak: 'break-all' }}>{utils.numberFormat(currentPageData[0].allSignQty)}</td>
            <td style={{ textAlign: 'center', width: 110, wordBreak: 'break-all' }}>{utils.numberFormat(currentPageData[0].allSignAmount)}</td>
          </tr>
          }
        </Row>
      );
    };

    // // 团队基本信息数据（按数量）/// 团队基本信息数据（按金额）columns组装
    const rankListColumns = key => [{
      title: '',
      dataIndex: 'key',
      render: (text, record, index) => {
        let obj = '';
        switch (Number(index + 1)) {
          case 1:
            obj = (<i className={`${style.icon} ${style['icon-gold']}`} />);
            break;
          case 2:
            obj = (<i className={`${style.icon} ${style['icon-silver']}`} />);
            break;
          case 3:
            obj = (<i className={`${style.icon} ${style['icon-bronze']}`} />);
            break;
          default:
            obj = (<span>{index + 1}</span>);
        }
        return obj;
      },
    }, {
      title: '',
      dataIndex: 'photoFilePath',
      render: (text) =>{
        let url = text? PICTURE_ADDRESS+text : photo;
        return (<img style={{width:40,height:40,borderRadius:'50px'}} alt="" src={url} />);
      }
    }, {
      title: '渠道名称',
      dataIndex: 'channelName',
    }, {
      title: '环比上期',
      dataIndex: 'variinePercent',
      render: (text, record, index) => {
        let span = '';
        if (parseFloat(text) >= 0) {
          span = <span style={{ color: '#ffbc00' }}>{`${text !== null && text !== undefined ? `${round(Number(text) * 100, 4)}%` : '--'}`}</span>;
        } else {
          span = <span style={{ color: '#6dc7be' }}>{`${text !== null && text !== undefined ? `${round(Number(text) * 100, 4)}%` : '--'}`}</span>;
        }
        return span;
      },
    }, {
      title: `${key === 'signAmount' ? '签单金额' : '签单数量'}`,
      dataIndex: key,
      render: text => (text !== undefined ? utils.numberFormat(Number(text)) : 0),
    }];

    // 成员收益列表table columns组装
    const detailColumns = [{
      title: '用户名',
      dataIndex: 'userName',
      width: 130,
      render: (text,record) => {
       return record.userStatusCode == 'EXPR'?
       <span style={{color:'gray'}}>{record.userName}{'（过期）'}</span>:<span>{record.userName}</span>
      }
    }, {
      title: '渠道名称',
      dataIndex: 'channelName',
      width: 140,
    }, {
      title: '成员类型',
      dataIndex: 'memberTypeDesc',
      width: 100,
    },  {
      title: '计划书额度',
      dataIndex: 'planQuota',
      width: 140,
      sorter: true,
      render: text => (text !== undefined ? utils.numberFormat(Number(text)) : 0),
    }, {
      title: '跟进中订单',
      dataIndex: 'totalInProcessQty',
      width: 140,
      sorter: true,
      render: text => (text !== undefined ? utils.numberFormat(Number(text)) : 0),
    }, {
      title: '生效中订单',
      dataIndex: 'totalInEffictiveQty',
      width: 140,
      sorter: true,
      render: text => (text !== undefined ? utils.numberFormat(Number(text)) : 0),
    }, {
      title: '签单数量',
      dataIndex: 'signQty',
      width: 140,
      sorter: true,
      render: text => (text !== undefined ? utils.numberFormat(Number(text)) : 0),
    }, {
      title: '签单金额（HKD）',
      dataIndex: 'signAmount',
      width: 110,
      sorter: true,
      render: text => (text !== undefined ? utils.numberFormat(Number(text)) : 0),
    }, {
      title: '管理',
      dataIndex: 'operate',
      render: (text, record) => {
        const rate = <Button className={`${style.btn} ${style.blank} ${style['channel-btn-drop']}`} style={{ width: 94 }} onClick={() => location.hash = `/channel/teamRate/${record.channelId}/${JSON.parse(localStorage.user).relatedPartyId}/CHANNEL/${record.userName}/${record.channelName}`} >转介费率</Button>;
        const channel = <Button className={`${style.btn} ${style.blank} ${style['channel-btn-drop']}`} style={{ width: 94 }} onClick={() => location.hash = `/channel/personal/${record.channelId}/${record.userName}?memberType=${record.memberTypeDesc}`} >渠道详情</Button>;
        const manage = <Button className={`${style.btn} ${style.blank} ${style['channel-btn-drop']}`} style={{ width: 94 }} onClick={this.queryUser.bind(this,record)} >账号管理</Button>;
        const menu = (
          <Menu>
            <Menu.Item key='1'>
              {rate}
            </Menu.Item>
            <Menu.Item key='2'>
              {channel}
            </Menu.Item>
            {
              record.userId ?
                <Menu.Item key='3'>
                  {manage}
                </Menu.Item> : ''
            }
          </Menu>
        );
        let disabled = record.memberTypeDesc === '转介绍';
        return (
          <Dropdown overlay={menu} placement="bottomCenter" disabled={disabled ? 'disabled' : ''}>
            <Button disabled={disabled ? 'disabled' : ''} className={`${style.btn} ${style.blank} ${style['operate-disabled']}`} style={{ width: 90, pointerEvents: disabled ? 'none' : 'unset' }}>操作</Button>
          </Dropdown>
        );
      },
    }];

    const backHome = (<Row>
      <Button
        className={`${style.btn} ${style.blank} ${style.grey} ${style.back} ${style.right}`}
        onClick={this.handleLocation.bind({ $this: this, url: '/' })}
      >
        返回上一页
      </Button>
    </Row>);

    // 跟进中下拉列表
    const dropmenu = !isEmpty(teamDataList) ? (
      <Menu style={{ width: 250, marginLeft: '8%' }}>
        <Menu.Item className={style.channel} style={{ background: '#57bdde', borderBottom: '1px solid #fff' }}>
          <Row onClick={this.handleLocation.bind({ $this: this, url: '/order/summary/2' })}>
            <span style={{ width: 30, display: 'inline-block', fontSize: 18, fontWeight: 'bold' }}>保险</span>
            <img alt="保险" src={iconArrLeft} style={{ float: 'right', marginTop: 4 }} />
            <span style={{ marginLeft: '30%', fontSize: 18, fontWeight: 'bold' }} >{(teamDataList.insuranceInProcessQty !== undefined && teamDataList.insuranceInProcessQty !== null) ? teamDataList.insuranceInProcessQty : '--'}</span>
          </Row>
        </Menu.Item>
        <Menu.Item style={{ background: '#57bdde', borderBottom: '1px solid #fff' }}>
          <Row onClick={this.handleLocation.bind({ $this: this, url: '/order/bonds/2' })}>
            <span style={{ width: 30, display: 'inline-block', fontSize: 18, fontWeight: 'bold' }}>债券</span>
            <img alt="债券" src={iconArrLeft} style={{ float: 'right', marginTop: 4 }} />
            <span style={{ marginLeft: '30%', fontSize: 18, fontWeight: 'bold' }} >{ (teamDataList.bondInProcessQty !== undefined && teamDataList.bondInProcessQty !== null) ? teamDataList.bondInProcessQty : '--'}</span>
          </Row>
        </Menu.Item>
        <Menu.Item style={{ background: '#57bdde', borderBottom: '1px solid #fff' }}>
          <Row >
            <span style={{ width: 30, display: 'inline-block', fontSize: 18, fontWeight: 'bold' }}>基金</span>
            <img alt="基金" src={iconArrLeft} style={{ float: 'right', marginTop: 4 }} />
            <span style={{ marginLeft: '30%', fontSize: 18, fontWeight: 'bold' }} >{(teamDataList.fundInProcessQty !== undefined && teamDataList.fundInProcessQty !== null) ? teamDataList.fundInProcessQty : '--'}</span>
          </Row>
        </Menu.Item>
        <Menu.Item style={{ background: '#57bdde', borderBottom: '1px solid #fff' }} onClick={this.handleLocation.bind({ $this: this, url: '/#/order/orderImmigrantInvest/list/2' })}>
          <Row onClick={this.handleLocation.bind({ $this: this, url: '/order/orderImmigrantInvest/list/2' })}>
            <span style={{ width: 30, display: 'inline-block', fontSize: 18, fontWeight: 'bold' }}>投资移民</span>
            <img alt="投资移民" src={iconArrLeft} style={{ float: 'right', marginTop: 4 }} />
            <span style={{ marginLeft: '30%', fontSize: 18, fontWeight: 'bold' }} >{teamDataList.immigrationInProcessQty !== undefined && teamDataList.immigrationInProcessQty !== null ? teamDataList.immigrationInProcessQty : '--'}</span>
          </Row>
        </Menu.Item>
        <Menu.Item className={style.channel} style={{ background: '#57bdde', borderBottom: '1px solid #fff' }}>
          <Row onClick={this.handleLocation.bind({ $this: this, url: '/order/orderHouse/2' })}>
            <span style={{ width: 30, display: 'inline-block', fontSize: 18, fontWeight: 'bold' }}>海外房产</span>
            <img alt="海外房产" src={iconArrLeft} style={{ float: 'right', marginTop: 4 }} />
            <span style={{ marginLeft: '30%', fontSize: 18, fontWeight: 'bold' }} >{teamDataList.houseInProcessQty || '0'}</span>
          </Row>
        </Menu.Item>
        <Menu.Item className={style.channel} style={{ background: '#57bdde', borderBottom: '1px solid #fff' }}>
          <Row onClick={this.handleLocation.bind({ $this: this, url: '/order/orderYJ/2' })}>
            <span style={{ width: 30, display: 'inline-block', fontSize: 18, fontWeight: 'bold' }}>医疗教育</span>
            <img alt="医疗教育" src={iconArrLeft} style={{ float: 'right', marginTop: 4 }} />
            <span style={{ marginLeft: '30%', fontSize: 18, fontWeight: 'bold' }} >{teamDataList.medicalEduInProcessQty || '0'}</span>
          </Row>
        </Menu.Item>
      </Menu>
    ) : (
      <Menu style={{ width: 250, marginLeft: '8%' }}>
        <Menu.Item style={{ background: '#57bdde', borderBottom: '1px solid #fff' }}>
          <span style={{ width: 30, display: 'inline-block', fontSize: 18, fontWeight: 'bold' }}>暂无数据</span>
        </Menu.Item>
      </Menu>
    );

    // const memberType = this.state.code.memberType && this.state.code.memberType.map((code, index) => {
    //   return <Option value={code.value} key={index}>{code.meaning}</Option>
    // });

    return (
      <Layout className={`${style.channel} ${style.main}`}>
        <Banner
          className={style['channel-banner-2']}
        />
        <Content className={`${style.content} ${style.team} ${style['background-white']}`}>
          <Row className={`${style.container}`}>
            <Layout className={`${style.frame} ${style['background-white']}`}>
              <BreadcrumbLayout itemList={this.state.itemList} />
            </Layout>
          </Row>
          <Spin spinning={loading}>
            <Row className={style.container}>
              <Layout className={`${style.frame} ${style['background-white']}`}>
                <Row className={`${style.boxs} ${style['margin-top']}`}>
                  <Col
                    className={`${style.box} ${style['channel-team-box-member']} ${style['text-center']}`}
                    xs={6} sm={6} md={6} lg={6} xl={6}
                    style={{ paddingLeft: 90 }}
                    onClick={this.handleAnchor}
                  >
                    <span>{teamDataList.memberQty !== undefined ? Number(teamDataList.memberQty) : '--'}</span>
                    <span>{teamDataList.memberQty !== undefined ? '人' : ''}</span>
                  </Col>
                  <Dropdown overlay={dropmenu} trigger={['click']}>
                    <Col
                      className={`${style.box} ${style['channel-team-box-following']} ${style['text-center']}`}
                      xs={6} sm={6} md={6} lg={6} xl={6}
                      style={{ paddingLeft: 100 }}
                    >
                      <span>{teamDataList.totalInProcessQty !== undefined ? Number(teamDataList.totalInProcessQty) : '--'}</span>
                      <span>{teamDataList.totalInProcessQty !== undefined ? '单' : ''}</span>
                    </Col>
                  </Dropdown>
                  <Col
                    className={`${style.box} ${style['channel-team-box-pending']} ${style['text-center']}`}
                    xs={6} sm={6} md={6} lg={6} xl={6}
                    style={{ paddingLeft: 100 }}
                    onClick={this.handleLocation.bind({ $this: this, url: '/orderPending/list/2' })}
                  >
                    <span>{teamDataList.pengdingQty !== undefined ? Number(teamDataList.pengdingQty) : '--'}</span>
                    <span>{teamDataList.pengdingQty !== undefined ? '个' : ''}</span>
                  </Col>
                  <Col
                    className={`${style.box} ${style['channel-team-box-account']} ${style['text-center']}`}
                    xs={6} sm={6} md={6} lg={6} xl={6}
                    style={{ paddingLeft: 160 }}
                    onClick={this.changeVisible.bind(this)}
                  >
                    <span style={{ color: '#6dc7be' }}>创建</span>
                  </Col>
                </Row>
              </Layout>
            </Row>
            <Row className={`${style.container} ${style['channel-team-background-1']} ${style['margin-top']}`}>
              <Layout className={`${style.frame} ${style['background-init']}`}>
                <Row className={style['content-title']}>
                  <h1>签单统计</h1>
                  <span>SIGN STATISTICS</span>
                </Row>
                <Row>
                  <RadioGroup
                    defaultValue="month"
                    className={`${style.radios} ${style.right} ${style['margin-top']}`}
                    onChange={this.handleRadiosChange}
                  >
                    <RadioButton className={eq(dateType, 'week') ? style.active : ''} value="week">本周</RadioButton>
                    <RadioButton className={eq(dateType, 'month') ? style.active : ''} value="month">本月</RadioButton>
                    <RadioButton className={eq(dateType, 'year') ? style.active : ''} value="year">本年</RadioButton>
                  </RadioGroup>
                </Row>

                <Row className={`${style.container} ${style['channel-team-background-2']} ${style['margin-top']}`}>
                  <ul className={style['sign-list']}>
                    <li><span>{teamDataList.newOrderQty !== undefined && teamDataList.newOrderQty !== null ? utils.numberFormat(teamDataList.newOrderQty) : '--'}</span><span>新增预约</span></li>
                    <li><span>{teamDataList.signQty !== undefined && teamDataList.signQty !== null ? utils.numberFormat(teamDataList.signQty) : '--'}</span><span>签单数量</span></li>
                    <li style={{ border: 'initial' }}><span>{teamDataList.totalSignAmount !== undefined && teamDataList.totalSignAmount !== null ? utils.numberFormat(teamDataList.totalSignAmount) : '--'}</span><span>签单金额（HKD）</span></li>
                  </ul>
                </Row>

                <Row className={`${style['margin-top']} ${style['padding-top']}`}>
                  <Col
                    className={`${style['ranking-list']} ${style.left}`}
                    xs={12} sm={12} md={12} lg={12} xl={12}
                  >
                    <div className={style.header}>
                      <div className={`${style.left} ${style['channel-team-info-box']}`}><h3 className={style.color}>签单数量排名（HKD）</h3></div>
                      <Select className={`${style.right} ${style.select}`} defaultValue="DESC" onChange={this.handleSetQuantitySort.bind({ $this: this, key: 'quantity' })}>
                        <Option value="DESC">从高到低</Option>
                        <Option value="ASC">从低到高</Option>
                      </Select>
                    </div>
                    <div className={`${style.content}`}>
                      <Table
                        columns={rankListColumns('signOrderQty')}
                        dataSource={teamQuantityDataList}
                        pagination={false}
                        loading={loading3}
                        scroll={{ x: '100%' }}
                      />
                    </div>
                  </Col>
                  <Col
                    className={`${style['ranking-list']} ${style.right}`}
                    xs={12} sm={12} md={12} lg={12} xl={12}
                  >
                    <div className={style.header}>
                      <div className={`${style.left} ${style['channel-team-info-box']}`}><h3 className={style.color}>签单金额排名（HKD）</h3></div>
                      <Select className={`${style.right} ${style.select}`} defaultValue="DESC" onChange={this.handleSetQuantitySort.bind({ $this: this, key: 'amount' })}>
                        <Option value="DESC">从高到低</Option>
                        <Option value="ASC">从低到高</Option>
                      </Select>
                    </div>
                    <div className={`${style.content}`}>
                      <Table
                        columns={rankListColumns('signAmount')}
                        dataSource={teamAmountDataList}
                        pagination={false}
                        loading={loading4}
                        scroll={{ x: '100%' }}
                      />
                    </div>
                  </Col>
                </Row>
              </Layout>
            </Row>
          </Spin>
          <Row id="member" className={`${style.container} ${style['channel-team-background-3']}`}>
            <Layout className={`${style.frame} ${style['background-white']} ${style.container} ${style['box-shadow']}`}>
              <Row className={style['content-title']}>
                <h1>成员列表及收益估算</h1>
                <span>THE LIST OF MEMBERS AND REVENUE ESTIMATES</span>
              </Row>
              <Row className={`${style['margin-top']}`}>
                <Form layout="inline">
                  <FormItem>
                    {getFieldDecorator('memberType', {
                      rules: [{ message: '成员类型:', whitespace: true }],
                      // initialValue:'',
                    })(
                      <Select showSearch
                              optionFilterProp="children"
                              allowClear
                              placeholder="成员类型"
                              style={{width:'200px'}}
                      >
                        {this.state.memberType.map((item, index) => {
                          return <Option value={item.memberType} key={index}>{item.memberTypeDesc}</Option>
                        })}
                        {/*<Option value="all">所有</Option>
                        <Option value="team">团队成员</Option>
                        <Option value="MAKER">创客</Option>
                        <Option value="SAM">SAM</Option>
                        <Option value='INTRODUCER'>介绍人</Option>*/}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('channelName')(
                      <Input placeholder="渠道名称" />,
                  )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('userName')(
                      <Input placeholder="用户名" />,
                  )}
                  </FormItem>
                  <FormItem>
                      {getFieldDecorator('userStatusCode', {
                        rules: [{ message: '账号状态:', whitespace: true }],
                        initialValue:'ACTV'
                      })(
                        <Select showSearch
                          optionFilterProp="children"
                          allowClear
                          placeholder="账号状态"
                          style={{width:'120px'}}
                        >
                          <Option value="ACTV">有效</Option>
                          <Option value="EXPR">过期</Option>
                          <Option value='INACTIVE'>未激活</Option>
                        </Select>
                        )}
                    </FormItem>
                  <Button
                    className={`${style.btn} ${style.blank} ${style.right}`}
                    type="default" onClick={this.handleReset}
                    style={{ height: 40, width: 160 }}
                  >
                    全部
                  </Button>
                  <Button
                    className={`${style.btn} ${style.search} ${style.right}`}
                    type="default" htmlType="submit"
                    style={{ height: 40, marginRight: 8, width: 160,color: '#fff' }}
                    onClick={this.handleSearch}
                  >
                    查询
                  </Button>
                </Form>
                <Spin spinning={loading2}>
                  <Row>
                    <Table
                      className={style['table-team']}
                      columns={detailColumns}
                      dataSource={dataList}
                      bordered
                      footer={footer}
                      scroll={{  y: 350 }}
                      pagination={false}
                      onChange={this.handleChange}
                    />
                  </Row>
                </Spin>
              </Row>
            </Layout>
          </Row>
        </Content>
        <TeamCreate channel={this.props.channel} visible={this.state.createVisible} createClose={this.createClose.bind(this)} dispatch={this.props.dispatch} />
        <Modal
         // width={600}
          style={{top:200}}
          maskClosable={false}
          closable={true}
          footer={null}
          visible={this.state.teamVisible}
          title={this.state.titleName+"账号管理"}
          onCancel={this.onCancel.bind(this)}
          className={style.teamModal}
        >
          <Form>
            <div>
              <FormItem {...formItemLayout}  label="账号状态" >
                {getFieldDecorator('accStatus',{
                  rules: [
                    {required: true, message: '请选择账号状态', whitespace: true }
                  ],
                  initialValue:this.state.teamAccStatus,
                  onChange:this.teamAccChange.bind(this)
                })(
                  <Select showSearch placeholder="账号状态"
                    optionFilterProp="children"
                  >
                    <Option value="ACTV">有效</Option>
                    <Option value="EXPR">过期</Option>
                    <Option value='INACTIVE'>未激活</Option>
                  </Select>
                )}
              </FormItem>
            </div>

            <div style={{textAlign:'center',marginBottom:'20px'}}>
              <Button
              onClick={this.modalSubmit.bind(this)}
              type="primary" style={{ width:'120px',height:'38px'}} >确定</Button>
            </div>
          </Form>
        </Modal>
      </Layout>
    );
  }
}

const Team = Form.create()(TeamComponent);
export default Team;
