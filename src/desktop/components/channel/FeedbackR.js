import { Modal, Button, Row,Col,Icon} from 'antd';
import * as styles from '../../styles/qa.css';
import Download from '../common/Download';
import { PICTURE_ADDRESS } from '../../constants';
import checkUser from '../../styles/images/channel/check_user.png';

const confirm = Modal.confirm;

const FeedbackR =({props})=>{
  return(
    <div>
      <div style={{textAlign:'center',marginBottom:'10px',clear:'both'}}>
        {props.submitDate}
      </div>
      <Row gutter={24} style={{height:'60px'}}>
        <Col span={8}>
        </Col>

        <Col span={13}>
          <div style={{marginRight:'-10px'}}>
            <div style={{backgroundColor:'#92D050',padding:'18px 5px',float:'left',width:'95%',borderRadius:'10px'}}>
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

        <Col span={3}>
          <img src={checkUser} style={{width:'60px',height:'60px',borderRadius:'30px'}}/>
        </Col>

      </Row>
    </div>
  )
}

export default FeedbackR;
