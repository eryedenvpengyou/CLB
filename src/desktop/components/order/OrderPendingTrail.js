import React  , { Component } from 'react';
import {Table, textarea} from 'antd';
import * as styles from '../../styles/order.css';
import OrderTrailForm from "./OrderPendingTrailForm";
import OrderTrailForm2 from "./OrderPendingTrailForm2";
import Download from '../common/Download';



export default class OrderPendingTrail extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: []
    }
  }

  componentWillMount() {
    const params = {
      pendingId: this.props.pendingId
    };
    this.props.dispatch({
      type:'order/fetchOrderTrails',
      payload:{params},
    });
  }
  render() {
    let fileId = '';
    const columns = [
      {
        key:1,
        title: '添加人',
        dataIndex: 'userName',
        width:'70px',
        render: (text, record) => {
          return <span style={{fontSize:'14px'}}>{record.userName}</span>
        }
      }, {
        key:2,
        title: '跟进时间',
        dataIndex: 'followDate',
        width:'100px',
        render: (text, record) => {
          return <span style={{fontSize:'14px'}}>{record.followDate}</span>
        }
      }, {
        key:3,
        title: '跟进内容',
        dataIndex: 'content',
        width:'300px',
        render: (text, record) => {
          let content = record.content?record.content.replace(/\n/g,"<br/>"):"";
          return <span dangerouslySetInnerHTML={{__html:content}} style={{fontSize:'14px', display: 'block', textAlign: 'left'}}/>
        }
      }, {
        key:4,
        title: '附件',
        dataIndex: 'fileId',
        width: '50px',
        render: (text, record, index) => {
          if (record.fileId) {
            return (
              <Download fileId={record.fileId} />
            )
          } else {
            return ''
          }
        }
      }
    ];
    return (
          <div  className={styles.table_border}>
            <div className={styles.item_div} >
              <b className={styles.b_sty} >|</b>
              <font style={{paddingButton:'30px'}} className={styles.title_font}>Pending跟进</font>
            </div>
            <div className={styles.item_div2}>
              <OrderTrailForm order={this.props.order} dispatch={this.props.dispatch} orderTrailForm={this.props.order.orderTrailForm} pendingId={this.props.pendingId}/>
            </div>
            <div className={styles.item_div}  style={{marginTop:'30px'}}>
              <b className={styles.b_sty} >|</b>
              <font style={{paddingButton:'30px'}} className={styles.title_font}>Pending跟进记录</font>
            </div>
            <div >
              <div style={{marginTop:'40px'}}>
                <Table columns={columns} dataSource={this.props.order.orderTrails} bordered/>
              </div>
              <div>
                <OrderTrailForm2
                  PDType={this.props.PDType}
                  orderType={this.props.orderType}
                  order={this.props.order}
                  dispatch={this.props.dispatch}
                  orderTrailForm={this.props.order.orderTrailForm}
                  pendingId={this.props.pendingId}
                  orderId={this.props.orderId}
                />
              </div>
            </div>
        </div>
        )
    }
}
