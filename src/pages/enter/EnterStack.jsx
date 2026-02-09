import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EnterList from './EnterList';
import EnterManageProvider from './EnterManageProvider';
import DocumentProductList from './../../shared/ui/DocumentProductList';
import PositionManage from './../../shared/ui/PositionManage';
import ProductScanner from '../product/ProductScanner';

const EnterStack = () => {
    return (
        <Routes>
            <Route path="/" element={<EnterList />} />
            <Route path="/enter-manage" element={<EnterManageProvider />} />
            <Route path="/product-position" element={<PositionManage />} />
            <Route path="/product-list" element={<DocumentProductList />} />
            <Route path="/product-scanner" element={<ProductScanner />} />
        </Routes>
    );
};

export default EnterStack;