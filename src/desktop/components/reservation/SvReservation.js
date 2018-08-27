import React  , { Component } from 'react';
import {Table, Button,Form,Select,Input, Dropdown,Menu, Icon,Row,Col} from 'antd';
import * as codeService from '../../services/code';
import Modals from '../common/modal/Modal';
import * as service from '../../services/reservation';
import * as styles from '../../styles/sys.css';
import moment from 'moment';

const FormItem = Form.Item;
const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};
class SvReservation extends Component {

  constructor(props){
    super(props);
    this.state = {
      orderBy: [],
      current: 1,
      code: {},
      data: {},
      itemList: {},   //产品名称 下拉列表取值
    }
  }

  componentWillMount() {
    service.fetchAddService({
      orderType:'VALUEADD'
    }).then((data)=>{
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
        });
        for(let i in data.rows){
          if(data.rows[i].status == 'WAIT_PAY'){
            this.getPayOrderInfo(data, i);
          }
        }
        this.setState({data: data});
      }
    });

    let params ={
      statusList: 'ORD.VALUEADD_STATUS',
      // ORD.VALUE_ADD_TYPE   增值服务类型
    };
    //获取快码
    codeService.getCode(params).then((data)=>{
      this.setState({code:data,})
    });

    //查询增值服务的产品名称
    params = {
      bigClass: 'FW',
      pageSize: 99999,
      enabledFlag: 'Y',
    };
    service.getProduction(params).then((data)=>{
      if(data.success){
        this.setState({itemList: data});
      }
    });
  }

  //获取每个订单得 支付失效时间
  getPayOrderInfo(data, i){
    const params ={
      sourceId: data.rows[i].orderId,
      sourceType: 'ORDER',
    };
    service.getPayOrderInfo(params).then((newData)=>{
      if(newData.success){
        const creationDate = newData.rows[0].creationDate;
        const payLimitTime = newData.rows[0].payLimitTime;
        const curDate = data.rows[i] ? data.rows[i].curDate :'';

        let seconds = 0;
        if(isNaN(payLimitTime)){
          seconds = 0;
        }else{
          seconds = payLimitTime * 60 * 1000;
        }
        let startTime = new Date(creationDate).getTime() + seconds;
        let endTime = new Date(curDate).getTime();

        if(startTime > endTime){
          data.rows[i].status = 'WAIT_PAY';
          data.rows[i].payTime = creationDate;
          data.rows[i].payLimitTime = payLimitTime;
        }else{
          data.rows[i] ? data.rows[i].status = 'RESERVE_CANCELLED' : '';
        }

        if(this.props.form.getFieldValue('status') && this.props.form.getFieldValue('status') == 'WAIT_PAY'){
          data.rows = data.rows.filter((item)=> item.status != 'RESERVE_CANCELLED');
        }
        this.setState({data: data});
      }
    });
  }

  //查看详情/修改
  svDetail(record){
    location.hash = `/portal/svDetailHandle/${record.valueaddType}/${record.orderId}/${record.itemId}/2`;
  }

  //查看日志
  svLog(record){
    service.fetchHisLog({orderId:record.orderId}).then((data)=>{
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
        });
        const statusHisList = data.rows || [];
        this.setState({statusHisList: statusHisList});
        Modals.LogModel({List:this.state.statusHisList})
      }
    });
  }

  //取消预约
  svCancel(record){
    if(record.status == 'NEED_REVIEW'){
      Modals.warning(this.ensureCancel.bind(this, record),'资料正在审核中，确定取消当前预约？');
    }else{
      Modals.warning(this.ensureCancel.bind(this, record),'是否确定取消预约？');
    }
  }

  //去支付
  svPay(record){
    Modals.warning(this.ensurePay.bind(this, record),'订单成功后，如需撤销退款，需在工作日内提前24小时提交撤销申请。确认后支付。');
  }

  //确认取消
  ensureCancel(record, flag){
    if(!flag) return;

    //将状态变为 取消
    record.status = 'RESERVE_CANCELLED';
    record.hisStatus = 'RESERVE_CANCELLED';              //日志状态
    record.hisDesc = '订单状态变更为取消预约,非常感谢!';    //日志内容
    record.__status = 'update';

    service.submitAddService([record]).then((data)=>{
      if(data.success){
        const params = {
          orderType:'VALUEADD',
        };
        service.fetchAddService(params).then((data)=>{
          if(data.success){
            data.rows.map((row, index) => {
              row.key = index;
              if(row.status == 'WAIT_PAY'){
                this.getPayOrderInfo(data, index);
              }
            });
            this.setState({data: data});
          }
        });
        Modals.success({content:'取消预约成功！'});
      }else{
        Modals.error({content:'取消预约失败失败！'});
      }
    });
  }

  //确认支付
  ensurePay(record, flag){
    if(flag){
      // location.hash = '/portal/payOnline/ORDER/'+record.orderId;
      window.open('/#/portal/payOnline/ORDER/'+record.orderId);
      Modals.warning(this.paySuccess.bind(this, record),{
        content:'请在新打开的界面上完成支付！',
        cancel: '支付成功',
        ensure: '支付失败',
      });
    }
  }

  //刷新界面
  paySuccess(record, flag){
    this.serach();
  }


  //搜索
  serach(){
    let params = {
      orderType:'VALUEADD',
      orderNumber: this.props.form.getFieldValue('orderNumber'),
      itemName: this.props.form.getFieldValue('itemName'),
      applicant: this.props.form.getFieldValue('applicant'),
      status: this.props.form.getFieldValue('status'),
    };
    service.fetchAddService(params).then((data)=>{
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
          if(row.status == 'WAIT_PAY'){
            this.getPayOrderInfo(data, index);
          }
        });
        if(this.props.form.getFieldValue('status') && this.props.form.getFieldValue('status') == 'WAIT_PAY'){
          data.rows = data.rows.filter((item)=> item.status != 'RESERVE_CANCELLED');
        }
        this.setState({data: data, current: 1});
      }
    });
  }

  //搜索全部
  searchAll(){
    service.fetchAddService({
      orderType: 'VALUEADD'
    }).then((data)=>{
      if(data.success){
        data.rows.map((row, index) => {
          row.key = index;
          if(row.status == 'WAIT_PAY'){
            this.getPayOrderInfo(data, index);
          }
        });
        this.setState({data: data, current: 1});
      }
    });
    this.props.form.resetFields();
  }

  //分页
  tableChange(pagination, filters, sorter){
    let orderBy = this.state.orderBy || [];
    if (sorter.field) {
      const orderByName = sorter.order.substr(0,sorter.order.indexOf("end"));
      const field = sorter.field;
      if (orderBy.indexOf(field+" desc") != -1) {
        orderBy.splice(orderBy.indexOf(field+" desc"),1);
      } else if (orderBy.indexOf(field+" asc") != -1) {
        orderBy.splice(orderBy.indexOf(field+" asc"),1);
      }
      orderBy.splice(0,0,field+" "+orderByName);
    }

    let params = {
      orderType:'VALUEADD',
      orderNumber: this.props.form.getFieldValue('orderNumber'),
      itemName: this.props.form.getFieldValue('itemName'),
      applicant: this.props.form.getFieldValue('applicant'),
      status: this.props.form.getFieldValue('status'),
      page: pagination.current,
      pageSize: pagination.pageSize,
      orderBy: (orderBy||[]).toString(),
    };

    service.fetchAddService(params).then((data)=>{
      if(data.success){
        data.rows.map((row, i) => {
          row.key = i;
          if(row.status == 'WAIT_PAY'){
            this.getPayOrderInfo(data, i);
          }
        });
        if(this.props.form.getFieldValue('status') && this.props.form.getFieldValue('status') == 'WAIT_PAY'){
          data.rows = data.rows.filter((item)=> item.status != 'RESERVE_CANCELLED');
        }
        this.setState({ data: data, current: pagination.current, orderBy, });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const data = this.state.data.rows || [];
    const itemList = this.state.itemList || {};
    const columns1 = [
      {
      title: '预约编号',            //增值服务该订单本身的编号
      dataIndex: 'orderNumber',
      key:'orderNumber',
      width:'150px',
      render: (text, record) => <span style={{color:JSON.parse(localStorage.theme).themeColor,cursor:'pointer'}} onClick={this.svDetail.bind(this, record)}>{text}</span>,
    },{
      title: '产品名称',
      dataIndex: 'itemName',
      key:'itemName',
    },{
      title: '保单订单编号',        //关联出的保单号, 这里要跳到保单详情页
      dataIndex: 'relatedOrderNumber',
      width:'150px',
      key:'relatedOrderNumber',
      render: (text, record) => <span style={{color:JSON.parse(localStorage.theme).themeColor,cursor:'pointer'}} onClick={() => location.hash = '/order/orderDetail/personal/' + record.relatedOrderId } >{text}</span>,
    },{
      title: '客户',
      dataIndex: 'applicant',
      key:'applicant',
      width:'74px',
    }, {
      title: '渠道',
      dataIndex: 'channelName',
      key:'channelName',
      width:'90px',
    },{
      title: '预约时间',
      dataIndex: 'signDate',
      key:'signDate',
      width : '145px',
      sorter:true,
      render:(text,record)=>{
        if(record.valueaddType == 'JDYD'){
          if(record.checkinDate && record.checkoutDate){
            return moment(record.checkinDate).format('YYYY-MM-DD') +'~' + moment(record.checkoutDate).format('YYYY-MM-DD');
          }
        }else{
          return text ? moment(text).format('YYYY-MM-DD HH:mm') :'';
        }
      },
    },{
      title: '状态',
      dataIndex: 'status',
      key:'status',
      width:'108px',
      render: (text, record, index)=>{
        let label = '';
        switch (text) {
          case 'RESERVE_CANCELLED': label = '取消预约'; break;
          case 'DATA_APPROVING': label = '资料审核中'; break;
          case 'RESERVE_SUCCESS': label = '预约成功'; break;
          case 'ACCOUNT_SUCCESS': label = '开户成功'; break;
          case 'RECORDED_SUCCESS': label = '入账成功'; break;
          case 'NEED_REVIEW': label = '需复查'; break;
          case 'WAIT_PAY': label = '待支付'; break;
          default:break;
        }
        return label;
      }
    },{
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width:'120px',
      render: (text, record, index) =>{
        let result = [];
        let log =  <Menu.Item key={index+'_1'}>
                        <Button onClick={this.svLog.bind(this,record)} className={styles.btn_operation} style={{ width:'85px',height:'32px'}} >查看日志</Button>
                      </Menu.Item>;

        let cancel =  <Menu.Item key={index+'_2'}>
                        <Button onClick={this.svCancel.bind(this,record)} className={styles.btn_operation} style={{ width:'85px',height:'32px'}}>取消预约</Button>
                      </Menu.Item>;

        let update =  <Menu.Item key={index+'_3'}>
                        <Button onClick={this.svDetail.bind(this,record)} className={styles.btn_operation} style={{ width:'85px',height:'32px'}}>修改</Button>
                      </Menu.Item>;

        let pay =     <Menu.Item key={index+'_4'}>
                        <Button onClick={this.svPay.bind(this,record)} className={styles.btn_operation} style={{ width:'85px',height:'32px'}}>去支付</Button>
                      </Menu.Item>;

        //先 push log
        result.push(log);

        //状态取消
        if(record.status == 'RESERVE_CANCELLED'){

        //资料审核中
        }else if(record.status == 'DATA_APPROVING'){
          result.push(cancel);

        //预约成功
        }else if(record.status == 'RESERVE_SUCCESS'){
          // result.push(cancel);

        //需复查
        }else if(record.status == 'NEED_REVIEW'){
          result.push(cancel);

        //等待支付
        }else if(record.status == 'WAIT_PAY'){
          result.push(cancel);
          result.push(pay);
        }
        return (
          <div>
            <Dropdown overlay={
              <Menu>
                {
                  result.map((item)=>
                    item
                  )
                }
              </Menu>
            }>
              <Button onClick={this.svDetail.bind(this,record)} className={styles.btn_operation} style={{ width:'100px',height:'32px'}} >
                查看详情 <Icon type="down" />
              </Button>
            </Dropdown>
          </div>
        )
      }
    }];
    const columns2 = [
      {
        title: '预约编号',            //增值服务该订单本身的编号
        dataIndex: 'orderNumber',
        key:'orderNumber',
        width:'150px',
        render: (text, record) => <span style={{color:JSON.parse(localStorage.theme).themeColor ,cursor:'pointer'}} onClick={this.svDetail.bind(this, record)}>{text}</span>,
      },{
        title: '产品名称',
        dataIndex: 'itemName',
        key:'itemName',
      },{
        title: '保单订单编号',        //关联出的保单号, 这里要跳到保单详情页
        dataIndex: 'relatedOrderNumber',
        width:'150px',
        key:'relatedOrderNumber',
        render: (text, record) => <span style={{color:JSON.parse(localStorage.theme).themeColor,cursor:'pointer'}} onClick={() => location.hash = '/order/orderDetail/personal/' + record.relatedOrderId } >{text}</span>,
      },{
        title: '客户',
        dataIndex: 'applicant',
        key:'applicant',
        width:'74px',
      },{
        title: '预约时间',
        dataIndex: 'signDate',
        key:'signDate',
        width : '300px',
        sorter:true,
        render:(text,record)=>{
          if(record.valueaddType == 'JDYD'){
            if(record.checkinDate && record.checkoutDate){
              return moment(record.checkinDate).format('YYYY-MM-DD') +'~' + moment(record.checkoutDate).format('YYYY-MM-DD');
            }
          }else if(record.valueaddType == 'HPV'){
            if(record.reserveDate && record.reserveEndDate){
              return moment(record.reserveDate).format('YYYY-MM-DD HH:mm') +'~' + moment(record.reserveEndDate).format('YYYY-MM-DD HH:mm');
            }
          }else{
            return text ? moment(text).format('YYYY-MM-DD HH:mm') :'';
          }
        },
      },{
        title: '状态',
        dataIndex: 'status',
        key:'status',
        width:'108px',
        render: (text, record, index)=>{
          let label = '';
          switch (text) {
            case 'RESERVE_CANCELLED': label = '取消预约'; break;
            case 'DATA_APPROVING': label = '资料审核中'; break;
            case 'RESERVE_SUCCESS': label = '预约成功'; break;
            case 'ACCOUNT_SUCCESS': label = '开户成功'; break;
            case 'RECORDED_SUCCESS': label = '入账成功'; break;
            case 'NEED_REVIEW': label = '需复查'; break;
            case 'WAIT_PAY': label = '待支付'; break;
            default:break;
          }
          return label;
        }
      },{
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width:'120px',
        render: (text, record, index) =>{
          let result = [];
          let log =  <Menu.Item key={index+'_1'}>
            <Button onClick={this.svLog.bind(this,record)} className={styles.btn_operation} style={{ width:'85px',height:'32px'}} >查看日志</Button>
          </Menu.Item>;

          let cancel =  <Menu.Item key={index+'_2'}>
            <Button onClick={this.svCancel.bind(this,record)} className={styles.btn_operation} style={{ width:'85px',height:'32px'}}>取消预约</Button>
          </Menu.Item>;

          let update =  <Menu.Item key={index+'_3'}>
            <Button onClick={this.svDetail.bind(this,record)} className={styles.btn_operation} style={{ width:'85px',height:'32px'}}>修改</Button>
          </Menu.Item>;

          let pay =     <Menu.Item key={index+'_4'}>
            <Button onClick={this.svPay.bind(this,record)} className={styles.btn_operation} style={{ width:'85px',height:'32px'}}>去支付</Button>
          </Menu.Item>;

          //先 push log
          result.push(log);

          //状态取消
          if(record.status == 'RESERVE_CANCELLED'){

            //资料审核中
          }else if(record.status == 'DATA_APPROVING'){
            result.push(cancel);

            //预约成功
          }else if(record.status == 'RESERVE_SUCCESS'){
            // result.push(cancel);

            //需复查
          }else if(record.status == 'NEED_REVIEW'){
            result.push(cancel);

            //等待支付
          }else if(record.status == 'WAIT_PAY'){
            result.push(cancel);
            result.push(pay);
          }
          return (
            <div>
              <Dropdown overlay={
                <Menu>
                  {
                    result.map((item)=>
                      item
                    )
                  }
                </Menu>
              }>
                <Button onClick={this.svDetail.bind(this,record)} className={styles.btn_operation} style={{ width:'100px',height:'32px'}} >
                  查看详情 <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          )
        }
      }];
    return (
      <div style={{marginBottom:'28px'}}>
          <div style={{paddingBottom:'20px',height: 40}}>
              <span style={{float:'right'}}>
                <Button type='primary' style={{width:140,height:40,}} onClick={()=>location.hash = 'production/list/FW'}>
                  新建增值服务
                </Button>
              </span>
          </div>
          <div style={{marginTop:'20px'}}>
          <Form>
            <Row>
              <Col span={4} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('orderNumber')(
                    <Input placeholder="预约编号" style={{ width:'100%'  }} />
                  )}
                </FormItem>
              </Col>
              <Col span={4} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('itemName')(
                    <Select placeholder="产品名称" style={{ width:'100%'  }}>
                      {
                        itemList.rows &&
                        itemList.rows.length > 0 &&
                        itemList.rows.map((item)=>
                          <Select.Option key={item.itemId} value={item.itemName} >{item.itemName}</Select.Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={4} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('applicant')(
                    <Input placeholder="客户姓名" style={{ width:'100%'  }} />
                  )}
                </FormItem>
              </Col>
              <Col span={4} style={{paddingRight:'10px'}}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('status', {
                  })(
                    <Select placeholder="状态" style={{ width:'100%' }}>
                      {
                        this.state.code.statusList &&
                        this.state.code.statusList.map((item) =>
                          <Select.Option key={item.value} value={item.value} >{item.meaning}</Select.Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <span>
                <Button type='primary' style={{width:140,height:40,float:'right',marginLeft:'10px'}} onClick={this.searchAll.bind(this)}>全部</Button>
                <Button type='default' style={{width:140,height:40,float:'right'}} onClick={this.serach.bind(this)}>查询</Button>
              </span>
            </Row>
          </Form>

          <div>
            <Table
              columns={JSON.parse(localStorage.user).userType == "ADMINISTRATION"?columns1:columns2}
              dataSource={data}
              bordered
              onChange={this.tableChange.bind(this)}
              pagination={{
              pageSize: 20,
              current: this.state.current || 1,
              total:this.state.data.total || 0,
            }}/>
          </div>
        </div>
      </div>
    );
    }
  }

export default Form.create()(SvReservation);
