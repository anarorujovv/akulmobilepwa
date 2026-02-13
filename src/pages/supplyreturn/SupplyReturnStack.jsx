import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SupplyReturnList from './SupplyReturnList';
import SupplyReturnManageProvider from './SupplyReturnManageProvider';
import ProductScanner from './../product/ProductScanner';

const SupplyReturnStack = () => {
    return (
        <Routes>
            <Route path="/" element={<SupplyReturnList />} />
            <Route path="/supply-return-manage" element={<SupplyReturnManageProvider />} />
            <Route path="/supply-return-manage/:id" element={<SupplyReturnManageProvider />} />
            <Route path="/product-scanner" element={<ProductScanner />} />
        </Routes>
    );
};

export default SupplyReturnStack;