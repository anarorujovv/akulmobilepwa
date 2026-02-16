import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InventoryList from './InventoryList';
import InventoryManageProvider from './InventoryManageProvider';

const InventoryStack = () => {
    return (
        <Routes>
            <Route path="/" element={<InventoryList />} />
            <Route path="/inventory-manage" element={<InventoryManageProvider />} />
            <Route path="/inventory-manage/:id" element={<InventoryManageProvider />} />
        </Routes>
    );
};

export default InventoryStack;