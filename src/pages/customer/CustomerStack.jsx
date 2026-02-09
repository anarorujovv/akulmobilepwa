import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerList from './CustomerList';
import CustomerManageProvider from './CustomerManageProvider';

const CustomerStack = () => {
    return (
        <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/customer-manage" element={<CustomerManageProvider />} />
        </Routes>
    );
};

export default CustomerStack;