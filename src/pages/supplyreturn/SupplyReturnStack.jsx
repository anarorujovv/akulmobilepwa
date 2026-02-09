import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SupplyReturnList from './SupplyReturnList';
import SupplyReturnManageProvider from './SupplyReturnManageProvider';
import PositionManage from './../../shared/ui/PositionManage';
import DocumentProductList from './../../shared/ui/DocumentProductList';
import ProductScanner from './../product/ProductScanner';

const SupplyReturnStack = () => {
    return (
        <Routes>
            <Route path="/" element={<SupplyReturnList />} />
            <Route path="/supply-return-manage" element={<SupplyReturnManageProvider />} />
            <Route path="/product-position" element={<PositionManage />} />
            <Route path="/product-list" element={<DocumentProductList />} />
            <Route path="/product-scanner" element={<ProductScanner />} />
        </Routes>
    );
};

export default SupplyReturnStack;