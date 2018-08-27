import React, { Component, PropTypes } from 'react';
import { Form, Select as AntSelect } from 'antd';
import isEmpty from 'lodash/isEmpty';
import styles from '../../styles/database.css';

const FormItem = Form.Item;
const Option = AntSelect.Option;

class Select extends Component {
  componentDidMount() {
  }
  render() {
    //给组件定义属性
    const {
      style,
      placeholder,
      dataSource,
      form,
      name,
      initialValue,
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
    const initialValueProps = { initialValue };
    return (
      <FormItem style={{ marginRight: 16 }}>
        {getFieldDecorator(name, initialValueProps)(
          <AntSelect
            className={styles.select}
            placeholder={placeholder}
            allowClear style={mainStyle}
          >
            {options}
          </AntSelect>,
        )}
      </FormItem>
    );
  }
}
// 类名 属性类型默认值设置
Select.propTypes = {
  dataSource: PropTypes.array,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  name: PropTypes.string.isRequired,
};

// 属性默认值
Select.defaultProps = {
  style: {},
};

export default Select;
