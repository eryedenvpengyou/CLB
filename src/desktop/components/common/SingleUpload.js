/**
 * Created by Kitty on 2017/6/14.
 */

import React, { PropTypes } from 'react';
import { Upload, Button, Icon } from 'antd';
import { stringify } from 'qs';
import { pushFile } from '../../utils/common';

/**
 * 组件使用说明：
 *  1、可选参数
 *      -- modularName string 默认值为 'CNL',后台需要的参数。
 *      -- data {} 需要传到后台的参数。
 *        modularName参数其实 就是 data 里面的一个属性，为了方才有modularName 这个参数。
 *        也就是说，传了data就没必要传modularName了，也可以为了方便直接传modularName而不传data
 *         data 默认值为：{
 *            maxSize: 2000000,
 *            modularName: this.props.modularName?this.props.modularName:'CNL',
 *            allowType:'jpg;png;pdf;doc;xls;xlsx;docx',
 *         }
 *      -- index number 必输，从1开始
 *      -- rowData 当文件上传组件用在table里面时需要传的行数据参数
 *  2、 使用说明
 *    <Uploads ref='xxx' modularName='QA'/>  xxx用来获取文件列表
 *    例如需要获取 ref为 xxx 的Uploads 上传组件的值 ： this.refs.xxx.state.filelist
 *    Uploads 组件返回两个参数：一个是 fileList ，一个是successFile
 *      fileList: 在前端已选择的文件列表信息，包括后台返回的 response 对象信息。
 *      successFile： 已成功上传到服务器的 文件列表信息
 */

class SingleUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      successFile:{},
    }
  }
  handleChange(info) {
    const fileList = info.fileList;
    const successFile = info.file;
    if (this.props.rowData && this.props.name) {
      this.props.rowData[this.props.name] = successFile;
    }
    this.setState({fileList,successFile});
    if (fileList.length > 0) {
      document.getElementsByClassName("ant-upload ant-upload-select ant-upload-select-text")[this.props.index-1].style.display = 'none';
    } else {
      document.getElementsByClassName("ant-upload ant-upload-select ant-upload-select-text")[this.props.index-1].style.display = 'block';
    }
  }
  render(){
    let data = {
      maxSize: 2000000,
      modularName: this.props.modularName?this.props.modularName:'CNL',
      allowType:'jpg;png;pdf;doc;xls;xlsx;docx',
    };
    const props = {
      action: `/api/commons/attach?`+stringify({access_token: localStorage.access_token}),
      multiple: false,
      data:this.props.data?this.props.data:data,
      onChange: this.handleChange.bind(this)
    };
    return(
      <Upload {...props} fileList={this.state.fileList}>
        {
          this.props.children ?
            this.props.children
            :
            <Button>
              <Icon type="upload" /> 选择文件
            </Button>
        }
      </Upload>
    )
  }
}

SingleUpload.propTypes = {
  index: PropTypes.number.isRequired,
};

export default (SingleUpload);
