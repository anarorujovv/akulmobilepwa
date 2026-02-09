import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ExpeditorList from './ExpeditorList';
import ExpeditorManage from './ExpeditorManage';
import CasheManage from './../cashe/CasheManage';

const ExpeditorStack = () => {
    return (
        <Routes>
            <Route path="/" element={<ExpeditorList />} />
            <Route path="/expeditor-manage" element={<ExpeditorManage />} />
            <Route path="/cashe-manage" element={<CasheManage />} />
        </Routes>
    );
};

export default ExpeditorStack;