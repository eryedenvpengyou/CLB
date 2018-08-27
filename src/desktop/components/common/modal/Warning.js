/**
 * created by zhuyan.luo at 2017/06/23 20:27
 */


import { Modal, Icon,Button,Row,Col} from 'antd';
import * as styles from '../../login/modal.css';

/**
 * 警告弹框
 */
class Warning extends React.Component {

  callback(result){
    this.props.callback(result);
    this.props.close();
  }


  render() {
    const props = this.props;
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
          <div  className={styles.div_way}>
            <Icon style={{color:' #F8D11C',fontSize:'110px'}} type="exclamation-circle-o" />
          </div>
          <div className={styles.fonts_way}>
            {props.content}
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

export default Warning;
