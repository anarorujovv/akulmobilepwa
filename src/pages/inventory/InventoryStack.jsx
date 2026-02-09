import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InventoryList from './InventoryList';
import InventoryManageProvider from './InventoryManageProvider';
import DocumentProductList from './../../shared/ui/DocumentProductList';
import InventoryPositionManage from '../../shared/ui/InventoryPositionManage';

const InventoryStack = () => {
    return (
        <Routes>
            <Route path="/" element={<InventoryList />} />
            <Route path="/inventory-manage" element={<InventoryManageProvider />} />
            <Route path="/product-position" element={<InventoryPositionManage />} />
            <Route path="/product-list" element={<DocumentProductList />} />
        </Routes>
    );
};

export default InventoryStack;