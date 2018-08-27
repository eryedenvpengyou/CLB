/*
 * show 资料库-产品资料
 * @author:lijun
 * @version:20170627
 */
import React from 'react';
import { connect } from 'dva';
import { stringify } from 'qs';
import { isEmpty, round } from 'lodash';
import { Form, Row, Table, Button, Input, Select } from 'antd';
import MySelect from './Select';
import moment from 'moment';
import {HTTP_HEADERS} from '../../constants';
import request from '../../utils/request';
import style from '../../styles/database.css';
import icon02 from '../../styles/images/mine/icon02.png';
import { fetchProductionData , updateProductionDataDowloadTimes as updateDowloadTimes } from '../../services/database.js';
import { fetchCompany } from '../../services/order.js';

const FormItem = Form.Item;

const BIGCLASS_DATA = '/api/commons/lov/PRD_DIVISION'; //产品大分类LOV
const MIDCLASS_DATA = '/api/commons/lov/PRD_CLASS'; //产品中分类LOV

class ProductionDataComponent extends React.Component {
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
      companyList: [],
    };
//给方法绑定 tihs对象
    [
      'render',
      'handleSearch',
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
        this.setState({
          companyList: data.rows,
        });
      });
    }
  }

  componentDidMount() {
    const params = {};
    params.pageSize = 20;
    params.page = 1;
    this.fetchData(params);
  }

  fetchData(paramsData) {
    const params = paramsData;
    params.type = 'ITEM';
    this.setState({ loading: true });
    fetchProductionData(params)
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
    params.supplierId = Number(formData.supplierId);
    params.bigClass = formData.bigClass;
    params.midClass = formData.midClass;
    params.fileName = formData.fileName;
    params.itemName = formData.itemName;
    params.type = 'ITEM';
    params.pageSize = 20;
    params.page = 1;
    pagination.current = 1;
    this.setState({ loading2: true, pagination });
    this.fetchData(params);
  }

  handleReset() {
    this.props.form.resetFields();
    this.params = {};
    const params = {};
    const pagination = this.state.pagination;
    params.pageSize = 20;
    params.page = 1;
    pagination.current = 1;
    this.setState({
      pagination,
    });
    this.fetchData(params);
  }

  handleChange(pager) {
    const params = this.params;
    const formData = this.props.form.getFieldsValue();
    params.supplierId = Number(formData.supplierId);
    params.bigClass = formData.bigClass;
    params.midClass = formData.midClass;
    params.fileName = formData.fileName;
    params.itemName = formData.itemName;
    params.type = 'ITEM';
    const pagination = pager;
    this.setState({
      pagination,
    });
    params.pageSize = pagination.pageSize;
    params.page = pagination.current;
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
      loading2,
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

    // form
    const {
      getFieldDecorator,
    } = form;
    const productDivision = this.state.productDivision || {};
    const productClass = this.state.productClass || {};
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
        title: '产品名称',
        dataIndex: 'itemName',
      }, {
        title: '文件内容',
        dataIndex: 'fileName',
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
        dataIndex: 'lastUpdateDate',
        render: text => (isEmpty(text) ? '' : moment(text).format('YYYY-MM-DD HH:mm:ss')),
      },
    ];

    return (
        <div className={`${style['production-data']}`}>
            <Form layout="inline" className={style.search_form}>
              <Row>
                <MySelect form={form} name="supplierId" dataSource={companyList} placeholder="产品公司" style={{ width: 150 }} />
                <FormItem >
                  {getFieldDecorator('bigClass')(
                    <Select placeholder="产品大分类" style={{ width:150  }}>
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
                  {getFieldDecorator('midClass')(
                    <Select placeholder="产品中分类" style={{ width:150  }}>
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
                <FormItem>
                  {getFieldDecorator('itemName')(<Input placeholder="产品名称" style={{ width: 150 }} />)}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('fileName')(<Input placeholder="文件内容" style={{ width: 150 }} />)}
                </FormItem>
                <Button className={`${style.btn} ${style.blank} ${style.right}`} type="default" onClick={this.handleReset}>全部</Button>
                <Button className={`${style.btn} ${style.search} ${style.right}`} type="default" loading={loading2} htmlType="submit" onClick={this.handleSearch}>查询</Button>
              </Row>

            </Form>
          <div>
            <Table
              pagination={this.state.pagination} columns={columns}
              dataSource={this.state.dataList} scroll={{x:'100%'}}
              onChange={this.handleChange} bordered
              loading={this.state.loading} />
          </div>
        </div>
    );
  }
}

const ProductionData = Form.create()(ProductionDataComponent);

export default connect()(ProductionData);
