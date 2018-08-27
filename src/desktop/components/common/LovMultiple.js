/**
 * created by FengWanJun at 2017/7/9
 *
 * 通用LovMultiple组件 使用说明
 * 1、使用方式：
 *      使用方式与在 HAp中的使用方式基本一致！传入 必输参数 lovCode （即在后台hap中定义的 lovCode）即可。
 *
 * 2、输入参数
 *      目前该组件配置了 4 个输入参数，其中包括1个必输 参数 和 3 个可选参数，3个可选参数中包括一个函数：
 *      --lovCode（必输）{}: lov编码，即在后台（hap)中定义的 LovMultiple 编码。
 *      --config（可选）boolean： 是否 使用 后台中配置的 LovMultiple 样式（主要包括 lov弹出框的大小，是否居中等样式暂时还无法启用）,默认为 false
 *      --onSave(data) （必输） fnction ：返回选中的行数据
 *      --params （可选） {} : 自定义查询 时需要用到的参数 集 ，例如 ，以下是在 hap 中的使用：
 *          $("#hkBank").kendoLov($.extend(${lovProvider.getLov(base.contextPath, base.locale, "PUB_CODE_VALUE")}, {
              query: function(e) {
                e.param['codeName'] = "PUB.HK_BANK";
              },
            }));
        则在 这个 组件中 params 参数的值为 ： params ={codeName:'PUB.HK_BANK'}
        不过这里有个bug ：比如在 lov定义中的sql 包含这种信息时，sct.lang = #{request.locale,jdbcType=VARCHAR}  ,这时候查询会不正常
 *
 * 3、输出参数
 *      selectedRows : LovMultiple 组件的值，即你需要的那个值
 *
 * 4、使用说明
 *       <LovMultiple lovCode='LOV_UNIT' onSave={this.onSave}/>
 *
 * 5、使用示例
 *      请参照债券预约界面（components/ProductionSubscribeZQ）
 */

 import {Table, Icon,Button,Input,DatePicker,Form,Select,Modal} from 'antd';
 import request from '../../utils/request';
 import {HTTP_HEADERS} from '../../constants';
 import * as styles from '../../styles/qa.css';

 const FormItem = Form.Item;
 const Option = Select.Option;

 const LOV_CONFIG = '/api/commons/lov/config';
 const LOV_DATA = '/api/commons/lov/';

//form 布局
 const formItemLayout = {
   labelCol: {
     xs: { span: 24 },
     sm: { span: 6 },
   },
   wrapperCol: {
     xs: { span: 24 },
     sm: { span: 14 },
   },
 };

class Lov extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
      visible: false,     //弹出框
      lov:{},             //lov配置
      lovData: [],        //表格数据
      selectedRowKeys: [],
      selectedRows: [],
    };
  }
  //组件渲染之前
  componentWillMount() {
    if(this.props.lovCode){
      this.query(LOV_CONFIG,{code: this.props.lovCode}).then((data)=>{
        if(data.success && data.rows.length > 0){
          //字段显示排序
          data.rows[0].lovItems.sort(this.sortBy("gridFieldSequence"));
          this.setState({lov:data.rows[0]});
       }
     });
    }
  }
  //数组排序
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
   let values = this.props.form.getFieldsValue();
   for(let i in values){
     values[i] = values[i] == ''? null: values[i]
   }
   const params = this.props.params || {};
   for(let filed in params){
     values[filed] = params[filed];
   }
   this.query(LOV_DATA+this.props.lovCode+"?page=1&pigesize=10",values).then((data)=>{
     if(data.success){
       for(let i = 0; i< data.rows.length; i++){
         data.rows[i].key = i;
       }
       this.setState({
         lovData:data.rows,
         pagination: {current:1,pageSize:10,total:data.total}
        });
     }
   });
  }
  //保存
  onSave(data) {
    this.props.form.resetFields();
    this.props.onSave(data);
    this.setState({
      visible: false,
    });
  }
  //取消
  onCancel(){
    this.props.form.resetFields();
    this.setState({visible: false,});
  }
  //清除
  clear(){
    this.props.form.resetFields();
    this.search();
  }
  //显示模态框
  showModal() {
    if (this.props.lovClick && typeof this.props.lovClick == 'function') {
      if (this.props.lovClick()) {
        this.search();
        this.setState({
          visible: true,
        });
      }
    } else {
      this.search();
      this.setState({
        visible: true,
      });
    }
  };
  //查询后台函数
  query(url,params) {
    return request(url,{
      method: 'POST',
      headers: HTTP_HEADERS,
      body: JSON.stringify(params),
    });
  }
  //分页查询
  pageChange(pageInfo) {
    let values = this.props.form.getFieldsValue();
    for (let i in values) {
      values[i] = values[i] == '' ? null : values[i];
    }
    const params = this.props.params || {};
    for (let filed in params) {
      values[filed] = params[filed];
    }
    const url = LOV_DATA + this.props.lovCode +'?page='+pageInfo.current+"&pagesize="+pageInfo.pageSize;
    this.query(url,values).then((data)=>{
      if (data.success) {
        for (let i = 0; i < data.rows.length; i++) {
          data.rows[i].key = (pageInfo.current-1)*pageInfo.pageSize+i;
        }
        this.setState({
          lovData: data.rows,
          pagination: {
            current: pageInfo.current,
            pageSize: pageInfo.pageSize,
            total: data.total,
          },
        });
      }
    });
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
  render(){
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedRowKeys,
          selectedRows: selectedRows
        });
      }
    };
    const {getFieldDecorator} = this.props.form;
    const lov = this.state.lov;
    let modal = null;
    if(lov && lov.lovId){
      const configs = this.createLov();
      const conditionFields = configs.conditionFields, columns = configs.columns;
      modal = <Modal
        title = {lov.title && this.props.config ? lov.title : this.props.title||'lov查询'}
        width={lov.width && this.props.config ? lov.width : '836px'}
        style={{height:lov.height && this.props.config ? lov.height : 350,top:30}}
        visible={this.state.visible}
        closable={true}
        maskClosable={false}
        onOk={this.search.bind(this)}
        onCancel={this.onCancel.bind(this)}
        footer={null}
      >
        <div style={{float:'left',width:'100%',margin:'0 0 1% 0',padding:'12px 0 0 0',borderWidth:'1px',borderStyle:'solid',borderColor:JSON.parse(localStorage.theme).themeColor}}>
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
                <Button onClick={this.search.bind(this)} type="primary" style={{width: 100,float:'right',height:'40px'}} size="large">查询</Button>
                <Button onClick={this.clear.bind(this)} type="default" style={{width: 100,float:'right',height:'40px',margin:'10px 0'}} size="large">全部</Button>
              </div>
            }
          </div>
        </div>
        <div style={{float:'right',width:'15%',marginRight:'5%'}}>
          <Button style={{width:100,float:'right',height:'40px'}} size="large" type="primary" onClick={this.onSave.bind(this, this.state.selectedRows)}>
            保存
          </Button>
        </div>
        <div style={{paddingTop:'10px',clear:'both'}}>
          <Table
            className={styles.commons}
            columns={columns}
            rowSelection={rowSelection}
            dataSource={this.state.lovData}
            bordered size="small" scroll={{y:false}}
            onChange={this.pageChange.bind(this)}
            pagination={this.state.pagination} />
        </div>
      </Modal>
    }


    return(
      <div>
        <span onClick={this.showModal.bind(this)}>
        {
          this.props.children ?
            this.props.children
            :
            <Button type="primary">添加</Button>
        }
        </span>
        {modal}
      </div>
    );
  }


//end of class
}

Lov = Form.create()(Lov);
export default Lov;
