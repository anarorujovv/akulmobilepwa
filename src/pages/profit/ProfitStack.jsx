import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profit from './Profit';

const ProfitStack = () => {
    return (
        <Routes>
            <Route path="/" element={<Profit />} />
        </Routes>
    );
};

export default ProfitStack;
