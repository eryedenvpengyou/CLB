import { Form, Row, Col,  Button } from 'antd';
import * as service from '../../services/order';
import * as common from '../../utils/common';
import Uploads from '../../components/common/Upload';
import Modals from '../common/modal/Modal';


const FormItem = Form.Item;

class OrderPendingTrailForm2 extends React.Component {

  state = {
    loading: false,
    pendingList:[],
    disabledPending:false
  };


  componentWillMount() {
    const params = {
      pendingId: this.props.pendingId
    };
    this.props.dispatch({
      type:'order/fetchOrderTrailForm',
      payload:{params},
    });
    service.fetchOrderTrailFormService(params).then((data)=>{
      if(data.success){
        this.setState({
          pendingList:data.rows,
        },()=>{
          if (this.state.pendingList[0]){
            if(this.state.pendingList[0].status ==='PENDING'||this.state.pendingList[0].status ==='PENDING_MATERIAL' ||
            this.state.pendingList[0].status === 'PENDING_APPROVING' ||this.state.pendingList[0].status === 'PENDING_SUBMITTED' ||this.state.pendingList[0].status === 'PENDING_HANDLING' ){
              this.setState({
                disabledPending : true
              })
            }
          }
        });
      }
    });

    let paramsCode;
    if(this.props.PDType == 'ORDOrderPending'){
      paramsCode ={
        ordCodes: 'ORD.PENDING_STATUS',
      }
    }else {
      paramsCode ={
        ordCodes: 'ORD.BOND_STATUS',
      }
    }
    this.props.dispatch({
      type: 'order/fetchCode',
      payload: {paramsCode},
    });
  }

  /**
   * 点击提交按钮执行的函数
   */
  handleSubmit = (e) => {
    e.preventDefault();
    /*this.props.dispatch({
      type:'order/changeLoading',
      payload:{loading:true},
    });*/
    const form = this.props.form;
    form.validateFields((err, values) => {
      if (!err) {
        const user = JSON.parse(localStorage.user);
        let params = {};
        if (values.content) {
          params.content = values.content.replace(/\n/g,"<br/>");//替换换行为_@，在页面上转换成br
        }
        params.pendingId = this.props.pendingId;
        params.sessionId = localStorage.sessionId;
        params.__status = 'add';
        params.status = 'PENDING_APPROVING';
        //params.dealPerson =user.userId;
        if(this.props.orderTrailForm){
          params.dealPerson =this.props.orderTrailForm[0].cb;
        }
        //files
        let files = [];
        files.push(common.formatFile(form.getFieldValue('pendingFile') || [], true));
        if (files) {
          if (files[0]) {
            params.fileId = files[0];
          }
        }
        if(params.content){
          service.submitOrderTrail(params).then((data) => {

            /*this.props.dispatch({
              type:'order/changeLoading',
              payload:{loading:false},
            });*/
            if(data.success) {
  
              form.setFieldsValue({content:''});
              form.setFieldsValue({pendingFile:''});
  
              let ot =  this.props.orderType;
              let pii =  this.props.pendingId;
              let oi =  this.props.orderId;
              let pdt =  this.props.PDType;
              Modals.success({
                content: '您的资料已提交，工作人员会尽快处理',
                url:'/OrderPending/orderPendingTrail/'+ot+'/'+pdt+'/'+oi+'/'+pii
              });
              // this.setState({
              //   disabledPending:false
              // });
              let  params = {
                pendingId: this.props.pendingId
              };
              this.props.dispatch({
                type:'order/fetchOrderTrails',
                payload:{params},
              });
              this.props.dispatch({
                type:'order/fetchOrderTrailForm',
                payload:{params},
              });
             } else {
              Modals.error({content: '提交失败：'+data.meaasge});
              return;
            }
          });
        }
        else {
          Modals.error({content: '请填写跟进内容!'});
          return;
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
      <div>
      {
        this.state.disabledPending&&
      <Form onSubmit={this.handleSubmit.bind(this)} >
        <Row gutter={40} style={{marginBottom:'10px'}}>
          <Col span={14}>
            <FormItem {...textareaItemLayout} label="附件上传" style={{marginBottom: '3%',marginTop : '1%'}}>
              {getFieldDecorator('pendingFile', {
                rules: [
                  { validator: common.vdFile.bind(this) }
                ],
              })(
                <Uploads onclick="return false" style={{marginLeft:'20px'}} fileNum={1} modularName='ORD' />
              )}
            </FormItem >
            <p style={{color: '#6D6D6D',fontSize : '12px'}}>如需上传多个附件,可打包压缩上传,支持格式rar/zip/7z。</p>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={14}>
            </Col>
        </Row>
        <Row gutter={40} style={{marginBottom:'10px'}}>
          <Col span={38}>
            <FormItem {...textareaItemLayout}style={{marginBottom:'0'}}>
              {getFieldDecorator('content')(
                <textarea resize={this.state.disabledPending?'none':'both'} style={{width:'120%',height: '150px',marginBottom: '10px', paddingLeft:'5px'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
          <Row gutter={40} style={{marginBottom:'30px',textAlign:'center'}}>
              <Button  type='primary' style={{fontSize:'20px',width : '140px',height:'40px'}} htmlType="submit">提交</Button>
          </Row>
        </Form>}
      </div>
    );
  }

}

OrderPendingTrailForm2 = Form.create()(OrderPendingTrailForm2);

export default OrderPendingTrailForm2;
