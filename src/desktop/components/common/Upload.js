/**
 *
 * created by xiaoyong.luo@hand-china.com at 2017/7/1 23:48
 *
 * 组件使用说明：
 *  1、可选参数
 *     -- modularName string 模块目录名  默认值为 'CNL'  【推荐】
 *     -- fileNum number 允许上传的 文件个数  【必输】
 *     -- allowType string 允许文件类型 默认值为 'jpg;png;pdf;doc;xls;xlsx;docx'  【可选】
 *     -- text string 上传按钮上显示的内容 【可选】
 *  2、 使用说明
 *    与其它 ant 组件使用方式一样
 */



import React from 'react';
import { Upload, Button, Icon } from 'antd';
import {stringify} from 'qs';
import Modals from './modal/Modal';
import * as styles from '../../styles/qa.css';
import * as service from '../../services/system';


class Uploads extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: this.props.value || [],
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value || [];
      this.setState({fileList:value});
    }
  }

  handleChange = (info) => {
    let fileList = info.fileList;
    if(fileList && fileList.length > 0){
      let file = fileList[0];
      if(file.response && typeof file.response == 'string' ){
        file.response = '文件上传错误';
        this.setState({ fileList });
      }
    }

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(fileList);
    }
  }

  onRemove(file){

    if (typeof this.props.onRemove === 'function') {
      return this.props.onRemove(file);
    }
    //向后台发送请求
    if(file && file.deleteFileId){

      //个人中心中的附件删除
      if(file.interface == 'PERSONAL'){
        service.removeChannelFile([{channelArchiveId: file.deleteFileId}]).then((data)=>{
          if(data.success){
            return true;
          }else{
            return false;
          }
        });
      }

    }else{
      if ('removeFlag' in file && !file.removeFlag) {
        return false;
      } else {
        return true;
      }
    }
  }



  onPreview(file){
    if(this.props.onPreview && typeof this.props.onPreview === 'function'){

    }else{
      if(this.props.view){
        Modals.filePreview(file);
      }else{
        if(file && file.response && file.response.file){
          const fileInfo = file.response.file;
          const params = {
            "fileId": fileInfo.fileId,
            "access_token": localStorage.access_token
          };
          window.location.href = '/api/fms/sys/attach/file/detail?'+stringify(params);
        }
      }
    }
  }


  render(){
    const props = {
      action: `/api/commons/attach?`+stringify({access_token: localStorage.access_token}),
      multiple: this.props.multiple || false,
      data: {
        maxSize: 5000000,
        modularName: this.props.modularName || 'CNL',
        allowType:this.props.allowType || 'jpg;png;pdf;doc;xls;xlsx;docx',
      },
    };


    const uploadButton = (
      this.props.children||
      <Button type={this.props.type || 'primary'} style={{width:120, height:'40px'}} disabled={this.props.disabled || false}>
        {this.props.text || '请选择附件'}
      </Button>
    );
    const fileNum = this.props.fileNum || 0;
    return(
      <Upload
        {...props}
        disabled={this.props.disabled || false}
        className={this.props.className || ''}
        fileList={this.state.fileList}
        onChange={this.handleChange}
        onRemove={this.onRemove.bind(this)}
        onPreview={this.onPreview.bind(this)} >
        { this.state.fileList.length >= this.props.fileNum ?  null : uploadButton }
      </Upload>
    )
  }
}

export default Uploads;
