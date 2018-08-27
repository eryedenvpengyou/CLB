/*
 * show 课程评价
 * @author:zhouting
 * @version:20170526
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Row, Breadcrumb, Modal, Rate } from 'antd';
import { routerRedux } from 'dva/router';
import { isEmpty } from 'lodash';
import { submitEvaluationData as submit } from '../../services/classroom.js';
import style from '../../styles/classroom.css';

class CourseEvaluationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
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
      'handleSubmit',
    ].forEach(method => this[method] = this[method].bind(this));
  }


  handleChange(value) {
    const data = this.$this.state.data;
    data[this.name] = value;
    this.$this.setState({ data });
  }

  handleSubmit() {
    const { data } = this.state;
    const { itemId } = this.props;
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
    param.courseId = itemId;
    param.mobile = user.phone;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        submit(param).then((res) => {
          if (res.success) {
            Modal.success({
              title: '提交成功！',
              /* content: '提交成功！',*/
              onOk: () => {
                this.props.dispatch(routerRedux.push('/classroom/course'));
                this.props.form.resetFields();
              },
            });
          } else {
            Modal.error({
              title: '提交失败！',
              content: res.message,
            });
          }
        });
      } else {
        Modal.error({
          title: '提交失败！',
          content: '请正确填写完相关信息',
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
    const { data } = this.state;
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item;
    return (
      <div className={style.main}>
        <Row>
          <Col xs={16} sm={16} md={16} lg={16} xl={16} offset={4}>
            <Row>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <Breadcrumb separator=">" style={{ margin: '20px 0' }}>
                  <Breadcrumb.Item>当前位置</Breadcrumb.Item>
                  <Breadcrumb.Item><a href="/#/portal/home">工作台</a></Breadcrumb.Item>
                  <Breadcrumb.Item><a href="/#/classroom/course">财课堂</a></Breadcrumb.Item>
                  <Breadcrumb.Item>课程评价</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
            <div style={{ backgroundColor: '#efefef', padding: 12 }}>
              <div className={style.finance}>
                <div>
                  <div className={style.communal}>
                    <span />
                    <span>课程评价</span>
                  </div>
                  <div className={style.evaluate}>
                    <div className={style.lf} style={{ marginLeft: '15%', width: '25%' }}>
                      <p>课程评价</p>
                      <ul style={{ marginLeft: '15%', marginTop: '5%' }}>
                        <li>
                          <span className={style.textL}>内容</span>
                          <Rate onChange={this.handleChange.bind({ name: 'courseContent', $this: this })} value={data.courseContent} />
                          {<span className="ant-rate-text">{this.desc[parseInt(data.courseContent, 0)]}</span>}
                        </li>
                        <li>
                          <span className={style.textL}>适用性</span>
                          <Rate onChange={this.handleChange.bind({ name: 'courseUsability', $this: this })} value={data.courseUsability} />
                          {<span className="ant-rate-text">{this.desc[parseInt(data.courseUsability, 0)]}</span>}
                        </li>
                        <li>
                          <span className={style.textL}>环境</span>
                          <Rate onChange={this.handleChange.bind({ name: 'courseEnvironment', $this: this })} value={data.courseEnvironment} />
                          {<span className="ant-rate-text">{this.desc[parseInt(data.courseEnvironment, 0)]}</span>}
                        </li>
                      </ul>
                    </div>
                    <div className={style.lf} style={{ marginLeft: '20%', width: '25%' }}>
                      <p>讲师评价</p>
                      <ul style={{ marginLeft: '15%', marginTop: '5%' }}>
                        <li>
                          <span className={style.textL}>表达能力</span>
                          <Rate onChange={this.handleChange.bind({ name: 'lecturerPresentation', $this: this })} value={data.lecturerPresentation} />
                          {<span className="ant-rate-text">{this.desc[parseInt(data.lecturerPresentation, 0)]}</span>}
                        </li>
                        <li>
                          <span className={style.textL}>专业度</span>
                          <Rate onChange={this.handleChange.bind({ name: 'lecturerProfessional', $this: this })} value={data.lecturerProfessional} />
                          {<span className="ant-rate-text">{this.desc[parseInt(data.lecturerProfessional, 0)]}</span>}
                        </li>
                        <li>
                          <span className={style.textL}>亲和力</span>
                          <Rate onChange={this.handleChange.bind({ name: 'lecturerAppetency', $this: this })} value={data.lecturerAppetency} />
                          {<span className="ant-rate-text">{this.desc[parseInt(data.lecturerAppetency, 0)]}</span>}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <Form>
                    <div style={{ textAlign: 'center' }}>
                      <FormItem>

                        <span style={{ verticalAlign: 'top', marginRight: '10px' }}>学习感受</span>
                        {getFieldDecorator('evaluateContent')(<textarea name="" id="" cols="80" rows="10" />)}

                      </FormItem>
                    </div>
                    <Col span={4} style={{ paddingLeft: '5', paddingRight: '0', height: '40' }}>
                      <Button type="default" style={{ float: 'right', backgroundColor: '#d1b97f', color: 'white' }} htmlType="submit" onClick={this.handleSubmit}>发布</Button>
                    </Col>
                  </Form>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
const CourseEvaluation = Form.create()(CourseEvaluationComponent);

export default connect()(CourseEvaluation);
