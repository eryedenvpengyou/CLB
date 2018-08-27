/*
 * show 我的实收结算期间
 * @author:zhouting
 * @version:20180428
 */
import React from 'react';
import { connect } from 'dva';
import { Form,DatePicker,Select,Button,Table,Input,Dropdown,Menu,Modal} from 'antd';
import Lov from "../common/Lov";
import * as codeService from "../../services/code";
import * as service from '../../services/settlement';
import style from '../../styles/settlement.css';
class MyActTermMd extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            code:{
                paymentTypes:[],
                paymentCurrency:[]
            },
            personList:[]
        }
    }
    componentDidMount() {
        let params = {
            paymentTypes: 'FET.PAYMENT_TYPE',
            paymentCurrency:'PUB.CURRENCY'
        }
        codeService.getCode(params).then((data) => {
            this.setState({ code: data })
        });
        let personParams = {
            receiveCompanyId:JSON.parse(localStorage.user).relatedPartyId,
            receiveCompanyType:JSON.parse(localStorage.user).userType,
            detailType : 'INCOME'
        }
        service.queryPersonList(personParams).then((data)=>{
            if(data.success){
                this.setState({personList:data.rows});
            }
        })
    }
    back(val){
        //this.props.callback(val)
        let termRecord = {}
        if(val == 1){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    for (let i in values) {
                        if (!values[i]) {
                            termRecord[i] = ''
                        } else {
                            termRecord[i] = values[i]
                        }
                    }
                    this.props.callback(termRecord);
                    this.props.form.resetFields();
                }
            })
        }else if(val == 0){
            this.props.callback(termRecord);
            this.props.form.resetFields();
        }
    }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form; 
        const formItemLayout = {
            labelCol: {
              xs: {span: 24},
              sm: {span: 10},
            },
            wrapperCol: {
              xs: {span: 20},
              sm: {span: 12},
            },
          }
        const typeOptions = this.state.code.paymentTypes.map((item)=>{
            return <Select.Option key={item.value}>{item.meaning}</Select.Option>
        })
        const currencyOptions = this.state.code.paymentCurrency.map((item)=>{
            return <Select.Option key={item.value}>{item.meaning}</Select.Option>
        })
        const personOptions = this.state.personList.map((item,i)=>{
            return <Select.Option key={item.paymentCompanyId+','+item.paymentCompanyType}>{item.paymentCompanyName}</Select.Option>
        })
        return(
            <div>
                <Modal
                    title={'我的实收'}
                    width={600}
                    style={{ top: 200 }}
                    maskClosable={false}
                    closable={true}
                    footer={null}
                    visible={this.props.visible}
                    onCancel={this.back.bind(this,0)}
                    className={style.modal}
                >
                    <Form>
                        <div style={{ padding: '10px', margin: '15px 25px 10px 25px' }}>
                            <Form.Item {...formItemLayout} label="付款方" >
                                {getFieldDecorator('paymentCompanyName', {
                                    rules: [
                                        { required: true, message: '请选择付款方', whitespace: true }
                                    ],
                                    //initialValue: this.state.settleCurrency || 'HKD',
                                    //onChange: this.currencyChange.bind(this)
                                })(
                                    <Select
                                        placeholder = '请选择付款方'
                                        showSearch
                                        style={{ color: 'rgba(0, 0, 0, 0.65)' }}
                                    >
                                        {personOptions}
                                    </Select>
                                    )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="结算期间" >
                                {getFieldDecorator('settlePeriod', {
                                    rules: [
                                        { required: true, message: '请输入结算期间'}
                                    ],
                                })(
                                    <Input style={{ width: '100%' }} placeholder='请输入结算期间' />
                                    )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="结算币种" >
                                {getFieldDecorator('settleCurrency', {
                                    rules: [
                                        { required: true, message: '请选择结算币种', whitespace: true }
                                    ],
                                    initialValue: this.state.settleCurrency || 'HKD',
                                    //onChange: this.currencyChange.bind(this)
                                })(
                                    <Select
                                        showSearch
                                        //disabled={this.state.curDis}
                                        style={{ color: 'rgba(0, 0, 0, 0.65)' }}
                                    >
                                        {currencyOptions}
                                    </Select>
                                    )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="收款日期" >
                                {getFieldDecorator('settleDate', {
                                    rules: [{ type: 'object', required: true, message: '请选择收款日期' }],
                                    // initialValue: isNaN(moment(this.state.orderCustomerList.birthDate, "YYYY-MM-DD")) ?
                                    //    null : moment(this.state.orderCustomerList.birthDate, "YYYY-MM-DD")

                                })(
                                    <DatePicker
                                        //disabled={this.state.disabled}
                                        format="YYYY-MM-DD"
                                        style={{ width: '100%' }}
                                    //placeholder="请选择或输入出生日期，例如1990-01-01"
                                    //disabledDate={this.disabledBirthDate.bind(this)}
                                    />
                                    )}
                            </Form.Item>
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: '20px', marginLeft: '168px' }}>
                            <Button onClick={this.back.bind(this,0)} type="default" style={{ width: '120px', height: '38px' }} >取消</Button>
                            <Button onClick={this.back.bind(this,1)} type="primary" style={{ width: '120px', height: '38px', marginLeft: '12px' }} >确定</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(MyActTermMd)