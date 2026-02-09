import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SaleReportList from './SaleReportList';
import SaleReportManage from './SaleReportManage';

const SaleReportStack = () => {
    return (
        <Routes>
            <Route path="/" element={<SaleReportList />} />
            <Route path="/sale-report-manage" element={<SaleReportManage />} />
        </Routes>
    );
};

export default SaleReportStack;