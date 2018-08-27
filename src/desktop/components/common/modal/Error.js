/**
 * created by zhuyan.luo at 2017/06/23 20:27
 */


import { Modal, Icon } from 'antd';
import * as styles from '../../login/modal.css';

/**
 * 失败弹框
 *
 * @class Error
 * @extends {React.Component}
 */
class Error extends React.Component {
  state = {
    count: this.props.count || 3,
    visible: true,
  };

  componentWillReceiveProps(nextProps) {

  }

  componentDidMount() {
      if(this.timer) clearInterval(this.timer);
      //count秒后自动关闭弹窗
      this.timer = setInterval(function () {
        let count = this.state.count;
        count = count - 1;
        this.setState({count: count});
        if (count < 1) {
          clearInterval(this.timer);
          this.props.close();
        }
      }.bind(this), 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }


  render() {
    let text = this.state.count + '秒后自动关闭';
    return (
      <div>
        <Modal
          visible={this.state.visible}
          maskClosable={false}
          onCancel={()=>this.props.close()}
          footer={null}
        >
          <div className={styles.title_div}>
            <div className={styles.title_font}>提示</div>
          </div>
          <div className={styles.content_sty}>
            <div  className={styles.div_way}>
              <Icon style={{color:' #FF6C6C',fontSize:'110px'}} type="close-circle-o" />
            </div>
            <div className={styles.fonts_way}>
              {this.props.content}
            </div>
            <div>{text}</div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Error;
