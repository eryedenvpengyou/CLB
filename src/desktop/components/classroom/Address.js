import React, { Component, PropTypes } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Form, Input, Row, Col, Select } from 'antd';
import style from '../../styles/classroom.css';

const FormItem = Form.Item;
const Option = Select.Option;

class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countriesData: this.props.countries,
      provincesData: (isEmpty(this.props.countries)) ? this.props.provinces : [],
      citiesData: (isEmpty(this.props.provinces)) ? this.props.cities : [],
    };

    [
      'render',
    ].forEach(method => this[method] = this[method].bind(this));
  }
  componentWillReceiveProps(nextProps) {
    if (isEmpty(this.state.countriesData) && isEmpty(this.state.provincesData)) {
      this.setState({
        countriesData: nextProps.countries,
        provincesData: (isEmpty(nextProps.countries)) ? nextProps.provinces : [],
        citiesData: (isEmpty(nextProps.provinces)) ? nextProps.cities : [],
      });
    }
  }

  handleOnChange(value) {
    const data = [];
    if (value && !isEmpty(this.$this.props[this.childType])) {
      this.$this.props[this.childType].map((item) => {
        if (item.parentValue && item.parentValue === value) {
          data.push(item);
        }
      });
    }

    if (this.$this.props.form.getFieldValue(this.$this.props.citiesName) !== value) {
      this.$this.props.form.setFieldsValue({ [this.$this.props.citiesName]: '' });
    }

    if (isEmpty(data)) {
      const d = {};
      d[this.$this.props[`${this.childType}Name`]] = '';
      this.$this.props.form.setFieldsValue(d);
    }
    const temp = {};
    temp[`${this.childType}Data`] = data;
    this.$this.setState(temp);
  }

  render() {
    const {
      label,
      countries,
      provinces,
      cities,
      form,
      countriesName,
      provincesName,
      citiesName,
      required,
    } = this.props;
    const {
      countriesData,
      provincesData,
      citiesData,
    } = this.state;
    const {
      getFieldDecorator,
      getFieldValue,
    } = form;
    const countriesOptions = [];
    const provincesOptions = [];
    const citiesOptions = [];

    if (!isEmpty(countriesData)) {
      countriesData.map((item) => {
        countriesOptions.push(
          <Option key={item.value} value={item.value}>
            {item.description}
          </Option>);
      });
    }
    if (!isEmpty(provincesData)) {
      provincesData.map((item) => {
        provincesOptions.push(
          <Option key={item.value} value={item.value}>
            {item.description}
          </Option>);
      });
    }
    if (!isEmpty(citiesData)) {
      citiesData.map((item) => {
        citiesOptions.push(
          <Option key={item.value} value={item.value}>
            {item.description}
          </Option>);
      });
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 10 },
      },
    };
    return (
      <FormItem className={`${required ? style['form-item-require'] : ''}`} {...formItemLayout} label={label} hasFeedback>
        {
          !isEmpty(countries) ? (
            <Col span={6} style={{ marginRight: 8 }}>
              <FormItem>
                {getFieldDecorator(countriesName, {
                  rules: required ? [{ required: true, message: '请选择省国家', whitespace: true, type: 'string' }] : [],
                })(
                  <Select
                    placeholder="国家" onChange={this.handleOnChange.bind({ $this: this, childType: 'provinces' })} allowClear
                  >
                    {countriesOptions}
                  </Select>,
                )}
              </FormItem>
            </Col>) : ''
        }
        {
          !isEmpty(provinces) ? (
            <Col span={6} style={{ marginRight: 8 }}>
              <FormItem>
                {getFieldDecorator(provincesName, {
                  rules: required ? [{ required: true, message: '请选择省', whitespace: true, type: 'string' }] : [],
                })(
                  <Select
                    placeholder="省" onChange={this.handleOnChange.bind({ $this: this, childType: 'cities' })} allowClear
                  >
                    {provincesOptions}
                  </Select>,
                )}
              </FormItem>
            </Col>) : ''
        }
        {
          !isEmpty(cities) ? (
            <Col span={6} style={{ marginRight: 8 }}>
              <FormItem >
                {getFieldDecorator(citiesName, {
                  rules: required ? [{ required: true, message: '请选择市', whitespace: true, type: 'string' }] : [],
                })(<Select
                  placeholder="市" allowClear
                >
                  {citiesOptions}
                </Select>,
                )}
              </FormItem>
            </Col>) : ''
        }
      </FormItem>
    );
  }
}

Address.propTypes = {
  countries: PropTypes.array,
  provinces: PropTypes.array,
  cities: PropTypes.array,
  label: PropTypes.string,
  countriesName: PropTypes.string,
  provincesName: PropTypes.string,
  citiesName: PropTypes.string,
};

Address.defaultProps = {
  countries: [],
  provinces: [],
  cities: [],
  label: [],
};

export default Address;
