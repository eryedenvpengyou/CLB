/**
 * created by zhuyan.luo at 2017/06/23 20:27
 */

import React from 'react';
import { Modal, Button,Icon } from 'antd';

class LoginEnquire extends React.Component {

    callback(result){
        this.props.callback(result);
        this.props.close();
    }

    render() {
        return (
            <div>
                <Modal style={{marginTop:'5%'}}
                    visible={true}
                    maskClosable={false}
                    closable={false}
                    onCancel={()=>this.props.close()}
                    footer={[
                        <Button key="Y" onClick={this.callback.bind(this,true)} type='primary' style={{marginLeft:'5px',float:'left',height:'38px'}} >立即补充</Button>,
                        <Button key="N" onClick={this.callback.bind(this,false)} type='default' style={{ height:'38px'}} >以后再说</Button>,
                    ]}
                >
                    <p style={{paddingTop:'5%',paddingBottom:'5%',textAlign:'center',fontSize:'16px'}}>请补充或核对您的个人信息，否则会影响您部分功能的使用！</p>
                    <div style={{textAlign:'center',}} >
                        <Icon type="exclamation-circle-o" style={{fontSize:110,color:'#d1b97f',marginBottom:28}} /><br/>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default LoginEnquire;
