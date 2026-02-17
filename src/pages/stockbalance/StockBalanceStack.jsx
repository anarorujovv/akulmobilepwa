import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StockBalanceList from './StockBalanceList';
import StockBalanceManage from './StockBalanceManage';
import ProductScanner from './../product/ProductScanner';

const StockBalanceStack = () => {
    return (
        <Routes>
            <Route path="/" element={<StockBalanceList />} />
            <Route path="/stock-manage" element={<StockBalanceManage />} />
            <Route path="/stock-manage/:id" element={<StockBalanceManage />} />
            <Route path="/product-scanner" element={<ProductScanner />} />
        </Routes>
    );
};

export default StockBalanceStack;