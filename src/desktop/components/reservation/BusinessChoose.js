import React  , { Component } from 'react';
import {Row, Col } from 'antd';
import bx from '../../styles/images/photo3.png';
import zq from '../../styles/images/photo7.png';
import jj from '../../styles/images/photo2.png';
import hwfc from '../../styles/images/photo1.png';
import ymtz from '../../styles/images/ymtz.png';
import zzfw from '../../styles/images/zzfw.png';
import ywzy from '../../styles/images/ywzy.png';
import * as styles from '../../styles/sys.css';
import { productShow } from '../../services/production';

class BusinessChoose extends Component {
  constructor(props){
    super(props);
    this.state = {
      productShowList:[],
    }
  }
  componentWillMount() {
    productShow({domainId:JSON.parse(localStorage.theme).domainId}).then((data)=>{
      if(data.success){
        this.setState({productShowList:data.rows})
      }
    });
  }
  render() {

    return (
      <div className={styles.table_border}>
        <b className={styles.b_sty} >|</b>
        <font className={styles.title_font2}>选择业务类型</font>
        <div style={{ margin: '20px 33px' }}>
          <Row>
            {
              this.state.productShowList.map((item) => {
                if(item.productType == 'BX'){
                  return <Col span={6} style={{ height: '286px', width: '284px', marginRight: '-23px', zIndex: '2' }}><img src={bx} alt="" style={{ width: '100%', height: '100%' }} /><span style={{ left: '35px' }} className={styles.font_div} onClick={() => location.hash = '/order/insurance/000'}>{item.productTypeDesc}</span></Col>
                }else if(item.productType == 'FC'){
                  return <Col span={6} style={{ height: '286px', width: '300px', marginLeft: '-10px', marginRight: '-2px', }}><img src={hwfc} alt="" style={{ width: '100%', height: '100%' }} /><div style={{ left: '54px' }} className={styles.font_div}><span onClick={() => location.hash = '/production/subscribe/FC/orderAdd/FC'}>{item.productTypeDesc}</span></div></Col>
                }else if(item.productType == 'ZQ'){
                  return <Col span={6} style={{ height: '286px', width: '284px', zIndex: '1', marginLeft: '-10px', marginRight: '-10px', }}><img src={zq} alt="" style={{ width: '100%' ,height: '100%' }} /><div style={{ left: '37px' }} className={styles.font_div}><span onClick={() => location.hash = '/production/subscribe/ZQ/ZQ/ZQ'}>{item.productTypeDesc}</span></div></Col>
                }else if(item.productType == 'JJ'){
                  return <Col span={6} style={{ height: '286px', width: '284px', marginLeft: '-10px', marginRight: '-2px', }}><img src={jj} alt="" style={{ width: '100%', height: '100%' }} /><div style={{ left: '43px' }} className={styles.font_div}><span onClick={() => location.hash = '/maxim/list'}>{item.productTypeDesc}</span></div></Col>
                }
              })
            }
          </Row>
          <Row>
            {
              this.state.productShowList.map((item) => {
                if (item.productType == 'DC') {
                  return <Col span={8} style={{ height: '274px', width: '389px', marginRight: '-27px', zIndex: '2' }}><img src={ymtz} alt="" style={{ width: '100%', height: '100%' }} /><div style={{ left: '70px' }} className={styles.font_div2}><span onClick={() => location.hash = '/production/subscribe/DC/DC/DC'}>{item.productTypeDesc}</span></div></Col>
                } else if (item.productType == 'FW') {
                  return <Col span={7} style={{ height: '274px', width: '370px', marginRight: '-27px', zIndex: '1' }}><img src={zzfw} alt="" style={{ width: '100%', height: '100%' }} /><div style={{ left: '47px' }} className={styles.font_div2}><span onClick={() => location.hash = '/production/list/FW'}>{item.productTypeDesc}</span></div></Col>
                }
              })
            }
            <Col span={9} style={{ height: '274px', width: '389px', marginLeft: '-10px' }}><img src={ywzy} alt="" style={{ width: '100%', height: '100%' }} /><div style={{ left: '75px' }} className={styles.font_div2}><span onClick={() => location.hash = '/classroom/business'}>业务支援</span></div></Col>
          </Row>
        </div>

      </div>
      );
    }

  }

export default BusinessChoose;
