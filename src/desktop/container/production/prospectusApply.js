import { connect } from 'dva';
import * as styles from '../../styles/proposal.css'
import ProspectusApply from "../../components/production/ProspectusApply";
import ProtalLayout from "../../components/layout/ProtalLayout";



// function mapStateToProps(state) {
//   const production = state.production;
//   return {
//     production: production,
//   };
// }
//
//
// function mapDispatchToProps(dispatch) {
//   return {
//     changeDrawFlag: (item)=>{
//       console.log(item);
//     }
//   };
// }
// const prospectusApply = ({location, production})=>{
//
//     return (
//       <MainLayout location={location}>
//         <div>
//           <ProspectusApply production={production} />
//         </div>
//       </MainLayout>
//     );
// }
// export default connect(mapStateToProps,mapDispatchToProps)(prospectusApply);


const prospectusApply = ({location, production, dispatch})=>{

  production.changeFlag = (type,item)=>{
    console.log(type);
    console.log(item);
    let insuranceFlag, drawFlag, medicalFlag;
    if(type == 'insurance'){
      insuranceFlag = item;
      drawFlag = production.drawFlag;
      medicalFlag = production.medicalFlag;
    }else if(type == 'draw'){
      insuranceFlag = production.insuranceFlag;
      drawFlag = item;
      medicalFlag = production.medicalFlag;
    }else if(type == 'medical') {
      insuranceFlag = production.insuranceFlag;
      drawFlag = production.drawFlag;
      medicalFlag = item;
    }

    dispatch({
      type: 'production/changeFlag',
      payload:{insuranceFlag,drawFlag,medicalFlag}
    });
  }

  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <ProspectusApply props={production} dispatch={dispatch}/>
      </div>
    </ProtalLayout>
  );
}

export default connect(({ production }) => ({ production }))(prospectusApply);


