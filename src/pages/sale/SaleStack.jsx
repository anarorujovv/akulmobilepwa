import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SaleList from './SaleList';
import SaleManage from './SaleManage';

const SaleStack = () => {
  return (
    <Routes>
      <Route path="/" element={<SaleList />} />
      <Route path="/sale-manage" element={<SaleManage />} />
    </Routes>
  );
};

export default SaleStack;