import React from 'react';
import { Breadcrumb } from 'antd';
import styles from '../../styles/qa.css';

class QaBread extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={styles.qa_bread}>
        <span className="pull-left" style={{color:'#333',paddingLeft:5}}>
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

export default (QaBread);
