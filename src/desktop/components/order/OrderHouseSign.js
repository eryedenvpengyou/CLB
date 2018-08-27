import React  , { Component } from 'react';
import {Menu,Form, Row, Col, InputNumber,Input,Select, Button,Icon,Modal} from 'antd';
import Upload from '../../components/common/Upload';
import Modals from '../common/modal/Modal';
import styles from '../../styles/production.css';
import * as styles2 from '../../styles/order.css'
import * as codeService from '../../services/code';
import {ordOrderSubmit, ordCustomerSubmit } from '../../services/production';
import * as  common from '../../utils/common';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 13 },
    },
  };
class OrderHouseSign extends  React.Component{
    constructor(props){
        super(props);
        this.state = {
            codeList:{
                marryList:[],
                incomeList:[]
            },
            visible:false,
        }
    }

    componentWillMount(){
        var param = {
            marryList:'CTM.MARITAL_STATUS',
            incomeList:'CUS.ANNUAL_INCOME'
        };
        codeService.getCode(param).then((codeData)=>{
            const options = common.npcCascade(codeData);
            this.setState({
                codeList:codeData
            })
        });
    }   
    //取消
    handleCancel=()=>{
        this.props.close(false);
    }
    //确认
    modalSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,value) =>{
            if(!err){
                const params = {},
                    paramsCus = {};
                params.reservationsFileId = value.reservationsFileId[0].response.file.fileId;
                params.orderId = this.props.record.orderId;
                params.orderNumber = this.props.record.orderNumber;
                params.status = this.props.record.status;
                params.orderType = this.props.record.orderType;
                params.clientFlag = 'Y';
                
                paramsCus.annualIncome = value.annualIncome;
                paramsCus.industry = value.industry;
                paramsCus.liabilities = value.liabilities;
                paramsCus.marriageStatus = value.marriageStatus;
                paramsCus.sex = value.sex;
                paramsCus.orderId = this.props.record.orderId;
                paramsCus.ordCustomerId = this.props.customerList.ordCustomerId; 
                paramsCus.clientFlag = 'Y';
                
                ordOrderSubmit([params]).then((orderDate)=>{
                    if(orderDate.success){
                        ordCustomerSubmit([paramsCus]).then((customerDate)=>{
                            if(customerDate.success){
                                Modals.success({title:'成功'});
                                this.handleCancel();
                                this.props.callback(orderDate.rows[0])
                            }else {
                                Modals.error({
                                  title: '提交失败！',
                                  content: `请联系系统管理员,${data.message}`,
                                });
                            }
                        })
                    }
                })
                
            }else{
             //   return false;
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const marryOptions = this.state.codeList.marryList.map((code)=>{
            return <Select.Option key={code.value}>{code.meaning}</Select.Option>;
        })
        const incomeOptions = this.state.codeList.incomeList.map((code)=>{
            return <Select.Option key={code.value}>{code.meaning}</Select.Option>;
        })
        return(
            <div>
                <Form>
                    <Modal
                        title={`上传预订单并更新客户信息`}
                        width={600}
                        style={{ top: 200 }}
                        maskClosable={false}
                        closable={true}
                        footer={null}
                        visible={this.props.visible}
                        onCancel={this.handleCancel}
                        className={styles2.houseModal}
                    >
                        <Form>
                            <div style={{ padding: '10px', margin: '15px 25px 10px 25px' }}>
                                <FormItem label="性别" {...formItemLayout}>
                                    {getFieldDecorator('sex', {
                                        rules: [
                                            {required:true, message: '请选择性别', whitespace: true, }
                                        ],
                                        initialValue: this.props.customerList.sex|| ''
                                    })(
                                        <Select placeholder=" " className={styles['select-disableds']}>
                                            <Select.Option value="M">男</Select.Option>
                                            <Select.Option value="F">女</Select.Option>
                                        </Select>
                                        )}
                                </FormItem>
                                <FormItem label="婚姻状况" {...formItemLayout}>
                                    {getFieldDecorator('marriageStatus', {
                                        rules: [{required:true, message: '请选择婚姻状况', whitespace: true }],
                                        initialValue: this.props.customerList.marriageStatus|| ''
                                    })(
                                        <Select
                                            className={styles['select-disableds']}
                                            placeholder=" "
                                            showSearch
                                            optionFilterProp="children" >
                                            {marryOptions}
                                        </Select>
                                        )}
                                </FormItem>
                                <FormItem label="年收入" {...formItemLayout}>
                                    {getFieldDecorator('annualIncome', {
                                        rules: [
                                            {required:true, message: '请选择年收入', whitespace: true, }
                                        ],
                                    })(
                                        <Select
                                            className={styles['select-disableds']}
                                            placeholder=" "
                                            showSearch
                                            optionFilterProp="children" >
                                            {incomeOptions}
                                        </Select>
                                        )}
                                </FormItem>
                                <FormItem label="您现时负债大约多少" {...formItemLayout}>
                                    {getFieldDecorator('liabilities', {
                                        rules: [
                                            {message: '请输入您现时负债大约多少', whitespace: true, pattern: /^-?\d+(\.)?$/ },
                                        ],
                                        initialValue: this.props.customerList.liabilities|| ''
                                    })(
                                        <InputNumber
                                            formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value && value.toString().replace(/\$\s?|(,*)/g, '')}
                                            style={{ width: '100%' }}
                                        />
                                        )}
                                </FormItem>
                                <FormItem label="所属行业" {...formItemLayout}>
                                    {getFieldDecorator('industry', {
                                        rules: [{
                                            message: '请输入所属行业',
                                            whitespace: true
                                        }]
                                    })(
                                        <Input  />
                                        )}
                                </FormItem>
                                <FormItem label="预订单" {...formItemLayout}>
                                    {getFieldDecorator('reservationsFileId', {
                                        rules: [{
                                            required: true,
                                            message: '请上传预订单',
                                            whitespace: true,
                                            type: 'array'
                                        }]
                                    })(
                                        <Upload fileNum={1} modularName='PRD'>
                                            <Button type="primary">请选择附件</Button>
                                        </Upload>
                                        )}
                                </FormItem>
                            </div>
                            <div style={{ textAlign: 'center', marginBottom: '20px',marginLeft:'107px' }}>
                                <Button onClick={this.handleCancel} type="default" style={{ width: '120px', height: '38px' }} >取消</Button>
                                <Button onClick={this.modalSubmit} type="primary" style={{ width: '120px', height: '38px', marginLeft: '30px' }} >确定</Button>
                            </div>
                        </Form>
                    </Modal>
                </Form>
            </div>
        )
    }
}
export default Form.create()(OrderHouseSign);