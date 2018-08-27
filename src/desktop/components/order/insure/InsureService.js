import React from 'react';
import { Button,} from 'antd';
import * as styles from '../../../styles/appointment.css';
import * as service from '../../../services/order';


class InsureService extends React.Component {
  state = {
    products: {},
  };

  componentWillMount(){
    const params = {
      bigClass: 'FW',
      pageSize: 99999,
      enabledFlag: 'Y',
    };
    service.getProduction(params).then((data)=>{
      if(data.success){
        this.setState({products: data});
      }
    });
  }

  onClick(item){
    location.hash = `/production/subscribe/FW/${item.midClass}/${item.itemId}/${this.props.reId}/${this.props.reNumber}`;
  }


  render() {
    const products = this.state.products || {};

    return (
      <div className={styles.table_border}>

        {/*增值服务*/}
        <div className={styles.item_div}>
          <div className={styles.title_sty}>
            <span className={styles.iconL} ></span>
            <font className={styles.title_font2}>添加增值服务</font>
          </div>

          <div style={{marginLeft:'100px'}}>
            {
              products.rows &&
              products.rows.length > 0 &&
              products.rows.map((item)=>
                <span style={{padding:'0px 50px',}}>
                  <Button type='default' style={{ width:'200px',height:'40px',margin:'10px'}} key={item.itemId} onClick={this.onClick.bind(this,item)} >{item.itemName}</Button>
                </span>
              )
            }
          </div>

        </div>
      </div>
    );
  }
}


export default InsureService;
