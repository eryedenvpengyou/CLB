/**
 * wanjun.feng@hand-china.com
 * 2017/6/3
 */

import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Select, Icon, Table, Row } from 'antd';
import { queryReferralFee } from '../../services/production';
import { handleTableChange } from '../../utils/table';
import { sortCustom } from '../../utils/common';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import { getCode } from '../../services/code';
import TipModal from "../common/modal/Modal";

function byObj(name){
    return function(o, p){
      let a, b;
      if (typeof o === "object" && typeof p === "object" && o && p) {
        a = o[name];
        b = p[name];
        if (a === b) {
          return 0;
        }
        if (typeof a === typeof b) {
          return a < b ? -1 : 1;
        }
        return typeof a < typeof b ? -1 : 1;
      }else {
        throw ("error");
      }
    }
  }

class ProductionReferralFee extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      //供款期
      contributionPeriodList: [],
      //币种
      currencyList: [],
      //缴费方式
      payMethodList: [],
      dataList: [],
      body: {
        channelId: JSON.parse(localStorage.user).relatedPartyId,
        itemId: this.props.itemId,
        page: 1,
        pagesize: 99999,
        contributionPeriod: '',
        currency: '',
        payMethod: '',
      },
      //快码值
      codeList: {
        currencyList: [],
      },
    };
  }
  onScroll() {
    var e = document.getElementsByClassName('ant-table-body')[1];
    e.scrollTop = 100;
  }
  query() {
    const values = this.props.form.getFieldsValue();
    this.state.body.contributionPeriod = values.contributionPeriod;
    this.state.body.payMethod = values.payMethod;
    this.state.body.currency = values.currency;
    this.state.body.pagesize = 99999;
    this.state.body.page = 1;
    queryReferralFee(this.state.body).then((data) => {
      if (data.success) {
        data.rows.map((row, index) => {
          row.key = index;
        });
        this.setState({
          dataList: data.rows
        });
      } else {
        TipModal.error({content:data.message});
        return;
      }
    });
  }
  showModal() {
    this.setState({
      visible: true
    });
    //获取快码值
    var body = {
      currencyList: 'PUB.CURRENCY',
    };
    getCode(body).then((data)=>{
      this.setState({
        codeList: data,
      });
    });
    this.state.body = {
      page: 1,
      pagesize: 15,
      channelId: JSON.parse(localStorage.user).relatedPartyId,
      itemId: this.props.itemId,
    }
    queryReferralFee(this.state.body).then((data) => {
      if (data.success) {
        //供款期
        this.state.contributionPeriodList = [];
        //币种
        this.state.currencyList = [];
        //缴费方式
        this.state.payMethodList = [];
        data.rows.map((data,index) => {
          data.key = index;
          let flag = true;
          this.state.contributionPeriodList.map((item) => {
            if (item.sublineItemName == data.contributionPeriod) {
              flag = false;
              return;
            }
          });
          if (flag) {
            this.state.contributionPeriodList.push({sublineItemName:data.contributionPeriod});
          }
          if (this.state.currencyList.indexOf(data.currency) == -1) {
            this.state.currencyList.push(data.currency);
          }
          flag = true;
          this.state.payMethodList.map((item) => {
            if (item.way == data.payMethodName) {
              flag = false;
              return;
            }
          });
          if (flag) {
            this.state.payMethodList.push({value:data.payMethod,way:data.payMethodName});
          }
        });
        this.setState({
          contributionPeriodList: sortCustom(this.state.contributionPeriodList,'SUBLINE'),
          currencyList: this.state.currencyList,
          payMethodList: sortCustom(this.state.payMethodList,'PAYMETHOD'),
          dataList: data.rows,
        });
      } else {
        TipModal.error({content:data.message});
        return;
      }
    });
  };
  handleOk() {};
  handleCancel() {
    this.setState({ visible: false });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const contributionPeriodOptions = this.state.contributionPeriodList.map((contributionPeriod) => {
      return <Select.Option key={contributionPeriod.sublineItemName}>{contributionPeriod.sublineItemName}</Select.Option>;
    });
    const currencyOptions = this.state.currencyList.map((currency) => {
      let result = <Select.Option key={currency}>{currency}</Select.Option>;
      for (var i=0; i<this.state.codeList.currencyList.length; i++) {
        if (currency == this.state.codeList.currencyList[i].value) {
          result = <Select.Option key={this.state.codeList.currencyList[i].value}>{this.state.codeList.currencyList[i].meaning}</Select.Option>;
          break;
        }
      }
      return result;
    });
    const payMethodOptions = this.state.payMethodList.map((payMethod) => {
      return <Select.Option key={payMethod.value}>{payMethod.way}</Select.Option>
    });
    let sublineName = "子产品";
    if (this.props.bigClass == "BX") {
      sublineName = "供款期";
    }
    let columns = [{
      title: "供应商",
      key: "supplierName",
      dataIndex: "supplierName",
      width: 100,
      render: (text,record,index) => {
        return "供应商"+(index+1)
      }
    },{
      title: sublineName,
      key: "contributionPeriod",
      dataIndex: "contributionPeriod",
      width: 100,
    },{
      title: "币种",
      key: "currency",
      dataIndex: "currency",
      width: 100,
      render: (text,render,index) => {
        let result = text;
        this.state.codeList.currencyList.map((code) => {
          if (text == code.value) {
            result = code.meaning;
          }
        });
        return result;
      }
    },{
      title: "缴费方式",
      key: "payMethodName",
      dataIndex: "payMethodName",
      width: 100,
    }];
    if (this.props.bigClass == "BX") {
      columns.push({
        title: "投保年龄",
        key: "policyholdersAge",
        dataIndex: "policyholdersAge",
        width: 100,
        render: (text, record, index) => {
          return record.policyholdersMinAge + " - " + record.policyholdersMaxAge + "岁";
        },
      });
    }
    columns.push({
      title: "第一年",
      key: "theFirstYear",
      dataIndex: "theFirstYear",
      width: 100,
      render: (text, record, index) => {
        if (!text) {
          return "0.00%";
        } else {
          return (text*100).toFixed(2)+'%';
        }
      }
    });
    if (this.props.bigClass == "BX") {
      columns.push({
        title: "第二年",
        key: "theSecondYear",
        dataIndex: "theSecondYear",
        width: 100,
        render: (text, record, index) => {
          if (!text) {
            return "0.00%";
          } else {
            return (text*100).toFixed(2)+'%';
          }
        }
      },{
        title: "第三年",
        key: "theThirdYear",
        dataIndex: "theThirdYear",
        width: 100,
        render: (text, record, index) => {
          if (!text) {
            return "0.00%";
          } else {
            return (text*100).toFixed(2)+'%';
          }
        }
      },{
        title: "第四年",
        key: "theFourthYear",
        dataIndex: "theFourthYear",
        width: 100,
        render: (text, record, index) => {
          if (!text) {
            return "0.00%";
          } else {
            return (text*100).toFixed(2)+'%';
          }
        }
      },{
        title: "第五年",
        key: "theFifthYear",
        dataIndex: "theFifthYear",
        width: 100,
        render: (text, record, index) => {
          if (!text) {
            return "0.00%";
          } else {
            return (text*100).toFixed(2)+'%';
          }
        }
      },{
        title: "第六年",
        key: "theSixthYear",
        dataIndex: "theSixthYear",
        width: 100,
        render: (text, record, index) => {
          if (!text) {
            return "0.00%";
          } else {
            return (text*100).toFixed(2)+'%';
          }
        }
      },{
        title: "第七年",
        key: "theSeventhYear",
        dataIndex: "theSeventhYear",
        width: 100,
        render: (text, record, index) => {
          if (!text) {
            return "0.00%";
          } else {
            return (text*100).toFixed(2)+'%';
          }
        }
      },{
        title: "第八年",
        key: "theEightYear",
        dataIndex: "theEightYear",
        width: 100,
        render: (text, record, index) => {
          if (!text) {
            return "0.00%";
          } else {
            return (text*100).toFixed(2)+'%';
          }
        }
      },{
        title: "第九年",
        key: "theNinthYear",
        dataIndex: "theNinthYear",
        width: 100,
        render: (text, record, index) => {
          if (!text) {
            return "0.00%";
          } else {
            return (text*100).toFixed(2)+'%';
          }
        }
      },{
        title: "第十年",
        key: "theTenthYear",
        dataIndex: "theTenthYear",
        width: 100,
        render: (text, record, index) => {
          if (!text) {
            return "0.00%";
          } else {
            return (text*100).toFixed(2)+'%';
          }
        }
      });
    }
    let name = this.props.itemName;
    if (this.props.bigClass == "BX") {
      name = this.props.itemName+" - "+this.props.itemSupplierName;
    }
    return (
      <div>
        <span onClick={this.showModal.bind(this)}>
          {
            this.props.children ?
              this.props.children
              :
              <Icon type="search" style={{ color: '#d1b97f' }}> 转介费查询</Icon>
          }
        </span>
        <Modal maskClosable={false}
          visible={this.state.visible}
          title={<span><p style={{textAlign:'center',margin:'10px 0',fontSize:'23px',fontWeight:'normal'}}>{name}</p><p style={{textAlign:'center',marginBottom:'10px',fontSize:'26px',fontWeight:'normal'}}>转介费查询</p></span>}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          footer={null} width="1125px" style={{height:'690px'}}
        >
          <div style={{padding:'10px 40px 10px 40px'}} onScroll={this.onScroll.bind(this)} className={styles.product}>
            <Form layout="inline">
              <Form.Item>
                {getFieldDecorator('contributionPeriod', {})(
                  <Select placeholder={sublineName} style={{width:'140px',height:'37px'}} allowClear={true}>
                    {contributionPeriodOptions}
                  </Select>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('currency', {})(
                  <Select placeholder='币种' style={{width:'140px',height:'37px'}} allowClear={true}>
                    {currencyOptions}
                  </Select>
                )}
              </Form.Item>
              {
                this.props.bigClass == "BX" ?
                  <Form.Item>
                  {getFieldDecorator('payMethod', {})(
                    <Select placeholder='缴费方式' style={{width:'140px',height:'37px'}} allowClear={true}>
                      {payMethodOptions}
                    </Select>
                  )}
                </Form.Item>
                :
                ""
              }
              <Form.Item className="pull-right">
                <Button style={{width:'140px',height:'37px'}} type="primary" className={commonStyles.btnPrimary} onClick={this.query.bind(this)}>
                  查询
                </Button>
              </Form.Item>
            </Form>
            <Table columns={columns} pagination={false} dataSource={this.state.dataList}
              scroll={{x:this.props.bigClass=="BX"?'200%':'100%',y:'432px'}} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect()(Form.create()(ProductionReferralFee));
