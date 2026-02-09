import React from 'react';
import { CustomerGlobalProvider } from '../../shared/data/CustomerGlobalState';
import CustomerManage from './CustomerManage';

const CustomerManageProvider = () => {
    return (
        <CustomerGlobalProvider>
            <CustomerManage />
        </CustomerGlobalProvider>
    );
};

export default CustomerManageProvider;