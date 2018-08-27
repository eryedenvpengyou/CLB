import React from 'react';
import {Steps,} from 'antd';


const Step = Steps.Step;

class BaseStep extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const steps = [{
        title: '填写基础信息',
        content: '',
      }, {
        title: '填写背景信息',
        content: '',
      },{
        title: '资料收集',
        content: '',
    }];

    return (
      <div>
        <Steps style={{ paddingTop:'2%',paddingLeft:'5%', paddingRight:'5%'}} current={this.props.register.step}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
      </div>
    );
  }
}

export default BaseStep;
