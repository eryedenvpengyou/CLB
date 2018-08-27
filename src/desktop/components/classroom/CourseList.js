/*
 * view 财课堂
 * @author:Lijun
 * @version:20170705
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import isEmpty from 'lodash/isEmpty';
import { Button, Form, Input, Layout, Row, Table, Select } from 'antd';
import MySelect from './Select';
import moment from 'moment';
import style from '../../styles/classroom.css';
import { fetchCourse as course } from '../../services/course.js';
import { fetchCompany } from '../../services/order.js';
import ApplyPopup from './ApplyPopup';
import EvaluationPopup from './EvaluationPopup';
import {HTTP_HEADERS} from '../../constants';
import request from '../../utils/request';
import DatumButton from './DatumButton';

const { Content } = Layout;
const FormItem = Form.Item;

const BIGCLASS_DATA = '/api/commons/lov/PRD_DIVISION'; //产品大分类LOV
const MIDCLASS_DATA = '/api/commons/lov/PRD_CLASS'; //产品中分类LOV

class CourseListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loading2: false,
      dataList: [],
      pagination: {},
      codeList: {},
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
    params.pagesize = 9999999;
    params.page = 1;
    this.fetchData(params);
  }

  fetchData(paramsData = {}) {
    const params = paramsData;
    params.pcFlag = 'Y';
    this.setState({
      loading: true,
    });
    course(params)
     .then((data) => {
       const d = data;
       const pagination = this.state.pagination;
       const datalist = [];
       let count = 0;
       pagination.pageSize = 20;
       pagination.total = d.total;
       d.rows.map((rowData, i) => {
         rowData.key = i + 1;
         if (this.props.pageKey === 'boutiqueVideo' && rowData.boutiqueVideo === 'Y') {
           datalist.push(rowData);
           count += 1;
         }
       });

       if (this.props.pageKey === 'boutiqueVideo' ) {
         pagination.total = count;
       }
       this.setState({
         loading: false,
         loading2: false,
         dataList: this.props.pageKey === 'boutiqueVideo' ? datalist : data.rows,
         pagination,
       });
     });
  }

  handleLocation() {
    this.$this.props.dispatch(routerRedux.push(this.url));
  }

  handleFetchData() {
    const params = this.params;
    const formData = this.props.form.getFieldsValue();
    const pagination = this.state.pagination;
    params.supplierId = formData.supplierId;
    params.prdDivision = formData.prdDivision;
    params.prdClass = formData.prdClass;
    params.topic = formData.topic;
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
        title: '时间',
        dataIndex: 'courseDate',
        render: (text, record) => {
          const date = new Date(text);
          const endDate = new Date(Date.parse(date) + (record.duration ?
          record.duration * 60 * 1000 : 0));
          return (
            <span>
              {moment(text).format('YYYY年MM月DD日')}
              <br />
              {`${moment(text).format('HH:mm')}-${moment(endDate).format('HH:mm')}`}
            </span>);
        },
      },
      {
        title: '课程主题',
        dataIndex: 'topic',
        render: (text, record) => <a className={style.color} href={`/#/classroom/trainingCourseDetail/${record.courseId}`}>{text}</a>,
      }, {
        title: '讲师',
        dataIndex: 'lecturer',
      }, {
        title: '地点',
        dataIndex: 'address',
      }, {
        title: '费用',
        dataIndex: 'price',
        render: text => (Number(text) === 0 ? '0.00' : text),
      }, {
        title: '操作',
        render: (text, rowData) => {
          const status = rowData.status;
          let button;
          if (status === 'NOTSTARTED') {
            button = (
              <ApplyPopup rowData={rowData} fetchData={this.handleFetchData} />
            );
          } else if (status === 'COMPLETE' && rowData.enrollFlag === 'Y') {
            button = (
              <EvaluationPopup rowData={rowData} />
          );
          } else {
            button = (
              <Button className={`${style.btn} ${style.blank}`} size="large" onClick={this.handleLocation.bind({ $this: this, url: `/classroom/trainingCourseDetail/${rowData.courseId}` })}>
                <span>查看</span>
              </Button>
            );
          }
          return (<div className={style['button-container']}>{button}</div>);
        },
      }
    ];

    return (
      <Content className={`${style.container} ${style['course-list']}`}>
        <Row className={`${style.container} ${style['background-white']}`}>
          <Form layout="inline">
            <Row style={{marginBottom:'15px'}}>
              <DatumButton style={{float:'left'}}/>
            </Row>
            <Row>
              <MySelect form={form} name="supplierId" dataSource={companyList} placeholder="产品公司" style={{ width: 170 }} />
              <FormItem >
                {getFieldDecorator('prdDivision')(
                  <Select placeholder="产品大分类" style={{ width:170  }}>
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
                  <Select placeholder="产品中分类" style={{ width:170  }}>
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
              <FormItem style={{ marginRight: 16 }}>
                {getFieldDecorator('topic')(<Input placeholder="课程主题" style={{ width: 170 }} />)}
              </FormItem>
              <Button className={`${style.btn} ${style.blank} ${style.right}`} type="default" style={{ height: 40,width: 160}} onClick={this.handleReset}>全部</Button>
              <Button className={`${style.btn} ${style.search} ${style.right}`} type="default" style={{ height: 40,width: 160}} loading={loading2} htmlType="submit" onClick={this.handleFetchData}>查询</Button>
            </Row>
          </Form>
        </Row>
        <Row className={`${style.container} ${style['background-white']}`}>
          <Table pagination={pagination} columns={columns}
            dataSource={dataList}
            loading={loading} bordered scroll={{x:'100%'}}
            onChange={this.handleChange} />
        </Row>
      </Content>
    );
  }
}

const CourseList = Form.create()(CourseListComponent);

export default connect()(CourseList);
