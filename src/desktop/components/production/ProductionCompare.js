/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import ProductionCompareRadar from './ProductionCompareRadar';
import ProductionCompareTable from './ProductionCompareTable';
import { Row, Col, Button, Table } from 'antd';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import { getPublicCode } from '../../services/code';
import QRCode from 'qrcode.react';
import { stringify } from 'qs';
import { generateShortUrl, productionCompareRadar } from '../../services/production';
import fetch from 'dva/fetch';
import echarts from "echarts/lib/echarts";

class ProductionCompare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      compareInfo: JSON.parse(localStorage.compareInfo),
      shortUrl: '财联邦',
      //快码值
      codeList: {
        genderList: [],
        payMethodList: [],
        currencyList: [],
        nationList: [],
      },
      color: ['#5b9ad2','#74ad4f','#ee9867'],
      productCompare: {
        itemList: [],
        scoreList: [],
      },
      showRadar: true,
      showRadarBtn: true,
      option: {},
    };
  }
  componentWillMount() {
    //获取快码值
    const codeBody = {
      genderList: 'HR.EMPLOYEE_GENDER',
      payMethodList: 'CMN.PAY_METHOD',
      currencyList: 'PUB.CURRENCY',
      nationList: 'PUB.NATION',
    };
    getPublicCode(codeBody).then((data)=>{
      if (this.state.compareInfo.minClass != 'GD') {
        data.payMethodList.map((code) => {
          if (this.state.compareInfo.itemList[0].paymentMethod == code.value) {
            this.state.compareInfo.itemList[0].paymentMethodMeaning = code.meaning;
          }
          if (this.state.compareInfo.itemList[1].paymentMethod == code.value) {
            this.state.compareInfo.itemList[1].paymentMethodMeaning = code.meaning;
          }
          if (this.state.compareInfo.itemList[2] && this.state.compareInfo.itemList[2].paymentMethod == code.value) {
            this.state.compareInfo.itemList[2].paymentMethodMeaning = code.meaning;
          }
        });
      }
      this.setState({
        compareInfo: this.state.compareInfo,
        codeList: data
      })
    });
    const compareInfo = {
      minClass: this.state.compareInfo.minClass,
      accessToken: localStorage.access_token,
      itemList: this.state.compareInfo.itemList,
    };
    const urlBody = {
      'longUrl': 'http://melting-ice.com:8081/#/production/compareShare/'+stringify(compareInfo),
    };
    generateShortUrl(urlBody).then((urlData) => {
      if (urlData.success) {
        this.setState({
          shortUrl: urlData.message
        });
      } else {
        document.getElementById('qrcode').style.display = 'none';
      }
    });
  
    productionCompareRadar(this.state.compareInfo.itemList).then((data) => {
      if (data.success) {
        let hasData1, hasData2, hasData3, count = 0, dataLength = this.state.compareInfo.itemList.length
        /**
         * 渲染雷达图
         */
          //产品名称
        var items = [
            data.rows[0].itemList[0].name1,
            data.rows[0].itemList[0].name2,
            data.rows[0].itemList[0].name3
          ];
        //产品属性和数据
        var attrs = [];
        var score1 = [], score2 = [], score3 = [];
        // if ((!data.rows[0].scoreList[0].detail1 && !data.rows[0].scoreList[0].detail2) || (!data.rows[0].scoreList[0].detail1.replace(/\s+/g,"") && !data.rows[0].scoreList[0].detail2.replace(/\s+/g,""))) {
        //   this.setState({showRadar: false, showRadarBtn: false})
        //   return
        // }
        for (var i=0; i<data.rows[0].scoreList.length; i++) {
          attrs.push({name:data.rows[0].scoreList[i].attrName,max:10});
          score1.push(data.rows[0].scoreList[i].detail1);
          score2.push(data.rows[0].scoreList[i].detail2);
          score3.push(data.rows[0].scoreList[i].detail3);
     /*     if ((!data.rows[0].scoreList[i].detail1 || !data.rows[0].scoreList[i].detail1.replace(/\s+/g, '')) &&
            (!data.rows[0].scoreList[i].detail2 || !data.rows[0].scoreList[i].detail2.replace(/\s+/g, '')) &&
            (!data.rows[0].scoreList[i].detail3 || !data.rows[0].scoreList[i].detail3.replace(/\s+/g, ''))) {
            hasData = false
          }*/
          //最大最小值
          var arr = [data.rows[0].scoreList[i].detail1,
            data.rows[0].scoreList[i].detail2,
            data.rows[0].scoreList[i].detail3];
          if (data.rows[0].scoreList[i].compareRule == "MAX") {
            data.rows[0].scoreList[i].max = Math.max(arr);
          } else if (data.rows[0].scoreList[i].compareRule == "MIN") {
            data.rows[0].scoreList[i].min = Math.min(arr);
          }
          if (data.rows[0].scoreList[i].lineList) {
            for (var j=0; j<data.rows[0].scoreList[i].lineList.length; j++) {
              var arrLine = [data.rows[0].scoreList[i].lineList[j].detail1,
                data.rows[0].scoreList[i].lineList[j].detail2,
                data.rows[0].scoreList[i].lineList[j].detail3];
              if (data.rows[0].scoreList[i].lineList[j].compareRule == "MAX") {
                data.rows[0].scoreList[i].lineList[j].max = Math.max.apply(Math,arrLine);
              } else if (data.rows[0].scoreList[i].lineList[j].compareRule == "MIN") {
                data.rows[0].scoreList[i].lineList[j].min = Math.min.apply(Math,arrLine);
              }
              if (data.rows[0].scoreList[i].lineList[j].sourceType === 'SQL' || data.rows[0].scoreList[i].lineList[j].sourceType === 'GDZ') {
                if (data.rows[0].scoreList[i].lineList[j].detail1 && data.rows[0].scoreList[i].lineList[j].detail1.replace(/\s+/g, '')) {
                  hasData1 = true
                }
                if (data.rows[0].scoreList[i].lineList[j].detail2 && data.rows[0].scoreList[i].lineList[j].detail2.replace(/\s+/g, '')) {
                  hasData2 = true
                }
                if (data.rows[0].scoreList[i].lineList[j].detail3 && data.rows[0].scoreList[i].lineList[j].detail3.replace(/\s+/g, '')) {
                  hasData3 = true
                }
                count++
              }
            }
          }
        }
        if (dataLength > 2) {
          this.setState({showRadar:  (count === 0 || (hasData1 && hasData2 && hasData3)), showRadarBtn: (count === 0 || (hasData1 && hasData2 && hasData3))})
        } else {
          this.setState({showRadar:  (count === 0 || (hasData1 && hasData2)), showRadarBtn: (count === 0 || (hasData1 && hasData2))})
        }
        
        const datas = [{
          value: score1,
          name: data.rows[0].itemList[0].name1,
          symbolSize: 0,
          lineStyle: {
            normal: {
              color: this.state.color[0],
            }
          }
        },{
          value: score2,
          name: data.rows[0].itemList[0].name2,
          symbolSize: 0,
          lineStyle: {
            normal: {
              color: this.state.color[1],
            }
          }
        },{
          value: score3,
          name: data.rows[0].itemList[0].name3,
          symbolSize: 0,
          lineStyle: {
            normal: {
              color: this.state.color[2],
            }
          }
        }];
        /*雷达图数据*/
        const option = {
          tooltip: {},
          textStyle: {
            color: '#000',
          },
          legend: {
            data: items,
          },
          radar: {
            // shape: 'circle',
            indicator: attrs,
            splitArea: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: '#e6e6e6',
              }
            },
            axisLine: {
              lineStyle: {
                color: '#e6e6e6',
              }
            },
          },
          series: [{
            type: 'radar',
            // areaStyle: {normal: {}},
            data : datas
          }]
        };
        this.setState({option})
        const radar = echarts.init(document.getElementById("radarChart"));
        radar.setOption(option);
        if (this.state.compareInfo.minClass == 'GD') {
          //保障级别/地区
          data.rows[0].itemList.push({
            key: 2,
            attrName: '保障级别',
            name1: this.state.compareInfo.itemList[0].securityLevel,
            name2: this.state.compareInfo.itemList[1].securityLevel,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].securityLevel:null,
          });
          data.rows[0].itemList.push({
            key: 3,
            attrName: '保障地区',
            name1: this.state.compareInfo.itemList[0].securityArea,
            name2: this.state.compareInfo.itemList[1].securityArea,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].securityArea:null,
          });
          //自付选项
          data.rows[0].itemList.push({
            key: 4,
            attrName: '自付选项',
            name1: this.state.compareInfo.itemList[0].selyPay,
            name2: this.state.compareInfo.itemList[1].selyPay,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].selyPay:null,
          });
        } else {
          //缴费年期
          data.rows[0].itemList.push({
            key: 2,
            attrName: '缴费年期',
            name1: this.state.compareInfo.itemList[0].productionAgeLimit,
            name2: this.state.compareInfo.itemList[1].productionAgeLimit,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].productionAgeLimit:null,
          });
          //缴费方式
          data.rows[0].itemList.push({
            key: 3,
            attrName: '缴费方式',
            name1: this.state.compareInfo.itemList[0].paymentMethodMeaning,
            name2: this.state.compareInfo.itemList[1].paymentMethodMeaning,
            name3: this.state.compareInfo.itemList[2]?this.state.compareInfo.itemList[2].paymentMethodMeaning:null,
          });
        }
        //产品名称
        data.rows[0].itemList[0].key = 0;
        //所属公司
        data.rows[0].itemList[1].key = 1;
        data.rows[0].scoreList.map((row, index) => {
          row.key = index;
        });
        this.setState({
          productCompare: data.rows[0]
        });
      } else {
        this.setState({showRadar: false, showRadarBtn: false})
      }
    });
  }
  /*雷达图和对比表切换*/
  showDisplay(state) {
    this.setState({showRadar: state})
    // if (name == 'table') {
    //   document.getElementById("compareRadar").style.display = 'none';
    //   document.getElementsByName("compareBtn")[1].className = 'ant-btn ant-btn-default';
    //   document.getElementById("compareTable").style.display = 'block';
    //   document.getElementsByName("compareBtn")[0].className = 'ant-btn ant-btn-primary';
    // } else if (name == 'radar') {
    //   document.getElementById("compareTable").style.display = 'none';
    //   document.getElementsByName("compareBtn")[0].className = 'ant-btn ant-btn-default';
    //   document.getElementById("compareRadar").style.display = 'block';
    //   document.getElementsByName("compareBtn")[1].className = 'ant-btn ant-btn-primary';
    // }
  };
  componentDidMount() {
    // document.getElementById("compareTable").style.display = 'none';
    // document.getElementsByName("compareBtn")[0].className = 'ant-btn ant-btn-default';
    // document.getElementById("compareRadar").style.display = 'block';
    // document.getElementsByName("compareBtn")[1].className = 'ant-btn ant-btn-primary';
  }
  render() {
    let columns = [{
      title: '投保对象',
      width: '25%',
      render: (text, record, index) => {
        var gender = '';
        for (var i=0; i<this.state.codeList.genderList.length; i++) {
          if (this.state.codeList.genderList[i].value == record.gender) {
            gender = this.state.codeList.genderList[i].meaning;
          }
        }
        if (record.smokeFlag == 'Y') {
          return (
            <span>
              {record.age}岁{gender}性，吸烟
            </span>
          )
        } else {
          return (
            <span>
              {record.age}岁{gender}性，不吸烟
            </span>
          )
        }
      }
    }];
    let dataSource = [{
      key: 1,
      age: this.state.compareInfo.itemList[0].age,
      gender: this.state.compareInfo.itemList[0].gender,
      smokeFlag: this.state.compareInfo.itemList[0].smokeFlag,
      currency: this.state.compareInfo.itemList[0].currency,
    }];
    if (this.state.compareInfo.minClass == 'GD') {
      columns.push({
        title: '居住地',
        dataIndex: 'livingCity',
        width: '25%',
        render: (text, record, index) => {
          return this.state.codeList.nationList.map((code) => {
            if (text == code.value)
            return code.meaning;
          });
        }
      },{
        title: '币种',
        dataIndex: 'currency',
        width: '25%',
        render: (text, record, index) => {
          for (var i=0; i<this.state.codeList.currencyList.length; i++) {
            if (this.state.codeList.currencyList[i].value == text) {
              return this.state.codeList.currencyList[i].meaning;
            }
          }
          return text||'';
        }
      });
      dataSource[0].livingCity = this.state.compareInfo.itemList[0].livingCity;
    } else {
      columns.push({
        title: '保险金额',
        dataIndex: 'coverage',
        width: '25%',
        render: (text, record, index) => {
          if (text) {
            var currency = '';
            for (var i=0; i<this.state.codeList.currencyList.length; i++) {
              if (this.state.codeList.currencyList[i].value == record.currency) {
                currency = this.state.codeList.currencyList[i].meaning;
              }
            }
            return text + " " +currency;
          } else {
            return "-";
          }
        }
      });
      dataSource[0].coverage = this.state.compareInfo.itemList[0].coverage;
    }
    return (
      <div className={styles.product}>
        {
          this.props.infoDisplay == "none" ?
            <Row style={{paddingTop:'28px',paddingLeft:'12px',paddingRight:'12px'}}>
              <Button name="compareBtn" type={this.state.showRadar ? 'default' : 'primary'} onClick={this.showDisplay.bind(this, false)} style={{float:'right'}}>对比表</Button>
              {
                this.state.showRadarBtn ?
                <Button name="compareBtn" type={this.state.showRadar ? 'primary' : 'default'} onClick={this.showDisplay.bind(this, true)} style={{float:'right'}}>雷达图</Button>
                :''
              }
            </Row>
            :
            <Row id="info" style={{borderBottom: '12px solid #efefef'}}>
              <Row style={{paddingTop:'28px',paddingLeft:'12px',paddingRight:'12px'}}>
                <span className={commonStyles.iconL}></span>
                <span className={commonStyles.iconR}>投保信息</span>
                {
                  this.state.showRadarBtn ?
                    <Button name="compareBtn" type={this.state.showRadar ? 'primary' : 'default'} onClick={this.showDisplay.bind(this, true)} style={{float:'right'}}>雷达图</Button>
                    :''
                }
                <Button name="compareBtn" type={this.state.showRadar ? 'default' : 'primary'} onClick={this.showDisplay.bind(this, false)} style={{float:'right'}}>对比表</Button>
              </Row>
              <Row style={{margin: '28px 12px'}}>
                <Table rowKey="key" columns={columns} pagination={false} dataSource={dataSource} />
              </Row>
            </Row>
        }
        {
          this.state.showRadar ?
            <Row id="compareRadar" style={{padding: '28px 12px'}}>
              <ProductionCompareRadar compareInfo={this.state.compareInfo} productCompare={this.state.productCompare} option={this.state.option}/>
            </Row>
            :
            <Row id="compareTable" style={{padding: '28px 12px'}}>
              <ProductionCompareTable compareInfo={this.state.compareInfo} />
            </Row>
        }
        <Row id='qrcode' style={{textAlign:'center',paddingBottom:'28px'}}>
          <QRCode value={this.state.shortUrl} />
        </Row>
        {/*<Row id='qrcode' style={{textAlign:'center',paddingBottom:'28px'}}>
          <a id='qrcodeGen' href={'http://pan.baidu.com/share/qrcode?w=150&h=150&url=http://melting-ice.com:8081/#/production/compareShare/'+stringify(this.state.compareInfo)} target='qrcodeFrame'></a>
          <iframe id='qrcodeFrame' name="qrcodeFrame" style={{border:0,}}></iframe>
        </Row>*/}
      </div>
    );
  }
}

export default (ProductionCompare);
