/**
 * created by xiaoyong.luo at 2017/06/21 21:27
 * 
 */
import React, { Component } from 'react';
import { Input,Icon  } from 'antd';

class TableCellEdit extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div style={{position: 'relative'}}>
        {
          editable ?
            <div style={{padding: '0 24px 0 5px'}}>
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                style={{position:'absolute', right: 0,top:15, width:20, cursor:'pointer',display: 'inline-block',}}
                onClick={this.check}
              />
            </div>
            :
            <div>
              {value || ' '}
              <Icon
                type="edit"
                style={{cursor:'pointer'}}
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}

export default TableCellEdit;
