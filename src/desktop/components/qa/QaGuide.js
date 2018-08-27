import React from 'react';
import { Carousel } from 'react-bootstrap';
import {PICTURE_ADDRESS} from '../../constants';
function QaGuide({props}) {

  let guideFileList = props.guideFileList || [];
  // for(let start=0,end=guideFileList.length-1; start<=end; start++,end--) {
  //   let temp = guideFileList[start];
  //   guideFileList[start] = guideFileList[end];
  //   guideFileList[end] = temp;
  // }
  return (
    <div style={{marginTop:'30px'}}>
    {
      guideFileList.length > 0 &&
      <Carousel interval={null} wrap={false}>
      {
        guideFileList.map((item)=>
          <Carousel.Item key={item.lineId}>
            <img src={PICTURE_ADDRESS+item.filePath} alt="财联邦" style={{width: '1060px',height:'535px'}}/>
            <Carousel.Caption>
            </Carousel.Caption>
          </Carousel.Item>
        )}
      </Carousel>
    }
    </div>
  );
}
export default QaGuide;
