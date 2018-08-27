import {Icon,Menu,Dropdown,Select, Form, Row, Col, Input, Button } from 'antd';
import * as styles from '../../styles/common.css'
import * as styles2 from '../../styles/order.css'
import { getCode } from '../../services/code';
import * as service from '../../services/order';
import Modals from '../common/modal/Modal';

const FormItem = Form.Item;


class OrderImmigrantInvestDetailForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      statusHisList: [],
      codeList: {
        currencyCodes: [],
        statusCodes: [],
      }
    }
  }

  componentWillMount() {
    //获取快码值
    const codeBody = {
      currencyCodes: 'PUB.CURRENCY',
      statusCodes: 'ORD.IMMIGRANT_STATUS',
    };
    getCode(codeBody).then((data)=>{
      this.setState({
        codeList: data
      });
    });
    //状态跟进信息
    service.fetchOrderDetailordStatusHisList({orderId:this.props.orderId}).then((data)=>{
      if (data.success) {
        const statusHisList = data.rows || [];
        statusHisList.map((row, index) => {
          row.key = index;
        });
        this.setState({statusHisList: statusHisList});
      }
    });
  }

  fmoney(s)
  {
    s = parseFloat((s + '').replace(/[^\d\.-]/g, '')) + '';
    var l = s.split('.') [0].split('').reverse(),
      r = s.split('.') [1];
    var  t = '';
    for (var i = 0; i < l.length; i++)
    {
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
    }
    return t.split('').reverse().join('') ;
  }

  //查看日志
  orderShowLog(fields){
    service.fetchOrderDetailordStatusHisList({orderId:fields.orderId}).then((data)=>{
      const statusHisList = data.rows || [];
      this.setState({statusHisList: statusHisList});
      Modals.LogModel({List:this.state.statusHisList});
    });
  }

  render() {
    let dataCurrencyCodes =this.state.codeList.currencyCodes?this.state.codeList.currencyCodes:{};
    let data =this.props.orderDetail||{};
    if(data){
      if(data.policyAmount!=''&&data.policyAmount!=null){
        data.policyAmountFixed = this.fmoney(data.policyAmount);
      } else {
        data.policyAmountFixed =''
      }
      if(data.currency){
        for(let i = 0;i<dataCurrencyCodes.length;i++){
          if(data.currency==dataCurrencyCodes[i].value){
            data.currency = dataCurrencyCodes[i].meaning
          }
        }
      }
    }
    const fields = data;
    const { getFieldDecorator } = this.props.form;
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

    const menu = (
      <Menu style={{height : '250px',width : '290px',overflow:'scroll'}}>
        {
          this.state.statusHisList.map((item)=>
            <Menu.Item key={item.statusHisId}>{item.statusDate}&nbsp;&nbsp;{item.meaning}&nbsp;&nbsp;{item.description}</Menu.Item>
          )
        }
      </Menu>
    );

    let orderStatusColor;
    if(fields.status === 'POLICY_EFFECTIVE'){
      orderStatusColor = '#00FF00';
    }else if(fields.status === 'SIGNED'){
      orderStatusColor = '#00FF00';
    }else if(fields.status === 'RESERVE_SUCCESS'){
      orderStatusColor = '#00FF00';
    }else if(fields.status === 'NEW'){
      orderStatusColor = '#00FF00';
    }else if(fields.status === 'NEED_REVIEW'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'SURRENDERING'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'SURRENDER_APPLY'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'SURRENDERED'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'PENDING'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'APPROVING'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'ARRIVAL'){
      orderStatusColor = '#00FF00';
    }else if(fields.status === 'RESERVE_FAIL'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'RESERVING'){
      orderStatusColor = '#00FF00';
    }else if(fields.status === 'APPROVED'){
      orderStatusColor = '#00FF00';
    }else if(fields.status === 'CANCELLED'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'CONFIRMED'){
      orderStatusColor = '#00FF00';
    }else if(fields.status === 'UNCONFIRMED'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'DATA_APPROVED'){
      orderStatusColor = '#00FF00';
    }else if(fields.status === 'DATA_APPROVING'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'LEAVE'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'EXPIRED'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'SUSPENDED'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'DECLINED'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'RESERVE_CANCELLED'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'NEGOTIATE'){
      orderStatusColor = '#FF0000';
    }else if(fields.status === 'BUY_SUCCESS'){
      orderStatusColor = '#00FF00';
    }

    return (
      <div>
          <Form >
            <Row gutter={40} >
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span style={{color:JSON.parse(localStorage.theme).themeColor}}>当前状态</span>} className={styles.formitem_sty} style={{fontSize:'16px'}}>
                  <span style={{color:JSON.parse(localStorage.theme).themeColor,fontSize:'16px'}}>{fields.statusDesc}</span>
                </FormItem>
              </Col>
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}} label="状态跟进">
                  {getFieldDecorator('orderStatusFollow', {})(
                    <Button type='primary' onClick={this.orderShowLog.bind(this,fields)} style={{fontSize:'16px',height:'35px',width:'60%',fontWeight:'normal'}} >订单日志状态跟进</Button>

                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40} >
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>订单编号</span>}>
                  {getFieldDecorator('orderNumber',{
                    initialValue:fields.orderNumber?fields.orderNumber:''
                  })(
                    <Input readOnly={true}  style={{height:'40px',fontSize:'16px'}}/>
                  )}
                </FormItem>
              </Col>
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="产品信息">
                  {getFieldDecorator('itemName',{
                    initialValue:fields.itemName?fields.itemName:''
                  })(
                    <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40} >

              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} className={styles.formitem_sty} style={{fontSize:'16px'}}  label="子产品信息">
                  {getFieldDecorator('sublineItemName',{
                    initialValue:fields.sublineItemName?fields.sublineItemName:''
                  })(
                    <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                  )}
                </FormItem>
              </Col>
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>金额</span>}>
                  {getFieldDecorator('policyAmountFixed',{
                    initialValue:fields.policyAmountFixed?fields.policyAmountFixed:''
                  })(
                    <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40} >

              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>币种</span>}>
                  {getFieldDecorator('currency',{
                    initialValue:fields.currency?fields.currency:''
                  })(
                    <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                  )}
                </FormItem>
              </Col>
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout}label={<span className={styles2.item_font_form}>客户</span>}>
                  {getFieldDecorator('applicant',{
                    initialValue:fields.applicant?fields.applicant:''
                  })(
                    <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40} >
              <Col span={11} style={{paddingLeft:'0',paddingRight:'0'}}>
                <FormItem {...formItemLayout} label={<span className={styles2.item_font_form}>渠道</span>}>
                  {getFieldDecorator('channelName',{
                    initialValue:fields.channelName?fields.channelName:''
                  })(
                    <Input readOnly={true} style={{height:'40px',fontSize:'16px'}}/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
    );
  }
}

OrderImmigrantInvestDetailForm = Form.create()(OrderImmigrantInvestDetailForm);

export default OrderImmigrantInvestDetailForm;
