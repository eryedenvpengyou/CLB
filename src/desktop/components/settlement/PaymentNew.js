/*
 * show 付款对账单新建
 * @author:zhouting
 * @version:20180427
 */
import React from 'react';
import { connect } from 'dva';
import { Form,DatePicker,Select,Button,Table,Input,Modal,InputNumber} from 'antd';
import * as service from '../../services/settlement';
import * as codeService from '../../services/code';
import style from '../../styles/settlement.css';
import TipModal from "../common/modal/Modal";
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
class PaymentNew extends React.Component{
    state = {
        expand:false
    }
    constructor(props){
        super(props);
        this.state={
            selectedRowKeys :[], 
            selectedRows:[],
            selectedRowKeys1 :[], 
            selectedRows1:[],
            visible:[false,false],
            code: {
                paymentCurrency:[]
            },
            dataList:[],
            checkedList:[],
            remark:'',
            payCurrency:'',
            unpaidSett:[]
        }
    }
    componentDidMount(){
        let params = {
            paymentCurrency :'PUB.CURRENCY',
            paymentTypes :'FET.PAYMENT_TYPE'
        }
        codeService.getCode(params).then((data)=>{
            this.setState({code:data})
        });
        if(this.props.settlementSummaryId == '000'){
            this.selectUnselected();
        }else{
            //查询已选中未结算订单
            service.queryDetail({settlementSummaryId:this.props.settlementSummaryId}).then((data)=>{
                if(data.success){
                    this.setState({checkedList:data.rows});
                    // data.rows.map((i)=>{

                    // })
                }
            })
            service.summaryQuery({settlementSummaryId:this.props.settlementSummaryId}).then((data)=>{
                if(data.success){
                    let res = data.rows[0];
                    let payIds = []
                    this.setState({payCurrency:res.currency});
                    service.queryDetail({settlementSummaryId:this.props.settlementSummaryId}).then((detailData)=>{
                        if(detailData.success && detailData.rows.length){
                            let query = detailData.rows
                            query.map((item) => {
                                payIds.push(item.payId);
                            })
                            payIds = payIds.toString()
                        }else{
                            payIds = ''
                        }
                        let settlementParams = {
                            paymentCompanyId: res.paymentCompanyId,
                            paymentCompanyType: res.paymentCompanyType,
                            receiveCompanyId: res.receiveCompanyId,
                            receiveCompanyType: res.receiveCompanyType,
                            payIds: payIds,
                            settleFlag: 'Y'
                        }
                        //查询未结算订单-编辑
                        service.selectUnselected(settlementParams).then((data) => {
                            if (data.success) {
                                this.setState({ dataList: data.rows })
                            }
                        })
                    })
                }
            })
        }
    }
    //查询未结算订单-新建
    selectUnselected(){
        let settlementParams = {
            settleFlag:'Y',
            paymentCompanyType:JSON.parse(localStorage.user).userType,
            paymentCompanyId:JSON.parse(localStorage.user).relatedPartyId
        }
        service.selectUnselected(settlementParams).then((data)=>{
            if(data.success){
                this.setState({dataList:data.rows})
            }
        })
    }
    show(i){
        let all = this.state.visible;
        all[i] = !all[i];// false = true
        this.setState({
            visible:all
        });
    }
    //没有选中任何数据时点击生成付款对账单
    alert(){
        TipModal.error({content:'请至少选择一条结算数据'})
    }
    //更改结算币种
    confirm(){
        if(this.state.checkedList.length){
            this.props.form.validateFields(['payment'],(err,values)=>{
                if(!err){
                    let curParams = JSON.parse(JSON.stringify(this.state.checkedList))
                    curParams.map((i) => {
                        i.payCurrency = values.payment
                    });
                    service.changeCurrency(curParams).then(data=>{
                        if(data.success){
                            TipModal.success({content:'成功'});
                            this.state.checkedList.map((i)=>{
                                data.rows.map((j)=>{
                                    i.exchangeRate = j.exchangeRate
                                    i.payCurrency = j.payCurrency
                                    i.exchangeRateAmount = j.exchangeRateAmount
                                    i.unpaidSettlement = i.exchangeRate * i.unpaidAmount
                                })
                            })
                        }else{
                            TipModal.error({content:data.message})
                        }
                        this.show(0)
                    })
                }
            })
            
        }
    }
    //生成付款结算单
    //新建
    submit(){
        if(this.state.checkedList.length){
            this.props.form.validateFields(['periodName','settleDate'],(err,values)=>{
                if(!err){
                    var settleDate = values.settleDate._d;
                    settleDate = settleDate.getFullYear()+"-"+(settleDate.getMonth()+1)+"-"+settleDate.getDate();
                    this.state.checkedList.map((i) => {
                        i.periodName = values.periodName,
                        i.settleDate = settleDate
                    })
                    this.create();
                    this.show(1)
                }
            })
            
        }
    }
    //详情 添加
    create(){
        service.createSettlement(this.state.checkedList).then(data=>{
            if(data.success){
                if(this.props.settlementSummaryId == '000'){
                    TipModal.success({content:data.message});
                    window.setTimeout(()=>{
                        location.hash = '/settlement/check/2'
                    },3000)
                } else {
                    TipModal.success({content:'添加成功'});
                    window.setTimeout(() => {
                        window.history.back()
                    }, 3000)
                }
            }else{
                TipModal.error({content:data.message})
            }
        })
    }
    refer(){
        const values = this.props.form.getFieldsValue();
        if (values.rangePicker) {
            for (let i = 0; i < values.rangePicker.length; i++) {
              var start = values.rangePicker[0]._d.getFullYear() + '-' + (values.rangePicker[0]._d.getMonth() + 1) + '-' + values.rangePicker[0]._d.getDate();
              var end = values.rangePicker[1]._d.getFullYear() + '-' + (values.rangePicker[1]._d.getMonth() + 1) + '-' + values.rangePicker[1]._d.getDate();
            }
          }
        let settlementParams = {
            settleFlag:'Y',
            paymentCompanyType:JSON.parse(localStorage.user).userType,
            paymentCompanyId:JSON.parse(localStorage.user).relatedPartyId,
            receiveCompanyName:this.props.form.getFieldValue('receiveCompanyName'),
            dueStartTime:start,
            dueEndTime:end
        }
        service.selectUnselected(settlementParams).then((data)=>{
            this.setState({dataList:data.rows})
        })
    }
    //添加 移出已选
    query(type,data){
        if (this.state.selectedRowKeys.length || this.state.selectedRowKeys1.length) {
            if (data.length) {
                let dataList = this.state.dataList,
                    checkedList = this.state.checkedList,
                    newList = []
                for (let i = 0; i < data.length; i++) {
                    if (type == 'add') {
                        for (let j = 0; j < dataList.length; j++) {
                            if (JSON.stringify(data[i]) === JSON.stringify(dataList[j])) {//data[i] == dataList[j]
                                if (this.props.settlementSummaryId !== '000') {
                                    //添加已选-更改已选数据币种
                                    dataList[j].payCurrency = this.state.payCurrency
                                    dataList[j].settlementSummaryId = this.props.settlementSummaryId
                                    newList.push(dataList[j]);
                                }
                                checkedList.push(dataList[j]);
                                dataList.splice(j, 1);
                                this.setState({
                                    dataList,
                                    checkedList,
                                    selectedRowKeys: []
                                });
                                j = j - 1;
                            }
                        }
                    } else if (type == 'remove') {
                        for (let j = 0; j < checkedList.length; j++) {
                            if (JSON.stringify(data[i]) == JSON.stringify(checkedList[j])) {
                                dataList.push(checkedList[j])
                                checkedList.splice(j, 1);
                                this.setState({
                                    dataList,
                                    checkedList,
                                    selectedRowKeys1: []
                                });
                                j = j - 1;
                            }
                        }
                    }
                }

                //添加已选-更改已选数据币种后更新未结算订单数据
                if (this.props.settlementSummaryId !== '000') {
                    if (newList.length) {
                        service.changeCurrency(newList).then(data => {
                            if (data.success) {
                                for (let i = 0; i < data.rows.length; i++) {
                                    for (let j = 0; j < this.state.checkedList.length; j++) {
                                        if (data.rows[i].payId == this.state.checkedList[j].payId) {
                                            this.state.checkedList[j] = data.rows[i]
                                        }
                                    }
                                }
                                this.setState({ checkedList });
                                let payIds = []
                                this.state.checkedList.map((item) => {
                                    payIds.push(item.payId)
                                });
                                service.summaryQuery({ settlementSummaryId: this.props.settlementSummaryId }).then((data) => {
                                    if (data.success) {
                                        let res = data.rows[0];
                                        let settlementParams = {
                                            paymentCompanyId: res.paymentCompanyId,
                                            paymentCompanyType: res.paymentCompanyType,
                                            receiveCompanyId: res.receiveCompanyId,
                                            receiveCompanyType: res.receiveCompanyType,
                                            payIds: payIds.toString(),
                                            settleFlag: 'Y'
                                        }
                                        //查询未结算订单-编辑
                                        service.selectUnselected(settlementParams).then((data) => {
                                            if (data.success) {
                                                this.setState({ dataList: data.rows })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            }
        }
    }
    handleChange(record,type,e){
        switch (type) {
            case 'amount':
                record.unpaidAmount = e
                break;
            case 'remark':
                record.factPayDiffer = e.target.value
                break;
        }
    }
    //本期结算金额（结算币种）根据填写的本期结算金额对应更新
    onBlur(record){   
        let checkedList = this.state.checkedList
        for(let i=0;i<checkedList.length;i++){
            if(record.payId == checkedList[i].payId){
                checkedList[i].unpaidSettlement = record.unpaidAmount*(record.exchangeRate);
                this.setState({checkedList})
            }
        }
    }
    onKeyChange = (selectedRowKeys,selectedRows) => {
        this.setState({ selectedRowKeys ,selectedRows});
    }
    onKeyChange1 = (selectedRowKeys,selectedRows) => {
        this.setState({ selectedRowKeys1:selectedRowKeys , selectedRows1:selectedRows});
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
        const columns = [ {
            title: '收款方名称',
            key: 'receiveCompanyName',
            dataIndex: 'receiveCompanyName',
            width: 120,
        }, {
            title: '结算类型',
            key: 'paymentType',
            dataIndex: 'paymentType',
            width: 150,
            render:(text)=>{
                if(text && this.state.code.paymentTypes){
                    for(let i in this.state.code.paymentTypes){
                        if(text == this.state.code.paymentTypes[i].value){
                            return this.state.code.paymentTypes[i].meaning
                        }
                    }
                }
                return ''
            }
        }, {
            title: '保单/订单编号',
            key: 'orderNumber',
            dataIndex: 'orderNumber',
            width: 150,
        }, {
            title: '投保人',
            key: 'name',
            dataIndex: 'name',
            width: 100,
        },{
            title: '产品名称',
            key: 'itemName',
            dataIndex: 'itemName',
            width: 200,
        },{
            title: '订单币种',
            key: 'orderCurrency',
            dataIndex: 'orderCurrency',
            width: 100,
            render:(text)=>{
                if(text && this.state.code.paymentCurrency){
                    for(let i in this.state.code.paymentCurrency){
                        if(text == this.state.code.paymentCurrency[i].value){
                            return this.state.code.paymentCurrency[i].meaning
                        }
                    }
                }
                return ''
            }
        }, {
            title: '费率',
            key: 'rate',
            dataIndex: 'rate',
            width: 100,
            render:(text)=>{
                return (text*100).toFixed(2)+'%'
            }
        }, {
            title: '实付总额',
            key: 'factPay',
            dataIndex: 'factPay',
            width: 100,
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '结算中金额',
            key: 'settlingAmount',
            dataIndex: 'settlingAmount',
            width: 150,
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '应付未结算金额',
            key: 'unpaidAmount',
            dataIndex: 'unpaidAmount',
            width: 150,
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '结算币种',
            key: 'payCurrency',
            dataIndex: 'payCurrency',
            width: 100,
            render:(text)=>{
                if(text && this.state.code.paymentCurrency){
                    for(let i in this.state.code.paymentCurrency){
                        if(text == this.state.code.paymentCurrency[i].value){
                            return this.state.code.paymentCurrency[i].meaning
                        }
                    }
                }
                return ''
            }
        }, {
            title: '汇率',
            key: 'exchangeRate',
            dataIndex: 'exchangeRate',
            width: 100,
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        },{
            title: '应付总额（结算币种）',
            key: 'exchangeRateAmount',
            dataIndex: 'exchangeRateAmount',
            width: 200,
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '应付未结算总额（结算币种）',
            key: 'unpaidSettlement',
            dataIndex: 'unpaidSettlement',
            width: 200,
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '基准日期',
            key: 'baseDate',
            dataIndex: 'baseDate',
            width: 150,
            render:(text)=>{
                return moment(text).format("YYYY-MM-DD")
            }
        }, {
            title: '预计结算日',
            key: 'dueDate',
            dataIndex: 'dueDate',
            width: 150,
            render:(text)=>{
                return moment(text).format("YYYY-MM-DD")
            }
        }, {
            title: '实付差异原因',
            key: 'factPayDiffer',
            dataIndex: 'factPayDiffer',
            width: 150
        }];
        const columns1 = [ {
            title: '收款方名称',
            key: 'receiveCompanyName',
            dataIndex: 'receiveCompanyName',
            width: 120,
        }, {
            title: '结算类型',
            key: 'paymentType',
            dataIndex: 'paymentType',
            width: 150,
            render:(text)=>{
                if(text && this.state.code.paymentTypes){
                    for(let i in this.state.code.paymentTypes){
                        if(text == this.state.code.paymentTypes[i].value){
                            return this.state.code.paymentTypes[i].meaning
                        }
                    }
                }
                return ''
            }
        }, {
            title: '保单/订单编号',
            key: 'orderNumber',
            dataIndex: 'orderNumber',
            width: 150,
        }, {
            title: '投保人',
            key: 'name',
            dataIndex: 'name',
            width: 100,
        },{
            title: '产品名称',
            key: 'itemName',
            dataIndex: 'itemName',
            width: 200,
        },{
            title: '订单币种',
            key: 'orderCurrency',
            dataIndex: 'orderCurrency',
            width: 100,
            render:(text)=>{
                if(text && this.state.code.paymentCurrency){
                    for(let i in this.state.code.paymentCurrency){
                        if(text == this.state.code.paymentCurrency[i].value){
                            return this.state.code.paymentCurrency[i].meaning
                        }
                    }
                }
                return ''
            }
        }, {
            title: '费率',
            key: 'rate',
            dataIndex: 'rate',
            width: 100,
            render:(text)=>{
                return (text*100).toFixed(2)+'%'
            }
        }, {
            title: '实付总额',
            key: 'factPay',
            dataIndex: 'factPay',
            width: 100,
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '结算中金额',
            key: 'settlingAmount',
            dataIndex: 'settlingAmount',
            width: 150,
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '本期结算金额',
            key: 'unpaidAmount',
            dataIndex: 'unpaidAmount',
            width: 180,
            render:(text,record,index)=>{
               return <InputNumber style={{ width: '150px' }}
                    defaultValue={text}
                    precision={2}
                    onChange={this.handleChange.bind(this, record, 'amount')}
                    onBlur={this.onBlur.bind(this,record)}
                />
                
            }
        }, {
            title: '结算币种',
            key: 'payCurrency',
            dataIndex: 'payCurrency',
            width: 100,
            render:(text)=>{
                if(text && this.state.code.paymentCurrency){
                    for(let i in this.state.code.paymentCurrency){
                        if(text == this.state.code.paymentCurrency[i].value){
                            return this.state.code.paymentCurrency[i].meaning
                        }
                    }
                }
                return ''
            }
        }, {
            title: '汇率',
            key: 'exchangeRate',
            dataIndex: 'exchangeRate',
            width: 100,
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        },{
            title: '应付总额（结算币种）',
            key: 'exchangeRateAmount',
            dataIndex: 'exchangeRateAmount',
            width: 200,
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '本期结算金额（结算币种）',
            key: 'unpaidSettlement',
            dataIndex: 'unpaidSettlement',
            width: 200,
            render:(text)=>{
                return  text === 0?0:text?text.toFixed(2):''
            }
        }, {
            title: '基准日期',
            key: 'baseDate',
            dataIndex: 'baseDate',
            width: 150,
            render:(text)=>{
                return moment(text).format("YYYY-MM-DD")
            }
        }, {
            title: '预计结算日',
            key: 'dueDate',
            dataIndex: 'dueDate',
            width: 150,
            render:(text)=>{
                return moment(text).format("YYYY-MM-DD")
            }
        }, {
            title: '备注',
            key: 'factPayDiffer',
            dataIndex: 'factPayDiffer',
            width: 180,
            render:(text,record,index)=>{
                return <Input style={{ width: '150px' }}
                     onChange={this.handleChange.bind(this, record, 'remark')}
                 />
                 
             }
        }];
        const { selectedRowKeys,selectedRows,selectedRowKeys1,selectedRows1} = this.state;
        const rowSelection = {
            selectedRowKeys, 
            selectedRows,
            onChange: this.onKeyChange
        };
        const rowSelection1 = {
            selectedRowKeys:selectedRowKeys1,
            selectedRows:selectedRows1,
            onChange: this.onKeyChange1
        };
        const currencyOptions = this.state.code.paymentCurrency.map((item)=>{
            return <Select.Option key={item.value}>{item.meaning}</Select.Option>
        })
        const total = [];
        if(this.state.checkedList.length){
            this.state.checkedList.map((i)=>{
                total.push(i.unpaidSettlement);
            });
        }

        return(
            <div className={style.main} >
                <div>
                    <div>
                        <h2 className={style.titleNew}>未结算订单</h2>
                        <Form layout='inline' style={{margin:'20px 0'}}>
                            <Form.Item>
                                <Button type='default' style={{fontSize:'20px',width:'140px',height:'40px'}} onClick={this.query.bind(this,'add',this.state.selectedRows)}>添加已选</Button>
                            </Form.Item> 
                            <Form.Item style = {{marginLeft:'368px'}}>
                                {
                                    getFieldDecorator('receiveCompanyName')(
                                        <Input style={{ width: '200px' }} placeholder='收款方名称' />
                                    )
                                }
                            </Form.Item> 
                            <Form.Item>
                                {getFieldDecorator('rangePicker', {
                                })(
                                    <RangePicker style={{ width: '250px' }} placeholder={['预计结算日从','预计结算日至']}/>
                                    )}
                            </Form.Item>
                            <Form.Item style={{float:'right',marginRight:'-9px'}}>
                                <Button type="default" htmlType="submit" style={{width:'140px',height:'40px',marginRight:'10px'}} onClick={this.refer.bind(this)}>查询</Button>
                            </Form.Item>   
                        </Form>
                        <Table rowKey='key'
                            dataSource={this.state.dataList}
                            columns={columns}
                            bordered
                            scroll={{x:2500 , y:500}}
                            pagination={false}
                            rowSelection={rowSelection}
                        />
                        <hr style={{margin:'55px 0'}}/>
                        <h2 className={style.titleNew}>已选中未结算订单</h2>
                        <Form layout='inline' style={{margin:'20px 0'}}>
                            <Form.Item>
                                <Button type='default' style={{fontSize:'20px',width:'140px',height:'40px'}} onClick={this.query.bind(this,'remove',this.state.selectedRows1)}>移除</Button>
                            </Form.Item> 
                            <Form.Item style = {{marginLeft:'368px'}}>

                            </Form.Item> 
                            <Form.Item style={{float:'right'}}>                                
                                <Button type='default' style={{fontSize:'20px',width:'150px',height:'40px',marginRight:'20px'}} onClick={this.show.bind(this,0)}>更改结算币种</Button>
                                <span style={{fontSize:'16px'}}>
                                本期结算金额总计（结算币种）：{eval(total.join('+'))?(eval(total.join('+'))).toFixed(2):0}
                                </span>
                            </Form.Item>   
                        </Form>
                        <Table rowKey='key'
                            dataSource={this.state.checkedList}
                            columns={columns1}
                            bordered
                            scroll={{x:2500 , y:500}}
                            pagination={false}
                            rowSelection={rowSelection1}
                        />
                        <div style={{ clear: 'both', width: '100%', textAlign: 'center', padding: '30px' }}>
                            <Button type='default' style={{ width: '120px', height: '40px' }} onClick={() => {window.history.back()}}>取消</Button>
                            <Button type='primary' style={{ width: '150px', height: '40px', marginLeft: '65px' }} 
                            onClick={
                                this.state.checkedList.length?
                                this.props.settlementSummaryId == '000'?
                                this.show.bind(this,1):
                                this.create.bind(this):
                                this.alert.bind(this)
                                }>生成付款结算单</Button>
                        </div>
                        <Modal
                            title={'更改结算币种'}
                            width={600}
                            style={{ top: 200 }}
                            maskClosable={false}
                            closable={true}
                            footer={null}
                            visible={this.state.visible[0]}
                            onCancel={this.show.bind(this,0)}
                            className={style.modal}
                            >
                            <Form>
                                <div style={{ padding: '10px', margin: '15px 25px 10px 25px' }}>
                                    <Form.Item {...formItemLayout} label="结算币种" >
                                        {getFieldDecorator('payment', {
                                            rules: [
                                                { required: true, message: '请选择结算币种', whitespace: true}
                                            ],
                                        })(
                                            <Select
                                                showSearch
                                                >
                                                {currencyOptions}
                                            </Select>
                                            )}
                                    </Form.Item>
                                </div>
                                <div style={{ textAlign: 'center', marginBottom: '20px', marginLeft: '25px' }}>
                                    <Button onClick={this.show.bind(this,0)} type="default" style={{ width: '120px', height: '38px' }} >取消</Button>
                                    <Button onClick={this.confirm.bind(this)} type="primary" style={{ width: '120px', height: '38px', marginLeft: '32px' }} >确定</Button>
                                </div>
                            </Form>
                        </Modal>
                        <Modal
                            title={'设置结算期间'}
                            width={600}
                            style={{ top: 200 }}
                            maskClosable={false}
                            closable={true}
                            footer={null}
                            visible={this.state.visible[1]}
                            onCancel={this.show.bind(this,1)}
                            className={style.modal}
                            >
                            <Form>
                                <div style={{ padding: '10px', margin: '15px 25px 10px 25px' }}>
                                    <Form.Item {...formItemLayout} label="结算期间" >
                                        {getFieldDecorator('periodName', {
                                            rules: [
                                                { required: true, message: '请输入结算期间', whitespace: true}
                                            ],
                                        })(
                                            <Input placeholder='例如：1231231'/>
                                            )}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label="付款日期" >
                                        {getFieldDecorator('settleDate', {
                                            rules: [{ type: 'object', required: true, message: '请选择付款日期' }],
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
                                <div style={{ textAlign: 'center', marginBottom: '20px', marginLeft: '25px' }}>
                                    <Button onClick={this.show.bind(this,1)} type="default" style={{ width: '120px', height: '38px' }} >取消</Button>
                                    <Button onClick={this.submit.bind(this)} type="primary" style={{ width: '120px', height: '38px', marginLeft: '32px' }} >确定</Button>
                                </div>
                            </Form>
                        </Modal>
                    </div>              
                </div>
            </div>
        )
    }
}
export default Form.create()(PaymentNew)