/**
 * Məhsul İdarəetmə Provider Komponenti
 * 
 * @component ProductManageProvider
 * @param {Object} props - Komponent parametrləri
 * @param {Object} props.route - React Navigation route obyekti
 * @param {Object} props.navigation - React Navigation navigation obyekti
 * 
 * @description
 * Bu komponent məhsul idarəetmə komponenti üçün qlobal vəziyyət təminatçısı rolunu oynayır.
 * ProductGlobalProvider vasitəsilə məhsul məlumatlarını alt komponentlərə ötürür.
 */

import { StyleSheet } from 'react-native'
import React from 'react'
import { ProductGlobalProvider } from '../../shared/data/ProductGlobalState';
import ProductManage from './ProductManage';

const ProductManageProvider = ({ route, navigation }) => {
  return (
    <ProductGlobalProvider>
      <ProductManage route={route} navigation={navigation}  />
    </ProductGlobalProvider>
  )
}

export default ProductManageProvider

const styles = StyleSheet.create({})