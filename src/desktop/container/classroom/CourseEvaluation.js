/*
 * show 课程评价
 * @author:zhouting
 * @version:20170526
 */
import React from 'react';
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import CourseEvaluationComponent from '../../components/classroom/CourseEvaluation';

class CourseEvaluation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        courseId: this.props.params.courseId,
      },
    };
  }

  render() {
    const { params } = this.state;
    return (
      <ProtalLayout location={location}>
        <CourseEvaluationComponent itemId={params.courseId} />
      </ProtalLayout>
    );
  }
}

export default connect()(CourseEvaluation);
