import { Form, Row, Col, Input,  } from 'antd';
import * as styles2 from '../../styles/order.css';

const FormItem = Form.Item;

class OrderImmigrantInvestDetailForm2 extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const fields = this.props.orderDetail||{};;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <div>
        <Form>
          <Row gutter={40} >
            <Col span={11} style={{marginTop:'20px'}} >
              <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>提交时间</span>}>
                {getFieldDecorator('submitDate', {
                  initialValue:fields.submitDate?fields.submitDate:''
                })(
                  <Input size="large" style={{width:'100%',height:'40px',fontSize:'16px'}}  readOnly={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={11} style={{marginTop:'20px'}} >
              <FormItem {...formItemLayout}  label={<span className={styles2.item_font_form}>签单时间</span>}>
                {getFieldDecorator('signDate', {
                  initialValue:fields.signDate?fields.signDate:''
                })(
                  <Input size="large" style={{width:'100%',height:'40px',fontSize:'16px'}} readOnly={true}/>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

}

OrderImmigrantInvestDetailForm2 = Form.create()(OrderImmigrantInvestDetailForm2);

export default OrderImmigrantInvestDetailForm2;
