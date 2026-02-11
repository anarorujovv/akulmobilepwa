import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DemandList from './DemandList';
import DemandManageProvider from './DemandManageProvider';
import PositionManage from './../../shared/ui/PositionManage';
import DocumentProductList from './../../shared/ui/DocumentProductList';
import ProductScanner from './../product/ProductScanner';
import PaymentManageProvider from './../payment/PaymentManageProvider';
import DemandReturnManageProvider from './../demandreturn/DemandReturnManageProvider';
import Check from './Check';

const DemandStack = () => {
    return (
        <Routes>
            <Route path="/" element={<DemandList />} />
            <Route path="/demand-manage" element={<DemandManageProvider />} />
            <Route path="/demand-manage/:id" element={<DemandManageProvider />} />
            <Route path="/product-scanner" element={<ProductScanner />} />
            <Route path="/payment" element={<PaymentManageProvider />} />
            <Route path="/return" element={<DemandReturnManageProvider />} />
            <Route path="/check" element={<Check />} />
        </Routes>
    );
};

export default DemandStack;