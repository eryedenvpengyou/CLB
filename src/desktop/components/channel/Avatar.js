/**
 * created by xiaoyong.luo@hand-china.com at 2017/7/1 22:33
 *
 */

import React from 'react';
import {stringify} from 'qs';
import { Upload, Icon, message } from 'antd';
import * as styles from '../../styles/qa.css';


function getBase64(img, callback) {
  
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  // if (!isJPG) {
  //   message.error('You can only upload JPG file!');
  // }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  // return isJPG && isLt2M;
  return  isLt2M;
}

class Avatar extends React.Component {
  state = {
    url : '',
  };
  handleChange = (info) => {
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, url => this.setState({ url }));
      if (typeof this.props.onChange == 'function') {
        if(info.file.response && info.file.response.success){
          info.file.success = true;
          info.file.fileId = info.file.response.file.fileId;
        }
        this.props.onChange(info.file);
      }
    }
  }

  render() {
    const imageUrl = this.state.url || this.props.imageUrl;
    return (
      <Upload
        className={styles.avatar_uploader}
        name="头像"
        showUploadList={false}
        action={`/api/commons/attach?`+stringify({access_token: localStorage.access_token})}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        multiple={false}
        data={{maxSize: 2000000,modularName: 'CNL',allowType: 'jpg;png'}}
        disabled={this.props.disabled}
      >
        {
          imageUrl ?
            <img src={imageUrl} alt="" className={styles.avatar} style={{borderRadius:'50%'}}/> :
            <Icon type="plus" className={styles.avatar_uploader_trigger} />
        }
      </Upload>
    );
  }
}

export default Avatar;
