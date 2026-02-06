import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Setting from './pages/Setting';
import SpendItemStack from './pages/spendItem/SpendItemStack';

let Stack = createNativeStackNavigator();

const SettingStack = () => {

  return (
    <Stack.Navigator screenOptions={{
      headerShown:false
    }}>
        <Stack.Screen name='setting'  component={Setting}/>
        <Stack.Screen name='spend-items' component={SpendItemStack}/>
    </Stack.Navigator>
  )
}

export default SettingStack

const styles = StyleSheet.create({})