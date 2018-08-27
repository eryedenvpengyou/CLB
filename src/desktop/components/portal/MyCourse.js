import React from 'react';
import {Table, Button,Input,Col,Form,DatePicker} from 'antd';
import * as service from '../../services/course';
import { createOrder } from '../../services/pay.js';
import * as styles from '../../styles/myCourse.css';
import moment from 'moment';
import Modals from "../common/modal/Modal";
import CourseEvaluation from "./CourseEvaluation";


const FormItem = Form.Item;


class MyCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      pagesize: 20,
      courses: {},
    }
  }

  componentWillMount() {
    const params = {
      page: 1,
      pagesize: 20,
    }

    service.fetchMyCourse(params).then((data)=>{
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({courses: data});
      }
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
    const params = {
      page: 1,
      pagesize: 20,
    }
    service.fetchMyCourse(params).then((data)=>{
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({courses: data});
      }
    });
  }

  //筛选
  clickSearch(){
    let params = {};
    params.courseDate = this.props.form.getFieldValue('courseDate')?this.props.form.getFieldValue('courseDate').format('YYYY-MM-DD 00:00:00') : null;
    params.topic = this.props.form.getFieldValue('topic');
    params.lecturer = this.props.form.getFieldValue('lecturer');
    params.address = this.props.form.getFieldValue('address');
    params.page = 1;
    params.pagesize = this.state.pagesize;

    service.fetchMyCourse(params).then((data)=>{
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({courses: data});
      }
    });
  }

  //分页
  tableChange(value){
    let params = {};
    params.courseDate = this.props.form.getFieldValue('courseDate')?this.props.form.getFieldValue('courseDate').format('YYYY-MM-DD 00:00:00') : null;
    params.topic = this.props.form.getFieldValue('topic');
    params.lecturer = this.props.form.getFieldValue('lecturer');
    params.address = this.props.form.getFieldValue('address');
    params.page = value.current;
    params.pagesize = value.pageSize;

    service.fetchMyCourse(params).then((data)=>{
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({courses: data});
      }
    });
    this.setState({pagesize: value.pageSize});
  }

  handlePay(rowData){
    Modals.warning(this.ensurePay.bind(this,rowData),'您还未支付该课程，是否确定支付？');
  }




  //确认支付
  ensurePay(rowData,flag){

    if(flag) {
      const params = {};
      params.sourceType = 'COURSE';
      let sourceId = '';
      rowData.students.map((n) => {
        sourceId += `${n.lineId},`;
      });
      params.sourceId = sourceId.substring(0, sourceId.lastIndexOf(','));
      params.amount = rowData.students.length * Number(rowData.price);
      window.open(`/#/portal/payOnline/${params.sourceType}/${params.sourceId}`);
      params.orderSubject = rowData.topic;
      params.orderContent = `${rowData.students.length}名学员报名费用`;

      createOrder(params).then((data) => {
        if (data.success) {
          // location.hash = `portal/payOnline/${params.sourceType}/${params.sourceId}`;
          Modals.warning(this.clickSearch.bind(this),{
            content:'请在新打开的界面上完成支付！',
            cancel: '支付成功',
            ensure: '支付失败',
          });
        } else {
          Modals.error({content: data.message})
        }
      });
    }

  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const dataSource = this.state.courses.rows || [];

    const columns = [{
      title: '课程时间',
      dataIndex: 'courseDate',
      key: 'courseDate',
      width:'210px',
      render: (text, record) => {
        const date = new Date(text);
        const endDate = new Date(Date.parse(date) + (record.duration ?
            record.duration * 60 * 1000 : 0));
        return (
          <span>
              {moment(text).format('YYYY年MM月DD日')}
            <br />
            {`${moment(text).format('HH:mm')}-${moment(endDate).format('HH:mm')}`}
            </span>);
      },
    },{
      title: '课程主题',
      dataIndex: 'topic',
      key: 'topic',
      width:'195px',
      render: (text, record) => <span style={{color:'#d1b97f',cursor:'pointer'}} onClick={()=>location.hash = '/classroom/trainingCourseDetail/'+record.courseId} >{text}</span>,
    },{
      title: '讲师',
      dataIndex: 'lecturer',
      key: 'lecturer',
      width:'110px',
    },{
      title: '地点',
      dataIndex: 'address',
      key: 'address',
      width:'360px',
    },{
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width:'80px',
      render: (text, rowData) =>{

        let item = '';
        if(rowData.status ==='NOTSTARTED'){

          if (rowData.enrollFlag === 'P') {
            item = (
              <Button className={styles.mcourse_btn_default} style={{width:'74px',height:'32px',fontSize:'14px'}} onClick={this.handlePay.bind(this,rowData)}>
                待支付
              </Button>
            );
          } else {
            item = (
              <Button disabled={true} className={styles.mcourse_btn_default} style={{width:'74px',height:'32px',fontSize:'14px'}}>
                已报名
              </Button>
            );
          }
        }else if(rowData.status ==='COMPLETE' && rowData.enrollFlag === 'Y'){
          item =  <CourseEvaluation rowData={rowData} />
        }else {
          item = <Button className={styles.mcourse_btn_default} style={{width:'74px',height:'32px',fontSize:'14px'}} onClick={() => location.hash = '/classroom/trainingCourseDetail/' + rowData.courseId}>查看</Button>;
        }
        return(<div >{item}</div>)
      }
    }]

    return (
      <div  className={styles.table_border}>
        <div style={{paddingLeft:'25px',paddingRight:'25px'}} className={styles.search_border}>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Col span={4} >
              <FormItem  >
                {getFieldDecorator('courseDate')(
                  <DatePicker format="YYYY-MM-DD" placeholder="课程时间"/>
                )}
              </FormItem>
            </Col>
            <Col span={4} >
              <FormItem >
                {getFieldDecorator('topic')(
                  <Input placeholder="课程主题" />
                )}
              </FormItem>
            </Col>
            <Col span={4} >
              <FormItem  >
                {getFieldDecorator('lecturer')(
                  <Input placeholder="讲师" />
                )}
              </FormItem>
            </Col>
            <Col span={4} >
              <FormItem >
                {getFieldDecorator('address')(
                  <Input placeholder="地点" />
                )}
              </FormItem>
            </Col>
            <FormItem style={{marginLeft:'77px'}} >
              <Button type='primary' style={{ width:'140px',height:'40px'}} onClick={this.clickSearch.bind(this)}>查询</Button>
            </FormItem>
            <FormItem style={{marginRight:0}}>
              <Button type='default' style={{ width:'140px',height:'40px'}} onClick={this.handleReset.bind(this)}>全部</Button>
            </FormItem>
          </Form>
        </div>

        <Table
          style={{marginTop:'25px',paddingLeft:'95px',paddingRight:'95px'}}
          columns={columns}
          dataSource={dataSource}
          bordered
          onChange={this.tableChange.bind(this)}
          pagination={{
            showSizeChanger: false,
            pageSize: this.state.pagesize,
            total:this.state.courses.total || 0,
          }}
        />
      </div>
    )
  }
}

MyCourse = Form.create()(MyCourse);
export default MyCourse;
