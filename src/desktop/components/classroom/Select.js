import React, { Component, PropTypes } from 'react';
import { Form, Select as AntSelect } from 'antd';
import isEmpty from 'lodash/isEmpty';
import styles from '../../styles/classroom.css';

const FormItem = Form.Item;
const Option = AntSelect.Option;

class Select extends Component {
  componentDidMount() {
  }
  render() {
    const {
      style,
      placeholder,
      dataSource,
      form,
      name,
    } = this.props;
    const {
      getFieldDecorator,
    } = form;
    const options = [];
    const mainStyle = Object.assign({}, {
      width: 100,
    }, style);
    if (!isEmpty(dataSource)) {
      dataSource.map((data) => {
        options.push(<Option key={data.value} value={`${data.value}`}>{data.description}</Option>);
      });
    }
    return (
      <FormItem style={{ marginRight: 10 }}>
        {getFieldDecorator(name)(
          <AntSelect className={styles.select} placeholder={placeholder} allowClear style={mainStyle} >{options}</AntSelect>)}
      </FormItem>
    );
  }
}

Select.propTypes = {
  dataSource: PropTypes.array,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  name: PropTypes.string.isRequired,
};

Select.defaultProps = {
  style: {},
};

export default Select;
