/*
 * show 我的课程
 * @author:zhouting
 * @version:20170510
 */
import React from 'react';
import {Row,Col,Button,Icon} from 'antd';
import { connect } from 'dva';
import styles from '../../styles/portal.css';
import class03 from '../../styles/images/portal/class03.png';
import { fetchMyCourse } from '../../services/course';
import TipModal from '../common/modal/Modal';
import moment from 'moment';

class Course extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            courseList: [],
        }
    }
    componentWillMount() {
        const body = {
            page: 1,
            pagesize: 3,
            orderBy: '3',
        };
        fetchMyCourse(body).then((courseData) => {
            if (courseData.success) {
                this.setState({courseList: courseData.rows,});
            } else {
                TipModal.error({content:courseData.message});
            }
        });
    }
    render() {
        return(
            <Row>
                <Col>
                <div className={styles.course}>
                    <Row>
                        <Col span={6} className={styles.courseL}>
                            <div className={styles.lf} style={{width:'290px',height:'367px',backgroundImage:'url('+class03+')'}}>
                                {/* <img src={class03} /> */}
                                <h2> 我的课程</h2>
                                <h4>My Course</h4>
                            </div>
                        </Col>
                        <Col span={18}>
                            <div className={styles.lf} style={{ textAlign: 'center', width: '98%'}}>
                                <ul className={styles.list}>
                                    {
                                        this.state.courseList.map((course, index) => {
                                            if (index == 0 || index == 1 || index == 2) {
                                                return (
                                                    <li key={index}>
                                                        <span onClick={()=>window.location.hash = '/classroom/trainingCourseDetail/'+course.courseId}>
                                                            <span className={styles.lf}>{course.topic}</span>
                                                            <span className={styles.rt}>{course.courseDate.substr(0,16)}</span>
                                                        </span>
                                                    </li>
                                                )
                                            }
                                        })
                                    }
                                </ul>
                              {
                                this.state.courseList.length === 0 &&
                                <div style={{textAlign:'center',color:'rgb(156, 156, 156)',fontSize:'12px',marginBottom:'20px'}}><Icon type="frown-o" /> 暂无未开始课程</div>
                              }
                              {
                                this.state.courseList.length > 0 &&
                                <Button onClick={()=>window.location.hash = '/portal/myCourse'} type='primary'
                                        style={{background:'#ccb57e',fontWeight:'normal',fontSize:'22px',width:'180px',height:'44px',marginTop:'6px'}}>
                                  查看更多<Icon type="double-right" />
                                </Button>
                              }
                              {
                                this.state.courseList.length === 0 &&
                                <Button onClick={()=>window.location.hash = '/classroom/course'} type='primary'
                                        style={{background:'#ccb57e',fontWeight:'normal',fontSize:'22px',width:'180px',height:'44px',marginTop:'6px'}}>
                                  去报名
                                </Button>
                              }

                            </div>
                        </Col>
                    </Row>
                </div>
                </Col>
            </Row>
        )
    }
}
export default connect()(Course);
