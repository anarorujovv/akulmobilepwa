import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Setting from './pages/Setting';
import SpendItemStack from './pages/spendItem/SpendItemStack';

const SettingStack = () => {
  return (
    <Routes>
      <Route path="/" element={<Setting />} />
      <Route path="/spend-items/*" element={<SpendItemStack />} />
    </Routes>
  );
};

export default SettingStack;