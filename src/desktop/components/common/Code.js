/**
 * created by xiaoyong.luo at 2017/06/21
 *
 * 必输参数
 *    1、code : 快码值
 *
 * 可选参数
 *    1、 size  large small 默认large
 *    2、 placeholder 提示(无效)
 *    3、 showSearch 是否可搜索 默认关闭
 *    4、 width 宽度
 * @type {[type]}
 */


import {Select} from 'antd';
import request from '../../utils/request';
import {HTTP_HEADERS} from '../../constants';

const Option = Select.Option;

class Code extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      codeList: [],                           //快码数据
      value: this.props.value || '',          //快码值
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value|| '';
      this.setState({value});
    }
  }

  onChange = (value) => {
    if (!('value' in this.props)) {
      this.setState({ value});
    }
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  //组件渲染之前
  componentWillMount() {
   if(this.props.code)
     this.query('/api/clb/common/clbCode',{codeList:this.props.code}).then((data)=>{
       this.setState({ codeList:JSON.parse(data).codeList });
     });
  }

  //查询后台函数
  query(url,params) {
    return request(url,{
      method: 'POST',
      headers: HTTP_HEADERS,
      body: JSON.stringify(params),
    });
  }


  render(){
    const codeList = this.state.codeList || [];
    console.log(this.props)

    let select = <Select
                  size= {this.props.size || "large"}
                  style={{width:this.props.width || '100%'} }
                  showSearch={this.props.showSearch || false}
                  placeholder={this.props.placeholder || '请选择'}
                  onChange={this.onChange}
                >
                  {
                    codeList &&
                    codeList.map((item)=>
                      <Option key={item.value} value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>;

    if(this.state.value && this.state.value != ''){
      select = <Select
                  size= {this.props.size || "large"}
                  style={{width:this.props.width || '100%'} }
                  showSearch={this.props.showSearch || false}
                  placeholder={this.props.placeholder || '请选择'}
                  onChange={this.onChange}
                  value={this.state.value}
                >
                  {
                    codeList &&
                    codeList.map((item)=>
                      <Option key={item.value} value={item.value}>{item.meaning}</Option>
                    )
                  }
                </Select>;
    }

    return(
      <div>
        {select}
      </div>
    );
  }

}


export default Code;
