
import React from 'react';
import { Row, Col, Form } from 'antd';
import ProductionSubscribeFMSZComponent from './ProductionSubscribeYJ_FMSZ';
import ProductionSubscribeGDYLComponent from './ProductionSubscribeYJ_GDYL';

class ProductionSubscribeComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let component;
    // console.log(this.props.orderId);
    switch (this.props.params.midClass) {
      case 'FMSZ':
        component = <ProductionSubscribeFMSZComponent params={this.props.location.query} itemId={this.props.params.id}/>;
        break;
      case 'GDYL':
        component = <ProductionSubscribeGDYLComponent params={this.props.location.query} itemId={this.props.params.id} />;
        break;
      default:
        component = '';
        break;
    }
    return (
      <Form>
        <Row>
      <div>{component}</div>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(ProductionSubscribeComponent);
