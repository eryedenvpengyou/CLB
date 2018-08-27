/**
 * wanjun.feng@hand-china.com
 * 2017/5/4
 */

import React from 'react';
import { Row, Col, Form } from 'antd';
import { ordOrderSubmit, ordCustomerSubmit } from '../../services/production';
import TipModal from "../common/modal/Modal";
import ProductionSubscribeHSYDComponent from "./ProductionSubscribeFW_HSYD";
import ProductionSubscribeHPVComponent from "./ProductionSubscribeFW_HPV";
import ProductionSubscribeJDYDComponent from "./ProductionSubscribeFW_JDYD";
import ProductionSubscribeTTQZComponent from "./ProductionSubscribeFW_TTQZ";
import ProductionSubscribeZCFWComponent from "./ProductionSubscribeFW_ZCFW";
import ProductionSubscribeYHKHComponent from "./ProductionSubscribeFW_YHKH";

class ProductionSubscribeComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  //页面返回
  goBack() {
    window.history.back();
  }
  //确认预约
  handleSubmit(tableList, e) {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let orderBody = values;
        //客户姓名和ID
        if (values.applicantCustomer) {
          orderBody.applicantCustomerId = values.applicantCustomer.record.customerId;
        }
        //订单
        orderBody.orderType = "VALUEADD";
        orderBody.__status = "add";
        orderBody.status = 'DATA_APPROVING';
        //预约时间
        orderBody.reserveDate = new Date(orderBody.reserveDate);
        orderBody.signDate = orderBody.reserveDate = orderBody.reserveDate.getFullYear() + '-'+ (orderBody.reserveDate.getMonth()+1)+'-'+orderBody.reserveDate.getDate()+ " " +
                                orderBody.reserveDate.getHours() + ":" + orderBody.reserveDate.getMinutes() + ":" + "00";
        if (values.orderNumber.record) {
          orderBody.orderId = values.orderNumber.record.orderId;
        } else {
          orderBody.orderNumber = null;
        }
        orderBody.orderNumber = null;
        //价格
        if (this.props.midClass == 'HPV') {
          orderBody.price = parseFloat(orderBody.price);
        }
        if (tableList && tableList.length > 0) {
          //L签客信息
          orderBody.ordTeamVisitor = tableList[0];
        }
        //提交按钮disabled
        if (document.getElementById("submitBtn")) {
          document.getElementById("submitBtn").disabled = true;
        }
        //预约信息提交
        ordOrderSubmit([orderBody]).then((orderData) => {
          if (orderData.success) {
            let customerBody = orderBody;
            customerBody.orderIds = [];
            orderData.rows.map((row) => {
              customerBody.orderIds.push(Number(row.orderId));
            });
            if (values.applicantCustomer) {
              orderBody.chineseName = values.applicantCustomer.record.chineseName;
            }
            ordCustomerSubmit([customerBody]).then((customerData) => {
              if (orderData.success) {
                TipModal.success({content:"预约提交成功！预约资料已提交，请耐心等待审核！"});
                this.goBack();
              } else {
                TipModal.error({content:"预约提交失败："+orderData.message});
              }
            });
          } else {
            TipModal.error({content:"预约提交失败："+orderData.message});
          }
        });
      }
    });
  }
  render() {
    return (
      <Form>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ borderBottom: '1px solid #dbdbdb', paddingBottom: '28px', textAlign: 'center', fontSize: '1.5em'}}>
            预约资料填写
          </Col>
        </Row>
          {
            this.props.midClass == 'ZCFW' ?
              <ProductionSubscribeZCFWComponent itemId={this.props.itemId} form={this.props.form} onCancel={this.goBack.bind(this)} onConfirm={this.handleSubmit.bind(this)} />
              :
              this.props.midClass == 'HSYD' ?
                <ProductionSubscribeHSYDComponent itemId={this.props.itemId} form={this.props.form} onCancel={this.goBack.bind(this)} onConfirm={this.handleSubmit.bind(this)} />
                :
                this.props.midClass == 'TTQZ' ?
                  <ProductionSubscribeTTQZComponent itemId={this.props.itemId} form={this.props.form} onCancel={this.goBack.bind(this)} onConfirm={this.handleSubmit.bind(this)} />
                  :
                  this.props.midClass == 'HPV' ?
                    <ProductionSubscribeHPVComponent itemId={this.props.itemId} form={this.props.form} onCancel={this.goBack.bind(this)} onConfirm={this.handleSubmit.bind(this)} />
                    :
                    this.props.midClass == 'JDYD' ?
                      <ProductionSubscribeJDYDComponent itemId={this.props.itemId} form={this.props.form} onCancel={this.goBack.bind(this)} onConfirm={this.handleSubmit.bind(this)} />
                      :
                      this.props.midClass == 'YHKH' ?
                        <ProductionSubscribeYHKHComponent itemId={this.props.itemId} form={this.props.form} onCancel={this.goBack.bind(this)} onConfirm={this.handleSubmit.bind(this)} />
                        :
                        ""
          }
      </Form>
    )
  }
}

export default Form.create()(ProductionSubscribeComponent);
