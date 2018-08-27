import React  , { Component } from 'react';
import { Form,DatePicker,Input,InputNumber,Row,Col,Select,Cascader,Button} from 'antd';
import moment from 'moment';
import {indexOf} from 'lodash';
import Lov from "../common/Lov";
import CodeOption from "../common/CodeOption";
import TipModal from "../common/modal/Modal";
import * as  common from '../../utils/common';
import Upload from "../common/Upload";
import { ordOrderQuery, ordCustomerQuery,ordOrderSubmit, ordCustomerSubmit } from '../../services/production';
import * as codeService from '../../services/code';
import styles from '../../styles/production.css';
import CustomerLov from "../common/CustomerLov";
//日期选择范围
const RangePicker = DatePicker.RangePicker;
class ProductionSubscribeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            codeList:{
                houseList:[],
                purposeList:[],
                phoneCodeList: [],
                marryList:[],
                incomeList:[]
            },
            orderDetail:{},
            orderList:[],
            orderCustomerList:[],
            startValue: null,
            endValue: null,
            timeArr:[],
            options:[],
            livingArr:[],
            postArr:[],
            fileArr:[],
            flightFlag:false,
            visitsNum:''
        }
    }
    componentWillMount() {
        var param = {
            houseList:'PRD.HOUSE_PROPERTY_TYPE',                     //物业类型
            purposeList:'ORD.HOME_PURPOSE',                         //置业目的
            phoneCodeList: "PUB.PHONE_CODE",
            nationalList: 'PUB.NATION',                             //国籍
            provinceList: 'PUB.PROVICE',                            //省份
            cityList: 'PUB.CITY',                                   //城市
            marryList: 'CTM.MARITAL_STATUS',                        //婚姻状况
            incomeList:'CUS.ANNUAL_INCOME',                         //年收入
        }
        codeService.getCode(param).then((codeData)=>{
            const options = common.npcCascade(codeData);
            this.setState({
                options:options,
                codeList:codeData
            })
        })
        if(!isNaN(this.props.orderId)){
            this.state.disabled = true;
            let body = {
                orderId: this.props.orderId
            }
            ordOrderQuery(body).then((data) => {
                if(data.success){
                    this.setState({
                        orderList:data.rows[0]
                    });
                    if(this.state.orderList.status == 'NEED_CHECKING'){
                        this.setState({disabled:false})
                    }
                    this.state.visitsNum = ((this.state.orderList.visitsNum).toString())
                    this.state.livingArr.push(this.state.orderList.customerNation);
                    this.state.livingArr.push(this.state.orderList.customerProvince);
                    this.state.livingArr.push(this.state.orderList.customerCity);
                    this.props.form.setFieldsValue({mailingArea:this.state.livingArr})
                    //已付定金/需签预定单/已签预定单/需签合同/已签合同/购买成功等待过户/已过户的状态都需要显示出来
                    if(this.state.orderList.status == 'PAYED_BOOKING'||
                    this.state.orderList.status == 'SIGNING_PRE-ORDER' ||
                    this.state.orderList.status == 'SIGNED_PRE-ORDER' ||
                    this.state.orderList.status == 'SIGNING_CONTRACT'||
                    this.state.orderList.status == 'SIGNED_CONTRACT'||
                    this.state.orderList.status == 'BUY_SUCCESS'||
                    this.state.orderList.status == 'TRANSFERRED'){
                        document.getElementsByClassName('paymentPaid')[0].style.display ='block'
                    }
                    //已签预定单/需签合同/已签合同/购买成功等待过户/已过户的状态都需要显示出来
                    if(this.state.orderList.status == 'SIGNED_PRE-ORDER' ||
                    this.state.orderList.status == 'SIGNING_CONTRACT' ||
                    this.state.orderList.status == 'SIGNED_CONTRACT'||
                    this.state.orderList.status == 'BUY_SUCCESS'||
                    this.state.orderList.status == 'TRANSFERRED'){
                        document.getElementsByClassName('signBill')[0].style.display ='block';
                    }
                }
            })
            ordCustomerQuery(body).then((data)=>{
                if(data.success){
                    this.setState({
                        orderCustomerList:data.rows[0]
                    })
                    this.state.postArr.push(this.state.orderCustomerList.postNation);
                    this.state.postArr.push(this.state.orderCustomerList.postProvince);
                    this.state.postArr.push(this.state.orderCustomerList.postCity);
                    this.props.form.setFieldsValue({postCity:this.state.postArr});
                     if(this.state.orderCustomerList.sysFiles){
                        this.state.fileArr.push({
                            uid: 0,
                            name: this.state.orderCustomerList.sysFiles[0].fileName||'test',
                            status: 'query',
                            type: this.state.orderCustomerList.sysFiles[0].fileName.substring(this.state.orderCustomerList.sysFiles[0].fileName.lastIndexOf('.')+1),
                            removeFlag: false,
                            response: {
                              file: {
                                fileId: this.state.orderCustomerList.sysFiles[0].fileId,
                                fileName: this.state.orderCustomerList.sysFiles[0].fileName||'test',
                                filePath: this.state.orderCustomerList.sysFiles[0].filePath,
                                fileType: this.state.orderCustomerList.sysFiles[0].fileName.substring(this.state.orderCustomerList.sysFiles[0].fileName.lastIndexOf('.')+1),
                              }
                            }
                        });
                        this.props.form.setFieldsValue({passportFileId:this.state.fileArr})
                    }
                }
            })
        }
    }
    customerLovChange(value){
        if (value && value.value && value.meaning && value.record) {
            this.props.form.setFieldsValue({
                phone:value.record.phone,
                phoneCode:value.record.phoneCode,
                birthDate:value.record.birthDate?moment(value.record.birthDate,'YYYY-MM-DD'):null
            })
        }
    }
    handleSubmit(){
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                let orderBody = {};
                // 固定字段
                orderBody.orderType = "HOUSE";
                if(this.state.orderList.status == 'NEED_CHECKING'){
                    orderBody.__status = 'update';
                    orderBody.orderId = this.props.orderId;
                }else{
                    orderBody.__status = 'add';
                }
                orderBody.applicantCustomerId = values.chineseName.value;
                orderBody.submitDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1)+ '-' + new Date().getDate()+' '+
                (new Date().getHours()<10?'0'+ new Date().getHours():new Date().getHours()) + ":" +
                (new Date().getMinutes()<10?'0' +new Date().getMinutes():new Date().getMinutes())+":"+
                (new Date().getSeconds()<10?'0' +new Date().getSeconds():new Date().getSeconds());
                orderBody.status = 'RESERVING';
                orderBody.applicant = values.chineseName.meaning;
                orderBody.clientFlag = 'Y'
                //房产
                orderBody.productSupplierName = values.IntentionPro.record.supplierName
                orderBody.itemId = values.IntentionPro.record.itemId
                orderBody.itemName = values.IntentionPro.record.itemName
                orderBody.productSupplierId = values.IntentionPro.record.productSupplierId
                orderBody.contributionPeriod = values.IntentionPro.record.contributionPeriod
                orderBody.itemCode = values.IntentionPro.record.itemCode
                orderBody.currency = values.IntentionPro.record.currencyCode
                orderBody.currencyCode = values.IntentionPro.record.currencyCode
                orderBody.channelId = JSON.parse(localStorage.user).relatedPartyId
                orderBody.theFirstYear = values.IntentionPro.record.theFirstYear
                orderBody.sublineId = values.IntentionPro.record.sublineId
                orderBody.IntentionPro = null;

                if(this.state.flightFlag){
                    orderBody.flightTime = values.flightTime._d.getFullYear() + '-' + (values.flightTime._d.getMonth() + 1)+ '-' + values.flightTime._d.getDate()+' '+
                    (values.flightTime._d.getHours()<10?'0' +values.flightTime._d.getHours():values.flightTime._d.getHours()) + ":" +
                    (values.flightTime._d.getMinutes()<10?'0' +values.flightTime._d.getMinutes():values.flightTime._d.getMinutes());
                    orderBody.flightNum = values.flightNum;
                }

                orderBody.vistitsTimeStart = values.vistitStartTime._d.getFullYear() + '-' + (values.vistitStartTime._d.getMonth() + 1)+ '-' + values.vistitStartTime._d.getDate()+' '+
                (values.vistitStartTime._d.getHours()<10?'0'+ values.vistitStartTime._d.getHours():values.vistitStartTime._d.getHours()) + ":" +
                (values.vistitStartTime._d.getMinutes()<10?'0' +values.vistitStartTime._d.getMinutes():values.vistitStartTime._d.getMinutes());

                orderBody.vistitsTimeTo = values.vistitEndTime._d.getFullYear() + '-' + (values.vistitEndTime._d.getMonth() + 1)+ '-' + values.vistitEndTime._d.getDate()+' '+
                (values.vistitEndTime._d.getHours()<10?'0'+ values.vistitEndTime._d.getHours():values.vistitEndTime._d.getHours()) + ":" +
                (values.vistitEndTime._d.getMinutes()<10?'0'+ values.vistitEndTime._d.getMinutes():values.vistitEndTime._d.getMinutes());

                orderBody.destinationCountry = values.destinationCountry;
                orderBody.destinationPhone = values.destinationPhone;
                orderBody.hotel = values.hotel;
                orderBody.hotelAddress = values.hotelAddress;
                orderBody.visitsNum = values.visitsNum;
                orderBody.budgetRange = values.budgetRange;
                orderBody.propertyType = values.propertyType.join(',');
                orderBody.homePurpose = values.homePurpose.join(',');
                orderBody.description = values.description
                //订单 新增字段新增是否需要接机/联系人/联系人电话字段/护照
                orderBody.meetAirportFlag = values.meetAirportFlag;
                orderBody.mainPrimaryContact = values.mainPrimaryContact;
                orderBody.mainContactPhone = values.mainContactPhone;
                orderBody.mainContactPhoneCode = values.mainContactPhoneCode;
                orderBody.customerNation = (values.mailingArea)[0]
                orderBody.customerProvince = (values.mailingArea)[1]
                orderBody.customerCity = (values.mailingArea)[2]
                ordOrderSubmit([orderBody]).then((orderData) =>{
                    if(orderData.success){
                        let customerBody = {};
                        customerBody.customerType = "APPLICANT";
                        if(!isNaN(this.props.orderId)){
                            customerBody.phone = values.phone;
                            customerBody.phoneCode = values.phoneCode;
                        }else{
                            customerBody.phone = values.chineseName.record.phone;
                            customerBody.phoneCode = values.chineseName.record.phoneCode;
                        }
                        customerBody.chineseName = values.chineseName.meaning;
                        customerBody.orderId = orderData.rows[0].orderId;
                        if(this.state.orderList.status == 'NEED_CHECKING'){
                            customerBody.__status = 'update';
                            customerBody.ordCustomerId= this.state.orderCustomerList.ordCustomerId
                        }else{
                            customerBody.__status = "add";
                        }
                        customerBody.clientFlag = 'Y'
                        //客户 新增字段
                        customerBody.passportFileId = values.passportFileId[0].response.file.fileId;
                        customerBody.birthDate = values.birthDate._d.getFullYear() + '-' + (values.birthDate._d.getMonth() + 1)+ '-' + values.birthDate._d.getDate()+' '+
                        (values.birthDate._d.getHours()<10?'0' +values.birthDate._d.getHours():values.birthDate._d.getHours()) + ":" +
                        (values.birthDate._d.getMinutes()<10?'0' +values.birthDate._d.getMinutes():values.birthDate._d.getMinutes());
                        customerBody.estateInvestmentFlag = values.estateInvestmentFlag;
                        ordCustomerSubmit([customerBody]).then((customerData)=>{
                            if (orderData.success) {
                                TipModal.success({content:"您的预约已提交成功，产品经理会尽快与您联系！"});
                                window.setTimeout(()=>{
                                  location.hash = '/order/orderHouse';
                                },3000);
                              } else {
                                TipModal.error({content:customerData.message});
                                return;
                              }
                        })
                    }
                })
            }
        })
    }
    //时间选择半小时化
    range(start, end) {
        const used = [0, 30], result = [];
        for (let i = start; i < end; i++) {
        if(indexOf(used, i) < 0){
            result.push(i);
        }
        }
        return result;
    }
    disabledDateTime() {
        return {
          disabledMinutes: () => this.range(0, 60),
        };
      }

      //不可选日期
    disabledFlighDate(current) {
        if (current) {
            var date = new Date();
            current = new Date(current);
            date = moment(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate()), "YYYY-MM-DD");
            current = moment(current.getFullYear() + "-" + (current.getMonth() + 1) + "-" + (current.getDate()), "YYYY-MM-DD")
            return date.valueOf() > current.valueOf();
        } else {
            return false;
        }
    }
    resetContactPhone (value){
        if(value){
          this.props.form.setFieldsValue({reserveContactPhone:''}) ;
        }
      }
    //选择电话号码区域事件
    phoneCodeChange(value) {
        if (value != this.props.form.getFieldValue('phoneCode')) {
        this.props.form.setFieldsValue({phone:''});
        }
    }
    //验证手机号-不同电话代码使用不同正则
    checkPhone(rule, value, callback) {
        let phoneCode = this.props.form.getFieldValue('phoneCode')
        let regex = /^\d{11}$/, msg = '手机号位数不正确(大陆地区为11位)';

        if (phoneCode === '00852' || phoneCode === '00853') {
            regex = /^\d{8}$/;
            msg = '手机号位数不正确(港澳地区为8位)';
        } else if (phoneCode === '00886') {
            regex = /^\d{9}$/;
            msg = '手机号位数不正确(台湾地区为9位)';
        }

        if (value && !regex.test(value)) {
            if (typeof callback === 'function') {
                callback(msg);
            }
        } else {
            if (typeof callback === 'function') {
                callback();
            }
        }
    }
    mainCheckPhone(rule, value, callback) {
        let phoneCode = this.props.form.getFieldValue('mainContactPhone')
        let regex = /^\d{11}$/, msg = '手机号位数不正确(大陆地区为11位)';

        if (phoneCode === '00852' || phoneCode === '00853') {
            regex = /^\d{8}$/;
            msg = '手机号位数不正确(港澳地区为8位)'
        } else if (phoneCode === '00886') {
            regex = /^\d{9}$/;
            msg = '手机号位数不正确(台湾地区为9位)';
        }

        if (value && !regex.test(value)) {
            if (typeof callback === 'function') {
                callback(msg);
            }
        } else {
            if (typeof callback === 'function') {
                callback();
            }
        }
    }
    //页面返回
    goBack() {
        window.history.back();
    }
    //出生年月不可选日期
    disabledBirthDate(current) {
        if (!current) {
            return false;
        }
        var date = new Date();
        var oldDate = moment(date.getFullYear() - 120 + "-" + (date.getMonth() + 1) + "-" + (date.getDate()), "YYYY-MM-DD");
        date = moment(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate()), "YYYY-MM-DD");
        return oldDate.valueOf() > current.valueOf() || current.valueOf() > date.valueOf();
    }
    //考察时间禁用时间
    disabledStartDate(startValue){
        if (!startValue) {
            return false
        }
        var date = new Date();
        var endValue = this.state.endValue;
        date = moment(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate()), "YYYY-MM-DD");

        return date.valueOf() > startValue.valueOf();
            //startValue.valueOf() > endValue.valueOf() ||
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    onChange = (field,value) =>{
        this.setState({[field]:value})
    }
    onStartChange = (value) =>{
        this.onChange('startValue',value);
    }
    onEndChange = (value) =>{
        this.onChange('endValue',value);
    }
    resetPhone(value){
        if (value) {
            this.props.form.setFieldsValue({ phone: '' });
        }
    }
    resetMainPhone(value) {
        if (value) {
            this.props.form.setFieldsValue({ mainContactPhone: '' });
        }
    }
    //是否需要接机
    flightChange(value){
        if(value == 'Y' ){
            document.getElementsByClassName('flight')[0].style.display ='block';
            this.setState({flightFlag:true})
        }else{
            document.getElementsByClassName('flight')[0].style.display ='none';
            this.setState({flightFlag:false})
        }
    }
    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 10 },
        };
        const numArr = [];
        for(let i = 1;i<11;i++){
            numArr.push(<Select.Option key = {i}>{i}</Select.Option>)
        }
        // 快码
        const houseOptions = this.state.codeList.houseList.map((code) => {
            return <Select.Option key={code.value}>{code.meaning}</Select.Option>
        });
        const purposeOptions = this.state.codeList.purposeList.map((code) => {
            return <Select.Option key={code.value}>{code.meaning}</Select.Option>
        });
        const phoneCodeOptions = this.state.codeList.phoneCodeList.map((code) => {
            return <Select.Option key={code.value}>{code.meaning}</Select.Option>;
        });
        const marryOptions = this.state.codeList.marryList.map((code)=>{
            return <Select.Option key={code.value}>{code.meaning}</Select.Option>;
        })
        const incomeOptions = this.state.codeList.incomeList.map((code)=>{
            return <Select.Option key={code.value}>{code.meaning}</Select.Option>;
        })
        // const phoneCode = (
        //     getFieldDecorator('phoneCode', {
        //       initialValue:  JSON.parse(localStorage.user).phoneCode || "86",
        //     })(
        //       <CodeOption className={styles.pre} disabled={this.state.disabled} codeList={this.state.codeList.phoneCodeList} onChange={this.resetContactPhone.bind(this)} width='120px'/>
        //     )
        //   );
        const phoneCode = (
            getFieldDecorator('phoneCode', {
              initialValue: this.state.orderList.phoneCode || "86",
            })(
              <CodeOption className={styles.pre} disabled={this.state.disabled} codeList={this.state.codeList.phoneCodeList} onChange={this.resetPhone.bind(this)} width='120px'/>
            )
          );
        const mainContactPhoneCode = (
            getFieldDecorator('mainContactPhoneCode', {
              initialValue: this.state.orderList.mainContactPhoneCode || JSON.parse(localStorage.user).phoneCode,
            })(
              <CodeOption className={styles.pre} disabled={this.state.disabled} codeList={this.state.codeList.phoneCodeList} onChange={this.resetMainPhone.bind(this)} width='120px'/>
            )
          );
        const { startValue, endValue } = this.state;
        return (
            <Form>
                <Row style={{ paddingTop: '28px' }}>
                    {
                        JSON.parse(localStorage.user).userType === "ADMINISTRATION" &&
                            <Form.Item label="渠道" {...formItemLayout}>
                                {getFieldDecorator('channelId', {
                                    rules: [{
                                        // required: true,
                                        validator: (rule,value,callback) => {
                                            if (!value.value) {
                                               callback('请选择渠道');
                                            } else {
                                                callback();
                                            }
                                        }
                                    }],
                                    initialValue: {value: '', meaning: ''},
                                })(
                                    <Lov title="选择渠道" disabled={this.state.disabled} lovCode='CNL_AGENCY_NAME' params ={{userId:JSON.parse(localStorage.user).userId}} />
                                )}
                            </Form.Item>
                    }

                    <Form.Item label="客户" {...formItemLayout}>
                        {getFieldDecorator('chineseName', {
                            rules: [{
                                required: true,
                                validator: (rule, value, callback) => {
                                    if (value && (!value.value || !value.meaning)) {
                                        callback('请选择客户');
                                    } else {
                                        callback();
                                    }
                                }
                            }],
                            initialValue: {
                                value: this.state.orderList.applicantCustomerId,
                                meaning: this.state.orderCustomerList.chineseName
                            },
                        })(
                            <CustomerLov
                                disabled={this.state.disabled}
                                lovCode='ORD_CUSTOMER'
                                params={{ channelId: this.props.form.getFieldValue('channelId') ? this.props.form.getFieldValue('channelId').value : JSON.parse(localStorage.user).relatedPartyId }}
                                placeholder="请选择客户"
                                width="100%"
                                itemChange={this.customerLovChange.bind(this)}
                                />
                            )}
                    </Form.Item>
                    <Form.Item label="国内联系电话" {...formItemLayout}>
                        {getFieldDecorator('phone', {
                            rules: [{
                                required: true,
                                message: '请输入国内联系电话',
                                whitespace: true
                            }, {
                                validator: this.checkPhone.bind(this),
                            }],
                            initialValue: this.state.orderCustomerList.phone|| ''
                        })(
                            <Input disabled={this.state.disabled} addonBefore={phoneCode} placeholder=" " style={{width:'100%'}}/>
                            )}
                    </Form.Item>
                    <Form.Item label="出生日期" {...formItemLayout}>
                        {getFieldDecorator('birthDate', {
                            rules: [{ type: 'object', required: true, message: '请选择出生日期' }],
                            initialValue:isNaN(moment(this.state.orderCustomerList.birthDate , "YYYY-MM-DD")) ?
                            null:moment(this.state.orderCustomerList.birthDate, "YYYY-MM-DD")

                        })(
                            <DatePicker
                                disabled={this.state.disabled}
                                format="YYYY-MM-DD"
                                style={{ width: '100%' }}
                                placeholder="请选择或输入出生日期，例如1990-01-01"
                                disabledDate={this.disabledBirthDate.bind(this)}
                            />
                            )}
                    </Form.Item>
                    <Form.Item label="居住地" {...formItemLayout}>
                        {getFieldDecorator('mailingArea', {
                            rules: [{ type: 'array', message: '请选择居住地', whitespace: true }],
                            initialValue: this.state.orderList.mailingArea || [],
                        })(
                            <Cascader className={styles['cascader-disableds']} disabled={this.state.disabled} showSearch options={this.state.options} placeholder=" "
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}/>
                            )}
                    </Form.Item>
                    <div className ={'paymentPaid'} style={{display:'none'}}>
                        <Form.Item label="邮箱" {...formItemLayout}>
                            {getFieldDecorator('email', {
                                initialValue: this.state.orderCustomerList.email || '',
                            })(
                                <Input disabled={this.state.disabled} />
                                )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="邮寄地址">
                            {getFieldDecorator('postCity', {
                                rules: [{
                                    type: 'array'
                                }],
                            })(
                                <Cascader className={styles['cascader-disableds']} disabled={this.state.disabled} showSearch options={this.state.options} placeholder="请选择邮寄地址"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                />
                                )}
                        </Form.Item>
                        <Form.Item label=" 邮寄详细地址" {...formItemLayout}>
                            {getFieldDecorator('postAddress', {
                                initialValue: this.state.orderCustomerList.postAddress || '',
                            })(
                                <Input disabled={this.state.disabled} />
                                )}
                        </Form.Item>
                        <Form.Item label="邮编" {...formItemLayout}>
                            {getFieldDecorator('zipCode', {
                                initialValue: this.state.orderList.zipCode === 0 ? 0 : this.state.orderList.zipCode || ''
                            })(
                                <InputNumber className={styles['input-disableds']} disabled={this.state.disabled} style={{ width: "100%" }} placeholder=" " />
                                )}
                        </Form.Item>
                        <Form.Item label="房间号" {...formItemLayout}>
                            {getFieldDecorator('roomNumber', {
                                initialValue: this.state.orderList.roomNumber === 0 ? 0 : this.state.orderList.roomNumber || ''
                            })(
                                <InputNumber className={styles['input-disableds']} disabled={this.state.disabled} style={{ width: "100%" }} placeholder=" " />
                                )}
                        </Form.Item>
                    </div>
                    <div style={{display:'none'}} className={'signBill'}>
                        <Form.Item label="性别" {...formItemLayout}>
                            {getFieldDecorator('sex', {
                                initialValue: this.state.orderCustomerList.sex || '',
                            })(
                                <Select disabled={this.state.disabled} placeholder=" " className={styles['select-disableds']}>
                                    <Select.Option value="M">男</Select.Option>
                                    <Select.Option value="F">女</Select.Option>
                                </Select>
                                )}
                        </Form.Item>
                        <Form.Item label="婚姻状况" {...formItemLayout}>
                            {getFieldDecorator('marriageStatus', {
                                initialValue: this.state.orderCustomerList.marriageStatus || '',
                            })(
                                <Select
                                    className={styles['select-disableds']}
                                    disabled={this.state.disabled}
                                    placeholder=" "
                                    showSearch
                                    optionFilterProp="children" >
                                    {marryOptions}
                                </Select>
                                )}
                        </Form.Item>
                        <Form.Item label="年收入" {...formItemLayout}>
                            {getFieldDecorator('annualIncome', {
                                initialValue: this.state.orderCustomerList.annualIncome || '',
                            })(
                                <Select
                                    className={styles['select-disableds']}
                                    disabled={this.state.disabled}
                                    placeholder=" "
                                    showSearch
                                    optionFilterProp="children" >
                                    {incomeOptions}
                                </Select>
                                )}
                        </Form.Item>
                        <Form.Item label="您现时负债大约多少" {...formItemLayout}>
                            {getFieldDecorator('liabilities', {
                                initialValue: this.state.orderCustomerList.liabilities === 0 ? 0 : this.state.orderCustomerList.liabilities || ''
                            })(
                                <InputNumber className={styles['input-disableds']} disabled={this.state.disabled} style={{ width: "100%" }} placeholder=" " />
                                )}
                        </Form.Item>
                        <Form.Item label="所属行业" {...formItemLayout}>
                            {getFieldDecorator('industry', {
                                initialValue: this.state.orderCustomerList.industry || ''
                            })(
                                <Input disabled={this.state.disabled} />
                                )}
                        </Form.Item>
                    </div>
                    <Form.Item label="目的国家" {...formItemLayout}>
                        {getFieldDecorator('destinationCountry', {
                            rules: [{
                                required: true,
                                message: '请输入目的国家',
                                whitespace: true
                            }],
                            initialValue: this.state.orderList.destinationCountry|| ''
                        })(
                            <Input disabled={this.state.disabled} />
                            )}
                    </Form.Item>
                    <Form.Item label="目的国家联系电话" {...formItemLayout}>
                        {getFieldDecorator('destinationPhone', {
                            rules: [{
                                required: true,
                                message: '请输入目的国家联系电话',
                                whitespace: true
                            }],
                            initialValue: this.state.orderList.destinationPhone|| ''
                        })(
                            <Input disabled={this.state.disabled} />
                            )}
                    </Form.Item>
                    <Form.Item label="是否需要接机" {...formItemLayout}>
                        {getFieldDecorator('meetAirportFlag', {
                            rules: [
                                {message: '请选择是否需要接机', whitespace: true, }
                            ],
                            initialValue: this.state.orderList.meetAirportFlag || 'N',
                        })(
                            <Select disabled={this.state.disabled} onChange={this.flightChange.bind(this)} placeholder=" " className={styles['select-disableds']}>
                                <Select.Option value="Y">是</Select.Option>
                                <Select.Option value="N">否</Select.Option>
                            </Select>
                            )}
                    </Form.Item>
                    <div className={'flight'} style={{display:'none'}}>
                        <Form.Item label="航班号" {...formItemLayout}>
                            {getFieldDecorator('flightNum', {
                                rules: [{ required: this.state.flightFlag, message: '请输入航班号', whitespace: true }],
                                initialValue: this.state.orderList.flightNum || ''
                            })(
                                <Input disabled={this.state.disabled} />
                                )}
                        </Form.Item>
                        <Form.Item label="航班到达时间" {...formItemLayout}>
                            {getFieldDecorator('flightTime', {
                                rules: [{ required: this.state.flightFlag, message: '请选择航班到达时间', whitespace: true, type: 'object' }],
                                initialValue: isNaN(moment(this.state.orderList.flightTime, "YYYY-MM-DD HH:mm")) ?
                                    null
                                    :
                                    moment(this.state.orderList.flightTime, "YYYY-MM-DD HH:mm")
                            })(
                                <DatePicker
                                    disabled={this.state.disabled}
                                    placeholder=""
                                    format="YYYY-MM-DD HH:mm"
                                    disabledDate={this.disabledFlighDate.bind(this)}
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: moment('00:00', 'HH:mm'),
                                        format: 'HH:mm'
                                    }}
                                    style={{ width: '100%' }}
                                />
                                )}
                        </Form.Item>
                    </div>
                    <Form.Item label="酒店名称" {...formItemLayout}>
                        {getFieldDecorator('hotel', {
                            rules: [{ message: '请输入酒店名称',whitespace: true}],
                            initialValue: this.state.orderList.hotel || '',
                        })(
                            <Input disabled={this.state.disabled} />
                            )}
                    </Form.Item>
                    <Form.Item label="酒店地址" {...formItemLayout}>
                        {getFieldDecorator('hotelAddress', {
                            rules: [{ required:true ,message: '请输入酒店地址',whitespace: true}],
                            initialValue: this.state.orderList.hotelAddress || '',
                        })(
                            <Input disabled={this.state.disabled} />
                            )}
                    </Form.Item>
                    <Form.Item label="考察人数" {...formItemLayout}>
                        {getFieldDecorator('visitsNum', {
                            rules: [
                                {required: true, message: '请输入考察人数', whitespace: true }
                            ],
                            initialValue:this.state.visitsNum|| ''
                        })(
                            <Select>
                                {numArr}
                            </Select>
                            )}
                    </Form.Item>
                    <div style={{position:'relative'}}>
                        <Form.Item label="考察时间段" {...formItemLayout}>
                            {getFieldDecorator('vistitStartTime', {
                                rules: [{
                                    required: true,
                                    message: '请选择考察开始时间'
                                }],
                                initialValue: isNaN(moment(this.state.orderList.vistitsTimeStart, "YYYY-MM-DD HH:mm")) ?
                                null
                                :
                                moment(this.state.orderList.vistitsTimeStart, "YYYY-MM-DD HH:mm")
                            })(
                                <DatePicker
                                    disabledDate={this.disabledStartDate.bind(this)}
                                    disabled={this.state.disabled}
                                    disabledTime={this.disabledDateTime.bind(this)}
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: moment('00:00', 'HH:mm'),
                                        format: 'HH:mm'
                                    }}
                                    format="YYYY-MM-DD HH:mm"
                                    setFieldsValue={startValue}
                                    onChange={this.onStartChange}
                                    style={{ width: '48%', marginRight: '4%' }}
                                />
                                )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} style={{position:'absolute',width:'100%',top:'0',left:'634px'}}>
                            {getFieldDecorator('vistitEndTime', {
                                rules: [{
                                    required: true,
                                    message: '请选择考察结束时间'
                                }],
                                initialValue: isNaN(moment(this.state.orderList.vistitsTimeTo, "YYYY-MM-DD HH:mm")) ?
                                null
                                :
                                moment(this.state.orderList.vistitsTimeTo, "YYYY-MM-DD HH:mm")
                            })(
                                <DatePicker
                                    disabledDate={this.disabledEndDate.bind(this)}
                                    disabled={this.state.disabled}
                                    disabledTime={this.disabledDateTime.bind(this)}
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: moment('00:00', 'HH:mm'),
                                        format: 'HH:mm'
                                    }}
                                    format="YYYY-MM-DD HH:mm"
                                    setFieldsValue={endValue}
                                    onChange={this.onEndChange}
                                    style={{ width: '48%' }}
                                />
                                )}
                        </Form.Item>
                    </div>
                    <Form.Item label="意向项目" {...formItemLayout}>
                        {getFieldDecorator('IntentionPro', {
                            initialValue: {
                                value: this.state.orderList.itemId,
                                meaning: this.state.orderList.itemName,
                                record: {
                                    itemId: this.state.orderList.itemId,
                                    itemCode: this.state.orderList.itemCode,
                                    itemName: this.state.orderList.itemName,
                                    sublineId: this.state.orderList.sublineId,
                                    productSupplierId: this.state.orderList.productSupplierId,
                                    currency: this.state.orderList.currency,
                                    channelId: this.state.orderList.channelId,
                                }
                            },
                            rules: [{
                                required: true,
                                validator: (rule, value, callback) => {
                                    if (value && (!value.value || !value.meaning)) {
                                        callback('请选择项目');
                                    } else {
                                        callback();
                                    }
                                }
                            }],
                        })(
                            <Lov disabled={this.state.disabled} config={true} title="添加产品" lovCode='HOUSE_PRO_ITEAMS' placeholder="请选择项目" />
                            )}
                    </Form.Item>
                    <Form.Item label="预算范围（人民币）" {...formItemLayout}>
                        {getFieldDecorator('budgetRange', {
                            rules: [
                                { required: true, message: '请输入预算范围（人民币）', whitespace: true ,pattern: /^-?\d+(\.)?$/ },
                            ],
                            initialValue: this.state.orderList.budgetRange === 0? 0: this.state.orderList.budgetRange|| ''
                        })(
                            <InputNumber
                                disabled={this.state.disabled}
                                formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value && value.toString().replace(/\$\s?|(,*)/g, '')}
                                style={{ width: '100%' }}
                            />
                            )}
                    </Form.Item>
                    <Form.Item label="物业类型" {...formItemLayout}>
                        {getFieldDecorator('propertyType', {
                            rules: [{
                                type:'array',
                                required: true,
                                message: '请选择物业类型',
                                whitespace: true,
                            }],
                            initialValue: (typeof this.state.orderList.propertyType == 'string' && this.state.orderList.propertyType) ? this.state.orderList.propertyType.split(',') : [],
                        })(
                            <Select
                            className={styles['select-disableds']}
                            mode="multiple"
                            optionFilterProp="children"
                            disabled={this.state.disabled}>
                            {houseOptions}
                            </Select>
                            )}
                    </Form.Item>
                    <Form.Item label="置业目的" {...formItemLayout}>
                        {getFieldDecorator('homePurpose', {
                            rules: [{
                                type:'array',
                                required: true,
                                message: '请选择置业目的',
                                whitespace: true,
                            }],
                            initialValue: (typeof this.state.orderList.homePurpose == 'string' && this.state.orderList.homePurpose) ? this.state.orderList.homePurpose.split(',') : [],
                        })(
                            <Select
                            className={styles['select-disableds']}
                            mode="multiple"
                            optionFilterProp="children"
                            disabled={this.state.disabled}>
                            {purposeOptions}
                            </Select>
                            )}
                    </Form.Item>
                    <Form.Item label="是否有房产投资" {...formItemLayout}>
                        {getFieldDecorator('estateInvestmentFlag', {
                            rules: [
                                {message: '请选择是否有房产投资', whitespace: true, }
                            ],
                            initialValue: this.state.orderCustomerList.estateInvestmentFlag || '',
                        })(
                            <Select disabled={this.state.disabled} placeholder=" " className={styles['select-disableds']}>
                                <Select.Option value="Y">是</Select.Option>
                                <Select.Option value="N">否</Select.Option>
                            </Select>
                            )}
                    </Form.Item>
                    <Form.Item label="主要联系人" {...formItemLayout}>
                        {getFieldDecorator('mainPrimaryContact', {
                            rules: [{
                                required:true,
                                message: '请输入主要联系人',
                                whitespace: true,
                            }],
                            initialValue: this.state.orderList.mainPrimaryContact || localStorage.channelName
                        })(
                            <Input disabled={this.state.disabled} />
                            )}
                    </Form.Item>
                    <Form.Item label="联系人电话" {...formItemLayout}>
                        {getFieldDecorator('mainContactPhone', {
                            rules: [{
                                required: true,
                                message: '请输入联系人电话',
                                whitespace: true
                            }, {
                                validator: this.mainCheckPhone.bind(this),
                            }],
                           initialValue: this.state.orderList.mainContactPhone|| JSON.parse(localStorage.user).phone
                        })(
                            <Input disabled={this.state.disabled} addonBefore={mainContactPhoneCode} placeholder=" " style={{width:'100%'}}/>
                            )}
                    </Form.Item>
                    <Form.Item label="护照上传（请将所有考察人员的护照照片打包上传）" {...formItemLayout}>
                        {getFieldDecorator('passportFileId', {
                            rules: [{
                                required: true,
                                message: '请上传护照',
                                whitespace: true,
                                type: 'array'
                            }],
                            //initialValue: this.state.orderCustomerList.sysFiles?this.state.fileArr:[],
                        })(
                            <Upload disabled={this.state.disabled} fileNum={1} modularName='PRD'>
                                <Button disabled={this.state.disabled} type="primary">选择文件</Button>
                            </Upload>
                            )}
                    </Form.Item>
                    <Form.Item label="备注" {...formItemLayout}>
                        {getFieldDecorator('description', {
                            initialValue: this.state.orderList.description || '',
                        })(
                            <Input style={{color:'#595959'}} type="textarea" disabled={this.state.disabled} placeholder=" " />
                            )}
                    </Form.Item>
                </Row>
                <Row>
                    {
                        !this.state.disabled &&
                        <Form.Item
                            wrapperCol={{
                                xs: { span: 16, offset: 8 },
                                sm: { span: 16, offset: 8 },
                            }}
                        >
                            <Button type="default" disabled={this.state.disabled} style={{ width: '120px', height: '40px', marginRight: '80px' }} onClick={this.goBack.bind(this)}>取消</Button>
                            <Button type="primary" id="submitBtn" disabled={this.state.disabled} style={{ width: '120px', height: '40px' }} onClick={this.handleSubmit.bind(this)}>确认提交</Button>
                        </Form.Item>
                    }
                </Row>
            </Form>
        )
    }
}
export default Form.create()(ProductionSubscribeComponent);
