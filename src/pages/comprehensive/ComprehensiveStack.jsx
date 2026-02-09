import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Comprehensive from './Comprehensive';

const ComprehensiveStack = () => {
    return (
        <Routes>
            <Route path="/" element={<Comprehensive />} />
        </Routes>
    );
};

export default ComprehensiveStack;
