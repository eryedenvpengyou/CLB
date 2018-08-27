/*
 * show 我的业绩
 * @author:zhouting
 * @version:20170626
 */
import React from 'react';
import { connect } from 'dva';
import { Col,Row,Breadcrumb,Form, Select,Button,Table,Spin,Radio} from 'antd';
import { performance} from '../../services/myPerformance.js';
import { handleTableChange } from '../../utils/table';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
// 引入饼状图 柱状图
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import style from '../../styles/performance.css';
import photo3 from '../../styles/images/performance/photo3.png';
import photo4 from '../../styles/images/performance/photo4.png';
import photo5 from '../../styles/images/performance/photo5.png';
import photo6 from '../../styles/images/performance/photo6.png';
import photo7 from '../../styles/images/performance/photo7.png';
import photo8 from '../../styles/images/performance/photo8.png';
import photo9 from '../../styles/images/performance/photo9.png';
import photo11 from '../../styles/images/performance/photo11.png';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
//年份、月份
const children = [];
//const month = [];
const getDate = new Date();
const getYear = getDate.getFullYear();
const getMonth = getDate.getMonth();
for (let i = getYear - 119; i < getYear + 1; i++) {
    children.unshift(<Option key={i}>{i}</Option>);
}
//月份不限
function unlimited(val){
    var quarter = document.getElementsByClassName('quarter')[0];
    var ardMonth = document.getElementsByClassName('ardMonth')[0];
    if (val == '不限') {
        quarter.style.color = 'rgba(0, 0, 0, 0.65)';
        quarter.style.cursor = 'pointer';
        quarter.style.background = '#fff';
        ardMonth.style.color = '#fff';
        ardMonth.style.background =JSON.parse(localStorage.theme).themeColor;
        ardMonth.style.cursor = 'pointer';
        quarter.disabled = false;
        ardMonth.disabled = false;
    }
    else {
        quarter.style.background ='#fff';
        ardMonth.style.background ='#fff';
        quarter.style.color = 'rgba(0, 0, 0, 0.65)';
        ardMonth.style.color = 'rgba(0, 0, 0, 0.65)';
    }
}
function addCommas(val) {
    return (val + "").replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
        return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
    });
}
function sortBy(name,order) {
    return function(o, p) {
    var a, b;
    if (typeof o === "object" && typeof p === "object" && o && p) {
        a = o[name];
        b = p[name];
        if (a === b) {
            return 0;
        }
        if (typeof a === typeof b) {
            if (order == 'descend') {
                return a > b ? -1 : 1;
            } else if (order == 'ascend') {
                return a < b ? -1 : 1;
            }
        }
        if (order == 'descend') {
            return typeof a > typeof b ? -1 : 1;
        } else if (order == 'ascend') {
            return typeof a < typeof b ? -1 : 1;
        }
        } else {
            throw ("error");
        }
    }
}
class MyPerformance extends React.Component {
    state = {
        expand: false,
    }
    constructor(props){
        super(props);
        this.state = {
            pagination:{
                pageSize: 10
            },
            body:{
               channelId:JSON.parse(localStorage.user).relatedPartyId||-1,
               beginYear:0,
               beginMonth:0,
               settingType:'week',
               classType:'product',
               orderBy:'',
               performanceType :'personal'
            },
            tabChange:0,
            classifyChange:0,
            timeChange:-1,

            allList:{},//其他部分
            performanceStatisticsList:[],
            performanceStatisticsPrdList:[],
            performanceStatisticsSpeList:[],
            profitStructureList:[],
            performanceDetailResponse:[],

            month : [],//设定范围-月份
            optionYJZ:{},//业绩统计-柱状图
            optionYJB:{},//业绩统计-饼图
            optionSYZ:{},//收益结构-柱状图

            //业绩统计-柱状图数据
            timeYJZ:[],
            dataYJZ:[],
            //业绩统计-饼图数据
            bigClassList:[],
            middleClassList:[],
            //收益结构-柱状图数据
            timeSYZ:[],
            dataZK:[],
            dataTD:[],
            dataJS:[],
        };
    }
    componentDidMount() {
        if (this.props.form.getFieldsValue().rge == '不限') {
            this.state.body.beginMonth = -1;
        } else {
            //this.state.body.beginMonth = 8
            this.state.body.beginMonth = parseInt(this.props.form.getFieldsValue().rge);
        }
        this.state.body.beginYear = parseInt(this.props.form.getFieldsValue().year);
        //我的业绩
        performance(this.state.body).then((data) =>{
            if(data.success){
                data.rows[0].performanceDetailResponse.rows.map((row,index) => {
                    row.key = index;
                });
                this.state.pagination.current = 1;
                this.state.pagination.total = data.rows[0].performanceDetailResponse.total;
                this.state.allList = data.rows[0];
                //业绩明细
                this.state.performanceDetailResponse = data.rows[0].performanceDetailResponse.rows;
                //业绩统计数据表
                this.state.performanceStatisticsList = data.rows[0].performanceStatisticsList;
                //业绩统计数据统计图（按照产品分类）
                this.state.performanceStatisticsPrdList = data.rows[0].performanceStatisticsPrdList;
                //业绩统计数据统计图（按照产品公司分类）
                this.state.performanceStatisticsSpeList = data.rows[0].performanceStatisticsSpeList;
                //收益结构
                this.state.profitStructureList = data.rows[0].profitStructureList;

                //默认月份
                for (let i = 1; i <= getMonth + 1; i++) {
                    this.state.month.push(<Option key={i}>{i}</Option>);
                }
                this.state.month.unshift(<Option key='不限'>不限</Option>);
                const barCharts = echarts.init(document.getElementById('bar'));
                const pieCharts = echarts.init(document.getElementById('pie'));
                const structureBarCharts = echarts.init(document.getElementById('structureBar'));
                // 业绩统计柱状图
                this.state.performanceStatisticsList.map((data) =>{
                    this.state.dataYJZ.push(data.orderQty)
                    this.state.timeYJZ.push('第'+data.week+'周')
                });
                this.state.optionYJZ = {
                    color: ['#ffbc00'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.state.timeYJZ
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            min:0,
                            minInterval: 1,
                        }
                    ],
                    series: [//不限
                        {
                            name: '业绩数据',
                            type: 'bar',
                            barWidth: '20%',
                            data: this.state.dataYJZ
                        }
                    ]
                };


                // 业绩统计饼图
                this.state.performanceStatisticsPrdList.map((data)=>{
                    if (data.middleClass) {
                        this.state.middleClassList.push({ value: data.orderQty,name: data.middleClass })
                    } else {
                        this.state.bigClassList.push({value:data.orderQty,name:data.bigClass})
                    }
                });
                this.state.optionYJB = {
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
                            color: this.state.bigClassList.length>0?['#FFD075', '#ff8e00', '#ffbc00']
                            :['#ffbc00'],
                            data:this.state.bigClassList.length>0?this.state.bigClassList:[{value:0,name:'暂无数据'}]
                        },
                        {
                            name: '产品中分类',
                            type: 'pie',
                            radius: ['60%', '70%'],
                            color: this.state.middleClassList.length>0?['#f79a01', '#7395df', '#ff9773', '#ffc173', '#bf9a30', '#ff7140', '#3e97d1', '#a65c00']
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
                            data:this.state.middleClassList.length>0?this.state.middleClassList:[{value:0,name:'暂无数据'}]
                        }
                    ]
                }
                //收益结构柱状图
                this.state.profitStructureList.map((data) => {
                    this.state.timeSYZ.push('第'+data.week+'周');
                    this.state.dataZK.push(data.directCustomerAmount);
                    this.state.dataTD.push(data.teamAmount);
                    this.state.dataJS.push(data.referralFeeAmount);
                });
                this.state.optionSYZ = {
                    color: ['#b8c8fc', '#b198dc', '#6dc7be'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['直客收益', '团队收益', '介绍费']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            data: this.state.timeSYZ
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '直客收益',
                            type: 'bar',
                            data: this.state.dataZK,
                            markPoint: {
                                data: [
                                    { type: 'max', name: '最大值' },
                                    { type: 'min', name: '最小值' }
                                ]
                            },
                            markLine: {
                                data: [
                                    { type: 'average', name: '平均值' }
                                ]
                            }
                        },
                        {
                            name: '团队收益',
                            type: 'bar',
                            data: this.state.dataTD,
                            markPoint: {
                                data: [
                                    { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 },
                                    { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
                                ]
                            },
                            markLine: {
                                data: [
                                    { type: 'average', name: '平均值' }
                                ]
                            }
                        },
                        {
                            name: '介绍费',
                            type: 'bar',
                            data: this.state.dataJS,
                            markPoint: {
                                data: [
                                    { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 },
                                    { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
                                ]
                            },
                            markLine: {
                                data: [
                                    { type: 'average', name: '平均值' }
                                ]
                            }
                        }
                    ]
                };
                this.setState({
                    allList: this.state.allList,
                    //业绩明细
                    performanceDetailResponse: this.state.performanceDetailResponse,
                    //业绩统计数据表
                    performanceStatisticsList: this.state.performanceStatisticsList,
                    //业绩统计数据统计图（按照产品分类）
                    performanceStatisticsPrdList: this.state.performanceStatisticsPrdList,
                    //业绩统计数据统计图（按照产品公司分类）
                    performanceStatisticsSpeList: this.state.performanceStatisticsSpeList,
                    //收益结构
                    profitStructureList: this.state.profitStructureList,
                    // pagination
                    pagination: this.state.pagination,
                });
                barCharts.setOption(this.state.optionYJZ);
                pieCharts.setOption(this.state.optionYJB);
                structureBarCharts.setOption(this.state.optionSYZ);
            } else {
                message.warn(data.message);
                return;
            }
        });
    }
    componentDidUpdate(){
        document.getElementsByClassName('ant-select-arrow')[2].style.color = '#fff'
    }
    sortChange(pagination, filters, sorter) {
        //查询排序
        if (sorter.field) {
            const orderByName = sorter.order.substr(0,sorter.order.indexOf("end"));
            this.state.body.orderBy = sorter.field+" "+orderByName
        }
        this.setState({
            performanceDetailResponse: this.state.performanceDetailResponse,
            pagination: this.state.pagination,
        });
        this.state.body.page = pagination.current;
        this.state.body.pagesize =this.state.pagination.pageSize;
        performance(this.state.body).then((data) =>{
            this.setState({
                performanceDetailResponse: data.rows[0].performanceDetailResponse.rows,
                pagination
            });
        })
    }
    perf(classifyData, tabData) {
        const pieCharts = echarts.init(document.getElementById('pie'));
        this.state.bigClassList = [];
        this.state.middleClassList = [];
        classifyData.map((data) => {
            if(classifyData.length>0){
                if (this.state.classifyChange == 0) {
                    if (data.middleClass) {
                        if (tabData == 0) {
                            this.state.middleClassList.push({ value: data.orderQty, name: data.middleClass });
                        } else if (tabData == 1) {
                            this.state.middleClassList.push({ value: data.anticipatedIncome, name: data.middleClass });
                        } else if (tabData == 2) {
                            this.state.middleClassList.push({ value: data.anticipatedPayAmount, name: data.middleClass });
                        }
                    } else {
                        if (tabData == 0) {
                            this.state.bigClassList.push({ value: data.orderQty, name: data.bigClass });
                        } else if (tabData == 1) {
                            this.state.bigClassList.push({ value: data.anticipatedIncome, name: data.bigClass });
                        } else if (tabData == 2) {
                            this.state.bigClassList.push({ value: data.anticipatedPayAmount, name: data.bigClass });
                        }
                    }
                } else if (this.state.classifyChange == 1) {
                    if (data.supplierName) {
                        if (tabData == 0) {
                            this.state.middleClassList.push({ value: data.orderQty, name: data.supplierName });
                        } else if (tabData == 1) {
                            this.state.middleClassList.push({ value: data.anticipatedIncome, name: data.supplierName });
                        } else if (tabData == 2) {
                            this.state.middleClassList.push({ value: data.anticipatedPayAmount, name: data.supplierName });
                        }
                    } else {
                        if (tabData == 0) {
                            this.state.bigClassList.push({ value: data.orderQty, name: data.bigClass });
                        } else if (tabData == 1) {
                            this.state.bigClassList.push({ value: data.anticipatedIncome, name: data.bigClass });
                        } else if (tabData == 2) {
                            this.state.bigClassList.push({ value: data.anticipatedPayAmount, name: data.bigClass });
                        }
                    }
                }
                this.state.optionYJB.series[0].data = this.state.bigClassList;
                this.state.optionYJB.series[1].data = this.state.middleClassList;
                this.state.optionYJB.series[0].color= ['#FFD075', '#ff8e00', '#ffbc00'];
                this.state.optionYJB.series[1].color= ['#f79a01', '#7395df', '#ff9773', '#ffc173', '#bf9a30', '#ff7140', '#3e97d1', '#a65c00'];
            }else{
                this.state.optionYJB.series[0].data = [{value:0,name:'暂无数据'}];
                this.state.optionYJB.series[1].data = [{value:0,name:'暂无数据'}];
                this.state.optionYJB.series[0].color= ['#ffbc00'];
                this.state.optionYJB.series[1].color= ['#ffbc00'];
            }
        });
        pieCharts.setOption(this.state.optionYJB);
    }
    //图表关联
    Echart =(index,e)=>{
        const barCharts = echarts.init(document.getElementById('bar'));
        const structureBarCharts = echarts.init(document.getElementById('structureBar'));
        barCharts.setOption(this.state.optionYJZ);
        structureBarCharts.setOption(this.state.optionSYZ);
    }
    //年份选择
    yearChange(val) {
        this.props.form.setFieldsValue({
            rge : '不限'
        })
        unlimited(this.props.form.getFieldsValue().rge);
        //日期选择月份不能超过当前
        if (val == getYear) {
            this.state.month = []
            for (let i = 1; i <= getMonth+1 ; i++) {
                this.state.month.push(<Option key={i}>{i}</Option>);
            }
            this.state.month.unshift(<Option key='不限'>不限</Option>);
        } else {
            this.state.month = [];
            for (let i = 1; i <= 12 ; i++) {
                this.state.month.push(<Option key={i}>{i}</Option>);
            }
            this.state.month.unshift(<Option key='不限'>不限</Option>);
        }
        this.Echart();
        this.res(val,'不限');
    };
    //月份选择
    monthChange(val){
        unlimited(val);
        this.state.optionYJZ.xAxis[0].data = ['第1周', '第2周', '第3周', '第4周', '第5周','第6周'];
        this.state.optionSYZ.xAxis[0].data = ['第1周', '第2周', '第3周', '第4周', '第5周','第6周'];
        this.Echart();
        this.res(this.props.form.getFieldsValue().year,val);
    }
    //设定方式
    wayChange(index){
        this.props.form.setFieldsValue({ rge : '不限'})
        this.state.timeChange = index;
        index == 0 ?this.state.body.settingType ='quarter':this.state.body.settingType ='month'
        this.state.body.beginYear = parseInt(this.props.form.getFieldsValue().year);
        this.state.body.beginMonth = -1;
        if (index == 0) {
            document.getElementsByClassName('quarter')[0].style.background = JSON.parse(localStorage.theme).themeColor;
            document.getElementsByClassName('quarter')[0].style.color = '#fff';
            document.getElementsByClassName('ardMonth')[0].style.background = '#fff';
            document.getElementsByClassName('ardMonth')[0].style.color = 'rgba(0, 0, 0, 0.65)';
        } else if (index == 1) {
            document.getElementsByClassName('ardMonth')[0].style.background = JSON.parse(localStorage.theme).themeColor;
            document.getElementsByClassName('ardMonth')[0].style.color = '#fff';
            document.getElementsByClassName('quarter')[0].style.background = '#fff';
            document.getElementsByClassName('quarter')[0].style.color = 'rgba(0, 0, 0, 0.65)';
        }
        this.res(this.state.body.beginYear,this.state.body.beginMonth)
    }
     //查询
     res(beginY,beginM) {
        this.state.tabChange = 0;
        document.getElementsByClassName(style.perfTab)[0].style.color = JSON.parse(localStorage.theme).themeColor;//刷新默认选中tab生效订单
        if (beginM == '不限') {
            this.state.body.beginMonth = -1;
            this.state.body.settingType = 'month';
        } else {
            this.state.body.beginMonth = parseInt(beginM);
        }
        this.state.body.beginYear = parseInt(beginY);
        if (beginM>0) {
            this.state.body.settingType = 'week';
        }
        this.props.form.setFieldsValue({classify:'product'});
        this.state.body.classType = 'product';
        document.getElementsByClassName(style.perfTab)[1].style.color = '#fff';
        document.getElementsByClassName(style.perfTab)[2].style.color = '#fff';
        performance(this.state.body).then((data) => {
            if(data.success){
                data.rows[0].performanceDetailResponse.rows.map((row,index) => {
                    row.key = index;
                });
                this.state.pagination.current = 1;
                this.state.pagination.total = data.rows[0].performanceDetailResponse.total;
                this.state.timeYJZ = [];
                this.state.dataYJZ = [];
                this.state.bigClassList = [];
                this.state.middleClassList = [];
                this.state.timeSYZ = [];
                this.state.dataZK = [];
                this.state.dataTD = [];
                this.state.dataJS = [];
                this.state.allList = data.rows[0];
                //业绩明细
                this.state.performanceDetailResponse = data.rows[0].performanceDetailResponse.rows;
                //业绩统计数据表
                this.state.performanceStatisticsList = data.rows[0].performanceStatisticsList;
                //业绩统计数据统计图（按照产品分类）
                this.state.performanceStatisticsPrdList = data.rows[0].performanceStatisticsPrdList;
                //业绩统计数据统计图（按照产品公司分类）
                this.state.performanceStatisticsSpeList = data.rows[0].performanceStatisticsSpeList;
                //收益结构
                this.state.profitStructureList = data.rows[0].profitStructureList;

                const barCharts = echarts.init(document.getElementById('bar'));
                const pieCharts = echarts.init(document.getElementById('pie'));
                const structureBarCharts = echarts.init(document.getElementById('structureBar'));
                // 业绩统计柱状图
                this.state.performanceStatisticsList.map((data) => {
                    this.state.dataYJZ.push(data.orderQty);
                    if (this.state.body.settingType == 'quarter') {
                        this.state.timeYJZ.push('第' + data.quarter + '季度');
                    } else if (this.state.body.settingType == 'month') {
                        this.state.timeYJZ.push( data.month + '月');
                    } else if(this.state.body.settingType == 'week'){
                        this.state.timeYJZ.push('第' + data.week + '周');
                    }
                });
                this.state.optionYJZ.xAxis[0].data = this.state.timeYJZ;
                this.state.optionYJZ.series[0].data = this.state.dataYJZ;
                // 业绩统计饼图
                if(this.state.performanceStatisticsPrdList.length>0){
                    this.state.performanceStatisticsPrdList.map((data) => {
                        if (data.middleClass) {
                            this.state.middleClassList.push({ value: data.orderQty, name: data.middleClass });
                        } else {
                            this.state.bigClassList.push({ value: data.orderQty, name: data.bigClass })
                        }
                    });
                    this.state.optionYJB.series[0].data = this.state.bigClassList;
                    this.state.optionYJB.series[1].data = this.state.middleClassList;
                    this.state.optionYJB.series[0].color= ['#FFD075', '#ff8e00', '#ffbc00'];
                    this.state.optionYJB.series[1].color= ['#f79a01', '#7395df', '#ff9773', '#ffc173', '#bf9a30', '#ff7140', '#3e97d1', '#a65c00'];
                }else{
                    this.state.optionYJB.series[0].data = [{value:0,name:'暂无数据'}];
                    this.state.optionYJB.series[1].data = [{value:0,name:'暂无数据'}];
                    this.state.optionYJB.series[0].color= ['#ffbc00'];
                    this.state.optionYJB.series[1].color= ['#ffbc00'];
                }
                //收益结构柱状图
                this.state.profitStructureList.map((data) => {
                if (this.state.body.settingType == 'quarter') {
                    this.state.timeSYZ.push('第' + data.quarter + '季度');
                } else if (this.state.body.settingType == 'month') {
                    this.state.timeSYZ.push( data.month + '月');
                } else if(this.state.body.settingType == 'week'){
                    this.state.timeSYZ.push('第' + data.week + '周');
                }
                this.state.dataZK.push(data.directCustomerAmount);
                this.state.dataTD.push(data.teamAmount);
                this.state.dataJS.push(data.referralFeeAmount);
                });
                this.state.optionSYZ.xAxis[0].data = this.state.timeSYZ;
                this.state.optionSYZ.series[0].data = this.state.dataZK;
                this.state.optionSYZ.series[1].data = this.state.dataTD;
                this.state.optionSYZ.series[2].data = this.state.dataJS;

                this.setState({
                    allList: this.state.allList,
                    //业绩明细
                    performanceDetailResponse: this.state.performanceDetailResponse,
                    //业绩统计数据表
                    performanceStatisticsList: this.state.performanceStatisticsList,
                    //业绩统计数据统计图（按照产品分类）
                    performanceStatisticsPrdList: this.state.performanceStatisticsPrdList,
                    //业绩统计数据统计图（按照产品公司分类）
                    performanceStatisticsSpeList: this.state.performanceStatisticsSpeList,
                    //收益结构
                    profitStructureList: this.state.profitStructureList,
                    //pagination
                    pagination: this.state.pagination,
                });

                barCharts.setOption(this.state.optionYJZ);
                pieCharts.setOption(this.state.optionYJB);
                structureBarCharts.setOption(this.state.optionSYZ);
            }
        });
    }

    //业绩统计-tab(控制柱状图，饼图)
    handleClick(index,e){
        this.state.dataYJZ=[];
        this.state.bigClassList=[];
        this.state.middleClassList =[];
        const perfTab = document.getElementById('perList').children;
        const barCharts = echarts.init(document.getElementById('bar'));
        if (e.target.style.color == JSON.parse(localStorage.theme).themeColor) {
            e.target.style.color = '#fff';
        } else {
            for (var i = 0; i <perfTab.length; i++) {
                perfTab[i].style.color = '#fff';
            }
            e.target.style.color = JSON.parse(localStorage.theme).themeColor;
        }
        if (index == 0) {//订单量
            this.state.tabChange = 0;
            this.state.performanceStatisticsList.map((data) =>{
                this.state.dataYJZ.push(data.orderQty);
            });
            if (this.state.classifyChange == 0) {
                this.perf(this.state.performanceStatisticsPrdList,0);
            } else if (this.state.classifyChange == 1) {
                this.perf(this.state.performanceStatisticsSpeList,0);
            }
        } else if (index == 1) {//预计直客收益
            this.state.tabChange = 1;
            this.state.performanceStatisticsList.map((data) =>{
                this.state.dataYJZ.push(data.anticipatedIncome);
            });
            if (this.state.classifyChange == 0) {
                this.perf(this.state.performanceStatisticsPrdList,1);
            } else if (this.state.classifyChange == 1) {
                this.perf(this.state.performanceStatisticsSpeList,1);
            }
        } else if(index == 2) {//预计缴费总额
            this.state.tabChange = 2;
            this.state.performanceStatisticsList.map((data) =>{
                this.state.dataYJZ.push(data.anticipatedPayAmount);
            });
            if (this.state.classifyChange == 0) {
               this.perf(this.state.performanceStatisticsPrdList,2);
            } else if (this.state.classifyChange == 1) {
                this.perf(this.state.performanceStatisticsSpeList,2);
            }
        }
        this.state.optionYJZ.series[0].data = this.state.dataYJZ;
        barCharts.setOption(this.state.optionYJZ);
    }
    //业绩统计-下拉选择框(控制饼图)
    classifyChange(val){
        if (val == 'product') {
            this.state.classifyChange = 0;
            if (this.state.tabChange == 0){
                this.perf(this.state.performanceStatisticsPrdList,0)
            } else if (this.state.tabChange == 1) {
                this.perf(this.state.performanceStatisticsPrdList,1)
            } else if (this.state.tabChange == 2) {
                this.perf(this.state.performanceStatisticsPrdList,2)
            }
        } else if (val == 'supplier') {
            this.state.classifyChange = 1;
            if (this.state.tabChange == 0){
                this.perf(this.state.performanceStatisticsSpeList,0);
            } else if (this.state.tabChange == 1) {
                this.perf(this.state.performanceStatisticsSpeList,1);
            } else if (this.state.tabChange == 2) {
                this.perf(this.state.performanceStatisticsSpeList,2);
            }
        }
    }
    //切换按钮
    //tab标签
    tabClick(index, e) {
        this.state.orderBy = [];
        this.state.body.orderBy = '';
        var ele = document.getElementsByClassName('ant-radio-button-wrapper');
        if (index == 0) {
            ele[0].style.backgroundColor = JSON.parse(localStorage.theme).themeColor;
            ele[1].style.backgroundColor = '#fff';
            ele[0].style.color = '#fff';
            ele[1].style.color = '#333';
            ele[0].style.borderColor = JSON.parse(localStorage.theme).themeColor;
            ele[0].style.borderRight = JSON.parse(localStorage.theme).themeColor;
            document.getElementsByClassName(style.structureCount)[0].style.display = 'none';
            this.state.body.performanceType = 'personal'
        } else if (index == 1) {
            ele[1].style.backgroundColor = JSON.parse(localStorage.theme).themeColor;
            ele[0].style.backgroundColor = '#fff';
            ele[1].style.color = '#fff';
            ele[0].style.color = '#333';
            ele[1].style.borderColor = JSON.parse(localStorage.theme).themeColor;
            ele[1].style.borderLeft = JSON.parse(localStorage.theme).themeColor;
            ele[1].style.boxShadow = 'none';
            document.getElementsByClassName(style.structureCount)[0].style.display = 'block';
            this.state.body.performanceType = 'team'

            console.log(ele[0].style)
        }
        this.res(this.props.form.getFieldsValue().year,this.props.form.getFieldsValue().rge);
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 },
        }
      //业绩明细表
      const columns = [ {
          title: '收益类型',
          key: 'incomeType',
          dataIndex: 'incomeType',
          render: (text,record) => {
                return record.incomeType;
         }
      },{
          title: '订单编号',
          key: 'orderNum',
          dataIndex: 'orderNum',
          render: (text,record) => {
              return record.orderNum;
          }
      },{
          title: '产品名称',
          key: 'productName',
          dataIndex: 'productName',
          render: (text,record) => {
                return record.itemName;
         }
      },{
          title: '预计缴费金额',
          key: 'sum',
          dataIndex: 'sum',
          render: (text,record) => {

                return Math.round(record.anticipatedPayAmount).toString().length >= 7 ?
                        addCommas(Math.round(record.anticipatedPayAmount).toString().substring(
                            -1, Math.round(record.anticipatedPayAmount).toString().length - 4
                        ) + '万') :
                        addCommas(Math.round(record.anticipatedPayAmount));
         }
      },{
          title: '币种',
          key: 'currency',
          dataIndex: 'currency',
          render: (text,record) => {
                return record.currency;
         }
      },{
          title: '汇率',
          key: 'rate',
          dataIndex: 'rate',
          render: (text,record) => {
                return record.rate;
         }
      }, {
          title: '费率',
          key: 'rating',
          dataIndex: 'rating',
          render: (text, record) => {
              return record.rate1;
          }
      }, {
          title: '预计收益(HKD)',
          key: 'anticipatedIncomeHkdAmount',
          dataIndex: 'anticipatedIncomeHkdAmount',
          render: (text,record) => {
                return Math.round(record.anticipatedIncomeHKDAmount).toString().length >= 7 ?
                        addCommas(Math.round(record.anticipatedIncomeHKDAmount).toString().substring(
                            -1, Math.round(record.anticipatedIncomeHKDAmount).toString().length - 4
                        ) + '万') :
                        addCommas(Math.round(record.anticipatedIncomeHKDAmount));
         },
          sorter: true
      },{
        title: '实际收益（HKD)',
        key: 'hkdAmount',
        dataIndex: 'hkdAmount',
        render: (text,record) => {
              if(record.hkdAmount=='--'){
                 return record.hkdAmount
              }else{
                  Math.round(record.hkdAmount).toString().length >= 7 ?
                      addCommas(Math.round(record.hkdAmount).toString().substring(
                          -1, Math.round(record.hkdAmount).toString().length - 4
                      ) + '万') :
                      addCommas(Math.round(record.hkdAmount));
              }
       }
    }];
    return (
        <div className={style.main}>
            {/* 切换按钮 */}
             <div className={style.btn}>
                <RadioGroup defaultValue='a'>
                    <RadioButton onClick={this.tabClick.bind(this,0)} style={{ width: '120px', height: '40px', textAlign: 'center', lineHeight: '40px' ,background:JSON.parse(localStorage.theme).themeColor,borderColor:JSON.parse(localStorage.theme).themeColor,color:'#fff',fontSize:'16px'}} className='person' value='a'>直客业绩</RadioButton>
                    <RadioButton onClick={this.tabClick.bind(this,1)} style={{ width: '120px', height: '40px', textAlign: 'center', lineHeight: '40px',fontSize:'16px' }} className='team' value='b'>团队业绩</RadioButton>
                </RadioGroup>
             </div>
             {/*我的业绩*/}
             <div className={style.headPerf}>
                 <div className={style.lf}>
                     <span>我的业绩</span>
                     <div className={style.headInfo}>
                         <p>预约中收益</p>
                         <h2>
                             {Math.round(this.state.allList.toBeNominatedAmount).toString().length>=7?
                             addCommas(Math.round(this.state.allList.toBeNominatedAmount).toString().substring(
                                -1, Math.round(this.state.allList.toBeNominatedAmount).toString().length-4)+'万')
                             :addCommas(Math.round(this.state.allList.toBeNominatedAmount))}
                             <span>港币</span>
                         </h2>
                     </div>
                 </div>
                 <div className={style.lf}>
                     <span>我的业绩</span>
                     <div className={style.headInfo}>
                         <p>签单中收益</p>
                         <h2>
                             {Math.round(this.state.allList.currentMonthAmount).toString().length>=7?
                                addCommas(Math.round(this.state.allList.currentMonthAmount).toString().substring(
                                    -1, Math.round(this.state.allList.currentMonthAmount).toString().length-4
                                )+'万'):
                                addCommas(Math.round(this.state.allList.currentMonthAmount))
                             }
                             <span>港币</span>
                         </h2>
                     </div>
                 </div>
                 <div className={style.lf}>
                     <span>我的业绩</span>
                     <div className={style.headInfo}>
                         <p>应收款总额</p>
                         <h2>
                             {Math.round(this.state.allList.unconfirmedAmount).toString().length>=7?
                                addCommas(Math.round(this.state.allList.unconfirmedAmount).toString().substring(
                                     -1, Math.round(this.state.allList.unconfirmedAmount).toString().length-4
                                )+'万'):
                                addCommas(Math.round(this.state.allList.unconfirmedAmount))
                             }
                             <span>港币</span>
                         </h2>
                     </div>
                 </div>
             </div>
             {/*设定范围*/}
             <div className={style.range}>
                <div className={style.rangeContent}>
                    <Col span='8'>
                    <FormItem {...formItemLayout} label="设定范围" style={{ marginBottom: 0 }}>
                        {getFieldDecorator('year', {
                            rules: [{ message: '设定范围:', whitespace: true }],
                            initialValue: getYear.toString(),
                            onChange: this.yearChange.bind(this)
                        })(
                            <Select showSearch placeholder="请选择年份"
                                optionFilterProp="children" style={{ width: '85%', marginRight: '5px' }}
                            >
                                {children}
                            </Select>
                            )}
                        <span style={{fontSize:'15px'}}>年</span>
                    </FormItem>
                    </Col>
                    <Col span='16'>
                    <FormItem>
                        {getFieldDecorator('rge', {
                            rules: [{ message: '状态:', whitespace: true }],
                            initialValue: (getMonth + 1).toString(),
                            onChange: this.monthChange.bind(this)
                        })(
                            <Select showSearch placeholder="请选择月份"
                                optionFilterProp="children" style={{ width: '21.25%', marginRight: '5px' }}
                            >
                               {this.state.month}
                            </Select>
                        )}
                        <span style={{fontSize:'15px'}}>月</span>
                        {/* <Button onClick={this.res.bind(this)} size="large" type="default" style={{ width: 100, margin: '0 12px', color: '#ff8e00' }}>确定</Button> */}
                        <span style={{margin:'0 0 0 26px',fontSize:'15px'}}>设定方式：</span>
                        <div style={{ display: 'inline-block' }}>
                            <Button className='quarter' onClick={this.wayChange.bind(this, 0)} size="large" type="default" style={{ width: 100}}>按季度</Button>
                            <Button className='ardMonth' onClick={this.wayChange.bind(this, 1)} size="large" type="default" style={{ width: 100, marginLeft: 12 }}>按月份</Button>
                        </div>
                    </FormItem>
                    </Col>
                </div>
             </div>
             <div>
                 {/*订单统计*/}
                 <div className={style.orderCount}>
                     <div className={style.contentT}>
                         <div>业务汇总</div>
                         <p>SALES SUMMARY</p>
                     </div>
                     <div className={style.orderM}>
                         <ul className={style.lf}>
                             <li className={style.lf}>
                                 <img src={photo3} alt="" />
                                 <div className={style.det}>
                                     <div style={{ color: '#ff8761' }}>新增客户</div>
                                     <a href='javascript:;'>{this.state.allList.newCustomerQty}</a>
                                 </div>
                             </li>
                             <li className={style.lf}>
                                 <img src={photo4} alt="" />
                                 <div className={style.det}>
                                     <div style={{ color: '#57bdde' }}>生效订单</div>
                                     <a href='javascript:;'>{this.state.allList.newOrderQty}</a>
                                 </div>
                             </li>
                             <li className={style.lf}>
                                 <img src={photo5} alt="" />
                                 <div className={style.det} style={{right:'-15px'}}>
                                     <div style={{ color: '#b198dc' }}>缴费总额（HKD）</div>
                                     <a href='javascript:;'>
                                        {Math.round(this.state.allList.predictPaymentAmount).toString().length >= 7 ?
                                            addCommas(Math.round(this.state.allList.predictPaymentAmount).toString().substring(
                                                -1, Math.round(this.state.allList.predictPaymentAmount).toString().length - 4
                                            ) + '万') :
                                            addCommas(Math.round(this.state.allList.predictPaymentAmount))
                                        }
                                    </a>
                                 </div>
                             </li>
                             <li className={style.lf}>
                                 <img src={photo6} alt="" />
                                 <div className={style.det} style={{right:'-15px'}}>
                                     <div style={{ color: '#6dc7de' }}>直客收益（HKD）</div>
                                     <a href='javascript:;'>
                                         {Math.round(this.state.allList.predictIncomeAmount).toString().length >= 7 ?
                                             addCommas(Math.round(this.state.allList.predictIncomeAmount).toString().substring(
                                                 -1, Math.round(this.state.allList.predictIncomeAmount).toString().length - 4
                                             ) + '万') :
                                             addCommas(Math.round(this.state.allList.predictIncomeAmount))
                                         }
                                     </a>
                                 </div>
                             </li>
                         </ul>
                     </div>
                     <div className={style.orderB}>
                         <img className={style.lf} src={photo8} alt="" width='258px' />
                         <div className={style.lf}>
                             <img src={photo7} alt="" />
                             <span>订单统计</span>
                             <div className={style.orderStu}>
                                 <div>跟进中</div>
                                 <div>{this.state.allList.followingUpOrderQty}</div>
                             </div>
                             <div className={style.orderNum}>
                                 <a href='javascript:;'>审核中：{this.state.allList.auditOrderQty}</a>
                                 <a href='javascript:;'>预约中：{this.state.allList.appointmentOrderQty}</a>
                                 <a href='javascript:;'>签单中：{this.state.allList.toSignOrderQty}</a>
                             </div>
                         </div>
                         <div className={style.lf}>
                             <img src={photo7} alt="" />
                             <span>订单统计</span>
                             <div className={style.orderStu}>
                                 <div>已签单</div>
                                 <div>{this.state.allList.signedOrderQty}</div>
                             </div>
                             <div className={style.orderNum}>
                                 <a href='javascript:;'>批核中:{this.state.allList.approvingOrderQty}</a>
                                 <a href='javascript:;'>Pending中:{this.state.allList.pendingOrderQty}</a>
                                 <a href='javascript:;'>已生效:{this.state.allList.effectiveOrderQty}</a>
                                 <a href='javascript:;'>订单取消:{this.state.allList.abrogatedOrderQty}</a>
                             </div>
                         </div>
                     </div>
                 </div>
                 {/*业绩统计*/}
                 <div className={style.performanceCount}>
                     <div className={style.performanceInfo}>
                         <div className={style.contentT}>
                             <div>收入汇总</div>
                             <p>INCOME SUMMARY</p>
                         </div>
                         <div className={style.perList} id='perList'>
                             <span className={style.perfTab} onClick={this.handleClick.bind(this,0)} style={{ left: '5%' ,color:JSON.parse(localStorage.theme).themeColor}}>生效订单</span>
                             <span className={style.perfTab} onClick={this.handleClick.bind(this,1)} style={{ left: '19.5%' ,width:'100px',top:'-3%'}}>直客收益（HKD）</span>
                             <span className={style.perfTab} onClick={this.handleClick.bind(this,2)} style={{ left: '34%' ,width:'100px',top:'-3%'}}>缴费总额（HKD）</span>
                         </div>
                         <div className={style.contentB}>
                             <div className={style.lf}>
                                 <div style={{width:'160px',height:'40px', borderRadius:'5px',background:'#048ce3',color: '#fff', marginLeft: '20px', fontSize: '18px',marginTop:'10px',color:'#fff',lineHeight:'40px',textAlign:'center'}}>数据图表</div>
                                 <div id='bar' className={style.dataList}></div>
                             </div>
                             <div className={style.lf}>
                                 <FormItem>
                                    {getFieldDecorator('classify', {
                                         rules: [{ message: '按产品分类:', whitespace: true }],
                                         initialValue: 'product',
                                         onChange: this.classifyChange.bind(this)
                                    })(
                                         <Select className={style.product}
                                             placeholder="请选择分类"
                                             optionFilterProp="children" style={{ width: '28%', margin: '10px 2% 0 20px'}}
                                         >
                                             <Option value="product">按产品分类</Option>
                                             <Option value="supplier">按产品公司分类</Option>
                                         </Select>
                                    )}
                                 </FormItem>
                                 <div id='pie' className={style.dataList}></div>
                             </div>
                         </div>
                     </div>
                 </div>
                 {/*收益结构*/}
                 <div className={style.structureCount}>
                     <div className={style.structure}>
                         <div className={style.contentT}>
                             <div>收入结构</div>
                             <p>INCOME STRUCTURE</p>
                         </div>
                         <div className={style.structureL} style={{ float: 'left' }}>
                             <img style={{ display: 'inline-block' }} src={photo9} alt="" />
                             <div>
                                 <ul className={style.lf} style={{marginLeft:'10px'}}>
                                     <li style={{ marginTop: '16px' ,textAlign:'right'}}>介绍费：</li>
                                     <li style={{ marginTop: '47px' }}>直客收益：</li>
                                     <li style={{ marginTop: '48px' }}>团队分成：</li>
                                 </ul>
                                 <img className={style.lf} src={photo11} alt="" />
                                 <ul className={style.lf}>
                                     <li style={{ marginTop: '16px' }}>
                                         {Math.round(this.state.allList.referralFeeTotalAmount).toString().length >= 7 ?
                                             addCommas(Math.round(this.state.allList.referralFeeTotalAmount).toString().substring(
                                                 -1, Math.round(this.state.allList.referralFeeTotalAmount).toString().length - 4
                                             ) + '万') :
                                             addCommas(Math.round(this.state.allList.referralFeeTotalAmount))
                                         }
                                         港币
                                 </li>
                                     <li style={{ marginTop: '37px' }}>
                                         {Math.round(this.state.allList.directCustomerTotalAmount).toString().length >= 7 ?
                                             addCommas(Math.round(this.state.allList.directCustomerTotalAmount).toString().substring(
                                                 -1, Math.round(this.state.allList.directCustomerTotalAmount).toString().length - 4
                                             ) + '万') :
                                             addCommas(Math.round(this.state.allList.directCustomerTotalAmount))
                                         }
                                         港币
                                 </li>
                                     <li style={{ marginTop: '48px' }}>
                                         {Math.round(this.state.allList.teamTotalAmount).toString().length >= 7 ?
                                             addCommas(Math.round(this.state.allList.teamTotalAmount).toString().substring(
                                                 -1, Math.round(this.state.allList.teamTotalAmount).toString().length - 4
                                             ) + '万') :
                                             addCommas(Math.round(this.state.allList.teamTotalAmount))
                                         }
                                         港币
                                 </li>
                                 </ul>
                             </div>
                         </div>
                         <div style={{ float: 'left' }}>
                             <div id='structureBar' className={style.structureDate}></div>
                             <div className={style.structureB}>
                                 <span><span style={{ background: '#b8c8fc' }}></span>直客收益</span>
                                 <span><span style={{ background: '#b198dc' }}></span>团队分成</span>
                                 <span><span style={{ background: '#6dc7be' }}></span>介绍费</span>
                             </div>
                         </div>
                     </div>
                 </div>
                 {/*业绩明细表*/}
                 <div className={style.perfDetail}>
                     <div className={style.contentT}>
                         <div>收入明细</div>
                         <p>INCOME LIST</p>
                     </div>
                     <Table rowKey='key'
                         dataSource={this.state.performanceDetailResponse}
                         columns={columns}
                         bordered scroll={{x:'130%'}}
                         onChange={this.sortChange.bind(this)}
                         pagination={this.state.pagination}
                         //onChange={handleTableChange.bind(this, performance, this.state.body)}
                         //pagination={this.state.pagination}
                         />
                 </div>
             </div>
        </div>
    );
  }
}
export default Form.create()(MyPerformance);
