import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DebtList from './DebtList';
import DebtManageProvider from './DebtManageProvider';

const DebtStack = () => {
    return (
        <Routes>
            <Route path="/" element={<DebtList />} />
            <Route path="/debt-manage" element={<DebtManageProvider />} />
            <Route path="/debt-manage/:id" element={<DebtManageProvider />} />
        </Routes>
    );
};

export default DebtStack;