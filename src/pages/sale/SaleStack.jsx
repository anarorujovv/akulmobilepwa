import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SaleManage from './SaleManage';
import SaleList from './SaleList';
import Filter from '../../shared/ui/Filter';

const SaleStack = () => {

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade'
      }}
    >
      <Stack.Screen name="sale-list" component={SaleList} />

      <Stack.Screen name="sale-manage" component={SaleManage} />
    </Stack.Navigator>
  )
}

export default SaleStack