import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerOrderList from './CustomerOrderList';
import CustomerOrderManageProvider from './CustomerOrderManageProvider';
import PositionManage from '../../shared/ui/PositionManage';
import DocumentProductList from '../../shared/ui/DocumentProductList';
import ProductScanner from '../product/ProductScanner';
import PaymentManageProvider from '../payment/PaymentManageProvider';

const CustomerOrderStack = () => {
    return (
        <Routes>
            <Route path="/" element={<CustomerOrderList />} />
            <Route path="/customer-order-manage" element={<CustomerOrderManageProvider />} />
            <Route path="/product-position" element={<PositionManage />} />
            <Route path="/product-list" element={<DocumentProductList />} />
            <Route path="/product-scanner" element={<ProductScanner />} />
            <Route path="/payment" element={<PaymentManageProvider />} />
        </Routes>
    );
};

export default CustomerOrderStack;