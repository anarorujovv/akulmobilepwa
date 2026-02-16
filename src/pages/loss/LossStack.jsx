import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LossList from './LossList';
import LossManageProvider from './LossManageProvider';

const LossStack = () => {
    return (
        <Routes>
            <Route path="/" element={<LossList />} />
            <Route path="/loss-manage" element={<LossManageProvider />} />
            <Route path="/loss-manage/:id" element={<LossManageProvider />} />
        </Routes>
    );
};

export default LossStack;