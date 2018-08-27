import React, { Component, PropTypes } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Col, Row } from 'antd';
import styles from '../../styles/qa.css';

class Tab extends Component {
  render() {
    const {children, active, } = this.props;
    const items = [
      <a
        className={active === 'support' ? styles.active : ''}
        style={{ borderLeft: '1px solid #ccc', borderRadius: '5% 0 0 5%',fontSize:'22px' }}
        href="#/portal/reservation/1"
      >
        业务支援
      </a>,
      <a
        className={active === 'service' ? styles.active : ''}
        style={{ borderRight: '1px solid #ccc', borderRadius: '0 5% 5% 0',fontSize:'22px'  }}
        href="#/portal/reservation/2"
      >
        增值服务
      </a>
    ];
    return (
      <div className={`${styles.qa} ${styles.content}`}>
        <div className={styles.qa}>
          <div className={styles.tab} >
            {items}
          </div>
          {children}
        </div>
      </div>
    );
  }
}

export default Tab;
