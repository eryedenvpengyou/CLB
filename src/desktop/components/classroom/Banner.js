/*
 * view 财课堂
 * @author:Lijun
 * @version:20170704
 */
import React, { Component, PropTypes } from 'react';
import { Layout, Row } from 'antd';
import styles from '../../styles/classroom.css';

const { Header, Content } = Layout;

class Banner extends Component {
  render() {
    const {
    className,
    description,
    title,
    enDesc,
    href,
    } = this.props;
    return (
      <Header className={`${styles.banner} ${styles.header} ${className}`}>
        <Row className={styles.frame}>
          <div className={styles['banner-desc']}>
            <div>
              <div className={`${styles.title} ${styles[title]}`} />
              <h6 style={{ margin: '12px auto 8px auto', color: '#cfcfcc' }}>{enDesc}</h6>
              <h4 style={{ margin: '8px auto', color: '#e7ddc6' }}>{description[0]}</h4>
              <h4 style={{ color: '#e7ddc6' }}>{description[1]}</h4>
              <Row style={{ marginTop: 42 }}>
                <a className={`${styles.right}`} href={href}>
                  <h3 className={`${styles.left} ${styles['color-white']}`} style={{ lineHeight: '32px', margin: 'initial' }}>了解更多</h3>
                  <i className={`${styles.left} ${styles.icon} ${styles['icon-more-right']}`} />
                </a>
              </Row>
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
};

export default Banner;
