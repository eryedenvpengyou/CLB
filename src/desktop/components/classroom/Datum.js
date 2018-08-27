/*
 * view 财课堂
 * @author:Lijun
 * @version:20170705
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { stringify } from 'qs';
import isEmpty from 'lodash/isEmpty';
import { Button, Form, Input, Layout, Row, Table, Select } from 'antd';
import MySelect from './Select';
import moment from 'moment';
import style from '../../styles/classroom.css';
import { getCode } from '../../services/code.js';
import {HTTP_HEADERS} from '../../constants';
import request from '../../utils/request';
import { fetchDatumList as fetchDatum, updateDowloadTimes } from '../../services/classroom.js';
import { personalContract as fetchPersonalContract } from '../../services/channel.js';
import { fetchCompany } from '../../services/order.js';
import icon02 from '../../styles/images/mine/icon02.png';
import icon01 from '../../styles/images/mine/icon01.png';

const { Content } = Layout;
const FormItem = Form.Item;

const BIGCLASS_DATA = '/api/commons/lov/PRD_DIVISION'; //产品大分类LOV
const MIDCLASS_DATA = '/api/commons/lov/PRD_CLASS'; //产品中分类LOV

class DatumComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      selectedRowKeys: [],
      pagination: {},
      codeList: {},
      isSignedChannel: false,
      loading: false,
      loading2: false,
      companyList: [],
    };

    [
      'render',
      'handleFetchData',
      'handleReset',
      'handleChange',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  //查询后台函数
  query(url,params) {
    return request(url,{
      method: 'POST',
      headers: HTTP_HEADERS,
      body: JSON.stringify(params),
    });
  }

  componentWillMount() {
    const codeType = {
      supply: 'COURSE.SUPPLIER_ID',
      // productDivision: 'PRD.PRODUCT_DIVISION',
      // productClass: 'PRD.PRODUCT_CLASS',
    };
    if (isEmpty(this.state.codeList)) {
      getCode(codeType).then((data) => {
        this.setState({
          codeList: data,
        });
      });
    }
    this.fetchPersonalContractData();

    const params = {statusCode:"Y"};
    this.query(BIGCLASS_DATA,params).then((data)=>{
      if(data.success){
        for(let i = 0; i< data.rows.length; i++) data.rows[i].key = i;
        this.setState({productDivision:data});
      }
    });

    this.query(MIDCLASS_DATA,params).then((data)=>{
      if(data.success){
        for(let i = 0; i< data.rows.length; i++) data.rows[i].key = i;
        this.setState({productClass:data});
      }
    });

    if (isEmpty(this.state.companyList)) {
      fetchCompany({}).then((data) => {
        this.setState({companyList: data.rows,});
      });
    }
  }

  componentDidMount() {
    const params = {};
    params.pagesize = 20;
    params.page = 1;
    this.fetchData(params);
  }

  fetchData(paramsData = {}) {
    const params = paramsData;

    // params.fileContent = this.props.itemId;

    this.setState({
      loading: true,
    });
    fetchDatum(params)
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
         loading2: false,
         dataList: data.rows,
         pagination,
       });
     });
  }

  fetchPersonalContractData() {
    let isSignedChannel = this.state.isSignedChannel;
    const params = {};
    params.channelId = JSON.parse(localStorage.user).relatedPartyId;
    fetchPersonalContract(params).then((data) => {
      if (data.success && !isEmpty(data.rows)) {
        isSignedChannel = true;
        this.setState({
          isSignedChannel,
        });
      }
    });
  }

  handleFetchData() {
    const params = this.params;
    const formData = this.props.form.getFieldsValue();
    const pagination = this.state.pagination;
    params.supplierId = formData.supplierId;
    params.prdDivision = formData.prdDivision;
    params.prdClass = formData.prdClass;
    params.fileContent = formData.fileContent;
    params.pagesize = 20;
    params.page = 1;
    pagination.current = 1;
    this.setState({
      loading2: true,
      pagination,
    });
    this.fetchData(params);
  }

  handleChange(pager) {
    const params = this.params;
    const pagination = pager;
    this.setState({
      pagination,
    });
    params.pagesize = pagination.pageSize;
    params.page = pagination.current;
    this.fetchData(params);
  }

  handleReset() {
    this.props.form.resetFields();
    const params = {};
    const pagination = this.state.pagination;
    params.pagesize = 20;
    params.page = 1;
    pagination.current = 1;
    this.setState({
      pagination,
    });
    this.fetchData(params);
  }

  params = {}

  dateFormat(dateStr) {
    let str = '';
    if (dateStr) {
      const date = new Date(dateStr);
      str = `${date.getFullYear()}/${date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}/${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()}`;
    }
    return str;
  }

  render() {
    const {
      form,
    } = this.props;
    const {
      getFieldDecorator,
    } = form;
    const {
      codeList,
      pagination,
      dataList,
      loading,
      loading2,
      isSignedChannel,
      companyList,
    } = this.state;

    if (!isEmpty(companyList)) {
      companyList.map((n, i) => {
        const data = n;
        data.key = i + 1;
        data.value = data.supplierId;
        data.description = data.name;
      });
    }

    const productDivision = this.state.productDivision || {};
    const productClass = this.state.productClass || {};

    const columns = [
      {
        title: '下载',
        dataIndex: 'fileId',
        key: 'fileId',
        render: (text, record) => {
          const param = {
            fileId: record.fileId,
            access_token: localStorage.access_token,
          };
          let downloadButton;
          if (isSignedChannel && record.fileId !== undefined && record.fileId !== null) {
            downloadButton = (
              <a
                onClick={() => {
                  window.location.href = `/api/fms/sys/attach/file/detail?${stringify(param)}`;
                  updateDowloadTimes({ lineId: record.lineId });
                }}
                className='download02'
                style={{ display: 'inline-block', textAlign: 'center', width: '100%' ,height:'24px'}}
              >
                {/* <img src={icon02} style={{ display: 'inline-block' }} alt="下载" /> */}
              </a>
            );
          } else {
            downloadButton = (
              <a
                style={{ display: 'inline-block', textAlign: 'center', width: '100%', cursor: 'not-allowed' }}
              >
                <img src={icon01} style={{ display: 'inline-block' }} alt="下载" />
              </a>
            );
          }
          return (downloadButton);
        },
      }, {
        title: '关联课程',
        dataIndex: 'topic',
      }, {
        title: '文件内容',
        dataIndex: 'fileContent',
        render: (text, record, index) => {
          return <div style={{textAlign:'left'}}>{text}</div>;
        }
      }, {
        title: '文件大小',
        dataIndex: 'fileSize',
        render: text => (`${text}kb`),
      }, {
        title: '更新时间',
        dataIndex: 'lastUpdateDate',
        render: text => (isEmpty(text) ? '' : moment(text).format('YYYY-MM-DD HH:mm:ss')),
      },
    ];

    return (
      <Content className={`${style.container} ${style.datum}`}>
        <Row className={`${style.container} ${style['background-white']}`}>
          <Form layout="inline" >
            <Row className={`${style['margin-top']}`} style={{ marginBottom: 12 }}>
              <MySelect form={form} name="supplierId" dataSource={companyList} placeholder="产品公司" style={{ width: 180 }} />
              <FormItem >
                {getFieldDecorator('prdDivision')(
                  <Select placeholder="产品大分类" style={{ width:180  }}>
                    {
                      productDivision.rows &&
                      productDivision.rows.length > 0 &&
                      productDivision.rows.map((item)=>
                        <Select.Option key={item.value} value={item.value} >{item.meaning}</Select.Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem >
                {getFieldDecorator('prdClass')(
                  <Select placeholder="产品中分类" style={{ width:180  }}>
                    {
                      productClass.rows &&
                      productClass.rows.length > 0 &&
                      productClass.rows.map((item)=>
                        <Select.Option key={item.value} value={item.value} >{item.meaning}</Select.Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem >
                {getFieldDecorator('fileContent',
                  {initialValue: this.props.itemId || '',}
                )(<Input placeholder="文件内容" style={{ width: 180 }} />)}
              </FormItem>
              <Button className={`${style.btn} ${style.blank} ${style.right}`} type="default"  style={{ height: 40,width: 160}}  onClick={this.handleReset}>全部</Button>
              <Button className={`${style.btn} ${style.search} ${style.right}`} type="default"  style={{ height: 40,width: 160}} loading={loading2} htmlType="submit" onClick={this.handleFetchData}>查询</Button>
            </Row>
          </Form>
        </Row>
        <Row className={`${style.container} ${style['background-white']}`}>
          <Table pagination={pagination} columns={columns}
            dataSource={dataList} scroll={{x:'100%'}}
            loading={loading} bordered
            onChange={this.handleChange}
          />
        </Row>
      </Content>
    );
  }
}

const Datum = Form.create()(DatumComponent);

export default connect()(Datum);
