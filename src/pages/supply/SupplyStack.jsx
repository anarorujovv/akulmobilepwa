import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SupplyList from './SupplyList';
import SupplyManageProvider from './SupplyManageProvider';
import PositionManage from './../../shared/ui/PositionManage';
import DocumentProductList from './../../shared/ui/DocumentProductList';
import ProductScanner from './../product/ProductScanner';
import PaymentManageProvider from './../payment/PaymentManageProvider';
import SupplyReturnManageProvider from './../supplyreturn/SupplyReturnManageProvider';

const SupplyStack = () => {
    return (
        <Routes>
            <Route path="/" element={<SupplyList />} />
            <Route path="/supply-manage" element={<SupplyManageProvider />} />
            <Route path="/product-position" element={<PositionManage />} />
            <Route path="/product-list" element={<DocumentProductList />} />
            <Route path="/product-scanner" element={<ProductScanner />} />
            <Route path="/payment" element={<PaymentManageProvider />} />
            <Route path="/return" element={<SupplyReturnManageProvider />} />
        </Routes>
    );
};

export default SupplyStack;