import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CashTransactionList from './CashTransactionList';
import CashTransactionManage from './CashTransactionManage';

const CashTransactionStack = () => {
    return (
        <Routes>
            <Route path="/" element={<CashTransactionList />} />
            <Route path="/cash-transaction-manage" element={<CashTransactionManage />} />
        </Routes>
    );
};

export default CashTransactionStack;