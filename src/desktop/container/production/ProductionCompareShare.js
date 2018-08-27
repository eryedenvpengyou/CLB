/**
 * wanjun.feng@hand-china.com
 * 2017/7/24
 */

import React from 'react';
import { Col } from 'antd';
import ProductionCompareComponent from '../../components/production/ProductionCompare';
import styles from '../../styles/production.css';

class ProductionCompare extends React.Component {
  constructor(props) {
    super(props);
    localStorage.compareInfo = '{"'+decodeURI(this.props.params.compareInfo).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"')
        .replace('itemList', 'item2List":[').replace(/itemList/g, '')
        .replace('\[0\]', '{"').replace(/\[0\]/g, '')
        .replace('\[1\]', '"},{"').replace(/\[1\]/g, '')
        .replace('\[2\]', '"},{"').replace(/\[2\]/g, '')
        .replace(/\[/g, '').replace(/\]/g, '').replace(/\,\"\"/g, '')
        .replace('item2List":', 'itemList":[') + '"}]}';
    localStorage.access_token = JSON.parse(localStorage.compareInfo).accessToken;
  }
  render() {
    return (
      <div style={{width: '100%'}}>
        <Col className={styles.content}>
          <ProductionCompareComponent infoDisplay='none' />
        </Col>
      </div>
    );
  }
}

export default (ProductionCompare);
