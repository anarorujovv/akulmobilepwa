import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentList from './PaymentList';
import PaymentManageProvider from './PaymentManageProvider';

const PaymentStack = () => {
    return (
        <Routes>
            <Route path="/" element={<PaymentList />} />
            <Route path="/payment-manage" element={<PaymentManageProvider />} />
        </Routes>
    );
};

export default PaymentStack;