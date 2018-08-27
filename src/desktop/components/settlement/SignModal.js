/*
 * show 添加签单费/刷卡费
 * @author:zhouting
 * @version:20180516
 */
import React from 'react';
import { connect } from 'dva';
import { Form,Select,Button,Table,Input,Modal,InputNumber} from 'antd';
import { performance} from '../../services/myPerformance.js';
import { handleTableChange } from '../../utils/table';
import * as service from '../../services/settlement';
import Lov from "../common/Lov";
import * as codeService from "../../services/code";
import style from '../../styles/settlement.css';
class SignModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            code:{
                paymentTypes:[],
                paymentCurrency:[]
            },
            dataList:[]
        }
    }
    componentDidMount() {
        let params = {
            paymentTypes: 'FET.PAYMENT_TYPE',
            paymentCurrency:'PUB.CURRENCY'
        }
        codeService.getCode(params).then((data) => {
            this.setState({ code: data })
        })
        service.summaryQuery({settlementSummaryId:this.props.settlementSummaryId}).then((data)=>{
            if(data.success){
                this.setState({dataList:data.rows[0]});
            }
        })
    }
    back(val){
        let record = {};
        if(val == 1){
            this.props.form.validateFields((err, values) => {
                if(!err){
                    for(let i in values){
                        if(!values[i]){
                            record[i] = ''
                        }else{
                            record[i] = values[i]
                        }
                    }
                    
                }
            })
        }
        this.props.callback(record);
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
        return(
            <div>
                <Modal
                    title={'签单费和刷卡费'}
                    width={600}
                    style={{ top: 200 }}
                    maskClosable={false}
                    closable={true}
                    footer={null}
                    visible={this.props.visible}
                    onCancel={this.back.bind(this, 0)}
                    className={style.modal}
                >
                    <Form>
                        <div style={{ padding: '10px', margin: '15px 25px 10px 25px' }}>
                            <Form.Item {...formItemLayout} label="结算类型" >
                                {getFieldDecorator('paymentType', {
                                    rules: [
                                        { required: true, message: '请选择结算类型', whitespace: true }
                                    ],
                                })(
                                    <Select>
                                        <Select.Option value="QDF">签单费</Select.Option>
                                        <Select.Option value="SKF">刷卡费</Select.Option>
                                    </Select>
                                    )}
                            </Form.Item> 
                            <Form.Item {...formItemLayout} label="订单/保单编号" >
                                {getFieldDecorator('orderNumber', {
                                    initialValue: {value: '', meaning: ''},
                                })(
                                    <Lov placeholder="请选择订单"
                                    suffix={true} 
                                    lovCode='FET_SETTLEMENT_ORDER' 
                                    params={{ 
                                        receiveCompanyId:this.state.dataList.receiveCompanyId,
                                        receiveCompanyType:this.state.dataList.receiveCompanyType,
                                        paymentCompanyId:this.state.dataList.paymentCompanyId,
                                        paymentCompanyType:this.state.dataList.paymentCompanyType,
                                    }}
                                    width="100%" />
                                    )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="本期结算金额（结算币种）" >
                                {getFieldDecorator('unpaidSettlement', {
                                    rules: [
                                        { required: true, message: '请输入本期结算金额（结算币种）'}
                                    ],
                                })(
                                    <InputNumber style={{width:'100%'}}/>
                                    )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="备注" >
                                {getFieldDecorator('factPayDiffer', {
                                    rules: [
                                        { message: '请输入备注', whitespace: true }
                                    ],
                                })(
                                    <Input/>
                                    )}
                            </Form.Item>
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: '20px', marginLeft: '25px' }}>
                            <Button type="default" onClick={this.back.bind(this,0)} style={{ width: '120px', height: '38px' }} >取消</Button>
                            <Button type="primary" onClick={this.back.bind(this,1)} style={{ width: '120px', height: '38px', marginLeft: '32px' }} >确定</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(SignModal)