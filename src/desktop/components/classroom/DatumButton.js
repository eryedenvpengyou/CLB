/*
 * view 财课堂
 * @author:Lijun
 * @version:20170704
 */
import React, { Component, PropTypes } from 'react';
import { Button } from 'antd';
import styles from '../../styles/classroom.css';

class DatumButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonIconImg: 'icon-datum',
    };

    [
      'render',
      'handleButtonIconChange',
      'handleButtonIconInit',
      'handleClick',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  handleButtonIconInit() {
    if (this.state.buttonIconImg !== 'icon-datum') {
      this.setState({
        buttonIconImg: 'icon-datum',
      });
    }
  }

  handleButtonIconChange() {
    if (this.state.buttonIconImg !== 'icon-datum-white') {
      this.setState({
        buttonIconImg: 'icon-datum-white',
      });
    }
  }

  handleClick() {
    location.hash = '/classroom/datum';
  }

  render() {
    const {
      buttonIconImg,
    } = this.state;
    const {
      className,
      style,
    } = this.props;
    const mainStyle = Object.assign({}, {
      width: 170,
      height: 50,
      fontSize: 21,
      boxShadow: '0 1px 6px rgba(0,0,0,.2)',
      borderRadius: '2%',
    }, style);
    return (
      <Button
        className={`${styles.btn} ${styles.blank} ${styles['datum-btn']} ${className}`}
        /* onMouseOver={this.handleButtonIconChange}
        onMouseLeave={this.handleButtonIconInit}*/
        onClick={this.handleClick}
        style={mainStyle}
      >
        <i className={`${styles.icon} ${styles[buttonIconImg]}`} />
        <span style={{ marginLeft: 50 }}>培训资料</span>
      </Button>
    );
  }
}

DatumButton.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

DatumButton.defaultProps = {
  style: {},
};

export default DatumButton;
