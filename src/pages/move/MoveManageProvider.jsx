import React from 'react';
import { MoveGlobalProvider } from '../../shared/data/MoveGlobalState';
import MoveManage from './MoveManage';

const MoveManageProvider = ({ route, navigation }) => {
    return (
        <MoveGlobalProvider>
            <MoveManage route={route} navigation={navigation} />
        </MoveGlobalProvider>
    )
}

export default MoveManageProvider;