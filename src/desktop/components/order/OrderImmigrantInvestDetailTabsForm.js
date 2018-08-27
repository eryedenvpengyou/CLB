import {Form, Row, Col, Input,  } from 'antd';
import * as styles2 from '../../styles/order.css'


const FormItem = Form.Item;


class OrderImmigrantInvestDetailTabsForm extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    const fields = this.props.orderDetail||{};
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form  onSubmit={this.handleSearch}>
        <Row gutter={40} style={{marginTop:'10px'}} >
          <Col span={11} >
            <FormItem {...formItemLayout}  label={<span className={styles2.item_font_form}>产品经理</span>} >
              {getFieldDecorator('productManager',{
                initialValue:fields.productManager?fields.productManager:''
              })(
                <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>联络电话</span>}>
              {getFieldDecorator('productManagerPhone',{
                initialValue:fields.productManagerPhone?fields.productManagerPhone:''
              })(
                <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={11}>
            <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>联络人</span>}>
              {getFieldDecorator('contactPerson',{
                initialValue:fields.contactPerson?fields.contactPerson:''
              })(
                <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
              )}
            </FormItem>
          </Col>

          <Col span={11}>
            <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>联络电话</span>}>
              {getFieldDecorator('contactPhone',{
                initialValue:fields.contactPhone?fields.contactPhone:''
              })(
                <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40} >
          <Col span={11}>
            <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>见面地址</span>} style={{marginBottom:'0'}}>
              {getFieldDecorator('meetAddress',{
                initialValue:fields.meetAddress?fields.meetAddress:''
              })(
                <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={11}>
          </Col>
        </Row>
      </Form>
    );
  }
}

OrderImmigrantInvestDetailTabsForm = Form.create()(OrderImmigrantInvestDetailTabsForm);

export default OrderImmigrantInvestDetailTabsForm;
