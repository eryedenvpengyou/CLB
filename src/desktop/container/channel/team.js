import React from 'react';
import { connect } from 'dva';
import { Col, Layout } from 'antd';
import ProtalLayout from '../../components/layout/ProtalLayout';
import Team from '../../components/channel/Team';
import Banner from '../../components/channel/Banner';
import style from '../../styles/channelTeam.css';

const team = ({ location, channel, dispatch }) => {
  return (
    <ProtalLayout location={location}>
        <Team channel={channel} dispatch={dispatch} />
    </ProtalLayout>
  );
};

export default connect(({ channel }) => ({ channel }))(team);
