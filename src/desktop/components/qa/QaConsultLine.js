import {Input, Row, Col} from 'antd';
import Download from '../common/Download';

const QaConsultLine =({qa})=>{
  return(
    <div style={{overflowY:'scroll',height:'450px',borderColor:JSON.parse(localStorage.theme).themeColor,borderStyle:'solid',borderWidth:'1px',padding:'30px',margin:'0 auto'}}>
      {
        qa.conLines &&
        qa.conLines.map((item)=>
          <div style={{marginBottom:'12px'}} key={item.lineId}>
            {
              item.question &&
              <Row>
                <Col span={1} ><span style={{fontSize:'16px'}}>问: </span></Col>
                <Col span={23}>
                  <Row>
                    <Col><span style={{fontSize:'16px'}}>{item.question}</span></Col>
                  </Row>
                  {
                    item.questionFileId != null &&
                    item.questionFileId != 0 &&
                    <Row style={{marginTop:'10px'}}>
                      <Col><Download fileId={item.questionFileId} /></Col>
                    </Row>
                  }
                </Col>
              </Row>
            }

            {
              item.answer &&
              <Row style={{marginTop:'20px'}}>
                <Col span={1}><span style={{fontSize:'16px'}}>答: </span></Col>
                <Col span={23}>
                  <Row>
                    <Col><Input type="textarea" value={item.answer} rows='3'/></Col>
                  </Row>
                  {
                    item.answerFileId != null &&
                    item.answerFileId != 0 &&
                    <Row style={{marginTop:'10px'}}>
                      <Col><Download fileId={item.answerFileId} /></Col>
                    </Row>
                  }
                </Col>
              </Row>
            }
          </div>
        )
      }
    </div>
  )
};

export default QaConsultLine;
