/**
 * created by xiaoyong.luo@hand-china.com at 2017/6/6
 * @type {[type]}
 */

import { message } from 'antd';
import { isEmpty, isNumber, isString, isArray} from 'lodash';
import moment from 'moment';

/**
 * 省、市 二级 级联 ，传入参数 codeList
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export default function pcCascade(data){
  if(data){
    let provinceList = data.provinceList || [];
    let cityList = data.cityList || [];
    let options = [];
    for(let i in provinceList){
      let temp = {};
      temp.value = provinceList[i].value;
      temp.label = provinceList[i].meaning;
      temp.children = [];
      for(let j in cityList){
        if(cityList[j].parentValue == provinceList[i].value){
          let subTemp = {};
          subTemp.value = cityList[j].value;
          subTemp.label = cityList[j].meaning;
          temp.children.push(subTemp);
        }
      }
      options.push(temp);
    }
    return options;
  }
}

/**
 * 国家、省、市 二级 级联 ，传入参数 codeList
 * @type {[type]}
 */
export function npcCascade(data){
  if(data){
    let nationalList = data.nationalList || [];
    let provinceList = data.provinceList || [];
    let cityList = data.cityList || [];
    let options = [];
    for(let k in nationalList){
      let tempN = {};
      tempN.value = nationalList[k].value;
      tempN.label = nationalList[k].meaning;
      tempN.children = [];
      for(let i in provinceList){
        let tempP = {};
        tempP.children = [];
        if(provinceList[i].parentValue === nationalList[k].value){
          tempP.value = provinceList[i].value;
          tempP.label = provinceList[i].meaning;
          tempN.children.push(tempP);
        }
        for(let j in cityList){
          if(cityList[j].parentValue === provinceList[i].value){
            let tempC = {};
            tempC.value = cityList[j].value;
            tempC.label = cityList[j].meaning;
            tempP.children.push(tempC);
          }
        }
      }
      options.push(tempN);
    }
    return options;
  }
}


/**
 * 三级级联
 * @param {*} nationalList
 * @param {*} provinceList
 * @param {*} cityList
 */
export function cascade(nationalList, provinceList, cityList ){
  let options = [];
  for(let k in nationalList){
    let tempN = {};
    tempN.value = nationalList[k].value;
    tempN.label = nationalList[k].meaning;
    tempN.children = [];
    for(let i in provinceList){
      let tempP = {};
      tempP.children = [];
      if(provinceList[i].parentValue === nationalList[k].value){
        tempP.value = provinceList[i].value;
        tempP.label = provinceList[i].meaning;
        tempN.children.push(tempP);
      }
      for(let j in cityList){
        if(cityList[j].parentValue === provinceList[i].value){
          let tempC = {};
          tempC.value = cityList[j].value;
          tempC.label = cityList[j].meaning;
          tempP.children.push(tempC);
        }
      }
    }
    options.push(tempN);
  }
  return options;
}



/**
 * 文件上传校验
 * @param  {[type]}   rule     [description]
 * @param  {[type]}   value    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function validateFile(rule, value, callback){
  if (!value || value.length <= 0) {
    callback('必选');
  } else {
    for(let i in value){
      if(!value[i].response) return;

      if(value[i].response && (!value[i].response.success)){
        callback('附件上传失败！'+ value[i].response? value[i].response.message : '');
        return;
      }
    }
    callback();
  }
}


/**
 * 文件上传校验
 * @param  {[type]}   rule     [description]
 * @param  {[type]}   value    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function vdFile(rule, value, callback){
  if (!value || value.length <= 0) {
    callback();
  } else {
    for(let i in value){
      if(value[i].status=='error'){
        callback('附件上传失败！')
        return;
      };
      if(!value[i].response)return;
      if(value[i].response && (!value[i].response.success)){
        callback('附件上传失败！'+ value[i].response? value[i].response.message : '');
        return;
      }
    }
    callback();
  }

}


export function validateLov(rule, value, callback){
  if (value == undefined || value.value == undefined || value.value == "") {
    callback('不能为空');
  } else {
    callback();
  }
}


/**
 * 使用 antd 中 文件的上传组件时，获取以上传的文件信息（fileId、name、大小等等)
 * @param  {[type]} file [description]
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
export function pushFile(fileList,type){
  let files = [];
  if( fileList != undefined && fileList.length>  0){
    for(let i in fileList ){
      if(fileList[i].response != undefined){
        if (fileList[i].response.success) {
          files.push({
            name:type?type:'附件名称',
            fileId:fileList[i].response.file.fileId,
            __status: 'add',
          })
        } else {
          message.warn(fileList[i].response.message);
          return null;
        }
      }
    }
  }
  return files;
}

/**
 * 获取快码描述
 * @param  {[type]} value 快码value
 * @param  {[type]} codeList 快码集合
 * @return {[type]} meaning  快码描述
 */
export function getCodeMeaning(value, codeList) {
  let meaning;
  if (!isEmpty(codeList)) {
    codeList.map((data) => {
      if (data.value === value) {
        meaning = data.meaning;
      }
    });
  }
  return meaning;
}


/**
 * 获取文件 如果是单文件上传，返回 fileId，如果是多文件，返回 包含 fileId 的一组对象
 *
 * @export
 * @param {any} fileList  上传的文件（不知道是否真正上传成功）
 * @param {any} singleFlag （是否只允许传一个文件）
 * @param {any} alias （文件别名）
 * @returns
 */
export function formatFile(fileList, singleFlag, alias, primaryKey){
    primaryKey = primaryKey || 'channelArchiveId';
    //如果是单文件上传
    if(singleFlag){
      //如果上传了文件
      if( fileList && fileList.length>  0){
        for(let i in fileList ){
          if(fileList[i].response != undefined){
            if (fileList[i].response.success) {
              const fileId = fileList[i].response.file.fileId;
              return fileId;
            } else {
              message.warn(fileList[i].response.message);
              return 0;
            }
          }
        }
      }else{
        return 0;
      }

    //如果是多文件上传
    }else{
      if( fileList && fileList.length>  0){
        let files = [];
        for(let i in fileList ){
          if(fileList[i].response != undefined){
            if (fileList[i].response.success) {
              files.push({
                name:alias || '附件名称',
                fileId:fileList[i].response.file.fileId,
                [primaryKey]: fileList[i].deleteFileId || '',
                __status: fileList[i].deleteFileId? 'update' : 'add',
              })
            } else {
              message.warn(fileList[i].response.message);
              return [];
            }
          }
        }
        return files;
      }else{
        return [];
      }
    }
}

/**
 * 初始化文件
 *
 * @export
 * @param {any} archive
 * @returns
 */
export function initFile(archive, type){
  let files = [];
  if(archive && archive.length > 0){
    for(let i in archive){
      let temp = {
        uid: archive[i].fileId + i,
        name: archive[i].fileName  || '查看附件',
        type: archive[i].type || '',      //主要就是用来判断是什么文件 身份证 公司证明还是啥
        status: 'done',
        response: {
          success: true,
          file:{
            fileId: archive[i].fileId,
            filePath: archive[i].filePath || '',
            fileType: archive[i].fileType || '',
            fileName: archive[i].fileName || '',
            fileSize: archive[i].fileSize || '',
          }
        }
      };
      files.push(temp);
    }
  }
  return type ? files.filter((item)=> item.type == type) : files;
}


//下载情况下的附件初始化 个人中心
export function initFileDown(archive, type){
  if(archive && archive.length > 0){
    return type ? archive.filter((item)=> item.type == type) : archive;
  }else{
    return [];
  }
}

//验证手机号
export function checkPhone(rule, value, callback){
  let preCode = this.props.form.getFieldValue('phoneCode')
  let regex = /^\d{11}$/, msg='手机号位数不正确(大陆地区为11位)';

  if( preCode ==='00852' || preCode ==='00853'){
    regex = /^\d{8}$/;
    msg='手机号位数不正确(港澳地区为8位)';
  }else if(preCode ==='00886' ){
    regex = /^\d{9}$/;
    msg='手机号位数不正确(台湾地区为9位)';
  }

  if ( value && !regex.test(value)  ) {
    callback(msg);
  } else {
    callback();
  }
}



export function format(oldDate) {
	var time = new Date(oldDate);
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y + '/' + add0(m) + '/' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
export function formatSecond(oldDate) {
	var time = new Date(oldDate);
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
export function formatDay(oldDate) {
  if(oldDate){
    var time = new Date(oldDate);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d);
  }else {
    return
  }

}
export function clbFormat(oldDate){
  var time = new Date(oldDate);
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y + '/' + add0(m) + '/' + add0(d);
}
export function clbFormatSecond(oldDate) {
	var time = new Date(oldDate);
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y + '/' + add0(m) + '/' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}

export function dataFormatSecond(oldDate) {
  if(oldDate){
    var time = new Date(oldDate);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
  }else {
    return oldDate
  }
}
export function dataFormat(oldDate){
  if(oldDate){
    var time = new Date(oldDate);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d);
  }else {
    return oldDate
  }
}

function add0(m) {
	return m < 10 ? '0' + m : m
}




export function fmoney(s){
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')) + '';
  let l = s.split('.') [0].split('').reverse(),
      r = s.split('.') [1];
  let  t = '';
  for (let i = 0; i < l.length; i++)
  {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
  }
  return t.split('').reverse().join('') ;
}




/**
 * 金额字段 千分位显示 保留两位小数
 * @auth detai.kong@hand-china.com
 * @param  {[type]} num  金额数值
 */
export function formatCurrency(num) {
  if(typeof num == 'undefined' || num == null){
    return ''
  }else{
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
      num = "0";
    let sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    let cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10)
      cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
      num = num.substring(0,num.length-(4*i+3))+','+
        num.substring(num.length-(4*i+3));
    return (((sign)?'':'-') + num + '.' + cents);
  }
}

/**
 * 金额字段 千分位显示
 * @param  {s} 金额数值
 */
export function fmoneyCommon(s)
{
  if(s){
    s = parseFloat((s + '').replace(/[^\d\.-]/g, '')) + '';
    var l = s.split('.') [0].split('').reverse(),
      r = s.split('.') [1];
    var  t = '';
    for (var i = 0; i < l.length; i++)
    {
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
    }
    return t.split('').reverse().join('') ;
  }else {
    return s
  }
}


/**
 * 日期转换函数
 * @auth detai.kong@hand-china.com
 * @param  {[type]} dateParms  日期 年-月-日
 */
export function dateConvertymd(dateParms){
  return !isEmpty(dateParms) ? moment(dateParms).format('YYYY/MM/DD') : '';
}


/**
 * 日期转换函数
 * @auth detai.kong@hand-china.com
 * @param  {[type]} dateParms  日期 年-月-日 时：分：秒
 */
export function dateConvertymdhms(dateParms){
  return !isEmpty(dateParms) ? moment(dateParms).format('YYYY-MM-DD HH:mm:ss') : '';
}


/**
 * 日期转换函数
 * @auth detai.kong@hand-china.com
 * @param  {[type]} date  日期
 * @param  {[type]} rule  格式化的样式
 */
export function dateformat(date,rule) {
  return !isEmpty(date) && !isEmpty(rule) && isString(rule) ? moment(date).format(rule) : '';
}

/**
 * number to string 转换函数
 * @auth jun.li06@hand-china.com
 * @param  {[type]} value  number
 * @return string // 11,111,111
 */
export function numberFormat(value) {
  return isNumber(value) ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
}

/**
 * string to number 转换函数
 * @auth jun.li06@hand-china.com
 * @param  {[type]} str  string
 * @return number
 */
export function numberParse(str) {
  return isString(str) && !isNaN(str) ? Number(str.replace(/\$\s?|(,*)/g, '')) : null;
}

/**
 * 排序
 * @param {*} arr
 * @param {*} type
 */
export function sortCustom(arr, custom){
  if(!arr || !isArray(arr) || arr.length <= 0) return [];

  let field = 'index';

  //缴费方式
  if(custom === 'PAYMETHOD'){
    arr.map((item,index)=>{
      switch(item.way){
        case '整付': item.index = 1; break;
        case '年缴': item.index = 2; break;
        case '半年缴': item.index = 3; break;
        case '季缴': item.index = 4; break;
        case '月缴': item.index = 5; break;
        case '预缴': item.index = 6; break;
        default : break;
      }
    });

    return arr.sort(byObj(field));
  }


  //年期
  if(custom === 'SUBLINE'){
    let arr1 = [], arr2 = [], arr3 = [];
    for(let i in arr){
      if(/^[0-9]+.?[0-9]*$/.test(arr[i].sublineItemName)){
        arr[i].index = Number(arr[i].sublineItemName);
        arr1.push(arr[i]);

      }else if(arr[i].sublineItemName.indexOf('至被保人') >= 0){
        arr[i].index = Number(arr[i].sublineItemName.replace(/[^0-9]/ig,""));
        arr2.push(arr[i]);

      }else if(arr[i].sublineItemName == '整付'){
        arr[i].index = 1;
        arr3.push(arr[i]);
      }else if(arr[i].sublineItemName == '终身'){
        arr[i].index = 2;
        arr3.push(arr[i]);
      } else {
        arr3.push(arr[i]);
      }
    }

    arr1.sort(byObj(field));
    arr2.sort(byObj(field));
    arr3.sort(byObj(field));

    arr = arr1.concat(arr2, arr3);
    return arr;
  }


  //自付选项
  if(custom === 'SELFPAY'){
    arr.map((item,index)=>{
      let selfpay = item.selfpay;
      let i = selfpay.indexOf("\/");
      if(i >= 0){
        selfpay = selfpay.substring(0,i);
        item.index = Number(selfpay.replace(/[^0-9]/ig,""));
      }
    });
    return arr.sort(byObj(field));
  }


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
}

