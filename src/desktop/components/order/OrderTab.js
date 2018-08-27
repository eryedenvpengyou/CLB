/**
 * Created by Detai on 2017/7/3.
 */
import React, { Component, PropTypes } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Col, Row } from 'antd';
import style from '../../styles/classroom.css';

class OrderTab extends Component {
  render() {
    const {
      children,
      active,
    } = this.props;
    const items = [
      <a
        className={active === 'personal' ? style.active : ''}
        style={{ borderLeft: '1px solid #ccc', borderRadius: '5% 0 0 5%' ,fontSize: '22px'}}
        href="#/order/summary/personal"
      >
        个人
      </a>,
      <a
        className={active === 'team' ? style.active : ''}
        href="#/order/summary/team" style={{fontSize: '22px'}}
      >
        团队
      </a>,
      <a
        className={active === 'introduction' ? style.active : ''}
        style={{ borderRight: '1px solid #ccc', borderRadius: '0 5% 5% 0',fontSize: '22px' }}
        href="#/order/summary/introduction"
      >
        转介绍
      </a>
    ];
    return (
      <div className={`${style.classroom} ${style.main}`}>
        <Row>
         <div className={style.tab} >
              {items}
            </div>
            {children}
        </Row>
      </div>
    );
  }
}

OrderTab.propTypes = {
  active: PropTypes.string,
};

export default OrderTab;



