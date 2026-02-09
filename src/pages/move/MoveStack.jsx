import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MoveList from './MoveList';
import MoveManageProvider from './MoveManageProvider';
import PositionManage from './../../shared/ui/PositionManage';
import DocumentProductList from './../../shared/ui/DocumentProductList';

const MoveStack = () => {
    return (
        <Routes>
            <Route path="/" element={<MoveList />} />
            <Route path="/move-manage" element={<MoveManageProvider />} />
            <Route path="/product-position" element={<PositionManage />} />
            <Route path="/product-list" element={<DocumentProductList />} />
        </Routes>
    );
};

export default MoveStack;