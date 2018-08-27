import { Form, Row, Col, Input, Button } from 'antd';
import * as styles2 from '../../styles/order.css';


const FormItem = Form.Item;


class OrderTrailForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
    };
  }

  componentWillMount() {
    const params = {
      pendingId: this.props.pendingId
    };
    this.props.dispatch({
      type:'order/fetchOrderTrailForm',
      payload:{params},
    });
  }

  render() {
    const fields = this.props.orderTrailForm[0]?this.props.orderTrailForm[0]:{};
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
    };

    return (
      <Form className={styles2.disableds}>
        <Row gutter={40} style={{marginTop:'30px'}} >
          <Col span={10} style={{}}>
            <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>订单编号</span>} style={{marginBottom:'0'}}>
              {getFieldDecorator('orderNumber',{
                initialValue:fields.orderNumber?fields.orderNumber:''
              })(
                <Input disabled={true} style={{width:'375px',height:'40px',fontSize:'16px'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={13} style={{}}>
            <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>产品信息</span>} style={{marginBottom:'0'}}>
              {getFieldDecorator('orderInfo',{
                initialValue:fields.orderInfo?fields.orderInfo:''
              })(
                <Input disabled={true} style={{width:'375px',height:'40px',fontSize:'16px'}}/>
              )}
            </FormItem>
          </Col>
        </Row >
        <Row gutter={40} style={{marginTop:'10px'}}>
          <Col span={10} style={{}}>
            <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>Pending类型</span>} style={{marginBottom:'0'}}>
              {getFieldDecorator('applyClassDesc',{
                initialValue:fields.applyClassDesc?fields.applyClassDesc:''
              })(
                <Input disabled={true} style={{width:'375px',height:'40px',fontSize:'16px'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={13} style={{}}>
            <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>Pending项目</span>} style={{marginBottom:'0'}}>
              {getFieldDecorator('applyItem',{
                initialValue:fields.applyItem?fields.applyItem:''
              })(
                <Input disabled={true} style={{width:'375px',height:'40px',fontSize:'16px'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} style={{marginTop:'10px'}}>
          <Col span={10} style={{}}>
            <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>处理截止时间</span>} style={{marginBottom:'0'}}>
              {getFieldDecorator('dealEndDate',{
                initialValue:fields.dealEndDate?fields.dealEndDate:''
              })(
                <Input disabled={true} style={{width:'375px',height:'40px',fontSize:'16px'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={13} style={{}}>
            <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>最后跟新时间</span>} style={{marginBottom:'0'}}>
              {getFieldDecorator('lud',{
                initialValue:fields.lud?fields.lud:''
              })(
                <Input disabled={true} style={{width:'375px',height:'40px',fontSize:'16px'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} style={{marginTop:'10px'}}>
          <Col span={10} style={{}}>
            <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>状态</span>} style={{marginBottom:'0'}}>
              {getFieldDecorator('statusDesc',{
                initialValue:fields.statusDesc?fields.statusDesc:''
              })(
                <Input disabled={true} style={{width:'375px',height:'40px',fontSize:'16px'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={13} style={{}}>
            <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>分配处理人</span>} style={{marginBottom:'0'}}>
              {getFieldDecorator('cbName',{
                initialValue:fields.cbName?fields.cbName:''
              })(
                <Input disabled={true} style={{width:'375px',height:'40px',fontSize:'16px'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} style={{marginTop:'10px'}}>
          <Col span={10} style={{}}>
            <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>业务对接行政</span>} style={{marginBottom:'0'}}>
              {getFieldDecorator('preName',{
                initialValue:fields.preName?fields.preName:''
              })(
                <Input disabled={true} style={{width:'375px',height:'40px',fontSize:'16px'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

}

OrderTrailForm = Form.create()(OrderTrailForm);

export default OrderTrailForm;
