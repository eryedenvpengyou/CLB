import React, { Component, PropTypes } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Col, Row } from 'antd';
import style from '../../styles/classroom.css';

class Tab extends Component {
  render() {
    const {
      children,
      active,
    } = this.props;
    const items = [
      <a
        className={active === 'course' ? style.active : ''}
        style={{ borderLeft: '1px solid #ccc', borderRadius: '5% 0 0 5%' }}
        href="#/classroom/course"
      >
        培训课堂
      </a>,
      <a
        className={active === 'datum' ? style.active : ''}
        href="#/classroom/datum"
      >
        培训资料
      </a>,
      <a
        className={active === 'business' ? style.active : ''}
        style={{ borderRight: '1px solid #ccc', borderRadius: '0 5% 5% 0' }}
        href="#/classroom/business"
      >
        培训支援
      </a>,
    ];
    return (
      <div className={`${style.classroom} ${style.main}`}>
        <Row>
          <Col xs={16} sm={16} md={16} lg={16} xl={16} offset={4} style={{ backgroundColor: '#efefef', padding: 12 }}>
            <div className={style.tab} >
              {items}
            </div>
            {children}
          </Col>
        </Row>
      </div>
    );
  }
}

Tab.propTypes = {
  active: PropTypes.string,
};

export default Tab;
