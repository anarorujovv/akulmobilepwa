import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductTransactionsList from './ProductTransactionsList';
import ProductTransactionsManage from './ProductTransactionsManage';

const ProductTransactionsStack = () => {
    return (
        <Routes>
            <Route path="/" element={<ProductTransactionsList />} />
            <Route path="/product-transactions-manage" element={<ProductTransactionsManage />} />
        </Routes>
    );
};

export default ProductTransactionsStack;