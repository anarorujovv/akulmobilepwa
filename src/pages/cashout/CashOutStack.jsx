import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CashOutList from './CashOutList';

const CashOutStack = () => {
    return (
        <Routes>
            <Route path="/" element={<CashOutList />} />
        </Routes>
    );
};

export default CashOutStack;
