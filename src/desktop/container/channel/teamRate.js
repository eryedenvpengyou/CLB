import React from 'react';
import { connect } from 'dva';
import ProtalLayout from '../../components/layout/ProtalLayout';
import TeamRate from '../../components/channel/TeamRate';
import * as styles from '../../styles/qa.css';

const teamRate = ({ location, channel, dispatch, params }) => {
  const user = JSON.parse(localStorage.user);
  return (
    <ProtalLayout location={location}>
      <div className={styles.main}>
        <TeamRate
          channel={channel}
          dispatch={dispatch}
          channelId={params.id !== null && params.id !== undefined ?
             params.id : user.relatedPartyId}
          userName={params.userName}
          channelName={params.channelName ? params.channelName : ''}
          parentPartyId={params.parentPartyId}
          parentPartyType={params.parentPartyType}
        />
      </div>
    </ProtalLayout>
  );
};

export default connect(({ channel }) => ({ channel }))(teamRate);
