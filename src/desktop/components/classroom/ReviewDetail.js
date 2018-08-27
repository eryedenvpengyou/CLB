/*
 * show 往期回顾详情
 * @author:zhouting
 * @version:20170525
 */
import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Spin } from 'antd';
import { fetchReviewDetail } from '../../services/classroom.js';
import style from '../../styles/classroom.css';
import imageText from '../../styles/production.css';
import Download from '../common/Download';
/* import img2 from '../../styles/images/image2.png';*/

const { Content } = Layout;

class ReviewDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: undefined,
    };
  }

  componentDidMount() {
    const articleId = this.props.itemId;
    const params = {};
    params.articleId = articleId;
    this.fetchData(params);
  }

  fetchData(params) {
    this.setState({
      loading: true,
    });
    fetchReviewDetail(params)
     .then((data) => {
       const d = data;
       this.setState({
         loading: false,
         data: d,
       });
     });
  }

  render() {
    const {
      data,
      loading,
    } = this.state;

    const content = '';
    let date;
    let dateStr = '';
    if (data) {
      date = data.releaseDate ? new Date(data.releaseDate) : undefined;
      dateStr = date ? `发布时间：${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日` : '';
      //let ele = document.createElement('div');
      //ele.setAttribute('id','imageText_none');
      //ele.style.display = 'none';
      //document.getElementsByClassName(style.container)[1].appendChild(ele);
      //document.getElementById('imageText_none').innerHTML = data.content;
    }
    return (
      <Content className={`${style.container} ${style['review-detail']}`}>
        <Row className={`${style.container} ${style['background-white']}`}>
          {data ?
            (
              <div className={style['margin-top']}>
                <Row className={`${style['text-center']}`}><h3>{data.title}</h3></Row>
                <Row className={`${style['text-center']}`}>{`${dateStr}`}</Row>
                <div className={imageText.imageText} dangerouslySetInnerHTML={{ __html: data.content }} />
                {
                  data.affixFileId &&
                  <div style={{margin:'12px 0px'}}>
                    附件：
                    <Download fileId={data.affixFileId} />
                  </div>
                }
              </div>
            )
            : 
            (
              <div className="ant-table-placeholder">
                <span>
                  <i className="anticon anticon-frown-o" />
                  暂无数据
                </span>
              </div>
            )
            }
        </Row>
      </Content>
    );
  }
}
export default connect()(ReviewDetail);
