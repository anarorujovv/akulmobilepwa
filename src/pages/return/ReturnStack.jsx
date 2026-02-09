import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReturnList from './ReturnList';
import ReturnManage from './ReturnManage';

const ReturnStack = () => {
  return (
    <Routes>
      <Route path="/" element={<ReturnList />} />
      <Route path="/return-manage" element={<ReturnManage />} />
    </Routes>
  );
};

export default ReturnStack;