import { Form, Row, Col, Input, Button } from 'antd';
import * as service from '../../services/order';
import Uploads from '../../components/common/Upload';
import * as common from '../../utils/common';
import Modals from '../common/modal/Modal';

const FormItem = Form.Item;

class AfterNewExit extends React.Component {

  state = {
    expand: false,
    flag:[]
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
        if (this.props.afterProjectParams && this.props.afterTypeParams && this.props.orderIdParams) {
          const user = JSON.parse(localStorage.user);
          let params = {};
          params.templateId = this.props.afterTypeParams;

          const form = this.props.form;
          params.orderId = this.props.exitTableList[0].orderId;
          params.content = form.getFieldValue('content');
          params.__status = 'add';

          params.sessionId = localStorage.sessionId;
          params.followUserId = user.userId;

          let files = [];
          files.push(common.formatFile(form.getFieldValue('afterFile') || [], true));
          if(files) {
            if(files[0]) {
              params.fileId = files[0];
            }
          }
          let exitTableData = this.props.exitTableList;
          if(exitTableData){
            for(let i = 0;i<exitTableData.length;i++){
              exitTableData[i].saveStatus = exitTableData[i].status
              if(exitTableData[i].source == 'ORDER' && exitTableData[i].cbFlag == true){
                for(let j = 0;j<exitTableData.length;j++){
                  exitTableData[j].surrenderFlag = 'Y'
                }
              }
              else if(exitTableData[i].source != 'ORDER' && exitTableData[i].cbFlag == true){
                exitTableData[i].surrenderFlag = 'Y'
              }
              else {
              }
            }
            params.ordOrderExit = exitTableData;
          }
          this.props.exitTableList.map((item)=>{
            this.state.flag.push(item.surrenderFlag);
          })
          if(this.state.flag.indexOf('Y')>-1 && this.props.afterProjectParams == 'EXIT'){
            if (params.content) {
              service.submitAfterNew(params).then((data) => {
                if (data.success) {
                  Modals.success({ 
                  content: '提交成功！' 
                });
                setTimeout(() => {
                  location.hash = '/after/AfterFollowExit/'+data.rows[0].afterId+'/'+data.rows[0].orderId+'/'+'TOAUDIT'
                }, 1000);
                  //this.props.changeShow(false);
                  this.props.changeDisable(true);
                  this.props.changeStatus('资料审核中');
                  const paramsRF = {
                    afterId: data.rows[0].afterId
                  };
                  service.fetchRenewalFollowService(paramsRF).then((data) => {
                    if (data.success) {
                      this.props.changeRFTableData(data)
                    }
                  });
                }
                else {
                  Modals.error({ content: '提交失败,请联系对接行政！' });
                }
              });
            } else {
              Modals.error({ content: '请填写跟进内容' })
            }
          }else{
            Modals.error({ content: '请勾选退保产品' });
          }
        }
        else {
          Modals.error({content:'保单编号、售后项目、项目类型，请填写完整！'})
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
          <Col span={9} >
            <Button onClick={()=>window.history.go(-1)} style={{fontSize:'20px',width : '140px',height:'40px',float:'right',color:'black'}}>取消申请</Button>
          </Col>
          <Col span={8} >
            <Button style={{fontSize:'20px',width : '140px',height:'40px',float:'right',backgroundColor:JSON.parse(localStorage.theme).themeColor,color:'white'}} htmlType="submit">提交</Button>
          </Col>
        </Row>
      </Form>
    );
  }

}


export default AfterNewExit;
