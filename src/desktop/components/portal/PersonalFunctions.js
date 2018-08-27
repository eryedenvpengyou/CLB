/*
 * 个人自定义功能设置
 * @author:Jaron.li
 * @version:20170630
 */
import { connect } from 'dva';
import { Modal, Checkbox,Button, Form,Input,Row,Col,Transfer} from 'antd';
import { getAvailableFuncs, getOwnFuncs, userFuncsSubmit } from '../../services/home';
import Modals from '../common/modal/Modal';
import * as styles from '../../styles/portal.css';
import transfer from '../../styles/images/portal/transfer.png';
/************************************************************/
/* 列表拖着控制 */
//标签选择器
var int = 0;
var eleDustbin ;
var $ = function(selector) {
  if (!selector) { return []; }
  var arrEle = [];
  if (document.querySelectorAll) {
    arrEle = document.querySelectorAll(selector);
  } else {
    var oAll = document.getElementsByTagName("div"), lAll = oAll.length;
    if (lAll) {
      var i = 0;
      for (i; i<lAll; i+=1) {
        if (/^\./.test(selector)) {
          if (oAll[i].className === selector.replace(".", "")) {
            arrEle.push(oAll[i]);
          }
        } else if(/^#/.test(selector)) {
          if (oAll[i].id === selector.replace("#", "")) {
            arrEle.push(oAll[i]);
          }
        }
      }
    }
  }
  return arrEle;
};

function isHasElementTwo(arr,value){
  var str = arr.toString();
  var index = str.indexOf(value);
  if(index >= 0){
  //存在返回索引
  var reg1 = new RegExp("((^|,)"+value+"(,|$))","gi");
  return str.replace(reg1,"$2@$3").replace(/[^,@]/g,"").indexOf("@");
  }else{
    return -1;//不存在此项
  }
}

class PersonalFunctions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
          // 可用自定义功能(对象)
          AvailableFuncList: [],
          // 已拥有自定义功能(数组)
          OwnFuncList:[],
          // 已选择
          selectedKeys: [],
          temp: ""
    }
  }


  // 页面加载前执行
  componentWillMount() {

    const AvailableFuncList = [];
    const OwnFuncList = [];

    // 获取用户
    const user = JSON.parse(localStorage.user);

    // 参数设置
    const paramsBosy = {
      userId: user.userId
    };

    //获取可用自定义功能
    getAvailableFuncs(paramsBosy).then((data) => {

      if (data.success) {
        for (var i=0; i < data.rows.length; i++) {
          AvailableFuncList.push({
            key: data.rows[i].moduleCfgId,
            title: data.rows[i].functionShowName,
            description: data.rows[i].englishName,
            disabled: false,
          });

          if (data.rows[i].selectFlag == "Y") {
            OwnFuncList.push(data.rows[i].moduleCfgId);
          }
        }
        this.setState({  AvailableFuncList, OwnFuncList });
        // console.log("AvailableFuncList:",this.state.AvailableFuncList)
        // console.log("OwnFuncList:",this.state.OwnFuncList)
      } else {
        message.warn(data.message);
        return;
      }
    });

  }

  // 页面加载后执行
  componentDidMount(){
  }
  //组件判断是否重新渲染时调用,即接收到新的props或state时执行此方法
  shouldComponentUpdate(){
    this.transferFuc();
    return true;
  }

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    console.log("nextTargetKeys:",nextTargetKeys)
    // console.log("direction:",direction)
    // console.log("moveKeys:",moveKeys)
    this.setState({ OwnFuncList: nextTargetKeys });
    // this.dropImg()
  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys,t) => {
    // console.log("sourceSelectedKeys:",sourceSelectedKeys)
    // console.log("targetSelectedKeys:",targetSelectedKeys)
    // console.log("this.state.OwnFuncList:",this.state.OwnFuncList)
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    // this.dropImg()
  }

  handleScroll = (direction, e) => {
  }
  //去除左边栏图标
  dropImg(){
    var imgArr =document.getElementsByClassName("ant-transfer-list")[0]
    if(imgArr){
      imgArr = imgArr.getElementsByClassName("custom-item")
      for(var i=0;i<imgArr.length;i++){
        imgArr[i].getElementsByTagName("img")[0].style.display = "none";
      }
    }
  }
  // 拖拽
  transferFuc(){
    eleDustbin = $(".custom-item")[0];
    if(eleDustbin){
      var eleDrags = $(".custom-item");
      var lDrags = eleDrags.length;
      var destdiv = null;
      var srcdiv = null;
      int = int + 1;
      for (var i=0; i<lDrags; i+=1) {
        //主动
      	//新div拖出触发
      	eleDrags[i].ondragstart = function(ev) {
          // console.log("新div拖出触发:",ev.target.innerHTML)
          // console.log("新div拖出触发:",ev.target.nodeName)
          // console.log("新div拖出触发:",ev)
          var dragImage;
          if(ev.target.nodeName=="IMG"){
             dragImage = ev.target.parentNode.parentNode.parentNode;
          }else if (ev.target.nodeName=="SPAN") {
             dragImage = ev.target;
          }

          ev.dataTransfer.effectAllowed = "move";
          ev.dataTransfer.setDragImage(dragImage, 0, 0);
      		return true;
      	};
        //div放下触发
      	eleDrags[i].ondragend = (ev)=> {
          // console.log("div放下触发:",ev.target.innerHTML)
          // console.log("div放下触发:",ev.target)
          // console.log("div放下触发:",ev)
          ev.target.parentNode.parentNode.removeAttribute("style");
          if(ev.target.nodeName=="IMG"){
            if(ev.target.parentNode.innerHTML==null){
              return false;
            }
            destdiv = ev.target.parentNode;
          }else if (ev.target.nodeName=="SPAN") {
            if(ev.target.innerHTML==null){
              return false;
            }
            destdiv = ev.target;
          }
          if(srcdiv){
            if(srcdiv != destdiv){

              // var temp = destdiv.innerHTML;
              // destdiv.innerHTML = srcdiv.innerHTML;
              // srcdiv.innerHTML = temp;

              // 结束位置
              var srcdivIndex = isHasElementTwo(this.state.OwnFuncList,srcdiv.getElementsByClassName('getId')[0].innerHTML);
              // 拖动的元素
              var destdivIndex = isHasElementTwo(this.state.OwnFuncList,destdiv.getElementsByClassName('getId')[0].innerHTML);
              var tep,starti,endi,arrs=this.state.OwnFuncList;
              tep = this.state.OwnFuncList[srcdivIndex] ;
              endi=this.state.OwnFuncList.indexOf(this.state.OwnFuncList[srcdivIndex]);//结束位置

              starti=this.state.OwnFuncList.indexOf(this.state.OwnFuncList[destdivIndex]);//开始位置
              // 查找OwnFuncList里面的开始位置。
              // 互换位置
              // this.state.OwnFuncList[srcdivIndex] = this.state.OwnFuncList[destdivIndex];
              // this.state.OwnFuncList[destdivIndex] = tep;

              // 拖动到指定位置，不互换
              if (endi < starti) {
                this.state.OwnFuncList.splice(endi, 0, this.state.OwnFuncList[destdivIndex]);
                this.state.OwnFuncList.splice(starti + 1, 1);
              } else {
                this.state.OwnFuncList.splice(endi + 1, 0, this.state.OwnFuncList[destdivIndex]);
                this.state.OwnFuncList.splice(starti, 1);
              }

              var arr = [];
              for(var i=0;i<this.state.OwnFuncList.length;i++){
                arr.push(this.state.OwnFuncList[i])
              }
              this.setState({
                OwnFuncList: arr,
              });
              // console.log(this.state.OwnFuncList)
            }
          }
      		return true
      	};
        // 被动
        //离开区域
        eleDrags[i].ondragleave  = function(ev) {
          // console.log("离开区域:",ev.target.innerHTML)
          this.parentNode.parentNode.removeAttribute("style");
          return true;
        };
        //进入区域
        eleDrags[i].ondragenter = function(ev) {
          this.parentNode.parentNode.style.backgroundColor = "#d1b97f";
          // console.log("进入区域:",ev.target.innerHTML)
        };
        //放入区域
        eleDrags[i].ondrop = function(ev) {
          // console.log("放入区域:",ev.target.innerHTML)
          // console.log("放入区域:",ev.target)
          // console.log("放入区域:",ev)

          this.parentNode.parentNode.removeAttribute("style");
          if(ev.target.nodeName=="IMG"){
            if(ev.target.innerHTML==null){
              return false;
            }
            srcdiv =  ev.target.parentNode;
          }else if (ev.target.nodeName=="SPAN") {
            if(ev.target.parentNode.innerHTML==null){
               return false;
            }
            srcdiv =  ev.target;
          }
          return true;
        };
        //监听位移:在一起
        eleDrags[i].ondragover = function(ev) {
          // console.log("在一起:",ev)
          ev.preventDefault();
          return true;
        };

      }
    }


  }
  // 关闭窗口
  cancel(){
    this.props.handVisble(null);
  }
  // 提交
  submit(){
    const user = JSON.parse(localStorage.user);

    const funcList = [];

    var transferKey = document.getElementsByClassName("ant-transfer-list")[1];
    transferKey = transferKey.getElementsByClassName("transferKey");

    for(var n=0;n<transferKey.length;n++){
      for (var i=0; i < this.state.AvailableFuncList.length; i++) {
        if(transferKey[n].id== this.state.AvailableFuncList[i].key){
          funcList.push({
            moduleCfgId: this.state.AvailableFuncList[i].key,
          });
        }
      }
    }

    const params = {
      clbUser: {userId: user.userId},
      functionList: funcList,
    };
    userFuncsSubmit(params).then((data) => {
      if (data.success) {
        this.props.handVisble("F");
      }else{
        Modals.error({content:data.message});
        return;
      }
    });

  };

  //列表
  renderItem = (item) => {
    const customLabel = (
      <span className="custom-item"  draggable="true" style={{whiteSpace :'normal',overflow:'hidden',display:'inline',width:'250px'}} onClick={this.transferFuc()}>
         {item.title}
        <span className="transferKey"  id={item.key}/>
        <span className="getId" style={{display:"none"}} >{item.key}</span>
        <b className='transferIcon'  style={{float:'right',marginRight: '30px',whiteSpace :'normal'}}></b>
        {/* <img src={transfer} style={{float:'right',marginRight: '30px',whiteSpace :'normal'}}/> */}
      </span>
    );

    return {
      label: customLabel,  // for displayed item
      value: item.title,   // for title and filter matching
    };
  }


  render() {
    const state = this.state;
    return (
          <div>
            <Modal
              visible={this.props.visible}
              maskClosable={false}
              closable={true}
              onCancel={this.cancel.bind(this)}
              footer={null}
              width={800}
              style={{height:'630px'}}
            >

            <div className={styles.funcProtocolTitle}>
              <p>自定义功能模块</p>
            </div>

            <div >
              <Transfer
                dataSource={state.AvailableFuncList}
                listStyle={{
                  width: 300,
                  height: 500,
                  marginLeft: 15,
                  marginRight: 15,
                  marginTop: 15,
                }}
                titles={['未添加', '已添加']}
                operations={['添加', '移除']}
                targetKeys={this.state.OwnFuncList}
                selectedKeys={this.state.selectedKeys}
                onChange={this.handleChange}
                onSelectChange={this.handleSelectChange.bind(this)}
                onScroll={this.handleScroll}
                render={this.renderItem}
                className={styles.funcTransfer}
              />
            </div>

            <div style={{textAlign:'center'}}>
               <Button onClick={this.submit.bind(this)} className={styles.funcButton} >保存设置
               </Button>
            </div>

            </Modal>
          </div>
    );

  }
}

export default connect()(Form.create()(PersonalFunctions));
