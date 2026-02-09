import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SpendItem from './SpendItem';
import SpendItemManage from './SpendItemManage';

const SpendItemStack = () => {
  return (
    <Routes>
      <Route path="/" element={<SpendItem />} />
      <Route path="/manage" element={<SpendItemManage />} />
    </Routes>
  );
};

export default SpendItemStack;