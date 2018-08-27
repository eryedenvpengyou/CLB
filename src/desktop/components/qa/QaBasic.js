import {Input} from 'antd';
import { routerRedux } from 'dva/router';
import QaSider from './QaSider';
import QaBread from './QaBread';
import * as styles from '../../styles/qa.css';

const Search = Input.Search;

class QaBasic extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    //查询操作指引列表，存在model中
    this.props.dispatch({ type: 'qa/fetchGuid', payload: {}, });
  }


  render(){
    let subMenuKey = this.props.qa.subMenuKey || '';
    const breadItem = this.props.qa.breadItem || [];
    return (
      <div className={styles.qa_content}>

        <div style={{float:'left',width:'248px'}}>
          <QaSider qa={this.props.qa} dispatch={this.props.dispatch}/>
        </div>

        {
          subMenuKey === 'guide' &&
          <div style={{float:'left',minHeight:'60px',width:'890px',margin:'0 0 0 12px'}}>
            <Search placeholder="请输入您要查询的操作指引" style={{ width:'100%'}}
              onSearch={value => {
                this.props.dispatch({ type: 'qa/searchGuide',payload: {searchValue:value} });
                this.props.dispatch(routerRedux.push('/qaBasic/qaGuide'));
              }}
            />
          </div>
        }

        {
          subMenuKey === 'question' &&
          <div style={{float:'left',minHeight:'60px',width:'890px',margin:'0 0 0 12px'}}>
            <Search placeholder="请输入您要查询的问题" style={{ width:'100%'}}
              onSearch={value => {
                this.props.dispatch({type: 'qa/searchQuestion',payload: {searchValue:value}});
                this.props.dispatch(routerRedux.push('/qaBasic/qaQuestion'));
              }}
            />
          </div>
        }

        <div style={{float:'left',minHeight:'860px',width:'890px',margin:'0 0 0 12px',border:'1px solid #e9e9e9'}}>
          {
            this.props.children &&
            this.props.qa.breadItem.length > 0 &&
            <div style={{backgroundColor:'#EDEDED',height:'40px',lineHeight:'40px'}}>
              <QaBread itemList={breadItem} />
            </div>
          }
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default QaBasic;
