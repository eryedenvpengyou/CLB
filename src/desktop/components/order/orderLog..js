import { Modal, Button, Form,Row,Col,Input,Upload,Icon} from 'antd';
import * as styles from '../../styles/qa.css'
import * as service from '../../services/order';

const FormItem = Form.Item;

class QaConsultModal extends React.Component {

  //点击确定
  onOk(){
    let params = {
      consultId: this.props.qa.consultId,
      solveFlag:'Y',
    };
    service.consultSubmit(params).then((data)=>{
      if(data.success){
        const user = JSON.parse(localStorage.user);
        this.props.dispatch({
          type:'qa/fetchConsult',
          payload:{userId:user.userId}
        });
      }
    });
    this.props.dispatch({
      type: 'qa/visibleSave',
      payload: {modalVisible:false}
    });
  }

  //取消
  onCancel(){
    let params = {
      consultId: this.props.qa.consultId,
      solveFlag:'N',
    };
    service.consultSubmit(params).then((data)=>{
      if(data.success){
        const user = JSON.parse(localStorage.user);
        this.props.dispatch({
          type:'qa/fetchConsult',
          payload:{userId:user.userId}
        });
      }
    });
    this.props.dispatch({
      type: 'qa/visibleSave',
      payload: {modalVisible:false}
    });
  }

  //提交
  submit(){
    const user = JSON.parse(localStorage.user);
    let params = {
      consultId: this.props.qa.consultId,
      question: this.props.form.getFieldValue('question'),
    };
    let files = this.refs.questionFile.state.successFile;
    params.questionFileId = (files && files[0])? files[0].fileId : null;
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'qa/conLineSubmit',
      payload: {params}
    });
  };

  componentWillMount() {

    service.fetchOrderDetailordStatusHisList({orderId:this.props.orderId}).then((data)=>{
      const statusHisList = data.rows || [];
      this.setState({statusHisList: statusHisList});
    });
  }

  render(){
    const {getFieldDecorator} = this.props.form;

    const statusHisList = this.state.statusHisList;
    return (
      <Modal
        width={800}
        style={{top:10}}
        title="订单日志信息"
        visible={this.props.qa.modalVisible}
        onCancel={this.onCancel.bind(this)}
        maskClosable={false}
        footer={null}
      >
        <div className={styles.ask_border}>
          {
            statusHisList &&
            statusHisList.map((item)=>
              <div>{item.statusDate}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.meaning}</div>
            )
          }
        </div>
      </Modal>
    );
  }
}

export default Form.create()(QaConsultModal);
