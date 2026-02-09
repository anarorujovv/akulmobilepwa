import React from 'react';
import { ProductGlobalProvider } from '../../shared/data/ProductGlobalState';
import ProductManage from './ProductManage';

const ProductManageProvider = ({ route, navigation }) => {
  return (
    <ProductGlobalProvider>
      <ProductManage route={route} navigation={navigation} />
    </ProductGlobalProvider>
  )
}

export default ProductManageProvider;