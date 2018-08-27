/**
 * created by detai.kong at 2017/06/23 20:27
 */

import { Modal, Icon } from 'antd';
import * as styles from '../../login/modal.css';
import * as styles2 from '../../../styles/ordersummary.css';

/**
 * 成功弹框
 */
class LogModel extends React.Component {

  state = {
    visible: true,
  };



  render() {
    return (
      <div>
        <Modal
          visible={this.state.visible}
          maskClosable={false}
          onCancel={()=>this.props.close()}
          footer={null}
          width={'60%'}
          style={{top:30}}
        >
        <div className={styles.log_title_div}>
          <div className={styles.title_font}><b style={{fontSize:'14px'}}>提示</b></div>
        </div>
        <div className={styles.log_content_sty} >
          <div className={styles.log_fonts_way} style={{minHeight:'400px'}}>
            <div>
              <div style={{textAlign: 'center'}}><b style={{fontSize:'18px'}}>{this.props.title||'操作日志'}</b></div>
              <br/>
              <div className={styles2.flexcroll}  style={{minHeight:'350px'}}>
                {this.props.List.map((item, i) =>
                  <div key={i}>
                    <div >
                      <div key={item.statusHisId} style={{ float: 'left',width:'8%',margin: '1px auto'}}><Icon type="info-circle" style={{color: '#d1b97f'}}/></div>
                      <div style={{ float: 'left',width:'26%',margin: '1px auto',textAlign:'left'}}>{item.statusDate}</div>
                      <div style={{ float: 'left',width:'20%',margin: '1px auto',textAlign:'left'}}>{item.meaning || item.statusMeaning} </div>
                      <div style={{ float: 'left',width:'45%',margin: '1px auto',textAlign:'left'}}>{item.description|| item.comment}</div>
                    </div>
                    <br/>
                    <hr className={styles2.log_hr_line} style={{width:"98%"}}/>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
    );
  }
}

export default LogModel;
