/*
 * show 首页
 * @author:zhouting
 * @version:20170814
 */
import React from 'react';
import { SectionsContainer, Section } from 'react-fullpage/index';
import CountUp from 'react-countup';
import { zh_tran } from '../common/transferLanguage';
import style from '../../styles/homePage.css';
import logo from '../../styles/images/homePage/logo.png';
import img7 from '../../styles/images/homePage/img7.png';
import img8 from '../../styles/images/homePage/img8.png';
import img9 from '../../styles/images/homePage/img9.png';
import icon1 from '../../styles/images/homePage/icon1.png';
import icon2 from '../../styles/images/homePage/icon2.png';
import icon3 from '../../styles/images/homePage/icon3.png';
import icon4 from '../../styles/images/homePage/icon4.png';
import icon5 from '../../styles/images/homePage/icon5.png';
import icon6 from '../../styles/images/homePage/icon6.png';
import icon10 from '../../styles/images/homePage/icon10.png';
import icon11 from '../../styles/images/homePage/icon11.png';
import icon12 from '../../styles/images/homePage/icon12.png';
import icon13 from '../../styles/images/homePage/icon13.png';
import icon14 from '../../styles/images/homePage/icon14.png';
import icon17 from '../../styles/images/homePage/icon17.png';
import icon18 from '../../styles/images/homePage/icon18.png';
import icon19 from '../../styles/images/homePage/icon19.png';
import icon20 from '../../styles/images/homePage/icon20.png';
import icon21 from '../../styles/images/homePage/icon21.png';
import icon22 from '../../styles/images/homePage/icon22.png';
import icon23 from '../../styles/images/homePage/icon23.png';
import icon24 from '../../styles/images/homePage/icon24.png';
import icon25 from '../../styles/images/homePage/icon25.png';
import icon26 from '../../styles/images/homePage/icon26.png';
import icon27 from '../../styles/images/homePage/icon27.png';
import icon28 from '../../styles/images/homePage/icon28.png';
import icon29 from '../../styles/images/homePage/icon29.png';
import {query} from '../../services/seo';
class homePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        }
    }
    componentDidMount() {
        query().then((data) => {
            if(data.success){
                document.getElementsByTagName('link')[2].href = './resources/favicon.png';
                document.title = '美信联邦_海外资产配置一站式服务平台';
                document.getElementsByTagName('meta')['keywords'].content = data.rows[0].siteKeywords;
                document.getElementsByTagName('meta')['description'].content = data.rows[0].siteDescription;

            } else {
                return;
            }
        })
        document.getElementsByClassName('container')[0].style.padding = 0;
        document.getElementsByClassName('Navigation')[0].style.transform = 'rotate(90deg)';
        for (var i=0; i<7; i++) {
            document.getElementsByClassName('Navigation-Anchor')[i].style.backgroundColor = '#f0f0f0';
            document.getElementsByClassName('Navigation-Anchor')[i].href = 'javascript:document.getElementsByClassName("tabNormal")[0].getElementsByTagName("a")['+i+'].click();';
        }
        document.getElementsByClassName('scaleLi')[0].style.height = (window.innerHeight - 270)/2 + "px";
        document.getElementsByClassName('scaleLi')[1].style.height = (window.innerHeight - 270)/2 + "px";
        for(var i=0; i<7; i++){
            if(i/3 != 0 && i/3 != 1 && i/3 != 3 ){
                document.getElementsByClassName(style.title)[i].style.paddingTop =  (window.innerHeight - 550)/2 + "px";   
            }
        }
        zh_tran('s');
        window.onresize = function() {
          if (document.getElementsByClassName('scaleLi').length > 0) {
            document.getElementsByClassName('scaleLi')[0].style.height = (window.innerHeight - 270)/2 + "px";
            document.getElementsByClassName('scaleLi')[1].style.height = (window.innerHeight - 270)/2 + "px";
          }
          for (var i=0; i<7; i++) {
            if(i/3 != 0 && i/3 != 1 && i/3 != 3){
                document.getElementsByClassName(style.title)[i].style.paddingTop =  (window.innerHeight - 550)/2 + "px";   
            }
          }
        }
    }
    componentWillUnmount() {
        document.getElementsByTagName('body')[0].style.overflow = 'visible';
        window.onresize = null;
    }
    changePage(current) {
        // for (var i=0; i<5; i++) {
        //     document.getElementsByClassName('tabNormal')[0].getElementsByTagName('a')[i].style.color = '#fff';
        // }
        // document.getElementsByClassName('tabNormal')[0].getElementsByTagName('a')[current].style.color = '#d1b97f';

        this.setState({current});
        if(current == 2){
            for(var i=0;i<3;i++){
                document.getElementsByClassName('scaleLi')[0].getElementsByTagName('li')[i].style.animationName='ulAnimation'
                document.getElementsByClassName('scaleLi')[0].getElementsByTagName('li')[i].style.animationDuration='6s';
                document.getElementsByClassName('scaleLi')[0].getElementsByTagName('li')[i].style.animationTimingFunction='linear';
                document.getElementsByClassName('scaleLi')[0].getElementsByTagName('li')[i].style.animationIterationCount='1';
                document.getElementsByClassName('scaleLi')[1].getElementsByTagName('li')[i].style.animationName='ulAnimation'
                document.getElementsByClassName('scaleLi')[1].getElementsByTagName('li')[i].style.animationDuration='6s';
                document.getElementsByClassName('scaleLi')[1].getElementsByTagName('li')[i].style.animationTimingFunction='linear';
                document.getElementsByClassName('scaleLi')[1].getElementsByTagName('li')[i].style.animationIterationCount='1';
            }
        }
    }

    render() {
        const options = {
            sectionClassName: 'section',
            anchors: ['','','','','','',''],
            scrollBar: false,
            navigation: true,
            verticalAlign: false,
            delay:600,
            arrowNavigation: true,
            scrollCallback: (states) => {
                document.getElementsByClassName('tabNormal')[0].getElementsByTagName('a')[states.activeSection].click();
                if(states.activeSection ===0){
                    document.getElementsByClassName(style.siteNav)[0].style.background =  'transparent';   
                }else{
                    document.getElementsByClassName(style.siteNav)[0].style.background = 'rgba(0, 0, 0, 0.8)';   
                }
            }
        };
        return(
            <div>
                <div className={style.siteNav}>
                    <div>
                        <img src={logo} alt="" />
                        <div>
                            <ul className='tabNormal'>
                                <li><a onClick={this.changePage.bind(this, 0)} style={{marginLeft: '-16px' }}>首页</a></li>
                                <li><a onClick={this.changePage.bind(this, 1)}>关于我们</a></li>
                                <li style={{padding:0}}><a onClick={this.changePage.bind(this, 2)}> </a></li>
                                <li><a onClick={this.changePage.bind(this, 3)}>服务支持</a></li>
                                <li><a onClick={this.changePage.bind(this, 4)}>展业平台</a></li>
                                <li><a onClick={this.changePage.bind(this, 5)}>产品覆盖</a></li>
                                <li><a onClick={this.changePage.bind(this, 6)}>股东背景</a></li>
                                <li style={{ marginLeft: '60px' }}>
                                    <a href='/#/login'>
                                        <img src={icon10} style={{ marginRight: '5px' }} />
                                        登录/注册
                                </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={style.container}>
                    <ul className={style.cbSlideshow}>
                        <li><span></span></li>
                        <li><span></span></li>
                        <li><span></span></li>
                        <li><span></span></li>
                        <li><span></span></li>
                        <li><span></span></li>
                        <li><span></span></li>
                    </ul>
                    <SectionsContainer className="container" {...options} activeSection={this.state.current}>
                        <Section className={style.page1}>
                            <div>
                                <div className={style.front}>
                                    <div className={style.title} style={{paddingTop:'300px'}}>
                                        <h1>财联邦+美信=美信联邦</h1>
                                        <h2 className={style.backLine}>
                                            <span style={{marginRight:'30px'}}></span>
                                            巨头联手，打造海外资产领域No 1规模企业
                                            <span style={{marginLeft:'30px'}}></span>
                                            </h2>
                                    </div>
                                    <a href='/#/login' className={style.resTop}>立即注册</a>
                                    <ul>
                                        <li>
                                            注册理财师：<span>
                                            超<span className='num'> <CountUp className="account-balance"
                                                start={0}
                                                end={3}
                                                useGrouping={true}
                                                />万</span>名
                                            </span>
                                <i></i>
                                        </li>
                                        <li>
                                        累计资产管理规模：<span>超<span> <CountUp
                                                start={0} end={30}
                                                useGrouping={true}
                                                />亿</span>美元</span>
                                <i></i>
                                        </li>
                                        <li>
                                        全球入住平台企业：<span>超过<span> <CountUp
                                                start={0}
                                                end={300}
                                                useGrouping={true}
                                                /></span>家</span>
                                </li>
                                    </ul>
                                </div>
                            </div>
                        </Section>
                        <Section className={style.page2}>
                            <div>
                                <div className={style.front}>
                                    <div className={style.title}>
                                        <h1>关于我们</h1>
                                        <h2>覆盖美国RIA牌照（注册投资顾问）、美国保险牌照、香港保险经纪牌照、<br/>香港证监会1、4、6、9号牌照等境外金融牌照</h2>
                                    </div>
                                    <div>
                                        <div className={style.about}>
                                            <div style={{ fontSize: '26px' }}>
                                                <p>美信联邦致力于成为华人全球资产配置首选的互联网产品甄选和交易平</p>
                                                <p>台。通过自主研发的iTrade系统，服务于理财顾问公司、金融机构、高</p>
                                                <p>净值客户服务商，对接其客户做全球资产配置方案时的产品和交易需求</p>
                                                <p>帮助从业机构及其客户享受到最流畅的全球资产配置线上投资体验。</p>
                                            </div>
                                            <div>
                                                <ul>
                                                    <li style={{ marginTop: '15px', marginLeft: '16px' }}>
                                                        <p>产品</p>
                                                        <p>供应商</p>
                                                        <div>
                                                            <p>银行、证券公司、保险公司</p>
                                                            <p>信托公司、私募基金</p>
                                                        </div>
                                                    </li>
                                                    <li style={{ marginTop: '43px', marginLeft: '2px' }}>
                                                        美信联邦
                                                    <div style={{ marginTop: '65px' }}>
                                                            <p>海外资产配置服务商</p>
                                                        </div>
                                                    </li>
                                                    <li style={{ marginTop: '18px', marginLeft: '7px' }}>
                                                        <p>合作 </p>
                                                        <p>伙伴 </p>
                                                        <div>
                                                            <p>理财师、理财机构互联网金融平台、金融机构</p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>
                        <Section className={style.page21}>
                            <div className={style.aboutUs}>
                                <div className={style.title}>
                                </div>
                                <ul>
                                    <li>
                                        <img src={icon24} />
                                        <h2>刁盛鑫 | 联合创始人</h2>
                                        <div>
                                        先后供职于美银美林,法国兴业银行和<br/>Greentech Capital Advisors,<br/>专注于美国和跨境兼并收购和资本<br/>募集,参与交易总额超过500亿人民<br/>币。纽约大学斯特恩商学院金融和<br/>经济双学士，2017福布斯亚洲杰出<br/>青年。
                                        </div>
                                    </li>
                                    <li>
                                        <img src={icon25}/>
                                        <h2>叶一舟 | 联合创始人</h2>
                                        <div>
                                        中山大学学士（港籍），中国富强<br/>财富管理公司（HK290）前董事,<br/>持续金融行业创业者，12年海外财<br/>富管理经验，港漂从业港险模式缔<br/>造者。
                                        </div>
                                    </li>
                                    <li>
                                        <img src={icon26}/>
                                        <h2>吴晓雯 | 联合创始人</h2>
                                        <div>
                                        曾担任德意志银行香港分行投行部<br/>以及瑞士银行香港分行投行部董事<br/>专注通过QDII等跨境投资渠道为中<br/>国投资人提供跨境投资方案。北京<br/>大学经济学学士，哥伦比亚大学工<br/>商管理硕士。
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </Section>
                        <Section className={style.page3}>
                            <div className={style.info}>
                                <div style={{ height: '100%' }}>
                                    <div className={style.title}>
                                        <h1 style={{color:'#000'}}>合作优势</h1>
                                        <h2 style={{color:'#000'}}>提升海外资产行业对接与转化，协助伙伴创造更佳销售业绩</h2>
                                    </div>
                                    <div className={style.support}>
                                        <ul className="scaleLi">
                                            <li>
                                                <img src={icon1} alt="" />
                                                <span style={{ fontSize: '22px', marginTop: '5%', display: 'block' }}>大牌产品</span>
                                                <span><span>对接全球300多家大牌资产管理机构</span></span>
                                            </li>
                                            <li>
                                                <img src={icon2} alt="" />
                                                <span style={{ fontSize: '22px', marginTop: '5%', display: 'block' }}>管理便捷 </span>
                                                <span><span>客户3分钟即可线上完成产品认购</span></span>
                                            </li>
                                            <li>
                                                <img src={icon3} alt="" />
                                                <span style={{ fontSize: '22px', marginTop: '5%', display: 'block' }}>销售工具</span>
                                                <span><span>提供全套交易销售支持服务</span></span>
                                            </li>
                                        </ul>
                                        <ul className="scaleLi">
                                            <li>
                                                <img src={icon4} alt="" />
                                                <span style={{ fontSize: '22px', marginTop: '5%', display: 'block' }}>流量导入</span>
                                                <span><span>一对一服务高净值客户，实现更佳销售业绩</span></span>
                                            </li>
                                            <li>
                                                <img src={icon5} alt="" />
                                                <span style={{ fontSize: '22px', marginTop: '5%', display: 'block' }}>线下支持 </span>
                                                <span><span>可获得覆盖纽约、香港、及国内一二线城市全网点的线下服务支持</span></span>
                                            </li>
                                            <li>
                                                <img src={icon6} alt="" />
                                                <span style={{ fontSize: '22px', marginTop: '5%', display: 'block' }}>成长计划</span>
                                                <span><span>提供线上线下定期培训及讲座，国际理财师认证服务</span></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Section>
                        <Section className={style.page4}>
                            <div>
                                <div className={style.front}>
                                    <div className={style.title}> 
                                        <h1>自研平台</h1>
                                        <h2>财联邦PC端与移动端，提供培训、售前、售中、售后、业绩统计一站式服务</h2>
                                    </div>
                                    <div className={style.selfHelp}>
                                        <img src={img7}/>
                                        <div className={style.det}>
                                            <div>
                                                <span>产品智能对比</span>
                                                <span>投资计划预约</span>
                                            </div>
                                            <div>
                                                <span>客户签单预约</span>
                                                <span>在线服务预约</span>
                                            </div>
                                            <div>
                                                <span>团队成员管理</span>
                                                <span>业绩分析结算</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>
                        <Section className={style.page5}>
                            <div>
                                <div className={style.proTop}>
                                    <div className={style.title}>
                                        <h1 style={{color:'#000'}}>产品覆盖</h1>
                                        <h2 style={{color:'#000'}}>美信联邦可以提供全资产类别对接和交易服务，满足客户对产品多样化的需求</h2>
                                    </div>
                                    <div className={style.product}>
                                        <div>
                                            <ul >
                                                <li><img src={icon18}/></li>
                                                <li><img src={icon23}/><span>传统投资工具</span></li>
                                                <li>
                                                    <ul className={style.pro}>
                                                        <li>1．美元储蓄</li>
                                                        <li>2．保险</li>
                                                        <li>3．债券</li>
                                                        <li>4．共同基金（Mutual Fund)</li>
                                                        <li>5．ETF</li>
                                                        <li>6．股票</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                            <ul>
                                                <li><img src={icon19}/></li>
                                                <li><img src={icon22}/><span>另类投资工具</span></li>
                                                <li>
                                                    <ul className={style.pro}>
                                                        <li>1．房地产</li>
                                                        <li>2．对冲基金（Hedge Fund)</li>
                                                        <li>3．私募股权</li>
                                                        <li>4．FOF</li>
                                                        <li>5．管理期货</li>
                                                        <li>6．保单贴现</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                            <ul>
                                                <li><img src={icon20}/></li>
                                                <li><img src={icon21}/><span>消费升级</span></li>
                                                <li>
                                                    <ul className={style.pro}>
                                                        <li>1．海外医疗</li>
                                                        <li>2．海外留学</li>
                                                        <li>3．移民规划</li>
                                                        <li>4．家族信托</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>
                        <Section className={style.page6}>
                            <div>
                                <div className={style.frontW}>
                                    <div className={style.title}>
                                        <h1 style={{color:'#000'}}>股东背景</h1>
                                    </div>
                                    <div className={style.bg}>
                                        <div>
                                            <ul >
                                                <li><img src={icon27}/></li>
                                                <li>
                                                    KIP 韩投伙伴是韩国最顶级的风险股东背景，唯一连续13年保持A+级的<br/>创投机构，其已经在全球范围投资超过600家企业，其中已有100多家公司<br />成功上市。
                                                </li>
                                            </ul>
                                            <ul>
                                                <li><img src={icon28}/></li>
                                                <li>
                                                    同方证券有限公司为一家获核准从事证券及期货条例中第1类、第4类、<br />第6 类及第9类。在境外的金融业务平台，通过组合基金投资、跨境并购、<br />融资服务、财富管理等服务。
                                                </li>
                                            </ul>
                                            <ul>
                                                <li><img src={icon29}/></li>
                                                <li>
                                                    BAI贝塔斯曼亚洲投资基金旗下管理的资金数额超过10亿美元。年收入总<br />和超20亿美金。 BAI坚持走精品投资路线，依托国际传媒巨头，资源网络<br />遍布全球。国内投资对象包括凤凰网、摩拜、拉勾网、豆瓣、Ucloud等。
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.frontB}>
                                    <ul>
                                        <li><img src={icon12}/>客服热线：0755 - 22933374      00852-38959800</li>
                                        <li><img src={icon13}/>公司地址：  香港尖沙咀海港城永明金融大厦703-4</li>
                                        <li><img src={icon14}/>加盟合作：BD@ff-ftc.hk</li>
                                        <li><img src={icon11}/>招聘邮箱：HR@ff-ftc.hk</li>
                                        <li style={{color:'#9f9f9f'}}>财联邦科技有限公司2017版权所有  粤ICP备14099949号</li>
                                        <li className={style.wx} style={{right:'0px'}}>
                                            <img src={img9} />
                                            <p>客户微信服务号</p>
                                        </li>
                                        <li className={style.wx} style={{right:'130px',marginRight:'25px'}}>
                                            <img src={img8} />
                                            <p>理财师微信服务号</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Section>
                    </SectionsContainer>
                </div>
            </div>
        );
    }
}

export default (homePage);
