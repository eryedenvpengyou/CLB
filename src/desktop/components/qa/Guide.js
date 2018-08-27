import React from 'react';
import {Icon } from 'antd';

// 图片轮播
class QaCarousel extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      current:0
    };
  }

  goPreview(e){
    let length = this.props.guidefileList.length;
    let current = this.state.current;
    if(current <= 0){
      current = length -1;
    }else{
      current = current - 1;
    }
    this.setState({current:current});
  }

  goNext(e){
    let length = this.props.guidefileList.length;
    let current = this.state.current;
    current = (current+1)%length;
    this.setState({current:current});
  }

  render() {
    const guidefileList = this.props.guidefileList;
    return(
      <div style={{display: 'inline-block'}}>
        <div style={{position: 'fixed', left: '20%',top: '50%',cursor:'pointer'}} onClick={this.goPreview.bind(this)}>
          {
            this.props.guidefileList.length > 0 &&
            <span><Icon type="left" style={{fontSize:'30px'}}/></span>
          }
        </div>
        <div style={{position: 'fixed', right: '3%',top: '50%',cursor:'pointer'}} onClick={this.goNext.bind(this)}>
          {
            this.props.guidefileList.length > 0 &&
            <span><Icon type="right" style={{fontSize:'30px'}}/></span>
          }
        </div>
        <div>
          {
            this.props.guidefileList.length > 0 &&
            <img src={guidefileList[this.state.current].src} style={{width: '1000px',height:'400px',paddingLeft:'8%'}} />
          }
        </div>
      </div>
    );
  }
}

export default QaCarousel;




import React from 'react';
import { connect } from 'dva';
import { Carousel } from 'react-bootstrap';
function Guide({props}) {
  return (
    <Carousel>
    {
      props.guidefileList > 0 &&
      props.guidefileList.map((item)=>
        <Carousel.Item>
          <img src={item.src} width="100%" alt="财联邦" />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
      )}
    </Carousel>
  );
}
export default Guide;
