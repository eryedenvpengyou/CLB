/**
 * Created by FengWanJun on 2017/6/9.
 *
 * 使用说明：
 * 1、参数说明：
 *    （1）type：string 控件类型，InputNumber/DatePicker/Input/Select/Cascader/NumberInput/NumbericeInput/NumberLetterInput/Checkbox
 *    （2）index：number 用于控件命名
 *    （3）name：string 控件名称
 *    （4）valueList：当type=Select/Cascader，下拉列表的值
 *    （5）value：string 控件的值
 *    （6）isRequired：Boolean 控件是否必输
 *    （7）format: string 当type=DatePicher，时间控件的值的格式，YYYY-MM-DD / YYYY-MM-DD HH:mm / YYYY-MM-DD HH:mm:ss
 *    （8）onChange： function 返回表格行数据rowData
 *    （9）rowData：表格的行数据
 * 2、使用可以参考债券预约界面（components/ProductionSubscribeZQ）
 */

import React from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Checkbox, Cascader } from 'antd';
import { NumberInput, NumbericeInput, NumberLetterInput } from "./Input";
import moment from "moment";

class TableCellEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.inputValue,
      meaning: this.props.inputValue,
      DatePickerOpen: false,
      rowData: this.props.rowData,
    };
  }
  edit() {
    document.getElementById("value_"+this.props.name+'_'+this.props.index).style.display = 'none';
    document.getElementById("input_"+this.props.name+'_'+this.props.index).style.display = 'block';
    //让输入控件获取光标
    if (document.getElementById(this.props.name+'_'+this.props.index)) {
      document.getElementById(this.props.name+'_'+this.props.index).focus();
    } else {
      if (document.getElementById('input_'+this.props.name+'_'+this.props.index).getElementsByTagName('input').length > 0) {
        document.getElementById('input_'+this.props.name+'_'+this.props.index).getElementsByTagName('input')[0].focus();
        document.getElementById('input_'+this.props.name+'_'+this.props.index).getElementsByTagName('input')[0].click();
      } else if (document.getElementById('input_'+this.props.name+'_'+this.props.index).getElementsByClassName('ant-select').length > 0) {
        document.getElementById('input_'+this.props.name+'_'+this.props.index).getElementsByClassName('ant-select')[0].click();
      }
    }
  };
  showValue() {
    document.getElementById("value_"+this.props.name+'_'+this.props.index).style.display = 'block';
    document.getElementById("input_"+this.props.name+'_'+this.props.index).style.display = 'none';
  }
  handleChange(value) {
    this.props.form.validateFieldsAndScroll((err, values) => {
      //判断是否必输
      if (err) {
        if (value) {
          document.getElementById('input_'+this.props.name+'_'+this.props.index).children[1].style.display = 'none';
        } else {
          if (this.props.rowData) {
            this.props.rowData[this.props.name] = null;
            if (this.props.rowData.__status != 'update') {
              var flag = true;
              for (var i in this.props.rowData) {
                if (this.props.rowData[i] && i != 'key' && i != '__status') {
                  flag = false;
                }
              }
              if (flag) {
                this.props.rowData.__status = null;
              }
            }
          }
          document.getElementById('input_'+this.props.name+'_'+this.props.index).children[1].style.display = 'block';
          return;
        }
      } else {
        if (!value && this.props.rowData) {
          this.props.rowData[this.props.name] = null;
          if (this.props.rowData.__status != 'update') {
            var flag = true;
            for (var i in this.props.rowData) {
              if (this.props.rowData[i] && i != 'key' && i != '__status') {
                flag = false;
              }
            }
            if (flag) {
              this.props.rowData.__status = null;
            }
          }
          document.getElementById('input_'+this.props.name+'_'+this.props.index).children[1].style.display = 'block';
          return;
        }
        document.getElementById('input_'+this.props.name+'_'+this.props.index).children[1].style.display = 'none';
      }

      let meaning = "";
      if (this.props.type == "DatePicker") {//时间选择器
        meaning = value = value.format(this.props.format||'YYYY-MM-DD');
      } else if (this.props.type == "MonthPicker") {//时间选择器
        meaning = value = value.format(this.props.format||'YYYY-MM');
      } else if (this.props.type == "Select") {//下拉列表
        this.props.valueList.map((code) => {
          if (value == code.value) {
            value = code.value;
            meaning = code.meaning;
            return;
          }
        });
      } else if (this.props.type=='InputNumber' || this.props.type=='NumberInput' || this.props.type=='NumbericeInput') {
        meaning = value = parseFloat(this.props.form.getFieldValue(this.props.name+'_'+this.props.index).replace(/,/g,''));
      }  else {
        meaning = value = this.props.form.getFieldValue(this.props.name+'_'+this.props.index);
      }
      if (value) {
        //把value存储到table的dataSource中
        if (this.props.rowData) {
          this.props.rowData[this.props.name] = value;
          if (this.props.rowData.__status != 'update') {
            this.props.rowData["__status"] = 'add';
          }
        }
        if (this.props.onChange && typeof this.props.onChange == "function") {
          this.props.onChange(this.props.rowData,(data)=> {
            if (this.props.type == "DatePicker") {//时间选择器
              meaning = value = moment(this.props.rowData[this.props.name]);
            } else if (this.props.type == "MonthPicker") {//时间选择器
              meaning = value = moment(this.props.rowData[this.props.name]);
            } else if (this.props.type == "Select") {//下拉列表
              this.props.valueList.map((code) => {
                if (this.props.rowData[this.props.name] == code.value) {
                  value = code.value;
                  meaning = code.meaning;
                  return;
                }
              });
            } else {
              meaning = value = this.props.rowData[this.props.name];
            }
            if (!value && this.props.rowData) {
              this.props.rowData[this.props.name] = null;
              if (this.props.rowData.__status != 'update') {
                var flag = true;
                for (var i in this.props.rowData) {
                  if (this.props.rowData[i] && i != 'key' && i != '__status') {
                    flag = false;
                  }
                }
                if (flag) {
                  this.props.rowData.__status = null;
                }
              }
            }
          });
        }
        if (this.props.type=='InputNumber' || this.props.type=='NumberInput' || this.props.type=='NumbericeInput') {
          this.props.rowData[this.props.name] = parseFloat(this.props.rowData[this.props.name].replace(/,/g,''));
        }
      } else {
        if (this.props.rowData) {
          this.props.rowData[this.props.name] = null;
          if (this.props.rowData.__status != 'update') {
            var flag = true;
            for (var i in this.props.rowData) {
              if (this.props.rowData[i] && i != 'key' && i != '__status') {
                flag = false;
              }
            }
            if (flag) {
              this.props.rowData.__status = null;
            }
          }
        }
      }
      this.setState({
        value,
        meaning,
      });
      document.getElementById("value_"+this.props.name+'_'+this.props.index).style.display = 'block';
      document.getElementById("input_"+this.props.name+'_'+this.props.index).style.display = 'none';
    });
  }
  handleOpenChange(open) {
    this.setState({
      DatePickerOpen: open
    });
  }
  componentWillMount() {
    if (this.props.type == "Select" && this.props.inputValue) {//下拉列表
      this.props.valueList.map((code) => {
        if (this.props.inputValue == code.value) {
          this.setState({
            value: code.value,
            meaning: code.meaning
          });
          return;
        }
      });
    }
  }
  componentDidMount() {
    if (this.props.type == "Checkbox") {//复选框
      document.getElementById("value_"+this.props.name+'_'+this.props.index).style.display = 'none';
      document.getElementById("input_"+this.props.name+'_'+this.props.index).style.display = 'block';
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { type, name, index, valueList, isRequired, mode, validator } = this.props;
    let format = this.props.format || 'YYYY-MM-DD';
    if (type == "DatePicker" && this.props.inputValue) {
      format = this.props.format || 'YYYY-MM-DD';
      this.state.value = moment(this.props.inputValue,format);
      this.state.meaning = this.state.value.format(format)
    } else if (type == "MonthPicker" && this.props.inputValue) {
      format = this.props.format || 'YYYY-MM';
      this.state.value = moment(this.props.inputValue,format);
      this.state.meaning = this.state.value.format(format)
    } else if ((type == 'NumberInput' || type == 'NumbericeInput') && this.props.inputValue) {
      this.state.value = parseFloat(this.props.inputValue.replace(/,/g,'')).toString();
    }
    const { value, meaning, DatePickerOpen } = this.state;
    let rules = [];
    if (isRequired) {
      rules = [{
        required:true,message:'必输',whitespace:true,
      }]
      if (type == 'DatePicker' || type == 'MonthPicker') {
        rules = [{
          required:true,message:'必输',type:'object',whitespace:true,
        }]
      } else if (type == 'InputNumber') {
        rules = [{
          required:true,message:'必输',type:'number',whitespace:true,
        }]
      } else if (mode == 'multiple' && type == 'Select') {
        rules = [{
          required:true,message:'必输',type:'array',whitespace:true,
        }]
      }
    }
    if (validator && typeof validator == 'function') {
      rules.push({
        validator: (rule,value,callback) => {
          validator(rule,value,callback);
        }
      })
    }
    return (
      <div onClick={this.edit.bind(this)}>
        <div id={"input_"+name+'_'+index} onBlur={this.showValue.bind(this)} style={{display: 'none'}}>
          <Form.Item>
          {
              getFieldDecorator(name+'_'+index, {
                initialValue: value,
                rules,
                onChange: this.props.type=='DatePicker'||this.props.type=='MonthPicker'?this.handleChange.bind(this):()=>{},
              })(
                type ?
                  type == "Input" ?
                    <Input {...this.props} onPressEnter={this.handleChange.bind(this)}
                           onBlur={this.handleChange.bind(this)} />
                    :
                    type == "DatePicker" ?
                      <DatePicker {...this.props} format={format} open={DatePickerOpen}
                                  onOpenChange={this.handleOpenChange.bind(this)} />
                      :
                      type == "MonthPicker" ?
                        <DatePicker.MonthPicker {...this.props} format={format} open={DatePickerOpen}
                                    onOpenChange={this.handleOpenChange.bind(this)} />
                        :
                        type == "InputNumber" ?
                          <InputNumber {...this.props} onPressEnter={this.handleChange.bind(this)}
                                      onBlur={this.handleChange.bind(this)} />
                          :
                          type == "Select" ?
                            <Select {...this.props} onBlur={this.handleChange.bind(this)}
                                    onChange={this.handleChange.bind(this)}>
                              {
                                valueList.map((code) => {
                                  return <Select.Option key={code.value}>{code.meaning}</Select.Option>
                                })
                              }
                            </Select>
                            :
                            type == "Checkbox" ?
                              <Checkbox {...this.props} />
                              :
                              type == "Cascader" ?
                                <Cascader {...this.props} options={this.props.valueList}
                                          onBlur={this.handleChange.bind(this)}
                                          onChange={this.handleChange.bind(this)} />
                                :
                                type == "NumbericeInput" ?
                                  <NumbericeInput {...this.props} onPressEnter={this.handleChange.bind(this)}
                                                  onBlur={this.handleChange.bind(this)} />
                                  :
                                  type == "NumberLetterInput" ?
                                    <NumberLetterInput {...this.props} onPressEnter={this.handleChange.bind(this)}
                                                      onBlur={this.handleChange.bind(this)}/>
                                    :
                                    type == "NumberInput" ?
                                      <NumberInput {...this.props} onPressEnter={this.handleChange.bind(this)}
                                                  onBlur={this.handleChange.bind(this)} />
                                      :
                                      <Input {...this.props} onPressEnter={this.handleChange.bind(this)}
                                            onBlur={this.handleChange.bind(this)} />
                  :
                  <Input {...this.props} onPressEnter={this.handleChange.bind(this)}
                         onBlur={this.handleChange.bind(this)} />
              )
          }
          </Form.Item>
          <div className="ant-form-explain" style={{display:'none',color:'red'}}>必输</div>
        </div>
        <div id={"value_"+name+'_'+index} style={{display: 'block'}}>
          {meaning || <span style={{width: '100%', visibility: 'hidden'}}>编辑</span>}
        </div>
      </div>
    );
  }
}

export default Form.create()(TableCellEditor)
