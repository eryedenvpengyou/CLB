import React, { Component, PropTypes } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Col, Layout, Row } from 'antd';
import MainModuleFrame from './MainModuleFrame';
import style from '../../styles/database.css';

const { Content } = Layout;
//废弃
class Tab extends Component {
  render() {
    const {
      children,
      active,
      mainChild,
      className,
    } = this.props;
    const items = [
      <a
        className={active === 'commonData' ? style.active : ''}
        style={{ borderLeft: '1px solid #ccc', borderRadius: '5% 0 0 5%' }}
        href="/#/database/commonData/*/*"
        key="t0"
      >
        通用资料
      </a>,
      <a
        className={active === 'productionData' ? style.active : ''}
        style={{ borderRight: '1px solid #ccc', borderRadius: '0 5% 5% 0' }}
        href="/#/database/productionData"
        key="t1"
      >
        产品资料
      </a>,
    ];
    const tabClassName = `${style.tab} ${className}`;
    return (
      <div className={`${style.database} ${style.main}`}>
        <Content style={{ width: '1200px', margin: '12px auto', padding: '12px', background: '#efefef' }}>
          <div className={tabClassName} >
            {items}
          </div>
          {children}
        </Content>
        {mainChild ? (<MainModuleFrame moduleName={active.replace('Data', '-data')}>
          {mainChild}
        </MainModuleFrame>) : ''}
      </div>
    );
  }
}

Tab.propTypes = {
  active: PropTypes.string.isRequired,
  mainChild: PropTypes.element,
  className: PropTypes.string,
};

Tab.defaultProps = {
  className: '',
};

export default Tab;
