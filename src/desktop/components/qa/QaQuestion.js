import { Collapse } from 'antd';
import * as styles from '../../styles/qa.css';
const Panel = Collapse.Panel;

const QaQuestion =({qa, dispatch})=>{

  return(
    <div style={{border:'0px solid #E2E2E2'}}>
      <Collapse accordion style={{background: '#fff',borderRadius:0,}}>
        {
          qa.length > 0 &&
          qa.map((item)=>
            <Panel key={item.questionId} header={item.questionName} style={{border:0}} className={styles.qa_question_header}>
              <div className={styles.qa_question_solution} dangerouslySetInnerHTML={{__html: (item.solution||"").replace(/&lt;ul&gt;/g,"<ul type='disc'>").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;nbsp;/g," ")}} />
            </Panel>
          )
        }
      </Collapse>
    </div>
  );
};

export default QaQuestion;
