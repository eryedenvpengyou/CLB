import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Table } from 'antd';
import TableCellEditor from '../common/TableCellEditor';
import { manager, fetchTeamMemberCommission as fetchCommission } from '../../services/channel';
import EditableCell from './EditableCell';
import style from '../../styles/channelTeam.css';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 18 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 20,
      offset: 0,
    },
    sm: {
      span: 18,
      offset: 4,
    },
  },
};

class TeamManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [], // [{key:1,userName:'2',start:'',end:''}],
      error: false,
      loading: false,
      newKey: this.props.channel.recordManage.channelId,
    };
  }

  componentDidMount() {
    if (isEmpty(this.state.dataSource) && !isEmpty(this.props.channel.recordManage) && this.props.channel.recordManage.channelId) {
      this.fetchData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('channel' in nextProps && 'recordManage' in nextProps.channel && isEmpty(this.state.dataSource) && this.props.channel.recordManage.channelId) {
      this.fetchData();
      /* this.setState({
        dataSource: [this.assignData(nextProps.channel.recordManage)], // [this.assignData(nextProps.channel.recordManage)],
      }); */
    }
    // console.log([this.assignData(nextProps.channel.recordManage)]);
  }

  fetchData(paramsData = {}) {

    const params = paramsData;
    const user = JSON.parse(localStorage.user);
    const dataSource = this.state.dataSource;
    params.channelId = this.props.channel.recordManage.channelId;
    params.partyId = user.relatedPartyId;
    this.setState({
      loading: true,
      params,
    });
    fetchCommission(params)
     .then((data) => {
       const d = data;
       d.rows.map((rowData, i) => {
         rowData.key = i + 1;
         dataSource.push(this.assignData(rowData));
       });

       this.setState({
         loading: false,
         dataSource,
       });
     });
  }

  // 取消
  handleCancel = () => {
    this.props.dispatch({
      type: 'channel/manageModalSave',
      payload: { manageModal: false },
    });
  }

  // 表单重置
  handleReset = () => {
    this.props.form.resetFields();
  }

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        manager(values).then((data) => {

        });
      } else {
        Modal.error({
          title: '提交失败！',
          content: '请正确填写完相关信息',
        });
      }
    });
  }

  addCeil() {
    const dataSource = this.state.dataSource;
    const length = dataSource.length;
    const delta = 24 * 3600 * 1000;
    if (length > 0) {
      const last = dataSource[length - 1];
      const newData = {
        key: last.key + 1,
        commission: '',
        orderEffectiveDateFrom: last.orderEffectiveDateTo.value,
        orderEffectiveDateTo: '',
      };
      dataSource.push(this.assignData(newData));
    }
    dataSource[length - 1].orderEffectiveDateTo.value = (dataSource[length - 1].orderEffectiveDateTo.value) ? moment(dataSource[length - 1].orderEffectiveDateTo.value._d.getTime() - delta) : '';
    this.setState({ dataSource });
  }


  checkNumber = (rule, value, callback) => {
    if (value && value > 0) {
      callback();
      return;
    }
    callback('请输入大于0的数字');
  }

  handleChange(key, index, value) {
    const { dataSource } = this.state;
    if (dataSource[index][key].status === 'save' && key === 'orderEffectiveDateTo' && new Date(moment(value).format('YYYY-MM-DD')).getTime() <= new Date(moment(dataSource[index].orderEffectiveDateFrom.value).format('YYYY-MM-DD')).getTime()) {
      this.edit(index);
      Modal.error({
        title: '有效期开始时间不能晚于结束时间',
      });
      return;
    }
    dataSource[index][key].value = value;
    this.setState({ dataSource });
  }

  edit(index) {
    const { dataSource } = this.state;
    Object.keys(dataSource[index]).forEach((item) => {
      if (dataSource[index][item] && typeof dataSource[index][item].editable !== 'undefined') {
        dataSource[index][item].editable = true;
      }
    });
    this.setState({ dataSource });
  }

  editDone(index, type) {
    const { dataSource } = this.state;
    Object.keys(dataSource[index]).forEach((item) => {
      if (dataSource[index][item] && typeof dataSource[index][item].editable !== 'undefined') {
        dataSource[index][item].editable = false;
        dataSource[index][item].status = type;
      }
    });
    this.setState({ dataSource }, () => {
      Object.keys(dataSource[index]).forEach((item) => {
        if (dataSource[index][item] && typeof dataSource[index][item].editable !== 'undefined') {
          delete dataSource[index][item].status;
        }
      });
    });
  }

  assignData(data) {
    const result = {};
    Object.keys(data).forEach((item) => {
      if ((item === 'rate' || item === 'orderEffectiveDateFrom' || item === 'orderEffectiveDateTo')) {
        result[item] = {};
        result[item].editable = false;
        result[item].value = data[item] ? data[item] : '';
      } else {
        result[item] = data[item] ? data[item] : '';
      }
    });
    return result;
  }

  renderColumns(data, index, key, text, children, type) {
    const { editable, status } = data[index][key] || {};
    if (typeof editable === 'undefined') {
      return text;
    }
    return (<EditableCell
      editable={editable}
      value={text}
      onChange={value => this.handleChange(key, index, value)}
      type={type}
      status={status}
    >
      {children}
    </EditableCell>
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const data = [];
    const {
      dataSource,
      newKey,
    } = this.state;
    const columns = [{
      title: '序号',
      dataIndex: 'key',
      render: (text, record, index) => {
        // 索引从零开始，所以第一行为index+1，index为render方法里面的参数，可自动获取到下标，在ant design里面有详情解释，可参考
        return <span>{index + 1}</span>;
      },
    }, {
      title: '佣金分成%',
      dataIndex: 'rate',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'rate', text ? (text.value * 100) : 0, <InputNumber min={0} max={100} placeholder="请输入不超过100的数字" step={0.01} />, 'InputNumber'),
    }, {
      title: '有效期自',
      dataIndex: 'orderEffectiveDateFrom',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'orderEffectiveDateFrom', text ? text.value : '',
        <DatePicker
          format="YYYY-MM-DD"
        />,
        'DatePicker',
      ),
    }, {
      title: '有效期至',
      dataIndex: 'orderEffectiveDateTo',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'orderEffectiveDateTo', text ? text.value : '',
        <DatePicker
          format="YYYY-MM-DD"
        />,
        'DatePicker',
      ),
    }, {
      title: '操作',
      dataIndex: 'operate',
      render: (text, record, index) => {
        const { editable } = dataSource[index].rate || false;
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => this.editDone(index, 'save')} style={{ marginRight: 5 }}>完成</a>
                  <Popconfirm title="取消编辑?" onConfirm={() => this.editDone(index, 'cancel')}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                :
                <span>
                  <a onClick={() => this.edit(index)} style={{ marginRight: 5 }}>编辑</a>
                  <a onClick={() => this.addCeil()}>新增</a>
                </span>
            }
          </div>
        );
      },
    }];


    return (
      <Modal
        wrapClassName={`${style.channel}`}
        width={1000}
        visible={this.props.channel.manageModal}
        title="管理"
        onCancel={this.handleCancel}
        footer={null}
        key={newKey}
      >
        <div >
          <Form>
            <FormItem
              {...formItemLayout}
              label="用户名"
            >
              {getFieldDecorator('userName', {
                initialValue: this.props.channel.recordManage ? this.props.channel.recordManage.userName : '',
              })(
                <Input disabled />,
                  )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="渠道名称"
            >
              {getFieldDecorator('channelName', {
                initialValue: this.props.channel.recordManage ? this.props.channel.recordManage.channelName : '',
              })(
                <Input disabled />,
                  )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="计划书额度"
            >
              {getFieldDecorator('planeNum', {
                initialValue: this.props.channel.recordManage ? this.props.channel.recordManage.planeNum : '',
              })(
                <Input disabled />,
                  )}
            </FormItem>
            <FormItem {...formItemLayout} label="佣金分成" >
              <Table columns={columns} dataSource={this.state.dataSource} size="small" pagination={false} />
            </FormItem>

            <FormItem {...formItemLayout} label="账号状态" >
              {getFieldDecorator('status', {
                initialValue: this.props.channel.recordManage ? this.props.channel.recordManage.userStatus : '',
                rules: [{ required: true, message: '请选择', whitespace: true }],
              })(
                <Select
                  showSearch
                  placeholder="账号状态"
                  optionFilterProp="children"
                >
                  <Option value="ACTV">有效</Option>
                  <Option value="EXPR">过期</Option>
                  <Option value="LOCK">锁定</Option>
                  <Option value="VACATION">休假中</Option>
                  <Option value="INACTIVE">未激活</Option>
                </Select>,
                  )}
            </FormItem>
            <FormItem {...tailFormItemLayout} >
              <Row gutter={24}>
                <Col span={10}>
                  <Button type="default" style={{ width: 120,height: 40 }} onClick={this.handleCancel}>取消</Button>
                </Col>
                <Col span={4} />
                <Col span={10}>
                  <Button type="primary" style={{ width: 120,height: 40 }} htmlType="submit" onClick={this.handleSubmit}>保存</Button>
                </Col>
              </Row>
            </FormItem>

          </Form>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(TeamManage);
