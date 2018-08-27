/*
 * show 侧边栏
 * @author:zhouting
 * @version:20170511
 */
import React from 'react';
import { connect } from 'dva';
import { Input ,BackTop } from 'antd';
import style from '../../styles/portal.css';
import icon10 from '../../styles/images/portal/icon-11.png';
import icon11 from '../../styles/images/portal/icon-12.png';
import icon12 from '../../styles/images/portal/icon-13.png';
import icon13 from '../../styles/images/portal/icon13.png';
import weixin from '../../styles/images/portal/weixinpublic.jpg'

 class side extends React.Component{
   constructor(props){
     super(props);
     //this.state = {}
   }
   handleClick(e){
     var sideR = document.getElementsByClassName(style.sideR);
     function back(){
        document.getElementsByClassName(style.sideL)[0].style.right = '0';
        sideR[0].style.display = "none"
      }
     if (sideR[0].style.display == "none") {
       document.getElementsByClassName(style.sideL)[0].style.right = '292px'
       sideR[0].style.display = "block"
     } else{
       back();
     }
   }
   handelMouseOver(index, e){
     var com = document.getElementsByClassName(style.component);
     com[index].style.backgroundColor="#d1b97f";
     if(index==2){
       com[index].lastChild.style.display='block';
     }
   }
   handelMouseOut(index, e){
     var com = document.getElementsByClassName(style.component);
     com[index].style.backgroundColor='';
    //  if(index==1){
    //    com[index].lastChild.style.display='none';
    //  }
   }
  render(){
    return(
    <div>
        <div style={{float:'left'}} className={style.sideL}>
          <div className={style.component} onMouseOver={this.handelMouseOver.bind(this, 0)} onMouseOut={this.handelMouseOut.bind(this,0)} onClick={()=>{location.hash = '/qaBasic/qaConsult'}}>
            <a style={{marginLeft:'14px',marginTop:'10px',width:'54px',height:'49px'}} >
              {/*<div className="imgA" style={{backgroundImage:'url('+icon10+')',width:'43px',height:'42px'}} />*/}
              <svg className="icon" style={{width: '50px', verticalAlign: 'middle', background: '#fff', color: JSON.parse(localStorage.theme).themeColor, fill: 'currentColor', overflow: 'hidden'}}  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M883.528712 562.076512c0.208754-8.452509 0.233314-17.051351 0.057305-25.669636 2.299369-116.594485-32.397874-214.880999-100.360755-284.252972-32.416294-33.081443-71.840188-58.472739-117.01711-75.770707-7.009647-62.98245-75.40948-112.566752-158.492734-112.566752-83.078137 0-151.4749 49.584302-158.487617 112.566752-45.171806 17.296945-84.59263 42.689265-117.003807 75.770707C164.241668 321.528947 129.528052 419.61694 131.843794 535.861454c-0.203638 10.985192-0.1361 21.298072 0.204661 31.376615-17.615193 17.730826-31.414477 44.50768-21.330818 82.083483 7.495718 27.927049 28.1532 48.846498 53.501518 58.006112 12.881378 7.940856 28.010961 12.567223 44.196595 12.674671 32.32215 141.30426 149.643182 237.232053 302.844399 237.232053 152.920832 0 270.27154-96.16827 302.405401-237.554394 0.988514 0.214894 2.018983 0.338714 3.070942 0.338714 20.182668 0 38.747489-7.05058 53.391001-18.786878 19.138896-10.860349 34.109866-29.03529 40.246633-51.909254C921.492348 607.903234 903.583466 579.596538 883.528712 562.076512L883.528712 562.076512 883.528712 562.076512M374.036835 393.503189c2.435469 4.071735 60.822251 100.343359 170.82255 142.072763 30.350239 11.515265 61.443397 18.10024 91.51632 24.464181 60.316737 12.778024 117.300566 24.846898 156.121733 75.248821 0.404206 0.523933 0.855484 1.010003 1.319042 1.465374-0.062422 2.541893-0.062422 2.547009-0.062422 2.547009 0 18.789948-1.417279 36.947494-4.1536 54.397934-49.907667 79.739089-132.715651 131.99422-235.299027 143.250588-7.644097-10.093892-23.217794-17.049305-41.307801-17.049305-25.65224 0-46.471404 13.888312-46.471404 30.974455 0 17.127076 20.819165 30.982642 46.471404 30.982642 22.99676 0 41.941228-11.18883 45.627177-25.825179 33.083489-3.801583 64.630996-11.704576 94.204545-23.64963 42.244126-17.058514 79.473029-41.911552 110.635773-73.871451 4.990664-5.106298 9.779737-10.397814 14.411221-15.826454-37.142945 113.1265-136.435369 185.847755-266.064728 185.859012l0 0c-0.233314-0.01228-0.86981-0.01228-1.101077-0.01228-166.328189 0-282.495956-118.93581-282.495956-289.500487l-0.312108-16.23066c-0.204661-6.955412 0.871857-26.492374 2.031263-45.228087 90.674139-32.078603 128.323621-124.244722 129.971144-128.387066L374.036835 393.503189 374.036835 393.503189M433.842942 651.956565c0 29.697369-24.078395 53.776787-53.775764 53.776787-29.697369 0-53.773717-24.079418-53.773717-53.776787 0-29.696346 24.077372-53.772694 53.773717-53.772694C409.765571 598.183871 433.842942 622.262266 433.842942 651.956565L433.842942 651.956565M684.250062 651.956565c0 29.225625-23.688515 52.919257-52.915164 52.919257-29.221532 0-52.910047-23.694655-52.910047-52.919257 0-29.222555 23.690562-52.91414 52.910047-52.91414C660.561547 599.043449 684.250062 622.735034 684.250062 651.956565L684.250062 651.956565M684.250062 651.956565 684.250062 651.956565z"></path></svg>
            </a>
            <span style={{marginTop:'5px',marginLeft:'15px',fontSize:'12px'}}>在线咨询</span>
          </div>
          <div className={style.component} onMouseOver={this.handelMouseOver.bind(this, 1)} onMouseOut={this.handelMouseOut.bind(this,1)} onClick={()=>{location.hash = '/qaBasic/qaFeedback'}}>
            <a style={{marginLeft:'14px',marginTop:'10px',width:'54px',height:'49px'}} >
              {/*<div className="imgFeedback" style={{backgroundImage:'url('+feedback+')',width:'43px',height:'42px'}} />*/}
              <svg className="icon" style={{width: '50px', verticalAlign: 'middle', background: '#fff', color: JSON.parse(localStorage.theme).themeColor, fill: 'currentColor', overflow: 'hidden'}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M809.984 578.56c-1.024-4.096-1.024-9.216 2.048-12.288C829.44 534.528 839.68 498.688 839.68 460.8c0-118.784-101.376-215.04-225.28-215.04-53.248 0-102.4 18.432-141.312 48.128C601.088 321.536 696.32 432.128 696.32 563.2c0 36.864-7.168 72.704-21.504 104.448 20.48-5.12 39.936-13.312 58.368-24.576 4.096-2.048 8.192-3.072 12.288-1.024l65.536 23.552c11.264 4.096 22.528-7.168 19.456-19.456l-20.48-67.584zM409.6 348.16c-123.904 0-225.28 96.256-225.28 215.04 0 37.888 10.24 73.728 28.672 105.472 2.048 4.096 3.072 8.192 2.048 12.288l-21.504 68.608c-4.096 12.288 7.168 23.552 19.456 19.456l65.536-23.552c4.096-1.024 9.216-1.024 12.288 1.024 34.816 20.48 74.752 31.744 118.784 31.744 123.904 0 225.28-96.256 225.28-215.04s-101.376-215.04-225.28-215.04zM286.72 604.16c-22.528 0-40.96-18.432-40.96-40.96s18.432-40.96 40.96-40.96 40.96 18.432 40.96 40.96-18.432 40.96-40.96 40.96z m122.88 0c-22.528 0-40.96-18.432-40.96-40.96s18.432-40.96 40.96-40.96 40.96 18.432 40.96 40.96-18.432 40.96-40.96 40.96z m122.88 0c-22.528 0-40.96-18.432-40.96-40.96s18.432-40.96 40.96-40.96 40.96 18.432 40.96 40.96-18.432 40.96-40.96 40.96z" ></path></svg>
            </a>
            <span style={{marginTop:'5px',marginLeft:'15px',fontSize:'12px'}}>意见反馈</span>
          </div>
          {/* <div className={style.component} style={{bottom: '1px'}} onClick={this.handleClick} onMouseOver={this.handelMouseOver.bind(this, 1)} onMouseOut={this.handelMouseOut.bind(this, 1)}>
            <a style={{marginLeft:'19px',marginTop:'12px',width:'43px',height:'42px'}}>
              <div className="imgB" style={{backgroundImage:'url('+icon11+')',width:'43px',height:'42px'}} />
            </a>
            <span style={{marginTop:'65px',marginLeft:'15px',fontSize:'12px'}}>扫码关注</span>
            <div className={style.weixin}>
              <div className="imgWX" style={{backgroundImage:'url('+weixin+')',width:'180px',height:'218px'}} />
            </div>
          </div> */}
          <BackTop className={style.component} style={{bottom: '2px'}} onMouseOver={this.handelMouseOver.bind(this, 2)} onMouseOut={this.handelMouseOut.bind(this,2)}>
            <div style={{marginLeft:'21px',marginTop:'6px',width:'39px',height:'55px'}}>
              <a>
                <div className="imgC" style={{backgroundImage:'url('+icon12+')',width:'43px',height:'42px'}} />
              </a>
            </div>
            <span style={{marginLeft:'15px',fontSize:'12px'}}>返回顶部</span>
          </BackTop>

        </div>
        {/*<div style={{float:'right',display:'none'}} className={style.sideR}>
            <div>
              <a href="javascript:;" onClick={this.handleClick.bind(this)} title='收起' className={style.back}><img src={icon13} alt=""/></a>
              <span>意见反馈</span>
            </div>
            <div className={style.type}>
              <p>选择您遇到的问题类型或建议类型</p>
              <div className={style.typeT}>
                <span>预约签单</span>
                <span>理赔</span>
                <span>续保</span>
              </div>
              <div className={style.typeT}>
                <span>预约签单</span>
                <span>理赔</span>
                <span>续保</span>
              </div>
            </div>
            <div>
              <textarea name="" id="" cols="40" rows="11" placeholder='我们将根据您的问题和建议，不断提升体验和服务'></textarea>
            </div>
            <div>
              <Input placeholder='请填写您的联系方式QQ、手机号或微信'></Input>
            </div>
            <div className={style.submit}>提交</div>
        </div>*/}
    </div>
    );
  }
}
export default (side);
