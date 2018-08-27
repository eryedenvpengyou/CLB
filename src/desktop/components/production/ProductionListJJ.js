import React from 'react';
import { Table, Button, Row, Col, Input, Form, Icon } from 'antd';
import styles from '../../styles/production.css';
import commonStyles from '../../styles/common.css';
import { productionHeaderList } from '../../services/production';
import { handleTableChange } from '../../utils/table';
import { getCode } from '../../services/code';
import { PICTURE_ADDRESS } from '../../constants';
import TipModal from "../common/modal/Modal";
import showImg from "../../styles/images/production/product_show_img.jpg";

class ProductionShowComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      orderBy: [],
      pagination: {},
      body: {
        bigClass: "JJ",
        midClass:'MXJJ',
        enabledFlag: 'Y',
      },
      //快码值
      codeList: {
        currencyList: [],
      }
    };
  }
  componentWillMount() {
    this.queryJJ();
    const codeBody = {
        currencyList: 'PUB.CURRENCY',
    };
    getCode(codeBody).then((codeData)=>{
        this.state.codeList = codeData;
    })
  }
  //查询产品
  queryJJ() {
    this.state.body.itemName = this.props.form.getFieldValue("itemNameJJ");
    this.state.body.page = 1;
    this.state.body.pagesize = 10;
    productionHeaderList(this.state.body).then((data) => {
      if (data.success) {
        const pagination = {};
        pagination.current = 1;
        pagination.pagesize = 10;
        pagination.total = data.total;
        for (var i=0; i<data.rows.length; i++) {
          data.rows[i].key = i+1;
        }
        this.setState({
          body: this.state.body,
          dataList: data.rows,
          pagination
        });
      } else {
        TipModal.error({content:data.message});
        return;
      }
    });
  }
  //清空查询条件-query
  clearQueryJJ() {
    this.state.body = {
      bigClassName: "医疗教育",
      enabledFlag: 'Y',
    };
    //清空输入框
    this.props.form.setFieldsValue({itemNameJJ:""});
    this.queryJJ();
    //清空样式
    let p = document.getElementsByClassName(styles.tab2)[2].getElementsByTagName("p");
    for (var i=0; i<p.length; i++) {
      let a = p[i].getElementsByTagName("a");
      for (var j=0; j<a.length; j++) {
        if (j == 0) {
          a[j].style.color = "rgb(209, 185, 127)";
        } else {
          a[j].style.color = "#000";
        }
      }
    }
    p = document.getElementById("queryJJ").getElementsByTagName("p");
    for (var i=0; i<p.length; i++) {
      let a = p[i].getElementsByTagName("a");
      for (var j=0; j<a.length; j++) {
        if (j == 0) {
          a[j].style.color = "rgb(209, 185, 127)";
        } else {
          a[j].style.color = "#000";
        }
      }
    }
    document.getElementById("queryJJ").style.display = "none";
    document.getElementsByName("displayMoreJJ")[0].innerHTML = '更多 <i class="anticon anticon-down"></i>';
  }

  //产品分类
  productQuery(value,e) {
    if (e.target.style.color == 'rgb(209, 185, 127)') {
      e.target.style.color = '#000';
      this.state.body.midClass = null;
    } else {
      var children = document.getElementById("proCate").children;
      for (var i=0; i<children.length; i++) {
        children[i].style.color = '#000';
      }
      e.target.style.color = 'rgb(209, 185, 127)';
      this.state.body.midClass = value;
      if (e.target.innerText == "不限") {
        this.state.body.midClass = null;
      }
    }
    this.queryJJ();
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const columns = [{
      dataIndex: 'pictureFilePath',
      key: 'pictureFilePath',
      width: '25%',
      render: (text, record, index) => {
        return (
          <img onClick={()=>location.hash = '/production/detail/JJ/'+record.itemId} style={{cursor:'pointer'}} src={text?PICTURE_ADDRESS+text:showImg} alt={''} width="247px" height='236px' />
        );
      },
    }, {
      key: 'description',
      width: '50%',
      render: (text, record, index) => {
        let _record = [];
        let description = "";
        let priceDescription = "免费";
        let numberFlag = false;
        record.prdItemSublineList.map((item) => {
          if (!isNaN(item.price)) {
            numberFlag = true;
          } else {
            priceDescription = item.price;
          }
          if (item.price && !isNaN(item.price) && _record.indexOf(item.price) == -1) {
            _record.push(item.price);
          }
        });
        if (record.midClass == "HPV") {
          description = "（需现场支付）";
        }
        return (
          <div style={{textAlign:'left'}}>
            <Row className={styles.product_title}>
              <span onClick={()=>location.hash = '/production/detail/JJ/'+record.itemId} style={{cursor:'pointer'}} className={styles.product_name}>{record.itemName}</span>
            </Row>
            <Row className={styles.product_attribute}>
               预期收益率：{record.attribute41}
            </Row>
            <Row className={styles.product_attribute}>
               投资期限：{record.attribute42}
            </Row>
            <Row className={styles.product_attribute}>
               起投金额：{record.attribute43}{
                   record.prdItemPaymode.map((item,index) =>{
                       return this.state.codeList.currencyList.map((code)=>{
                           if(item.currencyCode == code.value && item.enabledFlag != 'N'){
                               if(index == record.prdItemPaymode.length-1){
                                   return <span key={index}>{code.meaning}</span>
                               }else{
                                   return <span key={index}>{code.meaning+'、'}</span>
                               }
                           }
                       })
                   })
               }
            </Row>
          </div>
        );
      }
    }, {
      key: 'actions',
      width: '25%',
      render: (text, record, index) => {
        return (
          <div>
            <Row style={{ marginBottom: '28px' }}>
              <Button type="primary" style={{width:'190px',height:'46px',fontWeight:'normal'}} className={commonStyles.btnPrimary} onClick={()=>location.hash = '/production/detail/JJ/'+record.itemId}>
                查看详情
              </Button>
            </Row>
            <Row>
              <Button type="default" style={{width:'190px',height:'46px',fontWeight:'normal'}} className={commonStyles.btnDefault} onClick={()=>window.open("https://invest.meixinglobal.com/product/product_list.html?partner_id=CLBSZ0000&third_party_id=768","_blank")}>
                立即预约
              </Button>
            </Row>
          </div>
        );
      },
    }];
    return (
      <Row className={styles.productList}>
        <div className={styles.tab1}>
          {/*产品搜索*/}
          <Row style={{clear:'both',paddingTop:'20px'}}>
            <div style={{float:'left',width:'120px',height:'40px',lineHeight:'40px',color:'#000'}}>
              <span style={{float:'right'}}>产品搜索：</span>
            </div>
            <Form.Item style={{padding:'0',margin:'0 0 0 10px',width:'545px',float:'left'}} >
              {getFieldDecorator('itemNameJJ', {})(
                <Input style={{width:'100%'}} placeholder="请输入您想查找的产品名称或关键字" addonAfter={<a onClick={this.queryJJ.bind(this)}>立即搜索</a>} />
              )}
            </Form.Item>
          </Row>
        </div>
        <Row>
          <Table showHeader={false} columns={columns}
                 onChange={handleTableChange.bind(this,productionHeaderList,this.state.body)}
                 pagination={this.state.pagination} dataSource={this.state.dataList}/>
        </Row>
      </Row>
    );
  }
}

export default Form.create()(ProductionShowComponent);
