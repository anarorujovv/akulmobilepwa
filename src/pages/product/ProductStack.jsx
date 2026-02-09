import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from './ProductList';
import ProductManageProvider from './ProductManageProvider';
import ProductScanner from './ProductScanner';

const ProductStack = () => {
    return (
        <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product-manage" element={<ProductManageProvider />} />
            <Route path="/product-scanner" element={<ProductScanner />} />
        </Routes>
    );
};

export default ProductStack;