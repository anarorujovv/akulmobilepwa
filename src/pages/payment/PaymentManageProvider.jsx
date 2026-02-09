import React from 'react';
import { PaymentGlobalProvider } from '../../shared/data/PaymentGlobalState';
import PaymentManage from './PaymentManage';

const PaymentManageProvider = () => {
  return (
    <PaymentGlobalProvider>
      <PaymentManage />
    </PaymentGlobalProvider>
  );
};

export default PaymentManageProvider;