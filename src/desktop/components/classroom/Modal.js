import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { isEmpty, isFunction } from 'lodash';
import { Button, Col, Icon, Row, Layout, Modal as AntModal } from 'antd';
import styles from '../../styles/classroom.css';

const { Content } = Layout;

class ModalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      delay: this.props.delay,
    };

    [
      'render',
      'handleOk',
      'handleAutoClose',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    if (this.props.autoClose) {
      this.handleAutoClose(this.props.handleOk);
    }
  }

  handleAutoClose(callback) {
    let timer;
    clearInterval(timer);
    timer = setInterval(function() {
      let count = this.state.delay;
      count -= 1;
      this.setState({ delay: count });
      if (count < 1) {
        clearInterval(timer);
        if (isFunction(callback)) {
          callback();
        }
        this.props.close();
        clearInterval(timer);
      }
    }.bind(this), 1000);
  }

  handleOk() {
    if (isFunction(this.props.handleOk)) {
      this.props.handleOk();
    }
    this.props.close();
  }

  typeConfig = {
    success: {
      icon: 'check',
      color: '#d1b97f',
    },
    error: {
      icon: 'close',
      color: '#FF6C6C',
    },
    waring: {
      icon: 'exclamation',
      color: '#F8D11C',
    },
    info: {
      icon: '',
    },
  }

  render() {
    const {
      visible,
      delay,
    } = this.state;
    const {
      type,
      className,
      isOk,
      isCancel,
      okBtnText,
      cancelBtnText,
      content,
      closable,
      autoClose,
    } = this.props;
    return (
      <div className={`${styles['classroom-tip-modal-container']}`}>
        <AntModal
          wrapClassName={`${styles.classroom} ${styles['classroom-tip-modal']} ${className}`}
          visible={visible}
          onOK={this.handleOk}
          onCancel={() => this.props.close()}
          footer={null}
          closable={closable}
        >
          <Layout>
            <Row style={{background:JSON.parse(localStorage.theme).themeColor}} className={styles.header}>提示</Row>
            <Content className={`${styles['background-white']}`}>
              <Row className={styles.icon}>
                <Icon style={{ color: `${this.typeConfig[type].color}`, fontSize: 110 }} type={`${this.typeConfig[type].icon}-circle-o`} />
              </Row>
              <Row className={styles.content}>{content}</Row>
              <Row className={styles.footer}>
                {isCancel ? <Button className={`${styles.btn} ${styles.blank}`} onClick={this.props.close()} style={{ width: 140, height: 40, background:JSON.parse(localStorage.theme).themeColor,marginRight: `${isOk ? '10%' : 'auto'}` }}>{cancelBtnText}</Button> : ''}
                {isOk ? <Button className={`${styles.btn}`} onClick={this.handleOk} style={{ width: 140, height: 40,background:JSON.parse(localStorage.theme).themeColor }}>{`${okBtnText}${autoClose ? ` (${delay}s)` : ''}`}</Button> : ''}
              </Row>
            </Content>
          </Layout>
        </AntModal>
      </div>
    );
  }
}

ModalComponent.propTypes = {
  handleOk: PropTypes.func,
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  okBtnText: PropTypes.string,
  cancelBtnText: PropTypes.string,
  closable: PropTypes.bool,
  delay: PropTypes.number,
  autoClose: PropTypes.bool,
};

ModalComponent.defaultProps = {
  type: 'success',
  handleOk: () => {},
  className: '',
  content: '',
  okBtnText: '知道了',
  cancelBtnText: '取消',
  delay: 3,
};

class Modal {
  handleClose(obj) {
    const unmountResult = ReactDOM.unmountComponentAtNode(obj);
    if (unmountResult && obj.parentNode) {
      obj.parentNode.removeChild(obj);
    }
  }

  render(props) {
    const div = document.createElement('div');
    ReactDOM.render(<ModalComponent {...props} close={this.handleClose.bind(this, div)} type={props.type} />, div);
    return { destory: this.handleClose };
  }

  static success(props) {
    const propTypes = Object.assign({}, {
      type: 'success',
    }, props);
    const modal = new Modal();
    modal.render(propTypes);
  }

  static error(props) {
    const propTypes = Object.assign({}, {
      type: 'error',
    }, props);
    const modal = new Modal();
    modal.render(propTypes);
  }

  static info(props) {
    const propTypes = Object.assign({}, {
      type: 'info',
    }, props);
    const modal = new Modal();
    modal.render(propTypes);
  }
}

export default Modal;
