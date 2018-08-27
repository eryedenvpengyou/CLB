/*
 * show 保费产品结构
 * @author:zhouting
 * @version:20170510
 */
import React from 'react';
import { connect } from 'dva';
import {Row, Col, Button, Icon } from 'antd';
import SetTopComponent from '../../components/portal/SetTop.js';
import styles from '../../styles/portal.css';
import { performance } from '../../services/myPerformance.js';
import icon8 from '../../styles/images/portal/icon8.png';
import icon9 from '../../styles/images/portal/icon9.png';
import class01 from '../../styles/images/portal/class01.png';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
// 引入饼状图 柱状图
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import bar from './Compare'

class ProductStr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            performanceData: {}
        }
    }
    componentWillMount() {
        if (JSON.parse(localStorage.user).relatedPartyId) {
            const body = {
                beginMonth: -1,
                beginYear: -1,
                channelId: JSON.parse(localStorage.user).relatedPartyId||-1,
                classType: null,
                settingType: null
            }
            performance(body).then((data) =>{
                if (data.success) {
                    var flag = true;
                    var bigClassList = [];
                    var midClassList = [];
                    data.rows[0].performanceStatisticsPrdList.map((chartData) => {
                        flag = true;
                        if (chartData.middleClass) {
                            midClassList.map((midClassData) => {
                                if (chartData.middleClass == midClassData.name) {
                                    midClassData.value = midClassData.value + chartData.orderQty;
                                    flag = false;
                                    return;
                                }
                            });
                            if (flag) {
                                midClassList.push({
                                    value: chartData.orderQty,
                                    name: chartData.middleClass,
                                });
                            }
                        } else {
                            bigClassList.map((bigClassData) => {
                                if (chartData.bigClass == bigClassData.name) {
                                    bigClassData.value = bigClassData.value + chartData.orderQty;
                                    flag = false;
                                    return;
                                }
                            });
                            if (flag) {
                                bigClassList.push({
                                    value: chartData.orderQty,
                                    name: chartData.bigClass,
                                });
                            }
                        }
                    });
                    // 饼图
                    const pieCharts = echarts.init(document.getElementById('pie'));
                    const option1 = {
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b}: {c} ({d}%)"
                        },
                        series: [
                            {
                                name: '产品大分类',
                                type: 'pie',
                                selectedMode: 'single',
                                radius: [0, '50%'],
                                center: ['50%', '50%'],
                                label: {
                                    normal: {
                                        position: 'inner'
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                color: bigClassList.length>0?['#FFD075', '#ff8e00', '#ffbc00']
                                :['#ffbc00'],
                                data:bigClassList.length>0?bigClassList:[{value:0,name:'暂无数据'}]
                            },
                            {
                                name: '产品中分类',
                                type: 'pie',
                                radius: ['60%', '70%'],
                                center: ['50%', '50%'],
                                color:midClassList.length>0?['#f79a01', '#7395df', '#ff9773', '#ffc173', '#bf9a30', '#ff7140', '#3e97d1', '#a65c00']
                                :['#ffbc00'],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            formatter: '{b} : {c} ({d}%)'
                                        },
                                        labelLine: { show: true }
                                    }
                                },
                                data: midClassList.length>0?midClassList:[{value:0,name:'暂无数据'}]
                            }
                        ]
                    }
                    var barData = {
                        name: [],
                        value: [],
                    };
                    data.rows[0].performanceStatisticsList.map((chartData) => {
                        barData.name.push(chartData.year+"-"+chartData.month);
                        barData.value.push(chartData.orderQty);
                    });
                    // 柱状图
                    const barCharts = echarts.init(document.getElementById('bar'));
                    const option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#d1b97f'
                                }
                            }
                        },
                        toolbox: {
                            feature: {
                                dataView: {show: true, readOnly: false},
                                magicType: {show: true, type: ['line', 'bar']},
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        legend: {
                            y: 'bottom',
                            data: ['签单量']
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: barData.name,
                                axisPointer: {
                                    type: 'shadow'
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name:'签单量',
                                type:'bar',
                                data: barData.value,
                                itemStyle: {
                                    normal: {
                                        color: "#dc931d",
                                        label: {
                                            show: true,
                                            position: 'top',
                                            formatter: function(p) {
                                                return p.value > 0 ? (p.value) : '';
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    };
                    pieCharts.setOption(option1);
                    barCharts.setOption(option);
                    this.setState({
                        performanceData: data.rows[0]
                    });
                }
            });
        }
    }
    render() {
        return (
            <div>
              <Col className={styles.class01}  >
                <Col xs={5} sm={5} md={5} lg={5} xl={5} className={styles.class01Right}>
                    <div className={styles.lf} style={{width:'290px',height:'491px',backgroundImage:'url('+class01+')'}}>
                        {/* <img src={class01} /> */}
                        <h2> 我的业绩</h2>
                        <h4> Dashboard </h4>
                    </div>
                </Col>
                <Col xs={18} sm={18} md={18} lg={18} xl={18} offset={1}>
                  <Row>
                    <SetTopComponent performanceData={this.state.performanceData}  />
                  </Row>
                  <hr style={{border:'1px solid #d1b97f',margin:'0 12px 0 20px'}}></hr >
                  <Row style={{margin:'28px 12px 28px 20px'}}>
                    <Col xs={13} sm={13} md={13} lg={13} xl={13}>
                      <div className={styles.class01Communal}>
                          <span>签单产品结构:</span>
                      </div>
                      <div id='pie' style={{height:'278px'}}>

                      </div>
                    </Col>
                    <Col xs={11} sm={11} md={11} lg={11} xl={11}>
                      <div>
                        <div style={{paddingLeft:'10px'}} className={styles.class01Communal}>
                          <span>签单量对照表:
                            <Button type="primary" onClick={()=>location.hash='/performance/MyPerformance'} style={{height:'27px',float:'right',lineHeight:'27px'}}>
                                查看更多<Icon type="double-right" />
                            </Button>
                          </span>
                        </div>
                        <div id='bar' style={{height:'278px',borderLeft:'1px solid #d7b15e',paddingLeft:'45px'}}>

                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Col>
            </div>
        )
    }
}


export default connect()(ProductStr);
