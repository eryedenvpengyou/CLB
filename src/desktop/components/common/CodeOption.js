/**
 * created by xiaoyong.luo at 2017/06/21
 *
 * 为了书写方便，但在快码较多的界面 不请求多次
 *
 * 必输参数
 *    1、code : 快码值
 *
 * 可选参数
 *    1、 size  large small 默认large
 *    2、 placeholder 提示
 *    3、 showSearch 是否可搜索 默认关闭
 *    4、 width 宽度
 * @type {[type]}
 */


import {Select} from 'antd';
import request from '../../utils/request';
import {HTTP_HEADERS} from '../../constants';

const Option = Select.Option;

class CodeOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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


  render(){
    const codeList = this.props.codeList || [];
    let select = <Select
                  mode={this.props.mode || null}
                  size= {this.props.size || "large"}
                  style={{width:this.props.width || '100%',color:'#595959'} }
                  className={this.props.className || ''}
                  showSearch={this.props.showSearch || false}
                  placeholder={this.props.placeholder || '请选择'}
                  onChange={this.onChange}
                  disabled={this.props.disabled || false}
                  optionFilterProp={this.props.optionFilterProp || null}
                >
                  {
                    codeList &&
                    codeList.map((item)=>
                      <Option key={item.value} value={`${item.value}`}>{item.meaning}</Option>
                    )
                  }
                </Select>;

    if(this.state.value && this.state.value != ''){
      select = <Select
                  mode={this.props.mode || null}
                  size= {this.props.size || "large"}
                  style={{width:this.props.width || '100%',color:'#595959'} }
                  className={this.props.className || ''}
                  showSearch={this.props.showSearch || false}
                  placeholder={this.props.placeholder || '请选择'}
                  onChange={this.onChange}
                  value={this.state.value}
                  disabled={this.props.disabled || false}
                  optionFilterProp={this.props.optionFilterProp || null}
                >
                  {
                    codeList &&
                    codeList.map((item)=>
                      <Option key={item.value} value={`${item.value}`}>{item.meaning}</Option>
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


export default CodeOption;
