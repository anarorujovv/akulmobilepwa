import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MoveList from './MoveList';
import MoveManageProvider from './MoveManageProvider';

const MoveStack = () => {
    return (
        <Routes>
            <Route path="/" element={<MoveList />} />
            <Route path="/move-manage" element={<MoveManageProvider />} />
            <Route path="/move-manage/:id" element={<MoveManageProvider />} />
        </Routes>
    );
};

export default MoveStack;