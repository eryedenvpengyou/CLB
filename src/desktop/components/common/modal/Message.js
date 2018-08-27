/**
 * created by wanjun.feng at 2017/06/23 20:27
 */


import { Modal, Icon,Button,Row,Col,Form} from 'antd';
import * as styles from '../../login/modal.css';

/**
 * 信息填写弹框
 */
class Message extends React.Component {

  callback(result){
    if (result) {
      this.props.form.validateFields((err, value) => {
        if (!err) {
          this.props.callback(result, value);
          this.props.close();
        }
      });
    } else {
      this.props.callback(result, null);
      this.props.close();
    }
  }


  render() {
    const props = this.props;
    const {getFieldDecorator} = props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6, offset: 2},
      },
      wrapperCol: {
        xs: {span: 20},
        sm: {span: 10},
      },
    };
    return (
      <div>
        <Modal
          visible={true}
          maskClosable={false}
          closable = {false}
          onCancel={()=>this.props.close()}
          footer={null}
        >
        <div className={styles.title_div}>
          <div className={styles.title_font}>提示</div>
        </div>
        <div className={styles.content_sty}>
          {/* <div  className={styles.div_way}>
            <Icon style={{color:' #F8D11C',fontSize:'110px'}} type="exclamation-circle-o" />
          </div> */}
          <div className={styles.fonts_way}>
            {this.props.content}
          </div>
          <div className={styles.div_way}>
            <Form.Item {...formItemLayout} label="原因" >
              {getFieldDecorator('comments', {
                rules: [
                  {required: true,message: '原因必输！'}
                ]
              })(
                <textarea style={{width:'100%'}}></textarea>
              )}
            </Form.Item>
          </div>
          <div className={styles.fonts_way}>
            <Row gutter={24}>
              <Col span={6} offset={4}>
                <Button type='N' key="back" className={styles.btn_default} style={{ width:'120px',height:'40px'}}  onClick={this.callback.bind(this,false)} >{props.cancel || '取消'}</Button>
              </Col>
              <Col span={2}>
              </Col>
              <Col span={10}>
                <Button key="Y" type='primary' style={{ width:'120px',height:'40px'}}  onClick={this.callback.bind(this,true)}  >{props.ensure || '确定'}</Button>
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
    </div>
    );
  }
}

export default Form.create()(Message);
