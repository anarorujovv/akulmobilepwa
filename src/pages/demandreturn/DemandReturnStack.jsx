import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DemandReturnList from './DemandReturnList';
import DemandReturnManageProvider from './DemandReturnManageProvider';
import PositionManage from './../../shared/ui/PositionManage';
import DocumentProductList from './../../shared/ui/DocumentProductList';
import ProductScanner from './../product/ProductScanner';
import PaymentManageProvider from './../payment/PaymentManageProvider';

const DemandReturnStack = () => {
    return (
        <Routes>
            <Route path="/" element={<DemandReturnList />} />
            <Route path="/demand-return-manage" element={<DemandReturnManageProvider />} />
            <Route path="/product-position" element={<PositionManage />} />
            <Route path="/product-list" element={<DocumentProductList />} />
            <Route path="/product-scanner" element={<ProductScanner />} />
            <Route path="/payment" element={<PaymentManageProvider />} />
        </Routes>
    );
};

export default DemandReturnStack;