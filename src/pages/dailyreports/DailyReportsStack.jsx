import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DailyReports from './DailyReports';

const DailyReportsStack = () => {
    return (
        <Routes>
            <Route path="/" element={<DailyReports />} />
        </Routes>
    );
};

export default DailyReportsStack;
