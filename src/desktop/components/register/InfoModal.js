import React from 'react';
import { Modal,} from 'antd';
import BaseStep from "./BaseStep";
import BaseInfo from "./BaseInfo";

class InfoModal extends React.Component {

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this))
    }

    handleKeyDown(e){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==27){ // 按 Esc
            if(this.props.register.modalVisible){
                this.props.dispatch({
                    type:'register/visibleSave',
                    payload:{modalVisible:false}
                });
            }
        }

    }

    handleCancel(){
        this.props.dispatch({
            type:'register/visibleSave',
            payload:{modalVisible:false}
        });
        location.hash= '/portal/home';
    }


    render() {
        return (
            <div>
                <Modal
                    width={'66%'}
                    visible={this.props.register.modalVisible}
                    closable={true}
                    maskClosable={false}
                    onCancel={this.handleCancel.bind(this)}
                    footer={null}
                >
                    <div>
                        <BaseStep register={this.props.register} dispatch={this.props.dispatch}/>
                        <BaseInfo register={this.props.register} dispatch={this.props.dispatch}/>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default InfoModal;
