import { Layout, Menu,} from 'antd';
import { routerRedux } from 'dva/router';
import * as codeService from '../../services/code';
import * as styles from '../../styles/qa.css';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class QaSider extends React.Component{

  state = {
    code: {},
    openKeys: [],
  };

  componentWillMount() {
    //获取问题类型块码
    codeService.getCode({questionTypes:'QA.QUESTION_TYPE'}).then((data)=>{
      this.setState({code: data,});
    });
  }

  changeItem(item){
    const questionTypes = this.state.code.questionTypes || [];
    const guides = this.props.qa.guides || [];
    let key = item.key, url = item.key.split("?")[0], breadItem = [];
    this.props.dispatch({
      type: 'qa/keySave',
      payload: {currentKey:key},
    });

    if(url.indexOf("qaBasic/qaGuide") >= 0){
      let param = item.key.split("=")[1];
      this.props.dispatch({
        type: 'qa/fetchGuideFile',
        payload: {guidelineId:param},
      });

      breadItem.push({name:'操作指引',url:'/#/qaBasic'});
      for(let i in guides){
        if(guides[i].guidelineId == param){
          breadItem.push({name:guides[i].guidelineName,url:'#'+url});
          break;
        }
      }
      this.props.dispatch({
        type: 'qa/breadItemSave',
        payload: {breadItem},
      });
    }else if(url.indexOf("qaBasic/qaQuestion") >= 0){
      let param = item.key.split("=")[1];
      this.props.dispatch({
        type: 'qa/fetchQuestion',
        payload: {questionType:param,questionName:null},
      });
      breadItem.push({name:'问题查询',url:'/#/qaBasic'});
      for(let i in questionTypes){
        if(questionTypes[i].value == param){
          breadItem.push({name:questionTypes[i].meaning,url:'#'+url});
          break;
        }
      }
      this.props.dispatch({
        type: 'qa/breadItemSave',
        payload: {breadItem},
      });
    }else if(url.indexOf("qaBasic/qaConsult") >= 0){
      // breadItem.push({name:'问题咨询',url:'/#/qaBasic/qaConsult'});
      breadItem.push({name:'问题咨询',url:'/#/qaBasic'});
      this.props.dispatch({
        type: 'qa/breadItemSave',
        payload: {breadItem},
      });
    }else if(url.indexOf("qaBasic/qaFeedback") >= 0) {
      breadItem.push({name:'意见反馈',url:'/#/qaBasic'});
      this.props.dispatch({
        type: 'qa/breadItemSave',
        payload: {breadItem},
      });
    }
    this.props.dispatch(routerRedux.push(url));
  }

  //只打开一个menu
  onOpenChange(openKeys){
    let subMenuKey = '';
    if(openKeys && openKeys.length > 0){
        const index = openKeys.length -1;
        this.setState({openKeys: [openKeys[index]]});
        subMenuKey = openKeys[index];     //搜索框
    }else{
      this.setState({ openKeys });
    }

    this.props.dispatch({ type: 'qa/breadItemSave', payload: {breadItem: []}, });   //面包屑
    this.props.dispatch({ type: 'qa/subMenuKeySave', payload: {subMenuKey}, });   //搜索框
    this.props.dispatch(routerRedux.push('/qaBasic/qaNull'));        //清除内容
    if(subMenuKey === 'guide'){
      this.props.dispatch({ type: 'qa/fetchGuid', payload: {}, });      //重新查询 操作指引列表
    }
  }

  render(){
    const questionTypes = this.state.code.questionTypes || [];
    const guides = this.props.qa.guides || [];
    // const key = this.state.openKeys.length > 0 ? this.state.openKeys : [this.props.qa.subMenuKey]
    const key = [this.props.qa.subMenuKey]
    return(
      <Sider width='10%' className={styles.qa_sider_menu}>
        <Menu
          onClick={this.changeItem.bind(this)}
          onOpenChange={this.onOpenChange.bind(this)}
          mode="inline"
          openKeys={key}
          selectedKeys={[this.props.qa.currentKey]}
          style={{ height: '100%'}}
          // defaultSelectedKeys={[1]}
          // defaultOpenKeys={['guide','question']}
        >
          <SubMenu key="guide" title={<span style={{fontSize:'16px'}}>操作指引</span>} >
            {
              guides.map((item)=>
                <Menu.Item key={'/qaBasic/qaGuide?param='+item.guidelineId} style={{fontSize:'14px',height:'35px',lineHeight:'35px'}}>
                  {item.guidelineName}
                </Menu.Item>
              )
            }
          </SubMenu>

          <SubMenu key="question" title={<span style={{fontSize:'16px'}}>问题查询</span>}>
            {questionTypes && questionTypes.map((item)=>
              <Menu.Item key={'/qaBasic/qaQuestion?param='+item.value} style={{fontSize:'14px',height:'35px',lineHeight:'35px'}}>
                {item.meaning}
              </Menu.Item>
            )}
          </SubMenu>

          <SubMenu key="qaConsult" title={<span style={{fontSize:'16px'}}>问题咨询</span>}>
            <Menu.Item key="qaBasic/qaConsult" style={{fontSize:'14px'}}>问题咨询</Menu.Item>
          </SubMenu>
  
          <SubMenu key="qaFeedback" title={<span style={{fontSize:'16px'}}>意见反馈</span>}>
            <Menu.Item key="qaBasic/qaFeedback" style={{fontSize:'14px'}}>意见反馈</Menu.Item>
          </SubMenu>

        </Menu>
      </Sider>
    );
  }
}

export default QaSider;
