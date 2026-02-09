import React from 'react';
import { CustomerOrderGlobalProvider } from '../../shared/data/CustomerOrderGlobalState';
import CustomerOrderManage from './CustomerOrderManage';

const CustomerOrderManageProvider = ({ route, navigation }) => {
  return (
    <CustomerOrderGlobalProvider>
      <CustomerOrderManage route={route} navigation={navigation} />
    </CustomerOrderGlobalProvider>
  )
}

export default CustomerOrderManageProvider;