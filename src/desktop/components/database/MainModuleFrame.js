import React, { Component, PropTypes } from 'react';
import { Col, Row } from 'antd';
import style from '../../styles/database.css';
//废弃
class MainModuleFrame extends Component {
  render() {
    const {
      children,
      moduleName,
    } = this.props;
    return (
      <Row>
        <Col xs={16} sm={16} md={16} lg={16} xl={16} offset={4} style={{ backgroundColor: '#efefef', padding: 12 }}>
          <div className={style[moduleName]}>
            {children}
          </div>
        </Col>
      </Row>
    );
  }
}

MainModuleFrame.propTypes = {
  moduleName: PropTypes.string,
};

export default MainModuleFrame;
