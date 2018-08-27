/**
 * Created by FengWanJun  on 2017/6/8.
 */

import React from 'react';
import {stringify} from 'qs';
import {Button, Icon} from 'antd';


class Download extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var body = {
      "fileId": this.props.fileId,
      "access_token": localStorage.access_token
    };
    return (
      this.props.midClass == 'MXJJ' ?
        <a href={this.props.filePath} >
          {this.props.children ? this.props.children : <Button type="default"><Icon type="download" style={{ color: '#d1b97f' }} /></Button>}
        </a> :
        <a href={"/api/fms/sys/attach/file/detail?" + stringify(body)} >
          {this.props.children ? this.props.children : <Button type="default"><Icon type="download" style={{ color: '#d1b97f' }} /></Button>}
        </a> 
    )
  }
}

export default (Download)
