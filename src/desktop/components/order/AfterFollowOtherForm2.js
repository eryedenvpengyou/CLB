import { Form, Row, Col,  Button } from 'antd';
import * as service from '../../services/order';
import Uploads from '../../components/common/Upload';
import Modals from '../common/modal/Modal';
import * as common from '../../utils/common';

const FormItem = Form.Item;

class AfterFollowOtherForm2 extends React.Component {

  state = {
    expand: false,
  };

  componentDidMount() {
  }

  /**
   * 点击提交按钮执行的函数
   */
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form = this.props.form;
        const user = JSON.parse(localStorage.user);
        let params = {};
        params.content = form.getFieldValue('content');
        params.afterId = this.props.afterId;
        params.__status = 'add';
        params.sessionId = localStorage.sessionId;
        params.followUserId = user.userId;
        let orderData = this.props.getOrderData;
        params.afterProject = orderData[0].afterProject;
        params.afterStatus = orderData[0].afterStatus;
        params.afterType = orderData[0].afterType;
        params.orderId = this.props.orderId
        let files = [];
        files.push(common.formatFile(form.getFieldValue('afterFile') || [], true));
        if(files) {
          if(files[0]) {
            params.fileId = files[0];
          }
        }
        if(params.content){
          // console.log(params, this.props)
          service.submitAfterFollow(params).then((data) => {
            if(data.success){
              
              form.setFieldsValue({content:''});
              form.setFieldsValue({afterFile:''});
              //this.props.changeSFlag(false);
              this.props.changeStatus('TOAUDIT');
              const paramsRF = {
                afterId: this.props.afterId
              };
              service.fetchRenewalFollowService(paramsRF).then((data) => {
                if(data.success){
                  this.props.changeRFData(data);
                }
              });

              Modals.success({
                content:'提交成功',
                url:'/after/AfterFollowOther/'+this.props.afterId+'/'+this.props.orderId+'/'+'TOAUDIT'
              });
            }
            else{
              Modals.error({content:data.message});
            }
          });
        }else {
          Modals.error({content:'请填写跟进内容！'})
        }

      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
    };

    const textareaItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
    };

    return (
      <Form  onSubmit={this.handleSubmit.bind(this)}>

        <Row gutter={40} style={{marginBottom:'10px'}}>
          <Col span={14}>
            <FormItem {...textareaItemLayout} label="附件上传" style={{marginBottom: '3%',marginTop : '1%'}}>
              {getFieldDecorator('afterFile', {
                rules: [
                  { validator: common.vdFile.bind(this) }
                ],
              })(
                <Uploads style={{marginLeft:'20px'}} fileNum={1} modularName='SVC'/>
              )}
            </FormItem >
          </Col>
        </Row>
        <Row gutter={40} style={{marginBottom:'10px'}}>
          <Col span={38}>
            <FormItem {...textareaItemLayout}style={{marginBottom:'0'}}>
              {getFieldDecorator('content')(
                <textarea style={{width:'120%',height: '150px',marginBottom: '10px'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} style={{marginBottom:'30px'}}>
          <Col span={13} >
            <Button style={{fontSize:'20px',width : '140px',height:'40px',float:'right',backgroundColor:JSON.parse(localStorage.theme).themeColor,color:'white'}} htmlType="submit">提交</Button>
          </Col>
        </Row>

      </Form>
    );
  }

}

AfterFollowOtherForm2 = Form.create()(AfterFollowOtherForm2);

export default AfterFollowOtherForm2;
