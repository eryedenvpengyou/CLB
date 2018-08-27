import React, { Component, PropTypes } from 'react';
import { DatePicker, Table, Input, Popconfirm } from 'antd';
import { isEmpty, round, isNumber } from 'lodash';
import moment from 'moment';

const RangePicker = DatePicker.RangePicker;

class EditableCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      editable: this.props.editable || false,
    };

    [
      'render',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }

    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') {
        this.props.onChange(this.state.value);
      } else if (nextProps.status === 'cancel') {
        this.setState({ value: this.cacheValue });
        this.props.onChange(this.cacheValue);
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
           nextState.value !== this.state.value;
  }

  handleChange(val, type) {
    let value;
    switch (type) {
      case 'DatePicker':
        value = val ? moment(val) : '';
        break;
      case 'InputNumber':
        value = isNumber(val) ? round(val, 2) : '0%';
        break;
      default:
        value = val.toString() || {};
    }
    this.setState({ value });
  }
  render() {
    const { editable } = this.state;
    let { value } = this.state;
    const { children, type } = this.props;
    let renderStr = '';

    switch (type) {
      case 'DatePicker':
        renderStr = !isEmpty(value) ? moment(value).format('YYYY/MM/DD') : ' '; // 日期组件format
        value = value ? moment(value) : '';
        break;
      case 'InputNumber':
        renderStr = isNumber(value) ? `${round(value, 2)}%` : '0%';
        break;
      default:
        renderStr = value.toString() || {};
    }
    return (
      <div>
        {
          editable ?
            <div>
              {
                React.Children.map(children, (child, i) =>
                  React.cloneElement(child, { // props.children继承父级属性
                    key: i,
                    placeholder: renderStr,
                    onChange: e => this.handleChange(e, type),
                  }),
                )
              }
            </div>
            :
            <div className="editable-row-text">
              {renderStr}
            </div>
        }
      </div>
    );
  }
}

EditableCell.propTypes = {
  children: PropTypes.node,
};

export default EditableCell;
