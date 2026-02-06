import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ReturnList from './ReturnList';
import ReturnManage from './ReturnManage';
import Filter from '../../shared/ui/Filter';

const ReturnStack = () => {

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade'
      }}
    >
        
      <Stack.Screen name="return-list" component={ReturnList} />
      <Stack.Screen name="return-manage" component={ReturnManage} />
    </Stack.Navigator>
  )
}

export default ReturnStack