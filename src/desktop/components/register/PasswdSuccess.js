import React from 'react';
import {Form,Button, Icon } from 'antd';
import * as styles from '../../styles/register.css';

const FormItem = Form.Item;

class PasswdSuccess extends React.Component {

  render() {

    return (
      <div>
        <div className={styles.password_back}>
          <Form className={styles.form_sty}>
            <div style={{textAlign:'center',marginTop:'5%'}} >
              <Icon type="check-circle-o" style={{fontSize:110,color:'#d1b97f',marginBottom:'28px'}} /><br/>
              <label title="Login" style={{fontSize:26,textAlign:'center'}}>设置密码成功!</label>
            </div>
            <FormItem style={{width:'100%',textAlign:'center'}}>
              <Button onClick={()=>location.hash='/login'} type='primary' style={{width:'280px',height:'40px',marginBottom:'50px',marginTop:'106px'}} >
                  进入登录界面
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}


export default Form.create()(PasswdSuccess);
