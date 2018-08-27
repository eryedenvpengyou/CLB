import React from 'react';
import { Form,Button, Icon } from 'antd';
import InfoModal from './InfoModal';
import Models from '../common/modal/Modal';
import * as styles from '../../styles/register.css';


const FormItem = Form.Item;

class RegSuccess extends React.Component {

  /**
   * 点击弹出框上按钮的 回调函数
   *
   * @param {boolean} flag
   * @memberof RegSuccess
   */
  modalCallback(flag){
    if(flag){
      //点击确定开启下一个模态框
      this.props.dispatch({
        type:'register/visibleSave',
        payload:{modalVisible:true},
      });
    }else{
      location.hash= '/portal/home';
    }
  }


  render() {

    return (
      <div>
        <InfoModal dispatch={this.props.dispatch} register={this.props.register}/>
        <div className={styles.fieldset_sty}>
          <Form  onSubmit={this.handleSubmit} >
            <div style={{textAlign:'center',marginTop:'5%'}} >
              <Icon type="check-circle-o" style={{fontSize:110,color:'#d1b97f',marginBottom:'28px'}} /><br/>
              <label title="Login" style={{fontWeight:'normal',fontFamily:'Microsoft YaHei',fontSize:'26px',textAlign:'center'}}>注册成功!</label>
            </div>
            <FormItem style={{marginBottom:'75px',marginTop:'106px',width:'100%',textAlign:'center'}}>
                  <Button onClick={()=>Models.loginEnquire(this.modalCallback.bind(this))} type='primary' style={{ width:'280px',height:'40px'}}  htmlType="submit" size="large">
                    进入工作台
                  </Button>
            </FormItem>

          </Form>
        </div>
      </div>
    );
  }
}


export default Form.create()(RegSuccess);
