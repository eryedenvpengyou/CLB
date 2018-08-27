/**
 * created by xiaoyong.luo at 2017/06/21 21:27
 *
 * 通过Modal.方法名 的方式控制弹出框。例如：modal.success({content:'内容'});
 *
 * 推荐： 内容较为简单的 模态框，可以通过这种方式使用。内容较多、太复杂的就算了吧
 *
 * update by xiaoyong.luo at 2017/06/23 13:57
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Error from './Error';
import Success from './Success';
import Warning from './Warning';
import Message from './Message';
import LoginEnquire from '../../login/LoginEnquire';
import LoginPhone from '../../login/LoginPhone';
import LoginProtocol from '../../login/LoginProtocol';
import LoginPassword from '../../login/LoginPassword';
import FilePreview from'./FilePreview';
import LogModel from './LogModel';
import TDZQModal from './TDZQModal';


class Model{

    /**
     * 创建模态框的 挂载节点
     *
     * @returns
     */
    createDiv(){
        const div = document.createElement('div');
        div.style.background = "#000000";
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.position = "fixed";
        div.style.top = "0";
        div.style.left = "0";
        div.style.zIndex = "500";
        div.style.opacity = "0.6";
        div.style.filter = "Alpha(opacity=70)";
        return div;
    }


    /**
     * 销毁节点
     *
     * @param {element} div
     */
    close(div){
        let unmountResult = ReactDOM.unmountComponentAtNode(div);
        if(unmountResult && div.parentNode){
            div.parentNode.removeChild(div);
        }
    }


    /**
     * 成功模态框
     * add by xiaoyong.luo
     *
     * @static
     * @param {{content:'内容'}} props 模态框上的提示信息
     * @returns
     * @memberof Model
     */
    static success(props){
        let modal = new Model();
        const div = modal.createDiv();
        ReactDOM.render(<Success close={modal.close.bind(this,div)} closable={props.closable} content={props.content || '成功'} url={props.url || ''} count={props.count || 3}/>, div);
        return {destroy: modal.close};
    }


    /**
     * 失败模态框
     * add by xiaoyong.luo
     *
     * @static
     * @param {{content:'内容'}} props 模态框上的提示信息
     * @returns
     * @memberof Model
     */
    static error(props){
        let modal = new Model();
        const div = modal.createDiv();
        ReactDOM.render(<Error close={modal.close.bind(this,div)} content={props.content || '失败'} count={props.count || 3}/>, div);
        return {destroy: modal.close};
    }


    /**
     * 确认弹出框
     * add by xiaoyong.luo
     *
     * @static
     * @param {function} callback 点击模态框上按钮时的回调函数
     * @returns
     * @memberof Model
     */
    static warning(callback, content){
        let modal = new Model();
        const div = modal.createDiv();

        if(typeof content === 'object'){
            ReactDOM.render(<Warning {...content} close={modal.close.bind(this,div)} callback={callback.bind(this)}/>, div);
        }else if(typeof content === 'string'){
            ReactDOM.render(<Warning content={content} close={modal.close.bind(this,div)} callback={callback.bind(this)}/>, div);
        }
        return {destroy: modal.close};
    }

    /**
     * 信息填写弹出框
     * add by wanjun.feng
     *
     * @static
     * @param {function} callback 点击模态框上按钮时的回调函数
     * @returns
     * @memberof Model
     */
    static message(callback, content){
        let modal = new Model();
        const div = modal.createDiv();

        if(typeof content === 'object'){
            ReactDOM.render(<Message {...content} close={modal.close.bind(this,div)} callback={callback.bind(this)}/>, div);
        }else if(typeof content === 'string'){
            ReactDOM.render(<Message content={content} close={modal.close.bind(this,div)} callback={callback.bind(this)}/>, div);
        }
        return {destroy: modal.close};
    }


    /**
     * 注册成功之后弹出的 询问模态框，用于补充详细信息
     * add by xiaoyong.luo
     *
     * @static
     * @param {function} callback 点击模态框上按钮时的回调函数
     * @returns
     * @memberof Model
     */
    static loginEnquire(callback){
        let modal = new Model();
        const div = modal.createDiv();
        ReactDOM.render(<LoginEnquire close={modal.close.bind(this,div)} callback={callback.bind(this)}/>, div);
        return {destroy: modal.close};
    }


    /**
     * 我的团队中创建的成员，第一次登录需要校验手机号
     * add by xiaoyong.luo
     *
     * @static
     * @param {function} loginPhone 点击模态框上按钮时的回调函数
     * @returns
     * @memberof Model
     */
    static loginPhone(loginPhone){
        let modal = new Model();
        const div = modal.createDiv();
        ReactDOM.render(<LoginPhone close={modal.close.bind(this,div)} loginPhone={loginPhone.bind(this)}/>, div);
        return {destroy: modal.close};
    }


    /**
     * 我的团队中创建的成员，第一次登录需要弹出协议框
     * add by xiaoyong.luo
     *
     * @static
     * @param {function} loginProtocol 点击模态框上按钮时的回调函数
     * @returns
     * @memberof Model
     */
    static loginProtocol(loginProtocol){
        let modal = new Model();
        const div = modal.createDiv();
        ReactDOM.render(<LoginProtocol close={modal.close.bind(this,div)} loginProtocol={loginProtocol.bind(this)}/>, div);
        return {destroy: modal.close};
    }

    /**
     * 我的团队中创建的成员，第一次登录 修改密码
     * add by xiaoyong.luo
     *
     * @static
     * @param {function} loginPassword 点击模态框上按钮时的回调函数
     * @returns
     * @memberof Model
     */
    static loginPassword(loginPassword){
        let modal = new Model();
        const div = modal.createDiv();
        ReactDOM.render(<LoginPassword close={modal.close.bind(this,div)} loginPassword={loginPassword.bind(this)}/>, div);
        return {destroy: modal.close};
    }


    /**
     * 日志记录model
     * add by detai.kong
     *
     * @static
     * @param {{content:'内容'}} props 模态框上的提示信息
     * @returns
     * @memberof Model
     */
    static LogModel(props){
        let modal = new Model();
        const div = modal.createDiv();
        ReactDOM.render(<LogModel close={modal.close.bind(this,div)} List={props.List} title={props.title}/>, div);
        return {destroy: modal.close};
    }



    /**
     * 文件预览或下载
     * add by xiaoyong.luo
     *
     * @static
     * @param {object} file 文件信息
     * @returns
     * @memberof Model
     */
    static filePreview(file){
        let modal = new Model();
        const div = modal.createDiv();
        ReactDOM.render(<FilePreview close={modal.close.bind(this,div)} file={file}/>, div);
        return {destroy: modal.close};
    }


    /**
     * 团队签证中添加表格信息
     * add by xiaoyong.luo
     *
     * @static
     * @returns
     * @memberof Model
     */
    static tdqzModal(record, callback){
        let modal = new Model();
        const div = modal.createDiv();
        ReactDOM.render(<TDZQModal close={modal.close.bind(this,div)} record={record} callback={callback.bind(this)}/>, div);
        return {destroy: modal.close};
    }
}

export default Model;


