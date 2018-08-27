/*
 * view 评价弹窗
 * @author:Lijun
 * @version:20170706
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Icon, Input, Rate, Row, Layout, Modal } from 'antd';
import { isEmpty } from 'lodash';
import { submitEvaluationData as submit } from '../../services/classroom.js';
import style from '../../styles/classroom.css';
import TipModal from './Modal';

const { Content } = Layout;
const FormItem = Form.Item;

class EvaluationPopupComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      active: (this.props.rowData.evaluateFlag !== 'Y'),
      data: {
        courseContent: 0,
        courseUsability: 0,
        courseEnvironment: 0,
        lecturerPresentation: 0,
        lecturerProfessional: 0,
        lecturerAppetency: 0,
      },
    };

    [
      'render',
      'handleShowModal',
      'handleOk',
      'handleCancel',
      'handleSubmit',
    ].forEach(method => this[method] = this[method].bind(this));
  }

  handleShowModal() {
    if (this.state.active) {
      this.setState({
        visible: true,
      });
    }
  }

  handleOk() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 1000);
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  handleChange(value) {
    const data = this.$this.state.data;
    data[this.name] = value;
    this.$this.setState({ data });
  }

  handleSubmit() {
    const { data } = this.state;
    const formData = this.props.form.getFieldsValue();
    const user = JSON.parse(localStorage.user);
    const param = {};

    param.courseContent = data.courseContent;
    param.courseUsability = data.courseUsability;
    param.courseEnvironment = data.courseEnvironment;
    param.lecturerPresentation = data.lecturerPresentation;
    param.lecturerProfessional = data.lecturerProfessional;
    param.lecturerAppetency = data.lecturerAppetency;
    param.evaluateContent = formData.evaluateContent;
    param.channelId = user.relatedPartyId;
    param.courseId = this.props.rowData.courseId;
    param.phoneCode = user.phoneCode;
    if (isEmpty(user.phone)) {
      TipModal.error({
        content: '提交失败！手机号不能为空',
        isOk: true,
      });
      return;
    }
    param.mobile = user.phone;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        submit(param).then((res) => {
          if (res.success) {
            TipModal.success({
              content: '提交成功！',
              isOk: true,
              handleOk: () => {
                this.handleCancel();
                this.props.form.resetFields();
              },
            });
            this.setState({
              active: false,
            });
          } else {
            TipModal.error({
              content: `提交失败！请联系系统管理员,${data.message || ''}`,
              isOk: true,
            });
          }
          this.setState({
            loading: false,
          });
        });
      } else {
        TipModal.error({
          content: `提交失败！请联系系统管理员,${data.message || ''}`,
          isOk: true,
        });
      }
    });
  }

  desc = {
    1: '非常差',
    2: '差',
    3: '一般',
    4: '好',
    5: '非常好',
  }

  render() {
    const {
      data,
      loading,
      visible,
      active,
    } = this.state;

    const { getFieldDecorator } = this.props.form;
    return (
      <div className={style['evaluation-popup']}>
        <Button className={`${style.blank} ${style.btn} ${style.apply}`}  disabled={!active} onClick={this.handleShowModal} size="large">
          {active ? '评价' : '已评价'}
        </Button>
        <Modal
          wrapClassName={style.classroom}
          visible={visible}
          title={null}
          onOK={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width={900}
        >
          <Row>
            <span className={style['title-bar']}>课程评价</span>
            <hr style={{ marginTop: 28 }} />
          </Row>
          <Layout
            className={`${style['evaluation-popup-modal']} ${style.container} ${style['background-white']}`}
          >
            <Row style={{ marginTop: 16 }}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Row><i className={`${style.icon} ${style['icon-info']} ${style.left}`} /><h4 className={`${style.title}`}>课程评价</h4></Row>
                <ul className={style['rates-container']}>
                  <li className={style.child}>
                    <span className={style.title}>内容</span>
                    <Rate className={style.rate} onChange={this.handleChange.bind({ name: 'courseContent', $this: this })} value={data.courseContent} />
                    {<span className="ant-rate-text">{this.desc[parseInt(data.courseContent, 0)]}</span>}
                  </li>
                  <li className={style.child}>
                    <span className={style.title}>适用性</span>
                    <Rate className={style.rate} onChange={this.handleChange.bind({ name: 'courseUsability', $this: this })} value={data.courseUsability} />
                    {<span className="ant-rate-text">{this.desc[parseInt(data.courseUsability, 0)]}</span>}
                  </li>
                  <li className={style.child}>
                    <span className={style.title}>环境</span>
                    <Rate className={style.rate} onChange={this.handleChange.bind({ name: 'courseEnvironment', $this: this })} value={data.courseEnvironment} />
                    {<span className="ant-rate-text">{this.desc[parseInt(data.courseEnvironment, 0)]}</span>}
                  </li>
                </ul>
              </Col>
              <Col xs={12} sm={12} md={8} lg={12} xl={12}>
                <Row><i className={`${style.icon} ${style['icon-people']} ${style.left}`} /><h4 className={style.title}>讲师评价</h4></Row>
                <ul className={style['rates-container']}>
                  <li className={style.child}>
                    <span className={style.title}>表达能力</span>
                    <Rate className={style.rate} onChange={this.handleChange.bind({ name: 'lecturerPresentation', $this: this })} value={data.lecturerPresentation} />
                    {<span className="ant-rate-text">{this.desc[parseInt(data.lecturerPresentation, 0)]}</span>}
                  </li>
                  <li className={style.child}>
                    <span className={style.title}>专业度</span>
                    <Rate className={style.rate} onChange={this.handleChange.bind({ name: 'lecturerProfessional', $this: this })} value={data.lecturerProfessional} />
                    {<span className="ant-rate-text">{this.desc[parseInt(data.lecturerProfessional, 0)]}</span>}
                  </li>
                  <li className={style.child}>
                    <span className={style.title}>亲和力</span>
                    <Rate className={style.rate} onChange={this.handleChange.bind({ name: 'lecturerAppetency', $this: this })} value={data.lecturerAppetency} />
                    {<span className="ant-rate-text">{this.desc[parseInt(data.lecturerAppetency, 0)]}</span>}
                  </li>
                </ul>
              </Col>
              <div className={style.clear} />
              <Row>
                <Form >
                  <Row style={{ padding: 16, marginLeft: 16 }}>
                    <span className={`${style.title} ${style.left}`}>学习感受</span>
                    <FormItem>
                      {getFieldDecorator('evaluateContent')(<textarea id="" cols="100" rows="5" />)}
                    </FormItem>
                  </Row>
                  <Row style={{ textAlign: 'center' }}>
                    <FormItem>
                      <Button
                        type="default"
                        className={`${style.btn} ${style.submit}`}
                        htmlType="submit" style={{ display: 'inline-block'}}
                        onClick={this.handleSubmit}
                        loading={loading}
                      >
                        <span style={{color:'#fff'}}>发布</span>
                      </Button>
                    </FormItem>
                  </Row>
                </Form>
              </Row>
            </Row>
          </Layout>
        </Modal>
      </div>
    );
  }
}

const EvaluationPopup = Form.create()(EvaluationPopupComponent);

export default EvaluationPopup;
