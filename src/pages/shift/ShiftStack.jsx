import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ShiftList from './ShiftList';
import ShiftManage from './ShiftManage';

const ShiftStack = () => {
    return (
        <Routes>
            <Route path="/" element={<ShiftList />} />
            <Route path="/shift-manage" element={<ShiftManage />} />
        </Routes>
    );
};

export default ShiftStack;