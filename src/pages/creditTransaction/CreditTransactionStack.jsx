import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreditTransactionList from './CreditTransactionList';

const CreditTransactionStack = () => {
    return (
        <Routes>
            <Route path="/" element={<CreditTransactionList />} />
        </Routes>
    );
};

export default CreditTransactionStack;