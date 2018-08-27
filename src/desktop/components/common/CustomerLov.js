/**
 * created by xiaoyong.luo@hand-china.com at 2017/6/8 14:18
 *
 * update by xiaoyong.luo at 2017/6/21 22:52
 *
 * 通用Lov组件 使用说明
 * 1、使用方式：
 *      使用方式与在 HAp中的使用方式基本一致！传入 必输参数 lovCode （即在后台hap中定义的 lovCode）即可。
 *
 * 2、输入参数
 *      目前该组件配置了 4 个输入参数，其中包括1个必输 参数 和 3 个可选参数，3个可选参数中包括一个函数：
 *      --lovCode（必输）{}: lov编码，即在后台（hap)中定义的 lov 编码。
 *      --config（可选）boolean： 是否 使用 后台中配置的 lov 样式（主要包括 lov弹出框的大小，是否居中等样式暂时还无法启用）,默认为 false
 *      --itemChange(value)（可选） function ：选中 lov中的某个选项时触发，比如：需要在lov中选中值得时候，再利用这个值去查询别的内容
 *      --params （可选） {} : 自定义查询 时需要用到的参数 集 ，例如 ，以下是在 hap 中的使用：
 *          $("#hkBank").kendoLov($.extend(${lovProvider.getLov(base.contextPath, base.locale, "PUB_CODE_VALUE")}, {
              query: function(e) {
                e.param['codeName'] = "PUB.HK_BANK";
              },
            }));
        则在 这个 组件中 params 参数的值为 ： params ={codeName:'PUB.HK_BANK'}
        不过这里有个bug ：比如在 lov定义中的sql 包含这种信息时，sct.lang = #{request.locale,jdbcType=VARCHAR}  ,这时候查询会不正常

 *
 *
 * 3、输出参数
 *       value : lov 组件的值，即你需要的那个值
 *      考虑到该组件基本上是在 form 表单中使用，因此可以将该组件和 antd 中的 form组件结合使用，这样做有一个好处，那就是可以完全
 *      利用 antd 中 form组件提供的特性，比如：校验、取值等等。
 *
 * 4、使用说明
 *       除了需要传 必输 参数 lovCode 之外，与其他组件的使用方式没有任何区别，例如，以下在 form中使用了该组件
 *       <FormItem>
 *          {getFieldDecorator('lov', {
 *            initialValue: {},
 *          })(
 *            <Lov lovCode='LOV_UNIT' itemChange={this.itemChange}/>
 *          )}
 *       </FormItem>
 *
 *      那么，在获取值得时候，与其它组件的使用方式基本一致：
 *      const value = this.props.form.getFieldValue('lov').value;
 *      value 即为所需要的值
 *
 * 5、校验
 *      使用 Form  中提供的 校验函数校验，默认的一些校验类型比如： required ....无效，因为组件需要的是 字符串 类型
 *      rules: [{  validator: validateLov.bind(this)}]   validateLov 函数已经写到了 common.js 文件里面
 *
 * 6、使用示例
 *      请参照 BaseInfo（用户注册之后的详细信息填写） 界面中的 lov ，界面中用到了两个 lov
 *
 *
 *
 * 7、更新说明
 *     2017/6/12 13:12
 *        添加 几个属性，可以控制 lov 的大小
 *        size: 控制lov本身的大小，有三个值 large 、默认值、small
 *        width: lov本身的宽度
 *        placeholder: 如果传了参数，就会使用传过来的参数，否则就会查看后台的lov中是否定义了这个属性，有则使用，没有则使用 "lov搜索"
 *
 *      2017/6/21 22:52
 *        添加分页
 *        调整样式（table 大小为 size = "small";FormItem 之间的距离调小；整体弹出框大小为 50% ）
 *
 *      2017/6/28 11:52
 *        lov添加不可 编辑属性    disabled = this.props.disabled
 *
 *      2017/07/06 18:52
 *        添加 onClick 事件 ，点击输入框弹出模态框
 *
 *
 * @type {Object}
 */

import {Table,Button,Input,Form,Select,Modal, Icon} from 'antd';
import request from '../../utils/request';
import * as codeService from '../../services/code';
import * as service from '../../services/customer';
import {HTTP_HEADERS} from '../../constants';
import * as styles from '../../styles/qa.css';
import CodeOption from "./CodeOption";
import Modals from "./modal/Modal";
import moment from 'moment';
import $ from 'jquery';

 const FormItem = Form.Item;

 const LOV_CONFIG = '/api/commons/lov/config';
 const LOV_DATA = '/api/commons/lov/';

//form 布局
 const formItemLayout = {
   labelCol: {
     xs: { span: 24 },
     sm: { span: 5 },
   },
   wrapperCol: {
     xs: { span: 24 },
     sm: { span: 18 },
   },
 };

class CustomerLov extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,     //弹出框
      addVisible:false,   //添加客户弹窗
      lov:{},             //lov配置
      lovData: {},        //表格数据
      record:{},
      value: '',
      meaning: '',
      code: {},                //保存快码
    };
  }



  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const meaning = nextProps.value.meaning || '';
      const value = nextProps.value.value || '';
      this.setState({meaning,value});
    }
  }

  //自定义组件必须提供一个 trigger ，这里是 onFocus
  inputFocus = (e) => {
    // console.log(this.state.record);
    const meaning = e.target.value || '';
    // if (!('value' in this.props)) {
    //   this.setState({ meaning });
    // }
    // Should provide an event to pass value to Form.
    if (this.props.onChange) {
      // this.props.onChange(Object.assign({}, this.state));
      let value = {
        value: this.state.record.value || '',
        meaning: this.state.record.meaning || '',
        record: this.state.record,
      }
      // this.props.onChange(value);


      /**
       * 这个函数里面的代码都注释， 否则再 lov中搜索然后再 点击 某个选项的时候，哎，就是一部吧
       * 调用父级的 onChange 事件，在选中之后
       */
    }
  }

  //组件渲染之前
  componentWillMount() {
    if(this.props.lovCode){
      this.query(LOV_CONFIG,{code: this.props.lovCode}).then((data)=>{
        if(data.success && data.rows.length > 0){
          //字段显示排序 add by fengwanjun
          data.rows[0].lovItems.sort(this.sortBy("gridFieldSequence"));
          this.setState({lov:data.rows[0]});
       }
     });
    }

    let params = {
      phoneCodeList:'PUB.PHONE_CODE',  //电话代码
    };
    codeService.getCode(params).then((data) => {
      this.setState({
        code: data,
      });
    });
  }

  componentDidMount() {
    $("input[readonly]").keydown(function(e) {
      if(e.keyCode == 8)
        e.preventDefault();
    });

    //鼠标移入放大镜的时候，搜索框边框样式修改
    var ele = document.getElementsByClassName("ant-input-suffix");
    for (var i=0; i<ele.length; i++) {
      ele[i].onmouseover = function() {
        this.previousElementSibling.style.borderColor = "#d1b97f";
        this.previousElementSibling.style.boxShadow = "inset 0 1px 1px #d1b97f, 0 0 8px #d1b97f";
        this.previousElementSibling.style.webkitBoxShadow = "inset 0 1px 1px #d1b97f, 0 0 8px #d1b97f";
        this.previousElementSibling.style.mozBoxShadow = "inset 0 1px 1px #d1b97f, 0 0 8px #d1b97f";
      }
      ele[i].onmouseout = function() {
        this.previousElementSibling.removeAttribute("style");
      }
    }
  }

  //lov open
  lovOpen(){
   if(!this.props.disabled){
    //lovCode 必输
    if(this.props.lovCode){
      this.setState({visible:true});
      //是否已经获取lov配置
      if(!this.state.lov.lovId){
        this.query(LOV_CONFIG,{code: this.props.lovCode}).then((data)=>{
          if(data.success) this.setState({lov:data.rows[0]});
        });
      }

      const params = this.props.params || {};
      this.query(LOV_DATA+this.props.lovCode,params).then((data)=>{
        if(data.success){
          for(let i = 0; i< data.rows.length; i++) data.rows[i].key = i;
          this.setState({lovData:data});
        }
      });
    }else{
      Modal.error({title: 'JSON配置有误',content: '请传入正确的lovCode参数',});
    }
   }
  }

  //数组排序 add by fengwanjun
  sortBy = function(name) {
    return function(o,p){
      var a, b;
      if (typeof o === "object" && typeof p === "object" && o && p) {
        a = o[name];
        b = p[name];
        if (a === b) {
          return 0;
        }
        if (typeof a === typeof b) {
          return a < b ? -1 : 1;
        }
        return typeof a < typeof b ? -1 : 1;
      } else {
        throw ("error");
      }
    }
  }

  //查询
  search(){
   let allValues = this.props.form.getFieldsValue();
   let values = {
     chineseName: allValues.chineseName || '',
     customerCode: allValues.customerCode || '',
   };
   for(let i in values){
     values[i] = values[i] == ''? null: values[i]
   }
   const params = this.props.params || {};
   for(let filed in params){
     values[filed] = params[filed];
   }
   this.query(LOV_DATA+this.props.lovCode,values).then((data)=>{
     if(data.success){
       for(let i = 0; i< data.rows.length; i++){
         data.rows[i].key = i;
       }
       this.setState({lovData:data});
     }
   });
  }

  //选中
  onRowClick(record, index){
    const value = record[this.state.lov.valueField];
    const meaning = record[this.state.lov.textField];
    this.setState(
      Object.assign({}, {record},{value},{meaning}),() => {
        // if(this.props.lovList && this.state.value){
        //   let meaning = this.props.lovList.filter((item)=>item.value == this.state.value)
        //   if(meaning && meaning.length >0){
        //     this.setState({meaning:meaning[0].meaning});
        //   }
        // }else{
        //   this.setState({meaning:this.state.value});
        // }
        // this.setState({meaning:meaning});
        // console.log(this.props);

        this.props.onChange({value,meaning, record});
        this.onCancel();
        if(this.props.itemChange && typeof this.props.itemChange === "function"){
          this.props.itemChange({value,meaning, record});
        }
      }
    );

  }


  //取消
  onCancel(){
    this.props.form.resetFields();
    this.setState({visible: false,});
  }

  //查询后台函数
  query(url,params) {
    //Modified by Rex.Hua@20170719
    //根据渠道客户查询
    // if(JSON.parse(localStorage.user).userType = "CHANNEL"){
    //   params.channelId = JSON.parse(localStorage.user).relatedPartyId
    // }
    //End@20170719

    params.channelId = params.channelId || JSON.parse(localStorage.user).relatedPartyId;
    return request(url,{
      method: 'POST',
      headers: HTTP_HEADERS,
      body: JSON.stringify(params),
    });
  }

  //分页查询
  pageChange(pageInfo){
    let allValues = this.props.form.getFieldsValue();
    let values = {
      chineseName: allValues.chineseName || '',
      customerCode: allValues.customerCode || '',
    };
    for(let i in values){
      values[i] = values[i] == ''? null: values[i]
    }
    const params = this.props.params || {};
    for(let filed in params){
      values[filed] = params[filed];
    }
    const url = LOV_DATA + this.props.lovCode +'?page='+pageInfo.current+"&pageSize="+pageInfo.pageSize;
    this.query(url,values).then((data)=>{
      if(data.success){
        for(let i = 0; i< data.rows.length; i++){
          data.rows[i].key = i;
        }
        this.setState({lovData:data});
      }
    });
  }

  //清除
  clear(){
    this.props.form.resetFields();
    this.search();
  }

  //数据格式化
  createLov(){
   const lov = this.state.lov;
   let conditionFields = [],columns = [], configs = {};
   for(let i in lov.lovItems){
     const lovItem = lov.lovItems[i];
     //生成表格
     if(lovItem.gridField === 'Y'){
       const temp = {
         title: lovItem.display,
         dataIndex: lovItem.gridFieldName,
         key: lovItem.gridFieldName,
         className:styles.text_center,
       }
       columns.push(temp);
     }
     //生成搜索框
     if(lovItem.conditionField === 'Y'){
       const temp = {
         fieldName: lovItem.gridFieldName,
         display: lovItem.display,
       }
       conditionFields.push(temp);
     }
   }

   configs.conditionFields = conditionFields || [];
   configs.columns = columns || [];
   return configs;
  }

  handleAdd() {
    this.setState( {addVisible:true,} );
  }
  //验证手机号
  checkPhone(rule, value, callback){
    let preCode = this.props.form.getFieldValue('phoneCode')
    let regex = /^\d{11}$/, msg='手机号位数不正确(大陆地区为11位)';

    if( preCode ==='00852' || preCode ==='00853' ){
      regex = /^\d{8}$/;
      msg='手机号位数不正确(港澳地区为8位)';
    }else if(preCode ==='00886' ){
      regex = /^\d{9}$/;
      msg='手机号位数不正确(台湾地区为9位)';
    }

    if ( value && !regex.test(value)  ) {
      if(typeof callback === 'function') {
        callback(msg);
      }
    } else {
      if(typeof callback === 'function') {
        callback();
      }
    }
  }

  handleReset (value){
    if(value){
      this.props.form.resetFields(['phone']) ;
    }
  }
  handleCancel (e) {
    this.setState({
      addVisible: false,
    });
  }

  //提交客户
  submit(){
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let identityNumber = values.identityNumber || '';
        if(identityNumber){
          identityNumber = identityNumber + '';
          if(identityNumber.length == 18){
            const idNum = identityNumber.substring(6, 14);
            if(/^[0-9]*$/.test(idNum)){
              let birthDate = moment(idNum).format('YYYY-MM-DD');
              values.birthDate = birthDate;
            }
          }
        }
        values.__status = 'add';
        service.submitCustomer(values).then((data) =>{
          if(data.success){
            this.props.form.resetFields();
            this.setState({addVisible: false,});

            const record = data.rows[0] || {};
            record.addStatus = "add";       //为了好判断它是否是新增的客户
            const value = record.customerId;
            const meaning = record.chineseName;
            this.setState(
              Object.assign({}, {record},{value},{meaning}),() => {
                this.props.onChange({value,meaning, record});
                this.onCancel();
                if(this.props.itemChange && typeof this.props.itemChange === "function"){
                  this.props.itemChange({value,meaning, record});
                }
              }
            );
          }else{
            Modals.error({content:data.message});
          }
        });
      }
    })
  }

  //清空输入框
  emitEmpty(){
    this.lovInput.focus();
    this.setState({ value: '' ,meaning: ''});
    this.props.onChange({ value: '' ,meaning: ''});
  }

  render(){
    const {getFieldDecorator} = this.props.form;
    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: '86',
    })(
      <CodeOption codeList={this.state.code.phoneCodeList} width={100} onChange={this.handleReset.bind(this)}/>
    );
    const lov = this.state.lov;
    let modal = null;
    if(lov && lov.lovId){
      const configs = this.createLov();
      const conditionFields = configs.conditionFields, columns = configs.columns;
      modal = <Modal
        width = {lov.width && this.props.config ? lov.width : '836px'}
        style = {{height:lov.height && this.props.config ? lov.height : 350,top:30}}
        visible = {this.state.visible}
        closable = {true}
        maskClosable = {false}
        onOk = {this.search.bind(this)}
        onCancel = {this.onCancel.bind(this)}
        footer = {null}
      >
        <div style={{float:'left',width:'100%',margin:'0 0 1% 0',padding:'18px 0 0 0',borderColor:JSON.parse(localStorage.theme).themeColor,borderStyle:'solid',borderWidth:'1px',marginTop:'33px'}}>
          <div style={{float:'left',width:'80%'}}>
            <Form className={styles.form_sty}>
              {
                conditionFields.length &&
                conditionFields.map((item)=>{
                  const fieldName = item.fieldName;
                  return(
                    <FormItem key={item.fieldName} label={item.display} {...formItemLayout} style={{marginBottom:'8px'}}>
                      {getFieldDecorator(''+fieldName+'')(
                        <Input type="text"/>
                      )}
                    </FormItem>
                  );
                })
              }
            </Form>
          </div>

            <div style={{float:'left',width:'15%'}}>
              {
                conditionFields.length &&
                <div>
                  <Button onClick={this.search.bind(this)} type="primary" style={{width:100,float:'right',height:'40px'}} size="large" >查询</Button>
                  <Button onClick={this.clear.bind(this)} type="default" style={{width: 100,float:'right',height:'40px',margin:'10px 0'}} size="large" >全部</Button>
                </div>
              }
            </div>
          </div>



        <div style={{marginTop:'20px',clear:'both'}}>
          <Button type='default' style={{ width:'80px',height:'38px',marginBottom:'5px'}}  onClick={this.handleAdd.bind(this)}>添加</Button>
          <Table
            columns={columns}
            dataSource={this.state.lovData.rows || []}
            onRowClick={this.onRowClick.bind(this)}
            bordered
            size="small"
            scroll={{y:false}}
            onChange={this.pageChange.bind(this)}
            pagination={{
              showSizeChanger: false,
              pageSizeOptions: ['5','10','20','50'],
              pageSize: 10,
              total: this.state.lovData.total || 0,
            }}
            />
        </div>
      </Modal>
    }

    let suffix = <Icon type="search" onClick={this.lovOpen.bind(this)} style={{fontSize:12, color:'#9D9D90', cursor:'pointer'}}/>;
    if(this.props.suffix && !this.props.disabled) {
      suffix = this.state.meaning ?
        <Icon type="close-circle" onClick={this.emitEmpty.bind(this)} style={{fontSize:12, color:'#9D9D90', cursor:'pointer'}}/> :
        <Icon type="search" onClick={this.lovOpen.bind(this)} style={{fontSize:12, cursor:'pointer'}}/>;
    }

    return(
      <div>
        <Input
          readOnly
          disabled = {this.props.disabled}
          size= {this.props.size || ""}
          style={{width:this.props.width || '100%'} }
          placeholder={ this.props.placeholder || lov.placeholder || 'Lov搜索'}
          onClick={this.lovOpen.bind(this)}
          onFocus={this.inputFocus}
          value={this.state.meaning}
          suffix={suffix}
          ref={node => this.lovInput = node}
          //onSearch={this.lovOpen.bind(this)}
        />
        {modal}

        <Modal
          title="添加客户"
          visible = {this.state.addVisible}
          onCancel={this.handleCancel.bind(this)}
          footer={[
            <Button key="back" type='default' style={{ width:'80px',height:'38px'}}  onClick={this.handleCancel.bind(this)}>取消</Button>,
            <Button key="submit" type='primary' style={{ width:'80px',height:'38px'}} onClick={this.submit.bind(this)} >
              保存
            </Button>,
          ]}
        >
          <Form className={styles.form_sty}>
            <div className={styles.phonecheck_content}>
              <FormItem {...formItemLayout} label="中文姓名"  >
                {getFieldDecorator('chineseName', {
                  rules: [
                    {required:true,message:'请输入中文姓名'},
                    {pattern:/^[A-Z\u4e00-\u9fa5\uF900-\uFAD9\u3400-\u4DB5\u0020]*$/, message:'请输入汉字、大写英文字母或空格'},
                  ],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="联系电话" >
                {getFieldDecorator('phone', {
                  rules: [{
                    required: true, message: '联系电话必输',
                  },{
                    validator: this.checkPhone.bind(this),
                  }],
                })(
                  <Input addonBefore={prefixSelector} style={{width:'100%'}}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="身份证号" className={styles.formitem_sty} >
                {getFieldDecorator('identityNumber', {
                  rules: [
                    {required:true,message:'身份证号必输'},
                    // {pattern:/^[A-Za-z0-9\(\)]+$/,message:'请输入数字、字母或者英文括号'},
                  ],
                })(
                  <Input />
                )}
              </FormItem>
            </div>


          </Form>
        </Modal>
      </div>
    );
  }


}

export default Form.create()(CustomerLov);
