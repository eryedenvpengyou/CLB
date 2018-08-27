import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { isEmpty, round } from 'lodash';
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Table } from 'antd';
import { manager, fetchTeamMemberCommission as fetchCommission } from '../../services/channel';
import EditableCell from './EditableCell';
import style from '../../styles/channelTeam.css';

const FormItem = Form.Item;
const Option = Select.Option;

class TeamManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [], // form 数据集合
      error: false,
      loading: false, // button loading
      newKey: this.props.rowData.channelId, // 生成新的Modal（初始化）
      visible: false, // Modal显示/隐藏状态
      loading2: false, // 佣金表格loading
      disabled: false, // button是否禁用
    };
  }

  componentDidMount() {
  }

  /* componentWillReceiveProps(nextProps) {
    if ('channelId' in nextProps.rowData) {
      this.setState({ newKey: nextProps.rowData.channelId });

      if (isEmpty(this.state.dataSource)) {
        this.fetchData();
      }
    }
  }

  */

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.rowData.channelId !== this.state.newKey ||
           nextState.newKey !== this.state.newKey;
  }

  // 获取佣金数据
  fetchData(paramsData = {}) {
    const params = paramsData;
    const user = JSON.parse(localStorage.user);
    const dataSource = this.state.dataSource;
    params.channelId = this.props.rowData.channelId;
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

  // 显示Modal并初始化数据
  hanleleShow = () => {
    this.setState({ visible: true, dataSource: [], newKey: (this.state.newKey + 1) });
    this.fetchData();
  }

  // 取消
  handleCancel = () => {
    this.setState({ visible: false, dataSource: [] });
  }

  // 表单重置
  handleReset = () => {
    this.props.form.resetFields();
  }

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { rowData, form } = this.props;
    const user = JSON.parse(localStorage.user);
    form.validateFields((err, values) => {
      if (!err) {
        const dataSource = this.state.dataSource;
        const params = values;
        params.userId = rowData.userId;
        params.channelId = rowData.channelId;
        params.partyId = user.relatedPartyId;
        params.rateList = [];// this.state.dataSource;
        let count = 0;
        let count2 = 0;
        if (!isEmpty(dataSource)) {
          dataSource.map((n, i) => {
            const d = {};
            if (isEmpty(n.startDate.value) || isEmpty(n.endDate.value)) {
              this.edit(i);
              count += 1;
            }

            if (i + 1 < dataSource.length && !isEmpty(dataSource[i + 1].startDate.value) && !isEmpty(n.endDate.value) && moment(n.endDate.value).toDate().getTime() >= moment(dataSource[i + 1].startDate.value).toDate().getTime()) {
              this.edit(i);
              count2 += 1;
            }

            Object.keys(dataSource[i]).forEach((item) => {
              d[item] = item.indexOf('rate') >= 0 ? (dataSource[i][item].value !== null && dataSource[i][item].value !== undefined ? (Number(dataSource[i][item].value) > 1 ? round(dataSource[i][item].value / 100, 4) : dataSource[i][item].value) : 0) : dataSource[i][item].value;
            });

            d.startDate = n.startDate.value;
            d.endDate = n.endDate.value;
            d.channelRateId = n.channelRateId;
            d.channelContractId = i > 0 ? dataSource[0].channelContractId : n.channelContractId;
            params.rateList.push(d);
          });
        }
        if (count > 0) {
          Modal.error({
            title: '提交失败！',
            content: '佣金分成的有效期不能为空',
          });
          return;
        }

        if (count2 > 0) {
          Modal.error({
            title: '提交失败！',
            content: '佣金分成的有效期不能重叠”',
          });
          return;
        }
        this.setState({ loading2: true /* , dataSource: this.state.dataSource.map((n) => { this.assignData(n); }) */ });
        manager(params).then((data) => {
          if (data.success) {
            this.setState({
              visible: false,
              dataSource: [],
            });
            Modal.success({
              title: '提交成功！',
              onOk: () => this.props.updateData(),
            });
          } else {
            Modal.error({
              title: '提交失败！',
              content: data.message,
            });
          }
          this.setState({
            loading2: false,
          });
        });
      } else {
        Modal.error({
          title: '提交失败！',
          content: '请正确填写完相关信息',
        });
      }
    });
  }

  // 新增行
  addCeil() {
    const dataSource = this.state.dataSource;
    const length = dataSource.length;
    const delta = 24 * 3600 * 1000;
    this.cache = dataSource[length - 1];
    dataSource[length - 1] = {};
    this.setState({
      dataSource,
    });
    if (length > 0) {
      const last = this.cache;
      const newData = {
        key: last.key + 1,
        startDate: '',
        endDate: '',
      };
      for (let i = 1; i <= 10; i += 1) {
        newData[`rate${i}`] = 0; // 组装十年佣金
      }
      dataSource.push(this.assignData(newData));
    }
    // dataSource[length - 1].endDate = {};
    // dataSource[length - 1].endDate.value;
    this.cache.endDate.value = (this.cache.endDate.value) ? moment(moment(this.cache.endDate.value).toDate().getTime() - delta).format('YYYY-MM-DD') : '';
    dataSource[length - 1] = this.cache;
    this.setState({ dataSource });
  }

  handleChange(key, index, value) {
    const { dataSource } = this.state;
    if (dataSource[index][key].status === 'save' && key === 'endDate' && new Date(moment(value).format('YYYY-MM-DD')).getTime() <= new Date(moment(dataSource[index].startDate.value).format('YYYY-MM-DD')).getTime()) {
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
    this.setState({ disabled: true });
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
    let count = 0;
    dataSource.map((n) => {
      if (n.rate1.editable) {
        count += 1;
      }
    });

    if (count === 0) {
      this.setState({ disabled: false });
    }
  }

  assignData(data) {
    const result = {};
    Object.keys(data).forEach((item) => {
      if ((item.indexOf('rate') >= 0 || item === 'startDate' || item === 'endDate')) {
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
    const { rowData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const data = [];
    const {
      dataSource,
      newKey,
      visible,
      loading,
      loading2,
      disabled,
    } = this.state;

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

    const columns = [{
      title: '序号',
      dataIndex: 'key',
      render: (text, record, index) => {
        // 索引从零开始，所以第一行为index+1，index为render方法里面的参数，可自动获取到下标，在ant design里面有详情解释，可参考
        return <span>{index + 1}</span>;
      },
    }, {
      title: '第一年',
      dataIndex: 'rate1',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'rate1', text ? (text.value * 100) : '',
        <InputNumber min={0} max={100} className={style.inputn} placeholder="请输入不超过100的数字" step={0.01} />, 'InputNumber'),
    }, {
      title: '第二年',
      dataIndex: 'rate2',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'rate2', text ? (text.value * 100) : '',
        <InputNumber min={0} max={100} className={style.inputn} placeholder="请输入不超过100的数字" step={0.01} />, 'InputNumber'),
    }, {
      title: '第三年',
      dataIndex: 'rate3',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'rate3', text ? (text.value * 100) : '',
        <InputNumber min={0} max={100} className={style.inputn} placeholder="请输入不超过100的数字" step={0.01} />, 'InputNumber'),
    }, {
      title: '第四年',
      dataIndex: 'rate4',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'rate4', text ? (text.value * 100) : '',
        <InputNumber min={0} max={100} className={style.inputn} placeholder="请输入不超过100的数字" step={0.01} />, 'InputNumber'),
    }, {
      title: '第五年',
      dataIndex: 'rate5',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'rate5', text ? (text.value * 100) : '',
        <InputNumber min={0} max={100} className={style.inputn} placeholder="请输入不超过100的数字" step={0.01} />, 'InputNumber'),
    }, {
      title: '第六年',
      dataIndex: 'rate6',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'rate6', text ? (text.value * 100) : '',
        <InputNumber min={0} max={100} className={style.inputn} placeholder="请输入不超过100的数字" step={0.01} />, 'InputNumber'),
    }, {
      title: '第七年',
      dataIndex: 'rate7',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'rate7', text ? (text.value * 100) : '',
        <InputNumber min={0} max={100} className={style.inputn} placeholder="请输入不超过100的数字" step={0.01} />, 'InputNumber'),
    }, {
      title: '第八年',
      dataIndex: 'rate8',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'rate8', text ? (text.value * 100) : '',
        <InputNumber min={0} max={100} className={style.inputn} placeholder="请输入不超过100的数字" step={0.01} />, 'InputNumber'),
    }, {
      title: '第九年',
      dataIndex: 'rate9',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'rate9', text ? (text.value * 100) : '',
        <InputNumber min={0} max={100} className={style.inputn} placeholder="请输入不超过100的数字" step={0.01} />, 'InputNumber'),
    }, {
      title: '第十年',
      dataIndex: 'rate10',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'rate10', text ? (text.value * 100) : '',
        <InputNumber min={0} max={100} className={style.inputn} placeholder="请输入不超过100的数字" step={0.01} />, 'InputNumber'),
    }, {
      title: '有效期自',
      dataIndex: 'startDate',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'startDate', text ? text.value : '',
        <DatePicker
          format="YYYY-MM-DD"
        />,
        'DatePicker',
      ),
    }, {
      title: '有效期至',
      dataIndex: 'endDate',
      render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'endDate', text ? text.value : '',
        <DatePicker
          format="YYYY-MM-DD"
        />,
        'DatePicker',
      ),
    }, {
      title: '操作',
      dataIndex: 'operate',
      fixed: 'right',
      width: 100,
      render: (text, record, index) => {
        const { editable } = dataSource[index].rate1 || false;
        return (
          <div className="editable-row-operations" style={editable ? { lineHeight: '40px' } : {}}>
            {
              editable ?
                <span>
                  <a onClick={() => this.editDone(index, 'save')} style={{ marginRight: 5, color: 'rgb(209, 185, 127)' }}>完成</a>
                  <a onClick={() => this.editDone(index, 'cancel')} style={{ color: 'rgb(209, 185, 127)' }}>取消</a>

                  {/*<Popconfirm title="取消编辑?" onConfirm={() => this.editDone(index, 'cancel')}>*/}
                    {/*<a style={{ color: 'rgb(209, 185, 127)' }}>取消</a>*/}
                  {/*</Popconfirm>*/}
                </span>
                :
                <span>
                  <a onClick={() => this.edit(index)} style={{ marginRight: 5, color: 'rgb(209, 185, 127)' }}>编辑</a>
                  <a onClick={() => this.addCeil()} style={{ color: 'rgb(209, 185, 127)' }}>新增</a>
                </span>
            }
          </div>
        );
      },
    }];

    return (
      <div>
        <Button className={`${style.btn} ${style.blank} ${style['channel-btn-drop']}`} style={{ width: 94 }} onClick={this.hanleleShow}>管理</Button>
        <Modal
          wrapClassName={`${style.channel} ${style.modal}`}
          width={1000}
          visible={visible}
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
                  initialValue: rowData ? rowData.userName : '',
                })(
                  <Input disabled />,
                  )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="渠道名称"
              >
                {getFieldDecorator('channelName', {
                  initialValue: rowData ? rowData.channelName : '',
                })(
                  <Input disabled />,
                  )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="计划书额度"
              >
                {getFieldDecorator('planQuota', {
                  initialValue: rowData ? rowData.planQuota : '',
                })(
                  <Input disabled />,
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="佣金分成" required>
                <Table columns={columns} loading={loading} dataSource={this.state.dataSource} size="small" pagination={false} scroll={{ x: '300%' }} />
              </FormItem>

              <Row gutter={24}>
                <Col span={6} offset={4}>
                  <Button type="default" style={{ width: 120,height: 40 }} onClick={this.handleCancel}>取消</Button>
                </Col>
                <Col span={4} />
                <Col span={6} offset={4}>
                  <Button type="primary" style={{ width: 120,height: 40 }} disabled={disabled} onClick={this.handleSubmit} loading={loading2}>保存</Button>
                </Col>
              </Row>


            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

TeamManage.propTypes = {
  rowData: PropTypes.object,
};

export default Form.create()(TeamManage);
