import React from 'react';
import {Table,Button,Input,Form,Select,Col} from 'antd';
import * as service from '../../services/customer';
import * as codeService from '../../services/code';
import * as common  from '../../utils/common';
import moment from 'moment';
import Models from '../common/modal/Modal';
import * as styles from '../../styles/qa.css';

const FormItem = Form.Item;
const Option = Select.Option;


class Customer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pageSize: 20,
      current: 1,
      code:'',
      orderBy: [],
      visible: false,
      customers: {},
      pagination:{}
    };
  }

  componentWillMount() {
    let params = {
      cityList: 'PUB.CITY',
      incomeList: 'CTM.INCOME_LEVEL',
    };
    codeService.getCode(params).then((data)=>{
      this.setState({ code: data, });
    });
    service.fetchCustomer({}).then((data)=>{
      if(data.success){
        const pagination = this.state.pagination;
        pagination.total = data.total;
        this.setState({customers: data,pagination})
      }
    });
  }


  //搜索
  clickSearch(){
    let params = {};
    params.city = this.props.form.getFieldValue('city');
    params.incomeLevel = this.props.form.getFieldValue('incomeLevel');
    params.chineseName = this.props.form.getFieldValue('chineseName');
    service.fetchCustomer(params).then((data)=>{
      if(data.success){
        this.setState({customers: data, current : 1});
      }
    });
  }

  //全部
  searchAll(){
    this.props.form.resetFields();
    service.fetchCustomer({}).then((data)=>{
      if(data.success){
        this.setState({customers: data, current : 1});
      }
    })
  }
  tableChange(pagination, filters, sorter){
    let orderBy = this.state.orderBy || [];
    if (sorter.field) {
      const orderByName = sorter.order.substr(0,sorter.order.indexOf("end"));
      const field = sorter.field.replace(/([A-Z])/g,"_$1").toUpperCase();
      if (orderBy.indexOf(field+" desc") != -1) {
        orderBy.splice(orderBy.indexOf(field+" desc"),1);
      } else if (orderBy.indexOf(field+" asc") != -1) {
        orderBy.splice(orderBy.indexOf(field+" asc"),1);
      }
      orderBy.splice(0,0,field+" "+orderByName);
    }

    let params = {};
    params.city = this.props.form.getFieldValue('city');
    params.incomeLevel = this.props.form.getFieldValue('incomeLevel');
    params.chineseName = this.props.form.getFieldValue('chineseName');
    params.page = pagination.current;
    params.pageSize = pagination.pageSize;
    params.orderBy = (orderBy||[]).toString();
    service.fetchCustomer(params).then((data)=>{
      if(data.success){
        this.setState({customers: data})
      }
    });

    this.setState({current: pagination.current, orderBy});
  }


  render(){
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const data = this.state.customers.rows || [];
    const columns = [{
      title: '客户编号',
      dataIndex: 'customerCode',
      key: 'customerCode',
      className:styles.text_center,
      render: (text, record) => <span style={{color:JSON.parse(localStorage.theme).themeColor,cursor:'pointer'}} onClick={() => location.hash = '/portal/customerHandle/' + record.customerId + '/'+record.chineseName} >{text}</span>,
    },{
      title: '客户',
      dataIndex: 'chineseName',
      key: 'chineseName',
      className:styles.text_center,
    }, {
      title: '手机',
      dataIndex: 'phone',
      key: 'phone',
      className:styles.text_center,
      render:(text, record)=>{
        return record.phoneCode?'('+record.phoneCode + ')' + record.phone : record.phone;
      },
    }, {
      title: '生日',
      dataIndex: 'birthDate',
      key: 'birthDate',
      className:styles.text_center,
      render:(text)=>{
        return text ? moment(text).format('YYYY-MM-DD') :'';
      }
    },{
      title: '职业',
      dataIndex: 'position',
      key: 'position',
      className:styles.text_center,
    },{
      title: '月收入水平',
      dataIndex: 'income',
      key: 'income',
      sorter: true,
      className:styles.text_center,
      render:(text)=>{
        if(text){
          return common.fmoney(text);
        }
      }
    },{
      title: '城市',
      dataIndex: 'postCity',
      key: 'postCity',
      sorter: true,
      className:styles.text_center,
      render: (text, record)=>{
        if(text && this.state.code.cityList){
          for(let i in this.state.code.cityList){
            if(text == this.state.code.cityList[i].value){
              return this.state.code.cityList[i].meaning;
            }
          }
        }
      }
    },{
      title: '保单数量',
      dataIndex: 'orderCount',
      key: 'orderCount',
      sorter: true,
      className:styles.text_center,
    },
  ];

    return(
      <div className={styles.content}>
        <div className={styles.title_sty} style={{paddingTop:'20px'}}>
          <b className={styles.b_sty} >|</b>
          <font style={{fontSize:'20px'}}>我的客户</font>
        </div>

        <div>
          <Form layout="inline">
            <Col span={4} style={{paddingRight:'10px'}}>
              <FormItem>
                {getFieldDecorator('city', {
                })(
                  <Input style={{width:'100%'}} placeholder='城市'/>
                )}
              </FormItem>
            </Col>

            <Col span={4} style={{paddingRight:'10px'}}>
              <FormItem >
                {getFieldDecorator('incomeLevel', {
                })(
                  <Select
                    showSearch
                    style={{width:'173px'}}
                    placeholder='月收入'
                  >
                    {
                      this.state.code.incomeList &&
                      this.state.code.incomeList.map((item)=>
                        <Option key={item.value} value={item.value}>{item.meaning}</Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
            </Col>

            <Col span={4} style={{paddingRight:'10px'}}>
              <FormItem >
                {getFieldDecorator('chineseName', {
                })(
                  <Input style={{width:'100%'}} placeholder='客户姓名'/>
                )}
              </FormItem>
            </Col>

            <Button type='primary' style={{width:'140px',height:'40px',marginLeft:'280px'}} onClick={this.clickSearch.bind(this)}>查询</Button>
            <Button type='default' style={{width:'140px',height:'40px',float:'right',}} onClick={this.searchAll.bind(this)}>全部</Button>

          </Form>
        </div>

        <div style={{width:'100%',marginTop:'2%'}}>
          <Table
            rowKey='customerId'
            columns={columns}
            dataSource={data}
            bordered
            onChange={this.tableChange.bind(this)}
            pagination={{
              current:this.state.current || 1,
              pageSize: this.state.pageSize || 20,
              total:this.state.pagination.total}}
            />
        </div>
      </div>
    );
  }

}

export default Form.create()(Customer);
