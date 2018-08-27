/*
 * view 工作台-我的团队
 * @author:Lijun
 * @version:20170704
 */
import React, { Component, PropTypes } from 'react';
import { Layout, Row } from 'antd';
import { isEmpty } from 'lodash';
import styles from '../../styles/channelTeam.css';

const { Header, Content } = Layout;

class Banner extends Component {
  render() {
    const {
    className,
    description,
    title,
    enDesc,
    href,
    isViewMore,
    children,
    } = this.props;
    return (
      <Header className={`${styles.banner} ${styles.header} ${className}`}>
        <Row className={styles.frame}>
          <div className={styles['banner-desc']}>
            <div>
              <div className={`${styles.title} ${isEmpty(title) ? styles[title] : ''}`} />
              {children}
              {isViewMore ? <Row style={{ marginTop: 42 }}>
                <a className={`${styles.right}`} href={href}>
                  <h3 className={`${styles.left} ${styles['color-white']}`} style={{ lineHeight: '32px', margin: 'initial' }}>了解更多</h3>
                  <i className={`${styles.left} ${styles.icon} ${styles['icon-more-right']}`} />
                </a>
              </Row> : ''}
            </div>
          </div>
        </Row>
      </Header>
    );
  }
}

Banner.propTypes = {
  className: PropTypes.string,
  description: PropTypes.array,
  title: PropTypes.string,
  enDesc: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.node,
};

export default Banner;
