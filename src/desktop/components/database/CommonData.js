/*
 * view 资料库-通用资料
 * @author:lijun
 * @version:20170627
 */
import React from 'react';
import { connect } from 'dva';
import { stringify } from 'qs';
import { isEmpty, round } from 'lodash';
import { Col, Form, Row, Table, Button, Input } from 'antd';
import moment from 'moment';
import { getCode } from '../../services/code.js';
import Tab from './Tab';
import { handleTableChange } from '../../utils/table';
import Select from './Select';
import style from '../../styles/database.css';
import icon02 from '../../styles/images/mine/icon02.png';
import { fetchCommonData, updateCommonDataDowloadTimes as updateDowloadTimes } from '../../services/database.js';
import { fetchCompany } from '../../services/order.js';
import { getCodeMeaning } from '../../utils/common';

const FormItem = Form.Item;

class CommonDataComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codeList: {},
      dataList: [],
      pagination: {
        pageSize: 20,
      },
      loading: false,
      loading2: false,
      datumType: this.props.datumType,
      supplierId: !isNaN(this.props.supplierId) ? this.props.supplierId : undefined,
      companyList: [],
    };

    [
      'render',
      'handleSearch',
      'handleReset',
      'handleChange',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    const codeType = {
      dataType: 'SYS.DATA_TYPE', // 资料类型
      /* supply: 'COURSE.SUPPLIER_ID', // 产品公司 */
      dataUse: 'SYS.DATA_USER', // 用途分类
    };
    if (isEmpty(this.state.codeList)) {
      getCode(codeType).then((data) => {
        this.setState({ codeList: data });
      });
    }

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

    //从产品详情 跳转过来时，默认带 产品公司 参数过来，同时 资料类型默认为 服务表格
    const datumType = this.state.datumType;
    const supplierId = this.state.supplierId;
    const params = {};
    if (datumType) {
      // params.datumType = datumType === 'BDXZ' ? 'FWBG' : '';
      params.datumType = datumType;
    }
    if (supplierId) {
      params.supplierId = supplierId;
    }
    params.pageSize = 20;
    params.page = 1;
    this.fetchData(params);
  }

  fetchData(params) {
    this.setState({ loading: true });
    fetchCommonData(params)
     .then((data) => {
       const d = data;
       const pagination = this.state.pagination;
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

  handleSearch() {
    const params = this.params;
    const formData = this.props.form.getFieldsValue();
    const pagination = this.state.pagination;
    params.supplierId = formData.supplierId;
    params.datumType = formData.datumType;
    params.useType = formData.useType;
    params.content = formData.content;
    params.pageSize = 20;
    params.page = 1;
    pagination.current = 1;
    this.setState({ loading2: true, pagination });
    this.fetchData(params);
  }

  handleReset() {
    this.props.form.resetFields();
    const params = {};
    const pagination = this.state.pagination;
    params.pageSize = 20;
    params.page = 1;
    pagination.current = 1;
    this.setState({
      pagination,
      datumType: undefined,
      supplierId: undefined,
    });
    this.fetchData(params);
  }

  handleChange(pager) {
    const params = this.params;
    const formData = this.props.form.getFieldsValue();
    params.supplierId = formData.supplierId;
    params.datumType = formData.datumType;
    params.useType = formData.useType;
    params.content = formData.content;
    const pagination = pager;
    this.setState({
      pagination,
    });
    params.pageSize = pagination.pageSize;
    params.page = pagination.current;
    this.fetchData(params);
  }

  params = {}

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

  render() {
    // props
    const {
      form,
    } = this.props;
    // state
    const {
      codeList,
      loading,
      loading2,
      datumType,
      supplierId,
      companyList,
    } = this.state;

    // form
    const {
      getFieldDecorator,
    } = form;

    // 表格
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
          return (
            <a
              onClick={() => {
                window.location.href = `/api/fms/sys/attach/file/detail?${stringify(param)}`;
                updateDowloadTimes({ commonFileId: record.commonFileId });
              }}
              className='download02'
              style={{ display: 'inline-block', textAlign: 'center', width: '100%' ,height:'24px'}}
            >
              {/* <img className={style.download02} src={icon02} style={{ display: 'inline-block' }} alt="下载" /> */}
            </a>);
        },
      }, {
        title: '产品公司',
        dataIndex: 'name',
      }, {
        title: '资料类型',
        dataIndex: 'datumType',
        render: text => getCodeMeaning(text, codeList.dataType),
      }, {
        title: '用途分类',
        dataIndex: 'useType',
        render: text => getCodeMeaning(text, codeList.dataUse),
      }, {
        title: '文件内容',
        dataIndex: 'content',
        render: (text, record, index) => {
          return <div style={{textAlign:'left'}}>{text}</div>;
        }
      }, {
        title: '文件大小',
        dataIndex: 'fileSize',
        render: (text) => {
          const sizeObj = this.calcFileSize(Number(text), 'B');
          return `${round(sizeObj.value, 1)}${sizeObj.type}`;
        },
      }, {
        title: '更新时间',
        dataIndex: 'uploadDate',
        render: text => (isEmpty(text) ? '' : moment(text).format('YYYY-MM-DD HH:mm:ss')),
      },
    ];

    return (
      <div className={`${style['common-data']}`}>
        <Form layout="inline" className={style.search_form}>
          <Row>
            <Select form={form} name="datumType" initialValue={datumType} dataSource={codeList ? codeList.dataType : []} placeholder="资料类型" style={{ width: 180 }} />
            <Select form={form} name="supplierId" initialValue={supplierId} dataSource={companyList} placeholder="产品公司" style={{ width: 180 }} />
            <Select form={form} name="useType" dataSource={codeList ? codeList.dataUse : []} placeholder="用途分类" style={{ width: 180 }} />
            <FormItem >
              {getFieldDecorator('content')(<Input placeholder="文件内容" style={{ width: 180 }} />)}
            </FormItem>
            <Button className={`${style.btn} ${style.blank} ${style.right}`} type="default" onClick={this.handleReset}>全部</Button>
            <Button className={`${style.btn} ${style.search} ${style.right}`} type="default" loading={loading2} htmlType="submit" onClick={this.handleSearch}>查询</Button>
          </Row>
        </Form>
        <div>
          <Table
            pagination={this.state.pagination} columns={columns}
            dataSource={this.state.dataList} bordered
            onChange={this.handleChange} scroll={{ x: '100%' }}
          />
        </div>
      </div>
    );
  }
}

const CommonData = Form.create()(CommonDataComponent);

export default connect()(CommonData);
