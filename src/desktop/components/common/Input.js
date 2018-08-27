/**
 * Created by Kitty on 2017/6/28.
 */
import React from 'react';
import { Input } from 'antd';

/**
 * 组件使用说明：
 *  1、参数说明
 *     (1)value string 组件的值，非必输
 *     (2)onchange(value) function 组件的chang事件
 */

//数字输入框
export class NumberInput extends React.Component {
  onChange = (e) => {
    const { value } = e.target;
    let reg = /^-?[1-9,0-9]*$/;
    if ((!isNaN(parseFloat(value)) && reg.test(value)) || value === '' || value === '-') {
      this.props.onChange(value);
    }
  };
  render() {
    return (
      <Input {...this.props}
        onChange={this.onChange}
      />
    );
  }
}

//数字输入框（小数）
export class NumbericeInput extends React.Component {
  onChange = (e) => {
    const { value } = e.target;
    let reg = /^-?(0|[1-9,0-9]*)(\.[0-9,]*)?$/;
    if ((!isNaN(parseFloat(value)) && reg.test(value)) || value === '' || value === '-') {
      this.props.onChange(value);
    }
  };
  render() {
    return (
      <Input {...this.props}
        onChange={this.onChange}
      />
    );
  }
}

//数字字幕输入框
export class NumberLetterInput extends React.Component {
  onChange = (e) => {
    const { value } = e.target;
    const reg = /^[A-Za-z0-9]*$/;
    if (reg.test(value) || value === '' || value === '-') {
      this.props.onChange(value);
    }
  };
  render() {
    return (
      <Input {...this.props}
             onChange={this.onChange}
      />
    );
  }
}
