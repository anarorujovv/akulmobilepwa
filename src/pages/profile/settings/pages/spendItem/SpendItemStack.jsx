import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SpendItem from './SpendItem';
import SpendItemManage from './SpendItemManage';

let Stack = createNativeStackNavigator();

const SpendItemStack = () => {
  
  return (
    <Stack.Navigator screenOptions={{
      headerShown:false
    }}>
      <Stack.Screen name='spendItem' component={SpendItem}/>      
      <Stack.Screen name='spendItemManage' component={SpendItemManage}/>
    </Stack.Navigator>
  )
}

export default SpendItemStack

const styles = StyleSheet.create({})