import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SupplyList from './SupplyList';
import SupplyManageProvider from './SupplyManageProvider';
import ProductScanner from './../product/ProductScanner';
import PaymentManageProvider from './../payment/PaymentManageProvider';
import SupplyReturnManageProvider from './../supplyreturn/SupplyReturnManageProvider';

const SupplyStack = () => {
    return (
        <Routes>
            <Route path="/" element={<SupplyList />} />
            <Route path="/supply-manage" element={<SupplyManageProvider />} />
            <Route path="/supply-manage/:id" element={<SupplyManageProvider />} />
            <Route path="/product-scanner" element={<ProductScanner />} />
            <Route path="/payment" element={<PaymentManageProvider />} />
            <Route path="/return" element={<SupplyReturnManageProvider />} />
        </Routes>
    );
};

export default SupplyStack;