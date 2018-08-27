import { Table, Input, Icon, Button, Modal,Form } from 'antd';
import * as styles from "../../styles/qa.css";
//import {Form} from "antd/lib/index";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class HotelTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      visible: false,
      value: '',
      meaning: '',
      search: false,
    };
  }
  search = () => {
    this.setState({search: true})
    let result = this.props.data.filter(item => item.sublineItemName.indexOf(this.props.form.getFieldValue("keyword")) >= 0)
    this.setState({dataSource: result.length > 0 ? result : []})

  }
  clear = () => {
    this.props.form.setFieldsValue({keyword: ''})
    this.setState({dataSource: this.props.data, search: false})
  }
  open = () => {
    if (this.props.disabled) return
    this.setState({visible:true})
  }
  onCancel(){
    this.setState({visible: false,});
  }
/*  onRowClick (record, index) {
    this.setState({meaning: record.sublineItemName, value: record.sublineId, visible: false})
    // this.props.onChange({value: record.sublineId,meaning: record.sublineItemName, record});
    this.props.onChange({value: record.sublineId,meaning: record.sublineItemName})
    this.props.hotelChange(record)
  }*/

  onRowClick(record, index){
    const value = record.sublineId;
    const meaning = record.sublineItemName;
    this.setState({meaning})
    this.setState(
      Object.assign({}, {record},{value},{meaning}),() => {
        this.props.onChange(meaning);
        this.onCancel();
        if(this.props.hotelChange && typeof this.props.hotelChange === "function"){
          this.props.hotelChange(record)
        }
      }
    );

  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const meaning = nextProps.value.meaning || ''
      const value = nextProps.value.value || ''
      this.setState({meaning,value})
    }
  }
  componentDidUpdate () {
    if (this.state.dataSource.length <= 0 && this.props.data && !this.state.search) {
      this.setState({dataSource: this.props.data})
    }
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const columns = [{
      title: '酒店名称',
      dataIndex: 'sublineItemName',
      width: '30%',
    }, {
      title: '酒店地址',
      dataIndex: 'comments',
    }, {
      title: '酒店价格',
      dataIndex: 'price',
    }];

    let modal = <Modal
      width = {'836px'}
      style = {{height: 350,top:100}}
      visible = {this.state.visible}
      closable = {true}
      maskClosable = {true}
      onOk = {this.search.bind(this)}
      onCancel = {this.onCancel.bind(this)}
      footer = {null}
    >
      <div style={{width:'100%',display: 'flex', justifyContent: 'space-between',margin:'0 0 1% 0',padding:'10px 20px',borderColor:JSON.parse(localStorage.theme).themeColor,borderStyle:'solid',borderWidth:'1px',marginTop:'33px'}}>
        <Form className={styles.form_sty}>
          {
            <Form.Item label='酒店名称' colon={false} {...formItemLayout} style={{height:'100%',display: 'flex',alignItems: 'center'}}>
              {getFieldDecorator('keyword')(
                <Input type="text" />
              )}
            </Form.Item>
          }
        </Form>
        <div style={{display: 'flex', alignItems: 'center', marginLeft: '10px'}}>
          <Button onClick={this.search.bind(this)} type="primary" style={{width:100,float:'right',height:'40px'}} size="large" >查询</Button>
          <Button onClick={this.clear.bind(this)} type="default" style={{width: 100,float:'right',height:'40px',marginLeft:'10px'}} size="large" >全部</Button>
        </div>
      </div>

      <div style={{marginTop:'20px',clear:'both'}}>
        <Table
          bordered
          columns={columns}
          dataSource={this.state.dataSource}
          onRowClick={this.onRowClick.bind(this)}
          rowKey='sublineId'
          size="small"
          scroll={{y:false}}
          // onChange={this.pageChange.bind(this)}
          pagination={{
            showSizeChanger: false,
            pageSizeOptions: ['5','10','20','50'],
            pageSize: 10,
            total: this.props.data && this.props.data.length || 0,
          }}
        />
      </div>
    </Modal>

    let suffix = <Icon type="search" onClick={this.open.bind(this)} style={{fontSize:12, color:'#9D9D90', cursor:'pointer'}}/>;
    return (
      <div>
        <Input
          readOnly
          disabled = {this.props.disabled}
          size= {this.props.size || "small"}
          style={{width:this.props.width || '100%'} }
          placeholder={ this.props.placeholder || '酒店名称'}
          onClick={this.open.bind(this)}
          value={this.props.meaning}
          suffix={suffix}
        />
        {modal}
      </div>
    );
  }
}

export default Form.create()(HotelTable)
