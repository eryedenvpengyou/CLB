/**
 * wanjun.feng@hand-china.com
 * 2017/5/27
 */

import React from 'react';
import { Breadcrumb } from 'antd';
import styles from './BreadcrumbLayout.css';

class BreadcrumbLayout extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={styles.content}>
        <span className="pull-left" style={{color:'#333'}}>
          当前位置：
        </span>
        <Breadcrumb separator=">">
          {
            this.props.itemList.map(function(item, index) {
              return (
                <Breadcrumb.Item key={index+1} href={item.url}>
                  {item.name}
                </Breadcrumb.Item>
              );
            })
          }
        </Breadcrumb>
      </div>
    );
  }
}

export default (BreadcrumbLayout);
