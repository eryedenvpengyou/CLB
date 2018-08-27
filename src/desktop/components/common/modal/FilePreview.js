/**
 * created by xiaoyong.luo at 2017/06/23 20:27
 */

import { Modal, Checkbox,Button, Form,Input,Row,Col, Icon} from 'antd';
import * as styles from '../../login/modal.css';
import {PICTURE_ADDRESS} from '../../../constants';
import {indexOf} from 'lodash';
import {stringify} from 'qs';

/**
 * 文件预览 、下载 弹框
 */
class FilePreview extends React.Component {

  componentDidMount() {}

  //下载
  onOk(){

  }

  //取消
  onCancel(){
    this.props.close()
  }



  render() {
    const valids = ['image/png', 'image/jpg', 'image/jpeg', 'jpg', 'png', 'jpeg',];
    const file = this.props.file;

    let content = '', params = {}, imgFlag = true, srcPath = '';
    if(file && file.response && file.response.file){
      const fileInfo = file.response.file;
      params = {
        "fileId": fileInfo.fileId,
        "access_token": localStorage.access_token
      };

      if(indexOf(valids, fileInfo.fileType) < 0){
        imgFlag = false;
      }else{
        imgFlag = true;
        srcPath = fileInfo.filePath;
        content = '';
      }
    }

    return (imgFlag ?
      <Modal
        width={800}
        style={{height:'500px',top:'30px'}}
        visible={true}
        maskClosable={false}
        onCancel={()=>this.props.close()}
        footer={null}
      >

        <div style={{margin:'0 auto',width: '600px',height:'400px'}} >
          <img src={PICTURE_ADDRESS + srcPath} alt="财联邦" style={{width: '600px',height:'400px'}}/>
        </div>
        <div style={{margin:'0 auto',width: '600px', marginTop:'30px'}}>
          <div style={{float:'left',marginLeft:'100px'}}>
            <Button onClick={this.onCancel.bind(this)} style={{width:'100px'}} size="large">取消</Button>
          </div>

          <div>
            <a href={"/api/fms/sys/attach/file/detail?"+stringify(params)} style={{marginLeft:'200px'}}>
              <Button style={{width:'100px'}} size="large">下载</Button>
            </a>
          </div>
        </div>
      </Modal> : null
    );
  }
}

export default FilePreview;
