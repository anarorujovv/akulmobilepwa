import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CashInList from './CashInList';

const CashInStack = () => {
    return (
        <Routes>
            <Route path="/" element={<CashInList />} />
        </Routes>
    );
};

export default CashInStack;
