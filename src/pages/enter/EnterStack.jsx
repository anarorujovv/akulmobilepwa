import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EnterList from './EnterList';
import EnterManageProvider from './EnterManageProvider';
import ProductScanner from '../product/ProductScanner';

const EnterStack = () => {
    return (
        <Routes>
            <Route path="/" element={<EnterList />} />
            <Route path="/enter-manage" element={<EnterManageProvider />} />
            <Route path="/enter-manage/:id" element={<EnterManageProvider />} />
            <Route path="/product-scanner" element={<ProductScanner />} />
        </Routes>
    );
};

export default EnterStack;