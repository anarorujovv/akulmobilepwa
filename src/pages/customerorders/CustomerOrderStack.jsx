import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerOrderList from './CustomerOrderList';
import CustomerOrderManageProvider from './CustomerOrderManageProvider';
import ProductScanner from '../product/ProductScanner';
import PaymentManageProvider from '../payment/PaymentManageProvider';

const CustomerOrderStack = () => {
    return (
        <Routes>
            <Route path="/" element={<CustomerOrderList />} />
            <Route path="/customer-order-manage" element={<CustomerOrderManageProvider />} />
            <Route path="/customer-order-manage/:id" element={<CustomerOrderManageProvider />} />
            <Route path="/product-scanner" element={<ProductScanner />} />
            <Route path="/payment" element={<PaymentManageProvider />} />
        </Routes>
    );
};

export default CustomerOrderStack;