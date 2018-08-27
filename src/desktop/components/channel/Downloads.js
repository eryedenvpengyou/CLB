/**
 * 附件下载，带文件名
 * created by xiaoyong.luo@hand-china.com at 17/07/24
 */

import Download from '../common/Download'; 
import {stringify} from 'qs';

const Downloads =({files})=>{
  return(
    <div>
      {
        files.length > 0 &&
        files.map((item)=>
          <div style={{marginRight:'2px',float:'left'}}>
            <a href={"/api/fms/sys/attach/file/detail?"+stringify({fileId: item.fileId,access_token: localStorage.access_token})} >
              {item.fileName || '查看附件'}
            </a>
          </div>
        )
      }
    </div>
  );
};

export default Downloads;
