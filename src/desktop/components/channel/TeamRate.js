import React from 'react';
import { Table, Icon, Button, Input, Row, Col, Form, Select, Layout } from 'antd';
import MySelect from '../database/Select';
import moment from 'moment';
import { isEmpty } from 'lodash';
import * as codeService from '../../services/code';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import { fetchRate } from '../../services/channel.js';
import { fetchCompany } from '../../services/order.js';
import style from '../../styles/channelTeam.css';
import * as styles from '../../styles/qa.css';

const FormItem = Form.Item;
const Option = Select.Option;
const { Content } = Layout;


const currencyList = [];
const renderCurrency = function (text, record) {
  if (text && currencyList.length > 0) {
    return (
      <Select
        defaultValue={text}
        showSearch
        disabled
        // style={{ width: 100 }}
      >
        {
          currencyList.map(item =>
            <Option value={item.value}>{item.meaning}</Option>,
          )
        }
      </Select>
    );
  }
};


class TeamRate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
      dataList: [],
      code: {},
      loading: false,
      companyList: [],   //产品公司

      // 面包屑数据
      itemList: [{
        name: '工作台',
        url: '/#/portal/home',
      }, {
        name: `转介费率`,
        url: '/#/channel/teamRate',
      }],
      params: {},
    };

    [
      'render',
      'handleReset',
      'handleSearch',
      'handleChange',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    const codeParams = {
      currency: 'PUB.CURRENCY',
      payMethod: 'CMN.PAY_METHOD',
    };
    // 获取快码
    codeService.getCode(codeParams).then((data) => {
      this.setState({ code: data });
    });

    if (isEmpty(this.state.companyList)) {
      fetchCompany({pageSize: 999999}).then((data) => {
        data.rows.map((n, i) => {
          const d = n;
          d.key = i + 1;
          d.value = d.supplierId;
          d.description = d.name;
        });
        this.setState({
          companyList: data.rows,
        });
      });
    }
  }

  componentDidMount() {
    const params = {};
    params.pagesize = 10;
    params.page = 1;
    this.fetchData(params);
    //面包屑判断
    if(this.props.channelId && this.props.parentPartyId && this.props.parentPartyType){
      this.state.itemList = [{
        name: '工作台',
        url: '/#/portal/home',
      }, {
        name: '我的团队',
        url: '/#/channel/team',
      }, {
        name: `${this.props.channelName} 转介费率`,
        url: `/#/channel/teamRate/${this.props.channelId}/${this.props.userName}/${this.props.channelName}`,
      }]
    }
  }

  handleReset = () => {
    this.props.form.resetFields();
    const params = {};
    params.pagesize = 10;
    params.page = 1;
    this.fetchData(params);
  }

  fetchData(paramsData = {}) {
    const params = paramsData;
    params.channelId = this.props.channelId;
    params.parentPartyId = this.props.parentPartyId;
    params.parentPartyType = this.props.parentPartyType;
    this.setState({
      loading: true,
      params,
    });
    fetchRate(params)
     .then((data) => {
       const d = data;
       const pagination = this.state.pagination;
       pagination.pageSize = params.pagesize;
       pagination.total = d.total;
       d.rows.map((rowData, i) => {
         rowData.key = i + 1;
       });

       this.setState({
         loading: false,
         dataList: data.rows,
         pagination,
       });
     });
  }

  // 搜索
  handleSearch() {
    const params = {};
    const pagination = this.state.pagination;
    params.channelId = this.props.channelId;
    params.itemSupplierId = this.props.form.getFieldValue('itemSupplierId');
    params.itemName = this.props.form.getFieldValue('itemName');
    params.parentPartyName = this.props.form.getFieldValue('parentPartyName');
    params.contributionPeriod = this.props.form.getFieldValue('contributionPeriod');
    params.currency = this.props.form.getFieldValue('currency');
    params.payMethod = this.props.form.getFieldValue('payMethod');
    params.pagesize = 10;
    params.page = 1;
    pagination.current = 1;
    this.setState({
      pagination,
    });
    this.fetchData(params);
  }

  // 处理分页和排序
  handleChange(pager, filters = {}, sorter) {
    const params = this.state.params;
    const pagination = pager;
    this.setState({
      pagination,
    });
    if (sorter && sorter.field && sorter.order) {
      params.orderBy = `${sorter.field} ${sorter.order.replace('end', '')}`;// 组装排序规则
    }
    params.pagesize = pagination.pageSize;
    params.page = pagination.current;
    this.fetchData(params);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      pagination,
      loading,
      dataList,
      companyList,
    } = this.state;
    const columns = [/*{
      title: '序号',
      dataIndex: 'key',
      render: (text, record, index) => {
        // 索引从零开始，所以第一行为index+1，index为render方法里面的参数，可自动获取到下标，在ant design里面有详情解释，可参考
        return <span>{index + 1}</span>;
      },
    }, {
      title: '渠道编号',
      dataIndex: 'channelCode',
    }, {
      title: '渠道名称',
      dataIndex: 'channelName',
    }, {
      title: '所属上级',
      dataIndex: 'parentPartyName',
      sorter: true,
    }, {
      title: '产品编号',
      dataIndex: 'itemCode',
    },*/  {
      title: '产品公司',
      dataIndex: 'itemSupplierName',
      fixed: 'left',
      width: 120,
    },{
      title: '产品名称',
      dataIndex: 'itemName',
      fixed: 'left',
      width: 175,
    }, /* {
      title: '供应商',
      dataIndex: 'supplierName',
    },  */{
      title: '供款期',
      dataIndex: 'contributionPeriod',
      fixed: 'left',
      width: 120,
    }, {
      title: '币种',
      dataIndex: 'currency',
      fixed: 'left',
      width: 200,
      // render: (text, record) => {
      //   if (text && this.state.code.currency) {
      //     for (const i in this.state.code.currency) {
      //       if (text === this.state.code.currency[i].value) {
      //         return this.state.code.currency[i].meaning;
      //       }
      //     }
      //   }
      //   return text;
      // },
    }, {
      title: '缴费方式',
      dataIndex: 'payMethodName',
      fixed: 'left',
      width: 150,
    }, {
      title: '受保年龄从',
      dataIndex: 'policyholdersMinAge',
      fixed: 'left',
      width: 120,
    }, {
      title: '受保年龄至',
      dataIndex: 'policyholdersMaxAge',
      fixed: 'left',
      width: 120,
    }, {
      title: '第一年',
      dataIndex: 'theFirstYear',
      sorter: true,
      render: text => `${parseFloat(text*100).toFixed(2)}%`,
    }, {
      title: '第二年',
      dataIndex: 'theSecondYear',
      render: text => `${parseFloat(text*100).toFixed(2)}%`,
    }, {
      title: '第三年',
      dataIndex: 'theThirdYear',
      render: text => `${parseFloat(text*100).toFixed(2)}%`,
    }, {
      title: '第四年',
      dataIndex: 'theFourthYear',
      render: text => `${parseFloat(text*100).toFixed(2)}%`,
    }, {
      title: '第五年',
      dataIndex: 'theFifthYear',
      render: text => `${parseFloat(text*100).toFixed(2)}%`,
    }, {
      title: '第六年',
      dataIndex: 'theSixthYear',
      render: text => `${parseFloat(text*100).toFixed(2)}%`,
    }, {
      title: '第七年',
      dataIndex: 'theSeventhYear',
      render: text => `${parseFloat(text*100).toFixed(2)}%`,
    }, {
      title: '第八年',
      dataIndex: 'theEightYear',
      render: text => `${parseFloat(text*100).toFixed(2)}%`,
    }, {
      title: '第九年',
      dataIndex: 'theNinthYear',
      render: text => `${parseFloat(text*100).toFixed(2)}%`,
    }, {
      title: '第十年',
      dataIndex: 'theTenthYear',
      render: text => `${parseFloat(text*100).toFixed(2)}%`,
    }, {
      title: '有效日期从',
      dataIndex: 'effectiveStartDate',
      render: text => (text ? moment(text).format('YYYY-MM-DD') : ''),
    }, {
      title: '有效日期至',
      dataIndex: 'effectiveEndDate',
      render: text => (text ? moment(text).format('YYYY-MM-DD') : ''),
    }];

    return (
      <Layout className={`${style.channel} ${style.main}`}>
        <Content className={`${style.content} ${style.container} ${style.team} ${style['background-white']}`}>
          <Layout className={`${style.frame} ${style['background-white']}`}>
            <BreadcrumbLayout itemList={this.state.itemList} />
          </Layout>
          <Layout className={`${style.container} ${style.frame} ${style['margin-top']}`}>
            <Row className={`${style.container} ${style['background-white']}`}>
              <Form layout="inline">
                <MySelect form={this.props.form} name="itemSupplierId" dataSource={companyList} placeholder="产品公司" style={{ width: 160 }} />
                <FormItem>
                  {getFieldDecorator('itemName', {
                  })(
                    <Input style={{ width: 150 }} placeholder="产品" />,
                  )}
                </FormItem>
                {/* <FormItem>
                  {getFieldDecorator('parentPartyName', {
                  })(
                    <Input placeholder="所属上级" />,
                  )}
                </FormItem> */}

                <FormItem>
                  {getFieldDecorator('contributionPeriod', {
                  })(
                    <Input style={{ width: 150 }} placeholder="供款期" />,
                  )}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('currency', {
                  })(
                    <Select
                      showSearch
                      style={{ width: 150 }}
                      placeholder="币种"
                    >
                      {
                        this.state.code.currency &&
                        this.state.code.currency.map(item =>
                          <Option key={item.value} value={item.value}>{item.meaning}</Option>,)
                      }
                    </Select>,
                    )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('payMethod', {
                  })(
                    <Select
                      showSearch
                      style={{ width: 150 }}
                      placeholder="缴费方式"
                    >
                      {
                  this.state.code.payMethod &&
                  this.state.code.payMethod.map(item =>
                    <Option key={item.value} value={item.value}>{item.meaning}</Option>,
                  )
                }
                    </Select>,
            )}
                </FormItem>

                <Button type="default" className={`${style.btn} ${style.blank} ${style.right}`} style={{ width: 140, height: 40 }} onClick={this.handleReset.bind(this)}>全部</Button>
                <Button type="default" className={`${style.btn} ${style.right}`} style={{ width: 140, height: 40, marginRight: 12 }} onClick={this.handleSearch.bind(this)}>查询</Button>
              </Form>
              <Row>
                <Table columns={columns} dataSource={dataList} pagination={pagination} onChange={this.handleChange} scroll={{ x: '200%' }} bordered />
              </Row>
            </Row>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

export default Form.create()(TeamRate);
