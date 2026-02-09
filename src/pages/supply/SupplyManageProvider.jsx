import React from 'react';
import { SupplyGlobalProvider } from '../../shared/data/SupplyGlobalState';
import SupplyManage from './SupplyManage';

const SupplyManageProvider = ({ route, navigation }) => {
    return (
        <SupplyGlobalProvider>
            <SupplyManage route={route} navigation={navigation} />
        </SupplyGlobalProvider>
    )
}


export default SupplyManageProvider;