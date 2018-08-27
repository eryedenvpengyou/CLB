import { Modal, Button, Form,Row,Col,Input,Upload,Icon} from 'antd';
import QaConsultLine from './QaConsultLine';
import {formatFile} from '../../utils/common';
import Uploads from '../../components/common/Upload';
import * as service from '../../services/qa';
import * as styles from '../../styles/qa.css';

const FormItem = Form.Item;

class QaConsultModal extends React.Component {

  //点击确定
  onOk(){
    const params = {
      consultId: this.props.consultId,
      solveFlag:'Y',
    };
    service.consultSubmit(params).then((data)=>{
      if(data.success){
        this.props.callback();
      }
    });
  }

  //取消
  onCancel(){
    const params = {
      consultId: this.props.consultId,
      solveFlag:'N',
    };
    service.consultSubmit(params).then((data)=>{
      if(data.success){
        this.props.callback();
      }
    });
  }

  //提交
  submit(){
    let params = {
      consultId: this.props.consultId,
      question: this.props.form.getFieldValue('question'),
    };
    const questionFileId = formatFile(this.props.form.getFieldValue('questionFile'), true);
    params.questionFileId =  questionFileId === 0 ? null : questionFileId;
    this.props.dispatch({
      type: 'qa/conLineSubmit',
      payload: {params}
    });
    this.props.form.resetFields();

    params = {
      consultId: this.props.consultId,
      answerStatus:'N',
    };
    service.consultSubmit(params);
  };

  render(){
    const {getFieldDecorator} = this.props.form;
    return (
       <Modal
         width={835}
         style={{top:10,height:'835px'}}
         title="客服答复"
         visible={this.props.visible}
         onCancel={this.props.callback}
         maskClosable={false}
         footer={null}
       >
         <div style={{margin:'0 25px'}}>
           <Form>
            <QaConsultLine qa={this.props.qa}/>
            <div>
              <FormItem label=' ' colon={false} style={{marginBottom:'1%'}} >
                {getFieldDecorator('question',{
                  initialValue:'',
                })(
                  <Input type="textarea" rows={3} maxLength={200} className={styles['textarea']} placeholder="请输入您的问题..." />
                )}
              </FormItem>

              <FormItem>
                <Row>
                  <Col span={10} style={{float:'left'}}>
                    <FormItem>
                      {getFieldDecorator('questionFile', {
                        rules: [],
                      })(
                        <Uploads fileNum={1} modularName='QA'/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}></Col>
                  <Col span={10}>
                    <Button type='primary' onClick={this.submit.bind(this)} style={{ width: 160,height:'40px',float:'right' }}>提交追问</Button>
                  </Col>
                </Row>
              </FormItem>
            </div>

            <Row style={{marginBottom:'20px'}}>
              <hr style={{marginBottom:'2%'}}/>
              <Col span={8} style={{float:'left'}}>
                <span style={{fontSize:'18px',fontFamily:'Microsoft YaHei'}}>您的问题是否解决？</span>
              </Col>
              <Col span={10}>
                <Button type="primary" onClick={this.onOk.bind(this)} style={{ width: 120,height:'40px',float:'right'}} >是</Button>
              </Col>
              <Col span={6}>
                <Button type="default" onClick={this.onCancel.bind(this)} style={{ width:120,height:'40px',float:'right'}} >否</Button>
              </Col>
            </Row>
           </Form>
         </div>
       </Modal>
     );
  }
}

export default Form.create()(QaConsultModal);
