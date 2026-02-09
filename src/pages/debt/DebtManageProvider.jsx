import React from 'react';
import { DebtGlobalProvider } from '../../shared/data/DebtGlobalState';
import DebtManage from './DebtManage';

const DebtManageProvider = () => {
    return (
        <DebtGlobalProvider>
            <DebtManage />
        </DebtGlobalProvider>
    );
};

export default DebtManageProvider;