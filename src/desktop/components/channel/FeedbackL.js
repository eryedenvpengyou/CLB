import { Modal, Button, Row,Col,Icon} from 'antd';
import * as styles from '../../styles/qa.css';
import Download from '../common/Download';
import checkService from '../../styles/images/channel/check_serivce.png';

const confirm = Modal.confirm;

const FeedbackL =({props})=>{
  return(
    <div style={{marginTop:'10px',marginBottom:'10px'}}>
      <div style={{textAlign:'center',marginBottom:'10px',clear:'both'}}>
        {props.submitDate}
      </div>
      <Row gutter={24} style={{height:'60px',marginTop:'10px'}}>
        <Col span={3} style={{textAlign:'center',marginTop:'5px'}}>
          <img src={checkService} style={{width:'60px',height:'60px',borderRadius:'30px'}}/>
        </Col>
        <Col span={13}>
          <div style={{marginLeft:'-20px'}}>
            <div className={styles.talk}> </div>
            <div style={{backgroundColor:'#DBDBDB',padding:'18px 5px',float:'left',width:'95%',borderRadius:'10px'}}>
              {props.content}<br/>
              {
                props.attaches.map((attach,index) => {
                  return (
                    <div key={index}>
                      <Download fileId={attach.fileId}><Icon type="download" style={{color: "#0067d0"}}/>
                        <span style={{color: "#000"}}>{attach.fileName}</span>
                      </Download>
                      <br/>
                    </div>
                  )
                })
              }
            </div>
            <div style={{clear:'both'}}></div>
          </div>
        </Col>

        <Col span={6}>
        </Col>
      </Row>
    </div>
  )
}

export default FeedbackL;
