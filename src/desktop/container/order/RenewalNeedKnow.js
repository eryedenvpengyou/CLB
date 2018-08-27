import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import * as styles from '../../styles/ordersummary.css';
import * as renewalCss from '../../styles/renewalNeedKnow.css';
import BreadcrumbLayout from '../../components/layout/BreadcrumbLayout';
import { Tabs ,Col, Button } from 'antd';
import {getRenewalNotice} from "../../services/order";


class RenewalNeedKnow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*面包屑数据*/
      itemList: [
        {
          name: '工作台',
          url: '/#/portal/home'
        },
        {
          name: '续保清单',
          url: '/#/after/AfterRenewal/list/'
        },
        {
          name: '续保需知',
          // url: '/#/after/AfterRenewal/list/'
        },
      ],
      content: '',
    };
  };
  componentWillMount () {
    this.getNoticeContent()
  }
  async getNoticeContent () {
    try {
      let result = await getRenewalNotice()
      if (result.success) {
        this.setState({content: result.rows[0].content})
      }
    } catch (e) {
      throw new Error(e)
    }
    
  }


  render() {
    const operations = <span onClick={()=>location.hash = '/after/RenewalNeedKnow'} style={{textDecoration: 'underline', color: 'red',cursor: 'pointer'}}>《续保需知》</span>
    return (
      <ProtalLayout location={this.props.location}>
        <div style={{width: '100%'}}>
          <BreadcrumbLayout itemList={this.state.itemList} />
          <Col className={styles.content + ' ' + renewalCss.container} >
            <div dangerouslySetInnerHTML={{__html: this.state.content}}/>
            {/*<h3>为了确保客户能顺利完成续保，请仔细阅读以下内容，并根据提示进行相关操作，谢谢！</h3>
            <p>
              1.&nbsp;&nbsp;&nbsp;&nbsp;<span>财联邦系统所涉及的续保金额等金额数据仅供参考，实际以保险公司发送给客户的保费通知书为准。</span>请提醒客户留意保险公司发出的信件或手机短信, 客户亦可自行登入保险公司系统, 查询最新有关当期需缴保费。
            </p>
            <p>
              2.&nbsp;&nbsp;&nbsp;&nbsp;<span>续保保费须由保单持有人/受保人进行缴费。</span>若通过第三者付款，第三者付款人必须为保单持有人直系亲属（如保单持有人的配偶、父母），否则保险公司将会退回保费。如以上述第三者付款，请提供关系证明及填写第三者付款声明书(如适用)。
            </p>
            <p>
              3.&nbsp;&nbsp;&nbsp;&nbsp;如客户已完成缴费，<span>请务必在系统售后申请处上传“缴费凭证”，</span>以便保险公司查核是否成功到帐, 否则将有机会引致保单失效。缴费凭证需是清晰完整的扫描件或照片，并显示完整的付款账户号码、付款人姓名、收款方账户信息、缴费日期等信息。（可参考下图缴费凭证样本）
            </p>
            <div className={renewalCss.certificate}>
              <img src={require('../../styles/images/production/payment_certificate_1.jpg')} alt=""/>
              <img src={require('../../styles/images/production/payment_certificate_2.jpg')} alt=""/>
            </div>
            <p>
              4.&nbsp;&nbsp;&nbsp;&nbsp;<span>如因保险公司未能确认客户保费到帐引致保单失效，所产生的申请复效额外费用,由客户自行承担。</span>
            </p>
            <p>
              5.&nbsp;&nbsp;&nbsp;&nbsp;各大保险公司续保宽限期汇总（宽限期，从保费到期日按自然日起计）。
            </p>
            <table style={{borderColor: JSON.parse(localStorage.theme).themeColor}}>
              <tbody>
                <tr>
                  <td>保险公司</td>
                  <td>宽限期</td>
                  <td>保险公司</td>
                  <td>宽限期</td>
                </tr>
                <tr>
                  <td>保诚</td>
                  <td>30</td>
                  <td>友邦</td>
                  <td>30</td>
                </tr>
                <tr>
                  <td>宏利</td>
                  <td>31</td>
                  <td>安盛</td>
                  <td>30</td>
                </tr>
                <tr>
                  <td>大都会</td>
                  <td>30</td>
                  <td>中国人寿</td>
                  <td>30</td>
                </tr>
                <tr>
                  <td>中国太平</td>
                  <td>31</td>
                  <td>富卫</td>
                  <td>30</td>
                </tr>
                <tr>
                  <td>忠意</td>
                  <td>30</td>
                  <td>富通</td>
                  <td>30</td>
                </tr>
                <tr>
                  <td>全美</td>
                  <td>30</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <p>
              6.&nbsp;&nbsp;&nbsp;&nbsp;如客户保单含有递增权益，续保保费将会与往年不一样。若需要<span>取消递增权益</span>，至少<span>在保费到期日1个月前</span>在系统上提交申请，否则有机会导致更改内容在下个保费周年才生效。
            </p>
            <p>
              7.&nbsp;&nbsp;&nbsp;&nbsp;如是电汇缴费，请客户留意两地银行手续费，相关手续费由付款人支付。并请提醒客户在电汇备注处写明保单编号。
            </p>
            <p>
              8.&nbsp;&nbsp;&nbsp;&nbsp;有关相对的汇率，以保险公司网站公布为准。
            </p>
            <p>
              9.&nbsp;&nbsp;&nbsp;&nbsp;如客户使用自动转账形式缴费，自动扣款账户为港元账户，须在扣费日前确保银行账户有足够存款。因如银行账户存款不足将导致扣费失败，银行会扣除相应的银行行政费/手续费。
            </p>
            <p>
              10.&nbsp;&nbsp;&nbsp;&nbsp;为客户可尽快续保成功，请建议客户不要使用公司账户缴付保费。因此方法需客户提交相对较多的资料证明和保险公司处理时间相对较长。
            </p>
            <p>
              11.&nbsp;&nbsp;友邦保单缴费。 如选择香港银行网上银行缴费， 若客户需要把保费及征费一起缴付， 请选择账单类别为 01， 若客户已缴付保费， 其<span>逾期征费请选择账单类别为 05</span>。征费不可到银行柜台缴交。 有关网上缴费操作详情，请参考保险公司网站。
            </p>
            <p>
              12.&nbsp;&nbsp;宏利保单缴费。如现金缴费，只接受客户本人到宏利缴费处缴交港币（不接受银行存入现金）。
            </p>
            <p>
              13.&nbsp;&nbsp;大都会保单缴费。如现金缴费，需提供缴费收据原件及递交自助缴费申请书。
            </p>
            <p>
              14.&nbsp;&nbsp;安盛保单使用现金缴费，必须把<span>缴费凭证正本</span>上交。
            </p>
            <p>
              15.&nbsp;&nbsp;保诚保单缴费。
            </p>
            <div className={renewalCss.case}>
              <p>
                1）如客户使用电汇缴费，必须尽快提供缴费凭证。保险公司收到缴费凭证和我司递交电汇通知书后，才会进行下一步操作。若在客户电汇缴费后三个月内保险公司未能收到缴费凭证和我司递交电汇通知书，电汇款项将自动退还，所有银行行政费/手续费将会从退款金额中扣除。
              </p>
              <p>
                2）<span>如现金缴费，必须经签单供应商预约后才可前往华侨永亨银行各香港分行或者中信银行(国际)分行缴付保费。</span>如客户前往，请提前七到十个工作日在系统上售后申请提交申请（说明前往银行日期、选择缴费银行和分行地址）。保诚保费不接受渣打银行现金缴付。
              </p>
              <p>
                3） 如保单经“经纪行” 签单，保诚不接受直接转账到渣打银行的账户。 若不清楚签单公司，请联系业务行政/在系统上查询。
              </p>
              <p>
                4）保诚所有有关偿还贷款，保单更改和复效的申请等费用，保险公司不接受电汇缴费，可选现金、香港银行账户转账等方式缴费。
              </p>
            </div>*/}
            <Button size='large' type="primary" className={renewalCss.btn} onClick={()=>history.go(-1)}>我已阅读</Button>
          </Col>
        </div>
      </ProtalLayout>
    );
  }
}
export default connect()(RenewalNeedKnow);
