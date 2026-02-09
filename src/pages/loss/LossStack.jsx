import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LossList from './LossList';
import LossManageProvider from './LossManageProvider';
import DocumentProductList from './../../shared/ui/DocumentProductList';
import PositionManage from './../../shared/ui/PositionManage';

const LossStack = () => {
    return (
        <Routes>
            <Route path="/" element={<LossList />} />
            <Route path="/loss-manage" element={<LossManageProvider />} />
            <Route path="/product-position" element={<PositionManage />} />
            <Route path="/product-list" element={<DocumentProductList />} />
        </Routes>
    );
};

export default LossStack;