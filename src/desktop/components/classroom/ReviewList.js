/*
 * view 财课堂-往期回顾-列表
 * @author:Lijun
 * @version:20170705
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import isEmpty from 'lodash/isEmpty';
import { Button, Col, Layout, Pagination, Row, Spin } from 'antd';
import style from '../../styles/classroom.css';
import { fetchReviewList as fetchReview } from '../../services/classroom.js';
import { PICTURE_ADDRESS } from '../../constants';
import img1 from '../../styles/images/image1.png';

const { Content } = Layout;

class ReviewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataList: [],
      pagination: {
        showSizeChanger: true,
        current: 1,
        total: 0,
      },
    };

    [
      'render',
      'handleChange',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const params = {};
    params.pagesize = 10;
    params.page = 1;
    this.fetchData(params);
  }

  handleLocation() {
    this.$this.props.dispatch(routerRedux.push(this.url));
  }

  fetchData(paramsData = {}) {
    const params = paramsData;
    params.releasePosition = 'WQHG';
    this.setState({
      loading: true,
    });
    fetchReview(params)
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

  render() {
    const {
      dataList,
      pagination,
      loading,
    } = this.state;
    const items = [];

    if (!isEmpty(dataList)) {
      dataList.map((row, i) => {
        items.push(
          <Row key={i} className={`${i === 0 ? '' : style['margin-top']} ${style.container} ${style['box-shadow']} ${style.card}`}>
            <Col xs={6} sm={6} md={6} lg={6} xl={6} style={{ overflow: 'hidden' }}>
              <a className={`${style['img-container']}`} href={`/#/classroom/reviewDetail/classroom/${row.articleId}`}><img src={isEmpty(row.coverFilePath) ? img1 : (PICTURE_ADDRESS + row.coverFilePath)} alt="" /></a>
            </Col>
            <Col xs={18} sm={18} md={18} lg={18} xl={18} className={style.article} onClick={this.handleLocation.bind({ $this: this, url: `/classroom/reviewDetail/classroom/${row.articleId}` })}>
              <h3>{row.title}</h3>
              <p>
                {row.introduce}
              </p>
            </Col>
          </Row>,
        );
      });
    }

    return (
      <Content className={`${style.container} ${style['review-list']}`}>
        <Row className={`${style['background-white']}`}>
          {items}
        </Row>
        <div className={style.clear} />
        <Row className={`${style['background-white']} ${style['margin-top']} ${style.container} ${style['text-center']}`}>
          <div className={`${style['inline-block']}`}>
            {!isEmpty(dataList) ?
              <Pagination
                showQuickJumper
                defaultCurrent={1}
                total={pagination.total}
                showSizeChanger
                current={pagination.current}
                className={style.pagination}
                onChange={this.handleChange}
              />
              : (
                <div className="ant-table-placeholder">
                  <span>
                    <i className="anticon anticon-frown-o" />
                    暂无数据
                  </span>
                </div>
              )
            }
          </div>
        </Row>
      </Content>
    );
  }
}

export default connect()(ReviewList);
