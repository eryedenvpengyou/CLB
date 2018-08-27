import { Tree } from 'antd';
import * as service from '../../services/channel';
import * as styles from '../../styles/qa.css'

const TreeNode = Tree.TreeNode;

function generateTreeNodes(treeNode,store) {
  const arr = [];
  let channelList = store.props.channel.channelList;
  const key = treeNode.props.eventKey;
  if(key !='0-0'){
    for(let i = 0; i< channelList.length; i++){
      if(channelList[i].channelId != channelList[i].parentChannelId && channelList[i].parentChannelId == key){
        arr.push(channelList[i]);
      }
    }
    return arr;
  }
}

function setLeaf(treeData,store) {
  const loopLeaf = (data,store) => {
    data.forEach((item) => {
      item.isLeaf = true;
      for(let i = 0; i<store.props.channel.channelList.length; i++){
        if(item.channelId === store.props.channel.channelList[i].parentChannelId){
          item.isLeaf = false;
          break;
        }
      }

      if (item.children && item.children.length >0 ) {
        loopLeaf(item.children,store);
      }
    });
  };
  loopLeaf(treeData,store);
}

  function getNewTreeData(treeData, child ,store) {

  const loop = (data) => {
    if (child == null || child.length <=0 ) return;
    data.forEach((item) => {
      if (item.children) {
        loop(item.children);
      } else {
        if(item.channelId === child[0].parentChannelId){
          item.children = child;
        }
      }
    });
  };

  loop(treeData,store);
  setLeaf(treeData,store);
}

class TeamChart extends React.Component {
  state = {
    treeData: [
      {channelName: '团队汇总', channelId: '0-0' ,children:[]},
    ],
  }

  componentDidMount(){
    service.fetchTeam({parentChannelId: JSON.parse(localStorage.user).relatedPartyId}).then((data)=>{
      if(data.success){
        const children = data.rows || [];
        this.setState({
          treeData: [
            {channelName: '团队汇总', channelId: '0-0' ,children:children},
          ],
        });
      }
    });
  }

  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const treeData = this.state.treeData;
        getNewTreeData(treeData, generateTreeNodes(treeNode,this), this);
        this.setState({ treeData });
        resolve();
      }, 100);
    });
  }

  render() {
    const loop = data => data.map((item) => {
      if (item.children && item.children.length > 0) {
        return <TreeNode title={item.channelName} key={item.channelId}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode title={item.channelName} key={item.channelId} isLeaf={item.isLeaf} />;
    });
    const treeNodes = loop(this.state.treeData);
    console.log(this.state.treeData);
    
    return (
      <div className={styles.content}>
      <Tree style={{fontSize:'200px',fontcolor:'red'}}
        showLine
        defaultExpandAll={true}
        loadData={this.onLoadData}
      >
        {treeNodes}
      </Tree>
      </div>
    );
  }
}

export default TeamChart;
