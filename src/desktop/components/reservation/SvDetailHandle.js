import React from 'react';
import SvDetail from './SvDetail';

class SvDetailHandle  extends React.Component {

  componentWillMount() {}

  render(){
    return(
      <div>
        <SvDetail
          orderId={this.props.id}
          midClass={this.props.midClass}
          itemId={this.props.itemId}
          reId={this.props.reId || ''}
          reNumber={this.props.reNumber || ''}/>
      </div>
    );
  }
}

export default SvDetailHandle;
