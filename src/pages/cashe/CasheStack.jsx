import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CasheList from './CasheList';
import CasheManage from './CasheManage';
import CasheCreate from './CasheCreate';

const CasheStack = () => {
  return (
    <Routes>
      <Route path="/" element={<CasheList />} />
      <Route path="/cashe-manage" element={<CasheManage />} />
      <Route path="/cashe-create" element={<CasheCreate />} />
    </Routes>
  );
};

export default CasheStack;