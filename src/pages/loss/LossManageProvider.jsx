import React from 'react';
import { LossGlobalProvider } from '../../shared/data/LossGlobalState';
import LossManage from './LossManage';

const LossManageProvider = ({ route, navigation }) => {
  return (
    <LossGlobalProvider>
      <LossManage route={route} navigation={navigation} />
    </LossGlobalProvider>
  )
}

export default LossManageProvider;