import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CatalogList from './CatalogList';
import CatalogManageProvider from './CatalogManageProvider';
import PositionManage from './../../shared/ui/PositionManage';
import DocumentProductList from './../../shared/ui/DocumentProductList';
import ProductScanner from './../product/ProductScanner';

const CatalogStack = () => {
    return (
        <Routes>
            <Route path="/" element={<CatalogList />} />
            <Route path="/catalog-manage" element={<CatalogManageProvider />} />
            <Route path="/product-position" element={<PositionManage />} />
            <Route path="/product-list" element={<DocumentProductList />} />
            <Route path="/product-scanner" element={<ProductScanner />} />
        </Routes>
    );
};

export default CatalogStack;